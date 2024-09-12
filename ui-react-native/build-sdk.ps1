try {
    Push-Location "$PSScriptRoot\sdk"
    
    & npm ci

    if ($LASTEXITCODE -ne 0) {
        throw "npm ci failed"
    }

    & npm run check

    if ($LASTEXITCODE -ne 0) {
        throw "npm check failed"
    }

    $version = &"$PSScriptRoot\..\get-version.ps1" -versionName "reactNativeUIVersion";

    & npm version "$version" --no-git-tag-version
    if ($LASTEXITCODE -ne 0) {
        throw "npm version failed"
    }

    & npm run prepare
    if ($LASTEXITCODE -ne 0) {
        throw "npm run prepare failed"
    }

    if (-not (Test-Path -Path "publish")) {
        New-Item -ItemType Directory -Path "publish"
    }
    
    & npm pack --pack-destination "$PSScriptRoot/sdk/publish"
    if ($LASTEXITCODE -ne 0) {
        throw "npm pack failed"
    }

    try {
        Push-Location "$PSScriptRoot\sdk\example"
        
        & npm ci
    
        if ($LASTEXITCODE -ne 0) {
            throw "npm ci for example failed"
        }

        & npm run check

        if ($LASTEXITCODE -ne 0) {
            throw "npm check for example failed"
        }

        & npm run build:android

        if ($LASTEXITCODE -ne 0) {
            throw "npm build:android for example failed"
        }
    }
    finally {
        Pop-Location
    }


}
finally {
    Pop-Location
}