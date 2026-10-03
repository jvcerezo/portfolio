import { useState, useRef, useEffect, type ReactNode } from "react";
import { soundFx } from "../lib/sound";
import { askTajAI, type KnowledgeChunk } from "../lib/tajRAG";
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
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "taj";
  text: string;
  sources?: KnowledgeChunk[];
  confidence?: number;
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
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        if (trimmed.startsWith("• ")) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-0.5 leading-relaxed">
              <span className={`text-sm leading-none select-none mt-0.5 ${isTaj ? "text-ink-3" : "text-bg/80"}`}>
                •
              </span>
              <span className="flex-1 font-sans text-xs">
                {parseInlineMarkdown(trimmed.slice(2), isTaj)}
              </span>
            </div>
          );
        }

        return (
          <p key={idx} className="leading-relaxed">
            {parseInlineMarkdown(line, isTaj)}
          </p>
        );
      })}
    </div>
  );
}

export function TajAIModal({ isOpen, onClose }: TajAIModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "taj",
      text: "Hello! I am **Taj AI**, Jet Timothy Cerezo's retrieval-augmented assistant. I have direct context over his resume, production metrics, microservices architecture, and shipped apps.\n\nAsk me anything or pick a question below!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [expandedSources, setExpandedSources] = useState<{ [id: string]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      soundFx.playChime();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isThinking) return;

    soundFx.playClick();
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
      soundFx.playPop();

      const botMsgId = (Date.now() + 1).toString();
      const botMessage: Message = {
        id: botMsgId,
        sender: "taj",
        text: response.answer,
        sources: response.retrievedSources,
        confidence: response.confidence,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsThinking(false);
    }, 450);
  };

  const handleClearChat = () => {
    soundFx.playPop();
    setMessages([
      {
        id: "welcome",
        sender: "taj",
        text: "Chat cleared! How can I help you learn about Jet's software engineering background?",
      },
    ]);
  };

  const toggleSource = (msgId: string) => {
    soundFx.playClick();
    setExpandedSources((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 bg-black/50 backdrop-blur-xs animate-reveal"
      onClick={onClose}
    >
      <div
        className="flex flex-col h-[85vh] sm:h-[620px] w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-edge bg-bg shadow-2xl ring-1 ring-ink-1/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-edge px-4 py-3 bg-fg/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-edge bg-fg/[0.05] text-ink-1">
              <Bot className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-bg" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-xs text-ink-1">
                <span>Taj AI</span>
                <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded border border-edge bg-fg/[0.04] text-ink-4">
                  RAG v1.0
                </span>
              </div>
              <div className="font-mono text-[10px] text-ink-4">
                Indexed to Jet's Résumé &amp; Architecture
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleClearChat}
              className="p-1.5 rounded-lg text-ink-4 hover:text-ink-1 hover:bg-fg/[0.05] transition-colors"
              title="Clear chat"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-ink-4 hover:text-ink-1 hover:bg-fg/[0.05] transition-colors"
              title="Close (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed">
          {messages.map((msg) => {
            const isTaj = msg.sender === "taj";
            const isSourcesExpanded = Boolean(expandedSources[msg.id]);

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isTaj ? "items-start" : "items-start flex-row-reverse"}`}
              >
                <div
                  className={`shrink-0 rounded-lg p-1.5 border text-xs ${
                    isTaj
                      ? "border-edge bg-fg/[0.04] text-ink-1"
                      : "border-edge bg-fg text-bg"
                  }`}
                >
                  {isTaj ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 space-y-2 ${
                    isTaj
                      ? "border border-edge bg-fg/[0.015] text-ink-2"
                      : "bg-fg text-bg font-medium"
                  }`}
                >
                  {/* Rich Formatted Markdown Message */}
                  <FormattedMessage text={msg.text} isTaj={isTaj} />

                  {/* RAG Context Retrieval Attribution Drawer */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pt-2 border-t border-edge text-[10px] font-mono">
                      <button
                        type="button"
                        onClick={() => toggleSource(msg.id)}
                        className="flex items-center gap-1.5 text-ink-4 hover:text-ink-1 transition-colors"
                      >
                        <Layers className="h-3 w-3" />
                        <span>
                          Retrieved {msg.sources.length} Context Chunks ({msg.confidence}% confidence)
                        </span>
                        {isSourcesExpanded ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </button>

                      {isSourcesExpanded && (
                        <div className="mt-2 space-y-1.5 animate-reveal rounded-lg border border-edge bg-bg/90 p-2">
                          {msg.sources.map((src) => (
                            <div key={src.id} className="border-b border-edge/60 pb-1.5 last:border-none last:pb-0">
                              <div className="flex items-center justify-between text-ink-1 font-semibold">
                                <span>{src.sourceLabel}</span>
                                {src.sourceUrl && (
                                  <a
                                    href={src.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline flex items-center gap-0.5 text-ink-4"
                                  >
                                    <span>Link</span>
                                    <ExternalLink className="h-2.5 w-2.5" />
                                  </a>
                                )}
                              </div>
                              <p className="text-ink-4 line-clamp-2 mt-0.5 text-[9px] leading-tight">
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
            <div className="flex items-center gap-2 text-ink-4 font-mono text-xs pl-2">
              <Bot className="h-3.5 w-3.5 animate-spin" />
              <span>Taj AI is vectorizing query &amp; retrieving context...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length <= 3 && (
          <div className="px-4 py-2 border-t border-edge/60 bg-fg/[0.01]">
            <div className="text-[10px] font-mono text-ink-5 mb-1.5">Suggested Questions:</div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSend(s)}
                  className="rounded-full border border-edge px-2.5 py-1 text-[10px] font-mono text-ink-3 hover:text-ink-1 hover:border-ink-1 hover:bg-fg/[0.04] transition-all text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 border-t border-edge bg-bg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 rounded-xl border border-edge bg-fg/[0.02] px-3 py-2 focus-within:border-ink-1 transition-colors"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Taj AI anything about Jet's background..."
              className="flex-1 bg-transparent text-xs text-ink-1 placeholder:text-ink-5 focus:outline-none font-sans"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-fg text-bg disabled:opacity-30 transition-opacity"
              title="Send question"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
          <div className="mt-1.5 flex items-center justify-between text-[9px] font-mono text-ink-5 px-1">
            <span>Powered by Client-Side Semantic RAG</span>
            <span>Press Enter ↵</span>
          </div>
        </div>
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
        soundFx.playPop();
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
