$sourceLocation = "$PSScriptRoot/../dist/go"

if (-not (Test-Path -Path $sourceLocation -PathType Container)) {
    throw "The source location '$sourceLocation' does not exist."
}

#We likely need to split php up into a separate repo. Because of that we should do the same for go
throw "Not implemented yet"
$tagName = "go/v$env::VERSION"
git tag $tagName
git push origin $tagName