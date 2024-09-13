$JAVA_SAMPLES_DIR = "$PSScriptRoot/samples"

try {
    Write-Host "Building api-java sample project..."
    Push-Location $JAVA_SAMPLES_DIR

    mvn compile
    $exitCode = $LASTEXITCODE

    Pop-Location

    if ($exitCode -ne 0) {
        throw "The mvn compile command failed with exit code $exitCode"
    }

} catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
    Exit 1
}
