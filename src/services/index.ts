/**
 * Data service layer — currently backed by mock data.
 * Replace each function body with a real API call when the backend is ready.
 */
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
  Branch, Product, Customer, Employee, Supplier,
  Transaction, Lead, Invoice, AIInsight, PayrollRun,
  StockMovement, LeaveRequest, PurchaseOrder, Notification,
} from '../types';

// Simulate network delay
function delay<T>(data: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// ── Branches ──────────────────────────────────────────────────────────────
export async function fetchBranches(): Promise<Branch[]> {
  return delay([...mockBranches]);
}

export async function fetchBranch(id: string): Promise<Branch | undefined> {
  return delay(mockBranches.find((b) => b.id === id));
}

// ── Products ──────────────────────────────────────────────────────────────
export async function fetchProducts(): Promise<Product[]> {
  return delay([...mockProducts]);
}

export async function fetchProduct(id: string): Promise<Product | undefined> {
  return delay(mockProducts.find((p) => p.id === id));
}

// ── Customers ─────────────────────────────────────────────────────────────
export async function fetchCustomers(): Promise<Customer[]> {
  return delay([...mockCustomers]);
}

// ── Employees ──────────────────────────────────────────────────────────────
export async function fetchEmployees(): Promise<Employee[]> {
  return delay([...mockEmployees]);
}

// ── Suppliers ──────────────────────────────────────────────────────────────
export async function fetchSuppliers(): Promise<Supplier[]> {
  return delay([...mockSuppliers]);
}

// ── Transactions ───────────────────────────────────────────────────────────
export async function fetchTransactions(): Promise<Transaction[]> {
  return delay([...mockTransactions]);
}

// ── Leads / CRM ────────────────────────────────────────────────────────────
export async function fetchLeads(): Promise<Lead[]> {
  return delay([...mockLeads]);
}

// ── Invoices ───────────────────────────────────────────────────────────────
export async function fetchInvoices(): Promise<Invoice[]> {
  return delay([...mockInvoices]);
}

// ── AI Insights ────────────────────────────────────────────────────────────
export async function fetchAIInsights(): Promise<AIInsight[]> {
  return delay([...mockAIInsights]);
}

// ── Payroll ────────────────────────────────────────────────────────────────
export async function fetchPayrollRuns(): Promise<PayrollRun[]> {
  return delay([...mockPayrollRuns]);
}

// ── Stock Movements ────────────────────────────────────────────────────────
export async function fetchStockMovements(): Promise<StockMovement[]> {
  return delay([...mockStockMovements]);
}

// ── Leave Requests ─────────────────────────────────────────────────────────
export async function fetchLeaveRequests(): Promise<LeaveRequest[]> {
  return delay([...mockLeaveRequests]);
}

// ── Purchase Orders ────────────────────────────────────────────────────────
export async function fetchPurchaseOrders(): Promise<PurchaseOrder[]> {
  return delay([...mockPurchaseOrders]);
}

// ── Notifications ──────────────────────────────────────────────────────────
export async function fetchNotifications(): Promise<Notification[]> {
  return delay([...mockNotifications]);
}
