#!/bin/bash

if [ ! -f .env ] || ! grep -q "TRINSIC_ACCESS_TOKEN" .env; then
    echo "Error: .env file not found or TRINSIC_ACCESS_TOKEN not set in .env file"
    exit 1
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