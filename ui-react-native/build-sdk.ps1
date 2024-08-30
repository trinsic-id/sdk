try {
    Push-Location "$PSScriptRoot\sdk"
    
    & npm ci

    $version = &"$PSScriptRoot\..\get-version.ps1" -versionName "reactNativeUIVersion";

    & npm version "$version" --no-git-tag-version

    & npm run prepare

    if ($LASTEXITCODE -ne 0) {
        throw "Failed to prepare React Native SDK"
    }

    if (-not (Test-Path -Path "publish")) {
        New-Item -ItemType Directory -Path "publish"
    }
    
    & npm pack --pack-destination "$PSScriptRoot/sdk/publish"

    try {
        Push-Location "$PSScriptRoot\sdk\example"
        & npm ci
        try {
            Push-Location "$PSScriptRoot\sdk\example\ios"
            & pod install
            if ($LASTEXITCODE -ne 0) {
                throw "Failed to install iOS pods"
            }
        }
        finally {
            Pop-Location
        }
        #& npm run build:ios  --verbose
        # if ($LASTEXITCODE -ne 0) {
        #     throw "Failed to build iOS testbed"
        # }
        #& npm run build:android --verbose
        # if ($LASTEXITCODE -ne 0) {
        #     throw "Failed to build Android testbed"
        # }

    }
    finally {
        Pop-Location
    }
}
finally {
    Pop-Location
}