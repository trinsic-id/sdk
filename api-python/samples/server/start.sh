#!/bin/bash
set -euo pipefail

if [ -z "$TRINSIC_ACCESS_TOKEN" ]; then
    if [ ! -f .env ] || ! grep -q "TRINSIC_ACCESS_TOKEN" .env; then
        echo "Error: TRINSIC_ACCESS_TOKEN environment variable not set or .env file not found"
        exit 1
    fi
fi

echo "Build UI sample..."
cd ../../../ui-web/samples
npm ci
npm run build

cd ../../api-python/samples/server

# Pin to Python 3.13
PYTHON_VERSION="3.13"

# Prefer pyenv if installed
if command -v pyenv >/dev/null 2>&1; then
    # Ensure pyenv shims are active in this non-interactive script
    eval "$(pyenv init -)"

    echo "Ensuring Python 3.13 is installed via pyenv..."
    pyenv install -s "3.13"

    # Point to this version to activate the venv
    pythonPath="$(command -v python3.13)"
else
    # Look for the pinned python version
    pythonPath="$(command -v python3.13 2>/dev/null || true)"
    if [ -z "${pythonPath}" ]; then
        echo "Python ${PYTHON_VERSION} (3.13) is required." >&2
        echo "Install pyenv (recommended) or install a system python3.13, then re-run this script." >&2
        exit 1
    fi
fi

echo "Using Python interpreter: ${pythonPath}"

echo "Setting up Python virtual environment in the current directory..."
"${pythonPath}" -m venv venv

echo "Activating virtual environment..."
. ./venv/bin/activate

echo "Installing Python dependencies..."
python -m pip install -r requirements.txt

echo "Starting Python API sample..."
python main.py