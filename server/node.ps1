$version = &"$PSScriptRoot\get-version.ps1" -patchVersion "1"
$additionalProperties = @{
    npmName       = "@trinsic/connect-backend-client"
    npmVersion    = $version
    supportsES6   = "true"
    npmRepository = "https://github.com/trinsic-id"
}
& "$PSScriptRoot\generate-client.ps1" -language "typescript-fetch" -additionalProperties $additionalProperties