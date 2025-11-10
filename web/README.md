# AI Model Comparison Dashboard

A professional, investor-ready dashboard for visualizing and analyzing AI model comparison results.

## Features

- 📊 Interactive charts and visualizations
- 💰 Cost analysis and optimization insights
- ⚡ Performance metrics and comparisons
- 🎨 Modern, responsive design with dark mode
- 🔒 Simple password protection for demo access
- 📱 Mobile-friendly interface
- 🚀 Hosted on AWS Amplify with CloudFront CDN

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Hosting**: AWS Amplify
- **Storage**: AWS S3

## Getting Started

### Prerequisites

- Node.js 18+
- AWS account with S3 bucket configured
- AWS credentials configured (profile or environment variables)

### Installation

1. Install dependencies:
```bash
cd web
npm install
```

2. Create `.env.local` file:
```bash
cp .env.example .env.local
```

3. Configure environment variables in `.env.local`:
```
NEXT_PUBLIC_S3_BUCKET=your-s3-bucket-name
NEXT_PUBLIC_AWS_REGION=us-east-1
DASHBOARD_PASSWORD=demo2024
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:
```bash
npm run build
npm start
```

## AWS Setup

### 1. Create S3 Bucket

Run the setup script:
```bash
npm run setup-aws
```

Or manually:
```bash
aws s3api create-bucket --bucket hibid-ai-comparison-YYYYMMDD --region us-east-1
```

### 2. Configure Amplify

See `scripts/setup-amplify.sh` for instructions, or:

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click "New app" -> "Host web app"
3. Connect your Git repository
4. Build settings will use `amplify.yml` from the repo
5. Add environment variables:
   - `NEXT_PUBLIC_S3_BUCKET`
   - `NEXT_PUBLIC_AWS_REGION`
   - `DASHBOARD_PASSWORD`

## Environment Variables

### Required

- `NEXT_PUBLIC_S3_BUCKET` - S3 bucket name for execution data
- `NEXT_PUBLIC_AWS_REGION` - AWS region (default: us-east-1)

### Optional

- `DASHBOARD_PASSWORD` - Password for dashboard access (default: demo2024)
- `NEXT_PUBLIC_CLOUDFRONT_URL` - CloudFront distribution URL (if using CloudFront)

## Project Structure

```
web/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard home
│   ├── executions/        # Execution browser
│   ├── compare/           # Comparison views
│   └── api/               # API routes
├── components/            # React components
│   ├── charts/           # Chart components
│   ├── cards/            # Card components
│   └── ui/               # UI components
├── lib/                   # Utilities and AWS client
└── public/                # Static assets
```

## Usage

### Accessing the Dashboard

1. Navigate to the dashboard URL (after deployment)
2. Enter the password (default: `demo2024`)
3. Browse executions, view comparisons, and analyze results

### Viewing Executions

- **Home**: Overview with key metrics and recent executions
- **Executions**: Browse all executions with search and filters
- **Execution Detail**: Detailed view of a single execution
- **Comparison**: Side-by-side model comparison with charts

## Deployment

### AWS Amplify

The dashboard is configured for automatic deployment via AWS Amplify:

1. Push code to your Git repository
2. Amplify automatically builds and deploys
3. Updates are live within minutes

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `.next` folder to your hosting provider

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

## Support

For issues or questions, see the main project README or open an issue.
