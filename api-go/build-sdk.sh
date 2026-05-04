#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$REPO_ROOT/helpers/common.sh"

version="$(get_version go)"
major="${version%%.*}"
main_version=""
if [[ "$major" != "1" ]]; then
  main_version="/v$major"
fi

"$REPO_ROOT/helpers/generate-client.sh" \
  --language go \
  --output-folder "$SCRIPT_DIR/sdk-build" \
  --additional-property "packageName=trinsic_api" \
  --additional-property "packageVersion=[VERSION]" \
  --additional-property "disallowAdditionalPropertiesIfNotPresent=false" \
  --additional-property "enumClassPrefix=true"

cp "$SCRIPT_DIR/README.md" "$SCRIPT_DIR/sdk-build"
cp "$REPO_ROOT/LICENSE" "$SCRIPT_DIR/sdk-build"
perl -0pi -e "s{/GIT_USER_ID/GIT_REPO_ID}{/trinsic-id/sdk-go-api$main_version}g" "$SCRIPT_DIR/sdk-build/go.mod"

(
  cd "$SCRIPT_DIR/sdk-build"
  go build
)
