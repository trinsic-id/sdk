#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$REPO_ROOT/helpers/common.sh"

(
  cd "$SCRIPT_DIR/sdk"
  ./gradlew :library:build

  package_version="$(get_version androidUIVersion)"
  gradle_path="./library/build.gradle.kts"
  perl -0pi -e "s/\\n\\s+version = \"[^\"]+\"/\\n            version = \"$package_version\"/" "$gradle_path"
  echo "Gradle file updated with version $package_version."
)
