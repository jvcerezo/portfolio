import { useState, useMemo } from "react";
import {
  Smartphone,
  Radio,
  Zap,
  Cpu,
  Check,
  RotateCcw,
  ExternalLink,
  Calculator,
  ScanText,
  MessageSquareText,
  Shield,
  Layers,
} from "lucide-react";

export function LiveMobileShowcase() {
  const [activeMainTab, setActiveMainTab] = useState<"interactive" | "vm" | "schema">("interactive");
  const [interactiveModule, setInteractiveModule] = useState<"sync" | "tax" | "ocr" | "chat">("sync");

  // --- Module 1: Offline Sync State ---
  const [isOffline, setIsOffline] = useState(false);
  const [localRecords, setLocalRecords] = useState<
    Array<{ id: string; title: string; amount: number; synced: boolean; timestamp: string }>
  >([
    { id: "tx-01", title: "Grocery (SM Supermarket)", amount: 1450, synced: true, timestamp: "10:14 AM" },
    { id: "tx-02", title: "Meralco Electric Bill", amount: 3200, synced: true, timestamp: "11:30 AM" },
  ]);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "synced">("idle");
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");

  // --- Module 2: Philippine Tax & Gov't Contributions Calculator ---
  const [monthlyGross, setMonthlyGross] = useState<number>(45000);

  const taxCalculations = useMemo(() => {
    const sss = Math.min(Math.round(monthlyGross * 0.045), 1350);
    const philhealth = Math.min(Math.round((monthlyGross * 0.05) / 2), 2500);
    const pagibig = Math.min(Math.round(monthlyGross * 0.02), 200);
    const totalContributions = sss + philhealth + pagibig;
    const taxableIncome = Math.max(monthlyGross - totalContributions, 0);

    let withholdingTax = 0;
    if (taxableIncome > 666667) {
      withholdingTax = 167083.33 + (taxableIncome - 666667) * 0.35;
    } else if (taxableIncome > 166667) {
      withholdingTax = 33750 + (taxableIncome - 166667) * 0.30;
    } else if (taxableIncome > 66667) {
      withholdingTax = 8750 + (taxableIncome - 66667) * 0.25;
    } else if (taxableIncome > 33333) {
      withholdingTax = 2083.33 + (taxableIncome - 33333) * 0.20;
    } else if (taxableIncome > 20833) {
      withholdingTax = (taxableIncome - 20833) * 0.15;
    }

    const netPay = monthlyGross - totalContributions - withholdingTax;
    return { sss, philhealth, pagibig, withholdingTax: Math.round(withholdingTax), netPay: Math.round(netPay) };
  }, [monthlyGross]);

  // --- Module 3: OCR Receipt Scanner Demo ---
  const [selectedReceipt, setSelectedReceipt] = useState<number>(0);
  const receipts = [
    {
      store: "Jollibee Foods Corp - UPLB Branch",
      tin: "000-456-789-000",
      date: "2025-02-14 12:30 PM",
      items: [
        { name: "2pc Chickenjoy w/ Rice", price: 185 },
        { name: "Jolly Spaghetti", price: 65 },
        { name: "Peach Mango Pie", price: 48 },
      ],
      vatable: 266.07,
      vat: 31.93,
      total: 298.0,
    },
    {
      store: "Mercury Drug - Los Baños",
      tin: "123-987-654-001",
      date: "2025-02-15 03:45 PM",
      items: [
        { name: "Biogesic 500mg (10 tabs)", price: 85 },
        { name: "Ascorbic Acid 500mg", price: 120 },
      ],
      vatable: 183.04,
      vat: 21.96,
      total: 205.0,
    },
  ];

  // --- Module 4: Taglish AI Assistant Chat ---
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text: "Kamusta! Ako ang iyong Sandalan AI. Pwede mo akong tanungin tungkol sa SSS, PhilHealth, TIN, budgeting, o Philippine adulting guidelines.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleSendChat = (textToSend?: string) => {
    const query = (textToSend || chatInput).trim();
    if (!query) return;

    const userMsg = { sender: "user" as const, text: query };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput("");

    setTimeout(() => {
      let reply = "Para sa transaction o dokumentong ito, i-handa ang iyong valid Gov't ID at mag-fill out online sa kanilang official portal bago pumunta sa branch.";
      const lower = query.toLowerCase();
      if (lower.includes("tin")) {
        reply = "Para sa first-time jobseekers, libre ang TIN application via BIR Form 1904 kasama ang Barangay Certificate of First Time Jobseeker!";
      } else if (lower.includes("emergency") || lower.includes("ipon")) {
        reply = "Rule of thumb para sa emergency fund: 3 to 6 months ng iyong essential monthly expenses, nakatabi sa high-yield digital savings account (Maya, Seabank, or Gotyme).";
      } else if (lower.includes("sss") || lower.includes("loan")) {
        reply = "Pwede kang mag-apply ng SSS Salary Loan via My.SSS portal kung may minimum 36 posted monthly contributions ka na (at least 6 dito sa last 12 months).";
      }
      setChatMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 450);
  };

  // --- Cloud VM Appetize Key Configuration ---
  const [appetizeKey, setAppetizeKey] = useState<string>(() => {
    try {
      return localStorage.getItem("sandalan_appetize_key") || "";
    } catch {
      return "";
    }
  });
  const [customKeyInput, setCustomKeyInput] = useState("");
  const [vmStarted, setVmStarted] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  const handleSaveAppetizeKey = () => {
    const clean = customKeyInput.trim();
    setAppetizeKey(clean);
    try {
      localStorage.setItem("sandalan_appetize_key", clean);
    } catch {}
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  const handleToggleOffline = () => {
    const next = !isOffline;
    setIsOffline(next);
    if (!next) {
      setSyncStatus("syncing");
      setTimeout(() => {
        setLocalRecords((prev) => prev.map((r) => ({ ...r, synced: true })));
        setSyncStatus("synced");
      }, 1000);
    }
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount.trim()) return;

    const item = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      amount: parseFloat(newAmount) || 0,
      synced: !isOffline,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setLocalRecords((prev) => [item, ...prev]);
    setNewTitle("");
    setNewAmount("");

    if (!isOffline) {
      setSyncStatus("syncing");
      setTimeout(() => setSyncStatus("synced"), 500);
    }
  };

  return (
    <div className="reveal overflow-hidden rounded-xl border border-edge bg-fg/[0.02] shadow-sm">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-edge bg-fg/[0.02] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
          <Smartphone className="h-4 w-4 text-brand" aria-hidden="true" />
          <span className="font-semibold text-ink-1">Sandalan App Engine · Live Interactive Sandbox</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://play.google.com/store/apps/details?id=com.jvcerezo.exitplan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-4 transition-colors hover:text-brand"
          >
            <span>Google Play</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-edge bg-fg/[0.01] px-4 py-2 sm:px-6">
        <div className="flex items-center gap-1 rounded-lg border border-edge bg-bg p-0.5 font-mono text-[11px]">
          <button
            type="button"
            onClick={() => setActiveMainTab("interactive")}
            className={`flex items-center gap-1.5 rounded px-3 py-1 transition-all ${
              activeMainTab === "interactive"
                ? "bg-fg text-bg font-medium shadow-xs"
                : "text-ink-3 hover:text-ink-1"
            }`}
          >
            <Zap className="h-3 w-3 text-amber-500" />
            <span>Interactive App Engine</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab("vm")}
            className={`flex items-center gap-1.5 rounded px-3 py-1 transition-all ${
              activeMainTab === "vm"
                ? "bg-fg text-bg font-medium shadow-xs"
                : "text-ink-3 hover:text-ink-1"
            }`}
          >
            <Radio className="h-3 w-3 text-brand" />
            <span>Cloud Android VM (Appetize)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab("schema")}
            className={`flex items-center gap-1.5 rounded px-3 py-1 transition-all ${
              activeMainTab === "schema"
                ? "bg-fg text-bg font-medium shadow-xs"
                : "text-ink-3 hover:text-ink-1"
            }`}
          >
            <Cpu className="h-3 w-3 text-blue-500" />
            <span>Schema & Architecture</span>
          </button>
        </div>

        <span className="hidden font-mono text-[10.5px] text-ink-4 sm:inline-block">
          Package: com.jvcerezo.exitplan
        </span>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: Real-time Interactive App Engine Features                          */}
      {/* ========================================================================= */}
      {activeMainTab === "interactive" && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Sub-module selector pills */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-edge pb-4">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-4 mr-1">
              Feature Demo:
            </span>
            {[
              { id: "sync", label: "Offline Sync Engine", icon: RotateCcw },
              { id: "tax", label: "PH Tax & BIR Calculator", icon: Calculator },
              { id: "ocr", label: "OCR Receipt Parser", icon: ScanText },
              { id: "chat", label: "Taglish AI Guide", icon: MessageSquareText },
            ].map((mod) => {
              const Icon = mod.icon;
              const isSelected = interactiveModule === mod.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setInteractiveModule(mod.id as any)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[11.5px] transition-all ${
                    isSelected
                      ? "border border-brand/40 bg-brand/10 text-ink-1 font-semibold"
                      : "border border-edge bg-bg text-ink-3 hover:border-edge-strong hover:text-ink-1"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isSelected ? "text-brand" : "text-ink-4"}`} />
                  <span>{mod.label}</span>
                </button>
              );
            })}
          </div>

          {/* Module 1: Offline Sync Simulator */}
          {interactiveModule === "sync" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-edge bg-bg p-3.5">
                <div>
                  <h4 className="font-display text-[14.5px] font-semibold text-ink-1">
                    Drift SQLite $\leftrightarrow$ Supabase Bidirectional Replication
                  </h4>
                  <p className="text-[12px] text-ink-3">
                    Toggle airplane mode, log expenses while disconnected, and watch auto-reconciliation upon reconnect.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleOffline}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 font-mono text-[11.5px] font-bold transition-all shadow-xs shrink-0 ${
                    isOffline
                      ? "bg-amber-500/15 border border-amber-500 text-amber-500"
                      : "bg-emerald-500/15 border border-emerald-500 text-emerald-500"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isOffline ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                    }`}
                  />
                  <span>{isOffline ? "Status: OFFLINE" : "Status: ONLINE (4G)"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Left Form */}
                <form
                  onSubmit={handleAddTransaction}
                  className="md:col-span-5 rounded-lg border border-edge bg-bg p-4 space-y-3"
                >
                  <div className="font-mono text-[10.5px] uppercase tracking-wider text-ink-4">
                    Insert Local Expense Record
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-ink-4 uppercase mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SSS Voluntary Contribution"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full rounded-md border border-edge bg-fg/[0.02] px-3 py-1.5 text-[12.5px] text-ink-1 focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-ink-4 uppercase mb-1">
                      Amount (₱ PHP)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 1850"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="w-full rounded-md border border-edge bg-fg/[0.02] px-3 py-1.5 text-[12.5px] text-ink-1 focus:border-brand focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newTitle.trim() || !newAmount.trim()}
                    className="w-full rounded-md bg-fg py-2 font-mono text-[11.5px] font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    + Commit to Drift SQLite
                  </button>
                </form>

                {/* Right DB Table */}
                <div className="md:col-span-7 rounded-lg border border-edge bg-bg p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-edge pb-2 mb-2 font-mono text-[10.5px] text-ink-4">
                      <span>TABLE: `user_transactions` ({localRecords.length} items)</span>
                      <span>
                        {syncStatus === "syncing" ? (
                          <span className="text-amber-500 font-semibold animate-pulse">Syncing...</span>
                        ) : syncStatus === "synced" ? (
                          <span className="text-emerald-500 font-semibold">✓ Synced</span>
                        ) : (
                          "Idle"
                        )}
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1 font-mono text-[11.5px]">
                      {localRecords.map((r) => (
                        <div
                          key={r.id}
                          className="flex items-center justify-between rounded border border-edge bg-fg/[0.02] p-2"
                        >
                          <div>
                            <div className="text-ink-1 font-sans font-medium">{r.title}</div>
                            <div className="text-[10px] text-ink-4">{r.id} · {r.timestamp}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-ink-1">₱{r.amount.toLocaleString()}</div>
                            <div className="text-[10px]">
                              {r.synced ? (
                                <span className="text-emerald-500">Synced</span>
                              ) : (
                                <span className="text-amber-400">● Local Cache</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="mt-3 font-mono text-[10px] text-ink-4 bg-fg/[0.02] p-2 rounded border border-edge">
                    Algorithm: Monotonic timestamp sequence + Supabase PostgreSQL RLS upsert.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Module 2: PH Tax & Statutory Calculator */}
          {interactiveModule === "tax" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-5 rounded-lg border border-edge bg-bg p-4 space-y-4">
                <div className="font-mono text-[10.5px] uppercase tracking-wider text-ink-4">
                  Philippine Monthly Gross Salary
                </div>
                <div className="font-mono text-[24px] font-bold text-ink-1">
                  ₱{monthlyGross.toLocaleString()}
                </div>
                <input
                  type="range"
                  min={15000}
                  max={200000}
                  step={2500}
                  value={monthlyGross}
                  onChange={(e) => setMonthlyGross(Number(e.target.value))}
                  className="w-full h-1.5 bg-edge-strong rounded-lg appearance-none cursor-pointer accent-brand"
                />
                <div className="flex justify-between font-mono text-[10px] text-ink-4">
                  <span>₱15,000</span>
                  <span>₱100,000</span>
                  <span>₱200,000</span>
                </div>
                <p className="text-[11.5px] text-ink-3 leading-relaxed">
                  Computes SSS, PhilHealth (5%), Pag-IBIG, and Republic Act 10963 (TRAIN Law) withholding taxes client-side in Sandalan.
                </p>
              </div>

              <div className="md:col-span-7 rounded-lg border border-edge bg-bg p-4 font-mono text-[12px] space-y-2.5">
                <div className="flex items-center justify-between border-b border-edge pb-2 font-mono text-[10.5px] text-ink-4">
                  <span>DEDUCTION BREAKDOWN</span>
                  <span>ESTIMATED AMOUNT</span>
                </div>

                <div className="flex justify-between text-ink-3">
                  <span>SSS Monthly Contribution:</span>
                  <span className="text-ink-1">₱{taxCalculations.sss.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-ink-3">
                  <span>PhilHealth Premium (Employee Share):</span>
                  <span className="text-ink-1">₱{taxCalculations.philhealth.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-ink-3">
                  <span>Pag-IBIG / HDMF Fund:</span>
                  <span className="text-ink-1">₱{taxCalculations.pagibig.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-ink-3">
                  <span>BIR Withholding Tax:</span>
                  <span className="text-ink-1">₱{taxCalculations.withholdingTax.toLocaleString()}</span>
                </div>

                <div className="border-t border-edge pt-2 flex items-center justify-between font-bold text-[14px]">
                  <span className="text-brand">Estimated Net Take-Home Pay:</span>
                  <span className="text-ink-1">₱{taxCalculations.netPay.toLocaleString()} / mo</span>
                </div>
              </div>
            </div>
          )}

          {/* Module 3: OCR Receipt Parser */}
          {interactiveModule === "ocr" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-4">
                  Select Sample Official Receipt (OR):
                </span>
                <div className="flex gap-2">
                  {receipts.map((r, i) => (
                    <button
                      key={r.store}
                      type="button"
                      onClick={() => setSelectedReceipt(i)}
                      className={`px-2.5 py-1 rounded font-mono text-[11px] transition-all ${
                        selectedReceipt === i
                          ? "bg-fg text-bg font-semibold"
                          : "border border-edge text-ink-3 hover:text-ink-1"
                      }`}
                    >
                      Receipt #{i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Mock Receipt Ticket */}
                <div className="md:col-span-5 rounded-lg border border-edge bg-fg/[0.03] p-4 font-mono text-[11px] space-y-2 border-dashed">
                  <div className="text-center font-bold text-[12px]">{receipts[selectedReceipt].store}</div>
                  <div className="text-center text-ink-4 text-[10px]">TIN: {receipts[selectedReceipt].tin}</div>
                  <div className="text-center text-ink-4 text-[10px] border-b border-edge pb-2">
                    {receipts[selectedReceipt].date}
                  </div>

                  <div className="space-y-1 py-1">
                    {receipts[selectedReceipt].items.map((it) => (
                      <div key={it.name} className="flex justify-between">
                        <span>{it.name}</span>
                        <span>₱{it.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-edge pt-2 space-y-0.5 text-ink-3">
                    <div className="flex justify-between">
                      <span>Vatable Sales:</span>
                      <span>₱{receipts[selectedReceipt].vatable.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>12% VAT:</span>
                      <span>₱{receipts[selectedReceipt].vat.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-ink-1 text-[12px] pt-1">
                      <span>TOTAL:</span>
                      <span>₱{receipts[selectedReceipt].total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Parsed JSON Telemetry */}
                <div className="md:col-span-7 rounded-lg border border-edge bg-bg p-4 font-mono text-[11px] space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-500 font-semibold">
                    <Check className="h-3.5 w-3.5" />
                    <span>OCR Vision Extraction Complete (Confidence: 98.6%)</span>
                  </div>
                  <pre className="rounded bg-fg/[0.03] p-3 text-ink-2 overflow-x-auto text-[10.5px]">
{JSON.stringify(
  {
    vendor: receipts[selectedReceipt].store,
    tin: receipts[selectedReceipt].tin,
    total_amount: receipts[selectedReceipt].total,
    vat_breakdown: {
      vatable: receipts[selectedReceipt].vatable,
      vat_amount: receipts[selectedReceipt].vat,
    },
    line_items_count: receipts[selectedReceipt].items.length,
    auto_categorized: "Food & Sustenance",
    saved_to_sqlite: true,
  },
  null,
  2
)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Module 4: Taglish AI Guide */}
          {interactiveModule === "chat" && (
            <div className="space-y-3">
              {/* Quick Prompt Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-4">Ask:</span>
                {[
                  "Paano kumuha ng TIN ID?",
                  "Paano mag-calculate ng Emergency Fund?",
                  "Qualify ba ako sa SSS Salary Loan?",
                ].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSendChat(q)}
                    className="rounded-md border border-edge bg-bg px-2.5 py-1 font-mono text-[11px] text-ink-2 hover:border-brand hover:text-brand transition-colors"
                  >
                    "{q}"
                  </button>
                ))}
              </div>

              {/* Chat Log */}
              <div className="rounded-lg border border-edge bg-bg p-4 h-[220px] overflow-y-auto space-y-2.5 font-sans text-[12.5px]">
                {chatMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-2.5 ${
                        m.sender === "user"
                          ? "bg-fg text-bg font-medium"
                          : "bg-fg/[0.04] border border-edge text-ink-2"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Magtanong tungkol sa SSS, BIR, PhilSys, Pag-IBIG, o budget..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 rounded-md border border-edge bg-bg px-3 py-1.5 text-[12.5px] text-ink-1 focus:border-brand focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="rounded-md bg-fg px-4 py-1.5 font-mono text-[11.5px] font-semibold text-bg hover:opacity-90 disabled:opacity-40"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: Cloud Android VM (Appetize.io Runner)                              */}
      {/* ========================================================================= */}
      {activeMainTab === "vm" && (
        <div className="p-5 sm:p-6 space-y-5">
          <div className="rounded-lg border border-edge bg-bg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-display text-[14.5px] font-semibold text-ink-1">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span>Appetize.io Native Android Cloud Streaming</span>
              </div>
              <p className="text-[12px] text-ink-3 mt-0.5">
                Appetize streams raw compiled Android APK bytecode in a sandboxed ARM/x86 VM.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={customKeyInput}
                onChange={(e) => setCustomKeyInput(e.target.value)}
                placeholder={appetizeKey || "Enter Appetize App Key..."}
                className="flex-1 sm:w-48 rounded-md border border-edge bg-fg/[0.02] px-2.5 py-1 font-mono text-[11px] text-ink-1 focus:border-brand focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveAppetizeKey}
                className="rounded-md bg-fg px-3 py-1 font-mono text-[11px] font-semibold text-bg hover:opacity-90 shrink-0"
              >
                {keySaved ? "Saved!" : "Set Key"}
              </button>
            </div>
          </div>

          {/* Player Display */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-edge bg-black/40 p-8 min-h-[320px]">
            {!vmStarted ? (
              <div className="flex flex-col items-center text-center max-w-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand mb-3">
                  <Smartphone className="h-6 w-6" />
                </div>
                <h4 className="font-display text-[15px] font-bold text-ink-1">
                  Ready to stream Sandalan APK
                </h4>
                <p className="text-[12px] text-ink-3 mt-1 mb-4">
                  {appetizeKey
                    ? `Configured with App Key: ${appetizeKey}`
                    : "Tip: You can use the instant Interactive App Engine tab or enter an Appetize App Key above."}
                </p>

                <button
                  type="button"
                  onClick={() => setVmStarted(true)}
                  className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 font-mono text-[11.5px] font-bold text-black hover:scale-105 transition-transform"
                >
                  <span>Launch Cloud Emulator Session</span>
                </button>
              </div>
            ) : appetizeKey ? (
              <iframe
                src={`https://appetize.io/embed/${appetizeKey}?device=pixel7&osVersion=13.0&scale=75&autoplay=true&centered=true`}
                title="Sandalan Real Android APK VM"
                width="320"
                height="560"
                frameBorder="0"
                scrolling="no"
                className="rounded-2xl border border-white/20 shadow-2xl"
                allow="autoplay; encrypted-media; fullscreen"
              />
            ) : (
              <div className="text-center font-mono text-[12px] text-ink-3 space-y-2">
                <p>No Appetize App Key specified yet.</p>
                <p className="text-ink-4 text-[11px]">
                  Upload your `sandalan-release.apk` to appetize.io/upload and paste the public key above to stream live!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveMainTab("interactive")}
                  className="mt-2 inline-flex items-center gap-1 text-brand hover:underline font-semibold"
                >
                  ← Switch back to Instant Interactive Engine
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: Relational Schema & Storage Architecture                           */}
      {/* ========================================================================= */}
      {activeMainTab === "schema" && (
        <div className="p-5 sm:p-6 space-y-4 font-mono text-[11.5px]">
          <div className="flex items-center justify-between border-b border-edge pb-2">
            <div className="flex items-center gap-2 font-semibold text-ink-1">
              <Layers className="h-4 w-4 text-brand" />
              <span>13 Drift Relational Tables in APK Local SQLite</span>
            </div>
            <span className="text-[10.5px] text-ink-4">Supabase RLS Enabled</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                title: "1. `stages` & `checklist_items`",
                desc: "Offline adulting stages (Job hunting, SSS, PhilSys, Pag-IBIG, BIR)",
                meta: "Indexed by stage_id and status",
              },
              {
                title: "2. `bank_accounts` & `balances`",
                desc: "38+ PH bank & e-wallet integrations with local AES-256 encryption",
                meta: "Encrypted at rest",
              },
              {
                title: "3. `expenses` & `receipt_scans`",
                desc: "Categorized transactions with OCR raw text links and VAT logs",
                meta: "Foreign keys to accounts",
              },
              {
                title: "4. `replication_queue` & `tombstones`",
                desc: "Pending offline mutations with monotonic retry counters",
                meta: "Purged on 200 OK server ack",
              },
            ].map((s) => (
              <div key={s.title} className="rounded-lg border border-edge bg-bg p-3 space-y-1">
                <div className="font-bold text-ink-1">{s.title}</div>
                <div className="text-ink-3 text-[11px]">{s.desc}</div>
                <div className="text-ink-4 text-[10px]">{s.meta}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
