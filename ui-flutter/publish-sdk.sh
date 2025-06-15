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

# Change to sdk directory
cd "$SCRIPT_DIR/sdk"

echo "Copying README.md to sdk folder so publish command works"
cp "../README.md" "README.md"

flutter pub publish -f

if [ $? -ne 0 ]; then
    handle_error "flutter publish failed"
fi
