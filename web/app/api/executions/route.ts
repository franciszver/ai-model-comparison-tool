import { NextResponse } from 'next/server';
import { listExecutions } from '@/lib/aws';

export async function GET() {
  try {
    const executions = await listExecutions();
    return NextResponse.json(executions);
  } catch (error: any) {
    console.error('Error fetching executions:', error);
    // Return empty array instead of error object to prevent frontend crashes
    // Log the actual error for debugging
    console.error('Error details:', {
      message: error?.message,
      code: error?.Code,
      bucket: process.env.NEXT_PUBLIC_S3_BUCKET || process.env.AWS_S3_BUCKET,
      region: process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION,
      hasCredentials: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
    });
    return NextResponse.json([]); // Return empty array so frontend doesn't crash
  }
}


