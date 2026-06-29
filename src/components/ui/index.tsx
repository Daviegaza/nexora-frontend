import React from 'react';
import { cn, getInitials } from '../../utils';

// ── Button ──────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', loading, icon, iconRight, children, className, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 select-none focus-visible:ring-2 focus-visible:ring-nexora-500/50 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
    const variants = {
      primary: 'bg-nexora-600 text-white hover:bg-nexora-700 shadow-sm shadow-nexora-500/20',
      secondary: 'bg-surface-100 text-surface-800 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-100 dark:hover:bg-surface-700',
      ghost: 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800',
      danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm shadow-rose-500/20',
      outline: 'border border-surface-200 text-surface-700 hover:bg-surface-50 dark:border-surface-700 dark:text-surface-300 dark:hover:bg-surface-800',
      success: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-500/20',
    };
    const sizes = {
      xs: 'h-7 px-2.5 text-xs',
      sm: 'h-8 px-3 text-xs',
      md: 'h-9 px-4 text-sm',
      lg: 'h-11 px-6 text-sm',
    };
    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
        {loading ? <Spinner size="sm" /> : icon}
        {children}
        {iconRight}
      </button>
    );
  }
);
Button.displayName = 'Button';

// ── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-7 h-7' };
  return (
    <svg className={cn('animate-spin', s[size])} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ── Badge ──────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'violet';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}
export function Badge({ children, variant = 'default', size = 'sm', dot, className }: BadgeProps) {
  const variants = {
    default: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    danger: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    violet: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400',
  };
  const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-xs px-2.5 py-1' };
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full font-medium', variants[variant], sizes[size], className)}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />}
      {children}
    </span>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}
export function Card({ children, className, hover, onClick, padding = 'md' }: CardProps) {
  const paddings = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' };
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl',
        paddings[padding],
        hover && 'cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover hover:border-surface-300 dark:hover:border-surface-700',
        'shadow-card',
        className
      )}
    >
      {children}
    </div>
  );
}

// ── Input ──────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  hint?: string;
}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, iconRight, hint, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-surface-700 dark:text-surface-300">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">{icon}</span>}
        <input
          ref={ref}
          className={cn(
            'w-full h-9 bg-white dark:bg-surface-900 border rounded-lg text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 transition-all outline-none',
            'border-surface-200 dark:border-surface-700 focus:border-nexora-500 dark:focus:border-nexora-500 focus:ring-2 focus:ring-nexora-500/20',
            icon ? 'pl-9' : 'pl-3', iconRight ? 'pr-9' : 'pr-3',
            error && 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20',
            className
          )}
          {...props}
        />
        {iconRight && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400">{iconRight}</span>}
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
      {hint && !error && <p className="text-xs text-surface-400">{hint}</p>}
    </div>
  )
);
Input.displayName = 'Input';

// ── Select ──────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-surface-700 dark:text-surface-300">{label}</label>}
      <select
        ref={ref}
        className={cn(
          'w-full h-9 px-3 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg text-sm text-surface-900 dark:text-surface-100',
          'focus:border-nexora-500 focus:ring-2 focus:ring-nexora-500/20 outline-none transition-all appearance-none cursor-pointer',
          error && 'border-rose-400',
          className
        )}
        {...props}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  )
);
Select.displayName = 'Select';

// ── Avatar ──────────────────────────────────────────────────────────────────
interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  status?: 'online' | 'offline' | 'away';
}
export function Avatar({ name, src, size = 'md', className, status }: AvatarProps) {
  const sizes = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-sm', xl: 'w-14 h-14 text-base' };
  const statusColors = { online: 'bg-emerald-400', offline: 'bg-surface-400', away: 'bg-amber-400' };
  const bgColors = ['bg-nexora-100 text-nexora-700', 'bg-violet-100 text-violet-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700', 'bg-cyan-100 text-cyan-700'];
  const colorIndex = name.charCodeAt(0) % bgColors.length;
  return (
    <div className="relative inline-flex flex-shrink-0">
      {src ? (
        <img src={src} alt={name} className={cn('rounded-full object-cover', sizes[size], className)} />
      ) : (
        <div className={cn('rounded-full flex items-center justify-center font-semibold dark:opacity-90', sizes[size], bgColors[colorIndex], className)}>
          {getInitials(name)}
        </div>
      )}
      {status && (
        <span className={cn('absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-surface-900', statusColors[status])} />
      )}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('shimmer rounded-lg bg-surface-100 dark:bg-surface-800', className)} />;
}

export function SkeletonCard() {
  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
      <Skeleton className="h-16 w-full" />
    </Card>
  );
}

// ── StatusBadge ──────────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    active: { label: 'Active', variant: 'success' },
    inactive: { label: 'Inactive', variant: 'default' },
    pending: { label: 'Pending', variant: 'warning' },
    completed: { label: 'Completed', variant: 'success' },
    refunded: { label: 'Refunded', variant: 'violet' },
    low_stock: { label: 'Low Stock', variant: 'warning' },
    out_of_stock: { label: 'Out of Stock', variant: 'danger' },
    on_leave: { label: 'On Leave', variant: 'info' },
    paid: { label: 'Paid', variant: 'success' },
    overdue: { label: 'Overdue', variant: 'danger' },
    draft: { label: 'Draft', variant: 'default' },
      sent: { label: 'Sent', variant: 'info' },
    won: { label: 'Won', variant: 'success' },
    lost: { label: 'Lost', variant: 'danger' },
    approved: { label: 'Approved', variant: 'success' },
    rejected: { label: 'Rejected', variant: 'danger' },
    processing: { label: 'Processing', variant: 'warning' },
    delivered: { label: 'Delivered', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'danger' },
    new: { label: 'New', variant: 'info' },
    contacted: { label: 'Contacted', variant: 'violet' },
    qualified: { label: 'Qualified', variant: 'info' },
    proposal: { label: 'Proposal', variant: 'warning' },
    negotiation: { label: 'Negotiation', variant: 'warning' },
    vip: { label: 'VIP', variant: 'violet' },
    wholesale: { label: 'Wholesale', variant: 'info' },
    retail: { label: 'Retail', variant: 'default' },
    acknowledged: { label: 'Acknowledged', variant: 'info' },
  };
  const c = cfg[status] ?? { label: status, variant: 'default' as const };
  return <Badge variant={c.variant} dot>{c.label}</Badge>;
}

// ── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ className }: { className?: string }) {
  return <div className={cn('h-px bg-surface-100 dark:bg-surface-800', className)} />;
}

// ── Empty State ──────────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }: {
  icon: React.ReactNode; title: string; description?: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 bg-surface-100 dark:bg-surface-800 rounded-2xl flex items-center justify-center text-surface-400 dark:text-surface-600 mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200 mb-1">{title}</h3>
      {description && <p className="text-xs text-surface-400 max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = 'nexora', size = 'sm', label, showValue, className }: {
  value: number; max?: number; color?: string; size?: 'xs' | 'sm' | 'md'; label?: string; showValue?: boolean; className?: string;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const heights = { xs: 'h-1', sm: 'h-1.5', md: 'h-2' };
  const colors: Record<string, string> = {
    nexora: 'bg-nexora-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    violet: 'bg-violet-500',
  };
  return (
    <div className={cn(className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-surface-500">{label}</span>}
          {showValue && <span className="text-xs font-medium text-surface-700 dark:text-surface-300">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-700', colors[color] ?? 'bg-nexora-500')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────
interface TabItem { id: string; label: string; count?: number; icon?: React.ReactNode }
interface TabsProps { tabs: TabItem[]; active: string; onChange: (id: string) => void; className?: string }

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex gap-0 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-1.5 px-3 h-8 text-xs font-medium rounded-lg transition-all',
            active === tab.id
              ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 shadow-sm'
              : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn('px-1.5 py-0.5 rounded-full text-[10px] font-semibold', active === tab.id ? 'bg-nexora-100 text-nexora-700 dark:bg-nexora-900 dark:text-nexora-400' : 'bg-surface-200 dark:bg-surface-700 text-surface-500')}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ── Tooltip ──────────────────────────────────────────────────────────────────
export function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  return (
    <div className="relative group inline-flex">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-surface-900 dark:bg-surface-700 text-white text-xs rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface-900 dark:border-t-surface-700" />
      </div>
    </div>
  );
}

// ── Section Header ──────────────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-base font-semibold text-surface-900 dark:text-surface-50">{title}</h2>
        {subtitle && <p className="text-xs text-surface-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
