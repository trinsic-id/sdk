$additionalProperties = @{
    packageName    = "connect"
    packageVersion = "[VERSION]"
}
& "$PSScriptRoot\generate-client.ps1" -language "go" -patchVersion "1" -additionalProperties $additionalProperties
try {
    Push-Location "$PSScriptRoot/../dist/go"
    $goModFile = "go.mod"
    $goModFileContent = Get-Content -Path $goModFile
    $goModFileContent = $goModFileContent -replace "/GIT_USER_ID/GIT_REPO_ID", "/trinsic-id/connect-sdks/dist/go"
    $goModFileContent | Set-Content -Path $goModFile

    &go build
}
finally {
    Pop-Location
}