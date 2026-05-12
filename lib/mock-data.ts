// ─────────────────────────────────────────────────────────────────────────────
// Mock data — treated as the data layer for all API routes.
// ─────────────────────────────────────────────────────────────────────────────

import type { TimesheetStatus, TimesheetEntry, TimesheetDay } from '@/types';

// ── Users ─────────────────────────────────────────────────────────────────────
export const MOCK_USERS = [
  { id: 1, name: 'John Doe', email: 'john@tentwenty.com', password: 'tentwenty@2026' },
];

// ── Reference data ────────────────────────────────────────────────────────────
export const PROJECTS = [
  'Homepage Redesign',
  'Mobile App',
  'Admin Dashboard',
  'API Gateway',
  'Design System',
];

export const WORK_TYPES = [
  'Development',
  'Design',
  'Bug Fixes',
  'Code Review',
  'Testing',
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function offsetDate(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

// ── Weekly timesheets (99 weeks starting 1-Jan-2024) ─────────────────────────
const BASE_DATE = new Date('2024-01-01');

const FORCED_STATUS: Record<number, TimesheetStatus> = {
  0: 'completed',
  1: 'completed',
  2: 'incomplete',
  3: 'completed',
  4: 'missing',
};
const STATUS_POOL: TimesheetStatus[] = ['completed', 'completed', 'incomplete', 'missing'];

export interface MockTimesheet {
  id: number;
  week: number;
  dateRange: string;
  weekStart: Date;
  status: TimesheetStatus;
  totalHours: number;
}

export const mockTimesheets: MockTimesheet[] = Array.from({ length: 99 }, (_, i) => {
  const ws = offsetDate(BASE_DATE, i * 7);
  const we = offsetDate(BASE_DATE, i * 7 + 4);
  const status: TimesheetStatus =
    FORCED_STATUS[i] ?? STATUS_POOL[i % STATUS_POOL.length];
  return {
    id: i + 1,
    week: i + 1,
    dateRange: `${ws.getDate()} - ${we.getDate()} ${we.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })}`,
    weekStart: ws,
    status,
    totalHours: status === 'missing' ? 0 : status === 'incomplete' ? 20 : 40,
  };
});

// ── Per-week daily entries ─────────────────────────────────────────────────────
export function getMockDays(timesheetId: number): TimesheetDay[] {
  const ts = mockTimesheets.find((t) => t.id === timesheetId);
  if (!ts) return [];

  return Array.from({ length: 5 }, (_, dayIdx) => {
    const date = offsetDate(ts.weekStart, dayIdx);
    const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const count =
      ts.status === 'missing'
        ? 0
        : ts.status === 'incomplete'
        ? dayIdx < 2 ? 2 : dayIdx === 2 ? 1 : 0
        : dayIdx < 4 ? 2 + (dayIdx % 2) : 0;

    const entries: TimesheetEntry[] = Array.from({ length: count }, (_, entryIdx) => ({
      id: timesheetId * 1000 + dayIdx * 10 + entryIdx,
      timesheetId,
      date: label,
      description: ['Homepage Development', 'API Integration', 'UI Components'][entryIdx % 3],
      project: PROJECTS[dayIdx % PROJECTS.length],
      workType: WORK_TYPES[entryIdx % WORK_TYPES.length],
      hours: 4,
    }));

    return { label, entries };
  });
}
