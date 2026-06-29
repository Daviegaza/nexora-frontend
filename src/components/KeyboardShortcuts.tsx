import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';

interface Shortcut {
  keys: string;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const setCommandPaletteOpen = useAppStore((s) => s.setCommandPaletteOpen);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const addToast = useAppStore((s) => s.addToast);

  useEffect(() => {
    const shortcuts: Shortcut[] = [
      { keys: 'g d', description: 'Go to Dashboard', action: () => navigate('/') },
      { keys: 'g p', description: 'Go to POS', action: () => navigate('/pos') },
      { keys: 'g i', description: 'Go to Inventory', action: () => navigate('/inventory') },
      { keys: 'g c', description: 'Go to CRM', action: () => navigate('/crm') },
      { keys: 'g a', description: 'Go to Accounting', action: () => navigate('/accounting') },
      { keys: 'g y', description: 'Go to Payroll', action: () => navigate('/payroll') },
      { keys: 'g h', description: 'Go to HR', action: () => navigate('/hr') },
      { keys: 'g r', description: 'Go to Reports', action: () => navigate('/reports') },
      { keys: 'g x', description: 'Go to Analytics', action: () => navigate('/analytics') },
      { keys: 'g s', description: 'Go to Settings', action: () => navigate('/settings') },
      { keys: 'g l', description: 'Go to AI Assistant', action: () => navigate('/ai') },
      { keys: '\\', description: 'Toggle Sidebar', action: toggleSidebar },
    ];

    let buffer = '';
    let timer: ReturnType<typeof setTimeout>;

    const handler = (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      // Cmd/Ctrl+K → command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      // ? → show shortcuts
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        addToast({
          type: 'info',
          title: 'Keyboard Shortcuts',
          message: 'g+d Dashboard · g+p POS · g+i Inventory · g+c CRM · g+a Accounting · g+y Payroll · g+h HR · g+r Reports · g+x Analytics · g+s Settings · g+l AI · \\ Toggle Sidebar · ⌘K Search',
        });
        return;
      }

      // Go-to shortcuts (g + letter)
      buffer += e.key;
      clearTimeout(timer);
      timer = setTimeout(() => { buffer = ''; }, 500);

      const match = shortcuts.find((s) => s.keys === buffer);
      if (match) {
        e.preventDefault();
        match.action();
        buffer = '';
      }

      // Buffer overflow prevention
      if (buffer.length > 3) buffer = '';
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [navigate, setCommandPaletteOpen, toggleSidebar, addToast]);
}
