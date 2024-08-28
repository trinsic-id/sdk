$destinationLocation = "$PSScriptRoot/sdk"
$sourceLocation = "$PSScriptRoot/sdk-build"
$repositoryPath = "trinsic-id/sdk-java-api"
$name = "Java"

& "$PSScriptRoot\..\helpers\submodule.ps1" -tagPrefix '' -name $name -sourceLocation $sourceLocation -destinationLocation $destinationLocation -sdkRepositoryPath $Env:SDK_REPOSITORY_PATH -githubPAT $Env:PAT_GITHUB -repositoryPath $repositoryPath -packageVersion $Env:PACKAGE_VERSION