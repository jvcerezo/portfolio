import { Fragment, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Download,
  ArrowUpRight,
  Sun,
  Moon,
  Copy,
  Check,
  Smartphone,
  Filter,
} from "lucide-react";
import { TimezoneWidget } from "./components/TimezoneWidget";
import { ArchitectureVisualizer } from "./components/ArchitectureVisualizer";
import { ScreenshotModal, type ScreenshotItem } from "./components/ScreenshotModal";
import { Toast } from "./components/Toast";

const NAV_ITEMS = [
  { id: "about", num: "01", label: "About" },
  { id: "experience", num: "02", label: "Experience" },
  { id: "architecture", num: "03", label: "Architecture" },
  { id: "work", num: "04", label: "Projects" },
  { id: "honors", num: "05", label: "Honors" },
  { id: "skills", num: "06", label: "Stack" },
  { id: "contact", num: "07", label: "Contact" },
];

const NAV_IDS = NAV_ITEMS.map((n) => n.id);

const PROFILE = {
  name: "Jet Timothy V. Cerezo",
  title: "Software Engineer",
  email: "jetjetcerezo@gmail.com",
  gmailCompose:
    "https://mail.google.com/mail/?view=cm&fs=1&to=jetjetcerezo@gmail.com&su=Hello%20Jet",
  phone: "+63 998 914 8907",
  phoneHref: "tel:+639989148907",
  location: "Los Baños, Laguna, Philippines",
  availability: "UTC+8 · Open to US Hours",
  github: "https://github.com/jvcerezo",
  linkedin: "https://www.linkedin.com/in/jet-timothy-cerezo-126903254",
  resume: "/JetCerezo_Resume.pdf",
};

const SUMMARY = [
  "Full-stack software engineer with 2+ years building and shipping production web and mobile applications across front end, back end, and QA automation. I rebuilt IRRI’s legacy Java monolith research platform into a MERN microservices architecture — seven Dockerized Node.js and Express services behind a single API gateway.",
  "Most of what I ship, I ship end-to-end: designing schemas, wiring REST APIs, building responsive UIs, running CI/CD pipelines, and reading production logs after deploy. I work comfortably in Agile teams and across Linux and Windows environments.",
];

const EXPERIENCE = [
  {
    role: "Junior Test Automation Engineer",
    company: "Billease",
    meta: "Remote · Fintech",
    period: "Apr 2025 — Present",
    bullets: [
      "Shipped 50+ merge requests and 30,000+ lines of code building automated test coverage and internal tooling for a high-scale consumer-fintech Android app.",
      "Engineered and maintained CI/CD pipeline integrations for the core regression and emergency-hotfix suites, validating every production release across Linux CI runners.",
      "Discovered and resolved 30+ critical, high-impact bugs using Appium and BrowserStack as the final technical gatekeeper before deployment.",
      "Integrated Claude/AI into the automation workflow to accelerate test script development and root-cause debugging.",
      "Work in Agile/Scrum ceremonies — sprint planning, daily standups, and retrospectives — collaborating with developers and QA across every release cycle.",
    ],
    tech: ["CI/CD", "Appium", "BrowserStack", "Linux", "Claude API", "Fintech"],
  },
  {
    role: "Software Developer · Thesis Affiliate",
    company: "International Rice Research Institute (IRRI)",
    meta: "Los Baños, Laguna",
    period: "Jul 2024 — May 2025",
    bullets: [
      "Re-architected IRRI’s legacy Java monolith SNPseek genomics platform into a MERN microservices system: seven independent Node.js/Express services behind a single API gateway, orchestrated with Docker Compose.",
      "Re-engineered authentication and data access layers, building a custom SSO/OAuth layer that bridged legacy enterprise systems with the new Node services.",
      "Designed MongoDB schemas and REST/JSON endpoints for large-scale genomic datasets, and built the React front end with multi-criteria filtering and interactive charts.",
    ],
    tech: ["Java", "Node.js", "Express", "React", "MongoDB", "Docker", "Microservices", "OAuth/SSO"],
  },
  {
    role: "Full-Stack Developer",
    company: "Freelance / Project-Based",
    meta: "Remote",
    period: "Aug 2024 — Oct 2024",
    bullets: [
      "Built a story-based interactive web game on the MERN stack with a 3-person team; owned front end, back end, and UI/UX through to client delivery.",
    ],
    tech: ["MongoDB", "Express", "React", "Node.js"],
  },
  {
    role: "Code Wars Co-Head · Project Manager",
    company: "UPLB Computer Science Society",
    meta: "Los Baños, Laguna",
    period: "Oct 2023 — Jul 2025",
    bullets: [
      "Led a 7-member development team on the competitive-programming event platform, overseeing feature development, bug tracking, testing, and deployment.",
      "Ran the live platform for 20 teams, 3 judges, and 3 continuous hours of zero-downtime service.",
    ],
    tech: ["Leadership", "Deployment", "Testing", "Event Ops"],
  },
];

interface Project {
  name: string;
  tagline: string;
  year: string;
  description: string;
  tech: string[];
  link: string | null;
  badge: string | null;
  category: "web" | "mobile" | "ai" | "fullstack";
  featured?: boolean;
  hasScreenshots?: boolean;
}

const PROJECTS: Project[] = [
  {
    name: "Sandalan",
    tagline: "Filipino adulting and finance app, live on Google Play",
    year: "2024 — 2025",
    description:
      "Solo-built and shipped: 38+ bank integrations, tax calculators, OCR receipt scanning, and an AI chat assistant. Architected an offline-first bidirectional sync engine with conflict resolution, incremental replication, and retry/failure recovery between local SQLite (Drift) and PostgreSQL (Supabase), secured with row-level security and local encryption.",
    tech: ["Flutter", "Dart", "Riverpod", "Supabase", "PostgreSQL", "SQLite (Drift)", "OCR", "AI"],
    link: "https://play.google.com/store/apps/details?id=com.jvcerezo.exitplan",
    badge: "Google Play",
    category: "mobile",
    featured: true,
    hasScreenshots: true,
  },
  {
    name: "SNPseek MERN",
    tagline: "Genomics microservices platform · IRRI",
    year: "2024 — 2025",
    description:
      "Rewrite of IRRI’s legacy Java monolith SNPseek platform into seven independent Node.js/Express services behind an API gateway, orchestrated with Docker Compose. Advanced multi-criteria filtering and interactive charts over large genomic datasets.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Docker", "API Gateway", "SSO"],
    link: "https://snpseek-mern.vercel.app",
    badge: "IRRI Research",
    category: "fullstack",
    featured: true,
  },
  {
    name: "Codebreak 2.0",
    tagline: "RAG-based AI support platform — 1st place, Tenext.ai hackathon",
    year: "2025",
    description:
      "Full-stack AI platform for customer-support agents with a RAG assistant, automated live call scripts, and post-call QA analytics. Owned REST APIs, microservices, deployment, and AI integration end-to-end, shipping a working MVP in under 24 hours.",
    tech: ["Node.js", "Microservices", "RAG", "REST APIs", "Claude API", "Groq"],
    link: "https://www.facebook.com/photo/?fbid=706685865053901&set=a.263981095991049",
    badge: "1st Place Winner",
    category: "ai",
    featured: true,
  },
  {
    name: "IskOS",
    tagline: "Academic OS for UPLB Students",
    year: "2024 — 2025",
    description:
      "Unified academic dashboard for University of the Philippines Los Baños students with course tracking, schedule management, and Google Calendar sync.",
    tech: ["React", "TypeScript", "Supabase", "Google Calendar API", "Tailwind CSS"],
    link: "https://isk-os.vercel.app",
    badge: "In Dev",
    category: "web",
  },
  {
    name: "PICSEL",
    tagline: "Reservation system · 20-developer team",
    year: "2024",
    description:
      "Built back-end components over 5 months in a 20-developer team; integrated Google authentication and shipped across 7 features with peer code review.",
    tech: ["Node.js", "PostgreSQL", "OAuth", "Team Leadership"],
    link: null,
    badge: null,
    category: "fullstack",
  },
  {
    name: "SOSC3 Advocacy",
    tagline: "Civic tech advocacy platform",
    year: "2023",
    description:
      "Social advocacy web application for community engagement and awareness campaigns, built during UPLB Computer Science Society events.",
    tech: ["React", "Tailwind CSS", "Vercel"],
    link: "https://sosc3-advocacy-app.vercel.app",
    badge: null,
    category: "web",
  },
  {
    name: "Maralit Dental Clinic",
    tagline: "Healthcare appointment & patient record management",
    year: "2024",
    description:
      "Full-stack dental clinic appointment scheduling and patient records management system with automated status tracking.",
    tech: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    link: "https://mdcas-fe.vercel.app",
    badge: null,
    category: "web",
  },
  {
    name: "Diet Plan Calculator",
    tagline: "Personalized nutrition planner",
    year: "2023",
    description:
      "Health application calculating personalized nutrition recommendations, macro breakdowns, and calorie targets.",
    tech: ["React", "Node.js", "Express", "MERN"],
    link: "https://diet-plan-calculator.vercel.app",
    badge: null,
    category: "web",
  },
];

const HONORS = [
  {
    title: "Codebreak 2.0 Hackathon Champion",
    award: "1st Place · Tenext.ai Hackathon",
    period: "2025",
    detail:
      "Engineered a full-stack RAG customer support intelligence platform in under 24 hours with live call scripts and post-call QA analytics.",
    link: "https://www.facebook.com/photo/?fbid=706685865053901&set=a.263981095991049",
    badge: "1st Place",
  },
  {
    title: "UPLB Computer Science Honor Roll",
    award: "Academic Excellence · UP Los Baños",
    period: "2021 — 2025",
    detail:
      "Graduated BS Computer Science with Honor Roll distinction; recipient of the Provincial Government of Laguna Academic Scholarship & UP SLAS Scholarship.",
    link: null,
    badge: "Honor Roll",
  },
  {
    title: "Code Wars Co-Head · Zero Downtime",
    award: "Event Platform Engineering",
    period: "2023 — 2025",
    detail:
      "Led a 7-member team delivering 3 hours of continuous live competition for 20 teams and 3 judges with zero downtime.",
    link: null,
    badge: "Leadership",
  },
  {
    title: "Bioinformatics Thesis Affiliate · IRRI",
    award: "Research Affiliate",
    period: "2024 — 2025",
    detail:
      "Genomics data tooling affiliate at the International Rice Research Institute (IRRI), migrating legacy Java systems to Dockerized MERN microservices.",
    link: null,
    badge: "Research",
  },
];

const SANDALAN_SCREENSHOTS: ScreenshotItem[] = [
  {
    src: "/sandalan/feature.png",
    title: "Sandalan Overview & Feature Graphic",
    description:
      "The all-in-one Filipino adulting and financial companion with 38+ bank integrations, government guides, and AI assistant.",
  },
  {
    src: "/sandalan/screen-1.png",
    title: "Step-by-Step Government Guides",
    description:
      "Interactive, offline-accessible walkthroughs for securing TIN, SSS, PhilSys, Pag-IBIG, and PhilHealth documents.",
  },
  {
    src: "/sandalan/screen-2.png",
    title: "Expense Tracker & Financial Calculators",
    description:
      "Comprehensive budget tracking with offline-first synchronization and local database encryption.",
  },
  {
    src: "/sandalan/screen-3.png",
    title: "1,000+ Government Office Directory",
    description:
      "Instant search and navigation to government agencies nationwide, fully functional without an active internet connection.",
  },
  {
    src: "/sandalan/screen-4.png",
    title: "Taglish AI Assistant & OCR Receipt Scanner",
    description:
      "Automated receipt parsing with OCR and conversational guidance tailored specifically to Philippine adulting requirements.",
  },
];

const SKILLS: [string, string][] = [
  ["Languages", "JavaScript · TypeScript · Java · Python · SQL · PHP · C/C++ · Dart"],
  ["Front End", "React · Next.js · jQuery · HTML5 · CSS3 · Tailwind CSS · Vite · Responsive UI/UX"],
  ["Back End", "Node.js · Express · Nest.js · REST APIs · JSON · Microservices · API Gateway · JWT / OAuth / SSO"],
  ["Databases", "PostgreSQL · MongoDB · MySQL · SQLite · Supabase · Schema Design · Query Optimization"],
  ["DevOps & CI", "Docker · Docker Compose · CI/CD · Git · GitHub · GitLab · Vercel · AWS · Linux & Windows"],
  ["Automation & QA", "Appium · BrowserStack · Unit & E2E Testing · Postman · Jira · Agile/Scrum · Code Review"],
  ["Mobile & AI", "Flutter · Riverpod · Drift · Claude API · Gemini API · RAG Pipelines · Hugging Face · Groq"],
];

const EDUCATION = {
  school: "University of the Philippines Los Baños",
  degree: "Bachelor of Science, Computer Science",
  period: "2021 — 2025",
  meta: "Los Baños, Laguna",
  notes:
    "Graduated Honor Roll; Provincial Government of Laguna Scholarship Recipient. Coursework: Operating Systems, Computer Networks, Cybersecurity, Data Structures & Algorithms, Database Systems.",
};

type Theme = "light" | "dark";

function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem("theme") as Theme | null;
    return stored === "light" || stored === "dark" ? stored : "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    try {
      window.localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  return [theme, () => setTheme((t) => (t === "dark" ? "light" : "dark"))];
}

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string>("about");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      const sectionElements = ids
        .map((id) => ({ id, el: document.getElementById(id) }))
        .filter((item) => item.el !== null);

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const item = sectionElements[i];
        if (item.el && item.el.offsetTop <= scrollPosition) {
          setActive(item.id);
          return;
        }
      }
      if (sectionElements.length > 0) {
        setActive(sectionElements[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [ids]);

  return active;
}

function useRevealOnScroll() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -32px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function Section({
  id,
  num,
  label,
  children,
}: {
  id?: string;
  num?: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-label={label} className="scroll-mt-16 pt-6 first:pt-0">
      <div className="reveal">
        <div className="flex items-center gap-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-ink-4">
          {num && <span className="text-brand">{num} //</span>}
          <span>{label}</span>
        </div>
        <div className="mt-2 h-px w-full bg-edge-strong" />
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function EntryHead({
  title,
  subtitle,
  period,
  meta,
  children,
}: {
  title: ReactNode;
  subtitle: string;
  period: string;
  meta?: string;
  children?: ReactNode;
}) {
  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-display text-[15.5px] font-semibold tracking-tight text-ink-1">
          {title}
          {children}
        </h3>
        <span className="font-mono text-[11px] text-ink-4">{period}</span>
      </div>
      <div className="mt-0.5 flex flex-wrap items-baseline justify-between gap-x-4">
        <p className="text-[14px] text-ink-3">{subtitle}</p>
        {meta && <span className="font-mono text-[11px] text-ink-4">{meta}</span>}
      </div>
    </>
  );
}

function TechLine({ items }: { items: string[] }) {
  return (
    <p className="mt-3 font-mono text-[10.5px] leading-relaxed tracking-[0.06em] text-ink-4">
      {items.join("  ·  ")}
    </p>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((b) => (
        <li
          key={b}
          className="relative pl-4 text-[14.5px] leading-[1.65] text-ink-2 before:absolute before:left-0 before:top-0 before:text-ink-4 before:content-['—']"
        >
          {b}
        </li>
      ))}
    </ul>
  );
}

function ContactLink({
  href,
  icon: Icon,
  children,
  external,
}: {
  href: string;
  icon: typeof Mail;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-brand"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{children}</span>
      {external && <span className="text-[11px] text-ink-4">↗</span>}
    </a>
  );
}

function App() {
  const [theme, toggleTheme] = useTheme();
  const active = useScrollSpy(NAV_IDS);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [isScreenshotOpen, setIsScreenshotOpen] = useState(false);
  const [screenshotIndex, setScreenshotIndex] = useState(0);
  const [projectCategory, setProjectCategory] = useState<string>("all");

  useRevealOnScroll();

  const year = new Date().getFullYear();

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleCopyEmail = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    try {
      navigator.clipboard.writeText(PROFILE.email);
      setCopiedEmail(true);
      setToastMessage("Copied: " + PROFILE.email);
      setIsToastOpen(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      setToastMessage("Email: " + PROFILE.email);
      setIsToastOpen(true);
    }
  };

  const filteredProjects = PROJECTS.filter((p) => {
    if (projectCategory === "all") return true;
    if (projectCategory === "featured") return p.featured;
    if (projectCategory === "web") return p.category === "web" || p.category === "fullstack";
    if (projectCategory === "mobile") return p.category === "mobile";
    if (projectCategory === "ai") return p.category === "ai";
    return true;
  });

  return (
    <div className="min-h-screen bg-bg text-ink-1">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <div className="mx-auto min-h-screen max-w-[1180px] px-6 py-12 md:px-12 md:py-16 lg:px-16 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-14 xl:gap-20">

          {/* ========================================================= */}
          {/* LEFT COLUMN: Sticky Side Navigator                        */}
          {/* ========================================================= */}
          <aside className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[42%] lg:flex-col lg:justify-between lg:py-20 xl:py-24">
            <div>
              {/* Profile Avatar & Top Status */}
              <div className="flex items-center gap-4">
                <picture className="animate-reveal shrink-0">
                  <source srcSet="/profile.webp" type="image/webp" />
                  <img
                    src="/profile.jpg"
                    alt="Jet Timothy Cerezo"
                    width="120"
                    height="120"
                    fetchPriority="high"
                    className="h-16 w-16 rounded-full border border-edge object-cover shadow-sm ring-4 ring-fg/[0.03] sm:h-20 sm:w-20"
                  />
                </picture>
                <div>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-4">
                    Portfolio // {year}
                  </div>
                  <div className="mt-1">
                    <TimezoneWidget />
                  </div>
                </div>
              </div>

              {/* Name & Title */}
              <h1 className="mt-6 font-display text-[32px] font-semibold leading-tight tracking-[-0.03em] text-ink-1 sm:text-[38px]">
                {PROFILE.name}
              </h1>
              <p className="mt-1 text-[16px] font-medium text-ink-2">{PROFILE.title}</p>
              <div className="mt-2.5 flex items-center gap-1.5 font-mono text-[11px] text-ink-4">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                <span>{PROFILE.location}</span>
              </div>
              <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-ink-3">
                Building high-scale microservices, offline-first mobile apps, and automated test pipelines for production software.
              </p>

              {/* SIDE NAVIGATOR LINKS (Desktop) */}
              <nav className="mt-10 hidden lg:block" aria-label="In-page jump links">
                <ul className="space-y-3 font-mono text-[12px] uppercase tracking-[0.14em]">
                  {NAV_ITEMS.map((item) => {
                    const isActive = active === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => go(item.id)}
                          className={`group flex items-center gap-3 py-1 text-left transition-all ${
                            isActive ? "text-ink-1 font-semibold" : "text-ink-4 hover:text-ink-2"
                          }`}
                        >
                          <span
                            className={`h-px transition-all duration-300 ${
                              isActive
                                ? "w-8 bg-brand"
                                : "w-3.5 bg-edge-strong group-hover:w-6 group-hover:bg-ink-3"
                            }`}
                          />
                          <span className={isActive ? "text-brand" : "text-ink-4"}>{item.num}</span>
                          <span>{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* BOTTOM UTILITY: Theme, Resume, Socials */}
            <div className="mt-10 lg:mt-0">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={toggleTheme}
                  aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-edge bg-fg/[0.02] text-ink-3 transition-colors hover:border-edge-strong hover:bg-fg/5 hover:text-ink-1"
                >
                  {theme === "dark" ? (
                    <Sun className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <Moon className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </button>
                <a
                  href={PROFILE.resume}
                  download
                  className="inline-flex items-center gap-1.5 rounded-md border border-edge bg-fg/[0.02] px-3 py-1.5 font-mono text-[11.5px] text-ink-2 transition-all hover:border-edge-strong hover:bg-fg/5 hover:text-ink-1"
                >
                  <Download className="h-3 w-3" aria-hidden="true" />
                  <span>Download Résumé</span>
                </a>
              </div>

              <address className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13.5px] not-italic">
                <div className="flex items-center gap-1">
                  <ContactLink href={PROFILE.gmailCompose} icon={Mail} external>
                    {PROFILE.email}
                  </ContactLink>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label="Copy email address"
                    className="flex h-5 w-5 items-center justify-center rounded text-ink-4 transition-colors hover:bg-fg/10 hover:text-ink-1"
                    title="Copy email to clipboard"
                  >
                    {copiedEmail ? (
                      <Check className="h-3 w-3 text-brand" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>

                <ContactLink href={PROFILE.phoneHref} icon={Phone}>
                  {PROFILE.phone}
                </ContactLink>
                <ContactLink href={PROFILE.github} icon={Github} external>
                  github
                </ContactLink>
                <ContactLink href={PROFILE.linkedin} icon={Linkedin} external>
                  linkedin
                </ContactLink>
              </address>
            </div>
          </aside>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Scrollable Main Content                      */}
          {/* ========================================================= */}
          <main id="main" className="pt-16 lg:w-[58%] lg:py-20 xl:py-24 space-y-16 sm:space-y-20">

            {/* 01 // ABOUT */}
            <Section id="about" num="01" label="About">
              <div className="reveal space-y-4">
                {SUMMARY.map((p) => (
                  <p key={p.slice(0, 24)} className="text-[15px] leading-[1.7] text-ink-2">
                    {p}
                  </p>
                ))}
              </div>
            </Section>

            {/* 02 // EXPERIENCE */}
            <Section id="experience" num="02" label="Experience">
              <div className="space-y-9">
                {EXPERIENCE.map((job) => (
                  <article key={job.role + job.company} className="reveal group">
                    <EntryHead
                      title={job.role}
                      subtitle={job.company}
                      period={job.period}
                      meta={job.meta}
                    />
                    <Bullets items={job.bullets} />
                    <TechLine items={job.tech} />
                  </article>
                ))}
              </div>
            </Section>

            {/* 03 // ARCHITECTURE & SYSTEM DESIGN */}
            <Section id="architecture" num="03" label="System Design & Architecture">
              <div className="reveal">
                <p className="text-[15px] leading-[1.7] text-ink-2">
                  Interactive architectural diagrams illustrating microservices decoupling, offline-first data synchronization, and RAG retrieval pipelines built across production and research systems.
                </p>
              </div>
              <ArchitectureVisualizer />
            </Section>

            {/* 04 // SELECTED WORK */}
            <Section id="work" num="04" label="Selected Projects">
              {/* Category Filter Pills */}
              <div className="reveal mb-6 flex flex-wrap items-center gap-1.5">
                <span className="mr-1 flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-wider text-ink-4">
                  <Filter className="h-3 w-3" /> Filter:
                </span>
                {[
                  { id: "all", label: "All Projects" },
                  { id: "featured", label: "Featured" },
                  { id: "web", label: "Full-Stack Web" },
                  { id: "mobile", label: "Mobile & Flutter" },
                  { id: "ai", label: "AI & Systems" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setProjectCategory(tab.id)}
                    className={`rounded-md px-2.5 py-1 font-mono text-[11px] transition-all ${
                      projectCategory === tab.id
                        ? "bg-fg text-bg font-medium shadow-sm"
                        : "border border-edge bg-fg/[0.02] text-ink-3 hover:border-edge-strong hover:text-ink-1"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="divide-y divide-edge border-y border-edge">
                {filteredProjects.map((p) => (
                  <article key={p.name} className="reveal group py-6">
                    <EntryHead
                      title={
                        p.link ? (
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 transition-colors hover:text-brand"
                          >
                            <span>{p.name}</span>
                            <ArrowUpRight
                              aria-hidden="true"
                              className="h-3.5 w-3.5 text-ink-4 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
                            />
                          </a>
                        ) : (
                          <span>{p.name}</span>
                        )
                      }
                      subtitle={p.tagline}
                      period={p.year}
                    >
                      {p.badge && (
                        <span className="ml-2 rounded-full border border-edge-strong px-2 py-0.5 align-middle font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-4">
                          {p.badge}
                        </span>
                      )}
                    </EntryHead>

                    <p className="mt-2.5 text-[14.5px] leading-[1.65] text-ink-2">{p.description}</p>
                    <TechLine items={p.tech} />

                    {/* Action buttons */}
                    {(p.hasScreenshots || p.link) && (
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        {p.hasScreenshots && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsScreenshotOpen(true);
                              setScreenshotIndex(0);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-md border border-edge-strong bg-fg/[0.03] px-3 py-1.5 font-mono text-[11.5px] text-ink-2 transition-all hover:border-fg/40 hover:bg-fg/[0.06] hover:text-ink-1"
                          >
                            <Smartphone className="h-3.5 w-3.5 text-brand" />
                            <span>View App Screenshots ({SANDALAN_SCREENSHOTS.length})</span>
                          </button>
                        )}

                        {p.link && (
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-4 transition-colors hover:text-brand"
                          >
                            <span>{p.badge === "Google Play" ? "View on Google Play" : "Open project"}</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>

              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="reveal mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-4 transition-colors hover:text-brand"
              >
                More repositories on GitHub <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </a>
            </Section>

            {/* 05 // HONORS & HACKATHONS */}
            <Section id="honors" num="05" label="Honors & Recognition">
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {HONORS.map((item) => (
                  <div
                    key={item.title}
                    className="reveal group relative flex flex-col justify-between rounded-lg border border-edge bg-fg/[0.02] p-4 transition-all duration-200 hover:border-edge-strong hover:bg-fg/[0.04]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full border border-edge-strong px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-brand">
                          {item.badge}
                        </span>
                        <span className="font-mono text-[10.5px] text-ink-4">{item.period}</span>
                      </div>

                      <h3 className="mt-2.5 font-display text-[15px] font-semibold text-ink-1">
                        {item.link ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:text-brand transition-colors"
                          >
                            <span>{item.title}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-ink-4 group-hover:text-brand transition-colors" />
                          </a>
                        ) : (
                          <span>{item.title}</span>
                        )}
                      </h3>
                      <p className="font-mono text-[11px] text-ink-4 mt-0.5">{item.award}</p>
                      <p className="mt-2 text-[13px] leading-relaxed text-ink-3">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* 06 // SKILLS & STACK */}
            <Section id="skills" num="06" label="Technical Stack">
              <div className="reveal grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-[130px_1fr] sm:gap-y-3.5">
                {SKILLS.map(([label, items]) => (
                  <Fragment key={label}>
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-4 sm:pt-1">
                      {label}
                    </div>
                    <div className="text-[14px] leading-[1.6] text-ink-2">{items}</div>
                  </Fragment>
                ))}
              </div>
            </Section>

            {/* EDUCATION */}
            <Section label="Education">
              <article className="reveal">
                <EntryHead
                  title={EDUCATION.school}
                  subtitle={EDUCATION.degree}
                  period={EDUCATION.period}
                  meta={EDUCATION.meta}
                />
                <p className="mt-3 text-[14.5px] leading-[1.65] text-ink-2">{EDUCATION.notes}</p>
              </article>
            </Section>

            {/* 07 // CONTACT */}
            <Section id="contact" num="07" label="Contact & Collabs">
              <div className="reveal">
                <p className="text-[15px] leading-[1.7] text-ink-2">
                  Open to full-time remote roles including night shift on US hours, contract work, and
                  partnerships. Happy to talk about full-stack web, microservices architecture, Flutter mobile apps, or shipping products for the Philippine market.
                </p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <a
                    href={PROFILE.gmailCompose}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-fg px-4 py-2 text-[13.5px] font-medium text-bg transition-opacity hover:opacity-85"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    Send a message
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-2 rounded-md border border-edge-strong px-4 py-2 text-[13.5px] text-ink-2 transition-colors hover:border-fg/40 hover:text-ink-1"
                  >
                    {copiedEmail ? (
                      <Check className="h-3.5 w-3.5 text-brand" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    {copiedEmail ? "Email copied!" : "Copy email"}
                  </button>
                  <a
                    href={PROFILE.resume}
                    download
                    className="inline-flex items-center gap-2 rounded-md border border-edge-strong px-4 py-2 text-[13.5px] text-ink-2 transition-colors hover:border-fg/40 hover:text-ink-1"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    Download résumé
                  </a>
                  <a
                    href={PROFILE.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-edge-strong px-4 py-2 text-[13.5px] text-ink-2 transition-colors hover:border-fg/40 hover:text-ink-1"
                  >
                    <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </Section>

            {/* FOOTER */}
            <footer className="border-t border-edge pt-8">
              <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-4">
                <span>© {year} Jet Timothy Cerezo</span>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="transition-colors hover:text-ink-2"
                >
                  Back to top ↑
                </button>
              </div>
            </footer>
          </main>
        </div>
      </div>

      {/* MODALS & TOAST */}
      <ScreenshotModal
        isOpen={isScreenshotOpen}
        onClose={() => setIsScreenshotOpen(false)}
        items={SANDALAN_SCREENSHOTS}
        currentIndex={screenshotIndex}
        onIndexChange={setScreenshotIndex}
        playStoreUrl="https://play.google.com/store/apps/details?id=com.jvcerezo.exitplan"
      />

      <Toast
        isOpen={isToastOpen}
        onClose={() => setIsToastOpen(false)}
        message={toastMessage}
      />
    </div>
  );
}

export default App;
