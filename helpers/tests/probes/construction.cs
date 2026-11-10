using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Trinsic.Api.Model;

static void Check(bool condition, string message)
{
    if (!condition) throw new Exception(message);
}

// An alphabetically earlier field cannot steal the two existing values.
var pair = new StringPair { Alpha = "A", Bravo = "B" };
var json = JObject.Parse(pair.ToJson());
Check((string)json["alpha"] == "A" && (string)json["bravo"] == "B", "Field binding changed");
Check(json["aardvark"] == null, "New optional field received an existing value");
Check(pair.Label == "default label" && pair.Enabled == true && pair.Mode == StringPair.ModeEnum.Fast, "Schema defaults lost");
pair.AdditionalProperties["extra"] = "preserved";
Check((string)JObject.Parse(pair.ToJson())["extra"] == "preserved", "Extension data lost");

var input = new RequiredInput
{
    Name = "A", Enabled = false, Mode = RequiredInput.ModeEnum.Slow,
    NullableName = null, Tags = new List<string> { "tag" }
};
var decoded = JsonConvert.DeserializeObject<RequiredInput>(input.ToJson());
Check(decoded.Name == "A" && !decoded.Enabled && decoded.NullableName == null && decoded.Tags[0] == "tag", "Required values did not round-trip");
try { input.Name = null; throw new Exception("Required name accepted null"); }
catch (ArgumentNullException) { }
try { input.Tags = null; throw new Exception("Required collection accepted null"); }
catch (ArgumentNullException) { }
try { JsonConvert.DeserializeObject<RequiredInput>("{}"); throw new Exception("Missing required fields accepted"); }
catch (JsonSerializationException) { }

var response = JsonConvert.DeserializeObject<ReadOnlyResponse>("{\"id\":\"response-id\",\"label\":\"readable\"}");
Check(response.Id == "response-id", "Read-only response field was not deserialized");
Check(JObject.Parse(response.ToJson())["id"] == null, "Read-only field leaked into request JSON");

var derived = new DerivedInput
{
    Name = "parent", Enabled = false, Mode = DerivedInput.ModeEnum.Fast,
    NullableName = null, Tags = new List<string>(), Child = "child"
};
Check(JsonConvert.DeserializeObject<DerivedInput>(derived.ToJson()).Child == "child", "Composed model round-trip failed");

var child = new ChildInput { Id = "parent", Kind = "ChildInput", Child = "child" };
Check(child is BaseInput, "Fixture must exercise generated inheritance");
var decodedChild = JsonConvert.DeserializeObject<BaseInput>(child.ToJson());
Check(decodedChild is ChildInput && decodedChild.Id == "parent", "Inherited model deserialization failed");

foreach (var type in typeof(StringPair).Assembly.GetTypes().Where(t => t.Namespace == typeof(StringPair).Namespace && t.IsClass && !t.IsAbstract))
    Check(type.GetConstructors().All(c => c.GetParameters().Length == 0), $"Positional constructor exposed: {type}");
Console.WriteLine("Named construction and JSON behavior passed");
