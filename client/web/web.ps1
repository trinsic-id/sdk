try {
    Push-Location "$PSScriptRoot"
    & npm install

    $version = &"$PSScriptRoot\..\..\get-version.ps1" -patchVersion "0";

    & npm version "$version" --no-git-tag-version
    
    & npm pack --pack-destination "$PSScriptRoot/../../dist/publish"
}
finally {
    Pop-Location
}