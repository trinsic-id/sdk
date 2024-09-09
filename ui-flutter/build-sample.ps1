param(
    [switch]$useLocalLibrary
)

$FLUTTER_SAMPLES_DIR = "$PSScriptRoot/samples"

try {
    Write-Host "Building ui-flitter sample project..."
    Push-Location $FLUTTER_SAMPLES_DIR

    # Update sample pubpsec to point to local library if necessary
    if($useLocalLibrary) {
        Write-Host "Using local library for trinsic_flutter_ui"
        
        Copy-Item pubspec.yaml pubspec.yaml.backup
        (Get-Content pubspec.yaml) -replace '  trinsic_flutter_ui: \^[0-9.]*$', '  trinsic_flutter_ui:' | Set-Content pubspec.yaml
        (Get-Content pubspec.yaml) -replace '    # path: \.\./sdk/$', '    path: ../sdk/' | Set-Content pubspec.yaml
    }

    flutter build apk
    $exitCode = $LASTEXITCODE

    if($useLocalLibrary) {
        Write-Host "Restoring original pubspec.yaml"

        Remove-Item pubspec.yaml
        Rename-Item pubspec.yaml.backup pubspec.yaml
    }

    Pop-Location

    if ($exitCode -ne 0) {
        throw "The flutter build APK command failed with exit code $exitCode"
    }

} catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
    Exit 1
}
