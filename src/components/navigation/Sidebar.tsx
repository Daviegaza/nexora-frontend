import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Calculator,
  DollarSign,
  UserCheck,
  TrendingUp,
  FileText,
  Settings,
  Bot,
  Building2,
  Truck,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Zap,
  ChevronDown,
} from 'lucide-react';
import { cn } from '../../utils';
import { useAppStore } from '../../store';
import { hasPermission } from '../../constants';
import { Tooltip } from '../ui';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
  badgeColor?: string;
  children?: NavItem[];
  minLevel?: number;
}

// minLevel maps to ROLE_HIERARCHY: 1=employee/cashier, 2=sales, 4=manager, 5=branch, 8=ceo, 9=owner, 10=super_admin
const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
    path: '/',
    minLevel: 1,
  },
  {
    id: 'pos',
    label: 'Point of Sale',
    icon: <ShoppingCart size={18} />,
    path: '/pos',
    badge: 'Live',
    badgeColor: 'bg-emerald-500',
    minLevel: 1,
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: <Package size={18} />,
    path: '/inventory',
    minLevel: 2,
  },
  { id: 'crm', label: 'CRM', icon: <Users size={18} />, path: '/crm', minLevel: 2 },
  {
    id: 'customers',
    label: 'Customers',
    icon: <UserCheck size={18} />,
    path: '/customers',
    minLevel: 1,
  },
  {
    id: 'accounting',
    label: 'Accounting',
    icon: <Calculator size={18} />,
    path: '/accounting',
    minLevel: 4,
  },
  {
    id: 'payroll',
    label: 'Payroll',
    icon: <DollarSign size={18} />,
    path: '/payroll',
    minLevel: 4,
  },
  { id: 'hr', label: 'HR & People', icon: <UserCog size={18} />, path: '/hr', minLevel: 4 },
  {
    id: 'employees',
    label: 'Employees',
    icon: <UserCog size={18} />,
    path: '/employees',
    minLevel: 1,
  },
  {
    id: 'suppliers',
    label: 'Suppliers',
    icon: <Truck size={18} />,
    path: '/suppliers',
    minLevel: 2,
  },
  {
    id: 'branches',
    label: 'Branches',
    icon: <Building2 size={18} />,
    path: '/branches',
    minLevel: 5,
  },
  { id: 'reports', label: 'Reports', icon: <FileText size={18} />, path: '/reports', minLevel: 4 },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <TrendingUp size={18} />,
    path: '/analytics',
    minLevel: 4,
  },
  {
    id: 'ai',
    label: 'AI Assistant',
    icon: <Bot size={18} />,
    path: '/ai',
    badge: 'AI',
    badgeColor: 'bg-nexora-500',
    minLevel: 1,
  },
  {
    id: 'chama',
    label: 'Chama / Vyama',
    icon: <Users size={18} />,
    path: '/chama',
    badge: 'New',
    badgeColor: 'bg-emerald-500',
    minLevel: 1,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings size={18} />,
    path: '/settings',
    minLevel: 5,
  },
];

const groups = [
  { label: 'Core', items: ['dashboard', 'pos'] },
  { label: 'Operations', items: ['inventory', 'crm', 'customers', 'suppliers'] },
  { label: 'Finance', items: ['accounting', 'payroll'] },
  { label: 'People', items: ['hr', 'employees'] },
  { label: 'Business', items: ['branches', 'reports', 'analytics'] },
  { label: 'Intelligence', items: ['ai'] },
  { label: 'Community', items: ['chama'] },
  { label: 'System', items: ['settings'] },
];

function NavItemComponent({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const location = useLocation();
  const isActive =
    location.pathname === item.path ||
    (item.path !== '/' && location.pathname.startsWith(item.path));

  const content = (
    <NavLink
      to={item.path}
      className={cn(
        'flex items-center gap-3 px-3 h-9 rounded-lg text-sm font-medium transition-all duration-150 group relative',
        isActive
          ? 'bg-nexora-50 dark:bg-nexora-500/10 text-nexora-700 dark:text-nexora-400'
          : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100',
        collapsed && 'justify-center px-0 w-9 mx-auto',
      )}
    >
      {isActive && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-nexora-500 rounded-full" />
      )}
      <span
        className={cn(
          'flex-shrink-0 transition-colors',
          isActive
            ? 'text-nexora-600 dark:text-nexora-400'
            : 'text-surface-400 group-hover:text-surface-600 dark:group-hover:text-surface-300',
        )}
      >
        {item.icon}
      </span>
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span
              className={cn(
                'text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full',
                item.badgeColor,
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  return collapsed ? <Tooltip content={item.label}>{content}</Tooltip> : content;
}

export function Sidebar() {
  const {
    sidebarCollapsed,
    toggleSidebar,
    currentUser,
    currentRole,
    mobileNavOpen,
    setMobileNavOpen,
  } = useAppStore();

  // Filter nav items by role permission
  const visibleItems = navItems.filter(
    (item) => !item.minLevel || hasPermission(currentRole, item.minLevel),
  );

  // Filter groups to only show ones with visible items
  const visibleGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((id) => visibleItems.some((v) => v.id === id)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden
        />
      )}
      <aside
        role="navigation"
        aria-label="Main navigation"
        className={cn(
          'fixed top-0 left-0 h-full flex flex-col bg-white dark:bg-surface-950 border-r border-surface-200 dark:border-surface-800 z-40 transition-all duration-300',
          // Width
          sidebarCollapsed ? 'lg:w-[68px]' : 'lg:w-[260px]',
          'w-[280px]',
          // Mobile: slide in from left when open, off-screen otherwise
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            'flex items-center gap-3 h-[60px] px-4 border-b border-surface-100 dark:border-surface-800 flex-shrink-0',
            sidebarCollapsed && 'justify-center px-0',
          )}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-nexora-500 to-violet-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-glow-nexora">
            <Zap size={16} className="text-white" fill="white" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-surface-900 dark:text-white tracking-tight">
                NEXORA AI
              </div>
              <div className="text-[10px] text-surface-400 font-medium tracking-wider uppercase">
                Business OS
              </div>
            </div>
          )}
        </div>

        {/* Workspace selector */}
        {!sidebarCollapsed && (
          <div className="px-3 pt-3 pb-1">
            <button
              onClick={() =>
                useAppStore.getState().addToast({
                  type: 'info',
                  title: 'Workspace Switcher',
                  message: 'Multi-workspace support coming soon.',
                })
              }
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-750 transition-colors text-left"
            >
              <div className="w-5 h-5 rounded bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-surface-800 dark:text-surface-200 truncate">
                  Nexora Enterprises
                </div>
                <div className="text-[10px] text-surface-400 truncate">Pro Plan · 12 Branches</div>
              </div>
              <ChevronDown size={12} className="text-surface-400 flex-shrink-0" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 space-y-0.5">
          {visibleGroups.map((group) => {
            const groupItems = visibleItems.filter((n) => group.items.includes(n.id));
            return (
              <div key={group.label} className="mb-1">
                {!sidebarCollapsed && (
                  <div className="px-2 py-1.5 text-[10px] font-semibold text-surface-400 dark:text-surface-600 uppercase tracking-widest">
                    {group.label}
                  </div>
                )}
                {sidebarCollapsed && (
                  <div className="my-1 h-px bg-surface-100 dark:bg-surface-800" />
                )}
                <div className="space-y-0.5">
                  {groupItems.map((item) => (
                    <NavItemComponent key={item.id} item={item} collapsed={sidebarCollapsed} />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* User profile */}
        <div
          className={cn(
            'px-2 py-3 border-t border-surface-100 dark:border-surface-800',
            sidebarCollapsed && 'flex justify-center',
          )}
        >
          {sidebarCollapsed ? (
            <Tooltip content={currentUser.name}>
              <button
                onClick={() =>
                  useAppStore.getState().addToast({
                    type: 'info',
                    title: currentUser.name,
                    message: `${currentUser.email} · ${currentUser.role.replace('_', ' ')}`,
                  })
                }
                className="w-9 h-9 rounded-lg bg-gradient-to-br from-nexora-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity"
              >
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </button>
            </Tooltip>
          ) : (
            <button
              onClick={() =>
                useAppStore.getState().addToast({
                  type: 'info',
                  title: currentUser.name,
                  message: `${currentUser.email} · ${currentUser.role.replace('_', ' ')}`,
                })
              }
              className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nexora-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-surface-800 dark:text-surface-200 truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-surface-400 capitalize truncate">
                  {currentUser.role.replace('_', ' ')}
                </div>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
            </button>
          )}
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex absolute -right-3 top-[72px] w-6 h-6 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-full items-center justify-center text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 shadow-sm transition-colors z-40"
        >
          {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>
    </>
  );
}
