# AWS Setup Script for AI Model Comparison Dashboard
# PowerShell version for Windows

$ErrorActionPreference = "Stop"

$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$BUCKET_NAME = "hibid-ai-comparison-$timestamp"
$REGION = if ($env:AWS_REGION) { $env:AWS_REGION } else { "us-east-1" }
$PROFILE = if ($env:AWS_PROFILE) { $env:AWS_PROFILE } else { "default" }

Write-Host "[*] Setting up AWS infrastructure..." -ForegroundColor Cyan
Write-Host "Bucket name: $BUCKET_NAME"
Write-Host "Region: $REGION"
Write-Host "Profile: $PROFILE"
Write-Host ""

# Check if AWS CLI is installed
try {
    $null = aws --version 2>&1
} catch {
    Write-Host "[X] AWS CLI not found. Please install AWS CLI first." -ForegroundColor Red
    Write-Host "Download from: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

# Create S3 bucket
Write-Host "[*] Creating S3 bucket..." -ForegroundColor Cyan
try {
    if ($REGION -eq "us-east-1") {
        # us-east-1 doesn't need LocationConstraint
        aws s3api create-bucket `
            --bucket $BUCKET_NAME `
            --region $REGION `
            --profile $PROFILE 2>&1 | Out-Null
    } else {
        $locationConfig = @{LocationConstraint=$REGION} | ConvertTo-Json -Compress
        aws s3api create-bucket `
            --bucket $BUCKET_NAME `
            --region $REGION `
            --profile $PROFILE `
            --create-bucket-configuration $locationConfig 2>&1 | Out-Null
    }
    Write-Host "[OK] Bucket created successfully" -ForegroundColor Green
} catch {
    Write-Host "[!] Bucket may already exist or error occurred. Continuing..." -ForegroundColor Yellow
}

# Enable versioning
Write-Host "[*] Enabling versioning..." -ForegroundColor Cyan
try {
    aws s3api put-bucket-versioning `
        --bucket $BUCKET_NAME `
        --versioning-configuration Status=Enabled `
        --profile $PROFILE 2>&1 | Out-Null
    Write-Host "[OK] Versioning enabled" -ForegroundColor Green
} catch {
    Write-Host "[!] Could not enable versioning: $_" -ForegroundColor Yellow
}

# Update .env file
Write-Host "[*] Updating .env file..." -ForegroundColor Cyan
$envPath = Join-Path $PSScriptRoot "..\.env"

if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    
    if ($envContent -match "AWS_S3_BUCKET=") {
        $envContent = $envContent -replace "AWS_S3_BUCKET=.*", "AWS_S3_BUCKET=$BUCKET_NAME"
    } else {
        $envContent += "`nAWS_S3_BUCKET=$BUCKET_NAME"
    }
    
    if ($envContent -match "AWS_REGION=") {
        $envContent = $envContent -replace "AWS_REGION=.*", "AWS_REGION=$REGION"
    } else {
        $envContent += "`nAWS_REGION=$REGION"
    }
    
    if ($envContent -notmatch "AWS_PROFILE=") {
        $envContent += "`nAWS_PROFILE=$PROFILE"
    }
    
    Set-Content -Path $envPath -Value $envContent
    Write-Host "[OK] .env file updated" -ForegroundColor Green
} else {
    # Create .env file
    $envContent = @"
OPENROUTER_API_KEY=your_openrouter_api_key_here
AWS_S3_BUCKET=$BUCKET_NAME
AWS_REGION=$REGION
AWS_PROFILE=$PROFILE
"@
    Set-Content -Path $envPath -Value $envContent
    Write-Host "[OK] .env file created" -ForegroundColor Green
}

# Create web/.env.local if it doesn't exist
Write-Host "[*] Creating web/.env.local..." -ForegroundColor Cyan
$webEnvPath = Join-Path $PSScriptRoot "..\web\.env.local"

if (-not (Test-Path $webEnvPath)) {
    $webEnvContent = @"
NEXT_PUBLIC_S3_BUCKET=$BUCKET_NAME
NEXT_PUBLIC_AWS_REGION=$REGION
DASHBOARD_PASSWORD=your-secure-password
"@
    Set-Content -Path $webEnvPath -Value $webEnvContent
    Write-Host "[OK] web/.env.local created" -ForegroundColor Green
} else {
    $webEnvContent = Get-Content $webEnvPath -Raw
    
    if ($webEnvContent -match "NEXT_PUBLIC_S3_BUCKET=") {
        $webEnvContent = $webEnvContent -replace "NEXT_PUBLIC_S3_BUCKET=.*", "NEXT_PUBLIC_S3_BUCKET=$BUCKET_NAME"
    } else {
        $webEnvContent += "`nNEXT_PUBLIC_S3_BUCKET=$BUCKET_NAME"
    }
    
    if ($webEnvContent -match "NEXT_PUBLIC_AWS_REGION=") {
        $webEnvContent = $webEnvContent -replace "NEXT_PUBLIC_AWS_REGION=.*", "NEXT_PUBLIC_AWS_REGION=$REGION"
    } else {
        $webEnvContent += "`nNEXT_PUBLIC_AWS_REGION=$REGION"
    }
    
    Set-Content -Path $webEnvPath -Value $webEnvContent
    Write-Host "[OK] web/.env.local updated" -ForegroundColor Green
}

Write-Host ""
Write-Host "[OK] AWS setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Verify your AWS credentials are configured:"
Write-Host "   aws configure --profile $PROFILE"
Write-Host ""
Write-Host "2. Migrate existing executions to S3:"
Write-Host "   npm run migrate-s3"
Write-Host ""
Write-Host "3. Run dashboard locally:"
Write-Host "   npm run dashboard:dev"
Write-Host ""
Write-Host "Bucket created: $BUCKET_NAME" -ForegroundColor Green


