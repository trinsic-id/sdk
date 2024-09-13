$FLUTTER_SAMPLES_DIR = "$PSScriptRoot/samples"

try {
    Write-Host "Building ui-flitter sample project..."
    Push-Location $FLUTTER_SAMPLES_DIR

    flutter build apk
    $exitCode = $LASTEXITCODE

    Pop-Location

    if ($exitCode -ne 0) {
        throw "The flutter build APK command failed with exit code $exitCode"
    }

} catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
    Exit 1
}
