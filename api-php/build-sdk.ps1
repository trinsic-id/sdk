$additionalProperties = @{
    artifactVersion          = "[VERSION]"
    invokerPackage           = "Trinsic\\Api"
    artifactUrl              = "https://github.com/trinsic-id/sdk-php-api"
    developerOrganization    = "Trinsic"
    developerOrganizationUrl = "https://trinsic.id"
    composerPackageName      = "trinsic/api"
    licenseName              = "MIT"
}
& "$PSScriptRoot/../helpers/generate-client.ps1" -language "php" -outputFolder "$PSScriptRoot/sdk-build" -additionalProperties $additionalProperties

Copy-Item "$PSScriptRoot/README.md" "$PSScriptRoot/sdk-build"
Copy-Item "$PSScriptRoot/../LICENSE" "$PSScriptRoot/sdk-build"

# Path to the JSON file
$jsonFilePath = "$PSScriptRoot/sdk-build/composer.json"

# Read the JSON file content
$jsonContent = Get-Content -Path $jsonFilePath -Raw | ConvertFrom-Json

# Modify the description field
$jsonContent.description = "Trinsic API PHP library."

# Convert the modified object back to JSON
$jsonContent | ConvertTo-Json -Depth 10 | Set-Content -Path $jsonFilePath