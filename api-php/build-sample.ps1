$WEB_SAMPLES_DIR = "$PSScriptRoot/../ui-web/samples"
$PHP_SAMPLES_DIR = "$PSScriptRoot/samples"

try {
    Write-Host "Building ui-web project..."
    Push-Location $WEB_SAMPLES_DIR
    npm run build
    $exitCode = $LASTEXITCODE

    Pop-Location

    if ($exitCode -ne 0) {
        throw "The npm build command failed with exit code $exitCode"
    }

    Write-Host "Copying ui-web dist directory..."
    Copy-Item -Path "$WEB_SAMPLES_DIR/dist/*" -Destination "$PHP_SAMPLES_DIR/public" -Recurse -Force
    
    Push-Location $PHP_SAMPLES_DIR

    Write-Host "Installing api-php sample project dependencies..."
    composer install

    Write-Host "Ensure there's an .env file..."
    if (-not (Test-Path "$PHP_SAMPLES_DIR/.env")) {
        New-Item -Path "$PHP_SAMPLES_DIR/.env" -ItemType "File"
    }

    Write-Host "Validating php script..."
    php public/index.php
    $exitCode = $LASTEXITCODE

    Pop-Location

    if ($exitCode -ne 0) {
        throw "The php public/index.php command failed with exit code $exitCode"
    }
} catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
    Exit 1
}
