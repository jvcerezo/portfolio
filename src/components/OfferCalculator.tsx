import { useState, useMemo } from "react";
import {
  Briefcase,
  DollarSign,
  Coffee,
  Laptop,
  HeartPulse,
  Sparkles,
  Send,
  Copy,
  Check,
  Building2,
  Zap,
  TrendingUp,
  FileCheck2,
  Download,
  Percent,
} from "lucide-react";

interface PerkOption {
  id: string;
  label: string;
  category: string;
  icon: typeof Coffee;
  weight: number;
}

const ROLES = [
  {
    id: "fullstack",
    title: "Full-Stack Software Engineer",
    desc: "React, Node.js, Express, MongoDB, REST APIs, Microservices",
    defaultUsd: 4200,
    defaultPhp: 110000,
  },
  {
    id: "qa",
    title: "Junior Test Automation / QA Engineer",
    desc: "Appium, CI/CD pipelines, BrowserStack, Linux runners, Mobile QA",
    defaultUsd: 3800,
    defaultPhp: 95000,
  },
  {
    id: "mobile",
    title: "Mobile Engineer (Flutter / Dart)",
    desc: "Flutter, Riverpod, Drift SQLite, Supabase sync, Google Play",
    defaultUsd: 4500,
    defaultPhp: 120000,
  },
  {
    id: "core",
    title: "Founding / Core Product Engineer",
    desc: "End-to-end full product lifecycle: schema to post-launch triage",
    defaultUsd: 5500,
    defaultPhp: 150000,
  },
];

const WORK_MODELS = [
  { id: "remote-us", label: "100% Remote · US / Night Shift (UTC-5 to UTC-8)", boost: 10 },
  { id: "remote-apac", label: "100% Remote · APAC / Flexible (UTC+8)", boost: 12 },
  { id: "hybrid", label: "Hybrid · Metro Manila / Laguna", boost: 5 },
];

const PERKS: PerkOption[] = [
  { id: "macbook", label: "M3/M4 Max MacBook Pro + 4K Monitor", category: "Hardware", icon: Laptop, weight: 8 },
  { id: "hmo", label: "Comprehensive HMO + 2 Dependents (Day 1)", category: "Health", icon: HeartPulse, weight: 12 },
  { id: "pto", label: "Flexible / Unlimited Paid Time Off", category: "Culture", icon: Sparkles, weight: 8 },
  { id: "ai", label: "Claude 3.7 Pro + Copilot Enterprise Access", category: "Tools", icon: Zap, weight: 6 },
  { id: "coffee", label: "Unlimited Specialty Coffee & Matcha Stipend", category: "Fuel", icon: Coffee, weight: 5 },
  { id: "learning", label: "$1,000/yr Tech Books & Conference Budget", category: "Growth", icon: TrendingUp, weight: 6 },
  { id: "bonus", label: "Performance Bonus / Equity Options", category: "Upside", icon: DollarSign, weight: 10 },
];

export function OfferCalculator() {
  const [currency, setCurrency] = useState<"USD" | "PHP">("USD");
  const [period, setPeriod] = useState<"monthly" | "annual">("monthly");
  const [selectedRole, setSelectedRole] = useState(ROLES[0].id);
  const [workModel, setWorkModel] = useState(WORK_MODELS[0].id);
  const [salaryUsd, setSalaryUsd] = useState(4500);
  const [salaryPhp, setSalaryPhp] = useState(120000);
  const [selectedPerks, setSelectedPerks] = useState<string[]>([
    "macbook",
    "hmo",
    "ai",
    "coffee",
    "pto",
  ]);
  const [companyName, setCompanyName] = useState("");
  const [startDate] = useState("2-weeks");
  const [copied, setCopied] = useState(false);

  const activeRole = ROLES.find((r) => r.id === selectedRole) || ROLES[0];
  const activeWorkModel = WORK_MODELS.find((w) => w.id === workModel) || WORK_MODELS[0];

  const togglePerk = (id: string) => {
    setSelectedPerks((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Dynamic Acceptance Probability & Sentiment
  const { score, sentiment, reaction } = useMemo(() => {
    let baseScore = 40;

    // Salary influence
    if (currency === "USD") {
      const normalized = Math.min(Math.max((salaryUsd - 2000) / 4500, 0), 1);
      baseScore += normalized * 45;
    } else {
      const normalized = Math.min(Math.max((salaryPhp - 50000) / 120000, 0), 1);
      baseScore += normalized * 45;
    }

    // Work model influence
    baseScore += activeWorkModel.boost;

    // Perks influence
    const perksWeight = selectedPerks.reduce((acc, perkId) => {
      const p = PERKS.find((item) => item.id === perkId);
      return acc + (p ? p.weight : 0);
    }, 0);
    baseScore += Math.min(perksWeight * 0.4, 20);

    const finalScore = Math.min(Math.max(Math.round(baseScore * 10) / 10, 25), 99.9);

    let sent = "Competitive Offer";
    let react = "Promising package. Let's schedule a technical conversation!";

    if (finalScore >= 95) {
      sent = "Instant Acceptance · Priority 1";
      react = "🚀 Where do I sign? I'll have the repo cloned and PRs open by tomorrow morning.";
    } else if (finalScore >= 85) {
      sent = "Very Strong Offer";
      react = "🔥 High enthusiasm! Ready to dive straight into your architecture and product roadmap.";
    } else if (finalScore >= 70) {
      sent = "Solid & Competitive";
      react = "👍 Great baseline package. Let's align on team culture and sprint velocity.";
    } else {
      sent = "Negotiation Territory";
      react = "☕ Let's chat over coffee to explore potential adjustments on perks or compensation.";
    }

    return { score: finalScore, sentiment: sent, reaction: react };
  }, [currency, salaryUsd, salaryPhp, activeWorkModel, selectedPerks]);

  // Formatted Salary Values
  const displaySalary = useMemo(() => {
    if (currency === "USD") {
      const val = period === "monthly" ? salaryUsd : salaryUsd * 12;
      return `$${val.toLocaleString()}${period === "monthly" ? " / mo" : " / yr"}`;
    } else {
      const val = period === "monthly" ? salaryPhp : salaryPhp * 12;
      return `₱${val.toLocaleString()}${period === "monthly" ? " / mo" : " / yr"}`;
    }
  }, [currency, period, salaryUsd, salaryPhp]);

  // Generated Markdown Offer
  const offerMarkdown = useMemo(() => {
    const employer = companyName.trim() ? companyName.trim() : "Your Company / Team";
    const perkLabels = selectedPerks
      .map((id) => PERKS.find((p) => p.id === id)?.label)
      .filter(Boolean)
      .map((l) => `- ${l}`)
      .join("\n");

    return `### 📄 Formal Employment Offer Proposal
**To:** Jet Timothy V. Cerezo
**From:** ${employer}
**Position:** ${activeRole.title}
**Base Compensation:** ${displaySalary}
**Work Model:** ${activeWorkModel.label}
**Target Start Date:** ${startDate === "immediate" ? "Immediate" : startDate === "2-weeks" ? "Standard 2 Weeks" : "30 Days"}

**Included Perks & Benefits:**
${perkLabels || "- Standard statutory benefits"}

**Acceptance Score:** ${score}% (${sentiment})
---
*Generated via Jet's Interactive Portfolio Offer Builder (jettimothycerezo.dev)*`;
  }, [
    companyName,
    activeRole.title,
    displaySalary,
    activeWorkModel.label,
    startDate,
    selectedPerks,
    score,
    sentiment,
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(offerMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSendEmail = () => {
    const employer = companyName.trim() ? companyName.trim() : "Hiring Team";
    const subject = encodeURIComponent(`[Job Offer] ${activeRole.title} — ${employer}`);
    const body = encodeURIComponent(
      `Hi Jet,\n\nWe'd love to extend an offer proposal for you to join our team!\n\nHere are the details we configured:\n\n${offerMarkdown}\n\nLooking forward to hearing your thoughts.\n\nBest regards,\n${employer}`
    );
    window.open(`mailto:jetjetcerezo@gmail.com?subject=${subject}&body=${body}`, "_blank");
  };

  const handleDownloadJson = () => {
    const data = {
      candidate: "Jet Timothy V. Cerezo",
      company: companyName.trim() || "Hiring Team",
      role: activeRole.title,
      compensation: displaySalary,
      workModel: activeWorkModel.label,
      startDate,
      perks: selectedPerks.map((id) => PERKS.find((p) => p.id === id)?.label),
      acceptanceProbability: `${score}%`,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `offer-jet-cerezo-${activeRole.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reveal overflow-hidden rounded-xl border border-edge bg-fg/[0.02] shadow-sm">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-edge bg-fg/[0.02] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
          <Briefcase className="h-4 w-4 text-brand" aria-hidden="true" />
          <span className="font-semibold text-ink-1">Interactive Offer & Compensation Simulator</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-ink-4">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Calculator</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-5 sm:p-6 lg:grid-cols-12 lg:gap-8">
        {/* Left Column: Form Controls */}
        <div className="space-y-5 lg:col-span-7">
          {/* Company / Team Name */}
          <div>
            <label className="block font-mono text-[10.5px] uppercase tracking-wider text-ink-4 mb-1.5">
              Your Company or Organization
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-ink-4" />
              <input
                type="text"
                placeholder="e.g., Stripe, Billease, Seed Stage Startup"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-lg border border-edge bg-bg py-2 pl-9 pr-3 text-[13.5px] text-ink-1 placeholder:text-ink-4/60 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>

          {/* Role selection */}
          <div>
            <label className="block font-mono text-[10.5px] uppercase tracking-wider text-ink-4 mb-1.5">
              Target Role
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {ROLES.map((r) => {
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(r.id);
                      setSalaryUsd(r.defaultUsd);
                      setSalaryPhp(r.defaultPhp);
                    }}
                    className={`flex flex-col text-left p-2.5 rounded-lg border transition-all ${
                      isSelected
                        ? "border-brand bg-brand/5 shadow-xs ring-1 ring-brand/30"
                        : "border-edge bg-bg hover:border-edge-strong hover:bg-fg/[0.02]"
                    }`}
                  >
                    <span className={`text-[13px] font-semibold ${isSelected ? "text-ink-1" : "text-ink-2"}`}>
                      {r.title}
                    </span>
                    <span className="mt-1 text-[11px] leading-tight text-ink-4 line-clamp-2">
                      {r.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Base Compensation Slider */}
          <div className="rounded-lg border border-edge bg-bg p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="font-mono text-[10.5px] uppercase tracking-wider text-ink-4">
                Base Compensation
              </label>

              {/* Currency & Period Toggles */}
              <div className="flex items-center gap-2">
                <div className="flex rounded-md border border-edge bg-fg/[0.03] p-0.5 font-mono text-[10.5px]">
                  <button
                    type="button"
                    onClick={() => setCurrency("USD")}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      currency === "USD" ? "bg-fg text-bg font-medium" : "text-ink-3 hover:text-ink-1"
                    }`}
                  >
                    USD ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency("PHP")}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      currency === "PHP" ? "bg-fg text-bg font-medium" : "text-ink-3 hover:text-ink-1"
                    }`}
                  >
                    PHP (₱)
                  </button>
                </div>

                <div className="flex rounded-md border border-edge bg-fg/[0.03] p-0.5 font-mono text-[10.5px]">
                  <button
                    type="button"
                    onClick={() => setPeriod("monthly")}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      period === "monthly" ? "bg-fg text-bg font-medium" : "text-ink-3 hover:text-ink-1"
                    }`}
                  >
                    Mo
                  </button>
                  <button
                    type="button"
                    onClick={() => setPeriod("annual")}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      period === "annual" ? "bg-fg text-bg font-medium" : "text-ink-3 hover:text-ink-1"
                    }`}
                  >
                    Yr
                  </button>
                </div>
              </div>
            </div>

            {/* Large Figure */}
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[22px] font-bold text-ink-1 tracking-tight">
                {displaySalary}
              </span>
              <span className="font-mono text-[11px] text-ink-4">
                {currency === "USD"
                  ? `≈ ₱${(salaryUsd * 58).toLocaleString()} PHP`
                  : `≈ $${Math.round(salaryPhp / 58).toLocaleString()} USD`}
              </span>
            </div>

            {/* Slider */}
            {currency === "USD" ? (
              <input
                type="range"
                min={2000}
                max={9000}
                step={100}
                value={salaryUsd}
                onChange={(e) => setSalaryUsd(Number(e.target.value))}
                className="w-full h-1.5 bg-edge-strong rounded-lg appearance-none cursor-pointer accent-brand"
              />
            ) : (
              <input
                type="range"
                min={50000}
                max={250000}
                step={5000}
                value={salaryPhp}
                onChange={(e) => setSalaryPhp(Number(e.target.value))}
                className="w-full h-1.5 bg-edge-strong rounded-lg appearance-none cursor-pointer accent-brand"
              />
            )}

            <div className="flex justify-between font-mono text-[10px] text-ink-4">
              <span>{currency === "USD" ? "$2,000 / mo" : "₱50,000 / mo"}</span>
              <span>{currency === "USD" ? "$5,500 / mo" : "₱150,000 / mo"}</span>
              <span>{currency === "USD" ? "$9,000+ / mo" : "₱250,000+ / mo"}</span>
            </div>
          </div>

          {/* Work Model */}
          <div>
            <label className="block font-mono text-[10.5px] uppercase tracking-wider text-ink-4 mb-1.5">
              Working Model & Timezone
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {WORK_MODELS.map((w) => {
                const isSelected = workModel === w.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWorkModel(w.id)}
                    className={`p-2.5 rounded-lg border text-left font-mono text-[11px] transition-all ${
                      isSelected
                        ? "border-brand bg-brand/5 text-ink-1 font-semibold ring-1 ring-brand/30"
                        : "border-edge bg-bg text-ink-3 hover:border-edge-strong hover:text-ink-1"
                    }`}
                  >
                    {w.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Perks & Benefits Checklist */}
          <div>
            <label className="block font-mono text-[10.5px] uppercase tracking-wider text-ink-4 mb-1.5">
              Perks, Gear & Culture ({selectedPerks.length} Selected)
            </label>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {PERKS.map((perk) => {
                const isChecked = selectedPerks.includes(perk.id);
                const Icon = perk.icon;
                return (
                  <button
                    key={perk.id}
                    type="button"
                    onClick={() => togglePerk(perk.id)}
                    className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all ${
                      isChecked
                        ? "border-brand/40 bg-fg/[0.04] text-ink-1"
                        : "border-edge bg-bg text-ink-4 hover:border-edge-strong hover:text-ink-2"
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                        isChecked ? "bg-brand text-bg" : "border border-edge text-ink-4"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[12px] leading-tight font-medium">
                      {perk.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Offer Summary & Probability Gauge */}
        <div className="flex flex-col justify-between space-y-4 lg:col-span-5">
          {/* Probability Score Card */}
          <div className="rounded-xl border border-edge bg-bg p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-4">
                Jet Acceptance Probability
              </span>
              <div className="flex items-center gap-1 font-mono text-[13px] font-bold text-brand">
                <Percent className="h-3.5 w-3.5" />
                <span>{score}%</span>
              </div>
            </div>

            {/* Gauge bar */}
            <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-edge">
              <div
                className="h-full rounded-full bg-brand transition-all duration-500 ease-out"
                style={{ width: `${score}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold text-ink-2">{sentiment}</span>
              <span className="font-mono text-[10px] text-ink-4">
                {score >= 90 ? "🚀 Top Match" : score >= 75 ? "✨ High Match" : "⏳ Standard"}
              </span>
            </div>

            <p className="mt-3 rounded-md border border-edge bg-fg/[0.02] p-2.5 text-[12.5px] leading-relaxed text-ink-2 italic">
              "{reaction}"
            </p>
          </div>

          {/* Offer Memorandum Preview */}
          <div className="flex-1 rounded-xl border border-edge bg-fg/[0.01] p-4 font-mono text-[11.5px] space-y-2">
            <div className="flex items-center justify-between border-b border-edge pb-2 text-[10.5px] text-ink-4 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <FileCheck2 className="h-3.5 w-3.5 text-brand" /> Offer Memo Preview
              </span>
              <span>CONFIDENTIAL</span>
            </div>

            <div className="space-y-1 text-ink-3">
              <div>
                <span className="text-ink-4">CANDIDATE:</span> Jet Timothy V. Cerezo
              </div>
              <div>
                <span className="text-ink-4">POSITION:</span> {activeRole.title}
              </div>
              <div>
                <span className="text-ink-4">PACKAGE:</span>{" "}
                <strong className="text-ink-1">{displaySalary}</strong>
              </div>
              <div>
                <span className="text-ink-4">SETUP:</span> {activeWorkModel.label}
              </div>
              <div>
                <span className="text-ink-4">START:</span>{" "}
                {startDate === "immediate" ? "Immediate" : startDate === "2-weeks" ? "2-Week Notice" : "30 Days"}
              </div>
              <div className="pt-1 text-[11px] text-ink-4">
                <span className="text-ink-3 font-medium">Perks:</span> {selectedPerks.length} key incentives active
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleSendEmail}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-fg px-4 py-2.5 text-[13.5px] font-semibold text-bg transition-opacity hover:opacity-90 shadow-sm"
            >
              <Send className="h-4 w-4" />
              <span>Send Official Offer to Jet via Email</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-edge-strong bg-bg px-3 py-2 text-[12px] text-ink-2 transition-colors hover:border-fg/40 hover:text-ink-1"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-brand" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied Letter!" : "Copy Markdown"}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadJson}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-edge-strong bg-bg px-3 py-2 text-[12px] text-ink-2 transition-colors hover:border-fg/40 hover:text-ink-1"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export (.json)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
