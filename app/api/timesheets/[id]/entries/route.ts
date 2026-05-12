import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: idStr } = await params;
  const body = await request.json();
  const { project, workType, description, hours, date } = body;

  if (!project || !workType || !description || !hours || !date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  return NextResponse.json(
    { id: Date.now(), timesheetId: parseInt(idStr), date, description, project, workType, hours: Number(hours) },
    { status: 201 }
  );
}
