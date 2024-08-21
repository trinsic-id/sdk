$sourceLocation = "$PSScriptRoot/../dist/go"
$destinationLocation = "$PSScriptRoot/../go"
$repositoryPath = "trinsic-id/sdk-go-api"
$name = "Go"

& "$PSScriptRoot\submodule.ps1" -sourceLocation $sourceLocation -name $name -destinationLocation $destinationLocation -sdkRepositoryPath $Env:SDK_REPOSITORY_PATH -githubPAT $Env:PAT_GITHUB -repositoryPath $repositoryPath -packageVersion $Env:PACKAGE_VERSION