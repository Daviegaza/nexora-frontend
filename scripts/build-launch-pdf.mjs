// Generate NEXORA AI launch-readiness PDF.
// Usage: node scripts/build-launch-pdf.mjs
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '..', 'NEXORA-LAUNCH-READINESS.pdf');

const doc = new jsPDF({ unit: 'mm', format: 'a4' });
const W = doc.internal.pageSize.getWidth();
const H = doc.internal.pageSize.getHeight();
const M = 14;
let y = M;
let page = 1;

const C = {
  brand: [84, 112, 241],
  emerald: [16, 185, 129],
  amber: [251, 191, 36],
  rose: [244, 63, 94],
  ink: [15, 23, 42],
  sub: [100, 116, 139],
  faint: [200, 210, 226],
};

function newPage() {
  doc.addPage();
  page += 1;
  y = M;
  drawPageChrome();
}

function drawPageChrome() {
  doc.setFontSize(7).setTextColor(...C.sub);
  doc.text('NEXORA AI — Launch Readiness', M, H - 6);
  doc.text(`Page ${page}`, W - M, H - 6, { align: 'right' });
  doc.setDrawColor(...C.faint).setLineWidth(0.2).line(M, H - 9, W - M, H - 9);
}

function ensure(h) { if (y + h > H - 18) newPage(); }

function h1(text) {
  ensure(14);
  doc.setFont('helvetica', 'bold').setFontSize(20).setTextColor(...C.brand);
  doc.text(text, M, y + 8);
  y += 12;
}

function h2(text) {
  ensure(10);
  doc.setFont('helvetica', 'bold').setFontSize(13).setTextColor(...C.ink);
  doc.text(text, M, y + 6);
  doc.setDrawColor(...C.brand).setLineWidth(0.7).line(M, y + 7.5, M + 24, y + 7.5);
  y += 11;
}

function h3(text) {
  ensure(8);
  doc.setFont('helvetica', 'bold').setFontSize(10.5).setTextColor(...C.ink);
  doc.text(text, M, y + 5);
  y += 7;
}

function p(text, opts = {}) {
  const size = opts.size ?? 9.5;
  const color = opts.color ?? C.ink;
  doc.setFont('helvetica', opts.bold ? 'bold' : 'normal').setFontSize(size).setTextColor(...color);
  const lines = doc.splitTextToSize(text, W - 2 * M);
  for (const line of lines) {
    ensure(size * 0.45 + 1);
    doc.text(line, M, y + size * 0.4);
    y += size * 0.45 + 0.6;
  }
  y += 1;
}

function bullets(items) {
  for (const it of items) {
    const txt = typeof it === 'string' ? it : it.text;
    const color = typeof it === 'string' ? C.ink : (it.color ?? C.ink);
    ensure(5);
    doc.setFont('helvetica', 'normal').setFontSize(9.5).setTextColor(...color);
    doc.text('•', M, y + 3.5);
    const lines = doc.splitTextToSize(txt, W - 2 * M - 5);
    for (const [i, line] of lines.entries()) {
      ensure(4.5);
      doc.text(line, M + 4, y + 3.5);
      if (i < lines.length - 1) y += 4;
    }
    y += 4.5;
  }
  y += 1;
}

function callout(text, kind = 'info') {
  ensure(12);
  const palette = { info: C.brand, success: C.emerald, warn: C.amber, danger: C.rose };
  const col = palette[kind] ?? C.brand;
  doc.setFillColor(col[0], col[1], col[2], 0.08).setDrawColor(...col).setLineWidth(0.4);
  const lines = doc.splitTextToSize(text, W - 2 * M - 8);
  const h = Math.max(8, lines.length * 4.3 + 4);
  ensure(h);
  doc.roundedRect(M, y, W - 2 * M, h, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(...col);
  let ty = y + 5;
  for (const line of lines) { doc.text(line, M + 4, ty); ty += 4.3; }
  y += h + 2;
}

function table(head, rows, opts = {}) {
  ensure(20);
  autoTable(doc, {
    startY: y,
    head: [head],
    body: rows,
    styles: { fontSize: 8.5, cellPadding: 1.6 },
    headStyles: { fillColor: C.brand, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: M, right: M },
    columnStyles: opts.columnStyles,
  });
  y = doc.lastAutoTable.finalY + 4;
}

// ── COVER ─────────────────────────────────────────────────────────────────
doc.setFillColor(...C.brand).rect(0, 0, W, 80, 'F');
doc.setFont('helvetica', 'bold').setFontSize(36).setTextColor(255, 255, 255);
doc.text('NEXORA AI', M, 38);
doc.setFontSize(14).setFont('helvetica', 'normal');
doc.text('Launch Readiness Report', M, 50);
doc.setFontSize(10);
doc.text('Kenya-first Business Operating System', M, 60);
doc.setFontSize(8).setTextColor(220, 230, 255);
doc.text(`Generated ${new Date().toISOString().slice(0, 10)} · v1.0.0`, M, 68);

y = 92;
doc.setTextColor(...C.ink);
h2('Executive Summary');
p('NEXORA AI is an all-in-one business operating system designed for Kenyan SMBs and mid-market: POS, inventory, CRM, accounting, payroll, HR, analytics, AI assistant, and chama/group-money primitives. This document covers what shipped in the super-update, what remains before go-live, and the exact production checklist.', { size: 10 });
callout('Shipped in this session: frontend security hardening, USB+camera barcode scanner, role-based access control with delegated permissions, mobile-first responsive nav, Swahili i18n, eTIMS + M-Pesa Daraja + WhatsApp + Chama integrations, full Node.js + Postgres backend, Capacitor mobile wrap, Tauri desktop wrap.', 'success');

drawPageChrome();
newPage();

// ── WHAT HAPPENED ─────────────────────────────────────────────────────────
h1('1. What Happened — Super-Update Scope');

h2('1.1 Foundation & Security (P0)');
bullets([
  'TypeScript strict mode enforced in build path (was bypassed).',
  '.env.example sanitized — VITE_* secrets stripped (were leaking into client bundle).',
  'Store split: useUiStore (theme/sidebar only persisted) + useAuthStore (token in sessionStorage, no role escalation via localStorage) + useNotificationsStore.',
  'React Query: smart retry (no retry on 4xx), 5-min staleTime, 30-min gcTime.',
  'Per-page ErrorBoundary inside SuspenseWrapper isolates page crashes.',
  'PWA registered: offline-ready toast + update toast.',
  'Security headers on dev server: X-Frame-Options=DENY, Referrer-Policy=strict-origin-when-cross-origin, Permissions-Policy.',
  'Vite build: manual chunks (react/query/charts/radix/icons/i18n/pdf/scanner) — better cache locality.',
]);

h2('1.2 Barcode Scanner (priority)');
bullets([
  'src/hooks/useBarcodeScanner.ts — USB / Bluetooth keyboard-wedge detector. Distinguishes scanner bursts (50ms gap) from human typing.',
  'src/components/scanner/BarcodeScannerModal.tsx — camera scanner using ZXing (EAN-13, UPC-A/E, Code-128, QR). Torch toggle. Manual entry fallback.',
  'playScanBeep() — WebAudio square-wave beep, success/fail variants.',
  'POS integration: USB-wedge auto-adds anywhere on page; Scan button opens camera modal; search-bar Enter does lookup; lookup matches barcode OR SKU.',
  'Receipt numbers now crypto.randomUUID()-based (was Math.random — collision risk).',
]);

h2('1.3 RBAC Overhaul + Supervisor Role');
p('Root cause of "cashier sees employee dashboard": both roles were level=1, so the dashboard router collided. Fixed by replacing level-based logic with an explicit role→dashboard map.');
bullets([
  'Role union extended: added supervisor (floor oversight) + director (kept ceo as alias).',
  'PERMISSION_MATRIX: explicit role → path[] list. roleCan(role, path) is now the source of truth.',
  'SupervisorDashboard (new): shift open/close, pending voids/refunds/discount approvals, cashier-on-shift list, hourly sales pace vs target, floor alerts (printer offline, low till, restock).',
  'CashierDashboard: refocused on selling (open POS button, my sales, payment breakdown, recent transactions) — no longer employee surface.',
  'window.location.assign removed (SPA-breaking) — replaced with useNavigate.',
]);

h2('1.4 Delegated Permissions (capability ACL)');
p('Owner can grant ANY of 60+ capabilities to ANY user without changing their role. Manager who gets users.invite cap can hire staff; cashier who gets pos.refund cap can process returns without becoming supervisor.');
bullets([
  'src/constants/permissions.ts: CAPABILITIES list (pos.refund, users.invite, etims.file, mpesa.b2c, chama.disburse, ...) + ROLE_CAPS defaults per role.',
  'src/utils/permissions.ts: resolveCaps(user) = defaults + permissionsAdd - permissionsRemove.',
  'User type extended with permissionsAdd, permissionsRemove, customRoleId.',
  'CustomRole type for fully bespoke role definitions.',
  'src/pages/Settings/PermissionsPanel.tsx — UI to grant/revoke per user (toggles, role-default badge, override indicator).',
  'Backend mirror: src/lib/rbac.ts + PATCH /api/users/:id/grant (gated by users.grant cap).',
]);

h2('1.5 Mobile Navigation Rebuilt');
bullets([
  'Sidebar: slide-in drawer on <lg (280px) with backdrop, permanent on lg+. Auto-close on route change. Body scroll-locked while open.',
  'Topbar: hamburger button visible <lg, left snaps to 0 on mobile.',
  'AppLayout: ml-0 on mobile, lg:ml-[68|260px] desktop.',
  'New MobileBottomNav (lg:hidden): 5-slot bottom tab bar (Home/POS/AI/Alerts/More) with safe-area inset padding and unread alert badge.',
  'POS responsive: products full-width on mobile, cart drops below as full-width panel + floating "Cart (n)" pill scrolls user to it.',
]);

h2('1.6 i18n — English + Swahili');
bullets([
  'i18next + react-i18next + LanguageDetector. I18nGate blocks render until ready.',
  'Locales: en-KE, sw-KE. Coverage: nav, POS, checkout, common, errors, chama.',
  '<html lang> updates with current language for assistive tech.',
]);

h2('1.7 Service Layer + Kenya Wedge');
bullets([
  'ky HTTP client (src/services/api.ts): bearer token from authStore, 401→clear+redirect, typed ApiError.',
  'React Query hooks for all 14 services + mutations (useCreateTransaction, useUpsertCustomer/Product/Employee).',
  'Offline queue (src/modules/offline/queue.ts): IndexedDB-backed via idb-keyval. Enqueue/pending/flush/online-flusher.',
  'eTIMS client: fileEtims(txnId) auto-falls-back to queue when offline or API fails.',
  'M-Pesa client: stkPush + stkStatus typed wrappers.',
  'WhatsApp share: receipt + product deep links with KE phone normalization (07XX → 2547XX).',
  'Chama page: groups, members, contributions, rota, loans.',
]);

h2('1.8 Backend — Node.js + Postgres');
bullets([
  'Fastify 5 + Prisma 6 + Postgres 18 + Redis 8 + JWT (Argon2id) + Zod validation + Pino logger + Swagger UI at /docs.',
  'Multi-tenant schema (every row scoped to workspaceId): Workspace, User, CustomRole, RefreshToken, AuditLog, Branch, Employee, Product, StockLevel, StockMovement, Customer, Transaction, CartItemRecord, Invoice, Lead, Supplier, PurchaseOrder, PayrollRun, Attendance, LeaveRequest, ChamaGroup/Member/Contribution/Loan/RotaSlot, Notification.',
  'Auth: /register, /login (sets HttpOnly refresh cookie), /refresh, /logout, /me. Argon2id passwords. SHA-256-hashed refresh tokens.',
  'Capability mirror in src/lib/rbac.ts. requireCap(cap) Fastify preHandler.',
  'Module endpoints: users (CRUD + grant), products (CRUD + barcode lookup), transactions (POST decrements stock, records movements, fires eTIMS), etims (file + cancel), mpesa (STK + callback), ai (chat + SSE stream to Claude Haiku 4.5).',
  'Docker compose: Postgres + Redis. Multi-stage Dockerfile (Node 24 alpine).',
  'CI workflow: lint + test + prisma migrate + build, all gated on Postgres service.',
  'scripts/boot.sh: one-shot — docker up → wait pg → migrate → seed → dev.',
  'prisma/seed.ts: demo workspace + owner@nexora.co.ke / demo1234 + Nairobi HQ branch.',
]);

h2('1.9 Mobile (Capacitor)');
bullets([
  'capacitor.config.ts — iOS + Android wrappers with SplashScreen, StatusBar, Keyboard, BarcodeScanner (@capacitor-mlkit/barcode-scanning), PushNotifications, LocalNotifications.',
  'App ID: co.ke.nexora.ai · web dir: dist',
  'Pipeline: npm run build → npx cap sync → npx cap open ios|android → Xcode/Android Studio → App Store / Play Console.',
]);

h2('1.10 Desktop (Tauri)');
bullets([
  'src-tauri/{tauri.conf.json, Cargo.toml, src/main.rs, build.rs}.',
  'Targets: Windows (MSI + NSIS), macOS (DMG), Linux (deb + rpm + AppImage).',
  'Plugins: updater, notification, shell, fs, dialog, os, process.',
  'CSP: connect-src restricted to nexora.co.ke + safaricom + KRA.',
  'Auto-updater endpoint stub for releases.nexora.co.ke.',
]);

h2('1.11 Polish (Wave 4)');
bullets([
  'Sparkline IDs: useId() (fixes shared linearGradient bug when multiple sparklines same color on one page).',
  'Sparkline + chart wrapper: role="img" + aria-label.',
  'Per-page ErrorBoundary wrap (was single global).',
  'Smart React Query retry: no retry on 4xx.',
]);

h2('1.12 Intelligence (Wave 5)');
bullets([
  'src/utils/pdf.ts: 80mm thermal receipt PDF (with eTIMS QR slot) + A4 report PDF (jsPDF + autotable).',
  'src/hooks/useAiStream.ts: SSE streaming client with abort/cancel.',
  'Backend POST /api/ai/chat/stream: Anthropic stream proxy, model claude-haiku-4-5-20251001.',
]);

// ── WHAT TO ADD ───────────────────────────────────────────────────────────
newPage();
h1('2. What Should Be Added Next');

h2('2.1 Page-by-Page React Query Migration');
p('Pages still import mock data directly. Migrate to React Query hooks. Mock service layer already returns the right shapes, so switching is mechanical.');
table(
  ['Page', 'Current direct import', 'Replace with'],
  [
    ['POS', 'products, customers', 'useProducts(), useCustomers()'],
    ['Inventory', 'products, movements', 'useProducts(), useStockMovements()'],
    ['Customers', 'customers', 'useCustomers()'],
    ['Employees', 'employees', 'useEmployees()'],
    ['Branches', 'branches', 'useBranches()'],
    ['Suppliers', 'suppliers', 'useSuppliers()'],
    ['CRM', 'leads', 'useLeads()'],
    ['Accounting', 'invoices, transactions', 'useInvoices(), useTransactions()'],
    ['Payroll', 'payrollRuns, employees', 'usePayrollRuns(), useEmployees()'],
    ['HR', 'leaveRequests, employees', 'useLeaveRequests(), useEmployees()'],
    ['Analytics', 'mock + Math.random', 'useTransactions() + useMemo aggregation'],
    ['Reports', 'invoices, transactions, payroll', 'corresponding hooks'],
    ['Dashboard variants', 'mock', 'corresponding hooks'],
  ],
);

h2('2.2 Kenya Wedge UI Wiring');
bullets([
  'Checkout success: render eTIMS QR code, receipt number, KRA SDC ID. Use buildReceiptPdf for "Print" button.',
  'Checkout M-Pesa path: replace mock with stkPush() + countdown polling for callback (60s timeout).',
  'PWA offline POS: background-sync registration in service worker; reconcile queue on online event.',
  'WhatsApp share button on receipt and invoice screens.',
  'Chama: build /chama/[id] group detail page (members, contributions, rota, loans tabs).',
  'AI Assistant: enrich system prompt with eTIMS deadlines, current month VAT pre-fill from KRA, top alerts.',
]);

h2('2.3 UX / Accessibility (WCAG 2.2)');
bullets([
  'Swap CommandPalette overlay for @radix-ui/react-dialog (focus trap + role=dialog).',
  'Tooltip → @radix-ui/react-tooltip (keyboard-triggerable). Custom Tooltip is hover-only.',
  'Chart visually-hidden <table> mirror for screen readers.',
  'Table rows with onClick: wrap in <button> or add tabIndex={0} + Enter/Space handler.',
  'Touch-target audit: POS quantity ±, Toast close — minimum 44×44px.',
  'Memoize all Math.random() calls in component bodies (Analytics retention, KPI sparklines).',
]);

h2('2.4 Backend Module Completion');
bullets([
  'customers/routes.ts: CRUD beyond stub.',
  'invoices module: create, send (email + WhatsApp), eTIMS file on send, write-off, payment recording.',
  'payroll/routes.ts: run (per-month, multi-mobile-money disbursement), approve, P9 PDF export.',
  'hr/routes.ts: leave requests, attendance, discipline tickets.',
  'employees/routes.ts: hire, terminate, role + permissions.',
  'suppliers, branches, leads, purchase-orders: CRUD.',
  'notifications: WebSocket push, mark-read, push tokens registration.',
  'chama/routes.ts: group CRUD + contributions + loans + rota generation worker.',
  'BullMQ workers: etims-filer (retry queue), mpesa-reconciler (balance pull), payroll-runner, reorder-alerts.',
]);

h2('2.5 Intelligence Build-out');
bullets([
  'CRM Kanban DnD using @dnd-kit/sortable (deps already installed).',
  'Reorder-point background worker: hourly check, draft PO when stock < reorderPoint.',
  'Payroll multi-mobile-money disbursement UI (M-Pesa + Airtel Money + T-Kash + bank).',
  'KRA P9 payslip PDF template.',
  'Sales/inventory/customer report exports (PDF + CSV).',
  'AI tool-use: let the assistant query the database via JSON-schema tools (revenue this month, top products, etc).',
]);

h2('2.6 Compliance & Operational');
bullets([
  'KRA eTIMS production credentials (TIN, BHF ID, API key).',
  'M-Pesa Daraja production credentials (Consumer Key/Secret/Passkey for the shortcode).',
  'Privacy policy + Terms of Service published at /legal/.',
  'Data Protection Act 2019 compliance — DPO contact, breach notification flow.',
  'Audit log retention policy (7 years for KRA).',
  'Backup strategy: daily Postgres dump → S3 with 30-day retention.',
]);

// ── GO LIVE CHECKLIST ─────────────────────────────────────────────────────
newPage();
h1('3. Go-Live Checklist');

h2('3.1 Infrastructure');
table(
  ['Resource', 'Spec', 'Provider'],
  [
    ['Backend host', '2 vCPU / 4GB / 50GB SSD', 'DigitalOcean App Platform / Hetzner CX22'],
    ['Postgres', 'Managed, 4GB RAM, daily backup, PITR 7d', 'Neon / Supabase / DO Managed'],
    ['Redis', '256MB managed', 'Upstash / DO Managed'],
    ['Object storage', 'S3-compatible, lifecycle 90d glacier', 'Cloudflare R2 / DO Spaces'],
    ['CDN + Frontend host', 'Edge cache, free tier OK', 'Cloudflare Pages / Vercel'],
    ['DNS', 'nexora.co.ke + app.nexora.co.ke + api.nexora.co.ke', 'Cloudflare'],
    ['TLS', 'Let\'s Encrypt or Cloudflare Origin Cert', '—'],
    ['Container registry', 'For backend Docker image', 'GitHub Container Registry'],
    ['Logs / metrics', 'Pino → Loki + Grafana, or Sentry', 'Grafana Cloud / Sentry'],
    ['Error tracking', 'Sentry frontend + backend', 'Sentry'],
    ['Uptime monitoring', '1-min ping on /health', 'BetterStack / UptimeRobot'],
  ],
  { columnStyles: { 0: { fontStyle: 'bold' } } },
);

h2('3.2 Secrets to Provision (server-side only)');
bullets([
  'JWT_ACCESS_SECRET, JWT_REFRESH_SECRET — generate via: openssl rand -hex 48',
  'DATABASE_URL — managed Postgres connection string with SSL.',
  'REDIS_URL — managed Redis.',
  'KRA_ETIMS_TIN, KRA_ETIMS_BHF_ID, KRA_ETIMS_API_KEY — from KRA OSCU enrollment.',
  'MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_PASSKEY — Daraja portal (production keys, not sandbox).',
  'MPESA_SHORTCODE — your paybill or till number.',
  'MPESA_CALLBACK_BASE — public HTTPS URL Safaricom can POST to.',
  'AI_API_KEY — Anthropic Console.',
  'S3_ACCESS_KEY, S3_SECRET_KEY, S3_ENDPOINT, S3_BUCKET.',
  'WHATSAPP_PHONE_ID, WHATSAPP_TOKEN — Meta Business platform.',
  'SMTP_HOST/PORT/USER/PASS — transactional email provider (Postmark/Resend).',
  'SENTRY_DSN (server) + VITE_SENTRY_DSN (client, public).',
]);

h2('3.3 Pre-Launch Validation');
bullets([
  { text: 'npm run typecheck — passes (strict TS, zero errors).', color: C.emerald },
  { text: 'npm run lint — passes.', color: C.emerald },
  { text: 'npm run test:run — all unit tests green.', color: C.emerald },
  { text: 'npm run test:e2e — Playwright desktop + mobile flows pass.', color: C.emerald },
  { text: 'npm run build — production bundle builds, no warnings.', color: C.emerald },
  { text: 'Lighthouse PWA audit ≥ 90 across categories.', color: C.amber },
  { text: 'Backend npm run build + docker build succeed.', color: C.emerald },
  { text: 'Prisma migrate deploy is idempotent against a fresh DB.', color: C.emerald },
  { text: 'Manual test matrix: every role logs in, sees only their dashboard, can only navigate to permitted routes.', color: C.amber },
  { text: 'POS end-to-end: USB scanner adds item, camera scans, M-Pesa STK fires, eTIMS receipt printed, WhatsApp share works.', color: C.amber },
  { text: 'Offline test: kill network, complete sale, restore network, verify auto-flush of queued txn + eTIMS.', color: C.amber },
]);

h2('3.4 Store Submission');
table(
  ['Channel', 'Steps'],
  [
    ['Google Play', '1) Create Play Console listing. 2) Generate signed AAB via Android Studio. 3) Internal testing track → closed beta → production rollout 10% → 100%. Need: privacy policy URL, store listing (en-KE + sw-KE), screenshots (phone + tablet), feature graphic, data safety form.'],
    ['Apple App Store', '1) Apple Developer Program enrollment. 2) Xcode signing + provisioning profiles. 3) TestFlight → App Store Connect review (1–3d). Need: privacy nutrition labels, App Store screenshots (6.7" + 5.5"), promo video optional.'],
    ['Windows', 'Tauri MSI + NSIS, code-signed via EV/OV cert. Distribute via website (preferred) or Microsoft Store.'],
    ['macOS', 'Tauri DMG, signed with Apple Developer ID + notarized via altool/notarytool.'],
    ['Linux', 'AppImage (universal), deb (Ubuntu/Debian), rpm (Fedora/RHEL). Distribute via website + AppImageHub.'],
  ],
  { columnStyles: { 0: { fontStyle: 'bold', cellWidth: 32 } } },
);

h2('3.5 Launch-Day Runbook');
bullets([
  'T-7d: load test the API with k6 (sustained 100 RPS, peak 500 RPS).',
  'T-3d: dry-run Daraja in production with KSh 1 transaction. Confirm eTIMS filing receipt.',
  'T-1d: snapshot database. Tag release. Notify pilot customers.',
  'T-0: deploy backend → run prisma migrate deploy → deploy frontend → verify /health → smoke test as owner+cashier+accountant.',
  'T+1h: monitor Sentry, /health uptime, Postgres connections, Redis ops/s.',
  'T+24h: review audit logs, look for unexpected 403/500s.',
  'T+7d: gather pilot feedback, ship hotfixes via release channel.',
]);

h2('3.6 KPIs to Track Post-Launch');
table(
  ['Metric', 'Target', 'Source'],
  [
    ['Activation: % new accounts that complete first sale within 24h', '≥ 60%', 'Mixpanel / PostHog'],
    ['eTIMS filing success rate', '≥ 99%', 'transactions.etimsStatus'],
    ['M-Pesa STK success rate', '≥ 95%', 'mpesa callback log'],
    ['Median POS sale duration (cart → receipt)', '≤ 30s', 'frontend timing'],
    ['p95 API latency', '≤ 250ms', 'backend Pino + Prometheus'],
    ['Crash-free sessions (mobile)', '≥ 99.5%', 'Sentry'],
    ['DAU/MAU ratio', '≥ 0.4', 'analytics'],
    ['Weekly retention (W4)', '≥ 60%', 'analytics'],
  ],
);

h2('3.7 Files Produced This Session');
p('Frontend (new):', { bold: true, size: 10 });
bullets([
  'src/hooks/useBarcodeScanner.ts + .test.ts',
  'src/components/scanner/BarcodeScannerModal.tsx',
  'src/components/navigation/MobileBottomNav.tsx',
  'src/constants/permissions.ts',
  'src/utils/permissions.ts',
  'src/i18n/index.tsx + locales/{en-KE,sw-KE}.json',
  'src/services/api.ts + queryKeys.ts + queries.ts',
  'src/modules/{offline,whatsapp,etims,mpesa}/*.ts',
  'src/pages/Dashboard/SupervisorDashboard.tsx',
  'src/pages/Chama/index.tsx',
  'src/pages/Settings/PermissionsPanel.tsx',
  'src/utils/pdf.ts',
  'src/hooks/useAiStream.ts',
  'src/pwa.ts, src/test/setup.ts + utils.tsx',
  'capacitor.config.ts, src-tauri/* (Tauri scaffold)',
  'playwright.config.ts, test/e2e/smoke.spec.ts',
  '.github/workflows/ci.yml, .husky/pre-commit, .prettierrc.json',
  'HANDOFF.md, NEXORA-LAUNCH-READINESS.pdf (this file)',
]);
p('Frontend (modified):', { bold: true, size: 10 });
bullets([
  'tsconfig.app.json (strict on), .env.example (secrets cleansed), package.json (deps + scripts), vite.config.ts (PWA + chunks + headers), index.html (fonts + PWA meta)',
  'src/App.tsx, src/store/index.ts (split into 3), src/types/index.ts (Role + User extended), src/constants/index.ts (PERMISSION_MATRIX), src/routes/index.tsx (roleCan + per-page boundary + Chama), src/layouts/AppLayout.tsx (responsive), src/components/{ui,charts,navigation/Sidebar,navigation/Topbar}/index.tsx, src/services/index.ts (+ mutations), src/pages/POS/index.tsx (scanner), src/pages/Dashboard/{index,CashierDashboard}.tsx',
]);
p('Backend (created from scratch at /home/davie/WebstormProjects/nexora-backend):', { bold: true, size: 10 });
bullets([
  'package.json, tsconfig.json, .env.example, .gitignore, .prettierrc.json, Dockerfile',
  'prisma/schema.prisma (multi-tenant), prisma/seed.ts',
  'src/server.ts, src/lib/{env,prisma,logger,auth,rbac}.ts, src/routes/index.ts',
  'src/modules/{auth,users,products,transactions,etims,mpesa,ai,customers,chama}/routes.ts',
  'src/modules/{etims,mpesa}/service.ts',
  'docker/docker-compose.yml, scripts/boot.sh, .github/workflows/ci.yml',
]);

callout('Owner login (after seed): owner@nexora.co.ke / demo1234 — change immediately before any production data flows.', 'warn');

drawPageChrome();
writeFileSync(OUT, Buffer.from(doc.output('arraybuffer')));
console.log(`PDF written: ${OUT}`);
console.log(`Pages: ${page}`);
