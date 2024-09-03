& dotnet nuget push "$PSScriptRoot/sdk/publish/*.nupkg" --source "https://api.nuget.org/v3/index.json" --api-key $env:NUGET_API_KEY
if ($LASTEXITCODE -ne 0) {
    throw "dotnet nuget push failed"
}