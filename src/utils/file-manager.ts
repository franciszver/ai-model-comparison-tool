import * as fs from 'fs';
import * as path from 'path';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface ExecutionConfig {
  timestamp: string;
  lotUrl: string;
  models: string[];
  prompt: string;
  useMetadata: boolean;
  outputFormat: string;
}

/**
 * Create execution folder with timestamp
 */
export function createExecutionFolder(folderName?: string): string {
  const outputsDir = path.join(process.cwd(), 'outputs');
  if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const folder = folderName || `execution-${timestamp}`;
  const executionPath = path.join(outputsDir, folder);

  if (!fs.existsSync(executionPath)) {
    fs.mkdirSync(executionPath, { recursive: true });
    fs.mkdirSync(path.join(executionPath, 'images'), { recursive: true });
    fs.mkdirSync(path.join(executionPath, 'responses'), { recursive: true });
  }

  return executionPath;
}

/**
 * Save configuration to execution folder
 */
export function saveConfig(executionPath: string, config: ExecutionConfig): void {
  const configPath = path.join(executionPath, 'config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

/**
 * Save lot data to execution folder
 */
export function saveLotData(executionPath: string, lotData: any): void {
  const lotDataPath = path.join(executionPath, 'lot-data.json');
  fs.writeFileSync(lotDataPath, JSON.stringify(lotData, null, 2));
}

/**
 * Save model response to execution folder
 */
export function saveModelResponse(
  executionPath: string,
  modelName: string,
  response: any
): void {
  const responsesDir = path.join(executionPath, 'responses');
  const safeModelName = modelName.replace(/[^a-zA-Z0-9]/g, '_');
  const responsePath = path.join(responsesDir, `${safeModelName}.json`);
  fs.writeFileSync(responsePath, JSON.stringify(response, null, 2));
}

/**
 * Save comparison CSV
 */
export function saveComparisonCSV(executionPath: string, comparisonData: any[]): void {
  const csvPath = path.join(executionPath, 'comparison.csv');
  
  if (comparisonData.length === 0) {
    fs.writeFileSync(csvPath, '');
    return;
  }

  const headers = Object.keys(comparisonData[0]).join(',');
  const rows = comparisonData.map(row =>
    Object.values(row).map(val => {
      const str = String(val);
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    }).join(',')
  );

  fs.writeFileSync(csvPath, [headers, ...rows].join('\n'));
}

/**
 * Save summary JSON
 */
export function saveSummary(executionPath: string, summary: any): void {
  const summaryPath = path.join(executionPath, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
}

/**
 * Load execution folder data
 */
export function loadExecutionData(executionFolder: string): {
  config: ExecutionConfig;
  lotData: any;
  responses: Record<string, any>;
  summary: any;
} {
  const executionPath = path.join(process.cwd(), 'outputs', executionFolder);

  if (!fs.existsSync(executionPath)) {
    throw new Error(`Execution folder not found: ${executionFolder}`);
  }

  const configPath = path.join(executionPath, 'config.json');
  const lotDataPath = path.join(executionPath, 'lot-data.json');
  const summaryPath = path.join(executionPath, 'summary.json');
  const responsesDir = path.join(executionPath, 'responses');

  const config = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    : null;

  const lotData = fs.existsSync(lotDataPath)
    ? JSON.parse(fs.readFileSync(lotDataPath, 'utf-8'))
    : null;

  const summary = fs.existsSync(summaryPath)
    ? JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))
    : null;

  const responses: Record<string, any> = {};
  if (fs.existsSync(responsesDir)) {
    const files = fs.readdirSync(responsesDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const modelName = file.replace('.json', '');
        const responsePath = path.join(responsesDir, file);
        responses[modelName] = JSON.parse(fs.readFileSync(responsePath, 'utf-8'));
      }
    }
  }

  return { config, lotData, responses, summary };
}

/**
 * Upload execution folder to S3
 */
export async function uploadToS3(
  executionPath: string,
  folderName: string,
  onProgress?: (current: number, total: number) => void
): Promise<string> {
  const bucketName = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION || 'us-east-1';

  if (!bucketName) {
    throw new Error('AWS_S3_BUCKET environment variable is required for S3 upload');
  }

  const s3Client = new S3Client({
    region,
    // Credentials will be loaded from AWS profile or environment variables
  });

  // Get all files in the execution folder
  const files: string[] = [];
  function getAllFiles(dir: string, baseDir: string = dir): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      if (entry.isDirectory()) {
        getAllFiles(fullPath, baseDir);
      } else {
        files.push(relativePath);
      }
    }
  }

  getAllFiles(executionPath);

  let uploaded = 0;
  const total = files.length;

  // Upload each file
  for (const file of files) {
    const filePath = path.join(executionPath, file);
    const s3Key = `${folderName}/${file}`;
    const fileContent = fs.readFileSync(filePath);

    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: s3Key,
          Body: fileContent,
          ContentType: getContentType(file),
        })
      );

      uploaded++;
      if (onProgress) {
        onProgress(uploaded, total);
      }
    } catch (error) {
      console.error(`Error uploading ${file}:`, error);
      throw error;
    }
  }

  const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${folderName}/`;
  return s3Url;
}

/**
 * Get content type for file
 */
function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const types: Record<string, string> = {
    '.json': 'application/json',
    '.csv': 'text/csv',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };
  return types[ext] || 'application/octet-stream';
}

