$WEB_SAMPLES_DIR = "$PSScriptRoot/samples"

try {
    Push-Location "$PSScriptRoot/samples"

    & npm ci

    if ($LASTEXITCODE -ne 0) {
        throw "npm ci failed"
    }
    
    Write-Host "Building ui-web sample project..."
    Push-Location $WEB_SAMPLES_DIR

    &npm run build

    if ($LASTEXITCODE -ne 0) {
        throw "npm build failed"
    }
    $exitCode = $LASTEXITCODE

    Pop-Location

    if ($exitCode -ne 0) {
        throw "The npm build command failed with exit code $exitCode"
    }

}
catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
    Exit 1
}
