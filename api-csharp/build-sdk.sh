#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$REPO_ROOT/helpers/common.sh"

swagger_file_or_url="${TRINSIC_OPENAPI_SCHEMA:-https://api.trinsic.id/swagger/api/swagger.json}"
if [[ $# -gt 0 ]]; then
  if [[ "$1" != "--swagger-file-or-url" || $# -ne 2 ]]; then
    echo "Usage: $0 [--swagger-file-or-url <path-or-url>]" >&2
    exit 1
  fi
  swagger_file_or_url="$2"
fi

generator_arguments=(
  --language csharp
  --output-folder "$SCRIPT_DIR/sdk"
  --additional-property "packageName=Trinsic.Api"
  --additional-property "packageVersion=[VERSION]"
  --additional-property "nullableReferenceTypes=true"
  --additional-property "modelPropertySorting=alphabetical"
  --additional-property "library=httpclient"
  --additional-property "useDateTimeOffset=true"
  --additional-property "validatable=false"
  --additional-property "disallowAdditionalPropertiesIfNotPresent=false"
  --additional-property "licenseId=MIT"
  --additional-property "apiName=TrinsicApi"
  --additional-property "targetFramework=net8.0"
)
if [[ -n "$swagger_file_or_url" ]]; then
  generator_arguments+=(--swagger-file-or-url "$swagger_file_or_url")
fi

"$REPO_ROOT/helpers/generate-client.sh" \
  "${generator_arguments[@]}"

# Json.NET otherwise interprets timestamp-looking strings inside free-form JSON
# as DateTime values. Apply this to both generated serializer defaults, and fail
# if a generator update changes their shape instead of silently losing the fix.
node - "$SCRIPT_DIR/sdk/src/Trinsic.Api/Client/ApiClient.cs" <<'NODE'
const fs = require("fs");
const file = process.argv[2];
const source = fs.readFileSync(file, "utf8");
const target = "ConstructorHandling = ConstructorHandling.AllowNonPublicDefaultConstructor,";
const matches = source.split(target).length - 1;
if (matches !== 2) {
  throw new Error(`Expected two generated JSON serializer defaults in ${file}, found ${matches}`);
}
fs.writeFileSync(file, source.replaceAll(target,
  `${target}\n            DateParseHandling = DateParseHandling.None,`));
NODE

csproj_path="$SCRIPT_DIR/sdk/src/Trinsic.Api/Trinsic.Api.csproj"
node - "$csproj_path" <<'NODE'
const fs = require("fs");
const file = process.argv[2];
let xml = fs.readFileSync(file, "utf8");

function setElement(name, value) {
  const re = new RegExp(`<${name}>[\\s\\S]*?<\\/${name}>`);
  const element = `<${name}>${value}</${name}>`;
  if (re.test(xml)) {
    xml = xml.replace(re, element);
  } else {
    xml = xml.replace("</PropertyGroup>", `  ${element}\n  </PropertyGroup>`);
  }
}

setElement("Authors", "Trinsic");
setElement("Company", "Trinsic");
setElement("AssemblyTitle", "Trinsic API C# Library");
setElement("Description", "A C# library for the Trinsic API");
setElement("RepositoryUrl", "https://github.com/trinsic-id/sdk");
setElement("PublishRepositoryUrl", "true");
setElement("Summary", "A C# library for the Trinsic API");
setElement("PackageReadmeFile", "README.md");

const itemGroup = `  <ItemGroup>
    <None Include="LICENSE" Pack="true" PackagePath="" />
    <None Include="README.md" Pack="true" PackagePath="" />
  </ItemGroup>
`;
xml = xml.replace("</Project>", `${itemGroup}</Project>`);
fs.writeFileSync(file, xml);
NODE

node "$REPO_ROOT/helpers/make-enums-forward-compatible.mjs" csharp "$SCRIPT_DIR/sdk"

cp "$SCRIPT_DIR/README.md" "$SCRIPT_DIR/sdk/src/Trinsic.Api"
cp "$REPO_ROOT/LICENSE" "$SCRIPT_DIR/sdk/src/Trinsic.Api"

(
  cd "$SCRIPT_DIR/sdk"
  dotnet restore
  dotnet build --configuration Release --no-restore
  dotnet pack --configuration Release --no-build --no-restore --include-source --include-symbols -p:SymbolPackageFormat=snupkg --output "$SCRIPT_DIR/sdk/publish"
)
