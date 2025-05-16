#!/bin/bash

if [ -z "$TRINSIC_ACCESS_TOKEN" ]; then
    if [ ! -f .env ] || ! grep -q "TRINSIC_ACCESS_TOKEN" .env; then
        echo "Error: TRINSIC_ACCESS_TOKEN environment variable not set or .env file not found"
        exit 1
    fi
fi

echo "Build UI sample..."
cd ../../ui-web/samples
npm ci
npm run build

echo "Starting C# API sample..."
cd ../../api-csharp/samples
dotnet run --project ./Sample/Sample.csproj