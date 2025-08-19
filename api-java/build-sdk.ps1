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
    licenseName              = "MIT"
    licenseUrl               = "https://opensource.org/licenses/MIT"
}
& "$PSScriptRoot/../helpers/generate-client.ps1" -language "java" -outputFolder "$PSScriptRoot/sdk-build" -additionalProperties $additionalProperties


try {
    Push-Location "$PSScriptRoot/sdk-build"

    Copy-Item "$PSScriptRoot/README.md" "$PSScriptRoot/sdk-build"
    Copy-Item "$PSScriptRoot/../LICENSE" "$PSScriptRoot/sdk-build"

    # Remove the auto-generated github action; our PAT doesn't let us push it and we don't need it
    Remove-Item -Path ".github/workflows/maven.yml" -Force

    # Fetch the build.gradle file
    $buildGradleFile = "build.gradle"
    $buildGradleFileContent = Get-Content -Path $buildGradleFile

    # HACK: Building this SDK breaks in Gradle 9+ for two reasons:
    # 1. The generated code uses 'main' instead of 'mainClass' in the JavaExec task
    # 2. For some reason, `sourceCompatibility = JavaVersion.VERSION_11` breaks, because it needs to be prefixed with `java.` or surrounded by `java { ...}`
    # This hack fixes those problems
    $buildGradleFileContent = $buildGradleFileContent -replace 'main = System.getProperty', 'mainClass = System.getProperty'
    $buildGradleFileContent = $buildGradleFileContent -replace 'sourceCompatibility = JavaVersion.VERSION_11', 'java.sourceCompatibility = JavaVersion.VERSION_11'
    $buildGradleFileContent = $buildGradleFileContent -replace 'targetCompatibility = JavaVersion.VERSION_11', 'java.targetCompatibility = JavaVersion.VERSION_11'

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
    if ($LASTEXITCODE -ne 0) {
        throw "gradle compileJava failed"
    }
    & gradle jar    
    if ($LASTEXITCODE -ne 0) {
        throw "gradle jar failed"
    }
}
finally {
    Pop-Location
}

