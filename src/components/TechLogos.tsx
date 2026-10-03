import { useState } from "react";

// Official Simple Icons slugs mapping for frameworks, languages, databases, DevOps & testing tools
interface TechMeta {
  slug: string;
  invertDark?: boolean;
}

const TECH_SLUGS: Record<string, TechMeta> = {
  // Front End
  react: { slug: "react" },
  next: { slug: "nextdotjs", invertDark: true },
  "next.js": { slug: "nextdotjs", invertDark: true },
  nextjs: { slug: "nextdotjs", invertDark: true },
  typescript: { slug: "typescript" },
  ts: { slug: "typescript" },
  javascript: { slug: "javascript" },
  js: { slug: "javascript" },
  flutter: { slug: "flutter" },
  flutterflow: { slug: "flutter" },
  dart: { slug: "dart" },
  riverpod: { slug: "flutter" },
  tailwind: { slug: "tailwindcss" },
  "tailwind css": { slug: "tailwindcss" },
  html: { slug: "html5" },
  html5: { slug: "html5" },
  css: { slug: "css3" },
  css3: { slug: "css3" },
  vite: { slug: "vite" },
  vercel: { slug: "vercel", invertDark: true },

  // Back End
  node: { slug: "nodedotjs" },
  "node.js": { slug: "nodedotjs" },
  express: { slug: "express", invertDark: true },
  nest: { slug: "nestjs" },
  "nest.js": { slug: "nestjs" },
  python: { slug: "python" },
  java: { slug: "openjdk" },
  "c/c++": { slug: "cplusplus" },
  "c++": { slug: "cplusplus" },
  php: { slug: "php" },

  // Databases
  postgresql: { slug: "postgresql" },
  postgres: { slug: "postgresql" },
  mongodb: { slug: "mongodb" },
  mysql: { slug: "mysql" },
  sqlite: { slug: "sqlite" },
  "sqlite (drift)": { slug: "sqlite" },
  drift: { slug: "sqlite" },
  supabase: { slug: "supabase" },

  // DevOps & Cloud
  docker: { slug: "docker" },
  "docker compose": { slug: "docker" },
  aws: { slug: "amazonwebservices" },
  git: { slug: "git" },
  "github actions": { slug: "githubactions" },
  gitlab: { slug: "gitlab" },
  linux: { slug: "linux" },
  "linux ci runners": { slug: "linux" },

  // Automation & QA
  appium: { slug: "appium" },
  browserstack: { slug: "browserstack" },
  postman: { slug: "postman" },
  jira: { slug: "jira" },

  // AI & APIs
  claude: { slug: "anthropic" },
  "claude api": { slug: "anthropic" },
  gemini: { slug: "googlegemini" },
  "gemini api": { slug: "googlegemini" },
};

function getTechMeta(name: string): TechMeta | null {
  const norm = name.toLowerCase().trim();
  if (TECH_SLUGS[norm]) return TECH_SLUGS[norm];

  for (const [key, meta] of Object.entries(TECH_SLUGS)) {
    if (norm.includes(key)) return meta;
  }
  return null;
}

// TechLogo: Fetches official SVG logos from Simple Icons CDN with graceful SVG fallback
export function TechLogo({ name, className = "h-3 w-3" }: { name: string; className?: string }) {
  const [hasError, setHasError] = useState(false);
  const meta = getTechMeta(name);

  if (!meta || hasError) {
    // Subtle vector code bracket fallback
    return (
      <svg
        className={`${className} shrink-0 opacity-70`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  }

  return (
    <img
      src={`https://cdn.simpleicons.org/${meta.slug}`}
      alt=""
      aria-hidden="true"
      loading="lazy"
      onError={() => setHasError(true)}
      className={`${className} shrink-0 object-contain ${meta.invertDark ? "dark:invert" : ""}`}
    />
  );
}

// CompanyLogo: Official company logos fetched and hosted locally in /logos/
export function CompanyLogo({ company, className = "h-5 w-5" }: { company: string; className?: string }) {
  const norm = company.toLowerCase();

  // Converge Studios Inc.
  if (norm.includes("converge")) {
    return (
      <img
        src="/logos/converge.png"
        alt="Converge Studios logo"
        className={`object-contain shrink-0 rounded-xs ${className}`}
        loading="lazy"
      />
    );
  }

  // Billease Fintech
  if (norm.includes("billease")) {
    return (
      <img
        src="/logos/billease.png"
        alt="Billease logo"
        className={`object-contain shrink-0 rounded-xs ${className}`}
        loading="lazy"
      />
    );
  }

  // International Rice Research Institute (IRRI)
  if (norm.includes("rice") || norm.includes("irri")) {
    return (
      <img
        src="/logos/irri.svg"
        alt="IRRI logo"
        className={`object-contain shrink-0 rounded-xs ${className}`}
        loading="lazy"
      />
    );
  }

  // University of the Philippines Los Baños (UPLB)
  if (norm.includes("uplb") || norm.includes("society") || norm.includes("philippines")) {
    return (
      <img
        src="/logos/uplb.png"
        alt="UPLB seal"
        className={`object-contain shrink-0 rounded-xs ${className}`}
        loading="lazy"
      />
    );
  }

  // Default clean badge
  return (
    <div
      className={`flex items-center justify-center rounded border border-edge bg-fg/[0.04] text-ink-3 shrink-0 ${className}`}
      aria-hidden="true"
    >
      <span className="text-[9px] font-bold font-mono">{(company[0] || "C").toUpperCase()}</span>
    </div>
  );
}

// CompanyBrandStrip: Minimal, compact horizontal bar of Jet's engineering affiliations
export function CompanyBrandStrip() {
  const partners = [
    {
      name: "Converge Studios",
      sub: "Software Engineer",
      companyKey: "Converge Studios Inc.",
    },
    {
      name: "Billease",
      sub: "Fintech QA",
      companyKey: "Billease",
    },
    {
      name: "IRRI Genomics",
      sub: "Microservices",
      companyKey: "International Rice Research Institute (IRRI)",
    },
    {
      name: "UPLB",
      sub: "BS Comp Sci",
      companyKey: "UPLB",
    },
  ];

  return (
    <div className="pt-1">
      <div className="text-[11px] font-mono uppercase tracking-wider text-ink-4 mb-2.5">
        Production Engineering &amp; Affiliations
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {partners.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-2.5 rounded-xl border border-edge bg-fg/[0.02] p-2 hover:border-edge-strong hover:bg-bg transition-colors"
          >
            <CompanyLogo company={p.companyKey} className="h-6 w-6 shrink-0 rounded-md" />
            <div className="min-w-0">
              <div className="font-semibold text-xs text-ink-1 truncate">{p.name}</div>
              <div className="font-mono text-[10px] text-ink-4 truncate">{p.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
