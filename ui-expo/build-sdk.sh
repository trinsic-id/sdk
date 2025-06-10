#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

pushd "$SCRIPT_DIR/sdk" > /dev/null

npm ci
if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "npm ci failed"
fi

version=$("$SCRIPT_DIR/../get-version.sh" "expoUIVersion")
if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "Failed to get version"
fi

npm version "$version" --no-git-tag-version
if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "npm version failed"
fi

npm run build
if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "npm run build failed"
fi

if [ ! -d "publish" ]; then
    mkdir -p "publish"
fi

npm pack --pack-destination "$SCRIPT_DIR/sdk/publish"
if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "npm pack failed"
fi

# Test the testbed
pushd "$SCRIPT_DIR/sdk/testbed" > /dev/null

npm ci
if [ $? -ne 0 ]; then
    popd > /dev/null
    popd > /dev/null
    handle_error "npm ci for testbed failed"
fi

npm run check
if [ $? -ne 0 ]; then
    popd > /dev/null
    popd > /dev/null
    handle_error "npm run check for testbed failed"
fi

popd > /dev/null
popd > /dev/null