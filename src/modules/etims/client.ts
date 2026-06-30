import { post } from '../../services/api';
import { enqueue } from '../offline/queue';

export interface EtimsFileResult {
  rcptNo: string;
  qrCode: string;
  sdcId: string;
  internalData: string;
  signature: string;
  status: 'filed';
}

/**
 * Try to file a transaction with KRA eTIMS. On failure or offline, queue.
 * Returns { status: 'filed' | 'queued', ... } so caller can update UI.
 */
export async function fileEtims(
  transactionId: string,
): Promise<EtimsFileResult | { status: 'queued' }> {
  const online = typeof navigator === 'undefined' ? true : navigator.onLine;
  if (!online) {
    await enqueue({ kind: 'etims.file', payload: { transactionId } });
    return { status: 'queued' };
  }
  try {
    return await post<EtimsFileResult>(`etims/file/${transactionId}`);
  } catch {
    await enqueue({ kind: 'etims.file', payload: { transactionId } });
    return { status: 'queued' };
  }
}
