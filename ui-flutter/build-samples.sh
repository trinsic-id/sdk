#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

FLUTTER_SAMPLES_DIR="$SCRIPT_DIR/samples/flutter_sample"

echo "Building ui-flutter sample project..."

# Change to the flutter samples directory
cd "$FLUTTER_SAMPLES_DIR" || handle_error "Failed to change to flutter_sample directory"

# Run flutter pub get
flutter pub get

if [ $? -ne 0 ]; then
    handle_error "flutter pub failed"
fi

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

echo "Building Flutter Android APK..."

# Build flutter Android APK
flutter build apk

if [ $? -ne 0 ]; then
    handle_error "The flutter build APK command failed with exit code $?"
fi

# Return to original directory
cd - >/dev/null
