#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

# Get environment variables
sdkRepositoryPath="$SDK_REPOSITORY_PATH"
githubPAT="$PAT_GITHUB"

# Check if required environment variables are set
if [ -z "$sdkRepositoryPath" ]; then
    handle_error "SDK_REPOSITORY_PATH environment variable is not set"
fi

if [ -z "$githubPAT" ]; then
    handle_error "PAT_GITHUB environment variable is not set"
fi

# Store original directory
originalDir=$(pwd)

# Change to sdk directory
cd "$SCRIPT_DIR/sdk" || handle_error "Failed to change to sdk directory"

# Configure git
git config --global user.name "github-actions[bot]"
git config --global user.email "github-actions[bot]@users.noreply.github.com"

# Commit and push to sub module
remoteOrigin="https://$githubPAT@github.com/trinsic-id/sdk-android-ui.git"
echo "Setting origin to $remoteOrigin"
git remote set-url origin "$remoteOrigin"

echo "Checking out main branch"
# If we don't do this we're in a detached head state
git checkout main

if [ $? -ne 0 ]; then
    handle_error "Failed to checkout main branch"
fi

# Pull latest version of code
git pull

if [ $? -ne 0 ]; then
    handle_error "Failed to pull latest code"
fi

echo "Adding files to git"
git add .

# Get package version
packageVersion=$("$SCRIPT_DIR/../get-version.sh" "androidUIVersion")

if [ $? -ne 0 ]; then
    handle_error "Failed to get package version"
fi

echo "Committing files"
git commit -m "Publishing latest ui-android package for version $packageVersion"

echo "Pushing to submodule repository"
git push origin main

if [ $? -ne 0 ]; then
    handle_error "Failed to push to submodule main"
fi

tagName="$packageVersion"
git tag "$tagName"
git push origin "$tagName"

if [ $? -ne 0 ]; then
    handle_error "Failed to push tag"
fi

# Go back to main repo and update reference
cd "$SCRIPT_DIR/../" || handle_error "Failed to change to parent directory"
remoteOrigin="https://$githubPAT@github.com/$sdkRepositoryPath.git"
echo "Setting origin to $remoteOrigin"
git remote set-url origin "$remoteOrigin"

# Update reference in main repo
git add "ui-android/sdk"
git commit -m "Update ui-android submodule reference to version $packageVersion"
git push origin main

if [ $? -ne 0 ]; then
    handle_error "Failed to push to our main"
fi

# TODO: Hit jitpack post-publish to prompt it to trigger a build

# Return to original directory
cd "$originalDir" || true
