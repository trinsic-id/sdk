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

    # Path to the JSON file
    $packageJson = "$PSScriptRoot/sdk/package.json"
    $content = Get-Content -Path $packageJson -Raw | ConvertFrom-Json

    # Modify the description field
    $content.description = "Trinsic API TypeScript library."
    $content.repository.url = "https://github.com/trinsic-id/sdk"
    $content.author = "Trinsic"

    $content | Add-Member -MemberType NoteProperty -Name "homepage" -Value "https://trinsic.id"
    $content | Add-Member -MemberType NoteProperty -Name "license" -Value "MIT"
    
    # Convert the modified object back to JSON
    $content | ConvertTo-Json -Depth 10 | Set-Content -Path $packageJson

    Push-Location "$PSScriptRoot/sdk"
    & npm install

    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }

    & npm pack --pack-destination "$PSScriptRoot/sdk/publish"
}
finally {
    Pop-Location
}