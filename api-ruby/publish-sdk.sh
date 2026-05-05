#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$REPO_ROOT/helpers/common.sh"

require_env RUBYGEMS_API_TOKEN
export GEM_HOST_API_KEY="$RUBYGEMS_API_TOKEN"

echo "Publishing RubyGems package..."
gem signin >/dev/null

shopt -s nullglob
packages=("$SCRIPT_DIR"/sdk/publish/trinsic_api-*.gem)
if [[ ${#packages[@]} -eq 0 ]]; then
  echo "No RubyGems packages found in $SCRIPT_DIR/sdk/publish" >&2
  exit 1
fi

for package in "${packages[@]}"; do
  echo "Publishing $package"
  gem push "$package"
  echo "Published $package"
done
