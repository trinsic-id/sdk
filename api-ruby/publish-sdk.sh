#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

echo "Publishing RubyGems package..."

export GEM_HOST_API_KEY="$RUBYGEMS_API_TOKEN"
gem signin >/dev/null
if [ $? -ne 0 ]; then
    handle_error "Gem signin failed"
fi

pushd "$SCRIPT_DIR/sdk/publish" > /dev/null

echo "Publishing packages"
for package in trinsic_api-*.gem; do
    if [ -f "$package" ]; then
        echo "Publishing $package"
        gem push "$package"
        if [ $? -ne 0 ]; then
            popd > /dev/null
            handle_error "Gem push failed"
        fi
        echo "Published $package"
    fi
done

popd > /dev/null