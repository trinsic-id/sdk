package main

import (
	"fmt"
	trinsic_api "github.com/trinsic-id/sdk-go-api/v3"
	"os"
	"strings"
	"testing"
)

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
	config.AddDefaultHeader("Authorization", "Bearer "+required("TRINSIC_TEST_ACCESS_TOKEN"))
	return trinsic_api.NewAPIClient(config), required("TRINSIC_TEST_VERIFICATION_PROFILE_ID")
}
func runCase(t *testing.T, id string, action func() (any, error)) {
	t.Helper()
	record(id, nil, action)
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
	runCase(t, "api.sessions.list", func() (any, error) { return sdkResult(c.SessionsAPI.ListSessions(ctx, profile).Execute()) })
	runCase(t, "api.redirect-uris.list", func() (any, error) { return sdkResult(c.RedirectUrisAPI.List(ctx).Execute()) })
}
func TestSessionLifecycle(t *testing.T) {
	c, profile := clientForTest(t)
	runCase(t, "api.sessions.create-hosted-provider", func() (any, error) {
		redirect, err := redirectURL(c)
		if err != nil {
			return nil, err
		}
		request := trinsic_api.CreateHostedProviderSessionRequest{Provider: "trinsic-test-redirect", VerificationProfileId: profile, RedirectUrl: redirect}
		session, _, err := c.SessionsAPI.CreateHostedProviderSession(ctx).CreateHostedProviderSessionRequest(request).Execute()
		if err == nil {
			createdSessions[session.SessionId] = c
		}
		return session, err
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
	result, _, err := c.SessionsAPI.GetSessionResult(ctx, session.SessionId).GetSessionResultRequest(trinsic_api.GetSessionResultRequest{ResultsAccessKey: key}).Execute()
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
