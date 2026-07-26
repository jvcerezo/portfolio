import { Fragment, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Mail, Phone, MapPin, Github, Linkedin, Download, ArrowUpRight, Sun, Moon,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
];

// Stable module-level identity — passing a fresh array into useScrollSpy on every
// render would tear down and re-register the IntersectionObserver each time.
const NAV_IDS = NAV_ITEMS.map((n) => n.id);

const PROFILE = {
  name: 'Jet Timothy V. Cerezo',
  title: 'Full-Stack Software Engineer',
  email: 'jetjetcerezo@gmail.com',
  // mailto: hands off to whatever the OS default handler is — on Windows that is
  // usually Outlook. Link straight into Gmail's compose view instead.
  gmailCompose:
    'https://mail.google.com/mail/?view=cm&fs=1&to=jetjetcerezo@gmail.com&su=Hello%20Jet',
  phone: '+63 998 914 8907',
  phoneHref: 'tel:+639989148907',
  location: 'Los Baños, Laguna, Philippines',
  availability: 'UTC+8 · Open to US hours',
  github: 'https://github.com/jvcerezo',
  linkedin: 'https://www.linkedin.com/in/jet-timothy-cerezo-126903254',
  resume: '/JetCerezo_Resume.pdf',
};

const SUMMARY = [
  'Full-stack software engineer with 2+ years building and shipping production web applications across front end and back end. I rebuilt a legacy PHP/MySQL research platform at IRRI into a MERN microservices architecture — seven Dockerized Node.js and Express services behind a single API gateway.',
  'Most of what I ship, I ship end-to-end: designing the schema, wiring the REST API, polishing the UI, running the CI pipeline, and reading the logs after deploy. I work comfortably in Agile teams and across Linux and Windows.',
];

const EXPERIENCE = [
  {
    role: 'Junior Test Automation Engineer',
    company: 'Billease',
    meta: 'Remote',
    period: 'Apr 2025 — Present',
    bullets: [
      'Shipped 50+ merge requests and 30,000+ lines of code building automated test coverage and internal tooling for a high-scale consumer-fintech Android app.',
      'Engineered and maintained CI/CD pipeline integrations for the core regression and emergency-hotfix suites, validating every production release across Linux CI runners.',
      'Discovered and resolved 30+ critical, high-impact bugs using Appium and BrowserStack as the final technical gatekeeper before deployment.',
      'Work in Agile/Scrum ceremonies — sprint planning, daily standups, and retrospectives — collaborating with developers and QA across every release cycle.',
    ],
    tech: ['CI/CD', 'Appium', 'BrowserStack', 'Linux', 'Claude API'],
  },
  {
    role: 'Software Developer · Thesis Affiliate',
    company: 'International Rice Research Institute (IRRI)',
    meta: 'Los Baños, Laguna',
    period: 'Jul 2024 — May 2025',
    bullets: [
      'Re-architected IRRI’s legacy SNPseek genomics platform into a MERN microservices system: seven independent Node.js/Express services behind a single API gateway, orchestrated with Docker Compose.',
      'Worked hands-on across the existing PHP/MySQL Drupal stack, building a custom SSO/OAuth layer that bridged the legacy PHP application with the new Node services.',
      'Designed MongoDB schemas and REST/JSON endpoints for large-scale genomic datasets, and built the React front end with multi-criteria filtering and interactive charts.',
    ],
    tech: ['PHP', 'MySQL', 'MongoDB', 'Node.js', 'Express', 'React', 'Docker', 'SSO'],
  },
  {
    role: 'Full-Stack Developer',
    company: 'Freelance / Project-Based',
    meta: 'Remote',
    period: 'Aug 2024 — Oct 2024',
    bullets: [
      'Built a story-based interactive web game on the MERN stack with a 3-person team; owned front end, back end, and UI/UX through to client delivery.',
    ],
    tech: ['MongoDB', 'Express', 'React', 'Node.js'],
  },
  {
    role: 'Code Wars Co-Head · Project Manager',
    company: 'UPLB Computer Science Society',
    meta: 'Los Baños, Laguna',
    period: 'Oct 2023 — Jul 2025',
    bullets: [
      'Led a 7-member development team on the competitive-programming event platform, overseeing feature development, bug tracking, testing, and deployment.',
      'Ran the live platform for 20 teams, 3 judges, and 3 continuous hours of zero-downtime service.',
    ],
    tech: ['Leadership', 'Deployment', 'Testing'],
  },
];

const PROJECTS = [
  {
    name: 'Sandalan',
    tagline: 'Filipino adulting and finance app, live on Google Play',
    year: '2024 — 2025',
    description:
      'Solo-built and shipped: 38+ bank integrations, tax calculators, OCR receipt scanning, and an AI chat assistant. Architected an offline-first sync engine with conflict resolution and incremental replication across 13 tables spanning PostgreSQL and SQLite, secured with row-level security. Currently migrating the product to a single Next.js 16 and TypeScript codebase — deployed to web and packaged for Android and iOS with Capacitor — using Supabase SSR auth, TanStack Query offline persistence, and Dexie/IndexedDB.',
    tech: ['Flutter', 'Dart', 'Supabase', 'PostgreSQL', 'Next.js', 'TypeScript', 'Capacitor'],
    link: 'https://play.google.com/store/apps/details?id=com.jvcerezo.exitplan',
    badge: 'Google Play',
  },
  {
    name: 'SNPseek MERN',
    tagline: 'Genomics microservices platform · IRRI',
    year: '2024 — 2025',
    description:
      'Rewrite of IRRI’s legacy PHP/MySQL SNPseek platform into seven independent Node.js/Express services behind an API gateway, orchestrated with Docker Compose. Advanced multi-criteria filtering and interactive charts over large genomic datasets.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Docker'],
    link: 'https://snpseek-mern.vercel.app',
    badge: null,
  },
  {
    name: 'Codebreak 2.0',
    tagline: 'RAG-based AI support platform — 1st place, Tenext.ai hackathon',
    year: '2025',
    description:
      'Full-stack AI platform for customer-support agents with a RAG assistant, automated live call scripts, and post-call QA analytics. Owned REST APIs, microservices, deployment, and AI integration end-to-end, shipping a working MVP in under 24 hours.',
    tech: ['Node.js', 'Microservices', 'RAG', 'REST APIs'],
    link: 'https://www.facebook.com/photo/?fbid=706685865053901&set=a.263981095991049',
    badge: '1st place',
  },
  {
    name: 'PICSEL',
    tagline: 'Reservation system · 20-developer team',
    year: '2024',
    description:
      'Built back-end components over 5 months in a 20-developer team; integrated Google authentication and shipped across 7 features with peer code review.',
    tech: ['Node.js', 'PostgreSQL', 'OAuth'],
    link: null,
    badge: null,
  },
  {
    name: 'SOSC3',
    tagline: 'Civic tech advocacy platform',
    year: '2023',
    description:
      'Social advocacy app for community engagement and awareness campaigns, built during UPLB Computer Science Society events.',
    tech: ['React', 'Tailwind CSS', 'Vercel'],
    link: 'https://sosc3-advocacy-app.vercel.app',
    badge: null,
  },
];

const SKILLS: [string, string][] = [
  ['Languages', 'JavaScript · TypeScript · PHP · SQL · Python · Java · C/C++ · Dart'],
  ['Front End', 'React · Next.js · jQuery · HTML5 · CSS3 · Tailwind CSS · Vite'],
  ['Back End', 'Node.js · Express · Nest.js · REST APIs · JSON · Microservices · API gateway & middleware · JWT / OAuth / SSO'],
  ['Databases', 'MySQL · MongoDB · PostgreSQL · SQLite · Supabase · Schema design · Query optimization'],
  ['DevOps', 'Docker · Docker Compose · CI/CD · Git · GitHub · GitLab · Vercel · AWS · Linux & Windows'],
  ['Tools', 'VS Code · Postman · Jira · Agile/Scrum · Code review · Unit & E2E testing'],
  ['Mobile & AI', 'Flutter · Riverpod · Drift · Claude API · Gemini API · RAG · Hugging Face · Groq'],
];

const EDUCATION = {
  school: 'University of the Philippines Los Baños',
  degree: 'Bachelor of Science, Computer Science',
  period: '2021 — 2025',
  meta: 'Los Baños, Laguna',
  notes:
    'Graduated Honor Roll; Provincial Government of Laguna Scholarship Recipient. Coursework: Operating Systems, Computer Networks, Cybersecurity, Data Structures & Algorithms, Database Systems.',
};

type Theme = 'light' | 'dark';

function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = window.localStorage.getItem('theme') as Theme | null;
    return stored === 'light' || stored === 'dark' ? stored : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    try {
      window.localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))];
}

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string>('');
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  // The final section sits too close to the document end to ever reach the
  // observer band, so bottom-of-page always resolves to the last nav item.
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      setAtEnd(window.innerHeight + window.scrollY >= doc.scrollHeight - 2);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return atEnd ? ids[ids.length - 1] : active;
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
      { threshold: 0.05, rootMargin: '0px 0px -32px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function Section({
  id,
  label,
  children,
}: {
  id?: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-label={label} className="scroll-mt-20 pt-14">
      <div className="reveal">
        <h2 className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-ink-4">
          {label}
        </h2>
        <div className="mt-2 h-px w-full bg-edge-strong" />
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/* Title on the left, date flush right — the resume's two-column entry head. */
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
      {items.join('  ·  ')}
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
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="flex items-center gap-1.5 text-ink-2 transition-colors hover:text-brand"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {children}
    </a>
  );
}

function App() {
  const [theme, toggleTheme] = useTheme();
  const active = useScrollSpy(NAV_IDS);
  const [scrolled, setScrolled] = useState(false);
  useRevealOnScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-bg text-ink-1">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      {/* TOP BAR */}
      <header
        className={`sticky top-0 z-50 bg-bg/85 backdrop-blur-md transition-colors ${
          scrolled ? 'border-b border-edge' : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-14 max-w-[760px] items-center justify-between gap-4 px-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-display text-[14px] font-semibold tracking-tight text-ink-1 transition-colors hover:text-ink-3"
          >
            Jet Cerezo
          </button>

          <nav aria-label="Sections" className="hidden items-center gap-6 sm:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                aria-current={active === item.id ? 'true' : undefined}
                className={`relative py-1 text-[13px] transition-colors ${
                  active === item.id ? 'text-ink-1' : 'text-ink-4 hover:text-ink-2'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-brand transition-transform duration-300 ${
                    active === item.id ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex h-8 w-8 items-center justify-center rounded-md text-ink-3 transition-colors hover:bg-fg/5 hover:text-ink-1"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
            <a
              href={PROFILE.resume}
              download
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] text-ink-3 transition-colors hover:bg-fg/5 hover:text-ink-1"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Résumé</span>
            </a>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-[760px] px-6 pb-24">
        {/* MASTHEAD */}
        <div className="flex flex-col-reverse gap-8 pt-16 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
          <div className="animate-reveal min-w-0 flex-1">
            <h1 className="font-display text-[30px] font-semibold leading-tight tracking-[-0.03em] text-ink-1 sm:text-[34px]">
              {PROFILE.name}
            </h1>
            <p className="mt-1 text-[16px] text-ink-3">{PROFILE.title}</p>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[11px] text-ink-4">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand animate-dot" aria-hidden="true" />
                Available for work
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                {PROFILE.location}
              </span>
              <span>{PROFILE.availability}</span>
            </div>

            <address className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13.5px] not-italic">
              <ContactLink href={PROFILE.gmailCompose} icon={Mail} external>
                {PROFILE.email}
              </ContactLink>
              <ContactLink href={PROFILE.phoneHref} icon={Phone}>
                {PROFILE.phone}
              </ContactLink>
              <ContactLink href={PROFILE.github} icon={Github} external>
                GitHub
              </ContactLink>
              <ContactLink href={PROFILE.linkedin} icon={Linkedin} external>
                LinkedIn
              </ContactLink>
            </address>
          </div>

          <img
            src="/profile.jpg"
            alt="Jet Timothy Cerezo, full-stack software engineer"
            width="240"
            height="240"
            fetchPriority="high"
            className="animate-reveal h-24 w-24 shrink-0 rounded-full border border-edge object-cover sm:h-28 sm:w-28"
          />
        </div>

        {/* ABOUT */}
        <Section id="about" label="Summary">
          <div className="reveal space-y-4">
            {SUMMARY.map((p) => (
              <p key={p.slice(0, 24)} className="text-[15px] leading-[1.7] text-ink-2">
                {p}
              </p>
            ))}
          </div>
        </Section>

        {/* EXPERIENCE */}
        <Section id="experience" label="Experience">
          <div className="space-y-9">
            {EXPERIENCE.map((job) => (
              <article key={job.role + job.company} className="reveal">
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

        {/* WORK */}
        <Section id="work" label="Selected Work">
          <div className="divide-y divide-edge border-y border-edge">
            {PROJECTS.map((p) => {
              const inner = (
                <>
                  <EntryHead title={p.name} subtitle={p.tagline} period={p.year}>
                    {p.link && (
                      <ArrowUpRight
                        aria-hidden="true"
                        className="ml-1.5 inline h-3.5 w-3.5 align-baseline text-ink-4 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
                      />
                    )}
                    {p.badge && (
                      <span className="ml-2 rounded-full border border-edge-strong px-2 py-0.5 align-middle font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-4">
                        {p.badge}
                      </span>
                    )}
                  </EntryHead>
                  <p className="mt-2.5 text-[14.5px] leading-[1.65] text-ink-2">{p.description}</p>
                  <TechLine items={p.tech} />
                </>
              );

              return p.link ? (
                <a
                  key={p.name}
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reveal group block py-6 transition-colors hover:bg-fg/[0.03]"
                >
                  {inner}
                </a>
              ) : (
                <article key={p.name} className="reveal py-6">
                  {inner}
                </article>
              );
            })}
          </div>

          <a
            href={PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="reveal mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-4 transition-colors hover:text-brand"
          >
            More on GitHub <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </a>
        </Section>

        {/* SKILLS */}
        <Section label="Technical Skills">
          <div className="reveal grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-[104px_1fr] sm:gap-y-3.5">
            {SKILLS.map(([label, items]) => (
              <Fragment key={label}>
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-4 sm:pt-1">
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

        {/* CONTACT */}
        <Section id="contact" label="Contact">
          <div className="reveal">
            <p className="text-[15px] leading-[1.7] text-ink-2">
              Open to full-time remote roles including night shift on US hours, contract work, and
              partnerships. Happy to talk about full-stack web, microservices, or shipping products
              for the Filipino market.
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
      </main>

      {/* FOOTER */}
      <footer className="border-t border-edge">
        <div className="mx-auto flex max-w-[760px] flex-wrap items-center justify-between gap-3 px-6 py-6 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-4">
          <span>© {year} Jet Timothy Cerezo</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="transition-colors hover:text-ink-2"
          >
            Back to top ↑
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
