$sourceLocation = "$PSScriptRoot/../dist/java"
$destinationLocation = "$PSScriptRoot/../java"
$repositoryPath = "trinsic-id/sdk-java-api"
$name = "Java"

& "$PSScriptRoot\submodule.ps1" -tagPrefix '' -sourceLocation $sourceLocation -name $name -destinationLocation $destinationLocation -sdkRepositoryPath $Env:SDK_REPOSITORY_PATH -githubPAT $Env:PAT_GITHUB -repositoryPath $repositoryPath -packageVersion $Env:PACKAGE_VERSION