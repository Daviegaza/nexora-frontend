import React, { useState, useMemo } from 'react';
import { Search, Plus, Download, Star, Truck, Phone, MapPin, Package, DollarSign, Clock } from 'lucide-react';
import { Card, Button, Input, Badge, ProgressBar } from '../../components/ui';
import { formatCurrency, formatDate, cn } from '../../utils';
import { demoExport, demoAdd, demoView } from '../../utils/demoActions';
import { suppliers } from '../../mock/data';

export default function Suppliers() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const categories = ['all', ...Array.from(new Set(suppliers.map((s) => s.category)))];

  const filtered = useMemo(() => suppliers.filter((s) => {
    if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [search, categoryFilter, statusFilter]);

  const totalValue = suppliers.reduce((sum, s) => sum + s.totalValue, 0);
  const totalOrders = suppliers.reduce((sum, s) => sum + s.totalOrders, 0);
  const avgRating = Math.round(suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length * 10) / 10;
  const activeCount = suppliers.filter((s) => s.status === 'active').length;

  const statCards = [
    { label: 'Total Suppliers', value: suppliers.length, icon: <Truck size={18} />, color: 'text-nexora-600 bg-nexora-50 dark:text-nexora-400 dark:bg-nexora-500/10' },
    { label: 'Total Procurement', value: formatCurrency(totalValue, true), icon: <DollarSign size={18} />, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' },
    { label: 'Avg Rating', value: `${avgRating}/5`, icon: <Star size={18} />, color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10' },
    { label: 'Active', value: `${activeCount} of ${suppliers.length}`, icon: <Package size={18} />, color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10' },
  ];

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-50">Suppliers</h1>
          <p className="text-sm text-surface-400">{suppliers.length} suppliers · {totalOrders.toLocaleString()} total orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => demoExport('suppliers')}>Export</Button>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => demoAdd('supplier')}>Add Supplier</Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="flex items-center gap-4">
            <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', s.color)}>{s.icon}</div>
            <div>
              <p className="text-xs text-surface-400">{s.label}</p>
              <p className="text-lg font-bold text-surface-900 dark:text-surface-50">{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search suppliers..." icon={<Search size={14} />} className="w-56" />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-9 px-3 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg text-xs text-surface-700 dark:text-surface-300 outline-none">
          {categories.map((c) => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 px-3 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg text-xs text-surface-700 dark:text-surface-300 outline-none">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <span className="ml-auto text-xs text-surface-400">{filtered.length} suppliers</span>
      </div>

      {/* Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-surface-100 dark:border-surface-800">
              <tr>
                {['Supplier', 'Contact', 'Category', 'Orders', 'Total Value', 'Rating', 'Payment Terms', 'Lead Time', 'Last Order', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-surface-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors group cursor-pointer" onClick={() => demoView('supplier', s.name)}>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold text-surface-800 dark:text-surface-200">{s.name}</p>
                      <p className="text-[10px] text-surface-400">{s.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-surface-500 dark:text-surface-400 text-[11px]">
                        <Phone size={10} /> {s.phone}
                      </div>
                      <div className="flex items-center gap-1 text-surface-500 dark:text-surface-400 text-[11px]">
                        <MapPin size={10} /> {s.county}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="default">{s.category}</Badge>
                  </td>
                  <td className="px-4 py-3 font-medium text-surface-700 dark:text-surface-300">{s.totalOrders}</td>
                  <td className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">{formatCurrency(s.totalValue, true)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={s.rating * 20} color={s.rating >= 4 ? 'emerald' : s.rating >= 3 ? 'nexora' : 'rose'} size="xs" className="w-12" />
                      <span className={cn('font-semibold', s.rating >= 4 ? 'text-emerald-600' : s.rating >= 3 ? 'text-nexora-600' : 'text-rose-500')}>{s.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-surface-500 dark:text-surface-400 whitespace-nowrap">{s.paymentTerms}</td>
                  <td className="px-4 py-3 text-surface-500 dark:text-surface-400 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Clock size={10} /> {s.leadTime}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-surface-500 dark:text-surface-400 whitespace-nowrap">{formatDate(s.lastOrder)}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'inline-flex items-center gap-1.5 rounded-full font-medium text-xs px-2 py-0.5',
                      s.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : 'bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400'
                    )}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', s.status === 'active' ? 'bg-emerald-400' : 'bg-surface-400')} />
                      {s.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
