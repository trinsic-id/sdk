using System.Reflection;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.Extensions.DependencyInjection;
using Trinsic.Api.Extensions;
using Trinsic.Api.Model;
using Xunit;

public sealed class HarnessRegressionTests
{
    private const string SessionJson = """
        {"id":"00000000-0000-4000-8000-000000000001","done":false,"success":false,"created":1,"updated":1}
        """;
    private const string ProviderJson = """
        {"id":"provider","name":"Provider","logoUrl":"https://example.test/logo","subtext":"Description","health":"Healthy",
         "regions":[],"countries":["US"],"subdivisions":[],
         "subProviders":[{"id":"sub","name":"Sub","subtext":"Description","logoUrl":"https://example.test/sub"}]}
        """;

    private static JsonSerializerOptions SdkOptions()
    {
        var services = new ServiceCollection();
        services.AddTrinsicApi(_ => { });
        using var provider = services.BuildServiceProvider();
        return provider.GetRequiredService<Trinsic.Api.Client.JsonSerializerOptionsProvider>().Options;
    }

    private static void CompareResponse(object decoded, JsonNode wire, JsonSerializerOptions options) =>
        Compare(CompatibilityFixture.ModelFields(decoded, wire, true, options), CompatibilityFixture.ModelFields(decoded, wire, false, options), "response", true);

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void PublishedSessionModelPreservesEmptyAndNonemptyPages(bool populated)
    {
        var options = SdkOptions();
        var wire = JsonNode.Parse("{\"sessions\":[" + (populated ? SessionJson : "") + "],\"total\":" + (populated ? 1 : 0) + ",\"more\":false,\"futureField\":\"ignored\"}")!;
        var decoded = JsonSerializer.Deserialize<ListSessionsResponse>(wire, options)!;
        CompareResponse(decoded, wire, options);
    }

    [Theory]
    [InlineData("truncate")]
    [InlineData("id")]
    [InlineData("total")]
    [InlineData("more")]
    public void PublishedSessionModelRejectsChangedFields(string mutation)
    {
        var options = SdkOptions();
        var wire = JsonNode.Parse("{\"sessions\":[" + SessionJson + "],\"total\":1,\"more\":false}")!;
        var decoded = JsonSerializer.Deserialize<ListSessionsResponse>(wire, options)!;
        CompareResponse(decoded, wire, options);
        switch (mutation)
        {
            case "truncate": decoded.Sessions.Clear(); break;
            case "id": decoded.Sessions[0].Id = "00000000-0000-4000-8000-000000000002"; break;
            case "total": decoded.Total = 2; break;
            case "more": decoded.More = true; break;
        }
        var error = Record.Exception(() => CompareResponse(decoded, wire, options));
        Assert.NotNull(error);
        Assert.True(error is InvalidOperationException or Xunit.Sdk.XunitException, error.ToString());
    }

    [Theory]
    [InlineData(false, "unchanged")]
    [InlineData(false, "provider")]
    [InlineData(false, "country")]
    [InlineData(false, "subprovider")]
    [InlineData(true, "unchanged")]
    [InlineData(true, "provider")]
    [InlineData(true, "country")]
    [InlineData(true, "subprovider")]
    public void PublishedRecommendationModelPreservesNestedFields(bool remainder, string mutation)
    {
        var options = SdkOptions();
        var wire = JsonNode.Parse("{\"recommendedProviders\":[" + ProviderJson + "],\"remainder\":[" + ProviderJson + "],\"futureField\":\"ignored\"}")!;
        var decoded = JsonSerializer.Deserialize<RecommendProvidersResponse>(wire, options)!;
        CompareResponse(decoded, wire, options);
        var providers = remainder ? decoded.Remainder : decoded.RecommendedProviders;
        switch (mutation)
        {
            case "unchanged": return;
            case "provider": providers.Clear(); break;
            case "country": providers[0].Countries.Clear(); break;
            case "subprovider": providers[0].SubProviders![0].Name = "Changed"; break;
        }
        var error = Record.Exception(() => CompareResponse(decoded, wire, options));
        Assert.NotNull(error);
        Assert.True(error is InvalidOperationException or Xunit.Sdk.XunitException, error.ToString());
    }

    [Fact]
    public void SuccessfulHttpResponseMustDeserializeItsBody()
    {
        var services = new ServiceCollection();
        services.AddTrinsicApi(_ => { });
        using var provider = services.BuildServiceProvider();
        var options = provider.GetRequiredService<Trinsic.Api.Client.JsonSerializerOptionsProvider>().Options;
        using var request = new HttpRequestMessage(HttpMethod.Get, "http://localhost/api/v1/providers");
        using var response = new HttpResponseMessage(System.Net.HttpStatusCode.OK);
        var body = new Trinsic.Api.Api.ProvidersApi.ListProvidersApiResponse(
            Microsoft.Extensions.Logging.Abstractions.NullLogger<Trinsic.Api.Api.ProvidersApi.ListProvidersApiResponse>.Instance,
            request, response, "{\"providers\":\"not-an-array\"}", "/api/v1/providers", DateTime.UtcNow, options);
        Assert.Throws<JsonException>(() => CompatibilityFixture.Body(body));
    }
    private static readonly Action<JsonNode?, JsonNode?, string, bool> Compare =
        typeof(CompatibilityFixture).GetMethod("AssertJson", BindingFlags.NonPublic | BindingFlags.Static)!
            .CreateDelegate<Action<JsonNode?, JsonNode?, string, bool>>();

    [Fact]
    public void NumbersCompareByValueWithoutRoundingAwayChanges()
    {
        Compare(JsonNode.Parse("1.0"), JsonNode.Parse("1"), "fixture", true);
        Assert.Throws<InvalidOperationException>(() => Compare(JsonNode.Parse("1.01"), JsonNode.Parse("1"), "fixture", true));
    }

    [Theory]
    [InlineData("{\"name\":null}", "{\"name\":\"Jane\"}")]
    [InlineData("{\"name\":\"Jane\"}", "{\"name\":null}")]
    [InlineData("[null]", "[\"Jane\"]")]
    [InlineData("[\"Jane\"]", "[null]")]
    public void NullCannotReplaceAValue(string actual, string expected)
    {
        foreach (var exact in new[] { true, false })
            Assert.Throws<InvalidOperationException>(() => Compare(JsonNode.Parse(actual), JsonNode.Parse(expected), "fixture", exact));
    }

    [Theory]
    [InlineData("true", "1")]
    [InlineData("false", "0")]
    [InlineData("[]", "{}")]
    [InlineData("[]", "[1]")]
    [InlineData("{\"child\":{}}", "{\"child\":{\"name\":\"Ada\"}}")]
    public void InvalidTypesAndDroppedFieldsFail(string actual, string expected) =>
        Assert.Throws<InvalidOperationException>(() => Compare(JsonNode.Parse(actual), JsonNode.Parse(expected), "fixture", true));

    [Theory]
    [InlineData("null")]
    [InlineData("{\"name\":null}")]
    [InlineData("[null,{\"nested\":[null]}]")]
    public void MatchingNullsRoundTrip(string value)
    {
        foreach (var exact in new[] { true, false })
            Compare(JsonNode.Parse(value), JsonNode.Parse(value), "fixture", exact);
    }
}
