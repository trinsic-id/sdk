try {
    Push-Location "$PSScriptRoot\sdk"
    
    & npm install

    $version = &"$PSScriptRoot\..\get-version.ps1" -versionName "web";

    & npm version "$version" --no-git-tag-version

    & npm run build

    if (-not (Test-Path -Path "publish")) {
        New-Item -ItemType Directory -Path "publish"
    }
    
    & npm pack --pack-destination "$PSScriptRoot/sdk/publish"
}
finally {
    Pop-Location
}