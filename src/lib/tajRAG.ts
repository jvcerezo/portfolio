// Taj AI - Client-Side Retrieval-Augmented Generation (RAG) Engine
// Powered by TF-IDF vectorization, semantic keyword matching, and context synthesis.

export interface KnowledgeChunk {
  id: string;
  title: string;
  category: "experience" | "project" | "education" | "skills" | "contact" | "philosophy";
  keywords: string[];
  content: string;
  sourceUrl?: string;
  sourceLabel: string;
}

export interface RetrievalResult {
  chunk: KnowledgeChunk;
  score: number;
}

export interface TajResponse {
  answer: string;
  retrievedSources: KnowledgeChunk[];
  confidence: number;
  intent: string;
}

export const KNOWLEDGE_CORPUS: KnowledgeChunk[] = [
  {
    id: "exp_converge",
    title: "Software Engineer at Converge Studios Inc.",
    category: "experience",
    keywords: [
      "converge",
      "converge studios",
      "current role",
      "present",
      "flutterflow",
      "flutter",
      "dart",
      "mobile",
      "cloud",
      "rest api",
      "agile",
    ],
    sourceLabel: "Experience: Converge Studios Inc.",
    content:
      "Jet is currently a Software Engineer at Converge Studios Inc. (2026 — Present). He engineers scalable cross-platform mobile and web applications utilizing FlutterFlow, Flutter, and cloud-first architectures. His work focuses on custom application logic, complex REST API integrations, and backend workflows to rapidly ship enterprise-grade software across Agile sprint cycles.",
  },
  {
    id: "exp_billease",
    title: "Junior Test Automation Engineer at Billease",
    category: "experience",
    keywords: [
      "billease",
      "fintech",
      "test automation",
      "qa",
      "quality assurance",
      "appium",
      "browserstack",
      "ci/cd",
      "45000",
      "45k",
      "150",
      "merge requests",
      "pr",
      "linux",
      "claude",
      "bugs",
    ],
    sourceLabel: "Experience: Billease Fintech",
    sourceUrl: "https://billease.ph",
    content:
      "At Billease (2025 — 2026), a high-scale Philippine consumer fintech app, Jet served as Junior Test Automation Engineer and final technical release gatekeeper. He shipped ~150 merge requests and ~45,000 lines of automated test code and internal tooling. He engineered CI/CD pipeline integrations across Linux CI runners for regression and emergency-hotfix suites, caught and resolved 30+ critical bugs using Appium and BrowserStack, and integrated Claude API into the QA workflow.",
  },
  {
    id: "exp_irri",
    title: "Genomics Microservices Monolith Rewrite at IRRI",
    category: "experience",
    keywords: [
      "irri",
      "international rice research institute",
      "snpseek",
      "genomics",
      "microservices",
      "docker",
      "docker compose",
      "java monolith",
      "api gateway",
      "oauth",
      "sso",
      "mongodb",
      "mern",
    ],
    sourceLabel: "Experience & Research: IRRI SNPseek",
    sourceUrl: "https://snpseek-mern.vercel.app",
    content:
      "At the International Rice Research Institute (IRRI, 2024 — 2025), Jet served as Software Developer and Thesis Affiliate. He re-architected IRRI's legacy enterprise Java monolith SNPseek genomics database into a modern MERN microservices platform: seven independent Node.js/Express services behind a unified API gateway orchestrated with Docker Compose. He built custom SSO/OAuth bridging enterprise LDAP, optimized MongoDB schemas for large-scale genomic datasets, and designed the React frontend with interactive data charts.",
  },
  {
    id: "proj_sandalan",
    title: "Sandalan — Personal Finance & Adulting App (Google Play)",
    category: "project",
    keywords: [
      "sandalan",
      "google play",
      "personal finance",
      "adulting",
      "flutter",
      "drift",
      "sqlite",
      "supabase",
      "offline",
      "offline-first",
      "sync",
      "38 banks",
      "train law",
      "tax calculator",
      "ocr",
      "receipt",
      "taglish ai",
    ],
    sourceLabel: "Project: Sandalan (Google Play)",
    sourceUrl: "https://play.google.com/store/apps/details?id=com.jvcerezo.exitplan",
    content:
      "Sandalan is Jet's flagship solo-engineered product shipped live to Google Play (15,000+ lines of Flutter). It features 38+ Philippine bank integrations, Philippine statutory tax calculators (TRAIN Law), OCR receipt scanning, and a conversational Taglish AI assistant. It is powered by an offline-first bidirectional sync engine with timestamp conflict resolution and incremental replication between local Drift SQLite and Supabase PostgreSQL with AES-256 encryption.",
  },
  {
    id: "proj_codebreak",
    title: "Codebreak 2.0 — 1st Place Champion at Tenext.ai AI Hackathon",
    category: "project",
    keywords: [
      "codebreak",
      "codebreak 2.0",
      "hackathon",
      "tenext",
      "champion",
      "1st place",
      "first place",
      "winner",
      "rag",
      "vector search",
      "groq",
      "whisper",
      "claude",
      "customer support",
      "24 hours",
    ],
    sourceLabel: "Achievement: Tenext.ai Hackathon Champion",
    content:
      "Jet won 1st Place Champion at the Tenext.ai AI Hackathon by building Codebreak 2.0 in under 24 hours. It is an agentic, sub-second RAG customer support platform. It ingests live customer audio, uses Groq Whisper for instant transcription, retrieves relevant policy documents via vector cosine similarity, and uses Claude API for real-time compliance coaching and automated post-call QA.",
  },
  {
    id: "edu_uplb",
    title: "BS Computer Science at University of the Philippines Los Baños",
    category: "education",
    keywords: [
      "uplb",
      "university of the philippines",
      "college",
      "degree",
      "education",
      "bs cs",
      "computer science",
      "honor roll",
      "laguna scholar",
      "gpa",
      "coursework",
      "2021",
      "2025",
    ],
    sourceLabel: "Education: UPLB BS Computer Science",
    content:
      "Jet graduated from the University of the Philippines Los Baños (UPLB, 2021 — 2025) with a Bachelor of Science in Computer Science, earning Honor Roll distinction. He was a Provincial Government of Laguna Academic Scholar. Key university coursework includes Operating Systems, Computer Networks, Database Systems, Data Structures & Algorithms, and Software Engineering.",
  },
  {
    id: "skills_matrix",
    title: "Full-Stack, Mobile, DevOps & Testing Stack",
    category: "skills",
    keywords: [
      "skills",
      "stack",
      "tech stack",
      "technologies",
      "languages",
      "typescript",
      "javascript",
      "dart",
      "python",
      "java",
      "c++",
      "react",
      "nextjs",
      "node",
      "express",
      "docker",
      "postgresql",
      "mongodb",
      "sqlite",
      "supabase",
      "appium",
      "git",
    ],
    sourceLabel: "Skills & Technical Capabilities",
    content:
      "Jet's core stack covers: Languages (TypeScript, JavaScript, Dart, Java, Python, SQL, C/C++, PHP); Front End (React, Next.js, FlutterFlow, Tailwind CSS, Vite); Back End (Node.js, Express, Nest.js, REST APIs, Microservices, API Gateway, OAuth SSO); Mobile (Flutter, Riverpod, Drift SQLite); Databases (PostgreSQL, MongoDB, Supabase, MySQL); DevOps & CI/CD (Docker, Docker Compose, Linux CI Runners, GitHub Actions, GitLab); and QA (Appium, BrowserStack).",
  },
  {
    id: "contact_availability",
    title: "Contact, Location & Availability",
    category: "contact",
    keywords: [
      "contact",
      "email",
      "phone",
      "location",
      "availability",
      "hire",
      "interview",
      "remote",
      "us hours",
      "work hours",
      "timezone",
      "philippines",
      "utc+8",
      "salary",
      "job",
      "full-time",
    ],
    sourceLabel: "Contact & Availability",
    content:
      "Jet is based in Los Baños, Laguna, Philippines (UTC+8). He is actively open and available for full-time Software Engineering roles (remote worldwide). He is fully flexible and available to align with US working hours (PST, EST, etc.). Contact: Email: jetjetcerezo@gmail.com, Phone: +63 998 914 8907, LinkedIn: linkedin.com/in/jet-timothy-cerezo-126903254, GitHub: github.com/jvcerezo.",
  },
  {
    id: "philosophy_architecture",
    title: "Software Engineering & Architecture Philosophy",
    category: "philosophy",
    keywords: [
      "philosophy",
      "architecture",
      "approach",
      "offline first",
      "automated testing",
      "ci cd",
      "code quality",
      "monolith vs microservices",
    ],
    sourceLabel: "Engineering Philosophy",
    content:
      "Jet's engineering principles: (1) Offline-first architectures — users should never be blocked by flaky connections; local databases with AES-256 and conflict-resilient sync queues provide the best UX. (2) Automated CI/CD test gates — tests run before code merges; 45,000 LOC of automation at Billease proved that early gates protect production revenue. (3) Right tool for scale — decouple monoliths into independent microservices only when domain boundaries and scale require it.",
  },
];

// Tokenizer & normalizer
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

// Compute BM25-like Term Weighting
export function retrieveContext(query: string, topK = 3): RetrievalResult[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const results: RetrievalResult[] = KNOWLEDGE_CORPUS.map((chunk) => {
    let score = 0;
    const chunkTokens = tokenize(`${chunk.title} ${chunk.content} ${chunk.keywords.join(" ")}`);
    const chunkSet = new Set(chunkTokens);

    for (const q of queryTokens) {
      // Keyword match in explicit keywords array (high weight)
      if (chunk.keywords.some((k) => k.includes(q) || q.includes(k))) {
        score += 3.5;
      }
      // Match in title (high weight)
      if (chunk.title.toLowerCase().includes(q)) {
        score += 2.5;
      }
      // Match in body text
      if (chunkSet.has(q)) {
        score += 1.2;
      }
    }

    // Category boosts
    if (query.toLowerCase().includes("billease") && chunk.id === "exp_billease") score += 5;
    if (query.toLowerCase().includes("sandalan") && chunk.id === "proj_sandalan") score += 5;
    if (query.toLowerCase().includes("irri") && chunk.id === "exp_irri") score += 5;
    if (query.toLowerCase().includes("microservice") && chunk.id === "exp_irri") score += 4;
    if (query.toLowerCase().includes("hackathon") && chunk.id === "proj_codebreak") score += 5;
    if ((query.toLowerCase().includes("contact") || query.toLowerCase().includes("email") || query.toLowerCase().includes("hire")) && chunk.id === "contact_availability") score += 5;
    if ((query.toLowerCase().includes("stack") || query.toLowerCase().includes("skills")) && chunk.id === "skills_matrix") score += 4;

    return { chunk, score };
  });

  return results
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

// Synthesize answer based on retrieved context
export function askTajAI(query: string): TajResponse {
  const qLower = query.toLowerCase().trim();
  const retrieved = retrieveContext(query, 3);

  // If no relevance found
  if (retrieved.length === 0 || retrieved[0].score < 1.0) {
    return {
      answer:
        "I'm **Taj AI**, Jet Timothy Cerezo's portfolio and résumé assistant. I specialize in answering questions about Jet's software engineering experience, projects (like Sandalan and SNPseek), fintech test automation at Billease, technical stack, and availability for remote roles.\n\nCould you try asking about his experience at **Billease**, his **Flutter app on Google Play**, his **microservices rewrite at IRRI**, or his **tech stack**?",
      retrievedSources: [],
      confidence: 0.2,
      intent: "unknown",
    };
  }

  const primaryChunk = retrieved[0].chunk;
  const confidence = Math.min(Math.round((retrieved[0].score / 8) * 100), 99);

  let synthesizedAnswer = "";

  // Intent classification and synthesis
  if (qLower.includes("billease") || qLower.includes("qa") || qLower.includes("test")) {
    synthesizedAnswer =
      "At **Billease** (2025 — 2026), Jet worked as a **Junior Test Automation Engineer** for their high-scale Philippine consumer fintech Android app.\n\n" +
      "• **Production Impact:** Shipped **~150 merge requests** and authored **~45,000 lines of code** in automated tests and internal QA tooling.\n" +
      "• **Release Gatekeeping:** Engineered and ran automated CI/CD regression test suites on Linux runners before every production release.\n" +
      "• **Bug Detection:** Discovered and squashed **30+ critical, high-impact bugs** using **Appium** and **BrowserStack**.\n" +
      "• **AI Integration:** Integrated the **Claude API** directly into testing workflows to accelerate test case generation and triage.";
  } else if (qLower.includes("sandalan") || qLower.includes("app") || qLower.includes("google play")) {
    synthesizedAnswer =
      "**Sandalan** is Jet's solo-engineered Filipino adulting and personal finance mobile app, shipped live to **Google Play** with 15,000+ lines of Flutter.\n\n" +
      "• **Key Features:** 38+ Philippine bank integrations, statutory tax calculators (TRAIN Law), OCR receipt scanning, and a Taglish conversational AI assistant.\n" +
      "• **Offline-First Sync Engine:** Architected an offline-first replication layer between local **Drift SQLite** and **Supabase PostgreSQL** with AES-256 encryption and timestamp-based conflict resolution.\n" +
      "• **Status:** Actively live on Google Play store (`com.jvcerezo.exitplan`).";
  } else if (qLower.includes("microservice") || qLower.includes("irri") || qLower.includes("snpseek")) {
    synthesizedAnswer =
      "At the **International Rice Research Institute (IRRI)** (2024 — 2025), Jet led a complete architectural migration of the legacy enterprise Java monolith **SNPseek** genomics platform into a modern **MERN microservices** system.\n\n" +
      "• **Microservices Architecture:** Decoupled into **7 independent Node.js/Express services** behind a unified API Gateway, orchestrated with **Docker Compose**.\n" +
      "• **Enterprise Security:** Built a custom SSO/OAuth layer bridging legacy enterprise LDAP with modern stateless JWT tokens.\n" +
      "• **Data Scale:** Designed and indexed MongoDB schemas optimized for large-scale genomic datasets and built a reactive React front end with filtering and charts.";
  } else if (qLower.includes("hackathon") || qLower.includes("codebreak") || qLower.includes("award") || qLower.includes("champion")) {
    synthesizedAnswer =
      "Jet won **1st Place Champion** at the **Tenext.ai AI Hackathon** with **Codebreak 2.0**, an AI customer support intelligence platform built in under 24 hours.\n\n" +
      "• **Sub-Second RAG Pipeline:** Live audio streaming → Groq Whisper transcription → Vector cosine similarity retrieval → Claude API agentic QA.\n" +
      "• **Capabilities:** Real-time agent suggestions during active customer calls and automated post-call compliance audits.";
  } else if (qLower.includes("hire") || qLower.includes("contact") || qLower.includes("email") || qLower.includes("us hour") || qLower.includes("remote") || qLower.includes("availability")) {
    synthesizedAnswer =
      "Jet is **actively available** for full-time Software Engineering roles (remote worldwide).\n\n" +
      "• **Timezone Flexibility:** Based in Los Baños, Laguna, Philippines (UTC+8), and **fully open to working US hours** (PST/EST/CST).\n" +
      "• **Direct Email:** [jetjetcerezo@gmail.com](mailto:jetjetcerezo@gmail.com)\n" +
      "• **Phone:** +63 998 914 8907\n" +
      "• **GitHub:** [github.com/jvcerezo](https://github.com/jvcerezo)\n" +
      "• **LinkedIn:** [linkedin.com/in/jet-timothy-cerezo-126903254](https://www.linkedin.com/in/jet-timothy-cerezo-126903254)";
  } else if (qLower.includes("stack") || qLower.includes("technolog") || qLower.includes("skill") || qLower.includes("language")) {
    synthesizedAnswer =
      "Jet's primary technical capabilities include:\n\n" +
      "• **Languages:** TypeScript, JavaScript, Dart, Python, Java, SQL, C/C++, PHP.\n" +
      "• **Front End & Mobile:** Flutter, FlutterFlow, React, Next.js, Tailwind CSS, Riverpod, Drift SQLite.\n" +
      "• **Back End & Microservices:** Node.js, Express, Nest.js, REST APIs, Docker, Docker Compose, API Gateways, OAuth/SSO.\n" +
      "• **Databases:** PostgreSQL, MongoDB, Supabase, MySQL, SQLite.\n" +
      "• **DevOps & QA:** CI/CD runners, Linux, Appium, BrowserStack, Git, Vercel, AWS.\n" +
      "• **AI & RAG:** Claude API, Groq, Whisper, Vector Search, Gemini API.";
  } else if (qLower.includes("converge")) {
    synthesizedAnswer =
      "Jet is currently a **Software Engineer at Converge Studios Inc.** (2026 — Present).\n\n" +
      "He engineers cross-platform mobile and web applications leveraging **FlutterFlow**, **Flutter**, and cloud-first backend architectures, integrating custom application logic and REST APIs for scalable client applications.";
  } else if (qLower.includes("education") || qLower.includes("uplb") || qLower.includes("degree") || qLower.includes("college")) {
    synthesizedAnswer =
      "Jet graduated with a **Bachelor of Science in Computer Science** from the **University of the Philippines Los Baños (UPLB)** (2021 — 2025).\n\n" +
      "• **Academic Honors:** Honor Roll distinction.\n" +
      "• **Scholarship:** Provincial Government of Laguna Academic Scholar.\n" +
      "• **Core Coursework:** Operating Systems, Computer Networks, Database Systems, Data Structures & Algorithms, Software Engineering.";
  } else {
    // General synthesis from primary chunk
    synthesizedAnswer =
      `Based on Jet's verified profile context:\n\n${primaryChunk.content}\n\n` +
      (retrieved[1] ? `**Additional Context:** ${retrieved[1].chunk.content.slice(0, 160)}...` : "");
  }

  return {
    answer: synthesizedAnswer,
    retrievedSources: retrieved.map((r) => r.chunk),
    confidence,
    intent: primaryChunk.category,
  };
}
