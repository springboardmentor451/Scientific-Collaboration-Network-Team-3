import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useShell } from './ShellContext';

export default function Navbar() {
  const { role, user } = useAuth();
  const { setNavOpen } = useShell();
  const title =
    role === 'System Admin'
      ? 'System Overview'
      : role === 'Institution Admin'
        ? 'Institution Console'
        : role === 'Reviewer'
          ? 'Review Workspace'
          : 'Research Workspace';

  return (
    <header className="bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant sticky top-0 z-30 px-4 lg:px-gutter h-16 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          className="lg:hidden text-on-surface-variant p-2 rounded-full hover:bg-surface-container"
          onClick={() => setNavOpen(true)}
          aria-label="Open navigation"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="min-w-0">
          <div className="lg:hidden font-black text-primary tracking-tight">SCNA</div>
          <h1 className="hidden lg:block font-headline-md text-primary truncate">{title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input
            className="pl-10 pr-4 py-2 rounded-full border border-outline-variant bg-surface text-on-surface text-sm focus:ring-[3px] focus:ring-primary/10 focus:border-primary outline-none w-48 lg:w-64"
            placeholder="Search..."
            type="search"
            aria-label="Search"
          />
        </div>
        <button type="button" className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container relative" aria-label="Notifications">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
        </button>
        <div className="hidden sm:flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              (user?.name || 'U').charAt(0)
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
