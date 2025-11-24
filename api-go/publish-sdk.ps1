$destinationLocation = "$PSScriptRoot/sdk"
$sourceLocation = "$PSScriptRoot/sdk-build"
$repositoryPath = "trinsic-id/sdk-go-api"
$name = "Go"

& "$PSScriptRoot\..\helpers\submodule.ps1" -name $name -sourceLocation $sourceLocation -destinationLocation $destinationLocation -sdkRepositoryPath $Env:SDK_REPOSITORY_PATH -githubPAT $Env:MEWMBA_GIT_PUBLISH_TOKEN -repositoryPath $repositoryPath -packageVersion $Env:PACKAGE_VERSION