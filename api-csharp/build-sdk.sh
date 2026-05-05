#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$REPO_ROOT/helpers/common.sh"

"$REPO_ROOT/helpers/generate-client.sh" \
  --language csharp \
  --output-folder "$SCRIPT_DIR/sdk" \
  --additional-property "packageName=Trinsic.Api" \
  --additional-property "packageVersion=[VERSION]" \
  --additional-property "nullableReferenceTypes=true" \
  --additional-property "modelPropertySorting=alphabetical" \
  --additional-property "library=generichost" \
  --additional-property "useDateTimeOffset=true" \
  --additional-property "validatable=false" \
  --additional-property "disallowAdditionalPropertiesIfNotPresent=false" \
  --additional-property "licenseId=MIT" \
  --additional-property "apiName=TrinsicApi" \
  --additional-property "targetFramework=net8.0"

apply_hotfix() {
  local target_line="$1"
  local replacement_line="$2"
  local root_path="${3:-$SCRIPT_DIR/sdk}"

  echo "Applying hotfix for $target_line in $root_path"
  node - "$target_line" "$replacement_line" "$root_path" <<'NODE'
const fs = require("fs");
const path = require("path");

const targetLine = process.argv[2];
const replacementLine = process.argv[3];
const rootPath = process.argv[4];
const normalizedTarget = targetLine.replace(/\s/g, "");

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && fullPath.endsWith(".cs")) {
      patchFile(fullPath);
    }
  }
}

function patchFile(filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  const newline = original.includes("\r\n") ? "\r\n" : "\n";
  const hadTrailingNewline = original.endsWith("\n");
  const lines = original.split(/\r?\n/);
  if (hadTrailingNewline) lines.pop();

  let modified = false;
  const nextLines = lines.map((line) => {
    if (line.replace(/\s/g, "") === normalizedTarget) {
      console.log(`MATCH FOUND in ${filePath}`);
      modified = true;
      return replacementLine;
    }
    return line;
  });

  if (modified) {
    fs.writeFileSync(filePath, nextLines.join(newline) + (hadTrailingNewline ? newline : ""));
    console.log(`Updated: ${filePath}`);
  }
}

walk(rootPath);
NODE
}

apply_hotfix \
  'if (DateOnly.TryParseExact(value, format, CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeUniversal, out DateOnly result))' \
  '                if (DateOnly.TryParseExact(value, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly result))'
apply_hotfix 'public interface IProvidersApi : IApi' '    public partial interface IProvidersApi : IApi'
apply_hotfix 'public interface ISessionsApi : IApi' '    public partial interface ISessionsApi : IApi'
apply_hotfix 'public interface IVerificationProfilesApi : IApi' '    public partial interface IVerificationProfilesApi : IApi'
apply_hotfix 'public interface IRedirectUrisApi : IApi' '    public partial interface IRedirectUrisApi : IApi'
apply_hotfix 'services.AddSingleton(typeof(RateLimitProvider<>).MakeGenericType(tokenType));' '                    services.AddTransient(typeof(ConstantTokenProvider<>).MakeGenericType(tokenType));'
apply_hotfix 'services.AddSingleton(typeof(TokenProvider<>).MakeGenericType(tokenType),' '                    services.AddTransient(typeof(TokenProvider<>).MakeGenericType(tokenType),'
apply_hotfix 's => s.GetRequiredService(typeof(RateLimitProvider<>).MakeGenericType(tokenType)));' '                        s => s.GetRequiredService(typeof(ConstantTokenProvider<>).MakeGenericType(tokenType)));'

additional_folder="$SCRIPT_DIR/Additional"
destination_folder="$SCRIPT_DIR/sdk/src/Trinsic.Api/Additional"
echo "Copying $additional_folder to $destination_folder"
rm -rf "$destination_folder"
mkdir -p "$destination_folder"
cp -R "$additional_folder"/. "$destination_folder"/

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

cp "$SCRIPT_DIR/README.md" "$SCRIPT_DIR/sdk/src/Trinsic.Api"
cp "$REPO_ROOT/LICENSE" "$SCRIPT_DIR/sdk/src/Trinsic.Api"

(
  cd "$SCRIPT_DIR/sdk"
  dotnet restore
  dotnet build --configuration Release --no-restore
  dotnet pack --configuration Release --no-build --no-restore --include-source --include-symbols -p:SymbolPackageFormat=snupkg --output "$SCRIPT_DIR/sdk/publish"
)
