$version = &"$PSScriptRoot\get-version.ps1" -patchVersion "1"
$additionalProperties = @{
    artifactVersion          = $version
    invokerPackage           = "TrinsicConnect\\BackendClient"
    artifactUrl              = "https://trinsic.id"
    developerOrganization    = "Trinsic"
    developerOrganizationUrl = "https://trinsic.id"
    composerPackageName      = "trinsic/connect-backend-client"
}
& "$PSScriptRoot\generate-client.ps1" -language "php" -additionalProperties $additionalProperties