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


# Modify package to include a README.md
$csprojPath = "$PSScriptRoot/sdk/src/Trinsic.Api/Trinsic.Api.csproj"

# Load the XML content of the .csproj file
[xml]$xml = Get-Content $csprojPath

# Create the PackageReadmeFile element
$packageReadmeFileElement = $xml.CreateElement("PackageReadmeFile")
$packageReadmeFileElement.InnerText = "README.md"

# Append the PackageReadmeFile element to the first PropertyGroup
$xml.Project.PropertyGroup.AppendChild($packageReadmeFileElement) | Out-Null

# Create the new ItemGroup element with the README.md inclusion
$itemGroupElement = $xml.CreateElement("ItemGroup")
$noneElement = $xml.CreateElement("None")
$noneElement.SetAttribute("Include", "README.md")
$noneElement.SetAttribute("Pack", "true")
$noneElement.SetAttribute("PackagePath", "")
$itemGroupElement.AppendChild($noneElement) | Out-Null

# Append the new ItemGroup to the Project element
$xml.Project.AppendChild($itemGroupElement) | Out-Null

# Save the modified .csproj file
$xml.Save($csprojPath)

Write-Host "The .csproj file has been successfully modified. Copying now the README.md file to the sdk folder."
Copy-Item "$PSScriptRoot/README.md" "$PSScriptRoot/sdk/src/Trinsic.Api/"

try {
    Push-Location "$PSScriptRoot/sdk"

    dotnet restore
    & dotnet build --configuration Release --no-restore
    if ($LASTEXITCODE -ne 0) {
        throw "Dotnet build failed"
    }
    & dotnet pack --configuration Release --no-build --no-restore --include-source --include-symbols -p:SymbolPackageFormat=snupkg --output "$PSScriptRoot/sdk/publish"
    if ($LASTEXITCODE -ne 0) {
        throw "Dotnet pack failed"
    }
}
finally {
    Pop-Location
}
