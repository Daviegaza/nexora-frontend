import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Shield,
  ChevronRight,
  Building2,
  UserCog,
  Calculator,
  Package,
  ShoppingCart,
  Users,
  Mail,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { useAppStore } from '../../store';
import { cn } from '../../utils';
import type { Role, User } from '../../types';
import { login as apiLogin } from '../../services/auth';

const demoUsers: User[] = [
  {
    id: 'u1',
    name: 'James Mwangi',
    email: 'james.mwangi@nexora.co.ke',
    role: 'owner',
    branch: 'Nairobi HQ',
    department: 'Executive',
    joinDate: '2019-01-15',
    status: 'active',
    phone: '+254 722 123456',
    salary: 450000,
  },
  {
    id: 'u2',
    name: 'Faith Wambui',
    email: 'faith.wambui@nexora.co.ke',
    role: 'super_admin',
    branch: 'Nairobi HQ',
    department: 'IT',
    joinDate: '2020-03-10',
    status: 'active',
    phone: '+254 722 234567',
    salary: 380000,
  },
  {
    id: 'u3',
    name: 'David Kiprotich',
    email: 'david.kiprotich@nexora.co.ke',
    role: 'ceo',
    branch: 'Nairobi HQ',
    department: 'Executive',
    joinDate: '2018-06-01',
    status: 'active',
    phone: '+254 733 345678',
    salary: 600000,
  },
  {
    id: 'u4',
    name: 'Grace Achieng',
    email: 'grace.achieng@nexora.co.ke',
    role: 'branch_manager',
    branch: 'Mombasa Branch',
    department: 'Operations',
    joinDate: '2021-02-15',
    status: 'active',
    phone: '+254 744 456789',
    salary: 180000,
  },
  {
    id: 'u5',
    name: 'Peter Njoroge',
    email: 'peter.njoroge@nexora.co.ke',
    role: 'accountant',
    branch: 'Nairobi HQ',
    department: 'Finance',
    joinDate: '2020-08-20',
    status: 'active',
    phone: '+254 755 567890',
    salary: 150000,
  },
  {
    id: 'u6',
    name: 'Mary Wanjala',
    email: 'mary.wanjala@nexora.co.ke',
    role: 'inventory_manager',
    branch: 'Kisumu Branch',
    department: 'Operations',
    joinDate: '2021-05-12',
    status: 'active',
    phone: '+254 766 678901',
    salary: 130000,
  },
  {
    id: 'u7',
    name: 'John Odhiambo',
    email: 'john.odhiambo@nexora.co.ke',
    role: 'hr_manager',
    branch: 'Nairobi HQ',
    department: 'HR',
    joinDate: '2020-11-01',
    status: 'active',
    phone: '+254 777 789012',
    salary: 140000,
  },
  {
    id: 'u8',
    name: 'Lucy Muthoni',
    email: 'lucy.muthoni@nexora.co.ke',
    role: 'sales_agent',
    branch: 'Nakuru Branch',
    department: 'Sales',
    joinDate: '2022-01-10',
    status: 'active',
    phone: '+254 788 890123',
    salary: 80000,
  },
  {
    id: 'u9',
    name: 'Paul Otieno',
    email: 'paul.otieno@nexora.co.ke',
    role: 'cashier',
    branch: 'Eldoret Branch',
    department: 'Sales',
    joinDate: '2022-06-15',
    status: 'active',
    phone: '+254 799 901234',
    salary: 45000,
  },
  {
    id: 'u10',
    name: 'Rose Chebet',
    email: 'rose.chebet@nexora.co.ke',
    role: 'employee',
    branch: 'Thika Branch',
    department: 'Customer Service',
    joinDate: '2023-03-01',
    status: 'active',
    phone: '+254 700 012345',
    salary: 35000,
  },
];

const roleMeta: Record<Role, { label: string; icon: React.ReactNode; color: string }> = {
  super_admin: { label: 'Super Admin', icon: <Shield size={14} />, color: 'bg-violet-500' },
  admin: { label: 'Admin', icon: <Shield size={14} />, color: 'bg-violet-500' },
  owner: { label: 'Owner', icon: <Building2 size={14} />, color: 'bg-nexora-500' },
  director: { label: 'Director', icon: <Shield size={14} />, color: 'bg-nexora-500' },
  ceo: { label: 'CEO', icon: <Shield size={14} />, color: 'bg-nexora-500' },
  branch_manager: {
    label: 'Branch Manager',
    icon: <Building2 size={14} />,
    color: 'bg-emerald-500',
  },
  supervisor: { label: 'Supervisor', icon: <UserCog size={14} />, color: 'bg-amber-500' },
  accountant: { label: 'Accountant', icon: <Calculator size={14} />, color: 'bg-amber-500' },
  inventory_manager: {
    label: 'Inventory Manager',
    icon: <Package size={14} />,
    color: 'bg-cyan-500',
  },
  hr_manager: { label: 'HR Manager', icon: <UserCog size={14} />, color: 'bg-rose-500' },
  sales_agent: { label: 'Sales Agent', icon: <ShoppingCart size={14} />, color: 'bg-blue-500' },
  cashier: { label: 'Cashier', icon: <ShoppingCart size={14} />, color: 'bg-orange-500' },
  employee: { label: 'Employee', icon: <Users size={14} />, color: 'bg-surface-500' },
};

export default function Login() {
  const navigate = useNavigate();
  const setRole = useAppStore((s) => s.setRole);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('owner@nexora.co.ke');
  const [password, setPassword] = useState('demo1234');
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  async function handleRealLogin(e: React.FormEvent) {
    e.preventDefault();
    setSigningIn(true);
    setAuthError(null);
    try {
      const r = await apiLogin(email, password);
      // @ts-expect-error legacy shim
      useAppStore.setState({
        currentUser: r.user,
        currentRole: r.user.role,
        currentBranch: r.user.branch || 'All Branches',
        isAuthenticated: true,
      });
      navigate('/', { replace: true });
    } catch (err) {
      setAuthError(
        (err as { message?: string }).message ||
          'Sign-in failed. Check your credentials or backend.',
      );
    } finally {
      setSigningIn(false);
    }
  }

  const filtered = demoUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()) ||
      u.branch?.toLowerCase().includes(search.toLowerCase()),
  );

  function handleLogin(user: User) {
    // Update the store with the selected user
    // @ts-expect-error legacy shim
    useAppStore.setState({
      currentUser: user,
      currentRole: user.role,
      currentBranch: user.branch || 'All Branches',
      isAuthenticated: true,
    });
    setRole(user.role);
    navigate('/', { replace: true });
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex">
      {/* Left branding */}
      <div className="hidden lg:flex w-[480px] bg-gradient-to-br from-nexora-900 via-nexora-800 to-violet-900 relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
        <div className="relative flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur">
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <div>
              <div className="text-lg font-bold text-white tracking-tight">NEXORA AI</div>
              <div className="text-xs text-white/50 font-medium tracking-wider uppercase">
                Business OS
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white leading-tight">
              The AI Operating System
              <br />
              for Modern Businesses
            </h1>
            <div className="space-y-3">
              {[
                'Real-time analytics & dashboards',
                'Multi-branch management across Kenya',
                'AI-powered business insights',
                'Role-based access for every team member',
              ].map((line) => (
                <div key={line} className="flex items-center gap-3 text-white/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-nexora-400" />
                  <span className="text-sm">{line}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 text-white/40 text-xs">
            <span>v1.0.0</span>
            <span>·</span>
            <span>12 Branches</span>
            <span>·</span>
            <span>Kenya</span>
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[420px] animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-nexora-500 to-violet-500 rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <div>
              <div className="text-base font-bold text-surface-900 dark:text-white tracking-tight">
                NEXORA AI
              </div>
              <div className="text-[10px] text-surface-400 font-medium tracking-wider uppercase">
                Business OS
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-2">
              Welcome back
            </h2>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Sign in with your work email, or pick a demo profile below.
            </p>
          </div>

          {/* Real login (backend) */}
          <form
            onSubmit={handleRealLogin}
            className="space-y-3 mb-6 p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white/50 dark:bg-surface-900/50"
          >
            <div className="relative">
              <Mail
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.co.ke"
                autoComplete="email"
                className="w-full h-10 pl-9 pr-3 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 outline-none focus:border-nexora-500 focus:ring-2 focus:ring-nexora-500/20 transition-all"
              />
            </div>
            <div className="relative">
              <Lock
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full h-10 pl-9 pr-3 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 outline-none focus:border-nexora-500 focus:ring-2 focus:ring-nexora-500/20 transition-all"
              />
            </div>
            {authError && (
              <div className="flex items-start gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 p-2 rounded-lg">
                <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={signingIn}
              className={cn(
                'w-full h-10 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2',
                signingIn
                  ? 'bg-nexora-400 text-white cursor-wait'
                  : 'bg-nexora-600 text-white hover:bg-nexora-700 active:scale-[0.98]',
              )}
            >
              {signingIn ? (
                'Signing in…'
              ) : (
                <>
                  Sign In <ChevronRight size={16} />
                </>
              )}
            </button>
            <p className="text-[10px] text-surface-400 text-center">
              Default seeded owner: owner@nexora.co.ke / demo1234
            </p>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-surface-200 dark:bg-surface-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-surface-50 dark:bg-surface-950 text-[10px] uppercase tracking-wider text-surface-400">
                or demo
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, role, or branch..."
              className="w-full h-11 px-4 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 outline-none focus:border-nexora-500 focus:ring-2 focus:ring-nexora-500/20 transition-all"
            />
          </div>

          {/* User list */}
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {filtered.map((user) => {
              const meta = roleMeta[user.role];
              const isSelected = selectedUser?.id === user.id;
              return (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150',
                    isSelected
                      ? 'border-nexora-500 bg-nexora-50 dark:bg-nexora-500/10 shadow-sm'
                      : 'border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 hover:border-surface-300 dark:hover:border-surface-700',
                  )}
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0',
                      meta.color,
                    )}
                  >
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                      {user.name}
                    </p>
                    <p className="text-xs text-surface-500 dark:text-surface-400">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full',
                          isSelected
                            ? 'bg-nexora-100 text-nexora-700 dark:bg-nexora-500/20 dark:text-nexora-400'
                            : 'bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400',
                        )}
                      >
                        {meta.icon}
                        {meta.label}
                      </span>
                      <span className="text-[10px] text-surface-400">{user.branch}</span>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className={cn(
                      'text-surface-300 transition-all',
                      isSelected && 'text-nexora-500 translate-x-0.5',
                    )}
                  />
                </button>
              );
            })}
          </div>

          {/* Login button */}
          <button
            onClick={() => selectedUser && handleLogin(selectedUser)}
            disabled={!selectedUser}
            className={cn(
              'w-full h-12 rounded-xl font-semibold text-sm mt-6 transition-all duration-200 flex items-center justify-center gap-2',
              selectedUser
                ? 'bg-nexora-600 text-white hover:bg-nexora-700 shadow-lg shadow-nexora-500/25 active:scale-[0.98]'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-400 cursor-not-allowed',
            )}
          >
            {selectedUser ? (
              <>
                Sign In as {selectedUser.name.split(' ')[0]} <ChevronRight size={16} />
              </>
            ) : (
              'Select a profile to continue'
            )}
          </button>

          <p className="text-xs text-surface-400 text-center mt-4">
            Demo mode — select any profile to explore role-based access
          </p>
        </div>
      </div>
    </div>
  );
}
