import React from 'react';
import { Users, UserCheck, Calendar, Clock, TrendingUp, UserCog, FileText, CheckCircle, X } from 'lucide-react';
import { Card, Button, SectionHeader, Badge, ProgressBar, Avatar } from '../../components/ui';
import { DonutChart, MetricBarChart } from '../../components/charts';
import { formatDate, cn, COLORS } from '../../utils';
import { employees, leaveRequests, branches } from '../../mock/data';
import { useAppStore } from '../../store';
import { demoAction, demoExport } from '../../utils/demoActions';

export function HRDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);
  const activeEmployees = employees.filter((e) => e.status === 'active');
  const onLeave = employees.filter((e) => e.status === 'on_leave');
  const pendingLeave = leaveRequests.filter((l) => l.status === 'pending');
  const avgPerformance = Math.round(employees.reduce((s, e) => s + e.performance, 0) / employees.length);
  const avgAttendance = Math.round(employees.reduce((s, e) => s + e.attendance, 0) / employees.length);

  const deptData = ['Sales', 'Finance', 'Operations', 'IT', 'HR', 'Procurement', 'Marketing', 'Customer Service'].map((dept, i) => ({
    label: dept,
    value: employees.filter((e) => e.department === dept).length,
    color: Object.values(COLORS)[i % Object.values(COLORS).length],
  }));

  const monthlyHires = Array.from({ length: 6 }, (_, i) => ({
    label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
    hires: Math.floor(Math.random() * 5) + 1,
    departures: Math.floor(Math.random() * 3),
  }));

  const topPerformers = [...employees].sort((a, b) => b.performance - a.performance).slice(0, 5);
  const lowAttendance = [...employees].filter((e) => e.attendance < 85).slice(0, 5);

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-50">HR Dashboard</h1>
          <p className="text-sm text-surface-400">{employees.length} employees · {branches.length} branches · Welcome, {currentUser.name.split(' ')[0]}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<FileText size={14} />} onClick={() => demoExport('HR Report')}>Export</Button>
          <Button variant="primary" size="sm" icon={<UserCog size={14} />} onClick={() => window.location.assign('/hr')}>HR Center</Button>
        </div>
      </div>

      {/* Key HR KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Employees', value: employees.length, icon: <Users size={18} />, color: 'text-nexora-600 bg-nexora-50 dark:text-nexora-400 dark:bg-nexora-500/10' },
          { label: 'Active', value: activeEmployees.length, icon: <UserCheck size={18} />, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' },
          { label: 'On Leave Today', value: onLeave.length, icon: <Calendar size={18} />, color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10' },
          { label: 'Avg Performance', value: `${avgPerformance}%`, icon: <TrendingUp size={18} />, color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10' },
          { label: 'Avg Attendance', value: `${avgAttendance}%`, icon: <Clock size={18} />, color: 'text-cyan-600 bg-cyan-50 dark:text-cyan-400 dark:bg-cyan-500/10' },
        ].map((kpi) => (
          <Card key={kpi.label} className="flex flex-col items-center text-center py-4">
            <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center mb-3', kpi.color)}>{kpi.icon}</div>
            <p className="text-lg font-bold text-surface-900 dark:text-surface-50">{kpi.value}</p>
            <p className="text-xs text-surface-400">{kpi.label}</p>
          </Card>
        ))}
      </div>

      {/* Dept Distribution + Hiring Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <SectionHeader title="Headcount by Department" subtitle="Employee distribution" />
          <DonutChart data={deptData} height={200} />
        </Card>
        <Card padding="none">
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
            <SectionHeader title="Hiring & Attrition" subtitle="6-month trend" />
          </div>
          <div className="p-5">
            <MetricBarChart
              data={monthlyHires}
              keys={[
                { key: 'hires', color: COLORS.emerald, label: 'Hires' },
                { key: 'departures', color: COLORS.rose, label: 'Departures' },
              ]}
              height={200}
            />
          </div>
        </Card>
      </div>

      {/* Pending Leave + Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card padding="none" className="lg:col-span-2 overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
            <SectionHeader title="Pending Leave Requests" subtitle={`${pendingLeave.length} awaiting approval`} />
            <Button variant="ghost" size="xs" onClick={() => window.location.assign('/hr')}>View All</Button>
          </div>
          <div className="divide-y divide-surface-50 dark:divide-surface-800">
            {pendingLeave.slice(0, 6).map((req) => (
              <div key={req.id} className="flex items-center gap-4 px-5 py-3 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                <Avatar name={req.employeeName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-surface-800 dark:text-surface-200">{req.employeeName}</p>
                  <p className="text-[10px] text-surface-400">{req.type} · {req.days} days · {formatDate(req.startDate)} – {formatDate(req.endDate)}</p>
                </div>
                <Badge variant="warning">Pending</Badge>
                <div className="flex gap-1">
                  <button onClick={() => demoAction('Approve Leave', `Leave approved for ${req.employeeName}`)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-surface-400 hover:text-emerald-600 transition-colors"><CheckCircle size={14} /></button>
                  <button onClick={() => demoAction('Reject Leave', `Leave rejected for ${req.employeeName}`)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-surface-400 hover:text-rose-500 transition-colors"><X size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Top Performers" subtitle="By performance score" />
          <div className="mt-3 space-y-3">
            {topPerformers.map((emp, i) => (
              <div key={emp.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-surface-300 w-4">#{i + 1}</span>
                <Avatar name={emp.name} size="xs" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-surface-700 dark:text-surface-300 truncate">{emp.name}</p>
                  <p className="text-[10px] text-surface-400">{emp.department}</p>
                </div>
                <span className={cn('text-xs font-bold', emp.performance >= 85 ? 'text-emerald-600' : 'text-nexora-600')}>{emp.performance}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Attendance Issues */}
      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
          <SectionHeader title="Attendance Concerns" subtitle="Below 85% attendance rate" />
          <Badge variant="warning">{lowAttendance.length} employees</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-surface-100 dark:border-surface-800">
              <tr>
                {['Employee', 'Department', 'Branch', 'Attendance', 'Performance', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-surface-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
              {lowAttendance.map((emp) => (
                <tr key={emp.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors cursor-pointer" onClick={() => demoAction('View Employee', emp.name)}>
                  <td className="px-4 py-3 font-semibold text-surface-800 dark:text-surface-200">{emp.name}</td>
                  <td className="px-4 py-3 text-surface-500">{emp.department}</td>
                  <td className="px-4 py-3 text-surface-500">{emp.branch}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={emp.attendance} color="rose" size="xs" className="w-12" />
                      <span className="text-rose-500 font-semibold">{emp.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-surface-500">{emp.performance}%</td>
                  <td className="px-4 py-3"><Badge variant={emp.status === 'active' ? 'success' : 'warning'}>{emp.status.replace('_', ' ')}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
