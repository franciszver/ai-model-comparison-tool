#!/bin/bash

# Amplify Setup Script
# This script helps set up AWS Amplify for the dashboard

set -e

echo "🚀 AWS Amplify Setup Guide"
echo ""
echo "This script will guide you through setting up AWS Amplify."
echo ""

# Check if amplify CLI is installed
if ! command -v amplify &> /dev/null; then
  echo "⚠️  AWS Amplify CLI not found."
  echo "Install it with: npm install -g @aws-amplify/cli"
  echo ""
  echo "Alternatively, you can set up Amplify via the AWS Console:"
  echo "1. Go to https://console.aws.amazon.com/amplify"
  echo "2. Click 'New app' -> 'Host web app'"
  echo "3. Connect your Git repository"
  echo "4. Set build settings (use amplify.yml in repo)"
  echo "5. Add environment variables:"
  echo "   - NEXT_PUBLIC_S3_BUCKET=<your-bucket-name>"
  echo "   - NEXT_PUBLIC_AWS_REGION=us-east-1"
  echo "   - DASHBOARD_PASSWORD=demo2024"
  echo ""
  exit 0
fi

echo "📋 Environment variables needed for Amplify:"
echo ""
echo "NEXT_PUBLIC_S3_BUCKET=<your-s3-bucket-name>"
echo "NEXT_PUBLIC_AWS_REGION=us-east-1"
echo "DASHBOARD_PASSWORD=demo2024"
echo ""
echo "These will be set during Amplify app creation."
echo ""

read -p "Do you want to initialize Amplify in this project? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  cd web
  amplify init
  echo ""
  echo "✅ Amplify initialized!"
  echo ""
  echo "Next steps:"
  echo "1. Add hosting: amplify add hosting"
  echo "2. Publish: amplify publish"
else
  echo ""
  echo "You can set up Amplify manually:"
  echo "1. Go to AWS Amplify Console"
  echo "2. Connect your Git repository"
  echo "3. Use the amplify.yml file from the repo"
  echo "4. Add the environment variables listed above"
fi


