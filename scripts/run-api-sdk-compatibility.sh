#!/usr/bin/env bash

# Backward-compatible entry point for the shared SDK compatibility runner.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "$SCRIPT_DIR/sdk-compatibility/run.sh" "$@"
