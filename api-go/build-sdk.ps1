$additionalProperties = @{
    packageName                              = "trinsic_api"
    packageVersion                           = "[VERSION]"
    disallowAdditionalPropertiesIfNotPresent = "false"
}
& "$PSScriptRoot/../helpers/generate-client.ps1" -language "go" -outputFolder "$PSScriptRoot/sdk-build" -additionalProperties $additionalProperties
try {
    Push-Location "$PSScriptRoot/sdk-build"

    Copy-Item "$PSScriptRoot/README.md" "$PSScriptRoot/sdk-build"
    Copy-Item "$PSScriptRoot/../LICENSE" "$PSScriptRoot/sdk-build"

    $goModFile = "go.mod"
    $goModFileContent = Get-Content -Path $goModFile
    $goModFileContent = $goModFileContent -replace "/GIT_USER_ID/GIT_REPO_ID", "/trinsic-id/sdk-go-api"
    $goModFileContent | Set-Content -Path $goModFile

    &go build
    if ($LASTEXITCODE -ne 0) {
        throw "go build failed"
    }
}
finally {
    Pop-Location
}
