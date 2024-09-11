try {
    Push-Location "$PSScriptRoot\samples\expo-sample"
    
    & npm ci

    if ($LASTEXITCODE -ne 0) {
        throw "npm ci failed"
    }

    & npm run check

    if ($LASTEXITCODE -ne 0) {
        throw "npm ci for testbed failed"
    }
}
finally {
    Pop-Location
}