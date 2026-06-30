import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Plus,
  LogOut,
  User,
  Settings,
  Shield,
  HelpCircle,
  Zap,
  X,
  Check,
  Mail,
  Key,
  FileText,
  ExternalLink,
  ShoppingCart,
  Package,
} from 'lucide-react';
import { cn, timeAgo } from '../../utils';
import { useAppStore } from '../../store';
import { Avatar, Badge, Button } from '../ui';
import type { Role } from '../../types';

const routeLabels: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Business overview & insights' },
  '/pos': { title: 'Point of Sale', subtitle: 'Process transactions' },
  '/inventory': { title: 'Inventory', subtitle: 'Stock management & tracking' },
  '/crm': { title: 'CRM', subtitle: 'Customer relationships & leads' },
  '/customers': { title: 'Customers', subtitle: 'Customer database & analytics' },
  '/accounting': { title: 'Accounting', subtitle: 'Financial management' },
  '/payroll': { title: 'Payroll', subtitle: 'Employee compensation' },
  '/hr': { title: 'HR & People', subtitle: 'Human resource management' },
  '/employees': { title: 'Employees', subtitle: 'Team management' },
  '/suppliers': { title: 'Suppliers', subtitle: 'Vendor management' },
  '/branches': { title: 'Branches', subtitle: 'Multi-location management' },
  '/reports': { title: 'Reports', subtitle: 'Business intelligence reports' },
  '/analytics': { title: 'Analytics', subtitle: 'Data insights & forecasting' },
  '/ai': { title: 'AI Assistant', subtitle: 'Your intelligent business advisor' },
  '/settings': { title: 'Settings', subtitle: 'System configuration' },
};

const roles: { value: Role; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'owner', label: 'Owner' },
  { value: 'ceo', label: 'CEO' },
  { value: 'branch_manager', label: 'Branch Manager' },
  { value: 'cashier', label: 'Cashier' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'inventory_manager', label: 'Inventory Manager' },
  { value: 'hr_manager', label: 'HR Manager' },
  { value: 'sales_agent', label: 'Sales Agent' },
  { value: 'employee', label: 'Employee' },
];

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { notifications, markNotificationRead, markAllRead } = useAppStore();
  const unread = notifications.filter((n) => !n.read).length;
  const typeColors = {
    info: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10',
    success: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10',
    warning: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10',
    error: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10',
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-[380px] bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-modal overflow-hidden z-50 animate-scale-in">
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-100 dark:border-surface-800">
        <div>
          <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">
            Notifications
          </h3>
          {unread > 0 && <p className="text-xs text-surface-400">{unread} unread</p>}
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-nexora-600 dark:text-nexora-400 hover:underline"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="overflow-y-auto max-h-[420px]">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-surface-400 text-sm">No notifications</div>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={cn(
                'w-full flex gap-3 px-4 py-3 text-left hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors border-b border-surface-50 dark:border-surface-800 last:border-0',
                !n.read && 'bg-nexora-50/30 dark:bg-nexora-500/5',
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm mt-0.5',
                  typeColors[n.type],
                )}
              >
                {n.type === 'success'
                  ? '✓'
                  : n.type === 'warning'
                    ? '!'
                    : n.type === 'error'
                      ? '✕'
                      : 'i'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-surface-800 dark:text-surface-200 leading-snug">
                    {n.title}
                  </p>
                  {!n.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-nexora-500 flex-shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 leading-relaxed">
                  {n.message}
                </p>
                <p className="text-[10px] text-surface-400 mt-1.5">{timeAgo(n.createdAt)}</p>
              </div>
            </button>
          ))
        )}
      </div>
      <div className="px-4 py-2.5 border-t border-surface-100 dark:border-surface-800">
        <button
          onClick={() => {
            onClose();
          }}
          className="text-xs text-nexora-600 dark:text-nexora-400 hover:underline"
        >
          View all notifications →
        </button>
      </div>
    </div>
  );
}

function ProfileModal({ onClose }: { onClose: () => void }) {
  const { currentUser } = useAppStore();
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-modal w-[420px] max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-20 bg-gradient-to-r from-nexora-500 to-violet-500 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X size={14} />
          </button>
          <div className="absolute -bottom-8 left-5">
            <Avatar name={currentUser.name} size="xl" status="online" />
          </div>
        </div>
        <div className="px-5 pt-10 pb-5">
          <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100">
            {currentUser.name}
          </h2>
          <p className="text-xs text-surface-500 capitalize">
            {currentUser.role.replace('_', ' ')} · {currentUser.branch}
          </p>
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
              <div className="flex items-center gap-2 text-surface-400 mb-1">
                <Mail size={12} />
                <span className="text-[10px] uppercase tracking-wider">Email</span>
              </div>
              <p className="text-xs font-medium text-surface-700 dark:text-surface-300 truncate">
                {currentUser.email}
              </p>
            </div>
            <div className="p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
              <div className="flex items-center gap-2 text-surface-400 mb-1">
                <Key size={12} />
                <span className="text-[10px] uppercase tracking-wider">Employee ID</span>
              </div>
              <p className="text-xs font-medium text-surface-700 dark:text-surface-300">
                {currentUser.id.toUpperCase()}
              </p>
            </div>
            <div className="p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
              <div className="flex items-center gap-2 text-surface-400 mb-1">
                <Settings size={12} />
                <span className="text-[10px] uppercase tracking-wider">Department</span>
              </div>
              <p className="text-xs font-medium text-surface-700 dark:text-surface-300">
                {currentUser.department}
              </p>
            </div>
            <div className="p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
              <div className="flex items-center gap-2 text-surface-400 mb-1">
                <FileText size={12} />
                <span className="text-[10px] uppercase tracking-wider">Joined</span>
              </div>
              <p className="text-xs font-medium text-surface-700 dark:text-surface-300">
                {new Date(currentUser.joinDate).toLocaleDateString('en-KE', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-5">
            <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              icon={<ExternalLink size={12} />}
              onClick={() => {
                onClose();
                window.location.assign('/settings');
              }}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserMenu({ onClose }: { onClose: () => void }) {
  const { currentRole, setRole, currentUser } = useAppStore();
  const navigate = useNavigate();
  const [showRoles, setShowRoles] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);

  const handleProfile = () => {
    setShowProfile(true);
  };
  const handleSettings = () => {
    onClose();
    navigate('/settings');
  };
  const handleSecurity = () => {
    onClose();
    navigate('/settings');
  };
  const handleSupport = () => {
    onClose();
    navigate('/ai');
  };
  const handleSignOut = () => {
    setShowSignOut(true);
  };
  const confirmSignOut = () => {
    setShowSignOut(false);
    onClose();
    useAppStore.getState().signOut();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <div className="absolute right-0 top-full mt-2 w-[240px] bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-modal overflow-hidden z-50 animate-scale-in">
        <div className="px-4 py-3 border-b border-surface-100 dark:border-surface-800">
          <div className="flex items-center gap-3">
            <Avatar name={currentUser.name} size="md" status="online" />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">
                {currentUser.name}
              </div>
              <div className="text-xs text-surface-400 truncate">{currentUser.email}</div>
            </div>
          </div>
        </div>
        <div className="p-1.5">
          <MenuRow icon={<User size={14} />} label="My Profile" onClick={handleProfile} />
          <MenuRow
            icon={<Settings size={14} />}
            label="Account Settings"
            onClick={handleSettings}
          />
          <MenuRow icon={<Shield size={14} />} label="Security" onClick={handleSecurity} />
          <div className="h-px bg-surface-100 dark:bg-surface-800 my-1" />
          <button
            onClick={() => setShowRoles(!showRoles)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
          >
            <Shield size={14} />
            <span className="flex-1 text-left">Switch Role</span>
            <Badge size="sm" variant="info">
              {currentRole.replace('_', ' ')}
            </Badge>
            <ChevronDown
              size={12}
              className={cn('transition-transform', showRoles && 'rotate-180')}
            />
          </button>
          {showRoles && (
            <div className="ml-3 mt-1 space-y-0.5 max-h-40 overflow-y-auto">
              {roles.map((r) => (
                <button
                  key={r.value}
                  onClick={() => {
                    setRole(r.value);
                    setShowRoles(false);
                    onClose();
                  }}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors',
                    currentRole === r.value
                      ? 'text-nexora-700 dark:text-nexora-400 bg-nexora-50 dark:bg-nexora-500/10 font-medium'
                      : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800',
                  )}
                >
                  {currentRole === r.value && <Check size={10} />}
                  {r.label}
                </button>
              ))}
            </div>
          )}
          <div className="h-px bg-surface-100 dark:bg-surface-800 my-1" />
          <MenuRow icon={<HelpCircle size={14} />} label="Help & Support" onClick={handleSupport} />
          <MenuRow
            icon={<LogOut size={14} />}
            label="Sign Out"
            onClick={handleSignOut}
            className="text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
          />
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}

      {/* Sign Out Confirmation */}
      {showSignOut && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in"
          onClick={() => setShowSignOut(false)}
        >
          <div
            className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-modal w-[360px] p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogOut size={22} className="text-rose-500" />
            </div>
            <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100 text-center mb-2">
              Sign Out
            </h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 text-center mb-5">
              Are you sure you want to sign out of your account?
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => setShowSignOut(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" size="sm" className="flex-1" onClick={confirmSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MenuRow({
  icon,
  label,
  className,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors',
        className,
      )}
    >
      {icon}
      {label}
    </button>
  );
}

export function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    theme,
    setTheme,
    sidebarCollapsed,
    notifications,
    setCommandPaletteOpen,
    currentUser,
    setMobileNavOpen,
  } = useAppStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const newRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;
  const pageInfo = routeLabels[location.pathname] ?? { title: 'Page', subtitle: '' };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (newRef.current && !newRef.current.contains(e.target as Node)) setNewMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [setCommandPaletteOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 h-[60px] bg-white/85 dark:bg-surface-950/85 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800 flex items-center gap-2 sm:gap-4 px-3 sm:px-5 z-20 transition-[left] duration-300',
        sidebarCollapsed ? 'lg:left-[68px]' : 'lg:left-[260px]',
      )}
    >
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open navigation menu"
        className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800 flex-shrink-0"
      >
        <Menu size={18} />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">
          {pageInfo.title}
        </h1>
        <p className="text-[11px] text-surface-400 truncate hidden sm:block">{pageInfo.subtitle}</p>
      </div>

      {/* Search */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="hidden md:flex items-center gap-2 h-8 px-3 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-750 rounded-lg text-sm text-surface-400 transition-colors min-w-[180px]"
      >
        <Search size={14} />
        <span className="text-xs flex-1 text-left">Search...</span>
        <div className="flex items-center gap-0.5 opacity-60">
          <kbd className="text-[10px] bg-surface-200 dark:bg-surface-700 px-1 rounded">⌘</kbd>
          <kbd className="text-[10px] bg-surface-200 dark:bg-surface-700 px-1 rounded">K</kbd>
        </div>
      </button>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {/* Quick add */}
        <div ref={newRef} className="relative hidden sm:block">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setNewMenuOpen(!newMenuOpen)}
          >
            New
          </Button>
          {newMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-[200px] bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-modal overflow-hidden z-50 animate-scale-in">
              <div className="p-1.5">
                {[
                  { icon: <ShoppingCart size={14} />, label: 'New Sale', path: '/pos' },
                  { icon: <User size={14} />, label: 'New Customer', path: '/customers' },
                  { icon: <Package size={14} />, label: 'New Product', path: '/inventory' },
                  { icon: <FileText size={14} />, label: 'New Invoice', path: '/accounting' },
                  { icon: <User size={14} />, label: 'New Lead', path: '/crm' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      navigate(item.path);
                      setNewMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-700 dark:hover:text-surface-300 transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label="Notifications"
            className="relative w-8 h-8 rounded-lg flex items-center justify-center text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-700 dark:hover:text-surface-300 transition-colors"
          >
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>
          {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
        </div>

        {/* AI quick access */}
        <button
          onClick={() => navigate('/ai')}
          className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center bg-gradient-to-br from-nexora-500 to-violet-500 text-white hover:opacity-90 transition-opacity shadow-glow-nexora"
        >
          <Zap size={14} fill="white" />
        </button>

        {/* User */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 pl-1 pr-2 h-8 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <Avatar name={currentUser.name} size="sm" status="online" />
            <ChevronDown size={12} className="text-surface-400 hidden sm:block" />
          </button>
          {userMenuOpen && <UserMenu onClose={() => setUserMenuOpen(false)} />}
        </div>
      </div>
    </header>
  );
}
