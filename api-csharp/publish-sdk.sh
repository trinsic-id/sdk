#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$REPO_ROOT/helpers/common.sh"

require_env NUGET_API_KEY
shopt -s nullglob
packages=("$SCRIPT_DIR"/sdk/publish/*.nupkg)
if [[ ${#packages[@]} -eq 0 ]]; then
  echo "No NuGet packages found in $SCRIPT_DIR/sdk/publish" >&2
  exit 1
fi

for package in "${packages[@]}"; do
  dotnet nuget push "$package" --source "https://api.nuget.org/v3/index.json" --api-key "$NUGET_API_KEY"
done
