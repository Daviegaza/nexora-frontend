import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 1_000_000) return `KSh ${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `KSh ${(amount / 1_000).toFixed(0)}K`;
    return `KSh ${amount.toLocaleString()}`;
  }
  return `KSh ${amount.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString('en-KE', options ?? { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
}

export function formatDateTime(date: string | Date): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-400/10',
    inactive: 'text-surface-500 bg-surface-100 dark:text-surface-400 dark:bg-surface-800',
    pending: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-400/10',
    completed: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-400/10',
    refunded: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-400/10',
    low_stock: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-400/10',
    out_of_stock: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-400/10',
    on_leave: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-400/10',
    paid: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-400/10',
    overdue: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-400/10',
    draft: 'text-surface-600 bg-surface-100 dark:text-surface-400 dark:bg-surface-800',
    sent: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-400/10',
    won: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-400/10',
    lost: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-400/10',
    approved: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-400/10',
    rejected: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-400/10',
    processing: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-400/10',
    delivered: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-400/10',
    cancelled: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-400/10',
    new: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-400/10',
    contacted: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-400/10',
    qualified: 'text-cyan-600 bg-cyan-50 dark:text-cyan-400 dark:bg-cyan-400/10',
    proposal: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-400/10',
    negotiation: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-400/10',
    vip: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-400/10',
    wholesale: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-400/10',
    retail: 'text-surface-600 bg-surface-100 dark:text-surface-400 dark:bg-surface-800',
  };
  return map[status] ?? 'text-surface-600 bg-surface-100';
}

export function getTrendColor(change: number): string {
  if (change > 0) return 'text-emerald-500';
  if (change < 0) return 'text-rose-500';
  return 'text-surface-400';
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, ms: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function generateSparkline(base: number, length = 10): number[] {
  let current = base;
  return Array.from({ length }, () => {
    current = current + (Math.random() - 0.45) * base * 0.1;
    return Math.max(0, Math.round(current));
  });
}

export const COLORS = {
  nexora: '#5470f1',
  violet: '#a78bfa',
  cyan: '#22d3ee',
  emerald: '#34d399',
  amber: '#fbbf24',
  rose: '#fb7185',
  orange: '#f97316',
  blue: '#60a5fa',
};

export const CHART_COLORS = Object.values(COLORS);
