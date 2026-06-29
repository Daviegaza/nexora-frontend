import React from 'react';
import { Target, TrendingUp, Users, DollarSign, Phone, Calendar, CheckCircle } from 'lucide-react';
import { Card, Button, SectionHeader, Badge, ProgressBar } from '../../components/ui';
import { MetricBarChart } from '../../components/charts';
import { formatCurrency, formatDate, cn, COLORS } from '../../utils';
import { leads } from '../../mock/data';
import { useAppStore } from '../../store';
import { demoAction, demoAdd, demoExport } from '../../utils/demoActions';

export function SalesDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);
  const myLeads = leads.filter((l) => l.assignedTo === currentUser.name);
  const wonLeads = myLeads.filter((l) => l.stage === 'won');
  const activeLeads = myLeads.filter((l) => !['won', 'lost'].includes(l.stage));
  const wonValue = wonLeads.reduce((s, l) => s + l.value, 0);
  const pipelineValue = activeLeads.reduce((s, l) => s + l.value, 0);
  const winRate = myLeads.length > 0 ? Math.round((wonLeads.length / myLeads.length) * 100) : 0;

  const monthlyPerformance = Array.from({ length: 6 }, (_, i) => ({
    label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
    won: Math.floor(Math.random() * 8) + 2,
    lost: Math.floor(Math.random() * 4) + 1,
  }));

  const pipelineByStage = ['new', 'contacted', 'qualified', 'proposal', 'negotiation'].map((stage) => ({
    label: stage.charAt(0).toUpperCase() + stage.slice(1),
    value: myLeads.filter((l) => l.stage === stage).length,
    color: stage === 'new' ? COLORS.blue : stage === 'contacted' ? COLORS.violet : stage === 'qualified' ? COLORS.cyan : stage === 'proposal' ? COLORS.amber : COLORS.orange,
  }));

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-50">Sales Dashboard</h1>
          <p className="text-sm text-surface-400">{currentUser.branch} · Sales Agent · Welcome, {currentUser.name.split(' ')[0]}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Phone size={14} />} onClick={() => demoExport('Sales Report')}>Export</Button>
          <Button variant="primary" size="sm" icon={<Users size={14} />} onClick={() => window.location.assign('/crm')}>CRM</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Active Leads', value: activeLeads.length, icon: <Users size={18} />, color: 'text-nexora-600 bg-nexora-50 dark:text-nexora-400 dark:bg-nexora-500/10' },
          { label: 'Pipeline Value', value: formatCurrency(pipelineValue, true), icon: <DollarSign size={18} />, color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10' },
          { label: 'Deals Won', value: wonLeads.length, icon: <CheckCircle size={18} />, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' },
          { label: 'Win Rate', value: `${winRate}%`, icon: <Target size={18} />, color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10' },
          { label: 'Won Value', value: formatCurrency(wonValue, true), icon: <TrendingUp size={18} />, color: 'text-cyan-600 bg-cyan-50 dark:text-cyan-400 dark:bg-cyan-500/10' },
        ].map((kpi) => (
          <Card key={kpi.label} className="flex flex-col items-center text-center py-4">
            <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center mb-3', kpi.color)}>{kpi.icon}</div>
            <p className="text-lg font-bold text-surface-900 dark:text-surface-50">{kpi.value}</p>
            <p className="text-xs text-surface-400">{kpi.label}</p>
          </Card>
        ))}
      </div>

      {/* Pipeline + Monthly Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <SectionHeader title="My Pipeline" subtitle="Leads by stage" />
          <div className="mt-4 space-y-3">
            {pipelineByStage.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-surface-600 dark:text-surface-400">{s.label}</span>
                  <span className="font-semibold text-surface-900 dark:text-surface-100">{s.value}</span>
                </div>
                <ProgressBar value={s.value} max={Math.max(...pipelineByStage.map((p) => p.value), 1)} color="nexora" size="xs" />
              </div>
            ))}
          </div>
        </Card>
        <Card padding="none">
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
            <SectionHeader title="Monthly Performance" subtitle="Won vs Lost" />
          </div>
          <div className="p-5">
            <MetricBarChart data={monthlyPerformance} keys={[
              { key: 'won', color: COLORS.emerald, label: 'Won' },
              { key: 'lost', color: COLORS.rose, label: 'Lost' },
            ]} height={200} />
          </div>
        </Card>
      </div>

      {/* Active Leads Follow-up */}
      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
          <SectionHeader title="Leads Requiring Follow-up" subtitle={`${activeLeads.filter((l) => l.nextFollowUp && new Date(l.nextFollowUp) <= new Date()).length} overdue`} />
          <Button variant="primary" size="xs" onClick={() => demoAdd('Lead')}>New Lead</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-surface-100 dark:border-surface-800">
              <tr>
                {['Lead', 'Company', 'Stage', 'Value', 'Next Follow-up', 'Probability'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-surface-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
              {activeLeads.slice(0, 15).map((lead) => (
                <tr key={lead.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors cursor-pointer" onClick={() => demoAction('View Lead', lead.name)}>
                  <td className="px-4 py-3 font-semibold text-surface-800 dark:text-surface-200">{lead.name}</td>
                  <td className="px-4 py-3 text-surface-500">{lead.company || '—'}</td>
                  <td className="px-4 py-3"><Badge variant={lead.stage === 'negotiation' ? 'warning' : lead.stage === 'proposal' ? 'violet' : 'info'}>{lead.stage}</Badge></td>
                  <td className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">{formatCurrency(lead.value, true)}</td>
                  <td className="px-4 py-3 text-surface-500 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar size={10} />
                      {lead.nextFollowUp ? formatDate(lead.nextFollowUp) : 'Not set'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <ProgressBar value={lead.probability} color={lead.probability >= 60 ? 'emerald' : lead.probability >= 30 ? 'nexora' : 'rose'} size="xs" className="w-12" showValue />
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
