try {
    Push-Location "$PSScriptRoot/sdk"

    Write-Host "Copying README.md to sdk folder so publish command works"
    Copy-Item -Path "..\README.md" -Destination "README.md"
    
    &flutter pub publish -f

    if ($LASTEXITCODE -ne 0) {
        throw "flutter publish failed"
    }

}
finally {
    Pop-Location
}