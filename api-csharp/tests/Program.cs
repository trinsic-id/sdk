using System.Diagnostics;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.Extensions.DependencyInjection;
using Trinsic.Api.Api;
using Trinsic.Api.Client;
using Trinsic.Api.Extensions;
using Trinsic.Api.Model;

var results = new List<object>();
var targetBaseUrl = Required("TRINSIC_TEST_BASE_URL").TrimEnd('/');
var accessToken = Required("TRINSIC_TEST_ACCESS_TOKEN");
var profileId = Guid.Parse(Required("TRINSIC_TEST_VERIFICATION_PROFILE_ID"));
var isCurrent = Environment.GetEnvironmentVariable("SDK_IS_CURRENT") == "true";

var services = new ServiceCollection();
services.AddTrinsicApi(options => {
    options.AddTokens(new BearerToken(accessToken));
    options.AddTrinsicApiHttpClients(client => client.BaseAddress = new Uri(targetBaseUrl));
});
using var provider = services.BuildServiceProvider();
var providersApi = provider.GetRequiredService<IProvidersApi>();
var verificationProfilesApi = provider.GetRequiredService<IVerificationProfilesApi>();
var sessionsApi = provider.GetRequiredService<ISessionsApi>();
var redirectUrisApi = provider.GetRequiredService<IRedirectUrisApi>();
providersApi.SetAuthToken(accessToken);
verificationProfilesApi.SetAuthToken(accessToken);
sessionsApi.SetAuthToken(accessToken);
redirectUrisApi.SetAuthToken(accessToken);

await Record("api.providers.list", async () => {
    var response = await providersApi.ListProvidersAsync();
    RequireOk(response);
});
await Record("api.verification-profiles.list", async () => {
    var response = await verificationProfilesApi.ListVerificationProfilesAsync();
    RequireOk(response);
});
await Record("api.verification-profiles.get-by-id", async () => {
    var response = await verificationProfilesApi.GetVerificationProfileByIdAsync(profileId);
    RequireOk(response);
});
await Record("api.sessions.list", async () => {
    var response = await sessionsApi.ListSessionsAsync(profileId);
    RequireOk(response);
});
await Record("api.redirect-uris.list", async () => {
    var response = await redirectUrisApi.ListAsync();
    RequireOk(response);
});
await Record("api.providers.get", async () => RequireOk(await providersApi.GetProviderAsync("trinsic-test-redirect")));
var redirectUrl = await RegisteredRedirectUrl();
await Record("api.sessions.create-hosted-provider", async () => {
    var response = await sessionsApi.CreateHostedProviderSessionAsync(new(new CreateHostedProviderSessionRequest("trinsic-test-redirect", redirectUrl, profileId)));
    RequireOk(response);
    var session = response.Ok() ?? throw new InvalidOperationException("Hosted-session response was empty.");
    Require(!string.IsNullOrWhiteSpace(session.LaunchUrl), "Hosted session omitted launchUrl.");
    Require(!string.IsNullOrWhiteSpace(session.ResultsAccessKey), "Hosted session omitted resultsAccessKey.");
    RequireOk(await sessionsApi.CancelSessionAsync(session.SessionId));
});
Guid directSessionId = Guid.Empty;
await Record("api.sessions.create-direct-provider", async () => {
    var request = new CreateDirectProviderSessionRequest(new() { IntegrationCapability.LaunchBrowser, IntegrationCapability.CaptureRedirect }, "trinsic-test-redirect", profileId) { RedirectUrl = redirectUrl, FallbackToHostedUI = false };
    var response = await sessionsApi.CreateDirectProviderSessionAsync(new(request));
    RequireOk(response);
    var session = response.Ok() ?? throw new InvalidOperationException("Direct-session response was empty.");
    directSessionId = session.SessionId;
    Require(!string.IsNullOrWhiteSpace(session.NextStep.Content), "Direct session omitted launch content.");
    Require(!string.IsNullOrWhiteSpace(session.ResultCollection.ResultsAccessKey), "Direct session omitted resultsAccessKey.");
});
await Record("api.sessions.get", async () => { Require(directSessionId != Guid.Empty, "Direct session was not created."); RequireOk(await sessionsApi.GetSessionAsync(directSessionId)); });
await Record("api.sessions.cancel", async () => { Require(directSessionId != Guid.Empty, "Direct session was not created."); RequireOk(await sessionsApi.CancelSessionAsync(directSessionId)); });
await Record("api.sessions.recommend-providers", async () => RequireOk(await sessionsApi.RecommendProvidersAsync(new(new RecommendProvidersRequest(profileId) { Health = RecommendProviderHealthOption.All }))));

var serializerOptions = provider.GetRequiredService<JsonSerializerOptionsProvider>().Options;
using var fixtureClient = new HttpClient { BaseAddress = new Uri(targetBaseUrl) };
fixtureClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
var catalogResponse = await fixtureClient.GetAsync("/api/v1/providers/sample-json/outputs");
if (!catalogResponse.IsSuccessStatusCode) {
    await Record("serialization.provider-output-round-trip", () => throw new InvalidOperationException($"Provider-output fixture catalog returned HTTP {(int)catalogResponse.StatusCode}."), new { scope = "catalog" });
} else {
    var catalog = JsonNode.Parse(await catalogResponse.Content.ReadAsStringAsync())?.AsArray()
        ?? throw new InvalidOperationException("Provider-output fixture catalog was not an array.");
    foreach (var item in catalog) {
        var fixture = item?.AsObject() ?? throw new InvalidOperationException("Provider-output fixture was not an object.");
        var providerId = fixture["providerId"]?.GetValue<string>() ?? throw new InvalidOperationException("Provider-output fixture omitted providerId.");
        var isPublic = fixture["hasPublicSdkModel"]?.GetValue<bool>() ?? false;
        var modelName = fixture["sdkModelName"]?.GetValue<string>();
        var parameters = new Dictionary<string, string> { ["providerId"] = providerId };
        if (modelName is not null) parameters["sdkModelName"] = modelName;
        if (!isPublic || modelName is null) {
            results.Add(new { id = "serialization.provider-output-round-trip", status = "skipped", durationMs = 0L, parameters, skipReason = "Provider has no public Swagger provider-specific output model." });
            continue;
        }
        var modelType = typeof(BearerToken).Assembly.GetType($"Trinsic.Api.Model.{modelName}");
        if (modelType is null) {
            if (isCurrent) await Record("serialization.provider-output-round-trip", () => throw new InvalidOperationException($"Connect declares {providerId}'s {modelName} output as public, but this SDK does not export {modelName}."), parameters);
            else results.Add(new { id = "serialization.provider-output-round-trip", status = "skipped", durationMs = 0L, parameters, skipReason = "The published SDK does not expose this provider-output model." });
            continue;
        }
        await Record("serialization.provider-output-round-trip", async () => {
            var response = await fixtureClient.GetAsync($"/api/v1/providers/{Uri.EscapeDataString(providerId)}/sample-json/output");
            response.EnsureSuccessStatusCode();
            var raw = JsonNode.Parse(await response.Content.ReadAsStringAsync()) ?? throw new InvalidOperationException("Fixture JSON was empty.");
            var model = JsonSerializer.Deserialize(raw.ToJsonString(), modelType, serializerOptions) ?? throw new InvalidOperationException($"{modelName} deserialized to null.");
            var serialized = JsonNode.Parse(JsonSerializer.Serialize(model, modelType, serializerOptions)) ?? throw new InvalidOperationException($"{modelName} serialized to empty JSON.");
            AssertJson(serialized, raw, providerId, isCurrent);
        }, parameters);
    }
}

var output = Required("SDK_COMPATIBILITY_RESULT_FILE");
await File.WriteAllTextAsync(output, JsonSerializer.Serialize(new { schemaVersion = 1, testCases = results }, new JsonSerializerOptions { WriteIndented = true }) + "\n");
Environment.ExitCode = results.Any(result => result.GetType().GetProperty("status")?.GetValue(result)?.ToString() == "failed") ? 1 : 0;

async Task Record(string id, Func<Task> action, object? parameters = null)
{
    var timer = Stopwatch.StartNew();
    try {
        await action();
        results.Add(new { id, status = "passed", durationMs = timer.ElapsedMilliseconds, parameters });
    }
    catch (Exception error)
    {
        results.Add(new { id, status = "failed", durationMs = timer.ElapsedMilliseconds, parameters, failure = new { name = error.GetType().Name, message = error.ToString() } });
    }
}

static void RequireOk(object response)
{
    if (response is IApiResponse apiResponse && !apiResponse.IsSuccessStatusCode)
    {
        var content = apiResponse.RawContent.Length > 500 ? $"{apiResponse.RawContent[..500]}…" : apiResponse.RawContent;
        throw new InvalidOperationException($"SDK response was {(int)apiResponse.StatusCode} {apiResponse.ReasonPhrase}: {content}");
    }
    var isOk = response.GetType().GetProperty("IsOk")?.GetValue(response) as bool?;
    if (isOk != true) throw new InvalidOperationException($"SDK response was not successful: {response.GetType().Name}.");
}

static string Required(string name) => Environment.GetEnvironmentVariable(name) is { Length: > 0 } value
    ? value : throw new InvalidOperationException($"{name} is required.");

async Task<string> RegisteredRedirectUrl()
{
    var response = await redirectUrisApi.ListAsync(new(1), new(100));
    RequireOk(response);
    var uri = response.Ok()?.Uris.Select(value => value.Uri).FirstOrDefault(value => Uri.TryCreate(value, UriKind.Absolute, out var parsed) && (parsed.Scheme == Uri.UriSchemeHttp || parsed.Scheme == Uri.UriSchemeHttps));
    return uri ?? throw new InvalidOperationException("The test environment must have an HTTP(S) redirect URI.");
}
static void Require(bool value, string message) { if (!value) throw new InvalidOperationException(message); }

static void AssertJson(JsonNode serialized, JsonNode raw, string path, bool exact)
{
    if (serialized is JsonObject serializedObject && raw is JsonObject rawObject) {
        foreach (var (name, value) in serializedObject) {
            if (!rawObject.TryGetPropertyValue(name, out var rawValue)) throw new InvalidOperationException($"{path}: SDK emitted field absent from fixture: {name}.");
            if (value is not null && rawValue is not null) AssertJson(value, rawValue, $"{path}.{name}", exact);
            else if (value?.ToJsonString() != rawValue?.ToJsonString()) throw new InvalidOperationException($"{path}.{name}: null mismatch.");
        }
        if (exact && !serializedObject.Select(pair => pair.Key).Order().SequenceEqual(rawObject.Select(pair => pair.Key).Order())) throw new InvalidOperationException($"{path}: field names differ.");
        return;
    }
    if (serialized is JsonArray serializedArray && raw is JsonArray rawArray) {
        if (serializedArray.Count != rawArray.Count) throw new InvalidOperationException($"{path}: array length differs.");
        for (var index = 0; index < serializedArray.Count; index++) AssertJson(serializedArray[index]!, rawArray[index]!, $"{path}[{index}]", exact);
        return;
    }
    if (serialized.ToJsonString() != raw.ToJsonString()) throw new InvalidOperationException($"{path}: values differ.");
}
