$additionalProperties = @{
    artifactVersion          = "[VERSION]"
    invokerPackage           = "Trinsic\\Connect"
    artifactUrl              = "https://trinsic.id"
    developerOrganization    = "Trinsic"
    developerOrganizationUrl = "https://trinsic.id"
    composerPackageName      = "trinsic/connect"
}
& "$PSScriptRoot/generate-client.ps1" -language "php" -additionalProperties $additionalProperties
