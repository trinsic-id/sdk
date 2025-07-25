#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

WEB_SAMPLES_DIR="$SCRIPT_DIR/../ui-web/samples"
PHP_SAMPLES_DIR="$SCRIPT_DIR/samples/server"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

echo "Building ui-web project..."
pushd "$WEB_SAMPLES_DIR" > /dev/null
npm ci
if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "The npm ci command failed"
fi

npm run build
exitCode=$?
popd > /dev/null

if [ $exitCode -ne 0 ]; then
    handle_error "The npm build command failed with exit code $exitCode"
fi

echo "Copying ui-web dist directory..."
cp -r "$WEB_SAMPLES_DIR/dist/"* "$PHP_SAMPLES_DIR/public/"

pushd "$PHP_SAMPLES_DIR" > /dev/null

echo "Installing api-php sample project dependencies..."
composer install

echo "Ensure there's an .env file..."
if [ ! -f "$PHP_SAMPLES_DIR/.env" ]; then
    touch "$PHP_SAMPLES_DIR/.env"
fi

echo "Validating php script..."
php public/index.php
exitCode=$?

popd > /dev/null

if [ $exitCode -ne 0 ]; then
    handle_error "The php public/index.php command failed with exit code $exitCode"
fi