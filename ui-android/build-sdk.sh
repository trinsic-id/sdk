#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$REPO_ROOT/helpers/common.sh"

(
  cd "$SCRIPT_DIR/sdk"
  ./gradlew :library:build

  # Update package version in gradle build file
  package_version="$(get_version androidUIVersion)"
  gradle_path="./library/build.gradle.kts"
  NEW_VERSION="$package_version" perl -0pi -e 's/(coordinates\(\s*"id\.trinsic"\s*,\s*"sdk-android-ui"\s*,\s*")[^"]*(")/$1$ENV{NEW_VERSION}$2/g' $gradle_path
  echo "Gradle file updated with version $package_version."
)
