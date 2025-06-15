#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

# Change to the samples/android_sample directory
cd "$SCRIPT_DIR/samples/android_sample" || handle_error "Failed to change to android_sample directory"

# Run gradlew build
./gradlew build

if [ $? -ne 0 ]; then
    handle_error "gradlew sample build failed"
fi

# Return to original directory
cd - >/dev/null
