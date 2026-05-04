#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Building ui-flutter sample project..."
(
  cd "$SCRIPT_DIR/samples/flutter_sample"
  flutter pub get
  flutter analyze
  flutter test
  echo "Building Flutter Android APK..."
  flutter build apk
)
