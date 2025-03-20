$RB_SAMPLES_DIR = "$PSScriptRoot/samples/server"

try {
    Write-Host "Building api-ruby sample project..."
    Push-Location $RB_SAMPLES_DIR

    bundle update trinsic_api
    bundle install
    ruby validator.rb
    $exitCode = $LASTEXITCODE
 
    Pop-Location

    if ($exitCode -ne 0) {
        throw "The ruby validator.rb command failed with exit code $exitCode"
    }

}
catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
    Exit 1
}
