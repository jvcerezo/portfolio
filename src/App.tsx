import { useEffect, useState } from 'react';
import {
  Menu, X, Mail, Phone, MapPin, Github, Linkedin, Download,
  Code, Database, Server, ArrowUpRight,
  Smartphone, Shield, Sparkles, Globe, Zap, CheckCircle2, Palette,
  Trophy, Leaf, Briefcase, Rocket, Terminal,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', num: '00' },
  { id: 'sandalan', label: 'Sandalan', num: '01' },
  { id: 'about', label: 'About', num: '02' },
  { id: 'work', label: 'Work', num: '03' },
  { id: 'contact', label: 'Contact', num: '04' },
];

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.jvcerezo.exitplan';
const SANDALAN_SITE = 'https://exitplan-tau.vercel.app';

// WordPress mshots — free, aggressively cached, loads fast
const shot = (url: string) =>
  `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1600&h=1000`;

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

function useRevealOnScroll() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const PROJECTS = [
  {
    code: '02',
    title: 'IskOS',
    subtitle: 'Academic OS for UPLB students',
    description:
      'Import class schedules, sync with Google Calendar, track absences, and compute GWA. Built for friends who kept missing deadlines.',
    link: 'https://isk-os.vercel.app',
    tech: ['React', 'TypeScript', 'Google Calendar API', 'Supabase'],
    status: 'In Dev',
  },
  {
    code: '03',
    title: 'Ottodot',
    subtitle: 'Full-stack technical assessment',
    description:
      'Gemini-powered math practice generator with session history. Submitted as a full-stack recruitment task.',
    link: 'https://ottodot-coding-task-full-stack-eta.vercel.app',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'Gemini API'],
    status: 'Live',
  },
  {
    code: '04',
    title: 'SNP-MERN',
    subtitle: 'Genetic variant analysis · IRRI',
    description:
      'Rewrite of IRRI\'s legacy SNPSeek platform into a modern MERN microservices stack with advanced filtering and interactive charts.',
    link: 'https://snpseek-mern.vercel.app',
    tech: ['React', 'Node.js', 'Express', 'MongoDB'],
    status: 'Live',
  },
  {
    code: '05',
    title: 'SOSC3',
    subtitle: 'Civic tech advocacy platform',
    description:
      'Social advocacy app for community engagement and awareness campaigns, built during UPLB Computer Science Society.',
    link: 'https://sosc3-advocacy-app.vercel.app',
    tech: ['React', 'Tailwind', 'Vercel'],
    status: 'Live',
  },
  {
    code: '06',
    title: 'Diet Plan',
    subtitle: 'Health and nutrition planner',
    description:
      'Personalized diet planner with calorie targets and meal recommendations. Full MERN stack with a clean, approachable UI.',
    link: 'https://diet-plan-calculator.vercel.app',
    tech: ['MERN', 'Tailwind'],
    status: 'MVP',
  },
  {
    code: '07',
    title: 'MDCAS',
    subtitle: 'Dental clinic management',
    description:
      'Appointment scheduling, patient records, and an admin dashboard for Maralit Dental Clinic.',
    link: 'https://mdcas-fe.vercel.app',
    tech: ['MERN', 'Tailwind'],
    status: 'MVP',
  },
];

function ProjectCard({ p, idx }: { p: (typeof PROJECTS)[number]; idx: number }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <a
      href={p.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`reveal delay-${(idx % 4) + 1} group relative border border-white/10 bg-white/[0.015] card-hover overflow-hidden block`}
    >
      {/* Browser chrome bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/[0.02]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        </div>
        <div className="flex-1 flex justify-center">
          <span className="font-mono text-[10px] tracking-[0.1em] text-white/45 truncate max-w-[70%]">
            {p.link.replace(/^https?:\/\//, '')}
          </span>
        </div>
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/40">
          {p.status}
        </span>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden bg-[#0f0f0f]">
        <div className="absolute inset-0 grid-bg-dense opacity-40" />

        {/* Fallback label shown while screenshot loads */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${
            loaded ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="font-display text-6xl lg:text-7xl text-white/20 leading-none tracking-tight">
            {p.title}
          </div>
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/30 mt-4">
            loading preview
          </div>
        </div>

        <img
          src={shot(p.link)}
          alt={`${p.title} preview`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`relative w-full h-full object-cover object-top transition-all duration-700 ${
            loaded ? 'opacity-100 group-hover:scale-[1.02]' : 'opacity-0'
          }`}
        />

        {/* Subtle bottom gradient for legibility of the badge */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80" />

        <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full border border-white/25 flex items-center justify-center bg-black/60 backdrop-blur-sm group-hover:bg-[var(--accent)] group-hover:text-black group-hover:border-[var(--accent)] transition-all">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/35">
                {p.code}
              </span>
              <h3 className="font-display text-2xl lg:text-[1.75rem] font-semibold tracking-tight text-white">
                {p.title}
              </h3>
            </div>
            <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">
              {p.subtitle}
            </div>
          </div>
        </div>

        <p className="text-white/65 leading-relaxed mb-5 text-[14.5px]">{p.description}</p>

        <div className="flex flex-wrap gap-2">
          {p.tech.map((t) => (
            <span
              key={t}
              className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/60 border border-white/15 px-2.5 py-1 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

const EXPERIENCE = [
  {
    role: 'Junior Test Automation Engineer',
    company: 'Billease',
    period: 'Apr 2025 — Present',
    description:
      'Build and maintain Android test automation with Appium and BrowserStack. Surfaced 20+ critical bugs and shipped 40+ merge requests improving app stability across release cycles. Authored regression suites and spec files integrated into CI/CD for rapid pre-production issue resolution.',
    tags: ['Appium', 'BrowserStack', 'Android', 'CI/CD', 'Regression'],
  },
  {
    role: 'Codebreak 2.0 Champion',
    company: 'Tenext.ai Hackathon',
    period: 'May 2025',
    description:
      'Won 1st place building a RAG-based AI platform for customer support agents. The assistant generated live call scripts from past and current tickets and ran automated QA analytics after calls. Handled APIs, microservices, deployment, and AI integration to ship an MVP in under 24 hours.',
    tags: ['AI', 'RAG', 'Microservices', 'Real-time'],
  },
  {
    role: 'BS Computer Science',
    company: 'University of the Philippines Los Baños',
    period: 'Sep 2021 — Jul 2025',
    description:
      'Honor Roll. Iskolar ng Laguna and UP SLAS scholar. Relevant coursework: Operating Systems (CMSC 125), Computer Networks (CMSC 137), Cybersecurity, Data Structures & Algorithms. Thesis affiliate with IRRI on bioinformatics tooling.',
    tags: ['UPLB CS', 'Honor Roll', 'Iskolar ng Laguna', 'UP SLAS'],
  },
  {
    role: 'Bioinformatics SWE Intern · Thesis Affiliate',
    company: 'International Rice Research Institute (IRRI)',
    period: 'Jul 2024 — May 2025',
    description:
      'Implemented a custom OAuth authentication flow for SNPseek in a Dockerized Drupal environment to improve secure user access and system integration. Designed and developed a MERN-based SNPseek platform using a microservices architecture for scalability, usability, and faster data processing.',
    tags: ['MERN', 'Drupal', 'Docker', 'OAuth', 'Microservices'],
  },
  {
    role: 'Code Wars Co-Head · Project Manager',
    company: 'UPLB CS Society · 41st CS Week',
    period: 'Oct 2023 — Jul 2025',
    description:
      'Led a 7-member dev team enhancing the competitive programming event platform. Oversaw feature development, bug tracking, testing, and deployment. Supported 20 teams, 3 judges, and 3 continuous hours of live service with zero downtime.',
    tags: ['Leadership', 'Deploy', 'Ship'],
  },
  {
    role: 'Freelance Full-Stack Developer',
    company: '2 Weeks · Project-based',
    period: 'Aug 2024 — Oct 2024',
    description:
      'Built a story-based interactive game with a 3-person team using the MERN stack. Handled frontend, backend, and UI/UX to ensure client satisfaction.',
    tags: ['MERN', 'Client work'],
  },
  {
    role: 'eLBigayan · Team Lead',
    company: 'Flutter Donation Platform',
    period: 'May 2024 — Jun 2024',
    description:
      'Led a 2-member team building a donation system. Used Flutter and Dart with 4 Firebase services to create a secure, scalable backend.',
    tags: ['Flutter', 'Firebase', 'Team Lead'],
  },
  {
    role: 'Fire Nation Invasion · Game Developer',
    company: 'Unity Multiplayer Game',
    period: 'Apr 2024 — Jun 2024',
    description:
      'Worked with 2 teammates on character abilities and game mechanics. Implemented networked multiplayer for up to 4 players across different computers.',
    tags: ['Unity', 'C#', 'Multiplayer'],
  },
  {
    role: 'PICSEL · Backend Developer',
    company: 'Reservation System · 20-dev team',
    period: 'Feb 2024 — Jun 2024',
    description:
      '9 commits, 12 merged PRs across 7 features in a 20-developer team over 5 months. Integrated Google authentication to enhance security and streamline the login process.',
    tags: ['Node.js', 'PostgreSQL', 'Auth'],
  },
];

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useScrollSpy(NAV_ITEMS.map((n) => n.id));
  useRevealOnScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-white">
      {/* NAV */}
      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/75 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-5">
          <div className="flex justify-between items-center">
            <button
              onClick={() => scrollToSection('home')}
              className="flex items-center gap-2 group"
            >
              <span className="w-7 h-7 rounded-md border border-white/20 flex items-center justify-center group-hover:border-[var(--accent)] transition-colors">
                <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
              </span>
              <span className="font-display text-[15px] font-semibold tracking-tight">
                jvcerezo
              </span>
            </button>

            <div className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 backdrop-blur">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-1.5 text-[13px] transition-colors rounded-full flex items-center gap-2 ${
                    active === item.id
                      ? 'bg-white text-black font-medium'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-60">{item.num}</span>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden md:block">
              <Button
                size="sm"
                className="bg-[var(--accent)] text-black hover:bg-[var(--accent)]/90 rounded-full px-5 font-medium"
                asChild
              >
                <a href="/JetCerezo_Resume.pdf" download>
                  <Download className="w-3.5 h-3.5 mr-2" />
                  Resume
                </a>
              </Button>
            </div>

            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-5 pb-4 border-t border-white/10">
              <div className="flex flex-col space-y-1 mt-4">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left py-2.5 px-3 rounded-lg text-base transition-colors flex items-center gap-3 ${
                      active === item.id ? 'bg-white/10 text-white' : 'text-white/70'
                    }`}
                  >
                    <span className="font-mono text-[11px] opacity-50">{item.num}</span>
                    {item.label}
                  </button>
                ))}
                <Button
                  size="sm"
                  className="mt-3 bg-[var(--accent)] text-black hover:bg-[var(--accent)]/90 rounded-full font-medium"
                  asChild
                >
                  <a href="/JetCerezo_Resume.pdf" download>
                    <Download className="w-3.5 h-3.5 mr-2" />
                    Download Resume
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="relative min-h-[100vh] flex items-center overflow-hidden pt-28 pb-20">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute left-0 top-1/3 w-[60%] h-[40%] bg-gradient-to-r from-[var(--accent-dim)] to-transparent blur-3xl pointer-events-none opacity-40" />

        <div className="relative max-w-[1440px] w-full mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-10 animate-reveal">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-white/70 border border-white/15 rounded-full pl-2 pr-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-dot" />
                  <span className="text-[var(--accent)]">/</span> Available for work
                </span>
                <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-white/45">
                  Laguna, PH · UTC+8
                </span>
              </div>

              <div>
                <h1 className="font-display font-semibold leading-[0.9] tracking-[-0.045em] text-[clamp(3rem,9.5vw,9rem)] text-white">
                  Jet Timothy<br />
                  Cerezo<span className="text-[var(--accent)]">.</span>
                </h1>
                <p className="font-display text-2xl lg:text-4xl text-white/60 font-medium tracking-tight mt-4">
                  Software developer shipping full-stack products.
                </p>
              </div>

              <p className="text-[17px] lg:text-lg text-white/70 max-w-2xl leading-relaxed">
                I design and ship web and mobile products end-to-end, from database schema to
                Play Store. Currently a Junior Test Automation Engineer at{' '}
                <span className="text-white font-medium">Billease</span>, and shipping{' '}
                <button
                  onClick={() => scrollToSection('sandalan')}
                  className="link-underline text-white font-medium"
                >
                  Sandalan
                </button>
                , a Filipino adulting and finance app live on Google Play. UPLB Computer Science,
                Batch 2025.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-[var(--accent)] text-black hover:bg-[var(--accent)]/90 font-medium rounded-full px-7 h-12"
                  onClick={() => scrollToSection('sandalan')}
                >
                  See Sandalan <span className="ml-2">→</span>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="border border-white/20 text-white hover:bg-white/10 rounded-full px-7 h-12"
                  onClick={() => scrollToSection('work')}
                >
                  All Projects
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="border border-white/20 text-white hover:bg-white/10 rounded-full px-7 h-12"
                  asChild
                >
                  <a href="mailto:jetjetcerezo@gmail.com">
                    <Mail className="w-4 h-4 mr-2" />
                    Hire me
                  </a>
                </Button>
              </div>

              <div className="flex items-center gap-5 pt-2">
                {[
                  { icon: Github, href: 'https://github.com/jvcerezo', label: 'GitHub' },
                  { icon: Linkedin, href: 'https://www.linkedin.com/in/jet-timothy-cerezo-126903254', label: 'LinkedIn' },
                  { icon: Mail, href: 'mailto:jetjetcerezo@gmail.com', label: 'Email' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-white/55 hover:text-[var(--accent)] transition-colors"
                  >
                    <s.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 animate-reveal">
              <div className="relative">
                <div className="aspect-[4/5] relative overflow-hidden rounded-2xl border border-white/15">
                  <img
                    src="/profile.jpg"
                    alt="Jet Timothy Cerezo"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                    <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/80 bg-black/60 backdrop-blur-sm border border-white/15 px-2 py-1 rounded">
                      ~/portrait.jpg
                    </div>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/70 mb-1.5">
                      // CURRENTLY
                    </div>
                    <div className="text-white font-medium">
                      Test Automation @ Billease
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-px bg-white/10 border border-white/10">
                  {[
                    { v: '3y', l: 'Building' },
                    { v: '11+', l: 'Projects' },
                    { v: '1', l: 'On Play Store' },
                  ].map((m) => (
                    <div key={m.l} className="bg-[var(--bg)] p-4 text-center">
                      <div className="font-display text-2xl font-semibold">{m.v}</div>
                      <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/45 mt-0.5">
                        {m.l}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECOGNITION STRIP */}
      <section className="relative py-14 border-y border-white/10 bg-white/[0.015]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-3 mb-8 reveal">
            <span className="section-label bracket">Recognition</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 reveal">
            {[
              { icon: Trophy, title: 'Codebreak 2.0 Champion', meta: 'Tenext.ai · 2025' },
              { icon: Briefcase, title: 'Jr. Test Automation Engineer', meta: 'Billease · Apr 2025 · Present' },
              { icon: Leaf, title: 'Bioinformatics SWE Intern', meta: 'IRRI · 2024 — 2025' },
              { icon: Rocket, title: 'Google Play Developer', meta: 'Sandalan · Live' },
            ].map((r) => (
              <div key={r.title} className="bg-[var(--bg)] p-6 flex items-start gap-4">
                <r.icon className="w-4 h-4 text-[var(--accent)] mt-1 shrink-0" />
                <div>
                  <div className="text-white font-medium text-[15px] leading-snug font-display">
                    {r.title}
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/45 mt-1.5">
                    {r.meta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SANDALAN */}
      <section id="sandalan" className="relative py-28 lg:py-32 border-t border-white/10 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />

        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-3 mb-10 reveal">
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--accent)]">
              [01] Featured Case Study
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-white/40">
              Mar 2026 — present
            </span>
          </div>

          {/* Feature graphic */}
          <div className="reveal relative aspect-[1024/500] w-full overflow-hidden rounded-2xl border border-white/15 mb-14">
            <img
              src="/sandalan/feature.png"
              alt="Sandalan feature graphic"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-end p-6 lg:p-12">
              <div className="max-w-3xl">
                <Badge
                  variant="outline"
                  className="border-[var(--accent)]/40 text-[var(--accent)] bg-[var(--accent)]/10 rounded-full mb-4 font-mono text-[10px] tracking-[0.22em] uppercase"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mr-2 animate-dot" />
                  Live on Google Play
                </Badge>
                <div className="font-display font-semibold tracking-[-0.04em] text-5xl lg:text-8xl leading-[0.9] text-white">
                  Sandalan<span className="text-[var(--accent)]">.</span>
                </div>
                <div className="font-display text-xl lg:text-3xl text-white/75 mt-2 max-w-2xl font-medium tracking-tight">
                  The adulting guide Filipinos wish they had at 22.
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-8">
              <p className="text-lg text-white/75 leading-relaxed reveal">
                A solo-built Filipino adulting and finance app. 15,000+ lines of Flutter across
                13 synced database tables, 38+ bank integrations, OCR receipt scanning, a Taglish
                AI chat assistant, government tax and contribution calculators, and Google Play
                Billing. Works fully offline, syncs when online, zero trackers.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 reveal delay-1">
                {[
                  { k: '15K+', v: 'Lines of Flutter' },
                  { k: '13', v: 'Synced tables' },
                  { k: '38+', v: 'Bank integrations' },
                  { k: '1,000+', v: 'Gov offices' },
                ].map((m) => (
                  <div key={m.v} className="bg-[var(--bg)] p-5">
                    <div className="font-display text-3xl font-semibold tracking-tight">{m.k}</div>
                    <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/45 mt-1">
                      {m.v}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 reveal delay-2">
                {['Flutter', 'Dart', 'Riverpod', 'Drift (SQLite)', 'Supabase', 'PostgreSQL', 'Go Router', 'Google Play Billing', 'OCR', 'RAG'].map(
                  (t) => (
                    <span
                      key={t}
                      className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/75 border border-white/20 bg-white/[0.02] rounded-full px-3 py-1.5"
                    >
                      {t}
                    </span>
                  )
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-2 reveal delay-3">
                <Button
                  size="lg"
                  className="bg-[var(--accent)] text-black hover:bg-[var(--accent)]/90 rounded-full px-6 font-medium h-12"
                  asChild
                >
                  <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Google Play
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="border border-white/20 text-white hover:bg-white/10 rounded-full px-6 h-12"
                  asChild
                >
                  <a href={SANDALAN_SITE} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-4 h-4 mr-2" />
                    Landing page
                  </a>
                </Button>
              </div>
            </div>

            {/* Phone stack */}
            <div className="lg:col-span-5 reveal delay-2">
              <div className="relative h-[480px] lg:h-[560px] max-w-md mx-auto">
                {[
                  { src: '/sandalan/screen-2.png', rotate: '-6deg', tx: '-30%', ty: '8%', z: 10 },
                  { src: '/sandalan/screen-3.png', rotate: '0deg', tx: '0%', ty: '0%', z: 20 },
                  { src: '/sandalan/screen-1.png', rotate: '6deg', tx: '30%', ty: '8%', z: 10 },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="absolute top-0 left-1/2 w-[60%] aspect-[9/19] overflow-hidden rounded-[2rem] border border-white/20 bg-black shadow-2xl shadow-black/50"
                    style={{
                      transform: `translate(calc(-50% + ${p.tx}), ${p.ty}) rotate(${p.rotate})`,
                      zIndex: p.z,
                    }}
                  >
                    <img src={p.src} alt="Sandalan screen" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Case study row */}
          <div className="mt-28 grid lg:grid-cols-3 gap-px bg-white/10 border border-white/10 reveal">
            {[
              {
                label: '01 / The problem',
                body:
                  'Adulting and personal finance for Filipinos is scattered across outdated government PDFs, conflicting blog posts, and tita advice. First-time TIN, SSS, or PhilHealth registrations are stressful, and money tracking apps ignore the local context (GCash, Maya, local banks, 13th month pay).',
              },
              {
                label: '02 / The approach',
                body:
                  'Architected an offline-first sync engine with conflict resolution, incremental replication, and retry/failure recovery across 13 tables, from PostgreSQL (Supabase) to local SQLite (Drift). Row-level security, RLS-backed auth, 38+ bank integrations, OCR receipt scanning, and a RAG-based Taglish chat assistant.',
              },
              {
                label: '03 / The outcome',
                body:
                  '15,000+ line Flutter app live on Google Play. Every feature free, government tax and contribution calculators aligned with 2026 rates, Google Play Billing hooked up, zero trackers. Shipping updates weekly driven by in-app user feedback.',
              },
            ].map((c) => (
              <div key={c.label} className="bg-[var(--bg)] p-8">
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
                  {c.label}
                </div>
                <p className="text-white/75 leading-relaxed text-[15px]">{c.body}</p>
              </div>
            ))}
          </div>

          {/* Feature grid */}
          <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: CheckCircle2,
                title: 'Step-by-step guides',
                body:
                  'Six life stages from Unang Hakbang (fresh grad) to Gintong Taon (retirement). Real fees, real offices, real paperwork.',
              },
              {
                icon: MapPin,
                title: '1,000+ government offices',
                body:
                  'BIR, SSS, PhilHealth, Pag-IBIG, LTO, DFA, PSA. Find the closest branch and get directions in one tap.',
              },
              {
                icon: Zap,
                title: 'Personal life admin',
                body:
                  'Bills, expenses, budgets, goals, and a document vault. Built for how Filipinos actually spend money.',
              },
              {
                icon: Sparkles,
                title: 'Taglish AI assistant',
                body:
                  '"Anong ginastos ko this week?", "Pano kumuha ng TIN?". Natural language, plain Filipino-English.',
              },
              {
                icon: Shield,
                title: 'Offline-first, private',
                body:
                  'Local SQLite via Drift, Supabase sync when online. No trackers, RA 10173 compliant, export or delete anytime.',
              },
              {
                icon: Server,
                title: 'Shipped solo',
                body:
                  'Designed, built, and launched end-to-end: Flutter app, Supabase backend, schema migrations, CI, store listing.',
              },
            ].map((f, idx) => (
              <div
                key={f.title}
                className={`reveal delay-${(idx % 5) + 1} p-7 border border-white/10 bg-white/[0.015] card-hover`}
              >
                <f.icon className="w-5 h-5 text-[var(--accent)] mb-5" />
                <h3 className="font-display text-xl font-semibold mb-2 tracking-tight">{f.title}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative py-28 lg:py-32 px-6 lg:px-10 border-t border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 mb-20">
            <div className="lg:col-span-5 reveal">
              <div className="flex items-center gap-3 mb-4">
                <span className="section-label bracket">About</span>
                <span className="w-8 h-px bg-white/30" />
              </div>
              <h2 className="font-display text-5xl lg:text-7xl font-semibold tracking-[-0.035em] leading-[0.95]">
                I ship<br />
                <span className="text-white/45">end-to-end.</span>
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-5 text-white/70 text-[17px] leading-relaxed reveal delay-1">
              <p>
                Fresh Computer Science graduate from the University of the Philippines Los Baños
                (Batch 2025). Over the last three years I've built web, mobile, and microservices
                apps, won a national AI hackathon, interned on bioinformatics software for IRRI,
                and led teams for academic flagship events.
              </p>
              <p>
                Lately I ship as a solo developer. That means writing the schema, wiring the
                backend, polishing the UI, watching crash logs, and reading user feedback the
                morning after a release. I care about products that work for the market they're
                actually built for.
              </p>
              <p className="text-white font-medium">
                Hiring a generalist who owns the full stack and gets work in front of real users?
                Let's talk.
              </p>
            </div>
          </div>

          <Tabs defaultValue="skills" className="w-full">
            <TabsList className="flex w-full max-w-lg mx-auto mb-12 bg-white/[0.04] border border-white/10 rounded-full p-1">
              <TabsTrigger
                value="skills"
                className="flex-1 rounded-full text-white data-[state=active]:bg-white data-[state=active]:text-black font-medium"
              >
                Skills
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="flex-1 rounded-full text-white data-[state=active]:bg-white data-[state=active]:text-black font-medium"
              >
                Experience
              </TabsTrigger>
            </TabsList>

            <TabsContent value="skills">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    category: 'Languages',
                    icon: Code,
                    skills: ['Java', 'C / C++', 'Python', 'JavaScript', 'TypeScript', 'Dart', 'SQL'],
                  },
                  {
                    category: 'Mobile',
                    icon: Smartphone,
                    skills: ['Flutter', 'Dart', 'Riverpod', 'Drift (SQLite)', 'Go Router', 'Supabase Flutter'],
                  },
                  {
                    category: 'Frontend',
                    icon: Palette,
                    skills: ['React', 'Next.js', 'Tailwind CSS', 'shadcn/ui', 'Vite'],
                  },
                  {
                    category: 'Backend',
                    icon: Server,
                    skills: ['Node.js', 'Express', 'Supabase', 'PostgreSQL', 'MongoDB', 'REST APIs'],
                  },
                  {
                    category: 'Test Automation',
                    icon: Shield,
                    skills: ['Appium', 'BrowserStack', 'Android E2E', 'Regression suites', 'CI/CD'],
                  },
                  {
                    category: 'Infra & AI',
                    icon: Database,
                    skills: ['Git', 'Docker', 'Vercel', 'AWS', 'Gemini API', 'Claude API', 'RAG'],
                  },
                ].map((group) => (
                  <div
                    key={group.category}
                    className="p-6 border border-white/10 bg-white/[0.015] card-hover"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <group.icon className="w-4 h-4 text-[var(--accent)]" />
                      <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-white/80">
                        {group.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((s) => (
                        <span
                          key={s}
                          className="text-[13px] text-white/85 border border-white/15 rounded-full px-3 py-1"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="experience">
              <div className="relative">
                <div className="absolute left-0 md:left-[140px] top-0 bottom-0 w-px bg-white/10" />
                <div className="space-y-2">
                  {EXPERIENCE.map((job, index) => (
                    <div
                      key={job.role + index}
                      className="relative grid md:grid-cols-[140px_1fr] gap-6 md:gap-10 py-6 border-b border-white/5 last:border-b-0"
                    >
                      <div className="md:pr-6 relative">
                        <span className="absolute -left-[3px] md:left-[134px] top-1 w-2 h-2 rounded-full bg-[var(--accent)]" />
                        <div className="pl-6 md:pl-0 md:text-right">
                          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/50">
                            {job.period}
                          </div>
                        </div>
                      </div>
                      <div className="pl-6 md:pl-10">
                        <h3 className="font-display text-xl lg:text-2xl font-semibold text-white tracking-tight">
                          {job.role}
                        </h3>
                        <div className="text-white/55 text-sm mt-1 font-mono tracking-[0.05em]">
                          {job.company}
                        </div>
                        <p className="text-white/70 leading-relaxed mt-3 text-[15px]">
                          {job.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {job.tags.map((t) => (
                            <span
                              key={t}
                              className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/55 border border-white/15 px-2.5 py-1 rounded-full"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="relative py-28 lg:py-32 px-6 lg:px-10 border-t border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 reveal">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="section-label bracket">Selected Work</span>
                <span className="w-8 h-px bg-white/30" />
              </div>
              <h2 className="font-display text-5xl lg:text-7xl font-semibold tracking-[-0.035em] leading-[0.95]">
                Other things<br />
                <span className="text-white/45">I've shipped.</span>
              </h2>
            </div>
            <a
              href="https://github.com/jvcerezo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-xs tracking-[0.22em] uppercase text-white/60 hover:text-[var(--accent)] link-underline"
            >
              All on GitHub <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {PROJECTS.map((p, idx) => (
              <ProjectCard key={p.title} p={p} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative py-28 lg:py-32 px-6 lg:px-10 border-t border-white/10 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative max-w-[1440px] mx-auto">
          <div className="text-center mb-14 reveal">
            <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--accent)] mb-6">
              [04] Contact
            </div>
            <h2 className="font-display font-semibold text-[clamp(3rem,9vw,8rem)] leading-[0.92] tracking-[-0.04em]">
              Got a project?<br />
              <span className="text-white/45">Let's build it.</span>
            </h2>
            <p className="text-lg text-white/65 mt-8 max-w-2xl mx-auto">
              Open to full-time roles, contract work, and partnerships. Happy to chat about
              Flutter apps, React products, or the Filipino market specifically.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10 max-w-4xl mx-auto mb-12 reveal">
            {[
              { icon: Mail, label: 'Email', value: 'jetjetcerezo@gmail.com', href: 'mailto:jetjetcerezo@gmail.com' },
              { icon: Phone, label: 'Phone', value: '+63 998 914 8907', href: 'tel:+639989148907' },
              { icon: MapPin, label: 'Location', value: 'Laguna, Philippines', href: null },
            ].map((c) => {
              const content = (
                <>
                  <c.icon className="w-4 h-4 text-[var(--accent)] mb-4" />
                  <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/45 mb-2">
                    {c.label}
                  </div>
                  <div className="text-white font-medium">{c.value}</div>
                </>
              );
              return c.href ? (
                <a
                  key={c.label}
                  href={c.href}
                  className="bg-[var(--bg)] p-8 hover:bg-white/[0.04] transition-colors"
                >
                  {content}
                </a>
              ) : (
                <div key={c.label} className="bg-[var(--bg)] p-8">
                  {content}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 reveal delay-2">
            <Button
              size="lg"
              className="bg-[var(--accent)] text-black hover:bg-[var(--accent)]/90 rounded-full px-7 font-medium h-12"
              asChild
            >
              <a href="mailto:jetjetcerezo@gmail.com">
                <Mail className="w-4 h-4 mr-2" />
                Send a message
              </a>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="border border-white/20 text-white hover:bg-white/10 rounded-full px-6 h-12"
              asChild
            >
              <a href="https://github.com/jvcerezo" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="border border-white/20 text-white hover:bg-white/10 rounded-full px-6 h-12"
              asChild
            >
              <a
                href="https://www.linkedin.com/in/jet-timothy-cerezo-126903254"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </a>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="border border-white/20 text-white hover:bg-white/10 rounded-full px-6 h-12"
              asChild
            >
              <a href="/JetCerezo_Resume.pdf" download>
                <Download className="w-4 h-4 mr-2" />
                Resume
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative py-12 px-6 lg:px-10 border-t border-white/10">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-md border border-white/20 flex items-center justify-center">
              <Terminal className="w-3 h-3 text-[var(--accent)]" />
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight">
              Jet Timothy Cerezo
            </span>
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/40">
              © {year}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.22em] uppercase text-white/50">
            <span>Built with React · Vite · Tailwind</span>
            <button onClick={() => scrollToSection('home')} className="hover:text-[var(--accent)]">
              Back to top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
