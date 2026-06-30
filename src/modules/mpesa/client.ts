import { post } from '../../services/api';

export interface StkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export interface StkStatusResponse {
  status: 'pending' | 'success' | 'failed';
  receipt?: string;
  reason?: string;
}

export function stkPush(payload: {
  phone: string;
  amount: number;
  accountRef: string;
  description: string;
}) {
  return post<StkPushResponse>('mpesa/stk', payload);
}

export function stkStatus(checkoutRequestId: string) {
  return post<StkStatusResponse>('mpesa/stk/status', { checkoutRequestId });
}
