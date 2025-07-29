$FLUTTER_SAMPLES_DIR = "$PSScriptRoot/samples/flutter_sample"

try {
    Write-Host "Building ui-flitter sample project..."
    Push-Location $FLUTTER_SAMPLES_DIR

    & flutter pub get
    if ($LASTEXITCODE -ne 0) {
        throw "flutter pub failed"
    }

    & flutter analyze

    if ($LASTEXITCODE -ne 0) {
        throw "flutter analyze failed"
    }

    & flutter test

    if ($LASTEXITCODE -ne 0) {
        throw "flutter test failed"
    }

    Write-Host "Building Flutter Android APK..."
    &flutter build apk

    if ($LASTEXITCODE -ne 0) {
        throw "The flutter build APK command failed with exit code $LASTEXITCODE"
    }    
}
catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
    Exit 1
}
finally {
    Pop-Location
}
