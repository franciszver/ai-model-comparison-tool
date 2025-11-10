# Dashboard Quick Start Guide

## 🚀 Get Your Dashboard Running in 5 Minutes

### Step 1: Set Up AWS S3 Bucket

```bash
# This creates the S3 bucket and updates your .env file
npm run setup-aws
```

**What it does:**
- Creates S3 bucket: `hibid-ai-comparison-YYYYMMDDHHMMSS`
- Enables versioning
- Configures bucket policy
- Updates `.env` with bucket name

### Step 2: Migrate Existing Data (Optional)

If you have existing execution folders in `outputs/`, upload them to S3:

```bash
npm run migrate-s3
```

This uploads all execution folders to S3 so they appear in the dashboard.

### Step 3: Configure Dashboard Environment

Create `web/.env.local`:

```bash
cd web
cp .env.example .env.local
```

Edit `web/.env.local`:
```
NEXT_PUBLIC_S3_BUCKET=YOUR_S3_BUCKET_NAME
NEXT_PUBLIC_AWS_REGION=us-east-1
DASHBOARD_PASSWORD=YOUR_SECURE_PASSWORD
```

### Step 4: Run Dashboard Locally

```bash
# From project root
npm run dashboard:dev

# Or from web directory
cd web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Password:** `YOUR_SECURE_PASSWORD` (the password you set in `.env.local`)

### Step 5: Deploy to AWS Amplify

**Option A: Via AWS Console (Recommended)**
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click "New app" -> "Host web app"
3. Connect your Git repository
4. Build settings will auto-detect `amplify.yml`
5. Add environment variables:
   - `NEXT_PUBLIC_S3_BUCKET` = your bucket name
   - `NEXT_PUBLIC_AWS_REGION` = us-east-1
   - `DASHBOARD_PASSWORD` = your secure password
6. Deploy!

**Option B: Via CLI**
```bash
npm run setup-amplify
```

## 📊 Using the Dashboard

### Upload New Comparisons to S3

```bash
# Run comparison with S3 upload
node dist/index.js compare https://hibid.com/lot/test123 --upload-s3
```

Results will appear in the dashboard automatically!

### Dashboard Features

- **Home**: Overview with key metrics and recent executions
- **Executions**: Browse all executions with search and filters
- **Execution Detail**: Full view with charts and model responses
- **Comparison**: Side-by-side model analysis with recommendations

## 🔧 Troubleshooting

### "S3 bucket not found"
- Verify `AWS_S3_BUCKET` is set in `.env`
- Check bucket name is correct
- Ensure AWS credentials are configured

### "No executions found"
- Run `npm run migrate-s3` to upload existing data
- Or run a new comparison with `--upload-s3` flag
- Check S3 bucket contains execution folders

### "Authentication failed"
- Check `DASHBOARD_PASSWORD` in `web/.env.local`
- Clear browser cookies
- Try logging in again

### Dashboard not loading data
- Verify `NEXT_PUBLIC_S3_BUCKET` is set correctly
- Check browser console for errors
- Ensure S3 bucket has execution folders

## 📝 Next Steps

1. ✅ Set up S3 bucket
2. ✅ Migrate existing data
3. ✅ Run dashboard locally
4. ✅ Deploy to AWS Amplify
5. ✅ Share dashboard URL with investors!

## 🎉 You're Ready!

Your investor-ready dashboard is now set up and ready to impress!

For detailed documentation, see:
- `web/README.md` - Dashboard documentation
- `README.md` - Main project documentation
- `DASHBOARD_IMPLEMENTATION_SUMMARY.md` - Implementation details


