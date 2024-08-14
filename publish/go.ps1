$sourceLocation = "$PSScriptRoot/../dist/go"

if (-not (Test-Path -Path $sourceLocation -PathType Container)) {
    throw "The source location '$sourceLocation' does not exist."
}

$goModFile = "$sourceLocation/go.mod"
$goModFileContent = Get-Content -Path $goModFile
$goModFileContent = $goModFileContent -replace "/GIT_USER_ID/GIT_REPO_ID", "/trinsic-id/connect-sdks/dist/go"
$goModFileContent | Set-Content -Path $goModFile

$tagName = "go/v$env::VERSION"
git tag $tagName
git push origin $tagName