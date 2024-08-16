$additionalProperties = @{
    packageName                              = "Trinsic.Connect"
    packageVersion                           = "[VERSION]"
    nullableReferenceTypes                   = "true"
    modelPropertySorting                     = "alphabetical"
    library                                  = "httpclient"
    useDateTimeOffset                        = "true"
    validatable                              = "false"
    disallowAdditionalPropertiesIfNotPresent = "false"
}
& "$PSScriptRoot/generate-client.ps1" -language "csharp" -additionalProperties $additionalProperties

try {
    Push-Location "$PSScriptRoot/../dist/csharp"
    & dotnet restore
    & dotnet build --configuration Release --no-restore
    & dotnet pack --configuration Release --no-build --no-restore --include-source --include-symbols -p:SymbolPackageFormat=snupkg --output "$PSScriptRoot/../dist/publish"
}
finally {
    Pop-Location
}

