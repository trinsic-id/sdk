using System.Reflection;
using System.Text.Json.Nodes;
using Xunit;

public sealed class HarnessRegressionTests
{
    private sealed record Response(bool IsSuccessStatusCode, bool IsOk, int StatusCode, string ReasonPhrase);

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
