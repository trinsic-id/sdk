#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

(
  cd "$SCRIPT_DIR/sdk"
  echo "Copying README.md to sdk folder so publish command works"
  cp "$SCRIPT_DIR/README.md" README.md
  flutter pub publish -f
)
