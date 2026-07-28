#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SDK_TARBALL="$(find "$SCRIPT_DIR/sdk/publish" -maxdepth 1 -name 'trinsic-web-ui-*.tgz' -print -quit)"

if [[ -z "$SDK_TARBALL" ]]; then
  echo "Build the Web UI SDK before building samples." >&2
  exit 1
fi

(
  cd "$SCRIPT_DIR/samples"
  npm ci
  npm install --no-save --package-lock=false "$SDK_TARBALL"
  echo "Building ui-web sample project..."
  npm run build
)

echo "Building bundlers"
for bundler_dir in "$SCRIPT_DIR"/samples/bundlers/*; do
  [[ -d "$bundler_dir" ]] || continue
  bundler_name="$(basename "$bundler_dir")"
  echo "Building bundler $bundler_name project..."
  "$SCRIPT_DIR/build-bundler.sh" --bundler-name "$bundler_name" --sdk-tarball "$SDK_TARBALL"
  echo "Bundler $bundler_name project built successfully"
done
