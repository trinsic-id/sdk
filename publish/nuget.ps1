$sourceLocation = "../dist/csharp"
#Ensure we run this "from this folder" as we run it personally in a command line as well as through the perspective of builds.
Set-Location -Path "$PSScriptRoot"

if (-not (Test-Path -Path $sourceLocation -PathType Container)) {
    throw "The source location '$sourceLocation' does not exist."
}

& dotnet pack $sourceLocation --configuration Release --include-source --include-symbols --output $sourceLocation
& dotnet nuget push "$sourceLocation/*.nupkg" --source "https://api.nuget.org/v3/index.json" --api-key $env:NUGET_API_KEY