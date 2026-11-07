#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$REPO_ROOT/helpers/common.sh"

require_env NPM_TOKEN

package_version="$(get_version node)"
dist_tag="latest"
# Build metadata may contain hyphens without making the version a prerelease.
if [[ "${package_version%%+*}" == *-* ]]; then
  dist_tag="next"
fi

echo "Setting npm token"
npm set //registry.npmjs.org/:_authToken "$NPM_TOKEN"
npm whoami

shopt -s nullglob
packages=("$SCRIPT_DIR"/sdk/publish/trinsic-api-*.tgz)
if [[ ${#packages[@]} -eq 0 ]]; then
  echo "No npm packages found in $SCRIPT_DIR/sdk/publish" >&2
  exit 1
fi

for package in "${packages[@]}"; do
  echo "Publishing $package with tag $dist_tag"
  npm publish "$package" --access=public --tag "$dist_tag"
  echo "Published $package"
done
