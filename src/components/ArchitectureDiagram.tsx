import { useState, type ComponentType } from "react";
import { Server, Smartphone, Cpu, Network, Zap, ArrowRight } from "lucide-react";

interface NodeInfo {
  id: string;
  name: string;
  type: string;
  description: string;
}

interface DiagramProps {
  projectKey: "sandalan" | "snpseek" | "codebreak";
}

interface DiagramConfig {
  icon: ComponentType<{ className?: string }>;
  title: string;
  stageLabel: (i: number) => string;
  stageIcon?: ComponentType<{ className?: string }>;
  emptyHint: string;
  nodes: NodeInfo[];
}

const DIAGRAMS: Record<DiagramProps["projectKey"], DiagramConfig> = {
  sandalan: {
    icon: Smartphone,
    title: "Offline-First Sync",
    stageLabel: (i) => `0${i + 1}`,
    emptyHint: "Click any stage to inspect how Sandalan syncs 38+ banks offline without data loss.",
    nodes: [
      {
        id: "ui",
        name: "Flutter Client",
        type: "Riverpod + UI",
        description: "Reactive cross-platform UI with instant optimistic local state updates.",
      },
      {
        id: "local",
        name: "Drift SQLite",
        type: "Local Database",
        description: "Encrypted on-device SQLite database with AES-256 local storage for offline read/write.",
      },
      {
        id: "sync",
        name: "Sync Engine",
        type: "Conflict Resolution",
        description: "Bidirectional sync protocol comparing timestamps and merging offline mutation queues.",
      },
      {
        id: "cloud",
        name: "Supabase Cloud",
        type: "PostgreSQL + Auth",
        description: "Cloud database with Row-Level Security (RLS) policies and real-time streaming hooks.",
      },
    ],
  },
  snpseek: {
    icon: Server,
    title: "Microservices Decoupling",
    stageLabel: (i) => `SVC ${i + 1}`,
    stageIcon: Network,
    emptyHint: "Click any service to inspect the legacy Java monolith migration into Dockerized microservices.",
    nodes: [
      {
        id: "gateway",
        name: "API Gateway",
        type: "Reverse Proxy",
        description: "Single public ingress routing client queries, rate limiting, and SSL termination.",
      },
      {
        id: "auth",
        name: "OAuth & SSO",
        type: "Security Service",
        description: "Custom SSO integration bridging enterprise legacy LDAP with stateless JWT tokens.",
      },
      {
        id: "genomics",
        name: "Genotype Service",
        type: "Express / Node",
        description: "High-throughput service processing massive rice genomic matrices with indexed MongoDB queries.",
      },
      {
        id: "docker",
        name: "Docker Compose",
        type: "Orchestration",
        description: "Containerized deployment orchestrating all 7 microservices in isolated virtual networks.",
      },
    ],
  },
  codebreak: {
    icon: Zap,
    title: "Sub-Second AI Vector RAG",
    stageLabel: (i) => `STAGE ${i + 1}`,
    stageIcon: Cpu,
    emptyHint: "Click any stage to inspect the 24h hackathon-winning AI support architecture.",
    nodes: [
      {
        id: "audio",
        name: "Audio Ingest",
        type: "Live Stream",
        description: "Low-latency streaming of customer voice audio into WebSockets.",
      },
      {
        id: "groq",
        name: "Groq Whisper",
        type: "Sub-Second ASR",
        description: "Fast speech-to-text inference with sub-300ms turnaround for live dialogue.",
      },
      {
        id: "vector",
        name: "Vector Retrieval",
        type: "Semantic RAG",
        description: "Cosine similarity search retrieving relevant policy docs and FAQs from vector database.",
      },
      {
        id: "claude",
        name: "Claude Intelligence",
        type: "Real-Time QA",
        description: "Agentic prompts generate live agent suggestions and evaluate compliance rules.",
      },
    ],
  },
};

// One pass of the signal along the rail (each stage lights up in turn).
const FLOW_MS = 2400;

export function ArchitectureDiagram({ projectKey }: DiagramProps) {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  // Bumped to restart the flow animation (on hover).
  const [flowRun, setFlowRun] = useState(0);
  const config = DIAGRAMS[projectKey];
  const { icon: Icon, stageIcon: StageIcon, nodes } = config;
  const current = nodes.find((n) => n.id === activeNode);
  // Stage i sits at i/(n-1) of the rail, so it lights up at that point of the pass.
  const stageMs = FLOW_MS / Math.max(1, nodes.length - 1);

  return (
    <div
      className="my-4 rounded-xl border border-edge bg-fg/[0.02] p-4 text-xs"
      onMouseEnter={() => setFlowRun((r) => r + 1)}
      data-particle-avoid
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 font-mono text-[11px] text-ink-4">
        <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-ink-2">
          <Icon className="h-3.5 w-3.5 shrink-0" />
          <span>Interactive Architecture: {config.title}</span>
        </span>
        <span className="text-[10px] text-ink-5">Tap a stage to inspect</span>
      </div>

      {/* Flow rail: a signal travels through the stages in order */}
      <div key={flowRun} className="relative mb-3 h-4" aria-hidden="true">
        <div className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-edge-strong" />
        <span
          className="arch-pulse absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_8px_rgb(var(--c-signal))]"
          style={{ animationDuration: `${FLOW_MS}ms` }}
        />
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-1">
          {nodes.map((node, i) => (
            <span
              key={node.id}
              className={`arch-stop h-2.5 w-2.5 rounded-full border border-edge-strong bg-bg ${
                activeNode === node.id ? "border-signal bg-signal" : ""
              }`}
              style={{ animationDelay: `${i * stageMs}ms`, animationDuration: `${FLOW_MS}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Stages: always 2 x 2 so names never truncate in the narrow column */}
      <div className="grid grid-cols-2 gap-2">
        {nodes.map((node, i) => {
          const isSelected = activeNode === node.id;
          return (
            <button
              key={node.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setActiveNode(isSelected ? null : node.id)}
              className={`flex flex-col justify-between rounded-lg border p-2.5 text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-signal/60 bg-signal/10 shadow-sm"
                  : "border-edge bg-bg hover:border-edge-strong hover:bg-fg/[0.02]"
              }`}
            >
              <span className="flex items-center justify-between font-mono text-[10px] text-ink-4">
                <span className={isSelected ? "text-signal" : ""}>{config.stageLabel(i)}</span>
                {StageIcon ? (
                  <StageIcon className="h-3 w-3 text-ink-5" />
                ) : (
                  i < nodes.length - 1 && <ArrowRight className="h-3 w-3 text-ink-5" />
                )}
              </span>
              <span className="mt-2 font-semibold text-xs leading-snug text-ink-1">{node.name}</span>
              <span className="font-mono text-[10px] text-ink-4">{node.type}</span>
            </button>
          );
        })}
      </div>

      {/* Detail bar */}
      <div
        className="mt-3 min-h-[36px] rounded-lg border border-edge bg-bg/80 px-3 py-2 font-mono text-[11px] leading-relaxed text-ink-3"
        aria-live="polite"
      >
        {current ? (
          <div className="animate-reveal flex items-start gap-2">
            <span className="shrink-0 font-bold text-ink-1">[{current.name}]:</span>
            <span>{current.description}</span>
          </div>
        ) : (
          <span className="italic text-ink-4">{config.emptyHint}</span>
        )}
      </div>
    </div>
  );
}
