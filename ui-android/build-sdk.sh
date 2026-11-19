#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$REPO_ROOT/helpers/common.sh"

(
  cd "$SCRIPT_DIR/sdk"

  # Set the publication and diagnostic version before building the SDK.
  package_version="$(get_version androidUIVersion)"
  gradle_path="./library/build.gradle.kts"
  NEW_VERSION="$package_version" perl -0pi -e 's/^(val sdkVersion\s*=\s*")[^"]*(")/$1$ENV{NEW_VERSION}$2/m or die "Could not find sdkVersion in $ARGV\n"' "$gradle_path"
  echo "Gradle file updated with version $package_version."

  ./gradlew :library:build
)
