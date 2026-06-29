import React from 'react';
import { ShoppingCart, DollarSign, Target, Receipt } from 'lucide-react';
import { Card, Button, SectionHeader, Badge, ProgressBar } from '../../components/ui';
import { MetricBarChart } from '../../components/charts';
import { formatCurrency, formatTime, cn, COLORS } from '../../utils';
import { transactions } from '../../mock/data';
import { useAppStore } from '../../store';

export function CashierDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);
  const mySales = transactions.filter((t) => t.cashier === currentUser.name);
  const todaySales = mySales.filter((t) => new Date(t.timestamp).toDateString() === new Date().toDateString());
  const todayTotal = todaySales.reduce((s, t) => s + t.total, 0);
  const todayCount = todaySales.length;
  const avgBasket = todayCount > 0 ? Math.round(todayTotal / todayCount) : 0;
  const dailyTarget = 85000;
  const targetPct = Math.round((todayTotal / dailyTarget) * 100);

  const hourlyData = Array.from({ length: 8 }, (_, i) => {
    const hour = 8 + i;
    const hourSales = todaySales.filter((t) => new Date(t.timestamp).getHours() === hour);
    return {
      label: `${hour}:00`,
      sales: hourSales.reduce((s, t) => s + t.total, 0),
      count: hourSales.length,
    };
  });

  const paymentBreakdown = [
    { label: 'M-Pesa', value: todaySales.filter((t) => t.paymentMethod === 'mpesa').reduce((s, t) => s + t.total, 0), color: COLORS.emerald },
    { label: 'Cash', value: todaySales.filter((t) => t.paymentMethod === 'cash').reduce((s, t) => s + t.total, 0), color: COLORS.amber },
    { label: 'Card', value: todaySales.filter((t) => t.paymentMethod === 'card').reduce((s, t) => s + t.total, 0), color: COLORS.nexora },
  ];

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-50">Welcome back, {currentUser.name.split(' ')[0]}</h1>
          <p className="text-sm text-surface-400">{currentUser.branch} · Cashier · Shift: {formatTime(new Date())}</p>
        </div>
        <Button variant="primary" size="sm" icon={<ShoppingCart size={14} />} onClick={() => window.location.assign('/pos')}>
          Open POS
        </Button>
      </div>

      {/* Daily Targets */}
      <Card className="bg-gradient-to-r from-nexora-50 to-violet-50 dark:from-nexora-500/5 dark:to-violet-500/5 border-nexora-200 dark:border-nexora-500/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">Daily Target Progress</p>
            <p className="text-xs text-surface-500">KSh {formatCurrency(todayTotal)} of KSh {formatCurrency(dailyTarget)}</p>
          </div>
          <span className={cn('text-lg font-bold', targetPct >= 100 ? 'text-emerald-600' : targetPct >= 50 ? 'text-nexora-600' : 'text-amber-600')}>
            {targetPct}%
          </span>
        </div>
        <ProgressBar value={todayTotal} max={dailyTarget} color={targetPct >= 100 ? 'emerald' : targetPct >= 50 ? 'nexora' : 'amber'} size="md" />
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Sales", value: formatCurrency(todayTotal), icon: <DollarSign size={18} />, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' },
          { label: 'Transactions', value: todayCount, icon: <Receipt size={18} />, color: 'text-nexora-600 bg-nexora-50 dark:text-nexora-400 dark:bg-nexora-500/10' },
          { label: 'Avg Basket', value: formatCurrency(avgBasket), icon: <ShoppingCart size={18} />, color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10' },
          { label: 'Target Progress', value: `${targetPct}%`, icon: <Target size={18} />, color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10' },
        ].map((kpi) => (
          <Card key={kpi.label} className="flex items-center gap-4">
            <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', kpi.color)}>{kpi.icon}</div>
            <div>
              <p className="text-xs text-surface-400">{kpi.label}</p>
              <p className="text-lg font-bold text-surface-900 dark:text-surface-50">{kpi.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Hourly Sales + Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2" padding="none">
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
            <SectionHeader title="Hourly Sales" subtitle="Today's performance by hour" />
          </div>
          <div className="p-5">
            <MetricBarChart data={hourlyData} keys={[{ key: 'sales', color: COLORS.nexora, label: 'Sales' }]} height={200} currency />
          </div>
        </Card>
        <Card>
          <SectionHeader title="Payment Methods" subtitle="Today's breakdown" />
          <div className="mt-4 space-y-3">
            {paymentBreakdown.map((p) => (
              <div key={p.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-surface-600 dark:text-surface-400">{p.label}</span>
                  <span className="font-semibold text-surface-900 dark:text-surface-100">{formatCurrency(p.value)}</span>
                </div>
                <ProgressBar value={p.value} max={todayTotal || 1} color={p.label === 'M-Pesa' ? 'emerald' : p.label === 'Cash' ? 'amber' : 'nexora'} size="xs" showValue />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
          <SectionHeader title="My Recent Transactions" subtitle="Last 20 sales" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-surface-100 dark:border-surface-800">
              <tr>
                {['Receipt', 'Customer', 'Items', 'Payment', 'Total', 'Time'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-surface-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
              {mySales.slice(0, 20).map((t) => (
                <tr key={t.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-surface-500">{t.receiptNo}</td>
                  <td className="px-4 py-3 text-surface-600 dark:text-surface-400">{t.customerName || 'Walk-in'}</td>
                  <td className="px-4 py-3 text-surface-500">{t.items.length}</td>
                  <td className="px-4 py-3">
                    <Badge variant={t.paymentMethod === 'mpesa' ? 'success' : t.paymentMethod === 'card' ? 'info' : 'warning'}>{t.paymentMethod}</Badge>
                  </td>
                  <td className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">{formatCurrency(t.total)}</td>
                  <td className="px-4 py-3 text-surface-400 whitespace-nowrap">{formatTime(t.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
