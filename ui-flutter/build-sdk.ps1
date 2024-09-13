try {
    Push-Location "$PSScriptRoot\sdk"
    
    & flutter pub get

    if ($LASTEXITCODE -ne 0) {
        throw "flutter pub get sdk failed"
    }
    try {
        Push-Location "$PSScriptRoot\sdk\testbed"
        & flutter pub get

        if ($LASTEXITCODE -ne 0) {
            throw "flutter pub get testbed failed"
        }
    }
    finally {
        Pop-Location
    }

    $version = &"$PSScriptRoot\..\get-version.ps1" -versionName "flutterUIVersion"

    Write-Host "Setting version to $version"

    $fileContent = Get-Content -Path "pubspec.yaml"
    $fileContent = $fileContent -replace "^version: [\d\.]+$", "version: $version"
    $fileContent | Set-Content -Path "pubspec.yaml"

    Write-Host "Ensuring CHANGELOG.md starts with version $version"
    $changelogContent = Get-Content -Path "CHANGELOG.md"
    if ($changelogContent -notmatch "## $version") {
        Write-Host "CHANGELOG.md needs patching -- doing so"
        $changelogContent = "## $version`n`n- Auto-Generated changelog -- please visit https://github.com/trinsic-id/sdk for info`n`n$changelogContent"
        $changelogContent | Set-Content -Path "CHANGELOG.md"
    }

    & flutter analyze

    if ($LASTEXITCODE -ne 0) {
        throw "flutter analyze failed"
    }

    & flutter test

    if ($LASTEXITCODE -ne 0) {
        throw "flutter test failed"
    }

    & flutter pub publish --dry-run

    if ($LASTEXITCODE -ne 0) {
        throw "flutter publish dry run failed"
    }

    try {
        Push-Location "$PSScriptRoot\sdk\testbed"
        
        & flutter analyze

        if ($LASTEXITCODE -ne 0) {
            throw "flutter analyze testbed failed"
        }

        & flutter test

        if ($LASTEXITCODE -ne 0) {
            throw "flutter test testbed failed"
        }
    }
    finally {
        Pop-Location
    }
}
finally {
    Pop-Location
}