import { useState, useEffect, useMemo, useRef } from "react";
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
} from "lucide-react";

interface RAGNeuralVisualizerProps {
  initialTrace?: RAGNeuralTrace;
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

const SVG_WIDTH = 760;
const SVG_HEIGHT = 460;
const LAYER_X_POSITIONS = [70, 220, 390, 550, 680];

export function RAGNeuralVisualizer({
  initialTrace,
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
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [animationStep, setAnimationStep] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimersRef = useRef<NodeJS.Timeout[]>([]);

  // Update trace when initialTrace prop changes
  useEffect(() => {
    if (initialTrace) {
      setTrace(initialTrace);
      setActiveQuery(initialTrace.query);
      setSelectedNodeId(null);
    }
  }, [initialTrace]);

  // Sequential layer activation animation
  const triggerFlowAnimation = () => {
    // Clear any active timers
    animationTimersRef.current.forEach(clearTimeout);
    animationTimersRef.current = [];

    setIsAnimating(true);
    setAnimationStep(0);

    const steps = [
      { step: 0, delay: 0 },
      { step: 1, delay: 350 },
      { step: 2, delay: 750 },
      { step: 3, delay: 1150 },
      { step: 4, delay: 1550 },
    ];

    steps.forEach(({ step, delay }) => {
      const timer = setTimeout(() => {
        setAnimationStep(step);
      }, delay);
      animationTimersRef.current.push(timer);
    });

    const endTimer = setTimeout(() => {
      setAnimationStep(null);
      setIsAnimating(false);
    }, 2200);
    animationTimersRef.current.push(endTimer);
  };

  useEffect(() => {
    triggerFlowAnimation();
    return () => {
      animationTimersRef.current.forEach(clearTimeout);
    };
  }, [trace]);

  // Execute custom or preset query
  const handleRunQuery = (newQuery: string) => {
    const q = newQuery.trim();
    if (!q) return;
    setActiveQuery(q);
    setQueryInput("");
    setSelectedNodeId(null);

    const res = askTajAI(q);
    const newTrace = res.neuralTrace || generateNeuralTrace(q, res);
    setTrace(newTrace);
  };

  // Node position calculations for SVG Canvas
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number; layer: number }> = {};
    const topMargin = 55;
    const usableHeight = 360;

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

  // Currently focused node (selected or hovered)
  const activeInspectNode = useMemo(() => {
    const targetId = selectedNodeId || hoveredNodeId;
    if (targetId && nodesMap.has(targetId)) {
      return nodesMap.get(targetId)!;
    }
    return null;
  }, [selectedNodeId, hoveredNodeId, nodesMap]);

  // Connected synapse IDs for currently highlighted node
  const highlightedSynapseIds = useMemo(() => {
    const targetId = hoveredNodeId || selectedNodeId;
    if (!targetId) return null;

    const set = new Set<string>();
    trace.synapses.forEach((syn) => {
      if (syn.sourceId === targetId || syn.targetId === targetId) {
        set.add(syn.id);
      }
    });
    return set;
  }, [hoveredNodeId, selectedNodeId, trace.synapses]);

  return (
    <div className="flex flex-col h-full bg-bg text-ink-1 overflow-hidden select-none">
      {/* Top Controller Bar */}
      <div className="p-3 border-b border-edge bg-fg/[0.02] space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-edge bg-fg/[0.04]">
              <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-ink-1">Neural Network RAG Trace</span>
                <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded border border-edge bg-emerald-500/10 text-emerald-500 font-medium">
                  {trace.stats.status === "matched"
                    ? "Knowledge Active"
                    : trace.stats.status === "unrelated"
                    ? "Scope Guardrail Fired"
                    : "Greeting Mode"}
                </span>
              </div>
              <div className="font-mono text-[10px] text-ink-4">
                Live weights: {trace.stats.totalTokens} tokens • Top score:{" "}
                {trace.stats.topScore.toFixed(1)} pts • Confidence: {trace.stats.confidence}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={triggerFlowAnimation}
              disabled={isAnimating}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-lg border border-edge bg-fg/[0.03] hover:bg-fg/[0.08] hover:border-ink-1/30 transition-all text-ink-2 disabled:opacity-50 cursor-pointer"
              title="Replay layer activation flow"
            >
              <Play className={`h-3 w-3 ${isAnimating ? "animate-spin text-emerald-500" : ""}`} />
              <span>{isAnimating ? "Signal Flowing..." : "Replay Pulse"}</span>
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
          <div className="flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-edge bg-bg text-xs">
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
              placeholder="Test custom query..."
              className="h-8 px-2.5 py-1 text-xs rounded-lg border border-edge bg-bg placeholder:text-ink-5 text-ink-1 focus:outline-none focus:border-ink-1 font-sans w-48 sm:w-56"
            />
            <button
              type="submit"
              disabled={!queryInput.trim()}
              className="h-8 px-2.5 rounded-lg bg-fg text-bg text-xs font-mono disabled:opacity-30 hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer shrink-0"
              title="Run custom query through neural RAG"
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
                    : "border-edge bg-fg/[0.02] text-ink-3 hover:text-ink-1 hover:border-ink-1/30"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Neural Canvas (SVG) */}
      <div className="flex-1 relative overflow-auto bg-bg/50 flex items-center justify-center p-2 min-h-[300px]">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full max-w-[840px] h-auto max-h-full drop-shadow-sm select-none"
          style={{ overflow: "visible" }}
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

            {/* Node pulse glow filter */}
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Layer Headers */}
          {trace.layers.map((layer) => {
            const x = LAYER_X_POSITIONS[layer.index];
            const isLayerPulsing = animationStep === layer.index;
            return (
              <g key={layer.code} className="transition-all">
                <text
                  x={x}
                  y={22}
                  textAnchor="middle"
                  className={`font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                    isLayerPulsing ? "fill-emerald-500 font-bold" : "fill-ink-3"
                  }`}
                >
                  {layer.code}
                </text>
                <text
                  x={x}
                  y={34}
                  textAnchor="middle"
                  className="font-sans text-[8.5px] fill-ink-5"
                >
                  {layer.index === 0
                    ? "Tokens"
                    : layer.index === 1
                    ? "Attention"
                    : layer.index === 2
                    ? "Corpus"
                    : layer.index === 3
                    ? "Pooling"
                    : "Output"}
                </text>
                {/* Vertical column subtle guideline */}
                <line
                  x1={x}
                  y1={42}
                  x2={x}
                  y2={SVG_HEIGHT - 15}
                  stroke="currentColor"
                  strokeOpacity="0.04"
                  strokeDasharray="2 4"
                />
              </g>
            );
          })}

          {/* Synapses (Connecting Lines) */}
          <g className="synapses-layer">
            {trace.synapses.map((syn) => {
              const srcPos = nodePositions[syn.sourceId];
              const tgtPos = nodePositions[syn.targetId];
              if (!srcPos || !tgtPos) return null;

              const isHighlighted = highlightedSynapseIds?.has(syn.id);
              const isLayerActive =
                animationStep === null ||
                (animationStep >= srcPos.layer && animationStep <= tgtPos.layer);

              const isActive = syn.active && isLayerActive;
              const isGuardrail =
                syn.sourceId.includes("guardrail") || syn.targetId.includes("guardrail");

              // Curved bezier path
              const midX = (srcPos.x + tgtPos.x) / 2;
              const pathData = `M ${srcPos.x} ${srcPos.y} C ${midX} ${srcPos.y}, ${midX} ${tgtPos.y}, ${tgtPos.x} ${tgtPos.y}`;

              let stroke = "currentColor";
              let strokeOpacity = 0.05;
              let strokeWidth = 0.75;
              let strokeDasharray: string | undefined = undefined;

              if (isHighlighted) {
                stroke = isGuardrail ? "url(#guardrailSynapseGrad)" : "url(#activeSynapseGrad)";
                strokeOpacity = 1;
                strokeWidth = 2.5;
                strokeDasharray = "4 3";
              } else if (isActive) {
                stroke = isGuardrail ? "url(#guardrailSynapseGrad)" : "url(#activeSynapseGrad)";
                strokeOpacity = 0.85;
                strokeWidth = 1.75;
                strokeDasharray = "5 3";
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
                  className={isActive ? "animate-pulse transition-all duration-300" : "transition-all"}
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes-layer">
            {trace.layers.flatMap((layer) =>
              layer.nodes.map((node) => {
                const pos = nodePositions[node.id];
                if (!pos) return null;

                const isSelected = selectedNodeId === node.id;
                const isHovered = hoveredNodeId === node.id;
                const isFocal = isSelected || isHovered;
                const isLayerPulsing = animationStep === node.layer;
                const isGuard = node.id.includes("guardrail");

                const nodeRadius = node.layer === 4 ? 14 : node.layer === 0 ? 9 : 8;

                // Color configuration
                let fillColor = "var(--color-bg, #0d0f12)";
                let strokeColor = "currentColor";
                let strokeOpacity = 0.2;
                let strokeWidth = 1.5;

                if (node.active) {
                  strokeColor = isGuard ? "#f59e0b" : "#10b981";
                  strokeOpacity = 1;
                  strokeWidth = isFocal ? 2.5 : 2;
                }

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer group"
                    onClick={() => setSelectedNodeId(node.id === selectedNodeId ? null : node.id)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                  >
                    {/* Outer Glow Halo for Active Nodes */}
                    {node.active && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={nodeRadius + (isLayerPulsing || isFocal ? 7 : 4)}
                        fill={isGuard ? "#f59e0b" : "#10b981"}
                        opacity={isFocal ? 0.4 : isLayerPulsing ? 0.35 : 0.15}
                        filter="url(#nodeGlow)"
                        className={isLayerPulsing ? "animate-pulse" : ""}
                      />
                    )}

                    {/* Node Core Circle */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={nodeRadius}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeOpacity={strokeOpacity}
                      className="transition-all duration-200"
                    />

                    {/* Small inner dot if fired */}
                    {node.active && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={nodeRadius * 0.4}
                        fill={isGuard ? "#f59e0b" : "#10b981"}
                      />
                    )}

                    {/* Node Label Text */}
                    {node.layer === 0 ? (
                      // Left-aligned label for Layer 0
                      <text
                        x={pos.x - nodeRadius - 6}
                        y={pos.y + 3}
                        textAnchor="end"
                        className={`font-mono text-[9px] font-medium transition-colors ${
                          node.active ? "fill-ink-1 font-semibold" : "fill-ink-5"
                        }`}
                      >
                        {node.label}
                      </text>
                    ) : node.layer === 4 ? (
                      // Centered label for Layer 4 Output
                      <g>
                        <text
                          x={pos.x}
                          y={pos.y - nodeRadius - 8}
                          textAnchor="middle"
                          className="font-mono text-[9.5px] font-bold fill-ink-1 uppercase tracking-wider"
                        >
                          {node.label}
                        </text>
                        <text
                          x={pos.x}
                          y={pos.y + nodeRadius + 14}
                          textAnchor="middle"
                          className="font-mono text-[8px] fill-emerald-500 font-medium"
                        >
                          {trace.stats.confidence}% conf
                        </text>
                      </g>
                    ) : (
                      // Right-side label for Hidden Layers 1, 2, 3
                      <g>
                        <text
                          x={pos.x + nodeRadius + 6}
                          y={pos.y + 3}
                          textAnchor="start"
                          className={`font-sans text-[8.5px] transition-colors truncate ${
                            node.active ? "fill-ink-1 font-medium" : "fill-ink-5"
                          }`}
                        >
                          {node.label.length > 20 ? node.label.slice(0, 18) + "…" : node.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })
            )}
          </g>
        </svg>
      </div>

      {/* Bottom Inspector & Synthesis Drawer */}
      <div className="border-t border-edge bg-fg/[0.015] p-3 space-y-2">
        {activeInspectNode ? (
          /* Deep-Dive Inspection Panel for Clicked / Hovered Neuron */
          <div className="rounded-xl border border-edge bg-bg p-3 shadow-md space-y-2 animate-reveal">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border border-edge bg-fg/[0.04] text-ink-3">
                  Layer {activeInspectNode.layer} · {trace.layers[activeInspectNode.layer]?.name}
                </span>
                <span className="font-semibold text-xs text-ink-1">
                  {activeInspectNode.label}
                </span>
              </div>

              <div className="flex items-center gap-2">
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
                    className="text-[10px] font-mono text-ink-4 hover:text-ink-1 underline"
                  >
                    Deselect
                  </button>
                )}
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg border border-edge bg-fg/[0.02] space-y-1">
                <div className="font-mono text-[10px] text-ink-5 flex items-center justify-between">
                  <span>Mathematical Activation:</span>
                  <span className="text-ink-1 font-bold">
                    {(activeInspectNode.activation * 100).toFixed(0)}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 w-full rounded-full bg-fg/[0.06] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      activeInspectNode.active ? "bg-emerald-500" : "bg-ink-5"
                    }`}
                    style={{ width: `${Math.max(5, activeInspectNode.activation * 100)}%` }}
                  />
                </div>
                <div className="font-mono text-[9px] text-ink-4">
                  {activeInspectNode.metadata?.formula || "Standard activation threshold function"}
                </div>
              </div>

              <div className="p-2 rounded-lg border border-edge bg-fg/[0.02] space-y-1">
                <div className="font-mono text-[10px] text-ink-5">Criteria & Details:</div>
                <div className="text-[11px] text-ink-2 leading-snug line-clamp-2">
                  {activeInspectNode.metadata?.details ||
                    activeInspectNode.sublabel ||
                    "Evaluated against token frequencies and corpus embeddings."}
                </div>
                {activeInspectNode.metadata?.matchedKeywords &&
                  activeInspectNode.metadata.matchedKeywords.length > 0 && (
                    <div className="font-mono text-[9px] text-emerald-500 flex items-center gap-1">
                      <span>Matched tokens:</span>
                      <span>{activeInspectNode.metadata.matchedKeywords.join(", ")}</span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        ) : (
          /* General Pipeline Summary State */
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 text-ink-3 font-mono text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Active Synapse / Fired Neuron</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-fg/20" />
                <span>Inhibited Pathway</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HelpCircle className="h-3 w-3 text-ink-4" />
                <span>Hover or click any neuron to inspect weights</span>
              </div>
            </div>

            {onSendToChat && (
              <button
                type="button"
                onClick={() => onSendToChat(activeQuery)}
                className="text-xs font-mono text-ink-3 hover:text-ink-1 flex items-center gap-1 cursor-pointer"
              >
                <span>Ask in Chat</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
