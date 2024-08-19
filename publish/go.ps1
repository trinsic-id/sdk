$sourceLocation = "$PSScriptRoot/../dist/go"
$destinationLocation = "$PSScriptRoot/../go"
if (-not (Test-Path -Path $sourceLocation -PathType Container)) {
    throw "The source location '$sourceLocation' does not exist."
}

if (-not (Test-Path -Path $destinationLocation -PathType Container)) {
    throw "The destination location '$destinationLocation' does not exist."
}

try {
    Set-Location $destinationLocation
    Write-Host "Publishing package"
    Copy-Item -Path $sourceLocation/* -Destination $destinationLocation -Recurse

    # Commit and push to sub module
    git add .
    git commit -m "Publishing latest go package"
    git push origin main

    # Update reference in main repo
    git add $destinationLocation
    git commit -m "Update submodule reference for go"
    git push origin main
}
finally {
    Pop-Location    
}


#We likely need to split php up into a separate repo. Because of that we should do the same for go
throw "Not implemented yet"
$tagName = "go/v$env::VERSION"
git tag $tagName
git push origin $tagName