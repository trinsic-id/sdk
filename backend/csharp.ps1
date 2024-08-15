$additionalProperties = @{
    packageName            = "Trinsic.Connect"
    packageVersion         = "[VERSION]"
    nullableReferenceTypes = "true"
    modelPropertySorting   = "alphabetical"
    library                = "httpclient"
    useDateTimeOffset      = "true"
    validatable            = "false"
}
& "$PSScriptRoot/generate-client.ps1" -language "csharp" -patchVersion "0" -additionalProperties $additionalProperties

try {
    Push-Location "$PSScriptRoot/../dist/csharp"
    & dotnet restore
    & dotnet build --configuration Release --no-restore
    & dotnet pack --configuration Release --no-build --no-restore --include-source --include-symbols --output "$PSScriptRoot/../dist/publish"
}
finally {
    Pop-Location
}

