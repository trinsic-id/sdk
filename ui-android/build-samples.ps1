try {
    Push-Location "$PSScriptRoot\samples\android_sample"
    
    & gradlew build

    if ($LASTEXITCODE -ne 0) {
        throw "gradlew sample build failed"
    }
}
finally {
    Pop-Location
}