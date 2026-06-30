import React, { useState, useRef, useCallback } from 'react';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  UserPlus,
  Tag,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronRight,
  X,
  Check,
  Printer,
  ScanLine,
} from 'lucide-react';
import { Button, Input, Avatar, StatusBadge, Divider } from '../../components/ui';
import { formatCurrency, cn } from '../../utils';
import { demoToast } from '../../utils/demoActions';
import { products, customers } from '../../mock/data';
import type { CartItem, Product, Customer } from '../../types';
import { useBarcodeScanner, playScanBeep } from '../../hooks/useBarcodeScanner';
import { BarcodeScannerModal } from '../../components/scanner/BarcodeScannerModal';

const categories = [
  'All',
  'Electronics',
  'FMCG',
  'Clothing',
  'Hardware',
  'Pharmaceuticals',
  'Food & Beverage',
  'Stationery',
];

function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  const isAvailable = product.status !== 'out_of_stock';
  return (
    <button
      onClick={() => isAvailable && onAdd(product)}
      disabled={!isAvailable}
      className={cn(
        'bg-white dark:bg-surface-900 border rounded-xl p-3 text-left transition-all duration-150 group',
        isAvailable
          ? 'border-surface-200 dark:border-surface-800 hover:border-nexora-400 dark:hover:border-nexora-500 hover:shadow-glow-nexora cursor-pointer'
          : 'border-surface-100 dark:border-surface-800 opacity-50 cursor-not-allowed',
      )}
    >
      <div className="w-full aspect-square bg-surface-50 dark:bg-surface-800 rounded-lg mb-2.5 flex items-center justify-center text-3xl mb-3">
        {product.category === 'Electronics'
          ? '📱'
          : product.category === 'FMCG'
            ? '🛒'
            : product.category === 'Clothing'
              ? '👕'
              : product.category === 'Food & Beverage'
                ? '🥤'
                : product.category === 'Pharmaceuticals'
                  ? '💊'
                  : '📦'}
      </div>
      <p className="text-xs font-semibold text-surface-800 dark:text-surface-200 line-clamp-2 leading-tight mb-1">
        {product.name}
      </p>
      <p className="text-[10px] text-surface-400 mb-2">{product.sku}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-surface-900 dark:text-surface-50">
          {formatCurrency(product.price, true)}
        </span>
        <span
          className={cn(
            'text-[10px] font-medium',
            product.stock < product.minStock ? 'text-amber-500' : 'text-surface-400',
          )}
        >
          {product.stock} {product.unit}
        </span>
      </div>
      {isAvailable && (
        <div className="mt-2 w-full h-7 bg-nexora-50 dark:bg-nexora-500/10 rounded-lg flex items-center justify-center text-nexora-600 dark:text-nexora-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          <Plus size={12} className="mr-1" /> Add to cart
        </div>
      )}
    </button>
  );
}

function CartItemRow({
  item,
  onQty,
  onRemove,
}: {
  item: CartItem;
  onQty: (id: string, d: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex gap-3 py-3 group">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-surface-800 dark:text-surface-200 truncate">
          {item.name}
        </p>
        <p className="text-xs text-surface-400 mt-0.5">{formatCurrency(item.price)} each</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1 bg-surface-100 dark:bg-surface-800 rounded-lg">
          <button
            onClick={() => onQty(item.productId, -1)}
            className="w-6 h-6 flex items-center justify-center text-surface-500 hover:text-surface-800 dark:hover:text-surface-200 rounded-l-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          >
            <Minus size={10} />
          </button>
          <span className="w-7 text-center text-xs font-semibold text-surface-800 dark:text-surface-200">
            {item.quantity}
          </span>
          <button
            onClick={() => onQty(item.productId, 1)}
            className="w-6 h-6 flex items-center justify-center text-surface-500 hover:text-surface-800 dark:hover:text-surface-200 rounded-r-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          >
            <Plus size={10} />
          </button>
        </div>
        <span className="w-16 text-right text-xs font-bold text-surface-900 dark:text-surface-100">
          {formatCurrency(item.total, true)}
        </span>
        <button
          onClick={() => onRemove(item.productId)}
          className="w-6 h-6 flex items-center justify-center text-surface-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

type PaymentMethod = 'cash' | 'mpesa' | 'card';

function CheckoutModal({
  cart,
  total,
  customer,
  onClose,
  onComplete,
}: {
  cart: CartItem[];
  total: number;
  customer: Customer | null;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>('mpesa');
  const [cashGiven, setCashGiven] = useState('');
  const [mpesaRef, setMpesaRef] = useState('');
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const change = method === 'cash' ? Math.max(0, parseFloat(cashGiven || '0') - total) : 0;
  const receiptNo = `RCP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;

  async function handlePay() {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setProcessing(false);
    setDone(true);
    await new Promise((r) => setTimeout(r, 800));
    onComplete();
  }

  const methods: { id: PaymentMethod; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'mpesa', label: 'M-Pesa', icon: <Smartphone size={18} />, color: 'text-emerald-600' },
    { id: 'cash', label: 'Cash', icon: <Banknote size={18} />, color: 'text-amber-600' },
    { id: 'card', label: 'Card', icon: <CreditCard size={18} />, color: 'text-nexora-600' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-surface-900 rounded-2xl shadow-modal w-full max-w-md overflow-hidden animate-scale-in">
        {done ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-1">
              Payment Successful!
            </h3>
            <p className="text-sm text-surface-400 mb-1">
              Receipt:{' '}
              <span className="font-mono font-medium text-surface-600 dark:text-surface-400">
                {receiptNo}
              </span>
            </p>
            <p className="text-2xl font-bold text-emerald-500 mt-3">{formatCurrency(total)}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100 dark:border-surface-800">
              <h3 className="font-semibold text-surface-900 dark:text-surface-100">Checkout</h3>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Summary */}
              <div className="bg-surface-50 dark:bg-surface-800 rounded-xl p-4">
                <div className="flex justify-between text-xs text-surface-500 mb-3">
                  <span>{cart.reduce((s, i) => s + i.quantity, 0)} items</span>
                  {customer && (
                    <span className="text-nexora-600 dark:text-nexora-400">👤 {customer.name}</span>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs text-surface-400 mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-surface-900 dark:text-surface-50">
                    {formatCurrency(total)}
                  </p>
                </div>
              </div>

              {/* Payment method */}
              <div>
                <p className="text-xs font-medium text-surface-500 mb-2">Payment Method</p>
                <div className="grid grid-cols-3 gap-2">
                  {methods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all',
                        method === m.id
                          ? 'border-nexora-500 bg-nexora-50 dark:bg-nexora-500/10 text-nexora-700 dark:text-nexora-300'
                          : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-surface-300 dark:hover:border-surface-600',
                      )}
                    >
                      <span
                        className={
                          method === m.id ? 'text-nexora-600 dark:text-nexora-400' : m.color
                        }
                      >
                        {m.icon}
                      </span>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Method-specific inputs */}
              {method === 'mpesa' && (
                <Input
                  label="M-Pesa Reference (optional)"
                  placeholder="e.g. QH5G7KXXX"
                  value={mpesaRef}
                  onChange={(e) => setMpesaRef(e.target.value)}
                  icon={<Smartphone size={14} />}
                />
              )}
              {method === 'cash' && (
                <div className="space-y-2">
                  <Input
                    label="Cash Received"
                    placeholder="0.00"
                    type="number"
                    value={cashGiven}
                    onChange={(e) => setCashGiven(e.target.value)}
                    icon={<span className="text-xs font-semibold">KSh</span>}
                  />
                  {parseFloat(cashGiven || '0') >= total && (
                    <div className="flex justify-between items-center px-3 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        Change
                      </span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(change)}
                      </span>
                    </div>
                  )}
                </div>
              )}
              {method === 'card' && (
                <div className="p-4 bg-nexora-50 dark:bg-nexora-500/10 rounded-xl text-center">
                  <CreditCard size={24} className="text-nexora-500 mx-auto mb-2" />
                  <p className="text-xs text-nexora-700 dark:text-nexora-300 font-medium">
                    Insert or tap customer's card
                  </p>
                </div>
              )}

              <Button
                onClick={handlePay}
                variant="success"
                size="lg"
                loading={processing}
                className="w-full"
                icon={<Check size={16} />}
              >
                {processing ? 'Processing...' : `Pay ${formatCurrency(total)}`}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function POS() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [discount, setDiscount] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<string | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [lastScan, setLastScan] = useState<{ code: string; at: number } | null>(null);
  const barcodeRef = useRef<HTMLButtonElement>(null);

  const filtered = products
    .filter((p) => activeCategory === 'All' || p.category === activeCategory)
    .filter(
      (p) =>
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()),
    )
    .slice(0, 40);

  const filteredCustomers = customers
    .filter(
      (c) =>
        c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.phone.includes(customerSearch),
    )
    .slice(0, 6);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price }
            : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          discount: 0,
          total: product.price,
        },
      ];
    });
  }, []);

  // Look up by barcode or SKU. Fires on USB-scanner keystroke, manual entry, or camera detect.
  const addByCode = useCallback(
    (rawCode: string) => {
      const code = rawCode.trim();
      if (!code) return;
      const product = products.find(
        (p) => p.barcode === code || p.sku.toLowerCase() === code.toLowerCase(),
      );
      if (product) {
        addToCart(product);
        playScanBeep(true);
        setLastScan({ code, at: Date.now() });
        demoToast('Scanned', `${product.name} added to cart`, 'success');
      } else {
        playScanBeep(false);
        demoToast('Not Found', `No product matches barcode "${code}"`, 'warning');
      }
    },
    [addToCart],
  );

  // Listen for USB/Bluetooth keyboard-wedge scanners whenever scanner modal is closed
  useBarcodeScanner({
    enabled: !scannerOpen && !showCheckout,
    onScan: addByCode,
    minLength: 4,
  });

  function updateQty(id: string, delta: number) {
    setCart((prev) =>
      prev.map((i) => {
        if (i.productId !== id) return i;
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty, total: newQty * i.price };
      }),
    );
  }

  function removeItem(id: string) {
    setCart((prev) => prev.filter((i) => i.productId !== id));
  }

  const subtotal = cart.reduce((s, i) => s + i.total, 0);
  const discountAmt = subtotal * (discount / 100);
  const taxAmt = (subtotal - discountAmt) * 0.16;
  const total = subtotal - discountAmt + taxAmt;

  function handleComplete() {
    const yr = new Date().getFullYear();
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID().split('-')[0].toUpperCase()
        : Math.random().toString(36).slice(2, 8).toUpperCase();
    const rn = `RCP-${yr}-${id}`;
    setLastReceipt(rn);
    setCart([]);
    setShowCheckout(false);
    setSelectedCustomer(null);
    setDiscount(0);
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-60px)] md:h-[calc(100vh-60px)] overflow-hidden">
      {/* Mobile cart drawer trigger */}
      {cart.length > 0 && (
        <button
          onClick={() =>
            document.getElementById('pos-cart-panel')?.scrollIntoView({ behavior: 'smooth' })
          }
          className="md:hidden fixed bottom-[72px] right-4 z-30 h-12 px-4 bg-nexora-600 text-white rounded-full shadow-lg flex items-center gap-2 text-xs font-semibold"
        >
          <ShoppingCart size={14} /> Cart ({cart.length}) · {formatCurrency(total, true)}
        </button>
      )}
      {/* Product Panel */}
      <div className="flex-1 flex flex-col min-w-0 md:border-r border-surface-200 dark:border-surface-800 overflow-hidden">
        {/* Top bar */}
        <div className="px-4 py-3 border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 space-y-3">
          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && search.trim()) {
                  addByCode(search.trim());
                  setSearch('');
                }
              }}
              placeholder="Search products or scan barcode..."
              icon={<Search size={14} />}
              className="flex-1"
            />
            <button
              ref={barcodeRef}
              onClick={() => setScannerOpen(true)}
              aria-label="Open camera barcode scanner"
              className="h-9 px-3 bg-nexora-50 dark:bg-nexora-500/10 text-nexora-700 dark:text-nexora-300 rounded-lg text-xs font-semibold border border-nexora-200 dark:border-nexora-500/30 hover:bg-nexora-100 dark:hover:bg-nexora-500/20 transition-colors flex items-center gap-1.5"
            >
              <ScanLine size={14} /> Scan
            </button>
          </div>
          {/* Categories */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-3 h-7 text-xs font-medium rounded-lg whitespace-nowrap transition-all flex-shrink-0',
                  activeCategory === cat
                    ? 'bg-nexora-600 text-white'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700',
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </div>
        </div>

        {/* Last receipt */}
        {lastReceipt && (
          <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 border-t border-emerald-100 dark:border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400">
              <Check size={14} />
              Sale completed · {lastReceipt}
            </div>
            <button
              onClick={() => demoToast('Print', 'Receipt sent to printer', 'success')}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1"
            >
              <Printer size={12} /> Print
            </button>
          </div>
        )}
      </div>

      {/* Cart Panel */}
      <div
        id="pos-cart-panel"
        className="w-full md:w-[340px] xl:w-[380px] flex flex-col bg-white dark:bg-surface-900 flex-shrink-0 border-t md:border-t-0 border-surface-200 dark:border-surface-800"
      >
        {/* Cart header */}
        <div className="px-4 py-3 border-b border-surface-200 dark:border-surface-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <ShoppingCart size={16} />
              Cart
              {cart.length > 0 && (
                <span className="w-5 h-5 bg-nexora-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </h2>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1"
              >
                <Trash2 size={12} /> Clear
              </button>
            )}
          </div>

          {/* Customer selector */}
          <div className="relative">
            <button
              onClick={() => setShowCustomerList(!showCustomerList)}
              className={cn(
                'w-full flex items-center gap-2 px-3 h-9 rounded-lg border text-xs transition-all',
                selectedCustomer
                  ? 'border-nexora-300 dark:border-nexora-500/50 bg-nexora-50 dark:bg-nexora-500/10 text-nexora-700 dark:text-nexora-400'
                  : 'border-surface-200 dark:border-surface-700 text-surface-400 hover:border-surface-300 dark:hover:border-surface-600',
              )}
            >
              {selectedCustomer ? (
                <>
                  <Avatar name={selectedCustomer.name} size="xs" />
                  <span className="flex-1 text-left font-medium truncate">
                    {selectedCustomer.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCustomer(null);
                    }}
                    className="text-surface-400 hover:text-rose-500"
                  >
                    <X size={12} />
                  </button>
                </>
              ) : (
                <>
                  <UserPlus size={14} />
                  <span>Select Customer (optional)</span>
                </>
              )}
            </button>
            {showCustomerList && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-dropdown overflow-hidden z-10">
                <div className="p-2">
                  <Input
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Search customers..."
                    icon={<Search size={12} />}
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredCustomers.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCustomer(c);
                        setShowCustomerList(false);
                        setCustomerSearch('');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                    >
                      <Avatar name={c.name} size="xs" />
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-xs font-medium text-surface-800 dark:text-surface-200 truncate">
                          {c.name}
                        </p>
                        <p className="text-[10px] text-surface-400">{c.phone}</p>
                      </div>
                      <StatusBadge status={c.type} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-4 divide-y divide-surface-50 dark:divide-surface-800">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-14 h-14 bg-surface-50 dark:bg-surface-800 rounded-2xl flex items-center justify-center text-3xl mb-3">
                🛒
              </div>
              <p className="text-sm font-medium text-surface-400">Cart is empty</p>
              <p className="text-xs text-surface-300 dark:text-surface-600 mt-1">
                Add products from the left panel
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <CartItemRow
                key={item.productId}
                item={item}
                onQty={updateQty}
                onRemove={removeItem}
              />
            ))
          )}
        </div>

        {/* Summary & checkout */}
        {cart.length > 0 && (
          <div className="px-4 py-4 border-t border-surface-200 dark:border-surface-800 space-y-3">
            {/* Discount */}
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-surface-400" />
              <span className="text-xs text-surface-500">Discount</span>
              <div className="flex gap-1 ml-auto">
                {[0, 5, 10, 15, 20].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDiscount(d)}
                    className={cn(
                      'w-8 h-6 text-[10px] font-medium rounded transition-all',
                      discount === d
                        ? 'bg-nexora-600 text-white'
                        : 'bg-surface-100 dark:bg-surface-800 text-surface-500 hover:bg-surface-200 dark:hover:bg-surface-700',
                    )}
                  >
                    {d}%
                  </button>
                ))}
              </div>
            </div>

            <Divider />

            {/* Totals */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-surface-500">
                <span>Subtotal</span>
                <span className="font-medium text-surface-800 dark:text-surface-200">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount ({discount}%)</span>
                  <span>-{formatCurrency(discountAmt)}</span>
                </div>
              )}
              <div className="flex justify-between text-surface-500">
                <span>VAT (16%)</span>
                <span className="font-medium text-surface-800 dark:text-surface-200">
                  {formatCurrency(taxAmt)}
                </span>
              </div>
              <Divider />
              <div className="flex justify-between text-base font-bold text-surface-900 dark:text-surface-50 pt-1">
                <span>Total</span>
                <span className="text-nexora-700 dark:text-nexora-400">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Checkout button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              icon={<CreditCard size={16} />}
              iconRight={<ChevronRight size={14} />}
              onClick={() => setShowCheckout(true)}
            >
              Checkout · {formatCurrency(total, true)}
            </Button>
          </div>
        )}
      </div>

      {showCheckout && (
        <CheckoutModal
          cart={cart}
          total={total}
          customer={selectedCustomer}
          onClose={() => setShowCheckout(false)}
          onComplete={handleComplete}
        />
      )}

      <BarcodeScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onDetected={(code) => {
          setScannerOpen(false);
          addByCode(code);
        }}
      />

      {/* Live scan toast strip (last scan, briefly) */}
      {lastScan && Date.now() - lastScan.at < 3000 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full bg-emerald-500 text-white text-xs font-semibold shadow-lg flex items-center gap-2 animate-fade-in pointer-events-none">
          <ScanLine size={12} /> {lastScan.code}
        </div>
      )}
    </div>
  );
}
