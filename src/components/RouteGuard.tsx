import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { hasPermission, PAGE_ACCESS } from '../constants';
import type { Role } from '../types';

interface RouteGuardProps {
  children: React.ReactNode;
  /** Minimum permission level required (from PAGE_ACCESS) */
  requiredLevel?: number;
  /** Specific roles allowed */
  allowedRoles?: Role[];
  /** Path to redirect unauthorized users */
  redirectTo?: string;
}

/**
 * Route guard that checks the current user's role against required permissions.
 * Redirects to the specified path (default "/") if access is denied.
 *
 * Usage:
 *   <RouteGuard requiredLevel={4}>
 *     <Accounting />
 *   </RouteGuard>
 *
 * or with specific roles:
 *   <RouteGuard allowedRoles={['owner', 'ceo', 'branch_manager']}>
 *     <Branches />
 *   </RouteGuard>
 */
export function RouteGuard({
  children,
  requiredLevel,
  allowedRoles,
  redirectTo = '/',
}: RouteGuardProps) {
  const { currentRole } = useAppStore();

  // No restrictions → allow
  if (!requiredLevel && !allowedRoles) return <>{children}</>;

  // Check by specific role list
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check by permission level
  if (requiredLevel && !hasPermission(currentRole, requiredLevel)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

/**
 * Convenience guard that checks against PAGE_ACCESS levels.
 * Usage: <PageGuard path="/accounting"><Accounting /></PageGuard>
 */
export function PageGuard({
  children,
  path,
  redirectTo = '/',
}: {
  children: React.ReactNode;
  path: string;
  redirectTo?: string;
}) {
  const requiredLevel = PAGE_ACCESS[path];
  return (
    <RouteGuard requiredLevel={requiredLevel} redirectTo={redirectTo}>
      {children}
    </RouteGuard>
  );
}
