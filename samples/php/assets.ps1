$sourceDir = "$PSScriptRoot/../web-ui"
$destDir = "$PSScriptRoot/public"
$destDir2 = Join-Path $destDir "dist/web-ui"

# Check if the source directory exists
if (-Not (Test-Path -Path $sourceDir)) {
    Write-Host "Source directory $sourceDir does not exist."
    exit 1
}

# Check if the destination directory exists, if not, create it
if (-Not (Test-Path -Path $destDir)) {
    Write-Host "Destination directory $destDir does not exist. Creating it now."
    New-Item -ItemType Directory -Path $destDir
    if (-Not (Test-Path -Path $destDir)) {
        Write-Host "Failed to create destination directory $destDir."
        exit 1
    }
}

# Move index.html if it exists
$indexFile = Join-Path $sourceDir "index.html"
if (Test-Path -Path $indexFile) {
    Copy-Item -Path $indexFile -Destination $destDir
    Write-Host "Moved index.html to $destDir"
} else {
    Write-Host "index.html not found in $sourceDir"
}

# Move redirect.html if it exists
$redirectFile = Join-Path $sourceDir "redirect.html"
if (Test-Path -Path $redirectFile) {
    Copy-Item -Path $redirectFile -Destination $destDir
    Write-Host "Moved redirect.html to $destDir"
} else {
    Write-Host "redirect.html not found in $sourceDir"
}

# Move index.js if it exists
$jsFile = Join-Path $sourceDir "dist/web-ui/index.js"
if (Test-Path -Path $jsFile) {
    Copy-Item -Path $jsFile -Destination $destDir2
    Write-Host "Moved redirect.html to $destDir2"
} else {
    Write-Host "redirect.html not found in $sourceDir"
}
