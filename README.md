# NEXORA AI — Business Operating System

**The AI-powered enterprise management platform for modern businesses in Kenya.**

NEXORA AI is a comprehensive business operating system that unifies point-of-sale, inventory, CRM, accounting, payroll, HR, analytics, and AI-powered insights into a single, beautiful dashboard.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## ✨ Features

### Core Modules
- **📊 Dashboard** — Real-time KPIs, business health score, revenue charts, recent activity feed
- **🛒 Point of Sale** — Full POS with cart, M-Pesa/cash/card payments, receipt generation
- **📦 Inventory** — 300+ products, stock tracking, low-stock alerts, purchase orders
- **🤝 CRM** — Lead pipeline management (Kanban-style), customer 360° view
- **👥 Customers** — 500-customer database with loyalty tracking and segmentation
- **💰 Accounting** — Invoices, financial reports, cash flow overview
- **💵 Payroll** — Employee compensation, payroll runs, statutory deductions (KRA, NHIF, NSSF)
- **👔 HR & People** — Employee database, attendance tracking, leave management
- **🚚 Suppliers** — Vendor management, procurement tracking, ratings
- **🏢 Branches** — 12-branch multi-location management across Kenya
- **📈 Reports** — Sales, inventory, customer, and financial reports
- **📉 Analytics** — Executive dashboard, revenue forecasting, performance metrics
- **🤖 AI Assistant** — Business intelligence chatbot with contextual insights
- **⚙️ Settings** — Company profile, user role management, branding, security

### Platform Features
- 🌓 **Dark/Light mode** with system-aware theming
- 🔐 **Role-based access control** (10 roles: Super Admin → Employee)
- ⌨️ **Command palette** (⌘K) for quick navigation
- 📱 **Responsive design** — works on desktop, tablet, and mobile
- ⚡ **Lazy-loaded pages** for fast initial load
- 🔍 **Full-text search** across all modules
- 📤 **Export-ready** data tables

## 🏗️ Architecture

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # Design system (Button, Card, Input, Badge, etc.)
│   ├── charts/       # Recharts wrappers (Area, Bar, Line, Donut, Sparkline)
│   ├── dashboard/    # KPI cards and dashboard widgets
│   └── navigation/   # Sidebar, Topbar, CommandPalette
├── pages/            # Route-level page components (lazy-loaded)
├── hooks/            # Custom React hooks
├── store/            # Zustand global state (theme, user, notifications)
├── services/         # Data fetching layer (mock → real API)
├── constants/        # App constants (counties, roles, permissions)
├── types/            # TypeScript type definitions
├── utils/            # Utility functions (formatting, cn, etc.)
├── mock/             # Demo data (500 customers, 300 products, etc.)
├── routes/           # React Router configuration
├── layouts/          # App shell layout
└── styles/           # Global CSS and Tailwind config
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 6 |
| Build | Vite 8 |
| Routing | React Router 7 |
| State | Zustand 5 (with persist middleware) |
| Data Fetching | TanStack React Query 5 |
| Styling | Tailwind CSS 3 + CSS custom properties |
| UI Primitives | Radix UI (Dialog, Dropdown, Tabs, etc.) |
| Charts | Recharts 3 |
| Forms | React Hook Form 7 + Zod 4 |
| Animations | Framer Motion 12 |
| Icons | Lucide React |
| Linting | Oxlint |

## 🌍 Kenyan Business Context

NEXORA AI is built with Kenyan business requirements first:
- **M-Pesa integration** ready (Paybill 247247)
- **Kenyan counties** (all 47 counties pre-loaded)
- **KRA, NHIF, NSSF** statutory deductions
- **KES currency** formatting (`KSh 1.5M`, `KSh 12,450`)
- **Kenyan date/time formats** (`en-KE` locale)

## 🔐 Role-Based Access

| Role | Level | Access |
|------|-------|--------|
| Super Admin | 10 | Full system access |
| Owner | 9 | All modules + settings |
| CEO | 8 | All modules, view-only settings |
| Branch Manager | 5 | Branch operations |
| Accountant | 4 | Finance modules |
| Inventory/HR Manager | 4 | Domain-specific modules |
| Sales Agent | 2 | POS + CRM |
| Cashier | 1 | POS only |
| Employee | 1 | Self-service |

## 📦 Environment Variables

```bash
# Copy .env.example to .env and customize
cp .env.example .env
```

See [.env.example](.env.example) for all available configuration options.

## 🧪 Testing

```bash
# Coming soon — test suite with Vitest + React Testing Library
npm test
```

## 📄 License

MIT © NEXORA AI
