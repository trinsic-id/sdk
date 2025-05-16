#!/bin/bash

if [ -z "$TRINSIC_ACCESS_TOKEN" ]; then
    if [ ! -f .env ] || ! grep -q "TRINSIC_ACCESS_TOKEN" .env; then
        echo "Error: TRINSIC_ACCESS_TOKEN environment variable not set or .env file not found"
        exit 1
    fi
fi

echo "Build UI sample..."
cd ../../../ui-web/samples
npm ci
npm run build

echo "Preparing PHP API sample..."
cd ../../api-php/samples/server
composer install

if [ $? -ne 0 ]; then
    echo "Error: composer install failed"
    exit 1
fi

echo "Starting PHP API sample..."
php -S localhost:3000 -t public