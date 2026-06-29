import React, { useState } from 'react';
import { Search, Plus, Download, Building2, Users, DollarSign, TrendingUp, MapPin, Phone, Star, Eye, Edit } from 'lucide-react';
import { Card, Button, Input, Badge, StatusBadge, SectionHeader, ProgressBar } from '../../components/ui';
import { MetricBarChart } from '../../components/charts';
import { formatCurrency, formatDate, cn, COLORS } from '../../utils';
import { demoExport, demoAdd, demoView, demoEdit, demoAction } from '../../utils/demoActions';
import { branches, suppliers } from '../../mock/data';

export function Branches() {
  const [search, setSearch] = useState('');
  const filtered = branches.filter((b) => !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.county.toLowerCase().includes(search.toLowerCase()));
  const totalRevenue = branches.reduce((s, b) => s + b.revenue, 0);

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-50">Branches</h1>
          <p className="text-sm text-surface-400">{branches.length} locations across Kenya</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => demoExport('branches')}>Export</Button>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => demoAdd('branch')}>New Branch</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Branches', value: branches.length, icon: <Building2 size={18} />, color: 'text-nexora-600 bg-nexora-50 dark:text-nexora-400 dark:bg-nexora-500/10' },
          { label: 'Total Revenue', value: formatCurrency(totalRevenue, true), icon: <DollarSign size={18} />, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' },
          { label: 'Total Staff', value: branches.reduce((s, b) => s + b.employees, 0), icon: <Users size={18} />, color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10' },
          { label: 'Avg Revenue/Branch', value: formatCurrency(Math.round(totalRevenue / branches.length), true), icon: <TrendingUp size={18} />, color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10' },
        ].map((s) => (
          <Card key={s.label} className="flex items-center gap-4">
            <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', s.color)}>{s.icon}</div>
            <div>
              <p className="text-xs text-surface-400">{s.label}</p>
              <p className="text-lg font-bold text-surface-900 dark:text-surface-50">{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
          <SectionHeader title="Revenue by Branch" subtitle="Ranked by performance" />
        </div>
        <div className="p-5">
          <MetricBarChart
            data={branches.slice(0, 8).map((b) => ({ label: b.name.replace(' Branch', '').replace(' HQ', ''), value: b.revenue }))}
            keys={[{ key: 'value', color: COLORS.nexora, label: 'Revenue' }]}
            height={200}
            currency
            horizontal
          />
        </div>
      </Card>

      <div className="flex items-center gap-2 mb-2">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search branches..." icon={<Search size={14} />} className="w-56" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b, i) => {
          const target = Math.round(b.revenue * 1.2);
          const pct = Math.min(130, Math.round((b.revenue / target) * 100));
          return (
            <Card key={b.id} hover className="relative overflow-hidden" onClick={() => demoView('branch', b.name)}>
              {i === 0 && <div className="absolute top-3 right-3"><Badge variant="success">⭐ Top Branch</Badge></div>}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 bg-nexora-50 dark:bg-nexora-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 size={20} className="text-nexora-600 dark:text-nexora-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">{b.name}</p>
                  <div className="flex items-center gap-1 text-[10px] text-surface-400 mt-0.5">
                    <MapPin size={9} /> {b.location}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-[10px] text-surface-400">Revenue</p>
                  <p className="text-sm font-bold text-nexora-700 dark:text-nexora-400">{formatCurrency(b.revenue, true)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-surface-400">Employees</p>
                  <p className="text-sm font-bold text-surface-800 dark:text-surface-200">{b.employees}</p>
                </div>
                <div>
                  <p className="text-[10px] text-surface-400">Manager</p>
                  <p className="text-xs font-medium text-surface-700 dark:text-surface-300 truncate">{b.manager}</p>
                </div>
                <div>
                  <p className="text-[10px] text-surface-400">Opened</p>
                  <p className="text-xs font-medium text-surface-700 dark:text-surface-300">{formatDate(b.openedDate, { year: 'numeric', month: 'short' })}</p>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-[10px] text-surface-400 mb-1">
                  <span>Target Achievement</span>
                  <span className={cn('font-semibold', pct >= 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400')}>{pct}%</span>
                </div>
                <ProgressBar value={pct} max={130} color={pct >= 100 ? 'emerald' : pct >= 75 ? 'nexora' : 'amber'} size="sm" />
              </div>
              <div className="flex items-center justify-between">
                <StatusBadge status={b.status} />
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400" onClick={() => demoAction('Call', `Calling ${b.name}...`)}><Phone size={12} /></button>
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400" onClick={() => demoView('branch', b.name)}><Eye size={12} /></button>
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400" onClick={() => demoEdit('branch', b.name)}><Edit size={12} /></button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function Suppliers() {
  const [search, setSearch] = useState('');
  const filtered = suppliers.filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-50">Suppliers</h1>
          <p className="text-sm text-surface-400">{suppliers.length} suppliers · {suppliers.filter((s) => s.status === 'active').length} active</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => demoExport('suppliers')}>Export</Button>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => demoAdd('supplier')}>Add Supplier</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Suppliers', value: suppliers.length, color: 'text-nexora-600 bg-nexora-50 dark:text-nexora-400 dark:bg-nexora-500/10' },
          { label: 'Active', value: suppliers.filter((s) => s.status === 'active').length, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' },
          { label: 'Total Orders', value: suppliers.reduce((s, sup) => s + sup.totalOrders, 0), color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10' },
          { label: 'Total Value', value: formatCurrency(suppliers.reduce((s, sup) => s + sup.totalValue, 0), true), color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10' },
        ].map((s) => (
          <Card key={s.label}>
            <p className="text-xs text-surface-400 mb-1">{s.label}</p>
            <p className={cn('text-xl font-bold', s.color)}>{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search suppliers..." icon={<Search size={14} />} className="w-56" />
        <span className="ml-auto text-xs text-surface-400">{filtered.length} suppliers</span>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-surface-100 dark:border-surface-800">
              <tr>
                {['Supplier', 'Contact', 'Category', 'County', 'Orders', 'Total Value', 'Rating', 'Lead Time', 'Terms', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-surface-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors group">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-surface-800 dark:text-surface-200 max-w-[160px] truncate">{s.name}</p>
                    <p className="text-[10px] text-surface-400">{s.email}</p>
                  </td>
                  <td className="px-4 py-3 text-surface-600 dark:text-surface-400 max-w-[100px] truncate">{s.contact}</td>
                  <td className="px-4 py-3"><Badge variant="default">{s.category}</Badge></td>
                  <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{s.county}</td>
                  <td className="px-4 py-3 font-medium text-surface-700 dark:text-surface-300">{s.totalOrders}</td>
                  <td className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">{formatCurrency(s.totalValue, true)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star size={11} className={s.rating >= 4 ? 'text-amber-400 fill-amber-400' : 'text-surface-300'} />
                      <span className={cn('font-semibold', s.rating >= 4 ? 'text-amber-600 dark:text-amber-400' : s.rating >= 3 ? 'text-surface-600 dark:text-surface-400' : 'text-rose-500')}>{s.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{s.leadTime}</td>
                  <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{s.paymentTerms}</td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Branches;
