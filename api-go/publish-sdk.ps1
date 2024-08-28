$destinationLocation = "$PSScriptRoot/sdk"
$repositoryPath = "trinsic-id/sdk-go-api"
$name = "Go"

& "$PSScriptRoot\submodule.ps1" -name $name -destinationLocation $destinationLocation -sdkRepositoryPath $Env:SDK_REPOSITORY_PATH -githubPAT $Env:PAT_GITHUB -repositoryPath $repositoryPath -packageVersion $Env:PACKAGE_VERSION