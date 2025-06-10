#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

# Additional properties for Python client generation
additionalProperties="packageName=trinsic_api,packageVersion=[VERSION],packageUrl=https://trinsic.id,projectName=Trinsic-Api"

# Generate the Python client
"$SCRIPT_DIR/../helpers/generate-client.sh" \
    -l "python" \
    -o "$SCRIPT_DIR/sdk" \
    -a "$additionalProperties"

if [ $? -ne 0 ]; then
    handle_error "Failed to generate Python client"
fi

# Copy additional files
cp "$SCRIPT_DIR/README.md" "$SCRIPT_DIR/sdk/"
cp "$SCRIPT_DIR/../LICENSE" "$SCRIPT_DIR/sdk/"

pushd "$SCRIPT_DIR/sdk" > /dev/null

# Modify setup.py file - remove content starting from 'setup(' line
setupFilePath="$SCRIPT_DIR/sdk/setup.py"
if [ -f "$setupFilePath" ]; then
    # Find the line number where 'setup(' starts and keep everything before it
    lineNum=$(grep -n '^\s*setup(' "$setupFilePath" | cut -d: -f1 | head -1)
    if [ -n "$lineNum" ]; then
        # Keep everything before the setup( line
        head -n $((lineNum - 1)) "$setupFilePath" > "${setupFilePath}.tmp"
        mv "${setupFilePath}.tmp" "$setupFilePath"
    fi
    
    # Append the new setup content
    cat >> "$setupFilePath" << 'EOF'
with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name=NAME,
    version=VERSION,
    description="Trinsic API",
    author="trinsic-id",
    author_email="support@trinsic.id",
    url="https://trinsic.id",
    keywords=["Trinsic", "SDK", "Identity verification"],
    install_requires=REQUIRES,
    packages=find_packages(exclude=["test", "tests"]),
    include_package_data=True,
    license_files="LICENSE",
    long_description_content_type='text/markdown',
    long_description=long_description,
    package_data={"trinsic_api": ["py.typed"]},
)
EOF
fi

# Determine Python interpreter and pip
pythonPath=""
pipPath=""

if command -v python >/dev/null 2>&1; then
    pythonPath="python"
    pipPath="pip"
elif command -v python3 >/dev/null 2>&1; then
    pythonPath="python3"
    pipPath="pip3"
else
    popd > /dev/null
    handle_error "Neither 'python' nor 'python3' was found in your system path."
fi

# Build the Python package
"$pythonPath" setup.py sdist --dist-dir "$SCRIPT_DIR/sdk/publish" bdist_wheel --dist-dir "$SCRIPT_DIR/sdk/publish"
if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "Python setup.py failed"
fi

"$pipPath" install .
if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "Python pip install failed"
fi

popd > /dev/null