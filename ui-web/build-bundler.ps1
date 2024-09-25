param (
    [Parameter(Mandatory = $true)]
    [string]$bundlerName
)
try {
    Push-Location "$PSScriptRoot/samples/bundlers/$bundlerName"

    & npm ci

    if ($LASTEXITCODE -ne 0) {
        throw "npm ci failed"
    }
    
    Write-Host "Building bundler $bundlerName project..."

    &npm run build

    if ($LASTEXITCODE -ne 0) {
        throw "npm build $bundlerName failed"
    }
}
catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
    Exit 1
}
finally {
    Pop-Location
}


