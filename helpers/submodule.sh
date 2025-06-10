#!/bin/bash

# Function to show usage
show_usage() {
    echo "Usage: $0 -s <sourceLocation> -d <destinationLocation> -t <githubPAT> -r <repositoryPath> -p <packageVersion> -n <name> -k <sdkRepositoryPath> [-g <tagPrefix>]"
    echo "  -s, --source             Source location (required)"
    echo "  -d, --destination        Destination location (required)"
    echo "  -t, --github-pat         GitHub PAT token (required)"
    echo "  -r, --repository-path    Repository path (required)"
    echo "  -p, --package-version    Package version (required)"
    echo "  -n, --name              Name (required)"
    echo "  -k, --sdk-repo-path     SDK repository path (required)"
    echo "  -g, --tag-prefix        Tag prefix (defaults to 'v')"
    echo "  -h, --help              Show this help message"
    exit 1
}

# Default values
tagPrefix="v"
sourceLocation=""
destinationLocation=""
githubPAT=""
repositoryPath=""
packageVersion=""
name=""
sdkRepositoryPath=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -s|--source)
            sourceLocation="$2"
            shift 2
            ;;
        -d|--destination)
            destinationLocation="$2"
            shift 2
            ;;
        -t|--github-pat)
            githubPAT="$2"
            shift 2
            ;;
        -r|--repository-path)
            repositoryPath="$2"
            shift 2
            ;;
        -p|--package-version)
            packageVersion="$2"
            shift 2
            ;;
        -n|--name)
            name="$2"
            shift 2
            ;;
        -k|--sdk-repo-path)
            sdkRepositoryPath="$2"
            shift 2
            ;;
        -g|--tag-prefix)
            tagPrefix="$2"
            shift 2
            ;;
        -h|--help)
            show_usage
            ;;
        *)
            echo "Unknown parameter: $1"
            show_usage
            ;;
    esac
done

# Validate required parameters
if [ -z "$sourceLocation" ] || [ -z "$destinationLocation" ] || [ -z "$githubPAT" ] || [ -z "$repositoryPath" ] || [ -z "$packageVersion" ] || [ -z "$name" ] || [ -z "$sdkRepositoryPath" ]; then
    echo "Error: Missing required parameters"
    show_usage
fi

# Validate paths exist
if [ ! -d "$destinationLocation" ]; then
    echo "Error: The destination location '$destinationLocation' does not exist."
    exit 1
fi

if [ ! -d "$sourceLocation" ]; then
    echo "Error: The source location '$sourceLocation' does not exist."
    exit 1
fi

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Store original directory to restore later
original_dir=$(pwd)

# Function to cleanup on exit
cleanup() {
    cd "$original_dir"
}
trap cleanup EXIT

# Change to destination location
cd "$destinationLocation"

# Configure git
git config --global user.name "github-actions[bot]"
git config --global user.email "github-actions[bot]@users.noreply.github.com"

# Commit and push to sub module
remoteOrigin="https://$githubPAT@github.com/$repositoryPath.git"
echo "Setting origin to $remoteOrigin"
git remote set-url origin "$remoteOrigin"

echo "Checking out main branch"
# If we don't do this we're in a detached head state
git checkout main

# Check if there are files other than .git
contents=$(find . -maxdepth 1 -not -name '.' -not -name '.git' | wc -l)
if [ "$contents" -gt 0 ]; then
    echo "There are files or folders other than the .git folder, cleaning."
    git rm -r --cached .
    git clean -fdx
else
    echo "The only content is the .git folder, or the directory is empty, continuing."
fi

echo "Copying source code to destination"
cp -r "$sourceLocation"/* "$destinationLocation"/

echo "Adding files to git"
git add .

echo "Committing files"
git commit -m "Publishing latest $name package for version $packageVersion"

echo "Pushing to submodule repository"
git push origin main

if [ $? -ne 0 ]; then
    echo "Error: Failed to push to submodule main"
    exit 1
fi

tagName="$tagPrefix$packageVersion"
git tag "$tagName"
git push origin "$tagName"

# Change to script directory parent
cd "$SCRIPT_DIR/../"
remoteOrigin="https://$githubPAT@github.com/$sdkRepositoryPath.git"
echo "Setting origin to $remoteOrigin"
git remote set-url origin "$remoteOrigin"

# Update reference in main repo
git add "$destinationLocation"
git commit -m "Update $name submodule reference to version $packageVersion"
git push origin main

if [ $? -ne 0 ]; then
    echo "Error: Failed to push to our main"
    exit 1
fi