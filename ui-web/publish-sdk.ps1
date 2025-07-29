Write-Host "Setting npm token"
&npm set //registry.npmjs.org/:_authToken "$env:NPM_TOKEN"
if ($LASTEXITCODE -ne 0) {
    throw "npm set config failed"
}

try {
    Set-Location "$PSScriptRoot/sdk/publish"
    Write-Host "Publishing packages"
    foreach ($package in Get-ChildItem -Filter "trinsic-web-ui-*.tgz") {
        Write-Host "Publishing $package"
        & npm publish $package.FullName  --yes --no-git-tag-version --access=public
        if ($LASTEXITCODE -ne 0) {
            throw "npm publish failed"
        }
        Write-Host "Published $package"
    }
}
finally {
    Pop-Location
}

