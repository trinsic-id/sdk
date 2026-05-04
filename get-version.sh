#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
version_name=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --version-name|-versionName)
      version_name="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$version_name" ]]; then
  echo "--version-name is required" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required to read versions.json." >&2
  exit 1
fi

read_version_value() {
  local wanted_key="$1"
  jq -er --arg wanted_key "$wanted_key" '
    to_entries[]
    | select(.key | ascii_downcase == ($wanted_key | ascii_downcase))
    | .value
  ' "$SCRIPT_DIR/versions.json"
}

if version="$(read_version_value "$version_name")"; then
  :
else
  if ! backend_version="$(read_version_value "backendVersion")" || ! patch_version="$(read_version_value "${version_name}PatchVersion")"; then
    echo "No version found for $version_name." >&2
    exit 1
  fi
  version="${backend_version}.${patch_version}"
  echo "Package will be created with version $version from file based API Version $backend_version and patchVersion $patch_version" >&2
fi

if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  echo "trinsic-package-version=$version" >> "$GITHUB_OUTPUT"
fi

printf '%s\n' "$version"
