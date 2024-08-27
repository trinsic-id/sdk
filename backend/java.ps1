$additionalProperties = @{
    apiPackage               = "id.trinsic.api"
    artifactVersion          = "[VERSION]"
    library                  = "native"
    modelPackage             = "id.trinsic.api.models"
    artifactId               = "api"
    groupId                  = "id.trinsic"
    scmConnection            = "scm:git:https://github.com/trinsic-id/sdk.git"
    scmDeveloperConnection   = "scm:git:ssh://git@github.com/trinsic-id/sdk.git"
    scmUrl                   = "https://github.com/trinsic-id/sdk"
    artifactUrl              = "https://trinsic.id"
    developerEmail           = "support@Trinsic.id"
    developerName            = "Trinsic"
    developerOrganization    = "Trinsic"
    developerOrganizationUrl = "https://trinsic.id"
    artifactDescription      = "Trinsic"
}
& "$PSScriptRoot/generate-client.ps1" -language "java" -additionalProperties $additionalProperties

# Remove the generated github action
Remove-Item -Path "$PSScriptRoot/../.github/workflows/maven.yml" -Force

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
    $newPublishingContent = "" # This is the content we want to add to the build.gradle file
#     $newPublishingContent = @"
#         repositories {
#             maven {
#                 name = "GitHubPackages"
#                 url = uri("https://maven.pkg.github.com/trinsic-id/sdk")
#                 credentials {
#                     username = System.getenv("MAVEN_GITHUB_USERNAME")
#                     password = System.getenv("MAVEN_GITHUB_TOKEN")
#                 }
#             }
#     }
# "@
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

