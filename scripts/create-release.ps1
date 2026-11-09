# Create GitHub release for v0.1.1-beta via API

param(
    [string]$GITHUB_TOKEN = $env:GITHUB_PERSONAL_ACCESS_TOKEN,
    [switch]$DryRun
)

$REPO = "https://api.github.com/repos/SmelliW/ultron-orchestrator/releases"
$BRANCH = "release/v0.1.1-beta"
$VERSION = "v0.1.1-beta"

if ($DryRun) {
    Write-Host "DRY RUN - Would create release $VERSION..."
    exit 0
}

Write-Host "Creating release $VERSION on $BRANCH branch..."

$RELEASE_BODY = @"
This release adds real implementation of key features:

* Test validations with HTTP status codes
* Memory manager backup/restore functionality
* CLI error handling and help text improvements
* All GitHub documentation files (README, CHANGELOG, SECURITY, LICENSE, CODE_OF_CONDUCT, CONTRIBUTING)

Known limitations: This version uses MOCK DATABASES instead of production database layers. Password storage uses MD5 (will be upgraded to bcryptjs in v0.2.0).

Previous releases:
- v0.1.0-beta - Initial Ultron release
"@

$headers = @{
    "Accept" = "application/vnd.github.v3+json"
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $GITHUB_TOKEN"
}

try {
    Invoke-RestMethod -Uri "$REPO" -Method POST -Headers $headers -Body ($RELEASE_BODY | ConvertTo-Json) | Out-String | Write-Host
    Write-Host ""
    Write-Host "Release created successfully!"
    Write-Host ""
    Write-Host "You can verify it with:"
    Invoke-RestMethod -Uri "$REPO/$VERSION" -Headers $headers | ConvertTo-Json | Format-list
}
catch {
    Write-Error "Failed to create release: $_"
    exit 1
}
