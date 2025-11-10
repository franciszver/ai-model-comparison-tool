#!/bin/bash

# AWS Setup Script for AI Model Comparison Dashboard
# This script sets up S3 bucket and prepares for Amplify deployment

set -e

BUCKET_NAME="hibid-ai-comparison-$(date +%Y%m%d%H%M%S)"
REGION="${AWS_REGION:-us-east-1}"
PROFILE="${AWS_PROFILE:-default}"

echo "🚀 Setting up AWS infrastructure..."
echo "Bucket name: $BUCKET_NAME"
echo "Region: $REGION"
echo "Profile: $PROFILE"
echo ""

# Create S3 bucket
echo "📦 Creating S3 bucket..."
aws s3api create-bucket \
  --bucket "$BUCKET_NAME" \
  --region "$REGION" \
  --profile "$PROFILE" \
  --create-bucket-configuration LocationConstraint="$REGION" || {
  # If bucket already exists or error, try without LocationConstraint for us-east-1
  aws s3api create-bucket \
    --bucket "$BUCKET_NAME" \
    --region "$REGION" \
    --profile "$PROFILE" || true
}

# Enable versioning
echo "🔄 Enabling versioning..."
aws s3api put-bucket-versioning \
  --bucket "$BUCKET_NAME" \
  --versioning-configuration Status=Enabled \
  --profile "$PROFILE"

# Set bucket policy for CloudFront access (not public)
echo "🔒 Configuring bucket policy..."
cat > /tmp/bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontAccess",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::*:distribution/*"
        }
      }
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket "$BUCKET_NAME" \
  --policy file:///tmp/bucket-policy.json \
  --profile "$PROFILE" || echo "⚠️  Note: Bucket policy may need manual configuration for CloudFront"

# Update .env file
echo "📝 Updating .env file..."
if [ -f .env ]; then
  if grep -q "AWS_S3_BUCKET" .env; then
    sed -i.bak "s/AWS_S3_BUCKET=.*/AWS_S3_BUCKET=$BUCKET_NAME/" .env
  else
    echo "AWS_S3_BUCKET=$BUCKET_NAME" >> .env
  fi
  
  if grep -q "AWS_REGION" .env; then
    sed -i.bak "s/AWS_REGION=.*/AWS_REGION=$REGION/" .env
  else
    echo "AWS_REGION=$REGION" >> .env
  fi
else
  echo "AWS_S3_BUCKET=$BUCKET_NAME" > .env
  echo "AWS_REGION=$REGION" >> .env
fi

echo ""
echo "✅ AWS setup complete!"
echo ""
echo "Next steps:"
echo "1. Update web/.env.local with:"
echo "   NEXT_PUBLIC_S3_BUCKET=$BUCKET_NAME"
echo "   NEXT_PUBLIC_AWS_REGION=$REGION"
echo ""
echo "2. Run: npm run setup-amplify"
echo ""
echo "Bucket created: $BUCKET_NAME"


