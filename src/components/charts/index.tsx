import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { cn, formatCurrency, CHART_COLORS } from '../../utils';

// ── Custom Tooltip ──────────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, currency }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string; currency?: boolean }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl p-3 shadow-modal text-xs min-w-[140px]">
      {label && <p className="font-semibold text-surface-700 dark:text-surface-300 mb-2">{label}</p>}
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-surface-500 dark:text-surface-400 capitalize">{entry.name}</span>
          </div>
          <span className="font-semibold text-surface-900 dark:text-surface-100">
            {currency ? formatCurrency(entry.value, true) : entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Revenue Area Chart ──────────────────────────────────────────────────────────────────
interface AreaChartProps {
  data: Record<string, string | number>[];
  keys: { key: string; color: string; label?: string }[];
  height?: number;
  currency?: boolean;
  gradient?: boolean;
  className?: string;
}

export function RevenueAreaChart({ data, keys, height = 260, currency, className }: AreaChartProps) {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            {keys.map((k) => (
              <linearGradient key={k.key} id={`grad-${k.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={k.color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={k.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} tickFormatter={(v) => currency ? formatCurrency(v, true).replace('KSh ', '') : v.toLocaleString()} width={50} />
          <Tooltip content={<CustomTooltip currency={currency} />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
          {keys.map((k) => (
            <Area
              key={k.key}
              type="monotone"
              dataKey={k.key}
              name={k.label ?? k.key}
              stroke={k.color}
              strokeWidth={2}
              fill={`url(#grad-${k.key})`}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: k.color, stroke: '#fff' }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Bar Chart ──────────────────────────────────────────────────────────────────
interface BarChartProps {
  data: Record<string, string | number>[];
  keys: { key: string; color: string; label?: string }[];
  height?: number;
  currency?: boolean;
  stacked?: boolean;
  horizontal?: boolean;
  className?: string;
}

export function MetricBarChart({ data, keys, height = 240, currency, stacked, horizontal, className }: BarChartProps) {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout={horizontal ? 'vertical' : 'horizontal'} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={!horizontal} horizontal={horizontal} />
          {horizontal ? (
            <>
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} tickFormatter={(v) => currency ? formatCurrency(v, true).replace('KSh ', '') : v.toLocaleString()} />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} width={80} />
            </>
          ) : (
            <>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} tickFormatter={(v) => currency ? formatCurrency(v, true).replace('KSh ', '') : v.toLocaleString()} width={50} />
            </>
          )}
          <Tooltip content={<CustomTooltip currency={currency} />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
          {keys.length > 1 && <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />}
          {keys.map((k, i) => (
            <Bar key={k.key} dataKey={k.key} name={k.label ?? k.key} fill={k.color} stackId={stacked ? 'a' : undefined} radius={i === keys.length - 1 || !stacked ? [4, 4, 0, 0] : [0, 0, 0, 0]} maxBarSize={40} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Donut / Pie Chart ──────────────────────────────────────────────────────────────────
interface DonutChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  innerRadius?: number;
  currency?: boolean;
  className?: string;
}

export function DonutChart({ data, height = 220, innerRadius = 55, currency, className }: DonutChartProps) {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={innerRadius + 32}
            paddingAngle={2}
            dataKey="value"
            nameKey="label"
          >
            {data.map((entry, index) => (
              <Cell key={entry.label} fill={entry.color ?? CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip currency={currency} />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            formatter={(value) => <span className="text-surface-600 dark:text-surface-400">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Line Chart ──────────────────────────────────────────────────────────────────
export function MetricLineChart({ data, keys, height = 200, currency, className }: AreaChartProps) {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} tickFormatter={(v) => currency ? formatCurrency(v, true).replace('KSh ', '') : v.toLocaleString()} width={50} />
          <Tooltip content={<CustomTooltip currency={currency} />} />
          {keys.length > 1 && <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />}
          {keys.map((k) => (
            <Line key={k.key} type="monotone" dataKey={k.key} name={k.label ?? k.key} stroke={k.color} strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 2, fill: k.color, stroke: '#fff' }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Sparkline (mini chart) ──────────────────────────────────────────────────────────────────
export function Sparkline({ data, color = '#5470f1', height = 40, positive }: { data: number[]; color?: string; height?: number; positive?: boolean }) {
  const chartData = data.map((v, i) => ({ v, i }));
  const fillColor = positive !== undefined ? (positive ? '#10b981' : '#f43f5e') : color;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <defs>
          <linearGradient id={`spark-${fillColor}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={fillColor} stopOpacity={0.3} />
            <stop offset="95%" stopColor={fillColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={fillColor} strokeWidth={1.5} fill={`url(#spark-${fillColor})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
