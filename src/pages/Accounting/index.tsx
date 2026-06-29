import React, { useState } from 'react';
import { FileText, Plus, Download, Eye, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, Button, StatusBadge, SectionHeader, Tabs } from '../../components/ui';
import { RevenueAreaChart, MetricBarChart, DonutChart } from '../../components/charts';
import { formatCurrency, formatDate, cn, COLORS } from '../../utils';
import { demoExport, demoAdd, demoView, demoToast } from '../../utils/demoActions';
import { invoices, revenueData } from '../../mock/data';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'invoices', label: 'Invoices', count: invoices.length },
  { id: 'pl', label: 'P&L' },
  { id: 'cashflow', label: 'Cash Flow' },
];

export default function Accounting() {
  const [activeTab, setActiveTab] = useState('overview');

  const totalInvoiced = invoices.reduce((s, inv) => s + inv.total, 0);
  const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((s, inv) => s + inv.total, 0);
  const totalOverdue = invoices.filter((i) => i.status === 'overdue').reduce((s, inv) => s + inv.total, 0);
  const totalOutstanding = invoices.filter((i) => ['sent', 'draft'].includes(i.status)).reduce((s, inv) => s + inv.total, 0);

  const expenseCategories = [
    { label: 'Payroll', value: 8320000, color: COLORS.nexora },
    { label: 'Rent & Utilities', value: 2100000, color: COLORS.violet },
    { label: 'Inventory', value: 4800000, color: COLORS.amber },
    { label: 'Marketing', value: 890000, color: COLORS.cyan },
    { label: 'Transport', value: 560000, color: COLORS.emerald },
    { label: 'Admin', value: 430000, color: COLORS.rose },
  ];

  const cashflowData = Array.from({ length: 12 }, (_, i) => ({
    label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    inflow: Math.round((3000000 + Math.random() * 1500000) / 1000) * 1000,
    outflow: Math.round((2000000 + Math.random() * 900000) / 1000) * 1000,
  }));

  const plData = revenueData.map((d) => ({
    label: d.label,
    revenue: d.revenue,
    cogs: Math.round(d.revenue * 0.45),
    grossProfit: Math.round(d.revenue * 0.55),
    opex: Math.round(d.revenue * 0.28),
    netProfit: Math.round(d.revenue * 0.27),
  }));

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-50">Accounting</h1>
          <p className="text-sm text-surface-400">Financial overview · FY {new Date().getFullYear()}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => demoExport('accounting')}>Export</Button>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => demoAdd('invoice')}>New Invoice</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Invoiced', value: formatCurrency(totalInvoiced, true), icon: <FileText size={18} />, color: 'text-nexora-600 bg-nexora-50 dark:text-nexora-400 dark:bg-nexora-500/10', trend: '+12%' },
          { label: 'Collected', value: formatCurrency(totalPaid, true), icon: <CheckCircle size={18} />, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10', trend: '+8%' },
          { label: 'Overdue', value: formatCurrency(totalOverdue, true), icon: <AlertCircle size={18} />, color: 'text-rose-500 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10', trend: '-3%' },
          { label: 'Outstanding', value: formatCurrency(totalOutstanding, true), icon: <Send size={18} />, color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10', trend: '' },
        ].map((s) => (
          <Card key={s.label} className="flex items-start gap-4">
            <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', s.color)}>{s.icon}</div>
            <div>
              <p className="text-xs text-surface-400">{s.label}</p>
              <p className="text-lg font-bold text-surface-900 dark:text-surface-50">{s.value}</p>
              {s.trend && <p className={cn('text-xs font-medium mt-0.5', s.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500')}>{s.trend} vs last month</p>}
            </div>
          </Card>
        ))}
      </div>

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2" padding="none">
            <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
              <SectionHeader title="Revenue vs Expenses" subtitle="Monthly financial performance" />
            </div>
            <div className="p-5">
              <RevenueAreaChart
                data={revenueData}
                keys={[
                  { key: 'revenue', color: COLORS.nexora, label: 'Revenue' },
                  { key: 'expenses', color: COLORS.rose, label: 'Expenses' },
                  { key: 'profit', color: COLORS.emerald, label: 'Net Profit' },
                ]}
                height={240}
                currency
              />
            </div>
          </Card>
          <Card>
            <SectionHeader title="Expense Breakdown" subtitle="By category" />
            <DonutChart data={expenseCategories} height={200} currency />
          </Card>

          {/* Invoice status summary */}
          <Card className="lg:col-span-3">
            <SectionHeader title="Collection Rate" subtitle="Invoice payment status by month" />
            <div className="mt-4 grid grid-cols-5 gap-4">
              {['paid', 'sent', 'draft', 'overdue', 'cancelled'].map((status) => {
                const count = invoices.filter((i) => i.status === status).length;
                const value = invoices.filter((i) => i.status === status).reduce((s, i) => s + i.total, 0);
                return (
                  <div key={status} className="text-center">
                    <StatusBadge status={status} />
                    <p className="text-lg font-bold text-surface-900 dark:text-surface-50 mt-2">{count}</p>
                    <p className="text-xs text-surface-400">{formatCurrency(value, true)}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'invoices' && (
        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
            <SectionHeader title="All Invoices" subtitle={`${invoices.length} total`} />
            <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => demoAdd('invoice')}>New Invoice</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-surface-100 dark:border-surface-800">
                <tr>
                  {['Invoice #', 'Customer', 'Issued', 'Due Date', 'Subtotal', 'Tax', 'Total', 'Status', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-surface-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
                {invoices.slice(0, 40).map((inv) => (
                  <tr key={inv.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors group">
                    <td className="px-4 py-3 font-mono font-semibold text-nexora-700 dark:text-nexora-400">{inv.number}</td>
                    <td className="px-4 py-3 font-medium text-surface-800 dark:text-surface-200 max-w-[140px] truncate">{inv.customerName}</td>
                    <td className="px-4 py-3 text-surface-500 dark:text-surface-400 whitespace-nowrap">{formatDate(inv.issuedDate)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={cn(new Date(inv.dueDate) < new Date() && inv.status !== 'paid' ? 'text-rose-500 font-medium' : 'text-surface-500 dark:text-surface-400')}>
                        {formatDate(inv.dueDate)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-surface-600 dark:text-surface-400">{formatCurrency(inv.subtotal, true)}</td>
                    <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{formatCurrency(inv.tax, true)}</td>
                    <td className="px-4 py-3 font-bold text-surface-900 dark:text-surface-100">{formatCurrency(inv.total, true)}</td>
                    <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="xs" icon={<Eye size={11} />} onClick={() => demoView('invoice', inv.number)}>View</Button>
                        {inv.status === 'draft' && <Button variant="ghost" size="xs" icon={<Send size={11} />} onClick={() => demoToast('Send', `Invoice ${inv.number} sent to customer`, 'success')}>Send</Button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'pl' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Gross Revenue', value: plData.reduce((s, d) => s + d.revenue, 0), color: 'text-nexora-600' },
              { label: 'Gross Profit', value: plData.reduce((s, d) => s + d.grossProfit, 0), color: 'text-emerald-600' },
              { label: 'Operating Expenses', value: plData.reduce((s, d) => s + d.opex, 0), color: 'text-rose-500' },
              { label: 'Net Profit', value: plData.reduce((s, d) => s + d.netProfit, 0), color: 'text-violet-600' },
            ].map((m) => (
              <Card key={m.label}>
                <p className="text-xs text-surface-400 mb-2">{m.label}</p>
                <p className={cn('text-2xl font-bold', m.color)}>{formatCurrency(m.value, true)}</p>
              </Card>
            ))}
          </div>
          <Card padding="none" className="overflow-hidden">
            <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
              <SectionHeader title="Profit & Loss Statement" subtitle="Monthly breakdown · FY 2024" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="border-b border-surface-100 dark:border-surface-800">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-surface-400">Month</th>
                    <th className="text-right px-4 py-3 font-medium text-surface-400">Revenue</th>
                    <th className="text-right px-4 py-3 font-medium text-surface-400">COGS</th>
                    <th className="text-right px-4 py-3 font-medium text-surface-400">Gross Profit</th>
                    <th className="text-right px-4 py-3 font-medium text-surface-400">Gross %</th>
                    <th className="text-right px-4 py-3 font-medium text-surface-400">OpEx</th>
                    <th className="text-right px-4 py-3 font-medium text-surface-400">Net Profit</th>
                    <th className="text-right px-4 py-3 font-medium text-surface-400">Net %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
                  {plData.map((row) => (
                    <tr key={row.label} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                      <td className="px-4 py-3 font-semibold text-surface-800 dark:text-surface-200">{row.label}</td>
                      <td className="px-4 py-3 text-right font-medium text-surface-700 dark:text-surface-300">{formatCurrency(row.revenue, true)}</td>
                      <td className="px-4 py-3 text-right text-rose-500">{formatCurrency(row.cogs, true)}</td>
                      <td className="px-4 py-3 text-right font-medium text-surface-700 dark:text-surface-300">{formatCurrency(row.grossProfit, true)}</td>
                      <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold">55%</td>
                      <td className="px-4 py-3 text-right text-rose-500">{formatCurrency(row.opex, true)}</td>
                      <td className="px-4 py-3 text-right font-bold text-nexora-700 dark:text-nexora-400">{formatCurrency(row.netProfit, true)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">27%</td>
                    </tr>
                  ))}
                  <tr className="bg-surface-50 dark:bg-surface-800/50 font-bold">
                    <td className="px-4 py-3 text-surface-900 dark:text-surface-100">TOTAL</td>
                    <td className="px-4 py-3 text-right text-surface-900 dark:text-surface-100">{formatCurrency(plData.reduce((s, d) => s + d.revenue, 0), true)}</td>
                    <td className="px-4 py-3 text-right text-rose-500">{formatCurrency(plData.reduce((s, d) => s + d.cogs, 0), true)}</td>
                    <td className="px-4 py-3 text-right text-surface-900 dark:text-surface-100">{formatCurrency(plData.reduce((s, d) => s + d.grossProfit, 0), true)}</td>
                    <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400">55%</td>
                    <td className="px-4 py-3 text-right text-rose-500">{formatCurrency(plData.reduce((s, d) => s + d.opex, 0), true)}</td>
                    <td className="px-4 py-3 text-right text-nexora-700 dark:text-nexora-400">{formatCurrency(plData.reduce((s, d) => s + d.netProfit, 0), true)}</td>
                    <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400">27%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'cashflow' && (
        <div className="space-y-5">
          <Card padding="none" className="overflow-hidden">
            <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
              <SectionHeader title="Cash Flow Statement" subtitle="Inflows and outflows by month" />
            </div>
            <div className="p-5">
              <MetricBarChart
                data={cashflowData}
                keys={[
                  { key: 'inflow', color: COLORS.emerald, label: 'Inflow' },
                  { key: 'outflow', color: COLORS.rose, label: 'Outflow' },
                ]}
                height={280}
                currency
              />
            </div>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[
              { label: 'Operating Activities', value: 12400000, change: '+14%', icon: '🏭' },
              { label: 'Investing Activities', value: -3200000, change: '-8%', icon: '📈' },
              { label: 'Financing Activities', value: -1800000, change: '+2%', icon: '🏦' },
            ].map((item) => (
              <Card key={item.label}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-xs font-medium text-surface-600 dark:text-surface-400">{item.label}</p>
                </div>
                <p className={cn('text-2xl font-bold', item.value >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500')}>
                  {item.value >= 0 ? '+' : ''}{formatCurrency(Math.abs(item.value), true)}
                </p>
                <p className={cn('text-xs font-medium mt-1', item.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500')}>{item.change} vs last period</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
