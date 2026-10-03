import { useState, useEffect } from "react";
import {
  Layers,
  Smartphone,
  Briefcase,
} from "lucide-react";
import { ArchitectureVisualizer } from "./ArchitectureVisualizer";
import { LiveMobileShowcase } from "./LiveMobileShowcase";
import { OfferCalculator } from "./OfferCalculator";

interface EngineeringLabsProps {
  initialTab?: "architecture" | "demo" | "offer";
}

export function EngineeringLabs({ initialTab = "architecture" }: EngineeringLabsProps) {
  const [activeLab, setActiveLab] = useState<"architecture" | "demo" | "offer">(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveLab(initialTab);
    }
  }, [initialTab]);

  return (
    <div id="labs" className="scroll-mt-16">
      {/* Section Header */}
      <div className="reveal">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-ink-4">
            <span className="text-brand">03 //</span>
            <span>Interactive Engineering Labs</span>
          </div>
          <span className="font-mono text-[11px] text-ink-4">Live Runtimes &amp; System Prototyping</span>
        </div>
        <div className="mt-1.5 h-px w-full bg-edge-strong" />
      </div>

      {/* Intro paragraph */}
      <p className="mt-4 text-[14.5px] sm:text-[15px] leading-relaxed text-ink-2 max-w-2xl reveal">
        Interactive sandboxes demonstrating production system architecture, mobile runtimes, offline data synchronization, and a custom offer compensation builder for hiring teams.
      </p>

      {/* Tab Switcher HUD */}
      <div className="reveal mt-6">
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl border border-edge bg-fg/[0.02] backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveLab("architecture")}
            className={`flex-1 min-w-[200px] flex items-center justify-center gap-2.5 rounded-xl px-4 py-2.5 font-mono text-[12px] uppercase tracking-wider transition-all duration-200 ${
              activeLab === "architecture"
                ? "bg-fg text-bg font-semibold shadow-md"
                : "text-ink-3 hover:text-ink-1 hover:bg-fg/5"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>01 · System Architecture</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLab("demo")}
            className={`flex-1 min-w-[200px] flex items-center justify-center gap-2.5 rounded-xl px-4 py-2.5 font-mono text-[12px] uppercase tracking-wider transition-all duration-200 ${
              activeLab === "demo"
                ? "bg-fg text-bg font-semibold shadow-md"
                : "text-ink-3 hover:text-ink-1 hover:bg-fg/5"
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span>02 · Sandalan Mobile Lab</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLab("offer")}
            className={`flex-1 min-w-[200px] flex items-center justify-center gap-2.5 rounded-xl px-4 py-2.5 font-mono text-[12px] uppercase tracking-wider transition-all duration-200 ${
              activeLab === "offer"
                ? "bg-fg text-bg font-semibold shadow-md"
                : "text-ink-3 hover:text-ink-1 hover:bg-fg/5"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>03 · Quick Offer Builder</span>
          </button>
        </div>
      </div>

      {/* Active Lab Body */}
      <div className="mt-6">
        {activeLab === "architecture" && (
          <div className="space-y-4">
            <ArchitectureVisualizer />
          </div>
        )}

        {activeLab === "demo" && (
          <div className="space-y-4">
            <LiveMobileShowcase />
          </div>
        )}

        {activeLab === "offer" && (
          <div className="space-y-4">
            <OfferCalculator />
          </div>
        )}
      </div>
    </div>
  );
}
