import { useState, useMemo } from "react";
import {
  Smartphone,
  Calculator,
  RotateCcw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const APP_SCREENS = [
  {
    id: "home",
    title: "01 // Home Dashboard",
    tagline: "Adulting Score, Obligations Calendar & Daily Habits",
    src: "/sandalan/01-home.jpg",
    details:
      "Engineered in Flutter 3.29 & Riverpod. Tracks adulting readiness percentage, upcoming statutory deadlines (SSS, BIR, PhilHealth), and active streaks.",
  },
  {
    id: "tracker",
    title: "02 // Life Stage Roadmap",
    tagline: "Step-by-Step Philippine Adulting Checklist",
    src: "/sandalan/02-tracker.jpg",
    details:
      "6 structured stages: Unang Hakbang, Pundasyon, Tahanan, and Tugatog. 100% functional offline with Drift SQLite local persistence.",
  },
  {
    id: "chat",
    title: "03 // Taglish AI Assistant",
    tagline: "Conversational Guide for Philippine Bureaucracy",
    src: "/sandalan/03-chat.jpg",
    details:
      "Answers questions on TIN Form 1904, PhilSys ePhilID, SSS Salary Loans, and Pag-IBIG MP2 tax-free dividend guidelines in conversational Taglish.",
  },
  {
    id: "transactions",
    title: "04 // Transaction Ledger",
    tagline: "Encrypted Multi-Account Expense Tracker",
    src: "/sandalan/04-transactions.jpg",
    details:
      "Local AES-256 encrypted storage for 38+ Philippine financial account balances with instant search and category tagging.",
  },
  {
    id: "budgets",
    title: "05 // Envelopes & Budgets",
    tagline: "Smart Spending Caps & Overspend Alerts",
    src: "/sandalan/05-budgets.jpg",
    details:
      "Periodic envelope budget tracker with real-time progress bars and automated threshold warnings.",
  },
  {
    id: "reports",
    title: "06 // Monthly Analytics",
    tagline: "Visual Cashflow & Net Worth Reports",
    src: "/sandalan/08-reports.jpg",
    details:
      "Category breakdowns, income vs. expense cashflow charts, and historical spending comparisons.",
  },
];

export function LiveMobileShowcase() {
  const [tab, setTab] = useState<"screens" | "tax" | "sync">("screens");
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);

  // --- Philippine Tax & Take-Home Pay Calculator (PHP) ---
  const [monthlyGross, setMonthlyGross] = useState<number>(45000);

  const tax = useMemo(() => {
    // SSS 2025 contribution approximation (4.5% employee share, capped at ₱1,350)
    const sss = Math.min(Math.round(monthlyGross * 0.045), 1350);
    // PhilHealth (5% premium divided equally, employee share 2.5%, max cap ₱2,500)
    const philhealth = Math.min(Math.round((monthlyGross * 0.05) / 2), 2500);
    // Pag-IBIG HDMF (2% up to ₱200 max)
    const pagibig = Math.min(Math.round(monthlyGross * 0.02), 200);

    const totalContributions = sss + philhealth + pagibig;
    const taxable = Math.max(monthlyGross - totalContributions, 0);

    // BIR TRAIN Law (RA 10963) Monthly Withholding Tax Brackets
    let birTax = 0;
    if (taxable > 666667) {
      birTax = 167083.33 + (taxable - 666667) * 0.35;
    } else if (taxable > 166667) {
      birTax = 33750 + (taxable - 166667) * 0.3;
    } else if (taxable > 66667) {
      birTax = 8750 + (taxable - 66667) * 0.25;
    } else if (taxable > 33333) {
      birTax = 2083.33 + (taxable - 33333) * 0.2;
    } else if (taxable > 20833) {
      birTax = (taxable - 20833) * 0.15;
    }

    const netPay = monthlyGross - totalContributions - birTax;
    return {
      sss,
      philhealth,
      pagibig,
      totalContributions,
      birTax: Math.round(birTax),
      netPay: Math.round(netPay),
    };
  }, [monthlyGross]);

  // --- Offline SQLite Sync Tester ---
  const [isOffline, setIsOffline] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "offline">("synced");
  const [expenses, setExpenses] = useState([
    { id: "tx-01", title: "SM Supermarket Groceries", amount: 1450, synced: true },
    { id: "tx-02", title: "Meralco Electric Bill", amount: 3200, synced: true },
  ]);

  const handleToggleOffline = () => {
    const next = !isOffline;
    setIsOffline(next);
    if (next) {
      setSyncStatus("offline");
    } else {
      setSyncStatus("syncing");
      setTimeout(() => {
        setExpenses((prev) => prev.map((e) => ({ ...e, synced: true })));
        setSyncStatus("synced");
      }, 900);
    }
  };

  const handleAddSample = () => {
    const sample = [
      { title: "Mercury Drug Medicine", amount: 480 },
      { title: "Jollibee Food Order", amount: 295 },
      { title: "Grab / Transport Fare", amount: 180 },
      { title: "7-Eleven Quick Lunch", amount: 165 },
    ];
    const picked = sample[Math.floor(Math.random() * sample.length)];
    const newItem = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      title: picked.title,
      amount: picked.amount,
      synced: !isOffline,
    };
    setExpenses((prev) => [newItem, ...prev]);

    if (!isOffline) {
      setSyncStatus("syncing");
      setTimeout(() => setSyncStatus("synced"), 500);
    }
  };

  const currentScreen = APP_SCREENS[activeScreenIndex];

  return (
    <div className="overflow-hidden rounded-xl border border-edge bg-fg/[0.02]">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-edge bg-fg/[0.02] px-4 py-2.5">
        <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-4">
          <Smartphone className="h-3.5 w-3.5 text-brand" />
          <span>Sandalan · App Showcase & Runtimes</span>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-edge bg-bg p-0.5">
          <button
            onClick={() => setTab("screens")}
            className={`rounded px-2.5 py-1 font-mono text-[10.5px] transition-all ${
              tab === "screens"
                ? "bg-fg text-bg font-medium shadow-sm"
                : "text-ink-3 hover:text-ink-1"
            }`}
          >
            Real App Screens
          </button>
          <button
            onClick={() => setTab("tax")}
            className={`rounded px-2.5 py-1 font-mono text-[10.5px] transition-all ${
              tab === "tax"
                ? "bg-fg text-bg font-medium shadow-sm"
                : "text-ink-3 hover:text-ink-1"
            }`}
          >
            Philippine Tax Engine (PHP)
          </button>
          <button
            onClick={() => setTab("sync")}
            className={`rounded px-2.5 py-1 font-mono text-[10.5px] transition-all ${
              tab === "sync"
                ? "bg-fg text-bg font-medium shadow-sm"
                : "text-ink-3 hover:text-ink-1"
            }`}
          >
            Offline SQLite Sync
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 sm:p-6">
        {/* ========================================================================= */}
        {/* TAB 1: REAL APP SCREENS SHOWCASE (From actual APK build)                 */}
        {/* ========================================================================= */}
        {tab === "screens" && (
          <div className="space-y-4 animate-reveal">
            {/* Screen selection buttons */}
            <div className="flex flex-wrap gap-1.5 border-b border-edge pb-3">
              {APP_SCREENS.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveScreenIndex(idx)}
                  className={`rounded-md px-2.5 py-1 font-mono text-[11px] transition-all ${
                    activeScreenIndex === idx
                      ? "bg-fg text-bg font-semibold shadow-xs"
                      : "border border-edge bg-bg text-ink-3 hover:border-edge-strong hover:text-ink-1"
                  }`}
                >
                  {s.title.split(" // ")[1]}
                </button>
              ))}
            </div>

            {/* Screen Display Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left: Authentic In-App Screenshot Frame */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-[240px] sm:w-[260px] rounded-[24px] border-[6px] border-neutral-800 bg-black shadow-xl overflow-hidden ring-1 ring-white/10 group">
                  <img
                    src={currentScreen.src}
                    alt={currentScreen.title}
                    className="w-full h-auto object-cover rounded-[18px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="font-mono text-[10px] text-white">
                      Screenshot from release build v1.5.0
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Technical Details & Play Store Link */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-brand font-semibold">
                      {currentScreen.title}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveScreenIndex(
                            (activeScreenIndex - 1 + APP_SCREENS.length) % APP_SCREENS.length
                          )
                        }
                        aria-label="Previous screenshot"
                        className="flex h-7 w-7 items-center justify-center rounded border border-edge bg-bg text-ink-3 hover:text-ink-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveScreenIndex((activeScreenIndex + 1) % APP_SCREENS.length)
                        }
                        aria-label="Next screenshot"
                        className="flex h-7 w-7 items-center justify-center rounded border border-edge bg-bg text-ink-3 hover:text-ink-1"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="mt-1 font-display text-[16px] font-bold text-ink-1">
                    {currentScreen.tagline}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
                    {currentScreen.details}
                  </p>
                </div>

                <div className="rounded-lg border border-edge bg-bg p-3.5 space-y-2 font-mono text-[11px]">
                  <div className="text-ink-4 uppercase tracking-wider text-[10px]">
                    Engineering Specs:
                  </div>
                  <div className="text-ink-3">• 15,000+ lines Flutter & Riverpod 2.6 state architecture</div>
                  <div className="text-ink-3">• 13 Drift SQLite relational tables with monotonic sync</div>
                  <div className="text-ink-3">• AES-256 local encryption for 38+ bank integrations</div>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.jvcerezo.exitplan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-fg px-3.5 py-1.5 text-[12px] font-semibold text-bg hover:opacity-90 transition-opacity"
                  >
                    <span>Get on Google Play</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="https://exitplan-tau.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-edge bg-bg px-3.5 py-1.5 font-mono text-[12px] text-ink-2 hover:border-edge-strong hover:text-ink-1"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-brand" />
                    <span>Landing Page</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PHILIPPINE TAX & STATUTORY DEDUCTION CALCULATOR (PHP)              */}
        {/* ========================================================================= */}
        {tab === "tax" && (
          <div className="space-y-4 animate-reveal">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="font-display text-[15px] font-semibold text-ink-1 flex items-center gap-2">
                <Calculator className="h-4 w-4 text-brand" />
                <span>Philippine Salary & Statutory Tax Calculator</span>
              </h4>
              <span className="font-mono text-[11px] text-ink-4">
                TRAIN Law (RA 10963) · SSS · PhilHealth · Pag-IBIG
              </span>
            </div>

            {/* Slider & Gross figure */}
            <div className="rounded-lg border border-edge bg-bg p-4 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-4">
                  Monthly Gross Salary
                </span>
                <span className="font-mono text-[11px] text-ink-4">
                  ₱{(monthlyGross * 12).toLocaleString()} / yr
                </span>
              </div>

              <div className="font-mono text-[22px] font-bold text-ink-1">
                ₱{monthlyGross.toLocaleString()} <span className="text-[13px] font-normal text-ink-4">/ month</span>
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
                <span>₱200,000+</span>
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-[11px]">
              <div className="rounded-lg border border-edge bg-bg p-2.5 space-y-0.5">
                <div className="text-ink-4 text-[10px]">SSS Share</div>
                <div className="font-bold text-ink-1">₱{tax.sss.toLocaleString()}</div>
              </div>
              <div className="rounded-lg border border-edge bg-bg p-2.5 space-y-0.5">
                <div className="text-ink-4 text-[10px]">PhilHealth (5%)</div>
                <div className="font-bold text-ink-1">₱{tax.philhealth.toLocaleString()}</div>
              </div>
              <div className="rounded-lg border border-edge bg-bg p-2.5 space-y-0.5">
                <div className="text-ink-4 text-[10px]">Pag-IBIG Fund</div>
                <div className="font-bold text-ink-1">₱{tax.pagibig.toLocaleString()}</div>
              </div>
              <div className="rounded-lg border border-edge bg-bg p-2.5 space-y-0.5">
                <div className="text-ink-4 text-[10px]">BIR TRAIN Tax</div>
                <div className="font-bold text-ink-1">₱{tax.birTax.toLocaleString()}</div>
              </div>
            </div>

            {/* Net Take-Home Highlight */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-brand/40 bg-brand/5 p-3.5 font-mono">
              <div>
                <span className="text-[10.5px] uppercase tracking-wider text-ink-3">
                  Estimated Net Take-Home Pay
                </span>
                <div className="text-[20px] font-bold text-ink-1 mt-0.5">
                  ₱{tax.netPay.toLocaleString()} <span className="text-[12px] font-normal text-ink-3">/ month</span>
                </div>
              </div>

              <a
                href="https://play.google.com/store/apps/details?id=com.jvcerezo.exitplan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-fg px-3 py-1.5 text-[11.5px] font-medium text-bg hover:opacity-90 transition-opacity"
              >
                <span>Get Sandalan on Play Store</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: OFFLINE SQLITE SYNC REPLICATION TESTER                             */}
        {/* ========================================================================= */}
        {tab === "sync" && (
          <div className="space-y-4 animate-reveal">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-display text-[15px] font-semibold text-ink-1 flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-brand" />
                <span>Drift SQLite $\leftrightarrow$ Supabase Replication</span>
              </h4>

              <button
                type="button"
                onClick={handleToggleOffline}
                className={`rounded-md px-3 py-1 font-mono text-[11px] font-bold transition-all ${
                  isOffline
                    ? "bg-amber-500/15 border border-amber-500 text-amber-500"
                    : "bg-emerald-500/15 border border-emerald-500 text-emerald-500"
                }`}
              >
                {isOffline ? "Network: OFFLINE" : "Network: ONLINE (4G)"}
              </button>
            </div>

            <p className="text-[13px] text-ink-3 leading-relaxed">
              Test how Sandalan writes mutations locally to encrypted SQLite when offline, then idempotently merges with Supabase when reconnected.
            </p>

            <div className="rounded-lg border border-edge bg-bg p-4 space-y-3">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-ink-4 uppercase tracking-wider">
                  Local SQLite Table (`transactions`)
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-ink-4">
                    Status:{" "}
                    {syncStatus === "syncing" ? (
                      <span className="text-amber-500 font-semibold animate-pulse">Syncing...</span>
                    ) : syncStatus === "offline" ? (
                      <span className="text-amber-400">Offline (Cached)</span>
                    ) : (
                      <span className="text-emerald-500 font-semibold">100% Synced</span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={handleAddSample}
                    className="rounded border border-edge bg-fg/[0.04] px-2 py-0.5 font-mono text-[10.5px] text-ink-2 hover:border-brand hover:text-brand transition-colors"
                  >
                    + Add Record
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 font-mono text-[11.5px]">
                {expenses.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between rounded border border-edge bg-fg/[0.01] p-2"
                  >
                    <div>
                      <span className="text-ink-1 font-sans font-medium">{e.title}</span>
                      <span className="text-[10px] text-ink-4 ml-2">{e.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink-1">₱{e.amount.toLocaleString()}</span>
                      <span
                        className={`text-[10px] rounded px-1.5 py-0.2 ${
                          e.synced ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {e.synced ? "Synced" : "Local SQLite"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
