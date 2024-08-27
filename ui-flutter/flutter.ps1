param(
    [switch]$dryRun
)

try {
    Set-Location "$PSScriptRoot/../client/flutter/trinsic_flutter_ui"
    # Write-Host "Setting version to $version"

    # $fileContent = Get-Content -Path "pubspe c.yaml"
    # $fileContent = $fileContent -replace "VERSION_REPLACEME", "$version"
    # $fileContent | Set-Content -Path "pubspec.yaml"

    Write-Host "Publishing package"
    if($dryRun) {
        flutter pub publish --dry-run
    } else {
        flutter pub publish -f
    }
}
finally {
    Pop-Location
}