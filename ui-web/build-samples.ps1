try {
    Push-Location "$PSScriptRoot/samples"

    & node -v
    & npm -v

    & npm install

    if ($LASTEXITCODE -ne 0) {
        throw "npm ci failed"
    }
    
    Write-Host "Building ui-web sample project..."

    &npm run build

    if ($LASTEXITCODE -ne 0) {
        throw "npm build failed"
    }
}
catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
    Exit 1
}
finally {
    Pop-Location
}
