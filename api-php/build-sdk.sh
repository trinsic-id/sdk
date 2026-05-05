#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

"$REPO_ROOT/helpers/generate-client.sh" \
  --language php \
  --output-folder "$SCRIPT_DIR/sdk-build" \
  --additional-property "artifactVersion=[VERSION]" \
  --additional-property "invokerPackage=Trinsic\\\\Api" \
  --additional-property "artifactUrl=https://github.com/trinsic-id/sdk-php-api" \
  --additional-property "developerOrganization=Trinsic" \
  --additional-property "developerOrganizationUrl=https://trinsic.id" \
  --additional-property "composerPackageName=trinsic/api" \
  --additional-property "licenseName=MIT"

cp "$SCRIPT_DIR/README.md" "$SCRIPT_DIR/sdk-build"
cp "$REPO_ROOT/LICENSE" "$SCRIPT_DIR/sdk-build"

node - "$SCRIPT_DIR/sdk-build/composer.json" <<'NODE'
const fs = require("fs");
const file = process.argv[2];
const json = JSON.parse(fs.readFileSync(file, "utf8"));
json.description = "Trinsic API PHP library.";
fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
NODE
