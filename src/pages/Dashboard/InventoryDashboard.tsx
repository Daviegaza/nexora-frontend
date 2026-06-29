import React from 'react';
import { Package, AlertTriangle, TrendingDown, ShoppingCart, Truck, DollarSign } from 'lucide-react';
import { Card, Button, SectionHeader, Badge } from '../../components/ui';
import { MetricBarChart, DonutChart } from '../../components/charts';
import { formatCurrency, formatDate, cn, COLORS } from '../../utils';
import { products, stockMovements, purchaseOrders, suppliers } from '../../mock/data';
import { useAppStore } from '../../store';
import { demoExport, demoView } from '../../utils/demoActions';

export function InventoryDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);
  const lowStock = products.filter((p) => p.status === 'low_stock' || p.status === 'out_of_stock');
  const outOfStock = products.filter((p) => p.status === 'out_of_stock');
  const totalValue = products.reduce((s, p) => s + p.stock * p.cost, 0);
  const pendingPOs = purchaseOrders.filter((po) => po.status === 'sent' || po.status === 'draft');
  const recentMovements = stockMovements.slice(0, 20);

  const categoryStock = [...new Set(products.map((p) => p.category))].map((cat, i) => ({
    label: cat,
    value: products.filter((p) => p.category === cat).reduce((s, p) => s + p.stock * p.cost, 0),
    color: Object.values(COLORS)[i % Object.values(COLORS).length],
  }));

  const monthlyMovements = Array.from({ length: 6 }, (_, i) => ({
    label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
    incoming: Math.round(Math.random() * 2000 + 500),
    outgoing: Math.round(Math.random() * 1500 + 400),
  }));

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-50">Inventory Dashboard</h1>
          <p className="text-sm text-surface-400">{products.length} products · {suppliers.length} suppliers · Welcome, {currentUser.name.split(' ')[0]}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Truck size={14} />} onClick={() => demoExport('Inventory')}>Export</Button>
          <Button variant="primary" size="sm" icon={<Package size={14} />} onClick={() => window.location.assign('/inventory')}>Inventory Center</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Products', value: products.length, icon: <Package size={18} />, color: 'text-nexora-600 bg-nexora-50 dark:text-nexora-400 dark:bg-nexora-500/10' },
          { label: 'Low Stock Items', value: lowStock.length, icon: <AlertTriangle size={18} />, color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10', alert: lowStock.length > 0 },
          { label: 'Out of Stock', value: outOfStock.length, icon: <TrendingDown size={18} />, color: 'text-rose-500 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10', alert: outOfStock.length > 0 },
          { label: 'Stock Value', value: formatCurrency(totalValue, true), icon: <DollarSign size={18} />, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' },
          { label: 'Pending POs', value: pendingPOs.length, icon: <ShoppingCart size={18} />, color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10' },
        ].map((kpi) => (
          <Card key={kpi.label} className={cn('flex flex-col items-center text-center py-4', kpi.alert && 'border-amber-300 dark:border-amber-500/30')}>
            <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center mb-3', kpi.color)}>{kpi.icon}</div>
            <p className="text-lg font-bold text-surface-900 dark:text-surface-50">{kpi.value}</p>
            <p className="text-xs text-surface-400">{kpi.label}</p>
          </Card>
        ))}
      </div>

      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <Card className="border-amber-300 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-amber-500" />
            <SectionHeader title="Low Stock Alerts" subtitle={`${lowStock.length} items need attention`} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {lowStock.slice(0, 8).map((p) => (
              <div key={p.id} className="flex items-center gap-2 p-2.5 bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 cursor-pointer hover:border-nexora-300 transition-colors" onClick={() => demoView('product', p.name)}>
                <div className="w-8 h-8 bg-rose-50 dark:bg-rose-500/10 rounded-lg flex items-center justify-center flex-shrink-0 text-rose-500 text-xs font-bold">{p.stock}</div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-surface-700 dark:text-surface-300 truncate">{p.name}</p>
                  <p className="text-[10px] text-surface-400">{p.sku} · Min: {p.minStock}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Stock Value + Movements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <SectionHeader title="Stock Value by Category" subtitle="Current valuation" />
          <DonutChart data={categoryStock} height={200} currency />
        </Card>
        <Card padding="none">
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
            <SectionHeader title="Stock Movements" subtitle="6-month trend" />
          </div>
          <div className="p-5">
            <MetricBarChart data={monthlyMovements} keys={[
              { key: 'incoming', color: COLORS.emerald, label: 'Incoming' },
              { key: 'outgoing', color: COLORS.rose, label: 'Outgoing' },
            ]} height={200} />
          </div>
        </Card>
      </div>

      {/* Recent Stock Movements */}
      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
          <SectionHeader title="Recent Stock Movements" subtitle="Last 20 transactions" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-surface-100 dark:border-surface-800">
              <tr>
                {['Product', 'Type', 'Quantity', 'From', 'To', 'Reference', 'Date', 'By'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-surface-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
              {recentMovements.map((m) => (
                <tr key={m.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-surface-700 dark:text-surface-300">{m.productName}</td>
                  <td className="px-4 py-3">
                    <Badge variant={m.type === 'in' ? 'success' : m.type === 'out' ? 'danger' : 'info'}>{m.type}</Badge>
                  </td>
                  <td className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">{m.quantity}</td>
                  <td className="px-4 py-3 text-surface-500">{m.fromBranch || '—'}</td>
                  <td className="px-4 py-3 text-surface-500">{m.toBranch || '—'}</td>
                  <td className="px-4 py-3 text-surface-400 font-mono text-[10px]">{m.reference}</td>
                  <td className="px-4 py-3 text-surface-400 whitespace-nowrap">{formatDate(m.date)}</td>
                  <td className="px-4 py-3 text-surface-500">{m.performedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
