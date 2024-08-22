try {
    Set-Location "$PSScriptRoot/../client/android/library"
    Write-Host "Publishing package"
    gradle publish
}
finally {
    Pop-Location
}