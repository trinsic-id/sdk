#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
swagger_file_or_url=""
output_folder="$SCRIPT_DIR/sdk-build"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --swagger-file-or-url) swagger_file_or_url="$2"; shift 2 ;;
    --output-folder) output_folder="$2"; shift 2 ;;
    *) echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

generator_args=()
[[ -z "$swagger_file_or_url" ]] || generator_args+=(--swagger-file-or-url "$swagger_file_or_url")

"$REPO_ROOT/helpers/generate-client.sh" \
  --language php \
  --output-folder "$output_folder" \
  "${generator_args[@]}" \
  --additional-property "artifactVersion=[VERSION]" \
  --additional-property "invokerPackage=Trinsic\\\\Api" \
  --additional-property "artifactUrl=https://github.com/trinsic-id/sdk-php-api" \
  --additional-property "developerOrganization=Trinsic" \
  --additional-property "developerOrganizationUrl=https://trinsic.id" \
  --additional-property "composerPackageName=trinsic/api" \
  --additional-property "licenseName=MIT"

cp "$SCRIPT_DIR/README.md" "$output_folder"
cp "$REPO_ROOT/LICENSE" "$output_folder"

node - "$output_folder/composer.json" <<'NODE'
const fs = require("fs");
const file = process.argv[2];
const json = JSON.parse(fs.readFileSync(file, "utf8"));
json.description = "Trinsic API PHP library.";
fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
NODE
