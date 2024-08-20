Write-Host "Publishing to PyPi"

$env:TWINE_USERNAME = "__token__"
$env:TWINE_PASSWORD = "$env:PYPI_API_TOKEN"

&pip install twine

&twine upload dist/publish/*

Write-Host "Published to PyPi"