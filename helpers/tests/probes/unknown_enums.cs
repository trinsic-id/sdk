using System;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Trinsic.Api.Model;

static void Check(bool condition, string message)
{
    if (!condition) throw new Exception(message);
}

// A value added to the API after this SDK was generated must not fail the response.
var step = JsonConvert.DeserializeObject<IntegrationStep>("{\"method\":\"FutureLaunchMethod\",\"content\":\"content\"}");
Check(step.Method == IntegrationLaunchMethod.UnknownDefaultOpenApi && step.Content == "content", "Required enum did not fall back");
var session = JsonConvert.DeserializeObject<Session>("{\"id\":\"session-id\",\"done\":true,\"success\":false,\"errorCode\":\"FutureErrorCode\",\"created\":1,\"updated\":2}");
Check(session.ErrorCode == SessionErrorCode.UnknownDefaultOpenApi && session.Id == "session-id", "Nullable enum did not fall back");
var request = JsonConvert.DeserializeObject<CreateDirectProviderSessionRequest>("{\"provider\":\"provider\",\"verificationProfileId\":\"00000000-0000-0000-0000-000000000001\",\"capabilities\":[\"LaunchBrowser\",\"FutureCapability\"],\"enableRedirectBackwardsCompatibility\":false}");
Check(request.Capabilities.SequenceEqual(new[] { IntegrationCapability.LaunchBrowser, IntegrationCapability.UnknownDefaultOpenApi }), "Enum list did not fall back");

// Known values, including a real member named Unknown, and nulls are unchanged.
Check(JsonConvert.DeserializeObject<PersonData>("{\"sex\":\"Unknown\"}").Sex == Sex.Unknown, "Known value was replaced");
Check(JsonConvert.DeserializeObject<PersonData>("{\"sex\":null}").Sex == null, "Null became a value");
Check(JsonConvert.SerializeObject(IntegrationLaunchMethod.LaunchBrowser) == "\"LaunchBrowser\"", "Enum serialization changed");
try { JsonConvert.DeserializeObject<IntegrationLaunchMethod>("null"); throw new Exception("Null accepted for a required enum"); }
catch (JsonSerializationException) { }

// Every generated string enum, top-level or nested in a model, must fall back.
var enums = typeof(Session).Assembly.GetTypes()
    .Where(t => t.IsEnum && t.GetFields().Any(f => f.GetCustomAttribute<EnumMemberAttribute>() != null)).ToList();
Check(enums.Count > 0, "No generated enums were inspected");
foreach (var type in enums)
{
    Check(Enum.IsDefined(type, "UnknownDefaultOpenApi"), $"Missing fallback member: {type}");
    var fallback = Enum.Parse(type, "UnknownDefaultOpenApi");
    Check(Equals(JsonConvert.DeserializeObject("\"FutureValue\"", type), fallback), $"Unknown value rejected: {type}");
    Check(Equals(JsonConvert.DeserializeObject("\"FutureValue\"", typeof(Nullable<>).MakeGenericType(type)), fallback), $"Unknown nullable value rejected: {type}");
}
Console.WriteLine($"Unknown enum values fell back for {enums.Count} enums");
