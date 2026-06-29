import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, ShoppingCart, Package, Users, Calculator, DollarSign, UserCheck, BarChart2, TrendingUp, FileText, Settings, Bot, Building2, Truck, UserCog, X, ArrowRight, Command } from 'lucide-react';
import { cn } from '../../utils';
import { useAppStore } from '../../store';

interface CommandItem {
  id: string; label: string; description?: string; icon: React.ReactNode;
  path?: string; action?: () => void; category: string; keywords?: string[];
}

const allCommands: CommandItem[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'Business overview', icon: <LayoutDashboard size={16} />, path: '/', category: 'Navigation', keywords: ['home', 'overview'] },
  { id: 'pos', label: 'Point of Sale', description: 'Process transactions', icon: <ShoppingCart size={16} />, path: '/pos', category: 'Navigation', keywords: ['sale', 'checkout', 'payment'] },
  { id: 'inventory', label: 'Inventory', description: 'Stock management', icon: <Package size={16} />, path: '/inventory', category: 'Navigation', keywords: ['stock', 'products', 'warehouse'] },
  { id: 'crm', label: 'CRM', description: 'Customer relationships', icon: <Users size={16} />, path: '/crm', category: 'Navigation', keywords: ['leads', 'pipeline', 'deals'] },
  { id: 'customers', label: 'Customers', description: 'Customer database', icon: <UserCheck size={16} />, path: '/customers', category: 'Navigation' },
  { id: 'accounting', label: 'Accounting', description: 'Financial management', icon: <Calculator size={16} />, path: '/accounting', category: 'Navigation', keywords: ['finance', 'invoices', 'bills'] },
  { id: 'payroll', label: 'Payroll', description: 'Employee compensation', icon: <DollarSign size={16} />, path: '/payroll', category: 'Navigation', keywords: ['salary', 'wages', 'staff pay'] },
  { id: 'hr', label: 'HR & People', description: 'Human resources', icon: <UserCog size={16} />, path: '/hr', category: 'Navigation', keywords: ['leave', 'attendance', 'recruitment'] },
  { id: 'employees', label: 'Employees', description: 'Team management', icon: <UserCog size={16} />, path: '/employees', category: 'Navigation', keywords: ['staff', 'team', 'workforce'] },
  { id: 'suppliers', label: 'Suppliers', description: 'Vendor management', icon: <Truck size={16} />, path: '/suppliers', category: 'Navigation', keywords: ['vendors', 'purchase orders'] },
  { id: 'branches', label: 'Branches', description: 'Multi-location management', icon: <Building2 size={16} />, path: '/branches', category: 'Navigation', keywords: ['locations', 'offices'] },
  { id: 'reports', label: 'Reports', description: 'Business reports', icon: <FileText size={16} />, path: '/reports', category: 'Navigation' },
  { id: 'analytics', label: 'Analytics', description: 'Data insights', icon: <TrendingUp size={16} />, path: '/analytics', category: 'Navigation' },
  { id: 'ai', label: 'AI Assistant', description: 'Business intelligence', icon: <Bot size={16} />, path: '/ai', category: 'Navigation', keywords: ['chat', 'insights', 'recommendations'] },
  { id: 'settings', label: 'Settings', description: 'System configuration', icon: <Settings size={16} />, path: '/settings', category: 'Navigation' },
  { id: 'new-sale', label: 'New Sale', description: 'Open POS and start a new sale', icon: <ShoppingCart size={16} />, path: '/pos', category: 'Actions', keywords: ['create sale', 'quick sale'] },
  { id: 'new-customer', label: 'Add Customer', description: 'Register a new customer', icon: <UserCheck size={16} />, path: '/customers', category: 'Actions' },
  { id: 'new-product', label: 'Add Product', description: 'Add to inventory', icon: <Package size={16} />, path: '/inventory', category: 'Actions' },
  { id: 'run-payroll', label: 'Run Payroll', description: 'Process current period payroll', icon: <DollarSign size={16} />, path: '/payroll', category: 'Actions' },
  { id: 'sales-report', label: 'Sales Report', description: 'View latest sales report', icon: <BarChart2 size={16} />, path: '/reports', category: 'Reports' },
  { id: 'inventory-report', label: 'Inventory Report', description: 'Stock status report', icon: <Package size={16} />, path: '/reports', category: 'Reports' },
];

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  const filtered = useMemo(() => {
    if (!query) return allCommands.slice(0, 8);
    const q = query.toLowerCase();
    return allCommands.filter((c) =>
      c.label.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.keywords?.some((k) => k.toLowerCase().includes(q))
    ).slice(0, 10);
  }, [query]);

  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filtered.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [filtered]);

  const allFiltered = filtered;

  const run = useCallback((item: CommandItem) => {
    if (item.action) item.action();
    if (item.path) navigate(item.path);
    setCommandPaletteOpen(false);
  }, [navigate, setCommandPaletteOpen]);

  useEffect(() => {
    if (!commandPaletteOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setCommandPaletteOpen(false); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, allFiltered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
      if (e.key === 'Enter') { e.preventDefault(); if (allFiltered[selected]) run(allFiltered[selected]); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [commandPaletteOpen, allFiltered, selected, setCommandPaletteOpen, run]);

  if (!commandPaletteOpen) return null;

  let itemIndex = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCommandPaletteOpen(false)} />
      <div className="relative w-full max-w-[560px] bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-modal overflow-hidden animate-scale-in">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-surface-100 dark:border-surface-800">
          <Search size={18} className="text-surface-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            placeholder="Search pages, actions, reports..."
            className="flex-1 bg-transparent text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300">
              <X size={14} />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-surface-100 dark:bg-surface-800 rounded text-[10px] text-surface-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto py-2">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className="px-4 py-1.5 text-[10px] font-semibold text-surface-400 uppercase tracking-wider">{category}</div>
              {items.map((item) => {
                const idx = itemIndex++;
                const isSelected = selected === idx;
                return (
                  <button
                    key={item.id}
                    onClick={() => run(item)}
                    onMouseEnter={() => setSelected(idx)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                      isSelected ? 'bg-nexora-50 dark:bg-nexora-500/10' : 'hover:bg-surface-50 dark:hover:bg-surface-800'
                    )}
                  >
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors', isSelected ? 'bg-nexora-100 dark:bg-nexora-500/20 text-nexora-600 dark:text-nexora-400' : 'bg-surface-100 dark:bg-surface-800 text-surface-500')}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn('text-sm font-medium', isSelected ? 'text-nexora-700 dark:text-nexora-300' : 'text-surface-800 dark:text-surface-200')}>
                        {item.label}
                      </div>
                      {item.description && <div className="text-xs text-surface-400 truncate">{item.description}</div>}
                    </div>
                    {isSelected && <ArrowRight size={14} className="text-nexora-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-surface-400">No results for "<span className="text-surface-600 dark:text-surface-300 font-medium">{query}</span>"</p>
              <p className="text-xs text-surface-400 mt-1">Try searching for pages, actions, or reports</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-surface-100 dark:border-surface-800 text-[10px] text-surface-400">
          <span className="flex items-center gap-1"><kbd className="bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">↑↓</kbd> Navigate</span>
          <span className="flex items-center gap-1"><kbd className="bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">↵</kbd> Select</span>
          <span className="flex items-center gap-1"><kbd className="bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">ESC</kbd> Close</span>
          <span className="ml-auto flex items-center gap-1"><Command size={10} /> NEXORA</span>
        </div>
      </div>
    </div>
  );
}
