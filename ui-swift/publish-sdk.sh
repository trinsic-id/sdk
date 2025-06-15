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

# Environment variables
sdkRepositoryPath="$SDK_REPOSITORY_PATH"
githubPAT="$PAT_GITHUB"

# Change to sdk directory
cd "$SCRIPT_DIR/sdk"

git config --global user.name "github-actions[bot]"
git config --global user.email "github-actions[bot]@users.noreply.github.com"

# Commit and push to sub module
remoteOrigin="https://$githubPAT@github.com/trinsic-id/sdk-swift-ui.git"
echo "Setting origin to $remoteOrigin"
git remote set-url origin "$remoteOrigin"

echo "Checking out main branch"
# If we don't do this we're in a detached head state
git checkout main

# Pull so we both A) update the submodule to the latest ref and B) commit on top of HEAD
git pull

packageVersion=$("$SCRIPT_DIR/../get-version.sh" "swiftUIVersion")

# Define the path to the podspec file
podspecPath="TrinsicUI.podspec"

# Read the podspec file content and update it
if [ -f "$podspecPath" ]; then
    # Create a temporary file for the updated content
    tmpfile=$(mktemp)
    
    # Update the version and tag in the podspec content
    sed -e "s/s\.version[[:space:]]*=[[:space:]]*'[0-9.]*'/s.version          = '$packageVersion'/" \
        -e "s|s\.source[[:space:]]*=[[:space:]]*{[^}]*}|s.source       = { :git => 'https://github.com/trinsic-id/sdk-swift-ui.git', :tag => '$packageVersion' }|" \
        "$podspecPath" > "$tmpfile"
    
    # Move the temporary file to replace the original
    mv "$tmpfile" "$podspecPath"
    
    echo "Podspec file updated with version $packageVersion."
else
    handle_error "Podspec file not found"
fi

echo "Adding files to git"
git add .

echo "Committing files"
git commit -m "Publishing latest ui-swift package for version $packageVersion"

echo "Pushing to submodule repository"
git push origin main

if [ $? -ne 0 ]; then
    handle_error "Failed to push to submodule main"
fi

tagName="$packageVersion"
git tag "$tagName"
git push origin "$tagName"

# Create .netrc file for CocoaPods authentication
netrcContent="machine https://github.com
login engineering@trinsic.id
password $COCOAPODS_TRUNK_TOKEN"

echo "$netrcContent" > "$HOME/.netrc"
chmod 600 "$HOME/.netrc"

echo "Pushing to CocoaPods trunk"

pod trunk push TrinsicUI.podspec

if [ $? -ne 0 ]; then
    handle_error "Failed to push to CocoaPods trunk"
fi

# Go back to main repo and update reference
cd "$SCRIPT_DIR/../"
remoteOrigin="https://$githubPAT@github.com/$sdkRepositoryPath.git"
echo "Setting origin to $remoteOrigin"
git remote set-url origin "$remoteOrigin"

# Update reference in main repo
git add "ui-swift/sdk"
git commit -m "Update ui-swift submodule reference to version $packageVersion"
git push origin main
if [ $? -ne 0 ]; then
    handle_error "Failed to push to our main"
fi
