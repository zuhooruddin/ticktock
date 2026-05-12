'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

interface NavbarProps {
  user: { name?: string | null; email?: string | null };
}

export function Navbar({ user }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user.name?.charAt(0).toUpperCase() ?? 'U';

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex flex-wrap items-center px-5 gap-4 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <Link href="/timesheets" className="text-[17px] font-bold text-gray-900 hover:opacity-80">
          ticktock
        </Link>
        <span className="text-sm font-medium text-gray-800">Timesheets</span>
      </div>

      <div className="flex-1" />

      {/* User menu */}
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-700
                     hover:text-gray-900 focus:outline-none px-2 py-1 rounded-md
                     hover:bg-gray-50 transition-colors"
        >
          {user.name} <span className="text-gray-500 text-xs">▾</span>
        </button>

        {open && (
          <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200
                          rounded-lg shadow-lg py-1 z-50">
            <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-100">
              {user.email}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full text-left px-3 py-2 text-sm text-gray-700
                         hover:bg-gray-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
