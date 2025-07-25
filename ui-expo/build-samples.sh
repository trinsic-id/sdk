#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

# Change to the samples/expo-sample directory
cd "$SCRIPT_DIR/samples/expo-sample" || handle_error "Failed to change to expo-sample directory"

# Run npm ci
npm ci

if [ $? -ne 0 ]; then
    handle_error "npm ci failed"
fi

# Run npm run check
npm run check

if [ $? -ne 0 ]; then
    handle_error "npm ci for testbed failed"
fi

# Return to original directory
cd - >/dev/null
