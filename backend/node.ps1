$additionalProperties = @{
    npmName     = "@trinsic/connect-node"
    npmVersion  = "[VERSION]"
    supportsES6 = "true"
}
& "$PSScriptRoot/generate-client.ps1" -language "typescript-fetch" -patchVersion "0" -additionalProperties $additionalProperties -outputFolder "$PSScriptRoot/../dist/node"

try {
    Push-Location "$PSScriptRoot/../dist/node"
    & npm install
    & npm pack --pack-destination "$PSScriptRoot/../dist/publish"
}
finally {
    Pop-Location
}