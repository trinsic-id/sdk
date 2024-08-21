$sourceLocation = "$PSScriptRoot/../dist/php"
$destinationLocation = "$PSScriptRoot/../php"
$repositoryPath = "trinsic-id/sdk-php-api"
$name = "PHP"

& "$PSScriptRoot\submodule.ps1" -sourceLocation $sourceLocation -name $name -destinationLocation $destinationLocation -sdkRepositoryPath $Env:SDK_REPOSITORY_PATH -githubPAT $Env:PAT_GITHUB -repositoryPath $repositoryPath -packageVersion $Env:PACKAGE_VERSION