import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Bot, Bell, Menu } from 'lucide-react';
import { cn } from '../../utils';
import { useAppStore } from '../../store';

/**
 * Mobile-only bottom nav. Shows the 4-5 highest-value destinations
 * for any role: dashboard, POS, AI, notifications, more (drawer).
 * Hidden on lg+ where the sidebar is permanent.
 */
export function MobileBottomNav() {
  const location = useLocation();
  const { notifications, setMobileNavOpen, setNotificationPanelOpen } = useAppStore();
  const unread = notifications.filter((n) => !n.read).length;

  const items: {
    id: string;
    label: string;
    icon: React.ReactNode;
    path?: string;
    onClick?: () => void;
    badge?: number;
  }[] = [
    { id: 'home', label: 'Home', icon: <LayoutDashboard size={18} />, path: '/' },
    { id: 'pos', label: 'POS', icon: <ShoppingCart size={18} />, path: '/pos' },
    { id: 'ai', label: 'AI', icon: <Bot size={18} />, path: '/ai' },
    {
      id: 'bell',
      label: 'Alerts',
      icon: <Bell size={18} />,
      onClick: () => setNotificationPanelOpen(true),
      badge: unread,
    },
    { id: 'more', label: 'More', icon: <Menu size={18} />, onClick: () => setMobileNavOpen(true) },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Mobile primary navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 h-[64px] bg-white/95 dark:bg-surface-950/95 backdrop-blur-xl border-t border-surface-200 dark:border-surface-800 flex items-stretch px-1 pb-[env(safe-area-inset-bottom)]"
    >
      {items.map((item) => {
        const active =
          item.path &&
          (item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path));
        const inner = (
          <>
            <span className={cn('relative', active && 'text-nexora-600 dark:text-nexora-400')}>
              {item.icon}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] px-1 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </span>
            <span
              className={cn(
                'text-[10px] font-medium',
                active
                  ? 'text-nexora-600 dark:text-nexora-400'
                  : 'text-surface-500 dark:text-surface-400',
              )}
            >
              {item.label}
            </span>
          </>
        );
        const className =
          'flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px] rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors';
        return item.path ? (
          <NavLink
            key={item.id}
            to={item.path}
            className={className}
            aria-current={active ? 'page' : undefined}
          >
            {inner}
          </NavLink>
        ) : (
          <button key={item.id} onClick={item.onClick} className={className}>
            {inner}
          </button>
        );
      })}
    </nav>
  );
}
