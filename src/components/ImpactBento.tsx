import { useState } from "react";
import { soundFx } from "../lib/sound";
import { GitPullRequest, Trophy, Layers, Smartphone, ShieldCheck, Terminal } from "lucide-react";

interface MetricItem {
  icon: typeof GitPullRequest;
  value: string;
  label: string;
  sublabel: string;
  detail: string;
  tag: string;
}

const METRICS: MetricItem[] = [
  {
    icon: Trophy,
    value: "1st Place",
    label: "Hackathon Champion",
    sublabel: "Tenext.ai AI Hackathon",
    detail: "Engineered Codebreak 2.0 full-stack AI support platform with vector RAG in under 24 hours.",
    tag: "AI & Groq",
  },
  {
    icon: GitPullRequest,
    value: "150+ PRs",
    label: "~45,000 LOC Shipped",
    sublabel: "Billease Fintech CI/CD",
    detail: "Automated test coverage & Linux CI regression runners as release gatekeeper for millions of users.",
    tag: "Fintech QA",
  },
  {
    icon: Layers,
    value: "7 Services",
    label: "Dockerized Microservices",
    sublabel: "IRRI Genomics Platform",
    detail: "Re-architected legacy Java monolith into MERN microservices with unified API gateway & OAuth SSO.",
    tag: "Architecture",
  },
  {
    icon: Smartphone,
    value: "38+ Banks",
    label: "Google Play Production",
    sublabel: "Sandalan Personal Finance",
    detail: "Solo-engineered offline-first Flutter app with Drift SQLite ↔ Supabase bidirectional sync.",
    tag: "Mobile App",
  },
];

export function ImpactBento() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between text-xs font-mono text-ink-4">
        <span className="flex items-center gap-1.5 uppercase tracking-wider text-ink-3">
          <Terminal className="h-3.5 w-3.5" />
          <span>Production Impact Matrix</span>
        </span>
        <span className="text-[11px] text-ink-5 hidden sm:inline">
          Hover for architectural context
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2">
        {METRICS.map((metric, idx) => {
          const Icon = metric.icon;
          const isSelected = activeIdx === idx;

          return (
            <div
              key={metric.label}
              onMouseEnter={() => {
                soundFx.playPop();
                setActiveIdx(idx);
              }}
              onMouseLeave={() => setActiveIdx(null)}
              onClick={() => {
                soundFx.playNote(idx);
                setActiveIdx(isSelected ? null : idx);
              }}
              className={`group relative overflow-hidden rounded-xl border p-3.5 transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "border-ink-1/40 bg-bg shadow-xl scale-[1.01]"
                  : "border-edge bg-bg/80 hover:bg-bg hover:border-edge-strong hover:shadow-lg"
              }`}
            >
              {/* Subtle top accent shimmer */}
              <div
                className={`absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300 ${
                  isSelected ? "bg-ink-1 opacity-100" : "bg-ink-1/20 opacity-0 group-hover:opacity-100"
                }`}
              />

              <div className="flex items-start justify-between gap-2">
                <div className="p-1.5 rounded-lg border border-edge bg-bg text-ink-1">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-mono text-[10px] text-ink-4 border border-edge rounded px-1.5 py-0.5">
                  {metric.tag}
                </span>
              </div>

              <div className="mt-3">
                <div className="font-mono text-lg font-bold tracking-tight text-ink-1 sm:text-xl">
                  {metric.value}
                </div>
                <div className="font-semibold text-xs text-ink-2 mt-0.5">
                  {metric.label}
                </div>
                <div className="font-mono text-[11px] text-ink-4 truncate mt-0.5">
                  {metric.sublabel}
                </div>
              </div>

              {/* Reveal detail drawer */}
              {isSelected && (
                <div className="mt-2.5 pt-2 border-t border-edge text-[11px] leading-relaxed text-ink-3 animate-reveal">
                  <div className="flex items-center gap-1 font-mono text-[10px] text-ink-2 mb-1">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Verified Production Metric</span>
                  </div>
                  {metric.detail}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
