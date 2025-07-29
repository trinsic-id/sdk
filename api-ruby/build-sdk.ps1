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

Copy-Item "$PSScriptRoot/../LICENSE" "$PSScriptRoot/sdk/"
Copy-Item "$PSScriptRoot/README.md" "$PSScriptRoot/sdk/"

try {
    Push-Location "$PSScriptRoot/sdk"

    # Remove all content starting from the line that begins with 'setup(' in the setup.py file
    $specFile = "$PSScriptRoot/sdk/trinsic_api.gemspec"
    $content = Get-Content $specFile

    $index = $content.IndexOf($content -match '^\s*Gem::Specification')  # Find the index of the line that starts with 'Gem::Specification('
    if ($index -ge 0) {
        $newContent = $content[0..($index-1)]  # Keep everything before the 'setup(' line
        $newContent | Set-Content $specFile
    }

        # Append the contents of _setup.py to the modified setup.py
    $newSpec = @"
Gem::Specification.new do |s|
  s.name        = "trinsic_api"
  s.version     = TrinsicApi::VERSION
  s.platform    = Gem::Platform::RUBY
  s.authors     = ["Trinsic"]
  s.email       = ["support@trinsic.id"]
  s.homepage    = "https://trinsic.id"
  s.summary     = "Trinsic API Ruby Library"
  s.description = "This library is an SDK to interact with Trinsic's APIs."
  s.license     = "MIT"
  s.required_ruby_version = ">= 2.7"
  s.metadata    = {}

  s.add_runtime_dependency 'typhoeus', '~> 1.0', '>= 1.0.1'

  s.add_development_dependency 'rspec', '~> 3.6', '>= 3.6.0'

  s.files         = ``find *``.split("\n").uniq.sort.select { |f| !f.empty? }
  s.test_files    = ``find spec/*``.split("\n")
  s.executables   = []
  s.require_paths = ["lib"]
end
"@
    Add-Content -Path $specFile -Value $newSpec

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
