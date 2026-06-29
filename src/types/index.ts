export type Theme = 'light' | 'dark';
export type Role = 'super_admin' | 'admin' | 'owner' | 'ceo' | 'branch_manager' | 'cashier' | 'accountant' | 'inventory_manager' | 'hr_manager' | 'sales_agent' | 'employee';

export interface User {
  id: string; name: string; email: string; avatar?: string;
  role: Role; branch?: string; department?: string;
  joinDate: string; status: 'active' | 'inactive' | 'on_leave';
  phone?: string; salary?: number;
}

export interface Branch {
  id: string; name: string; location: string; county: string;
  manager: string; phone: string; revenue: number; employees: number;
  status: 'active' | 'inactive'; openedDate: string;
  lat?: number; lng?: number;
}

export interface Product {
  id: string; name: string; sku: string; category: string;
  price: number; cost: number; stock: number; minStock: number;
  unit: string; supplier: string; barcode?: string; image?: string;
  expiryDate?: string; lastRestocked: string;
  status: 'active' | 'inactive' | 'low_stock' | 'out_of_stock';
}

export interface Customer {
  id: string; name: string; email: string; phone: string;
  county: string; town: string; type: 'retail' | 'wholesale' | 'vip';
  totalSpent: number; orderCount: number; lastPurchase: string;
  joinDate: string; status: 'active' | 'inactive'; notes?: string; loyalty: number;
}

export interface CartItem {
  productId: string; name: string; price: number;
  quantity: number; discount: number; total: number;
}

export interface Transaction {
  id: string; customerId?: string; customerName: string;
  items: CartItem[]; subtotal: number; discount: number; tax: number; total: number;
  paymentMethod: 'cash' | 'mpesa' | 'card' | 'split'; mpesaRef?: string;
  cashier: string; branch: string; timestamp: string;
  status: 'completed' | 'refunded' | 'pending'; receiptNo: string;
}

export interface Employee {
  id: string; name: string; email: string; phone: string;
  avatar?: string; employeeId: string; position: string;
  department: string; branch: string; salary: number;
  allowances: number; deductions: number; bankAccount?: string;
  nationalId: string; kra: string; nhif: string; nssf: string;
  performance: number; attendance: number; leaveBalance: number;
  status: 'active' | 'inactive' | 'on_leave'; joinDate: string; role: Role;
}

export interface Supplier {
  id: string; name: string; contact: string; email: string;
  phone: string; county: string; category: string; rating: number;
  totalOrders: number; totalValue: number; lastOrder: string;
  status: 'active' | 'inactive'; paymentTerms: string; leadTime: string;
}

export interface Lead {
  id: string; name: string; company?: string; email: string;
  phone: string; source: string;
  stage: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  value: number; probability: number; assignedTo: string;
  createdAt: string; updatedAt: string; notes?: string; nextFollowUp?: string;
}

export interface Invoice {
  id: string; number: string; customerId: string; customerName: string;
  items: CartItem[]; subtotal: number; tax: number; total: number;
  dueDate: string; issuedDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'; paidDate?: string;
}

export interface Notification {
  id: string; title: string; message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean; createdAt: string;
  action?: { label: string; href: string };
}

export interface KPI {
  label: string; value: string | number; change: number;
  changeLabel: string; trend: 'up' | 'down' | 'neutral';
  prefix?: string; suffix?: string; color: string; icon: string;
  sparkline?: number[];
}

export interface AIInsight {
  id: string; type: 'alert' | 'opportunity' | 'forecast' | 'recommendation';
  title: string; description: string; impact: 'high' | 'medium' | 'low';
  category: string; createdAt: string; action?: string;
}

export interface PayrollRun {
  id: string; period: string; employees: number;
  grossPay: number; deductions: number; netPay: number;
  status: 'draft' | 'processing' | 'approved' | 'paid';
  processedBy: string; processedAt: string;
}

export interface StockMovement {
  id: string; productId: string; productName: string;
  type: 'in' | 'out' | 'transfer' | 'adjustment';
  quantity: number; fromBranch?: string; toBranch?: string;
  reference: string; date: string; performedBy: string; notes?: string;
}

export interface Attendance {
  id: string; employeeId: string; employeeName: string;
  date: string; checkIn?: string; checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave'; overtime?: number;
}

export interface LeaveRequest {
  id: string; employeeId: string; employeeName: string;
  type: 'annual' | 'sick' | 'maternity' | 'paternity' | 'compassionate' | 'unpaid';
  startDate: string; endDate: string; days: number; reason: string;
  status: 'pending' | 'approved' | 'rejected'; approvedBy?: string; requestedAt: string;
}

export interface ChartDataPoint {
  label: string; value: number; prev?: number;
  [key: string]: string | number | undefined;
}

export interface PurchaseOrder {
  id: string; poNumber: string; supplierId: string; supplierName: string;
  items: { productId: string; name: string; quantity: number; cost: number; total: number }[];
  total: number; status: 'draft' | 'sent' | 'acknowledged' | 'delivered' | 'cancelled';
  expectedDelivery: string; createdAt: string; createdBy: string; branch: string;
}

export interface Message {
  id: string; role: 'user' | 'assistant'; content: string;
  timestamp: string; isTyping?: boolean;
}
