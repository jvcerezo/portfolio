import {
  Smartphone,
  GitMerge,
  Trophy,
  ArrowUpRight,
  Play,
  Layers,
  ShieldCheck,
  ChevronRight,
  Briefcase,
} from "lucide-react";

interface BentoGridProps {
  onOpenSandalanScreenshots: () => void;
  onLaunchSandalanLab: () => void;
  onLaunchArchitectureLab: () => void;
  onLaunchOfferLab: () => void;
}

export function BentoGrid({
  onOpenSandalanScreenshots,
  onLaunchSandalanLab,
  onLaunchArchitectureLab,
  onLaunchOfferLab,
}: BentoGridProps) {
  const previewScreens = [
    { title: "Home Dashboard", src: "/sandalan/01-home.jpg" },
    { title: "Life Roadmap", src: "/sandalan/02-tracker.jpg" },
    { title: "AI Assistant", src: "/sandalan/03-chat.jpg" },
    { title: "Bank Ledger", src: "/sandalan/04-transactions.jpg" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5">
      {/* ============================================================== */}
      {/* BENTO CARD 1: SANDALAN (HERO FLAGSHIP) - Spans 12 or 7 cols     */}
      {/* ============================================================== */}
      <div className="md:col-span-12 lg:col-span-7 flex flex-col justify-between overflow-hidden rounded-2xl border border-edge bg-fg/[0.02] p-5 sm:p-7 transition-all duration-300 hover:border-brand/40 hover:bg-fg/[0.03] group relative">
        {/* Subtle decorative glow */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand/10 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />

        <div>
          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-brand animate-dot" />
              <span className="rounded-full border border-brand/40 bg-brand/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand">
                Flagship Project · Live on Google Play
              </span>
            </div>
            <span className="font-mono text-[11px] text-ink-4">2024 — 2025</span>
          </div>

          {/* Title & Tagline */}
          <div className="mt-4">
            <h3 className="font-display text-[22px] sm:text-[26px] font-semibold tracking-tight text-ink-1 flex items-center gap-2">
              <span>Sandalan</span>
              <span className="text-[14px] font-mono text-ink-4 font-normal">
                (Filipino Adulting OS)
              </span>
            </h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2 max-w-xl">
              Solo-engineered and shipped to Google Play: financial ledger with 38+ bank integrations, TRAIN Law statutory tax calculators, OCR receipt scanner, and conversational Taglish AI assistant.
            </p>
          </div>

          {/* Architectural highlight pill */}
          <div className="mt-4 rounded-xl border border-edge bg-bg/80 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 font-mono text-[11px] font-medium text-brand">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Offline-First Bidirectional Sync Engine</span>
            </div>
            <p className="mt-1 text-[12.5px] leading-snug text-ink-3">
              Custom conflict resolution with timestamp vectors syncing local Drift SQLite and Supabase PostgreSQL with AES-256 encryption.
            </p>
          </div>

          {/* Interactive Mini Screen Preview Strip */}
          <div className="mt-5">
            <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider text-ink-4 mb-2">
              <span>Real Android Production Screens</span>
              <button
                type="button"
                onClick={onOpenSandalanScreenshots}
                className="text-brand hover:underline flex items-center gap-0.5"
              >
                <span>View all 8 screens</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {previewScreens.map((s) => (
                <div
                  key={s.title}
                  onClick={() => {
                    onOpenSandalanScreenshots();
                  }}
                  className="group/thumb cursor-pointer overflow-hidden rounded-lg border border-edge bg-black aspect-[9/16] relative transition-transform hover:scale-105 hover:border-brand/50"
                >
                  <img
                    src={s.src}
                    alt={s.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center p-1">
                    <span className="font-mono text-[9px] text-white text-center font-medium leading-tight">
                      {s.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-edge flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onLaunchSandalanLab}
            className="inline-flex items-center gap-2 rounded-lg bg-fg px-4 py-2 font-mono text-[11.5px] font-medium text-bg shadow-sm transition-all hover:opacity-90 hover:scale-[1.02]"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Launch Interactive Showcase</span>
          </button>
          <a
            href="https://play.google.com/store/apps/details?id=com.jvcerezo.exitplan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-edge-strong bg-fg/[0.03] px-3.5 py-2 font-mono text-[11.5px] text-ink-2 transition-all hover:border-brand hover:text-brand hover:bg-fg/[0.06]"
          >
            <Smartphone className="h-3.5 w-3.5 text-brand" />
            <span>Google Play</span>
            <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
          </a>
          <button
            type="button"
            onClick={onOpenSandalanScreenshots}
            className="inline-flex items-center gap-1.5 rounded-lg border border-edge px-3.5 py-2 font-mono text-[11.5px] text-ink-3 transition-colors hover:text-ink-1 hover:border-edge-strong"
          >
            <span>Screenshots (8)</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BENTO CARD 2: BILLEASE FINTECH QA AUTOMATION - Spans 5 cols    */}
      {/* ============================================================== */}
      <div className="md:col-span-12 lg:col-span-5 flex flex-col justify-between overflow-hidden rounded-2xl border border-edge bg-fg/[0.02] p-5 sm:p-7 transition-all duration-300 hover:border-brand/40 hover:bg-fg/[0.03] group relative">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full border border-edge-strong px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-4">
              Fintech · Billease
            </span>
            <span className="font-mono text-[11px] text-ink-4">2025 — 2026</span>
          </div>

          <h3 className="mt-4 font-display text-[20px] sm:text-[22px] font-semibold tracking-tight text-ink-1">
            Fintech Automation &amp; Release Gatekeeper
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-3">
            Core test automation engineer for a high-volume consumer fintech Android app. Validated regression and hotfix suites across Linux CI runners before every production deploy.
          </p>

          {/* Big Stat Callout */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-edge bg-bg/60 p-3.5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-4">
                Shipped Code
              </div>
              <div className="mt-1 font-display text-[24px] font-bold text-ink-1">
                ~150 MRs
              </div>
              <p className="text-[11px] text-ink-4 mt-0.5">~45,000 LOC authored</p>
            </div>
            <div className="rounded-xl border border-edge bg-bg/60 p-3.5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-4">
                Pre-Release Quality
              </div>
              <div className="mt-1 font-display text-[24px] font-bold text-brand">
                30+ Bugs
              </div>
              <p className="text-[11px] text-ink-4 mt-0.5">Critical bugs caught</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[10.5px] text-ink-4">
            <span className="rounded bg-fg/[0.04] px-2 py-0.5 border border-edge">Appium</span>
            <span className="rounded bg-fg/[0.04] px-2 py-0.5 border border-edge">BrowserStack</span>
            <span className="rounded bg-fg/[0.04] px-2 py-0.5 border border-edge">Linux CI</span>
            <span className="rounded bg-fg/[0.04] px-2 py-0.5 border border-edge">Claude API</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-edge flex items-center justify-between font-mono text-[11px] text-ink-3">
          <button
            type="button"
            onClick={onLaunchOfferLab}
            className="inline-flex items-center gap-1.5 text-brand hover:underline font-medium"
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>Open Quick Offer Builder</span>
            <ChevronRight className="h-3 w-3" />
          </button>
          <GitMerge className="h-4 w-4 text-ink-4" />
        </div>
      </div>

      {/* ============================================================== */}
      {/* BENTO CARD 3: IRRI MICROSERVICES RE-ARCHITECTURE - 6 cols      */}
      {/* ============================================================== */}
      <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-between overflow-hidden rounded-2xl border border-edge bg-fg/[0.02] p-5 sm:p-6 transition-all duration-300 hover:border-brand/40 hover:bg-fg/[0.03] group">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full border border-edge-strong px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-4">
              Genomics Microservices · IRRI
            </span>
            <span className="font-mono text-[11px] text-ink-4">Research Platform</span>
          </div>

          <h3 className="mt-3 font-display text-[19px] sm:text-[21px] font-semibold tracking-tight text-ink-1">
            IRRI SNPseek Monolith Decoupling
          </h3>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-3">
            Rewrote IRRI’s legacy Java monolith genomics database into 7 containerized Node.js/Express microservices orchestrated with Docker Compose behind an Express API gateway. Built custom OAuth/SSO layer bridging enterprise systems.
          </p>

          {/* Mini Flow Diagram */}
          <div className="mt-4 rounded-xl border border-edge bg-bg/60 p-3 font-mono text-[11px]">
            <div className="flex items-center justify-between text-ink-4 text-[10px] uppercase mb-1">
              <span>Architecture Stream</span>
              <span className="text-brand">Docker Compose</span>
            </div>
            <div className="flex items-center gap-1.5 text-ink-2 overflow-x-auto py-1">
              <span className="px-2 py-0.5 rounded bg-fg/5 border border-edge shrink-0">React UI</span>
              <span className="text-ink-5">→</span>
              <span className="px-2 py-0.5 rounded bg-brand/10 border border-brand/30 text-brand shrink-0">API Gateway</span>
              <span className="text-ink-5">→</span>
              <span className="px-2 py-0.5 rounded bg-fg/5 border border-edge shrink-0">7 Services</span>
              <span className="text-ink-5">→</span>
              <span className="px-2 py-0.5 rounded bg-fg/5 border border-edge shrink-0">MongoDB</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-edge flex items-center justify-between">
          <button
            type="button"
            onClick={onLaunchArchitectureLab}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-brand hover:underline font-medium"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Inspect System Design Flow</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
          <a
            href="https://snpseek-mern.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-4 hover:text-ink-1"
          >
            <span>snpseek-mern.vercel.app</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BENTO CARD 4: AI HACKATHON CHAMPION - CODEBREAK 2.0 - 6 cols   */}
      {/* ============================================================== */}
      <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-between overflow-hidden rounded-2xl border border-edge bg-fg/[0.02] p-5 sm:p-6 transition-all duration-300 hover:border-brand/40 hover:bg-fg/[0.03] group">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full border border-brand/40 bg-brand/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              <span>1st Place Winner</span>
            </span>
            <span className="font-mono text-[11px] text-ink-4">Tenext.ai 2025</span>
          </div>

          <h3 className="mt-3 font-display text-[19px] sm:text-[21px] font-semibold tracking-tight text-ink-1">
            Codebreak 2.0 · RAG AI Support Platform
          </h3>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-3">
            Full-stack customer support intelligence platform engineered in under 24 hours. Built vector search retrieval pipelines, real-time call transcription guidance, and automated compliance auditing using Claude API &amp; Groq.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center font-mono">
            <div className="rounded-lg border border-edge bg-bg/60 p-2.5">
              <div className="text-[10px] uppercase text-ink-4">Hackathon</div>
              <div className="text-[13px] font-bold text-brand mt-0.5">&lt; 24 Hours</div>
            </div>
            <div className="rounded-lg border border-edge bg-bg/60 p-2.5">
              <div className="text-[10px] uppercase text-ink-4">AI Stack</div>
              <div className="text-[13px] font-bold text-ink-1 mt-0.5">Claude + Groq</div>
            </div>
            <div className="rounded-lg border border-edge bg-bg/60 p-2.5">
              <div className="text-[10px] uppercase text-ink-4">Architecture</div>
              <div className="text-[13px] font-bold text-ink-1 mt-0.5">RAG Microservices</div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-edge flex items-center justify-between">
          <a
            href="https://www.facebook.com/photo/?fbid=706685865053901&set=a.263981095991049"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-brand hover:underline font-medium"
          >
            <Trophy className="h-3.5 w-3.5" />
            <span>Award Verification Post</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
          <button
            type="button"
            onClick={onLaunchArchitectureLab}
            className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-4 hover:text-ink-1"
          >
            <span>RAG Architecture Flow</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
