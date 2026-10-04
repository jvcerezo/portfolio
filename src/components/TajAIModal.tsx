import { useState, useRef, useEffect, type ReactNode } from "react";
import {
  askTajAI,
  generateNeuralTrace,
  type KnowledgeChunk,
  type RAGNeuralTrace,
} from "../lib/tajRAG";
import { RAGNeuralVisualizer } from "./RAGNeuralVisualizer";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ExternalLink,
  Activity,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "taj";
  text: string;
  sources?: KnowledgeChunk[];
  confidence?: number;
  neuralTrace?: RAGNeuralTrace;
  relatedUserQuery?: string;
}

interface TajAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTIONS = [
  "What did Jet ship at Billease?",
  "How does Sandalan sync offline?",
  "Explain the 7 microservices rewrite",
  "Is Jet open to US hours & remote?",
  "What won 1st place in the hackathon?",
  "What is Jet's full tech stack?",
];

function parseInlineMarkdown(text: string, isTaj: boolean) {
  const parts: ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\)|\`.*?\`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className={`font-semibold ${isTaj ? "text-ink-1" : "text-bg"}`}>
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("[") && token.includes("](") && token.endsWith(")")) {
      const closeBracket = token.indexOf("](");
      const label = token.slice(1, closeBracket);
      const url = token.slice(closeBracket + 2, -1);
      parts.push(
        <a
          key={match.index}
          href={url}
          target={url.startsWith("http") ? "_blank" : undefined}
          rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
          className={`underline underline-offset-2 ${
            isTaj ? "text-ink-1 hover:text-ink-3 font-medium" : "text-bg hover:opacity-80"
          }`}
        >
          {label}
        </a>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={match.index}
          className={`font-mono text-[11px] px-1 py-0.5 rounded ${
            isTaj ? "bg-fg/[0.08] text-ink-1" : "bg-bg/20 text-bg"
          }`}
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function FormattedMessage({ text, isTaj }: { text: string; isTaj: boolean }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        if (trimmed.startsWith("• ")) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5 leading-relaxed">
              <span className={`text-sm leading-none select-none mt-0.5 ${isTaj ? "text-ink-3" : "text-bg/80"}`}>
                •
              </span>
              <span className="flex-1 font-sans text-xs sm:text-[13px] leading-relaxed">
                {parseInlineMarkdown(trimmed.slice(2), isTaj)}
              </span>
            </div>
          );
        }

        return (
          <p key={idx} className="leading-relaxed text-xs sm:text-[13px]">
            {parseInlineMarkdown(line, isTaj)}
          </p>
        );
      })}
    </div>
  );
}

export function TajAIModal({ isOpen, onClose }: TajAIModalProps) {
  const [viewMode, setViewMode] = useState<"chat" | "neural">("chat");
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTrace, setActiveTrace] = useState<RAGNeuralTrace | null>(() => {
    return generateNeuralTrace("What did Jet ship at Billease?");
  });
  const [activeTraceQuery, setActiveTraceQuery] = useState("What did Jet ship at Billease?");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "taj",
      text: "Hello! I am **Taj AI**, Jet Timothy Cerezo's retrieval-augmented assistant. I have direct context over his resume, production metrics, microservices architecture, and shipped apps.\n\nAsk me anything or pick a question below!",
      neuralTrace: generateNeuralTrace("Who is Jet Timothy Cerezo?"),
      relatedUserQuery: "Who is Jet Timothy Cerezo?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [expandedSources, setExpandedSources] = useState<{ [id: string]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && viewMode === "chat") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, viewMode]);

  useEffect(() => {
    if (viewMode === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isThinking, viewMode]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isThinking) return;

    const userMsgId = Date.now().toString();
    const userMessage: Message = {
      id: userMsgId,
      sender: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    // Run RAG retrieval & synthesis
    setTimeout(() => {
      const response = askTajAI(query);
      const trace = response.neuralTrace || generateNeuralTrace(query, response);

      const botMsgId = (Date.now() + 1).toString();
      const botMessage: Message = {
        id: botMsgId,
        sender: "taj",
        text: response.answer,
        sources: response.retrievedSources,
        confidence: response.confidence,
        neuralTrace: trace,
        relatedUserQuery: query,
      };

      setActiveTrace(trace);
      setActiveTraceQuery(query);
      setMessages((prev) => [...prev, botMessage]);
      setIsThinking(false);
    }, 450);
  };

  const handleClearChat = () => {
    const defaultTrace = generateNeuralTrace("Who is Jet Timothy Cerezo?");
    setActiveTrace(defaultTrace);
    setActiveTraceQuery("Who is Jet Timothy Cerezo?");
    setMessages([
      {
        id: "welcome",
        sender: "taj",
        text: "Chat cleared! How can I help you learn about Jet's software engineering background?",
        neuralTrace: defaultTrace,
        relatedUserQuery: "Who is Jet Timothy Cerezo?",
      },
    ]);
  };

  const toggleSource = (msgId: string) => {
    setExpandedSources((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-reveal"
      onClick={onClose}
    >
      <div
        className={`flex flex-col w-full rounded-t-2xl sm:rounded-2xl border border-edge bg-bg shadow-2xl ring-1 ring-ink-1/10 overflow-hidden transition-all duration-300 ${
          isMaximized
            ? "h-full sm:h-[95vh] sm:max-w-[96vw]"
            : viewMode === "neural"
            ? "h-[90vh] sm:h-[780px] lg:h-[840px] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl"
            : "h-[88vh] sm:h-[720px] lg:h-[760px] sm:max-w-2xl md:max-w-3xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-edge px-4 py-3 bg-fg/[0.02] gap-2">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-edge bg-fg/[0.05] text-ink-1 shrink-0">
              <Bot className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-bg" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-xs text-ink-1">
                <span>Taj AI</span>
                <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded border border-edge bg-fg/[0.04] text-ink-4">
                  RAG Engine
                </span>
              </div>
              <div className="font-mono text-[10px] text-ink-4 hidden sm:block">
                Indexed to Jet's Résumé &amp; Architecture
              </div>
            </div>
          </div>

          {/* View Mode Toggle: Chat vs Neural Internals */}
          <div className="flex items-center rounded-lg border border-edge bg-fg/[0.03] p-0.5 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => setViewMode("chat")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === "chat"
                  ? "bg-bg text-ink-1 font-semibold shadow-xs"
                  : "text-ink-4 hover:text-ink-2"
              }`}
            >
              <Bot className="h-3 w-3" />
              <span>Chat</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!activeTrace) {
                  const lastTajMsg = [...messages].reverse().find((m) => m.neuralTrace);
                  if (lastTajMsg?.neuralTrace) {
                    setActiveTrace(lastTajMsg.neuralTrace);
                    setActiveTraceQuery(lastTajMsg.relatedUserQuery || lastTajMsg.neuralTrace.query);
                  } else {
                    const fallback = generateNeuralTrace("What did Jet ship at Billease?");
                    setActiveTrace(fallback);
                    setActiveTraceQuery("What did Jet ship at Billease?");
                  }
                }
                setViewMode("neural");
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === "neural"
                  ? "bg-bg text-ink-1 font-semibold shadow-xs"
                  : "text-ink-4 hover:text-ink-2"
              }`}
              title="View live neural network RAG graph"
            >
              <Activity className="h-3 w-3 text-emerald-500" />
              <span className="flex items-center gap-1">
                <span>Neural Graph</span>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
              </span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            {viewMode === "chat" && (
              <button
                type="button"
                onClick={handleClearChat}
                className="p-1.5 rounded-lg text-ink-4 hover:text-ink-1 hover:bg-fg/[0.05] transition-colors cursor-pointer"
                title="Clear chat"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsMaximized((prev) => !prev)}
              className="p-1.5 rounded-lg text-ink-4 hover:text-ink-1 hover:bg-fg/[0.05] transition-colors cursor-pointer hidden sm:flex items-center justify-center"
              title={isMaximized ? "Restore window size" : "Maximize window"}
            >
              {isMaximized ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-ink-4 hover:text-ink-1 hover:bg-fg/[0.05] transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Content: Neural Visualizer or Chat Stream */}
        {viewMode === "neural" ? (
          <div className="flex-1 overflow-hidden flex flex-col">
            <RAGNeuralVisualizer
              initialTrace={activeTrace || undefined}
              currentQuery={activeTraceQuery}
              onBackToChat={() => setViewMode("chat")}
              onSendToChat={(query) => {
                setViewMode("chat");
                handleSend(query);
              }}
            />
          </div>
        ) : (
          <>
            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 text-xs sm:text-[13px] leading-relaxed">
              {messages.map((msg) => {
                const isTaj = msg.sender === "taj";
                const isSourcesExpanded = Boolean(expandedSources[msg.id]);

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 sm:gap-3 ${isTaj ? "items-start" : "items-start flex-row-reverse"}`}
                  >
                    <div
                      className={`shrink-0 rounded-lg p-1.5 sm:p-2 border text-xs ${
                        isTaj
                          ? "border-edge bg-fg/[0.04] text-ink-1"
                          : "border-edge bg-fg text-bg"
                      }`}
                    >
                      {isTaj ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>

                    <div
                      className={`max-w-[88%] sm:max-w-[82%] rounded-xl px-4 py-3 space-y-2.5 ${
                        isTaj
                          ? "border border-edge bg-fg/[0.015] text-ink-2"
                          : "bg-fg text-bg font-medium"
                      }`}
                    >
                      {/* Rich Formatted Markdown Message */}
                      <FormattedMessage text={msg.text} isTaj={isTaj} />

                      {/* RAG Context Retrieval & Neural Trace Controls */}
                      {isTaj && msg.id !== "welcome" && (
                        <div className="pt-2.5 border-t border-edge flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                          {msg.sources && msg.sources.length > 0 ? (
                            <button
                              type="button"
                              onClick={() => toggleSource(msg.id)}
                              className="flex items-center gap-1.5 text-ink-4 hover:text-ink-1 transition-colors cursor-pointer"
                            >
                              <Layers className="h-3.5 w-3.5" />
                              <span>
                                {msg.sources.length} Chunks ({msg.confidence}% conf)
                              </span>
                              {isSourcesExpanded ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                              )}
                            </button>
                          ) : (
                            <span className="text-ink-5 italic">
                              {msg.confidence === 0 ? "Scope guardrail" : "Direct response"}
                            </span>
                          )}

                          {msg.neuralTrace && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTrace(msg.neuralTrace!);
                                setActiveTraceQuery(msg.relatedUserQuery || msg.neuralTrace!.query);
                                setViewMode("neural");
                              }}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-edge bg-fg/[0.03] hover:bg-fg/[0.08] hover:border-ink-1/30 text-ink-3 hover:text-ink-1 transition-all cursor-pointer font-medium"
                              title="Inspect live neural network internals for this query"
                            >
                              <Activity className="h-3.5 w-3.5 text-emerald-500" />
                              <span>Neural Trace</span>
                            </button>
                          )}

                          {isSourcesExpanded && msg.sources && msg.sources.length > 0 && (
                            <div className="w-full mt-2 space-y-2 animate-reveal rounded-lg border border-edge bg-bg/90 p-2.5">
                              {msg.sources.map((src) => (
                                <div key={src.id} className="border-b border-edge/60 pb-2 last:border-none last:pb-0">
                                  <div className="flex items-center justify-between text-ink-1 font-semibold text-xs">
                                    <span>{src.sourceLabel}</span>
                                    {src.sourceUrl && (
                                      <a
                                        href={src.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline flex items-center gap-1 text-ink-4"
                                      >
                                        <span>Link</span>
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    )}
                                  </div>
                                  <p className="text-ink-4 line-clamp-2 mt-1 text-[10px] leading-relaxed">
                                    {src.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isThinking && (
                <div className="flex items-center gap-2 text-ink-4 font-mono text-xs sm:text-[13px] pl-2">
                  <Bot className="h-4 w-4 animate-spin" />
                  <span>Taj AI is vectorizing query &amp; retrieving context...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Chips */}
            {messages.length <= 3 && (
              <div className="px-4 sm:px-6 py-2.5 border-t border-edge/60 bg-fg/[0.01]">
                <div className="text-[10px] sm:text-[11px] font-mono text-ink-5 mb-1.5">Suggested Questions:</div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 max-h-24 overflow-y-auto">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSend(s)}
                      className="rounded-full border border-edge px-3 py-1.5 text-[11px] font-mono text-ink-3 hover:text-ink-1 hover:border-ink-1 hover:bg-fg/[0.04] transition-all text-left cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3.5 sm:p-4 border-t border-edge bg-bg">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 rounded-xl border border-edge bg-fg/[0.02] px-3.5 py-2.5 focus-within:border-ink-1 transition-colors"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Taj AI anything about Jet's background..."
                  className="flex-1 bg-transparent text-xs sm:text-[13px] text-ink-1 placeholder:text-ink-5 focus:outline-none font-sans"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isThinking}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-fg text-bg disabled:opacity-30 transition-opacity cursor-pointer shrink-0"
                  title="Send question"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
              <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-ink-5 px-1">
                <span className="flex items-center gap-1.5">
                  <span>Client-Side Semantic RAG</span>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode("neural");
                    }}
                    className="hover:text-ink-1 hover:underline text-emerald-500 cursor-pointer"
                  >
                    View Neural Network Graph
                  </button>
                </span>
                <span>Press Enter ↵</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Floating Launcher Pill Component for bottom corner
export function TajAILauncher({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={() => {
        onClick();
      }}
      aria-label="Ask Taj AI about Jet's background"
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 rounded-full border border-edge bg-bg/95 px-4 py-2.5 shadow-2xl backdrop-blur-md ring-1 ring-ink-1/10 hover:border-ink-1 hover:scale-105 transition-all cursor-pointer"
    >
      <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-fg text-bg">
        <Sparkles className="h-3 w-3" />
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-bg animate-pulse" />
      </div>
      <div className="font-mono text-xs flex items-center gap-1.5">
        <span className="font-semibold text-ink-1">Taj AI</span>
        <span className="text-ink-4 hidden sm:inline">· Ask me anything</span>
      </div>
    </button>
  );
}
