import React, { useState, useMemo } from 'react';
import { Search, Plus, Download, AlertTriangle, Package, TrendingDown, ArrowUpDown, Eye, Edit, BarChart2, RefreshCw } from 'lucide-react';
import { Card, Button, Input, Badge, StatusBadge, SectionHeader, Tabs, ProgressBar } from '../../components/ui';
import { MetricBarChart, DonutChart } from '../../components/charts';
import { formatCurrency, formatDate, cn, COLORS } from '../../utils';
import { demoToast, demoExport, demoAdd, demoView, demoEdit, demoRefresh } from '../../utils/demoActions';
import { products, stockMovements, purchaseOrders, suppliers } from '../../mock/data';
import type { Product } from '../../types';

const tabItems = [
  { id: 'stock', label: 'Stock', count: products.length },
  { id: 'movements', label: 'Movements', count: stockMovements.length },
  { id: 'orders', label: 'Purchase Orders', count: purchaseOrders.length },
  { id: 'analytics', label: 'Analytics' },
];

const categories = ['All', 'Electronics', 'FMCG', 'Clothing', 'Hardware', 'Pharmaceuticals', 'Food & Beverage', 'Stationery', 'Furniture', 'Cosmetics'];

function StockTable({ data }: { data: Product[] }) {
  const [sort, setSort] = useState<{ key: keyof Product; dir: 'asc' | 'desc' }>({ key: 'name', dir: 'asc' });

  function toggleSort(key: keyof Product) {
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
  }

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const av = a[sort.key] ?? '';
      const bv = b[sort.key] ?? '';
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [data, sort]);

  function SortableHeader({ col, label }: { col: keyof Product; label: string }) {
    const active = sort.key === col;
    return (
      <th
        onClick={() => toggleSort(col)}
        className="text-left px-4 py-3 font-medium text-surface-400 text-xs cursor-pointer hover:text-surface-600 dark:hover:text-surface-300 whitespace-nowrap select-none"
      >
        <span className={cn('flex items-center gap-1', active && 'text-nexora-600 dark:text-nexora-400')}>
          {label}
          <ArrowUpDown size={10} className={active ? 'opacity-100' : 'opacity-40'} />
        </span>
      </th>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead className="border-b border-surface-100 dark:border-surface-800">
          <tr>
            <SortableHeader col="name" label="Product" />
            <SortableHeader col="sku" label="SKU" />
            <SortableHeader col="category" label="Category" />
            <SortableHeader col="price" label="Price" />
            <SortableHeader col="cost" label="Cost" />
            <SortableHeader col="stock" label="Stock" />
            <th className="text-left px-4 py-3 font-medium text-surface-400 text-xs">Stock Level</th>
            <SortableHeader col="supplier" label="Supplier" />
            <SortableHeader col="status" label="Status" />
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
          {sorted.map((p) => {
            const pct = Math.min(100, (p.stock / (p.minStock * 3)) * 100);
            const barColor = p.status === 'out_of_stock' ? 'rose' : p.status === 'low_stock' ? 'amber' : 'emerald';
            return (
              <tr key={p.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-surface-100 dark:bg-surface-800 rounded-lg flex items-center justify-center text-sm flex-shrink-0">📦</div>
                    <div>
                      <p className="font-medium text-surface-800 dark:text-surface-200 line-clamp-1">{p.name}</p>
                      {p.expiryDate && (
                        <p className="text-[10px] text-amber-500 flex items-center gap-0.5 mt-0.5">
                          <AlertTriangle size={9} /> Exp: {formatDate(p.expiryDate, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-surface-500 dark:text-surface-400">{p.sku}</td>
                <td className="px-4 py-3">
                  <Badge variant="default">{p.category}</Badge>
                </td>
                <td className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">{formatCurrency(p.price)}</td>
                <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{formatCurrency(p.cost)}</td>
                <td className="px-4 py-3">
                  <span className={cn('font-bold', p.status === 'out_of_stock' ? 'text-rose-500' : p.status === 'low_stock' ? 'text-amber-500' : 'text-surface-800 dark:text-surface-200')}>
                    {p.stock}
                  </span>
                  <span className="text-surface-400 ml-1">{p.unit}</span>
                </td>
                <td className="px-4 py-3 w-28">
                  <ProgressBar value={pct} color={barColor} size="xs" />
                  <p className="text-[10px] text-surface-400 mt-1">Min: {p.minStock}</p>
                </td>
                <td className="px-4 py-3 text-surface-500 dark:text-surface-400 max-w-[120px] truncate">{p.supplier}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => demoView('product', p.name)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-nexora-600">
                      <Eye size={13} />
                    </button>
                    <button onClick={() => demoEdit(p.name)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-nexora-600">
                      <Edit size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MovementsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead className="border-b border-surface-100 dark:border-surface-800">
          <tr>
            {['Product', 'Type', 'Qty', 'From', 'To', 'Reference', 'Date', 'By'].map((h) => (
              <th key={h} className="text-left px-4 py-3 font-medium text-surface-400 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
          {stockMovements.map((m) => (
            <tr key={m.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
              <td className="px-4 py-3 font-medium text-surface-800 dark:text-surface-200 max-w-[160px] truncate">{m.productName}</td>
              <td className="px-4 py-3">
                <Badge
                  variant={m.type === 'in' ? 'success' : m.type === 'out' ? 'danger' : m.type === 'transfer' ? 'info' : 'warning'}
                  dot
                >
                  {m.type.charAt(0).toUpperCase() + m.type.slice(1)}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <span className={cn('font-bold', m.type === 'in' ? 'text-emerald-600 dark:text-emerald-400' : m.type === 'out' ? 'text-rose-500' : 'text-surface-700 dark:text-surface-300')}>
                  {m.type === 'in' ? '+' : m.type === 'out' ? '-' : '±'}{m.quantity}
                </span>
              </td>
              <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{m.fromBranch ?? '—'}</td>
              <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{m.toBranch ?? '—'}</td>
              <td className="px-4 py-3 font-mono text-surface-500 dark:text-surface-400">{m.reference}</td>
              <td className="px-4 py-3 text-surface-500 dark:text-surface-400 whitespace-nowrap">{formatDate(m.date)}</td>
              <td className="px-4 py-3 text-surface-500 dark:text-surface-400 max-w-[100px] truncate">{m.performedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PurchaseOrdersTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead className="border-b border-surface-100 dark:border-surface-800">
          <tr>
            {['PO Number', 'Supplier', 'Branch', 'Items', 'Total', 'Expected', 'Status', ''].map((h) => (
              <th key={h} className="text-left px-4 py-3 font-medium text-surface-400 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
          {purchaseOrders.map((po) => (
            <tr key={po.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors group">
              <td className="px-4 py-3 font-mono font-semibold text-nexora-700 dark:text-nexora-400">{po.poNumber}</td>
              <td className="px-4 py-3 font-medium text-surface-800 dark:text-surface-200 max-w-[140px] truncate">{po.supplierName}</td>
              <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{po.branch}</td>
              <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{po.items.length} items</td>
              <td className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">{formatCurrency(po.total, true)}</td>
              <td className="px-4 py-3 text-surface-500 dark:text-surface-400 whitespace-nowrap">{formatDate(po.expectedDelivery)}</td>
              <td className="px-4 py-3"><StatusBadge status={po.status} /></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="xs" icon={<Eye size={12} />} onClick={() => demoView('purchase order', po.poNumber)}>View</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InventoryAnalytics() {
  const categoryTotals = categories.slice(1).map((cat, i) => ({
    label: cat,
    value: products.filter((p) => p.category === cat).reduce((s, p) => s + p.stock * p.cost, 0),
    color: Object.values(COLORS)[i % 8],
  }));

  const statusData = [
    { label: 'Active', value: products.filter((p) => p.status === 'active').length, color: COLORS.emerald },
    { label: 'Low Stock', value: products.filter((p) => p.status === 'low_stock').length, color: COLORS.amber },
    { label: 'Out of Stock', value: products.filter((p) => p.status === 'out_of_stock').length, color: COLORS.rose },
    { label: 'Inactive', value: products.filter((p) => p.status === 'inactive').length, color: '#94a3b8' },
  ];

  const movementData = ['in', 'out', 'transfer', 'adjustment'].map((type) => ({
    label: type.charAt(0).toUpperCase() + type.slice(1),
    value: stockMovements.filter((m) => m.type === type).reduce((s, m) => s + m.quantity, 0),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <Card>
        <SectionHeader title="Stock by Status" subtitle="Product availability breakdown" />
        <DonutChart data={statusData} height={200} />
        <div className="grid grid-cols-2 gap-2 mt-2">
          {statusData.map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
              <span className="text-surface-500 dark:text-surface-400">{s.label}</span>
              <span className="font-semibold text-surface-800 dark:text-surface-200 ml-auto">{s.value}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="lg:col-span-2">
        <SectionHeader title="Inventory Value by Category" subtitle="Cost value of stock held" />
        <MetricBarChart
          data={categoryTotals.slice(0, 8).map((c) => ({ label: c.label.slice(0, 8), value: c.value }))}
          keys={[{ key: 'value', color: COLORS.nexora, label: 'Value' }]}
          height={220}
          currency
        />
      </Card>

      <Card>
        <SectionHeader title="Stock Movements" subtitle="Last 30 days by type" />
        <div className="space-y-3 mt-4">
          {movementData.map((m, i) => (
            <div key={m.label} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: `${Object.values(COLORS)[i]}20`, color: Object.values(COLORS)[i] }}>
                {m.label === 'In' ? '↓' : m.label === 'Out' ? '↑' : m.label === 'Transfer' ? '⇄' : '~'}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-surface-700 dark:text-surface-300">{m.label}</span>
                  <span className="text-xs font-bold text-surface-900 dark:text-surface-100">{m.value.toLocaleString()}</span>
                </div>
                <ProgressBar value={m.value} max={Math.max(...movementData.map((x) => x.value))} color={['emerald', 'rose', 'nexora', 'amber'][i] as 'emerald'} size="xs" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="lg:col-span-2">
        <SectionHeader title="Top Suppliers by Value" subtitle="Total purchase order value" />
        <div className="space-y-3 mt-4">
          {suppliers.slice(0, 6).map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
              <span className="text-xs font-bold text-surface-300 dark:text-surface-700 w-4">#{i + 1}</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-surface-700 dark:text-surface-300 truncate max-w-[200px]">{s.name}</span>
                  <span className="text-xs font-semibold text-surface-900 dark:text-surface-100 ml-2">{formatCurrency(s.totalValue, true)}</span>
                </div>
                <ProgressBar value={s.totalValue} max={suppliers[0].totalValue} color="nexora" size="xs" />
              </div>
              <Badge variant={s.rating >= 4.5 ? 'success' : s.rating >= 3.5 ? 'warning' : 'danger'}>
                ⭐ {s.rating}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function Inventory() {
  const [activeTab, setActiveTab] = useState('stock');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category !== 'All' && p.category !== category) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, category, statusFilter]);

  const lowStock = products.filter((p) => p.status === 'low_stock').length;
  const outOfStock = products.filter((p) => p.status === 'out_of_stock').length;
  const totalValue = products.reduce((s, p) => s + p.stock * p.cost, 0);

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-50">Inventory</h1>
          <p className="text-sm text-surface-400">{products.length} products across {categories.length - 1} categories</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => demoExport('inventory')}>Export</Button>
          <Button variant="outline" size="sm" icon={<RefreshCw size={14} />} onClick={() => { demoToast('Sync', 'Inventory syncing with suppliers...'); demoRefresh(); }}>Sync</Button>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => demoAdd('product')}>Add Product</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: products.length, icon: <Package size={18} />, color: 'text-nexora-600 bg-nexora-50 dark:text-nexora-400 dark:bg-nexora-500/10' },
          { label: 'Total Stock Value', value: formatCurrency(totalValue, true), icon: <BarChart2 size={18} />, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' },
          { label: 'Low Stock', value: lowStock, icon: <TrendingDown size={18} />, color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10' },
          { label: 'Out of Stock', value: outOfStock, icon: <AlertTriangle size={18} />, color: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10' },
        ].map((stat) => (
          <Card key={stat.label} className="flex items-center gap-4">
            <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', stat.color)}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-surface-400">{stat.label}</p>
              <p className="text-lg font-bold text-surface-900 dark:text-surface-50">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-4">
        <Tabs tabs={tabItems} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab content */}
      {activeTab === 'stock' && (
        <Card padding="none" className="overflow-hidden">
          {/* Filters */}
          <div className="px-4 py-3 border-b border-surface-100 dark:border-surface-800 flex flex-wrap items-center gap-2">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products, SKU..." icon={<Search size={14} />} className="w-56" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-9 px-3 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg text-xs text-surface-700 dark:text-surface-300 outline-none"
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg text-xs text-surface-700 dark:text-surface-300 outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="inactive">Inactive</option>
            </select>
            <span className="ml-auto text-xs text-surface-400">{filtered.length} products</span>
          </div>
          <StockTable data={filtered} />
        </Card>
      )}

      {activeTab === 'movements' && (
        <Card padding="none" className="overflow-hidden">
          <div className="px-4 py-3 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
            <SectionHeader title="Stock Movements" subtitle="All inventory movement history" />
            <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => demoAdd('stock movement')}>Record Movement</Button>
          </div>
          <MovementsTable />
        </Card>
      )}

      {activeTab === 'orders' && (
        <Card padding="none" className="overflow-hidden">
          <div className="px-4 py-3 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
            <SectionHeader title="Purchase Orders" subtitle="All purchase orders" />
            <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => demoAdd('purchase order')}>New PO</Button>
          </div>
          <PurchaseOrdersTable />
        </Card>
      )}

      {activeTab === 'analytics' && <InventoryAnalytics />}
    </div>
  );
}
