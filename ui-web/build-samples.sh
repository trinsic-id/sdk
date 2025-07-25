#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

pushd "$SCRIPT_DIR/samples" > /dev/null

npm ci
if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "npm ci failed"
fi

echo "Building ui-web sample project..."
npm run build

if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "npm build failed"
fi

echo "Building bundlers"
for bundler in "$SCRIPT_DIR/samples/bundlers"/*; do
    if [ -d "$bundler" ]; then
        bundlerName=$(basename "$bundler")
        echo "Building bundler $bundlerName project..."
        "$SCRIPT_DIR/build-bundler.sh" "$bundlerName"
        
        if [ $? -ne 0 ]; then
            popd > /dev/null
            handle_error "build-bundler.sh failed for bundler $bundlerName"
        fi
        echo "Bundler $bundlerName project built successfully"
    fi
done

popd > /dev/null