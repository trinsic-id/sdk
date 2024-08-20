Write-Host "Publishing RubyGems package..."

$env:GEM_HOST_API_KEY = $env:RUBYGEMS_API_KEY
&gem signin  1> $null

&gem push publish/*.gem