import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { ShellContext } from './ShellContext';

export default function AppShell() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <ShellContext.Provider value={{ navOpen, setNavOpen }}>
      <div className="bg-background text-on-background font-body-md antialiased min-h-screen flex">
        <Sidebar />
        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen min-w-0">
          <Navbar />
          <main className="flex-1 p-4 sm:p-stack-sm lg:p-gutter max-w-[1280px] mx-auto w-full space-y-stack-lg">
            <Outlet />
          </main>
          <footer className="bg-surface-container-lowest w-full py-6 mt-auto border-t border-outline-variant px-4 lg:px-gutter">
            <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <div className="font-headline-md text-primary text-xl">SCNA</div>
              <div className="text-sm text-on-surface-variant">
                © 2024 SCNA. Scientific Collaboration Network Analyzer. All Rights Reserved.
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                <a href="#privacy" className="text-sm text-on-surface-variant hover:text-primary">Privacy Policy</a>
                <a href="#terms" className="text-sm text-on-surface-variant hover:text-primary">Terms of Service</a>
                <a href="#api" className="text-sm text-on-surface-variant hover:text-primary">API Documentation</a>
                <a href="#support" className="text-sm text-on-surface-variant hover:text-primary">Contact Support</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </ShellContext.Provider>
  );
}
