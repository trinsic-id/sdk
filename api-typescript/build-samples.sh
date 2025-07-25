#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

TS_SAMPLES_DIR="$SCRIPT_DIR/samples/server"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

echo "Building api-typescript sample project..."
pushd "$TS_SAMPLES_DIR" > /dev/null
npm ci
npm run build
exitCode=$?
popd > /dev/null

if [ $exitCode -ne 0 ]; then
    handle_error "The npm build command failed with exit code $exitCode"
fi