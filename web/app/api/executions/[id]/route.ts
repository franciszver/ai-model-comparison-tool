import { NextResponse } from 'next/server';
import { getExecutionData } from '@/lib/aws';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const executionData = await getExecutionData(id);
    return NextResponse.json(executionData);
  } catch (error) {
    console.error('Error fetching execution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch execution' },
      { status: 500 }
    );
  }
}


