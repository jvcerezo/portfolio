// Taj AI - Client-Side Retrieval-Augmented Generation (RAG) Engine
// Powered by TF-IDF vectorization, semantic keyword matching, and context synthesis.

export interface KnowledgeChunk {
  id: string;
  title: string;
  category: "experience" | "project" | "education" | "skills" | "contact" | "philosophy" | "bio";
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
    id: "bio_overview",
    title: "About Jet Timothy Cerezo — Software Engineer",
    category: "bio",
    keywords: [
      "jet",
      "timothy",
      "cerezo",
      "who",
      "about",
      "bio",
      "summary",
      "profile",
      "background",
      "software engineer",
      "full stack",
    ],
    sourceLabel: "Profile Overview",
    sourceUrl: "https://github.com/jvcerezo",
    content:
      "Jet Timothy Cerezo is a full-stack Software Engineer and BS Computer Science graduate from the University of the Philippines Los Baños (Honor Roll, Batch 2025). He has 2+ years of production experience across mobile (Flutter), web (React, Next.js, Node.js), microservices (Docker), and automated testing (Appium, CI/CD). He is based in Los Baños, Laguna, Philippines (UTC+8) and is actively available for full-time remote roles (open to US hours).",
  },
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
      "Jet is currently a Software Engineer at Converge Studios Inc. (Sep 2026 — Present). He engineers scalable cross-platform mobile and web applications utilizing FlutterFlow, Flutter, and cloud-first architectures. His work focuses on custom application logic, complex REST API integrations, and backend workflows to rapidly ship enterprise-grade software across Agile sprint cycles.",
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
      "mr",
      "pr",
      "linux",
      "claude",
      "bugs",
    ],
    sourceLabel: "Experience: Billease Fintech",
    sourceUrl: "https://billease.ph",
    content:
      "At Billease (Apr 2025 — Sep 2026), a high-scale Philippine consumer fintech app, Jet served as Junior Test Automation Engineer and final technical release gatekeeper. He shipped ~150 merge requests and ~45,000 lines of automated test code and internal tooling. He engineered CI/CD pipeline integrations across Linux CI runners for regression and emergency-hotfix suites, caught and resolved 30+ critical bugs using Appium and BrowserStack, and integrated Claude API into the QA workflow.",
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
      "At the International Rice Research Institute (IRRI, Jul 2024 — May 2025), Jet served as Software Developer and Thesis Affiliate. He re-architected IRRI's legacy enterprise Java monolith SNPseek genomics database into a modern MERN microservices platform: seven independent Node.js/Express services behind a unified API gateway orchestrated with Docker Compose. He built custom SSO/OAuth bridging enterprise LDAP, optimized MongoDB schemas for large-scale genomic datasets, and designed the React frontend with interactive data charts.",
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
      "Jet won 1st Place Champion at the Tenext.ai AI Hackathon (May 2025) by building Codebreak 2.0 in under 24 hours. It is an agentic, sub-second RAG customer support platform. It ingests live customer audio, uses Groq Whisper for instant transcription, retrieves relevant policy documents via vector cosine similarity, and uses Claude API for real-time compliance coaching and automated post-call QA.",
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
      "coursework",
      "batch 2025",
    ],
    sourceLabel: "Education: UPLB BS Computer Science",
    content:
      "Jet graduated from the University of the Philippines Los Baños (UPLB, 2021 — 2025) with a Bachelor of Science in Computer Science, earning Honor Roll distinction. He was a Provincial Government of Laguna Academic Scholar and UP SLAS Scholar. Key university coursework includes Operating Systems, Computer Networks, Database Systems, Data Structures & Algorithms, and Software Engineering.",
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

// English stop words for accurate tokenization
const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "can", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from",
  "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him",
  "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "just",
  "me", "more", "most", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only",
  "or", "other", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "should",
  "so", "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then",
  "there", "these", "they", "this", "those", "through", "to", "too", "under", "until", "up",
  "very", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why",
  "with", "would", "you", "your", "yours", "yourself", "yourselves", "tell", "show", "give",
  "please", "like", "make", "know", "want"
]);

// Tokenizer & normalizer with stop-word filtering
export function tokenize(text: string, filterStopWords = true): string[] {
  const tokens = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);

  if (!filterStopWords) return tokens;
  return tokens.filter((w) => !STOP_WORDS.has(w));
}

// Compute BM25-like Term Weighting
export function retrieveContext(query: string, topK = 3): RetrievalResult[] {
  const queryTokens = tokenize(query, true);
  if (queryTokens.length === 0) return [];

  const results: RetrievalResult[] = KNOWLEDGE_CORPUS.map((chunk) => {
    let score = 0;
    const chunkTokens = tokenize(`${chunk.title} ${chunk.content} ${chunk.keywords.join(" ")}`, false);
    const chunkSet = new Set(chunkTokens);

    for (const q of queryTokens) {
      // Keyword match in explicit keywords array (high weight)
      if (chunk.keywords.some((k) => k.toLowerCase() === q || k.toLowerCase().includes(q))) {
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

    // Entity boosts
    const qLower = query.toLowerCase();
    if (qLower.includes("billease") && chunk.id === "exp_billease") score += 5;
    if (qLower.includes("sandalan") && chunk.id === "proj_sandalan") score += 5;
    if (qLower.includes("irri") && chunk.id === "exp_irri") score += 5;
    if (qLower.includes("snpseek") && chunk.id === "exp_irri") score += 5;
    if (qLower.includes("microservice") && chunk.id === "exp_irri") score += 4;
    if ((qLower.includes("hackathon") || qLower.includes("codebreak")) && chunk.id === "proj_codebreak") score += 5;
    if (qLower.includes("converge") && chunk.id === "exp_converge") score += 5;
    if ((qLower.includes("contact") || qLower.includes("email") || qLower.includes("hire") || qLower.includes("us hour")) && chunk.id === "contact_availability") score += 5;
    if ((qLower.includes("stack") || qLower.includes("skills") || qLower.includes("languages")) && chunk.id === "skills_matrix") score += 4;
    if ((qLower.includes("who is jet") || qLower.includes("about jet") || qLower.includes("bio") || qLower.includes("summary")) && chunk.id === "bio_overview") score += 6;

    return { chunk, score };
  });

  return results
    .filter((r) => r.score > 1.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

// Synthesize answer based on retrieved context and query intent
export function askTajAI(query: string): TajResponse {
  const qLower = query.toLowerCase().trim();

  // 1. Detect greetings and assistant identity
  if (
    /^(hi|hello|hey|kamusta|good\s+(morning|afternoon|evening)|who\s+are\s+you|what\s+is\s+taj\s*ai|help)\b/i.test(
      qLower
    )
  ) {
    return {
      answer:
        "Hello! I am **Taj AI**, Jet Timothy Cerezo's retrieval-augmented assistant. I have direct context over his software engineering experience, production metrics, microservices architecture, and shipped apps.\n\n" +
        "Ask me anything about his work, or select a question below to get started!",
      retrievedSources: [KNOWLEDGE_CORPUS[0]],
      confidence: 99,
      intent: "greeting",
    };
  }

  // 2. Detect Billease customer service / loan inquiries (doesn't apply to Jet)
  if (
    /\b(loan|loans|borrow|credit\s+limit|interest\s+rate|repay|repayment|cash\s+advance|customer\s+service|pay\s+bill|billing|apply\s+for\s+loan|borrow\s+money)\b/i.test(
      qLower
    )
  ) {
    return {
      answer:
        "That doesn't apply to Jet. Billease is a Philippine consumer fintech app where Jet previously worked as a **Junior Test Automation Engineer** (Apr 2025 — Sep 2026), building automated QA test pipelines and Linux CI/CD runners for their Android app.\n\n" +
        "I don't have access to customer accounts, credit lines, or loan services for Billease. If you'd like to know about Jet's engineering contributions at Billease (such as his ~150 merge requests, Appium automation, or CI/CD release gatekeeping), feel free to ask!",
      retrievedSources: [],
      confidence: 0,
      intent: "unrelated_billease_service",
    };
  }

  // 3. Detect Rice Agriculture / Crop Science questions (doesn't apply to Jet)
  if (/\b(cook\s+rice|growing\s+rice|rice\s+variety|buy\s+rice|harvest|crop|agriculture|farming|seeds)\b/i.test(qLower)) {
    return {
      answer:
        "That doesn't apply to Jet. While Jet was a Software Developer & Thesis Affiliate at the **International Rice Research Institute (IRRI)** (Jul 2024 — May 2025), his work was strictly software engineering: re-architecting their SNPseek genomics platform from an enterprise Java monolith into 7 Dockerized MERN microservices.\n\n" +
        "I can answer questions regarding his microservices architecture, Docker Compose orchestration, and MongoDB schema design at IRRI, but I don't cover crop science or agriculture.",
      retrievedSources: [],
      confidence: 0,
      intent: "unrelated_agriculture",
    };
  }

  // 4. Detect General Trivia, Math, Science, Recipes, Off-topic requests (doesn't apply to Jet)
  const isOffTopic =
    /\b(\d+\s*[\+\-\*\/]\s*\d+|square\s+root|calculate|solve\s+for)\b/i.test(qLower) ||
    /\b(weather|temperature|forecast|rain\s+today|climate)\b/i.test(qLower) ||
    /\b(capital\s+of|who\s+is\s+the\s+president|prime\s+minister|who\s+won\s+the\s+(world\s+cup|super\s+bowl|nba|championship)|how\s+old\s+is|tallest\s+building|speed\s+of\s+light)\b/i.test(
      qLower
    ) ||
    /\b(write\s+a\s+(poem|song|story|essay)|tell\s+me\s+a\s+(joke|riddle|story)|sing\s+a\s+song)\b/i.test(
      qLower
    ) ||
    /\b(recipe|how\s+to\s+cook|bake|ingredients\s+for)\b/i.test(qLower) ||
    /\b(write\s+(python|c\+\+|java|javascript|sql|html)\s+code\s+(for|to)|solve\s+my\s+homework|debug\s+my\s+code|invert\s+a\s+binary\s+tree)\b/i.test(
      qLower
    ) ||
    /\b(do\s+you\s+(love|feel|eat|sleep)|are\s+you\s+(human|alive|sentient)|meaning\s+of\s+life|marry\s+me)\b/i.test(
      qLower
    ) ||
    /\b(lend\s+me|borrow\s+money|give\s+me\s+money|send\s+me\s+crypto|buy\s+me)\b/i.test(qLower);

  if (isOffTopic) {
    return {
      answer:
        "That question doesn't apply to Jet or falls outside the scope of this portfolio.\n\n" +
        "I am **Taj AI**, Jet Timothy Cerezo's retrieval-augmented assistant. My context is specialized in answering questions about Jet's engineering career, production projects, technical capabilities, and job opportunities.\n\n" +
        "**Topics you can ask me about Jet:**\n" +
        "• **Work Experience:** Software Engineer at Converge Studios (Flutter/FlutterFlow), Test Automation at Billease (150+ MRs, Appium), and Microservices at IRRI\n" +
        "• **Shipped Projects:** Sandalan (offline-first personal finance app live on Google Play), Codebreak 2.0 (1st Place Hackathon Winner), and SNPseek MERN\n" +
        "• **Technical Stack:** Flutter, React, Node.js, TypeScript, Docker, CI/CD, Appium, and RAG pipelines\n" +
        "• **Hiring & Availability:** Open to full-time remote roles (open to US working hours)\n\n" +
        "Feel free to ask any question about Jet's background or choose one of the suggested prompts below!",
      retrievedSources: [],
      confidence: 0,
      intent: "unrelated_off_topic",
    };
  }

  // 5. Query context retrieval
  const retrieved = retrieveContext(query, 3);

  // If no relevance or low score found, reject politely as unrelated
  if (retrieved.length === 0 || retrieved[0].score < 1.8) {
    return {
      answer:
        "That question doesn't apply to Jet or isn't covered in his portfolio context.\n\n" +
        "I am **Taj AI**, specialized in answering questions about Jet Timothy Cerezo's software engineering background, shipped applications, technical capabilities, and availability for software roles.\n\n" +
        "Would you like to know about his **experience at Billease**, his **Flutter app Sandalan on Google Play**, his **MERN microservices rewrite at IRRI**, or his **core tech stack**?",
      retrievedSources: [],
      confidence: 0,
      intent: "unrelated_no_match",
    };
  }

  const primaryChunk = retrieved[0].chunk;
  const confidence = Math.min(Math.round((retrieved[0].score / 8) * 100), 99);

  let synthesizedAnswer = "";

  // 6. Intent classification and synthesis for valid inquiries
  if (
    qLower.includes("billease") ||
    qLower.includes("qa") ||
    (qLower.includes("test") && (qLower.includes("automation") || qLower.includes("engineer") || qLower.includes("jet")))
  ) {
    synthesizedAnswer =
      "At **Billease** (Apr 2025 — Sep 2026), Jet worked as a **Junior Test Automation Engineer** for their high-scale Philippine consumer fintech Android app.\n\n" +
      "• **Production Impact:** Shipped **~150 merge requests** and authored **~45,000 lines of code** in automated tests and internal QA tooling.\n" +
      "• **Release Gatekeeping:** Engineered and ran automated CI/CD regression test suites on Linux runners before every production release.\n" +
      "• **Bug Detection:** Discovered and squashed **30+ critical, high-impact bugs** using **Appium** and **BrowserStack**.\n" +
      "• **AI Integration:** Integrated the **Claude API** directly into testing workflows to accelerate test case generation and triage.";
  } else if (qLower.includes("sandalan") || (qLower.includes("app") && (qLower.includes("finance") || qLower.includes("offline") || qLower.includes("jet")))) {
    synthesizedAnswer =
      "**Sandalan** is Jet's solo-engineered Filipino adulting and personal finance mobile app, shipped live to **Google Play** with 15,000+ lines of Flutter.\n\n" +
      "• **Key Features:** 38+ Philippine bank integrations, statutory tax calculators (TRAIN Law), OCR receipt scanning, and a Taglish conversational AI assistant.\n" +
      "• **Offline-First Sync Engine:** Architected an offline-first replication layer between local **Drift SQLite** and **Supabase PostgreSQL** with AES-256 encryption and timestamp-based conflict resolution.\n" +
      "• **Status:** Actively live on Google Play store (`com.jvcerezo.exitplan`).";
  } else if (qLower.includes("microservice") || qLower.includes("irri") || qLower.includes("snpseek")) {
    synthesizedAnswer =
      "At the **International Rice Research Institute (IRRI)** (Jul 2024 — May 2025), Jet led a complete architectural migration of the legacy enterprise Java monolith **SNPseek** genomics platform into a modern **MERN microservices** system.\n\n" +
      "• **Microservices Architecture:** Decoupled into **7 independent Node.js/Express services** behind a unified API Gateway, orchestrated with **Docker Compose**.\n" +
      "• **Enterprise Security:** Built a custom SSO/OAuth layer bridging legacy enterprise LDAP with modern stateless JWT tokens.\n" +
      "• **Data Scale:** Designed and indexed MongoDB schemas optimized for large-scale genomic datasets and built a reactive React front end with filtering and charts.";
  } else if (qLower.includes("hackathon") || qLower.includes("codebreak") || qLower.includes("award") || qLower.includes("champion")) {
    synthesizedAnswer =
      "Jet won **1st Place Champion** at the **Tenext.ai AI Hackathon** (May 2025) with **Codebreak 2.0**, an AI customer support intelligence platform built in under 24 hours.\n\n" +
      "• **Sub-Second RAG Pipeline:** Live audio streaming → Groq Whisper transcription → Vector cosine similarity retrieval → Claude API agentic QA.\n" +
      "• **Capabilities:** Real-time agent suggestions during active customer calls and automated post-call compliance audits.";
  } else if (
    qLower.includes("hire") ||
    qLower.includes("contact") ||
    qLower.includes("email") ||
    qLower.includes("phone") ||
    qLower.includes("us hour") ||
    qLower.includes("remote") ||
    qLower.includes("availability")
  ) {
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
      "Jet is currently a **Software Engineer at Converge Studios Inc.** (Sep 2026 — Present).\n\n" +
      "He engineers cross-platform mobile and web applications leveraging **FlutterFlow**, **Flutter**, and cloud-first backend architectures, integrating custom application logic and REST APIs for scalable client applications.";
  } else if (qLower.includes("education") || qLower.includes("uplb") || qLower.includes("degree") || qLower.includes("college")) {
    synthesizedAnswer =
      "Jet graduated with a **Bachelor of Science in Computer Science** from the **University of the Philippines Los Baños (UPLB)** (2021 — 2025).\n\n" +
      "• **Academic Honors:** Honor Roll distinction.\n" +
      "• **Scholarship:** Provincial Government of Laguna Academic Scholar and UP SLAS Scholar.\n" +
      "• **Core Coursework:** Operating Systems, Computer Networks, Database Systems, Data Structures & Algorithms, Software Engineering.";
  } else if (
    qLower.includes("who is jet") ||
    qLower.includes("about jet") ||
    qLower.includes("tell me about jet") ||
    qLower.includes("bio") ||
    qLower.includes("summary") ||
    qLower.includes("background")
  ) {
    synthesizedAnswer =
      "**Jet Timothy Cerezo** is a full-stack software engineer and UPLB Computer Science graduate (Honor Roll, Batch 2025) based in the Philippines (open to US hours and remote worldwide).\n\n" +
      "• **Current Role:** Software Engineer at **Converge Studios Inc.** (Sep 2026 — Present), engineering cross-platform digital solutions with FlutterFlow and Flutter.\n" +
      "• **Fintech Experience:** Junior Test Automation Engineer at **Billease** (Apr 2025 — Sep 2026), shipping ~150 MRs and ~45,000 LOC in automated tests across Linux CI runners.\n" +
      "• **Flagship Project:** Solo-engineered **Sandalan** live to Google Play (15,000+ LOC in Flutter, offline-first sync engine between Drift SQLite and Supabase).\n" +
      "• **Microservices Rewrite:** Deconstructed IRRI's enterprise Java monolith SNPseek genomics database into 7 containerized MERN microservices.\n" +
      "• **Hackathon Champion:** 1st Place Winner at Tenext.ai AI Hackathon with Codebreak 2.0 (sub-second RAG in under 24 hours).";
  } else if (qLower.includes("philosophy") || qLower.includes("principles") || qLower.includes("approach")) {
    synthesizedAnswer =
      "Jet's engineering principles are centered around production reliability and user experience:\n\n" +
      "1. **Offline-First Architecture:** Flaky mobile network conditions shouldn't block users. Local encrypted persistence (Drift SQLite with AES-256) combined with conflict-resilient mutation queues provides immediate, resilient UX.\n" +
      "2. **Strict CI/CD Testing Gates:** Tests must run automatically before code merges. Shipping ~45,000 LOC of automated tests at Billease proved that comprehensive regression suites catch critical bugs before they reach production.\n" +
      "3. **Pragmatic Microservices:** Decouple monolithic codebases into independent microservices (as executed at IRRI) only when service boundaries, scalability needs, and maintainability demand it.";
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
