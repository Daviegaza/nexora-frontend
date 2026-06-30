import type { Role } from '../types';

// ── App ──────────────────────────────────────────────────────────────────
export const APP_NAME = 'NEXORA AI';
export const APP_TAGLINE = 'Business Operating System';
export const APP_VERSION = '1.0.0';

// ── Kenyan Counties ──────────────────────────────────────────────────────
export const COUNTIES = [
  'Baringo',
  'Bomet',
  'Bungoma',
  'Busia',
  'Elgeyo Marakwet',
  'Embu',
  'Garissa',
  'Homa Bay',
  'Isiolo',
  'Kajiado',
  'Kakamega',
  'Kericho',
  'Kiambu',
  'Kilifi',
  'Kirinyaga',
  'Kisii',
  'Kisumu',
  'Kitui',
  'Kwale',
  'Laikipia',
  'Lamu',
  'Machakos',
  'Makueni',
  'Mandera',
  'Marsabit',
  'Meru',
  'Migori',
  'Mombasa',
  'Muranga',
  'Nairobi',
  'Nakuru',
  'Nandi',
  'Narok',
  'Nyamira',
  'Nyandarua',
  'Nyeri',
  'Samburu',
  'Siaya',
  'Taita Taveta',
  'Tana River',
  'Tharaka Nithi',
  'Trans Nzoia',
  'Turkana',
  'Uasin Gishu',
  'Vihiga',
  'Wajir',
  'West Pokot',
] as const;

// ── Product Categories ───────────────────────────────────────────────────
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'FMCG',
  'Clothing',
  'Hardware',
  'Pharmaceuticals',
  'Food & Beverage',
  'Stationery',
  'Furniture',
  'Cosmetics',
  'Agricultural',
] as const;

// ── Payment Methods ──────────────────────────────────────────────────────
export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'mpesa', label: 'M-Pesa' },
  { value: 'card', label: 'Card' },
  { value: 'split', label: 'Split Payment' },
] as const;

// ── Role Hierarchy ────────────────────────────────────────────────────────
// Higher number = senior. Used for ORDERING / UI cues only. Do NOT make access
// decisions from level — use the explicit PERMISSION_MATRIX below.
export const ROLE_HIERARCHY: Record<Role, number> = {
  super_admin: 10,
  admin: 9,
  owner: 9,
  director: 8,
  ceo: 8, // back-compat alias of director
  branch_manager: 6,
  accountant: 5,
  supervisor: 5,
  inventory_manager: 4,
  hr_manager: 4,
  sales_agent: 3,
  cashier: 2,
  employee: 1,
};

/** Legacy level-based check kept for back-compat. Prefer roleCan(). */
export function hasPermission(userRole: Role, requiredLevel: number): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= requiredLevel;
}

// ── Explicit permission matrix (role → set of allowed paths) ──────────────
// Source of truth. The single place to edit role-based route access.
const FULL: ReadonlyArray<string> = [
  '/',
  '/pos',
  '/inventory',
  '/crm',
  '/customers',
  '/accounting',
  '/payroll',
  '/hr',
  '/employees',
  '/suppliers',
  '/branches',
  '/reports',
  '/analytics',
  '/ai',
  '/settings',
  '/chama',
];

export const PERMISSION_MATRIX: Record<Role, ReadonlyArray<string>> = {
  super_admin: FULL,
  admin: FULL,
  owner: FULL,
  director: FULL,
  ceo: FULL,
  branch_manager: [
    '/',
    '/pos',
    '/inventory',
    '/crm',
    '/customers',
    '/employees',
    '/suppliers',
    '/reports',
    '/analytics',
    '/ai',
    '/chama',
  ],
  supervisor: [
    '/',
    '/pos',
    '/inventory',
    '/crm',
    '/customers',
    '/employees',
    '/reports',
    '/ai',
    '/chama',
  ],
  accountant: [
    '/',
    '/accounting',
    '/payroll',
    '/customers',
    '/suppliers',
    '/reports',
    '/analytics',
    '/ai',
  ],
  inventory_manager: ['/', '/inventory', '/suppliers', '/reports', '/ai'],
  hr_manager: ['/', '/hr', '/payroll', '/employees', '/reports', '/ai'],
  sales_agent: ['/', '/pos', '/crm', '/customers', '/ai'],
  cashier: ['/', '/pos', '/customers'], // POS-focused, can look up customers
  employee: ['/', '/ai'], // self-service only
};

/** Authoritative check: can this role access this route? */
export function roleCan(role: Role | null | undefined, path: string): boolean {
  if (!role) return false;
  return PERMISSION_MATRIX[role]?.includes(path) ?? false;
}

// ── Legacy PAGE_ACCESS map (derived from matrix; kept for back-compat) ────
export const PAGE_ACCESS: Record<string, number> = {
  '/': 1,
  '/pos': 2,
  '/inventory': 4,
  '/crm': 3,
  '/customers': 2,
  '/accounting': 5,
  '/payroll': 4,
  '/hr': 4,
  '/employees': 4,
  '/suppliers': 4,
  '/branches': 8,
  '/reports': 4,
  '/analytics': 6,
  '/ai': 1,
  '/settings': 8,
  '/chama': 1,
};

// ── Human labels for roles ────────────────────────────────────────────────
export const ROLE_LABEL: Record<Role, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  owner: 'Owner',
  director: 'Director',
  ceo: 'CEO',
  branch_manager: 'Branch Manager',
  supervisor: 'Supervisor',
  accountant: 'Accountant',
  inventory_manager: 'Inventory Manager',
  hr_manager: 'HR Manager',
  sales_agent: 'Sales Agent',
  cashier: 'Cashier',
  employee: 'Employee',
};

// ── M-Pesa Paybill ───────────────────────────────────────────────────────
export const MPESA_PAYBILL = '247247';
export const MPESA_TILL = '525900';

// ── Tax Rate (VAT Kenya) ─────────────────────────────────────────────────
export const VAT_RATE = 0.16;

// ── Date Formats ─────────────────────────────────────────────────────────
export const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
};

export const DATE_TIME_FORMAT: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

// ── Pagination ───────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 25;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
