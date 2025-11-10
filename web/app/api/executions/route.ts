import { NextResponse } from 'next/server';
import { listExecutions } from '@/lib/aws';

export async function GET() {
  try {
    const executions = await listExecutions();
    return NextResponse.json(executions);
  } catch (error) {
    console.error('Error fetching executions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch executions' },
      { status: 500 }
    );
  }
}


