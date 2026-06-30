/**
 * Build wa.me deep links for receipts, invoices, and product catalogues.
 * Falls back to opening WhatsApp Web URL when no phone targeted.
 */
const env = import.meta.env;

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  // Kenyan format: 07XX → 2547XX
  if (digits.startsWith('0') && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.startsWith('7') && digits.length === 9) return `254${digits}`;
  return digits;
}

export function whatsappReceiptUrl(opts: {
  toPhone?: string;
  receiptNo: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  business?: string;
  etimsRef?: string;
}) {
  const biz = opts.business ?? env.VITE_APP_NAME ?? 'NEXORA';
  const lines = [
    `*${biz}* — Receipt ${opts.receiptNo}`,
    '',
    ...opts.items.map((i) => `${i.quantity} × ${i.name} — KSh ${i.price.toLocaleString()}`),
    '',
    `*Total: KSh ${opts.total.toLocaleString()}*`,
  ];
  if (opts.etimsRef) lines.push('', `KRA eTIMS: ${opts.etimsRef}`);
  lines.push('', 'Asante kwa biashara! Karibu tena.');
  const text = encodeURIComponent(lines.join('\n'));
  const phone = opts.toPhone ? normalizePhone(opts.toPhone) : '';
  return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
}

export function whatsappProductUrl(opts: {
  toPhone?: string;
  product: { name: string; price: number; sku: string };
}) {
  const text = encodeURIComponent(
    `Hi, I'd like to order:\n\n${opts.product.name} (${opts.product.sku})\nKSh ${opts.product.price.toLocaleString()}`,
  );
  const phone = opts.toPhone ? normalizePhone(opts.toPhone) : (env.VITE_WHATSAPP_NUMBER ?? '');
  return `https://wa.me/${phone}?text=${text}`;
}

export function whatsappShare(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}
