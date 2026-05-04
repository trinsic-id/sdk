#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$REPO_ROOT/helpers/common.sh"

require_env NPM_TOKEN

echo "Setting npm token"
npm set //registry.npmjs.org/:_authToken "$NPM_TOKEN"

shopt -s nullglob
packages=("$SCRIPT_DIR"/sdk/publish/trinsic-expo-ui-*.tgz)
if [[ ${#packages[@]} -eq 0 ]]; then
  echo "No npm packages found in $SCRIPT_DIR/sdk/publish" >&2
  exit 1
fi

for package in "${packages[@]}"; do
  echo "Publishing $package"
  npm publish "$package" --access=public
  echo "Published $package"
done
