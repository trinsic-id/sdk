try {
    Set-Location "$PSScriptRoot/../client/android/ConnectAndroid/ConnectAndroid"
    Write-Host "Publishing package"
    gradle publish
}
finally {
    Pop-Location
}