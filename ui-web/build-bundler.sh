#!/bin/bash

# Parameters
if [ $# -ne 1 ]; then
    echo "Usage: $0 <bundlerName>"
    exit 1
fi

bundlerName="$1"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

pushd "$SCRIPT_DIR/samples/bundlers/$bundlerName" > /dev/null

npm ci
if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "npm ci failed"
fi

echo "Building bundler $bundlerName project..."
npm run build

if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "npm build $bundlerName failed"
fi

popd > /dev/null