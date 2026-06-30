import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QK } from './queryKeys';
import * as svc from './index';
import type { Product, Customer, Transaction } from '../types';

export const useProducts = () => useQuery({ queryKey: QK.products, queryFn: svc.fetchProducts });
export const useProduct = (id: string) =>
  useQuery({ queryKey: QK.product(id), queryFn: () => svc.fetchProduct(id), enabled: !!id });
export const useProductByBarcode = (code: string) =>
  useQuery({
    queryKey: QK.productByCode(code),
    queryFn: () => svc.findProductByBarcode(code),
    enabled: !!code,
  });
export const useCustomers = () => useQuery({ queryKey: QK.customers, queryFn: svc.fetchCustomers });
export const useEmployees = () => useQuery({ queryKey: QK.employees, queryFn: svc.fetchEmployees });
export const useSuppliers = () => useQuery({ queryKey: QK.suppliers, queryFn: svc.fetchSuppliers });
export const useTransactions = () =>
  useQuery({ queryKey: QK.transactions, queryFn: svc.fetchTransactions });
export const useLeads = () => useQuery({ queryKey: QK.leads, queryFn: svc.fetchLeads });
export const useInvoices = () => useQuery({ queryKey: QK.invoices, queryFn: svc.fetchInvoices });
export const useAIInsights = () =>
  useQuery({ queryKey: QK.aiInsights, queryFn: svc.fetchAIInsights });
export const usePayrollRuns = () =>
  useQuery({ queryKey: QK.payrollRuns, queryFn: svc.fetchPayrollRuns });
export const useStockMovements = () =>
  useQuery({ queryKey: QK.stockMovements, queryFn: svc.fetchStockMovements });
export const useLeaveRequests = () =>
  useQuery({ queryKey: QK.leaveRequests, queryFn: svc.fetchLeaveRequests });
export const usePurchaseOrders = () =>
  useQuery({ queryKey: QK.purchaseOrders, queryFn: svc.fetchPurchaseOrders });
export const useBranches = () => useQuery({ queryKey: QK.branches, queryFn: svc.fetchBranches });
export const useNotifications = () =>
  useQuery({ queryKey: QK.notifications, queryFn: svc.fetchNotifications });

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (txn: Omit<Transaction, 'id'>) => svc.createTransaction(txn),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.transactions }),
  });
}

export function useUpsertCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (c: Customer) => svc.upsertCustomer(c),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.customers }),
  });
}

export function useUpsertProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: Product) => svc.upsertProduct(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.products }),
  });
}
