import React, { useState } from 'react';
import { FileText, Download, Calendar, BarChart2, Package, Users, DollarSign, Building2, TrendingUp, Filter, RefreshCw } from 'lucide-react';
import { Card, Button, Badge, SectionHeader } from '../../components/ui';
import { RevenueAreaChart, DonutChart } from '../../components/charts';
import { formatDate, cn, COLORS } from '../../utils';
import { demoExport, demoAction, demoRefresh } from '../../utils/demoActions';
import { revenueData, categoryData } from '../../mock/data';

const reportTypes = [
  { id: 'sales', label: 'Sales Report', desc: 'Revenue, orders, and sales performance', icon: <TrendingUp size={20} />, color: 'text-nexora-600 bg-nexora-50 dark:text-nexora-400 dark:bg-nexora-500/10', lastGenerated: '2 hours ago' },
  { id: 'inventory', label: 'Inventory Report', desc: 'Stock levels, movements, and valuations', icon: <Package size={20} />, color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10', lastGenerated: '1 day ago' },
  { id: 'payroll', label: 'Payroll Report', desc: 'Employee salaries, deductions, and taxes', icon: <DollarSign size={20} />, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10', lastGenerated: '1 month ago' },
  { id: 'financial', label: 'Financial Report', desc: 'P&L, balance sheet, and cash flow', icon: <BarChart2 size={20} />, color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10', lastGenerated: '3 hours ago' },
  { id: 'customer', label: 'Customer Report', desc: 'Customer analytics and lifetime value', icon: <Users size={20} />, color: 'text-cyan-600 bg-cyan-50 dark:text-cyan-400 dark:bg-cyan-500/10', lastGenerated: '5 hours ago' },
  { id: 'branch', label: 'Branch Report', desc: 'Multi-branch performance comparison', icon: <Building2 size={20} />, color: 'text-rose-500 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10', lastGenerated: '12 hours ago' },
];

const recentReports = [
  { name: 'Sales Report — June 2024', type: 'Sales', format: 'PDF', size: '2.4 MB', date: '2024-06-25', status: 'ready' },
  { name: 'Payroll Summary — Q2 2024', type: 'Payroll', format: 'XLSX', size: '1.1 MB', date: '2024-06-20', status: 'ready' },
  { name: 'Inventory Valuation — June', type: 'Inventory', format: 'PDF', size: '3.7 MB', date: '2024-06-18', status: 'ready' },
  { name: 'Customer Analytics — H1 2024', type: 'Customer', format: 'PDF', size: '4.2 MB', date: '2024-06-15', status: 'ready' },
  { name: 'Branch Performance — May 2024', type: 'Branch', format: 'XLSX', size: '880 KB', date: '2024-06-01', status: 'ready' },
  { name: 'Annual Financial Report — 2023', type: 'Financial', format: 'PDF', size: '8.5 MB', date: '2024-01-31', status: 'ready' },
];

function ReportCard({ report }: { report: typeof reportTypes[0] }) {
  const [generating, setGenerating] = useState(false);
  function generate() { setGenerating(true); setTimeout(() => setGenerating(false), 2000); }
  return (
    <Card hover className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', report.color)}>{report.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">{report.label}</p>
          <p className="text-xs text-surface-400 mt-0.5 leading-relaxed">{report.desc}</p>
          <p className="text-[10px] text-surface-300 dark:text-surface-600 mt-1.5">Last generated: {report.lastGenerated}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="primary" size="sm" loading={generating} onClick={generate} icon={<FileText size={13} />} className="flex-1">
          Generate
        </Button>
        <Button variant="secondary" size="sm" icon={<Download size={13} />} onClick={() => demoExport(report.label + ' PDF')}>PDF</Button>
        <Button variant="secondary" size="sm" icon={<Download size={13} />} onClick={() => demoExport(report.label + ' Excel')}>Excel</Button>
      </div>
    </Card>
  );
}

export default function Reports() {
  const [dateRange, setDateRange] = useState('month');

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-50">Reports</h1>
          <p className="text-sm text-surface-400">Generate and download business reports</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-surface-100 dark:bg-surface-800 rounded-lg p-0.5">
            {['week', 'month', 'quarter', 'year'].map((r) => (
              <button key={r} onClick={() => setDateRange(r)} className={cn('px-3 h-7 text-xs font-medium rounded-md transition-all capitalize', dateRange === r ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 shadow-sm' : 'text-surface-500')}>
                {r}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" icon={<Filter size={14} />} onClick={() => demoAction('Filter Reports', 'Filtering reports...')}>Filter</Button>
        </div>
      </div>

      {/* Report type cards */}
      <div>
        <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Report Types</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((r) => <ReportCard key={r.id} report={r} />)}
        </div>
      </div>

      {/* Visual summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
            <SectionHeader title="Revenue Summary" subtitle="Current period" />
          </div>
          <div className="p-5">
            <RevenueAreaChart
              data={revenueData.slice(-6)}
              keys={[{ key: 'revenue', color: COLORS.nexora, label: 'Revenue' }, { key: 'profit', color: COLORS.emerald, label: 'Profit' }]}
              height={200}
              currency
            />
          </div>
        </Card>
        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
            <SectionHeader title="Category Breakdown" subtitle="Revenue by product category" />
          </div>
          <div className="p-5">
            <DonutChart data={categoryData.slice(0, 6)} height={200} currency />
          </div>
        </Card>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
          <SectionHeader title="Recent Reports" subtitle="Download previously generated reports" />
          <Button variant="ghost" size="sm" icon={<RefreshCw size={12} />} onClick={() => demoRefresh()}>Refresh</Button>
        </div>
        <div className="divide-y divide-surface-50 dark:divide-surface-800">
          {recentReports.map((r, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors group">
              <div className="w-9 h-9 bg-surface-50 dark:bg-surface-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText size={16} className="text-surface-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-surface-800 dark:text-surface-200 truncate">{r.name}</p>
                <p className="text-[10px] text-surface-400">{r.type} · {r.format} · {r.size}</p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Calendar size={12} className="text-surface-400" />
                <span className="text-xs text-surface-400">{formatDate(r.date)}</span>
              </div>
              <Badge variant="success">Ready</Badge>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="xs" icon={<Download size={12} />} onClick={() => demoExport(r.name)}>Download</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
