#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$REPO_ROOT/helpers/common.sh"

require_env SDK_REPOSITORY_PATH
require_env MEWMBA_GIT_PUBLISH_TOKEN
require_env PACKAGE_VERSION

"$REPO_ROOT/helpers/submodule.sh" \
  --tag-prefix "" \
  --name "Java" \
  --source-location "$SCRIPT_DIR/sdk-build" \
  --destination-location "$SCRIPT_DIR/sdk" \
  --sdk-repository-path "$SDK_REPOSITORY_PATH" \
  --github-pat "$MEWMBA_GIT_PUBLISH_TOKEN" \
  --repository-path "trinsic-id/sdk-java-api" \
  --package-version "$PACKAGE_VERSION"
