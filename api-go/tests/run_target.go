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
}

var results []testCase
var ctx = context.Background()

func main() {
	c := trinsic_api.NewConfiguration()
	c.Servers = trinsic_api.ServerConfigurations{{URL: strings.TrimRight(required("TRINSIC_TEST_BASE_URL"), "/")}}
	c.AddDefaultHeader("Authorization", "Bearer "+required("TRINSIC_TEST_ACCESS_TOKEN"))
	client := trinsic_api.NewAPIClient(c)
	profile := required("TRINSIC_TEST_VERIFICATION_PROFILE_ID")
	record("api.providers.list", nil, func() (any, error) { return execute(client, "ProvidersAPI", "ListProviders", nil, nil) })
	record("api.verification-profiles.get-by-id", nil, func() (any, error) {
		return execute(client, "VerificationProfilesAPI", "GetVerificationProfileById", []any{profile}, nil)
	})
	record("api.verification-profiles.list", nil, func() (any, error) {
		return execute(client, "VerificationProfilesAPI", "ListVerificationProfiles", nil, nil)
	})
	record("api.sessions.list", nil, func() (any, error) { return execute(client, "SessionsAPI", "ListSessions", []any{profile}, nil) })
	record("api.redirect-uris.list", nil, func() (any, error) { return execute(client, "RedirectUrisAPI", "List", nil, nil) })
	if has(client, "ProvidersAPI", "GetProvider") {
		record("api.providers.get", nil, func() (any, error) {
			return execute(client, "ProvidersAPI", "GetProvider", []any{"trinsic-test-redirect"}, nil)
		})
	} else {
		skip("api.providers.get", "ProvidersApi.GetProvider was introduced after this SDK version.", nil)
	}
	record("api.sessions.create-hosted-provider", nil, func() (any, error) {
		u, e := redirectURL(client)
		if e != nil {
			return nil, e
		}
		r := trinsic_api.CreateHostedProviderSessionRequest{}
		set(&r, "Provider", "trinsic-test-redirect")
		set(&r, "VerificationProfileId", profile)
		set(&r, "RedirectUrl", u)
		set(&r, "EnableRedirectBackwardsCompatibility", false)
		out, e := execute(client, "SessionsAPI", "CreateHostedProviderSession", nil, r)
		if e == nil {
			_, _ = execute(client, "SessionsAPI", "CancelSession", []any{str(out, "SessionId")}, nil)
		}
		return out, e
	})
	direct := record("api.sessions.create-direct-provider", nil, func() (any, error) { return createDirect(client, profile) })
	if direct == nil {
		skip("api.sessions.get", "Direct-session setup failed.", nil)
		skip("api.sessions.cancel", "Direct-session setup failed.", nil)
	} else {
		id := str(direct, "SessionId")
		record("api.sessions.get", nil, func() (any, error) { return execute(client, "SessionsAPI", "GetSession", []any{id}, nil) })
		record("api.sessions.cancel", nil, func() (any, error) { return execute(client, "SessionsAPI", "CancelSession", []any{id}, nil) })
	}
	completed := record("api.sessions.get-result", nil, func() (any, error) {
		s, t, k, e := complete(client, profile)
		if e != nil {
			return nil, e
		}
		r := trinsic_api.GetSessionResultRequest{}
		set(&r, "RedirectToken", t)
		set(&r, "ResultsAccessKey", k)
		out, e := execute(client, "SessionsAPI", "GetSessionResult", []any{str(s, "SessionId")}, r)
		if e == nil {
			os.Setenv("GO_TEST_SESSION", str(s, "SessionId"))
			os.Setenv("GO_TEST_ATTACHMENT", attachment(out))
			os.Setenv("GO_TEST_KEY", k)
		}
		return out, e
	})
	if completed == nil || os.Getenv("GO_TEST_ATTACHMENT") == "" {
		skip("api.sessions.get-attachment", "Redirect-session setup or result retrieval failed.", nil)
		skip("api.sessions.redact", "Redirect-session setup or result retrieval failed.", nil)
	} else {
		id, a, k := os.Getenv("GO_TEST_SESSION"), os.Getenv("GO_TEST_ATTACHMENT"), os.Getenv("GO_TEST_KEY")
		record("api.sessions.get-attachment", nil, func() (any, error) {
			r := trinsic_api.GetAttachmentRequest{}
			set(&r, "ResultsAccessKey", k)
			return execute(client, "SessionsAPI", "GetAttachment", []any{id, a}, r)
		})
		record("api.sessions.redact", nil, func() (any, error) { return execute(client, "SessionsAPI", "RedactSession", []any{id}, nil) })
	}
	record("api.sessions.recommend-providers", nil, func() (any, error) {
		r := trinsic_api.RecommendProvidersRequest{}
		set(&r, "VerificationProfileId", profile)
		return execute(client, "SessionsAPI", "RecommendProviders", nil, r)
	})
	pso()
	write()
}
func createDirect(c *trinsic_api.APIClient, p string) (any, error) {
	u, e := redirectURL(c)
	if e != nil {
		return nil, e
	}
	r := trinsic_api.CreateDirectProviderSessionRequest{}
	set(&r, "Provider", "trinsic-test-redirect")
	set(&r, "VerificationProfileId", p)
	r.RedirectUrl = *trinsic_api.NewNullableString(&u)
	r.Capabilities = []trinsic_api.IntegrationCapability{trinsic_api.INTEGRATIONCAPABILITY_LAUNCH_BROWSER, trinsic_api.INTEGRATIONCAPABILITY_CAPTURE_REDIRECT}
	fallback := false
	r.FallbackToHostedUI = *trinsic_api.NewNullableBool(&fallback)
	set(&r, "EnableRedirectBackwardsCompatibility", false)
	return execute(c, "SessionsAPI", "CreateDirectProviderSession", nil, r)
}
func complete(c *trinsic_api.APIClient, p string) (any, string, string, error) {
	s, e := createDirect(c, p)
	if e != nil {
		return nil, "", "", e
	}
	b := browser{}
	first, e := b.fetch(str(val(s, "NextStep"), "Content"))
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
	return s, query(app, "redirectToken"), str(val(s, "ResultCollection"), "ResultsAccessKey"), nil
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
		name, _ := f["sdkModelName"].(string)
		params := map[string]any{"providerId": fmt.Sprint(f["providerId"])}
		if name != "" {
			params["sdkModelName"] = name
		}
		if f["hasPublicSdkModel"] != true {
			skip("serialization.provider-output-round-trip", "Provider has no public Swagger provider-specific output model.", params)
			continue
		}
		factory, ok := providerOutputFactories[name]
		if !ok {
			if os.Getenv("SDK_IS_CURRENT") == "true" && os.Getenv("SDK_COMPATIBILITY_ALLOW_MISSING_PSO_MODELS") != "true" && os.Getenv("SDK_COMPATIBILITY_ALLOW_MISSING_PSO_MODELS") != "1" {
				record("serialization.provider-output-round-trip", params, func() (any, error) {
					return nil, fmt.Errorf("Connect declares %v's %s output as public, but this SDK does not expose %s.", f["providerId"], name, name)
				})
			} else {
				skip("serialization.provider-output-round-trip", map[bool]string{true: "Missing public provider-output models are temporarily allowed by SDK_COMPATIBILITY_ALLOW_MISSING_PSO_MODELS.", false: "The published SDK does not expose this provider-output model."}[os.Getenv("SDK_IS_CURRENT") == "true"], params)
			}
			continue
		}
		fixture := f
		record("serialization.provider-output-round-trip", params, func() (any, error) {
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
			return nil, compare(a, b, fmt.Sprint(fixture["providerId"]), os.Getenv("SDK_IS_CURRENT") == "true")
		})
	}
}
func execute(c *trinsic_api.APIClient, service, op string, args []any, body any) (out any, err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
	}()
	s := reflect.ValueOf(c).Elem().FieldByName(service)
	m := s.MethodByName(op)
	if !m.IsValid() {
		return nil, fmt.Errorf("%s does not expose %s", service, op)
	}
	in := []reflect.Value{reflect.ValueOf(ctx)}
	for _, a := range args {
		in = append(in, reflect.ValueOf(a))
	}
	request := m.Call(in)[0]
	if body != nil {
		setter := request.MethodByName(op + "Request")
		if !setter.IsValid() {
			return nil, fmt.Errorf("%s request builder missing", op)
		}
		request = setter.Call([]reflect.Value{reflect.ValueOf(body)})[0]
	}
	v := request.MethodByName("Execute").Call(nil)
	if !v[len(v)-1].IsNil() {
		return nil, v[len(v)-1].Interface().(error)
	}
	return v[0].Interface(), nil
}
func has(c *trinsic_api.APIClient, s, o string) bool {
	return reflect.ValueOf(c).Elem().FieldByName(s).MethodByName(o).IsValid()
}
func set(x any, n string, v any) {
	f := reflect.ValueOf(x).Elem().FieldByName(n)
	if !f.IsValid() || !f.CanSet() {
		return
	}
	z := reflect.ValueOf(v)
	if z.Type().AssignableTo(f.Type()) {
		f.Set(z)
		return
	}
	if f.CanAddr() {
		setter := f.Addr().MethodByName("Set")
		if setter.IsValid() && setter.Type().NumIn() == 1 {
			input := setter.Type().In(0)
			if z.Type().AssignableTo(input) {
				setter.Call([]reflect.Value{z})
				return
			}
			if input.Kind() == reflect.Pointer && z.Type().AssignableTo(input.Elem()) {
				pointer := reflect.New(input.Elem())
				pointer.Elem().Set(z)
				setter.Call([]reflect.Value{pointer})
			}
		}
	}
}
func val(x any, n string) any {
	v := reflect.ValueOf(x)
	for v.IsValid() && v.Kind() == reflect.Pointer {
		if v.IsNil() {
			return nil
		}
		v = v.Elem()
	}
	if !v.IsValid() || v.Kind() != reflect.Struct {
		return nil
	}
	f := v.FieldByName(n)
	if !f.IsValid() {
		return nil
	}
	return f.Interface()
}
func str(x any, n string) string {
	if s, ok := val(x, n).(string); ok {
		return s
	}
	return ""
}
func attachment(x any) string {
	a := reflect.ValueOf(val(val(x, "IdentityData"), "Attachments"))
	if a.IsValid() && a.Kind() == reflect.Slice && a.Len() > 0 {
		return str(a.Index(0).Interface(), "Id")
	}
	return ""
}
func redirectURL(c *trinsic_api.APIClient) (string, error) {
	x, e := execute(c, "RedirectUrisAPI", "List", nil, nil)
	if e != nil {
		return "", e
	}
	if u := httpURL(reflect.ValueOf(x)); u != "" {
		return u, nil
	}
	return "", fmt.Errorf("The test environment must have an HTTP(S) redirect URI.")
}
func httpURL(v reflect.Value) string {
	if !v.IsValid() {
		return ""
	}
	if v.Kind() == reflect.Pointer || v.Kind() == reflect.Interface {
		if v.IsNil() {
			return ""
		}
		return httpURL(v.Elem())
	}
	if v.Kind() == reflect.String {
		if s := v.String(); strings.HasPrefix(s, "http://") || strings.HasPrefix(s, "https://") {
			return s
		}
	}
	if v.Kind() == reflect.Struct {
		for i := 0; i < v.NumField(); i++ {
			if s := httpURL(v.Field(i)); s != "" {
				return s
			}
		}
	}
	if v.Kind() == reflect.Slice || v.Kind() == reflect.Array {
		for i := 0; i < v.Len(); i++ {
			if s := httpURL(v.Index(i)); s != "" {
				return s
			}
		}
	}
	return ""
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
		if !ok || len(x) > len(y) || (exact && len(x) != len(y)) {
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
