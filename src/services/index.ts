/**
 * Data service layer. Calls real backend when VITE_API_BASE_URL is set OR
 * `/api` proxy is reachable; otherwise falls back to mock data so the app
 * keeps working offline / before backend is up.
 */
import { json, post, put, del } from './api';
import {
  branches as mockBranches,
  products as mockProducts,
  customers as mockCustomers,
  employees as mockEmployees,
  suppliers as mockSuppliers,
  transactions as mockTransactions,
  leads as mockLeads,
  invoices as mockInvoices,
  aiInsights as mockAIInsights,
  payrollRuns as mockPayrollRuns,
  stockMovements as mockStockMovements,
  leaveRequests as mockLeaveRequests,
  purchaseOrders as mockPurchaseOrders,
  notifications as mockNotifications,
} from '../mock/data';
import type {
  Branch,
  Product,
  Customer,
  Employee,
  Supplier,
  Transaction,
  Lead,
  Invoice,
  AIInsight,
  PayrollRun,
  StockMovement,
  LeaveRequest,
  PurchaseOrder,
  Notification,
} from '../types';

// Network-or-mock helper: try the backend, fall back to mock on any error.
async function tryNet<T>(path: string, fallback: T): Promise<T> {
  try {
    return await json<T>(path);
  } catch {
    return new Promise((r) => setTimeout(() => r(fallback), 50));
  }
}

function delay<T>(data: T, ms = 80): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export const fetchBranches = () => tryNet<Branch[]>('branches', [...mockBranches]);
export const fetchBranch = (id: string) =>
  tryNet<Branch | undefined>(
    `branches/${id}`,
    mockBranches.find((b) => b.id === id),
  );
export const fetchProducts = () => tryNet<Product[]>('products', [...mockProducts]);
export const fetchProduct = (id: string) =>
  tryNet<Product | undefined>(
    `products/${id}`,
    mockProducts.find((p) => p.id === id),
  );
export const fetchCustomers = () => tryNet<Customer[]>('customers', [...mockCustomers]);
export const fetchEmployees = () =>
  tryNet<Employee[]>('users', [...mockEmployees] as unknown as Employee[]);
export const fetchSuppliers = () => tryNet<Supplier[]>('suppliers', [...mockSuppliers]);
export const fetchTransactions = () => tryNet<Transaction[]>('transactions', [...mockTransactions]);
export const fetchLeads = () => tryNet<Lead[]>('crm/leads', [...mockLeads]);
export const fetchInvoices = () => tryNet<Invoice[]>('invoices', [...mockInvoices]);
export const fetchAIInsights = () => tryNet<AIInsight[]>('ai/insights', [...mockAIInsights]);
export const fetchPayrollRuns = () => tryNet<PayrollRun[]>('payroll/runs', [...mockPayrollRuns]);
export const fetchStockMovements = () =>
  tryNet<StockMovement[]>('stock/movements', [...mockStockMovements]);
export const fetchLeaveRequests = () =>
  tryNet<LeaveRequest[]>('hr/leave-requests', [...mockLeaveRequests]);
export const fetchPurchaseOrders = () =>
  tryNet<PurchaseOrder[]>('purchase-orders', [...mockPurchaseOrders]);
export const fetchNotifications = () =>
  tryNet<Notification[]>('notifications', [...mockNotifications]);

// ── Mutations + lookups (mock-backed; same shape backend will expose) ─────
const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export async function findProductByBarcode(code: string): Promise<Product | undefined> {
  const c = code.trim();
  try {
    return await json<Product>(`products/barcode/${encodeURIComponent(c)}`);
  } catch {
    const lc = c.toLowerCase();
    return delay(
      mockProducts.find((p) => p.barcode?.toLowerCase() === lc || p.sku.toLowerCase() === lc),
    );
  }
}

export async function createTransaction(t: Omit<Transaction, 'id'>): Promise<Transaction> {
  try {
    return await post<Transaction>('transactions', t);
  } catch {
    const next: Transaction = { ...t, id: uid() } as Transaction;
    (mockTransactions as Transaction[]).unshift(next);
    return delay(next);
  }
}

export async function upsertCustomer(c: Customer): Promise<Customer> {
  try {
    return c.id
      ? await put<Customer>(`customers/${c.id}`, c)
      : await post<Customer>('customers', c);
  } catch {
    const i = (mockCustomers as Customer[]).findIndex((x) => x.id === c.id);
    if (i >= 0) (mockCustomers as Customer[])[i] = c;
    else (mockCustomers as Customer[]).unshift({ ...c, id: c.id || uid() });
    return delay(c);
  }
}

export async function upsertProduct(p: Product): Promise<Product> {
  try {
    return p.id ? await put<Product>(`products/${p.id}`, p) : await post<Product>('products', p);
  } catch {
    const i = (mockProducts as Product[]).findIndex((x) => x.id === p.id);
    if (i >= 0) (mockProducts as Product[])[i] = p;
    else (mockProducts as Product[]).unshift({ ...p, id: p.id || uid() });
    return delay(p);
  }
}

export async function upsertEmployee(e: Employee): Promise<Employee> {
  try {
    return e.id ? await put<Employee>(`users/${e.id}`, e) : await post<Employee>('users/invite', e);
  } catch {
    const i = (mockEmployees as Employee[]).findIndex((x) => x.id === e.id);
    if (i >= 0) (mockEmployees as Employee[])[i] = e;
    else (mockEmployees as Employee[]).unshift({ ...e, id: e.id || uid() });
    return delay(e);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await del(`products/${id}`);
  } catch {
    /* ignore */
  }
}
