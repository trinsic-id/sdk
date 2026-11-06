using System.Diagnostics;
using System.Globalization;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.Extensions.DependencyInjection;
using Trinsic.Api.Extensions;
using Trinsic.Api.Api;
using Trinsic.Api.Client;
using Trinsic.Api.Model;
using Xunit;

[assembly: CollectionBehavior(DisableTestParallelization = true)]

public sealed class CompatibilityTests(CompatibilityFixture fixture) : IClassFixture<CompatibilityFixture>
{
    [Fact] public Task ListProviders() => fixture.Check("api.providers.list", async () => { CompatibilityFixture.Body(await fixture.Providers.ListProvidersAsync()); });
    [Fact] public Task GetProvider() => fixture.Check("api.providers.get", async () => { CompatibilityFixture.Body(await fixture.Providers.GetProviderAsync("trinsic-test-redirect")); });
    [Fact] public Task ListVerificationProfiles() => fixture.Check("api.verification-profiles.list", async () => { CompatibilityFixture.Body(await fixture.VerificationProfiles.ListVerificationProfilesAsync()); });
    [Fact] public Task GetVerificationProfile() => fixture.Check("api.verification-profiles.get-by-id", async () => { CompatibilityFixture.Body(await fixture.VerificationProfiles.GetVerificationProfileByIdAsync(fixture.ProfileId)); });
    [Fact] public Task ListSessions() => fixture.Check("api.sessions.list", async () => { CompatibilityFixture.Body(await fixture.Sessions.ListSessionsAsync(fixture.ProfileId)); });
    [Fact] public Task ListRedirectUris() => fixture.Check("api.redirect-uris.list", async () => { CompatibilityFixture.Body(await fixture.RedirectUris.ListAsync()); });
    [Fact] public Task RecommendProviders() => fixture.Check("api.sessions.recommend-providers", async () => { CompatibilityFixture.Body(await fixture.Sessions.RecommendProvidersAsync(new RecommendProvidersRequest(fixture.ProfileId))); });

    [Fact] public Task CreateHostedProviderSession() => fixture.Check("api.sessions.create-hosted-provider", async () =>
    {
        var request = new CreateHostedProviderSessionRequest("trinsic-test-redirect", await fixture.RegisteredRedirectUrl(), fixture.ProfileId);
        var session = CompatibilityFixture.Body(await fixture.Sessions.CreateHostedProviderSessionAsync(request));
        fixture.Track(session.SessionId);
        Assert.False(string.IsNullOrWhiteSpace(session.LaunchUrl));
        Assert.False(string.IsNullOrWhiteSpace(session.ResultsAccessKey));
    });
    [Fact] public Task CreateDirectProviderSession() => fixture.Check("api.sessions.create-direct-provider", async () => { await fixture.CreateDirect(); });
    [Fact] public Task GetSession() => fixture.Check("api.sessions.get", async () =>
    {
        var session = await fixture.CreateDirect();
        CompatibilityFixture.Body(await fixture.Sessions.GetSessionAsync(session.SessionId));
    });
    [Fact] public Task CancelSession() => fixture.Check("api.sessions.cancel", async () =>
    {
        var session = await fixture.CreateDirect();
        CompatibilityFixture.Body(await fixture.Sessions.CancelSessionAsync(session.SessionId));
    });
    [Fact] public Task GetSessionResult() => fixture.WithCompletedSession("api.sessions.get-result", async (sessionId, key) =>
    {
        CompatibilityFixture.Body(await fixture.Sessions.GetSessionResultAsync(sessionId, new GetSessionResultRequest(key)));
    });
    [Fact] public Task GetAttachment() => fixture.WithCompletedSession("api.sessions.get-attachment", async (sessionId, key) =>
    {
        var result = CompatibilityFixture.Body(await fixture.Sessions.GetSessionResultAsync(sessionId, new GetSessionResultRequest(key)));
        Assert.NotEmpty(result.IdentityData.Attachments);
        CompatibilityFixture.Body(await fixture.Sessions.GetAttachmentAsync(sessionId, result.IdentityData.Attachments[0].Id, new GetAttachmentRequest(key)));
    });
    [Fact] public Task RedactSession() => fixture.WithCompletedSession("api.sessions.redact", async (sessionId, _) =>
    {
        CompatibilityFixture.RequireSuccess(await fixture.Sessions.RedactSessionAsync(sessionId));
    });
    [Fact] public Task ProviderOutputFixturesRoundTrip() => fixture.ProviderOutputs();
}

public sealed class CompatibilityFixture : IAsyncLifetime
{
    private readonly List<object> results = [];
    private readonly HashSet<Guid> sessions = [];
    private int failureCount;
    private readonly ServiceProvider provider;
    private readonly JsonSerializerOptions serializerOptions;
    private static readonly Assembly SdkAssembly = typeof(SessionsApi).Assembly;

    public CompatibilityFixture()
    {
        ProfileId = Guid.Parse(Required("TRINSIC_TEST_VERIFICATION_PROFILE_ID"));
        var services = new ServiceCollection();
        services.AddTrinsicApi(options => {
            options.AddTokens(new BearerToken(Required("TRINSIC_TEST_ACCESS_TOKEN")));
            options.AddTrinsicApiHttpClients(client => client.BaseAddress = new Uri(Required("TRINSIC_TEST_BASE_URL").TrimEnd('/')));
        });
        provider = services.BuildServiceProvider();
        Providers = provider.GetRequiredService<IProvidersApi>();
        VerificationProfiles = provider.GetRequiredService<IVerificationProfilesApi>();
        Sessions = provider.GetRequiredService<ISessionsApi>();
        RedirectUris = provider.GetRequiredService<IRedirectUrisApi>();
        serializerOptions = provider.GetRequiredService<JsonSerializerOptionsProvider>().Options;
    }
    public Guid ProfileId { get; }
    public IProvidersApi Providers { get; }
    public IVerificationProfilesApi VerificationProfiles { get; }
    public ISessionsApi Sessions { get; }
    public IRedirectUrisApi RedirectUris { get; }
    public Task InitializeAsync() => Task.CompletedTask;
    public void Track(Guid sessionId) => sessions.Add(sessionId);
    public async Task DisposeAsync()
    {
        foreach (var sessionId in sessions)
        {
            try { await Sessions.CancelSessionAsync(sessionId); }
            catch { /* A completed or redacted session may no longer be cancellable. */ }
        }
        await File.WriteAllTextAsync(Required("SDK_COMPATIBILITY_RESULT_FILE"), JsonSerializer.Serialize(new { schemaVersion = 1, testCases = results }, new JsonSerializerOptions { WriteIndented = true }) + "\n");
        provider.Dispose();
    }
    public static void RequireSuccess(IApiResponse response) => Assert.True(response.IsSuccessStatusCode, $"SDK response was {response.StatusCode} {response.ReasonPhrase}.");
    public static T Body<T>(IOk<T?> response) where T : class
    {
        RequireSuccess((IApiResponse)response);
        // Ok() is the SDK's lazy deserializer: HTTP 200 alone is insufficient.
        return response.Ok() ?? throw new InvalidOperationException("SDK returned no successful response body.");
    }
    public Task<JsonNode> RoundTrip(JsonNode raw, Type modelType)
    {
        var model = JsonSerializer.Deserialize(raw.ToJsonString(), modelType, serializerOptions) ?? throw new InvalidOperationException("SDK deserialized to null.");
        return Task.FromResult(JsonNode.Parse(JsonSerializer.Serialize(model, modelType, serializerOptions))!);
    }
    public async Task Check(string id, Func<Task> action, object? parameters = null, [CallerMemberName] string nativeTest = "")
    {
        var error = await Record(id, action, parameters, nativeTest);
        if (error is not null) throw new Xunit.Sdk.XunitException(error.Message);
    }
    public void Skip(string id, string reason, object? parameters = null) => results.Add(new { id, status = "skipped", durationMs = 0L, parameters, skipReason = reason });
    public async Task<CreateDirectProviderSessionResponse> CreateDirect()
    {
        var request = new CreateDirectProviderSessionRequest(
            [IntegrationCapability.LaunchBrowser, IntegrationCapability.CaptureRedirect], "trinsic-test-redirect", ProfileId,
            fallbackToHostedUI: new Option<bool?>(false), redirectUrl: await RegisteredRedirectUrl());
        var session = Body(await Sessions.CreateDirectProviderSessionAsync(request));
        Track(session.SessionId);
        Assert.False(string.IsNullOrWhiteSpace(session.NextStep.Content));
        Assert.False(string.IsNullOrWhiteSpace(session.ResultCollection.ResultsAccessKey));
        return session;
    }
    public Task WithCompletedSession(string id, Func<Guid, string, Task> action, [CallerMemberName] string nativeTest = "") => Check(id, async () =>
    {
        var session = await CreateDirect();
        using var handler = new HttpClientHandler { AllowAutoRedirect = false, UseCookies = true };
        using var browser = new HttpClient(handler);
        var integration = await FollowRedirect(browser, new Uri(session.NextStep.Content));
        var callback = new Uri(QueryValue(integration, "redirectUrl"));
        var query = System.Web.HttpUtility.ParseQueryString(callback.Query); query["resultState"] = "success";
        var verification = await FollowRedirect(browser, new UriBuilder(callback) { Query = query.ToString() }.Uri);
        var completion = await FollowRedirect(browser, verification);
        var application = await FollowRedirect(browser, completion);
        Assert.False(string.IsNullOrWhiteSpace(QueryValue(application, "redirectToken")));
        // SDK 3.2.0 retrieves results with the access key; it has no redirectToken field.
        await action(session.SessionId, session.ResultCollection.ResultsAccessKey);
    }, nativeTest: nativeTest);
    private static string QueryValue(Uri uri, string name) => System.Web.HttpUtility.ParseQueryString(uri.Query)[name] ?? throw new InvalidOperationException($"Redirect omitted {name}.");
    private static async Task<Uri> FollowRedirect(HttpClient browser, Uri uri)
    {
        using var response = await browser.GetAsync(uri);
        if ((int)response.StatusCode / 100 != 3 || response.Headers.Location is not { } location) throw new InvalidOperationException($"Expected redirect, got {(int)response.StatusCode}.");
        return new Uri(uri, location);
    }
    public async Task<string> RegisteredRedirectUrl()
    {
        var response = Body(await RedirectUris.ListAsync(1, 100));
        return response.Uris.Select(value => value.Uri).FirstOrDefault(value => Uri.TryCreate(value, UriKind.Absolute, out var uri) && uri.Scheme is "http" or "https")
            ?? throw new InvalidOperationException("The test environment must have an HTTP(S) redirect URI.");
    }
    private static string Required(string name) => Environment.GetEnvironmentVariable(name) is { Length: > 0 } value ? value : throw new InvalidOperationException($"{name} is required.");
    public async Task ProviderOutputs()
    {
        var failuresBefore = failureCount;
        var cache = Required("SDK_COMPATIBILITY_PSO_FIXTURES_PATH");
        var catalog = JsonNode.Parse(await File.ReadAllTextAsync(cache))?["fixtures"]?.AsArray()
            ?? throw new InvalidOperationException("Provider-output fixture catalog was not an array.");
        foreach (var item in catalog)
        {
            var fixture = item?.AsObject() ?? throw new InvalidOperationException("Provider-output fixture was not an object.");
            var caseId = fixture["testCaseId"]?.GetValue<string>() ?? "serialization.provider-output-round-trip";
            var providerId = fixture["providerId"]?.GetValue<string>() ?? throw new InvalidOperationException("Provider-output fixture omitted providerId.");
            var modelName = fixture["sdkModelName"]?.GetValue<string>(); var isPublic = fixture["hasPublicSdkModel"]?.GetValue<bool>() ?? false;
            var parameters = new Dictionary<string, string> { ["providerId"] = providerId }; if (modelName is not null) parameters["sdkModelName"] = modelName;
            if (!isPublic || modelName is null) { Skip(caseId, "Provider has no public Swagger provider-specific output model.", parameters); continue; }
            var modelType = SdkAssembly.GetType($"Trinsic.Api.Model.{modelName}");
            if (modelType is null) { await Record(caseId, () => throw new InvalidOperationException($"SDK 3.2.0 does not export public model {modelName}."), parameters); continue; }
            await Record(caseId, async () => {
                var raw = fixture["output"] ?? throw new InvalidOperationException($"Cached fixture {providerId} omitted output.");
                var serialized = await RoundTrip(raw, modelType);
                AssertJson(serialized, fixture["serializationOutput"] ?? raw, providerId, fixture["testCaseId"] is not null);
            }, parameters);
        }
        if (failureCount > failuresBefore) throw new Xunit.Sdk.XunitException($"{failureCount - failuresBefore} serialization cases failed; see the structured report.");
    }

    private async Task<Exception?> Record(string id, Func<Task> action, object? parameters = null, string nativeTest = "ProviderOutputFixturesRoundTrip") { var timer = Stopwatch.StartNew(); try { await action(); results.Add(new { id, status = "passed", durationMs = timer.ElapsedMilliseconds, parameters }); return null; } catch (Exception error) { failureCount++; results.Add(new { id, status = "failed", durationMs = timer.ElapsedMilliseconds, parameters, nativeTest = $"CompatibilityTests.{nativeTest}", failure = new { name = error.GetType().Name, message = error.ToString() } }); return error; } }
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
