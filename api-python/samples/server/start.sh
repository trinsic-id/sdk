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

echo "Installing Python dependencies..."
cd ../../api-python/samples/server
pip3 install -r requirements.txt --break-system-packages --user

if [ $? -ne 0 ]; then
    echo "Error: pip3 install failed"
    exit 1
fi

echo "Starting Python API sample..."
python3 main.py