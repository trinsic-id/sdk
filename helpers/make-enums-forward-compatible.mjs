import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Complete unknown-enum support where the pinned generator does not implement it.
// Keep response parsing open to new string values without accepting wrong JSON
// types. Other generators use their native enumUnknownDefaultCase option.
const [language, directory] = process.argv.slice(2);
let patched = 0;
if (language === "python") {
  const models = join(directory, "trinsic_api/models");
  for (const file of readdirSync(models).filter((name) => name.endsWith(".py"))) {
    const path = join(models, file), source = readFileSync(path, "utf8");
    if (!/^class \w+\(str, Enum\):/m.test(source)) continue;
    const anchor = "    @classmethod\n    def from_json";
    if (!source.includes(anchor)) throw new Error(`Unknown Python enum template: ${file}`);
    writeFileSync(path, source.replace(anchor, `    @classmethod
    def _missing_(cls, value):
        # Preserve future server values while retaining all known enum members.
        if not isinstance(value, str):
            return None
        member = str.__new__(cls, value)
        member._name_ = "UNKNOWN_DEFAULT_OPEN_API"
        member._value_ = value
        return member

${anchor}`));
    patched++;
  }
} else if (language === "go") {
  for (const file of readdirSync(directory).filter((name) => name.endsWith(".go"))) {
    const path = join(directory, file), source = readFileSync(path, "utf8");
    const name = source.match(/^type (\w+) string$/m)?.[1];
    if (!name || !source.includes(`func (v *${name}) UnmarshalJSON`)) continue;
    const anchor = `return fmt.Errorf("%+v is not a valid ${name}", value)`;
    if (!source.includes(anchor)) throw new Error(`Unknown Go enum template: ${file}`);
    writeFileSync(path, source.replace(anchor, `// Preserve future string values received from the server.
    *v = enumTypeValue
    return nil`));
    patched++;
  }
} else if (language === "csharp") {
  const models = join(directory, "src/Trinsic.Api/Model");
  for (const file of readdirSync(models).filter((name) => name.endsWith(".cs"))) {
    const path = join(models, file), source = readFileSync(path, "utf8");
    if (!source.includes("[JsonConverter(typeof(StringEnumConverter))]")) continue;
    let count = 0;
    const output = source.replaceAll("[JsonConverter(typeof(StringEnumConverter))]", "[JsonConverter(typeof(Trinsic.Api.Client.ForwardCompatibleEnumConverter))]")
      .replace(/(public enum \w+\s*\{)/g, (match) => {
        count++;
        return `${match}
            /// <summary>A string value introduced after this SDK was generated.</summary>
            [EnumMember(Value = "unknown_default_open_api")]
            UnknownDefaultOpenApi = -1,
`;
      });
    if (!count) throw new Error(`Unknown C# enum template: ${file}`);
    writeFileSync(path, output); patched += count;
  }
  writeFileSync(join(directory, "src/Trinsic.Api/Client/ForwardCompatibleEnumConverter.cs"), `using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Trinsic.Api.Client
{
    /// <summary>Allows new server enum strings without losing the response.</summary>
    public sealed class ForwardCompatibleEnumConverter : StringEnumConverter
    {
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            try { return base.ReadJson(reader, objectType, existingValue, serializer); }
            catch (JsonSerializationException) when (reader.TokenType == JsonToken.String)
            {
                var enumType = Nullable.GetUnderlyingType(objectType) ?? objectType;
                return Enum.Parse(enumType, "UnknownDefaultOpenApi");
            }
        }
    }
}
`);
} else if (language === "php") {
  const path = join(directory, "lib/ObjectSerializer.php"), source = readFileSync(path, "utf8");
  const anchor = "if (!in_array($data, $class::getAllowableEnumValues(), true)) {";
  if (!source.includes(anchor)) throw new Error("Unknown PHP enum deserializer template.");
  writeFileSync(path, source.replace(anchor, `${anchor}
                if (is_string($data) && defined($class . '::UNKNOWN_DEFAULT_OPEN_API')) {
                    return constant($class . '::UNKNOWN_DEFAULT_OPEN_API');
                }`));
  patched++;
} else if (language === "ruby") {
  const models = join(directory, "lib/trinsic_api/models");
  for (const file of readdirSync(models).filter((name) => name.endsWith(".rb"))) {
    const path = join(models, file), source = readFileSync(path, "utf8");
    if (!source.includes("UNKNOWN_DEFAULT_OPEN_API =")) continue;
    const anchor = /^(\s*)raise "Invalid ENUM value.*$/m;
    if (!anchor.test(source)) throw new Error(`Unknown Ruby enum template: ${file}`);
    writeFileSync(path, source.replace(anchor, "$1return self.class::UNKNOWN_DEFAULT_OPEN_API if value.is_a?(String)\n$&"));
    patched++;
  }
} else {
  throw new Error(`Unsupported enum patch language: ${language}`);
}
if (!patched) throw new Error(`No ${language} string enums found; check the pinned generator output.`);
console.log(`Enabled forward-compatible response parsing for ${patched} ${language} enums.`);
