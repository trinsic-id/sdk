Write-Host "Setting npm token"
npm set //registry.npmjs.org/:_authToken "$($env.NPM_TOKEN)"

try {
    Set-Location "$PSScriptRoot/../dist/publish"
    Write-Host "Publishing packages"
    foreach ($package in Get-ChildItem -Filter *.tgz) {
        Write-Host "Publishing $package.FullName"
        npm publish $package.FullName  --yes --no-git-tag-version
        Write-Host "Published $package.FullName"
    }
}
finally {
    Pop-Location
}

