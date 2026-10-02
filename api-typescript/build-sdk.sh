#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

swagger_file_or_url=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --swagger-file-or-url)
      [[ $# -ge 2 ]] || { echo "$1 requires a value" >&2; exit 1; }
      swagger_file_or_url="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

generator_arguments=()
if [[ -n "$swagger_file_or_url" ]]; then
  generator_arguments+=(--swagger-file-or-url "$swagger_file_or_url")
fi

"$REPO_ROOT/helpers/generate-client.sh" \
  "${generator_arguments[@]}" \
  --language typescript-fetch \
  --version-name node \
  --output-folder "$SCRIPT_DIR/sdk" \
  --additional-property "npmName=@trinsic/api" \
  --additional-property "npmVersion=[VERSION]" \
  --additional-property "supportsES6=true" \
  --additional-property "withInterfaces=true" \
  --additional-property "useSingleRequestParameter=false"

cp "$SCRIPT_DIR/README.md" "$SCRIPT_DIR/sdk"
cp "$REPO_ROOT/LICENSE" "$SCRIPT_DIR/sdk"

node - "$SCRIPT_DIR/sdk/package.json" <<'NODE'
const fs = require("fs");
const file = process.argv[2];
const json = JSON.parse(fs.readFileSync(file, "utf8"));
json.description = "Trinsic API TypeScript library.";
json.repository = json.repository || {};
json.repository.url = "https://github.com/trinsic-id/sdk";
json.author = "Trinsic";
json.homepage = "https://trinsic.id";
json.license = "MIT";
fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
NODE

(
  cd "$SCRIPT_DIR/sdk"
  npm install
  npm pack --pack-destination "$SCRIPT_DIR/sdk/publish"
)
