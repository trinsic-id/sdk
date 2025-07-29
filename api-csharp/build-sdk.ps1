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
    apiName                                  = "TrinsicApi"
    targetFramework                          = "net8.0"
       
}
& "$PSScriptRoot/../helpers/generate-client.ps1" -language "csharp" -outputFolder "$PSScriptRoot/sdk" -additionalProperties $additionalProperties

## HOTFIX THE DATEONLY PARSER
$targetLineDateOnly = 'if (DateOnly.TryParseExact(value, format, CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeUniversal, out DateOnly result))'
$replacementLineDateOnly = '                if (DateOnly.TryParseExact(value, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly result))'

## HOTFIX ALL API INTERFACES TO BE PARTIAL
$targetLineAttachmentsApi = 'public interface IAttachmentsApi : IApi'
$replacementLineAttachmentsApi = '    public partial interface IAttachmentsApi : IApi'
$targetLineSessionsApi = 'public interface ISessionsApi : IApi'
$replacementLineSessionsApi = '    public partial interface ISessionsApi : IApi'
$targetLineNetworkApi = 'public interface INetworkApi : IApi'
$replacementLineNetworkApi = '    public partial interface INetworkApi : IApi'

## HOTFIX TOKEN PROVIDER
$targetLineProvider1 = 'services.AddSingleton(typeof(RateLimitProvider<>).MakeGenericType(tokenType));'
$replacementLineProvider1 = '                    services.AddTransient(typeof(ConstantTokenProvider<>).MakeGenericType(tokenType));'
$targetLineProvider2 = 'services.AddSingleton(typeof(TokenProvider<>).MakeGenericType(tokenType),'
$replacementLineProvider2 = '                    services.AddTransient(typeof(TokenProvider<>).MakeGenericType(tokenType),'
$targetLineProvider3 = 's => s.GetRequiredService(typeof(RateLimitProvider<>).MakeGenericType(tokenType)));'
$replacementLineProvider3 = '                        s => s.GetRequiredService(typeof(ConstantTokenProvider<>).MakeGenericType(tokenType)));'

# Normalize by removing ALL whitespace
function NormalizeLine($line) {
    return ($line -replace '\s', '')
}

# Apply a hotfix to all code files in a given directory (crude line-based replacement)
function ApplyHotfix($targetLine, $replacementLine, $rootPath = "$PSScriptRoot/sdk", $filePattern = "*.cs") {
    $normalizedTarget = NormalizeLine $targetLine

    echo "Applying hotfix for $targetLine ($normalizedTarget) to $replacementLine in $rootPath"

    Get-ChildItem -Path $rootPath -Recurse -Include $filePattern | ForEach-Object {
        $filePath = $_.FullName
        $content = Get-Content $filePath

        $modified = $false
        $newContent = $content | ForEach-Object {
            $normalizedLine = NormalizeLine($_)
            if ($normalizedLine -eq $normalizedTarget) {
                Write-Host "MATCH FOUND in $filePath`n$normalizedLine"
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
}

ApplyHotfix $targetLineDateOnly $replacementLineDateOnly
ApplyHotfix $targetLineAttachmentsApi $replacementLineAttachmentsApi
ApplyHotfix $targetLineSessionsApi $replacementLineSessionsApi
ApplyHotfix $targetLineNetworkApi $replacementLineNetworkApi
ApplyHotfix $targetLineProvider1 $replacementLineProvider1
ApplyHotfix $targetLineProvider2 $replacementLineProvider2
ApplyHotfix $targetLineProvider3 $replacementLineProvider3

# Next to this Powershell script is a sibling folder, `Additional`, which needs to get copied to ./sdk/src/Trinsic.Api/
# such that we end up with a folder structure like this: ./sdk/src/Trinsic.Api/Additional/AttachmentsApiAdditional.cs
$additionalFolder = "$PSScriptRoot/./Additional"
echo "Copying $additionalFolder to $PSScriptRoot/sdk/src/Trinsic.Api/Additional"
$destinationFolder = "$PSScriptRoot/sdk/src/Trinsic.Api/Additional"
if (Test-Path $destinationFolder) {
    Remove-Item -Path $destinationFolder -Recurse -Force
}
Copy-Item -Path $additionalFolder -Destination $destinationFolder -Recurse

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

Copy-Item "$PSScriptRoot/README.md" "$PSScriptRoot/sdk/src/Trinsic.Api"
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
