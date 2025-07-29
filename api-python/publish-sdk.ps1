Write-Host "Publishing to PyPi"

$env:TWINE_USERNAME = "__token__"
$env:TWINE_PASSWORD = "$env:PYPI_API_TOKEN"

&pip install twine 1> $null
if ($LASTEXITCODE -ne 0) {
    throw "Pip install twine failed"
}

&twine upload api-python/sdk/publish/*
if ($LASTEXITCODE -ne 0) {
    throw "Twine upload failed"
}

Write-Host "Published to PyPi"