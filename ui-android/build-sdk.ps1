try {
    Push-Location "$PSScriptRoot\sdk"
    
    & gradlew :library:build

    if ($LASTEXITCODE -ne 0) {
        throw "gradlew library build failed"
    }

    $packageVersion = &"$PSScriptRoot\..\get-version.ps1" -versionName "androidUIVersion";

    # Define the path to the gradle file
    $gradlePath = "./library/build.gradle.kts"

    # Read the podspec file content
    $gradleContent = Get-Content $gradlePath

    # Update the version in the gradle content
    $updatedContent = $gradleContent -replace "\s+version = `"[\d\.]+`"", "            version = `"$packageVersion`""

    # Write the updated content back to the podspec file
    $updatedContent | Set-Content $gradlePath

    Write-Host "Gradle file updated with version $packageVersion."
}
finally {
    Pop-Location
}