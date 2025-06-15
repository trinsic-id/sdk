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

# Run flutter pub get for main sdk
flutter pub get

if [ $? -ne 0 ]; then
    handle_error "flutter pub get sdk failed"
fi

# Run flutter pub get for testbed
cd "$SCRIPT_DIR/sdk/testbed" || handle_error "Failed to change to testbed directory"

flutter pub get

if [ $? -ne 0 ]; then
    handle_error "flutter pub get testbed failed"
fi

# Return to sdk directory
cd "$SCRIPT_DIR/sdk" || handle_error "Failed to change back to sdk directory"

# Get version using the get-version script
version=$("$SCRIPT_DIR/../get-version.sh" "flutterUIVersion")

if [ $? -ne 0 ]; then
    handle_error "Failed to get version"
fi

echo "Setting version to $version"

# Update pubspec.yaml version using sed
if [ -f "pubspec.yaml" ]; then
    sed -i.bak "s/^version: [0-9a-zA-Z\.\-]*$/version: $version/" "pubspec.yaml"
    
    if [ $? -eq 0 ]; then
        # Remove backup file if sed succeeded
        rm -f "pubspec.yaml.bak"
        echo "pubspec.yaml updated with version $version"
    else
        # Restore from backup if sed failed
        if [ -f "pubspec.yaml.bak" ]; then
            mv "pubspec.yaml.bak" "pubspec.yaml"
        fi
        handle_error "Failed to update pubspec.yaml"
    fi
else
    handle_error "pubspec.yaml not found"
fi

echo "Ensuring CHANGELOG.md starts with version $version"

# Check and update CHANGELOG.md
if [ -f "CHANGELOG.md" ]; then
    if ! grep -q "## $version" "CHANGELOG.md"; then
        echo "CHANGELOG.md needs patching -- doing so"
        # Create temporary file with new changelog content
        {
            echo "## $version"
            echo ""
            echo "- Auto-Generated changelog -- please visit https://github.com/trinsic-id/sdk for info"
            echo ""
            cat "CHANGELOG.md"
        } > "CHANGELOG.md.tmp"
        
        # Replace original file
        mv "CHANGELOG.md.tmp" "CHANGELOG.md"
    fi
else
    handle_error "CHANGELOG.md not found"
fi

echo "Copying README.md to sdk folder so publish command works"

# Copy README.md from parent directory
cp "../README.md" "README.md" || handle_error "Failed to copy README.md"

# Run flutter analyze
flutter analyze

if [ $? -ne 0 ]; then
    handle_error "flutter analyze failed"
fi

# Run flutter test
flutter test

if [ $? -ne 0 ]; then
    handle_error "flutter test failed"
fi

# Run flutter pub publish dry run
flutter pub publish --dry-run

if [ $? -ne 0 ]; then
    handle_error "flutter publish dry run failed"
fi

# Test the testbed
cd "$SCRIPT_DIR/sdk/testbed" || handle_error "Failed to change to testbed directory"

flutter analyze

if [ $? -ne 0 ]; then
    handle_error "flutter analyze testbed failed"
fi

flutter test

if [ $? -ne 0 ]; then
    handle_error "flutter test testbed failed"
fi

# Return to original directory
cd - >/dev/null
