#!/bin/bash

if [ -z "$TRINSIC_ACCESS_TOKEN" ]; then
    if [ ! -f .env ] || ! grep -q "TRINSIC_ACCESS_TOKEN" .env; then
        echo "Error: TRINSIC_ACCESS_TOKEN environment variable not set or .env file not found"
        exit 1
    fi
fi

echo "Starting Typescript API sample..."
npm ci
npm run start