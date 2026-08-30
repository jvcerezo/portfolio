import { useState, useMemo, useEffect } from "react";
import {
  Smartphone,
  ExternalLink,
  Wifi,
  WifiOff,
  Battery,
  Home,
  BookOpen,
  Receipt,
  MessageSquare,
  Camera,
  CheckCircle2,
  Circle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Send,
  Layers,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export function LiveMobileShowcase() {
  // Mobile app state inside phone
  const [activeTab, setActiveTab] = useState<"home" | "guides" | "budget" | "ai" | "ocr">("home");
  const [isOffline, setIsOffline] = useState(false);
  const [currentTime, setCurrentTime] = useState("10:42");

  // Sync state
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "offline">("synced");
  const [localExpenses, setLocalExpenses] = useState<
    Array<{ id: string; title: string; category: string; amount: number; synced: boolean }>
  >([
    { id: "tx-101", title: "SM Supermarket", category: "Groceries", amount: 1450, synced: true },
    { id: "tx-102", title: "Meralco Electric Bill", category: "Utilities", amount: 3200, synced: true },
    { id: "tx-103", title: "Mercury Drug", category: "Health", amount: 480, synced: true },
  ]);

  // Guides checklist state
  const [guideChecklist, setGuideChecklist] = useState<Record<string, boolean>>({
    "tin-form": true,
    "tin-id": true,
    "sss-number": true,
    "sss-online": false,
    "philsys-step1": true,
    "philsys-biometrics": false,
    "pagibig-mid": false,
  });

  // Salary Tax Calculator inside mobile app
  const [monthlyGross, setMonthlyGross] = useState<number>(45000);
  const taxCalculations = useMemo(() => {
    const sss = Math.min(Math.round(monthlyGross * 0.045), 1350);
    const philhealth = Math.min(Math.round((monthlyGross * 0.05) / 2), 2500);
    const pagibig = Math.min(Math.round(monthlyGross * 0.02), 200);
    const totalDeductions = sss + philhealth + pagibig;
    const taxable = Math.max(monthlyGross - totalDeductions, 0);

    let withholdingTax = 0;
    if (taxable > 666667) withholdingTax = 167083.33 + (taxable - 666667) * 0.35;
    else if (taxable > 166667) withholdingTax = 33750 + (taxable - 166667) * 0.3;
    else if (taxable > 66667) withholdingTax = 8750 + (taxable - 66667) * 0.25;
    else if (taxable > 33333) withholdingTax = 2083.33 + (taxable - 33333) * 0.2;
    else if (taxable > 20833) withholdingTax = (taxable - 20833) * 0.15;

    const netPay = monthlyGross - totalDeductions - withholdingTax;
    return {
      sss,
      philhealth,
      pagibig,
      withholdingTax: Math.round(withholdingTax),
      netPay: Math.round(netPay),
    };
  }, [monthlyGross]);

  // AI Chat state inside mobile app
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text: "Kamusta! Ako ang iyong Sandalan AI. Magtanong tungkol sa SSS, PhilHealth, TIN, Pag-IBIG, o budget!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // OCR state inside mobile app
  const [ocrStep, setOcrStep] = useState<"ready" | "scanning" | "done">("ready");
  const [selectedReceiptIndex, setSelectedReceiptIndex] = useState(0);

  const sampleReceipts = [
    {
      vendor: "Jollibee Foods Corp",
      branch: "UPLB Branch, Laguna",
      tin: "000-456-789-000",
      items: [
        { name: "2pc Chickenjoy w/ Rice", price: 185 },
        { name: "Jolly Spaghetti", price: 65 },
        { name: "Peach Mango Pie", price: 48 },
      ],
      total: 298.0,
      vat: 31.93,
    },
    {
      vendor: "Mercury Drug",
      branch: "Batong Malake, Los Baños",
      tin: "123-987-654-001",
      items: [
        { name: "Biogesic 500mg (10 tabs)", price: 85 },
        { name: "Ascorbic Acid 500mg", price: 120 },
      ],
      total: 205.0,
      vat: 21.96,
    },
  ];

  // Live time ticker
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(
        d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Airplane mode toggle
  const handleToggleAirplane = () => {
    const nextOffline = !isOffline;
    setIsOffline(nextOffline);

    if (nextOffline) {
      setSyncStatus("offline");
    } else {
      setSyncStatus("syncing");
      setTimeout(() => {
        setLocalExpenses((prev) => prev.map((e) => ({ ...e, synced: true })));
        setSyncStatus("synced");
      }, 1100);
    }
  };

  const handleAddQuickExpense = () => {
    const sampleItems = [
      { title: "7-Eleven Quick Lunch", category: "Food", amount: 165 },
      { title: "Jeepney & Tricycle Fare", category: "Transport", amount: 75 },
      { title: "Coffee & Pastry", category: "Food", amount: 190 },
    ];
    const picked = sampleItems[Math.floor(Math.random() * sampleItems.length)];
    const newItem = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      title: picked.title,
      category: picked.category,
      amount: picked.amount,
      synced: !isOffline,
    };
    setLocalExpenses((prev) => [newItem, ...prev]);

    if (!isOffline) {
      setSyncStatus("syncing");
      setTimeout(() => setSyncStatus("synced"), 600);
    }
  };

  const toggleGuideItem = (key: string) => {
    setGuideChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSendChat = (preset?: string) => {
    const query = (preset || chatInput).trim();
    if (!query) return;

    setChatMessages((prev) => [...prev, { sender: "user", text: query }]);
    if (!preset) setChatInput("");

    setTimeout(() => {
      let reply = "Para sa transaction na ito, magdala ng 2 valid Gov't IDs at mag-fill out online bago pumunta sa branch.";
      const lower = query.toLowerCase();
      if (lower.includes("tin")) {
        reply = "Para sa first-time jobseekers, libre ang TIN application via BIR Form 1904 kasama ang Barangay Certificate!";
      } else if (lower.includes("emergency") || lower.includes("ipon")) {
        reply = "Target: 3-6 months ng essential monthly expenses. Ilagay sa high-yield digital savings (Maya, Seabank, Gotyme) para lumalago.";
      } else if (lower.includes("sss") || lower.includes("loan")) {
        reply = "Available ang SSS Salary Loan kung may at least 36 posted monthly contributions ka na sa My.SSS portal.";
      }
      setChatMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 450);
  };

  const handleTriggerOcrScan = () => {
    setOcrStep("scanning");
    setTimeout(() => {
      setOcrStep("done");
    }, 1200);
  };

  const completedCount = Object.values(guideChecklist).filter(Boolean).length;
  const totalCount = Object.keys(guideChecklist).length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="reveal overflow-hidden rounded-xl border border-edge bg-fg/[0.02] shadow-sm">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-edge bg-fg/[0.02] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
          <Smartphone className="h-4 w-4 text-brand" aria-hidden="true" />
          <span className="font-semibold text-ink-1">Sandalan Interactive Mobile Demo</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[10.5px] text-ink-4 sm:inline-block">
            Flutter 3.29 · Drift SQLite · Supabase
          </span>
          <a
            href="https://play.google.com/store/apps/details?id=com.jvcerezo.exitplan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[11px] text-brand hover:underline"
          >
            <span>Google Play</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 p-5 sm:p-7 lg:grid-cols-12 items-center">
        {/* ========================================================================= */}
        {/* LEFT / CENTER: Interactive Physical Phone Mockup                          */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          {/* Phone Outer Shell */}
          <div className="relative w-[310px] sm:w-[335px] h-[640px] rounded-[44px] border-[10px] border-neutral-900 bg-neutral-950 shadow-2xl ring-1 ring-white/15 overflow-hidden flex flex-col select-none">
            {/* Top Speaker & Camera Punchhole */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
              <div className="h-3.5 w-3.5 rounded-full bg-neutral-900 border border-neutral-700/60 shadow-inner" />
            </div>

            {/* Mobile OS Status Bar */}
            <div className="relative z-20 flex items-center justify-between px-5 pt-3 pb-1 text-[11px] font-mono text-neutral-300">
              <span className="font-semibold">{currentTime}</span>
              <div className="flex items-center gap-2">
                {isOffline ? (
                  <span className="flex items-center gap-1 text-amber-400 text-[10px] font-semibold animate-pulse">
                    <WifiOff className="h-3 w-3" /> OFFLINE
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
                    <Wifi className="h-3 w-3" /> 4G LTE
                  </span>
                )}
                <Battery className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* App Content Window */}
            <div className="relative flex-1 bg-neutral-900 text-white flex flex-col overflow-hidden text-[12px]">
              {/* Top App Bar */}
              <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950/80 px-4 py-2.5 backdrop-blur-sm">
                <div>
                  <div className="font-display text-[13.5px] font-bold text-white tracking-tight flex items-center gap-1.5">
                    <span>Sandalan</span>
                    <span className="rounded bg-brand/20 px-1.5 py-0.2 font-mono text-[9px] text-brand font-semibold">
                      v1.5
                    </span>
                  </div>
                  <div className="font-mono text-[9.5px] text-neutral-400">
                    {syncStatus === "syncing" ? (
                      <span className="text-amber-400 font-semibold animate-pulse">
                        Syncing SQLite with Supabase...
                      </span>
                    ) : syncStatus === "offline" ? (
                      <span className="text-amber-400">Local Cache (Drift SQLite)</span>
                    ) : (
                      <span className="text-emerald-400 font-medium">✓ Drift DB Synced</span>
                    )}
                  </div>
                </div>

                {/* Profile Avatar inside app */}
                <div className="h-7 w-7 rounded-full bg-brand text-black font-bold flex items-center justify-center text-[10px] shadow-sm">
                  JC
                </div>
              </div>

              {/* SCREEN 1: HOME DASHBOARD */}
              {activeTab === "home" && (
                <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
                  {/* Adulting Progress Card */}
                  <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 shadow-sm">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1.5">
                      <span>Adulting Readiness</span>
                      <span className="font-mono text-brand font-bold">{progressPercent}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-brand rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-400">
                      <span>{completedCount} of {totalCount} essentials done</span>
                      <button
                        type="button"
                        onClick={() => setActiveTab("guides")}
                        className="text-brand hover:underline flex items-center gap-0.5"
                      >
                        View checklist <ChevronRight className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Action Grid */}
                  <div>
                    <div className="font-mono text-[10px] uppercase text-neutral-400 tracking-wider mb-1.5">
                      Government Fast Track
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {[
                        { title: "BIR TIN 1904", sub: "First Time Jobseeker", done: true },
                        { title: "SSS Registration", sub: "E-1 Online Portal", done: true },
                        { title: "PhilSys National ID", sub: "ePhilID Verification", done: false },
                        { title: "Pag-IBIG MP2", sub: "High-Yield Savings", done: false },
                      ].map((item) => (
                        <div
                          key={item.title}
                          onClick={() => setActiveTab("guides")}
                          className="cursor-pointer rounded-lg border border-neutral-800 bg-neutral-950/60 p-2 hover:border-brand/40 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-neutral-200">{item.title}</span>
                            {item.done ? (
                              <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="h-3 w-3 text-neutral-600 shrink-0" />
                            )}
                          </div>
                          <div className="text-[9.5px] text-neutral-400 mt-0.5">{item.sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Transactions in SQLite */}
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] text-neutral-400 mb-1.5">
                      <span>Recent Expenses (Drift SQLite)</span>
                      <button
                        type="button"
                        onClick={handleAddQuickExpense}
                        className="text-brand flex items-center gap-0.5 font-bold hover:underline"
                      >
                        <Plus className="h-3 w-3" /> Add
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {localExpenses.slice(0, 3).map((exp) => (
                        <div
                          key={exp.id}
                          className="flex items-center justify-between rounded-lg border border-neutral-800/80 bg-neutral-950/40 p-2"
                        >
                          <div>
                            <div className="font-medium text-neutral-200 text-[11.5px]">{exp.title}</div>
                            <div className="font-mono text-[9px] text-neutral-500">
                              {exp.category} · {exp.synced ? "✓ Synced" : "● Local"}
                            </div>
                          </div>
                          <div className="font-mono font-bold text-white text-[12px]">
                            ₱{exp.amount.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 2: ADULTING GUIDES */}
              {activeTab === "guides" && (
                <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-[13px]">Government Document Guides</h4>
                    <span className="font-mono text-[10px] text-neutral-400">Offline-Ready</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      {
                        key: "tin-form",
                        title: "1. BIR TIN ID (Form 1904)",
                        desc: "For first-time jobseekers (RA 11261). No application fee.",
                      },
                      {
                        key: "sss-online",
                        title: "2. SSS Number & My.SSS Account",
                        desc: "Register online via sss.gov.ph before physical branch appointment.",
                      },
                      {
                        key: "philsys-biometrics",
                        title: "3. PhilSys National ID",
                        desc: "Capture biometrics at nearest Philsys Registration Center.",
                      },
                      {
                        key: "pagibig-mid",
                        title: "4. Pag-IBIG Member ID & MP2",
                        desc: "Voluntary 7%+ tax-free dividend savings program.",
                      },
                    ].map((g) => {
                      const checked = !!guideChecklist[g.key];
                      return (
                        <div
                          key={g.key}
                          onClick={() => toggleGuideItem(g.key)}
                          className="cursor-pointer flex items-start gap-2.5 rounded-lg border border-neutral-800 bg-neutral-950 p-2.5 hover:border-brand/40 transition-colors"
                        >
                          <button type="button" className="mt-0.5 shrink-0 text-brand">
                            {checked ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Circle className="h-4 w-4 text-neutral-600" />
                            )}
                          </button>
                          <div>
                            <div className={`font-semibold text-[11.5px] ${checked ? "line-through text-neutral-400" : "text-white"}`}>
                              {g.title}
                            </div>
                            <div className="text-[10px] text-neutral-400 mt-0.5 leading-tight">
                              {g.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SCREEN 3: BUDGET & STATUTORY TAX */}
              {activeTab === "budget" && (
                <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
                  <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Monthly Gross Pay</span>
                      <span className="font-mono text-brand font-bold text-[13px]">
                        ₱{monthlyGross.toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={15000}
                      max={150000}
                      step={2500}
                      value={monthlyGross}
                      onChange={(e) => setMonthlyGross(Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand"
                    />
                    <div className="flex justify-between font-mono text-[9px] text-neutral-500">
                      <span>₱15k</span>
                      <span>₱80k</span>
                      <span>₱150k</span>
                    </div>
                  </div>

                  {/* Deduction breakdown */}
                  <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-2.5 font-mono text-[10.5px] space-y-1.5">
                    <div className="flex justify-between text-neutral-400">
                      <span>SSS Premium:</span>
                      <span className="text-white">₱{taxCalculations.sss.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>PhilHealth (5%):</span>
                      <span className="text-white">₱{taxCalculations.philhealth.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Pag-IBIG Fund:</span>
                      <span className="text-white">₱{taxCalculations.pagibig.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>BIR TRAIN Tax:</span>
                      <span className="text-white">₱{taxCalculations.withholdingTax.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-neutral-800 pt-1.5 flex justify-between font-bold text-[11.5px]">
                      <span className="text-brand">Net Take-Home:</span>
                      <span className="text-emerald-400">₱{taxCalculations.netPay.toLocaleString()} / mo</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 4: AI CHAT ASSISTANT */}
              {activeTab === "ai" && (
                <div className="flex-1 flex flex-col overflow-hidden p-3 justify-between">
                  <div className="overflow-y-auto space-y-2 pr-1 max-h-[360px]">
                    {chatMessages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-xl px-2.5 py-1.5 text-[11px] leading-relaxed ${
                            m.sender === "user"
                              ? "bg-brand text-black font-semibold"
                              : "bg-neutral-950 border border-neutral-800 text-neutral-200"
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 space-y-1.5">
                    {/* Prompt suggestions */}
                    <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                      {["Paano kumuha ng TIN?", "Emergency fund goal?"].map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => handleSendChat(q)}
                          className="shrink-0 rounded-full border border-neutral-800 bg-neutral-950 px-2 py-0.5 font-mono text-[9px] text-neutral-300 hover:border-brand"
                        >
                          {q}
                        </button>
                      ))}
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendChat();
                      }}
                      className="flex gap-1.5"
                    >
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Tanong sa Sandalan AI..."
                        className="flex-1 rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1 text-[11px] text-white focus:border-brand focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="rounded-lg bg-brand px-2.5 py-1 text-black font-bold hover:opacity-90"
                      >
                        <Send className="h-3 w-3" />
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* SCREEN 5: OCR RECEIPT SCANNER */}
              {activeTab === "ocr" && (
                <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-center">
                  <div className="flex justify-center gap-1.5 mb-1">
                    {sampleReceipts.map((r, i) => (
                      <button
                        key={r.vendor}
                        type="button"
                        onClick={() => {
                          setSelectedReceiptIndex(i);
                          setOcrStep("ready");
                        }}
                        className={`rounded px-2 py-0.5 font-mono text-[9.5px] ${
                          selectedReceiptIndex === i
                            ? "bg-brand text-black font-bold"
                            : "border border-neutral-800 text-neutral-400"
                        }`}
                      >
                        {r.vendor}
                      </button>
                    ))}
                  </div>

                  <div className="relative rounded-xl border border-neutral-800 bg-neutral-950 p-3 font-mono text-[10px] text-left border-dashed">
                    <div className="font-bold text-center text-white">{sampleReceipts[selectedReceiptIndex].vendor}</div>
                    <div className="text-neutral-500 text-center text-[9px]">
                      TIN: {sampleReceipts[selectedReceiptIndex].tin}
                    </div>

                    <div className="border-t border-neutral-800 my-1.5 pt-1 space-y-1">
                      {sampleReceipts[selectedReceiptIndex].items.map((it) => (
                        <div key={it.name} className="flex justify-between text-neutral-300">
                          <span>{it.name}</span>
                          <span>₱{it.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-neutral-800 pt-1 flex justify-between font-bold text-brand">
                      <span>TOTAL:</span>
                      <span>₱{sampleReceipts[selectedReceiptIndex].total.toFixed(2)}</span>
                    </div>

                    {ocrStep === "scanning" && (
                      <div className="absolute inset-0 bg-brand/10 border-2 border-brand flex items-center justify-center backdrop-blur-[1px] animate-pulse">
                        <span className="font-mono text-[11px] font-bold text-brand bg-black/90 px-3 py-1 rounded-full">
                          OCR Parsing Vision...
                        </span>
                      </div>
                    )}
                  </div>

                  {ocrStep === "ready" ? (
                    <button
                      type="button"
                      onClick={handleTriggerOcrScan}
                      className="w-full rounded-xl bg-brand py-2 font-mono text-[11px] font-bold text-black flex items-center justify-center gap-1.5 shadow-md shadow-brand/10"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      <span>Scan & Extract Items</span>
                    </button>
                  ) : (
                    <div className="rounded-lg bg-emerald-950/60 border border-emerald-800 p-2 font-mono text-[10px] text-emerald-300">
                      ✓ Extracted {sampleReceipts[selectedReceiptIndex].items.length} line items + VAT into SQLite!
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Mobile Navigation Tabs */}
              <div className="border-t border-neutral-800 bg-neutral-950 px-2 py-2 flex items-center justify-around text-[10px]">
                {[
                  { id: "home", label: "Home", icon: Home },
                  { id: "guides", label: "Guides", icon: BookOpen },
                  { id: "budget", label: "Budget", icon: Receipt },
                  { id: "ai", label: "AI Guide", icon: MessageSquare },
                  { id: "ocr", label: "OCR", icon: Camera },
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveTab(t.id as any)}
                      className={`flex flex-col items-center gap-0.5 transition-colors ${
                        isActive ? "text-brand font-bold" : "text-neutral-500 hover:text-neutral-300"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-[9px]">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Home Indicator bar */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-24 rounded-full bg-neutral-700/80 z-30" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT: Live Interactive Controls & Engine Inspector                       */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 space-y-4">
          {/* Airplane Mode Simulator Switch */}
          <div className="rounded-xl border border-edge bg-bg p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display text-[14.5px] font-semibold text-ink-1 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Offline-First Engine Controller</span>
                </h4>
                <p className="text-[12px] text-ink-3">
                  Simulate network loss to test local Drift SQLite mutations and background Supabase sync.
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleAirplane}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-[11px] font-bold transition-all shrink-0 ${
                  isOffline
                    ? "bg-amber-500/15 border border-amber-500 text-amber-500"
                    : "bg-emerald-500/15 border border-emerald-500 text-emerald-500"
                }`}
              >
                {isOffline ? <WifiOff className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5" />}
                <span>{isOffline ? "Airplane Mode: ON" : "Online (4G LTE)"}</span>
              </button>
            </div>

            <div className="rounded-md border border-edge bg-fg/[0.02] p-2.5 font-mono text-[11px] text-ink-4">
              <span>Database Engine: </span>
              <strong className="text-ink-2">Drift (SQLite)</strong> · Sync Protocol:{" "}
              <strong className="text-ink-2">Supabase PostgreSQL RLS</strong>
            </div>
          </div>

          {/* Quick Jump Feature Buttons */}
          <div className="rounded-xl border border-edge bg-bg p-4 space-y-2">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-4">
              Jump to App Feature:
            </span>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              {[
                { id: "home", label: "🏠 Home & Ledger" },
                { id: "guides", label: "📋 Gov't Checklists" },
                { id: "budget", label: "💰 Philippine Tax Calc" },
                { id: "ai", label: "🤖 Taglish AI Chatbot" },
                { id: "ocr", label: "📸 OCR Receipt Parser" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveTab(f.id as any)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    activeTab === f.id
                      ? "border-brand bg-brand/10 text-ink-1 font-bold"
                      : "border-edge bg-fg/[0.01] text-ink-3 hover:border-edge-strong hover:text-ink-1"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Relational Schema Highlights */}
          <div className="rounded-xl border border-edge bg-bg p-4 space-y-2 font-mono text-[11px]">
            <div className="flex items-center gap-1.5 text-ink-1 font-semibold border-b border-edge pb-1.5">
              <Layers className="h-3.5 w-3.5 text-brand" />
              <span>Production Architecture Highlights</span>
            </div>
            <div className="space-y-1 text-ink-3 text-[10.5px]">
              <div>• <strong>15,000+ lines</strong> of Flutter 3.29 & Riverpod 2.6 state architecture</div>
              <div>• <strong>13 Relational Tables</strong> in local SQLite with monotonic timestamp replication</div>
              <div>• <strong>AES-256 Encryption</strong> for 38+ Philippine financial account balances</div>
              <div>• <strong>Zero cloud lag</strong> — operates with 100% feature parity offline</div>
            </div>
          </div>

          {/* Direct Actions */}
          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href="https://play.google.com/store/apps/details?id=com.jvcerezo.exitplan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-fg py-2 px-3 font-mono text-[11.5px] font-semibold text-bg hover:opacity-90 transition-opacity"
            >
              <span>View on Google Play</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://exitplan-tau.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-lg border border-edge bg-bg py-2 px-3 font-mono text-[11.5px] text-ink-2 hover:border-edge-strong hover:text-ink-1"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              <span>Landing Page</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
