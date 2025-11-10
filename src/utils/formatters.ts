import Table from 'cli-table3';
import { ComparisonResult } from '../services/comparison';

/**
 * Format comparison results as a terminal table
 */
export function formatTable(results: ComparisonResult[]): string {
  const table = new Table({
    head: ['Model', 'Input Tokens', 'Output Tokens', 'Total Tokens', 'Cost ($)', 'Latency (ms)', 'Status'],
    colWidths: [30, 15, 15, 15, 12, 15, 10],
  });

  for (const result of results) {
    table.push([
      result.model,
      result.inputTokens?.toLocaleString() || 'N/A',
      result.outputTokens?.toLocaleString() || 'N/A',
      result.totalTokens?.toLocaleString() || 'N/A',
      result.cost?.toFixed(4) || 'N/A',
      result.latency?.toFixed(0) || 'N/A',
      result.error ? 'Error' : 'Success',
    ]);
  }

  return table.toString();
}

/**
 * Format comparison results as CSV
 */
export function formatCSV(results: ComparisonResult[]): string {
  if (results.length === 0) {
    return '';
  }

  const headers = ['Model', 'Input Tokens', 'Output Tokens', 'Total Tokens', 'Cost ($)', 'Latency (ms)', 'Status', 'Response Preview'];
  const rows = results.map(result => [
    result.model,
    result.inputTokens?.toString() || '',
    result.outputTokens?.toString() || '',
    result.totalTokens?.toString() || '',
    result.cost?.toFixed(4) || '',
    result.latency?.toFixed(0) || '',
    result.error ? 'Error' : 'Success',
    result.response ? result.response.substring(0, 100).replace(/"/g, '""') : '',
  ]);

  const csvRows = [
    headers.join(','),
    ...rows.map(row =>
      row.map(cell => {
        const str = String(cell);
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      }).join(',')
    ),
  ];

  return csvRows.join('\n');
}

/**
 * Format comparison results as JSON
 */
export function formatJSON(results: ComparisonResult[]): string {
  return JSON.stringify(results, null, 2);
}

/**
 * Format summary statistics
 */
export function formatSummary(results: ComparisonResult[]): string {
  const successful = results.filter(r => !r.error);
  const failed = results.filter(r => r.error);

  if (successful.length === 0) {
    return 'No successful comparisons.';
  }

  const totalCost = successful.reduce((sum, r) => sum + (r.cost || 0), 0);
  const totalTokens = successful.reduce((sum, r) => sum + (r.totalTokens || 0), 0);
  const avgLatency = successful.reduce((sum, r) => sum + (r.latency || 0), 0) / successful.length;

  const cheapest = successful.reduce((min, r) => 
    (r.cost || Infinity) < (min.cost || Infinity) ? r : min, successful[0]
  );

  const fastest = successful.reduce((min, r) => 
    (r.latency || Infinity) < (min.latency || Infinity) ? r : min, successful[0]
  );

  let summary = '\n=== Comparison Summary ===\n\n';
  summary += `Total Models: ${results.length}\n`;
  summary += `Successful: ${successful.length}\n`;
  summary += `Failed: ${failed.length}\n\n`;
  summary += `Total Cost: $${totalCost.toFixed(4)}\n`;
  summary += `Total Tokens: ${totalTokens.toLocaleString()}\n`;
  summary += `Average Latency: ${avgLatency.toFixed(0)}ms\n\n`;
  summary += `Cheapest Model: ${cheapest.model} ($${cheapest.cost?.toFixed(4)})\n`;
  summary += `Fastest Model: ${fastest.model} (${fastest.latency?.toFixed(0)}ms)\n`;

  if (failed.length > 0) {
    summary += '\nFailed Models:\n';
    for (const result of failed) {
      summary += `  - ${result.model}: ${result.error}\n`;
    }
  }

  return summary;
}


