import { render, screen, fireEvent } from '@testing-library/react';
import { TimesheetTable } from './TimesheetTable';
import type { Timesheet } from '@/types';

const mockRows: Timesheet[] = [
  { id: 1, week: 1, dateRange: '1 - 5 January, 2024', weekStart: '2024-01-01T00:00:00.000Z', status: 'completed',  totalHours: 40 },
  { id: 2, week: 2, dateRange: '8 - 12 January, 2024', weekStart: '2024-01-08T00:00:00.000Z', status: 'incomplete', totalHours: 20 },
  { id: 3, week: 3, dateRange: '15 - 19 January, 2024', weekStart: '2024-01-15T00:00:00.000Z', status: 'missing',    totalHours: 0  },
];

describe('TimesheetTable', () => {
  it('renders all rows', () => {
    render(<TimesheetTable rows={mockRows} onAction={jest.fn()} />);
    expect(screen.getAllByText('1 - 5 January, 2024')[0]).toBeInTheDocument();
    expect(screen.getAllByText('8 - 12 January, 2024')[0]).toBeInTheDocument();
    expect(screen.getAllByText('15 - 19 January, 2024')[0]).toBeInTheDocument();
  });

  it('renders correct status badges', () => {
    render(<TimesheetTable rows={mockRows} onAction={jest.fn()} />);
    expect(screen.getAllByText('COMPLETED')[0]).toBeInTheDocument();
    expect(screen.getAllByText('INCOMPLETE')[0]).toBeInTheDocument();
    expect(screen.getAllByText('MISSING')[0]).toBeInTheDocument();
  });

  it('renders correct action labels per status', () => {
    render(<TimesheetTable rows={mockRows} onAction={jest.fn()} />);
    expect(screen.getAllByText('View')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Update')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Create')[0]).toBeInTheDocument();
  });

  it('calls onAction with the correct id when an action button is clicked', () => {
    const onAction = jest.fn();
    render(<TimesheetTable rows={mockRows} onAction={onAction} />);
    fireEvent.click(screen.getAllByText('View')[0]);
    expect(onAction).toHaveBeenCalledWith(1);
  });

  it('renders week numbers', () => {
    render(<TimesheetTable rows={mockRows} onAction={jest.fn()} />);
    expect(screen.getAllByText('1')[0]).toBeInTheDocument();
    expect(screen.getAllByText('2')[0]).toBeInTheDocument();
    expect(screen.getAllByText('3')[0]).toBeInTheDocument();
  });
});