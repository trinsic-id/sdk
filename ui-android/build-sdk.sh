#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

# Change to the sdk directory
cd "$SCRIPT_DIR/sdk" || handle_error "Failed to change to sdk directory"

# Run gradlew library build
./gradlew :library:build

if [ $? -ne 0 ]; then
    handle_error "gradlew library build failed"
fi

# Get package version
packageVersion=$("$SCRIPT_DIR/../get-version.sh" "androidUIVersion")

if [ $? -ne 0 ]; then
    handle_error "Failed to get package version"
fi

# Define the path to the gradle file
gradlePath="./library/build.gradle.kts"

# Check if gradle file exists
if [ ! -f "$gradlePath" ]; then
    handle_error "Gradle file not found: $gradlePath"
fi

# Update the version in the gradle content using sed
if command -v sed >/dev/null 2>&1; then
    # Use sed to replace the version line
    sed -i.bak "s/^\s*version = \"[0-9.]*\"/            version = \"$packageVersion\"/" "$gradlePath"
    
    if [ $? -eq 0 ]; then
        # Remove backup file if sed succeeded
        rm -f "$gradlePath.bak"
        echo "Gradle file updated with version $packageVersion."
    else
        # Restore from backup if sed failed
        if [ -f "$gradlePath.bak" ]; then
            mv "$gradlePath.bak" "$gradlePath"
        fi
        handle_error "Failed to update gradle file"
    fi
else
    handle_error "sed command not available"
fi

# Return to original directory
cd - >/dev/null
