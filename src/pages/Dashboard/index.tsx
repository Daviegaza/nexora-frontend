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
import { BranchManagerDashboard } from './BranchManagerDashboard';
import { SupervisorDashboard } from './SupervisorDashboard';

// Explicit role → dashboard mapping. No more level collisions:
// each role sees the surface designed for their actual day-to-day work.
const dashboardMap: Record<Role, React.ComponentType> = {
  super_admin: ExecutiveDashboard,
  admin: ExecutiveDashboard,
  owner: ExecutiveDashboard,
  director: ExecutiveDashboard,
  ceo: ExecutiveDashboard,
  branch_manager: BranchManagerDashboard,
  supervisor: SupervisorDashboard,
  accountant: AccountantDashboard,
  inventory_manager: InventoryDashboard,
  hr_manager: HRDashboard,
  sales_agent: SalesDashboard,
  cashier: CashierDashboard,
  employee: EmployeeDashboard,
};

export default function Dashboard() {
  const currentRole = useAppStore((s) => s.currentRole) as Role;
  const View = dashboardMap[currentRole] ?? EmployeeDashboard;
  return <View />;
}
