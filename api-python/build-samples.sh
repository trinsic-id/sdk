#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_SAMPLES_DIR="$SCRIPT_DIR/../ui-web/samples"
PY_SAMPLES_DIR="$SCRIPT_DIR/samples/server"
force_install=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force-install|-forceInstall)
      force_install=true
      shift
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

echo "Building ui-web project..."
(
  cd "$WEB_SAMPLES_DIR"
  npm ci
  npm run build
)

echo "Installing Python dependencies..."
(
  cd "$PY_SAMPLES_DIR"
  python3 -m venv .venv
  # shellcheck disable=SC1091
  source .venv/bin/activate
  if [[ "$force_install" == true ]]; then
    python -m pip install --break-system-packages -r requirements.txt
  else
    python -m pip install -r requirements.txt
  fi

  echo "Running validate.py..."
  python validate.py
)
