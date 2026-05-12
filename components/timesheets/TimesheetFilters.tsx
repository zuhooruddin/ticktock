'use client';

interface TimesheetFiltersProps {
  status: string;
  onStatusChange: (v: string) => void;
}

export function TimesheetFilters({ status, onStatusChange }: TimesheetFiltersProps) {
  const selCls = 'px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <select className={`${selCls} w-full sm:w-auto`} defaultValue="">
        <option value="">Date Range ▾</option>
      </select>
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className={`${selCls} w-full sm:w-auto`}
      >
        <option value="">Status ▾</option>
        <option value="completed">Completed</option>
        <option value="incomplete">Incomplete</option>
        <option value="missing">Missing</option>
      </select>
    </div>
  );
}
