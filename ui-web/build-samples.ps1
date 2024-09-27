try {
    Push-Location "$PSScriptRoot/samples"

    & node --version
    & npm --version

    & npm ci

    if ($LASTEXITCODE -ne 0) {
        throw "npm ci failed"
    }
    
    Write-Host "Building ui-web sample project..."

    &npm run build

    if ($LASTEXITCODE -ne 0) {
        throw "npm build failed"
    }

    Write-Host "Building bundlers"
    $bundlers = Get-ChildItem "$PSScriptRoot/samples/bundlers" -Directory
    foreach ($bundler in $bundlers) {
        Write-Host "Building bundler $($bundler.Name) project..."
        . "$PSScriptRoot/build-bundler.ps1" -bundlerName $bundler.Name
        
        if ($LASTEXITCODE -ne 0) {
            throw "build-bundler.ps1 failed for bundler $($bundler.Name)"
        }
        Write-Host "Bundler $($bundler.Name) project built successfully"
    }
}
catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
    Exit 1
}
finally {
    Pop-Location
}


