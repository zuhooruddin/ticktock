'use client';

import { Badge } from '@/components/ui/Badge';
import type { Timesheet } from '@/types';

const ACTION_LABEL: Record<string, { label: string; color: string }> = {
  completed: { label: 'View',   color: 'text-blue-600' },
  incomplete: { label: 'Update', color: 'text-blue-600' },
  missing:    { label: 'Create', color: 'text-blue-600' },
};

interface TimesheetTableProps {
  rows: Timesheet[];
  onAction: (id: number) => void;
}

export function TimesheetTable({ rows, onAction }: TimesheetTableProps) {
  return (
    <div className="w-full">
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-[600px] w-full border-collapse">
          <thead>
            <tr className="border-t border-b border-gray-200">
              {['WEEK #', 'DATE', 'STATUS', 'ACTIONS'].map((h, i) => (
                <th
                  key={h}
                  className={`py-2.5 px-6 text-[11px] font-semibold tracking-wider text-gray-400
                              ${i === 3 ? 'text-right' : 'text-left'}`}
                >
                  {h}{i < 3 ? ' ↓' : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((ts) => {
              const action = ACTION_LABEL[ts.status] ?? ACTION_LABEL.missing;
              return (
                <tr key={ts.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm text-gray-900 font-medium">{ts.week}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{ts.dateRange}</td>
                  <td className="py-4 px-6"><Badge status={ts.status} /></td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => onAction(ts.id)}
                      className={`text-sm font-semibold ${action.color} hover:opacity-70 transition-opacity`}
                    >
                      {action.label}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 sm:hidden">
        {rows.map((ts) => {
          const action = ACTION_LABEL[ts.status] ?? ACTION_LABEL.missing;
          return (
            <div key={ts.id} className="bg-white border border-gray-200 rounded-3xl p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.2em]">Week</p>
                  <p className="text-sm font-semibold text-gray-900">{ts.week}</p>
                </div>
                <div className="min-w-0 text-right">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.2em]">Date</p>
                  <p className="text-sm text-gray-600">{ts.dateRange}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <Badge status={ts.status} />
                <button
                  onClick={() => onAction(ts.id)}
                  className={`text-sm font-semibold ${action.color} hover:opacity-70 transition-opacity`}
                >
                  {action.label}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
