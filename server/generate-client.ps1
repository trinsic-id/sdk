# Parameters:
param (
    [Parameter(Mandatory = $true)]
    [string]$language,
    [string]$swaggerFileOrUrl = "https://connect.trinsic.id/swagger/api/swagger.json",
    [string]$outputFolder = "../dist/$language",
    [Parameter(Mandatory = $true)]
    [hashtable]$additionalProperties
)
#Ensure we run this "from this folder" as we run it personally in a command line as well as through the perspective of builds.
Set-Location -Path "$PSScriptRoot"

$localSwaggerFilePath = "";
if ($swaggerFileOrUrl -like "https://*") {
    Write-Host "The URL starts with https://, retrieving the file"
    Write-Host "Downloading specification from $swaggerFileOrUrl";
    $localSwaggerFilePath = "./swagger.json";

    $response = Invoke-WebRequest -Uri $swaggerFileOrUrl 
    $response.Content | Out-File -FilePath $localSwaggerFilePath -Encoding utf8

    #Invoke-RestMethod -Uri $swaggerFileOrUrl | Out-File $localSwaggerFilePath;
    Write-Host "Downloaded specification from $swaggerFileOrUrl to $localSwaggerFilePath";
}
else {
    Write-Host "The URL does not start with https://, assuming it's a local file at $swaggerFileOrUrl"
    if (-not (Test-Path $swaggerFileOrUrl)) {
        throw "The swagger file '$swaggerFileOrUrl' does not exist."
    }
    localSwaggerFilePath = swaggerFileOrUrl;
}


if (Test-Path -Path $outputFolder -PathType Container) {
    Write-Host "Cleaning up output folder $outputFolder";
    Remove-Item -Recurse -Force $outputFolder;
    Write-Host "Cleaned up destination folder $outputFolder";
}
else {
    New-Item -ItemType Directory -Path $outputFolder -ErrorAction Stop > $null 2>&1
    Write-Host "Created output folder";
}

# Concatenate the hashtable into a comma-separated string
$concatenatedAdditionalProperties = (($additionalProperties.GetEnumerator() | ForEach-Object {
            "$($_.Key)=$($_.Value)"
        }) -join ',');

Write-Host "Generating $language SDK from $localSwaggerFilePath in $outputFolder with additional properties: $concatenatedAdditionalProperties";

& npx --yes openapi-generator-cli generate `
    -i "$localSwaggerFilePath" `
    -g "$language" `
    -o $outputFolder `
    --additional-properties="$concatenatedAdditionalProperties" 1> $null

if ($LASTEXITCODE -ne 0) {
    throw "Failed to generate SDK for $language from $localSwaggerFilePath to $outputFolder."
}

Write-Host "Generated $language SDK $outputFolder";