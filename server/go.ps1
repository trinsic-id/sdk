$additionalProperties = @{
    packageName    = "trinsic.id/connect-sdks/go"
    packageVersion = "[VERSION]"
}
& "$PSScriptRoot\generate-client.ps1" -language "go" -patchVersion "1" -additionalProperties $additionalProperties