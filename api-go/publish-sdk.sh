#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

# Variables
destinationLocation="$SCRIPT_DIR/sdk"
sourceLocation="$SCRIPT_DIR/sdk-build"
repositoryPath="trinsic-id/sdk-go-api"
name="Go"

# Call the submodule helper script
"$SCRIPT_DIR/../helpers/submodule.sh" \
    --name "$name" \
    --source "$sourceLocation" \
    --destination "$destinationLocation" \
    --sdk-repo-path "$SDK_REPOSITORY_PATH" \
    --github-pat "$PAT_GITHUB" \
    --repository-path "$repositoryPath" \
    --package-version "$PACKAGE_VERSION"

if [ $? -ne 0 ]; then
    handle_error "submodule.sh script failed"
fi
