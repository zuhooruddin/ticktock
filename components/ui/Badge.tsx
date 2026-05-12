import type { TimesheetStatus } from '@/types';

const CONFIG: Record<TimesheetStatus, { bg: string; text: string; label: string }> = {
  completed: { bg: 'bg-green-100',  text: 'text-green-700',  label: 'COMPLETED'  },
  incomplete: { bg: 'bg-orange-100', text: 'text-orange-600', label: 'INCOMPLETE' },
  missing:    { bg: 'bg-red-100',    text: 'text-red-600',    label: 'MISSING'    },
};

export function Badge({ status }: { status: TimesheetStatus }) {
  const { bg, text, label } = CONFIG[status] ?? CONFIG.missing;
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider ${bg} ${text}`}>
      {label}
    </span>
  );
}
