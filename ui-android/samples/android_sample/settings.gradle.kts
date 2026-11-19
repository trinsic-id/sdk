import java.net.URI

pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "Trinsic Android Sample"
include(":app")

// Validate unreleased SDK changes from this checkout when requested by CI or a developer.
if (providers.gradleProperty("useLocalTrinsicSdk").orNull == "true") {
    includeBuild("../../sdk") {
        dependencySubstitution {
            substitute(module("id.trinsic:sdk-android-ui")).using(project(":library"))
        }
    }
}
