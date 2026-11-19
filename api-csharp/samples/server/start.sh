#!/bin/bash

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f ../../sdk/src/Trinsic.Api/Trinsic.Api.csproj ]; then
    echo "Generate the SDK first: run ./api-csharp/build-sdk.sh from the repository root"
    exit 1
fi

if [ -z "${TRINSIC_ACCESS_TOKEN:-}" ]; then
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
cd "$SCRIPT_DIR/Sample"
dotnet run --project Sample.csproj
