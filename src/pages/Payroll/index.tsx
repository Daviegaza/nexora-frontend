import React, { useState } from 'react';
import { DollarSign, Users, Download, CheckCircle, Clock, Eye, Play, FileText } from 'lucide-react';
import { Card, Button, StatusBadge, Avatar, SectionHeader, Tabs } from '../../components/ui';
import { MetricBarChart, RevenueAreaChart } from '../../components/charts';
import { formatCurrency, cn, COLORS } from '../../utils';
import { demoExport, demoView, demoAction } from '../../utils/demoActions';
import { payrollRuns, employees } from '../../mock/data';

const tabs = [{ id: 'runs', label: 'Payroll Runs' }, { id: 'employees', label: 'Employee Pay' }, { id: 'analytics', label: 'Analytics' }];

export default function Payroll() {
  const [activeTab, setActiveTab] = useState('runs');
  const current = payrollRuns[0];
  const totalGross = employees.reduce((s, e) => s + e.salary + e.allowances, 0);
  const totalDeductions = employees.reduce((s, e) => s + e.deductions, 0);
  const totalNet = totalGross - totalDeductions;

  const deptPayroll = ['Sales', 'Finance', 'Operations', 'IT', 'HR'].map((dept) => {
    const dept_employees = employees.filter((e) => e.department === dept);
    return { label: dept, value: dept_employees.reduce((s, e) => s + e.salary, 0) };
  });

  const monthlyTrend = Array.from({ length: 6 }, (_, i) => ({
    label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
    gross: Math.round((8000000 + i * 80000 + Math.random() * 200000) / 1000) * 1000,
    net: Math.round((6800000 + i * 70000 + Math.random() * 150000) / 1000) * 1000,
  }));

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-50">Payroll</h1>
          <p className="text-sm text-surface-400">{employees.filter((e) => e.status === 'active').length} active employees</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => demoExport('Payroll')}>Export</Button>
          <Button variant="primary" size="sm" icon={<Play size={14} />} onClick={() => demoAction('Run Payroll', 'Processing payroll...')}>Run Payroll</Button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Gross Payroll', value: formatCurrency(totalGross, true), icon: <DollarSign size={18} />, color: 'text-nexora-600 bg-nexora-50 dark:text-nexora-400 dark:bg-nexora-500/10' },
          { label: 'Total Deductions', value: formatCurrency(totalDeductions, true), icon: <FileText size={18} />, color: 'text-rose-500 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10' },
          { label: 'Net Payroll', value: formatCurrency(totalNet, true), icon: <CheckCircle size={18} />, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' },
          { label: 'Active Employees', value: employees.filter((e) => e.status === 'active').length, icon: <Users size={18} />, color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10' },
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

      {activeTab === 'runs' && (
        <div className="space-y-4">
          {/* Current period alert */}
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock size={16} className="text-amber-500" />
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">June 2024 Payroll — Pending Approval</p>
                <p className="text-xs text-amber-600 dark:text-amber-400">Process by 30 June 2024 · {current.employees} employees · {formatCurrency(current.netPay, true)} net</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" icon={<Eye size={12} />} onClick={() => demoView('payroll run', 'June 2024 Payroll')}>Review</Button>
              <Button variant="success" size="sm" icon={<CheckCircle size={12} />} onClick={() => demoAction('Approve Payroll', 'Payroll approved successfully')}>Approve</Button>
            </div>
          </div>

          {/* Payroll runs table */}
          <Card padding="none" className="overflow-hidden">
            <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
              <SectionHeader title="Payroll History" subtitle="All payroll runs" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="border-b border-surface-100 dark:border-surface-800">
                  <tr>
                    {['Period', 'Employees', 'Gross Pay', 'Deductions', 'Net Pay', 'Processed By', 'Status', ''].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-medium text-surface-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
                  {payrollRuns.map((run) => (
                    <tr key={run.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors group">
                      <td className="px-4 py-3 font-semibold text-surface-800 dark:text-surface-200">{run.period}</td>
                      <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{run.employees}</td>
                      <td className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">{formatCurrency(run.grossPay, true)}</td>
                      <td className="px-4 py-3 text-rose-500">{formatCurrency(run.deductions, true)}</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(run.netPay, true)}</td>
                      <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{run.processedBy}</td>
                      <td className="px-4 py-3"><StatusBadge status={run.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="xs" icon={<Eye size={11} />} onClick={() => demoView('payroll run', run.period)}>View</Button>
                          <Button variant="ghost" size="xs" icon={<Download size={11} />} onClick={() => demoExport(run.period + ' Payroll PDF')}>PDF</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'employees' && (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-surface-100 dark:border-surface-800">
                <tr>
                  {['Employee', 'ID', 'Department', 'Basic Salary', 'Allowances', 'Deductions', 'Net Pay', 'Status'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-surface-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
                {employees.slice(0, 30).map((emp) => (
                  <tr key={emp.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={emp.name} size="sm" />
                        <div>
                          <p className="font-medium text-surface-800 dark:text-surface-200">{emp.name}</p>
                          <p className="text-[10px] text-surface-400">{emp.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-surface-500 dark:text-surface-400">{emp.employeeId}</td>
                    <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{emp.department}</td>
                    <td className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">{formatCurrency(emp.salary, true)}</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400">+{formatCurrency(emp.allowances, true)}</td>
                    <td className="px-4 py-3 text-rose-500">-{formatCurrency(emp.deductions, true)}</td>
                    <td className="px-4 py-3 font-bold text-surface-900 dark:text-surface-100">{formatCurrency(emp.salary + emp.allowances - emp.deductions, true)}</td>
                    <td className="px-4 py-3"><StatusBadge status={emp.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card padding="none" className="overflow-hidden">
            <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
              <SectionHeader title="Payroll Trend" subtitle="Gross vs net over 6 months" />
            </div>
            <div className="p-5">
              <RevenueAreaChart data={monthlyTrend} keys={[{ key: 'gross', color: COLORS.nexora, label: 'Gross' }, { key: 'net', color: COLORS.emerald, label: 'Net' }]} height={220} currency />
            </div>
          </Card>
          <Card padding="none" className="overflow-hidden">
            <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
              <SectionHeader title="Payroll by Department" subtitle="Total salary cost" />
            </div>
            <div className="p-5">
              <MetricBarChart data={deptPayroll} keys={[{ key: 'value', color: COLORS.violet, label: 'Payroll' }]} height={220} currency horizontal />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
