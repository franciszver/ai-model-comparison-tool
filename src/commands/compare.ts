import { Command } from 'commander';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { OpenRouterService } from '../services/openrouter';
import { HiBidAPIService, LotData } from '../services/hibid-api';
import { ComparisonService } from '../services/comparison';
import { processImages } from '../utils/image-handler';
import {
  createExecutionFolder,
  saveConfig,
  saveLotData,
  saveModelResponse,
  saveComparisonCSV,
  saveSummary,
  uploadToS3,
  ExecutionConfig,
} from '../utils/file-manager';
import { formatTable, formatCSV, formatJSON, formatSummary } from '../utils/formatters';
import modelsConfig from '../../config/models.json';

// Load environment variables
dotenv.config();

// Default prompt template for image classification
const DEFAULT_PROMPT = `Analyze this image and provide a detailed classification. Include:
1. Primary category/type
2. Key characteristics and features
3. Condition assessment (if applicable)
4. Estimated value range (if applicable)
5. Any notable details or concerns

Be specific and thorough in your analysis.`;

export function createCompareCommand(): Command {
  const command = new Command('compare');

  command
    .description('Compare multiple AI models on a HiBid lot')
    .argument('<lot-url>', 'HiBid lot URL to analyze')
    .option('-m, --models <models>', 'Comma-separated list of models to compare', (val) => val.split(','))
    .option('-p, --prompt <prompt>', 'Custom prompt template', DEFAULT_PROMPT)
    .option('-o, --output <format>', 'Output format (table, csv, json)', 'table')
    .option('-f, --folder <folder>', 'Execution folder name (auto-generated if not provided)')
    .option('--use-metadata', 'Include title/description in prompt', false)
    .option('--upload-s3', 'Upload execution results to S3', false)
    .option('-v, --verbose', 'Verbose logging', false)
    .action(async (lotUrl: string, options) => {
      try {
        // Validate OpenRouter API key
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
          console.error('Error: OPENROUTER_API_KEY environment variable is required');
          console.error('Please set it in your .env file or environment');
          process.exit(1);
        }

        // Get models to compare
        let models: string[] = [];
        if (options.models && Array.isArray(options.models)) {
          models = options.models.map((m: string) => m.trim());
        } else {
          // Use default cheap models
          const defaultSet = modelsConfig.defaultSets.cheap;
          models = defaultSet || ['openai/gpt-4o-mini', 'google/gemini-flash-1.5', 'anthropic/claude-3-haiku'];
        }

        if (options.verbose) {
          console.log(`Comparing ${models.length} models: ${models.join(', ')}`);
          console.log(`Lot URL: ${lotUrl}`);
        }

        // Initialize services
        const openRouter = new OpenRouterService(apiKey);
        const hibidAPI = new HiBidAPIService(
          process.env.HIBID_API_KEY,
          process.env.HIBID_API_ENDPOINT
        );
        const comparisonService = new ComparisonService(openRouter);

        // Create execution folder
        const executionPath = createExecutionFolder(options.folder);
        if (options.verbose) {
          console.log(`Execution folder: ${executionPath}`);
        }

        // Fetch lot data
        console.log('Fetching lot data...');
        const lotData: LotData = await hibidAPI.fetchLotData(lotUrl);
        saveLotData(executionPath, lotData);

        if (options.verbose) {
          console.log(`Lot ID: ${lotData.lotId}`);
          console.log(`Title: ${lotData.title}`);
          console.log(`Images: ${lotData.images.length}`);
        }

        // Process images
        console.log('Processing images...');
        const processedImages = await processImages(lotData.images, executionPath);

        if (processedImages.length === 0) {
          console.warn('Warning: No images were successfully processed');
        }

        // Save execution config
        const config: ExecutionConfig = {
          timestamp: new Date().toISOString(),
          lotUrl,
          models,
          prompt: options.prompt || DEFAULT_PROMPT,
          useMetadata: options.useMetadata || false,
          outputFormat: options.output || 'table',
        };
        saveConfig(executionPath, config);

        // Run comparison
        console.log('Running model comparisons...');
        const results = await comparisonService.compare({
          models,
          prompt: options.prompt || DEFAULT_PROMPT,
          images: processedImages,
          useMetadata: options.useMetadata || false,
          title: lotData.title,
          description: lotData.description,
        });

        // Save individual model responses
        for (const result of results) {
          saveModelResponse(executionPath, result.model, result);
        }

        // Save comparison CSV
        const comparisonData = results.map(r => ({
          Model: r.model,
          'Input Tokens': r.inputTokens || 0,
          'Output Tokens': r.outputTokens || 0,
          'Total Tokens': r.totalTokens || 0,
          'Cost ($)': r.cost?.toFixed(4) || '0.0000',
          'Latency (ms)': r.latency?.toFixed(0) || '0',
          Status: r.error ? 'Error' : 'Success',
          'Response Preview': r.response ? r.response.substring(0, 200) : '',
        }));
        saveComparisonCSV(executionPath, comparisonData);

        // Generate summary
        const summary = {
          timestamp: config.timestamp,
          lotUrl,
          models: models.length,
          successful: results.filter(r => !r.error).length,
          failed: results.filter(r => r.error).length,
          totalCost: results.filter(r => !r.error).reduce((sum, r) => sum + (r.cost || 0), 0),
          totalTokens: results.filter(r => !r.error).reduce((sum, r) => sum + (r.totalTokens || 0), 0),
          avgLatency: results.filter(r => !r.error).reduce((sum, r) => sum + (r.latency || 0), 0) / results.filter(r => !r.error).length || 0,
        };
        saveSummary(executionPath, summary);

        // Display results
        console.log('\n=== Comparison Results ===\n');
        
        switch (options.output) {
          case 'csv':
            console.log(formatCSV(results));
            break;
          case 'json':
            console.log(formatJSON(results));
            break;
          case 'table':
          default:
            console.log(formatTable(results));
            break;
        }

        console.log(formatSummary(results));
        console.log(`\nResults saved to: ${executionPath}`);

        // Upload to S3 if requested
        if (options.uploadS3) {
          try {
            const folderName = path.basename(executionPath);
            console.log('\nUploading to S3...');
            
            const s3Url = await uploadToS3(executionPath, folderName, (current, total) => {
              const percent = Math.round((current / total) * 100);
              process.stdout.write(`\rUploading: ${current}/${total} files (${percent}%)`);
            });
            
            console.log(`\n✅ Upload complete!`);
            console.log(`S3 URL: ${s3Url}`);
            console.log(`Dashboard: View at your dashboard URL`);
          } catch (error) {
            console.error('\n⚠️  S3 upload failed:', error instanceof Error ? error.message : error);
            console.error('Results are still saved locally.');
          }
        }

      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        if (options.verbose && error instanceof Error) {
          console.error(error.stack);
        }
        process.exit(1);
      }
    });

  return command;
}

