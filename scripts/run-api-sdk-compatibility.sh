#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
exec node --use-system-ca "$ROOT/scripts/sdk-compatibility/run.mjs" "$@"
