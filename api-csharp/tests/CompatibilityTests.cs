using System.Diagnostics;
using System.Globalization;
using System.Net.Http.Headers;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Text.Json.Nodes;
#if LEGACY_SDK
using Microsoft.Extensions.DependencyInjection;
using Trinsic.Api.Extensions;
#endif
using Trinsic.Api.Api;
using Trinsic.Api.Client;
using Trinsic.Api.Model;
using Xunit;

[assembly: CollectionBehavior(DisableTestParallelization = true)]

public sealed class CompatibilityTests : IClassFixture<CompatibilityFixture>
{
    private readonly CompatibilityFixture fixture;
    public CompatibilityTests(CompatibilityFixture fixture) => this.fixture = fixture;

    [Fact] public Task ListProviders() => fixture.Check("api.providers.list", async () => fixture.RequireOk(await fixture.InvokeApi(fixture.Providers, "ListProvidersAsync")));
    [Fact] public Task ListVerificationProfiles() => fixture.Check("api.verification-profiles.list", async () => fixture.RequireOk(await fixture.InvokeApi(fixture.VerificationProfiles, "ListVerificationProfilesAsync")));
    [Fact] public Task GetVerificationProfile() => fixture.Check("api.verification-profiles.get-by-id", async () => fixture.RequireOk(await fixture.InvokeApi(fixture.VerificationProfiles, "GetVerificationProfileByIdAsync", fixture.ProfileId)));
    [Fact] public Task ListSessions() => fixture.Check("api.sessions.list", async () => fixture.RequireOk(await fixture.InvokeApi(fixture.Sessions, "ListSessionsAsync", fixture.ProfileId)));
    [Fact] public Task ListRedirectUris() => fixture.Check("api.redirect-uris.list", async () => fixture.RequireOk(await fixture.InvokeApi(fixture.RedirectUris, "ListAsync")));

    [Fact]
    public async Task GetProvider()
    {
        var method = fixture.Providers.GetType().GetMethod("GetProviderAsync", BindingFlags.Public | BindingFlags.Instance);
        if (method is null) { fixture.Skip("api.providers.get", "This SDK does not expose GetProviderAsync."); return; }
        await fixture.Check("api.providers.get", async () => fixture.RequireOk(await fixture.InvokeMethod(fixture.Providers, method, "trinsic-test-redirect")));
    }

    [Fact]
    public Task CreateHostedProviderSession() => fixture.Check("api.sessions.create-hosted-provider", async () =>
    {
        var request = fixture.CreateRequest("CreateHostedProviderSessionRequest", new Dictionary<string, object?> {
            ["enableRedirectBackwardsCompatibility"] = false, ["provider"] = "trinsic-test-redirect",
            ["redirectUrl"] = await fixture.RegisteredRedirectUrl(), ["verificationProfileId"] = fixture.ProfileId,
        });
        var response = await fixture.InvokeApi(fixture.Sessions, "CreateHostedProviderSessionAsync", request);
        fixture.RequireOk(response);
        var session = fixture.ResponseBody(response);
        fixture.Require(!string.IsNullOrWhiteSpace(fixture.Property<string>(session, "LaunchUrl")), "Hosted session omitted launchUrl.");
        fixture.Require(!string.IsNullOrWhiteSpace(fixture.Property<string>(session, "ResultsAccessKey")), "Hosted session omitted resultsAccessKey.");
        fixture.RequireOk(await fixture.InvokeApi(fixture.Sessions, "CancelSessionAsync", fixture.Property<Guid>(session, "SessionId")));
    });

    [Fact]
    public async Task DirectSessionCanBeReadAndCancelled()
    {
        Guid sessionId = Guid.Empty;
        await fixture.Check("api.sessions.create-direct-provider", async () =>
        {
            var request = fixture.CreateRequest("CreateDirectProviderSessionRequest", new Dictionary<string, object?> {
                ["capabilities"] = new[] { "LaunchBrowser", "CaptureRedirect" }, ["enableRedirectBackwardsCompatibility"] = false,
                ["provider"] = "trinsic-test-redirect", ["verificationProfileId"] = fixture.ProfileId,
                ["fallbackToHostedUI"] = false, ["redirectUrl"] = await fixture.RegisteredRedirectUrl(),
            });
            var response = await fixture.InvokeApi(fixture.Sessions, "CreateDirectProviderSessionAsync", request);
            fixture.RequireOk(response);
            var session = fixture.ResponseBody(response);
            sessionId = fixture.Property<Guid>(session, "SessionId");
            fixture.Require(!string.IsNullOrWhiteSpace(fixture.Property<string>(fixture.Property<object>(session, "NextStep"), "Content")), "Direct session omitted launch content.");
            fixture.Require(!string.IsNullOrWhiteSpace(fixture.Property<string>(fixture.Property<object>(session, "ResultCollection"), "ResultsAccessKey")), "Direct session omitted resultsAccessKey.");
        });
        if (sessionId == Guid.Empty) { fixture.Skip("api.sessions.get", "Direct-session setup failed."); fixture.Skip("api.sessions.cancel", "Direct-session setup failed."); return; }
        await fixture.Check("api.sessions.get", async () => fixture.RequireOk(await fixture.InvokeApi(fixture.Sessions, "GetSessionAsync", sessionId)));
        await fixture.Check("api.sessions.cancel", async () => fixture.RequireOk(await fixture.InvokeApi(fixture.Sessions, "CancelSessionAsync", sessionId)));
    }

    [Fact]
    public Task RecommendProviders() => fixture.Check("api.sessions.recommend-providers", async () => fixture.RequireOk(await fixture.InvokeApi(fixture.Sessions, "RecommendProvidersAsync", fixture.CreateRequest("RecommendProvidersRequest", new Dictionary<string, object?> { ["verificationProfileId"] = fixture.ProfileId }))));

    [Fact] public Task ProviderOutputFixturesRoundTrip() => fixture.ProviderOutputs();

    [Fact] public Task GetSessionResult() => fixture.WithCompletedSession("api.sessions.get-result", async (sessionId, key, token) =>
        fixture.RequireOk(await fixture.InvokeApi(fixture.Sessions, "GetSessionResultAsync", sessionId, fixture.ResultsRequest("GetSessionResultRequest", key, token))));

    [Fact] public Task GetAttachment() => fixture.WithCompletedSession("api.sessions.get-attachment", async (sessionId, key, token) =>
    {
        var result = await fixture.InvokeApi(fixture.Sessions, "GetSessionResultAsync", sessionId, fixture.ResultsRequest("GetSessionResultRequest", key, token));
        fixture.RequireOk(result);
        var identity = fixture.Property<object>(fixture.ResponseBody(result), "IdentityData");
        var attachments = fixture.Property<System.Collections.IEnumerable>(identity, "Attachments").Cast<object>().ToArray();
        fixture.Require(attachments.Length > 0, "Test provider returned no attachments.");
        fixture.RequireOk(await fixture.InvokeApi(fixture.Sessions, "GetAttachmentAsync", sessionId, fixture.Property<Guid>(attachments[0], "Id"), fixture.ResultsRequest("GetAttachmentRequest", key, token)));
    });

    [Fact] public Task RedactSession() => fixture.WithCompletedSession("api.sessions.redact", async (sessionId, _, _) =>
        fixture.RequireOk(await fixture.InvokeApi(fixture.Sessions, "RedactSessionAsync", sessionId)));
}

public sealed class CompatibilityFixture : IAsyncLifetime, IDisposable
{
    private readonly List<object> results = [];
    private int failureCount;
    #if LEGACY_SDK
    private readonly ServiceProvider provider;
    private readonly JsonSerializerOptions serializerOptions;
#else
    private readonly HttpClient sdkClient = new();
    private readonly object codec;
#endif
    private readonly string targetBaseUrl = Required("TRINSIC_TEST_BASE_URL").TrimEnd('/');
    private readonly string accessToken = Required("TRINSIC_TEST_ACCESS_TOKEN");
    private readonly bool isCurrent = Environment.GetEnvironmentVariable("SDK_IS_CURRENT") == "true";
    private static readonly Assembly SdkAssembly = typeof(SessionsApi).Assembly;

    public CompatibilityFixture()
    {
        ProfileId = Guid.Parse(Required("TRINSIC_TEST_VERIFICATION_PROFILE_ID"));
#if LEGACY_SDK
        var services = new ServiceCollection();
        services.AddTrinsicApi(options => { options.AddTokens(new BearerToken(accessToken)); options.AddTrinsicApiHttpClients(client => client.BaseAddress = new Uri(targetBaseUrl)); });
        provider = services.BuildServiceProvider();
        Providers = provider.GetRequiredService<IProvidersApi>(); VerificationProfiles = provider.GetRequiredService<IVerificationProfilesApi>();
        Sessions = provider.GetRequiredService<ISessionsApi>(); RedirectUris = provider.GetRequiredService<IRedirectUrisApi>();
        foreach (var api in new object[] { Providers, VerificationProfiles, Sessions, RedirectUris }) api.GetType().GetMethod("SetAuthToken")?.Invoke(api, [accessToken]);
        serializerOptions = provider.GetRequiredService<JsonSerializerOptionsProvider>().Options;
#else
        var configuration = new Configuration { AccessToken = accessToken, BasePath = targetBaseUrl };
        Providers = new ProvidersApi(sdkClient, configuration);
        VerificationProfiles = new VerificationProfilesApi(sdkClient, configuration);
        Sessions = new SessionsApi(sdkClient, configuration);
        RedirectUris = new RedirectUrisApi(sdkClient, configuration);
        // Exercise the SDK's HTTP codec, including its generated converters and settings.
        codec = Activator.CreateInstance(SdkAssembly.GetType("Trinsic.Api.Client.CustomJsonCodec", true)!, configuration)!;
#endif
    }

    public Guid ProfileId { get; }
    public object Providers { get; }
    public object VerificationProfiles { get; }
    public object Sessions { get; }
    public object RedirectUris { get; }
    public Task InitializeAsync() => Task.CompletedTask;
    public async Task DisposeAsync() { if (Environment.GetEnvironmentVariable("SDK_COMPATIBILITY_RESULT_FILE") is { Length: > 0 } output) await File.WriteAllTextAsync(output, JsonSerializer.Serialize(new { schemaVersion = 1, testCases = results }, new JsonSerializerOptions { WriteIndented = true }) + "\n"); Dispose(); }
    public void Dispose()
    {
#if LEGACY_SDK
        provider.Dispose();
#else
        sdkClient.Dispose();
#endif
    }

    public async Task<JsonNode> RoundTrip(JsonNode raw, Type modelType)
    {
#if LEGACY_SDK
        var model = JsonSerializer.Deserialize(raw.ToJsonString(), modelType, serializerOptions) ?? throw new InvalidOperationException("SDK deserialized to null.");
        return JsonNode.Parse(JsonSerializer.Serialize(model, modelType, serializerOptions))!;
#else
        using var response = new HttpResponseMessage(System.Net.HttpStatusCode.OK) { Content = new StringContent(raw.ToJsonString(), System.Text.Encoding.UTF8, "application/json") };
        var method = codec.GetType().GetMethod("Deserialize", BindingFlags.Instance | BindingFlags.NonPublic, null, [typeof(HttpResponseMessage), typeof(Type)], null)!;
        var task = (Task<object>)method.Invoke(codec, [response, modelType])!;
        var model = await task;
        return JsonNode.Parse((string)codec.GetType().GetMethod("Serialize")!.Invoke(codec, [model])!)!;
#endif
    }

    public async Task Check(string id, Func<Task> action, object? parameters = null, [CallerMemberName] string nativeTest = "")
    {
        var error = await Record(id, action, parameters, nativeTest);
        if (error is not null) throw new Xunit.Sdk.XunitException(error.Message);
    }
    public void Skip(string id, string reason, object? parameters = null) => results.Add(new { id, status = "skipped", durationMs = 0L, parameters, skipReason = reason });

    public object ResultsRequest(string name, string key, string token) => CreateRequest(name, new Dictionary<string, object?> { ["resultsAccessKey"] = key, ["redirectToken"] = token });

    public Task WithCompletedSession(string id, Func<Guid, string, string, Task> action, [CallerMemberName] string nativeTest = "") => Check(id, async () =>
    {
        Guid sessionId = Guid.Empty;
        try
        {
            var request = CreateRequest("CreateDirectProviderSessionRequest", new Dictionary<string, object?> {
                ["capabilities"] = new[] { "LaunchBrowser", "CaptureRedirect" }, ["enableRedirectBackwardsCompatibility"] = false,
                ["provider"] = "trinsic-test-redirect", ["verificationProfileId"] = ProfileId,
                ["fallbackToHostedUI"] = false, ["redirectUrl"] = await RegisteredRedirectUrl(),
            });
            var response = await InvokeApi(Sessions, "CreateDirectProviderSessionAsync", request); RequireOk(response);
            var session = ResponseBody(response); sessionId = Property<Guid>(session, "SessionId");
            var key = Property<string>(Property<object>(session, "ResultCollection"), "ResultsAccessKey");
            using var handler = new HttpClientHandler { AllowAutoRedirect = false, UseCookies = true };
            using var browser = new HttpClient(handler);
            var integration = await FollowRedirect(browser, new Uri(Property<string>(Property<object>(session, "NextStep"), "Content")));
            var callback = new Uri(QueryValue(integration, "redirectUrl"));
            var query = System.Web.HttpUtility.ParseQueryString(callback.Query); query["resultState"] = "success";
            var verification = await FollowRedirect(browser, new UriBuilder(callback) { Query = query.ToString() }.Uri);
            var completion = await FollowRedirect(browser, verification);
            var application = await FollowRedirect(browser, completion);
            var token = QueryValue(application, "redirectToken");
            Require(!string.IsNullOrWhiteSpace(token), "Application redirect omitted redirectToken.");
            await action(sessionId, key, token);
        }
        finally
        {
            if (sessionId != Guid.Empty) { try { await InvokeApi(Sessions, "CancelSessionAsync", sessionId); } catch { /* Redaction may already have removed the session. */ } }
        }
    }, nativeTest: nativeTest);

    private static string QueryValue(Uri uri, string name) => System.Web.HttpUtility.ParseQueryString(uri.Query)[name] ?? throw new InvalidOperationException($"Redirect omitted {name}.");
    private static async Task<Uri> FollowRedirect(HttpClient browser, Uri uri)
    {
        using var response = await browser.GetAsync(uri);
        if ((int)response.StatusCode / 100 != 3 || response.Headers.Location is not { } location) throw new InvalidOperationException($"Expected redirect, got {(int)response.StatusCode}.");
        return new Uri(uri, location);
    }

    public async Task ProviderOutputs()
    {
        var failuresBefore = failureCount;
        using var client = new HttpClient { BaseAddress = new Uri(targetBaseUrl) };
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        var cache = Environment.GetEnvironmentVariable("SDK_COMPATIBILITY_PSO_FIXTURES_PATH");
        var catalog = cache is { Length: > 0 } ? JsonNode.Parse(await File.ReadAllTextAsync(cache))?["fixtures"]?.AsArray() : null;
        var hasCachedCatalog = catalog is not null;
        if (catalog is null) catalog = JsonNode.Parse(await client.GetStringAsync("/api/v1/providers/sample-json/outputs"))?.AsArray();
        if (catalog is null) throw new InvalidOperationException("Provider-output fixture catalog was not an array.");
        foreach (var item in catalog)
        {
            var fixture = item?.AsObject() ?? throw new InvalidOperationException("Provider-output fixture was not an object.");
            var caseId = fixture["testCaseId"]?.GetValue<string>() ?? "serialization.provider-output-round-trip";
            var providerId = fixture["providerId"]?.GetValue<string>() ?? throw new InvalidOperationException("Provider-output fixture omitted providerId.");
            var modelName = fixture["sdkModelName"]?.GetValue<string>(); var isPublic = fixture["hasPublicSdkModel"]?.GetValue<bool>() ?? false;
            var parameters = new Dictionary<string, string> { ["providerId"] = providerId }; if (modelName is not null) parameters["sdkModelName"] = modelName;
            if (!isPublic || modelName is null) { Skip(caseId, "Provider has no public Swagger provider-specific output model.", parameters); continue; }
            if (fixture["unsupportedReason"]?.GetValue<string>() is { } reason) { Skip(caseId, reason, parameters); continue; }
            var modelType = SdkAssembly.GetType($"Trinsic.Api.Model.{modelName}");
            if (modelType is null) { if (isCurrent) await Record(caseId, () => throw new InvalidOperationException($"Connect declares {providerId}'s {modelName} output as public, but this SDK does not export {modelName}."), parameters); else Skip(caseId, "The published SDK does not expose this provider-output model.", parameters); continue; }
            await Record(caseId, async () => {
                var raw = hasCachedCatalog
                    ? fixture["output"] ?? throw new InvalidOperationException($"Cached fixture {providerId} omitted output.")
                    : JsonNode.Parse(client.GetStringAsync($"/api/v1/providers/{Uri.EscapeDataString(providerId)}/sample-json/output").GetAwaiter().GetResult()) ?? throw new InvalidOperationException("Fixture JSON was empty.");
                var serialized = await RoundTrip(raw, modelType);
                AssertJson(serialized, hasCachedCatalog ? fixture["serializationOutput"] ?? raw : raw, providerId, isCurrent || fixture["testCaseId"] is not null);
            }, parameters);
        }
        if (failureCount > failuresBefore) throw new Xunit.Sdk.XunitException($"{failureCount - failuresBefore} serialization cases failed; see the structured report.");
    }

    private async Task<Exception?> Record(string id, Func<Task> action, object? parameters = null, string nativeTest = "ProviderOutputFixturesRoundTrip") { var timer = Stopwatch.StartNew(); try { await action(); results.Add(new { id, status = "passed", durationMs = timer.ElapsedMilliseconds, parameters }); return null; } catch (Exception error) { failureCount++; results.Add(new { id, status = "failed", durationMs = timer.ElapsedMilliseconds, parameters, nativeTest = $"CompatibilityTests.{nativeTest}", failure = new { name = error.GetType().Name, message = error.ToString() } }); return error; } }
    public object CreateRequest(string modelName, IReadOnlyDictionary<string, object?> values)
    {
        var type = SdkAssembly.GetType($"Trinsic.Api.Model.{modelName}") ?? throw new InvalidOperationException($"SDK does not export {modelName}.");
        var constructor = type.GetConstructors().OrderByDescending(c => c.GetParameters().Length).First();
        return constructor.Invoke(constructor.GetParameters().Select(p => values.TryGetValue(p.Name ?? "", out var value) ? ConvertArgument(p.ParameterType, value) : p.HasDefaultValue ? Type.Missing : throw new InvalidOperationException($"{modelName} requires '{p.Name}'.")).ToArray());
    }
    private static object? ConvertArgument(Type type, object? value)
    {
        if (type.IsGenericType && type.GetGenericTypeDefinition().Name == "Option`1") return Activator.CreateInstance(type, ConvertArgument(type.GetGenericArguments()[0], value));
        if (value is string[] names && type.IsGenericType && type.GetGenericTypeDefinition() == typeof(List<>))
        {
            var list = (System.Collections.IList)Activator.CreateInstance(type)!;
            foreach (var name in names) list.Add(Enum.Parse(type.GetGenericArguments()[0], name));
            return list;
        }
        return value;
    }
    public Task<object> InvokeApi(object api, string name, params object?[] values) => InvokeMethod(api, api.GetType().GetMethod(name, BindingFlags.Public | BindingFlags.Instance) ?? throw new MissingMethodException(api.GetType().FullName, name), values);
    public async Task<object> InvokeMethod(object api, MethodInfo method, params object?[] values)
    {
        var arguments = method.GetParameters().Select((p, i) => i < values.Length ? ConvertArgument(p.ParameterType, values[i]) : p.ParameterType == typeof(CancellationToken) ? CancellationToken.None : p.HasDefaultValue ? Type.Missing : throw new InvalidOperationException($"{method.Name} requires '{p.Name}'.")).ToArray();
        var task = method.Invoke(api, arguments) as Task ?? throw new InvalidOperationException($"{method.Name} did not return a Task.");
        await task;
        return task.GetType().GetProperty("Result")?.GetValue(task) ?? new object();
    }
    public object ResponseBody(object response) => response.GetType().GetMethod("Ok", Type.EmptyTypes) is { } method ? method.Invoke(response, null) ?? throw new InvalidOperationException("SDK returned no successful response body.") : response;
    public T Property<T>(object value, string name) => value.GetType().GetProperty(name)?.GetValue(value) is T result ? result : throw new InvalidOperationException($"{value.GetType().Name} omitted {name}.");
    public void RequireOk(object response) => AssertSuccess(response);
    private static void AssertSuccess(object response)
    {
        // httpclient methods throw on non-success; generichost returns a response wrapper.
        // Redaction returns 204, so IsOk (200) alone is not a success check.
        if (response.GetType().GetProperty("IsSuccessStatusCode")?.GetValue(response) is bool success)
        {
            if (!success) throw new InvalidOperationException($"SDK response was {response.GetType().GetProperty("StatusCode")?.GetValue(response)} {response.GetType().GetProperty("ReasonPhrase")?.GetValue(response)}.");
            if (Convert.ToInt32(response.GetType().GetProperty("StatusCode")?.GetValue(response)) == 204) return;
        }
        if (response.GetType().GetProperty("IsOk")?.GetValue(response) is false) throw new InvalidOperationException($"SDK response was not successful: {response.GetType().Name}.");
        // Legacy wrappers defer deserialization until Ok() is called. A 200
        // alone does not establish that the SDK can consume the response body.
        if (response.GetType().GetMethod("Ok", Type.EmptyTypes) is { } materialize && materialize.Invoke(response, null) is null)
            throw new InvalidOperationException("SDK returned no successful response body.");
    }
    public void Require(bool value, string message) { if (!value) throw new InvalidOperationException(message); }
    public async Task<string> RegisteredRedirectUrl()
    {
        var response = await InvokeApi(RedirectUris, "ListAsync", 1, 100); RequireOk(response);
        foreach (var value in Property<System.Collections.IEnumerable>(ResponseBody(response), "Uris"))
        {
            var text = Property<string>(value, "Uri");
            if (Uri.TryCreate(text, UriKind.Absolute, out var parsed) && parsed.Scheme is "http" or "https") return text;
        }
        throw new InvalidOperationException("The test environment must have an HTTP(S) redirect URI.");
    }
    private static string Required(string name) => Environment.GetEnvironmentVariable(name) is { Length: > 0 } value ? value : throw new InvalidOperationException($"{name} is required.");
    private static void AssertJson(JsonNode? serialized, JsonNode? expected, string path, bool exact)
    {
        if (serialized is null || expected is null)
        {
            if (serialized != expected) throw new InvalidOperationException($"{path}: values differ.");
            return;
        }
        if (serialized is JsonObject actualObject && expected is JsonObject expectedObject)
        {
            foreach (var (name, value) in actualObject)
                if (expectedObject.TryGetPropertyValue(name, out var expectedValue)) AssertJson(value, expectedValue, $"{path}.{name}", exact);
            if (exact && expectedObject.Any(pair => !actualObject.ContainsKey(pair.Key))) throw new InvalidOperationException($"{path}: SDK omitted field(s) from fixture.");
            return;
        }
        if (serialized is JsonArray actualArray && expected is JsonArray expectedArray)
        {
            if (actualArray.Count != expectedArray.Count) throw new InvalidOperationException($"{path}: array length differs.");
            for (var i = 0; i < actualArray.Count; i++) AssertJson(actualArray[i], expectedArray[i], $"{path}[{i}]", exact);
            return;
        }
        if (serialized is JsonValue actualNumber && expected is JsonValue expectedNumber
            && actualNumber.TryGetValue<decimal>(out var a) && expectedNumber.TryGetValue<decimal>(out var b) && a == b) return;
        if (serialized.ToJsonString() != expected.ToJsonString() && !EquivalentTimestamp(serialized, expected)) throw new InvalidOperationException($"{path}: values differ.");
    }
    private static bool EquivalentTimestamp(JsonNode left, JsonNode right) => TryTimestamp(left, out var a) && TryTimestamp(right, out var b) && a == b;
    private static bool TryTimestamp(JsonNode value, out DateTimeOffset timestamp) { timestamp = default; return value is JsonValue scalar && scalar.TryGetValue<string>(out var text) && text.Length >= 10 && text[4] == '-' && text[7] == '-' && (text.Length == 10 || text[10] is 'T' or ' ') && DateTimeOffset.TryParse(text, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out timestamp); }
}
