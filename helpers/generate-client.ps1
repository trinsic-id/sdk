# Parameters:
param (
    [Parameter(Mandatory = $true)]
    [string]$language,
    [string]$versionName = $language,
    [string]$swaggerFileOrUrl = "https://api.trinsic.id/swagger/api/swagger.json",
    [Parameter(Mandatory = $true)]
    [string]$outputFolder,
    [Parameter(Mandatory = $true)]
    [hashtable]$additionalProperties
)

if (-not (Test-Path -Path $outputFolder)) {
    New-Item -ItemType Directory -Path $outputFolder
}
$outputGeneratedFolder = Join-Path -Path $outputFolder -ChildPath "generated"
if (-not (Test-Path -Path $outputGeneratedFolder)) {
    New-Item -ItemType Directory -Path $outputGeneratedFolder
}
$publishFolder = Join-Path -Path $outputFolder -ChildPath "publish"
if (-not (Test-Path -Path $publishFolder)) {
    New-Item -ItemType Directory -Path $publishFolder
}

$localSwaggerFilePath = "";
if ($swaggerFileOrUrl -like "https://*") {
    Write-Host "The URL starts with https://, retrieving the file"
    Write-Host "Downloading specification from $swaggerFileOrUrl";
    $localSwaggerFilePath = "$PSScriptRoot/swagger.json";

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
    $localSwaggerFilePath = $swaggerFileOrUrl;
}


if (Test-Path -Path $outputGeneratedFolder -PathType Container) {
    Write-Host "Cleaning up output folder $outputGeneratedFolder";
    Remove-Item -Recurse -Force $outputGeneratedFolder;
    Write-Host "Cleaned up destination folder $outputGeneratedFolder";
}
else {
    New-Item -ItemType Directory -Path $outputGeneratedFolder -ErrorAction Stop > $null 2>&1
    Write-Host "Created output folder";
}

$version = &"$PSScriptRoot\..\get-version.ps1" -versionName $versionName;

# Concatenate the hashtable into a comma-separated string and replace version variable
$concatenatedAdditionalProperties = (($additionalProperties.GetEnumerator() | ForEach-Object {
            "$($_.Key)=$($_.Value -replace "\[VERSION\]", $version)"
        }) -join ',');

Write-Host "Generating $language SDK from $localSwaggerFilePath in $outputGeneratedFolder with additional properties: $concatenatedAdditionalProperties";

& npx --yes openapi-generator-cli generate `
    -i "$localSwaggerFilePath" `
    -g "$language" `
    -o $outputGeneratedFolder `
    --additional-properties=$concatenatedAdditionalProperties 1> $null

if ($LASTEXITCODE -ne 0) {
    throw "Failed to generate SDK for $language from $localSwaggerFilePath to $outputGeneratedFolder."
}

Write-Host "Generated $language SDK $outputGeneratedFolder";