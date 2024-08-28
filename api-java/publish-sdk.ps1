$destinationLocation = "$PSScriptRoot/sdk"
$repositoryPath = "trinsic-id/sdk-java-api"
$name = "Java"

& "$PSScriptRoot\..\helpers\submodule.ps1" -tagPrefix '' -name $name -destinationLocation $destinationLocation -sdkRepositoryPath $Env:SDK_REPOSITORY_PATH -githubPAT $Env:PAT_GITHUB -repositoryPath $repositoryPath -packageVersion $Env:PACKAGE_VERSION