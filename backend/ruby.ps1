$additionalProperties = @{
    gemAuthor      = "Trinsic"
    gemAuthorEmail = "support@trinsic.id"
    gemDescription = "'Trinsic Connect Backend Client'"
    gemHomepage    = "https://trinsic.id"
    gemName        = "trinsic_connect_backendclient"
    gemSummary     = "'Trinsic Connect Backend Client'"
    gemVersion     = "[VERSION]"
    moduleName     = "TrinsicConnectBackendClient"
}
& "$PSScriptRoot/generate-client.ps1" -language "ruby" -patchVersion "1" -additionalProperties $additionalProperties