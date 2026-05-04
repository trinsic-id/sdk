#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$REPO_ROOT/helpers/common.sh"

(
  cd "$SCRIPT_DIR/sdk"
  npm ci

  version="$(get_version expoUIVersion)"
  npm version "$version" --no-git-tag-version

  npm run build
  mkdir -p publish
  npm pack --pack-destination "$SCRIPT_DIR/sdk/publish"
)

(
  cd "$SCRIPT_DIR/sdk/testbed"
  npm ci
  npm run check
)
