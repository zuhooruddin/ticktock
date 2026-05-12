'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TimesheetTable }   from '@/components/timesheets/TimesheetTable';
import { TimesheetFilters } from '@/components/timesheets/TimesheetFilters';
import { Spinner }          from '@/components/ui/Spinner';
import { fetchTimesheets }  from '@/lib/api-client';
import type { Timesheet, PaginatedResponse } from '@/types';

export default function TimesheetsPage() {
  const router = useRouter();

  const [result,  setResult]  = useState<PaginatedResponse<Timesheet> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [page,    setPage]    = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [status,  setStatus]  = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTimesheets({ page, perPage, status });
      setResult(data);
    } catch {
      setError('Failed to load timesheets. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, perPage, status]);

  useEffect(() => { load(); }, [load]);

  // Reset to page 1 when filters change
  const handleStatusChange = (v: string) => { setStatus(v); setPage(1); };
  const handlePerPageChange = (v: number) => { setPerPage(v); setPage(1); };

  // Pagination numbers
  const pages = result?.pages ?? 1;
  const getPaginationItems = (): (number | '…')[] => {
    if (pages <= 10) return Array.from({ length: pages }, (_, i) => i + 1);
    // Near the start: show 1-8 … last
    if (page <= 6) {
      return [...Array.from({ length: 8 }, (_, i) => i + 1), '…', pages];
    }
    // Near the end: show 1 … last-7 to last
    if (page >= pages - 5) {
      return [1, '…', ...Array.from({ length: 8 }, (_, i) => pages - 7 + i)];
    }
    // Middle
    return [1, '…', page - 2, page - 1, page, page + 1, page + 2, '…', pages];
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-7">
      <div className="bg-white rounded-xl border border-gray-200">
        {/* ── Heading + Filters ─────────────────────────────────── */}
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Your Timesheets</h1>
          <TimesheetFilters status={status} onStatusChange={handleStatusChange} />
        </div>

        {/* ── Table ─────────────────────────────────────────────── */}
        {error ? (
          <div className="px-6 py-8 text-center text-sm text-red-500">{error}</div>
        ) : loading ? (
          <Spinner />
        ) : (
          <TimesheetTable rows={result?.data ?? []} onAction={(id) => router.push(`/timesheets/${id}`)} />
        )}

        {/* ── Pagination ────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 gap-3">
          {/* Per-page selector */}
          <select
            value={perPage}
            onChange={(e) => handlePerPageChange(Number(e.target.value))}
            className="px-3 py-1.5 border border-gray-200 rounded-md text-xs text-gray-600 bg-white cursor-pointer shrink-0"
          >
            {[5, 10, 25].map((n) => (
              <option key={n} value={n}>{n} per page ▾</option>
            ))}
          </select>

          {/* Full page buttons — desktop only */}
          <div className="hidden sm:flex items-center gap-1">
            <PageBtn disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</PageBtn>
            {getPaginationItems().map((item, i) => (
              <PageBtn
                key={i}
                active={item === page}
                dim={item === '…'}
                onClick={() => typeof item === 'number' && setPage(item)}
              >
                {item}
              </PageBtn>
            ))}
            <PageBtn disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</PageBtn>
          </div>

          {/* Compact pagination — mobile only */}
          <div className="flex sm:hidden items-center gap-2">
            <PageBtn disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹ Prev</PageBtn>
            <span className="text-xs text-gray-600 whitespace-nowrap">{page} / {pages}</span>
            <PageBtn disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next ›</PageBtn>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white rounded-xl border border-gray-200 mt-4 py-4">
        <p className="text-center text-xs text-gray-400">
          © 2024 tentwenty. All rights reserved.
        </p>
      </div>
    </div>
  );
}

// ── Helper: pagination button ─────────────────────────────────────────────────
function PageBtn({
  children, onClick, active, disabled, dim,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  dim?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || dim}
      className={[
        'min-w-[1.5rem] px-1.5 py-1 rounded text-xs transition-colors',
        active
          ? 'bg-blue-600 text-white font-semibold'
          : disabled
          ? 'text-gray-300 cursor-default'
          : dim
          ? 'text-gray-400 cursor-default'
          : 'text-gray-600 hover:bg-gray-100',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
