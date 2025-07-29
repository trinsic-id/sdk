Write-Host "Setting npm token"
&npm set //registry.npmjs.org/:_authToken "$env:NPM_TOKEN"

&npm whoami
try {
    Set-Location "$PSScriptRoot/sdk/publish"
    Write-Host "Publishing packages"
    foreach ($package in Get-ChildItem -Filter "trinsic-api-*.tgz") {
        Write-Host "Publishing $package"
        & npm publish $package.FullName  --yes --no-git-tag-version --access=public
        Write-Host "Published $package"
    }
}
finally {
    Pop-Location
}

