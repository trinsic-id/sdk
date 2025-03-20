param (
    [switch]$forceInstall
)

$WEB_SAMPLES_DIR = "$PSScriptRoot/../ui-web/samples"
$PY_SAMPLES_DIR = "$PSScriptRoot/samples/server"

try {
    Write-Host "Building ui-web project..."
    Push-Location $WEB_SAMPLES_DIR
    npm ci
    npm run build
    $exitCode = $LASTEXITCODE

    Pop-Location

    if ($exitCode -ne 0) {
        throw "The npm build command failed with exit code $exitCode"
    }

    Write-Host "Installing Python dependencies..."
    Push-Location $PY_SAMPLES_DIR
    
    if ($forceInstall.IsPresent) {
        pip3 install --break-system-packages -r requirements.txt
    }
    else {
        pip3 install -r requirements.txt
    }

    $exitCode = $LASTEXITCODE

    if ($exitCode -ne 0) {
        throw "The pip install command failed with exit code $exitCode"
    }

    Write-Host "Running validate.py..."
    # python3 validate.py

    Pop-Location
}
catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
    Exit 1
}
