$additionalProperties = @{
    apiPackage               = "id.trinsic.connect"
    artifactVersion          = "[VERSION]"
    library                  = "native"
    modelPackage             = "id.trinsic.connect.models"
    artifactId               = "connect"
    groupId                  = "id.trinsic"
    scmConnection            = "scm:git:https://github.com/trinsic-id/connect-sdks.git"
    scmDeveloperConnection   = "scm:git:ssh://git@github.com/trinsic-id/connect-sdks.git"
    scmUrl                   = "https://github.com/trinsic-id/connect-sdks"
    artifactUrl              = "https://trinsic.id"
    developerEmail           = "support@Trinsic.id"
    developerName            = "Trinsic"
    developerOrganization    = "Trinsic"
    developerOrganizationUrl = "https://trinsic.id"
    artifactDescription      = "'Trinsic Connect'"
}
& "$PSScriptRoot/generate-client.ps1" -language "java" -patchVersion "1" -additionalProperties $additionalProperties

try {
    # Java doesn't like building from different directories but I don't want to change location all the time so pop at end back to whatever started the script
    Push-Location "$PSScriptRoot/../dist/java"

    # OpenAPI generator doesn't generate archiveClassifier but we use gradle 8+ which requires it
    $buildGradleFile = "build.gradle"
    $buildGradleFileContent = Get-Content -Path $buildGradleFile
    $buildGradleFileContent = $buildGradleFileContent -replace "classifier =", "archiveClassifier="
    $buildGradleFileContent | Set-Content -Path $buildGradleFile

    & gradle compileJava
    & gradle jar
}
finally {
    Pop-Location
}

