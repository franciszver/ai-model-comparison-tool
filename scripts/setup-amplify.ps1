# Amplify Setup Script (PowerShell)
# This script provides guidance for setting up AWS Amplify

Write-Host "🚀 AWS Amplify Setup Guide" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will guide you through setting up AWS Amplify." -ForegroundColor White
Write-Host ""

# Check if amplify CLI is installed
try {
    $null = amplify --version 2>&1
    $amplifyInstalled = $true
} catch {
    $amplifyInstalled = $false
}

if (-not $amplifyInstalled) {
    Write-Host "⚠️  AWS Amplify CLI not found." -ForegroundColor Yellow
    Write-Host "Install it with: npm install -g @aws-amplify/cli" -ForegroundColor White
    Write-Host ""
    Write-Host "Alternatively, you can set up Amplify via the AWS Console:" -ForegroundColor Cyan
    Write-Host "1. Go to https://console.aws.amazon.com/amplify" -ForegroundColor White
    Write-Host "2. Click 'New app' -> 'Host web app'" -ForegroundColor White
    Write-Host "3. Connect your Git repository" -ForegroundColor White
    Write-Host "4. Set build settings (use amplify.yml in repo)" -ForegroundColor White
    Write-Host "5. Add environment variables:" -ForegroundColor White
    Write-Host "   - NEXT_PUBLIC_S3_BUCKET=<your-bucket-name>" -ForegroundColor Gray
    Write-Host "   - NEXT_PUBLIC_AWS_REGION=us-east-1" -ForegroundColor Gray
    Write-Host "   - DASHBOARD_PASSWORD=<your-secure-password>" -ForegroundColor Gray
    Write-Host ""
    exit 0
}

Write-Host "📋 Environment variables needed for Amplify:" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXT_PUBLIC_S3_BUCKET=<your-s3-bucket-name>" -ForegroundColor White
Write-Host "NEXT_PUBLIC_AWS_REGION=us-east-1" -ForegroundColor White
Write-Host "DASHBOARD_PASSWORD=<your-secure-password>" -ForegroundColor White
Write-Host ""
Write-Host "These will be set during Amplify app creation." -ForegroundColor Gray
Write-Host ""

$response = Read-Host "Do you want to initialize Amplify in this project? (y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    Push-Location web
    amplify init
    Write-Host ""
    Write-Host "✅ Amplify initialized!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Add hosting: amplify add hosting" -ForegroundColor White
    Write-Host "2. Publish: amplify publish" -ForegroundColor White
    Pop-Location
} else {
    Write-Host ""
    Write-Host "You can set up Amplify manually:" -ForegroundColor Cyan
    Write-Host "1. Go to AWS Amplify Console" -ForegroundColor White
    Write-Host "2. Connect your Git repository" -ForegroundColor White
    Write-Host "3. Use the amplify.yml file from the repo" -ForegroundColor White
    Write-Host "4. Add the environment variables listed above" -ForegroundColor White
}


