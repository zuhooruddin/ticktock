import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { mockTimesheets } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page    = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const perPage = Math.min(100, parseInt(searchParams.get('perPage') ?? '5'));
  const status  = searchParams.get('status') ?? '';

  let list = mockTimesheets;
  if (status) list = list.filter((t) => t.status === status);

  const total = list.length;
  const pages = Math.ceil(total / perPage);
  const data  = list
    .slice((page - 1) * perPage, page * perPage)
    .map((ts) => ({ ...ts, weekStart: ts.weekStart.toISOString() }));

  return NextResponse.json({ data, total, page, perPage, pages });
}
