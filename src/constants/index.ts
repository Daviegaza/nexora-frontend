import type { Role } from '../types';

// ── App ──────────────────────────────────────────────────────────────────
export const APP_NAME = 'NEXORA AI';
export const APP_TAGLINE = 'Business Operating System';
export const APP_VERSION = '1.0.0';

// ── Kenyan Counties ──────────────────────────────────────────────────────
export const COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu',
  'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
  'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui',
  'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
  'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Muranga', 'Nairobi',
  'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka Nithi',
  'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
] as const;

// ── Product Categories ───────────────────────────────────────────────────
export const PRODUCT_CATEGORIES = [
  'Electronics', 'FMCG', 'Clothing', 'Hardware', 'Pharmaceuticals',
  'Food & Beverage', 'Stationery', 'Furniture', 'Cosmetics', 'Agricultural',
] as const;

// ── Payment Methods ──────────────────────────────────────────────────────
export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'mpesa', label: 'M-Pesa' },
  { value: 'card', label: 'Card' },
  { value: 'split', label: 'Split Payment' },
] as const;

// ── Role Hierarchy (higher index = more permissions) ─────────────────────
export const ROLE_HIERARCHY: Record<Role, number> = {
  super_admin: 10,
  admin: 9,
  owner: 9,
  ceo: 8,
  branch_manager: 5,
  accountant: 4,
  inventory_manager: 4,
  hr_manager: 4,
  sales_agent: 2,
  cashier: 1,
  employee: 1,
};

/** Check if a role has at least the required permission level */
export function hasPermission(userRole: Role, requiredLevel: number): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= requiredLevel;
}

// ── Page Access Levels ───────────────────────────────────────────────────
export const PAGE_ACCESS: Record<string, number> = {
  '/': 1,
  '/pos': 1,
  '/inventory': 2,
  '/crm': 2,
  '/customers': 1,
  '/accounting': 4,
  '/payroll': 4,
  '/hr': 4,
  '/employees': 1,
  '/suppliers': 2,
  '/branches': 5,
  '/reports': 4,
  '/analytics': 4,
  '/ai': 1,
  '/settings': 5,
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
