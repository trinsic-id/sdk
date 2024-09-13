try {
    Push-Location "$PSScriptRoot\sdk"

    Copy-Item "$PSScriptRoot/README.md" "$PSScriptRoot/sdk"
    
    & npm ci

    if ($LASTEXITCODE -ne 0) {
        throw "npm ci failed"
    }

    & npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "npm run build failed"
    }

    $version = &"$PSScriptRoot\..\get-version.ps1" -versionName "webUIVersion";

    & npm version "$version" --no-git-tag-version
    if ($LASTEXITCODE -ne 0) {
        throw "npm version failed"
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