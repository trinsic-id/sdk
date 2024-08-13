$version = &"$PSScriptRoot\get-version.ps1" -patchVersion "1"
$additionalProperties = @{
    gemAuthor      = "Trinsic"
    gemAuthorEmail = "support@trinsic.id"
    gemDescription = "'Trinsic Connect Backend Client'"
    gemHomepage    = "https://trinsic.id"
    gemName        = "trinsic_connect_backendclient"
    gemSummary     = "'Trinsic Connect Backend Client'"
    gemVersion     = $version
    moduleName     = "TrinsicConnectBackendClient"
}
& "$PSScriptRoot\generate-client.ps1" -language "ruby" -additionalProperties $additionalProperties