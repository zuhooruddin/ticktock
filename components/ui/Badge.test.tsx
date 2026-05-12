import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders COMPLETED', () => {
    render(<Badge status="completed" />);
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
  });

  it('renders INCOMPLETE', () => {
    render(<Badge status="incomplete" />);
    expect(screen.getByText('INCOMPLETE')).toBeInTheDocument();
  });

  it('renders MISSING', () => {
    render(<Badge status="missing" />);
    expect(screen.getByText('MISSING')).toBeInTheDocument();
  });

  it('applies correct colour class for completed', () => {
    const { container } = render(<Badge status="completed" />);
    expect(container.firstChild).toHaveClass('bg-green-100');
    expect(container.firstChild).toHaveClass('text-green-700');
  });

  it('applies correct colour class for missing', () => {
    const { container } = render(<Badge status="missing" />);
  expect(container.firstChild).toHaveClass('bg-red-100');
  });
});
