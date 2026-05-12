import type { Metadata } from 'next';
import { Providers } from './providers';
// @ts-expect-error - CSS import
import './globals.css';

export const metadata: Metadata = {
  title: 'Ticktock | Timesheet Management',
  description: 'Track and manage employee work hours with ticktock.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{<Providers>{children}</Providers>}</body>
    </html>
  );
}
