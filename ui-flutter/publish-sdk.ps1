param(
    [switch]$dryRun
)

try {
    Push-Location "$PSScriptRoot/sdk"

    Write-Host "Getting current version"
    $packageVersion = &"$PSScriptRoot\..\get-version.ps1" -versionName "flutterUIVersion"

    Write-Host "Setting version to $packageVersion"

    $fileContent = Get-Content -Path "pubspec.yaml"
    $fileContent = $fileContent -replace "^version: [\d\.]+$", "version: $packageVersion"
    $fileContent | Set-Content -Path "pubspec.yaml"

    Write-Host "Ensuring CHANGELOG.md starts with version $packageVersion"
    $changelogContent = Get-Content -Path "CHANGELOG.md"
    if ($changelogContent -notmatch "## $packageVersion") {
        Write-Host "CHANGELOG.md needs patching -- doing so"
        $changelogContent = "## $packageVersion`n`n- Auto-Generated changelog -- please visit https://github.com/trinsic-id/sdk for info`n`n$changelogContent"
        $changelogContent | Set-Content -Path "CHANGELOG.md"
    }

    Write-Host "Publishing package"
    if ($dryRun) {
        flutter pub publish --dry-run
    }
    else {
        flutter pub publish -f
    }
}
finally {
    Pop-Location
}