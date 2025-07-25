#!/bin/bash

# Parameters
if [ $# -ne 1 ]; then
    echo "Usage: $0 <versionName>"
    exit 1
fi

versionName="$1"

# Check for help flag
if [ "$versionName" = "--help" ] || [ "$versionName" = "-h" ]; then
    echo "Usage: $0 <versionName>"
    echo "Extract version from versions.json file"
    exit 0
fi

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Read and parse JSON content
if [ ! -f "$SCRIPT_DIR/versions.json" ]; then
    echo "Error: versions.json not found"
    exit 1
fi

# Extract version using jq or fallback to sed/grep parsing
if command -v jq >/dev/null 2>&1; then
    # Use jq if available
    directVersion=$(jq -r ".$versionName // null" "$SCRIPT_DIR/versions.json")
    
    if [ "$directVersion" != "null" ] && [ -n "$directVersion" ]; then
        version="$directVersion"
    else
        backendVersion=$(jq -r ".backendVersion" "$SCRIPT_DIR/versions.json")
        patchVersionKey="${versionName}PatchVersion"
        patchVersion=$(jq -r ".$patchVersionKey" "$SCRIPT_DIR/versions.json")
        version="${backendVersion}.${patchVersion}"
        echo "Package will be created with version $version from file based API Version $backendVersion and patchVersion $patchVersion"
    fi
else
    # Fallback without jq - basic JSON parsing with grep/sed
    directVersion=$(grep "\"$versionName\"" "$SCRIPT_DIR/versions.json" | sed 's/.*: *"\([^"]*\)".*/\1/')
    
    if [ -n "$directVersion" ]; then
        version="$directVersion"
    else
        backendVersion=$(grep '"backendVersion"' "$SCRIPT_DIR/versions.json" | sed 's/.*: *"\([^"]*\)".*/\1/')
        patchVersionKey="${versionName}PatchVersion"
        patchVersion=$(grep "\"$patchVersionKey\"" "$SCRIPT_DIR/versions.json" | sed 's/.*: *"\([^"]*\)".*/\1/')
        version="${backendVersion}.${patchVersion}"
        echo "Package will be created with version $version from file based API Version $backendVersion and patchVersion $patchVersion"
    fi
fi

# Output for GitHub Actions
if [ -n "$GITHUB_OUTPUT" ]; then
    echo "trinsic-package-version=$version" >> "$GITHUB_OUTPUT"
fi

echo "$version"