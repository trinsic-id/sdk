$version = &"$PSScriptRoot\get-version.ps1" -patchVersion "0"
$additionalProperties = @{
    packageName    = "trinsic.id/connect-sdks/go"
    packageVersion = $version
}
& "$PSScriptRoot\generate-client.ps1" -language "go" -additionalProperties $additionalProperties