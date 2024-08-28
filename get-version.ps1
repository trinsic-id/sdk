# Parameters:
param (
    [Parameter(Mandatory = $true)]
    [string]$versionName
)
# Because there's a lot of small variations in version number usage across generators, generate version first and provide it via additonal properties to the generate-client.ps1 file.
# Other option was a lot of if language specific if statements inside of generate-client.
$jsonContent = Get-Content -Path "$PSScriptRoot\versions.json" -Raw | ConvertFrom-Json
$directVersion = $jsonContent.$versionName;
$version = ""
if ($null -ne $directVersion) {
    $version = $directVersion
}
else {
    $backendVersion = $jsonContent.backendVersion
    $patchVersion = $jsonContent."$($versionName)patchVersion"
    $version = "$backendVersion.$patchVersion"
    Write-Host "Package will be created with version $version from file based API Version $backendVersion and patchVersion $patchVersion"
}

echo "trinsic-package-version=$version" >> $env:GITHUB_OUTPUT

return $version;