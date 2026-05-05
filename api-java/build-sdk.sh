#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

"$REPO_ROOT/helpers/generate-client.sh" \
  --language java \
  --output-folder "$SCRIPT_DIR/sdk-build" \
  --additional-property "apiPackage=id.trinsic.api" \
  --additional-property "artifactVersion=[VERSION]" \
  --additional-property "library=native" \
  --additional-property "modelPackage=id.trinsic.api.models" \
  --additional-property "artifactId=api" \
  --additional-property "groupId=id.trinsic" \
  --additional-property "scmConnection=scm:git:https://github.com/trinsic-id/sdk.git" \
  --additional-property "scmDeveloperConnection=scm:git:ssh://git@github.com/trinsic-id/sdk.git" \
  --additional-property "scmUrl=https://github.com/trinsic-id/sdk" \
  --additional-property "artifactUrl=https://trinsic.id" \
  --additional-property "developerEmail=support@Trinsic.id" \
  --additional-property "developerName=Trinsic" \
  --additional-property "developerOrganization=Trinsic" \
  --additional-property "developerOrganizationUrl=https://trinsic.id" \
  --additional-property "artifactDescription=Trinsic" \
  --additional-property "licenseName=MIT" \
  --additional-property "licenseUrl=https://opensource.org/licenses/MIT"

cp "$SCRIPT_DIR/README.md" "$SCRIPT_DIR/sdk-build"
cp "$REPO_ROOT/LICENSE" "$SCRIPT_DIR/sdk-build"
rm -f "$SCRIPT_DIR/sdk-build/.github/workflows/maven.yml"
if [[ -f "$SCRIPT_DIR/sdk-build/gradle/wrapper/gradle-wrapper.properties" ]]; then
  perl -0pi -e 's#gradle-[0-9.]+-bin\.zip#gradle-8.10.2-bin.zip#g' "$SCRIPT_DIR/sdk-build/gradle/wrapper/gradle-wrapper.properties"
fi
perl -0pi \
  -e 's/main = System\.getProperty/mainClass = System.getProperty/g;' \
  -e 's/sourceCompatibility = JavaVersion\.VERSION_11/java.sourceCompatibility = JavaVersion.VERSION_11/g;' \
  -e 's/targetCompatibility = JavaVersion\.VERSION_11/java.targetCompatibility = JavaVersion.VERSION_11/g;' \
  "$SCRIPT_DIR/sdk-build/build.gradle"

(
  cd "$SCRIPT_DIR/sdk-build"
  if [[ -f ./gradlew ]]; then
    chmod +x ./gradlew
    ./gradlew compileJava
    ./gradlew jar
  else
    gradle compileJava
    gradle jar
  fi
)
