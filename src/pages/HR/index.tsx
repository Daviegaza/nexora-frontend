import React, { useState } from 'react';
import { Calendar, Clock, TrendingUp, Plus, Filter, CheckCircle, X, Download, UserCog } from 'lucide-react';
import { Card, Button, Avatar, StatusBadge, Badge, SectionHeader, ProgressBar, Tabs } from '../../components/ui';
import { DonutChart } from '../../components/charts';
import { formatDate, cn, COLORS } from '../../utils';
import { demoExport, demoAdd, demoAction } from '../../utils/demoActions';
import { employees, leaveRequests, branches } from '../../mock/data';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'leave', label: 'Leave Requests', count: leaveRequests.filter((l) => l.status === 'pending').length },
  { id: 'performance', label: 'Performance' },
];

export default function HR() {
  const [activeTab, setActiveTab] = useState('overview');

  const deptData = ['Sales', 'Finance', 'Operations', 'IT', 'HR', 'Procurement'].map((dept, i) => ({
    label: dept,
    value: employees.filter((e) => e.department === dept).length,
    color: Object.values(COLORS)[i],
  }));

  const avgPerformance = Math.round(employees.reduce((s, e) => s + e.performance, 0) / employees.length);
  const avgAttendance = Math.round(employees.reduce((s, e) => s + e.attendance, 0) / employees.length);
  const onLeave = employees.filter((e) => e.status === 'on_leave').length;
  const pendingLeave = leaveRequests.filter((l) => l.status === 'pending').length;

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-50">HR & People</h1>
          <p className="text-sm text-surface-400">{employees.length} employees across {branches.length} branches</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => demoExport('HR Data')}>Export</Button>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => demoAdd('employee')}>Add Employee</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: employees.length, icon: <UserCog size={18} />, color: 'text-nexora-600 bg-nexora-50 dark:text-nexora-400 dark:bg-nexora-500/10' },
          { label: 'On Leave Today', value: onLeave, icon: <Calendar size={18} />, color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10' },
          { label: 'Avg Performance', value: `${avgPerformance}%`, icon: <TrendingUp size={18} />, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' },
          { label: 'Pending Leave', value: pendingLeave, icon: <Clock size={18} />, color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10' },
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

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card>
            <SectionHeader title="Headcount by Department" subtitle="Employee distribution" />
            <DonutChart data={deptData} height={200} />
          </Card>
          <Card className="lg:col-span-2">
            <SectionHeader title="Workforce Summary" subtitle="Key HR metrics" />
            <div className="mt-4 space-y-4">
              {[
                { label: 'Active Employees', value: employees.filter((e) => e.status === 'active').length, max: employees.length, color: 'emerald' },
                { label: 'Average Attendance Rate', value: avgAttendance, max: 100, color: 'nexora', suffix: '%' },
                { label: 'Average Performance Score', value: avgPerformance, max: 100, color: 'violet', suffix: '%' },
                { label: 'Leave Balance Utilization', value: 45, max: 100, color: 'amber', suffix: '%' },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-surface-700 dark:text-surface-300">{m.label}</span>
                    <span className="font-bold text-surface-900 dark:text-surface-100">{m.value}{m.suffix ?? `/${m.max}`}</span>
                  </div>
                  <ProgressBar value={m.value} max={m.max} color={m.color as 'nexora'} size="sm" />
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { label: 'Departments', value: 10 },
                { label: 'Avg Leave Days Left', value: Math.round(employees.reduce((s, e) => s + e.leaveBalance, 0) / employees.length) },
                { label: 'New Hires (Q2)', value: 12 },
              ].map((s) => (
                <div key={s.label} className="text-center py-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
                  <p className="text-xl font-bold text-surface-900 dark:text-surface-50">{s.value}</p>
                  <p className="text-[10px] text-surface-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'attendance' && (
        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
            <SectionHeader title="Attendance Today" subtitle={formatDate(new Date().toISOString())} />
            <Button variant="outline" size="sm" icon={<Filter size={12} />} onClick={() => demoAction('Filter Attendance', 'Filtering attendance records...')}>Filter</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-surface-100 dark:border-surface-800">
                <tr>
                  {['Employee', 'Department', 'Branch', 'Check In', 'Check Out', 'Status', 'Overtime'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-surface-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
                {employees.slice(0, 20).map((emp, i) => {
                  const statuses = ['present', 'present', 'present', 'late', 'absent', 'on_leave', 'present', 'half_day', 'present', 'present'];
                  const status = statuses[i % statuses.length] as 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';
                  const checkIn = status === 'absent' ? null : status === 'late' ? '09:' + String(Math.floor(Math.random() * 30) + 15).padStart(2, '0') : '08:' + String(Math.floor(Math.random() * 15)).padStart(2, '0');
                  const checkOut = (status === 'present' || status === 'late') && i % 3 !== 0 ? '17:' + String(Math.floor(Math.random() * 30)).padStart(2, '0') : null;
                  const overtime = status === 'present' && i % 4 === 0 ? Math.floor(Math.random() * 120) : 0;
                  return (
                    <tr key={emp.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={emp.name} size="sm" status={status === 'present' ? 'online' : status === 'absent' ? 'offline' : 'away'} />
                          <span className="font-medium text-surface-800 dark:text-surface-200">{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{emp.department}</td>
                      <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{emp.branch}</td>
                      <td className="px-4 py-3 font-mono text-surface-700 dark:text-surface-300">{checkIn ?? '—'}</td>
                      <td className="px-4 py-3 font-mono text-surface-700 dark:text-surface-300">{checkOut ?? '—'}</td>
                      <td className="px-4 py-3"><StatusBadge status={status} /></td>
                      <td className="px-4 py-3">{overtime > 0 ? <span className="text-amber-600 dark:text-amber-400 font-medium">{overtime}m</span> : <span className="text-surface-300">—</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'leave' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-surface-500">{pendingLeave} requests pending approval</p>
            <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => demoAdd('leave request')}>New Request</Button>
          </div>
          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="border-b border-surface-100 dark:border-surface-800">
                  <tr>
                    {['Employee', 'Type', 'From', 'To', 'Days', 'Reason', 'Status', 'Action'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-medium text-surface-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
                  {leaveRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={req.employeeName} size="sm" />
                          <span className="font-medium text-surface-800 dark:text-surface-200">{req.employeeName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize text-surface-600 dark:text-surface-400">{req.type.replace('_', ' ')}</td>
                      <td className="px-4 py-3 text-surface-500 dark:text-surface-400 whitespace-nowrap">{formatDate(req.startDate)}</td>
                      <td className="px-4 py-3 text-surface-500 dark:text-surface-400 whitespace-nowrap">{formatDate(req.endDate)}</td>
                      <td className="px-4 py-3 font-semibold text-surface-800 dark:text-surface-200">{req.days}</td>
                      <td className="px-4 py-3 text-surface-500 dark:text-surface-400 max-w-[120px] truncate">{req.reason}</td>
                      <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                      <td className="px-4 py-3">
                        {req.status === 'pending' && (
                          <div className="flex gap-1">
                            <button onClick={() => demoAction('Approve Leave', `Leave approved for ${req.employeeName}`)} className="w-7 h-7 flex items-center justify-center bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">
                              <CheckCircle size={13} />
                            </button>
                            <button onClick={() => demoAction('Reject Leave', `Leave rejected for ${req.employeeName}`)} className="w-7 h-7 flex items-center justify-center bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors">
                              <X size={13} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'performance' && (
        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
            <SectionHeader title="Employee Performance" subtitle="Scores based on KPIs and attendance" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-surface-100 dark:border-surface-800">
                <tr>
                  {['Employee', 'Department', 'Branch', 'Performance', 'Attendance', 'Leave Balance', 'Status'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-surface-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
                {employees.slice(0, 25).map((emp) => (
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
                    <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{emp.department}</td>
                    <td className="px-4 py-3 text-surface-500 dark:text-surface-400">{emp.branch}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ProgressBar value={emp.performance} color={emp.performance >= 80 ? 'emerald' : emp.performance >= 65 ? 'nexora' : 'rose'} size="xs" className="w-16" />
                        <span className={cn('font-semibold', emp.performance >= 80 ? 'text-emerald-600 dark:text-emerald-400' : emp.performance >= 65 ? 'text-nexora-600 dark:text-nexora-400' : 'text-rose-500')}>{emp.performance}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ProgressBar value={emp.attendance} color={emp.attendance >= 90 ? 'emerald' : 'amber'} size="xs" className="w-16" />
                        <span className="font-medium text-surface-700 dark:text-surface-300">{emp.attendance}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={emp.leaveBalance > 10 ? 'success' : emp.leaveBalance > 5 ? 'warning' : 'danger'}>
                        {emp.leaveBalance} days
                      </Badge>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={emp.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
