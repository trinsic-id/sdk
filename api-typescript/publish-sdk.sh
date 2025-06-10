#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

echo "Setting npm token"
npm set //registry.npmjs.org/:_authToken "$NPM_TOKEN"

npm whoami

pushd "$SCRIPT_DIR/sdk/publish" > /dev/null

echo "Publishing packages"
for package in trinsic-api-*.tgz; do
    if [ -f "$package" ]; then
        echo "Publishing $package"
        npm publish "$package" --yes --no-git-tag-version --access=public
        if [ $? -ne 0 ]; then
            popd > /dev/null
            handle_error "Failed to publish $package"
        fi
        echo "Published $package"
    fi
done

popd > /dev/null