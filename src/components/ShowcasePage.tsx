import { useState } from "react";
import {
  ArrowLeft,
  Play,
  Bot,
  ScanText,
  Server,
  Sparkles,
  Calculator,
  Send,
  ExternalLink,
  Sun,
  Moon,
} from "lucide-react";

interface ShowcasePageProps {
  onBack: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export function ShowcasePage({ onBack, theme, toggleTheme }: ShowcasePageProps) {
  const [activeTab, setActiveTab] = useState<"all" | "ai" | "microservices" | "rag" | "calculator">("all");

  // DEMO 1: Sandalan AI Chat Simulator State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: "Kamusta! Ako si Sandalan AI. How can I help you with your Philippine adulting questions today? (Try asking about TIN ID, SSS, or PhilHealth!)",
    },
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // DEMO 2: OCR Receipt Scanner Simulator State
  const [selectedReceipt, setSelectedReceipt] = useState<"jollibee" | "grab" | "meralco">("jollibee");

  // DEMO 3: SNPseek Microservices API Gateway Simulator State
  const [selectedEndpoint, setSelectedEndpoint] = useState<"variants" | "phenotypes" | "sso" | "variety">("variants");
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [apiLatency, setApiLatency] = useState<number | null>(null);
  const [isApiLoading, setIsApiLoading] = useState(false);

  // DEMO 4: Codebreak 2.0 RAG Simulator State
  const [ragQuery, setRagQuery] = useState("Customer is reporting unauthorized charge and high frustration");
  const [ragResult, setRagResult] = useState<{
    chunks: Array<{ text: string; score: number }>;
    script: string;
    sentiment: string;
  } | null>(null);
  const [isRagRunning, setIsRagRunning] = useState(false);

  // DEMO 5: Macro & Nutrition Calculator State
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(175);
  const [age, setAge] = useState(24);
  const [activity, setActivity] = useState<number>(1.375); // Light activity
  const [goal, setGoal] = useState<"cut" | "maintain" | "bulk">("maintain");

  // Sandalan AI predefined responses
  const handleSendChat = (presetText?: string) => {
    const text = presetText || chatInput;
    if (!text.trim()) return;

    const newMsgs = [...chatMessages, { role: "user" as const, text }];
    setChatMessages(newMsgs);
    setChatInput("");
    setIsAiTyping(true);

    setTimeout(() => {
      let reply = "Here is what you need for this government process in the Philippines:";
      const lower = text.toLowerCase();
      if (lower.includes("tin") || lower.includes("bir")) {
        reply = "Para sa BIR TIN ID: Dalhin mo ang BIR Form 1904 (or 1902 if employed), 1 valid government ID (Passport, UMID, PhilSys), at PSA Birth Certificate sa pinakamalapit na RDO branch mo. Libre lang ang application!";
      } else if (lower.includes("sss")) {
        reply = "Para sa SSS Number: Maaari kang mag-apply online via the My.SSS portal (member.sss.gov.ph). Kakailanganin mo ang iyong PSA Birth Certificate at valid ID. Kapag na-verify na, makukuha mo agad ang iyong SS Number via email.";
      } else if (lower.includes("philhealth") || lower.includes("health")) {
        reply = "Para sa PhilHealth: Ihanda ang PMRF (PhilHealth Member Registration Form), 2 pirasong 1x1 ID pictures, at 2 valid government IDs. Submit sa Local Health Insurance Office (LHIO) or express branch.";
      } else {
        reply = "Naiintindihan ko! Sa Sandalan app, may step-by-step guides tayo para sa 1,000+ government offices na may offline maps at automated checklist para hindi ka pabalik-balik sa pila.";
      }

      setChatMessages([...newMsgs, { role: "assistant", text: reply }]);
      setIsAiTyping(false);
    }, 650);
  };

  // Receipt OCR mock data
  const RECEIPT_DATA = {
    jollibee: {
      merchant: "Jollibee Foods Corp - Branch #1042",
      date: "2026-08-28 12:45 PM",
      items: [
        { name: "1-pc Chickenjoy w/ Drink", price: 99.0 },
        { name: "Jolly Spaghetti", price: 60.0 },
        { name: "Extra Rice", price: 35.0 },
      ],
      vat: 20.79,
      total: 194.0,
      confidence: "99.4%",
      category: "Food & Dining",
    },
    grab: {
      merchant: "Grab Philippines (Transport)",
      date: "2026-08-29 08:30 AM",
      items: [{ name: "GrabCar 4-Seater (Makati -> BGC)", price: 285.0 }],
      vat: 30.54,
      total: 285.0,
      confidence: "98.8%",
      category: "Transportation",
    },
    meralco: {
      merchant: "Meralco Electric Bill",
      date: "2026-08-25",
      items: [{ name: "Monthly Power Consumption (245 kWh)", price: 2840.5 }],
      vat: 304.34,
      total: 2840.5,
      confidence: "99.7%",
      category: "Utilities & Bills",
    },
  };

  // SNPseek API Gateway Execution
  const handleTestApi = () => {
    setIsApiLoading(true);
    const start = performance.now();

    setTimeout(() => {
      const latency = Math.round(performance.now() - start + 28);
      setApiLatency(latency);

      let payload = {};
      if (selectedEndpoint === "variants") {
        payload = {
          service: "genomic-service-v1",
          route: "GET /api/v1/genomics/variants?chr=1&pos=10450",
          gateway_latency_ms: latency,
          data: {
            chromosome: "Chr01",
            position: 10450,
            reference_allele: "A",
            alternate_allele: "G",
            variety_count: 3024,
            phenotypic_correlations: ["Drought Tolerance (qDTY1.1)", "Blast Resistance"],
          },
          auth: { status: "AUTHORIZED", scope: "research:read" },
        };
      } else if (selectedEndpoint === "phenotypes") {
        payload = {
          service: "phenotype-service-v1",
          route: "GET /api/v1/phenotype/traits",
          gateway_latency_ms: latency,
          traits: ["Grain Yield", "Plant Height", "Days to Flowering", "Salinity Tolerance"],
          total_records: 128450,
        };
      } else if (selectedEndpoint === "sso") {
        payload = {
          service: "auth-service-v1",
          route: "POST /api/v1/auth/sso/verify",
          gateway_latency_ms: latency,
          authenticated: true,
          user: "researcher@irri.org",
          session_token: "jwt_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          roles: ["bioinformatics_analyst", "irri_affiliate"],
        };
      } else {
        payload = {
          service: "variety-service-v1",
          route: "GET /api/v1/variety/3k-rice",
          gateway_latency_ms: latency,
          accessions: ["IR64", "Nipponbare", "Kasalath", "Swarna-Sub1"],
          subpopulation: "Indica / Aus",
        };
      }

      setApiResponse(JSON.stringify(payload, null, 2));
      setIsApiLoading(false);
    }, 350);
  };

  // Codebreak 2.0 RAG execution
  const handleRunRag = () => {
    setIsRagRunning(true);
    setTimeout(() => {
      setRagResult({
        sentiment: "HIGH_URGENCY / NEGATIVE (-0.82)",
        chunks: [
          {
            text: "KB-402: Dispute policy for unauthorized charges states immediate 48-hour provisional credit upon agent initiation.",
            score: 0.94,
          },
          {
            text: "KB-118: De-escalation script requires validating customer identity, apologizing for inconvenience, and issuing ticket ID within 60 seconds.",
            score: 0.89,
          },
        ],
        script:
          "I sincerely apologize for the unexpected charge on your statement. I am placing an immediate priority freeze on this item and issuing a provisional credit right now (Ref #TX-89201). Let me verify your account so you are 100% protected.",
      });
      setIsRagRunning(false);
    }, 450);
  };

  // Nutrition calculations
  const bmr = Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  const tdee = Math.round(bmr * activity);
  const targetCalories =
    goal === "cut" ? Math.round(tdee - 450) : goal === "bulk" ? Math.round(tdee + 350) : tdee;
  const proteinGrams = Math.round(weightKg * 2.0);
  const fatGrams = Math.round((targetCalories * 0.25) / 9);
  const carbGrams = Math.round((targetCalories - (proteinGrams * 4 + fatGrams * 9)) / 4);

  return (
    <div className="min-h-screen bg-bg text-ink-1">
      {/* TOP BAR */}
      <header className="sticky top-0 z-40 border-b border-edge bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between px-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 font-mono text-[12.5px] font-medium text-ink-2 transition-colors hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Portfolio</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-4">
              Engineering Lab // Demos
            </span>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-edge bg-fg/[0.02] text-ink-3 hover:text-ink-1"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-6 py-12">
        {/* HEADER */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Showcase & Lab</span>
          </div>
          <h1 className="mt-3 font-display text-[32px] font-semibold tracking-tight text-ink-1 sm:text-[38px]">
            Live Demos & Technical Simulators
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-3">
            Test-drive live simulations of production systems: Sandalan’s Taglish AI & OCR engine, IRRI’s microservices API gateway, Codebreak 2.0 RAG intelligence, and interactive calculation engines.
          </p>
        </div>

        {/* FILTER TABS */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-edge pb-4">
          {[
            { id: "all", label: "All Showcases" },
            { id: "ai", label: "Sandalan Mobile AI & OCR" },
            { id: "microservices", label: "IRRI API Gateway Simulator" },
            { id: "rag", label: "Codebreak 2.0 RAG Pipeline" },
            { id: "calculator", label: "Nutrition Engine (Live App)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-md px-3 py-1.5 font-mono text-[12px] transition-all ${
                activeTab === tab.id
                  ? "bg-fg text-bg font-medium shadow-sm"
                  : "border border-edge bg-fg/[0.02] text-ink-3 hover:border-edge-strong hover:text-ink-1"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SHOWCASE GRIDS */}
        <div className="mt-10 space-y-16">

          {/* DEMO 1: SANDALAN AI & OCR (Mobile & AI) */}
          {(activeTab === "all" || activeTab === "ai") && (
            <section className="space-y-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-brand">
                    <Bot className="h-3.5 w-3.5" /> <span>Mobile & AI Simulator</span>
                  </div>
                  <h2 className="mt-1 font-display text-[22px] font-semibold text-ink-1">
                    Sandalan — Taglish AI & OCR Receipt Scanner
                  </h2>
                </div>
                <a
                  href="https://play.google.com/store/apps/details?id=com.jvcerezo.exitplan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[11.5px] text-ink-3 hover:text-brand"
                >
                  <span>View on Google Play</span> <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Left: Taglish AI Chat Sandbox */}
                <div className="flex flex-col justify-between rounded-xl border border-edge bg-fg/[0.02] p-5">
                  <div>
                    <div className="flex items-center justify-between border-b border-edge pb-3">
                      <span className="font-mono text-[11.5px] font-semibold uppercase text-ink-2">
                        Taglish Adulting AI Assistant
                      </span>
                      <span className="font-mono text-[10.5px] text-ink-4">Live Sandbox</span>
                    </div>

                    {/* Chat log */}
                    <div className="mt-4 max-h-64 min-h-[180px] space-y-3 overflow-y-auto pr-1">
                      {chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-lg px-3.5 py-2 text-[13px] leading-relaxed ${
                              msg.role === "user"
                                ? "bg-fg text-bg font-medium"
                                : "border border-edge bg-bg text-ink-2"
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      {isAiTyping && (
                        <div className="flex justify-start">
                          <div className="rounded-lg border border-edge bg-bg px-3 py-1.5 font-mono text-[11px] text-ink-4">
                            Sandalan AI is typing...
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Prompts & Input */}
                  <div className="mt-4 pt-3 border-t border-edge">
                    <div className="flex flex-wrap gap-1.5 pb-2">
                      <button
                        onClick={() => handleSendChat("How to apply for BIR TIN ID?")}
                        className="rounded border border-edge bg-bg px-2 py-0.5 font-mono text-[10px] text-ink-3 hover:text-ink-1"
                      >
                        TIN ID Guide
                      </button>
                      <button
                        onClick={() => handleSendChat("Paano kumuha ng SSS number?")}
                        className="rounded border border-edge bg-bg px-2 py-0.5 font-mono text-[10px] text-ink-3 hover:text-ink-1"
                      >
                        SSS Online
                      </button>
                      <button
                        onClick={() => handleSendChat("PhilHealth requirements 2026")}
                        className="rounded border border-edge bg-bg px-2 py-0.5 font-mono text-[10px] text-ink-3 hover:text-ink-1"
                      >
                        PhilHealth
                      </button>
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendChat();
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type a question in Tagalog or English..."
                        className="flex-1 rounded-md border border-edge bg-bg px-3 py-1.5 text-[13px] text-ink-1 placeholder:text-ink-5 focus:border-brand focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="flex items-center justify-center rounded-md bg-fg px-3 text-bg hover:opacity-85"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right: OCR Receipt Scanner Demo */}
                <div className="flex flex-col justify-between rounded-xl border border-edge bg-fg/[0.02] p-5">
                  <div>
                    <div className="flex items-center justify-between border-b border-edge pb-3">
                      <div className="flex items-center gap-1.5 font-mono text-[11.5px] font-semibold uppercase text-ink-2">
                        <ScanText className="h-3.5 w-3.5 text-brand" />
                        <span>OCR Expense Parser</span>
                      </div>
                      <span className="font-mono text-[10.5px] text-brand">Offline ML</span>
                    </div>

                    {/* Sample selector */}
                    <div className="mt-3 flex gap-2">
                      {[
                        { id: "jollibee", label: "Jollibee Receipt" },
                        { id: "grab", label: "Grab Taxi e-Receipt" },
                        { id: "meralco", label: "Meralco Utility" },
                      ].map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setSelectedReceipt(r.id as any)}
                          className={`rounded px-2 py-1 font-mono text-[10.5px] transition-all ${
                            selectedReceipt === r.id
                              ? "border border-brand bg-brand/10 text-ink-1 font-medium"
                              : "border border-edge bg-bg text-ink-4 hover:text-ink-2"
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>

                    {/* Parsed JSON Data Box */}
                    <div className="mt-3 rounded-lg border border-edge bg-bg p-3.5 font-mono text-[11px]">
                      <div className="flex items-center justify-between text-ink-4 border-b border-edge pb-2 mb-2">
                        <span>MERCHANT: {RECEIPT_DATA[selectedReceipt].merchant}</span>
                        <span className="text-brand">{RECEIPT_DATA[selectedReceipt].confidence} confidence</span>
                      </div>
                      <div className="space-y-1 text-ink-2">
                        {RECEIPT_DATA[selectedReceipt].items.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.name}</span>
                            <span>₱{item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-2 border-t border-edge flex justify-between font-bold text-ink-1 text-[12px]">
                        <span>PARSED TOTAL</span>
                        <span className="text-brand">₱{RECEIPT_DATA[selectedReceipt].total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-[12px] text-ink-3">
                    Automatically maps parsed line items to budget categories in Sandalan with local encrypted SQLite persistence.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* DEMO 2: SNPSEEK MICROSERVICES API GATEWAY (MERN) */}
          {(activeTab === "all" || activeTab === "microservices") && (
            <section className="space-y-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-brand">
                    <Server className="h-3.5 w-3.5" /> <span>Microservices Gateway Playground</span>
                  </div>
                  <h2 className="mt-1 font-display text-[22px] font-semibold text-ink-1">
                    IRRI SNPseek — API Gateway & Docker Mesh Sandbox
                  </h2>
                </div>
                <span className="font-mono text-[11.5px] text-ink-4">7 Decoupled Node.js Services</span>
              </div>

              <div className="rounded-xl border border-edge bg-fg/[0.02] p-5">
                {/* Gateway Control Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] uppercase text-ink-4">Select Endpoint:</span>
                    {[
                      { id: "variants", label: "GET /genomics/variants" },
                      { id: "phenotypes", label: "GET /phenotype/traits" },
                      { id: "sso", label: "POST /auth/sso/verify" },
                      { id: "variety", label: "GET /variety/3k-rice" },
                    ].map((ep) => (
                      <button
                        key={ep.id}
                        onClick={() => {
                          setSelectedEndpoint(ep.id as any);
                          setApiResponse(null);
                        }}
                        className={`rounded px-2.5 py-1 font-mono text-[11px] transition-all ${
                          selectedEndpoint === ep.id
                            ? "bg-fg text-bg font-semibold"
                            : "border border-edge bg-bg text-ink-3 hover:text-ink-1"
                        }`}
                      >
                        {ep.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleTestApi}
                    disabled={isApiLoading}
                    className="inline-flex items-center gap-2 rounded-md bg-fg px-4 py-1.5 font-mono text-[12px] font-medium text-bg hover:opacity-85 disabled:opacity-50"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>{isApiLoading ? "Routing..." : "Execute Request"}</span>
                  </button>
                </div>

                {/* Gateway Routing Simulation Grid */}
                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <div className="rounded-lg border border-edge bg-bg p-3 font-mono text-[11px]">
                    <span className="text-ink-4">// 01. GATEWAY VALIDATION</span>
                    <div className="mt-2 space-y-1 text-ink-2">
                      <div>Port: 8080 (Express Gateway)</div>
                      <div>Rate Limit: 100 req/min</div>
                      <div>JWT Validation: <span className="text-brand">PASSED</span></div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-edge bg-bg p-3 font-mono text-[11px]">
                    <span className="text-ink-4">// 02. DOCKER MESH ROUTING</span>
                    <div className="mt-2 space-y-1 text-ink-2">
                      <div>Target: {selectedEndpoint}-service:5001</div>
                      <div>Mesh Protocol: Internal HTTP/JSON</div>
                      <div>Replica: healthy (Node v20)</div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-edge bg-bg p-3 font-mono text-[11px]">
                    <span className="text-ink-4">// 03. MONGO PERFORMANCE</span>
                    <div className="mt-2 space-y-1 text-ink-2">
                      <div>Indexed Scan: TRUE (Chr_Pos_1)</div>
                      <div>Latency: {apiLatency ? `${apiLatency}ms` : "—"}</div>
                      <div>Status: 200 OK</div>
                    </div>
                  </div>
                </div>

                {/* Live JSON Payload Output */}
                <div className="mt-4 rounded-lg border border-edge bg-bg p-4 font-mono text-[11.5px] leading-relaxed">
                  <div className="flex items-center justify-between border-b border-edge pb-2 mb-2 text-ink-4">
                    <span>RESPONSE PAYLOAD (JSON)</span>
                    {apiLatency && <span className="text-brand">{apiLatency}ms total turnaround</span>}
                  </div>
                  <pre className="overflow-x-auto text-ink-1">
                    {apiResponse ||
                      '// Click "Execute Request" above to simulate real-time microservices dispatch'}
                  </pre>
                </div>
              </div>
            </section>
          )}

          {/* DEMO 3: CODEBREAK 2.0 RAG PIPELINE */}
          {(activeTab === "all" || activeTab === "rag") && (
            <section className="space-y-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-brand">
                    <Sparkles className="h-3.5 w-3.5" /> <span>Tenext.ai 1st Place Champion</span>
                  </div>
                  <h2 className="mt-1 font-display text-[22px] font-semibold text-ink-1">
                    Codebreak 2.0 — Retrieval-Augmented Generation (RAG) Playground
                  </h2>
                </div>
                <span className="font-mono text-[11.5px] text-ink-4">Sub-second Vector Search</span>
              </div>

              <div className="rounded-xl border border-edge bg-fg/[0.02] p-5">
                <div className="flex flex-col gap-3">
                  <label className="font-mono text-[11px] uppercase text-ink-4">
                    Simulated Customer Support Inquiry / Transcript Input:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={ragQuery}
                      onChange={(e) => setRagQuery(e.target.value)}
                      className="flex-1 rounded-md border border-edge bg-bg px-3.5 py-2 text-[13.5px] text-ink-1 focus:border-brand focus:outline-none"
                    />
                    <button
                      onClick={handleRunRag}
                      disabled={isRagRunning}
                      className="inline-flex items-center gap-2 rounded-md bg-fg px-4 py-2 font-mono text-[12px] font-medium text-bg hover:opacity-85 disabled:opacity-50"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>{isRagRunning ? "Retrieving..." : "Run RAG"}</span>
                    </button>
                  </div>
                </div>

                {/* RAG Pipeline Output */}
                {ragResult && (
                  <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2 animate-reveal">
                    <div className="rounded-lg border border-edge bg-bg p-4 font-mono text-[11.5px]">
                      <div className="flex items-center justify-between border-b border-edge pb-2 mb-2 text-ink-4">
                        <span>VECTOR EMBEDDING MATCHES</span>
                        <span className="text-brand">{ragResult.sentiment}</span>
                      </div>
                      <div className="space-y-2.5">
                        {ragResult.chunks.map((c, i) => (
                          <div key={i} className="rounded bg-fg/[0.02] p-2.5 border border-edge">
                            <div className="text-brand font-semibold mb-1">Similarity: {(c.score * 100).toFixed(0)}%</div>
                            <div className="text-ink-2">{c.text}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-edge bg-bg p-4 font-mono text-[11.5px]">
                      <div className="border-b border-edge pb-2 mb-2 text-ink-4">
                        AUGMENTED AGENT SCRIPT OUTPUT
                      </div>
                      <div className="rounded bg-brand/[0.05] border border-brand/20 p-3 text-[13px] font-sans leading-relaxed text-ink-1">
                        “{ragResult.script}”
                      </div>
                      <p className="mt-3 text-[11px] text-ink-4">
                        Delivered in real-time during live customer call streams to ensure QA policy compliance.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* DEMO 4: INTERACTIVE NUTRITION & MACRO CALCULATOR */}
          {(activeTab === "all" || activeTab === "calculator") && (
            <section className="space-y-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-brand">
                    <Calculator className="h-3.5 w-3.5" /> <span>Live Production Algorithm</span>
                  </div>
                  <h2 className="mt-1 font-display text-[22px] font-semibold text-ink-1">
                    Diet & Nutrition Macro Calculation Engine
                  </h2>
                </div>
                <span className="font-mono text-[11.5px] text-ink-4">Mifflin-St Jeor Formula</span>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Controls */}
                <div className="rounded-xl border border-edge bg-fg/[0.02] p-5 space-y-4 lg:col-span-2">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="font-mono text-[11px] uppercase text-ink-4">Weight: {weightKg} kg</label>
                      <input
                        type="range"
                        min="40"
                        max="140"
                        value={weightKg}
                        onChange={(e) => setWeightKg(Number(e.target.value))}
                        className="mt-1 w-full accent-brand"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[11px] uppercase text-ink-4">Height: {heightCm} cm</label>
                      <input
                        type="range"
                        min="130"
                        max="210"
                        value={heightCm}
                        onChange={(e) => setHeightCm(Number(e.target.value))}
                        className="mt-1 w-full accent-brand"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[11px] uppercase text-ink-4">Age: {age} yrs</label>
                      <input
                        type="range"
                        min="16"
                        max="80"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="mt-1 w-full accent-brand"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-edge">
                    <div>
                      <label className="font-mono text-[11px] uppercase text-ink-4">Activity Level</label>
                      <select
                        value={activity}
                        onChange={(e) => setActivity(Number(e.target.value))}
                        className="mt-1 w-full rounded-md border border-edge bg-bg px-3 py-1.5 text-[13px] text-ink-1"
                      >
                        <option value={1.2}>Sedentary (Desk Job)</option>
                        <option value={1.375}>Light (1-3 days/week)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-mono text-[11px] uppercase text-ink-4">Body Goal</label>
                      <div className="mt-1 flex gap-2">
                        {[
                          { id: "cut", label: "Fat Loss (-450 kcal)" },
                          { id: "maintain", label: "Maintain" },
                          { id: "bulk", label: "Muscle (+350 kcal)" },
                        ].map((g) => (
                          <button
                            key={g.id}
                            onClick={() => setGoal(g.id as any)}
                            className={`flex-1 rounded px-2 py-1.5 font-mono text-[10.5px] transition-all ${
                              goal === g.id
                                ? "bg-fg text-bg font-semibold"
                                : "border border-edge bg-bg text-ink-3 hover:text-ink-1"
                            }`}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calculated Output Card */}
                <div className="flex flex-col justify-between rounded-xl border border-edge bg-fg/[0.02] p-5 font-mono">
                  <div>
                    <span className="text-[11px] uppercase text-ink-4">TARGET DAILY ENERGY</span>
                    <div className="mt-1 font-display text-[32px] font-bold text-brand">
                      {targetCalories} <span className="text-[14px] font-mono text-ink-3">kcal/day</span>
                    </div>
                    <div className="mt-3 space-y-2 text-[12.5px] border-t border-edge pt-3 text-ink-2">
                      <div className="flex justify-between">
                        <span>🥩 Protein (2.0g/kg):</span>
                        <span className="font-bold text-ink-1">{proteinGrams}g ({proteinGrams * 4} kcal)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>🍚 Carbohydrates:</span>
                        <span className="font-bold text-ink-1">{carbGrams}g ({carbGrams * 4} kcal)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>🥑 Dietary Fats:</span>
                        <span className="font-bold text-ink-1">{fatGrams}g ({fatGrams * 9} kcal)</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-edge text-[11px] text-ink-4">
                    BMR: {bmr} kcal · Baseline TDEE: {tdee} kcal
                  </div>
                </div>
              </div>
            </section>
          )}

        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-edge py-8">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 font-mono text-[11px] uppercase tracking-wider text-ink-4">
          <span>Jet Timothy Cerezo // Showcase Lab</span>
          <button onClick={onBack} className="hover:text-brand transition-colors">
            Back to Main Portfolio ↑
          </button>
        </div>
      </footer>
    </div>
  );
}
