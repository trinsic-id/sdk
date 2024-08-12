$sourceLocation = "$PSScriptRoot/../dist/go"

if (-not (Test-Path -Path $sourceLocation -PathType Container)) {
    throw "The source location '$sourceLocation' does not exist."
}

$tagName = "go/v$env::VERSION"
git tag $tagName
git push origin $tagName