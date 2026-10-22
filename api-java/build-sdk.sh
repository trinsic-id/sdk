#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

swagger_file_or_url="https://api.trinsic.id/swagger/api/swagger.json"
output_folder="$SCRIPT_DIR/sdk-build"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --swagger-file-or-url) swagger_file_or_url="$2"; shift 2 ;;
    --output-folder) output_folder="$2"; shift 2 ;;
    *) echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

"$REPO_ROOT/helpers/generate-client.sh" \
  --language java \
  --swagger-file-or-url "$swagger_file_or_url" \
  --output-folder "$output_folder" \
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

cp "$SCRIPT_DIR/README.md" "$output_folder"
cp "$REPO_ROOT/LICENSE" "$output_folder"
rm -f "$output_folder/.github/workflows/maven.yml"
if [[ -f "$output_folder/gradle/wrapper/gradle-wrapper.properties" ]]; then
  perl -0pi -e 's#gradle-[0-9.]+-bin\.zip#gradle-8.10.2-bin.zip#g' "$output_folder/gradle/wrapper/gradle-wrapper.properties"
fi
perl -0pi \
  -e 's/main = System\.getProperty/mainClass = System.getProperty/g;' \
  -e 's/sourceCompatibility = JavaVersion\.VERSION_11/java.sourceCompatibility = JavaVersion.VERSION_11/g;' \
  -e 's/targetCompatibility = JavaVersion\.VERSION_11/java.targetCompatibility = JavaVersion.VERSION_11/g;' \
  "$output_folder/build.gradle"

(
  cd "$output_folder"
  if [[ -f ./gradlew ]]; then
    chmod +x ./gradlew
    ./gradlew compileJava
    ./gradlew jar
  else
    gradle compileJava
    gradle jar
  fi
)
