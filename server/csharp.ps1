$additionalProperties = @{
    packageName            = "Trinsic.Connect.BackendClient"
    packageVersion         = "[VERSION]"
    nullableReferenceTypes = "true"
    modelPropertySorting   = "alphabetical"
    library                = "httpclient"
    useDateTimeOffset      = "true"
    validatable            = "false"
}
& "$PSScriptRoot/generate-client.ps1" -language "csharp" -patchVersion "1" -additionalProperties $additionalProperties