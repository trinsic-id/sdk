$FLUTTER_SAMPLES_DIR = "$PSScriptRoot/samples"

try {
    Write-Host "Building ui-flitter sample project..."
    Push-Location $FLUTTER_SAMPLES_DIR


    Write-Host "Building Flutter iOS..."
    &flutter build ios

    if ($LASTEXITCODE -ne 0) {
        throw "The flutter build ios command failed with exit code $LASTEXITCODE"
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
