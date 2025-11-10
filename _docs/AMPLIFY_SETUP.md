# AWS Amplify Setup Guide

## Prerequisites Checklist

✅ **S3 Bucket**: `YOUR_S3_BUCKET_NAME`  
✅ **Git Repository**: `https://github.com/YOUR_USERNAME/YOUR_REPO.git`  
✅ **amplify.yml**: Already configured in repository root

## Step-by-Step Setup

### Step 1: Commit and Push Your Code (if not already done)

```bash
# Check if you have uncommitted changes
git status

# If you have changes, commit them
git add .
git commit -m "feat: Add comprehensive web dashboard and organize documentation"
git push origin main
```

### Step 2: Go to AWS Amplify Console

1. Open your browser and go to: **https://console.aws.amazon.com/amplify**
2. Make sure you're in the correct AWS region (e.g., `us-east-1`)

### Step 3: Create New App

1. Click the **"New app"** button (top right)
2. Select **"Host web app"**

### Step 4: Connect Repository

1. Choose your Git provider: **GitHub** (or your provider)
2. Click **"Connect branch"**
3. Authorize AWS Amplify to access your GitHub account (if first time)
4. Select your repository: `YOUR_USERNAME/YOUR_REPO`
5. Select branch: **`main`**
6. Click **"Next"**

### Step 5: Configure Build Settings

Amplify should auto-detect the `amplify.yml` file. Verify:

- **App name**: `ai-model-comparison-tool` (or your preferred name)
- **Environment name**: `main` (or your branch name)
- **Build settings**: Should show "amplify.yml detected"

The build settings should look like:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd web
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: web/.next
    files:
      - '**/*'
```

Click **"Next"**

### Step 6: Add Environment Variables

**CRITICAL**: Add these environment variables:

1. Click **"Add environment variable"** for each:

   **Variable 1:**
   - Key: `NEXT_PUBLIC_S3_BUCKET`
   - Value: `YOUR_S3_BUCKET_NAME`

   **Variable 2:**
   - Key: `NEXT_PUBLIC_AWS_REGION`
   - Value: `us-east-1` (or your preferred region)

   **Variable 3:**
   - Key: `DASHBOARD_PASSWORD`
   - Value: `YOUR_SECURE_PASSWORD` (use a strong password)

2. Click **"Next"**

### Step 7: Review and Deploy

1. Review your settings
2. Click **"Save and deploy"**

### Step 8: Wait for Deployment

- Amplify will:
  1. Clone your repository
  2. Install dependencies (`cd web && npm ci`)
  3. Build the application (`npm run build`)
  4. Deploy to CloudFront CDN

This typically takes **5-10 minutes** for the first deployment.

### Step 9: Access Your Dashboard

Once deployment completes:

1. You'll see a green checkmark ✅
2. Click on your app name
3. You'll see the dashboard URL: `https://<branch-name>.<app-id>.amplifyapp.com`
4. Click the URL to open your dashboard
5. Login with password: `YOUR_SECURE_PASSWORD` (the password you set in environment variables)

## Post-Deployment Configuration

### Configure AWS Credentials for S3 Access

The dashboard needs AWS credentials to read from S3. You have two options:

#### Option A: Use IAM Role (Recommended for Amplify)

1. Go to **AWS IAM Console**: https://console.aws.amazon.com/iam
2. Create a new role or use existing one
3. Attach policy with S3 read permissions for your bucket
4. In Amplify Console → App Settings → Environment variables
5. Add: `AWS_ROLE_ARN` = your IAM role ARN

#### Option B: Use Environment Variables (Less Secure)

Add to Amplify environment variables:
- `AWS_ACCESS_KEY_ID` = your access key
- `AWS_SECRET_ACCESS_KEY` = your secret key

⚠️ **Note**: This is less secure. Use IAM roles when possible.

### Update S3 Bucket Policy

Your S3 bucket needs to allow Amplify to read files. Update bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAmplifyRead",
      "Effect": "Allow",
      "Principal": {
        "Service": "amplify.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_S3_BUCKET_NAME/*"
    }
  ]
}
```

Or use the Amplify service role that gets created automatically.

## Troubleshooting

### Build Fails

- Check build logs in Amplify Console
- Verify `amplify.yml` is correct
- Ensure `web/package.json` has all dependencies

### Dashboard Shows "No Executions"

- Verify `NEXT_PUBLIC_S3_BUCKET` environment variable is correct
- Check S3 bucket contains execution folders
- Verify AWS credentials have S3 read permissions
- Check browser console for errors

### Authentication Issues

- Verify `DASHBOARD_PASSWORD` environment variable is set
- Clear browser cookies
- Check middleware is working

### S3 Access Denied

- Verify bucket policy allows Amplify service access
- Check IAM role permissions
- Verify bucket name is correct

## Custom Domain (Optional)

1. In Amplify Console → App Settings → Domain management
2. Click "Add domain"
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning (can take 30-60 minutes)

## Continuous Deployment

Amplify automatically deploys when you push to your connected branch:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Amplify will automatically:
1. Detect the push
2. Build the new version
3. Deploy to your app

## Monitoring

- **Build History**: View all deployments in Amplify Console
- **Logs**: Access build and runtime logs
- **Metrics**: View request metrics and performance

## Your Dashboard URL

Once deployed, your dashboard will be available at:
- **Amplify URL**: `https://main.<app-id>.amplifyapp.com`
- **Custom Domain**: (if configured) `https://your-domain.com`

## Quick Reference

**S3 Bucket**: `YOUR_S3_BUCKET_NAME`  
**Region**: `us-east-1` (or your preferred region)  
**Password**: `YOUR_SECURE_PASSWORD`  
**Git Repo**: `https://github.com/YOUR_USERNAME/YOUR_REPO.git`

