$additionalProperties = @{
    packageName    = "trinsic_connect_backend_client"
    packageVersion = "[VERSION]"
    packageUrl     = "https://trinsic.id"
    projectName    = "Trinsic-Connect-Backend-Client"
}
& "$PSScriptRoot/generate-client.ps1" -language "python" -patchVersion "1" -additionalProperties $additionalProperties