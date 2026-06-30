import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate } from './index';

export interface ReceiptInput {
  receiptNo: string;
  date: string | Date;
  businessName: string;
  kraPin?: string;
  branch?: string;
  cashier?: string;
  customer?: { name: string; phone?: string };
  items: { name: string; quantity: number; price: number; total: number }[];
  subtotal: number;
  discount?: number;
  tax: number;
  total: number;
  paymentMethod: string;
  mpesaRef?: string;
  etims?: { rcptNo: string; sdcId: string; qrDataUrl?: string };
}

/** 80mm thermal-receipt PDF. Renders to a Blob for printing/sharing. */
export function buildReceiptPdf(r: ReceiptInput): Blob {
  const w = 80;
  const doc = new jsPDF({ unit: 'mm', format: [w, 200] });
  let y = 8;
  doc.setFont('helvetica', 'bold').setFontSize(11);
  doc.text(r.businessName, w / 2, y, { align: 'center' });
  y += 4;
  if (r.kraPin) {
    doc
      .setFont('helvetica', 'normal')
      .setFontSize(7)
      .text(`KRA PIN: ${r.kraPin}`, w / 2, y, { align: 'center' });
    y += 3;
  }
  if (r.branch) {
    doc.text(r.branch, w / 2, y, { align: 'center' });
    y += 3;
  }
  doc.setLineDashPattern([1, 1], 0).line(4, y, w - 4, y);
  y += 3;
  doc.setFont('helvetica', 'normal').setFontSize(7);
  doc.text(`Receipt: ${r.receiptNo}`, 4, y);
  y += 3;
  doc.text(`${formatDate(r.date)} · ${r.cashier ?? ''}`, 4, y);
  y += 3;
  if (r.customer) {
    doc.text(`Customer: ${r.customer.name}`, 4, y);
    y += 3;
  }
  doc.line(4, y, w - 4, y);
  y += 2;

  autoTable(doc, {
    startY: y,
    head: [['Item', 'Qty', 'Total']],
    body: r.items.map((i) => [i.name.slice(0, 24), String(i.quantity), formatCurrency(i.total)]),
    theme: 'plain',
    styles: { fontSize: 7, cellPadding: 0.5 },
    columnStyles: { 1: { halign: 'right', cellWidth: 8 }, 2: { halign: 'right' } },
    margin: { left: 4, right: 4 },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 2;

  const row = (label: string, value: string, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal').setFontSize(bold ? 8 : 7);
    doc.text(label, 4, y);
    doc.text(value, w - 4, y, { align: 'right' });
    y += 3;
  };
  doc.line(4, y, w - 4, y);
  y += 2;
  row('Subtotal', formatCurrency(r.subtotal));
  if (r.discount) row('Discount', `-${formatCurrency(r.discount)}`);
  row('VAT', formatCurrency(r.tax));
  row('TOTAL', formatCurrency(r.total), true);
  row('Payment', r.paymentMethod.toUpperCase());
  if (r.mpesaRef) row('M-Pesa Ref', r.mpesaRef);

  if (r.etims) {
    doc.line(4, y, w - 4, y);
    y += 2;
    doc.setFont('helvetica', 'normal').setFontSize(6);
    doc.text(`eTIMS: ${r.etims.rcptNo}`, 4, y);
    y += 3;
    doc.text(`SDC: ${r.etims.sdcId}`, 4, y);
    y += 3;
    if (r.etims.qrDataUrl) {
      doc.addImage(r.etims.qrDataUrl, 'PNG', w / 2 - 12, y, 24, 24);
      y += 26;
    }
  }

  doc.setFont('helvetica', 'italic').setFontSize(7);
  doc.text('Asante kwa biashara! Karibu tena.', w / 2, y + 2, { align: 'center' });
  return doc.output('blob');
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Generic tabular report PDF (A4 portrait). */
export function buildReportPdf(opts: {
  title: string;
  subtitle?: string;
  columns: string[];
  rows: (string | number)[][];
  footer?: string;
}): Blob {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.setFont('helvetica', 'bold').setFontSize(16).text(opts.title, 14, 18);
  if (opts.subtitle)
    doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(100).text(opts.subtitle, 14, 24);
  doc.setTextColor(0);
  autoTable(doc, {
    startY: 30,
    head: [opts.columns],
    body: opts.rows.map((r) => r.map(String)),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [84, 112, 241] },
  });
  if (opts.footer) {
    const pageH = doc.internal.pageSize.getHeight();
    doc
      .setFont('helvetica', 'italic')
      .setFontSize(8)
      .setTextColor(120)
      .text(opts.footer, 14, pageH - 8);
  }
  return doc.output('blob');
}
