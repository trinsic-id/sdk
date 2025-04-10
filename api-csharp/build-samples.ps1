$CS_SAMPLES_DIR = "$PSScriptRoot/samples"

try {
    Write-Host "Building api-csharp sample project..."
    Push-Location $CS_SAMPLES_DIR

    # dotnet build Sample/Sample.csproj
    # $exitCode = $LASTEXITCODE

    Pop-Location

    # if ($exitCode -ne 0) {
    #     throw "The donet build command failed with exit code $exitCode"
    # }

} catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
    Exit 1
}
