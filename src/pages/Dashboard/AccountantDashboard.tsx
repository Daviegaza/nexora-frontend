import React from 'react';
import { DollarSign, FileText, TrendingUp, AlertCircle, CheckCircle, Send } from 'lucide-react';
import { Card, Button, SectionHeader, Badge } from '../../components/ui';
import { RevenueAreaChart, DonutChart } from '../../components/charts';
import { formatCurrency, formatDate, cn, COLORS } from '../../utils';
import { invoices, revenueData } from '../../mock/data';
import { useAppStore } from '../../store';
import { demoAction, demoExport } from '../../utils/demoActions';

export function AccountantDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);
  const totalInvoiced = invoices.reduce((s, inv) => s + inv.total, 0);
  const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((s, inv) => s + inv.total, 0);
  const totalOverdue = invoices.filter((i) => i.status === 'overdue').reduce((s, inv) => s + inv.total, 0);
  const totalOutstanding = invoices.filter((i) => ['sent', 'draft'].includes(i.status)).reduce((s, inv) => s + inv.total, 0);
  const collectionRate = Math.round((totalPaid / (totalInvoiced || 1)) * 100);
  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');
  const recentPaid = invoices.filter((i) => i.status === 'paid').slice(0, 6);

  const expenseCategories = [
    { label: 'Payroll', value: 8320000, color: COLORS.nexora },
    { label: 'Rent & Utilities', value: 2100000, color: COLORS.violet },
    { label: 'Inventory', value: 4800000, color: COLORS.amber },
    { label: 'Marketing', value: 890000, color: COLORS.cyan },
    { label: 'Transport', value: 560000, color: COLORS.emerald },
    { label: 'Admin', value: 430000, color: COLORS.rose },
  ];

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-50">Accounting Dashboard</h1>
          <p className="text-sm text-surface-400">FY {new Date().getFullYear()} · Welcome, {currentUser.name.split(' ')[0]}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<FileText size={14} />} onClick={() => demoExport('Financial Report')}>Export</Button>
          <Button variant="primary" size="sm" icon={<DollarSign size={14} />} onClick={() => window.location.assign('/accounting')}>Accounting Center</Button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Invoiced', value: formatCurrency(totalInvoiced, true), icon: <FileText size={18} />, color: 'text-nexora-600 bg-nexora-50 dark:text-nexora-400 dark:bg-nexora-500/10' },
          { label: 'Collected', value: formatCurrency(totalPaid, true), icon: <CheckCircle size={18} />, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' },
          { label: 'Overdue', value: formatCurrency(totalOverdue, true), icon: <AlertCircle size={18} />, color: 'text-rose-500 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10' },
          { label: 'Outstanding', value: formatCurrency(totalOutstanding, true), icon: <Send size={18} />, color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10' },
          { label: 'Collection Rate', value: `${collectionRate}%`, icon: <TrendingUp size={18} />, color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10' },
        ].map((kpi) => (
          <Card key={kpi.label} className="flex flex-col items-center text-center py-4">
            <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center mb-3', kpi.color)}>{kpi.icon}</div>
            <p className="text-lg font-bold text-surface-900 dark:text-surface-50">{kpi.value}</p>
            <p className="text-xs text-surface-400">{kpi.label}</p>
          </Card>
        ))}
      </div>

      {/* Revenue + Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
            <SectionHeader title="Revenue vs Expenses" subtitle="Monthly trend" />
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
        <Card>
          <SectionHeader title="Expense Breakdown" subtitle="By category" />
          <DonutChart data={expenseCategories} height={200} currency />
        </Card>
      </div>

      {/* Overdue Invoices */}
      {overdueInvoices.length > 0 && (
        <Card className="border-rose-300 dark:border-rose-500/30 bg-rose-50/50 dark:bg-rose-500/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={16} className="text-rose-500" />
            <SectionHeader title="Overdue Invoices" subtitle={`${overdueInvoices.length} invoices require immediate attention`} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-rose-200 dark:border-rose-500/10">
                <tr>
                  {['Invoice #', 'Customer', 'Amount', 'Due Date', 'Days Overdue'].map((h) => (
                    <th key={h} className="text-left px-4 py-2 font-medium text-rose-600 dark:text-rose-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100 dark:divide-rose-500/10">
                {overdueInvoices.slice(0, 8).map((inv) => {
                  const daysOverdue = Math.floor((Date.now() - new Date(inv.dueDate).getTime()) / 86400000);
                  return (
                    <tr key={inv.id} className="hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer" onClick={() => demoAction('View Invoice', inv.number)}>
                      <td className="px-4 py-2 font-mono text-rose-700 dark:text-rose-300 font-semibold">{inv.number}</td>
                      <td className="px-4 py-2 text-surface-600 dark:text-surface-400">{inv.customerName}</td>
                      <td className="px-4 py-2 font-semibold text-surface-900 dark:text-surface-100">{formatCurrency(inv.total, true)}</td>
                      <td className="px-4 py-2 text-surface-500">{formatDate(inv.dueDate)}</td>
                      <td className="px-4 py-2"><Badge variant="danger">{daysOverdue} days</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Recent Payments */}
      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
          <SectionHeader title="Recently Paid Invoices" subtitle="Last payments received" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-surface-100 dark:border-surface-800">
              <tr>
                {['Invoice #', 'Customer', 'Amount', 'Issued', 'Paid Date'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-surface-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
              {recentPaid.map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors cursor-pointer" onClick={() => demoAction('View Invoice', inv.number)}>
                  <td className="px-4 py-3 font-mono text-surface-500 font-semibold">{inv.number}</td>
                  <td className="px-4 py-3 text-surface-600 dark:text-surface-400">{inv.customerName}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(inv.total, true)}</td>
                  <td className="px-4 py-3 text-surface-500">{formatDate(inv.issuedDate)}</td>
                  <td className="px-4 py-3 text-surface-500">{formatDate(inv.paidDate || '')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
