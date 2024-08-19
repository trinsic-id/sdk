$sourceLocation = "$PSScriptRoot/../dist/php"

if (-not (Test-Path -Path $sourceLocation -PathType Container)) {
    throw "The source location '$sourceLocation' does not exist."
}



#We likely need to split php up into a separate repo as with go.
throw "Not implemented yet"

$tagName = "php/v$env::VERSION"
git tag $tagName
git push origin $tagName