import { useState } from "react";
import { soundFx } from "../lib/sound";
import { ArrowRight, Server, Smartphone, Cpu, Network, Zap } from "lucide-react";

interface NodeInfo {
  id: string;
  name: string;
  type: string;
  description: string;
}

interface DiagramProps {
  projectKey: "sandalan" | "snpseek" | "codebreak";
}

export function ArchitectureDiagram({ projectKey }: DiagramProps) {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  if (projectKey === "sandalan") {
    const nodes: NodeInfo[] = [
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
    ];

    const currentNode = nodes.find((n) => n.id === activeNode);

    return (
      <div className="my-4 rounded-xl border border-edge bg-fg/[0.02] p-4 text-xs">
        <div className="flex items-center justify-between font-mono text-[11px] text-ink-4 mb-3">
          <span className="flex items-center gap-1.5 font-semibold text-ink-2 uppercase tracking-wider">
            <Smartphone className="h-3.5 w-3.5" />
            <span>Interactive Architecture: Offline-First Sync</span>
          </span>
          <span className="text-[10px] text-ink-5">Tap node to inspect</span>
        </div>

        {/* Node Pipeline Flow */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {nodes.map((node, i) => {
            const isSelected = activeNode === node.id;
            return (
              <div
                key={node.id}
                onClick={() => {
                  soundFx.playNote(i);
                  setActiveNode(isSelected ? null : node.id);
                }}
                className={`flex flex-col justify-between rounded-lg border p-2.5 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-ink-1 bg-fg/[0.08] shadow-sm"
                    : "border-edge bg-bg hover:border-edge-strong hover:bg-fg/[0.02]"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] text-ink-4">
                  <span>0{i + 1}</span>
                  {i < 3 && <ArrowRight className="h-3 w-3 text-ink-5 hidden sm:inline" />}
                </div>
                <div className="mt-2 font-semibold text-xs text-ink-1 truncate">{node.name}</div>
                <div className="font-mono text-[10px] text-ink-4 truncate">{node.type}</div>
              </div>
            );
          })}
        </div>

        {/* Node Detail Bar */}
        <div className="mt-3 min-h-[36px] rounded-lg border border-edge bg-bg/80 px-3 py-2 font-mono text-[11px] leading-relaxed text-ink-3">
          {currentNode ? (
            <div className="animate-reveal flex items-start gap-2">
              <span className="font-bold text-ink-1">[{currentNode.name}]:</span>
              <span>{currentNode.description}</span>
            </div>
          ) : (
            <span className="text-ink-4 italic">
              Click any stage above to inspect how Sandalan syncs 38+ banks offline without data loss.
            </span>
          )}
        </div>
      </div>
    );
  }

  if (projectKey === "snpseek") {
    const services: NodeInfo[] = [
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
    ];

    const currentService = services.find((s) => s.id === activeNode);

    return (
      <div className="my-4 rounded-xl border border-edge bg-fg/[0.02] p-4 text-xs">
        <div className="flex items-center justify-between font-mono text-[11px] text-ink-4 mb-3">
          <span className="flex items-center gap-1.5 font-semibold text-ink-2 uppercase tracking-wider">
            <Server className="h-3.5 w-3.5" />
            <span>Interactive Architecture: Microservices Decoupling</span>
          </span>
          <span className="text-[10px] text-ink-5">Tap to inspect</span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {services.map((svc, i) => {
            const isSelected = activeNode === svc.id;
            return (
              <div
                key={svc.id}
                onClick={() => {
                  soundFx.playNote(i + 1);
                  setActiveNode(isSelected ? null : svc.id);
                }}
                className={`flex flex-col justify-between rounded-lg border p-2.5 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-ink-1 bg-fg/[0.08] shadow-sm"
                    : "border-edge bg-bg hover:border-edge-strong hover:bg-fg/[0.02]"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] text-ink-4">
                  <span>SVC {i + 1}</span>
                  <Network className="h-3 w-3 text-ink-5" />
                </div>
                <div className="mt-2 font-semibold text-xs text-ink-1 truncate">{svc.name}</div>
                <div className="font-mono text-[10px] text-ink-4 truncate">{svc.type}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 min-h-[36px] rounded-lg border border-edge bg-bg/80 px-3 py-2 font-mono text-[11px] leading-relaxed text-ink-3">
          {currentService ? (
            <div className="animate-reveal flex items-start gap-2">
              <span className="font-bold text-ink-1">[{currentService.name}]:</span>
              <span>{currentService.description}</span>
            </div>
          ) : (
            <span className="text-ink-4 italic">
              Click any service above to inspect the legacy Java monolith migration into Dockerized microservices.
            </span>
          )}
        </div>
      </div>
    );
  }

  // Codebreak 2.0 (AI Hackathon Champion)
  const ragPipeline: NodeInfo[] = [
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
  ];

  const currentRag = ragPipeline.find((r) => r.id === activeNode);

  return (
    <div className="my-4 rounded-xl border border-edge bg-fg/[0.02] p-4 text-xs">
      <div className="flex items-center justify-between font-mono text-[11px] text-ink-4 mb-3">
        <span className="flex items-center gap-1.5 font-semibold text-ink-2 uppercase tracking-wider">
          <Zap className="h-3.5 w-3.5" />
          <span>Interactive Architecture: Sub-Second AI Vector RAG</span>
        </span>
        <span className="text-[10px] text-ink-5">Tap to inspect</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ragPipeline.map((step, i) => {
          const isSelected = activeNode === step.id;
          return (
            <div
              key={step.id}
              onClick={() => {
                soundFx.playNote(i + 2);
                setActiveNode(isSelected ? null : step.id);
              }}
              className={`flex flex-col justify-between rounded-lg border p-2.5 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-ink-1 bg-fg/[0.08] shadow-sm"
                  : "border-edge bg-bg hover:border-edge-strong hover:bg-fg/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-ink-4">
                <span>STAGE {i + 1}</span>
                <Cpu className="h-3 w-3 text-ink-5" />
              </div>
              <div className="mt-2 font-semibold text-xs text-ink-1 truncate">{step.name}</div>
              <div className="font-mono text-[10px] text-ink-4 truncate">{step.type}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 min-h-[36px] rounded-lg border border-edge bg-bg/80 px-3 py-2 font-mono text-[11px] leading-relaxed text-ink-3">
        {currentRag ? (
          <div className="animate-reveal flex items-start gap-2">
            <span className="font-bold text-ink-1">[{currentRag.name}]:</span>
            <span>{currentRag.description}</span>
          </div>
        ) : (
          <span className="text-ink-4 italic">
            Click any stage above to inspect the 24h hackathon-winning AI support architecture.
          </span>
        )}
      </div>
    </div>
  );
}
