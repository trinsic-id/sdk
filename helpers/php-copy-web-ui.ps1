# Define the source and destination paths
$sourceDir = "$PSScriptRoot/../ui-web/samples"
$destinationDir = "$PSScriptRoot/../api-php/samples/public"

# Check if the destination directory exists, if not, create it
if (-not (Test-Path -Path $destinationDir)) {
    New-Item -ItemType Directory -Force -Path $destinationDir
}

# Copy index.html and redirect.html files
Copy-Item -Path "$sourceDir\index.html" -Destination $destinationDir -Force
Copy-Item -Path "$sourceDir\redirect.html" -Destination $destinationDir -Force

# Copy the dist directory recursively
Copy-Item -Path "$sourceDir\dist" -Destination $destinationDir -Recurse -Force
