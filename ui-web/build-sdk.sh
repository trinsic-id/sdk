#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../helpers/common.sh"

cd "$SCRIPT_DIR/sdk"
npm ci
npm run build
node --test "$SCRIPT_DIR/tests/launch.test.cjs"

# Stamp the release version in the package without changing the checkout.
pack_dir="$(mktemp -d)"
trap 'rm -rf "$pack_dir"' EXIT
cp -R dist LICENSE package.json "$SCRIPT_DIR/README.md" "$pack_dir/"
mkdir -p publish
cd "$pack_dir"
npm pkg set version="$(get_version webUIVersion)"
npm pack --pack-destination "$SCRIPT_DIR/sdk/publish"
