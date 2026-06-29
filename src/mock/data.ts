import type { Branch, Product, Customer, Employee, Supplier, Transaction, Lead, Invoice, Notification, AIInsight, PayrollRun, StockMovement, LeaveRequest, PurchaseOrder } from '../types';

// ===== BRANCHES =====
export const branches: Branch[] = [
  { id: 'b1', name: 'Nairobi HQ', location: 'Westlands, Nairobi', county: 'Nairobi', manager: 'James Mwangi', phone: '+254 20 3456789', revenue: 4850000, employees: 45, status: 'active', openedDate: '2019-01-15' },
  { id: 'b2', name: 'Mombasa Branch', location: 'Nyali, Mombasa', county: 'Mombasa', manager: 'Fatuma Hassan', phone: '+254 41 2234567', revenue: 2340000, employees: 22, status: 'active', openedDate: '2020-03-01' },
  { id: 'b3', name: 'Kisumu Branch', location: 'Milimani, Kisumu', county: 'Kisumu', manager: 'Otieno Ochieng', phone: '+254 57 2023456', revenue: 1890000, employees: 18, status: 'active', openedDate: '2020-08-15' },
  { id: 'b4', name: 'Nakuru Branch', location: 'Section 58, Nakuru', county: 'Nakuru', manager: 'Grace Wanjiku', phone: '+254 51 2212345', revenue: 1560000, employees: 15, status: 'active', openedDate: '2021-02-01' },
  { id: 'b5', name: 'Eldoret Branch', location: 'Uganda Road, Eldoret', county: 'Uasin Gishu', manager: 'Kipchoge Korir', phone: '+254 53 2067890', revenue: 1230000, employees: 12, status: 'active', openedDate: '2021-06-01' },
  { id: 'b6', name: 'Thika Branch', location: 'Commercial St, Thika', county: 'Kiambu', manager: 'Mary Njeri', phone: '+254 67 2212345', revenue: 980000, employees: 10, status: 'active', openedDate: '2022-01-15' },
  { id: 'b7', name: 'Nyeri Branch', location: 'Kimathi St, Nyeri', county: 'Nyeri', manager: 'Peter Kamau', phone: '+254 61 2020000', revenue: 750000, employees: 8, status: 'active', openedDate: '2022-06-01' },
  { id: 'b8', name: 'Malindi Branch', location: 'Lamu Road, Malindi', county: 'Kilifi', manager: 'Aisha Omar', phone: '+254 42 2020123', revenue: 620000, employees: 7, status: 'active', openedDate: '2022-09-01' },
  { id: 'b9', name: 'Garissa Branch', location: 'Kismayu Road, Garissa', county: 'Garissa', manager: 'Abdi Noor', phone: '+254 46 2020456', revenue: 480000, employees: 6, status: 'active', openedDate: '2023-01-01' },
  { id: 'b10', name: 'Kakamega Branch', location: 'Kakamega Town', county: 'Kakamega', manager: 'Rose Amisi', phone: '+254 56 2031234', revenue: 560000, employees: 7, status: 'active', openedDate: '2023-03-01' },
  { id: 'b11', name: 'Kericho Branch', location: 'Kericho Town', county: 'Kericho', manager: 'Samuel Kirui', phone: '+254 52 2021234', revenue: 420000, employees: 5, status: 'active', openedDate: '2023-06-01' },
  { id: 'b12', name: 'Machakos Branch', location: 'Machakos Town', county: 'Machakos', manager: 'Lucy Mutua', phone: '+254 44 2021234', revenue: 390000, employees: 5, status: 'inactive', openedDate: '2023-09-01' },
];

// ===== PRODUCTS =====
const categories = ['Electronics', 'FMCG', 'Clothing', 'Hardware', 'Pharmaceuticals', 'Food & Beverage', 'Stationery', 'Furniture', 'Cosmetics', 'Agricultural'];
const suppliers_list = ['Bidco Africa', 'Unilever Kenya', 'Safaricom PLC', 'ARM Cement', 'Kenya Breweries', 'East African Breweries', 'Nakumatt Holdings', 'Tuskys Supermarkets', 'Jumia Kenya', 'Kilimall'];

export const products: Product[] = Array.from({ length: 300 }, (_, i) => {
  const cat = categories[i % categories.length];
  const price = Math.round((Math.random() * 9000 + 100) * 10) / 10;
  const stock = Math.floor(Math.random() * 500);
  const minStock = Math.floor(Math.random() * 50) + 10;
  return {
    id: `p${i + 1}`,
    name: `${cat} Product ${String(i + 1).padStart(3, '0')}`,
    sku: `SKU-${cat.slice(0, 3).toUpperCase()}-${String(i + 1).padStart(4, '0')}`,
    category: cat, price,
    cost: Math.round(price * 0.65 * 10) / 10,
    stock, minStock,
    unit: ['pcs', 'kg', 'litres', 'boxes', 'cartons'][i % 5],
    supplier: suppliers_list[i % suppliers_list.length],
    barcode: `6${String(Math.floor(Math.random() * 9999999999999)).padStart(12, '0')}`,
    lastRestocked: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
    status: stock === 0 ? 'out_of_stock' : stock < minStock ? 'low_stock' : 'active',
    expiryDate: ['Food & Beverage', 'Pharmaceuticals', 'FMCG'].includes(cat)
      ? new Date(Date.now() + Math.random() * 365 * 86400000).toISOString() : undefined,
  };
});

// ===== CUSTOMERS =====
const kenyaCounties = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu', 'Kiambu', 'Nyeri', 'Kilifi', 'Garissa', 'Kakamega', 'Kericho', 'Machakos', 'Meru', 'Embu', 'Kajiado'];
const firstNames = ['James', 'Mary', 'Peter', 'Grace', 'John', 'Faith', 'David', 'Joyce', 'Samuel', 'Rose', 'Paul', 'Mercy', 'Daniel', 'Agnes', 'Joseph', 'Esther', 'Stephen', 'Priscilla', 'Charles', 'Catherine', 'Michael', 'Elizabeth', 'Robert', 'Sarah', 'Patrick', 'Alice', 'George', 'Martha', 'Henry', 'Anne', 'Fatuma', 'Hassan', 'Abdi', 'Amina', 'Omar', 'Aisha', 'Otieno', 'Akinyi', 'Ochieng', 'Awino'];
const lastNames = ['Mwangi', 'Kamau', 'Wanjiku', 'Njeri', 'Omondi', 'Otieno', 'Achieng', 'Owino', 'Mutua', 'Mwende', 'Kirui', 'Korir', 'Chebet', 'Kiptoo', 'Hassan', 'Omar', 'Said', 'Abdi', 'Maina', 'Gichuki', 'Njoroge', 'Waweru', 'Karanja', 'Ndegwa', 'Kimani'];

export const customers: Customer[] = Array.from({ length: 500 }, (_, i) => {
  const fn = firstNames[i % firstNames.length];
  const ln = lastNames[i % lastNames.length];
  const county = kenyaCounties[i % kenyaCounties.length];
  const spent = Math.round(Math.random() * 500000 + 1000);
  return {
    id: `c${i + 1}`, name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@email.com`,
    phone: `+254 7${String(Math.floor(Math.random() * 99999999)).padStart(8, '0')}`,
    county, town: `${county} Town`,
    type: spent > 200000 ? 'vip' : spent > 50000 ? 'wholesale' : 'retail',
    totalSpent: spent, orderCount: Math.floor(Math.random() * 100) + 1,
    lastPurchase: new Date(Date.now() - Math.random() * 90 * 86400000).toISOString(),
    joinDate: new Date(Date.now() - Math.random() * 1000 * 86400000).toISOString(),
    status: Math.random() > 0.1 ? 'active' : 'inactive',
    loyalty: Math.floor(Math.random() * 100),
    notes: i % 5 === 0 ? 'Loyal customer, prefers M-Pesa payments.' : undefined,
  };
});

// ===== EMPLOYEES =====
const departments = ['Sales', 'Finance', 'Operations', 'IT', 'HR', 'Procurement', 'Marketing', 'Customer Service', 'Logistics', 'Administration'];
const positions = ['Manager', 'Senior Executive', 'Executive', 'Cashier', 'Supervisor', 'Coordinator', 'Analyst', 'Officer', 'Assistant', 'Intern'];

export const employees: Employee[] = Array.from({ length: 100 }, (_, i) => {
  const fn = firstNames[i % firstNames.length];
  const ln = lastNames[(i + 5) % lastNames.length];
  const dept = departments[i % departments.length];
  const pos = positions[i % positions.length];
  const salary = Math.round((Math.random() * 180000 + 20000) / 1000) * 1000;
  return {
    id: `e${i + 1}`, name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@nexora.co.ke`,
    phone: `+254 7${String(Math.floor(Math.random() * 99999999)).padStart(8, '0')}`,
    employeeId: `EMP${String(i + 1).padStart(4, '0')}`,
    position: `${dept} ${pos}`, department: dept,
    branch: branches[i % branches.length].name, salary,
    allowances: Math.round(salary * 0.15), deductions: Math.round(salary * 0.1),
    nationalId: String(Math.floor(Math.random() * 90000000) + 10000000),
    kra: `A0${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}P`,
    nhif: String(Math.floor(Math.random() * 9000000) + 1000000),
    nssf: String(Math.floor(Math.random() * 9000000) + 1000000),
    performance: Math.floor(Math.random() * 40) + 60,
    attendance: Math.floor(Math.random() * 20) + 80,
    leaveBalance: Math.floor(Math.random() * 21),
    status: i < 90 ? 'active' : i < 97 ? 'on_leave' : 'inactive',
    joinDate: new Date(Date.now() - Math.random() * 1500 * 86400000).toISOString(),
    role: pos === 'Manager' ? 'branch_manager' : pos === 'Cashier' ? 'cashier' : 'employee',
  };
});

// ===== SUPPLIERS =====
const supplierCompanies = ['Bidco Africa Ltd', 'Unilever Kenya Ltd', 'East African Breweries', 'Kenya Breweries Ltd', 'ARM Cement PLC', 'Bamburi Cement', 'Crown Paints Kenya', 'Sameer Africa', 'Davis & Shirtliff', 'Savannah Cement', 'Orbit Chemicals', 'Kapa Oil Refineries', 'Menengai Oil Refineries', 'Uchumi Supermarkets', 'Tuskys Supermarkets', 'Naivas Supermarkets', 'Carrefour Kenya', 'Jumia Kenya', 'Kilimall Kenya', 'Masoko Africa', 'Kyosk Digital Services', 'Twiga Foods', 'iProcure Africa', 'Sokowatch', 'Kopo Kopo', 'Lendable Finance', 'ENGIE Energy', 'M-KOPA Solar', 'SunCulture Kenya', 'Apollo Agriculture', 'Pula Advisors', 'HelloDr', 'Vezeeta', 'Africa Logistics', 'Siginon Freight', 'Bollore Logistics', 'DB Schenker Kenya', 'Kuehne + Nagel', 'DHL Kenya', 'FedEx Kenya', 'DPD Laser', 'G4S Kenya', 'Securex Agencies', 'KenCall EPZ', 'Samasource Kenya', 'Andela Kenya', 'Ushahidi', 'iHub Nairobi', 'Nairobi Garage', 'ALX Africa'];

export const suppliers: Supplier[] = Array.from({ length: 50 }, (_, i) => ({
  id: `s${i + 1}`, name: supplierCompanies[i % supplierCompanies.length],
  contact: `${firstNames[(i + 10) % firstNames.length]} ${lastNames[(i + 3) % lastNames.length]}`,
  email: `supply${i + 1}@${supplierCompanies[i % supplierCompanies.length].toLowerCase().replace(/\s+/g, '')}.com`,
  phone: `+254 20 ${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
  county: kenyaCounties[i % kenyaCounties.length],
  category: categories[i % categories.length],
  rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
  totalOrders: Math.floor(Math.random() * 200) + 10,
  totalValue: Math.round(Math.random() * 5000000 + 100000),
  lastOrder: new Date(Date.now() - Math.random() * 60 * 86400000).toISOString(),
  status: i < 45 ? 'active' : 'inactive',
  paymentTerms: ['Net 30', 'Net 60', 'Net 15', 'COD', '50% upfront'][i % 5],
  leadTime: ['3-5 days', '7-10 days', '14-21 days', '1-2 days', '5-7 days'][i % 5],
}));

// ===== TRANSACTIONS =====
const paymentMethods: Array<'cash' | 'mpesa' | 'card' | 'split'> = ['cash', 'mpesa', 'card', 'split'];

export const transactions: Transaction[] = Array.from({ length: 500 }, (_, i) => {
  const numItems = Math.floor(Math.random() * 5) + 1;
  const items = Array.from({ length: numItems }, (_, j) => {
    const prod = products[(i + j * 13) % products.length];
    const qty = Math.floor(Math.random() * 5) + 1;
    const disc = Math.random() > 0.8 ? Math.round(prod.price * 0.1 * 10) / 10 : 0;
    return { productId: prod.id, name: prod.name, price: prod.price, quantity: qty, discount: disc, total: (prod.price - disc) * qty };
  });
  const subtotal = items.reduce((s, it) => s + it.total, 0);
  const discount = Math.random() > 0.7 ? Math.round(subtotal * 0.05) : 0;
  const tax = Math.round((subtotal - discount) * 0.16 * 100) / 100;
  const total = Math.round((subtotal - discount + tax) * 100) / 100;
  const payMethod = paymentMethods[i % 4];
  const cust = customers[i % customers.length];
  const daysAgo = Math.floor(Math.random() * 90);
  return {
    id: `t${i + 1}`, customerId: cust.id, customerName: cust.name, items, subtotal, discount, tax, total,
    paymentMethod: payMethod,
    mpesaRef: payMethod === 'mpesa' ? `QH${String(Math.floor(Math.random() * 9000000000) + 1000000000)}` : undefined,
    cashier: employees[i % 30].name, branch: branches[i % branches.length].name,
    timestamp: new Date(Date.now() - daysAgo * 86400000 - Math.random() * 86400000).toISOString(),
    status: i < 480 ? 'completed' : i < 495 ? 'pending' : 'refunded',
    receiptNo: `RCP-${new Date().getFullYear()}-${String(i + 1001).padStart(6, '0')}`,
  };
});

// ===== LEADS (CRM) =====
const sources = ['Website', 'Referral', 'Cold Call', 'LinkedIn', 'Exhibition', 'Social Media', 'Email Campaign', 'Walk-in', 'Partner'];
const stages: Lead['stage'][] = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];

export const leads: Lead[] = Array.from({ length: 80 }, (_, i) => {
  const fn = firstNames[(i + 15) % firstNames.length];
  const ln = lastNames[(i + 8) % lastNames.length];
  return {
    id: `l${i + 1}`, name: `${fn} ${ln}`,
    company: i % 3 === 0 ? `${ln} Enterprises Ltd` : undefined,
    email: `${fn.toLowerCase()}@business.co.ke`,
    phone: `+254 7${String(Math.floor(Math.random() * 99999999)).padStart(8, '0')}`,
    source: sources[i % sources.length], stage: stages[i % stages.length],
    value: Math.round(Math.random() * 2000000 + 50000),
    probability: [10, 25, 40, 60, 75, 90, 5][i % 7],
    assignedTo: employees[i % 20].name,
    createdAt: new Date(Date.now() - Math.random() * 180 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
    nextFollowUp: i % 4 !== 0 ? new Date(Date.now() + Math.random() * 14 * 86400000).toISOString() : undefined,
    notes: i % 3 === 0 ? 'Very interested in bulk orders. Schedule demo.' : undefined,
  };
});

// ===== INVOICES =====
export const invoices: Invoice[] = Array.from({ length: 120 }, (_, i) => {
  const cust = customers[i % customers.length];
  const numItems = Math.floor(Math.random() * 4) + 1;
  const items = Array.from({ length: numItems }, (_, j) => {
    const prod = products[(i * 3 + j) % products.length];
    const qty = Math.floor(Math.random() * 10) + 1;
    return { productId: prod.id, name: prod.name, price: prod.price, quantity: qty, discount: 0, total: prod.price * qty };
  });
  const subtotal = items.reduce((s, it) => s + it.total, 0);
  const tax = Math.round(subtotal * 0.16 * 100) / 100;
  const statuses: Invoice['status'][] = ['draft', 'sent', 'paid', 'overdue', 'cancelled'];
  const daysAgo = Math.floor(Math.random() * 120);
  return {
    id: `inv${i + 1}`, number: `INV-${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`,
    customerId: cust.id, customerName: cust.name, items, subtotal, tax, total: subtotal + tax,
    issuedDate: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    dueDate: new Date(Date.now() - (daysAgo - 30) * 86400000).toISOString(),
    status: statuses[i % statuses.length],
    paidDate: i % 5 === 2 ? new Date(Date.now() - (daysAgo - 10) * 86400000).toISOString() : undefined,
  };
});

// ===== NOTIFICATIONS =====
export const notifications: Notification[] = [
  { id: 'n1', title: 'Low Stock Alert', message: '23 products are running below minimum stock levels. Reorder now to avoid stockouts.', type: 'warning', read: false, createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), action: { label: 'View Inventory', href: '/inventory' } },
  { id: 'n2', title: 'Payroll Due Tomorrow', message: 'June 2024 payroll run is scheduled for tomorrow. Review and approve before 9 AM.', type: 'info', read: false, createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), action: { label: 'Review Payroll', href: '/payroll' } },
  { id: 'n3', title: 'Sales Target Achieved!', message: 'Nairobi HQ has achieved 115% of its monthly sales target. Congratulations to the team!', type: 'success', read: false, createdAt: new Date(Date.now() - 8 * 3600000).toISOString() },
  { id: 'n4', title: 'Invoice Overdue', message: 'Invoice INV-2024-0089 for Kamau Enterprises (KSh 245,000) is 15 days overdue.', type: 'error', read: false, createdAt: new Date(Date.now() - 24 * 3600000).toISOString(), action: { label: 'View Invoice', href: '/accounting' } },
  { id: 'n5', title: 'New Customer Registration', message: '12 new customers registered in the last 24 hours across all branches.', type: 'success', read: true, createdAt: new Date(Date.now() - 26 * 3600000).toISOString() },
  { id: 'n6', title: 'System Maintenance', message: 'Scheduled maintenance window on Sunday 2 AM - 4 AM EAT. Brief downtime expected.', type: 'info', read: true, createdAt: new Date(Date.now() - 48 * 3600000).toISOString() },
  { id: 'n7', title: 'Leave Request Pending', message: '5 leave requests are awaiting your approval.', type: 'info', read: true, createdAt: new Date(Date.now() - 72 * 3600000).toISOString(), action: { label: 'Review Requests', href: '/hr' } },
];

// ===== AI INSIGHTS =====
export const aiInsights: AIInsight[] = [
  { id: 'ai1', type: 'opportunity', title: 'Revenue Growth Opportunity', description: 'Electronics category shows 34% higher margin potential. Increasing stock by 25% could yield KSh 180,000 additional monthly revenue.', impact: 'high', category: 'Revenue', createdAt: new Date().toISOString(), action: 'View Analysis' },
  { id: 'ai2', type: 'alert', title: 'Cash Flow Risk', description: 'Projected cash flow gap of KSh 450,000 in week 3 of next month based on current receivables and payables schedule.', impact: 'high', category: 'Finance', createdAt: new Date().toISOString(), action: 'See Cash Flow' },
  { id: 'ai3', type: 'forecast', title: 'Sales Forecast Update', description: 'Q3 revenue projected at KSh 15.2M (+12% YoY). Mombasa and Kisumu branches showing strongest growth indicators.', impact: 'medium', category: 'Sales', createdAt: new Date().toISOString(), action: 'View Forecast' },
  { id: 'ai4', type: 'recommendation', title: 'Staff Optimization', description: 'Thika branch is overstaffed on Tuesday-Wednesday. Rotating 2 staff to Nakuru during those days would save KSh 24,000/month.', impact: 'medium', category: 'Operations', createdAt: new Date().toISOString(), action: 'Schedule Shift' },
  { id: 'ai5', type: 'opportunity', title: 'Customer Re-engagement', description: '89 high-value customers haven\'t purchased in 60+ days. Targeted outreach could recover KSh 1.2M in revenue.', impact: 'high', category: 'CRM', createdAt: new Date().toISOString(), action: 'Launch Campaign' },
  { id: 'ai6', type: 'alert', title: 'Expiry Warning', description: '34 FMCG and pharmaceutical products will expire within 30 days. Consider promotional pricing to clear stock.', impact: 'medium', category: 'Inventory', createdAt: new Date().toISOString(), action: 'View Products' },
];

// ===== PAYROLL RUNS =====
export const payrollRuns: PayrollRun[] = [
  { id: 'pr1', period: 'June 2024', employees: 98, grossPay: 8450000, deductions: 1240000, netPay: 7210000, status: 'draft', processedBy: 'Jane Wanjiku', processedAt: new Date().toISOString() },
  { id: 'pr2', period: 'May 2024', employees: 97, grossPay: 8320000, deductions: 1220000, netPay: 7100000, status: 'paid', processedBy: 'Jane Wanjiku', processedAt: new Date(Date.now() - 35 * 86400000).toISOString() },
  { id: 'pr3', period: 'April 2024', employees: 95, grossPay: 8180000, deductions: 1200000, netPay: 6980000, status: 'paid', processedBy: 'Jane Wanjiku', processedAt: new Date(Date.now() - 65 * 86400000).toISOString() },
  { id: 'pr4', period: 'March 2024', employees: 94, grossPay: 8050000, deductions: 1180000, netPay: 6870000, status: 'paid', processedBy: 'James Mwangi', processedAt: new Date(Date.now() - 96 * 86400000).toISOString() },
  { id: 'pr5', period: 'February 2024', employees: 92, grossPay: 7890000, deductions: 1150000, netPay: 6740000, status: 'paid', processedBy: 'James Mwangi', processedAt: new Date(Date.now() - 125 * 86400000).toISOString() },
];

// ===== STOCK MOVEMENTS =====
export const stockMovements: StockMovement[] = Array.from({ length: 80 }, (_, i) => {
  const types: StockMovement['type'][] = ['in', 'out', 'transfer', 'adjustment'];
  const type = types[i % 4];
  const prod = products[i % products.length];
  return {
    id: `sm${i + 1}`, productId: prod.id, productName: prod.name, type,
    quantity: Math.floor(Math.random() * 100) + 1,
    fromBranch: type === 'transfer' ? branches[i % branches.length].name : undefined,
    toBranch: type === 'transfer' ? branches[(i + 2) % branches.length].name : undefined,
    reference: `REF-${String(i + 1000)}`,
    date: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
    performedBy: employees[i % 20].name,
    notes: i % 5 === 0 ? 'Regular restocking order fulfilled.' : undefined,
  };
});

// ===== LEAVE REQUESTS =====
export const leaveRequests: LeaveRequest[] = Array.from({ length: 30 }, (_, i) => {
  const types: LeaveRequest['type'][] = ['annual', 'sick', 'maternity', 'paternity', 'compassionate', 'unpaid'];
  const statuses: LeaveRequest['status'][] = ['pending', 'approved', 'rejected'];
  const emp = employees[i % employees.length];
  const days = Math.floor(Math.random() * 14) + 1;
  const start = new Date(Date.now() + (i - 15) * 86400000);
  return {
    id: `lr${i + 1}`, employeeId: emp.id, employeeName: emp.name,
    type: types[i % types.length], days,
    startDate: start.toISOString(),
    endDate: new Date(start.getTime() + days * 86400000).toISOString(),
    reason: ['Family emergency', 'Medical appointment', 'Annual leave', 'Rest and recuperation', 'Personal matters'][i % 5],
    status: statuses[i % 3],
    approvedBy: i % 3 !== 0 ? employees[90 + (i % 5)].name : undefined,
    requestedAt: new Date(Date.now() - Math.random() * 14 * 86400000).toISOString(),
  };
});

// ===== PURCHASE ORDERS =====
export const purchaseOrders: PurchaseOrder[] = Array.from({ length: 40 }, (_, i) => {
  const sup = suppliers[i % suppliers.length];
  const numItems = Math.floor(Math.random() * 5) + 1;
  const items = Array.from({ length: numItems }, (_, j) => {
    const prod = products[(i * 7 + j) % products.length];
    const qty = (Math.floor(Math.random() * 10) + 1) * 10;
    return { productId: prod.id, name: prod.name, quantity: qty, cost: prod.cost, total: prod.cost * qty };
  });
  const statuses: PurchaseOrder['status'][] = ['draft', 'sent', 'acknowledged', 'delivered', 'cancelled'];
  return {
    id: `po${i + 1}`,
    poNumber: `PO-${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`,
    supplierId: sup.id, supplierName: sup.name, items,
    total: items.reduce((s, it) => s + it.total, 0),
    status: statuses[i % statuses.length],
    expectedDelivery: new Date(Date.now() + (7 + i % 14) * 86400000).toISOString(),
    createdAt: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
    createdBy: employees[i % 20].name,
    branch: branches[i % branches.length].name,
  };
});

// ===== CHART DATA =====
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const revenueData = months.map((month, i) => ({
  label: month,
  revenue: Math.round((2800000 + i * 180000 + Math.random() * 400000) / 1000) * 1000,
  expenses: Math.round((1800000 + i * 80000 + Math.random() * 200000) / 1000) * 1000,
  profit: Math.round((1000000 + i * 100000 + Math.random() * 200000) / 1000) * 1000,
}));

export const dailySalesData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(Date.now() - (29 - i) * 86400000);
  return {
    label: date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }),
    sales: Math.round((150000 + Math.random() * 200000) / 1000) * 1000,
    orders: Math.floor(Math.random() * 80) + 20,
  };
});

export const categoryData = categories.slice(0, 8).map((cat, i) => ({
  label: cat, value: Math.round((Math.random() * 2000000 + 300000) / 1000) * 1000,
  color: ['#5470f1', '#a78bfa', '#22d3ee', '#34d399', '#fbbf24', '#fb7185', '#f97316', '#06b6d4'][i],
}));

export const branchRevenueData = branches.slice(0, 8).map(b => ({ label: b.name.replace(' Branch', '').replace(' HQ', ''), revenue: b.revenue, target: Math.round(b.revenue * 1.2 / 100000) * 100000 }));
