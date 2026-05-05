#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$REPO_ROOT/helpers/common.sh"

cp "$SCRIPT_DIR/README.md" "$SCRIPT_DIR/sdk"

(
  cd "$SCRIPT_DIR/sdk"
  npm ci
  npm run build

  version="$(get_version webUIVersion)"
  npm version "$version" --no-git-tag-version

  mkdir -p publish
  npm pack --pack-destination "$SCRIPT_DIR/sdk/publish"
)
