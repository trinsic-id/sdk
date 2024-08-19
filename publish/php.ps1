$sourceLocation = "$PSScriptRoot/../dist/php"
$destinationLocation = "$PSScriptRoot/../php"

& "$PSScriptRoot\submodule.ps1" -sourceLocation $sourceLocation -destinationLocation $destinationLocation -githubPAT $Env:PAT_GITHUB -repositoryPath "trinsic-id/php" -packageVersion $Env:PACKAGE_VERSION