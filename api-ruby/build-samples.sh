#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

RB_SAMPLES_DIR="$SCRIPT_DIR/samples/server"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

echo "Building api-ruby sample project..."
pushd "$RB_SAMPLES_DIR" > /dev/null

bundle install
ruby validator.rb
exitCode=$?

popd > /dev/null

if [ $exitCode -ne 0 ]; then
    handle_error "The ruby validator.rb command failed with exit code $exitCode"
fi