# Dashboard Documentation

## Overview

The AI Model Comparison Dashboard is a professional, investor-ready web application built with Next.js 14 that provides interactive visualizations and analysis of AI model comparison results.

## Features

- 📊 Interactive charts (cost, performance, token usage)
- 💰 Cost analysis and savings calculator
- ⚡ Performance metrics and model recommendations
- 🎨 Modern UI with dark mode support
- 📱 Fully responsive design
- 🔒 Password protection for demo access
- ☁️ AWS S3 integration for data storage
- 🚀 AWS Amplify deployment ready

## Quick Start

### 1. Set Up AWS S3 Bucket

```bash
npm run setup-aws
```

This creates the S3 bucket and updates your `.env` file.

### 2. Migrate Existing Data (Optional)

If you have existing execution folders in `outputs/`, upload them to S3:

```bash
npm run migrate-s3
```

### 3. Configure Dashboard Environment

Create `web/.env.local`:

```bash
cd web
cp .env.example .env.local
```

Edit `web/.env.local`:
```
NEXT_PUBLIC_S3_BUCKET=hibid-ai-comparison-YYYYMMDDHHMMSS
NEXT_PUBLIC_AWS_REGION=us-east-1
DASHBOARD_PASSWORD=demo2024
```

### 4. Run Dashboard Locally

```bash
npm run dashboard:dev
```

Open [http://localhost:3000](http://localhost:3000)

**Password:** `demo2024` (or whatever you set in `.env.local`)

## Deployment

### AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click "New app" -> "Host web app"
3. Connect your Git repository
4. Build settings will auto-detect `amplify.yml`
5. Add environment variables:
   - `NEXT_PUBLIC_S3_BUCKET` = your bucket name
   - `NEXT_PUBLIC_AWS_REGION` = us-east-1
   - `DASHBOARD_PASSWORD` = demo2024
6. Deploy!

## Architecture

### Pages

- **Home Dashboard** (`app/page.tsx`) - Key metrics, recent executions, cost summary
- **Execution Browser** (`app/executions/page.tsx`) - List all executions with search/filter
- **Execution Detail** (`app/executions/[id]/page.tsx`) - Full execution view with charts
- **Comparison View** (`app/compare/[id]/page.tsx`) - Side-by-side model comparison
- **PRD Demo** (`app/demo/page.tsx`) - Interactive PRD requirements demonstration

### Components

- **Charts**: CostChart, PerformanceChart, TokenChart, RadarChart
- **UI**: Card, Badge, Button, MetricCard, LoadingSkeleton
- **Features**: Navigation, ImageGallery, ResponseViewer

### AWS Integration

- **S3 Client** (`lib/aws.ts`) - List and load execution data from S3
- **API Routes** - Next.js API routes for S3 data access
- **CLI S3 Upload** - `--upload-s3` flag in compare command
- **Migration Script** - Upload existing executions to S3

## Environment Variables

### Required

- `NEXT_PUBLIC_S3_BUCKET` - S3 bucket name for execution data
- `NEXT_PUBLIC_AWS_REGION` - AWS region (default: us-east-1)

### Optional

- `DASHBOARD_PASSWORD` - Password for dashboard access (default: demo2024)
- `NEXT_PUBLIC_CLOUDFRONT_URL` - CloudFront distribution URL (if using CloudFront)

## Uploading Results to S3

When running comparisons, use the `--upload-s3` flag to automatically upload results:

```bash
node dist/index.js compare https://hibid.com/lot/test123 --upload-s3
```

This will:
- Save results locally (as usual)
- Upload entire execution folder to S3
- Make results available in the dashboard immediately

## Troubleshooting

### S3 Access Issues

- Verify AWS credentials are configured
- Check S3 bucket name is correct
- Ensure bucket policy allows access

### Dashboard Not Loading Data

- Check S3 bucket contains execution folders
- Verify environment variables are set
- Check browser console for errors

### Authentication Issues

- Verify `DASHBOARD_PASSWORD` is set
- Clear browser cookies and try again
- Check middleware configuration

