#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

# Additional properties for Go client generation
additionalProperties="packageName=trinsic_api,packageVersion=[VERSION],disallowAdditionalPropertiesIfNotPresent=false,enumClassPrefix=true"

# Get version and calculate major version for module path
version=$("$SCRIPT_DIR/../get-version.sh" "go")
if [ $? -ne 0 ]; then
    handle_error "Failed to get version"
fi

major=$(echo "$version" | cut -d. -f1)
mainVersion=""
if [ "$major" != "1" ]; then
    mainVersion="/v$major"
fi

# Generate the Go client
"$SCRIPT_DIR/../helpers/generate-client.sh" \
    -l "go" \
    -o "$SCRIPT_DIR/sdk-build" \
    -a "$additionalProperties"

if [ $? -ne 0 ]; then
    handle_error "Failed to generate Go client"
fi

pushd "$SCRIPT_DIR/sdk-build" > /dev/null

# Copy additional files
cp "$SCRIPT_DIR/README.md" "$SCRIPT_DIR/sdk-build/"
cp "$SCRIPT_DIR/../LICENSE" "$SCRIPT_DIR/sdk-build/"

# Update go.mod file
goModFile="go.mod"
if [ -f "$goModFile" ]; then
    sed -i "s|/GIT_USER_ID/GIT_REPO_ID|/trinsic-id/sdk-go-api$mainVersion|g" "$goModFile"
fi

# Build the Go module
go build
if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "go build failed"
fi

popd > /dev/null