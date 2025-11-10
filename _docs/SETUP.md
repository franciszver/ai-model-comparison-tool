# Quick Setup Guide

## Prerequisites

- Node.js 18+ and npm installed
- OpenRouter API key ([Get one here](https://openrouter.ai/keys))
- AWS profile configured (optional, for future S3 integration)

## Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Create `.env` file:**
   Create a `.env` file in the root directory with the following content:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   AWS_PROFILE=default
   HIBID_API_KEY=your_hibid_api_key_here
   HIBID_API_ENDPOINT=https://api.hibid.com
   ```
   
   **Note:** Only `OPENROUTER_API_KEY` is required. The others are optional.

4. **Link the CLI tool (optional, for global usage):**
   ```bash
   npm link
   ```
   
   This allows you to use `ai-model-compare` from anywhere.

## Verify Installation

Test the installation:
```bash
npm run build
ai-model-compare --help
```

Or if not linked globally:
```bash
node dist/index.js --help
```

## First Run

Try comparing models with a mock HiBid URL:
```bash
ai-model-compare compare https://hibid.com/lot/test123
```

The tool will use mock data if the HiBid API is not configured, so you can test without a real HiBid API key.

## Troubleshooting

### "OPENROUTER_API_KEY environment variable is required"
- Make sure you created a `.env` file in the root directory
- Verify the file contains `OPENROUTER_API_KEY=your_key_here`
- Restart your terminal after creating the `.env` file

### "Cannot find module" errors
- Run `npm install` to install dependencies
- Run `npm run build` to compile TypeScript

### Permission errors on Unix/Mac
- Make sure `dist/index.js` has execute permissions: `chmod +x dist/index.js`
- Or use `node dist/index.js` instead of the direct command


