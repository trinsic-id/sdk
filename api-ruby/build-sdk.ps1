$additionalProperties = @{
    gemAuthor      = "Trinsic"
    gemAuthorEmail = "support@trinsic.id"
    gemDescription = "'Trinsic Api SDK to assist you in integrating with Trinsic'"
    gemHomepage    = "https://trinsic.id"
    gemName        = "trinsic_api"
    gemSummary     = "'Trinsic Api SDK'"
    gemVersion     = "[VERSION]"
    moduleName     = "TrinsicApi"
}
& "$PSScriptRoot/../helpers/generate-client.ps1" -language "ruby" -outputFolder "$PSScriptRoot/sdk" -additionalProperties $additionalProperties

try {
    Push-Location "$PSScriptRoot/sdk"
    &gem build trinsic_api.gemspec
    
    # Move a file with .gem file extension to the another directory without specifying the exact filename
    Move-Item -Path *.gem -Destination "$PSScriptRoot/sdk/publish" -Force
    
    $gemFile = Get-ChildItem -Path "$PSScriptRoot/sdk/publish" -Filter *.gem
    Write-Host "Installing $gemFile"
    &gem install $gemFile --user-install   
}
finally {
    Pop-Location
}
