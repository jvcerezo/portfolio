import {
  Clock,
  Trophy,
  Smartphone,
  Server,
  GitMerge,
  ShieldCheck,
} from 'lucide-react';

const METRICS = [
  {
    icon: Clock,
    value: '2+ Years',
    label: 'Shipping Software',
    detail: 'Building web, mobile apps, and CI/CD pipelines end-to-end',
  },
  {
    icon: Trophy,
    value: '1st Place',
    label: 'AI Hackathon Champion',
    detail: 'Shipped full-stack RAG assistant in <24h at Tenext.ai',
  },
  {
    icon: Smartphone,
    value: '38+ Banks',
    label: 'Live on Google Play',
    detail: 'Solo-built Sandalan with offline SQLite-Postgres sync',
  },
  {
    icon: Server,
    value: '7 Services',
    label: 'Docker Microservices',
    detail: 'Decoupled IRRI Java monolith into Node.js & MongoDB',
  },
  {
    icon: GitMerge,
    value: '100+ MRs',
    label: 'Fintech Automation',
    detail: 'Shipped automated test suites & tooling at Billease',
  },
  {
    icon: ShieldCheck,
    value: '30+ Bugs',
    label: 'Critical Bugs Prevented',
    detail: 'Pre-release gatekeeper using Appium & Linux CI runners',
  },
];

export function ImpactStats() {
  return (
    <div className="reveal mt-3.5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5">
      {METRICS.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.label}
            className="group relative flex flex-col justify-between rounded-lg border border-edge bg-fg/[0.02] p-3.5 transition-all duration-200 hover:border-edge-strong hover:bg-fg/[0.04]"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink-4">
                  {metric.label}
                </span>
                <Icon className="h-3.5 w-3.5 text-ink-4 transition-colors group-hover:text-brand" aria-hidden="true" />
              </div>
              <div className="mt-2 font-display text-[22px] font-semibold tracking-tight text-ink-1 sm:text-[24px]">
                {metric.value}
              </div>
            </div>
            <p className="mt-2 text-[12px] leading-snug text-ink-3">
              {metric.detail}
            </p>
          </div>
        );
      })}
    </div>
  );
}
