#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

CS_SAMPLES_DIR="$SCRIPT_DIR/samples/server"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

echo "Building api-CS sample project..."
pushd "$CS_SAMPLES_DIR" > /dev/null
dotnet build Sample/Sample.csproj
exitCode=$?
popd > /dev/null

if [ $exitCode -ne 0 ]; then
    handle_error "The build command failed with exit code $exitCode"
fi
