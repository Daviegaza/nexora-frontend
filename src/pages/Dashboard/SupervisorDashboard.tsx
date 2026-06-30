import { useState } from 'react';
import {
  Eye,
  ShoppingCart,
  RotateCcw,
  AlertTriangle,
  Users,
  Package,
  TrendingUp,
  Clock,
  PlayCircle,
  StopCircle,
  ArrowRight,
} from 'lucide-react';
import {
  Card,
  Button,
  Badge,
  ProgressBar,
  SectionHeader,
  Divider,
  EmptyState,
} from '../../components/ui';
import { RevenueAreaChart } from '../../components/charts';
import { KPICard } from '../../components/dashboard/KPICard';
import { formatCurrency, formatNumber } from '../../utils';
import { transactions, employees } from '../../mock/data';
import { useNavigate } from 'react-router-dom';

/**
 * Supervisor dashboard — floor oversight, not exec analytics.
 * Focus: live shift state, cashier monitoring, pending approvals (voids/refunds),
 * floor alerts, branch sales pace vs target, and shift open/close controls.
 */
export function SupervisorDashboard() {
  const navigate = useNavigate();
  const [shiftOpen, setShiftOpen] = useState(true);

  const todaysSales = transactions.slice(0, 24);
  const salesTotal = todaysSales.reduce((s, t) => s + t.total, 0);
  const target = 180_000;
  const pace = Math.min(100, (salesTotal / target) * 100);

  const cashiers = employees.filter((e) => e.role === 'cashier').slice(0, 6);

  const pendingApprovals = [
    {
      id: 'r1',
      kind: 'void',
      amount: 1450,
      cashier: 'Mary Wanjiku',
      txn: 'RCP-2024-002731',
      reason: 'Wrong item',
    },
    {
      id: 'r2',
      kind: 'refund',
      amount: 3200,
      cashier: 'John Otieno',
      txn: 'RCP-2024-002714',
      reason: 'Defective product',
    },
    {
      id: 'r3',
      kind: 'discount',
      amount: 800,
      cashier: 'Mary Wanjiku',
      txn: 'RCP-2024-002729',
      reason: 'Manager override',
    },
  ];

  const floorAlerts = [
    { id: 'a1', level: 'warning', text: 'Low float — KSh 4,200 in till #2' },
    { id: 'a2', level: 'info', text: 'Restock alert: Coca-Cola 500ml below reorder' },
    { id: 'a3', level: 'error', text: 'Receipt printer at till #3 offline' },
  ];

  const chartData = Array.from({ length: 12 }, (_, i) => ({
    label: `${8 + i}:00`,
    sales: Math.round(8000 + Math.random() * 20000 * (i < 4 ? 0.5 : i > 9 ? 0.8 : 1.2)),
  }));

  return (
    <div className="p-6 space-y-5">
      <SectionHeader
        title="Supervisor — Floor Oversight"
        subtitle="Live shift, cashier performance, and pending approvals"
        action={
          <div className="flex gap-2">
            <Badge variant={shiftOpen ? 'success' : 'default'} dot>
              {shiftOpen ? 'Shift Open' : 'Shift Closed'}
            </Badge>
            <Button
              variant={shiftOpen ? 'danger' : 'success'}
              size="sm"
              icon={shiftOpen ? <StopCircle size={14} /> : <PlayCircle size={14} />}
              onClick={() => setShiftOpen(!shiftOpen)}
            >
              {shiftOpen ? 'Close Shift' : 'Open Shift'}
            </Button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          kpi={{
            label: "Today's Sales",
            value: formatCurrency(salesTotal),
            change: 12,
            changeLabel: 'vs yesterday',
            trend: 'up',
            color: 'nexora',
            icon: 'ShoppingCart',
          }}
        />
        <KPICard
          kpi={{
            label: 'Transactions',
            value: formatNumber(todaysSales.length),
            change: 5,
            changeLabel: 'vs yesterday',
            trend: 'up',
            color: 'emerald',
            icon: 'Activity',
          }}
        />
        <KPICard
          kpi={{
            label: 'Avg Basket',
            value: formatCurrency(salesTotal / Math.max(1, todaysSales.length)),
            change: -2,
            changeLabel: 'vs yesterday',
            trend: 'down',
            color: 'amber',
            icon: 'Tag',
          }}
        />
        <KPICard
          kpi={{
            label: 'Active Cashiers',
            value: cashiers.length,
            change: 0,
            changeLabel: 'on shift',
            trend: 'neutral',
            color: 'violet',
            icon: 'Users',
          }}
        />
      </div>

      {/* Pace + alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                Hourly Sales Pace
              </h3>
              <p className="text-xs text-surface-400">
                Target: {formatCurrency(target)} · On pace: {pace.toFixed(0)}%
              </p>
            </div>
            <Badge variant={pace >= 100 ? 'success' : pace >= 60 ? 'warning' : 'danger'} dot>
              {pace >= 100 ? 'Ahead' : pace >= 60 ? 'On track' : 'Behind'}
            </Badge>
          </div>
          <ProgressBar
            value={salesTotal}
            max={target}
            color={pace >= 100 ? 'emerald' : pace >= 60 ? 'nexora' : 'rose'}
            size="md"
          />
          <Divider className="my-4" />
          <RevenueAreaChart
            data={chartData}
            keys={[{ key: 'sales', color: '#5470f1', label: 'Sales' }]}
            currency
            height={180}
          />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500" /> Floor Alerts
            </h3>
            <Badge variant="warning" size="sm">
              {floorAlerts.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {floorAlerts.map((a) => (
              <div
                key={a.id}
                className={`flex items-start gap-2 p-2.5 rounded-lg text-xs ${
                  a.level === 'error'
                    ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300'
                    : a.level === 'warning'
                      ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300'
                      : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300'
                }`}
              >
                <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                <span className="leading-snug">{a.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Approvals */}
      <Card>
        <SectionHeader
          title="Pending Approvals"
          subtitle="Voids, refunds, and discount overrides waiting on you"
          action={
            <Badge variant="warning" dot>
              {pendingApprovals.length} pending
            </Badge>
          }
        />
        <div className="mt-3 divide-y divide-surface-100 dark:divide-surface-800">
          {pendingApprovals.length === 0 ? (
            <EmptyState icon={<RotateCcw size={20} />} title="No pending approvals" />
          ) : (
            pendingApprovals.map((a) => (
              <div key={a.id} className="py-3 flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-50 dark:bg-amber-500/10 text-amber-600">
                  {a.kind === 'void' ? (
                    <RotateCcw size={14} />
                  ) : a.kind === 'refund' ? (
                    <ShoppingCart size={14} />
                  ) : (
                    <TrendingUp size={14} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-surface-800 dark:text-surface-200 flex items-center gap-2">
                    <span className="capitalize">{a.kind}</span>
                    <span className="font-bold text-surface-900 dark:text-surface-100">
                      {formatCurrency(a.amount)}
                    </span>
                    <span className="text-surface-400 font-mono">{a.txn}</span>
                  </div>
                  <div className="text-[10px] text-surface-400 mt-0.5">
                    {a.cashier} · {a.reason}
                  </div>
                </div>
                <Button size="xs" variant="outline">
                  Reject
                </Button>
                <Button size="xs" variant="primary">
                  Approve
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Cashiers on shift */}
      <Card>
        <SectionHeader
          title="Cashiers on Shift"
          subtitle="Live till status and performance"
          action={
            <Button
              size="xs"
              variant="ghost"
              iconRight={<ArrowRight size={12} />}
              onClick={() => navigate('/employees')}
            >
              All staff
            </Button>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          {cashiers.map((c) => {
            const sales = Math.floor(8000 + Math.random() * 24000);
            const txns = Math.floor(8 + Math.random() * 22);
            return (
              <div
                key={c.id}
                className="p-3 rounded-xl border border-surface-200 dark:border-surface-800 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-nexora-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                  {c.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-surface-800 dark:text-surface-200 truncate">
                    {c.name}
                  </div>
                  <div className="text-[10px] text-surface-400 flex items-center gap-2 mt-0.5">
                    <Clock size={9} /> Till {(c.id.charCodeAt(2) % 4) + 1} · {txns} txns ·{' '}
                    {formatCurrency(sales, true)}
                  </div>
                </div>
                <Badge variant="success" size="sm" dot>
                  Active
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          variant="primary"
          icon={<ShoppingCart size={16} />}
          onClick={() => navigate('/pos')}
        >
          Open POS
        </Button>
        <Button variant="outline" icon={<Eye size={16} />} onClick={() => navigate('/reports')}>
          Shift Report
        </Button>
        <Button
          variant="outline"
          icon={<Package size={16} />}
          onClick={() => navigate('/inventory')}
        >
          Stock Check
        </Button>
        <Button variant="outline" icon={<Users size={16} />} onClick={() => navigate('/customers')}>
          Customer Lookup
        </Button>
      </div>
    </div>
  );
}
