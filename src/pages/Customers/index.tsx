import React, { useState, useMemo } from 'react';
import { Search, Plus, Download, MapPin, Star, Users, DollarSign, ShoppingCart } from 'lucide-react';
import { Card, Button, Input, Avatar, StatusBadge, ProgressBar } from '../../components/ui';
import { formatCurrency, formatDate, cn } from '../../utils';
import { demoExport, demoAdd, demoView } from '../../utils/demoActions';
import { customers } from '../../mock/data';

export default function Customers() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useMemo(() => customers.filter((c) => {
    if (typeFilter !== 'all' && c.type !== typeFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.phone.includes(search) && !c.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).slice(0, 60), [search, typeFilter]);

  const totalSpent = customers.reduce((s, c) => s + c.totalSpent, 0);
  const vipCount = customers.filter((c) => c.type === 'vip').length;
  const activeCount = customers.filter((c) => c.status === 'active').length;

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-50">Customers</h1>
          <p className="text-sm text-surface-400">{customers.length} customers · {activeCount} active</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => demoExport('customers')}>Export</Button>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => demoAdd('customer')}>Add Customer</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: customers.length, icon: <Users size={18} />, color: 'text-nexora-600 bg-nexora-50 dark:text-nexora-400 dark:bg-nexora-500/10' },
          { label: 'Total Revenue', value: formatCurrency(totalSpent, true), icon: <DollarSign size={18} />, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' },
          { label: 'VIP Customers', value: vipCount, icon: <Star size={18} />, color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10' },
          { label: 'Avg. Order Value', value: formatCurrency(Math.round(totalSpent / customers.reduce((s, c) => s + c.orderCount, 0)), true), icon: <ShoppingCart size={18} />, color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10' },
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

      <div className="flex items-center gap-2">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." icon={<Search size={14} />} className="w-64" />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-9 px-3 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg text-xs text-surface-700 dark:text-surface-300 outline-none">
          <option value="all">All Types</option>
          <option value="vip">VIP</option>
          <option value="wholesale">Wholesale</option>
          <option value="retail">Retail</option>
        </select>
        <span className="ml-auto text-xs text-surface-400">{filtered.length} customers</span>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-surface-100 dark:border-surface-800">
              <tr>
                {['Customer', 'Phone', 'County', 'Type', 'Orders', 'Total Spent', 'Loyalty', 'Last Purchase', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-surface-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors group cursor-pointer" onClick={() => demoView('customer', c.name)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={c.name} size="sm" />
                      <div>
                        <p className="font-semibold text-surface-800 dark:text-surface-200">{c.name}</p>
                        <p className="text-[10px] text-surface-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-surface-600 dark:text-surface-400">{c.phone}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-surface-500 dark:text-surface-400">
                      <MapPin size={10} /> {c.county}
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={c.type} /></td>
                  <td className="px-4 py-3 font-medium text-surface-700 dark:text-surface-300">{c.orderCount}</td>
                  <td className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">{formatCurrency(c.totalSpent, true)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={c.loyalty} color={c.loyalty > 70 ? 'emerald' : 'nexora'} size="xs" className="w-14" />
                      <span className="text-surface-500">{c.loyalty}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-surface-500 dark:text-surface-400 whitespace-nowrap">{formatDate(c.lastPurchase)}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
