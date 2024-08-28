$additionalProperties = @{
    packageName                              = "Trinsic.Api"
    packageVersion                           = "[VERSION]"
    nullableReferenceTypes                   = "true"
    modelPropertySorting                     = "alphabetical"
    library                                  = "httpclient"
    useDateTimeOffset                        = "true"
    validatable                              = "false"
    disallowAdditionalPropertiesIfNotPresent = "false"
}
& "$PSScriptRoot/../helpers/generate-client.ps1" -language "csharp" -outputFolder "$PSScriptRoot/sdk" -additionalProperties $additionalProperties

try {
    Push-Location "$PSScriptRoot/sdk/generated"
    & dotnet restore
    & dotnet build --configuration Release --no-restore
    & dotnet pack --configuration Release --no-build --no-restore --include-source --include-symbols -p:SymbolPackageFormat=snupkg --output "$PSScriptRoot/sdk/publish"
}
finally {
    Pop-Location
}

