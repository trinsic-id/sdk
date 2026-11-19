using System.Reflection;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Sample;

public static class SdkJson
{
    private static readonly JsonSerializerSettings Settings = new()
    {
        ContractResolver = new ResponseContractResolver()
    };

    public static IResult Result(object response) =>
        Results.Text(JsonConvert.SerializeObject(response, Settings), "application/json");

    private sealed class ResponseContractResolver : DefaultContractResolver
    {
        protected override JsonProperty CreateProperty(MemberInfo member, MemberSerialization memberSerialization)
        {
            var property = base.CreateProperty(member, memberSerialization);
            // Generated request serialization suppresses read-only fields. When
            // forwarding responses, retain them (e.g. recommended provider IDs).
            if (member is PropertyInfo info && info.GetMethod?.IsPublic == true && info.SetMethod?.IsPublic != true)
                property.ShouldSerialize = null;
            return property;
        }
    }
}
