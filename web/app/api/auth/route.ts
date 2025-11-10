import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password } = await request.json();
  const correctPassword = process.env.DASHBOARD_PASSWORD || 'demo2024';

  if (password === correctPassword) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false }, { status: 401 });
}


