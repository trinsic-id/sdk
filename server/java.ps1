$version = &"$PSScriptRoot\get-version.ps1" -patchVersion "0"
$additionalProperties = @{
    apiPackage               = "id.trinsic.connect.backendclient"
    artifactVersion          = $version
    library                  = "native"
    modelPackage             = "id.trinsic.connect.backendclient.models"
    artifactId               = "connect-backendclient"
    groupId                  = "id.trinsic"
    scmConnection            = ""
    scmDeveloperConnection   = ""
    scmUrl                   = "https://github.com/trinsic-id"
    artifactUrl              = "https://trinsic.id"
    developerEmail           = "support@Trinsic.id"
    developerName            = "Trinsic"
    developerOrganization    = "Trinsic"
    developerOrganizationUrl = "https://trinsic.id"
    artifactDescription      = "Trinsic Connect Backend Client"
}
& "$PSScriptRoot\generate-client.ps1" -language "java" -additionalProperties $additionalProperties