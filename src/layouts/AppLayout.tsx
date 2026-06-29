import React from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '../utils';
import { useAppStore } from '../store';
import { Sidebar } from '../components/navigation/Sidebar';
import { Topbar } from '../components/navigation/Topbar';
import { CommandPalette } from '../components/navigation/CommandPalette';
import { Breadcrumb } from '../components/Breadcrumb';
import { SkipToContent } from '../components/SkipToContent';
import { useKeyboardShortcuts } from '../components/KeyboardShortcuts';

export function AppLayout() {
  const { sidebarCollapsed } = useAppStore();
  useKeyboardShortcuts();

  return (
    <>
      <SkipToContent />
      <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-surface-950">
      <Sidebar />
      <div
        className={cn(
          'flex flex-col flex-1 min-w-0 transition-all duration-300',
          sidebarCollapsed ? 'ml-[68px]' : 'ml-[260px]'
        )}
      >
        <Topbar />
        <main id="main-content" className="flex-1 overflow-y-auto overflow-x-hidden mt-[60px]">
          <Breadcrumb />
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
      <CommandPalette />
    </div>
    </>
  );
}
