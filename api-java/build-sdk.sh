#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to handle errors
handle_error() {
    echo "An error occurred: $1" >&2
    exit 1
}

# Additional properties for Java client generation
additionalProperties="apiPackage=id.trinsic.api,artifactVersion=[VERSION],library=native,modelPackage=id.trinsic.api.models,artifactId=api,groupId=id.trinsic,scmConnection=scm:git:https://github.com/trinsic-id/sdk.git,scmDeveloperConnection=scm:git:ssh://git@github.com/trinsic-id/sdk.git,scmUrl=https://github.com/trinsic-id/sdk,artifactUrl=https://trinsic.id,developerEmail=support@Trinsic.id,developerName=Trinsic,developerOrganization=Trinsic,developerOrganizationUrl=https://trinsic.id,artifactDescription=Trinsic,licenseName=MIT,licenseUrl=https://opensource.org/licenses/MIT"

# Generate the Java client
"$SCRIPT_DIR/../helpers/generate-client.sh" \
    -l "java" \
    -o "$SCRIPT_DIR/sdk-build" \
    -a "$additionalProperties"

if [ $? -ne 0 ]; then
    handle_error "Failed to generate Java client"
fi

pushd "$SCRIPT_DIR/sdk-build" > /dev/null

# Copy additional files
cp "$SCRIPT_DIR/README.md" "$SCRIPT_DIR/sdk-build/"
cp "$SCRIPT_DIR/../LICENSE" "$SCRIPT_DIR/sdk-build/"

# Remove the auto-generated github action; our PAT doesn't let us push it and we don't need it
if [ -f ".github/workflows/maven.yml" ]; then
    rm -f ".github/workflows/maven.yml"
fi

# Modify build.gradle file - remove publishing block content but keep structure
buildGradleFile="build.gradle"
if [ -f "$buildGradleFile" ]; then
    # Create a temporary file for processing
    temp_file=$(mktemp)
    inside_publishing_block=false
    
    while IFS= read -r line; do
        # Check if the line contains the start of the publishing block
        if echo "$line" | grep -q "^\s*publishing\s*{"; then
            inside_publishing_block=true
            echo "$line" >> "$temp_file"
            continue
        fi
        
        # If we are inside the publishing block and encounter the closing brace
        if [ "$inside_publishing_block" = true ] && echo "$line" | grep -q "^\s*}\s*$"; then
            # Add any new publishing content here if needed
            inside_publishing_block=false
        fi
        
        # Add the current line to the updated content
        echo "$line" >> "$temp_file"
    done < "$buildGradleFile"
    
    mv "$temp_file" "$buildGradleFile"
fi

# Build with Gradle
gradle compileJava
if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "gradle compileJava failed"
fi

gradle jar
if [ $? -ne 0 ]; then
    popd > /dev/null
    handle_error "gradle jar failed"
fi

popd > /dev/null
