$additionalProperties = @{
    artifactVersion          = "[VERSION]"
    invokerPackage           = "Trinsic\\Api"
    artifactUrl              = "https://trinsic.id"
    developerOrganization    = "Trinsic"
    developerOrganizationUrl = "https://trinsic.id"
    composerPackageName      = "trinsic/api"
}
& "$PSScriptRoot/../helpers/generate-client.ps1" -language "php" -outputFolder "$PSScriptRoot/sdk-build" -additionalProperties $additionalProperties
