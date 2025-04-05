$additionalProperties = @{
    packageName                              = "Trinsic.Api"
    packageVersion                           = "[VERSION]"
    nullableReferenceTypes                   = "true"
    modelPropertySorting                     = "alphabetical"
    library                                  = "generichost"
    useDateTimeOffset                        = "true"
    validatable                              = "false"
    disallowAdditionalPropertiesIfNotPresent = "false"
    licenseId                                = "MIT" 
       
}
& "$PSScriptRoot/../helpers/generate-client.ps1" -language "csharp" -outputFolder "$PSScriptRoot/sdk" -additionalProperties $additionalProperties

## HOTFIX THE DATEONLY PARSER
# Set the line to find (exact match)
$targetLine = 'if (DateOnly.TryParseExact(value, format, CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeUniversal, out DateOnly result))'
# Set the replacement line
$replacementLine = '                if (DateOnly.TryParseExact(value, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly result))'

# Normalize by removing ALL whitespace
function NormalizeLine($line) {
    return ($line -replace '\s', '')
}

$normalizedTarget = NormalizeLine $targetLine

Get-ChildItem -Path "$PSScriptRoot/sdk" -Recurse -Include *.cs | ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content $filePath

    $modified = $false
    $newContent = $content | ForEach-Object {
        $normalizedCurrent = NormalizeLine $_
        if ($normalizedCurrent -eq $normalizedTarget) {
            Write-Host "MATCH FOUND in $filePath`n$_"
            $modified = $true
            $replacementLine
        } else {
            $_
        }
    }

    if ($modified) {
        Set-Content -Path $filePath -Value $newContent
        Write-Host "Updated: $filePath"
    }
}

# Modify package to include a README.md
$csprojPath = "$PSScriptRoot/sdk/src/Trinsic.Api/Trinsic.Api.csproj"

# Load the XML content of the .csproj file
[xml]$xml = Get-Content $csprojPath

$xml.Project.PropertyGroup.Authors = "Trinsic"
$xml.Project.PropertyGroup.Company = "Trinsic"
$xml.Project.PropertyGroup.AssemblyTitle = "Trinsic API C# Library"
$xml.Project.PropertyGroup.Description = "A C# library for the Trinsic API"
$xml.Project.PropertyGroup.RepositoryUrl = "https://github.com/trinsic-id/sdk"

$element = $xml.CreateElement("PublishRepositoryUrl")
$element.InnerText = "true"
$xml.Project.PropertyGroup.AppendChild($element) | Out-Null

$element = $xml.CreateElement("Summary")
$element.InnerText = "A C# library for the Trinsic API"
$xml.Project.PropertyGroup.AppendChild($element) | Out-Null

$element = $xml.CreateElement("PackageReadmeFile")
$element.InnerText = "README.md"
$xml.Project.PropertyGroup.AppendChild($element) | Out-Null

# Create the new ItemGroup element with the README.md inclusion
$itemGroupElement = $xml.CreateElement("ItemGroup")

$licenseElement = $xml.CreateElement("None")
$licenseElement.SetAttribute("Include", "LICENSE")
$licenseElement.SetAttribute("Pack", "true")
$licenseElement.SetAttribute("PackagePath", "")

$readmeElement = $xml.CreateElement("None")
$readmeElement.SetAttribute("Include", "README.md")
$readmeElement.SetAttribute("Pack", "true")
$readmeElement.SetAttribute("PackagePath", "")

$itemGroupElement.AppendChild($licenseElement) | Out-Null
$itemGroupElement.AppendChild($readmeElement) | Out-Null

# Append the new ItemGroup to the Project element
$xml.Project.AppendChild($itemGroupElement) | Out-Null

# Save the modified .csproj file
$xml.Save($csprojPath)

#Copy-Item "$PSScriptRoot/README.md" "$PSScriptRoot/sdk/src/Trinsic.Api"
Copy-Item "$PSScriptRoot/../LICENSE" "$PSScriptRoot/sdk/src/Trinsic.Api"

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
