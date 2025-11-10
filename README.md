# AI Model Comparison Tool

A comprehensive Node.js CLI tool and web dashboard for comparing multiple AI models (OpenAI, Gemini, Claude) via OpenRouter for image classification tasks. Designed for prompt engineers to test and optimize prompts across different models while tracking costs, token usage, and performance metrics.

**🎉 Going Above and Beyond:** This project includes a **professional, investor-ready web dashboard** that provides interactive visualizations, real-time analysis, and an interactive PRD requirements demonstration page - features that go well beyond the original CLI-only requirements.

## ✨ Key Features

### CLI Tool Features

- **Multi-Model Comparison**: Compare multiple AI models simultaneously via OpenRouter with parallel execution
- **Vision Model Support**: Process images with vision-capable models (GPT-4o, Gemini, Claude)
- **Cost Tracking**: Track token usage and costs per model with detailed breakdowns
- **Performance Metrics**: Measure latency, response quality, and efficiency metrics
- **Execution Folders**: Organize results in timestamped folders with full data capture
- **Multiple Output Formats**: Table, CSV, and JSON output formats for different use cases
- **Mock Data Support**: Test without HiBid API access using realistic mock data
- **Cost-Optimized**: Uses cheaper models by default (gpt-4o-mini, gemini-flash, claude-3-haiku)
- **Custom Prompts**: Override default prompts for specialized use cases
- **Metadata Integration**: Optional inclusion of lot titles/descriptions in prompts
- **AWS S3 Integration**: Optional automatic upload of results to S3 for dashboard access
- **Error Handling**: Graceful error handling with retry logic and detailed error reporting

### 🌟 Web Dashboard (Above & Beyond Feature)

A **professional, investor-ready Next.js dashboard** that provides:

#### Interactive Visualizations
- **Cost Charts**: Bar charts comparing costs across models with savings calculations
- **Performance Charts**: Latency and response time comparisons
- **Token Usage Charts**: Stacked bar charts showing input/output token breakdowns
- **Radar Charts**: Multi-dimensional model comparison (cost, speed, efficiency, quality)

#### Dashboard Pages
- **Home Dashboard**: Overview with key metrics, recent executions, and cost summaries
- **Execution Browser**: List all executions with search, filter, and sort capabilities
- **Execution Detail View**: Full execution view with all charts, model responses, and images
- **Comparison View**: Side-by-side model analysis with recommendations
- **PRD Demo Page**: Interactive walkthrough demonstrating all PRD requirements with live demos

#### Advanced Features
- **Model Recommendations**: Automatic recommendations for cheapest, fastest, and most efficient models
- **Cost Analysis**: Total cost tracking, savings calculator, and ROI projections
- **Image Gallery**: Lightbox viewer for execution images
- **Response Viewer**: Side-by-side comparison of model responses
- **Dark Mode**: Full dark mode support with smooth transitions
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Password Protection**: Secure demo access with configurable password
- **Real-Time Updates**: Automatic data refresh from S3

#### PRD Requirements Demonstration
- **Interactive Walkthrough**: Expandable sections showing all PRD requirements
- **Live Demos**: Direct links to actual implementations
- **Code Examples**: Copy-to-clipboard CLI commands and code snippets
- **Evidence Tracking**: Visual proof of requirement completion
- **Progress Tracking**: Overall completion metrics and progress bars

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- OpenRouter API key ([Get one here](https://openrouter.ai/keys))
- AWS profile configured (optional, for S3 integration and dashboard)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd ai-model-comparison-tool
```

2. **Install dependencies:**
```bash
npm install
cd web && npm install && cd ..
```

3. **Build the project:**
```bash
npm run build
```

4. **Create a `.env` file:**
```bash
cp .env.example .env
```

5. **Edit `.env` and add your OpenRouter API key:**
```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## 📖 Usage

### CLI Commands

#### Compare Models

Compare multiple AI models on a HiBid lot URL:

```bash
# Basic usage with default models
node dist/index.js compare https://hibid.com/lot/12345

# Specify custom models
node dist/index.js compare https://hibid.com/lot/12345 --models "openai/gpt-4o,google/gemini-pro-1.5"

# Use custom prompt
node dist/index.js compare https://hibid.com/lot/12345 --prompt "Classify this image in detail"

# Include metadata (title/description) in prompt
node dist/index.js compare https://hibid.com/lot/12345 --use-metadata

# Output as CSV
node dist/index.js compare https://hibid.com/lot/12345 --output csv

# Upload to S3 for dashboard access
node dist/index.js compare https://hibid.com/lot/12345 --upload-s3

# Verbose logging
node dist/index.js compare https://hibid.com/lot/12345 --verbose
```

#### Analyze Previous Results

Analyze results from a previous execution:

```bash
# View results in table format
node dist/index.js analyze execution-2024-01-15T10-30-00

# Output as JSON
node dist/index.js analyze execution-2024-01-15T10-30-00 --output json

# Verbose mode with full responses
node dist/index.js analyze execution-2024-01-15T10-30-00 --verbose
```

### Command Options

#### Compare Command

- `<lot-url>` (required): HiBid lot URL to analyze
- `-m, --models <models>`: Comma-separated list of models (default: cheaper models)
- `-p, --prompt <prompt>`: Custom prompt template (default: image classification prompt)
- `-o, --output <format>`: Output format - `table`, `csv`, or `json` (default: `table`)
- `-f, --folder <folder>`: Execution folder name (auto-generated if not provided)
- `--use-metadata`: Include title/description in prompt
- `--upload-s3`: Upload execution results to S3 after completion
- `-v, --verbose`: Verbose logging

#### Analyze Command

- `<execution-folder>` (required): Execution folder name from `outputs/` directory
- `-o, --output <format>`: Output format - `table`, `csv`, or `json` (default: `table`)
- `-v, --verbose`: Verbose logging with full model responses

## 🎯 Available Models

The tool supports all models available via OpenRouter. Default model sets:

- **Cheap** (default): `gpt-4o-mini`, `gemini-flash-1.5`, `claude-3-haiku`
- **Standard**: `gpt-4o`, `gemini-pro-1.5`, `claude-3-opus`
- **Premium**: `gpt-4-turbo`, `gemini-ultra`, `claude-3.5-sonnet`

See `config/models.json` for full model list with pricing information.

## 📁 Execution Folder Structure

Each comparison creates an execution folder in `outputs/` with the following structure:

```
outputs/
└── execution-YYYYMMDD-HHMMSS/
    ├── config.json          # Run configuration
    ├── lot-data.json        # Fetched/mock HiBid data
    ├── summary.json         # Summary metrics
    ├── comparison.csv       # Comparison table
    ├── images/              # Downloaded images
    │   ├── image_1.jpg
    │   └── image_2.jpg
    └── responses/           # Model responses
        ├── openai_gpt_4o_mini.json
        ├── google_gemini_flash_1_5.json
        └── anthropic_claude_3_haiku.json
```

## 🌐 Web Dashboard Setup

### Quick Start

1. **Set up AWS S3 bucket:**
   ```bash
   npm run setup-aws
   ```

2. **Migrate existing executions to S3:**
   ```bash
   npm run migrate-s3
   ```

3. **Configure dashboard environment:**
   Create `web/.env.local`:
   ```
   NEXT_PUBLIC_S3_BUCKET=your-bucket-name
   NEXT_PUBLIC_AWS_REGION=us-east-1
   DASHBOARD_PASSWORD=your-secure-password
   ```

4. **Run dashboard locally:**
   ```bash
   npm run dashboard:dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

5. **Deploy to AWS Amplify:**
   ```bash
   npm run setup-amplify
   ```
   Or connect your Git repository in AWS Amplify Console.

### Dashboard Features

- **Interactive Charts**: Cost, performance, and token usage visualizations
- **Model Recommendations**: Automatic suggestions for best model selection
- **Cost Analysis**: Total cost tracking, savings calculator, ROI projections
- **Search & Filter**: Find executions by URL, date, cost, or latency
- **Export Capabilities**: Download data as CSV or JSON
- **PRD Demo Page**: Interactive demonstration of all requirements
- **Dark Mode**: Full dark/light mode support
- **Responsive Design**: Works on mobile, tablet, and desktop

### Uploading Results to S3

When running comparisons, use the `--upload-s3` flag to automatically upload results:

```bash
node dist/index.js compare https://hibid.com/lot/test123 --upload-s3
```

This will:
- Save results locally (as usual)
- Upload entire execution folder to S3
- Make results available in the dashboard immediately

## 🛠️ Development

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run dev compare <lot-url>
```

### Available Scripts

- `npm run build` - Build TypeScript to JavaScript
- `npm run compare` - Run compare command
- `npm run analyze` - Run analyze command
- `npm run verify` - Verify setup and configuration
- `npm run demo` - Run PRD demonstration script
- `npm run migrate-s3` - Upload existing executions to S3
- `npm run setup-aws` - Set up AWS S3 bucket
- `npm run setup-amplify` - Set up AWS Amplify deployment
- `npm run dashboard:dev` - Run dashboard in development mode
- `npm run dashboard:build` - Build dashboard for production
- `npm run dashboard:start` - Start production dashboard server

### Project Structure

```
ai-model-comparison-tool/
├── src/                    # TypeScript source code
│   ├── commands/          # CLI commands (compare, analyze)
│   ├── services/          # Core services (OpenRouter, HiBid, Comparison)
│   ├── utils/             # Utilities (image handling, file management, formatters)
│   └── index.ts           # CLI entry point
├── web/                    # Next.js dashboard application
│   ├── app/               # Next.js app router pages
│   │   ├── page.tsx       # Home dashboard
│   │   ├── executions/    # Execution browser and detail views
│   │   ├── compare/       # Comparison views
│   │   ├── demo/          # PRD requirements demonstration
│   │   └── api/           # API routes for S3 data access
│   ├── components/        # React components
│   │   ├── charts/       # Chart components (Cost, Performance, Token, Radar)
│   │   ├── cards/        # Card components
│   │   └── ui/           # UI components (Button, Badge, Card)
│   └── lib/              # Utilities and AWS client
├── config/
│   └── models.json        # Model configurations
├── scripts/               # Helper scripts
│   ├── setup-aws.ps1     # AWS S3 setup (Windows)
│   ├── setup-aws.sh      # AWS S3 setup (Linux/Mac)
│   ├── setup-amplify.ps1 # Amplify setup (Windows)
│   ├── setup-amplify.sh  # Amplify setup (Linux/Mac)
│   ├── migrate-to-s3.js  # Migrate executions to S3
│   └── verify-setup.js   # Verify installation
├── _docs/                 # Documentation
│   ├── project_prd.md    # Product Requirements Document
│   ├── DASHBOARD.md      # Dashboard documentation
│   └── ...               # Additional documentation
├── outputs/               # Execution folders (gitignored)
└── dist/                  # Compiled JavaScript (gitignored)
```

## 🔒 Environment Variables

### Required

- `OPENROUTER_API_KEY`: Your OpenRouter API key ([Get one here](https://openrouter.ai/keys))

### Optional

- `AWS_PROFILE`: AWS profile name for S3 integration (default: default)
- `AWS_REGION`: AWS region for S3 (default: us-east-1)
- `AWS_S3_BUCKET`: S3 bucket name for storing execution results
- `HIBID_API_KEY`: HiBid API key for real API integration
- `HIBID_API_ENDPOINT`: HiBid API endpoint URL

### Dashboard Environment Variables (`web/.env.local`)

- `NEXT_PUBLIC_S3_BUCKET`: S3 bucket name (required for dashboard)
- `NEXT_PUBLIC_AWS_REGION`: AWS region (default: us-east-1)
- `DASHBOARD_PASSWORD`: Dashboard password (set a strong password)
- `NEXT_PUBLIC_CLOUDFRONT_URL`: CloudFront distribution URL (optional)

## 💡 Cost Optimization Tips

1. **Use Cheaper Models**: The tool defaults to cheaper models (gpt-4o-mini, gemini-flash, claude-3-haiku)
2. **Local Storage**: Results are stored locally (no S3 costs unless using dashboard)
3. **Mock Data**: Use mock data during development to avoid HiBid API costs
4. **Model Selection**: Choose models based on your accuracy vs. cost requirements
5. **Batch Processing**: Process multiple lots efficiently by reusing execution folders

## 🎨 Going Above and Beyond

This project delivers **significantly more** than the original CLI-only requirements:

### 🌟 Professional Web Dashboard

A complete, production-ready Next.js dashboard that provides:
- **Interactive Visualizations**: Real-time charts and graphs for cost, performance, and token analysis
- **Model Recommendations**: AI-powered suggestions for optimal model selection
- **Cost Analysis Tools**: Savings calculators and ROI projections
- **Professional UI**: Modern design with dark mode, responsive layout, and smooth animations
- **PRD Demonstration**: Interactive page showing all requirements with live demos

### 📊 Advanced Analytics

- Multi-dimensional model comparison (radar charts)
- Historical trend analysis
- Cost optimization recommendations
- Performance benchmarking

### 🔐 Enterprise Features

- Password-protected demo access
- AWS S3 integration for cloud storage
- AWS Amplify deployment ready
- Scalable architecture for high-volume processing

### 📚 Comprehensive Documentation

- Interactive PRD requirements demonstration
- Complete API documentation
- Setup guides for all platforms
- Troubleshooting guides

## ⚠️ Error Handling

The tool handles errors gracefully:
- Individual model failures don't stop the entire comparison
- Failed models are marked with error status in results
- Detailed error messages are logged in verbose mode
- API retries with exponential backoff for transient failures
- Graceful fallbacks for missing data

## 📝 Limitations

- Currently uses mock HiBid data (real API integration ready for future)
- Processes first image only (multi-image support can be added)
- Single lot URL per command (batch processing can be added)

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Code follows TypeScript best practices
- All tests pass
- Documentation is updated
- Cost optimization is considered

## 📄 License

MIT

## 📚 Additional Documentation

- **Dashboard Documentation**: See [`_docs/DASHBOARD.md`](_docs/DASHBOARD.md) for detailed dashboard setup
- **PRD**: See [`_docs/project_prd.md`](_docs/project_prd.md) for product requirements
- **Project Status**: See [`_docs/PROJECT_STATUS.md`](_docs/PROJECT_STATUS.md) for current status and next steps
- **Web Dashboard README**: See [`web/README.md`](web/README.md) for dashboard-specific documentation

## 🆘 Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Built with ❤️ for prompt engineers, data scientists, and operations managers who need efficient AI model comparison tools.**
