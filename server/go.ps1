$additionalProperties = @{
    packageName    = "connect"
    packageVersion = "[VERSION]"
}
& "$PSScriptRoot\generate-client.ps1" -language "go" -patchVersion "1" -additionalProperties $additionalProperties
try {
    # Go doesn't like building from different directories but I don't want to change location all the time so pop at end back to whatever started the script
    Push-Location "$PSScriptRoot/../dist/go"
    &go build
}
finally {
    Pop-Location
}