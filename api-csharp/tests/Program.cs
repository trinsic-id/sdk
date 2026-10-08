using System.Diagnostics;
using System.Net.Http.Headers;
using System.Reflection;
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
var providerGetMethod = providersApi.GetType().GetMethod("GetProviderAsync", BindingFlags.Public | BindingFlags.Instance);
if (providerGetMethod is null) {
    Skip("api.providers.get", "This SDK does not expose GetProviderAsync.");
} else {
    await Record("api.providers.get", async () => RequireOk(await InvokeMethod(providersApi, providerGetMethod, "trinsic-test-redirect")));
}
await Record("api.sessions.create-hosted-provider", async () => {
    var redirectUrl = await RegisteredRedirectUrl();
    var request = CreateRequest("CreateHostedProviderSessionRequest", new Dictionary<string, object?> {
        ["enableRedirectBackwardsCompatibility"] = false,
        ["provider"] = "trinsic-test-redirect",
        ["redirectUrl"] = redirectUrl,
        ["verificationProfileId"] = profileId,
    });
    var response = await InvokeApi(sessionsApi, "CreateHostedProviderSessionAsync", request);
    RequireOk(response);
    var session = ResponseBody(response);
    Require(!string.IsNullOrWhiteSpace(Property<string>(session, "LaunchUrl")), "Hosted session omitted launchUrl.");
    Require(!string.IsNullOrWhiteSpace(Property<string>(session, "ResultsAccessKey")), "Hosted session omitted resultsAccessKey.");
    RequireOk(await sessionsApi.CancelSessionAsync(Property<Guid>(session, "SessionId")));
});
Guid directSessionId = Guid.Empty;
await Record("api.sessions.create-direct-provider", async () => {
    var redirectUrl = await RegisteredRedirectUrl();
    var request = CreateRequest("CreateDirectProviderSessionRequest", new Dictionary<string, object?> {
        ["capabilities"] = new[] { "LaunchBrowser", "CaptureRedirect" },
        ["enableRedirectBackwardsCompatibility"] = false,
        ["provider"] = "trinsic-test-redirect",
        ["verificationProfileId"] = profileId,
        ["fallbackToHostedUI"] = false,
        ["redirectUrl"] = redirectUrl,
    });
    var response = await InvokeApi(sessionsApi, "CreateDirectProviderSessionAsync", request);
    RequireOk(response);
    var session = ResponseBody(response);
    directSessionId = Property<Guid>(session, "SessionId");
    var nextStep = Property<object>(session, "NextStep");
    var resultCollection = Property<object>(session, "ResultCollection");
    Require(!string.IsNullOrWhiteSpace(Property<string>(nextStep, "Content")), "Direct session omitted launch content.");
    Require(!string.IsNullOrWhiteSpace(Property<string>(resultCollection, "ResultsAccessKey")), "Direct session omitted resultsAccessKey.");
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

void Skip(string id, string reason, object? parameters = null) =>
    results.Add(new { id, status = "skipped", durationMs = 0L, parameters, skipReason = reason });

object CreateRequest(string modelName, IReadOnlyDictionary<string, object?> values)
{
    var modelType = typeof(BearerToken).Assembly.GetType($"Trinsic.Api.Model.{modelName}")
        ?? throw new InvalidOperationException($"SDK does not export {modelName}.");
    var constructor = modelType.GetConstructors()
        .OrderByDescending(candidate => candidate.GetParameters().Length)
        .FirstOrDefault() ?? throw new InvalidOperationException($"{modelName} has no public constructor.");
    var arguments = constructor.GetParameters().Select(parameter => RequestArgument(parameter, values)).ToArray();
    return constructor.Invoke(arguments);
}

object? RequestArgument(ParameterInfo parameter, IReadOnlyDictionary<string, object?> values)
{
    if (values.TryGetValue(parameter.Name ?? string.Empty, out var value)) {
        if (value is string[] names && parameter.ParameterType.IsGenericType && parameter.ParameterType.GetGenericTypeDefinition() == typeof(List<>)) {
            var enumType = parameter.ParameterType.GetGenericArguments()[0];
            var list = (System.Collections.IList)(Activator.CreateInstance(parameter.ParameterType)
                ?? throw new InvalidOperationException($"Could not create {parameter.ParameterType.Name}."));
            foreach (var name in names) list.Add(Enum.Parse(enumType, name));
            return list;
        }
        return value;
    }
    if (parameter.HasDefaultValue) return Type.Missing;
    throw new InvalidOperationException($"{parameter.Member.DeclaringType?.Name} requires unsupported constructor argument '{parameter.Name}'.");
}

async Task<object> InvokeApi(object api, string methodName, object? firstArgument = null)
{
    var method = api.GetType().GetMethod(methodName, BindingFlags.Public | BindingFlags.Instance)
        ?? throw new MissingMethodException(api.GetType().FullName, methodName);
    return await InvokeMethod(api, method, firstArgument);
}

async Task<object> InvokeMethod(object api, MethodInfo method, object? firstArgument = null)
{
    var parameters = method.GetParameters();
    var arguments = new object?[parameters.Length];
    for (var index = 0; index < parameters.Length; index++) {
        var parameter = parameters[index];
        if (index == 0 && firstArgument is not null) {
            arguments[index] = parameter.ParameterType.IsGenericType && parameter.ParameterType.GetGenericTypeDefinition().Name == "Option`1"
                ? Activator.CreateInstance(parameter.ParameterType, firstArgument)
                : firstArgument;
        } else if (parameter.ParameterType == typeof(CancellationToken)) {
            arguments[index] = CancellationToken.None;
        } else if (parameter.HasDefaultValue) {
            arguments[index] = Type.Missing;
        } else {
            throw new InvalidOperationException($"{method.Name} requires unsupported argument '{parameter.Name}'.");
        }
    }
    var task = method.Invoke(api, arguments) as Task
        ?? throw new InvalidOperationException($"{method.Name} did not return a Task.");
    await task;
    return task.GetType().GetProperty("Result")?.GetValue(task)
        ?? throw new InvalidOperationException($"{method.Name} returned no response.");
}

static object ResponseBody(object response) => response.GetType().GetMethod("Ok", Type.EmptyTypes)?.Invoke(response, null)
    ?? throw new InvalidOperationException($"{response.GetType().Name} returned no successful response body.");

static T Property<T>(object value, string propertyName)
{
    var property = value.GetType().GetProperty(propertyName)
        ?? throw new InvalidOperationException($"{value.GetType().Name} omitted {propertyName}.");
    var result = property.GetValue(value);
    return result is T typed ? typed : throw new InvalidOperationException($"{value.GetType().Name}.{propertyName} was null or had an unexpected type.");
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
