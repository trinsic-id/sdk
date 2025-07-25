#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

# Publish NuGet packages
dotnet nuget push "$SCRIPT_DIR/sdk/publish/*.nupkg" --source "https://api.nuget.org/v3/index.json" --api-key "$NUGET_API_KEY"

if [ $? -ne 0 ]; then
    handle_error "dotnet nuget push failed"
fi
