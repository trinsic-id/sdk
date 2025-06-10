#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

pushd "$SCRIPT_DIR/sdk" > /dev/null

# Copy README
cp "$SCRIPT_DIR/README.md" "$SCRIPT_DIR/sdk/"

npm ci
if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "npm ci failed"
fi

npm run build
if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "npm run build failed"
fi

# Get version
version=$("$SCRIPT_DIR/../get-version.sh" "webUIVersion")
if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "Failed to get version"
fi

npm version "$version" --no-git-tag-version
if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "npm version failed"
fi

# Create publish directory if it doesn't exist
if [ ! -d "publish" ]; then
    mkdir -p "publish"
fi

npm pack --pack-destination "$SCRIPT_DIR/sdk/publish"
if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "npm pack failed"
fi

popd > /dev/null
