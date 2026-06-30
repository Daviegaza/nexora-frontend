import { get, set, del, keys, createStore } from 'idb-keyval';

const store = createStore('nexora-offline', 'queue');

export interface QueuedOp {
  id: string;
  kind: 'transaction' | 'invoice' | 'customer' | 'product' | 'etims.file' | 'mpesa.stk';
  payload: unknown;
  createdAt: number;
  attempts: number;
  lastError?: string;
}

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export async function enqueue(op: Omit<QueuedOp, 'id' | 'createdAt' | 'attempts'>) {
  const item: QueuedOp = { ...op, id: uid(), createdAt: Date.now(), attempts: 0 };
  await set(item.id, item, store);
  return item;
}

export async function pending(): Promise<QueuedOp[]> {
  const ks = await keys(store);
  const items = await Promise.all(ks.map((k) => get(k as string, store)));
  return items.filter(Boolean) as QueuedOp[];
}

export async function remove(id: string) {
  await del(id, store);
}

export async function bumpAttempt(id: string, lastError?: string) {
  const item = await get<QueuedOp>(id, store);
  if (!item) return;
  await set(id, { ...item, attempts: item.attempts + 1, lastError }, store);
}

/**
 * Flush queue via injected sender. Caller decides routing per kind.
 * Halts on first failure to preserve order; bumps attempt counter.
 */
export async function flush(send: (op: QueuedOp) => Promise<void>) {
  const items = (await pending()).sort((a, b) => a.createdAt - b.createdAt);
  let flushed = 0;
  for (const op of items) {
    try {
      await send(op);
      await remove(op.id);
      flushed += 1;
    } catch (e) {
      await bumpAttempt(op.id, (e as Error).message);
      break;
    }
  }
  return flushed;
}

/** Boot-time listener: when browser comes back online, fire a flush callback. */
export function onlineFlusher(flushFn: () => Promise<void>) {
  if (typeof window === 'undefined') return () => undefined;
  const handler = () => {
    void flushFn();
  };
  window.addEventListener('online', handler);
  return () => window.removeEventListener('online', handler);
}
