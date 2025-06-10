#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

WEB_SAMPLES_DIR="$SCRIPT_DIR/../ui-web/samples"
PY_SAMPLES_DIR="$SCRIPT_DIR/samples/server"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

# Parse command line arguments
forceInstall=false
while [[ $# -gt 0 ]]; do
    case $1 in
        --force-install)
            forceInstall=true
            shift
            ;;
        *)
            echo "Unknown parameter: $1"
            exit 1
            ;;
    esac
done

echo "Building ui-web project..."
pushd "$WEB_SAMPLES_DIR" > /dev/null
npm ci
npm run build
exitCode=$?
popd > /dev/null

if [ $exitCode -ne 0 ]; then
    handle_error "The npm build command failed with exit code $exitCode"
fi

echo "Installing Python dependencies..."
pushd "$PY_SAMPLES_DIR" > /dev/null

if [ "$forceInstall" = true ]; then
    pip3 install --break-system-packages -r requirements.txt
else
    pip3 install -r requirements.txt
fi

exitCode=$?

if [ $exitCode -ne 0 ]; then
    popd > /dev/null
    handle_error "The pip install command failed with exit code $exitCode"
fi

echo "Running validate.py..."
python3 validate.py
exitCode=$?

popd > /dev/null

if [ $exitCode -ne 0 ]; then
    handle_error "The python3 validate.py command failed with exit code $exitCode"
fi