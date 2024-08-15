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
& "$PSScriptRoot/generate-client.ps1" -language "java" -patchVersion "0" -additionalProperties $additionalProperties

try {
    Push-Location "$PSScriptRoot/../dist/java"

    # OpenAPI generator doesn't generate archiveClassifier but we use gradle 8+ which requires it
    $buildGradleFile = "build.gradle"
    $buildGradleFileContent = Get-Content -Path $buildGradleFile
    $buildGradleFileContent = $buildGradleFileContent -replace "classifier =", "archiveClassifier="

    # Convert content to an array for easier manipulation
    $gradleLines = $buildGradleFileContent -split "`n"

    # Initialize a flag to track whether we are inside the publishing block
    $insidePublishingBlock = $false
    $newPublishingContent = @"
        repositories {
            maven {
                name = "GitHubPackages"
                url = uri("https://maven.pkg.github.com/trinsic-id/connect-sdks")
                credentials {
                    username = System.getenv("MAVEN_GITHUB_USERNAME")
                    password = System.getenv("MAVEN_GITHUB_TOKEN")
                }
            }
    }
"@
    $buildGradleFileContent = ""

    foreach ($line in $gradleLines) {
        # Check if the line contains the start of the publishing block
        if ($line -match "^\s*publishing\s*{") {
            $insidePublishingBlock = $true
        }

        # If we are inside the publishing block and encounter the closing brace
        if ($insidePublishingBlock -and $line -match "^\s*}\s*$") {
            # Append the new content before the closing brace
            $buildGradleFileContent += $newPublishingContent
            $insidePublishingBlock = $false
        }

        # Add the current line to the updated content
        $buildGradleFileContent += $line + "`n"
    }


    $buildGradleFileContent | Set-Content -Path $buildGradleFile

    & gradle compileJava
    & gradle jar
}
finally {
    Pop-Location
}

