using System.Reflection;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.Extensions.DependencyInjection;
using Trinsic.Api.Extensions;
using Xunit;

public sealed class HarnessRegressionTests
{
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
