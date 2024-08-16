try {
    Push-Location "$PSScriptRoot"
    & npm install

    $version = &"$PSScriptRoot\..\..\get-version.ps1" -versionName "web";

    & npm version "$version" --no-git-tag-version

    & npm run build
    
    & npm pack --pack-destination "$PSScriptRoot/../../dist/publish"
}
finally {
    Pop-Location
}