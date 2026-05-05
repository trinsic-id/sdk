#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

(
  cd "$SCRIPT_DIR/samples"
  npm ci
  echo "Building ui-web sample project..."
  npm run build
)

echo "Building bundlers"
for bundler_dir in "$SCRIPT_DIR"/samples/bundlers/*; do
  [[ -d "$bundler_dir" ]] || continue
  bundler_name="$(basename "$bundler_dir")"
  echo "Building bundler $bundler_name project..."
  "$SCRIPT_DIR/build-bundler.sh" --bundler-name "$bundler_name"
  echo "Bundler $bundler_name project built successfully"
done
