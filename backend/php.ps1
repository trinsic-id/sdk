$additionalProperties = @{
    artifactVersion          = "[VERSION]"
    invokerPackage           = "TrinsicConnect\\BackendClient"
    artifactUrl              = "https://trinsic.id"
    developerOrganization    = "Trinsic"
    developerOrganizationUrl = "https://trinsic.id"
    composerPackageName      = "trinsic/connect-backend-client"
}
& "$PSScriptRoot/generate-client.ps1" -language "php" -patchVersion "1" -additionalProperties $additionalProperties