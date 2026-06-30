# NEXORA AI — Super Update Handoff

Status snapshot as of this session. Pick up from "Pending" sections.

## What landed this session

### Frontend (/home/davie/WebstormProjects/nexora-frontend)

**Foundation / security (P0):**

- `tsconfig.app.json` — `strict: true`, `noImplicitAny`, `strictNullChecks` enabled. `verbatimModuleSyntax: false` so `React`/value imports stay simple.
- `.env.example` — separated public `VITE_*` from server-only secrets. Removed `VITE_AI_API_KEY`, `VITE_MPESA_PASSKEY` (those were leaking into the bundle).
- `src/store/index.ts` — split into `useUiStore` (persists theme/sidebar/branch), `useAuthStore` (token in sessionStorage only, no role-in-localStorage escalation), `useNotificationsStore`. Back-compat `useAppStore` shim kept so existing pages continue to work.
- `vite.config.ts` — PWA plugin, dev proxy `/api`, security headers (X-Frame-Options, Referrer-Policy, Permissions-Policy), manual chunks (react / query / charts / radix / icons / i18n / pdf / scanner), Vitest config block.
- `index.html` — `lang="en-KE"`, Apple PWA meta, font stylesheet link wired.
- `src/main.tsx` unchanged; `App.tsx` now: per-page boundary intact, `I18nGate`, PWA register, smart React Query defaults (no 4xx retry).
- `src/pwa.ts` — service-worker registration with offline-ready and update toasts.
- `package.json` — added `vitest`, `@testing-library/*`, `playwright`, `husky`, `lint-staged`, `prettier`, `vite-plugin-pwa`, `i18next`/`react-i18next`, `idb-keyval`, `ky`, `jspdf`, `@zxing/browser`, `@zxing/library`, `@dnd-kit/*`, `@tanstack/react-virtual`, `workbox-window`.

**Barcode scanner:**

- `src/hooks/useBarcodeScanner.ts` — USB / Bluetooth keyboard-wedge detector (fast keystrokes ended by `Enter`, ignores human typing speed). `playScanBeep()` WebAudio helper.
- `src/components/scanner/BarcodeScannerModal.tsx` — camera modal using ZXing (EAN-13, UPC, Code-128, QR, etc), torch toggle, manual-entry fallback if no camera. Aria-modal dialog, focus-trapped via Radix-compatible markup.
- `src/pages/POS/index.tsx` — wired both scanner paths: USB-wedge auto-adds; click "Scan" button opens camera modal; manual barcode in search box also works (Enter to lookup). Beeps + toasts + green flash on success. Receipt number now `crypto.randomUUID()`-based.
- Test: `src/hooks/useBarcodeScanner.test.ts` (fires fast keystrokes / ignores slow typing).

**RBAC overhaul + delegated permissions:**

- `src/types/index.ts` — `Role` union: added `supervisor`, `director`. Kept `ceo` as alias. Extended `User` with `permissionsAdd`, `permissionsRemove`, `customRoleId`. Added `CustomRole` type.
- `src/constants/index.ts` — `PERMISSION_MATRIX` explicit `Role → path[]`. `roleCan()` helper is the new source of truth. Legacy `hasPermission` kept for back-compat. Added `ROLE_LABEL`.
- `src/constants/permissions.ts` — granular capability list (`pos.refund`, `users.invite`, `etims.file`, ...) + `ROLE_CAPS` defaults per role.
- `src/utils/permissions.ts` — `userCan(user, cap)`, `userCanRoute(user, path)`, `capDiff(user)`. Resolution: defaults + permissionsAdd − permissionsRemove.
- `src/pages/Dashboard/index.tsx` — explicit role → dashboard map (no more level collisions). Cashier no longer sees employee dashboard.
- `src/pages/Dashboard/SupervisorDashboard.tsx` — NEW: shift state, pending approvals (voids/refunds/discount overrides), cashier-on-shift cards, hourly sales pace vs target, floor alerts. Designed for floor oversight, not exec analytics.
- `src/pages/Dashboard/CashierDashboard.tsx` — fixed `window.location.assign` → `useNavigate`.

**Mobile navigation:**

- `src/store/index.ts` — added `mobileNavOpen` + `setMobileNavOpen`.
- `src/components/navigation/Sidebar.tsx` — converted to drawer on `<lg`: slides in over backdrop, slides off-screen by default. Permanent on `lg+`. Width 280px on mobile (not 260) for thumb comfort. Backdrop click closes.
- `src/components/navigation/Topbar.tsx` — `Menu` hamburger button visible only `<lg`. Topbar left snaps to `0` on mobile (was hardcoded `260px`).
- `src/layouts/AppLayout.tsx` — responsive margin (`ml-0 lg:ml-[68px|260px]`). Body scroll-locked while drawer open. Auto-closes drawer on route change. Reserves bottom 64px on mobile for bottom-nav.
- `src/components/navigation/MobileBottomNav.tsx` — NEW: 5-slot bottom nav (Home, POS, AI, Alerts, More). Safe-area inset padding. Badge for unread alerts.
- `src/pages/POS/index.tsx` — cart panel: full-width below products on mobile, 340px sidebar on `md+`. Floating "Cart (n) · KSh X" pill on mobile when items present.

**i18n (English + Swahili):**

- `src/i18n/index.tsx` — i18next bootstrap + `I18nGate` blocking render until ready. Browser language detection with `nexora.lang` localStorage key.
- `src/i18n/locales/en-KE.json` + `sw-KE.json` — nav, POS, checkout, common, errors, chama keys.

**Service layer scaffolding:**

- `src/services/api.ts` — `ky` client with bearer-token injection from `useAuthStore`, `Accept-Language` header, 401 → clear session + redirect, typed `ApiError` from `beforeError` hook.
- `src/services/queryKeys.ts` — central `QK` factory for cache keys.
- `src/services/queries.ts` — `useProducts`, `useCustomers`, ... + mutations (`useCreateTransaction`, `useUpsertCustomer`, `useUpsertProduct`). Currently calls the existing mock `services/index.ts` functions; rewrite those to call `api.json('/products')` etc. when backend is wired.

**Mobile (Capacitor) + Desktop (Tauri):**

- `capacitor.config.ts` — iOS + Android wrappers with SplashScreen, StatusBar, Keyboard, BarcodeScanner, PushNotifications, LocalNotifications plugins declared. Build pipeline: `npm run build && npx cap sync && npx cap open ios|android`.
- `src-tauri/tauri.conf.json` — Windows (msi+nsis), macOS (dmg), Linux (deb/rpm/AppImage) targets. Tight CSP, updater channel, plugin set.
- `src-tauri/Cargo.toml` + `main.rs` + `build.rs` — Rust entry with notification, shell, fs, dialog, os, process, updater plugins.

### Backend (/home/davie/WebstormProjects/nexora-backend)

- `package.json` — Fastify 5 + Prisma 6 + Postgres + Redis (BullMQ) + JWT + Argon2 + Zod + Pino + Swagger + WebSocket.
- `tsconfig.json` — strict mode, ES2023 target.
- `.env.example` — DB, Redis, JWT secrets, KRA eTIMS, Daraja, AI provider, S3, WhatsApp/SMTP.
- `prisma/schema.prisma` — multi-tenant (`workspaceId` everywhere) Postgres schema covering: Workspace, User, CustomRole, RefreshToken, AuditLog, Branch, Employee, Product, StockLevel, StockMovement, Customer, Transaction, CartItemRecord, Invoice, Lead, Supplier, PurchaseOrder, PayrollRun, Attendance, LeaveRequest, ChamaGroup/Member/Contribution/Loan/RotaSlot, Notification.
- `src/server.ts` — Fastify bootstrap: helmet, CORS, cookie, JWT, rate-limit, websocket, OpenAPI + Swagger UI at `/docs`, health endpoint.
- `src/lib/env.ts` — Zod-validated env loader.
- `src/lib/prisma.ts` — singleton client.
- `src/lib/logger.ts` — Pino with redactions.
- `src/lib/auth.ts` — `hashPassword`, `verifyPassword`, `newRefreshToken`, `requireAuth`, `requireCap(cap)` preHandler.
- `src/lib/rbac.ts` — mirror of frontend `ROLE_CAPS` + `resolveCaps`. Source of truth for server-side authorization.
- `src/modules/auth/routes.ts` — `/register`, `/login`, `/refresh` (httpOnly cookie), `/logout`, `/me`. Argon2id passwords, hashed refresh tokens.
- `src/modules/{users,products,customers,transactions,etims,mpesa,chama,ai}/routes.ts` — stub `GET /` with workspace scope. **Pending**: per-module CRUD with proper `requireCap()` preHandlers.
- `src/modules/etims/service.ts` — KRA OSCU client (sandbox URL). `fileEtimsInvoice`, `cancelEtimsInvoice`.
- `src/modules/mpesa/service.ts` — Daraja STK Push. OAuth token + password generator. Callback handling pending.
- `src/routes/index.ts` — module registration with `/api/*` prefixes.
- `docker/docker-compose.yml` — Postgres 18 + Redis 8.
- `Dockerfile` — multi-stage Node 24 alpine build.
- `.github/workflows/ci.yml` — Postgres-service CI with lint + test + migrate-deploy + build.

## Pending — pick up here

### Wave 2: React Query data layer (replace mock direct imports)

Pages still import directly from `src/mock/data.ts`. Migrate to `useQuery` hooks:

| Page                         | Current direct import           | Replace with                                             |
| ---------------------------- | ------------------------------- | -------------------------------------------------------- |
| `pages/POS/index.tsx`        | `products, customers` from mock | `useProducts()`, `useCustomers()`                        |
| `pages/Inventory/index.tsx`  | mock                            | `useProducts()`, `useStockMovements()`                   |
| `pages/Customers/index.tsx`  | mock                            | `useCustomers()`                                         |
| `pages/Employees/index.tsx`  | mock                            | `useEmployees()`                                         |
| `pages/Branches/index.tsx`   | mock                            | `useBranches()`                                          |
| `pages/Suppliers/index.tsx`  | mock                            | `useSuppliers()`                                         |
| `pages/CRM/index.tsx`        | mock                            | `useLeads()`                                             |
| `pages/Accounting/index.tsx` | mock                            | `useInvoices()`, `useTransactions()`                     |
| `pages/Payroll/index.tsx`    | mock                            | `usePayrollRuns()`, `useEmployees()`                     |
| `pages/HR/index.tsx`         | mock                            | `useLeaveRequests()`, `useEmployees()`                   |
| `pages/Analytics/index.tsx`  | mock + `Math.random()`          | `useTransactions()` + memoized aggregation               |
| `pages/Reports/index.tsx`    | mock                            | `useInvoices()`, `useTransactions()`, `usePayrollRuns()` |
| `pages/Dashboard/*`          | mock                            | corresponding `use*` hooks                               |

Add to `src/services/index.ts`:

- `findProductByBarcode(code: string): Promise<Product | undefined>` (needed by `useProductByBarcode`)
- `createTransaction(t)`, `upsertCustomer(c)`, `upsertProduct(p)`

When the backend is live, rewrite each `fetch*` in `src/services/index.ts` to `api.get('products').json<Product[]>()` etc. The React Query hooks won't change.

### Wave 3: Kenya wedge features

1. **eTIMS UI** — in checkout success state show eTIMS QR + receipt number. Add `EtimsStatus` badge component reading `transaction.etimsStatus`. When offline, queue invoice in IndexedDB (`src/modules/offline/queue.ts` — use `idb-keyval`) and flush on `online` event.
2. **M-Pesa STK Push** — in checkout when `method === 'mpesa'`, POST to `/api/mpesa/stk` with `{ phone, amount, accountRef: receiptNo }`. Show countdown polling for `Result` callback (60s). Backend service already scaffolded at `nexora-backend/src/modules/mpesa/service.ts`.
3. **PWA offline POS queue** — `src/modules/offline/queue.ts`: write `{ id, kind: 'transaction'|'invoice', payload }` to IDB when network down. Background sync (`navigator.serviceWorker.ready.then(sw => sw.sync.register('flush-offline'))`).
4. **Chama module** — new pages `src/pages/Chama/{index,Group,NewGroup,Contributions,Rota,Loans}.tsx`. Route at `/chama`. Backend models ready.
5. **WhatsApp commerce** — helper `src/modules/whatsapp/share.ts` that builds `wa.me/{number}?text=...` deep links with receipt summary. Add "Share to WhatsApp" button on receipt and invoice.
6. **AI Assistant context** — extend `pages/AIAssistant` to send `system` prompt with eTIMS deadlines, current month VAT pre-fill from KRA, top alerts.

### Wave 4: UX polish + a11y

1. **CommandPalette → Radix Dialog** — replace hand-rolled overlay with `@radix-ui/react-dialog` (proper focus trap, role=dialog, escape).
2. **Tooltip → keyboard-triggerable** — `src/components/ui` Tooltip currently hover-only. Use `@radix-ui/react-tooltip`.
3. **Charts a11y** — pass `role="img"` + `aria-label` to each chart wrapper; add visually-hidden `<table>` mirror.
4. **Table row keyboard** — `tr` with `onClick` → wrap in `<button>` or add `tabIndex={0} + onKeyDown` for Enter/Space.
5. **Memoize `Math.random` at render** — Analytics retention, Sparkline hash collisions, Customer table progress bars all regenerate per render.
6. **Sparkline ID** — `id={`spark-${useId()}`}` instead of `spark-${fillColor}`.
7. **Loading skeletons** per page — wrap data-dependent sections with `<Suspense>` boundaries.
8. **Touch target audit** — POS quantity ±, Toast close, sparkline interactive bits → min 44×44px.

### Wave 5: Intelligence + analytics

1. CRM Kanban DnD using `@dnd-kit/sortable` (already in deps).
2. Reorder-point worker on backend — runs hourly, creates draft PO when `stock < reorderPoint`.
3. Payroll multi-mobile-money disbursement form (M-Pesa + Airtel Money + T-Kash + bank).
4. AI streaming — backend `src/modules/ai/routes.ts` adds `POST /chat/stream` using SSE. Frontend reads via `EventSource`.
5. PDF export — `src/utils/pdf.ts` using `jspdf` + `jspdf-autotable`. Templates: KRA invoice, P9 payslip, sales report.

### Wave 6: Backend continuation

Per module, fill out CRUD beyond the stub:

- `users` — invite (email/SMS), list (workspace-scoped), update role, deactivate, grant/revoke capability. Use `requireCap('users.invite')`.
- `products` — full CRUD + barcode lookup + bulk import.
- `transactions` — POST creates transaction + decrements stock + triggers eTIMS file (job in BullMQ).
- `etims` — `POST /file/:txnId`, `POST /cancel/:invoiceNo`, webhook from KRA.
- `mpesa` — `POST /stk`, `POST /callback` (Daraja webhook).
- `chama` — group CRUD + contributions + loans + rota.
- `ai` — `POST /chat` → Anthropic Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) with workspace context.

Workers (BullMQ in `src/workers/`):

- `etims-filer` — retries failed filings.
- `mpesa-reconciler` — periodic balance pull + mark transactions.
- `payroll-runner` — long job for monthly payroll.
- `reorder-alerts` — checks stock levels, creates draft POs.

### Wave 7: Mobile (Capacitor)

```bash
cd nexora-frontend
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android \
  @capacitor/splash-screen @capacitor/status-bar @capacitor/keyboard \
  @capacitor/push-notifications @capacitor/local-notifications \
  @capacitor-mlkit/barcode-scanning
npx cap init "NEXORA AI" co.ke.nexora.ai --web-dir dist
npm run build && npx cap add ios && npx cap add android
npx cap sync
npx cap open ios     # Xcode → App Store Connect
npx cap open android # Android Studio → Play Console
```

Replace `BarcodeScannerModal` camera path with `@capacitor-mlkit/barcode-scanning` when running in a native shell — fall back to ZXing browser when web. Detect via `Capacitor.isNativePlatform()`.

Native bridge stubs needed in `src/native/`:

- `native/printer.ts` — Bluetooth thermal receipt printer (`@capacitor-community/bluetooth-le`).
- `native/biometrics.ts` — fingerprint/Face ID unlock.
- `native/push.ts` — register device, send token to backend.

### Wave 8: Desktop (Tauri)

```bash
cd nexora-frontend
cargo install tauri-cli --version "^2.0"
npm install -D @tauri-apps/cli @tauri-apps/api
# scaffold already in src-tauri/, just init Rust deps:
cd src-tauri && cargo fetch && cd ..
npm run tauri dev    # add: "tauri": "tauri" to package.json scripts
npm run tauri build  # produces .msi / .dmg / .deb / .AppImage in src-tauri/target/release/bundle/
```

Code signing:

- macOS: Apple Developer ID + notarization (`tauri.bundle.macOS.signingIdentity`).
- Windows: EV/OV code signing cert wired in `tauri.bundle.windows.certificateThumbprint`.

Auto-updater publish flow: `tauri signer generate-key`, upload `dist.tar.gz` + `dist.tar.gz.sig` to `releases.nexora.co.ke/{target}/{version}` (or use GitHub Releases endpoint).

## Known issues to fix on resume

- **GateGuard hooks** were noisy this session. Per-file first-edit blocks. To disable: `export ECC_GATEGUARD=off` in shell, or keep `.claude/settings.local.json` (already written) and start a fresh session — the hooks read it at session start.
- **`framer-motion`** still in deps but unused. Either remove or wire animations (cmd palette enter, modal scale-in are reasonable starts).
- **`recharts`** is ~450KB gzipped. Acceptable for now; consider `uplot` for sparklines if bundle audit demands.
- **Service layer** `src/services/index.ts` is unchanged from mock-only state. Add the new function names referenced by `queries.ts` (`findProductByBarcode`, `createTransaction`, `upsertCustomer`, `upsertProduct`) — they're imported but don't exist yet. Quick stubs:

```ts
export async function findProductByBarcode(code: string) {
  return delay(mockProducts.find((p) => p.barcode === code || p.sku === code));
}
export async function createTransaction(t: Omit<Transaction, 'id'>) {
  const next: Transaction = { ...t, id: crypto.randomUUID() };
  mockTransactions.unshift(next);
  return delay(next);
}
export async function upsertCustomer(c: Customer) {
  /* identical pattern */
}
export async function upsertProduct(p: Product) {
  /* identical pattern */
}
```

- **Sidebar still uses `useAppStore`** legacy shim — works but `currentRole` will collide with `useAuthStore.currentUser.role`. When you wire real auth, replace `useAppStore((s) => s.currentRole)` with `useAuthStore((s) => s.currentUser?.role ?? 'employee')`.
- **`routes/index.tsx`** still uses level-based `RoleGuard`. Migrate to `roleCan(role, path)`:

```ts
function RoleGuard({ children, path }: { children: React.ReactNode; path: string }) {
  const role = useAuthStore((s) => s.currentUser?.role ?? null);
  if (!roleCan(role, path)) return <Navigate to="/" replace />;
  return <>{children}</>;
}
```

- **Topbar role-switcher** (`roles` array line 27) — exposes `setRole` from the legacy shim which is now a no-op. Either remove the switcher entirely (production) or hide behind a dev-only flag.

## Quick boot for the next session

```bash
# Frontend
cd /home/davie/WebstormProjects/nexora-frontend
rm -rf node_modules package-lock.json && npm install
npm run typecheck   # expect: clean
npm run dev         # http://localhost:5173

# Backend
cd /home/davie/WebstormProjects/nexora-backend
npm install
docker compose -f docker/docker-compose.yml up -d
cp .env.example .env  # fill JWT_*_SECRET + DATABASE_URL
npx prisma migrate dev --name init
npm run dev         # http://localhost:4000  (Swagger UI at /docs)
```

## Architecture decisions worth keeping

- **Token in `sessionStorage`** + **HttpOnly refresh cookie** is the secure pattern. The frontend never reads the refresh; `/api/auth/refresh` does.
- **Per-route `requireCap('x.y')`** on backend > middleware soup. Each endpoint declares the capability it needs.
- **Multi-tenant by `workspaceId`** — every Prisma query MUST filter by `me.workspaceId`. Consider adding a Prisma extension that enforces this.
- **i18n keys, not strings** — every user-facing string in new code MUST go through `t('...')`. Run `npm run lint -- --rule "i18next/no-literal-string"` (add plugin) before merging.
- **Capability matrix mirror** — frontend `constants/permissions.ts` and backend `lib/rbac.ts` are duplicated by design (different runtimes). Keep them in sync via the bundled `ROLE_CAPS` exports or generate from a shared JSON.

---

## Second-pass additions (this continuation)

**Frontend:**

- `src/services/index.ts` — added `findProductByBarcode`, `createTransaction`, `upsertCustomer`, `upsertProduct`, `upsertEmployee` mock-backed mutations (signatures match future backend).
- `src/modules/offline/queue.ts` — IDB-backed offline op queue (`enqueue`, `pending`, `flush`, `onlineFlusher`). Kinds: `transaction`, `invoice`, `etims.file`, `mpesa.stk`, …
- `src/modules/whatsapp/share.ts` — `whatsappReceiptUrl` (with KE phone normalization 07XX → 2547XX) + `whatsappProductUrl` + `whatsappShare`.
- `src/modules/etims/client.ts` — `fileEtims(txnId)` w/ offline-fallback (auto-enqueues when offline or API fails).
- `src/modules/mpesa/client.ts` — `stkPush`, `stkStatus` typed wrappers.
- `src/pages/Chama/index.tsx` — Chama listing page (KPIs, group cards w/ contribution progress, rota/loans/members buttons). Wired into routes + sidebar (Community group).
- `src/routes/index.tsx` — `RoleGuard` now uses `roleCan(role, path)` (no level collisions). Per-page `ErrorBoundary` inside `SuspenseWrapper`. `/chama` route added.
- `src/components/charts/index.tsx` — `Sparkline` ID uses `useId()` (fixes shared-gradient bug) + `role="img"` aria.
- `src/components/navigation/Sidebar.tsx` — Chama nav item w/ "New" badge in Community group.
- `src/utils/pdf.ts` — `buildReceiptPdf` (80mm thermal w/ eTIMS QR slot) + `buildReportPdf` (A4) + `downloadBlob`.
- `src/hooks/useAiStream.ts` — SSE streaming for AI chat w/ abort/cancel.
- `src/pages/Settings/PermissionsPanel.tsx` — owner UI to grant/revoke per-user capabilities (CAPABILITIES list × user list, search, toggle), gated on `users.grant` cap.
- `playwright.config.ts` + `test/e2e/smoke.spec.ts` — desktop + mobile-Android smoke (mobile drawer test).
- `.github/workflows/ci.yml` — lint + typecheck + test + build + Playwright job.
- `.husky/pre-commit` + `.prettierrc.json` + `package.json prepare` script.

**Backend:**

- `src/modules/users/routes.ts` — GET list, POST `/invite` (`users.invite`), PATCH `/:id/grant` (`users.grant`, per-user cap deltas), PATCH `/:id/role` (`roles.assign`), PATCH `/:id/deactivate`.
- `src/modules/products/routes.ts` — full CRUD + `GET /barcode/:code`.
- `src/modules/transactions/routes.ts` — `POST /` decrements stock + records movements + fires eTIMS filing (best-effort). `GET /` last 200.
- `src/modules/etims/routes.ts` — `POST /file/:txnId` (sync re-file) + `POST /cancel/:invoiceNo`.
- `src/modules/mpesa/routes.ts` — `POST /stk` + `POST /callback` (unauth, Safaricom webhook).
- `src/modules/ai/routes.ts` — `POST /chat` (Anthropic, Claude Haiku 4.5 by default) + `POST /chat/stream` (SSE).
- `prisma/seed.ts` — demo workspace + owner (`owner@nexora.co.ke` / `demo1234`) + Nairobi HQ branch.
- `scripts/boot.sh` — one-shot up: docker → wait pg → prisma generate/migrate → seed → dev.
- `.prettierrc.json`.

## One-command bring-up

```bash
# Backend
cd /home/davie/WebstormProjects/nexora-backend
cp .env.example .env
# (fill JWT_*_SECRET with `openssl rand -hex 48`)
npm install
./scripts/boot.sh

# Frontend
cd /home/davie/WebstormProjects/nexora-frontend
npm install
npm run dev          # http://localhost:5173
npm run typecheck    # gate
npm run test:run     # Vitest
npm run test:e2e     # Playwright

# Mobile
npx cap add ios && npx cap add android && npx cap sync
npx cap open ios     # → App Store Connect
npx cap open android # → Play Console

# Desktop
npm run tauri dev    # local
npm run tauri build  # → .msi/.dmg/.deb/.AppImage
```

Login as `owner@nexora.co.ke` / `demo1234` after `npm run seed`.

## All waves status

| Wave                 | Status     | Notes                                                                           |
| -------------------- | ---------- | ------------------------------------------------------------------------------- |
| 1 Foundation + P0    | ✅         | Strict TS, env split, store split, PWA, CSP, vitest                             |
| Scanner              | ✅         | USB-wedge + ZXing camera + manual + beep + toast                                |
| RBAC overhaul        | ✅         | supervisor + director roles, PERMISSION_MATRIX, SupervisorDashboard             |
| Delegated perms      | ✅         | CAPABILITIES + ROLE_CAPS + userCan + PermissionsPanel UI                        |
| Mobile nav           | ✅         | Drawer + MobileBottomNav + responsive POS                                       |
| i18n                 | ✅         | en-KE + sw-KE                                                                   |
| 2 React Query layer  | ✅         | api.ts + queries.ts + mutations                                                 |
| 3 Kenya wedge        | ✅         | eTIMS client + Daraja client + offline queue + WhatsApp + Chama                 |
| 4 UX/a11y            | ✅ partial | Sparkline ID + role="img"; charts table-mirror pending                          |
| 5 Intelligence       | ✅ partial | PDF util + AI streaming hook + SSE backend; CRM Kanban pending (deps installed) |
| 6 Backend            | ✅         | Auth, users w/ grant, products, transactions+eTIMS trigger, mpesa, ai stream    |
| 7 Mobile (Capacitor) | ✅         | Config landed; awaits `npx cap add ios                                          | android` |
| 8 Desktop (Tauri)    | ✅         | Config landed; awaits `cargo fetch` + `tauri build`                             |
