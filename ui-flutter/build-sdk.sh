#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$REPO_ROOT/helpers/common.sh"

(
  cd "$SCRIPT_DIR/sdk"
  flutter pub get
)

(
  cd "$SCRIPT_DIR/sdk/testbed"
  flutter pub get
)

(
  cd "$SCRIPT_DIR/sdk"
  version="$(get_version flutterUIVersion)"
  echo "Setting version to $version"
  perl -0pi -e "s/^version: [0-9A-Za-z.-]+$/version: $version/m" pubspec.yaml

  echo "Ensuring CHANGELOG.md starts with version $version"
  if ! grep -qF "## $version" CHANGELOG.md; then
    tmp_file="$(mktemp)"
    {
      printf '## %s\n\n' "$version"
      printf '%s\n\n' '- Auto-Generated changelog -- please visit https://github.com/trinsic-id/sdk for info'
      cat CHANGELOG.md
    } > "$tmp_file"
    mv "$tmp_file" CHANGELOG.md
  fi

  echo "Copying README.md to sdk folder so publish command works"
  cp "$SCRIPT_DIR/README.md" README.md

  flutter analyze
  flutter test
  flutter pub publish --dry-run
)

(
  cd "$SCRIPT_DIR/sdk/testbed"
  flutter analyze
  flutter test
)
