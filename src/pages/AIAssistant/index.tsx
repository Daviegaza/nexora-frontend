import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, BarChart2, FileText, TrendingUp, Users, Package, DollarSign, Mic, RefreshCw, Copy, ThumbsUp, ThumbsDown, Bot } from 'lucide-react';
import { Button, Badge } from '../../components/ui';
import { cn } from '../../utils';
import type { Message } from '../../types';

const suggestedPrompts = [
  { icon: <TrendingUp size={14} />, text: 'What are our top performing branches this month?', category: 'Analytics' },
  { icon: <Package size={14} />, text: 'Which products are at risk of stockout in the next 7 days?', category: 'Inventory' },
  { icon: <DollarSign size={14} />, text: 'Generate a cash flow forecast for the next 30 days', category: 'Finance' },
  { icon: <Users size={14} />, text: 'Show me customer retention rate by county', category: 'CRM' },
  { icon: <BarChart2 size={14} />, text: 'What are the key drivers of our revenue growth?', category: 'Revenue' },
  { icon: <FileText size={14} />, text: 'Create a summary report for the board meeting', category: 'Reports' },
  { icon: <TrendingUp size={14} />, text: 'Identify cost reduction opportunities across branches', category: 'Finance' },
  { icon: <Users size={14} />, text: 'Which sales agents are underperforming and why?', category: 'HR' },
];

const aiResponses: Record<string, string> = {
  default: `I've analyzed your business data and here's what I found:

**📊 Revenue Performance**
Your total revenue this month is **KSh 15.84M**, which is **12.4% above** last month's target. The Nairobi HQ branch is the top contributor at KSh 4.85M.

**🏪 Branch Insights**
- Mombasa branch is performing exceptionally, hitting 108% of its target
- Nakuru branch shows a 23% MoM growth trend — opportunity to increase inventory allocation
- Garissa branch needs attention: 15% below target, may need promotional support

**⚠️ Alerts Requiring Action**
1. 23 products are below minimum stock levels — immediate reorder recommended
2. Invoice INV-2024-0089 (KSh 245K) is 15 days overdue
3. June payroll awaiting final approval

**💡 Recommendation**
Consider launching a targeted M-Pesa promotion for your top 89 inactive VIP customers. Based on their purchase history, this could recover approximately **KSh 1.2M** in revenue.

What would you like me to dive deeper into?`,

  stock: `**📦 Stock Risk Analysis**

Based on current stock levels and sales velocity, here are products at **critical risk** in the next 7 days:

| Product | Current Stock | Daily Usage | Days Left |
|---------|--------------|-------------|-----------|
| Electronics Product 012 | 3 units | 1.5/day | **2 days** |
| FMCG Product 045 | 8 units | 2.1/day | **4 days** |
| Pharmaceuticals 089 | 5 units | 0.9/day | **5 days** |

**Recommended Actions:**
1. Place emergency PO with Bidco Africa for FMCG restocking (lead time: 3-5 days)
2. Transfer 20 units of Electronics 012 from Mombasa branch — they have excess stock
3. Contact ARM Pharma supplier for expedited Pharmaceuticals delivery

**Total reorder value estimate: KSh 340,000**

Shall I generate the purchase orders automatically?`,

  forecast: `**📈 30-Day Cash Flow Forecast**

\`\`\`
Week 1: +KSh 2.1M  (Strong retail sales expected)
Week 2: +KSh 1.8M  (Mid-month typical dip)
Week 3: -KSh 0.45M (⚠️ Gap risk: payables vs receivables)
Week 4: +KSh 2.4M  (Month-end surge)
\`\`\`

**Key Risk: Week 3 Cash Flow Gap**
Projected gap of **KSh 450,000** due to:
- Supplier payments due: KSh 1.2M
- Expected collections: KSh 0.75M

**Mitigation Options:**
1. Accelerate collection of 5 overdue invoices totaling KSh 640K
2. Negotiate 2-week payment extension with Unilever Kenya
3. Activate KSh 500K overdraft facility (0.5% monthly interest)

**Overall Health:** The business has a 94-day cash runway at current burn rate. Financial position is **strong**.`,
};

function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nexora-500 to-violet-500 flex items-center justify-center flex-shrink-0">
        <Bot size={16} className="text-white" />
      </div>
      <div className="bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 rounded-2xl rounded-tl-none px-4 py-3">
        <div className="flex items-center gap-1.5 h-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-surface-300 dark:bg-surface-600 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  function copy() {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Simple markdown renderer
  function renderContent(text: string) {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold text-surface-900 dark:text-surface-50 mb-1">{line.slice(2, -2)}</p>;
      }
      if (line.match(/^\*\*(.*?)\*\*/)) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="mb-1">
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="font-semibold text-surface-900 dark:text-surface-50">{part}</strong> : part)}
          </p>
        );
      }
      if (line.startsWith('```')) return null;
      if (line.match(/^\d\./)) {
        return <p key={i} className="mb-0.5 pl-2">{line}</p>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <p key={i} className="mb-0.5 pl-2">• {line.slice(2)}</p>;
      }
      if (line.startsWith('#')) {
        return <p key={i} className="font-bold text-surface-900 dark:text-surface-50 mt-2 mb-1">{line.replace(/^#+\s/, '')}</p>;
      }
      if (line.trim() === '') return <div key={i} className="h-2" />;
      return <p key={i} className="mb-1 leading-relaxed">{line}</p>;
    });
  }

  return (
    <div className={cn('flex gap-3 group', isUser && 'flex-row-reverse')}>
      {isUser ? (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nexora-500 to-violet-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
          JM
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nexora-500 to-violet-500 flex items-center justify-center flex-shrink-0">
          <Bot size={16} className="text-white" />
        </div>
      )}
      <div className={cn('max-w-[80%]', isUser && 'items-end flex flex-col')}>
        <div
          className={cn(
            'px-4 py-3 text-sm leading-relaxed',
            isUser
              ? 'bg-nexora-600 text-white rounded-2xl rounded-tr-none'
              : 'bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 text-surface-700 dark:text-surface-300 rounded-2xl rounded-tl-none'
          )}
        >
          {isUser ? message.content : (
            <div className="space-y-0.5 text-xs">{renderContent(message.content)}</div>
          )}
        </div>
        {!isUser && (
          <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={copy} className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 text-[10px] transition-colors">
              <Copy size={10} /> {copied ? 'Copied!' : 'Copy'}
            </button>
            <button onClick={() => setLiked(true)} className={cn('p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors', liked === true && 'text-emerald-500')}><ThumbsUp size={10} className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300" /></button>
            <button onClick={() => setLiked(false)} className={cn('p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors', liked === false && 'text-rose-500')}><ThumbsDown size={10} className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300" /></button>
          </div>
        )}
        <p className="text-[10px] text-surface-400 mt-1 px-1">{new Date(message.timestamp).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    </div>
  );
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello, James! 👋 I'm **NEXORA AI**, your intelligent business advisor.\n\nI have full context of your business — 12 branches, 98 employees, 300+ products, and 5000+ transactions. I can help you:\n\n- 📊 Analyze performance across all branches\n- 💰 Generate financial forecasts and reports\n- 📦 Optimize inventory and predict stockouts\n- 👥 Monitor team performance and HR metrics\n- 🎯 Identify growth opportunities and risks\n\nWhat would you like to explore today?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  async function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: `u${Date.now()}`, role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const lower = text.toLowerCase();
    let response = aiResponses.default;
    if (lower.includes('stock') || lower.includes('inventory') || lower.includes('product')) response = aiResponses.stock;
    if (lower.includes('cash') || lower.includes('forecast') || lower.includes('financial') || lower.includes('flow')) response = aiResponses.forecast;

    const aiMsg: Message = { id: `a${Date.now()}`, role: 'assistant', content: response, timestamp: new Date().toISOString() };
    setTyping(false);
    setMessages((m) => [...m, aiMsg]);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  }

  const capabilities = [
    { icon: <BarChart2 size={16} />, label: 'Business Analysis', color: 'text-nexora-500' },
    { icon: <FileText size={16} />, label: 'Report Generation', color: 'text-emerald-500' },
    { icon: <TrendingUp size={16} />, label: 'AI Forecasting', color: 'text-amber-500' },
    { icon: <Zap size={16} />, label: 'Smart Insights', color: 'text-violet-500' },
  ];

  return (
    <div className="flex h-[calc(100vh-60px)] overflow-hidden">
      {/* Sidebar - suggestions & capabilities */}
      <div className="w-[260px] xl:w-[300px] flex-shrink-0 border-r border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 flex flex-col overflow-hidden">
        {/* AI header */}
        <div className="px-4 py-5 border-b border-surface-100 dark:border-surface-800">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nexora-500 to-violet-500 flex items-center justify-center shadow-glow-nexora">
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-surface-900 dark:text-surface-50">NEXORA AI</h2>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online · GPT-4 Powered
              </div>
            </div>
          </div>
        </div>

        {/* Capabilities */}
        <div className="px-4 py-3 border-b border-surface-100 dark:border-surface-800">
          <p className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider mb-2.5">Capabilities</p>
          <div className="grid grid-cols-2 gap-1.5">
            {capabilities.map((c) => (
              <div key={c.label} className="flex items-center gap-2 px-2.5 py-2 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <span className={c.color}>{c.icon}</span>
                <span className="text-[10px] font-medium text-surface-600 dark:text-surface-400 leading-tight">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested prompts */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <p className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider mb-2.5">Suggested Questions</p>
          <div className="space-y-1.5">
            {suggestedPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => sendMessage(p.text)}
                className="w-full text-left px-3 py-2.5 bg-surface-50 dark:bg-surface-800 hover:bg-nexora-50 dark:hover:bg-nexora-500/10 rounded-xl transition-colors group"
              >
                <div className="flex items-start gap-2">
                  <span className="text-surface-400 group-hover:text-nexora-500 transition-colors flex-shrink-0 mt-0.5">{p.icon}</span>
                  <div>
                    <p className="text-xs text-surface-700 dark:text-surface-300 group-hover:text-nexora-700 dark:group-hover:text-nexora-300 leading-snug">{p.text}</p>
                    <Badge size="sm" variant="default" className="mt-1">{p.category}</Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Context info */}
        <div className="px-4 py-3 border-t border-surface-100 dark:border-surface-800">
          <p className="text-[10px] text-surface-400 mb-2">Business Context Active</p>
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            {[['Branches', '12'], ['Employees', '98'], ['Products', '300'], ['Transactions', '5K+']].map(([k, v]) => (
              <div key={k} className="flex justify-between px-2 py-1 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <span className="text-surface-400">{k}</span>
                <span className="font-semibold text-surface-700 dark:text-surface-300">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface-50 dark:bg-surface-950">
        {/* Chat header */}
        <div className="px-5 py-3 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nexora-500 to-violet-500 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">NEXORA AI Assistant</p>
              <p className="text-[10px] text-surface-400">{messages.length - 1} messages in this session</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="xs" icon={<RefreshCw size={12} />} onClick={() => setMessages([messages[0]])}>Clear</Button>
            <Button variant="ghost" size="xs" icon={<FileText size={12} />}>Export</Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
          {typing && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="px-5 py-4 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800">
          {/* Quick actions */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {['📊 Revenue Analysis', '📦 Stock Report', '💰 Cash Flow', '👥 Team Performance'].map((action) => (
              <button
                key={action}
                onClick={() => sendMessage(action.split(' ').slice(1).join(' '))}
                className="px-2.5 py-1.5 bg-surface-100 dark:bg-surface-800 hover:bg-nexora-50 dark:hover:bg-nexora-500/10 hover:text-nexora-700 dark:hover:text-nexora-300 rounded-lg text-xs text-surface-600 dark:text-surface-400 transition-colors font-medium"
              >
                {action}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask me anything about your business..."
                className="w-full h-11 pl-4 pr-12 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 outline-none focus:border-nexora-400 dark:focus:border-nexora-500 focus:ring-2 focus:ring-nexora-500/20 transition-all resize-none"
              />
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={cn('absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-lg transition-colors', isRecording ? 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' : 'text-surface-400 hover:text-surface-600')}
              >
                <Mic size={14} />
              </button>
            </div>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || typing}
              className="w-11 h-11 bg-nexora-600 hover:bg-nexora-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all active:scale-95 flex-shrink-0 shadow-glow-nexora"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[10px] text-surface-400 text-center mt-2">NEXORA AI can make mistakes. Verify important business decisions.</p>
        </div>
      </div>
    </div>
  );
}
