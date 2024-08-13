$version = &"$PSScriptRoot\get-version.ps1" -patchVersion "0"
$additionalProperties = @{
    packageName            = "Trinsic.Connect.BackendClient"
    packageVersion         = $version
    nullableReferenceTypes = "true"
    modelPropertySorting   = "alphabetical"
    library                = "httpclient"
    useDateTimeOffset      = "true"
}
& "$PSScriptRoot\generate-client.ps1" -language "csharp" -additionalProperties $additionalProperties