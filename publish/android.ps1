try {
    Set-Location "$PSScriptRoot/../client/android/library"
    Write-Host "Publishing package"
    # TODO: Publishing Android via Jitpack works differently -- we just need to push a tag to the repository
    # gradle publish
}
finally {
    Pop-Location
}