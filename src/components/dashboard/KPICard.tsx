import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn, formatNumber } from '../../utils';
import { Sparkline } from '../charts';
import { Skeleton } from '../ui';
import type { KPI } from '../../types';

interface KPICardProps {
  kpi: KPI;
  loading?: boolean;
  onClick?: () => void;
}

export function KPICard({ kpi, loading, onClick }: KPICardProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-3 w-20 mb-2" />
            <Skeleton className="h-6 w-28" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  const isPositive = kpi.trend === 'up';
  const isNegative = kpi.trend === 'down';
  const trendColor = isPositive ? 'text-emerald-600 dark:text-emerald-400' : isNegative ? 'text-rose-500 dark:text-rose-400' : 'text-surface-400';
  const trendBg = isPositive ? 'bg-emerald-50 dark:bg-emerald-500/10' : isNegative ? 'bg-rose-50 dark:bg-rose-500/10' : 'bg-surface-50 dark:bg-surface-800';

  const colorClasses: Record<string, { icon: string; glow: string }> = {
    nexora: { icon: 'bg-nexora-50 dark:bg-nexora-500/10 text-nexora-600 dark:text-nexora-400', glow: '' },
    emerald: { icon: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', glow: '' },
    amber: { icon: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400', glow: '' },
    rose: { icon: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400', glow: '' },
    violet: { icon: 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400', glow: '' },
    cyan: { icon: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400', glow: '' },
  };

  const cc = colorClasses[kpi.color] ?? colorClasses.nexora;

  return (
    <button
      onClick={onClick}
      className={cn(
        'group bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5 shadow-card text-left w-full transition-all duration-200',
        onClick && 'hover:-translate-y-0.5 hover:shadow-card-hover hover:border-surface-300 dark:hover:border-surface-700 cursor-pointer'
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">{kpi.label}</p>
          <div className="flex items-baseline gap-1.5">
            {kpi.prefix && <span className="text-sm font-medium text-surface-500 dark:text-surface-400">{kpi.prefix}</span>}
            <span className="text-2xl font-bold text-surface-900 dark:text-surface-50 tabular-nums">
              {typeof kpi.value === 'number' ? (kpi.prefix === 'KSh' ? formatNumber(kpi.value) : kpi.value.toLocaleString()) : kpi.value}
            </span>
            {kpi.suffix && <span className="text-sm font-medium text-surface-500 dark:text-surface-400">{kpi.suffix}</span>}
          </div>
        </div>
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0', cc.icon)}>
          {kpi.icon}
        </div>
      </div>

      {/* Sparkline */}
      {kpi.sparkline && (
        <div className="mb-3 -mx-1">
          <Sparkline data={kpi.sparkline} color={isPositive ? '#10b981' : isNegative ? '#f43f5e' : '#5470f1'} height={36} />
        </div>
      )}

      {/* Change indicator */}
      <div className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium', trendBg, trendColor)}>
        {isPositive ? <TrendingUp size={12} /> : isNegative ? <TrendingDown size={12} /> : <Minus size={12} />}
        <span>{Math.abs(kpi.change)}%</span>
        <span className="text-surface-400 dark:text-surface-600 font-normal">{kpi.changeLabel}</span>
      </div>
    </button>
  );
}

// Grid wrapper for KPI cards
export function KPIGrid({ kpis, loading, columns = 4 }: { kpis: KPI[]; loading?: boolean; columns?: 2 | 3 | 4 | 5 | 6 }) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  };
  return (
    <div className={cn('grid gap-4', gridCols[columns])}>
      {(loading ? Array(columns).fill(null) : kpis).map((kpi, i) => (
        <KPICard key={kpi?.label ?? i} kpi={kpi} loading={!kpi} />
      ))}
    </div>
  );
}
