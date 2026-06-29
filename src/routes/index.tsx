import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { useAppStore } from '../store';
import { hasPermission, PAGE_ACCESS } from '../constants';

// Lazy load all pages
const Dashboard = lazy(() => import('../pages/Dashboard'));
const POS = lazy(() => import('../pages/POS'));
const Inventory = lazy(() => import('../pages/Inventory'));
const CRM = lazy(() => import('../pages/CRM'));
const Accounting = lazy(() => import('../pages/Accounting'));
const Payroll = lazy(() => import('../pages/Payroll'));
const HR = lazy(() => import('../pages/HR'));
const Reports = lazy(() => import('../pages/Reports'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Settings = lazy(() => import('../pages/Settings'));
const AIAssistant = lazy(() => import('../pages/AIAssistant'));
const Customers = lazy(() => import('../pages/Customers'));
const Employees = lazy(() => import('../pages/Employees'));
const Branches = lazy(() => import('../pages/Branches'));
const Suppliers = lazy(() => import('../pages/Suppliers'));
const Login = lazy(() => import('../pages/Login'));

function PageLoader() {
  return (
    <div className="p-6 space-y-5 animate-pulse">
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-surface-100 dark:bg-surface-800 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 h-72 bg-surface-100 dark:bg-surface-800 rounded-xl" />
        <div className="h-72 bg-surface-100 dark:bg-surface-800 rounded-xl" />
      </div>
      <div className="h-64 bg-surface-100 dark:bg-surface-800 rounded-xl" />
    </div>
  );
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

/** Redirect to login if not authenticated */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** Redirect away from login if already authenticated */
function LoginGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

/** Protect a route by permission level */
function RoleGuard({ children, path }: { children: React.ReactNode; path: string }) {
  const currentRole = useAppStore((s) => s.currentRole);
  const requiredLevel = PAGE_ACCESS[path];
  if (requiredLevel && !hasPermission(currentRole, requiredLevel)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <SuspenseWrapper><LoginGuard><Login /></LoginGuard></SuspenseWrapper>,
  },
  {
    path: '/',
    element: <AuthGuard><AppLayout /></AuthGuard>,
    children: [
      { index: true, element: <SuspenseWrapper><Dashboard /></SuspenseWrapper> },
      { path: 'pos', element: <SuspenseWrapper><RoleGuard path="/pos"><POS /></RoleGuard></SuspenseWrapper> },
      { path: 'inventory', element: <SuspenseWrapper><RoleGuard path="/inventory"><Inventory /></RoleGuard></SuspenseWrapper> },
      { path: 'crm', element: <SuspenseWrapper><RoleGuard path="/crm"><CRM /></RoleGuard></SuspenseWrapper> },
      { path: 'accounting', element: <SuspenseWrapper><RoleGuard path="/accounting"><Accounting /></RoleGuard></SuspenseWrapper> },
      { path: 'payroll', element: <SuspenseWrapper><RoleGuard path="/payroll"><Payroll /></RoleGuard></SuspenseWrapper> },
      { path: 'hr', element: <SuspenseWrapper><RoleGuard path="/hr"><HR /></RoleGuard></SuspenseWrapper> },
      { path: 'reports', element: <SuspenseWrapper><RoleGuard path="/reports"><Reports /></RoleGuard></SuspenseWrapper> },
      { path: 'analytics', element: <SuspenseWrapper><RoleGuard path="/analytics"><Analytics /></RoleGuard></SuspenseWrapper> },
      { path: 'settings', element: <SuspenseWrapper><RoleGuard path="/settings"><Settings /></RoleGuard></SuspenseWrapper> },
      { path: 'ai', element: <SuspenseWrapper><RoleGuard path="/ai"><AIAssistant /></RoleGuard></SuspenseWrapper> },
      { path: 'customers', element: <SuspenseWrapper><RoleGuard path="/customers"><Customers /></RoleGuard></SuspenseWrapper> },
      { path: 'employees', element: <SuspenseWrapper><RoleGuard path="/employees"><Employees /></RoleGuard></SuspenseWrapper> },
      { path: 'branches', element: <SuspenseWrapper><RoleGuard path="/branches"><Branches /></RoleGuard></SuspenseWrapper> },
      { path: 'suppliers', element: <SuspenseWrapper><RoleGuard path="/suppliers"><Suppliers /></RoleGuard></SuspenseWrapper> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
