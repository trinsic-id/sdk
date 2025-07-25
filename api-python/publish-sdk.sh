#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

echo "Publishing to PyPi"

export TWINE_USERNAME="__token__"
export TWINE_PASSWORD="$PYPI_API_TOKEN"

# Determine pip command
pipPath=""
if command -v pip >/dev/null 2>&1; then
    pipPath="pip"
elif command -v pip3 >/dev/null 2>&1; then
    pipPath="pip3"
else
    handle_error "Neither 'pip' nor 'pip3' was found in your system path."
fi

"$pipPath" install twine >/dev/null
if [ $? -ne 0 ]; then
    handle_error "Pip install twine failed"
fi

twine upload api-python/sdk/publish/*
if [ $? -ne 0 ]; then
    handle_error "Twine upload failed"
fi

echo "Published to PyPi"