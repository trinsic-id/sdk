package main

import (
	"encoding/json"
	"fmt"
	trinsic_api "github.com/trinsic-id/sdk-go-api/v3"
	"net/http"
	"net/url"
	"os"
	"reflect"
	"strings"
	"testing"
)

const harnessSessionJSON = `{"id":"00000000-0000-4000-8000-000000000001","done":false,"success":false,"created":1,"updated":1}`
const harnessProviderJSON = `{"id":"provider","name":"Provider","logoUrl":"https://example.test/logo","subtext":"Description","health":"Healthy",
	"regions":[],"countries":["US"],"subdivisions":[],
	"subProviders":[{"id":"sub","name":"Sub","subtext":"Description","logoUrl":"https://example.test/sub"}]}`

// Exercise the same captured-response comparison used by live SDK calls.
func harnessResponse(t *testing.T, raw string, decoded any) *http.Response {
	t.Helper()
	if err := json.Unmarshal([]byte(raw), decoded); err != nil {
		t.Fatal(err)
	}
	var wire any
	if err := json.Unmarshal([]byte(raw), &wire); err != nil {
		t.Fatal(err)
	}
	response := &http.Response{StatusCode: http.StatusOK}
	capturedWire[response] = wire
	t.Cleanup(func() { delete(capturedWire, response) })
	if _, err := sdkResult(decoded, response, nil); err != nil {
		t.Fatalf("unchanged SDK response failed: %v", err)
	}
	return response
}

func TestHarnessPublishedSessionPages(t *testing.T) {
	for _, count := range []int{0, 1} {
		t.Run(fmt.Sprintf("entries_%d", count), func(t *testing.T) {
			sessions := ""
			if count == 1 {
				sessions = harnessSessionJSON
			}
			var decoded trinsic_api.ListSessionsResponse
			harnessResponse(t, fmt.Sprintf(`{"sessions":[%s],"total":%d,"more":false,"futureField":"ignored"}`, sessions, count), &decoded)
		})
	}
	for _, mutation := range []string{"truncate", "id", "total", "more"} {
		t.Run(mutation, func(t *testing.T) {
			var decoded trinsic_api.ListSessionsResponse
			response := harnessResponse(t, `{"sessions":[`+harnessSessionJSON+`],"total":1,"more":false}`, &decoded)
			switch mutation {
			case "truncate":
				decoded.Sessions = decoded.Sessions[:0]
			case "id":
				decoded.Sessions[0].Id = "00000000-0000-4000-8000-000000000002"
			case "total":
				decoded.Total = 2
			case "more":
				decoded.More = true
			}
			if _, err := sdkResult(&decoded, response, nil); err == nil {
				t.Fatalf("changed %s passed the response comparison", mutation)
			}
		})
	}
}

func TestHarnessPublishedRecommendations(t *testing.T) {
	for _, field := range []string{"recommendedProviders", "remainder"} {
		for _, mutation := range []string{"unchanged", "provider", "country", "subprovider"} {
			t.Run(field+"/"+mutation, func(t *testing.T) {
				var decoded trinsic_api.RecommendProvidersResponse
				response := harnessResponse(t, `{"recommendedProviders":[`+harnessProviderJSON+`],"remainder":[`+harnessProviderJSON+`],"futureField":"ignored"}`, &decoded)
				providers := &decoded.RecommendedProviders
				if field == "remainder" {
					providers = &decoded.Remainder
				}
				switch mutation {
				case "unchanged":
					return
				case "provider":
					*providers = (*providers)[:0]
				case "country":
					(*providers)[0].Countries = []string{}
				case "subprovider":
					(*providers)[0].SubProviders[0].Name = "Changed"
				}
				if _, err := sdkResult(&decoded, response, nil); err == nil {
					t.Fatalf("changed %s in %s passed the response comparison", mutation, field)
				}
			})
		}
	}
}

func TestMain(m *testing.M) {
	code := m.Run()
	for id, client := range createdSessions {
		_, _, _ = client.SessionsAPI.CancelSession(ctx, id).Execute()
	}
	write()
	os.Exit(code)
}
func clientForTest(t *testing.T) (*trinsic_api.APIClient, string) {
	t.Helper()
	config := trinsic_api.NewConfiguration()
	config.Servers = trinsic_api.ServerConfigurations{{URL: required("TRINSIC_TEST_BASE_URL")}}
	config.HTTPClient = &http.Client{Transport: captureTransport{}}
	config.AddDefaultHeader("Authorization", "Bearer "+required("TRINSIC_TEST_ACCESS_TOKEN"))
	return trinsic_api.NewAPIClient(config), required("TRINSIC_TEST_VERIFICATION_PROFILE_ID")
}
func runCase(t *testing.T, id string, action func() (any, error)) {
	t.Helper()
	record(id, nil, func() (any, error) {
		value, err := action()
		if err == nil {
			err = assertAPI(id, value)
		}
		return value, err
	})
	results[len(results)-1].NativeTest = t.Name()
	if results[len(results)-1].Status == "failed" {
		t.Errorf("%s failed; see structured result", id)
	}
}
func TestReadAPIs(t *testing.T) {
	c, profile := clientForTest(t)
	runCase(t, "api.providers.list", func() (any, error) { return sdkResult(c.ProvidersAPI.ListProviders(ctx).Execute()) })
	runCase(t, "api.providers.get", func() (any, error) {
		return sdkResult(c.ProvidersAPI.GetProvider(ctx, "trinsic-test-redirect").Execute())
	})
	runCase(t, "api.verification-profiles.get-by-id", func() (any, error) {
		return sdkResult(c.VerificationProfilesAPI.GetVerificationProfileById(ctx, profile).Execute())
	})
	runCase(t, "api.verification-profiles.list", func() (any, error) {
		return sdkResult(c.VerificationProfilesAPI.ListVerificationProfiles(ctx).Execute())
	})
	runCase(t, "api.sessions.list", func() (any, error) {
		return sdkResult(c.SessionsAPI.ListSessions(ctx, profile).Page(1).PageSize(1).Execute())
	})
	runCase(t, "api.redirect-uris.list", func() (any, error) { return sdkResult(c.RedirectUrisAPI.List(ctx).Page(1).PageSize(1).Execute()) })
}
func TestSessionLifecycle(t *testing.T) {
	c, profile := clientForTest(t)
	runCase(t, "api.sessions.create-hosted-provider", func() (any, error) {
		redirect, err := redirectURL(c)
		if err != nil {
			return nil, err
		}
		request := trinsic_api.CreateHostedProviderSessionRequest{Provider: "trinsic-test-redirect", VerificationProfileId: profile, RedirectUrl: redirect}
		session, response, err := c.SessionsAPI.CreateHostedProviderSession(ctx).CreateHostedProviderSessionRequest(request).Execute()
		if err == nil {
			createdSessions[session.SessionId] = c
		}
		return sdkResult(session, response, err)
	})
	runCase(t, "api.sessions.create-direct-provider", func() (any, error) { return createDirect(c, profile) })
	runCase(t, "api.sessions.get", func() (any, error) {
		session, err := createDirect(c, profile)
		if err != nil {
			return nil, err
		}
		return sdkResult(c.SessionsAPI.GetSession(ctx, session.SessionId).Execute())
	})
	runCase(t, "api.sessions.cancel", func() (any, error) {
		session, err := createDirect(c, profile)
		if err != nil {
			return nil, err
		}
		return sdkResult(c.SessionsAPI.CancelSession(ctx, session.SessionId).Execute())
	})
}
func completedResult(c *trinsic_api.APIClient, profile string) (*trinsic_api.CreateDirectProviderSessionResponse, string, *trinsic_api.GetSessionResultResponse, error) {
	session, _, key, err := complete(c, profile)
	if err != nil {
		return nil, "", nil, err
	}
	result, response, err := c.SessionsAPI.GetSessionResult(ctx, session.SessionId).GetSessionResultRequest(trinsic_api.GetSessionResultRequest{ResultsAccessKey: key}).Execute()
	if err == nil {
		_, err = sdkResult(result, response, nil)
	}
	return session, key, result, err
}
func TestCompletedSession(t *testing.T) {
	c, profile := clientForTest(t)
	runCase(t, "api.sessions.get-result", func() (any, error) {
		_, _, result, err := completedResult(c, profile)
		return result, err
	})
	runCase(t, "api.sessions.get-attachment", func() (any, error) {
		session, key, result, err := completedResult(c, profile)
		if err != nil {
			return nil, err
		}
		identity := result.GetIdentityData()
		if len(identity.Attachments) == 0 {
			return nil, fmt.Errorf("Completed redirect session returned no attachment")
		}
		return sdkResult(c.SessionsAPI.GetAttachment(ctx, session.SessionId, identity.Attachments[0].Id).GetAttachmentRequest(trinsic_api.GetAttachmentRequest{ResultsAccessKey: key}).Execute())
	})
	runCase(t, "api.sessions.redact", func() (any, error) {
		session, _, _, err := complete(c, profile)
		if err != nil {
			return nil, err
		}
		_, err = c.SessionsAPI.RedactSession(ctx, session.SessionId).Execute()
		return true, err
	})
}
func TestRecommendations(t *testing.T) {
	c, profile := clientForTest(t)
	runCase(t, "api.sessions.recommend-providers", func() (any, error) {
		return sdkResult(c.SessionsAPI.RecommendProviders(ctx).RecommendProvidersRequest(trinsic_api.RecommendProvidersRequest{VerificationProfileId: profile}).Execute())
	})
}
func TestProviderOutputs(t *testing.T) {
	// pso records one compatibility outcome per provider, preserving provider and model details.
	first := len(results)
	pso()
	for index := first; index < len(results); index++ {
		results[index].NativeTest = t.Name()
	}
	for _, result := range results {
		if result.Status == "failed" && strings.HasPrefix(result.ID, "serialization.") {
			t.Errorf("%s: %v", result.ID, result.Failure)
		}
	}
}

func TestHarnessSemanticFailures(t *testing.T) {
	lastRequest = &http.Request{URL: &url.URL{Path: "/api/v1/sessions/expected"}}
	for id, body := range map[string]any{
		"api.sessions.get":            map[string]any{"session": map[string]any{"id": "wrong", "done": false, "success": false}},
		"api.sessions.get-attachment": map[string]any{"content": "", "contentType": "image/png"},
	} {
		if err := assertAPI(id, body); err == nil {
			t.Errorf("%s accepted invalid output", id)
		}
	}
	type Child struct {
		Name *string `json:"name,omitempty"`
	}
	type Parent struct {
		Child Child `json:"child"`
	}
	model := Parent{}
	wire := map[string]any{"child": map[string]any{"name": "Ada", "future": true}, "unknown": true}
	actual, err := modelFields(reflect.ValueOf(model), wire, true)
	if err != nil {
		t.Fatal(err)
	}
	expected, err := modelFields(reflect.ValueOf(model), wire, false)
	if err != nil {
		t.Fatal(err)
	}
	if err := compare(actual, expected, "model", true); err == nil {
		t.Fatal("dropped nested field passed")
	}
	for _, pair := range [][2]any{{true, float64(1)}, {false, float64(0)}, {[]any{}, map[string]any{}}, {[]any{}, []any{float64(1)}}} {
		if compare(pair[0], pair[1], "value", true) == nil {
			t.Fatal("invalid JSON values compared equal")
		}
	}
}
