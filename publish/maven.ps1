try {
    Set-Location "$PSScriptRoot/../dist/java"
    Write-Host "Publishing package"
    gradle publish    
}
finally {
    Pop-Location
}