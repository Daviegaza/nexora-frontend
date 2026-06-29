import React, { useState } from 'react';
import { Building2, Lock, Bell, Palette, Users, Activity, Plug, ChevronRight, Camera, Save, Eye, EyeOff, Check, AlertTriangle } from 'lucide-react';
import { Card, Button, Input, Select, Badge, SectionHeader, Avatar, Divider } from '../../components/ui';
import { cn } from '../../utils';
import { useAppStore } from '../../store';
import { demoToast, demoAction, demoEdit } from '../../utils/demoActions';

const sidebarItems = [
  { id: 'company', label: 'Company Profile', icon: <Building2 size={15} /> },
  { id: 'users', label: 'Users & Roles', icon: <Users size={15} /> },
  { id: 'branding', label: 'Branding & Theme', icon: <Palette size={15} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
  { id: 'security', label: 'Security', icon: <Lock size={15} /> },
  { id: 'integrations', label: 'Integrations', icon: <Plug size={15} /> },
  { id: 'audit', label: 'Audit Log', icon: <Activity size={15} /> },
];

function CompanySettings() {
  const [saved, setSaved] = useState(false);
  function save() { setSaved(true); setTimeout(() => setSaved(false), 2000); }
  return (
    <div className="space-y-6">
      <SectionHeader title="Company Profile" subtitle="Manage your business information" />
      <Card>
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">N</div>
            <button onClick={() => demoToast('Upload Logo', 'Company logo upload coming soon.')} className="absolute -bottom-1 -right-1 w-7 h-7 bg-nexora-600 rounded-full flex items-center justify-center text-white shadow hover:bg-nexora-700 transition-colors">
              <Camera size={13} />
            </button>
          </div>
          <div>
            <p className="text-sm font-bold text-surface-900 dark:text-surface-50">Nexora Enterprises Ltd</p>
            <p className="text-xs text-surface-400">Registered in Kenya · PIN: P000123456X</p>
            <Badge variant="success" className="mt-1">Verified Business</Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Company Name" defaultValue="Nexora Enterprises Ltd" />
          <Input label="Business Registration No." defaultValue="CPR/2019/123456" />
          <Input label="KRA PIN" defaultValue="P000123456X" />
          <Input label="VAT Number" defaultValue="A000123456X" />
          <Input label="Primary Email" defaultValue="admin@nexora.co.ke" type="email" />
          <Input label="Phone Number" defaultValue="+254 20 3456789" />
          <Input label="Website" defaultValue="https://nexora.co.ke" />
          <Select label="Business Type" options={[{ value: 'limited', label: 'Limited Company' }, { value: 'sole', label: 'Sole Proprietorship' }, { value: 'partnership', label: 'Partnership' }]} defaultValue="limited" />
          <div className="sm:col-span-2">
            <Input label="Physical Address" defaultValue="Westlands Business Park, Waiyaki Way, Nairobi" />
          </div>
          <Select label="Currency" options={[{ value: 'KES', label: 'KES — Kenyan Shilling' }, { value: 'USD', label: 'USD — US Dollar' }, { value: 'EUR', label: 'EUR — Euro' }]} defaultValue="KES" />
          <Select label="Timezone" options={[{ value: 'EAT', label: 'EAT — East Africa Time (UTC+3)' }, { value: 'UTC', label: 'UTC' }]} defaultValue="EAT" />
          <Select label="Date Format" options={[{ value: 'dd-mm-yyyy', label: 'DD/MM/YYYY' }, { value: 'mm-dd-yyyy', label: 'MM/DD/YYYY' }]} defaultValue="dd-mm-yyyy" />
          <Select label="Tax Rate" options={[{ value: '16', label: 'VAT 16% (Standard)' }, { value: '0', label: 'VAT Exempt' }]} defaultValue="16" />
        </div>
        <div className="flex items-center gap-2 mt-6">
          <Button variant="primary" size="sm" icon={saved ? <Check size={14} /> : <Save size={14} />} onClick={save}>
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => demoToast('Cancelled', 'Changes discarded.')}>Cancel</Button>
        </div>
      </Card>
    </div>
  );
}

function UsersSettings() {
  const mockUsers = [
    { name: 'James Mwangi', email: 'james@nexora.co.ke', role: 'Owner', status: 'active', lastLogin: '2 min ago' },
    { name: 'Jane Wanjiku', email: 'jane@nexora.co.ke', role: 'HR Manager', status: 'active', lastLogin: '1 hr ago' },
    { name: 'Peter Kamau', email: 'peter@nexora.co.ke', role: 'Accountant', status: 'active', lastLogin: '3 hr ago' },
    { name: 'Grace Otieno', email: 'grace@nexora.co.ke', role: 'Branch Manager', status: 'active', lastLogin: 'Yesterday' },
    { name: 'David Mutua', email: 'david@nexora.co.ke', role: 'Cashier', status: 'inactive', lastLogin: '5 days ago' },
    { name: 'Faith Hassan', email: 'faith@nexora.co.ke', role: 'Inventory Manager', status: 'active', lastLogin: '2 hr ago' },
  ];
  const roles = [
    { name: 'Super Admin', desc: 'Full system access', users: 1, color: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' },
    { name: 'Owner', desc: 'Business owner access', users: 2, color: 'bg-nexora-100 text-nexora-700 dark:bg-nexora-500/10 dark:text-nexora-400' },
    { name: 'Branch Manager', desc: 'Branch-level management', users: 12, color: 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400' },
    { name: 'Accountant', desc: 'Finance & accounting access', users: 3, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
    { name: 'Cashier', desc: 'POS access only', users: 24, color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' },
    { name: 'Employee', desc: 'Basic access', users: 56, color: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400' },
  ];
  return (
    <div className="space-y-6">
      <SectionHeader title="Users & Roles" subtitle="Manage team access and permissions" action={<Button variant="primary" size="sm" onClick={() => demoAction('Invite User', 'Invitation form coming soon.')}>Invite User</Button>} />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {roles.map((r) => (
          <Card key={r.name} hover>
            <div className="flex items-start justify-between">
              <div>
                <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-lg', r.color)}>{r.name}</span>
                <p className="text-xs text-surface-400 mt-1.5">{r.desc}</p>
              </div>
              <span className="text-lg font-bold text-surface-700 dark:text-surface-300">{r.users}</span>
            </div>
          </Card>
        ))}
      </div>
      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
          <SectionHeader title="Active Users" subtitle={`${mockUsers.length} team members`} action={<Button variant="ghost" size="xs" onClick={() => demoAction('Manage Users', 'Full user management panel coming soon.')}>Manage All</Button>} />
        </div>
        <div className="divide-y divide-surface-50 dark:divide-surface-800">
          {mockUsers.map((u) => (
            <div key={u.email} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
              <Avatar name={u.name} size="sm" status={u.status === 'active' ? 'online' : 'offline'} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-surface-800 dark:text-surface-200">{u.name}</p>
                <p className="text-[10px] text-surface-400">{u.email}</p>
              </div>
              <Badge variant={u.role === 'Owner' ? 'violet' : 'default'}>{u.role}</Badge>
              <span className="text-[10px] text-surface-400 hidden sm:block">{u.lastLogin}</span>
              <Button variant="ghost" size="xs" onClick={() => demoEdit('User')}>Edit</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function BrandingSettings() {
  const { theme, setTheme } = useAppStore();
  const themes = [
    { id: 'light', label: 'Light', preview: 'bg-white border-2' },
    { id: 'dark', label: 'Dark', preview: 'bg-surface-900 border-2' },
  ];
  const accentColors = [
    { id: 'nexora', label: 'Nexora Blue', color: '#5470f1' },
    { id: 'emerald', label: 'Emerald', color: '#10b981' },
    { id: 'violet', label: 'Violet', color: '#8b5cf6' },
    { id: 'rose', label: 'Rose', color: '#f43f5e' },
    { id: 'amber', label: 'Amber', color: '#f59e0b' },
    { id: 'cyan', label: 'Cyan', color: '#06b6d4' },
  ];
  return (
    <div className="space-y-6">
      <SectionHeader title="Branding & Theme" subtitle="Customize your workspace appearance" />
      <Card>
        <p className="text-xs font-semibold text-surface-700 dark:text-surface-300 mb-3">Color Theme</p>
        <div className="flex gap-3">
          {themes.map((t) => (
            <button key={t.id} onClick={() => setTheme(t.id as 'light' | 'dark')} className={cn('flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all', theme === t.id ? 'border-nexora-500' : 'border-surface-200 dark:border-surface-700 hover:border-surface-300')}>
              <div className={cn('w-24 h-14 rounded-lg', t.preview, theme === t.id ? 'border-nexora-500' : 'border-surface-200 dark:border-surface-700')}>
                <div className={cn('h-3 rounded-t-lg', t.id === 'dark' ? 'bg-surface-800' : 'bg-nexora-500')} />
                <div className="flex gap-1 p-1.5 mt-1">
                  <div className={cn('w-5 h-5 rounded', t.id === 'dark' ? 'bg-surface-700' : 'bg-surface-100')} />
                  <div className="flex-1 space-y-1">
                    <div className={cn('h-1.5 rounded', t.id === 'dark' ? 'bg-surface-700' : 'bg-surface-200')} />
                    <div className={cn('h-1.5 rounded w-2/3', t.id === 'dark' ? 'bg-surface-700' : 'bg-surface-200')} />
                  </div>
                </div>
              </div>
              <span className="text-xs font-medium text-surface-700 dark:text-surface-300">{t.label}</span>
              {theme === t.id && <Check size={12} className="text-nexora-500" />}
            </button>
          ))}
        </div>
      </Card>
      <Card>
        <p className="text-xs font-semibold text-surface-700 dark:text-surface-300 mb-3">Accent Color</p>
        <div className="flex flex-wrap gap-3">
          {accentColors.map((c) => (
            <button key={c.id} onClick={() => demoToast('Accent Color', `Switched to ${c.label}.`)} className="flex flex-col items-center gap-1.5 group">
              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-surface-900 shadow-md hover:scale-110 transition-transform" style={{ background: c.color }} />
              <span className="text-[10px] text-surface-400 group-hover:text-surface-600">{c.label}</span>
            </button>
          ))}
        </div>
      </Card>
      <Card>
        <p className="text-xs font-semibold text-surface-700 dark:text-surface-300 mb-4">Sidebar & Layout</p>
        <div className="space-y-3">
          {[
            { label: 'Compact Sidebar', desc: 'Use icon-only sidebar by default' },
            { label: 'Blur Effects', desc: 'Enable glass morphism and blur' },
            { label: 'Animations', desc: 'Enable micro-interactions and transitions' },
            { label: 'High Contrast', desc: 'Increase contrast for accessibility' },
          ].map((opt) => (
            <div key={opt.label} className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-surface-700 dark:text-surface-300">{opt.label}</p>
                <p className="text-[10px] text-surface-400">{opt.desc}</p>
              </div>
              <button onClick={() => demoToast('Setting toggled', `${opt.label} preference saved.`, 'success')} className="w-10 h-5 bg-nexora-500 rounded-full relative transition-colors">
                <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function NotificationsSettings() {
  const categories = [
    { label: 'Sales & Transactions', items: ['New sale completed', 'Refund processed', 'Daily sales summary', 'Weekly report'] },
    { label: 'Inventory', items: ['Low stock alert', 'Out of stock alert', 'PO delivered', 'Expiry warning'] },
    { label: 'Finance', items: ['Invoice overdue', 'Invoice paid', 'Payroll due', 'Budget exceeded'] },
    { label: 'HR & People', items: ['Leave request', 'Leave approved/rejected', 'New employee', 'Performance review due'] },
  ];
  return (
    <div className="space-y-6">
      <SectionHeader title="Notification Preferences" subtitle="Control how and when you receive alerts" />
      <Card>
        <div className="space-y-5">
          {categories.map((cat) => (
            <div key={cat.label}>
              <p className="text-xs font-semibold text-surface-700 dark:text-surface-300 mb-3">{cat.label}</p>
              <div className="space-y-2.5">
                {cat.items.map((item) => (
                  <div key={item} className="flex items-center justify-between">
                    <p className="text-xs text-surface-600 dark:text-surface-400">{item}</p>
                    <div className="flex items-center gap-3">
                      {['Email', 'Push', 'SMS'].map((ch) => (
                        <label key={ch} className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" defaultChecked={ch !== 'SMS'} className="w-3.5 h-3.5 rounded accent-nexora-600" />
                          <span className="text-[10px] text-surface-400">{ch}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Divider className="mt-4" />
            </div>
          ))}
        </div>
        <Button variant="primary" size="sm" className="mt-4" icon={<Save size={13} />} onClick={() => demoToast('Saved', 'Notification preferences updated.', 'success')}>Save Preferences</Button>
      </Card>
    </div>
  );
}

function SecuritySettings() {
  const [showPass, setShowPass] = useState(false);
  const sessions = [
    { device: 'Chrome on macOS', location: 'Nairobi, Kenya', time: 'Active now', current: true },
    { device: 'Safari on iPhone 15', location: 'Nairobi, Kenya', time: '2 hours ago', current: false },
    { device: 'Chrome on Windows', location: 'Mombasa, Kenya', time: 'Yesterday', current: false },
  ];
  const auditItems = [
    { action: 'Login', detail: 'Successful login from 197.136.xx.xx', time: '2 min ago', type: 'success' },
    { action: 'Export', detail: 'Sales report exported (June 2024)', time: '1 hr ago', type: 'info' },
    { action: 'Settings', detail: 'VAT rate updated from 14% to 16%', time: '3 hr ago', type: 'warning' },
    { action: 'User Created', detail: 'New user: faith.hassan@nexora.co.ke', time: 'Yesterday', type: 'info' },
    { action: 'Login Failed', detail: 'Failed login attempt from 41.90.xx.xx', time: '2 days ago', type: 'danger' },
  ];
  return (
    <div className="space-y-6">
      <SectionHeader title="Security Settings" subtitle="Protect your business account" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <p className="text-xs font-semibold text-surface-700 dark:text-surface-300 mb-4">Change Password</p>
          <div className="space-y-3">
            <Input label="Current Password" type={showPass ? 'text' : 'password'} placeholder="••••••••" iconRight={<button onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff size={14} /> : <Eye size={14} />}</button>} />
            <Input label="New Password" type="password" placeholder="••••••••" />
            <Input label="Confirm New Password" type="password" placeholder="••••••••" />
          </div>
          <div className="mt-4 space-y-1">
            {[['At least 8 characters', true], ['Contains uppercase letter', true], ['Contains number', false], ['Contains special character', false]].map(([rule, met]) => (
              <p key={rule as string} className={cn('text-[10px] flex items-center gap-1.5', met ? 'text-emerald-600 dark:text-emerald-400' : 'text-surface-400')}>
                <Check size={10} className={met ? 'opacity-100' : 'opacity-0'} />
                {rule as string}
              </p>
            ))}
          </div>
          <Button variant="primary" size="sm" className="mt-4" onClick={() => demoToast('Password Update', 'Password change flow coming soon.')}>Update Password</Button>
        </Card>
        <Card>
          <p className="text-xs font-semibold text-surface-700 dark:text-surface-300 mb-4">Two-Factor Authentication</p>
          <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl mb-4">
            <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">2FA Not Enabled</p>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">Enable two-factor authentication to secure your account</p>
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={() => demoToast('2FA Setup', 'Two-factor authentication setup wizard coming soon.')}>Enable 2FA</Button>
          <Divider className="my-4" />
          <p className="text-xs font-semibold text-surface-700 dark:text-surface-300 mb-3">Active Sessions</p>
          <div className="space-y-2">
            {sessions.map((s) => (
              <div key={s.device} className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-surface-700 dark:text-surface-300">{s.device}</p>
                  <p className="text-[10px] text-surface-400">{s.location} · {s.time}</p>
                </div>
                {s.current ? <Badge variant="success">Current</Badge> : <Button variant="ghost" size="xs" onClick={() => demoToast('Session Revoked', 'Session has been terminated.')}>Revoke</Button>}
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
          <SectionHeader title="Recent Security Events" />
        </div>
        <div className="divide-y divide-surface-50 dark:divide-surface-800">
          {auditItems.map((item, i) => {
            const colors = { success: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10', info: 'text-nexora-500 bg-nexora-50 dark:bg-nexora-500/10', warning: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10', danger: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' };
            return (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold', colors[item.type as keyof typeof colors])}>{item.action[0]}</div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-surface-800 dark:text-surface-200">{item.action}</p>
                  <p className="text-[10px] text-surface-400">{item.detail}</p>
                </div>
                <span className="text-[10px] text-surface-400">{item.time}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function IntegrationsSettings() {
  const integrations = [
    { name: 'M-Pesa Daraja', desc: 'Accept M-Pesa payments directly', icon: '📱', status: 'connected', category: 'Payments' },
    { name: 'Safaricom SMS', desc: 'Send SMS notifications to customers', icon: '💬', status: 'connected', category: 'Messaging' },
    { name: 'KRA iTax', desc: 'Automated tax filing and compliance', icon: '🏛️', status: 'disconnected', category: 'Finance' },
    { name: 'QuickBooks', desc: 'Sync financial data with QuickBooks', icon: '📊', status: 'disconnected', category: 'Accounting' },
    { name: 'Shopify', desc: 'Sync online store inventory', icon: '🛍️', status: 'disconnected', category: 'eCommerce' },
    { name: 'Google Workspace', desc: 'SSO and Drive integration', icon: '🔵', status: 'connected', category: 'Productivity' },
    { name: 'Slack', desc: 'Get business alerts in Slack', icon: '💼', status: 'disconnected', category: 'Messaging' },
    { name: 'WooCommerce', desc: 'WordPress e-commerce sync', icon: '🛒', status: 'disconnected', category: 'eCommerce' },
    { name: 'Airtel Money', desc: 'Accept Airtel Money payments', icon: '📡', status: 'disconnected', category: 'Payments' },
    { name: 'Pesapal', desc: 'Multi-channel payment gateway', icon: '💳', status: 'disconnected', category: 'Payments' },
  ];
  const categories = [...new Set(integrations.map((i) => i.category))];
  return (
    <div className="space-y-6">
      <SectionHeader title="Integrations" subtitle="Connect NEXORA AI with your tools" />
      {categories.map((cat) => (
        <div key={cat}>
          <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">{cat}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {integrations.filter((i) => i.category === cat).map((intg) => (
              <Card key={intg.name} className="flex items-center gap-4">
                <div className="w-11 h-11 bg-surface-50 dark:bg-surface-800 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{intg.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-surface-800 dark:text-surface-200">{intg.name}</p>
                  <p className="text-[10px] text-surface-400 truncate">{intg.desc}</p>
                </div>
                <Button variant={intg.status === 'connected' ? 'secondary' : 'primary'} size="xs" onClick={() => demoAction(intg.status === 'connected' ? 'Manage' : 'Connect', intg.name)}>
                  {intg.status === 'connected' ? 'Manage' : 'Connect'}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState('company');
  const sections: Record<string, React.ReactNode> = {
    company: <CompanySettings />,
    users: <UsersSettings />,
    branding: <BrandingSettings />,
    notifications: <NotificationsSettings />,
    security: <SecuritySettings />,
    integrations: <IntegrationsSettings />,
    audit: <div className="text-center py-16 text-surface-400 text-sm">Audit log coming soon</div>,
  };
  return (
    <div className="flex h-[calc(100vh-60px)] overflow-hidden">
      {/* Settings sidebar */}
      <div className="w-[220px] flex-shrink-0 border-r border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 overflow-y-auto">
        <div className="p-4">
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Settings</p>
          <nav className="space-y-0.5">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn('w-full flex items-center gap-2.5 px-3 h-9 rounded-lg text-xs font-medium transition-all text-left', activeSection === item.id ? 'bg-nexora-50 dark:bg-nexora-500/10 text-nexora-700 dark:text-nexora-400' : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800')}
              >
                <span className={cn('flex-shrink-0', activeSection === item.id ? 'text-nexora-500' : 'text-surface-400')}>{item.icon}</span>
                {item.label}
                {activeSection === item.id && <ChevronRight size={12} className="ml-auto" />}
              </button>
            ))}
          </nav>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
        <div className="max-w-3xl mx-auto">
          {sections[activeSection]}
        </div>
      </div>
    </div>
  );
}
