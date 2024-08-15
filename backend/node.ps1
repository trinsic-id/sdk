$additionalProperties = @{
    npmName       = "@trinsic/connect-node"
    npmVersion    = "[VERSION]"
    supportsES6   = "true"
    npmRepository = "https://github.com/trinsic-id"
}
& "$PSScriptRoot/generate-client.ps1" -language "typescript-fetch" -patchVersion "0" -additionalProperties $additionalProperties -outputFolder "$PSScriptRoot/../dist/node"

try {
    Push-Location "$PSScriptRoot/../dist/node"
    & npm install
    & npm run build
    & npm pack --pack-destination "$PSScriptRoot/../dist/publish"
}
finally {
    Pop-Location
}