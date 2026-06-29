import React from 'react';
import { Clock, Calendar, TrendingUp, FileText, CheckCircle } from 'lucide-react';
import { Card, Button, SectionHeader, Badge } from '../../components/ui';
import { MetricBarChart } from '../../components/charts';
import { formatDate, cn, COLORS } from '../../utils';
import { leaveRequests, employees } from '../../mock/data';
import { useAppStore } from '../../store';
import { demoAction, demoAdd } from '../../utils/demoActions';

export function EmployeeDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);
  const empRecord = employees.find((e) => e.name === currentUser.name || e.email === currentUser.email);
  const myLeaveRequests = leaveRequests.filter((l) => l.employeeId === currentUser.id || l.employeeName === currentUser.name);
  const approvedLeave = myLeaveRequests.filter((l) => l.status === 'approved');
  const leaveBalance = empRecord?.leaveBalance ?? 21;
  const daysUsed = approvedLeave.reduce((s, l) => s + l.days, 0);

  const attendanceData = Array.from({ length: 5 }, (_, i) => {
    const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i];
    const hours = 7 + Math.floor(Math.random() * 3);
    return { label: day, hours, target: 8 };
  });

  const metrics = [
    { label: 'Attendance Rate', value: `${empRecord?.attendance ?? 94}%`, icon: <Clock size={18} />, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Performance', value: `${empRecord?.performance ?? 82}%`, icon: <TrendingUp size={18} />, color: 'text-nexora-600 bg-nexora-50' },
    { label: 'Leave Balance', value: `${leaveBalance - daysUsed} days`, icon: <Calendar size={18} />, color: 'text-violet-600 bg-violet-50' },
    { label: 'Tasks Done', value: '12/15', icon: <CheckCircle size={18} />, color: 'text-amber-600 bg-amber-50' },
  ];

  const tasks = [
    { id: 't1', title: 'Submit monthly timesheet', due: '2024-06-30', priority: 'high', done: false },
    { id: 't2', title: 'Complete compliance training', due: '2024-07-15', priority: 'medium', done: false },
    { id: 't3', title: 'Review department handbook', due: '2024-07-01', priority: 'low', done: true },
    { id: 't4', title: 'Update emergency contacts', due: '2024-06-28', priority: 'medium', done: false },
    { id: 't5', title: 'Submit expense report Q2', due: '2024-07-05', priority: 'high', done: false },
  ];

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-50">Welcome, {currentUser.name.split(' ')[0]}</h1>
          <p className="text-sm text-surface-400">{empRecord?.position ?? currentUser.department} · {currentUser.branch}</p>
        </div>
        <Button variant="outline" size="sm" icon={<FileText size={14} />} onClick={() => demoAction('My Profile')}>My Profile</Button>
      </div>

      {/* Personal KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((kpi) => (
          <Card key={kpi.label} className="flex items-center gap-4">
            <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', kpi.color, kpi.color.includes('emerald') ? 'dark:bg-emerald-500/10 dark:text-emerald-400' : kpi.color.includes('nexora') ? 'dark:bg-nexora-500/10 dark:text-nexora-400' : kpi.color.includes('violet') ? 'dark:bg-violet-500/10 dark:text-violet-400' : 'dark:bg-amber-500/10 dark:text-amber-400')}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-xs text-surface-400">{kpi.label}</p>
              <p className="text-lg font-bold text-surface-900 dark:text-surface-50">{kpi.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* This Week's Hours + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card padding="none">
          <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
            <SectionHeader title="This Week's Hours" subtitle="Daily attendance" />
          </div>
          <div className="p-5">
            <MetricBarChart data={attendanceData} keys={[
              { key: 'hours', color: COLORS.nexora, label: 'Hours' },
              { key: 'target', color: COLORS.emerald, label: 'Target' },
            ]} height={180} />
          </div>
        </Card>
        <Card>
          <SectionHeader title="My Tasks" subtitle={`${tasks.filter((t) => !t.done).length} remaining`} action={
            <Button variant="ghost" size="xs" onClick={() => demoAdd('Task')}>+ Add Task</Button>
          } />
          <div className="mt-3 space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className={cn('flex items-start gap-3 p-2.5 rounded-lg transition-colors cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800', task.done && 'opacity-50')} onClick={() => demoAction(task.done ? 'Reopen Task' : 'Complete Task', task.title)}>
                <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5', task.done ? 'bg-emerald-500 border-emerald-500' : 'border-surface-300 dark:border-surface-600')}>
                  {task.done && <CheckCircle size={10} className="text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-xs font-medium', task.done ? 'text-surface-400 line-through' : 'text-surface-700 dark:text-surface-300')}>{task.title}</p>
                  <p className="text-[10px] text-surface-400 mt-0.5">Due: {formatDate(task.due)}</p>
                </div>
                <Badge variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'default'} size="sm">{task.priority}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Leave Requests */}
      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
          <SectionHeader title="My Leave Requests" subtitle={`${leaveBalance - daysUsed} days remaining`} />
          <Button variant="primary" size="xs" onClick={() => demoAdd('Leave Request')}>New Request</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-surface-100 dark:border-surface-800">
              <tr>
                {['Type', 'Dates', 'Days', 'Reason', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-surface-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
              {myLeaveRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-surface-400">No leave requests yet</td>
                </tr>
              ) : (
                myLeaveRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-surface-700 dark:text-surface-300 capitalize">{req.type}</td>
                    <td className="px-4 py-3 text-surface-500 whitespace-nowrap">{formatDate(req.startDate)} – {formatDate(req.endDate)}</td>
                    <td className="px-4 py-3 font-semibold text-surface-900 dark:text-surface-100">{req.days}</td>
                    <td className="px-4 py-3 text-surface-500 max-w-[200px] truncate">{req.reason}</td>
                    <td className="px-4 py-3"><Badge variant={req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'danger' : 'warning'}>{req.status}</Badge></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
