#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$REPO_ROOT/helpers/common.sh"

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

version="$(get_version go)"
major="${version%%.*}"
main_version=""
if [[ "$major" != "1" ]]; then
  main_version="/v$major"
fi

"$REPO_ROOT/helpers/generate-client.sh" \
  --language go \
  --output-folder "$output_folder" \
  "${generator_args[@]+${generator_args[@]}}" \
  --additional-property "packageName=trinsic_api" \
  --additional-property "packageVersion=[VERSION]" \
  --additional-property "disallowAdditionalPropertiesIfNotPresent=false" \
  --additional-property "enumClassPrefix=true"

cp "$SCRIPT_DIR/README.md" "$output_folder"
cp "$REPO_ROOT/LICENSE" "$output_folder"
perl -0pi -e "s{/GIT_USER_ID/GIT_REPO_ID}{/trinsic-id/sdk-go-api$main_version}g" "$output_folder/go.mod"

(
  cd "$output_folder"
  go build ./...
)
