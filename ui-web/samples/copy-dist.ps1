param (
    [string]$destination
)

# Check if the destination directory was provided
if (-not $destination) {
    Write-Host "Please specify the destination directory as an argument."
    exit 1
}

# Check if the destination directory exists, if not, create it
if (-not (Test-Path -Path $destination)) {
    New-Item -ItemType Directory -Force -Path $destination
}

$cwd = Get-Location
cd $PSScriptRoot
npm run build
cd $cwd

# Copy the dist directory recursively
Copy-Item -Path "$PSScriptRoot/dist/*" -Destination $destination -Recurse -Force
