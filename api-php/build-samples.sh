#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_SAMPLES_DIR="$SCRIPT_DIR/../ui-web/samples"
PHP_SAMPLES_DIR="$SCRIPT_DIR/samples/server"

echo "Building ui-web project..."
(
  cd "$WEB_SAMPLES_DIR"
  npm ci
  npm run build
)

echo "Copying ui-web dist directory..."
mkdir -p "$PHP_SAMPLES_DIR/public"
cp -R "$WEB_SAMPLES_DIR"/dist/. "$PHP_SAMPLES_DIR/public"/

echo "Installing api-php sample project dependencies..."
(
  cd "$PHP_SAMPLES_DIR"
  composer install

  echo "Ensure there is an .env file..."
  touch .env

  echo "Validating php script..."
  php public/index.php
)
