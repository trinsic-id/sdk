#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Store original directory to restore later
original_dir=$(pwd)

# Function to cleanup on exit
cleanup() {
    cd "$original_dir"
}
trap cleanup EXIT

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

echo "Setting npm token"
npm set //registry.npmjs.org/:_authToken "$NPM_TOKEN"
if [ $? -ne 0 ]; then
    handle_error "npm set config failed"
fi

# Change to publish directory
cd "$SCRIPT_DIR/sdk/publish"

echo "Publishing packages"
for package in trinsic-web-ui-*.tgz; do
    if [ -f "$package" ]; then
        echo "Publishing $package"
        npm publish "$package" --yes --no-git-tag-version --access=public
        if [ $? -ne 0 ]; then
            handle_error "npm publish failed"
        fi
        echo "Published $package"
    fi
done
