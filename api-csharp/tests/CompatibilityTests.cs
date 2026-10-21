using System.Diagnostics;
using System.Globalization;
using System.Net.Http.Headers;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.Extensions.DependencyInjection;
using Trinsic.Api.Api;
using Trinsic.Api.Client;
using Trinsic.Api.Extensions;
using Trinsic.Api.Model;
using Xunit;

[assembly: CollectionBehavior(DisableTestParallelization = true)]

public sealed class CompatibilityTests : IClassFixture<CompatibilityFixture>
{
    private readonly CompatibilityFixture fixture;
    public CompatibilityTests(CompatibilityFixture fixture) => this.fixture = fixture;

    [Fact] public Task ListProviders() => fixture.Check("api.providers.list", async () => fixture.RequireOk(await fixture.Providers.ListProvidersAsync()));
    [Fact] public Task ListVerificationProfiles() => fixture.Check("api.verification-profiles.list", async () => fixture.RequireOk(await fixture.VerificationProfiles.ListVerificationProfilesAsync()));
    [Fact] public Task GetVerificationProfile() => fixture.Check("api.verification-profiles.get-by-id", async () => fixture.RequireOk(await fixture.VerificationProfiles.GetVerificationProfileByIdAsync(fixture.ProfileId)));
    [Fact] public Task ListSessions() => fixture.Check("api.sessions.list", async () => fixture.RequireOk(await fixture.Sessions.ListSessionsAsync(fixture.ProfileId)));
    [Fact] public Task ListRedirectUris() => fixture.Check("api.redirect-uris.list", async () => fixture.RequireOk(await fixture.RedirectUris.ListAsync()));

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
        fixture.RequireOk(await fixture.Sessions.CancelSessionAsync(fixture.Property<Guid>(session, "SessionId")));
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
        await fixture.Check("api.sessions.get", async () => fixture.RequireOk(await fixture.Sessions.GetSessionAsync(sessionId)));
        await fixture.Check("api.sessions.cancel", async () => fixture.RequireOk(await fixture.Sessions.CancelSessionAsync(sessionId)));
    }

    [Fact]
    public Task RecommendProviders() => fixture.Check("api.sessions.recommend-providers", async () => fixture.RequireOk(await fixture.Sessions.RecommendProvidersAsync(new(new RecommendProvidersRequest(fixture.ProfileId) { Health = RecommendProviderHealthOption.All }))));

    [Fact] public Task ProviderOutputFixturesRoundTrip() => fixture.ProviderOutputs();
}

public sealed class CompatibilityFixture : IAsyncLifetime, IDisposable
{
    private readonly List<object> results = [];
    private readonly ServiceProvider provider;
    private readonly string targetBaseUrl = Required("TRINSIC_TEST_BASE_URL").TrimEnd('/');
    private readonly string accessToken = Required("TRINSIC_TEST_ACCESS_TOKEN");
    private readonly bool isCurrent = Environment.GetEnvironmentVariable("SDK_IS_CURRENT") == "true";
    private readonly bool allowMissingModels = string.Equals(Environment.GetEnvironmentVariable("SDK_COMPATIBILITY_ALLOW_MISSING_PSO_MODELS"), "true", StringComparison.OrdinalIgnoreCase) || Environment.GetEnvironmentVariable("SDK_COMPATIBILITY_ALLOW_MISSING_PSO_MODELS") == "1";
    private readonly JsonSerializerOptions serializerOptions;

    public CompatibilityFixture()
    {
        ProfileId = Guid.Parse(Required("TRINSIC_TEST_VERIFICATION_PROFILE_ID"));
        var services = new ServiceCollection();
        services.AddTrinsicApi(options => { options.AddTokens(new BearerToken(accessToken)); options.AddTrinsicApiHttpClients(client => client.BaseAddress = new Uri(targetBaseUrl)); });
        provider = services.BuildServiceProvider();
        Providers = provider.GetRequiredService<IProvidersApi>(); VerificationProfiles = provider.GetRequiredService<IVerificationProfilesApi>();
        Sessions = provider.GetRequiredService<ISessionsApi>(); RedirectUris = provider.GetRequiredService<IRedirectUrisApi>();
        foreach (var api in new object[] { Providers, VerificationProfiles, Sessions, RedirectUris }) api.GetType().GetMethod("SetAuthToken")?.Invoke(api, [accessToken]);
        serializerOptions = provider.GetRequiredService<JsonSerializerOptionsProvider>().Options;
    }

    public Guid ProfileId { get; }
    public IProvidersApi Providers { get; }
    public IVerificationProfilesApi VerificationProfiles { get; }
    public ISessionsApi Sessions { get; }
    public IRedirectUrisApi RedirectUris { get; }
    public Task InitializeAsync() => Task.CompletedTask;
    public async Task DisposeAsync() { if (Environment.GetEnvironmentVariable("SDK_COMPATIBILITY_RESULT_FILE") is { Length: > 0 } output) await File.WriteAllTextAsync(output, JsonSerializer.Serialize(new { schemaVersion = 1, testCases = results }, new JsonSerializerOptions { WriteIndented = true }) + "\n"); Dispose(); }
    public void Dispose() => provider.Dispose();

    public async Task Check(string id, Func<Task> action, object? parameters = null)
    {
        var error = await Record(id, action, parameters);
        if (error is not null) throw new Xunit.Sdk.XunitException(error.Message);
    }
    public void Skip(string id, string reason, object? parameters = null) => results.Add(new { id, status = "skipped", durationMs = 0L, parameters, skipReason = reason });

    public async Task ProviderOutputs()
    {
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
            var providerId = fixture["providerId"]?.GetValue<string>() ?? throw new InvalidOperationException("Provider-output fixture omitted providerId.");
            var modelName = fixture["sdkModelName"]?.GetValue<string>(); var isPublic = fixture["hasPublicSdkModel"]?.GetValue<bool>() ?? false;
            var parameters = new Dictionary<string, string> { ["providerId"] = providerId }; if (modelName is not null) parameters["sdkModelName"] = modelName;
            if (!isPublic || modelName is null) { Skip("serialization.provider-output-round-trip", "Provider has no public Swagger provider-specific output model.", parameters); continue; }
            var modelType = typeof(BearerToken).Assembly.GetType($"Trinsic.Api.Model.{modelName}");
            if (modelType is null) { if (isCurrent && !allowMissingModels) await Record("serialization.provider-output-round-trip", () => throw new InvalidOperationException($"Connect declares {providerId}'s {modelName} output as public, but this SDK does not export {modelName}."), parameters); else Skip("serialization.provider-output-round-trip", isCurrent ? "Missing public provider-output models are temporarily allowed by SDK_COMPATIBILITY_ALLOW_MISSING_PSO_MODELS." : "The published SDK does not expose this provider-output model.", parameters); continue; }
            await Record("serialization.provider-output-round-trip", () => {
                var raw = hasCachedCatalog
                    ? fixture["output"] ?? throw new InvalidOperationException($"Cached fixture {providerId} omitted output.")
                    : JsonNode.Parse(client.GetStringAsync($"/api/v1/providers/{Uri.EscapeDataString(providerId)}/sample-json/output").GetAwaiter().GetResult()) ?? throw new InvalidOperationException("Fixture JSON was empty.");
                var model = JsonSerializer.Deserialize(raw.ToJsonString(), modelType, serializerOptions) ?? throw new InvalidOperationException($"{modelName} deserialized to null.");
                var serialized = JsonNode.Parse(JsonSerializer.Serialize(model, modelType, serializerOptions)) ?? throw new InvalidOperationException($"{modelName} serialized to empty JSON.");
                AssertJson(serialized, hasCachedCatalog ? fixture["serializationOutput"] ?? raw : raw, providerId, isCurrent); return Task.CompletedTask;
            }, parameters);
        }
    }

    private async Task<Exception?> Record(string id, Func<Task> action, object? parameters = null) { var timer = Stopwatch.StartNew(); try { await action(); results.Add(new { id, status = "passed", durationMs = timer.ElapsedMilliseconds, parameters }); return null; } catch (Exception error) { results.Add(new { id, status = "failed", durationMs = timer.ElapsedMilliseconds, parameters, failure = new { name = error.GetType().Name, message = error.ToString() } }); return error; } }
    public object CreateRequest(string modelName, IReadOnlyDictionary<string, object?> values) { var type = typeof(BearerToken).Assembly.GetType($"Trinsic.Api.Model.{modelName}") ?? throw new InvalidOperationException($"SDK does not export {modelName}."); var constructor = type.GetConstructors().OrderByDescending(c => c.GetParameters().Length).First(); return constructor.Invoke(constructor.GetParameters().Select(p => RequestArgument(p, values)).ToArray()); }
    private static object? RequestArgument(ParameterInfo parameter, IReadOnlyDictionary<string, object?> values) { if (values.TryGetValue(parameter.Name ?? string.Empty, out var value)) { if (parameter.ParameterType.IsGenericType && parameter.ParameterType.GetGenericTypeDefinition().Name == "Option`1") return Activator.CreateInstance(parameter.ParameterType, value); if (value is string[] names && parameter.ParameterType.IsGenericType && parameter.ParameterType.GetGenericTypeDefinition() == typeof(List<>)) { var list = (System.Collections.IList)Activator.CreateInstance(parameter.ParameterType)!; foreach (var name in names) list.Add(Enum.Parse(parameter.ParameterType.GetGenericArguments()[0], name)); return list; } return value; } return parameter.HasDefaultValue ? Type.Missing : throw new InvalidOperationException($"{parameter.Member.DeclaringType?.Name} requires unsupported constructor argument '{parameter.Name}'."); }
    public async Task<object> InvokeApi(object api, string methodName, object? firstArgument = null) => await InvokeMethod(api, api.GetType().GetMethod(methodName, BindingFlags.Public | BindingFlags.Instance) ?? throw new MissingMethodException(api.GetType().FullName, methodName), firstArgument);
    public async Task<object> InvokeMethod(object api, MethodInfo method, object? firstArgument = null) { var parameters = method.GetParameters(); var arguments = new object?[parameters.Length]; for (var index = 0; index < parameters.Length; index++) { var parameter = parameters[index]; if (index == 0 && firstArgument is not null) arguments[index] = parameter.ParameterType.IsGenericType && parameter.ParameterType.GetGenericTypeDefinition().Name == "Option`1" ? Activator.CreateInstance(parameter.ParameterType, firstArgument) : firstArgument; else if (parameter.ParameterType == typeof(CancellationToken)) arguments[index] = CancellationToken.None; else if (parameter.HasDefaultValue) arguments[index] = Type.Missing; else throw new InvalidOperationException($"{method.Name} requires unsupported argument '{parameter.Name}'."); } var task = method.Invoke(api, arguments) as Task ?? throw new InvalidOperationException($"{method.Name} did not return a Task."); await task; return task.GetType().GetProperty("Result")?.GetValue(task) ?? throw new InvalidOperationException($"{method.Name} returned no response."); }
    public object ResponseBody(object response) => response.GetType().GetMethod("Ok", Type.EmptyTypes)?.Invoke(response, null) ?? throw new InvalidOperationException($"{response.GetType().Name} returned no successful response body.");
    public T Property<T>(object value, string name) => value.GetType().GetProperty(name)?.GetValue(value) is T result ? result : throw new InvalidOperationException($"{value.GetType().Name} omitted {name}.");
    public void RequireOk(object response) { if (response is IApiResponse api && !api.IsSuccessStatusCode) throw new InvalidOperationException($"SDK response was {(int)api.StatusCode} {api.ReasonPhrase}."); if (response.GetType().GetProperty("IsOk")?.GetValue(response) as bool? != true) throw new InvalidOperationException($"SDK response was not successful: {response.GetType().Name}."); }
    public void Require(bool value, string message) { if (!value) throw new InvalidOperationException(message); }
    public async Task<string> RegisteredRedirectUrl() { var response = await RedirectUris.ListAsync(new(1), new(100)); RequireOk(response); return response.Ok()?.Uris.Select(value => value.Uri).FirstOrDefault(value => Uri.TryCreate(value, UriKind.Absolute, out var parsed) && (parsed.Scheme == Uri.UriSchemeHttp || parsed.Scheme == Uri.UriSchemeHttps)) ?? throw new InvalidOperationException("The test environment must have an HTTP(S) redirect URI."); }
    private static string Required(string name) => Environment.GetEnvironmentVariable(name) is { Length: > 0 } value ? value : throw new InvalidOperationException($"{name} is required.");
    private static void AssertJson(JsonNode serialized, JsonNode expected, string path, bool exact) { if (serialized is JsonObject actualObject && expected is JsonObject expectedObject) { foreach (var (name, value) in actualObject) if (expectedObject.TryGetPropertyValue(name, out var expectedValue) && value is not null && expectedValue is not null) AssertJson(value, expectedValue, $"{path}.{name}", exact); if (exact && expectedObject.Any(pair => !actualObject.ContainsKey(pair.Key))) throw new InvalidOperationException($"{path}: SDK omitted field(s) from fixture."); return; } if (serialized is JsonArray actualArray && expected is JsonArray expectedArray) { if (actualArray.Count != expectedArray.Count) throw new InvalidOperationException($"{path}: array length differs."); for (var i = 0; i < actualArray.Count; i++) AssertJson(actualArray[i]!, expectedArray[i]!, $"{path}[{i}]", exact); return; } if (serialized.ToJsonString() != expected.ToJsonString() && !EquivalentTimestamp(serialized, expected)) throw new InvalidOperationException($"{path}: values differ."); }
    private static bool EquivalentTimestamp(JsonNode left, JsonNode right) => TryTimestamp(left, out var a) && TryTimestamp(right, out var b) && a == b;
    private static bool TryTimestamp(JsonNode value, out DateTimeOffset timestamp) { timestamp = default; return value is JsonValue scalar && scalar.TryGetValue<string>(out var text) && text.Length >= 10 && text[4] == '-' && text[7] == '-' && (text.Length == 10 || text[10] is 'T' or ' ') && DateTimeOffset.TryParse(text, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out timestamp); }
}
