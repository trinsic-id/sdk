#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

# Additional properties for PHP client generation
additionalProperties="artifactVersion=[VERSION],invokerPackage=Trinsic\\Api,artifactUrl=https://github.com/trinsic-id/sdk-php-api,developerOrganization=Trinsic,developerOrganizationUrl=https://trinsic.id,composerPackageName=trinsic/api,licenseName=MIT"

# Generate the PHP client
"$SCRIPT_DIR/../helpers/generate-client.sh" \
    -l "php" \
    -o "$SCRIPT_DIR/sdk-build" \
    -a "$additionalProperties"

if [ $? -ne 0 ]; then
    handle_error "Failed to generate PHP client"
fi

pushd "$SCRIPT_DIR/sdk-build" > /dev/null

# Copy additional files
cp "$SCRIPT_DIR/README.md" "$SCRIPT_DIR/sdk-build/"
cp "$SCRIPT_DIR/../LICENSE" "$SCRIPT_DIR/sdk-build/"

# Update composer.json description
composerFile="composer.json"
if [ -f "$composerFile" ]; then
    tmpFile=$(mktemp)
    jq '.description = "Trinsic API PHP library."' "$composerFile" > "$tmpFile" && mv "$tmpFile" "$composerFile"
    if [ $? -ne 0 ]; then
        popd > /dev/null
        handle_error "Failed to update composer.json description"
    fi
else
    popd > /dev/null
    handle_error "composer.json not found"
fi

popd > /dev/null