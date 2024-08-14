$additionalProperties = @{
    packageName    = "trinsic_connect"
    packageVersion = "[VERSION]"
    packageUrl     = "https://trinsic.id"
    projectName    = "Trinsic-Connect"
}
& "$PSScriptRoot/generate-client.ps1" -language "python" -patchVersion "1" -additionalProperties $additionalProperties

try {
    Push-Location "$PSScriptRoot/../dist/python"
    # Check if 'python' is available
    $pythonPath = (Get-Command python -ErrorAction SilentlyContinue).Path

    # If 'python' is not available, check for 'python3'
    if (-not $pythonPath) {
        $pythonPath = (Get-Command python3 -ErrorAction SilentlyContinue).Path
    }

    # If neither 'python' nor 'python3' is available, throw an error
    if (-not $pythonPath) {
        Write-Error "Neither 'python' nor 'python3' was found in your system path."
        exit 1
    }

    # Execute the Python script using the found interpreter
    & $pythonPath setup.py sdist --dist-dir "$PSScriptRoot/../dist/publish" bdist_wheel --dist-dir "$PSScriptRoot/../dist/publish"
    & pip install .
}
finally {
    Pop-Location
}

