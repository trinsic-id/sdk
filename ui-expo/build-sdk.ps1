try {
    Push-Location "$PSScriptRoot\sdk"
    
    & npm ci

    if ($LASTEXITCODE -ne 0) {
        throw "npm ci failed"
    }

    $version = &"$PSScriptRoot\..\get-version.ps1" -versionName "expoUIVersion";

    & npm version "$version" --no-git-tag-version
    if ($LASTEXITCODE -ne 0) {
        throw "npm version failed"
    }

    & npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "npm run build failed"
    }

    if (-not (Test-Path -Path "publish")) {
        New-Item -ItemType Directory -Path "publish"
    }
    
    & npm pack --pack-destination "$PSScriptRoot/sdk/publish"
    if ($LASTEXITCODE -ne 0) {
        throw "npm pack failed"
    }
}
finally {
    Pop-Location
}