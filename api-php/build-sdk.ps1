$additionalProperties = @{
    artifactVersion          = "[VERSION]"
    invokerPackage           = "Trinsic\\Api"
    artifactUrl              = "https://trinsic.id"
    developerOrganization    = "Trinsic"
    developerOrganizationUrl = "https://trinsic.id"
    composerPackageName      = "trinsic/api"
}
& "$PSScriptRoot/generate-client.ps1" -language "php" -additionalProperties $additionalProperties