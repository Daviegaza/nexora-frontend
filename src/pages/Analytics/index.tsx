import React, { useState } from 'react';
import { TrendingUp, Download, RefreshCw } from 'lucide-react';
import { Card, Button, Tabs, SectionHeader, Badge, ProgressBar } from '../../components/ui';
import { RevenueAreaChart, MetricBarChart, DonutChart, MetricLineChart } from '../../components/charts';
import { formatCurrency, cn, COLORS } from '../../utils';
import { demoExport, demoRefresh } from '../../utils/demoActions';
import { revenueData, dailySalesData, categoryData, branchRevenueData, transactions, customers, branches } from '../../mock/data';

const tabs = [
  { id: 'executive', label: 'Executive' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'customers', label: 'Customers' },
  { id: 'employees', label: 'Employees' },
  { id: 'branches', label: 'Branches' },
  { id: 'forecast', label: 'AI Forecast' },
];

function ExecutiveDashboard() {
  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);
  const totalExpenses = revenueData.reduce((s, d) => s + d.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const margin = Math.round((totalProfit / totalRevenue) * 100);

  const quarterlyData = [
    { label: 'Q1', revenue: revenueData.slice(0, 3).reduce((s, d) => s + d.revenue, 0), expenses: revenueData.slice(0, 3).reduce((s, d) => s + d.expenses, 0) },
    { label: 'Q2', revenue: revenueData.slice(3, 6).reduce((s, d) => s + d.revenue, 0), expenses: revenueData.slice(3, 6).reduce((s, d) => s + d.expenses, 0) },
    { label: 'Q3', revenue: revenueData.slice(6, 9).reduce((s, d) => s + d.revenue, 0), expenses: revenueData.slice(6, 9).reduce((s, d) => s + d.expenses, 0) },
    { label: 'Q4', revenue: revenueData.slice(9, 12).reduce((s, d) => s + d.revenue, 0), expenses: revenueData.slice(9, 12).reduce((s, d) => s + d.expenses, 0) },
  ];

  const metrics = [
    { label: 'Annual Revenue', value: formatCurrency(totalRevenue, true), sub: '+24.7% YoY', color: 'text-nexora-600', bg: 'bg-nexora-50 dark:bg-nexora-500/10' },
    { label: 'Net Profit', value: formatCurrency(totalProfit, true), sub: `${margin}% margin`, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Total Expenses', value: formatCurrency(totalExpenses, true), sub: '42% of revenue', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
    { label: 'EBITDA', value: formatCurrency(totalProfit * 1.15, true), sub: '+18.3% YoY', color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-500/10' },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <p className="text-xs text-surface-500 mb-2">{m.label}</p>
            <p className={cn('text-2xl font-bold', m.color)}>{m.value}</p>
            <div className={cn('mt-3 inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-medium', m.bg, m.color)}>{m.sub}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
            <SectionHeader title="Annual Revenue Trend" subtitle="Monthly breakdown for current year" />
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
        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
            <SectionHeader title="Quarterly Performance" subtitle="Revenue vs expenses by quarter" />
          </div>
          <div className="p-5">
            <MetricBarChart
              data={quarterlyData}
              keys={[
                { key: 'revenue', color: COLORS.nexora, label: 'Revenue' },
                { key: 'expenses', color: COLORS.rose, label: 'Expenses' },
              ]}
              height={220}
              currency
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card>
          <SectionHeader title="Revenue by Category" subtitle="Product mix" />
          <DonutChart data={categoryData.slice(0, 6)} height={180} currency />
        </Card>
        <Card className="lg:col-span-2">
          <SectionHeader title="Key Business Metrics" subtitle="YTD performance indicators" />
          <div className="mt-4 space-y-4">
            {[
              { label: 'Revenue Target Achievement', value: 84, color: 'nexora', note: 'KSh 15.8M of KSh 18.8M target' },
              { label: 'Customer Satisfaction Score', value: 92, color: 'emerald', note: '92/100 from 1,240 reviews' },
              { label: 'Inventory Turnover Rate', value: 76, color: 'amber', note: '8.4x turns per year' },
              { label: 'Employee Utilization', value: 88, color: 'violet', note: '88% of workforce active' },
              { label: 'Branch Expansion Progress', value: 60, color: 'cyan', note: '12 of 20 planned branches' },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-medium text-surface-700 dark:text-surface-300">{m.label}</span>
                  <span className="text-xs text-surface-400">{m.note}</span>
                </div>
                <ProgressBar value={m.value} color={m.color as 'nexora'} size="sm" showValue />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function RevenueAnalytics() {
  const paymentMethodData = [
    { label: 'M-Pesa', value: transactions.filter((t) => t.paymentMethod === 'mpesa').length, color: COLORS.emerald },
    { label: 'Cash', value: transactions.filter((t) => t.paymentMethod === 'cash').length, color: COLORS.amber },
    { label: 'Card', value: transactions.filter((t) => t.paymentMethod === 'card').length, color: COLORS.nexora },
    { label: 'Split', value: transactions.filter((t) => t.paymentMethod === 'split').length, color: COLORS.violet },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
            <SectionHeader title="Daily Sales Trend" subtitle="Last 30 days" />
          </div>
          <div className="p-5">
            <MetricLineChart
              data={dailySalesData}
              keys={[{ key: 'sales', color: COLORS.nexora, label: 'Sales' }]}
              height={220}
              currency
            />
          </div>
        </Card>
        <Card>
          <SectionHeader title="Payment Methods" subtitle="Transaction distribution" />
          <DonutChart data={paymentMethodData} height={200} />
          <div className="grid grid-cols-2 gap-2 mt-2">
            {paymentMethodData.map((d) => (
              <div key={d.label} className="flex items-center gap-2 text-xs p-2 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="text-surface-500">{d.label}</span>
                <span className="font-bold text-surface-800 dark:text-surface-200 ml-auto">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
          <SectionHeader title="Revenue by Branch" subtitle="Comparative branch performance" />
        </div>
        <div className="p-5">
          <MetricBarChart
            data={branchRevenueData}
            keys={[
              { key: 'revenue', color: COLORS.nexora, label: 'Revenue' },
              { key: 'target', color: COLORS.violet, label: 'Target' },
            ]}
            height={240}
            currency
          />
        </div>
      </Card>
    </div>
  );
}

function CustomerAnalytics() {
  const countyData = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Nyeri', 'Kilifi'].map((county, i) => ({
    label: county,
    value: customers.filter((c) => c.county === county).length,
    color: Object.values(COLORS)[i],
  }));
  const typeData = [
    { label: 'Retail', value: customers.filter((c) => c.type === 'retail').length, color: COLORS.nexora },
    { label: 'Wholesale', value: customers.filter((c) => c.type === 'wholesale').length, color: COLORS.amber },
    { label: 'VIP', value: customers.filter((c) => c.type === 'vip').length, color: COLORS.violet },
  ];
  const retentionData = Array.from({ length: 12 }, (_, i) => ({
    label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    new: Math.floor(Math.random() * 50) + 20,
    returning: Math.floor(Math.random() * 150) + 80,
    churned: Math.floor(Math.random() * 15) + 3,
  }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: customers.length },
          { label: 'VIP Customers', value: customers.filter((c) => c.type === 'vip').length },
          { label: 'Active This Month', value: Math.floor(customers.length * 0.68) },
          { label: 'Avg Lifetime Value', value: formatCurrency(Math.round(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length), true) },
        ].map((s) => (
          <Card key={s.label}>
            <p className="text-xs text-surface-400 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-surface-900 dark:text-surface-50">{s.value}</p>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card>
          <SectionHeader title="By County" subtitle="Geographic distribution" />
          <DonutChart data={countyData} height={200} />
        </Card>
        <Card>
          <SectionHeader title="By Type" subtitle="Customer tier breakdown" />
          <DonutChart data={typeData} height={200} />
        </Card>
        <Card>
          <SectionHeader title="Loyalty Distribution" subtitle="Score distribution" />
          <div className="mt-4 space-y-2">
            {[
              { label: 'Champions (80-100)', pct: 22, color: 'emerald' },
              { label: 'Loyal (60-79)', pct: 35, color: 'nexora' },
              { label: 'Potential (40-59)', pct: 28, color: 'amber' },
              { label: 'At Risk (0-39)', pct: 15, color: 'rose' },
            ].map((g) => (
              <div key={g.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-surface-600 dark:text-surface-400">{g.label}</span>
                  <span className="font-semibold text-surface-800 dark:text-surface-200">{g.pct}%</span>
                </div>
                <ProgressBar value={g.pct} color={g.color as 'nexora'} size="xs" />
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
          <SectionHeader title="Customer Acquisition & Retention" subtitle="Monthly new vs returning customers" />
        </div>
        <div className="p-5">
          <MetricBarChart
            data={retentionData}
            keys={[
              { key: 'returning', color: COLORS.nexora, label: 'Returning' },
              { key: 'new', color: COLORS.emerald, label: 'New' },
            ]}
            height={220}
            stacked
          />
        </div>
      </Card>
    </div>
  );
}

function BranchAnalytics() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
            <SectionHeader title="Branch Revenue Ranking" subtitle="All branches · Current year" />
          </div>
          <div className="divide-y divide-surface-50 dark:divide-surface-800">
            {branches.map((b, i) => {
              const pct = Math.round((b.revenue / branches[0].revenue) * 100);
              return (
                <div key={b.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="text-xs font-bold text-surface-300 dark:text-surface-700 w-5">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-surface-800 dark:text-surface-200 truncate">{b.name}</span>
                      <span className="text-xs font-bold text-surface-900 dark:text-surface-100 ml-2">{formatCurrency(b.revenue, true)}</span>
                    </div>
                    <ProgressBar value={pct} color={i < 3 ? 'emerald' : i < 7 ? 'nexora' : 'amber'} size="xs" />
                  </div>
                  <Badge variant={b.status === 'active' ? 'success' : 'default'} size="sm">{b.employees} staff</Badge>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Branch Performance Matrix" subtitle="Revenue vs. employee efficiency" />
          <div className="mt-4 space-y-3">
            {branches.slice(0, 8).map((b) => {
              const revenuePerEmployee = Math.round(b.revenue / b.employees);
              return (
                <div key={b.id} className="flex items-center gap-3">
                  <span className="text-xs text-surface-500 w-24 truncate">{b.name.replace(' Branch', '').replace(' HQ', '')}</span>
                  <div className="flex-1">
                    <ProgressBar value={revenuePerEmployee} max={Math.max(...branches.map((b) => Math.round(b.revenue / b.employees)))} color="nexora" size="xs" />
                  </div>
                  <span className="text-xs font-semibold text-surface-700 dark:text-surface-300 w-20 text-right">{formatCurrency(revenuePerEmployee, true)}/staff</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AIForecast() {
  const forecastData = Array.from({ length: 6 }, (_, i) => {
    const base = 1800000 + i * 120000;
    return {
      label: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      optimistic: Math.round(base * 1.15),
      expected: base,
      conservative: Math.round(base * 0.88),
    };
  });

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-nexora-50 to-violet-50 dark:from-nexora-500/10 dark:to-violet-500/10 border border-nexora-100 dark:border-nexora-500/20 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nexora-500 to-violet-500 flex items-center justify-center">
            <TrendingUp size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-surface-900 dark:text-surface-50">AI Revenue Forecast — H2 2024</h3>
            <p className="text-xs text-surface-500">Based on historical trends, seasonality, and market indicators</p>
          </div>
          <Badge variant="info" className="ml-auto">98.4% Confidence</Badge>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Optimistic', value: '94.2M', change: '+28%', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
            { label: 'Expected', value: 'KSh 82.5M', change: '+12%', color: 'text-nexora-600 dark:text-nexora-400', bg: 'bg-nexora-50 dark:bg-nexora-500/10' },
            { label: 'Conservative', value: 'KSh 71.8M', change: '-2%', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
          ].map((f) => (
            <div key={f.label} className={cn('rounded-xl p-4 text-center', f.bg)}>
              <p className="text-xs text-surface-500 mb-1">{f.label}</p>
              <p className={cn('text-lg font-bold', f.color)}>{f.value}</p>
              <p className={cn('text-xs font-medium', f.color)}>{f.change} YoY</p>
            </div>
          ))}
        </div>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
          <SectionHeader title="6-Month Revenue Forecast" subtitle="Scenario analysis with confidence bands" />
        </div>
        <div className="p-5">
          <MetricLineChart
            data={forecastData}
            keys={[
              { key: 'optimistic', color: COLORS.emerald, label: 'Optimistic' },
              { key: 'expected', color: COLORS.nexora, label: 'Expected' },
              { key: 'conservative', color: COLORS.amber, label: 'Conservative' },
            ]}
            height={240}
            currency
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {[
          { title: 'Growth Drivers', items: ['Mombasa expansion (+18% capacity)', 'New VIP loyalty program launch', 'M-Pesa Super App integration', 'B2B wholesale market entry', 'Government tender pipeline (KSh 8M)'] },
          { title: 'Risk Factors', items: ['Global supply chain disruptions', 'FX rate volatility (USD/KES)', 'Increased competition in Nairobi', 'Staff turnover risk (IT dept)', 'Regulatory changes — Finance Act 2024'] },
        ].map((section) => (
          <Card key={section.title}>
            <SectionHeader title={section.title} />
            <div className="mt-3 space-y-2">
              {section.items.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs">
                  <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5', section.title === 'Growth Drivers' ? 'bg-emerald-400' : 'bg-rose-400')} />
                  <span className="text-surface-600 dark:text-surface-400">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('executive');
  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-50">Analytics</h1>
          <p className="text-sm text-surface-400">Data-driven insights across all business dimensions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => demoExport('Analytics')}>Export</Button>
          <Button variant="outline" size="sm" icon={<RefreshCw size={14} />} onClick={() => demoRefresh()}>Refresh</Button>
        </div>
      </div>
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      {activeTab === 'executive' && <ExecutiveDashboard />}
      {activeTab === 'revenue' && <RevenueAnalytics />}
      {activeTab === 'customers' && <CustomerAnalytics />}
      {activeTab === 'branches' && <BranchAnalytics />}
      {activeTab === 'forecast' && <AIForecast />}
      {activeTab === 'employees' && (
        <Card className="text-center py-16">
          <p className="text-surface-400">Employee analytics coming soon</p>
        </Card>
      )}
    </div>
  );
}
