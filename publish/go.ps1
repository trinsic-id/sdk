$sourceLocation = "$PSScriptRoot/../dist/go"
$destinationLocation = "$PSScriptRoot/../go"

& "$PSScriptRoot\submodule.ps1" -sourceLocation $sourceLocation -destinationLocation $destinationLocation -githubPAT $Env:PAT_GITHUB -repositoryPath "trinsic-id/connect-go" -packageVersion $Env:PACKAGE_VERSION