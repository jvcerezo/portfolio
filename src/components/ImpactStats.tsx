import { Code2, GitMerge, Bug, Server, Trophy, Database } from 'lucide-react';

const STATS = [
  {
    icon: Code2,
    value: '15,000+',
    label: 'Lines of Flutter',
    detail: 'Sandalan app shipped solo on Google Play',
  },
  {
    icon: GitMerge,
    value: '50+ / 30k+',
    label: 'MRs & Automation LOC',
    detail: 'High-scale consumer fintech at Billease',
  },
  {
    icon: Bug,
    value: '30+',
    label: 'Critical Bugs Caught',
    detail: 'Pre-deployment gatekeeper with Appium',
  },
  {
    icon: Server,
    value: '7 Services',
    label: 'Docker Microservices',
    detail: 'Rewrote IRRI legacy monolith to MERN',
  },
  {
    icon: Trophy,
    value: '1st Place',
    label: 'Hackathon Champion',
    detail: 'Codebreak 2.0 RAG AI built in <24 hours',
  },
  {
    icon: Database,
    value: '38+',
    label: 'Bank & System Integrations',
    detail: 'Automated banking & offline sync in Sandalan',
  },
];

export function ImpactStats() {
  return (
    <div className="reveal mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {STATS.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-lg border border-edge bg-fg/[0.02] p-3.5 transition-all duration-200 hover:border-edge-strong hover:bg-fg/[0.04]"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-4">
                {stat.label}
              </span>
              <Icon className="h-3.5 w-3.5 text-ink-4 transition-colors group-hover:text-brand" aria-hidden="true" />
            </div>
            <div className="mt-2 font-display text-[22px] font-semibold tracking-tight text-ink-1 sm:text-[24px]">
              {stat.value}
            </div>
            <p className="mt-1 text-[12px] leading-snug text-ink-3">
              {stat.detail}
            </p>
          </div>
        );
      })}
    </div>
  );
}
