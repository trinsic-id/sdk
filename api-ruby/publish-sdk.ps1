Write-Host "Publishing RubyGems package..."

$env:GEM_HOST_API_KEY = $env:RUBYGEMS_API_TOKEN
&gem signin  1> $null


try {
    Set-Location "$PSScriptRoot/sdk/publish"
    Write-Host "Publishing packages"
    foreach ($package in Get-ChildItem -Filter "trinsic_api-*.gem") {
        Write-Host "Publishing $package"
        &gem push $package.FullName
        Write-Host "Published $package"
    }
}
finally {
    Pop-Location
}
