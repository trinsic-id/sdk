package main

import (
	"context"
	"encoding/json"
	"fmt"
	trinsic_api "github.com/trinsic-id/sdk-go-api/v3"
	"net/http"
	"net/url"
	"os"
	"reflect"
	"strings"
	"time"
)

type testCase struct {
	ID         string         `json:"id"`
	Status     string         `json:"status"`
	DurationMs int64          `json:"durationMs"`
	Parameters map[string]any `json:"parameters,omitempty"`
	Failure    map[string]any `json:"failure,omitempty"`
	SkipReason string         `json:"skipReason,omitempty"`
	NativeTest string         `json:"nativeTest,omitempty"`
}

var results []testCase
var ctx = context.Background()
var createdSessions = map[string]*trinsic_api.APIClient{}

func createDirect(c *trinsic_api.APIClient, p string) (*trinsic_api.CreateDirectProviderSessionResponse, error) {
	u, e := redirectURL(c)
	if e != nil {
		return nil, e
	}
	r := trinsic_api.CreateDirectProviderSessionRequest{}
	r.Provider = "trinsic-test-redirect"
	r.VerificationProfileId = p
	r.RedirectUrl = *trinsic_api.NewNullableString(&u)
	r.Capabilities = []trinsic_api.IntegrationCapability{trinsic_api.INTEGRATIONCAPABILITY_LAUNCH_BROWSER, trinsic_api.INTEGRATIONCAPABILITY_CAPTURE_REDIRECT}
	fallback := false
	r.FallbackToHostedUI = *trinsic_api.NewNullableBool(&fallback)
	session, _, err := c.SessionsAPI.CreateDirectProviderSession(ctx).CreateDirectProviderSessionRequest(r).Execute()
	if err == nil {
		createdSessions[session.SessionId] = c
	}
	return session, err
}
func complete(c *trinsic_api.APIClient, p string) (*trinsic_api.CreateDirectProviderSessionResponse, string, string, error) {
	s, e := createDirect(c, p)
	if e != nil {
		return nil, "", "", e
	}
	b := browser{}
	first, e := b.fetch(s.NextStep.Content)
	if e != nil {
		return nil, "", "", e
	}
	integration, e := first.location()
	if e != nil {
		return nil, "", "", e
	}
	callback, e := url.Parse(query(integration, "redirectUrl"))
	if e != nil {
		return nil, "", "", e
	}
	q := callback.Query()
	q.Set("resultState", "success")
	callback.RawQuery = q.Encode()
	second, e := b.fetch(callback.String())
	if e != nil {
		return nil, "", "", e
	}
	verification, e := second.location()
	if e != nil {
		return nil, "", "", e
	}
	third, e := b.fetch(verification)
	if e != nil {
		return nil, "", "", e
	}
	done, e := third.location()
	if e != nil {
		return nil, "", "", e
	}
	fourth, e := b.fetch(done)
	if e != nil {
		return nil, "", "", e
	}
	app, e := fourth.location()
	if e != nil {
		return nil, "", "", e
	}
	return s, query(app, "redirectToken"), s.ResultCollection.ResultsAccessKey, nil
}

type response struct {
	u string
	r *http.Response
}
type browser struct{ cookie string }

func (b *browser) fetch(u string) (*response, error) {
	h := &http.Client{CheckRedirect: func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse }}
	q, e := http.NewRequest(http.MethodGet, u, nil)
	if e != nil {
		return nil, e
	}
	if b.cookie != "" {
		q.Header.Set("Cookie", b.cookie)
	}
	r, e := h.Do(q)
	if e != nil {
		return nil, e
	}
	defer r.Body.Close()
	cookies := []string{}
	for _, cookie := range r.Cookies() {
		cookies = append(cookies, cookie.Name+"="+cookie.Value)
	}
	if len(cookies) > 0 {
		b.cookie = strings.Join(cookies, "; ")
	}
	if r.StatusCode < 300 || r.StatusCode > 399 {
		return nil, fmt.Errorf("expected redirect from %s, got %d", u, r.StatusCode)
	}
	return &response{u, r}, nil
}
func (x *response) location() (string, error) {
	l := x.r.Header.Get("Location")
	if l == "" {
		return "", fmt.Errorf("redirect omitted Location")
	}
	b, _ := url.Parse(x.u)
	n, e := b.Parse(l)
	return n.String(), e
}
func query(u, k string) string {
	x, e := url.Parse(u)
	if e != nil {
		return ""
	}
	return x.Query().Get(k)
}
func pso() {
	cache := os.Getenv("SDK_COMPATIBILITY_PSO_FIXTURES_PATH")
	data, e := os.ReadFile(cache)
	if e != nil {
		skip("serialization.provider-output-round-trip", "No shared PSO fixture cache was available.", nil)
		return
	}
	var d map[string]any
	if json.Unmarshal(data, &d) != nil {
		skip("serialization.provider-output-round-trip", "No readable shared PSO fixture cache was available.", nil)
		return
	}
	for _, raw := range d["fixtures"].([]any) {
		f := raw.(map[string]any)
		caseID, synthetic := f["testCaseId"].(string)
		if !synthetic {
			caseID = "serialization.provider-output-round-trip"
		}
		name, _ := f["sdkModelName"].(string)
		params := map[string]any{"providerId": fmt.Sprint(f["providerId"])}
		if name != "" {
			params["sdkModelName"] = name
		}
		if f["hasPublicSdkModel"] != true {
			skip(caseID, "Provider has no public Swagger provider-specific output model.", params)
			continue
		}
		factory, ok := providerOutputFactories[name]
		if !ok {
			skip(caseID, "Model is not exported by this SDK release.", params)
			continue
		}
		fixture := f
		record(caseID, params, func() (any, error) {
			wire, _ := json.Marshal(fixture["output"])
			serializationOutput := fixture["output"]
			if output, ok := fixture["serializationOutput"]; ok {
				serializationOutput = output
			}
			expected, _ := json.Marshal(serializationOutput)
			m := factory()
			if e := json.Unmarshal(wire, m); e != nil {
				return nil, e
			}
			round, e := json.Marshal(m)
			if e != nil {
				return nil, e
			}
			var a, b any
			json.Unmarshal(round, &a)
			json.Unmarshal(expected, &b)
			return nil, compare(a, b, fmt.Sprint(fixture["providerId"]), synthetic)
		})
	}
}

// Keep the SDK's typed request builders and response decoding on the normal path.
func sdkResult[T any](value T, response *http.Response, err error) (any, error) {
	return value, err
}
func redirectURL(c *trinsic_api.APIClient) (string, error) {
	result, _, err := c.RedirectUrisAPI.List(ctx).Execute()
	if err != nil {
		return "", err
	}
	for _, entry := range result.Uris {
		if strings.HasPrefix(entry.Uri, "http://") || strings.HasPrefix(entry.Uri, "https://") {
			return entry.Uri, nil
		}
	}
	return "", fmt.Errorf("The test environment must have an HTTP(S) redirect URI.")
}
func compare(a, b any, p string, exact bool) error {
	switch x := a.(type) {
	case map[string]any:
		y, ok := b.(map[string]any)
		if !ok {
			return fmt.Errorf("%s: object shape differs", p)
		}
		for k, v := range x {
			w, ok := y[k]
			if !ok {
				continue
			}
			if e := compare(v, w, p+"."+k, exact); e != nil {
				return e
			}
		}
		if exact {
			for k := range y {
				if _, ok := x[k]; !ok {
					return fmt.Errorf("%s: omitted field %s from fixture", p, k)
				}
			}
		}
	case []any:
		y, ok := b.([]any)
		if !ok || len(x) != len(y) {
			return fmt.Errorf("%s: array values differ", p)
		}
		for i, v := range x {
			if e := compare(v, y[i], fmt.Sprintf("%s[%d]", p, i), exact); e != nil {
				return e
			}
		}
	default:
		if !reflect.DeepEqual(a, b) && !sameTimestamp(a, b) {
			return fmt.Errorf("%s: values differ", p)
		}
	}
	return nil
}
func sameTimestamp(a, b any) bool {
	left, ok := a.(string)
	if !ok {
		return false
	}
	right, ok := b.(string)
	if !ok || len(left) < 10 || len(right) < 10 {
		return false
	}
	first, e := time.Parse(time.RFC3339Nano, left)
	if e != nil {
		return false
	}
	second, e := time.Parse(time.RFC3339Nano, right)
	return e == nil && first.Equal(second)
}
func record(id string, p map[string]any, fn func() (any, error)) any {
	start := time.Now()
	v, e := fn()
	t := testCase{ID: id, Status: "passed", DurationMs: time.Since(start).Milliseconds(), Parameters: p}
	if e != nil {
		t.Status = "failed"
		t.Failure = map[string]any{"name": reflect.TypeOf(e).String(), "message": e.Error()}
	}
	results = append(results, t)
	if e != nil {
		return nil
	}
	return v
}
func skip(id, r string, p map[string]any) {
	results = append(results, testCase{ID: id, Status: "skipped", Parameters: p, SkipReason: r})
}
func write() {
	d, _ := json.MarshalIndent(map[string]any{"schemaVersion": 1, "testCases": results}, "", "  ")
	os.WriteFile(required("SDK_COMPATIBILITY_RESULT_FILE"), append(d, '\n'), 0600)
}
func required(k string) string {
	v := os.Getenv(k)
	if v == "" {
		panic(k + " is required")
	}
	return v
}
