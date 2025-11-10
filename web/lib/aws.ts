import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { ExecutionData, ExecutionListItem } from './types';

// Initialize S3 client with AWS profile
// In Next.js API routes, credentials are loaded from environment or AWS profile
const s3Client = new S3Client({
  region: process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  // Credentials will be loaded from AWS profile or environment variables automatically
});

const BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET || process.env.AWS_S3_BUCKET || '';

/**
 * List all execution folders from S3
 */
export async function listExecutions(): Promise<ExecutionListItem[]> {
  if (!BUCKET_NAME) {
    throw new Error('S3 bucket name not configured');
  }

  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Delimiter: '/',
    });

    const response = await s3Client.send(command);
    const executions: ExecutionListItem[] = [];

    if (response.CommonPrefixes) {
      for (const prefix of response.CommonPrefixes) {
        const folderName = prefix.Prefix?.replace('/', '') || '';
        if (folderName.startsWith('execution-')) {
          try {
            const executionData = await getExecutionData(folderName);
            executions.push({
              folderName,
              timestamp: executionData.config.timestamp,
              lotUrl: executionData.config.lotUrl,
              models: executionData.config.models.length,
              totalCost: executionData.summary.totalCost,
              avgLatency: executionData.summary.avgLatency,
              successful: executionData.summary.successful,
            });
          } catch (error) {
            console.error(`Error loading execution ${folderName}:`, error);
          }
        }
      }
    }

    // Sort by timestamp (newest first)
    return executions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error('Error listing executions:', error);
    throw error;
  }
}

/**
 * Get execution data from S3
 */
export async function getExecutionData(folderName: string): Promise<ExecutionData> {
  if (!BUCKET_NAME) {
    throw new Error('S3 bucket name not configured');
  }

  try {
    // Load config.json
    const configResponse = await s3Client.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `${folderName}/config.json`,
      })
    );
    const config = JSON.parse(await streamToString(configResponse.Body as any));

    // Load lot-data.json
    const lotDataResponse = await s3Client.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `${folderName}/lot-data.json`,
      })
    );
    const lotData = JSON.parse(await streamToString(lotDataResponse.Body as any));

    // Load summary.json
    const summaryResponse = await s3Client.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `${folderName}/summary.json`,
      })
    );
    const summary = JSON.parse(await streamToString(summaryResponse.Body as any));

    // Load all model responses
    const responsesList = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: `${folderName}/responses/`,
      })
    );

    const responses: Record<string, any> = {};
    if (responsesList.Contents) {
      for (const object of responsesList.Contents) {
        if (object.Key?.endsWith('.json')) {
          const responseData = await s3Client.send(
            new GetObjectCommand({
              Bucket: BUCKET_NAME,
              Key: object.Key,
            })
          );
          const modelName = object.Key.split('/').pop()?.replace('.json', '') || '';
          responses[modelName] = JSON.parse(await streamToString(responseData.Body as any));
        }
      }
    }

    return {
      config,
      lotData,
      responses,
      summary,
    };
  } catch (error) {
    console.error(`Error loading execution ${folderName}:`, error);
    throw error;
  }
}

/**
 * Get image URL from S3 (via CloudFront or direct S3)
 */
export function getExecutionImageUrl(folderName: string, imageName: string): string {
  if (!BUCKET_NAME) {
    return '';
  }

  // If CloudFront is configured, use that, otherwise use S3 direct URL
  const cloudFrontUrl = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
  if (cloudFrontUrl) {
    return `${cloudFrontUrl}/${folderName}/images/${imageName}`;
  }

  // Direct S3 URL (requires public access or signed URL)
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${folderName}/images/${imageName}`;
}

/**
 * Helper to convert stream to string
 */
async function streamToString(stream: any): Promise<string> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

