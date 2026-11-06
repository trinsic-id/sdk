package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	trinsic_api "github.com/trinsic-id/sdk-go-api/v3"
	"io"
	"net/http"
	"net/url"
	"os"
	"reflect"
	"regexp"
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
	session, response, err := c.SessionsAPI.CreateDirectProviderSession(ctx).CreateDirectProviderSessionRequest(r).Execute()
	if err == nil {
		createdSessions[session.SessionId] = c
	}
	if err == nil {
		_, err = sdkResult(session, response, nil)
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
			projected, err := modelFields(reflect.ValueOf(m), b, false)
			if err != nil {
				return nil, err
			}
			var original any
			if err = json.Unmarshal(wire, &original); err != nil {
				return nil, err
			}
			observed, err := modelFields(reflect.ValueOf(m), original, true)
			if err != nil {
				return nil, err
			}
			supported, err := modelFields(reflect.ValueOf(m), original, false)
			if err != nil {
				return nil, err
			}
			if err = compare(observed, supported, "decoded", true); err != nil {
				return nil, err
			}
			if synthetic {
				projected = b
			}
			return nil, compare(a, projected, fmt.Sprint(fixture["providerId"]), true)
		})
	}
}

// Keep the SDK's typed request builders and response decoding on the normal path.
func sdkResult[T any](value T, response *http.Response, err error) (any, error) {
	if err != nil {
		return nil, err
	}
	if response != nil {
		wire := capturedWire[response]
		actual, e := modelFields(reflect.ValueOf(value), wire, true)
		if e != nil {
			return nil, e
		}
		expected, e := modelFields(reflect.ValueOf(value), wire, false)
		if e != nil {
			return nil, e
		}
		if e = compare(actual, expected, "response", true); e != nil {
			return nil, e
		}
	}
	return value, nil
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

var capturedWire = map[*http.Response]any{}
var lastRequest *http.Request
var lastBody map[string]any

type captureTransport struct{}

func (captureTransport) RoundTrip(request *http.Request) (*http.Response, error) {
	lastRequest = request
	lastBody = nil
	if request.Body != nil {
		body, err := io.ReadAll(request.Body)
		if err != nil {
			return nil, err
		}
		request.Body = io.NopCloser(bytes.NewReader(body))
		if len(body) > 0 {
			if err = json.Unmarshal(body, &lastBody); err != nil {
				return nil, err
			}
		}
	}
	response, err := http.DefaultTransport.RoundTrip(request)
	if err != nil {
		return nil, err
	}
	data, err := io.ReadAll(response.Body)
	response.Body.Close()
	if err != nil {
		return nil, err
	}
	response.Body = io.NopCloser(bytes.NewReader(data))
	if len(data) > 0 {
		var wire any
		if err = json.Unmarshal(data, &wire); err != nil {
			return nil, err
		}
		capturedWire[response] = wire
	}
	return response, nil
}

// SDK struct tags and nullable wrappers define supported fields; dictionary keys stay exact.
func modelFields(value reflect.Value, wire any, decoded bool) (any, error) {
	for value.IsValid() && (value.Kind() == reflect.Pointer || value.Kind() == reflect.Interface) {
		if value.IsNil() {
			value = reflect.Value{}
			break
		}
		value = value.Elem()
	}
	if value.IsValid() && strings.HasPrefix(value.Type().Name(), "Nullable") {
		getter := value.MethodByName("Get")
		if getter.IsValid() {
			return modelFields(getter.Call(nil)[0], wire, decoded)
		}
	}
	if object, ok := wire.(map[string]any); ok && value.IsValid() {
		if value.Kind() == reflect.Struct {
			result := map[string]any{}
			for i := 0; i < value.NumField(); i++ {
				field := value.Type().Field(i)
				key := strings.Split(field.Tag.Get("json"), ",")[0]
				if key == "" || key == "-" {
					continue
				}
				if child, exists := object[key]; exists {
					projected, err := modelFields(value.Field(i), child, decoded)
					if err != nil {
						return nil, err
					}
					result[key] = projected
				}
			}
			return result, nil
		}
		if value.Kind() == reflect.Map {
			if decoded && value.Len() != len(object) {
				return nil, fmt.Errorf("SDK changed dictionary keys")
			}
			result := map[string]any{}
			for key, child := range object {
				entry := value.MapIndex(reflect.ValueOf(key))
				if decoded && !entry.IsValid() {
					return nil, fmt.Errorf("SDK omitted dictionary entry %s", key)
				}
				projected, err := modelFields(entry, child, decoded)
				if err != nil {
					return nil, err
				}
				result[key] = projected
			}
			return result, nil
		}
	}
	if array, ok := wire.([]any); ok && value.IsValid() && (value.Kind() == reflect.Slice || value.Kind() == reflect.Array) {
		if value.Len() != len(array) {
			return nil, fmt.Errorf("SDK changed array length")
		}
		result := make([]any, len(array))
		for i, child := range array {
			projected, err := modelFields(value.Index(i), child, decoded)
			if err != nil {
				return nil, err
			}
			result[i] = projected
		}
		return result, nil
	}
	if !decoded {
		return wire, nil
	}
	if !value.IsValid() {
		return nil, nil
	}
	data, err := json.Marshal(value.Interface())
	if err != nil {
		return nil, err
	}
	var result any
	err = json.Unmarshal(data, &result)
	return result, err
}

func assertAPI(id string, value any) error {
	if id == "api.sessions.redact" {
		return nil
	}
	encoded, err := json.Marshal(value)
	if err != nil {
		return err
	}
	var body map[string]any
	if err = json.Unmarshal(encoded, &body); err != nil {
		return err
	}
	if body == nil {
		return fmt.Errorf("SDK returned no body")
	}
	require := func(ok bool, message string) error {
		if !ok {
			return fmt.Errorf("%s: %s", id, message)
		}
		return nil
	}
	switch id {
	case "api.providers.get":
		provider, ok := body["provider"].(map[string]any)
		return require(ok && provider["id"] == "trinsic-test-redirect", "provider ID differs")
	case "api.verification-profiles.get-by-id":
		return require(strings.EqualFold(fmt.Sprint(body["id"]), required("TRINSIC_TEST_VERIFICATION_PROFILE_ID")), "profile ID differs")
	case "api.providers.list", "api.verification-profiles.list", "api.sessions.list", "api.redirect-uris.list":
		fields := map[string]string{"api.providers.list": "providers", "api.verification-profiles.list": "verificationProfiles", "api.sessions.list": "sessions", "api.redirect-uris.list": "uris"}
		entries, ok := body[fields[id]].([]any)
		if !ok {
			return fmt.Errorf("%s: missing array", id)
		}
		if id == "api.providers.list" && len(entries) == 0 {
			return fmt.Errorf("No providers")
		}
		for _, entry := range entries {
			object, ok := entry.(map[string]any)
			if !ok || object["id"] == nil || object["id"] == "" {
				return fmt.Errorf("Page entry omitted ID")
			}
		}
		if id == "api.sessions.list" && (lastRequest.URL.Query().Get("Page") != "1" || lastRequest.URL.Query().Get("PageSize") != "1") {
			return fmt.Errorf("Session pagination request differs")
		}
		if id == "api.redirect-uris.list" && (lastRequest.URL.Query().Get("page") != "1" || lastRequest.URL.Query().Get("pageSize") != "1") {
			return fmt.Errorf("Redirect pagination request differs")
		}
		if id != "api.providers.list" {
			if _, ok = body["more"].(bool); !ok {
				return fmt.Errorf("Invalid pagination flag")
			}
		}
	case "api.sessions.create-direct-provider", "api.sessions.create-hosted-provider":
		sessionID, ok := body["sessionId"].(string)
		if !ok || !regexp.MustCompile(`^[0-9a-fA-F]{8}(-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}$`).MatchString(sessionID) {
			return fmt.Errorf("Invalid session ID")
		}
		launch, key := body["launchUrl"], body["resultsAccessKey"]
		if id == "api.sessions.create-direct-provider" {
			step, ok := body["nextStep"].(map[string]any)
			collection, valid := body["resultCollection"].(map[string]any)
			if !ok || !valid || step["method"] != "LaunchBrowser" || collection["method"] != "CaptureRedirect" {
				return fmt.Errorf("Invalid direct flow")
			}
			launch, key = step["content"], collection["resultsAccessKey"]
			if err := compare(lastBody["capabilities"], []any{"LaunchBrowser", "CaptureRedirect"}, "request.capabilities", true); err != nil {
				return err
			}
			if lastBody["fallbackToHostedUI"] != false {
				return fmt.Errorf("Request lost explicit false")
			}
		}
		uri, err := url.Parse(fmt.Sprint(launch))
		if err != nil || uri.Host == "" || (uri.Scheme != "http" && uri.Scheme != "https") || key == nil || key == "" {
			return fmt.Errorf("Invalid launch URL or key")
		}
		if lastBody["provider"] != "trinsic-test-redirect" || !strings.EqualFold(fmt.Sprint(lastBody["verificationProfileId"]), required("TRINSIC_TEST_VERIFICATION_PROFILE_ID")) {
			return fmt.Errorf("Wrong creation request")
		}
	case "api.sessions.get", "api.sessions.cancel", "api.sessions.get-result":
		session, ok := body["session"].(map[string]any)
		if !ok {
			return fmt.Errorf("Missing session")
		}
		path := strings.Split(lastRequest.URL.Path, "/")
		expectedID := ""
		for i, part := range path {
			if part == "sessions" && i+1 < len(path) {
				expectedID = path[i+1]
				break
			}
		}
		if expectedID == "" || !strings.EqualFold(fmt.Sprint(session["id"]), expectedID) {
			return fmt.Errorf("Session ID differs")
		}
		if session["done"] != (id != "api.sessions.get") || session["success"] != (id == "api.sessions.get-result") {
			return fmt.Errorf("Session state differs")
		}
		if id == "api.sessions.get-result" {
			identity, ok := body["identityData"].(map[string]any)
			if !ok || identity["originatingProviderId"] != "trinsic-test-redirect" {
				return fmt.Errorf("Missing test identity")
			}
			attachments, ok := identity["attachments"].([]any)
			if !ok || len(attachments) == 0 {
				return fmt.Errorf("Missing attachments")
			}
		}
	case "api.sessions.get-attachment":
		content, err := base64.StdEncoding.Strict().DecodeString(fmt.Sprint(body["content"]))
		if err != nil || body["contentType"] != "image/png" || !bytes.HasPrefix(content, []byte{137, 80, 78, 71, 13, 10, 26, 10}) {
			return fmt.Errorf("Attachment must contain PNG bytes")
		}
	case "api.sessions.recommend-providers":
		recommended, ok := body["recommendedProviders"].([]any)
		remainder, valid := body["remainder"].([]any)
		if !ok || !valid || len(recommended)+len(remainder) == 0 {
			return fmt.Errorf("Missing recommendations")
		}
		for _, entry := range append(recommended, remainder...) {
			provider, ok := entry.(map[string]any)
			if !ok {
				return fmt.Errorf("Invalid recommendation")
			}
			for _, key := range []string{"id", "name", "logoUrl", "subtext", "health"} {
				if _, ok := provider[key].(string); !ok {
					return fmt.Errorf("Invalid recommendation %s", key)
				}
			}
			for _, key := range []string{"regions", "countries", "subdivisions"} {
				items, ok := provider[key].([]any)
				if !ok {
					return fmt.Errorf("Invalid recommendation %s", key)
				}
				for _, item := range items {
					if _, ok := item.(string); !ok {
						return fmt.Errorf("Invalid recommendation item")
					}
				}
			}
		}
	}
	return nil
}
