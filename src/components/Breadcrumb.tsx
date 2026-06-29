import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../utils';

const routeLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/pos': 'Point of Sale',
  '/inventory': 'Inventory',
  '/crm': 'CRM',
  '/customers': 'Customers',
  '/accounting': 'Accounting',
  '/payroll': 'Payroll',
  '/hr': 'HR & People',
  '/employees': 'Employees',
  '/suppliers': 'Suppliers',
  '/branches': 'Branches',
  '/reports': 'Reports',
  '/analytics': 'Analytics',
  '/ai': 'AI Assistant',
  '/settings': 'Settings',
};

export function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  // Don't show breadcrumb on root
  if (segments.length === 0) return null;

  const crumbs = [
    { label: 'Home', path: '/' },
    ...segments.map((seg, i) => {
      const path = '/' + segments.slice(0, i + 1).join('/');
      return { label: routeLabels[path] || seg.charAt(0).toUpperCase() + seg.slice(1), path };
    }),
  ];

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs px-6 pt-4 pb-0 animate-fade-in">
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.path}>
          {i > 0 && <ChevronRight size={12} className="text-surface-300 dark:text-surface-600 flex-shrink-0" />}
          {i === crumbs.length - 1 ? (
            <span className="font-medium text-surface-700 dark:text-surface-300">{crumb.label}</span>
          ) : (
            <Link
              to={crumb.path}
              className={cn(
                'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors',
                i === 0 && 'flex items-center gap-1'
              )}
            >
              {i === 0 && <Home size={12} />}
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
