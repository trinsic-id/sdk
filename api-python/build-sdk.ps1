$additionalProperties = @{
    packageName    = "trinsic_api"
    packageVersion = "[VERSION]"
    packageUrl     = "https://trinsic.id"
    projectName    = "Trinsic-Api"
}
& "$PSScriptRoot/../helpers/generate-client.ps1" -language "python" -outputFolder "$PSScriptRoot/sdk" -additionalProperties $additionalProperties

try {
    Copy-Item "$PSScriptRoot/README.md" "$PSScriptRoot/sdk/README.md"

    Push-Location "$PSScriptRoot/sdk"

    # Remove all content starting from the line that begins with 'setup(' in the setup.py file
    $setupFilePath = "$PSScriptRoot/sdk/setup.py"
    $content = Get-Content $setupFilePath
    $index = $content.IndexOf($content -match '^\s*setup\(')  # Find the index of the line that starts with 'setup('
    if ($index -ge 0) {
        $newContent = $content[0..($index-1)]  # Keep everything before the 'setup(' line
        $newContent | Set-Content $setupFilePath
    }

    # Append the contents of _setup.py to the modified setup.py
    $additionalContent = @"
with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name=NAME,
    version=VERSION,
    description="Trinsic API",
    author="trinsic-id",
    author_email="support@trinsic.id",
    url="https://trinsic.id",
    keywords=["Trinsic", "SDK", "Identity verification"],
    install_requires=REQUIRES,
    packages=find_packages(exclude=["test", "tests"]),
    include_package_data=True,
    long_description_content_type='text/markdown',
    long_description=long_description,
    package_data={"trinsic_api": ["py.typed"]},
)
"@
    Add-Content -Path $setupFilePath -Value $additionalContent
    
    # Check if 'python' is available
    $pythonPath = (Get-Command python -ErrorAction SilentlyContinue).Path
    $pipPath = (Get-Command pip -ErrorAction SilentlyContinue).Path

    # If 'python' is not available, check for 'python3'
    if (-not $pythonPath) {
        $pythonPath = (Get-Command python3 -ErrorAction SilentlyContinue).Path
        $pipPath = (Get-Command pip3 -ErrorAction SilentlyContinue).Path
    }

    # If neither 'python' nor 'python3' is available, throw an error
    if (-not $pythonPath) {
        Write-Error "Neither 'python' nor 'python3' was found in your system path."
        exit 1
    }

    # Execute the Python script using the found interpreter
    & $pythonPath setup.py sdist --dist-dir "$PSScriptRoot/sdk/publish" bdist_wheel --dist-dir "$PSScriptRoot/sdk/publish"
    if ($LASTEXITCODE -ne 0) {
        throw "Python setup.py failed"
    }
    & $pipPath install .
    if ($LASTEXITCODE -ne 0) {
        throw "Python pip install failed"
    }
}
finally {
    Pop-Location
}

