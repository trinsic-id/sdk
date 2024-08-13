$version = &"$PSScriptRoot\get-version.ps1" -patchVersion "1"
$additionalProperties = @{
    packageName            = "Trinsic.Connect.BackendClient"
    packageVersion         = $version
    nullableReferenceTypes = "true"
    modelPropertySorting   = "alphabetical"
    library                = "httpclient"
    useDateTimeOffset      = "true"
    validatable            = "false"
}
& "$PSScriptRoot\generate-client.ps1" -language "csharp" -additionalProperties $additionalProperties