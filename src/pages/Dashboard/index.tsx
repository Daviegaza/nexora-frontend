import React from 'react';
import { useAppStore } from '../../store';
import type { Role } from '../../types';
import { ExecutiveDashboard } from './ExecutiveDashboard';
import { CashierDashboard } from './CashierDashboard';
import { HRDashboard } from './HRDashboard';
import { InventoryDashboard } from './InventoryDashboard';
import { SalesDashboard } from './SalesDashboard';
import { AccountantDashboard } from './AccountantDashboard';
import { EmployeeDashboard } from './EmployeeDashboard';

// Branch Manager sees the executive dashboard filtered to their branch context
// CEO/Owner/Super Admin see the full executive dashboard
const executiveRoles: Role[] = ['super_admin', 'admin', 'owner', 'ceo', 'branch_manager'];

const dashboardMap: Partial<Record<Role, React.ComponentType>> = {
  cashier: CashierDashboard,
  accountant: AccountantDashboard,
  inventory_manager: InventoryDashboard,
  hr_manager: HRDashboard,
  sales_agent: SalesDashboard,
  employee: EmployeeDashboard,
};

export default function Dashboard() {
  const currentRole = useAppStore((s) => s.currentRole);

  // Executives see the full business dashboard
  if (executiveRoles.includes(currentRole)) {
    return <ExecutiveDashboard />;
  }

  // Specialized roles see their tailored dashboard
  const DashboardComponent = dashboardMap[currentRole];
  if (DashboardComponent) {
    return <DashboardComponent />;
  }

  // Fallback: employees and any unmapped role get the employee dashboard
  return <EmployeeDashboard />;
}
