#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

"$REPO_ROOT/helpers/generate-client.sh" \
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
