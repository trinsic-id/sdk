param(
    [Parameter(Mandatory = $true)]
    [string]$sourceLocation,
    [Parameter(Mandatory = $true)]
    [string]$destinationLocation,
    [Parameter(Mandatory = $true)]
    [string]$githubPAT,
    [Parameter(Mandatory = $true)]
    [string]$repositoryPath,
    [Parameter(Mandatory = $true)]
    [string]$packageVersion,
    [Parameter(Mandatory = $true)]
    [string]$name,
    [Parameter(Mandatory = $true)]
    [string]$sdkRepositoryPath,
    [Parameter(Mandatory = $false)]
    [string]$tagPrefix = 'v'
)

if (-not (Test-Path -Path $sourceLocation -PathType Container)) {
    throw "The source location '$sourceLocation' does not exist."
}

if (-not (Test-Path -Path $destinationLocation -PathType Container)) {
    throw "The destination location '$destinationLocation' does not exist."
}

try {
    Set-Location $destinationLocation

    git config --global user.name "github-actions[bot]"
    git config --global user.email "github-actions[bot]@users.noreply.github.com"

    # Commit and push to sub module
    $remoteOrigin = "https://$githubPAT@github.com/$repositoryPath.git"
    Write-Host "Setting origin to $remoteOrigin"
    git remote set-url origin $remoteOrigin

    Write-Host "Checking out main branch"
    # If we don't do this we're in a detached head state
    git checkout main

    Write-Host "Copying source code to destination"
    Copy-Item -Path $sourceLocation/* -Destination $destinationLocation -Recurse -Force
    
    Write-Host "Adding files to git"
    git add .
    Write-Host "Committing files"
    git commit -m "Publishing latest $name package for version $packageVersion"
    
    Write-Host "Pushing to submodule repository"
    git push origin main

    if ($LASTEXITCODE -ne 0) {
        throw "Failed to push to submodule main"
    }

    $tagName = "$tagPrefix$packageVersion"
    git tag $tagName
    git push origin $tagName

    Set-Location "$PSScriptRoot/../"
    $remoteOrigin = "https://$githubPAT@github.com/$sdkRepositoryPath.git"
    Write-Host "Setting origin to $remoteOrigin"
    git remote set-url origin $remoteOrigin

    # Update reference in main repo
    git add $destinationLocation
    git commit -m "Update $name submodule reference to version $packageVersion"
    git push origin main
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to push to our main"
    }
}
finally {
    Pop-Location    
}