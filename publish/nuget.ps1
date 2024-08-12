$sourceLocation = "$PSScriptRoot/../dist/csharp"

if (-not (Test-Path -Path $sourceLocation -PathType Container)) {
    throw "The source location '$sourceLocation' does not exist."
}

& dotnet pack $sourceLocation --configuration Release --include-source --include-symbols --output $sourceLocation
& dotnet nuget push "$sourceLocation/*.nupkg" --source "https://api.nuget.org/v3/index.json" --api-key $env:NUGET_API_KEY