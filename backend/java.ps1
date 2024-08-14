$additionalProperties = @{
    apiPackage               = "id.trinsic.connect"
    artifactVersion          = "[VERSION]"
    library                  = "native"
    modelPackage             = "id.trinsic.connect.models"
    artifactId               = "connect"
    groupId                  = "id.trinsic"
    scmConnection            = ""
    scmDeveloperConnection   = ""
    scmUrl                   = "https://github.com/trinsic-id"
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
    & gradle compileJava
    & gradle jar
}
finally {
    Pop-Location
}

