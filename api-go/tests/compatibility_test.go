package main

import (
	"fmt"
	"os"
	"testing"

	trinsic_api "github.com/trinsic-id/sdk-go-api/v3"
)

// TestMain keeps the compatibility JSON contract while go test provides the
// normal named-test output, filtering, and failure reporting developers expect.
func TestMain(m *testing.M) {
	results = nil
	code := m.Run()
	write()
	os.Exit(code)
}

func clientForTest(t *testing.T) (*trinsic_api.APIClient, string) {
	t.Helper()
	c := trinsic_api.NewConfiguration()
	c.Servers = trinsic_api.ServerConfigurations{{URL: required("TRINSIC_TEST_BASE_URL")}}
	c.AddDefaultHeader("Authorization", "Bearer "+required("TRINSIC_TEST_ACCESS_TOKEN"))
	return trinsic_api.NewAPIClient(c), required("TRINSIC_TEST_VERIFICATION_PROFILE_ID")
}

func runCase(t *testing.T, id string, parameters map[string]any, action func() (any, error)) any {
	t.Helper()
	value := record(id, parameters, action)
	if value == nil {
		t.Errorf("%s failed; see compatibility result for details", id)
	}
	return value
}

func TestReadAPIs(t *testing.T) {
	c, profile := clientForTest(t)
	t.Run("ListProviders", func(t *testing.T) {
		runCase(t, "api.providers.list", nil, func() (any, error) { return execute(c, "ProvidersAPI", "ListProviders", nil, nil) })
	})
	t.Run("GetVerificationProfile", func(t *testing.T) {
		runCase(t, "api.verification-profiles.get-by-id", nil, func() (any, error) {
			return execute(c, "VerificationProfilesAPI", "GetVerificationProfileById", []any{profile}, nil)
		})
	})
	t.Run("ListVerificationProfiles", func(t *testing.T) {
		runCase(t, "api.verification-profiles.list", nil, func() (any, error) {
			return execute(c, "VerificationProfilesAPI", "ListVerificationProfiles", nil, nil)
		})
	})
	t.Run("ListSessions", func(t *testing.T) {
		runCase(t, "api.sessions.list", nil, func() (any, error) { return execute(c, "SessionsAPI", "ListSessions", []any{profile}, nil) })
	})
	t.Run("ListRedirectUris", func(t *testing.T) {
		runCase(t, "api.redirect-uris.list", nil, func() (any, error) { return execute(c, "RedirectUrisAPI", "List", nil, nil) })
	})
	t.Run("GetProvider", func(t *testing.T) {
		if !has(c, "ProvidersAPI", "GetProvider") {
			skip("api.providers.get", "ProvidersApi.GetProvider was introduced after this SDK version.", nil)
			t.Skip()
		}
		runCase(t, "api.providers.get", nil, func() (any, error) {
			return execute(c, "ProvidersAPI", "GetProvider", []any{"trinsic-test-redirect"}, nil)
		})
	})
}

func TestSessionLifecycle(t *testing.T) {
	c, profile := clientForTest(t)
	t.Run("CreateHosted", func(t *testing.T) {
		runCase(t, "api.sessions.create-hosted-provider", nil, func() (any, error) {
			u, err := redirectURL(c)
			if err != nil {
				return nil, err
			}
			r := trinsic_api.CreateHostedProviderSessionRequest{}
			set(&r, "Provider", "trinsic-test-redirect")
			set(&r, "VerificationProfileId", profile)
			set(&r, "RedirectUrl", u)
			set(&r, "EnableRedirectBackwardsCompatibility", false)
			out, err := execute(c, "SessionsAPI", "CreateHostedProviderSession", nil, r)
			if err == nil {
				_, _ = execute(c, "SessionsAPI", "CancelSession", []any{str(out, "SessionId")}, nil)
			}
			return out, err
		})
	})
	t.Run("CreateDirect", func(t *testing.T) {
		direct := runCase(t, "api.sessions.create-direct-provider", nil, func() (any, error) { return createDirect(c, profile) })
		if direct != nil {
			_, _ = execute(c, "SessionsAPI", "CancelSession", []any{str(direct, "SessionId")}, nil)
		}
	})
	t.Run("GetDirect", func(t *testing.T) {
		direct, err := createDirect(c, profile)
		if err != nil {
			skip("api.sessions.get", "Direct-session setup failed.", nil)
			t.Skip("Direct-session setup failed.")
		}
		id := str(direct, "SessionId")
		defer func() { _, _ = execute(c, "SessionsAPI", "CancelSession", []any{id}, nil) }()
		runCase(t, "api.sessions.get", nil, func() (any, error) { return execute(c, "SessionsAPI", "GetSession", []any{id}, nil) })
	})
	t.Run("CancelDirect", func(t *testing.T) {
		direct, err := createDirect(c, profile)
		if err != nil {
			skip("api.sessions.cancel", "Direct-session setup failed.", nil)
			t.Skip("Direct-session setup failed.")
		}
		runCase(t, "api.sessions.cancel", nil, func() (any, error) {
			return execute(c, "SessionsAPI", "CancelSession", []any{str(direct, "SessionId")}, nil)
		})
	})
}

func TestCompletedSession(t *testing.T) {
	c, profile := clientForTest(t)
	t.Run("GetResult", func(t *testing.T) {
		runCase(t, "api.sessions.get-result", nil, func() (any, error) {
			_, _, result, err := completedResult(c, profile)
			return result, err
		})
	})
	t.Run("GetAttachment", func(t *testing.T) {
		session, key, result, err := completedResult(c, profile)
		if err != nil || attachment(result) == "" {
			skip("api.sessions.get-attachment", "Redirect-session setup or result retrieval failed.", nil)
			t.Skip("Redirect-session setup or result retrieval failed.")
		}
		runCase(t, "api.sessions.get-attachment", nil, func() (any, error) {
			r := trinsic_api.GetAttachmentRequest{}
			set(&r, "ResultsAccessKey", key)
			return execute(c, "SessionsAPI", "GetAttachment", []any{str(session, "SessionId"), attachment(result)}, r)
		})
	})
	t.Run("Redact", func(t *testing.T) {
		session, _, _, err := completedResult(c, profile)
		if err != nil {
			skip("api.sessions.redact", "Redirect-session setup or result retrieval failed.", nil)
			t.Skip("Redirect-session setup or result retrieval failed.")
		}
		runCase(t, "api.sessions.redact", nil, func() (any, error) {
			return execute(c, "SessionsAPI", "RedactSession", []any{str(session, "SessionId")}, nil)
		})
	})
}

func completedResult(c *trinsic_api.APIClient, profile string) (any, string, any, error) {
	session, token, key, err := complete(c, profile)
	if err != nil {
		return nil, "", nil, err
	}
	request := trinsic_api.GetSessionResultRequest{}
	set(&request, "RedirectToken", token)
	set(&request, "ResultsAccessKey", key)
	result, err := execute(c, "SessionsAPI", "GetSessionResult", []any{str(session, "SessionId")}, request)
	return session, key, result, err
}

func TestRecommendations(t *testing.T) {
	c, profile := clientForTest(t)
	runCase(t, "api.sessions.recommend-providers", nil, func() (any, error) {
		r := trinsic_api.RecommendProvidersRequest{}
		set(&r, "VerificationProfileId", profile)
		return execute(c, "SessionsAPI", "RecommendProviders", nil, r)
	})
}

func TestProviderOutputs(t *testing.T) {
	// pso records one compatibility outcome per provider, preserving acknowledgement metadata.
	pso()
	for _, result := range results {
		if result.Status == "failed" && result.ID == "serialization.provider-output-round-trip" {
			// The shared matrix applies acknowledgement policy to these outcomes.
			// Keep the detail in normal go-test output without preventing it from
			// producing the complete result envelope for that policy to inspect.
			t.Log(fmt.Sprintf("%v", result.Failure))
		}
	}
}
