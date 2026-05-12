'use client';

import { useState } from 'react';
import { EntryModal } from './EntryModal';
import { createEntry, updateEntry, deleteEntry } from '@/lib/api-client';
import type { TimesheetDetail, TimesheetEntry, EntryFormData } from '@/types';

interface WeekDetailProps {
  detail: TimesheetDetail;
}

type ModalState =
  | { open: false }
  | { open: true; mode: 'add'; day: string }
  | { open: true; mode: 'edit'; day: string; entry: TimesheetEntry };

export function WeekDetail({ detail: initialDetail }: WeekDetailProps) {
  const [days, setDays]   = useState(initialDetail.days);
  const [modal, setModal] = useState<ModalState>({ open: false });
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const totalHours = days.reduce((s, d) => s + d.entries.reduce((es, e) => es + e.hours, 0), 0);
  const pct = Math.min(100, Math.round((totalHours / 40) * 100));

  // ── CRUD helpers ─────────────────────────────────────────────────────────────
  const handleSave = async (day: string, data: EntryFormData, entryId?: number) => {
    if (entryId) {
      await updateEntry(entryId, data);
      setDays((prev) =>
        prev.map((d) =>
          d.label !== day
            ? d
            : { ...d, entries: d.entries.map((e) => (e.id === entryId ? { ...e, ...data } : e)) }
        )
      );
    } else {
      await createEntry(initialDetail.id, day, data);
      setDays((prev) =>
        prev.map((d) =>
          d.label !== day
            ? d
            : { ...d, entries: [...d.entries, { id: Date.now(), timesheetId: initialDetail.id, date: day, ...data }] }
        )
      );
    }
    setModal({ open: false });
  };

  const handleDelete = async (day: string, entryId: number) => {
    await deleteEntry(entryId);
    setDays((prev) =>
      prev.map((d) =>
        d.label !== day ? d : { ...d, entries: d.entries.filter((e) => e.id !== entryId) }
      )
    );
    setOpenMenuId(null);
  };

  return (
    <div className="relative" onClick={() => setOpenMenuId(null)}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900">This week's timesheet</h1>
          <p className="text-xs text-gray-400 mt-1">{initialDetail.dateRange}</p>
        </div>

        <div className="w-52 shrink-0">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span className="font-medium text-gray-700">{totalHours}/40 hrs</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-orange-400 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Daily groups ───────────────────────────────────────────── */}
      {days.map((day) => (
        <div key={day.label} className="mb-5">
          <p className="text-sm font-semibold text-gray-700 mb-2">{day.label}</p>

          {day.entries.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-white border border-gray-100 rounded-lg mb-2"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="min-w-0 text-sm font-medium text-gray-900">{entry.description}</span>

              <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                <span className="text-xs text-gray-500 whitespace-nowrap">{entry.hours} hrs</span>
                <span className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-sky-700 whitespace-nowrap">
                  {entry.project}
                </span>
                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === entry.id ? null : entry.id)}
                    className="text-gray-400 hover:text-gray-600 text-base px-2 py-1 rounded-full transition-colors"
                    aria-label="Entry options"
                  >
                    ···
                  </button>
                  {openMenuId === entry.id && (
                    <div className="absolute right-0 top-8 z-30 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden min-w-[100px]">
                      <button
                        onClick={() => { setModal({ open: true, mode: 'edit', day: day.label, entry }); setOpenMenuId(null); }}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(day.label, entry.id)}
                        className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => setModal({ open: true, mode: 'add', day: day.label })}
            className="w-full px-4 py-2.5 border border-dashed border-blue-300 rounded-lg text-sm font-medium text-blue-500 text-center bg-white hover:bg-blue-50 transition-colors"
          >
            + Add new task
          </button>
        </div>
      ))}

      {/* ── Modal ──────────────────────────────────────────────────── */}
      {modal.open && (
        <EntryModal
          mode={modal.mode}
          day={modal.day}
          entry={modal.mode === 'edit' ? modal.entry : undefined}
          onSave={handleSave}
          onClose={() => setModal({ open: false })}
        />
      )}
    </div>
  );
}
