$additionalProperties = @{
    npmName       = "@trinsic/connect-backend-client"
    npmVersion    = "[VERSION]"
    supportsES6   = "true"
    npmRepository = "https://github.com/trinsic-id"
}
& "$PSScriptRoot/generate-client.ps1" -language "typescript-fetch" -patchVersion "1" -additionalProperties $additionalProperties