import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { mockTimesheets, getMockDays } from '@/lib/mock-data';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: idStr } = await params;
  const id = parseInt(idStr);
  const ts = mockTimesheets.find((t) => t.id === id);
  if (!ts) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    ...ts,
    weekStart: ts.weekStart.toISOString(),
    days: getMockDays(id),
  });
}
