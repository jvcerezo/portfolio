import { useEffect, useState, useMemo } from "react";
import {
  Mail,
  Github,
  Linkedin,
  Download,
  ArrowUpRight,
  Sun,
  Moon,
  Copy,
  Check,
  Smartphone,
  Phone,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Layers,
  Terminal,
  Bot,
} from "lucide-react";
import { TimezoneWidget } from "./components/TimezoneWidget";
import { VisitorCounter } from "./components/VisitorCounter";
import { ScreenshotModal, type ScreenshotItem } from "./components/ScreenshotModal";
import { Toast } from "./components/Toast";
import { ParticleCanvas } from "./components/ParticleCanvas";
import { TiltCard } from "./components/TiltCard";
import { CommandPalette } from "./components/CommandPalette";
import { ImpactBento } from "./components/ImpactBento";
import { ArchitectureDiagram } from "./components/ArchitectureDiagram";
import { TajAIModal, TajAILauncher } from "./components/TajAIModal";
import { TechLogo, CompanyLogo, CompanyBrandStrip } from "./components/TechLogos";
import { soundFx } from "./lib/sound";
import { fireConfetti } from "./lib/confetti";

const PROFILE = {
  name: "Jet Timothy Cerezo",
  title: "Software Engineer",
  tagline: "I build scalable full-stack web and mobile applications, Dockerized microservices, and automated test pipelines.",
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

const NAV_ITEMS = [
  { id: "about", label: "ABOUT" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "projects", label: "PROJECTS" },
  { id: "skills", label: "SKILLS" },
  { id: "honors", label: "HONORS & EDUCATION" },
];

const EXPERIENCE = [
  {
    role: "Software Engineer",
    company: "Converge Studios Inc.",
    meta: "Remote",
    period: "2026 — Present",
    bullets: [
      "Build and deploy scalable cross-platform mobile and web applications leveraging FlutterFlow, Flutter, and cloud-first architectures.",
      "Engineer custom application logic, REST API integrations, and backend workflows to rapidly ship enterprise-grade digital solutions.",
      "Collaborate across cross-functional Agile teams to accelerate delivery cycles from feature scoping to production deployment.",
    ],
    tech: ["FlutterFlow", "Flutter", "Dart", "REST APIs", "Cloud Integrations", "Agile"],
    link: null,
  },
  {
    role: "Junior Test Automation Engineer",
    company: "Billease",
    meta: "Remote · Fintech",
    period: "2025 — 2026",
    bullets: [
      "Shipped ~150 merge requests and ~45,000 lines of code building automated test coverage and internal tooling for a high-scale consumer fintech Android app.",
      "Engineered and maintained CI/CD pipeline integrations for core regression and emergency-hotfix suites, validating every production release across Linux CI runners.",
      "Discovered and resolved 30+ critical, high-impact bugs using Appium and BrowserStack as the final technical gatekeeper before deployment.",
      "Integrated Claude/AI into the automation workflow to accelerate test script development and root-cause debugging.",
    ],
    tech: ["Appium", "BrowserStack", "CI/CD", "Linux", "Claude API", "Fintech"],
    link: "https://billease.ph",
  },
  {
    role: "Software Developer · Thesis Affiliate",
    company: "International Rice Research Institute (IRRI)",
    meta: "Los Baños, Laguna",
    period: "2024 — 2025",
    bullets: [
      "Re-architected IRRI’s legacy Java monolith SNPseek genomics platform into a MERN microservices system: seven independent Node.js/Express services behind an API gateway, orchestrated with Docker Compose.",
      "Re-engineered authentication and data access layers, building a custom SSO/OAuth layer bridging legacy enterprise systems with new Node services.",
      "Designed MongoDB schemas and REST/JSON endpoints for large-scale genomic datasets, and built the React front end with multi-criteria filtering and interactive charts.",
    ],
    tech: ["Node.js", "Express", "React", "MongoDB", "Docker", "Microservices", "OAuth/SSO"],
    link: "https://snpseek-mern.vercel.app",
  },
  {
    role: "Full-Stack Developer",
    company: "Freelance / Project-Based",
    meta: "Remote",
    period: "2024",
    bullets: [
      "Built a story-based interactive web game on the MERN stack with a 3-person team; owned front end, back end, and UI/UX through to client delivery.",
    ],
    tech: ["MongoDB", "Express", "React", "Node.js"],
    link: null,
  },
  {
    role: "Code Wars Co-Head · Project Manager",
    company: "UPLB Computer Science Society",
    meta: "Los Baños, Laguna",
    period: "2023 — 2025",
    bullets: [
      "Led a 7-member development team on the competitive-programming event platform, overseeing feature development, bug tracking, testing, and deployment.",
      "Ran the live platform for 20 teams, 3 judges, and 3 continuous hours of zero-downtime service.",
    ],
    tech: ["Platform Ops", "Testing", "Deployment", "Leadership"],
    link: null,
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
  hasScreenshots?: boolean;
}

const PROJECTS: Project[] = [
  {
    name: "Sandalan",
    tagline: "Filipino adulting and personal finance app",
    year: "2024 — 2025",
    description:
      "Solo-built and shipped live to Google Play: 38+ bank integrations, Philippine statutory tax calculators (TRAIN Law), OCR receipt scanning, and a Taglish conversational AI assistant. Architected an offline-first bidirectional sync engine with timestamp conflict resolution and incremental replication between local Drift SQLite and Supabase PostgreSQL with AES-256 encryption.",
    tech: ["Flutter", "Dart", "Riverpod", "Supabase", "PostgreSQL", "SQLite (Drift)", "OCR", "AI"],
    link: "https://play.google.com/store/apps/details?id=com.jvcerezo.exitplan",
    badge: "Google Play",
    hasScreenshots: true,
  },
  {
    name: "SNPseek MERN",
    tagline: "Genomics microservices research platform",
    year: "2024 — 2025",
    description:
      "Complete rewrite of IRRI’s legacy Java monolith genomics database into seven independent Node.js/Express services behind an API gateway, orchestrated with Docker Compose. Built advanced multi-criteria filtering, MongoDB query optimization, and interactive charts over large genomic datasets.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Docker", "API Gateway", "OAuth SSO"],
    link: "https://snpseek-mern.vercel.app",
    badge: "IRRI Research",
  },
  {
    name: "Codebreak 2.0",
    tagline: "RAG-based AI customer support platform",
    year: "2025",
    description:
      "Full-stack customer support intelligence platform engineered in under 24 hours at the Tenext.ai hackathon (1st Place Champion). Built vector similarity retrieval pipelines, live transcription call scripts, and automated post-call compliance QA using Claude API and Groq.",
    tech: ["Node.js", "RAG", "Vector Search", "Claude API", "Groq", "Microservices"],
    link: "https://www.facebook.com/photo/?fbid=706685865053901&set=a.263981095991049",
    badge: "1st Place Winner",
  },
  {
    name: "IskOS",
    tagline: "Academic OS and dashboard for UPLB Students",
    year: "2024 — 2025",
    description:
      "Unified academic dashboard for University of the Philippines Los Baños students featuring course prerequisite tracking, class scheduling, and Google Calendar synchronization.",
    tech: ["React", "TypeScript", "Supabase", "Google Calendar API", "Tailwind CSS"],
    link: "https://isk-os.vercel.app",
    badge: "In Dev",
  },
  {
    name: "PICSEL",
    tagline: "Reservation management system",
    year: "2024",
    description:
      "Built backend components over 5 months in a 20-developer student organization team; integrated Google OAuth authentication and shipped across 7 major features under peer code review.",
    tech: ["Node.js", "PostgreSQL", "OAuth", "Team Collaboration"],
    link: null,
    badge: null,
  },
  {
    name: "SOSC3 Advocacy",
    tagline: "Civic tech advocacy web platform",
    year: "2023",
    description:
      "Social advocacy web application for community awareness campaigns, built during UPLB Computer Science Society public events.",
    tech: ["React", "Tailwind CSS", "Vercel"],
    link: "https://sosc3-advocacy-app.vercel.app",
    badge: null,
  },
  {
    name: "Maralit Dental Clinic",
    tagline: "Dental appointment booking and patient record system",
    year: "2024",
    description:
      "Full-stack appointment scheduling and electronic medical record management system with automated status tracking for a local dental clinic.",
    tech: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    link: "https://mdcas-fe.vercel.app",
    badge: null,
  },
  {
    name: "Diet Plan Calculator",
    tagline: "Personalized nutrition targets and macro planner",
    year: "2023",
    description:
      "Health application calculating customized macronutrient breakdowns, calorie expenditures, and meal targets based on metabolic activity.",
    tech: ["React", "Node.js", "Express", "MERN"],
    link: "https://diet-plan-calculator.vercel.app",
    badge: null,
  },
];

const HONORS = [
  {
    title: "Codebreak 2.0 Hackathon Champion",
    award: "1st Place Winner · Tenext.ai Hackathon",
    period: "2025",
    detail: "Engineered a full-stack RAG customer support intelligence platform in under 24 hours with live call scripts and post-call QA analytics.",
    link: "https://www.facebook.com/photo/?fbid=706685865053901&set=a.263981095991049",
  },
  {
    title: "UPLB Computer Science Honor Roll",
    award: "Academic Excellence Distinction · UP Los Baños",
    period: "2021 — 2025",
    detail: "Graduated BS Computer Science with Honor Roll distinction; Provincial Government of Laguna Academic Scholar & UP SLAS Scholar.",
    link: null,
  },
  {
    title: "Code Wars Co-Head · Zero Downtime",
    award: "Platform Engineering Leadership",
    period: "2023 — 2025",
    detail: "Led a 7-member engineering team delivering 3 hours of continuous live competition for 20 teams and 3 judges with zero downtime.",
    link: null,
  },
  {
    title: "Bioinformatics Thesis Affiliate · IRRI",
    award: "Genomics Research Affiliate",
    period: "2024 — 2025",
    detail: "Affiliate at the International Rice Research Institute (IRRI), migrating legacy Java genomic platforms into Dockerized MERN microservices.",
    link: null,
  },
];

const SKILLS: [string, string[]][] = [
  ["Languages", ["JavaScript", "TypeScript", "Java", "Python", "SQL", "Dart", "PHP", "C/C++"]],
  ["Front End", ["React", "Next.js", "FlutterFlow", "Tailwind CSS", "HTML5", "CSS3", "Vite", "Responsive Design"]],
  ["Back End", ["Node.js", "Express", "Nest.js", "REST APIs", "Microservices", "API Gateway", "JWT", "OAuth", "SSO"]],
  ["Databases", ["PostgreSQL", "MongoDB", "MySQL", "SQLite (Drift)", "Supabase", "Schema Design"]],
  ["DevOps & Cloud", ["Docker", "Docker Compose", "CI/CD", "Git", "GitHub Actions", "GitLab", "Linux", "Vercel", "AWS"]],
  ["Automation & QA", ["Appium", "BrowserStack", "Linux CI Runners", "Unit & E2E Testing", "Postman", "Jira"]],
  ["Mobile & AI", ["Flutter", "Riverpod", "Drift SQLite", "Claude API", "Gemini API", "RAG Pipelines", "Groq"]],
];

const SANDALAN_SCREENSHOTS: ScreenshotItem[] = [
  {
    src: "/sandalan/01-home.jpg",
    title: "Home Dashboard & Adulting Journey",
    description: "Adulting readiness score, upcoming government obligations calendar, daily tips, and active habit streaks.",
  },
  {
    src: "/sandalan/02-tracker.jpg",
    title: "Life Stage Journey & Checklist",
    description: "Step-by-step adulting roadmap (Unang Hakbang, Pundasyon, Tahanan, Tugatog) with offline-synced task checklists.",
  },
  {
    src: "/sandalan/03-chat.jpg",
    title: "Taglish AI Adulting Assistant",
    description: "Conversational assistant answering Philippine government document requirements, taxes, and financial guidelines.",
  },
  {
    src: "/sandalan/04-transactions.jpg",
    title: "Transaction Ledger & Bank Integrations",
    description: "38+ bank integrations with local AES-256 encryption and Drift SQLite offline-first ledger.",
  },
  {
    src: "/sandalan/05-budgets.jpg",
    title: "Category Budgets & Spending Envelopes",
    description: "Periodic envelope budgeting system with real-time spend alerts and progress indicators.",
  },
  {
    src: "/sandalan/06-achievements.jpg",
    title: "Adulting Achievements & Milestones",
    description: "Gamified progress tracking celebrating financial independence and government compliance milestones.",
  },
  {
    src: "/sandalan/07-goals.jpg",
    title: "Savings & Financial Goals",
    description: "Target goal trackers for emergency funds, MP2 investments, housing, and life milestones.",
  },
  {
    src: "/sandalan/08-reports.jpg",
    title: "Monthly Cashflow & Analytics Reports",
    description: "Visual spending breakdowns, income vs. expense analytics, and net cashflow summaries.",
  },
];

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

  const toggle = () => {
    soundFx.playPop();
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  return [theme, toggle];
}

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string>("about");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (let i = ids.length - 1; i >= 0; i--) {
        const id = ids[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActive(id);
            return;
          }
        }
      }
      setActive(ids[0]);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ids]);

  return active;
}

function App() {
  const [theme, toggleTheme] = useTheme();
  const activeNav = useScrollSpy(NAV_ITEMS.map((n) => n.id));
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [isScreenshotOpen, setIsScreenshotOpen] = useState(false);
  const [screenshotIndex, setScreenshotIndex] = useState(0);

  // Creative Aspect 1: Sound toggle state
  const [soundEnabled, setSoundEnabled] = useState(() => soundFx.enabled);
  const toggleSound = () => {
    const next = soundFx.toggle();
    setSoundEnabled(next);
    setToastMessage(next ? "Audio feedback enabled (synthesized)" : "Audio feedback muted");
    setIsToastOpen(true);
  };

  // Creative Aspect 2: Perspective Lens / Summary Mode (added 'code' tab)
  const [summaryMode, setSummaryMode] = useState<"bio" | "tldr" | "philosophy" | "code">("bio");

  // Creative Aspect 3: Interactive Tech Cross-Highlighting
  const [activeTechFilter, setActiveTechFilter] = useState<string | null>(null);

  // Creative Aspect 4: Command Palette modal (Cmd+K)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Creative Aspect 5: Taj AI RAG Assistant Modal (Press J)
  const [isTajAIOpen, setIsTajAIOpen] = useState(false);

  // Creative Aspect 5: Interactive System Architecture Diagram toggles
  const [expandedArch, setExpandedArch] = useState<{ [key: string]: boolean }>({
    Sandalan: false,
    "SNPseek MERN": false,
    "Codebreak 2.0": false,
  });

  const toggleArch = (name: string) => {
    soundFx.playPop();
    setExpandedArch((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleTechClick = (tech: string) => {
    soundFx.playClick();
    if (activeTechFilter?.toLowerCase() === tech.toLowerCase()) {
      setActiveTechFilter(null);
    } else {
      setActiveTechFilter(tech);
    }
  };

  const isMatch = (techList: string[], filter: string | null) => {
    if (!filter) return true;
    return techList.some(
      (t) =>
        t.toLowerCase().includes(filter.toLowerCase()) ||
        filter.toLowerCase().includes(t.toLowerCase())
    );
  };

  const matchCounts = useMemo(() => {
    if (!activeTechFilter) return { exp: 0, proj: 0 };
    const exp = EXPERIENCE.filter((e) => isMatch(e.tech, activeTechFilter)).length;
    const proj = PROJECTS.filter((p) => isMatch(p.tech, activeTechFilter)).length;
    return { exp, proj };
  }, [activeTechFilter]);

  // Creative Aspect 6: Brittany Chiang cursor spotlight
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Creative Aspect 7: Konami Code Easter Egg
  const [konamiIdx, setKonamiIdx] = useState(0);
  const KONAMI = useMemo(
    () => ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"],
    []
  );

  const handleCopyEmail = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    soundFx.playPop();
    fireConfetti();
    try {
      navigator.clipboard.writeText(PROFILE.email);
      setCopiedEmail(true);
      setToastMessage("Copied to clipboard: " + PROFILE.email);
      setIsToastOpen(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      setToastMessage("Email: " + PROFILE.email);
      setIsToastOpen(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette global shortcut (Cmd+K or Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        soundFx.playPop();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Check Konami Code
      if (e.key.toLowerCase() === KONAMI[konamiIdx]) {
        const next = konamiIdx + 1;
        if (next === KONAMI.length) {
          soundFx.playChime();
          fireConfetti();
          setToastMessage("👾 Konami Code Unlocked! Full-stack engineer level max.");
          setIsToastOpen(true);
          setKonamiIdx(0);
        } else {
          setKonamiIdx(next);
        }
      } else {
        setKonamiIdx(0);
      }

      // Hotkeys
      if (e.key === "Escape") {
        setActiveTechFilter(null);
        setIsCommandPaletteOpen(false);
        setIsTajAIOpen(false);
      } else if (e.key.toLowerCase() === "t") {
        toggleTheme();
      } else if (e.key.toLowerCase() === "c") {
        handleCopyEmail();
      } else if (e.key.toLowerCase() === "s") {
        toggleSound();
      } else if (e.key.toLowerCase() === "j") {
        soundFx.playPop();
        setIsTajAIOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === "m") {
        fireConfetti();
        soundFx.playPop();
        setToastMessage("🎉 Confetti celebration!");
        setIsToastOpen(true);
      } else if (e.key === "?") {
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheme, konamiIdx, KONAMI]);

  const scrollTo = (id: string, index?: number) => {
    if (typeof index === "number") {
      soundFx.playNote(index);
    } else {
      soundFx.playClick();
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-bg text-ink-1 font-sans selection:bg-ink-1 selection:text-bg antialiased">
      {/* Creative Aspect: Interactive Constellation Particle Canvas */}
      <ParticleCanvas theme={theme} />

      {/* Interactive Cursor Spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 hidden lg:block"
        style={{
          background:
            theme === "dark"
              ? `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.05), transparent 80%)`
              : `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 0, 0, 0.03), transparent 80%)`,
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-4">
          
          {/* ========================================================= */}
          {/* LEFT SIDEBAR (STICKY ON DESKTOP)                          */}
          {/* ========================================================= */}
          <header className="group/side relative lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24 rounded-3xl p-5 sm:p-7 -mx-5 sm:-mx-7 lg:-mx-4 lg:p-6 border border-transparent transition-all duration-300 hover:bg-bg hover:border-edge-strong hover:shadow-2xl hover:ring-1 hover:ring-ink-1/10">
            <div>
              {/* Profile Avatar & Interactive Toggles */}
              <div className="flex items-center justify-between">
                <div className="relative group">
                  <img
                    src="/profile.jpg"
                    alt="Jet Timothy Cerezo"
                    className="h-16 w-16 rounded-full object-cover border-2 border-edge shadow-sm transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-bg" title="Available for work" />
                </div>

                <div className="flex items-center gap-2">
                  {/* Taj AI Trigger Button */}
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playPop();
                      setIsTajAIOpen(true);
                    }}
                    aria-label="Ask Taj AI RAG assistant"
                    title="Ask Taj AI (Press J)"
                    className="flex h-8 items-center gap-1.5 px-2.5 rounded-lg border border-edge text-ink-3 hover:text-ink-1 hover:border-edge-strong transition-colors text-xs font-mono"
                  >
                    <Bot className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Taj AI</span>
                  </button>

                  {/* Command Palette Trigger Button */}
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playPop();
                      setIsCommandPaletteOpen(true);
                    }}
                    aria-label="Open Command Palette (Cmd+K)"
                    title="Open Command Palette (Cmd+K or ?)"
                    className="flex h-8 items-center gap-1.5 px-2.5 rounded-lg border border-edge text-ink-3 hover:text-ink-1 hover:border-edge-strong transition-colors text-xs font-mono"
                  >
                    <Terminal className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">⌘K</span>
                  </button>

                  {/* Sound FX Toggle Button with Animated Equalizer */}
                  <button
                    type="button"
                    onClick={toggleSound}
                    aria-label={soundEnabled ? "Mute audio feedback" : "Enable tactile audio feedback"}
                    title={soundEnabled ? "Tactile Audio: ON (Press S)" : "Tactile Audio: OFF (Press S)"}
                    className="flex h-8 items-center gap-1.5 px-2 rounded-lg border border-edge text-ink-3 hover:text-ink-1 hover:border-edge-strong transition-colors"
                  >
                    {soundEnabled ? (
                      <>
                        <Volume2 className="h-3.5 w-3.5 text-ink-1" />
                        <span className="flex items-end gap-0.5 h-3 w-2.5">
                          <span className="w-0.5 bg-ink-1 rounded-full animate-eq-1" />
                          <span className="w-0.5 bg-ink-1 rounded-full animate-eq-2" />
                          <span className="w-0.5 bg-ink-1 rounded-full animate-eq-3" />
                        </span>
                      </>
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                  </button>

                  {/* Theme Switcher Button */}
                  <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label="Toggle theme (Press T)"
                    title="Toggle Theme (Press T)"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-edge text-ink-3 hover:text-ink-1 hover:border-edge-strong transition-colors"
                  >
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Clean Static Name (No Glitch) */}
              <h1 className="text-4xl font-bold tracking-tight text-ink-1 sm:text-5xl mt-6">
                {PROFILE.name}
              </h1>
              <h2 className="mt-3 text-lg font-medium tracking-tight text-ink-2 sm:text-xl flex items-center gap-2">
                <span>{PROFILE.title}</span>
                <span className="h-1 w-1 rounded-full bg-ink-4" />
                <span className="text-sm font-mono text-ink-3">Full-Stack &amp; Mobile</span>
              </h2>
              <p className="mt-4 max-w-xs text-base leading-normal text-ink-3">
                {PROFILE.tagline}
              </p>

              {/* Timezone & Visitor Counter */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <TimezoneWidget />
                <VisitorCounter />
              </div>

              {/* Creative Perspective Lens Switcher */}
              <div className="mt-8 max-w-xs">
                <div className="flex items-center p-0.5 rounded-lg border border-edge bg-fg/[0.03] text-xs font-mono">
                  {(["bio", "tldr", "philosophy", "code"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        soundFx.playPop();
                        setSummaryMode(mode);
                      }}
                      className={`flex-1 py-1 px-1.5 rounded-md transition-all text-center ${
                        summaryMode === mode
                          ? "bg-bg text-ink-1 font-semibold shadow-xs border border-edge"
                          : "text-ink-4 hover:text-ink-2"
                      }`}
                    >
                      {mode === "bio" ? "Narrative" : mode === "tldr" ? "TL;DR" : mode === "philosophy" ? "Rules" : "Code"}
                    </button>
                  ))}
                </div>

                <div className="mt-3 text-xs leading-relaxed text-ink-3 min-h-[58px]">
                  {summaryMode === "bio" && (
                    <p className="animate-reveal">
                      End-to-end full-stack software engineer with 2+ years of production experience across front end, back end, and test automation.
                    </p>
                  )}
                  {summaryMode === "tldr" && (
                    <ul className="space-y-1 animate-reveal font-mono">
                      <li>• 2+ Yrs Experience (Converge, Billease, IRRI)</li>
                      <li>• ~150 MRs & ~45k LOC shipped in fintech CI/CD</li>
                      <li>• Live on Google Play (Sandalan, 38+ banks)</li>
                      <li>• Available for remote roles (open to US hours)</li>
                    </ul>
                  )}
                  {summaryMode === "philosophy" && (
                    <p className="animate-reveal italic">
                      "I favor offline-first local persistence, automated CI/CD test gates before every deploy, and clean decoupled microservices over monolith complexity."
                    </p>
                  )}
                  {summaryMode === "code" && (
                    <div className="animate-reveal rounded-lg border border-edge bg-fg/[0.04] p-2.5 font-mono text-[11px] leading-relaxed">
                      <div className="flex items-center justify-between pb-1.5 border-b border-edge text-ink-4 text-[10px]">
                        <span className="flex items-center gap-1 text-ink-2">
                          <Terminal className="h-3 w-3" />
                          <span>engineer.ts</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            soundFx.playChime();
                            fireConfetti();
                            console.log(
                              "%c🚀 Jet Timothy Cerezo — Software Engineer\nReady to build scalable web, mobile & microservices systems.\nEmail: jetjetcerezo@gmail.com",
                              "color: #fafafa; background: #09090b; font-size: 13px; font-weight: bold; padding: 10px 14px; border-radius: 6px;"
                            );
                            setToastMessage("Compiled engineer.ts · Greeting logged to DevTools console!");
                            setIsToastOpen(true);
                          }}
                          className="hover:text-ink-1 underline text-ink-3 font-semibold"
                        >
                          Run ▶
                        </button>
                      </div>
                      <pre className="pt-2 text-ink-2 overflow-x-auto">
                        <code>{`const jet = {
  role: "Software Engineer",
  status: "Available for Remote",
  stack: ["React", "Node", "Flutter"],
  metrics: "150+ PRs · 7 Services"
};`}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Brittany Chiang Expanding Horizontal Line Navigation with Melodic Chimes */}
              <nav className="nav hidden lg:block mt-8" aria-label="In-page jump links">
                <ul className="w-max space-y-3 font-mono text-xs uppercase tracking-widest">
                  {NAV_ITEMS.map((item, index) => {
                    const isActive = activeNav === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => scrollTo(item.id, index)}
                          onMouseEnter={() => soundFx.playNote(index)}
                          className={`group flex items-center py-1 transition-all ${
                            isActive ? "text-ink-1 font-semibold" : "text-ink-4 hover:text-ink-2"
                          }`}
                        >
                          <span
                            className={`mr-4 h-px transition-all duration-300 ${
                              isActive
                                ? "w-16 bg-ink-1"
                                : "w-8 bg-ink-4 group-hover:w-16 group-hover:bg-ink-2"
                            }`}
                          />
                          <span>{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Social & Contact Strip + Shortcuts hint */}
            <div className="mt-10 lg:mt-0 pt-4 space-y-3">
              <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-ink-3">
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink-1 transition-colors flex items-center gap-1"
                  aria-label="GitHub Profile"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>

                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink-1 transition-colors flex items-center gap-1"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>

                <a
                  href={PROFILE.gmailCompose}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink-1 transition-colors flex items-center gap-1"
                  aria-label="Email Jet"
                >
                  <Mail className="h-5 w-5" />
                  <span className="sr-only">Email</span>
                </a>

                <a
                  href={PROFILE.phoneHref}
                  className="hover:text-ink-1 transition-colors flex items-center gap-1"
                  aria-label="Phone"
                >
                  <Phone className="h-5 w-5" />
                  <span className="sr-only">Phone</span>
                </a>

                <a
                  href={PROFILE.resume}
                  download
                  className="hover:text-ink-1 transition-colors flex items-center gap-1 font-mono text-xs uppercase tracking-wider"
                >
                  <Download className="h-4 w-4" />
                  <span>Résumé</span>
                </a>
              </div>

              {/* Minimal Keyboard Shortcuts Hint */}
              <div className="font-mono text-[11px] text-ink-5 hidden lg:block">
                Hotkeys: <kbd className="font-semibold text-ink-4">[J]</kbd> Taj AI · <kbd className="font-semibold text-ink-4">[⌘K]</kbd> Palette · <kbd className="font-semibold text-ink-4">[T]</kbd> Theme · <kbd className="font-semibold text-ink-4">[C]</kbd> Copy Email · <kbd className="font-semibold text-ink-4">[S]</kbd> Audio · <kbd className="font-semibold text-ink-4">[M]</kbd> Confetti
              </div>
            </div>
          </header>

          {/* ========================================================= */}
          {/* RIGHT CONTENT STREAM (SEAMLESS SCROLL)                    */}
          {/* ========================================================= */}
          <main className="pt-20 lg:w-1/2 lg:py-24 space-y-24">
            
            {/* 1. ABOUT SECTION */}
            <section
              id="about"
              className="group/sec relative scroll-mt-16 md:scroll-mt-24 rounded-3xl p-5 sm:p-7 -mx-5 sm:-mx-7 border border-transparent transition-all duration-300 hover:bg-bg hover:border-edge-strong hover:shadow-2xl hover:ring-1 hover:ring-ink-1/10"
              aria-label="About me"
            >
              <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-bg/85 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only">
                <h2 className="text-sm font-bold uppercase tracking-widest text-ink-1">
                  About
                </h2>
              </div>
              <div className="space-y-4 text-base sm:text-lg leading-relaxed text-ink-3">
                <p>
                  I'm a full-stack software engineer with 2+ years of production experience building web applications, offline-first mobile apps, and automated test pipelines.
                </p>
                <p>
                  Currently, I engineer cloud-first digital solutions at{" "}
                  <span className="text-ink-1 font-medium">Converge Studios Inc.</span> Previously, I was the final release gatekeeper automating fintech Android releases at{" "}
                  <a
                    href="https://billease.ph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-1 font-medium hover:underline inline-flex items-baseline gap-0.5"
                  >
                    <span>Billease</span>
                    <ArrowUpRight className="h-3 w-3 inline" />
                  </a>
                  , shipping over <span className="text-ink-1 font-medium">~150 merge requests</span> and <span className="text-ink-1 font-medium">~45,000 lines of code</span> across Linux CI runners.
                </p>
                <p>
                  At the <span className="text-ink-1 font-medium">International Rice Research Institute (IRRI)</span>, I decoupled a legacy enterprise Java monolith into seven Dockerized Node.js and Express microservices behind a unified API gateway. I also solo-engineered and shipped{" "}
                  <a
                    href="https://play.google.com/store/apps/details?id=com.jvcerezo.exitplan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-1 font-medium hover:underline inline-flex items-baseline gap-0.5"
                  >
                    <span>Sandalan</span>
                    <ArrowUpRight className="h-3 w-3 inline" />
                  </a>{" "}
                  on Google Play with 38+ bank integrations and offline-first SQLite sync.
                </p>
              </div>

              {/* Creative Aspect: Interactive Production Impact Matrix Bento */}
              <div className="mt-8">
                <ImpactBento />
              </div>
            </section>

            {/* 2. EXPERIENCE SECTION */}
            <section
              id="experience"
              className="group/sec relative scroll-mt-16 md:scroll-mt-24 rounded-3xl p-5 sm:p-7 -mx-5 sm:-mx-7 border border-transparent transition-all duration-300 hover:bg-bg hover:border-edge-strong hover:shadow-2xl hover:ring-1 hover:ring-ink-1/10"
              aria-label="Work experience"
            >
              <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-bg/85 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only">
                <h2 className="text-sm font-bold uppercase tracking-widest text-ink-1">
                  Experience
                </h2>
              </div>

              {/* Affiliation Strip: Converge, Billease, IRRI, UPLB */}
              <div className="mb-8">
                <CompanyBrandStrip />
              </div>

              <div className="space-y-10">
                {EXPERIENCE.map((job) => {
                  const matchesFilter = isMatch(job.tech, activeTechFilter);
                  return (
                    <TiltCard
                      key={job.company + job.role}
                      isDimmed={Boolean(activeTechFilter && !matchesFilter)}
                      isHighlighted={Boolean(activeTechFilter && matchesFilter)}
                      className="p-4 sm:p-5 border border-transparent hover:border-edge-strong"
                    >
                      <div className="grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4">
                        {/* Date on Left */}
                        <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-ink-4 sm:col-span-2">
                          {job.period}
                        </header>

                        {/* Content on Right */}
                        <div className="z-10 sm:col-span-6 space-y-2">
                          <div className="flex items-start gap-3">
                            <CompanyLogo company={job.company} className="h-7 w-7 mt-0.5 shrink-0 rounded-md" />
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium leading-snug text-ink-1">
                                <div>
                                  {job.link ? (
                                    <a
                                      href={job.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-baseline font-semibold leading-tight text-ink-1 hover:text-ink-1 focus-visible:text-ink-1 group/link text-base sm:text-lg"
                                    >
                                      <span>{job.role} · </span>
                                      <span className="inline-block ml-1">
                                        {job.company}
                                        <ArrowUpRight className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 motion-reduce:transition-none ml-1" />
                                      </span>
                                    </a>
                                  ) : (
                                    <span className="font-semibold text-base sm:text-lg text-ink-1">
                                      {job.role} · {job.company}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs font-mono text-ink-4 mt-0.5">{job.meta}</div>
                              </h3>
                            </div>
                          </div>

                          <ul className="space-y-2 text-sm leading-relaxed text-ink-3 pt-1">
                            {job.bullets.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>

                          {/* Interactive Clickable Tech Pills */}
                          <ul className="flex flex-wrap gap-1.5 pt-2" aria-label="Technologies used">
                            {job.tech.map((t) => {
                              const isSelected = activeTechFilter?.toLowerCase() === t.toLowerCase();
                              return (
                                <li key={t}>
                                  <button
                                    type="button"
                                    onClick={() => handleTechClick(t)}
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-medium transition-all ${
                                      isSelected
                                        ? "bg-ink-1 text-bg shadow-xs font-semibold scale-105"
                                        : "bg-fg/[0.05] border border-edge text-ink-2 hover:border-ink-1/40 hover:text-ink-1"
                                    }`}
                                    title={`Filter projects & experience by ${t}`}
                                  >
                                    <TechLogo name={t} className="h-3.5 w-3.5 shrink-0" />
                                    <span>{t}</span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </TiltCard>
                  );
                })}
              </div>

              <div className="mt-12">
                <a
                  href={PROFILE.resume}
                  download
                  className="inline-flex items-center font-semibold leading-tight text-ink-1 hover:underline text-sm group"
                >
                  <span>View Full Résumé (PDF)</span>
                  <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </div>
            </section>

            {/* 3. PROJECTS SECTION */}
            <section
              id="projects"
              className="group/sec relative scroll-mt-16 md:scroll-mt-24 rounded-3xl p-5 sm:p-7 -mx-5 sm:-mx-7 border border-transparent transition-all duration-300 hover:bg-bg hover:border-edge-strong hover:shadow-2xl hover:ring-1 hover:ring-ink-1/10"
              aria-label="Selected projects"
            >
              <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-bg/85 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only">
                <h2 className="text-sm font-bold uppercase tracking-widest text-ink-1">
                  Projects
                </h2>
              </div>

              <div className="space-y-10">
                {PROJECTS.map((project) => {
                  const matchesFilter = isMatch(project.tech, activeTechFilter);
                  return (
                    <TiltCard
                      key={project.name}
                      isDimmed={Boolean(activeTechFilter && !matchesFilter)}
                      isHighlighted={Boolean(activeTechFilter && matchesFilter)}
                      className="p-4 sm:p-5 border border-transparent hover:border-edge-strong"
                    >
                      <div className="grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4">
                        <div className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-ink-4 sm:col-span-2">
                          {project.year}
                        </div>

                        <div className="z-10 sm:col-span-6 space-y-2">
                          <h3 className="font-semibold text-base sm:text-lg leading-snug text-ink-1">
                            {project.link ? (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-baseline font-semibold leading-tight text-ink-1 hover:text-ink-1 group/link"
                              >
                                <span>{project.name}</span>
                                <ArrowUpRight className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 motion-reduce:transition-none ml-1" />
                              </a>
                            ) : (
                              <span>{project.name}</span>
                            )}

                            {project.badge && (
                              <span className="ml-2 inline-flex items-center rounded-full border border-edge bg-fg/[0.04] px-2.5 py-0.5 font-mono text-[11px] font-medium text-ink-3">
                                {project.badge}
                              </span>
                            )}
                          </h3>

                          <p className="text-sm leading-relaxed text-ink-3">
                            {project.description}
                          </p>

                          {/* Creative Aspect: Interactive Screenshot Thumbnails & Architecture for Sandalan */}
                          {project.name === "Sandalan" && (
                            <div className="space-y-2 py-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="flex gap-1.5">
                                  {SANDALAN_SCREENSHOTS.slice(0, 4).map((shot, idx) => (
                                    <button
                                      key={shot.title}
                                      type="button"
                                      onClick={() => {
                                        soundFx.playPop();
                                        setIsScreenshotOpen(true);
                                        setScreenshotIndex(idx);
                                      }}
                                      className="group/thumb relative h-12 w-9 overflow-hidden rounded-md border border-edge bg-black transition-transform hover:scale-110 hover:border-ink-1"
                                      title={`View screenshot: ${shot.title}`}
                                    >
                                      <img
                                        src={shot.src}
                                        alt={shot.title}
                                        className="h-full w-full object-cover opacity-80 group-hover/thumb:opacity-100"
                                        loading="lazy"
                                      />
                                    </button>
                                  ))}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    soundFx.playPop();
                                    setIsScreenshotOpen(true);
                                    setScreenshotIndex(0);
                                  }}
                                  className="font-mono text-xs text-ink-3 hover:text-ink-1 transition-colors flex items-center gap-1 pl-1"
                                >
                                  <Smartphone className="h-3.5 w-3.5" />
                                  <span>8 Screenshots ↗</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleArch("Sandalan")}
                                  className={`font-mono text-xs px-2.5 py-1 rounded-md border transition-colors flex items-center gap-1.5 ${
                                    expandedArch["Sandalan"]
                                      ? "border-ink-1 bg-ink-1 text-bg font-semibold"
                                      : "border-edge text-ink-3 hover:text-ink-1 hover:border-edge-strong bg-fg/[0.02]"
                                  }`}
                                >
                                  <Layers className="h-3.5 w-3.5" />
                                  <span>{expandedArch["Sandalan"] ? "Hide Architecture" : "Offline Sync Architecture"}</span>
                                </button>
                              </div>
                              {expandedArch["Sandalan"] && (
                                <ArchitectureDiagram projectKey="sandalan" />
                              )}
                            </div>
                          )}

                          {/* Creative Aspect: Interactive Microservices Architecture for SNPseek */}
                          {project.name === "SNPseek MERN" && (
                            <div className="py-1">
                              <button
                                type="button"
                                onClick={() => toggleArch("SNPseek MERN")}
                                className={`font-mono text-xs px-2.5 py-1 rounded-md border transition-colors inline-flex items-center gap-1.5 ${
                                  expandedArch["SNPseek MERN"]
                                    ? "border-ink-1 bg-ink-1 text-bg font-semibold"
                                    : "border-edge text-ink-3 hover:text-ink-1 hover:border-edge-strong bg-fg/[0.02]"
                                }`}
                              >
                                <Layers className="h-3.5 w-3.5" />
                                <span>{expandedArch["SNPseek MERN"] ? "Hide Microservices" : "System Architecture: 7 Microservices"}</span>
                              </button>
                              {expandedArch["SNPseek MERN"] && (
                                <ArchitectureDiagram projectKey="snpseek" />
                              )}
                            </div>
                          )}

                          {/* Creative Aspect: Interactive AI RAG Pipeline Architecture for Codebreak 2.0 */}
                          {project.name === "Codebreak 2.0" && (
                            <div className="py-1">
                              <button
                                type="button"
                                onClick={() => toggleArch("Codebreak 2.0")}
                                className={`font-mono text-xs px-2.5 py-1 rounded-md border transition-colors inline-flex items-center gap-1.5 ${
                                  expandedArch["Codebreak 2.0"]
                                    ? "border-ink-1 bg-ink-1 text-bg font-semibold"
                                    : "border-edge text-ink-3 hover:text-ink-1 hover:border-edge-strong bg-fg/[0.02]"
                                }`}
                              >
                                <Layers className="h-3.5 w-3.5" />
                                <span>{expandedArch["Codebreak 2.0"] ? "Hide RAG Pipeline" : "Interactive Architecture: AI Vector RAG"}</span>
                              </button>
                              {expandedArch["Codebreak 2.0"] && (
                                <ArchitectureDiagram projectKey="codebreak" />
                              )}
                            </div>
                          )}

                          {/* Interactive Clickable Tech Pills */}
                          <ul className="flex flex-wrap gap-1.5 pt-2" aria-label="Technologies used">
                            {project.tech.map((t) => {
                              const isSelected = activeTechFilter?.toLowerCase() === t.toLowerCase();
                              return (
                                <li key={t}>
                                  <button
                                    type="button"
                                    onClick={() => handleTechClick(t)}
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-medium transition-all ${
                                      isSelected
                                        ? "bg-ink-1 text-bg shadow-xs font-semibold scale-105"
                                        : "bg-fg/[0.05] border border-edge text-ink-2 hover:border-ink-1/40 hover:text-ink-1"
                                    }`}
                                    title={`Filter projects & experience by ${t}`}
                                  >
                                    <TechLogo name={t} className="h-3.5 w-3.5 shrink-0" />
                                    <span>{t}</span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </TiltCard>
                  );
                })}
              </div>

              <div className="mt-12">
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center font-semibold leading-tight text-ink-1 hover:underline text-sm group"
                >
                  <span>Explore More on GitHub</span>
                  <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </div>
            </section>

            {/* 4. TECHNICAL SKILLS SECTION */}
            <section
              id="skills"
              className="group/sec relative scroll-mt-16 md:scroll-mt-24 rounded-3xl p-5 sm:p-7 -mx-5 sm:-mx-7 border border-transparent transition-all duration-300 hover:bg-bg hover:border-edge-strong hover:shadow-2xl hover:ring-1 hover:ring-ink-1/10"
              aria-label="Technical skills"
            >
              <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-bg/85 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only">
                <h2 className="text-sm font-bold uppercase tracking-widest text-ink-1">
                  Skills
                </h2>
              </div>

              <div className="space-y-6">
                {SKILLS.map(([category, items]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-4">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill) => {
                        const isSelected = activeTechFilter?.toLowerCase() === skill.toLowerCase();
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => handleTechClick(skill)}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs transition-all ${
                              isSelected
                                ? "bg-ink-1 text-bg font-semibold shadow-xs scale-105"
                                : "bg-fg/[0.04] border border-edge text-ink-2 hover:border-ink-1/40 hover:text-ink-1"
                            }`}
                          >
                            <TechLogo name={skill} className="h-3.5 w-3.5 shrink-0" />
                            <span>{skill}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. HONORS & EDUCATION SECTION */}
            <section
              id="honors"
              className="group/sec relative scroll-mt-16 md:scroll-mt-24 rounded-3xl p-5 sm:p-7 -mx-5 sm:-mx-7 border border-transparent transition-all duration-300 hover:bg-bg hover:border-edge-strong hover:shadow-2xl hover:ring-1 hover:ring-ink-1/10"
              aria-label="Honors and education"
            >
              <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-bg/85 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only">
                <h2 className="text-sm font-bold uppercase tracking-widest text-ink-1">
                  Honors &amp; Education
                </h2>
              </div>

              <div className="space-y-10">
                {/* Honors */}
                <div className="space-y-6">
                  {HONORS.map((item) => (
                    <div key={item.title} className="space-y-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-semibold text-base text-ink-1">
                          {item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline inline-flex items-center gap-1"
                            >
                              <span>{item.title}</span>
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                          ) : (
                            <span>{item.title}</span>
                          )}
                        </h3>
                        <span className="font-mono text-xs text-ink-4">{item.period}</span>
                      </div>
                      <div className="font-mono text-xs text-ink-3">{item.award}</div>
                      <p className="text-sm text-ink-3 pt-0.5 leading-relaxed">{item.detail}</p>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div className="pt-6 border-t border-edge flex items-start gap-3.5">
                  <CompanyLogo company="UPLB" className="h-9 w-9 mt-0.5 shrink-0 rounded-md" />
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-semibold text-base text-ink-1">
                        University of the Philippines Los Baños
                      </h3>
                      <span className="font-mono text-xs text-ink-4 shrink-0">2021 — 2025</span>
                    </div>
                    <div className="font-mono text-xs text-ink-3">
                      Bachelor of Science in Computer Science · Honor Roll
                    </div>
                    <p className="text-sm text-ink-3 pt-1 leading-relaxed">
                      Provincial Government of Laguna Academic Scholar. Key coursework: Operating Systems, Computer Networks, Database Systems, Data Structures &amp; Algorithms, Software Engineering.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. CONTACT / FOOTER */}
            <footer
              className="group/sec relative rounded-3xl p-5 sm:p-7 -mx-5 sm:-mx-7 border border-transparent transition-all duration-300 hover:bg-bg hover:border-edge-strong hover:shadow-2xl hover:ring-1 hover:ring-ink-1/10 pt-10 space-y-6 text-sm text-ink-4"
            >
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-ink-1">
                  Get in Touch
                </h3>
                <p className="leading-relaxed text-ink-3">
                  I'm currently open to full-time software engineering roles (remote worldwide, open to US hours). Whether you have a project in mind or want to speak with me, my inbox is always open.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={PROFILE.gmailCompose}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => fireConfetti()}
                    className="inline-flex items-center gap-2 rounded-lg bg-fg px-4 py-2 font-medium text-bg shadow-sm hover:opacity-90 transition-opacity text-sm cursor-pointer"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Say Hello</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-2 rounded-lg border border-edge px-3.5 py-2 font-medium text-ink-2 hover:border-edge-strong transition-colors text-sm"
                  >
                    {copiedEmail ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copiedEmail ? "Copied" : "Copy Email"}</span>
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-edge flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-ink-4">
                <span>© {new Date().getFullYear()} Jet Timothy Cerezo</span>
                <VisitorCounter />
              </div>
            </footer>

          </main>
        </div>
      </div>

      {/* Floating Active Tech Filter HUD */}
      {activeTechFilter && (
        <aside
          aria-label="Active technology filter"
          className="fixed bottom-6 right-6 z-40 animate-reveal"
        >
          <div className="flex items-center gap-2.5 rounded-full border border-edge bg-bg/95 px-4 py-2 shadow-2xl backdrop-blur-md ring-1 ring-ink-1/10 font-mono text-xs">
            <Sparkles className="h-3.5 w-3.5 text-ink-1" />
            <span className="text-ink-3">Filtering by:</span>
            <span className="font-semibold text-ink-1">{activeTechFilter}</span>
            <span className="text-ink-4">
              ({matchCounts.exp} roles, {matchCounts.proj} projects)
            </span>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setActiveTechFilter(null);
              }}
              className="ml-1 p-0.5 rounded-full text-ink-4 hover:bg-fg/10 hover:text-ink-1 transition-colors"
              title="Clear filter (Esc)"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </aside>
      )}

      {/* Screenshot Lightbox Modal */}
      <ScreenshotModal
        isOpen={isScreenshotOpen}
        onClose={() => setIsScreenshotOpen(false)}
        items={SANDALAN_SCREENSHOTS}
        currentIndex={screenshotIndex}
        onIndexChange={setScreenshotIndex}
        playStoreUrl="https://play.google.com/store/apps/details?id=com.jvcerezo.exitplan"
      />

      {/* Floating Taj AI Launcher (bottom-right) */}
      {!activeTechFilter && !isTajAIOpen && (
        <TajAILauncher onClick={() => setIsTajAIOpen(true)} />
      )}

      {/* Taj AI Context-Aware RAG Assistant Drawer */}
      <TajAIModal
        isOpen={isTajAIOpen}
        onClose={() => setIsTajAIOpen(false)}
      />

      {/* Raycast / Linear style Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={scrollTo}
        onToggleTheme={toggleTheme}
        onToggleSound={toggleSound}
        onFilterTech={handleTechClick}
        onCopyEmail={handleCopyEmail}
        onOpenTajAI={() => setIsTajAIOpen(true)}
        theme={theme}
        soundEnabled={soundEnabled}
      />

      {/* Copy Email Toast */}
      <Toast
        isOpen={isToastOpen}
        onClose={() => setIsToastOpen(false)}
        message={toastMessage}
      />
    </div>
  );
}

export default App;
