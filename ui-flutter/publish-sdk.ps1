try {
    Push-Location "$PSScriptRoot/sdk"
    
    &flutter pub publish -f

    if ($LASTEXITCODE -ne 0) {
        throw "flutter publish failed"
    }

}
finally {
    Pop-Location
}