using System.Reflection;
using System.Text.Json.Nodes;
using Xunit;
#if LEGACY_SDK
using Microsoft.Extensions.DependencyInjection;
using Trinsic.Api.Extensions;
#endif

public sealed class HarnessRegressionTests
{
    private sealed record Response(bool IsSuccessStatusCode, bool IsOk, int StatusCode, string ReasonPhrase);
    private static readonly Action<object> CheckResponse = typeof(CompatibilityFixture)
        .GetMethod("AssertSuccess", BindingFlags.NonPublic | BindingFlags.Static)!.CreateDelegate<Action<object>>();

    private sealed class LazyResponse(int status, string body)
    {
        public bool IsSuccessStatusCode => true;
        public bool IsOk => status == 200;
        public int StatusCode => status;
        public int Reads { get; private set; }
        public object Ok() { Reads++; return System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string[]>>(body)!; }
    }

    [Fact]
    public void SuccessfulBodiesAreMaterializedButNoContentIsNot()
    {
        var valid = new LazyResponse(200, "{\"providers\":[]}");
        CheckResponse(valid);
        Assert.Equal(1, valid.Reads);
        var invalid = new LazyResponse(200, "{\"providers\":\"not-an-array\"}");
        Assert.IsType<System.Text.Json.JsonException>(Assert.Throws<TargetInvocationException>(() => CheckResponse(invalid)).InnerException);
        Assert.Throws<InvalidOperationException>(() => CheckResponse(new LazyResponse(200, "null")));
        var noContent = new LazyResponse(204, "");
        CheckResponse(noContent);
        Assert.Equal(0, noContent.Reads);
    }

#if LEGACY_SDK
    [Fact]
    public void PublishedProviderResponseRejectsMalformedSuccessfulBody()
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
        Assert.IsType<System.Text.Json.JsonException>(Assert.Throws<TargetInvocationException>(() => CheckResponse(body)).InnerException);
    }
#endif

    [Fact]
    public void NoContentIsSuccessfulButServerErrorsFail()
    {
        var check = typeof(CompatibilityFixture).GetMethod("AssertSuccess", BindingFlags.NonPublic | BindingFlags.Static)!.CreateDelegate<Action<object>>();
        check(new Response(true, false, 204, "No Content"));
        Assert.Throws<InvalidOperationException>(() => check(new Response(false, false, 500, "Internal Server Error")));
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
    [InlineData("null")]
    [InlineData("{\"name\":null}")]
    [InlineData("[null,{\"nested\":[null]}]")]
    public void MatchingNullsRoundTrip(string value)
    {
        foreach (var exact in new[] { true, false })
            Compare(JsonNode.Parse(value), JsonNode.Parse(value), "fixture", exact);
    }
}
