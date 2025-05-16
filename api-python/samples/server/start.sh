#!/bin/bash

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

# Check if 'python' is available
pythonPath=$(command -v python 2>/dev/null)
pipPath=$(command -v pip 2>/dev/null)

# If 'python' is not available, check for 'python3'
if [ -z "$pythonPath" ]; then
    pythonPath=$(command -v python3 2>/dev/null)
    pipPath=$(command -v pip3 2>/dev/null)
fi

# If neither 'python' nor 'python3' is available, print an error and exit
if [ -z "$pythonPath" ]; then
    echo "Neither 'python' nor 'python3' was found in your system path." >&2
    exit 1
fi

echo "Setting up Python virtual environment..."
"$pythonPath" -m venv venv
if [ $? -ne 0 ]; then
    echo "Failed to create virtual environment." >&2
    exit 1
fi

echo "Activating virtual environment..."
# Activate the virtual environment
. ./venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt 

if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies"
    exit 1
fi

echo "Starting Python API sample..."
"$pythonPath" main.py