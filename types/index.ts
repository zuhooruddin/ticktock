export type TimesheetStatus = 'completed' | 'incomplete' | 'missing';

export interface Timesheet {
  id: number;
  week: number;
  dateRange: string;
  weekStart: string;
  status: TimesheetStatus;
  totalHours: number;
}

export interface TimesheetEntry {
  id: number;
  timesheetId: number;
  date: string;
  description: string;
  project: string;
  workType: string;
  hours: number;
}

export interface TimesheetDay {
  label: string;
  entries: TimesheetEntry[];
}

export interface TimesheetDetail extends Timesheet {
  days: TimesheetDay[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  pages: number;
}

export interface EntryFormData {
  project: string;
  workType: string;
  description: string;
  hours: number;
}

export interface ApiError {
  error: string;
  status?: number;
}
