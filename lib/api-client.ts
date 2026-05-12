// Client-side helpers — components call these which hit internal Next.js API routes.
// This keeps all data-fetching logic in one place and away from components.

import type {
  Timesheet,
  TimesheetDetail,
  PaginatedResponse,
  EntryFormData,
} from '@/types';

const BASE = '/api';

// ── Timesheets ────────────────────────────────────────────────────────────────

export async function fetchTimesheets(params: {
  page?: number;
  perPage?: number;
  status?: string;
} = {}): Promise<PaginatedResponse<Timesheet>> {
  const qs = new URLSearchParams({
    page: String(params.page ?? 1),
    perPage: String(params.perPage ?? 5),
    ...(params.status ? { status: params.status } : {}),
  });
  const res = await fetch(`${BASE}/timesheets?${qs}`);
  if (!res.ok) throw new Error('Failed to fetch timesheets');
  return res.json();
}

export async function fetchTimesheetDetail(id: number): Promise<TimesheetDetail> {
  const res = await fetch(`${BASE}/timesheets/${id}`);
  if (!res.ok) throw new Error('Failed to fetch timesheet');
  return res.json();
}

// ── Entries ───────────────────────────────────────────────────────────────────

export async function createEntry(
  timesheetId: number,
  day: string,
  data: EntryFormData
): Promise<void> {
  const res = await fetch(`${BASE}/timesheets/${timesheetId}/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, date: day }),
  });
  if (!res.ok) throw new Error('Failed to create entry');
}

export async function updateEntry(entryId: number, data: EntryFormData): Promise<void> {
  const res = await fetch(`${BASE}/entries/${entryId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update entry');
}

export async function deleteEntry(entryId: number): Promise<void> {
  const res = await fetch(`${BASE}/entries/${entryId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete entry');
}
