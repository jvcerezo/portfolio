import { useState } from 'react';
import { Server, Database, Smartphone, Cpu, ShieldCheck, ArrowRight, Layers, RefreshCw } from 'lucide-react';

export function ArchitectureVisualizer() {
  const [activeTab, setActiveTab] = useState<'irri' | 'sandalan' | 'codebreak'>('irri');

  return (
    <div className="reveal mt-6 overflow-hidden rounded-xl border border-edge bg-fg/[0.02]">
      {/* Tabs bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-edge bg-fg/[0.02] px-4 py-2.5">
        <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-4">
          <Layers className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
          <span>Interactive Architecture Flows</span>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-edge bg-bg p-0.5">
          <button
            onClick={() => setActiveTab('irri')}
            className={`rounded px-2.5 py-1 font-mono text-[10.5px] transition-all ${
              activeTab === 'irri'
                ? 'bg-fg text-bg font-medium shadow-sm'
                : 'text-ink-3 hover:text-ink-1'
            }`}
          >
            IRRI SNPseek (MERN)
          </button>
          <button
            onClick={() => setActiveTab('sandalan')}
            className={`rounded px-2.5 py-1 font-mono text-[10.5px] transition-all ${
              activeTab === 'sandalan'
                ? 'bg-fg text-bg font-medium shadow-sm'
                : 'text-ink-3 hover:text-ink-1'
            }`}
          >
            Sandalan Offline Sync
          </button>
          <button
            onClick={() => setActiveTab('codebreak')}
            className={`rounded px-2.5 py-1 font-mono text-[10.5px] transition-all ${
              activeTab === 'codebreak'
                ? 'bg-fg text-bg font-medium shadow-sm'
                : 'text-ink-3 hover:text-ink-1'
            }`}
          >
            Codebreak 2.0 (RAG)
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        {activeTab === 'irri' && (
          <div className="space-y-4 animate-reveal">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="font-display text-[15px] font-semibold text-ink-1">
                Genomics Microservices Platform · IRRI Architecture
              </h4>
              <span className="font-mono text-[11px] text-ink-4">
                7 Docker Services · REST API Gateway · OAuth/SSO
              </span>
            </div>
            <p className="text-[13.5px] leading-relaxed text-ink-2">
              Rewrote legacy PHP/MySQL SNPseek monolith into 7 decoupled Node.js microservices. Integrated custom Single Sign-On (SSO) bridging Drupal auth with new microservices.
            </p>

            {/* Architecture diagram cards */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div className="rounded-lg border border-edge bg-bg p-3">
                <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-ink-4">
                  <Smartphone className="h-3 w-3 text-brand" /> Client
                </div>
                <div className="mt-1 text-[13px] font-medium text-ink-1">React + Charts</div>
                <p className="mt-1 text-[11.5px] text-ink-3">Multi-criteria filtering over genomic datasets</p>
              </div>

              <div className="rounded-lg border border-edge bg-bg p-3">
                <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-ink-4">
                  <Server className="h-3 w-3 text-brand" /> Gateway
                </div>
                <div className="mt-1 text-[13px] font-medium text-ink-1">Express API Gateway</div>
                <p className="mt-1 text-[11.5px] text-ink-3">Routing, rate limiting, token verification</p>
              </div>

              <div className="rounded-lg border border-edge bg-bg p-3">
                <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-ink-4">
                  <Cpu className="h-3 w-3 text-brand" /> Microservices
                </div>
                <div className="mt-1 text-[13px] font-medium text-ink-1">7 Docker Services</div>
                <p className="mt-1 text-[11.5px] text-ink-3">Auth, Genomic, Variant, Variety, List, Phenotype</p>
              </div>

              <div className="rounded-lg border border-edge bg-bg p-3">
                <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-ink-4">
                  <Database className="h-3 w-3 text-brand" /> Data & Legacy
                </div>
                <div className="mt-1 text-[13px] font-medium text-ink-1">MongoDB + Drupal</div>
                <p className="mt-1 text-[11.5px] text-ink-3">Genomics store & PHP Drupal SSO bridge</p>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-center gap-2 font-mono text-[11px] text-ink-4">
              <span>Client</span>
              <ArrowRight className="h-3 w-3 text-ink-5" />
              <span>Gateway (Port 8080)</span>
              <ArrowRight className="h-3 w-3 text-ink-5" />
              <span>Docker Compose Mesh</span>
              <ArrowRight className="h-3 w-3 text-ink-5" />
              <span>MongoDB & Legacy PHP</span>
            </div>
          </div>
        )}

        {activeTab === 'sandalan' && (
          <div className="space-y-4 animate-reveal">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="font-display text-[15px] font-semibold text-ink-1">
                Sandalan Offline-First Two-Way Sync Engine
              </h4>
              <span className="font-mono text-[11px] text-ink-4">
                13 Synced Tables · SQLite Drift ↔ Supabase Postgres
              </span>
            </div>
            <p className="text-[13.5px] leading-relaxed text-ink-2">
              Architected conflict resolution with timestamp vector tracking and retry queues so Filipino users can track finances and view government guides seamlessly with zero internet connection.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-edge bg-bg p-3">
                <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-ink-4">
                  <Smartphone className="h-3 w-3 text-brand" /> Local Database
                </div>
                <div className="mt-1 text-[13px] font-medium text-ink-1">Drift SQLite (Flutter)</div>
                <p className="mt-1 text-[11.5px] text-ink-3">Instant reads/writes, reactive Riverpod streams</p>
              </div>

              <div className="rounded-lg border border-edge bg-bg p-3">
                <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-ink-4">
                  <RefreshCw className="h-3 w-3 text-brand" /> Sync Manager
                </div>
                <div className="mt-1 text-[13px] font-medium text-ink-1">Conflict Resolver</div>
                <p className="mt-1 text-[11.5px] text-ink-3">Incremental sync, exponential retry, queue replay</p>
              </div>

              <div className="rounded-lg border border-edge bg-bg p-3">
                <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-ink-4">
                  <ShieldCheck className="h-3 w-3 text-brand" /> Cloud Store
                </div>
                <div className="mt-1 text-[13px] font-medium text-ink-1">Supabase PostgreSQL</div>
                <p className="mt-1 text-[11.5px] text-ink-3">Row-Level Security (RLS) & encrypted auth</p>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-center gap-2 font-mono text-[11px] text-ink-4">
              <span>Flutter UI</span>
              <ArrowRight className="h-3 w-3 text-ink-5" />
              <span>Drift Local (Instant)</span>
              <ArrowRight className="h-3 w-3 text-ink-5" />
              <span>Background Sync Daemon</span>
              <ArrowRight className="h-3 w-3 text-ink-5" />
              <span>Supabase Cloud (RLS)</span>
            </div>
          </div>
        )}

        {activeTab === 'codebreak' && (
          <div className="space-y-4 animate-reveal">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="font-display text-[15px] font-semibold text-ink-1">
                Codebreak 2.0 AI Support Platform (Hackathon 1st Place)
              </h4>
              <span className="font-mono text-[11px] text-ink-4">
                Tenext.ai 2025 · Built in &lt;24 hours
              </span>
            </div>
            <p className="text-[13.5px] leading-relaxed text-ink-2">
              Full-stack AI support platform that ingests real-time call contexts, queries domain knowledge via vector embeddings, and generates dynamic call guidance scripts + automated QA scoring.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-edge bg-bg p-3">
                <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-ink-4">
                  <Server className="h-3 w-3 text-brand" /> Ingestion & WebSocket
                </div>
                <div className="mt-1 text-[13px] font-medium text-ink-1">Node.js Gateway</div>
                <p className="mt-1 text-[11.5px] text-ink-3">Low-latency live stream processing</p>
              </div>

              <div className="rounded-lg border border-edge bg-bg p-3">
                <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-ink-4">
                  <Database className="h-3 w-3 text-brand" /> Retrieval Layer
                </div>
                <div className="mt-1 text-[13px] font-medium text-ink-1">RAG Vector Store</div>
                <p className="mt-1 text-[11.5px] text-ink-3">Semantic search across customer KB & policy</p>
              </div>

              <div className="rounded-lg border border-edge bg-bg p-3">
                <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-ink-4">
                  <Cpu className="h-3 w-3 text-brand" /> LLM Generation
                </div>
                <div className="mt-1 text-[13px] font-medium text-ink-1">Claude & Groq Pipeline</div>
                <p className="mt-1 text-[11.5px] text-ink-3">Live call scripts & post-call compliance QA</p>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-center gap-2 font-mono text-[11px] text-ink-4">
              <span>Live Call Stream</span>
              <ArrowRight className="h-3 w-3 text-ink-5" />
              <span>Vector Similarity Search</span>
              <ArrowRight className="h-3 w-3 text-ink-5" />
              <span>LLM Synthesis</span>
              <ArrowRight className="h-3 w-3 text-ink-5" />
              <span>Real-Time Agent UI</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
