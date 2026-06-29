import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, Phone, Mail, Calendar, TrendingUp, Users, DollarSign, Target, Eye, Edit } from 'lucide-react';
import { Card, Button, Input, StatusBadge, Avatar, SectionHeader, Tabs, ProgressBar } from '../../components/ui';
import { RevenueAreaChart, DonutChart } from '../../components/charts';
import { formatCurrency, formatDate, cn, COLORS } from '../../utils';
import { demoAdd, demoView, demoEdit, demoAction } from '../../utils/demoActions';
import { leads, customers } from '../../mock/data';
import type { Lead } from '../../types';

const stages: { id: Lead['stage']; label: string; color: string; bg: string }[] = [
  { id: 'new', label: 'New', color: '#60a5fa', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  { id: 'contacted', label: 'Contacted', color: '#a78bfa', bg: 'bg-violet-50 dark:bg-violet-500/10' },
  { id: 'qualified', label: 'Qualified', color: '#22d3ee', bg: 'bg-cyan-50 dark:bg-cyan-500/10' },
  { id: 'proposal', label: 'Proposal', color: '#fbbf24', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  { id: 'negotiation', label: 'Negotiation', color: '#f97316', bg: 'bg-orange-50 dark:bg-orange-500/10' },
  { id: 'won', label: 'Won', color: '#34d399', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  { id: 'lost', label: 'Lost', color: '#fb7185', bg: 'bg-rose-50 dark:bg-rose-500/10' },
];

const tabs = [
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'leads', label: 'Leads', count: leads.length },
  { id: 'customers', label: 'Customers', count: customers.length },
  { id: 'analytics', label: 'Analytics' },
];

function PipelineCard({ lead }: { lead: Lead }) {
  return (
    <div onClick={() => demoView('Lead', lead.name)} className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-3.5 mb-2.5 hover:border-nexora-300 dark:hover:border-nexora-500/50 hover:shadow-md transition-all cursor-pointer group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-xs font-semibold text-surface-800 dark:text-surface-200 leading-snug line-clamp-2">{lead.name}</p>
        <button onClick={(e) => { e.stopPropagation(); demoView('Lead', lead.name); }} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-300 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
          <Eye size={11} />
        </button>
      </div>
      {lead.company && <p className="text-[10px] text-surface-400 mb-2">{lead.company}</p>}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-nexora-700 dark:text-nexora-400">{formatCurrency(lead.value, true)}</span>
        <div className="flex items-center gap-1">
          <div className="w-14 h-1.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-nexora-500 transition-all" style={{ width: `${lead.probability}%` }} />
          </div>
          <span className="text-[10px] text-surface-400">{lead.probability}%</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-surface-50 dark:border-surface-800">
        <div className="flex items-center gap-1.5">
          <Avatar name={lead.assignedTo} size="xs" />
          <span className="text-[10px] text-surface-400 truncate max-w-[70px]">{lead.assignedTo.split(' ')[0]}</span>
        </div>
        {lead.nextFollowUp && (
          <span className="text-[10px] text-amber-500 flex items-center gap-0.5">
            <Calendar size={9} /> {formatDate(lead.nextFollowUp, { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>
    </div>
  );
}

function Pipeline() {
  const activeStages = stages.filter((s) => s.id !== 'won' && s.id !== 'lost');
  const wonLost = stages.filter((s) => s.id === 'won' || s.id === 'lost');

  return (
    <div>
      {/* Won/Lost summary */}
      <div className="flex gap-3 mb-5">
        {wonLost.map((s) => {
          const stageLeads = leads.filter((l) => l.stage === s.id);
          const value = stageLeads.reduce((sum, l) => sum + l.value, 0);
          return (
            <div key={s.id} className={cn('flex-1 rounded-xl p-4 border', s.id === 'won' ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20')}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-surface-500">{s.label}</p>
                <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white', s.id === 'won' ? 'bg-emerald-500' : 'bg-rose-500')}>{stageLeads.length}</span>
              </div>
              <p className={cn('text-lg font-bold mt-1', s.id === 'won' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400')}>{formatCurrency(value, true)}</p>
            </div>
          );
        })}
        <div className="flex-1 rounded-xl p-4 border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
          <p className="text-xs font-medium text-surface-500">Pipeline Value</p>
          <p className="text-lg font-bold text-nexora-700 dark:text-nexora-400 mt-1">
            {formatCurrency(leads.filter((l) => !['won', 'lost'].includes(l.stage)).reduce((s, l) => s + l.value, 0), true)}
          </p>
        </div>
        <div className="flex-1 rounded-xl p-4 border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
          <p className="text-xs font-medium text-surface-500">Win Rate</p>
          <p className="text-lg font-bold text-surface-900 dark:text-surface-50 mt-1">
            {Math.round((leads.filter((l) => l.stage === 'won').length / leads.length) * 100)}%
          </p>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: 600 }}>
        {activeStages.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage.id);
          const total = stageLeads.reduce((s, l) => s + l.value, 0);
          return (
            <div key={stage.id} className="flex-shrink-0 w-[230px]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
                  <span className="text-xs font-semibold text-surface-700 dark:text-surface-300">{stage.label}</span>
                  <span className="text-[10px] font-bold bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 px-1.5 py-0.5 rounded-full">{stageLeads.length}</span>
                </div>
                <span className="text-[10px] font-semibold text-surface-400">{formatCurrency(total, true)}</span>
              </div>
              <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-2 min-h-[200px]">
                {stageLeads.map((lead) => <PipelineCard key={lead.id} lead={lead} />)}
                <button onClick={() => demoAdd('Lead')} className="w-full h-8 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-lg text-xs text-surface-400 hover:border-nexora-400 hover:text-nexora-500 transition-colors flex items-center justify-center gap-1">
                  <Plus size={12} /> Add Lead
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LeadsTable() {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (stageFilter !== 'all' && l.stage !== stageFilter) return false;
      if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.company?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, stageFilter]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads..." icon={<Search size={14} />} className="w-56" />
        <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="h-9 px-3 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg text-xs outline-none text-surface-700 dark:text-surface-300">
          <option value="all">All Stages</option>
          {stages.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <span className="ml-auto text-xs text-surface-400">{filtered.length} leads</span>
        <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => demoAdd('Lead')}>New Lead</Button>
      </div>
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-surface-100 dark:border-surface-800">
              <tr>
                {['Lead', 'Company', 'Stage', 'Value', 'Probability', 'Source', 'Assigned To', 'Follow Up', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-surface-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={lead.name} size="sm" />
                      <div>
                        <p className="font-medium text-surface-800 dark:text-surface-200">{lead.name}</p>
                        <p className="text-[10px] text-surface-400">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{lead.company ?? '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={lead.stage} /></td>
                  <td className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">{formatCurrency(lead.value, true)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={lead.probability} color="nexora" size="xs" className="w-16" />
                      <span className="text-surface-500">{lead.probability}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{lead.source}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Avatar name={lead.assignedTo} size="xs" />
                      <span className="text-surface-600 dark:text-surface-400 truncate max-w-[80px]">{lead.assignedTo.split(' ')[0]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-surface-500 dark:text-surface-400 whitespace-nowrap">
                    {lead.nextFollowUp ? (
                      <span className="flex items-center gap-1 text-amber-500">
                        <Calendar size={10} /> {formatDate(lead.nextFollowUp, { day: 'numeric', month: 'short' })}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); demoAction('Call Lead'); }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-nexora-600"><Phone size={12} /></button>
                      <button onClick={(e) => { e.stopPropagation(); demoAction('Email Lead'); }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-nexora-600"><Mail size={12} /></button>
                      <button onClick={(e) => { e.stopPropagation(); demoEdit('Lead'); }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-nexora-600"><Edit size={12} /></button>
                    </div>
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

function CustomersTable() {
  const [search, setSearch] = useState('');
  const top50 = useMemo(() => customers.filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)).slice(0, 50), [search]);
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." icon={<Search size={14} />} className="w-56" />
        <Button variant="primary" size="sm" icon={<Plus size={14} />} className="ml-auto" onClick={() => demoAdd('Customer')}>New Customer</Button>
      </div>
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-surface-100 dark:border-surface-800">
              <tr>
                {['Customer', 'Phone', 'County', 'Type', 'Orders', 'Total Spent', 'Last Purchase', 'Loyalty', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-surface-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
              {top50.map((c) => (
                <tr key={c.id} onClick={() => demoView('customer', c.name)} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors group cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={c.name} size="sm" />
                      <div>
                        <p className="font-medium text-surface-800 dark:text-surface-200">{c.name}</p>
                        <p className="text-[10px] text-surface-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{c.phone}</td>
                  <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{c.county}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.type} /></td>
                  <td className="px-4 py-3 font-medium text-surface-700 dark:text-surface-300">{c.orderCount}</td>
                  <td className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">{formatCurrency(c.totalSpent, true)}</td>
                  <td className="px-4 py-3 text-surface-500 dark:text-surface-400 whitespace-nowrap">{formatDate(c.lastPurchase)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={c.loyalty} color={c.loyalty > 70 ? 'emerald' : c.loyalty > 40 ? 'nexora' : 'amber'} size="xs" className="w-14" />
                      <span className="text-[10px] text-surface-400">{c.loyalty}</span>
                    </div>
                  </td>
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

function CRMAnalytics() {
  const stageData = stages.map((s) => ({
    label: s.label,
    value: leads.filter((l) => l.stage === s.id).length,
    color: s.color,
  }));
  const sourceData = ['Website', 'Referral', 'Cold Call', 'LinkedIn', 'Exhibition', 'Social Media'].map((src, i) => ({
    label: src,
    value: leads.filter((l) => l.source === src).length,
    color: Object.values(COLORS)[i],
  }));
  const salesTrend = Array.from({ length: 12 }, (_, i) => ({
    label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    won: Math.floor(Math.random() * 8) + 2,
    lost: Math.floor(Math.random() * 4) + 1,
    pipeline: Math.floor(Math.random() * 15) + 5,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Card>
        <SectionHeader title="Leads by Stage" subtitle="Pipeline distribution" />
        <DonutChart data={stageData} height={200} />
      </Card>
      <Card>
        <SectionHeader title="Leads by Source" subtitle="Where leads come from" />
        <DonutChart data={sourceData} height={200} />
      </Card>
      <Card className="lg:col-span-2">
        <SectionHeader title="Sales Performance" subtitle="Monthly wins, losses, and pipeline" />
        <RevenueAreaChart
          data={salesTrend}
          keys={[
            { key: 'pipeline', color: COLORS.nexora, label: 'Pipeline' },
            { key: 'won', color: COLORS.emerald, label: 'Won' },
            { key: 'lost', color: COLORS.rose, label: 'Lost' },
          ]}
          height={200}
        />
      </Card>
    </div>
  );
}

export default function CRM() {
  const [activeTab, setActiveTab] = useState('pipeline');
  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-50">CRM</h1>
          <p className="text-sm text-surface-400">{leads.length} leads · {customers.length} customers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Filter size={14} />} onClick={() => demoAction('Filter', 'Advanced filters coming soon.')}>Filter</Button>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => demoAdd('Lead')}>New Lead</Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: leads.length, icon: <Users size={18} />, color: 'text-nexora-600 bg-nexora-50 dark:text-nexora-400 dark:bg-nexora-500/10' },
          { label: 'Pipeline Value', value: formatCurrency(leads.reduce((s, l) => s + l.value, 0), true), icon: <DollarSign size={18} />, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' },
          { label: 'Win Rate', value: `${Math.round((leads.filter((l) => l.stage === 'won').length / leads.length) * 100)}%`, icon: <Target size={18} />, color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10' },
          { label: 'Avg Deal Value', value: formatCurrency(Math.round(leads.reduce((s, l) => s + l.value, 0) / leads.length), true), icon: <TrendingUp size={18} />, color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10' },
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

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'pipeline' && <Pipeline />}
      {activeTab === 'leads' && <LeadsTable />}
      {activeTab === 'customers' && <CustomersTable />}
      {activeTab === 'analytics' && <CRMAnalytics />}
    </div>
  );
}
