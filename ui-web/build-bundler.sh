#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
bundler_name=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --bundler-name|-bundlerName)
      bundler_name="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$bundler_name" ]]; then
  echo "--bundler-name is required" >&2
  exit 1
fi

(
  cd "$SCRIPT_DIR/samples/bundlers/$bundler_name"
  npm ci
  echo "Building bundler $bundler_name project..."
  npm run build
)
