using System.Reflection;
using System.Text.Json.Nodes;
using Xunit;

public sealed class HarnessRegressionTests
{
    private static readonly Action<JsonNode?, JsonNode?, string, bool> Compare =
        typeof(CompatibilityFixture).GetMethod("AssertJson", BindingFlags.NonPublic | BindingFlags.Static)!
            .CreateDelegate<Action<JsonNode?, JsonNode?, string, bool>>();

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
