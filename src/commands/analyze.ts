import { Command } from 'commander';
import { loadExecutionData } from '../utils/file-manager';
import { formatTable, formatCSV, formatJSON, formatSummary } from '../utils/formatters';
import { ComparisonResult } from '../services/comparison';

export function createAnalyzeCommand(): Command {
  const command = new Command('analyze');

  command
    .description('Analyze previous execution results')
    .argument('<execution-folder>', 'Execution folder name (from outputs directory)')
    .option('-o, --output <format>', 'Output format (table, csv, json)', 'table')
    .option('-v, --verbose', 'Verbose logging', false)
    .action(async (executionFolder: string, options) => {
      try {
        // Load execution data
        const { config, lotData, responses, summary } = loadExecutionData(executionFolder);

        if (options.verbose) {
          console.log('Loaded execution data:');
          console.log(`  Config: ${config ? 'Yes' : 'No'}`);
          console.log(`  Lot Data: ${lotData ? 'Yes' : 'No'}`);
          console.log(`  Responses: ${Object.keys(responses).length} models`);
          console.log(`  Summary: ${summary ? 'Yes' : 'No'}`);
        }

        // Convert responses to comparison results format
        const results: ComparisonResult[] = Object.entries(responses).map(([model, data]: [string, any]) => ({
          model: data.model || model,
          response: data.response || '',
          inputTokens: data.inputTokens,
          outputTokens: data.outputTokens,
          totalTokens: data.totalTokens,
          cost: data.cost,
          latency: data.latency,
          error: data.error,
        }));

        if (results.length === 0) {
          console.error('No comparison results found in execution folder');
          process.exit(1);
        }

        // Display config info
        if (config) {
          console.log('\n=== Execution Configuration ===');
          console.log(`Timestamp: ${config.timestamp}`);
          console.log(`Lot URL: ${config.lotUrl}`);
          console.log(`Models: ${config.models.join(', ')}`);
          console.log(`Prompt: ${config.prompt.substring(0, 100)}...`);
          console.log(`Use Metadata: ${config.useMetadata}`);
        }

        // Display lot data info
        if (lotData) {
          console.log('\n=== Lot Data ===');
          console.log(`Lot ID: ${lotData.lotId}`);
          console.log(`Title: ${lotData.title}`);
          console.log(`Description: ${lotData.description.substring(0, 100)}...`);
          console.log(`Images: ${lotData.images?.length || 0}`);
        }

        // Display results
        console.log('\n=== Comparison Results ===\n');
        
        const outputFormat = options.output || (config?.outputFormat || 'table');
        switch (outputFormat) {
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

        // Display summary
        if (summary) {
          console.log('\n=== Summary ===');
          console.log(`Total Models: ${summary.models || results.length}`);
          console.log(`Successful: ${summary.successful || results.filter(r => !r.error).length}`);
          console.log(`Failed: ${summary.failed || results.filter(r => r.error).length}`);
          console.log(`Total Cost: $${(summary.totalCost || 0).toFixed(4)}`);
          console.log(`Total Tokens: ${(summary.totalTokens || 0).toLocaleString()}`);
          console.log(`Average Latency: ${(summary.avgLatency || 0).toFixed(0)}ms`);
        } else {
          console.log(formatSummary(results));
        }

        // Display individual responses if verbose
        if (options.verbose) {
          console.log('\n=== Model Responses ===\n');
          for (const result of results) {
            if (!result.error) {
              console.log(`\n--- ${result.model} ---`);
              console.log(result.response.substring(0, 500));
              if (result.response.length > 500) {
                console.log('... (truncated)');
              }
            }
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


