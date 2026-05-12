import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { mockTimesheets, getMockDays } from '@/lib/mock-data';
import { WeekDetail } from '@/components/timesheets/WeekDetail';
import type { TimesheetDetail } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return mockTimesheets.slice(0, 10).map((ts) => ({ id: String(ts.id) }));
}

export default async function TimesheetDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { id: idStr } = await params;
  const id = parseInt(idStr);
  const ts = mockTimesheets.find((t) => t.id === id);
  if (!ts) notFound();

  const detail: TimesheetDetail = {
    ...ts,
    weekStart: ts.weekStart.toISOString(),
    days: getMockDays(id),
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-7">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <WeekDetail detail={detail} />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 mt-4 py-4">
        <p className="text-center text-xs text-gray-400">
          © 2024 tentwenty. All rights reserved.
        </p>
      </div>
    </div>
  );
}
