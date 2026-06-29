import React, { useState, useMemo } from 'react';
import { Search, Plus, Download, Users, DollarSign, TrendingUp, UserCheck } from 'lucide-react';
import { Card, Button, Input, Avatar, StatusBadge, Badge, ProgressBar } from '../../components/ui';
import { formatCurrency, cn } from '../../utils';
import { demoExport, demoAdd, demoView } from '../../utils/demoActions';
import { employees } from '../../mock/data';

export default function Employees() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const departments = ['all', ...Array.from(new Set(employees.map((e) => e.department)))];

  const filtered = useMemo(() => employees.filter((e) => {
    if (deptFilter !== 'all' && e.department !== deptFilter) return false;
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.employeeId.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [search, deptFilter, statusFilter]);

  const totalPayroll = employees.reduce((s, e) => s + e.salary, 0);
  const avgPerformance = Math.round(employees.reduce((s, e) => s + e.performance, 0) / employees.length);

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-50">Employees</h1>
          <p className="text-sm text-surface-400">{employees.length} employees · {employees.filter((e) => e.status === 'active').length} active</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => demoExport('employees')}>Export</Button>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => demoAdd('employee')}>Add Employee</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: employees.length, icon: <Users size={18} />, color: 'text-nexora-600 bg-nexora-50 dark:text-nexora-400 dark:bg-nexora-500/10' },
          { label: 'Total Payroll/Mo', value: formatCurrency(totalPayroll, true), icon: <DollarSign size={18} />, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' },
          { label: 'Avg Performance', value: `${avgPerformance}%`, icon: <TrendingUp size={18} />, color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10' },
          { label: 'Active', value: employees.filter((e) => e.status === 'active').length, icon: <UserCheck size={18} />, color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10' },
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

      <div className="flex flex-wrap items-center gap-2">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employees..." icon={<Search size={14} />} className="w-56" />
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="h-9 px-3 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg text-xs text-surface-700 dark:text-surface-300 outline-none">
          {departments.map((d) => <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 px-3 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg text-xs text-surface-700 dark:text-surface-300 outline-none">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="on_leave">On Leave</option>
          <option value="inactive">Inactive</option>
        </select>
        <span className="ml-auto text-xs text-surface-400">{filtered.length} employees</span>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-surface-100 dark:border-surface-800">
              <tr>
                {['Employee', 'ID', 'Position', 'Department', 'Branch', 'Salary', 'Performance', 'Attendance', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-surface-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
              {filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors group cursor-pointer" onClick={() => demoView('employee', emp.name)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={emp.name} size="sm" status={emp.status === 'active' ? 'online' : emp.status === 'on_leave' ? 'away' : 'offline'} />
                      <div>
                        <p className="font-semibold text-surface-800 dark:text-surface-200">{emp.name}</p>
                        <p className="text-[10px] text-surface-400">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-surface-500 dark:text-surface-400">{emp.employeeId}</td>
                  <td className="px-4 py-3 text-surface-600 dark:text-surface-400 max-w-[140px] truncate">{emp.position}</td>
                  <td className="px-4 py-3"><Badge variant="default">{emp.department}</Badge></td>
                  <td className="px-4 py-3 text-surface-500 dark:text-surface-400 whitespace-nowrap">{emp.branch}</td>
                  <td className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">{formatCurrency(emp.salary, true)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={emp.performance} color={emp.performance >= 80 ? 'emerald' : emp.performance >= 65 ? 'nexora' : 'rose'} size="xs" className="w-14" />
                      <span className={cn('font-semibold text-xs', emp.performance >= 80 ? 'text-emerald-600 dark:text-emerald-400' : emp.performance >= 65 ? 'text-nexora-600 dark:text-nexora-400' : 'text-rose-500')}>{emp.performance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={emp.attendance} color={emp.attendance >= 90 ? 'emerald' : 'amber'} size="xs" className="w-14" />
                      <span className="text-surface-600 dark:text-surface-400 font-medium">{emp.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={emp.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
