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