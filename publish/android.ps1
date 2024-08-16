# Get Version
$version = &"$PSScriptRoot\..\get-version.ps1" -versionName "android";
Write-Host "Version: $version"

try {
    Set-Location "$PSScriptRoot/../client/android/ConnectAndroid/ConnectAndroid"

    # Set version in gradle build file
    (Get-Content "./build.gradle.kts").Replace('[REPLACEME_VERSION]', $version) | Set-Content ./build.gradle.kts

    Write-Host "Publishing package"
    gradle publish
}
finally {
    Pop-Location
}