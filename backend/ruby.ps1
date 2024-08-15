$additionalProperties = @{
    gemAuthor      = "Trinsic"
    gemAuthorEmail = "support@trinsic.id"
    gemDescription = "'Trinsic Connect'"
    gemHomepage    = "https://trinsic.id"
    gemName        = "trinsic_connect"
    gemSummary     = "'Trinsic Connect'"
    gemVersion     = "[VERSION]"
    moduleName     = "TrinsicConnect"
}
& "$PSScriptRoot/generate-client.ps1" -language "ruby" -additionalProperties $additionalProperties

try {
    Push-Location "$PSScriptRoot/../dist/ruby"
    &gem build trinsic_connect.gemspec
    
    # Move a file with .gem file extension to the another directory without specifying the exact filename
    Move-Item -Path *.gem -Destination "$PSScriptRoot/../dist/publish" -Force

    $gemFile = Get-ChildItem -Path "$PSScriptRoot/../dist/publish" -Filter *.gem
    Write-Host "Installing $gemFile"
    &gem install $gemFile --user-install
    
}
finally {
    Pop-Location
}
