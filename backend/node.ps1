$additionalProperties = @{
    npmName       = "@trinsic/connect-node"
    npmVersion    = "[VERSION]"
    supportsES6   = "true"
    npmRepository = "https://github.com/trinsic-id"
}
& "$PSScriptRoot/generate-client.ps1" -language "typescript-fetch" -patchVersion "1" -additionalProperties $additionalProperties -outputFolder "$PSScriptRoot/../dist/node"

try {
    # Node doesn't like building from different directories but I don't want to change location all the time so pop at end back to whatever started the script
    Push-Location "$PSScriptRoot/../dist/node"
    & npm install
    & npm run build
    & npm pack --pack-destination "$PSScriptRoot/../dist/publish"
}
finally {
    Pop-Location
}