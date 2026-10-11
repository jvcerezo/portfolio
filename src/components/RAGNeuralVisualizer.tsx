import { useState, useEffect, useMemo, useRef, useCallback, type KeyboardEvent, type ReactNode } from "react";
import {
  type RAGNeuralTrace,
  type NeuralNode,
  askTajAI,
  generateNeuralTrace,
} from "../lib/tajRAG";
import {
  Play,
  ExternalLink,
  ArrowRight,
  Send,
  HelpCircle,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Footprints,
  FileText,
} from "lucide-react";

interface RAGNeuralVisualizerProps {
  initialTrace?: RAGNeuralTrace;
  /** Node to pin when the trace opens (e.g. a source chip clicked in chat). */
  initialPinnedNodeId?: string | null;
  currentQuery?: string;
  onBackToChat?: () => void;
  onSendToChat?: (query: string) => void;
}

const PRESET_QUERIES = [
  { label: "Billease QA & CI/CD", query: "What did Jet ship at Billease?" },
  { label: "Sandalan Offline Sync", query: "How does Sandalan sync offline?" },
  { label: "IRRI Microservices", query: "Explain the 7 microservices rewrite at IRRI" },
  { label: "Tenext AI Hackathon", query: "What won 1st place in the hackathon?" },
  { label: "Technical Stack", query: "What is Jet's full tech stack?" },
  { label: "Loan Guardrail (Scope Refusal)", query: "Can I apply for a loan or cash advance?" },
  { label: "Trivia Guardrail (Off-Topic)", query: "What is the capital of Australia?" },
];

const SVG_WIDTH = 1000;
const SVG_HEIGHT = 540;
const LAYER_X_POSITIONS = [95, 280, 510, 740, 915];
const LAYER_SUBTITLES = ["Tokens", "Attention", "Corpus", "Pooling", "Output"];
// When each layer lights up during the replay (ms from start).
const LAYER_DELAYS = [0, 350, 750, 1150, 1550];
const FLOW_END_MS = 2200;
// Labels wrap onto at most two lines of this many characters.
const LABEL_LINE_CHARS = 22;
const LIVE_QUERY_DEBOUNCE_MS = 400;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Splits a label into at most two lines; the second is truncated if needed. */
function wrapLabel(label: string, max = LABEL_LINE_CHARS): string[] {
  if (label.length <= max) return [label];
  // Prefer breaking before a parenthetical: "Primary Context" / "(Rank 1)".
  const paren = label.indexOf(" (");
  if (paren > 0 && paren <= max && label.length - paren - 1 <= max) {
    return [label.slice(0, paren), label.slice(paren + 1)];
  }
  const words = label.split(" ");
  let first = "";
  let i = 0;
  while (i < words.length && (first + (first ? " " : "") + words[i]).length <= max) {
    first += (first ? " " : "") + words[i];
    i++;
  }
  if (!first) return [label.slice(0, max - 1) + "…"];
  let rest = words.slice(i).join(" ");
  if (rest.length > max) rest = rest.slice(0, max - 1) + "…";
  return [first, rest];
}

/** "Layer 1: Semantic Intent & Attention" -> "Semantic Intent & Attention" */
const layerTitle = (name: string | undefined) => (name ?? "").replace(/^Layer\s+\d+:\s*/i, "");

/** Wraps query words that matched in <mark>, case-insensitively. */
function highlightTokens(text: string, tokens: string[]): ReactNode[] {
  const words = tokens.filter((t) => t.length > 1).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (words.length === 0) return [text];
  const re = new RegExp(`(${words.join("|")})`, "gi");
  return text.split(re).map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded-sm bg-emerald-500/20 px-0.5 text-emerald-400">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

/** One-line plain-English description of what a layer did for this trace. */
function stepCaption(trace: RAGNeuralTrace, step: number): string {
  const [l0, l1, l2, l3] = trace.layers;
  switch (step) {
    case 0: {
      const kept = l0.nodes.filter((n) => n.active).map((n) => `"${n.label}"`);
      return kept.length
        ? `Tokenized the question: kept ${kept.length} content word${kept.length === 1 ? "" : "s"} (${kept.join(", ")}) and dropped ${trace.stats.stopWordsCount} stop-word${trace.stats.stopWordsCount === 1 ? "" : "s"}.`
        : "No content words survived stop-word filtering, so there is nothing to retrieve on.";
    }
    case 1: {
      const fired = l1.nodes.filter((n) => n.active).map((n) => n.label);
      if (trace.stats.status === "unrelated" && fired.some((f) => f.startsWith("Guardrails")))
        return "The guardrail attention head fired: this question is outside Jet's portfolio, so retrieval is bypassed.";
      return fired.length
        ? `${fired.length} of ${l1.nodes.length} attention heads fired: ${fired.join(", ")}.`
        : `None of the ${l1.nodes.length} attention heads matched the question.`;
    }
    case 2: {
      const scored = l2.nodes.map((n) => ({ label: n.label, score: n.metadata?.score ?? 0, active: n.active }));
      const passed = scored.filter((s) => s.active);
      const top = [...scored].sort((a, b) => b.score - a.score)[0];
      return passed.length
        ? `Scored all ${scored.length} résumé chunks; ${passed.length} passed the 1.8-point threshold (top: ${top.label} at ${top.score.toFixed(1)} pts).`
        : `Scored all ${scored.length} résumé chunks; none reached the 1.8-point threshold.`;
    }
    case 3: {
      const pooled = l3.nodes.filter((n) => n.active).map((n) => n.label);
      return pooled.length ? `Pooled into the context window: ${pooled.join(", ")}.` : "Nothing was pooled into the context window.";
    }
    default:
      return trace.stats.status === "matched"
        ? `Generated a grounded answer from ${trace.stats.retrievedCount} retrieved source${trace.stats.retrievedCount === 1 ? "" : "s"} at ${trace.stats.confidence}% confidence.`
        : trace.stats.status === "greeting"
        ? "Answered as a greeting: no retrieval needed."
        : "Answered with a polite scope clarification instead of guessing.";
  }
}

export function RAGNeuralVisualizer({
  initialTrace,
  initialPinnedNodeId,
  currentQuery,
  onBackToChat,
  onSendToChat,
}: RAGNeuralVisualizerProps) {
  // Query state
  const [queryInput, setQueryInput] = useState("");
  const [activeQuery, setActiveQuery] = useState(
    currentQuery || initialTrace?.query || "What did Jet ship at Billease?"
  );

  // Active neural trace
  const [trace, setTrace] = useState<RAGNeuralTrace>(() => {
    if (initialTrace) return initialTrace;
    const res = askTajAI(activeQuery);
    return res.neuralTrace || generateNeuralTrace(activeQuery, res);
  });

  // UI state
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialPinnedNodeId ?? null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [animationStep, setAnimationStep] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [runId, setRunId] = useState(0);
  const [stepMode, setStepMode] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const animationTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  // Live (as-you-type) traces update quietly, without replaying the flow.
  const quietNextTraceRef = useRef(false);
  const nodeRefs = useRef(new Map<string, SVGGElement>());
  const reduceMotion = useMemo(prefersReducedMotion, []);

  // Update trace when initialTrace prop changes
  useEffect(() => {
    if (initialTrace) {
      setTrace(initialTrace);
      setActiveQuery(initialTrace.query);
      setSelectedNodeId(initialPinnedNodeId ?? null);
    }
  }, [initialTrace, initialPinnedNodeId]);

  const clearTimers = () => {
    animationTimersRef.current.forEach(clearTimeout);
    animationTimersRef.current = [];
  };

  // Sequential layer activation animation
  const triggerFlowAnimation = useCallback(() => {
    clearTimers();
    setStepMode(false);
    if (reduceMotion) {
      setAnimationStep(null);
      setIsAnimating(false);
      return;
    }
    setRunId((r) => r + 1);
    setIsAnimating(true);
    setAnimationStep(0);

    LAYER_DELAYS.forEach((delay, step) => {
      animationTimersRef.current.push(setTimeout(() => setAnimationStep(step), delay));
    });
    animationTimersRef.current.push(
      setTimeout(() => {
        setAnimationStep(null);
        setIsAnimating(false);
      }, FLOW_END_MS)
    );
  }, [reduceMotion]);

  useEffect(() => {
    if (quietNextTraceRef.current) {
      quietNextTraceRef.current = false;
    } else {
      triggerFlowAnimation();
    }
    return clearTimers;
  }, [trace, triggerFlowAnimation]);

  // Execute custom or preset query
  const runQuery = useCallback((newQuery: string, { quiet = false } = {}) => {
    const q = newQuery.trim();
    if (!q) return;
    setActiveQuery(q);
    setSelectedNodeId(null);
    const res = askTajAI(q);
    quietNextTraceRef.current = quiet;
    setTrace(res.neuralTrace || generateNeuralTrace(q, res));
  }, []);

  const handleRunQuery = (newQuery: string) => {
    setQueryInput("");
    runQuery(newQuery);
  };

  // Live typing: re-trace as the visitor types (debounced, no replay).
  useEffect(() => {
    const q = queryInput.trim();
    if (q.length < 3) return;
    const timer = setTimeout(() => runQuery(q, { quiet: true }), LIVE_QUERY_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [queryInput, runQuery]);

  // Step-through mode: the graph shows layers up to the current step.
  const enterStepMode = () => {
    clearTimers();
    setIsAnimating(false);
    setStepMode(true);
    setStepIndex(0);
    setAnimationStep(0);
    setRunId((r) => r + 1);
  };
  const goToStep = (step: number) => {
    const s = Math.max(0, Math.min(4, step));
    setStepIndex(s);
    setAnimationStep(s);
    setRunId((r) => r + 1);
  };
  const exitStepMode = () => {
    setStepMode(false);
    setAnimationStep(null);
  };

  // Node position calculations for SVG Canvas
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number; layer: number }> = {};
    const topMargin = 60;
    const usableHeight = 440;

    trace.layers.forEach((layer) => {
      const x = LAYER_X_POSITIONS[layer.index];
      const count = layer.nodes.length;
      const step = usableHeight / count;

      layer.nodes.forEach((node, idx) => {
        const y = topMargin + (idx + 0.5) * step;
        positions[node.id] = { x, y, layer: layer.index };
      });
    });

    return positions;
  }, [trace]);

  // Find all all nodes as a flat map
  const nodesMap = useMemo(() => {
    const map = new Map<string, NeuralNode>();
    trace.layers.forEach((l) => {
      l.nodes.forEach((n) => map.set(n.id, n));
    });
    return map;
  }, [trace]);

  // Focal node: hovered, keyboard-focused, or pinned
  const focalNodeId = hoveredNodeId || focusedNodeId || selectedNodeId;

  // Currently focused node (selected or hovered)
  const activeInspectNode = useMemo(() => {
    if (focalNodeId && nodesMap.has(focalNodeId)) {
      return nodesMap.get(focalNodeId)!;
    }
    return null;
  }, [focalNodeId, nodesMap]);

  // Connected synapse IDs for currently highlighted node
  const highlightedSynapseIds = useMemo(() => {
    if (!focalNodeId) return null;

    const set = new Set<string>();
    trace.synapses.forEach((syn) => {
      if (syn.sourceId === focalNodeId || syn.targetId === focalNodeId) {
        set.add(syn.id);
      }
    });
    return set;
  }, [focalNodeId, trace.synapses]);

  // Connected neighbor node IDs for currently highlighted node
  const connectedNeighborNodeIds = useMemo(() => {
    if (!focalNodeId) return null;

    const set = new Set<string>();
    trace.synapses.forEach((syn) => {
      if (syn.sourceId === focalNodeId) {
        set.add(syn.targetId);
      } else if (syn.targetId === focalNodeId) {
        set.add(syn.sourceId);
      }
    });
    return set;
  }, [focalNodeId, trace.synapses]);

  const synapsePath = useCallback(
    (sourceId: string, targetId: string) => {
      const src = nodePositions[sourceId];
      const tgt = nodePositions[targetId];
      if (!src || !tgt) return null;
      const midX = (src.x + tgt.x) / 2;
      return `M ${src.x} ${src.y} C ${midX} ${src.y}, ${midX} ${tgt.y}, ${tgt.x} ${tgt.y}`;
    },
    [nodePositions]
  );

  // Signal pulses: one dot per active synapse, travelling as its layer fires.
  const pulses = useMemo(() => {
    if (reduceMotion || focalNodeId || (!isAnimating && !stepMode)) return [];
    const list: { id: string; d: string; delay: number; duration: number; guard: boolean }[] = [];
    for (const syn of trace.synapses) {
      if (!syn.active) continue;
      const tgt = nodePositions[syn.targetId];
      const d = synapsePath(syn.sourceId, syn.targetId);
      if (!tgt || !d) continue;
      const guard = syn.sourceId.includes("guardrail") || syn.targetId.includes("guardrail");
      const layer = tgt.layer;
      if (stepMode) {
        if (layer === stepIndex) list.push({ id: syn.id, d, delay: 0, duration: 700, guard });
        continue;
      }
      const start = LAYER_DELAYS[Math.max(0, layer - 1)];
      list.push({ id: syn.id, d, delay: start, duration: Math.max(300, LAYER_DELAYS[layer] - start), guard });
    }
    return list;
  }, [trace, nodePositions, synapsePath, isAnimating, stepMode, stepIndex, focalNodeId, reduceMotion]);

  // Keyboard navigation between neurons: arrows move, Enter/Space pins.
  const focusNode = (id: string | undefined) => {
    if (id) nodeRefs.current.get(id)?.focus();
  };
  const handleNodeKeyDown = (e: KeyboardEvent<SVGGElement>, node: NeuralNode) => {
    const layerNodes = trace.layers[node.layer]?.nodes ?? [];
    const idx = layerNodes.findIndex((n) => n.id === node.id);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedNodeId(node.id === selectedNodeId ? null : node.id);
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = layerNodes[idx + (e.key === "ArrowDown" ? 1 : -1)];
      focusNode(next?.id);
    } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const neighbourLayer = trace.layers[node.layer + (e.key === "ArrowRight" ? 1 : -1)];
      if (!neighbourLayer) return;
      const y = nodePositions[node.id]?.y ?? 0;
      const nearest = [...neighbourLayer.nodes].sort(
        (a, b) => Math.abs((nodePositions[a.id]?.y ?? 0) - y) - Math.abs((nodePositions[b.id]?.y ?? 0) - y)
      )[0];
      focusNode(nearest?.id);
    } else if (e.key === "Escape" && selectedNodeId) {
      e.stopPropagation();
      setSelectedNodeId(null);
    }
  };

  const pinnedCorpusNode =
    selectedNodeId && nodesMap.get(selectedNodeId)?.type === "corpus" ? nodesMap.get(selectedNodeId)! : null;
  const inspectorExpanded = Boolean(pinnedCorpusNode) || stepMode;

  return (
    <div className="flex flex-col h-full bg-bg text-ink-1 overflow-hidden select-none">
      {/* Top Controller Bar */}
      <div className="p-3 border-b border-edge bg-fg/[0.02] space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-edge bg-fg/[0.04]">
              <Activity className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="font-semibold text-xs text-ink-1">Neural Network RAG Trace</span>
                <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded border border-edge bg-emerald-500/10 text-emerald-500 font-medium">
                  {trace.stats.status === "matched"
                    ? "Knowledge Active"
                    : trace.stats.status === "unrelated"
                    ? "Scope Guardrail Fired"
                    : "Greeting Mode"}
                </span>
              </div>
              <div className="font-mono text-[10px] text-ink-4 truncate">
                Live weights: {trace.stats.totalTokens} tokens • Top score:{" "}
                {trace.stats.topScore.toFixed(1)} pts • Confidence: {trace.stats.confidence}%
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={triggerFlowAnimation}
              disabled={isAnimating}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-lg border border-edge bg-fg/[0.03] hover:bg-fg/[0.08] hover:border-fg/30 transition-all text-ink-2 disabled:opacity-50 cursor-pointer"
              title="Replay layer activation flow"
            >
              <Play className={`h-3 w-3 ${isAnimating ? "text-emerald-500" : ""}`} />
              <span>{isAnimating ? "Signal Flowing..." : "Replay Flow"}</span>
            </button>

            <button
              type="button"
              onClick={stepMode ? exitStepMode : enterStepMode}
              aria-pressed={stepMode}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all cursor-pointer ${
                stepMode
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-500"
                  : "border-edge bg-fg/[0.03] text-ink-2 hover:bg-fg/[0.08] hover:border-fg/30"
              }`}
              title="Walk through the pipeline one layer at a time"
            >
              <Footprints className="h-3 w-3" />
              <span>{stepMode ? "Exit Steps" : "Step Through"}</span>
            </button>

            {onBackToChat && (
              <button
                type="button"
                onClick={onBackToChat}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono rounded-lg border border-edge bg-fg text-bg hover:opacity-90 transition-opacity cursor-pointer"
              >
                <span>Back to Chat</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Current Query Badge + Custom Query Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 min-w-0 flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-edge bg-bg text-xs">
            <span className="font-mono text-[10px] text-ink-5 shrink-0 uppercase tracking-wider">
              Query:
            </span>
            <span className="font-medium text-ink-1 truncate" title={activeQuery}>
              "{activeQuery}"
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunQuery(queryInput);
            }}
            className="flex items-center gap-1.5"
          >
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Type a question: traces live..."
              aria-label="Custom query (the trace updates as you type)"
              className="h-8 min-w-0 flex-1 px-2.5 py-1 text-xs rounded-lg border border-edge bg-bg placeholder:text-ink-5 text-ink-1 focus:outline-none focus:border-fg font-sans sm:w-56 sm:flex-none"
            />
            <button
              type="submit"
              disabled={!queryInput.trim()}
              className="h-8 px-2.5 rounded-lg bg-fg text-bg text-xs font-mono disabled:opacity-30 hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer shrink-0"
              title="Run the query and replay the signal flow"
            >
              <Send className="h-3 w-3" />
              <span>Fire</span>
            </button>
          </form>
        </div>

        {/* Presets Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-[10px] font-mono">
          <span className="text-ink-5 shrink-0">Presets:</span>
          {PRESET_QUERIES.map((p) => {
            const isCurrent = activeQuery === p.query;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => handleRunQuery(p.query)}
                className={`shrink-0 px-2 py-0.5 rounded-md border transition-all ${
                  isCurrent
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 font-semibold"
                    : "border-edge bg-fg/[0.02] text-ink-3 hover:text-ink-1 hover:border-fg/30"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Neural Canvas (SVG): keeps a readable size on phones and scrolls sideways */}
      <div className="relative flex-1 min-h-[260px] overflow-x-auto overflow-y-hidden bg-bg/50">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="pointer-events-none absolute right-2 top-2 z-10 rounded-full border border-edge bg-bg/90 px-2 py-0.5 font-mono text-[9px] text-ink-4 sm:hidden">
          Swipe to explore →
        </div>

        <div className="flex h-full min-w-[720px] items-center justify-center p-2">
          <svg
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="w-full max-w-[1100px] h-full drop-shadow-sm select-none"
            preserveAspectRatio="xMidYMid meet"
            style={{ overflow: "visible" }}
            role="group"
            aria-label={`Neural retrieval trace for "${activeQuery}". Use arrow keys to move between neurons and Enter to pin one.`}
          >
            <defs>
              {/* Linear gradient for active synapses */}
              <linearGradient id="activeSynapseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
              </linearGradient>

              {/* Gradient for guardrail diversion synapses */}
              <linearGradient id="guardrailSynapseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Layer Headers */}
            {trace.layers.map((layer) => {
              const x = LAYER_X_POSITIONS[layer.index];
              const isWaveFront = animationStep === layer.index;
              const isLayerActiveInFlow =
                animationStep === null || animationStep >= layer.index;

              return (
                <g key={layer.code} className="transition-all" pointerEvents="none">
                  <text
                    x={x}
                    y={24}
                    textAnchor="middle"
                    className={`font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 ${
                      isWaveFront
                        ? "fill-emerald-400 font-bold"
                        : isLayerActiveInFlow
                        ? "fill-ink-2"
                        : "fill-ink-4"
                    }`}
                  >
                    {layer.code}
                  </text>
                  <text
                    x={x}
                    y={38}
                    textAnchor="middle"
                    className={`font-sans text-[9px] transition-colors duration-300 ${
                      isLayerActiveInFlow ? "fill-ink-4" : "fill-ink-5"
                    }`}
                  >
                    {LAYER_SUBTITLES[layer.index]}
                  </text>
                  {/* Vertical column subtle guideline */}
                  <line
                    x1={x}
                    y1={46}
                    x2={x}
                    y2={SVG_HEIGHT - 18}
                    stroke="currentColor"
                    strokeOpacity={isLayerActiveInFlow ? "0.06" : "0.03"}
                    strokeDasharray="2 4"
                    className="transition-opacity duration-300"
                  />
                </g>
              );
            })}

            {/* Synapses (Connecting Lines) - pointer-events none to prevent hover stealing */}
            <g className="synapses-layer" pointerEvents="none">
              {trace.synapses.map((syn) => {
                const tgtPos = nodePositions[syn.targetId];
                const pathData = synapsePath(syn.sourceId, syn.targetId);
                if (!tgtPos || !pathData) return null;

                const isConnectedToFocal = highlightedSynapseIds?.has(syn.id) ?? false;
                const isGuardrail =
                  syn.sourceId.includes("guardrail") || syn.targetId.includes("guardrail");

                let stroke = "currentColor";
                let strokeOpacity = 0.04;
                let strokeWidth = 0.75;
                let strokeDasharray: string | undefined = undefined;

                if (focalNodeId) {
                  // WHEN A NEURON IS HOVERED, FOCUSED OR PINNED:
                  // Deactivate the default chosen neural path to eliminate conflicting lines.
                  if (isConnectedToFocal) {
                    if (syn.active) {
                      stroke = isGuardrail ? "url(#guardrailSynapseGrad)" : "url(#activeSynapseGrad)";
                      strokeOpacity = 1;
                      strokeWidth = 2.5;
                    } else {
                      stroke = "#06b6d4";
                      strokeOpacity = 0.55;
                      strokeWidth = 1.75;
                      strokeDasharray = "4 3";
                    }
                  } else {
                    strokeOpacity = 0.025;
                    strokeWidth = 0.5;
                  }
                } else {
                  // DEFAULT FLOW STATE:
                  // Signal connects forward smoothly as each layer activates without blinking
                  const isSynapseActiveInFlow =
                    animationStep === null || animationStep >= tgtPos.layer;
                  const isActive = syn.active && isSynapseActiveInFlow;

                  if (isActive) {
                    stroke = isGuardrail ? "url(#guardrailSynapseGrad)" : "url(#activeSynapseGrad)";
                    strokeOpacity = 0.85;
                    strokeWidth = 2;
                  }
                }

                return (
                  <path
                    key={syn.id}
                    d={pathData}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeOpacity={strokeOpacity}
                    strokeDasharray={strokeDasharray}
                    className="transition-all duration-300 ease-out"
                  />
                );
              })}
            </g>

            {/* Signal pulses travelling along the active pathway */}
            <g key={`pulses-${runId}`} pointerEvents="none" aria-hidden="true">
              {pulses.map((p) => (
                <circle
                  key={p.id}
                  r={3.2}
                  fill={p.guard ? "#f59e0b" : "#34d399"}
                  className="neural-pulse"
                  style={{
                    offsetPath: `path('${p.d}')`,
                    animationDuration: `${p.duration}ms`,
                    animationDelay: `${p.delay}ms`,
                  }}
                />
              ))}
            </g>

            {/* Nodes */}
            <g className="nodes-layer">
              {trace.layers.flatMap((layer) =>
                layer.nodes.map((node) => {
                  const pos = nodePositions[node.id];
                  if (!pos) return null;

                  const isTarget = focalNodeId === node.id;
                  const isNeighbor = connectedNeighborNodeIds?.has(node.id) ?? false;
                  const isGuard = node.id.includes("guardrail");
                  const isPinned = selectedNodeId === node.id;

                  const nodeRadius = node.layer === 4 ? 16 : node.layer === 0 ? 11 : 9.5;

                  // Color and highlight configuration
                  const fillColor = "var(--bg, #0d0f12)";
                  let strokeColor = "currentColor";
                  let strokeOpacity = 0.2;
                  let strokeWidth = 1.5;
                  let showHalo = false;
                  let haloColor = isGuard ? "#f59e0b" : "#10b981";
                  let haloOpacity = 0;
                  let showInnerDot = false;
                  let innerDotColor = haloColor;
                  let labelClass = "fill-ink-5";

                  if (focalNodeId) {
                    // HOVERED / FOCUSED / PINNED INSPECTION STATE:
                    // The default chosen path is deactivated so there is no visual conflict.
                    if (isTarget) {
                      const focalColor = isGuard ? "#f59e0b" : node.active ? "#10b981" : "#06b6d4";
                      strokeColor = focalColor;
                      strokeOpacity = 1;
                      strokeWidth = 2.5;
                      showHalo = true;
                      haloColor = focalColor;
                      haloOpacity = 0.35;
                      showInnerDot = true;
                      innerDotColor = focalColor;
                      labelClass = "fill-ink-1 font-bold";
                    } else if (isNeighbor) {
                      const neighborColor = isGuard ? "#f59e0b" : node.active ? "#10b981" : "currentColor";
                      strokeColor = neighborColor;
                      strokeOpacity = node.active ? 0.9 : 0.45;
                      strokeWidth = 1.75;
                      showHalo = node.active;
                      haloColor = neighborColor;
                      haloOpacity = 0.15;
                      showInnerDot = node.active;
                      innerDotColor = neighborColor;
                      labelClass = node.active ? "fill-ink-1 font-semibold" : "fill-ink-3";
                    } else {
                      // Conflicting node from chosen path or background: fully dimmed
                      strokeOpacity = 0.1;
                      strokeWidth = 1;
                      labelClass = "fill-ink-5/30";
                    }
                  } else {
                    // DEFAULT FLOW STATE (NO HOVER):
                    // Active neurons in the chosen path light up steadily as the signal reaches their layer
                    const isNodeActiveInFlow =
                      animationStep === null || animationStep >= node.layer;
                    const isActive = node.active && isNodeActiveInFlow;

                    if (isActive) {
                      strokeColor = isGuard ? "#f59e0b" : "#10b981";
                      strokeOpacity = 1;
                      strokeWidth = 2;
                      showHalo = true;
                      haloColor = strokeColor;
                      haloOpacity = 0.2;
                      showInnerDot = true;
                      innerDotColor = strokeColor;
                      labelClass = "fill-ink-1 font-semibold";
                    } else {
                      strokeOpacity = 0.2;
                      strokeWidth = 1.25;
                      labelClass = "fill-ink-5";
                    }
                  }

                  const lines = node.layer === 0 || node.layer === 4 ? [node.label] : wrapLabel(node.label);
                  const ariaLabel = `${trace.layers[node.layer]?.code ?? `Layer ${node.layer}`} ${node.label}: ${
                    node.active ? "fired" : "inhibited"
                  }, activation ${(node.activation * 100).toFixed(0)}%${
                    node.metadata?.score !== undefined && node.type === "corpus" ? `, score ${node.metadata.score.toFixed(1)} points` : ""
                  }${isPinned ? ", pinned" : ""}`;

                  return (
                    <g
                      key={node.id}
                      ref={(el) => {
                        if (el) nodeRefs.current.set(node.id, el);
                        else nodeRefs.current.delete(node.id);
                      }}
                      className="cursor-pointer group outline-none"
                      tabIndex={0}
                      role="button"
                      aria-pressed={isPinned}
                      aria-label={ariaLabel}
                      onClick={() => setSelectedNodeId(node.id === selectedNodeId ? null : node.id)}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      onFocus={() => setFocusedNodeId(node.id)}
                      onBlur={() => setFocusedNodeId((id) => (id === node.id ? null : id))}
                      onKeyDown={(e) => handleNodeKeyDown(e, node)}
                    >
                      <title>{node.label}</title>
                      {/* Generous stable hitbox to prevent hover jitter */}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={nodeRadius + 12}
                        fill="transparent"
                        stroke="transparent"
                      />

                      {/* Keyboard focus ring */}
                      {focusedNodeId === node.id && (
                        <circle
                          pointerEvents="none"
                          cx={pos.x}
                          cy={pos.y}
                          r={nodeRadius + 8}
                          fill="none"
                          stroke="#34d399"
                          strokeWidth={1.5}
                          strokeDasharray="3 3"
                        />
                      )}

                      {/* Outer Glow Halo for Active / Focused Nodes */}
                      {showHalo && (
                        <circle
                          pointerEvents="none"
                          cx={pos.x}
                          cy={pos.y}
                          r={nodeRadius + 6}
                          fill={haloColor}
                          opacity={haloOpacity}
                          className="transition-opacity duration-300"
                        />
                      )}

                      {/* Node Core Circle */}
                      <circle
                        pointerEvents="none"
                        cx={pos.x}
                        cy={pos.y}
                        r={nodeRadius}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeOpacity={strokeOpacity}
                        className="transition-all duration-300"
                      />

                      {/* Small inner dot if active / focused */}
                      {showInnerDot && (
                        <circle
                          pointerEvents="none"
                          cx={pos.x}
                          cy={pos.y}
                          r={nodeRadius * 0.4}
                          fill={innerDotColor}
                          className="transition-all duration-300"
                        />
                      )}

                      {/* Node Label Text (outlined in the background colour so curves never cut through it) */}
                      {node.layer === 0 ? (
                        <text
                          pointerEvents="none"
                          x={pos.x - nodeRadius - 8}
                          y={pos.y + 3.5}
                          textAnchor="end"
                          className={`neural-label font-mono text-[9.5px] transition-colors duration-200 ${labelClass}`}
                        >
                          {node.label}
                        </text>
                      ) : node.layer === 4 ? (
                        <g pointerEvents="none">
                          <text
                            x={pos.x}
                            y={pos.y - nodeRadius - 10}
                            textAnchor="middle"
                            className="neural-label font-mono text-[10px] font-bold fill-ink-1 uppercase tracking-wider"
                          >
                            {node.label}
                          </text>
                          <text
                            x={pos.x}
                            y={pos.y + nodeRadius + 16}
                            textAnchor="middle"
                            className={`neural-label font-mono text-[8.5px] font-medium transition-colors ${
                              focalNodeId && !isTarget && !isNeighbor
                                ? "fill-ink-5/40"
                                : "fill-emerald-500"
                            }`}
                          >
                            {trace.stats.confidence}% conf
                          </text>
                        </g>
                      ) : (
                        <text
                          pointerEvents="none"
                          x={pos.x + nodeRadius + 8}
                          y={pos.y + (lines.length > 1 ? -2 : 3.5)}
                          textAnchor="start"
                          className={`neural-label font-sans text-[9px] transition-colors duration-200 ${labelClass}`}
                        >
                          {lines.map((line, i) => (
                            <tspan key={i} x={pos.x + nodeRadius + 8} dy={i === 0 ? 0 : 10.5}>
                              {line}
                            </tspan>
                          ))}
                        </text>
                      )}
                    </g>
                  );
                })
              )}
            </g>
          </svg>
        </div>
      </div>

      {/* Bottom Inspector: fixed heights (taller for evidence/steps) so hovering never shifts the graph */}
      <div
        className={`border-t border-edge bg-fg/[0.015] p-3 shrink-0 overflow-y-auto flex flex-col transition-[height] duration-200 ${
          inspectorExpanded ? "h-[236px]" : "h-[150px]"
        }`}
      >
        {stepMode && !activeInspectNode ? (
          /* Step-through narration */
          <div className="h-full flex flex-col justify-between gap-2" aria-live="polite">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-500 shrink-0">
                  Step {stepIndex + 1} / 5 · {trace.layers[stepIndex]?.code}
                </span>
                <span className="font-semibold text-xs text-ink-1 truncate">
                  {layerTitle(trace.layers[stepIndex]?.name)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => goToStep(stepIndex - 1)}
                  disabled={stepIndex === 0}
                  className="flex items-center gap-1 px-2 py-1 text-[11px] font-mono rounded-lg border border-edge text-ink-2 hover:border-fg/30 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="h-3 w-3" />
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => (stepIndex === 4 ? exitStepMode() : goToStep(stepIndex + 1))}
                  className="flex items-center gap-1 px-2 py-1 text-[11px] font-mono rounded-lg bg-fg text-bg hover:opacity-90 cursor-pointer"
                >
                  {stepIndex === 4 ? "Done" : "Next"}
                  {stepIndex !== 4 && <ChevronRight className="h-3 w-3" />}
                </button>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-ink-2">{stepCaption(trace, stepIndex)}</p>

            <div className="flex items-center gap-1" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((s) => (
                <span
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors ${s <= stepIndex ? "bg-emerald-500" : "bg-fg/10"}`}
                />
              ))}
            </div>
            <p className="font-mono text-[10px] text-ink-4">{trace.layers[stepIndex]?.description}</p>
          </div>
        ) : activeInspectNode ? (
          /* Deep-Dive Inspection Panel for Clicked / Hovered / Focused Neuron */
          <div className="h-full flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border border-edge bg-fg/[0.04] text-ink-3 shrink-0">
                  {trace.layers[activeInspectNode.layer]?.code ?? `L${activeInspectNode.layer}`} ·{" "}
                  {layerTitle(trace.layers[activeInspectNode.layer]?.name)}
                </span>
                <span className="font-semibold text-xs text-ink-1 truncate" title={activeInspectNode.label}>
                  {activeInspectNode.label}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`font-mono text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium ${
                    activeInspectNode.active
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-fg/[0.04] text-ink-4 border border-edge"
                  }`}
                >
                  {activeInspectNode.active ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Fired (Active)</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3 w-3" />
                      <span>Inhibited (Low)</span>
                    </>
                  )}
                </span>
                {selectedNodeId && (
                  <button
                    type="button"
                    onClick={() => setSelectedNodeId(null)}
                    className="text-[10px] font-mono text-ink-4 hover:text-ink-1 underline cursor-pointer"
                  >
                    Unpin
                  </button>
                )}
              </div>
            </div>

            {activeInspectNode.type === "corpus" && pinnedCorpusNode?.id === activeInspectNode.id ? (
              /* Evidence: why this chunk scored what it did, and the text itself */
              <div className="grid flex-1 grid-cols-1 gap-2 text-xs sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                <div className="p-2 rounded-lg border border-edge bg-bg space-y-1.5">
                  <div className="font-mono text-[10px] text-ink-5 flex items-center justify-between">
                    <span>Score breakdown</span>
                    <span className="text-ink-1 font-bold">
                      {(activeInspectNode.metadata?.score ?? 0).toFixed(1)} pts
                    </span>
                  </div>
                  <ul className="space-y-1 font-mono text-[10px]">
                    {(activeInspectNode.metadata?.contributions ?? []).map((c) => (
                      <li key={c.token} className="flex items-center justify-between gap-2">
                        <span className="text-emerald-400">"{c.token}"</span>
                        <span className="text-ink-4 truncate">{c.via.join(" + ")}</span>
                        <span className="text-ink-1 shrink-0">+{c.points.toFixed(1)}</span>
                      </li>
                    ))}
                    {(activeInspectNode.metadata?.entityBoost ?? 0) > 0 && (
                      <li className="flex items-center justify-between gap-2">
                        <span className="text-emerald-400">entity match</span>
                        <span className="text-ink-4">named boost</span>
                        <span className="text-ink-1">+{(activeInspectNode.metadata?.entityBoost ?? 0).toFixed(1)}</span>
                      </li>
                    )}
                    {(activeInspectNode.metadata?.contributions ?? []).length === 0 &&
                      !(activeInspectNode.metadata?.entityBoost ?? 0) && (
                        <li className="text-ink-4">No query words matched this chunk.</li>
                      )}
                  </ul>
                  <div className="font-mono text-[9px] text-ink-5 border-t border-edge pt-1">
                    Threshold 1.8 pts · {activeInspectNode.active ? "passed" : "below cutoff"}
                  </div>
                </div>

                <div className="p-2 rounded-lg border border-edge bg-bg min-h-0">
                  <div className="font-mono text-[10px] text-ink-5 flex items-center gap-1 mb-1">
                    <FileText className="h-3 w-3" />
                    <span>Retrieved text · {activeInspectNode.metadata?.sourceLabel}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-ink-2 select-text">
                    {highlightTokens(
                      activeInspectNode.metadata?.content ?? activeInspectNode.metadata?.details ?? "",
                      (activeInspectNode.metadata?.contributions ?? []).map((c) => c.token)
                    )}
                  </p>
                </div>
              </div>
            ) : (
              /* Metrics Breakdown */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs flex-1">
                <div className="p-2 rounded-lg border border-edge bg-bg flex flex-col justify-between">
                  <div className="font-mono text-[10px] text-ink-5 flex items-center justify-between">
                    <span>Mathematical Activation:</span>
                    <span className="text-ink-1 font-bold">
                      {(activeInspectNode.activation * 100).toFixed(0)}%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 w-full rounded-full bg-fg/[0.06] overflow-hidden my-1">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        activeInspectNode.active ? "bg-emerald-500" : "bg-ink-5"
                      }`}
                      style={{ width: `${Math.max(5, activeInspectNode.activation * 100)}%` }}
                    />
                  </div>
                  <div className="font-mono text-[9px] text-ink-4 truncate">
                    {activeInspectNode.metadata?.formula || "Standard activation threshold function"}
                  </div>
                </div>

                <div className="p-2 rounded-lg border border-edge bg-bg flex flex-col justify-between">
                  <div className="font-mono text-[10px] text-ink-5 flex items-center justify-between">
                    <span>Criteria & Details:</span>
                    {activeInspectNode.metadata?.score !== undefined && (
                      <span className="text-ink-1 font-semibold text-[10px]">
                        Score: {activeInspectNode.metadata.score.toFixed(1)} pts
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-ink-2 leading-tight line-clamp-2">
                    {activeInspectNode.metadata?.details ||
                      activeInspectNode.sublabel ||
                      "Evaluated against token frequencies and corpus embeddings."}
                  </div>
                  {activeInspectNode.type === "corpus" ? (
                    <div className="font-mono text-[9px] text-emerald-500">Click to see the retrieved text &amp; score breakdown</div>
                  ) : activeInspectNode.metadata?.matchedKeywords &&
                    activeInspectNode.metadata.matchedKeywords.length > 0 ? (
                    <div className="font-mono text-[9px] text-emerald-500 truncate flex items-center gap-1">
                      <span>Tokens:</span>
                      <span>{activeInspectNode.metadata.matchedKeywords.join(", ")}</span>
                    </div>
                  ) : (
                    <div className="font-mono text-[9px] text-ink-5">Click to pin details</div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* General Pipeline Summary State */
          <div className="h-full flex flex-col justify-between gap-1.5">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border border-edge bg-fg/[0.04] text-ink-3">
                  RAG Architecture
                </span>
                <span className="font-semibold text-xs text-ink-1">
                  5-Layer Feedforward Retrieval Pipeline
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-ink-4">
                <span>Top Score: {trace.stats.topScore.toFixed(1)} pts</span>
                <span>•</span>
                <span>Confidence: {trace.stats.confidence}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs flex-1">
              <div className="p-2 rounded-lg border border-edge bg-bg flex flex-col justify-center gap-1">
                <div className="font-mono text-[10px] text-ink-5">Layer Progression:</div>
                <div className="flex flex-wrap items-center gap-1 font-mono text-[9px] text-ink-3">
                  <span className="px-1.5 py-0.5 rounded bg-fg/[0.04]">L0 Tokens</span>
                  <span>→</span>
                  <span className="px-1.5 py-0.5 rounded bg-fg/[0.04]">L1 Attention</span>
                  <span>→</span>
                  <span className="px-1.5 py-0.5 rounded bg-fg/[0.04]">L2 Corpus</span>
                  <span>→</span>
                  <span className="px-1.5 py-0.5 rounded bg-fg/[0.04]">L3 Pooling</span>
                  <span>→</span>
                  <span className="px-1.5 py-0.5 rounded bg-fg/[0.04]">L4 Output</span>
                </div>
              </div>

              <div className="p-2 rounded-lg border border-edge bg-bg flex flex-col justify-center gap-1">
                <div className="font-mono text-[10px] text-ink-5">Interactive Topology:</div>
                <div className="flex items-center gap-3 font-mono text-[9px] text-ink-3">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Active Pathway</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-fg/20" />
                    <span>Inhibited Synapse</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-ink-4">
              <div className="flex items-center gap-1 min-w-0">
                <HelpCircle className="h-3 w-3 shrink-0 text-ink-4" />
                <span className="truncate">Hover, tab or click a neuron · click a corpus chunk to see its evidence</span>
              </div>
              {onSendToChat && (
                <button
                  type="button"
                  onClick={() => onSendToChat(activeQuery)}
                  className="hover:text-ink-1 flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>Ask in Chat</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
