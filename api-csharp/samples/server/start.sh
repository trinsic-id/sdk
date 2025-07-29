#!/bin/bash

if [ -z "$TRINSIC_ACCESS_TOKEN" ]; then
    if [ ! -f Sample/.env ] || ! grep -q "TRINSIC_ACCESS_TOKEN" Sample/.env; then
        echo "Error: TRINSIC_ACCESS_TOKEN environment variable not set or Sample/.env file not found"
        exit 1
    fi
fi

echo "Build UI sample..."
cd ../../../ui-web/samples
npm ci
npm run build

echo "Starting C# API sample..."
cd ../../api-csharp/samples/server
dotnet run --project ./Sample/Sample.csproj