#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Building api-ruby sample project..."
(
  cd "$SCRIPT_DIR/samples/server"
  bundle install
  ruby validator.rb
)
