#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

(
  cd "$SCRIPT_DIR/samples/expo-sample"
  npm ci
  npm run check
)
