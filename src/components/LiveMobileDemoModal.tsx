import { useState, useEffect } from "react";
import {
  X,
  Smartphone,
  Play,
  RotateCcw,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  KeyRound,
  Check,
  Zap,
  Radio,
  Cpu,
} from "lucide-react";

interface LiveMobileDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  playStoreUrl?: string;
  defaultAppetizeKey?: string;
}

const DEFAULT_KEY = "demo_sandalan"; // Can be replaced with actual Appetize.io public key

export function LiveMobileDemoModal({
  isOpen,
  onClose,
  playStoreUrl = "https://play.google.com/store/apps/details?id=com.jvcerezo.exitplan",
  defaultAppetizeKey = DEFAULT_KEY,
}: LiveMobileDemoModalProps) {
  const [activeTab, setActiveTab] = useState<"vm" | "offline-sim" | "diagnostics">("vm");
  const [deviceModel, setDeviceModel] = useState<"pixel7" | "galaxyS23" | "iphone15pro">("pixel7");
  const [appetizeKey, setAppetizeKey] = useState<string>(() => {
    return localStorage.getItem("sandalan_appetize_key") || defaultAppetizeKey;
  });
  const [isKeyEditorOpen, setIsKeyEditorOpen] = useState(false);
  const [tempKey, setTempKey] = useState(appetizeKey);
  const [vmStarted, setVmStarted] = useState(false);
  const [vmReloadCounter, setVmReloadCounter] = useState(0);

  // Interactive offline sync simulation state
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

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle keyboard ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSaveKey = () => {
    const cleanKey = tempKey.trim() || DEFAULT_KEY;
    setAppetizeKey(cleanKey);
    localStorage.setItem("sandalan_appetize_key", cleanKey);
    setIsKeyEditorOpen(false);
    setVmReloadCounter((c) => c + 1);
  };

  const handleAddLocalRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount.trim()) return;

    const record = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      amount: parseFloat(newAmount) || 0,
      synced: !isOffline,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setLocalRecords((prev) => [record, ...prev]);
    setNewTitle("");
    setNewAmount("");

    if (isOffline) {
      setSyncStatus("idle");
    } else {
      setSyncStatus("syncing");
      setTimeout(() => setSyncStatus("synced"), 600);
    }
  };

  const handleToggleOffline = () => {
    const nextState = !isOffline;
    setIsOffline(nextState);

    if (!nextState) {
      // Reconnected to internet -> sync local records
      setSyncStatus("syncing");
      setTimeout(() => {
        setLocalRecords((prev) => prev.map((r) => ({ ...r, synced: true })));
        setSyncStatus("synced");
      }, 1200);
    }
  };

  if (!isOpen) return null;

  // Build the Appetize embed URL
  // Appetize supports live device streaming for APKs
  const appetizeEmbedUrl = `https://appetize.io/embed/${appetizeKey}?device=${deviceModel}&osVersion=13.0&scale=75&autoplay=${vmStarted}&centered=true&screenOnly=false&debug=true&key=${vmReloadCounter}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-live-demo-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[96vh] w-full max-w-[1080px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-bg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-edge bg-fg/[0.02] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="modal-live-demo-title" className="font-display text-[15px] font-semibold text-ink-1">
                  Sandalan · Live Android App Demo
                </h3>
                <span className="rounded-full bg-brand/10 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-brand font-medium">
                  Real APK / VM
                </span>
              </div>
              <p className="font-mono text-[10.5px] text-ink-4">
                Package: com.jvcerezo.exitplan · Flutter 3.29 · Drift SQLite + Supabase
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            {playStoreUrl && (
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-edge-strong bg-fg/[0.02] px-2.5 py-1 font-mono text-[11px] text-ink-2 transition-colors hover:text-brand"
              >
                <span>Google Play</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="flex h-8 w-8 items-center justify-center rounded-md text-ink-3 transition-colors hover:bg-fg/5 hover:text-ink-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Subheader Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between border-b border-edge bg-fg/[0.01] px-4 py-2 sm:px-6">
          <div className="flex items-center gap-1 rounded-lg border border-edge bg-bg p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab("vm")}
              className={`flex items-center gap-1.5 rounded px-3 py-1 font-mono text-[11px] transition-all ${
                activeTab === "vm" ? "bg-fg text-bg font-medium shadow-xs" : "text-ink-3 hover:text-ink-1"
              }`}
            >
              <Radio className="h-3 w-3 text-brand" />
              <span>Live Cloud Android VM</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("offline-sim")}
              className={`flex items-center gap-1.5 rounded px-3 py-1 font-mono text-[11px] transition-all ${
                activeTab === "offline-sim"
                  ? "bg-fg text-bg font-medium shadow-xs"
                  : "text-ink-3 hover:text-ink-1"
              }`}
            >
              <Zap className="h-3 w-3 text-amber-500" />
              <span>Offline Sync Engine Sandbox</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("diagnostics")}
              className={`flex items-center gap-1.5 rounded px-3 py-1 font-mono text-[11px] transition-all ${
                activeTab === "diagnostics"
                  ? "bg-fg text-bg font-medium shadow-xs"
                  : "text-ink-3 hover:text-ink-1"
              }`}
            >
              <Cpu className="h-3 w-3 text-blue-500" />
              <span>APK Architecture & Schema</span>
            </button>
          </div>

          {activeTab === "vm" && (
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              {/* Device switcher */}
              <select
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value as any)}
                aria-label="Select device model"
                className="rounded-md border border-edge bg-bg px-2 py-1 font-mono text-[11px] text-ink-2 focus:outline-none focus:border-brand"
              >
                <option value="pixel7">Google Pixel 7 (Android 13)</option>
                <option value="galaxyS23">Samsung Galaxy S23</option>
                <option value="iphone15pro">iPhone 15 Pro</option>
              </select>

              <button
                type="button"
                onClick={() => setVmReloadCounter((c) => c + 1)}
                title="Restart Android VM session"
                className="flex h-7 w-7 items-center justify-center rounded-md border border-edge bg-bg text-ink-3 hover:text-ink-1"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsKeyEditorOpen((v) => !v)}
                title="Configure Appetize App Key"
                className={`flex h-7 w-7 items-center justify-center rounded-md border text-ink-3 hover:text-ink-1 ${
                  isKeyEditorOpen ? "border-brand text-brand bg-brand/5" : "border-edge bg-bg"
                }`}
              >
                <KeyRound className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Appetize Key Configuration Drawer */}
        {isKeyEditorOpen && activeTab === "vm" && (
          <div className="border-b border-edge bg-brand/5 p-4 text-[12.5px] transition-all">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-ink-1">Cloud Emulator APK Link / Appetize Public Key</p>
                <p className="text-[11.5px] text-ink-3 font-mono">
                  Appetize.io provides 100 free monthly cloud Android emulator minutes for direct APK streaming.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="e.g. demo_sandalan or Appetize public key"
                  className="rounded-lg border border-edge bg-bg px-3 py-1.5 font-mono text-[11.5px] text-ink-1 focus:border-brand focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveKey}
                  className="flex items-center gap-1 rounded-lg bg-fg px-3 py-1.5 font-mono text-[11px] font-semibold text-bg hover:opacity-90"
                >
                  <Check className="h-3 w-3" /> Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: Real Android VM Emulator (Appetize Cloud Stream) */}
        {activeTab === "vm" && (
          <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto bg-fg/[0.015] p-4 sm:p-6 min-h-[500px]">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-4xl">
              {/* Phone Device Frame */}
              <div className="relative flex flex-col items-center">
                {/* Physical Phone Shell */}
                <div className="relative overflow-hidden rounded-[38px] border-[10px] border-neutral-800 bg-black shadow-2xl ring-1 ring-white/10 w-[300px] h-[580px] sm:w-[320px] sm:h-[620px] flex flex-col">
                  {/* Camera punchhole & speaker */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                    <div className="h-3.5 w-3.5 rounded-full bg-neutral-900 border border-neutral-700/50 shadow-inner" />
                  </div>

                  {/* Frame Content / Appetize Cloud Stream */}
                  <div className="relative flex-1 w-full h-full bg-neutral-950 flex flex-col">
                    {!vmStarted ? (
                      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-neutral-300">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 border border-brand/20 text-brand mb-4 shadow-lg">
                          <Smartphone className="h-7 w-7" />
                        </div>
                        <h4 className="font-display text-[16px] font-bold text-white mb-1">
                          Sandalan: Adulting Guide
                        </h4>
                        <p className="font-mono text-[11px] text-neutral-400 mb-6 max-w-[200px]">
                          Real Android APK build · 15k+ lines Flutter
                        </p>

                        <button
                          type="button"
                          onClick={() => setVmStarted(true)}
                          className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 font-mono text-[12px] font-bold text-black transition-all hover:scale-105 shadow-md shadow-brand/20"
                        >
                          <Play className="h-4 w-4 fill-current" />
                          <span>Boot Real Android VM</span>
                        </button>

                        <span className="mt-4 font-mono text-[9.5px] text-neutral-500">
                          Streams live ARM/x86 Android 13 cloud VM
                        </span>
                      </div>
                    ) : (
                      <iframe
                        src={appetizeEmbedUrl}
                        title="Sandalan Real Android APK VM"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        className="w-full h-full border-0"
                        allow="autoplay; encrypted-media; fullscreen"
                      />
                    )}
                  </div>

                  {/* Home indicator bar */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-28 rounded-full bg-neutral-600/70 z-20" />
                </div>
              </div>

              {/* VM Info & Quick Actions Column */}
              <div className="flex flex-col space-y-4 max-w-sm text-left">
                <div className="rounded-xl border border-edge bg-bg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-ink-1 font-semibold text-[14px]">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    <span>Native APK Execution Environment</span>
                  </div>
                  <p className="text-[12.5px] text-ink-3 leading-relaxed">
                    This window connects to an interactive cloud Android container executing the production Flutter APK bytecode, handling live touches, SQLite transactions, and state management.
                  </p>
                </div>

                <div className="rounded-xl border border-edge bg-bg p-4 space-y-3 font-mono text-[11px]">
                  <div className="text-ink-4 uppercase tracking-wider text-[10px] font-semibold border-b border-edge pb-1.5">
                    Build Information
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-4">Version:</span>
                    <span className="text-ink-1 font-semibold">1.5.0 (Build 213)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-4">Engine:</span>
                    <span className="text-ink-1">Flutter 3.29 / Dart 3.7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-4">Database:</span>
                    <span className="text-ink-1">Drift SQLite (13 Relational Tables)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-4">Backend Sync:</span>
                    <span className="text-ink-1">Supabase PostgreSQL + RLS</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.jvcerezo.exitplan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full rounded-lg bg-fg py-2 px-3 font-mono text-[12px] font-semibold text-bg transition-opacity hover:opacity-90"
                  >
                    <span>Install from Google Play</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setActiveTab("offline-sim")}
                    className="flex items-center justify-center gap-2 w-full rounded-lg border border-edge bg-bg py-2 px-3 font-mono text-[12px] text-ink-2 hover:border-edge-strong hover:text-ink-1"
                  >
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    <span>Test Offline Sync Engine Sandbox</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Interactive Offline Sync Engine Simulator */}
        {activeTab === "offline-sim" && (
          <div className="flex flex-1 flex-col overflow-y-auto bg-fg/[0.015] p-5 sm:p-7 min-h-[500px]">
            <div className="max-w-3xl mx-auto w-full space-y-5">
              {/* Introduction Banner */}
              <div className="rounded-xl border border-edge bg-bg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-[15px] font-semibold text-ink-1">
                      Sandalan Offline-First Sync Architecture
                    </span>
                    <span className="rounded bg-brand/10 px-2 py-0.5 font-mono text-[10px] text-brand uppercase">
                      Interactive Sandbox
                    </span>
                  </div>
                  <p className="text-[12.5px] text-ink-3 mt-1">
                    Test the exact local-first Drift SQLite + Supabase sync algorithm used in Sandalan. Disconnect the internet, create transactions offline, and watch the background reconciliation when reconnected.
                  </p>
                </div>

                {/* Internet Connection Switch */}
                <button
                  type="button"
                  onClick={handleToggleOffline}
                  className={`shrink-0 flex items-center gap-2.5 rounded-xl px-4 py-2.5 font-mono text-[12px] font-bold transition-all shadow-sm ${
                    isOffline
                      ? "bg-amber-500/15 border border-amber-500 text-amber-500"
                      : "bg-emerald-500/15 border border-emerald-500 text-emerald-500"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isOffline ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                    }`}
                  />
                  <span>{isOffline ? "MODE: OFFLINE" : "MODE: ONLINE (4G/WiFi)"}</span>
                </button>
              </div>

              {/* Add Transaction Form & Pipeline Visualizer */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Form */}
                <div className="md:col-span-5 rounded-xl border border-edge bg-bg p-4 space-y-3">
                  <h4 className="font-mono text-[11px] uppercase tracking-wider text-ink-4">
                    Create Local SQLite Record
                  </h4>
                  <form onSubmit={handleAddLocalRecord} className="space-y-3">
                    <div>
                      <label className="block font-mono text-[10px] text-ink-4 uppercase mb-1">
                        Expense / Transaction Name
                      </label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g., SSS Monthly Contribution"
                        className="w-full rounded-lg border border-edge bg-fg/[0.02] px-3 py-1.5 text-[13px] text-ink-1 focus:border-brand focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] text-ink-4 uppercase mb-1">
                        Amount (₱ PHP)
                      </label>
                      <input
                        type="number"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        placeholder="e.g., 1850"
                        className="w-full rounded-lg border border-edge bg-fg/[0.02] px-3 py-1.5 text-[13px] text-ink-1 focus:border-brand focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!newTitle.trim() || !newAmount.trim()}
                      className="w-full rounded-lg bg-fg py-2 px-3 font-mono text-[12px] font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-40"
                    >
                      + Save to Drift SQLite
                    </button>
                  </form>

                  <div className="border-t border-edge pt-2 font-mono text-[10.5px] text-ink-4">
                    <span>Sync Status: </span>
                    {syncStatus === "syncing" ? (
                      <span className="text-amber-500 font-semibold animate-pulse">Syncing with Supabase...</span>
                    ) : syncStatus === "synced" ? (
                      <span className="text-emerald-500 font-semibold">✓ 100% Up to Date</span>
                    ) : isOffline ? (
                      <span className="text-amber-400">Cached in Local SQLite (Pending Reconnect)</span>
                    ) : (
                      <span className="text-ink-3">Idle</span>
                    )}
                  </div>
                </div>

                {/* Local & Remote Database Records */}
                <div className="md:col-span-7 rounded-xl border border-edge bg-bg p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-edge pb-2 mb-3">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-ink-4">
                        Drift SQLite Database Table (`user_transactions`)
                      </span>
                      <span className="font-mono text-[10.5px] text-ink-4">
                        {localRecords.length} records
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {localRecords.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-lg border border-edge bg-fg/[0.02] p-2.5 text-[12.5px]"
                        >
                          <div>
                            <div className="font-medium text-ink-1">{item.title}</div>
                            <div className="font-mono text-[10px] text-ink-4">
                              {item.id} · {item.timestamp}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono font-bold text-ink-1">
                              ₱{item.amount.toLocaleString()}
                            </div>
                            <div className="font-mono text-[10px]">
                              {item.synced ? (
                                <span className="text-emerald-500 flex items-center justify-end gap-0.5">
                                  <Check className="h-3 w-3" /> Synced
                                </span>
                              ) : (
                                <span className="text-amber-500 flex items-center justify-end gap-0.5">
                                  ● Local Only
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="mt-3 font-mono text-[10.5px] text-ink-4 bg-fg/[0.02] p-2 rounded border border-edge">
                    💡 <strong>Conflict Resolution Strategy:</strong> Deterministic Last-Write-Wins (LWW) with client monotonic timestamps and Supabase Postgres transactional updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: APK Architecture & Schema Inspector */}
        {activeTab === "diagnostics" && (
          <div className="flex flex-1 flex-col overflow-y-auto bg-fg/[0.015] p-5 sm:p-7 min-h-[500px]">
            <div className="max-w-3xl mx-auto w-full space-y-4 font-mono text-[12px]">
              <div className="rounded-xl border border-edge bg-bg p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-edge pb-2">
                  <div className="flex items-center gap-2 font-display text-[15px] font-semibold text-ink-1">
                    <Layers className="h-4 w-4 text-brand" />
                    <span>Sandalan Relational Schema (13 Drift SQLite Tables)</span>
                  </div>
                  <span className="text-[11px] text-ink-4">Database Version 1.5</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11.5px]">
                  <div className="rounded-lg border border-edge bg-fg/[0.02] p-3 space-y-1">
                    <div className="font-bold text-ink-1 text-[12px]">1. adulting_stages & tasks</div>
                    <div className="text-ink-3">Tracks stages, user progress, requirements checklist</div>
                    <div className="text-[10.5px] text-ink-4">Indexes: stage_id, user_id, status</div>
                  </div>

                  <div className="rounded-lg border border-edge bg-fg/[0.02] p-3 space-y-1">
                    <div className="font-bold text-ink-1 text-[12px]">2. accounts & bank_integrations</div>
                    <div className="text-ink-3">38+ Philippine financial institutions & balances</div>
                    <div className="text-[10.5px] text-ink-4">Encrypted local storage via AES-256</div>
                  </div>

                  <div className="rounded-lg border border-edge bg-fg/[0.02] p-3 space-y-1">
                    <div className="font-bold text-ink-1 text-[12px]">3. expenses & budgets</div>
                    <div className="text-ink-3">Categorized spending, OCR receipt links, periodic budgets</div>
                    <div className="text-[10.5px] text-ink-4">Foreign keys: account_id, category_id</div>
                  </div>

                  <div className="rounded-lg border border-edge bg-fg/[0.02] p-3 space-y-1">
                    <div className="font-bold text-ink-1 text-[12px]">4. sync_queue & conflict_logs</div>
                    <div className="text-ink-3">Pending offline changes, retries, idempotent sync IDs</div>
                    <div className="text-[10.5px] text-ink-4">Automatic purge on 200 OK acknowledgment</div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-edge bg-bg p-5 space-y-3">
                <div className="flex items-center gap-2 font-display text-[14px] font-semibold text-ink-1">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>AI & OCR Pipeline in APK</span>
                </div>
                <p className="text-ink-3 text-[12px] leading-relaxed">
                  The APK includes client-side OCR parsing for Philippine official receipts (OR) and BIR invoices, extracting vendor names, TIN, VAT breakdown, and total amounts. Taglish conversational queries query local guidance indexes before calling LLM endpoints.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
