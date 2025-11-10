<!-- 1faec4ba-e929-4933-aca5-88929ef78a0b 5652fff0-7925-4b7e-84b6-30cf987b2390 -->
# AI Model Comparison Tool - Implementation Plan

## Architecture Decisions (Cost-Optimized)

- **OpenRouter API**: Unified interface for all models (OpenAI, Gemini, Claude)
- **Local filesystem**: No S3 costs initially (AWS profile ready for future)
- **Mock HiBid data**: No API costs during development
- **Vision models**: Support image classification via OpenRouter vision APIs
- **Cheaper models**: Use gpt-4o-mini, gemini-flash, claude-3-haiku for testing
- **TypeScript + Node.js**: Modern, maintainable CLI tool

## Project Structure

```
ai-model-comparison-tool/
├── src/
│   ├── commands/
│   │   ├── compare.ts          # Main comparison command
│   │   └── analyze.ts           # Analyze previous results
│   ├── services/
│   │   ├── hibid-api.ts         # HiBid API client (mock initially)
│   │   ├── openrouter.ts        # OpenRouter API client
│   │   └── comparison.ts        # Comparison logic & metrics
│   ├── utils/
│   │   ├── file-manager.ts      # Execution folder management
│   │   ├── formatters.ts        # Table/CSV/JSON formatting
│   │   └── image-handler.ts     # Image download & processing
│   └── index.ts                 # CLI entry point
├── config/
│   └── models.json              # Model configurations
├── outputs/                     # Execution folders (gitignored)
├── .env.example                 # Environment variable template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Implementation Steps

### 1. Project Setup

- Initialize Node.js project with TypeScript
- Install dependencies: commander, axios, cli-table3, dotenv, @aws-sdk/client-s3 (for future)
- Configure TypeScript and ESLint
- Set up .env.example with OpenRouter key template
- Configure package.json bin entry: `ai-model-compare` as CLI command name
- Create default image classification prompt template (overridable via --prompt)

### 2. Core Services

**OpenRouter Service** (`src/services/openrouter.ts`)

- Unified API client for all models
- Support vision models (image + text prompts)
- Track: input tokens, output tokens, cost, latency
- Handle rate limiting and retries
- Use cheaper models by default (configurable)

**HiBid API Service** (`src/services/hibid-api.ts`)

- Mock data generator initially (no API costs)
- Parse HiBid lot URLs
- Fetch lot data structure (images, titles, descriptions)
- Cache responses locally
- Ready for real API integration later

**Comparison Service** (`src/services/comparison.ts`)

- Run same prompt across multiple models in parallel
- Collect metrics: tokens, cost, latency, response
- Generate comparison data structure
- Export to multiple formats

### 3. CLI Commands

**Compare Command** (`src/commands/compare.ts`)

```bash
npm run compare <lot-url> [options]
```

- `--models`: Comma-separated model list (default: cheaper models)
- `--prompt`: Custom prompt template
- `--output`: Format (table, csv, json) - default: table
- `--folder`: Execution folder name (auto-generated if not provided)
- `--use-metadata`: Include title/description in prompt

**Analyze Command** (`src/commands/analyze.ts`)

```bash
npm run analyze <execution-folder>
```

- Load previous execution results
- Generate comparison reports
- Show cost breakdown and statistics

### 4. Features

**Image Processing** (`src/utils/image-handler.ts`)

- Download images from URLs (HiBid or mock)
- Convert to base64 for OpenRouter vision API
- Handle multiple images per lot
- Cache images locally in execution folder

**Execution Folders** (`src/utils/file-manager.ts`)

- Create timestamped folders: `outputs/execution-YYYYMMDD-HHMMSS/`
- Structure:
  - `config.json`: Run configuration
  - `lot-data.json`: Fetched/mock HiBid data
  - `images/`: Downloaded images
  - `responses/`: Model responses (JSON per model)
  - `comparison.csv`: Comparison table
  - `summary.json`: Aggregated metrics

**Output Formatting** (`src/utils/formatters.ts`)

- Terminal table (cli-table3) - primary output
- CSV export for analysis
- JSON export for programmatic use

### 5. Configuration

**Models Config** (`config/models.json`)

- Model definitions with pricing (for cost calculation)
- Default model sets (cheap, standard, premium)
- Vision capability flags

**Environment Variables** (`.env`)

- `OPENROUTER_API_KEY`: Required
- `AWS_PROFILE`: Optional (for future S3 integration)
- `HIBID_API_KEY`: Optional (for future real API)

### 6. Error Handling & Logging

- Graceful error handling per model (continue if one fails)
- Progress indicators for long-running comparisons
- Verbose logging option (`--verbose`)
- Timeout management (configurable per model)

### 7. Testing & Documentation

- README with installation and usage examples
- Sample mock data for testing
- Error scenarios documented
- Cost estimation examples

## Cost Optimization Features

- Use cheaper models by default (gpt-4o-mini, gemini-flash, claude-3-haiku)
- Local filesystem only (no S3 storage costs)
- Mock data initially (no HiBid API costs)
- Configurable model selection (users can choose cheaper models)
- Cost tracking and reporting in comparison output

## Future AWS Integration (Not in MVP)

- S3 upload option for execution folders (optional flag)
- AWS credentials via profile (already configured)
- Cost tracking in AWS Cost Explorer (future enhancement)

### To-dos

- [x] Initialize Node.js project with TypeScript, install dependencies (commander, axios, cli-table3, dotenv), configure tsconfig.json and .gitignore
- [x] Implement OpenRouter API service with vision model support, token tracking, cost calculation, and retry logic
- [x] Create HiBid API service with mock data generator, URL parsing, and local caching (ready for real API later)
- [x] Build comparison service to run prompts across multiple models in parallel and collect metrics
- [x] Implement image download, base64 conversion, and caching utilities for vision models
- [x] Create execution folder management with structured output (config, images, responses, comparison files)
- [x] Implement table, CSV, and JSON output formatters for comparison results
- [x] Build main compare CLI command with options for models, prompts, output format, and execution folder
- [x] Create analyze command to load and report on previous execution results
- [x] Create models.json configuration with model definitions, pricing, and default model sets
- [x] Create .env.example with OpenRouter API key template and documentation
- [x] Write comprehensive README with installation, usage examples, and cost optimization tips