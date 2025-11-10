# Quick Start Guide

## ✅ Project is Ready!

The project has been built and is ready to use. Follow these steps to get started:

## Step 1: Add Your OpenRouter API Key

1. **Create a `.env` file** in the root directory (copy from `.env.example` if needed):
   ```bash
   # On Windows PowerShell:
   Copy-Item .env.example .env
   
   # On Mac/Linux:
   cp .env.example .env
   ```

2. **Edit the `.env` file** and replace `your_openrouter_api_key_here` with your actual OpenRouter API key:
   ```
   OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
   ```

   Get your API key from: https://openrouter.ai/keys

## Step 2: Test the Installation

Verify everything works:
```bash
# Check CLI is working
node dist/index.js --help

# Or if you've linked it globally:
ai-model-compare --help
```

## Step 3: Run Your First Comparison

Test with a mock HiBid URL (no real API needed):
```bash
node dist/index.js compare https://hibid.com/lot/test123
```

This will:
- Use mock data (no HiBid API required)
- Compare 3 cheaper models by default (gpt-4o-mini, gemini-flash, claude-3-haiku)
- Create an execution folder in `outputs/` with all results
- Display a comparison table

## Optional: Link Globally (Recommended)

To use `ai-model-compare` from anywhere:
```bash
npm link
```

Then you can use:
```bash
ai-model-compare compare https://hibid.com/lot/test123
```

## Example Commands

### Basic comparison with default models:
```bash
ai-model-compare compare https://hibid.com/lot/12345
```

### Compare specific models:
```bash
ai-model-compare compare https://hibid.com/lot/12345 --models "openai/gpt-4o,google/gemini-pro-1.5"
```

### Use custom prompt:
```bash
ai-model-compare compare https://hibid.com/lot/12345 --prompt "Classify this image in detail"
```

### Include metadata (title/description):
```bash
ai-model-compare compare https://hibid.com/lot/12345 --use-metadata
```

### Output as CSV:
```bash
ai-model-compare compare https://hibid.com/lot/12345 --output csv
```

### Analyze previous results:
```bash
ai-model-compare analyze execution-2024-01-15T10-30-00
```

## Project Structure

```
ai-model-comparison-tool/
├── src/              # TypeScript source files
├── dist/             # Compiled JavaScript (ready to use)
├── config/           # Model configurations
├── outputs/          # Execution results (created automatically)
├── .env              # Your API keys (create this)
├── .env.example      # Template for .env file
└── README.md         # Full documentation
```

## Troubleshooting

### "OPENROUTER_API_KEY environment variable is required"
- Make sure you created a `.env` file (not just `.env.example`)
- Verify the file contains `OPENROUTER_API_KEY=your_key_here`
- Restart your terminal after creating the file

### "Cannot find module" errors
- Run `npm install` to install dependencies
- Run `npm run build` to compile TypeScript

### Permission errors (Mac/Linux)
- Make sure `dist/index.js` has execute permissions: `chmod +x dist/index.js`
- Or use `node dist/index.js` instead

## Next Steps

1. ✅ Dependencies installed
2. ✅ Project built successfully
3. ✅ CLI tested and working
4. ⏳ **YOU NEED TO:** Add your OpenRouter API key to `.env` file
5. ⏳ Then you're ready to run comparisons!

## Cost Optimization Tips

- The tool defaults to cheaper models (gpt-4o-mini, gemini-flash, claude-3-haiku)
- Results are stored locally (no S3 costs)
- Mock data is used if HiBid API is not configured (no API costs)
- All costs are tracked and displayed in the comparison results

## Support

See `README.md` for full documentation and `SETUP.md` for detailed setup instructions.


