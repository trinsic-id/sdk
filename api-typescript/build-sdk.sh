#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

# Additional properties for TypeScript client generation
additionalProperties="npmName=@trinsic/api,npmVersion=[VERSION],supportsES6=true,withInterfaces=true,useSingleRequestParameter=false"

# Generate the TypeScript client
"$SCRIPT_DIR/../helpers/generate-client.sh" \
    -l "typescript-fetch" \
    -o "$SCRIPT_DIR/sdk" \
    -v "node" \
    -a "$additionalProperties"

if [ $? -ne 0 ]; then
    handle_error "Failed to generate TypeScript client"
fi

# Copy additional files
cp "$SCRIPT_DIR/README.md" "$SCRIPT_DIR/sdk/"
cp "$SCRIPT_DIR/../LICENSE" "$SCRIPT_DIR/sdk/"

# Modify package.json using jq if available, or sed as fallback
packageJson="$SCRIPT_DIR/sdk/package.json"

if command -v jq >/dev/null 2>&1; then
    # Use jq for JSON manipulation
    tmp_file=$(mktemp)
    jq '.description = "Trinsic API TypeScript library." |
        .repository.url = "https://github.com/trinsic-id/sdk" |
        .author = "Trinsic" |
        .homepage = "https://trinsic.id" |
        .license = "MIT"' "$packageJson" > "$tmp_file"
    mv "$tmp_file" "$packageJson"
else
    # Fallback to sed-based JSON modification (basic)
    sed -i 's/"description": "[^"]*"/"description": "Trinsic API TypeScript library."/' "$packageJson"
    sed -i 's/"url": "[^"]*"/"url": "https:\/\/github.com\/trinsic-id\/sdk"/' "$packageJson"
    sed -i 's/"author": "[^"]*"/"author": "Trinsic"/' "$packageJson"
    
    # Add missing fields if they don't exist (basic approach)
    if ! grep -q '"homepage"' "$packageJson"; then
        sed -i 's/\(.*"author".*\)/\1,\n  "homepage": "https:\/\/trinsic.id"/' "$packageJson"
    fi
    
    if ! grep -q '"license"' "$packageJson"; then
        sed -i 's/\(.*"homepage".*\)/\1,\n  "license": "MIT"/' "$packageJson"
    fi
fi

pushd "$SCRIPT_DIR/sdk" > /dev/null

npm install
if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "npm install failed"
fi

npm pack --pack-destination "$SCRIPT_DIR/sdk/publish"
if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "npm pack failed"
fi

popd > /dev/null