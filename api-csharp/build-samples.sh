#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Building api-csharp sample project..."
(
  cd "$SCRIPT_DIR/samples/server"
  dotnet build Sample/Sample.csproj
)
