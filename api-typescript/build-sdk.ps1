$additionalProperties = @{
    npmName                   = "@trinsic/api"
    npmVersion                = "[VERSION]"
    supportsES6               = "true"
    withInterfaces            = "true"
    useSingleRequestParameter = "false"
}
& "$PSScriptRoot/../helpers/generate-client.ps1" -language "typescript-fetch" -outputFolder "$PSScriptRoot/sdk" -versionName "node" -additionalProperties $additionalProperties 

try {
    Copy-Item "$PSScriptRoot/README.md" "$PSScriptRoot/sdk"
    Copy-Item "$PSScriptRoot/../LICENSE" "$PSScriptRoot/sdk"

    Push-Location "$PSScriptRoot/sdk"
    & npm ci
    & npm pack --pack-destination "$PSScriptRoot/sdk/publish"
}
finally {
    Pop-Location
}