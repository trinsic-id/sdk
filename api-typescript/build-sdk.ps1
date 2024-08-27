$additionalProperties = @{
    npmName                   = "@trinsic/api"
    npmVersion                = "[VERSION]"
    supportsES6               = "true"
    withInterfaces            = "true"
    useSingleRequestParameter = "false"
}
& "$PSScriptRoot/generate-client.ps1" -language "typescript-fetch" -versionName "node" -additionalProperties $additionalProperties -outputFolder "$PSScriptRoot/../dist/node"

try {
    Push-Location "$PSScriptRoot/../dist/node"
    & npm install
    & npm pack --pack-destination "$PSScriptRoot/../dist/publish"
}
finally {
    Pop-Location
}