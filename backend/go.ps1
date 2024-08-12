$additionalProperties = @{
    packageName    = "connect"
    packageVersion = "[VERSION]"
}
& "$PSScriptRoot\generate-client.ps1" -language "go" -patchVersion "1" -additionalProperties $additionalProperties
try {
    # Go doesn't like building from different directories but I don't want to change location all the time so pop at end back to whatever started the script
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