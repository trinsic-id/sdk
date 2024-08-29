$TY_SAMPLES_DIR = "$PSScriptRoot/samples"

try {
    Write-Host "Building api-typescript sample project..."
    Push-Location $TY_SAMPLES_DIR

    npm run build
    $exitCode = $LASTEXITCODE

    Pop-Location

    if ($exitCode -ne 0) {
        throw "The npm build command failed with exit code $exitCode"
    }

} catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
    Exit 1
}
