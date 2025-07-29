$GO_SAMPLES_DIR = "$PSScriptRoot/samples/server"

try {
    Write-Host "Building api-go sample project..."
    Push-Location $GO_SAMPLES_DIR

    go build -o go-sample
    $exitCode = $LASTEXITCODE

    Pop-Location

    if ($exitCode -ne 0) {
        throw "The go build command failed with exit code $exitCode"
    }

}
catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
    Exit 1
}
