#!/bin/bash

# Default values
swaggerFileOrUrl="https://api.trinsic.id/swagger/api/swagger.json"
versionName=""
language=""
outputFolder=""
additionalProperties=""

# Function to show usage
show_usage() {
    echo "Usage: $0 -l <language> -o <outputFolder> -a <additionalProperties> [-v <versionName>] [-s <swaggerFileOrUrl>]"
    echo "  -l, --language           Language for SDK generation (required)"
    echo "  -o, --output-folder      Output folder path (required)" 
    echo "  -a, --additional-props   Additional properties as comma-separated key=value pairs (required)"
    echo "  -v, --version-name       Version name (defaults to language)"
    echo "  -s, --swagger-file       Swagger file or URL (defaults to Trinsic API)"
    echo "  -h, --help              Show this help message"
    exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -l|--language)
            language="$2"
            shift 2
            ;;
        -v|--version-name)
            versionName="$2"
            shift 2
            ;;
        -s|--swagger-file)
            swaggerFileOrUrl="$2"
            shift 2
            ;;
        -o|--output-folder)
            outputFolder="$2"
            shift 2
            ;;
        -a|--additional-props)
            additionalProperties="$2"
            shift 2
            ;;
        -h|--help)
            show_usage
            ;;
        *)
            echo "Unknown parameter: $1"
            show_usage
            ;;
    esac
done

# Validate required parameters
if [ -z "$language" ] || [ -z "$outputFolder" ] || [ -z "$additionalProperties" ]; then
    echo "Error: Missing required parameters"
    show_usage
fi

# Set default versionName to language if not provided
if [ -z "$versionName" ]; then
    versionName="$language"
fi

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Create output folder if it doesn't exist
if [ ! -d "$outputFolder" ]; then
    mkdir -p "$outputFolder"
fi

localSwaggerFilePath=""
if [[ "$swaggerFileOrUrl" == https://* ]]; then
    echo "The URL starts with https://, retrieving the file"
    echo "Downloading specification from $swaggerFileOrUrl"
    localSwaggerFilePath="$SCRIPT_DIR/swagger.json"
    
    if command -v curl >/dev/null 2>&1; then
        curl -s -o "$localSwaggerFilePath" "$swaggerFileOrUrl"
    elif command -v wget >/dev/null 2>&1; then
        wget -q -O "$localSwaggerFilePath" "$swaggerFileOrUrl"
    else
        echo "Error: Neither curl nor wget found. Cannot download swagger file."
        exit 1
    fi
    
    if [ $? -ne 0 ]; then
        echo "Error: Failed to download specification from $swaggerFileOrUrl"
        exit 1
    fi
    
    echo "Downloaded specification from $swaggerFileOrUrl to $localSwaggerFilePath"
else
    echo "The URL does not start with https://, assuming it's a local file at $swaggerFileOrUrl"
    if [ ! -f "$swaggerFileOrUrl" ]; then
        echo "Error: The swagger file '$swaggerFileOrUrl' does not exist."
        exit 1
    fi
    localSwaggerFilePath="$swaggerFileOrUrl"
fi

# Clean up output folder
if [ -d "$outputFolder" ]; then
    echo "Cleaning up output folder $outputFolder"
    rm -rf "$outputFolder"
    echo "Cleaned up destination folder $outputFolder"
fi

mkdir -p "$outputFolder"
echo "Created output folder"

# Create publish folder
publishFolder="$outputFolder/publish"
if [ ! -d "$publishFolder" ]; then
    mkdir -p "$publishFolder"
fi

# Get version
version=$("$SCRIPT_DIR/../get-version.sh" "$versionName")
if [ $? -ne 0 ]; then
    echo "Error: Failed to get version for $versionName"
    exit 1
fi

# Replace [VERSION] placeholder in additional properties
concatenatedAdditionalProperties=$(echo "$additionalProperties" | sed "s/\[VERSION\]/$version/g")

echo "Generating $language SDK from $localSwaggerFilePath in $outputFolder with additional properties: $concatenatedAdditionalProperties"

# Generate SDK using OpenAPI generator
npx --yes openapi-generator-cli generate \
    -i "$localSwaggerFilePath" \
    -g "$language" \
    -o "$outputFolder" \
    --additional-properties="$concatenatedAdditionalProperties" >/dev/null

if [ $? -ne 0 ]; then
    echo "Error: Failed to generate SDK for $language from $localSwaggerFilePath to $outputFolder."
    exit 1
fi

echo "Generated $language SDK $outputFolder"