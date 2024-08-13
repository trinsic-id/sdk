$version = &"$PSScriptRoot\get-version.ps1" -patchVersion "1"
$additionalProperties = @{
    packageName    = "trinsic_connect_backend_client"
    packageVersion = $version
    packageUrl     = "https://trinsic.id"
    projectName    = "Trinsic-Connect-Backend-Client"
}
& "$PSScriptRoot\generate-client.ps1" -language "python" -additionalProperties $additionalProperties