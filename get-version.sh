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

version="$(
  node - "$SCRIPT_DIR/versions.json" "$version_name" <<'NODE'
const fs = require("fs");
const file = process.argv[2];
const versionName = process.argv[3];
const json = JSON.parse(fs.readFileSync(file, "utf8"));

function readCaseInsensitive(obj, key) {
  const actual = Object.keys(obj).find((candidate) => candidate.toLowerCase() === key.toLowerCase());
  return actual ? obj[actual] : undefined;
}

const directVersion = readCaseInsensitive(json, versionName);
if (directVersion !== undefined && directVersion !== null) {
  process.stdout.write(String(directVersion));
  process.exit(0);
}

const backendVersion = readCaseInsensitive(json, "backendVersion");
const patchVersion = readCaseInsensitive(json, `${versionName}PatchVersion`);
if (backendVersion === undefined || patchVersion === undefined) {
  console.error(`No version found for ${versionName}.`);
  process.exit(1);
}

console.error(`Package will be created with version ${backendVersion}.${patchVersion} from file based API Version ${backendVersion} and patchVersion ${patchVersion}`);
process.stdout.write(`${backendVersion}.${patchVersion}`);
NODE
)"

if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  echo "trinsic-package-version=$version" >> "$GITHUB_OUTPUT"
fi

printf '%s\n' "$version"
