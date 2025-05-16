#!/bin/bash

if [ -z "$TRINSIC_ACCESS_TOKEN" ]; then
    if [ ! -f .env ] || ! grep -q "TRINSIC_ACCESS_TOKEN" .env; then
        echo "Error: TRINSIC_ACCESS_TOKEN environment variable not set or .env file not found"
        exit 1
    fi
fi

echo "Build UI sample..."
cd ../../../ui-web/samples
npm install
npm run build

echo "Installing Ruby dependencies..."
cd ../../api-ruby/samples/server
bundle install

if [ $? -ne 0 ]; then
    echo "Error: bundle install failed"
    exit 1
fi

echo "Starting Ruby API sample..."
ruby app.rb