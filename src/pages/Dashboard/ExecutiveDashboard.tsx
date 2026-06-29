import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowRight, AlertTriangle, CheckCircle, Zap, Star, Activity, Clock, RefreshCw, Building2, BarChart2 } from 'lucide-react';
import { Card, Button, Avatar, StatusBadge, Badge, ProgressBar, SectionHeader } from '../../components/ui';
import { KPIGrid } from '../../components/dashboard/KPICard';
import { RevenueAreaChart, MetricBarChart, DonutChart } from '../../components/charts';
import { formatCurrency, generateSparkline, COLORS } from '../../utils';
import { useAppStore } from '../../store';
import { transactions, branches, products, customers, aiInsights, revenueData, dailySalesData, categoryData, branchRevenueData } from '../../mock/data';
import type { KPI } from '../../types';

const kpis: KPI[] = [
  { label: 'Total Revenue', value: 15840000, prefix: 'KSh', change: 12.4, changeLabel: 'vs last month', trend: 'up', color: 'nexora', icon: '💰', sparkline: generateSparkline(1400000, 12) },
  { label: 'Net Profit', value: 4980000, prefix: 'KSh', change: 8.7, changeLabel: 'vs last month', trend: 'up', color: 'emerald', icon: '📈', sparkline: generateSparkline(420000, 12) },
  { label: 'Total Orders', value: 8429, change: 5.2, changeLabel: 'vs last month', trend: 'up', color: 'violet', icon: '🛒', sparkline: generateSparkline(700, 12) },
  { label: 'Active Customers', value: 3847, change: 3.1, changeLabel: 'vs last month', trend: 'up', color: 'cyan', icon: '👥', sparkline: generateSparkline(320, 12) },
  { label: 'Avg Order Value', value: 18750, prefix: 'KSh', change: -2.3, changeLabel: 'vs last month', trend: 'down', color: 'amber', icon: '🎯', sparkline: generateSparkline(18000, 12) },
  { label: 'Low Stock Items', value: 23, change: 4, changeLabel: 'since yesterday', trend: 'down', color: 'rose', icon: '⚠️', sparkline: generateSparkline(20, 12) },
];

const recentActivity = [
  { id: 1, type: 'sale', message: 'New sale completed', detail: 'KSh 12,450 via M-Pesa', time: '2 min ago', icon: '🛒', color: 'text-emerald-500' },
  { id: 2, type: 'customer', message: 'New customer registered', detail: 'Grace Wanjiku • Nairobi', time: '8 min ago', icon: '👤', color: 'text-nexora-500' },
  { id: 3, type: 'stock', message: 'Low stock alert', detail: 'Electronics Product 012 • 3 units left', time: '15 min ago', icon: '📦', color: 'text-amber-500' },
  { id: 4, type: 'payment', message: 'Invoice paid', detail: 'INV-2024-0234 • KSh 89,000', time: '32 min ago', icon: '✅', color: 'text-emerald-500' },
  { id: 5, type: 'payroll', message: 'Payroll approved', detail: 'June 2024 • 98 employees', time: '1 hr ago', icon: '💼', color: 'text-violet-500' },
  { id: 6, type: 'branch', message: 'Branch target reached', detail: 'Mombasa • 108% of target', time: '2 hr ago', icon: '🏢', color: 'text-cyan-500' },
  { id: 7, type: 'lead', message: 'New lead converted', detail: 'Kamau Enterprises • KSh 250,000', time: '3 hr ago', icon: '🎯', color: 'text-emerald-500' },
  { id: 8, type: 'sale', message: 'Refund processed', detail: 'RCP-2024-001823 • KSh 3,200', time: '4 hr ago', icon: '↩️', color: 'text-rose-500' },
];

const topProducts = products
  .filter((p) => p.status === 'active')
  .slice(0, 5)
  .map((p, i) => ({ ...p, sales: Math.floor(Math.random() * 500) + 50, revenue: Math.round(p.price * (Math.floor(Math.random() * 500) + 50)), rank: i + 1 }));

const topCustomers = customers
  .sort((a, b) => b.totalSpent - a.totalSpent)
  .slice(0, 5);

const healthScore = {
  overall: 84,
  finance: 91,
  operations: 78,
  sales: 88,
  hr: 72,
  inventory: 83,
};

function BusinessHealthScore() {
  const getColor = (v: number) => v >= 80 ? 'emerald' : v >= 60 ? 'amber' : 'rose';
  const getLabel = (v: number) => v >= 80 ? 'Excellent' : v >= 60 ? 'Good' : 'Needs Attention';
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-nexora-50 to-violet-50 dark:from-nexora-500/5 dark:to-violet-500/5" />
      <div className="relative">
        <SectionHeader title="Business Health Score" subtitle="Overall system performance" action={
          <Button variant="ghost" size="xs" icon={<RefreshCw size={12} />} onClick={() => useAppStore.getState().addToast({ type: 'info', title: 'Refreshing...', message: 'Health score updated.' })}>Refresh</Button>
        } />
        <div className="mt-5 flex items-center gap-6">
          {/* Big score ring */}
          <div className="relative flex-shrink-0">
            <svg width="96" height="96" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-100 dark:text-surface-800" />
              <circle cx="48" cy="48" r="40" fill="none" stroke="#5470f1" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - healthScore.overall / 100)}`}
                transform="rotate(-90 48 48)"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-surface-900 dark:text-surface-50">{healthScore.overall}</span>
              <span className="text-[10px] text-surface-400">/ 100</span>
            </div>
          </div>
          {/* Metric bars */}
          <div className="flex-1 space-y-3">
            {Object.entries(healthScore).filter(([k]) => k !== 'overall').map(([key, val]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-xs text-surface-500 w-20 capitalize">{key}</span>
                <ProgressBar value={val} color={getColor(val)} size="xs" className="flex-1" />
                <span className="text-xs font-semibold w-8 text-right text-surface-700 dark:text-surface-300">{val}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
            <CheckCircle size={12} className="text-emerald-500" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">{getLabel(healthScore.overall)}</span>
          </div>
          <span className="text-xs text-surface-400">Updated just now</span>
        </div>
      </div>
    </Card>
  );
}

function AIInsightsPanel() {
  const typeConfig = {
    alert: { icon: <AlertTriangle size={14} />, bg: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400', impact: 'danger' as const },
    opportunity: { icon: <TrendingUp size={14} />, bg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', impact: 'success' as const },
    forecast: { icon: <BarChart2 size={14} />, bg: 'bg-nexora-50 dark:bg-nexora-500/10 text-nexora-600 dark:text-nexora-400', impact: 'info' as const },
    recommendation: { icon: <Star size={14} />, bg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400', impact: 'warning' as const },
  };
  const impactColors = { high: 'danger', medium: 'warning', low: 'default' } as const;

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-nexora-500 to-violet-500 flex items-center justify-center">
              <Zap size={14} className="text-white" fill="white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-50">AI Insights</h3>
              <p className="text-[10px] text-surface-400">6 insights generated</p>
            </div>
          </div>
          <Button variant="ghost" size="xs" iconRight={<ArrowRight size={12} />} onClick={() => window.location.assign('/ai')}>View All</Button>
        </div>
      </div>
      <div className="divide-y divide-surface-50 dark:divide-surface-800">
        {aiInsights.slice(0, 4).map((insight) => {
          const cfg = typeConfig[insight.type];
          return (
            <div key={insight.id} className="px-5 py-3.5 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors cursor-pointer group" onClick={() => useAppStore.getState().addToast({ type: 'info', title: insight.title, message: insight.description })}>
              <div className="flex gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-surface-800 dark:text-surface-200 leading-snug">{insight.title}</p>
                    <Badge size="sm" variant={impactColors[insight.impact]}>{insight.impact}</Badge>
                  </div>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 line-clamp-2">{insight.description}</p>
                  {insight.action && (
                    <button onClick={(e) => { e.stopPropagation(); useAppStore.getState().addToast({ type: 'info', title: 'AI Action', message: insight.action! }); }} className="text-xs text-nexora-600 dark:text-nexora-400 font-medium mt-1.5 hover:underline group-hover:visible">
                      {insight.action} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function RecentTransactions() {
  const recent = transactions.slice(0, 7);
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
        <SectionHeader title="Recent Transactions" subtitle="Latest sales activity" />
        <Button variant="outline" size="sm" iconRight={<ArrowRight size={12} />} onClick={() => window.location.assign('/pos')}>View All</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-surface-50 dark:border-surface-800">
              <th className="text-left px-5 py-2.5 font-medium text-surface-400 whitespace-nowrap">Receipt</th>
              <th className="text-left px-3 py-2.5 font-medium text-surface-400">Customer</th>
              <th className="text-left px-3 py-2.5 font-medium text-surface-400 hidden md:table-cell">Branch</th>
              <th className="text-left px-3 py-2.5 font-medium text-surface-400 hidden lg:table-cell">Payment</th>
              <th className="text-right px-3 py-2.5 font-medium text-surface-400">Amount</th>
              <th className="text-center px-3 py-2.5 font-medium text-surface-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
            {recent.map((tx) => (
              <tr key={tx.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                <td className="px-5 py-3">
                  <span className="font-mono text-surface-600 dark:text-surface-400">{tx.receiptNo.slice(-8)}</span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={tx.customerName} size="xs" />
                    <span className="text-surface-800 dark:text-surface-200 font-medium truncate max-w-[120px]">{tx.customerName}</span>
                  </div>
                </td>
                <td className="px-3 py-3 hidden md:table-cell text-surface-500 dark:text-surface-400">{tx.branch}</td>
                <td className="px-3 py-3 hidden lg:table-cell">
                  <span className={`capitalize font-medium ${tx.paymentMethod === 'mpesa' ? 'text-emerald-600 dark:text-emerald-400' : tx.paymentMethod === 'cash' ? 'text-amber-600 dark:text-amber-400' : 'text-nexora-600 dark:text-nexora-400'}`}>
                    {tx.paymentMethod === 'mpesa' ? 'M-Pesa' : tx.paymentMethod}
                  </span>
                </td>
                <td className="px-3 py-3 text-right font-semibold text-surface-900 dark:text-surface-100">{formatCurrency(tx.total, true)}</td>
                <td className="px-3 py-3 text-center"><StatusBadge status={tx.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function BranchPerformance() {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
        <SectionHeader title="Branch Performance" subtitle="Revenue vs target" />
        <Button variant="ghost" size="sm" iconRight={<ArrowRight size={12} />} onClick={() => window.location.assign('/branches')}>Details</Button>
      </div>
      <div className="p-5">
        <MetricBarChart
          data={branchRevenueData}
          keys={[
            { key: 'revenue', color: COLORS.nexora, label: 'Revenue' },
            { key: 'target', color: COLORS.violet, label: 'Target' },
          ]}
          height={200}
          currency
        />
      </div>
      <div className="px-5 pb-4 space-y-2.5">
        {branches.slice(0, 4).map((b) => {
          const pct = Math.min(130, Math.round((b.revenue / (b.revenue * 1.2)) * 100 + Math.random() * 30));
          return (
            <div key={b.id} className="flex items-center gap-3">
              <Building2 size={14} className="text-surface-400 flex-shrink-0" />
              <span className="text-xs text-surface-600 dark:text-surface-400 w-28 truncate">{b.name}</span>
              <ProgressBar value={pct} color={pct >= 100 ? 'emerald' : pct >= 75 ? 'nexora' : 'amber'} size="xs" className="flex-1" />
              <span className={`text-xs font-semibold w-10 text-right ${pct >= 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-surface-700 dark:text-surface-300'}`}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function ActivityFeed() {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
        <SectionHeader title="Activity Feed" subtitle="Real-time business events" action={
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </div>
        } />
      </div>
      <div className="divide-y divide-surface-50 dark:divide-surface-800">
        {recentActivity.map((item) => (
          <div key={item.id} className="flex gap-3 px-5 py-3 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
            <div className="w-8 h-8 bg-surface-50 dark:bg-surface-800 rounded-lg flex items-center justify-center text-base flex-shrink-0">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-surface-800 dark:text-surface-200">{item.message}</p>
              <p className="text-xs text-surface-400 truncate">{item.detail}</p>
            </div>
            <span className="text-[10px] text-surface-400 whitespace-nowrap flex-shrink-0">{item.time}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TopProducts() {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
        <SectionHeader title="Top Products" subtitle="By revenue this month" />
      </div>
      <div className="divide-y divide-surface-50 dark:divide-surface-800">
        {topProducts.map((p) => (
          <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
            <span className="text-xs font-bold text-surface-300 dark:text-surface-700 w-4 text-center">#{p.rank}</span>
            <div className="w-8 h-8 bg-surface-100 dark:bg-surface-800 rounded-lg flex items-center justify-center text-sm">📦</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-surface-800 dark:text-surface-200 truncate">{p.name}</p>
              <p className="text-[10px] text-surface-400">{p.category} · {p.sales} units</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-surface-900 dark:text-surface-100">{formatCurrency(p.revenue, true)}</p>
              <p className="text-[10px] text-surface-400">{formatCurrency(p.price)}/unit</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TopCustomers() {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
        <SectionHeader title="Top Customers" subtitle="By lifetime value" />
        <Button variant="ghost" size="sm" iconRight={<ArrowRight size={12} />} onClick={() => window.location.assign('/customers')}>View All</Button>
      </div>
      <div className="divide-y divide-surface-50 dark:divide-surface-800">
        {topCustomers.map((c, i) => (
          <div key={c.id} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
            <span className="text-xs font-bold text-surface-300 dark:text-surface-700 w-4 text-center">#{i + 1}</span>
            <Avatar name={c.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-surface-800 dark:text-surface-200 truncate">{c.name}</p>
              <p className="text-[10px] text-surface-400">{c.county} · {c.orderCount} orders</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-surface-900 dark:text-surface-100">{formatCurrency(c.totalSpent, true)}</p>
              <StatusBadge status={c.type} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function QuickTasks() {
  const tasks = [
    { id: 1, label: 'Approve June payroll run', priority: 'high', due: 'Today', done: false },
    { id: 2, label: 'Review 5 pending leave requests', priority: 'medium', due: 'Today', done: false },
    { id: 3, label: 'Restock Electronics Dept (Nairobi)', priority: 'high', due: 'Tomorrow', done: false },
    { id: 4, label: 'Follow up: Kamau Enterprises lead', priority: 'medium', due: 'Tomorrow', done: true },
    { id: 5, label: 'Submit monthly VAT return', priority: 'high', due: 'Friday', done: false },
  ];
  const priorityColor = { high: 'danger', medium: 'warning', low: 'default' } as const;
  const [done, setDone] = useState<number[]>(tasks.filter((t) => t.done).map((t) => t.id));

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
        <SectionHeader title="Tasks" subtitle={`${tasks.length - done.length} remaining`} />
        <Button variant="ghost" size="xs" onClick={() => useAppStore.getState().addToast({ type: 'info', title: 'Add Task', message: 'Task creation form coming soon.' })}>+ Add Task</Button>
      </div>
      <div className="divide-y divide-surface-50 dark:divide-surface-800">
        {tasks.map((task) => {
          const isDone = done.includes(task.id);
          return (
            <div key={task.id} className={`flex items-start gap-3 px-5 py-3 transition-colors ${isDone ? 'opacity-50' : 'hover:bg-surface-50 dark:hover:bg-surface-800/30'}`}>
              <button
                onClick={() => setDone((d) => isDone ? d.filter((id) => id !== task.id) : [...d, task.id])}
                className={`w-4.5 h-4.5 mt-0.5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-surface-300 dark:border-surface-600 hover:border-nexora-400'}`}
                style={{ width: 18, height: 18 }}
              >
                {isDone && <CheckCircle size={10} className="text-white" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium ${isDone ? 'line-through text-surface-400' : 'text-surface-800 dark:text-surface-200'}`}>{task.label}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Clock size={9} className="text-surface-400" />
                  <span className="text-[10px] text-surface-400">{task.due}</span>
                  <Badge size="sm" variant={priorityColor[task.priority as keyof typeof priorityColor]}>{task.priority}</Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function ExecutiveDashboard() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '12m'>('30d');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-50">Good morning, James 👋</h1>
          <p className="text-sm text-surface-400 mt-0.5">Here's your business overview for today, {new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-surface-100 dark:bg-surface-800 rounded-lg p-0.5">
            {(['7d', '30d', '90d', '12m'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 h-7 text-xs font-medium rounded-md transition-all ${timeRange === r ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 shadow-sm' : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'}`}
              >
                {r}
              </button>
            ))}
          </div>
          <Button variant="primary" size="sm" icon={<Activity size={14} />} onClick={() => useAppStore.getState().addToast({ type: 'success', title: 'Live View', message: 'Real-time monitoring enabled. Data refreshing every 30s.' })}>Live View</Button>
        </div>
      </div>

      {/* KPI Grid */}
      <KPIGrid kpis={kpis} loading={loading} columns={loading ? 6 : 6} />

      {/* Revenue Chart + Health Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 overflow-hidden" padding="none">
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
            <div className="flex items-center justify-between">
              <SectionHeader title="Revenue vs Expenses" subtitle="Monthly performance overview" />
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="xs" onClick={() => useAppStore.getState().addToast({ type: 'success', title: 'Export Started', message: 'Revenue report downloading as CSV.' })}>Export</Button>
              </div>
            </div>
          </div>
          <div className="p-5">
            <RevenueAreaChart
              data={revenueData}
              keys={[
                { key: 'revenue', color: COLORS.nexora, label: 'Revenue' },
                { key: 'expenses', color: COLORS.rose, label: 'Expenses' },
                { key: 'profit', color: COLORS.emerald, label: 'Profit' },
              ]}
              height={220}
              currency
            />
          </div>
        </Card>
        <BusinessHealthScore />
      </div>

      {/* AI Insights + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><AIInsightsPanel /></div>
        <QuickTasks />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BranchPerformance />
        <TopProducts />
        <div className="space-y-4">
          <TopCustomers />
        </div>
      </div>

      {/* Sales by category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
            <SectionHeader title="Sales by Category" subtitle="Revenue breakdown" />
          </div>
          <div className="p-5">
            <DonutChart data={categoryData} currency />
          </div>
        </Card>
        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
            <SectionHeader title="Daily Sales Trend" subtitle="Last 30 days" />
          </div>
          <div className="p-5">
            <MetricBarChart
              data={dailySalesData.slice(-14)}
              keys={[{ key: 'sales', color: COLORS.nexora, label: 'Sales' }]}
              height={200}
              currency
            />
          </div>
        </Card>
      </div>

      <ActivityFeed />
    </div>
  );
}
