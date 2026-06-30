import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '../utils';
import { useAppStore } from '../store';
import { Sidebar } from '../components/navigation/Sidebar';
import { Topbar } from '../components/navigation/Topbar';
import { CommandPalette } from '../components/navigation/CommandPalette';
import { Breadcrumb } from '../components/Breadcrumb';
import { SkipToContent } from '../components/SkipToContent';
import { useKeyboardShortcuts } from '../components/KeyboardShortcuts';
import { MobileBottomNav } from '../components/navigation/MobileBottomNav';

export function AppLayout() {
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const mobileNavOpen = useAppStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useAppStore((s) => s.setMobileNavOpen);
  const location = useLocation();
  useKeyboardShortcuts();

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname, setMobileNavOpen]);

  // Lock body scroll while mobile drawer open
  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileNavOpen]);

  return (
    <>
      <SkipToContent />
      <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-surface-950">
        <Sidebar />
        <div
          className={cn(
            'flex flex-col flex-1 min-w-0 transition-[margin] duration-300',
            'ml-0',
            sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-[260px]',
          )}
        >
          <Topbar />
          <main
            id="main-content"
            className="flex-1 overflow-y-auto overflow-x-hidden mt-[60px] pb-[64px] lg:pb-0"
          >
            <Breadcrumb />
            <div className="min-h-full">
              <Outlet />
            </div>
          </main>
        </div>
        <CommandPalette />
        <MobileBottomNav />
      </div>
    </>
  );
}
