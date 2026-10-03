import { useState, useEffect, useRef } from "react";
import { soundFx } from "../lib/sound";
import { fireConfetti } from "../lib/confetti";
import {
  Search,
  ArrowRight,
  Download,
  Copy,
  Mail,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Sparkles,
  Terminal,
  ExternalLink,
  Code,
  Layers,
  Briefcase,
  GraduationCap,
  X,
  Bot,
} from "lucide-react";

interface CommandItem {
  id: string;
  category: "Navigation" | "Quick Action" | "Filter Tech" | "Easter Egg";
  title: string;
  subtitle?: string;
  icon: typeof Search;
  shortcut?: string;
  run: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
  onToggleTheme: () => void;
  onToggleSound: () => void;
  onFilterTech: (tech: string) => void;
  onCopyEmail: () => void;
  onOpenTajAI?: () => void;
  theme: "light" | "dark";
  soundEnabled: boolean;
}

export function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onToggleTheme,
  onToggleSound,
  onFilterTech,
  onCopyEmail,
  onOpenTajAI,
  theme,
  soundEnabled,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      soundFx.playChime();
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const items: CommandItem[] = [
    // Navigation
    {
      id: "nav-about",
      category: "Navigation",
      title: "Jump to About",
      subtitle: "Overview & production impact",
      icon: Code,
      run: () => onNavigate("about"),
    },
    {
      id: "nav-experience",
      category: "Navigation",
      title: "Jump to Experience",
      subtitle: "Converge Studios, Billease, IRRI",
      icon: Briefcase,
      run: () => onNavigate("experience"),
    },
    {
      id: "nav-projects",
      category: "Navigation",
      title: "Jump to Projects",
      subtitle: "Sandalan, SNPseek, Codebreak 2.0",
      icon: Layers,
      run: () => onNavigate("projects"),
    },
    {
      id: "nav-skills",
      category: "Navigation",
      title: "Jump to Skills",
      subtitle: "Tech stack & tools matrix",
      icon: Terminal,
      run: () => onNavigate("skills"),
    },
    {
      id: "nav-honors",
      category: "Navigation",
      title: "Jump to Honors & Education",
      subtitle: "UPLB BS Computer Science & awards",
      icon: GraduationCap,
      run: () => onNavigate("honors"),
    },

    // Quick Actions
    {
      id: "action-taj-ai",
      category: "Quick Action",
      title: "Ask Taj AI (RAG Assistant)",
      subtitle: "Context-aware Q&A about Jet's background & code",
      icon: Bot,
      shortcut: "J",
      run: () => {
        if (onOpenTajAI) onOpenTajAI();
      },
    },
    {
      id: "action-resume",
      category: "Quick Action",
      title: "Download Résumé (PDF)",
      subtitle: "Direct PDF download",
      icon: Download,
      shortcut: "PDF",
      run: () => {
        const link = document.createElement("a");
        link.href = "/JetCerezo_Resume.pdf";
        link.download = "JetCerezo_Resume.pdf";
        link.click();
      },
    },
    {
      id: "action-email",
      category: "Quick Action",
      title: "Copy Email to Clipboard",
      subtitle: "jetjetcerezo@gmail.com",
      icon: Copy,
      shortcut: "C",
      run: onCopyEmail,
    },
    {
      id: "action-gmail",
      category: "Quick Action",
      title: "Compose Email in Gmail",
      subtitle: "Opens Gmail compose tab",
      icon: Mail,
      run: () => {
        window.open(
          "https://mail.google.com/mail/?view=cm&fs=1&to=jetjetcerezo@gmail.com&su=Hello%20Jet",
          "_blank"
        );
      },
    },
    {
      id: "action-theme",
      category: "Quick Action",
      title: `Switch Theme to ${theme === "dark" ? "Light" : "Dark"} Mode`,
      icon: theme === "dark" ? Sun : Moon,
      shortcut: "T",
      run: onToggleTheme,
    },
    {
      id: "action-sound",
      category: "Quick Action",
      title: `${soundEnabled ? "Mute" : "Enable"} Audio Feedback`,
      icon: soundEnabled ? VolumeX : Volume2,
      shortcut: "S",
      run: onToggleSound,
    },

    // Tech Filters
    {
      id: "filter-flutter",
      category: "Filter Tech",
      title: "Filter by Flutter & Dart",
      subtitle: "Sandalan Google Play, Riverpod, SQLite",
      icon: Sparkles,
      run: () => onFilterTech("Flutter"),
    },
    {
      id: "filter-microservices",
      category: "Filter Tech",
      title: "Filter by Microservices & Docker",
      subtitle: "SNPseek IRRI rewrite, Docker Compose",
      icon: Sparkles,
      run: () => onFilterTech("Microservices"),
    },
    {
      id: "filter-ci-cd",
      category: "Filter Tech",
      title: "Filter by CI/CD & Test Automation",
      subtitle: "Billease fintech Appium, Linux CI runners",
      icon: Sparkles,
      run: () => onFilterTech("CI/CD"),
    },
    {
      id: "filter-ai",
      category: "Filter Tech",
      title: "Filter by AI & RAG",
      subtitle: "Codebreak 2.0 hackathon champion, Claude API",
      icon: Sparkles,
      run: () => onFilterTech("AI"),
    },

    // Easter Eggs
    {
      id: "egg-confetti",
      category: "Easter Egg",
      title: "Burst Confetti Celebration",
      subtitle: "Trigger procedural celebration particles",
      icon: Sparkles,
      run: () => fireConfetti(),
    },
    {
      id: "egg-github",
      category: "Easter Egg",
      title: "Open GitHub Profile",
      subtitle: "github.com/jvcerezo",
      icon: ExternalLink,
      run: () => window.open("https://github.com/jvcerezo", "_blank"),
    },
  ];

  const filteredItems = items.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle?.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        soundFx.playPop();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        soundFx.playPop();
        setSelectedIndex((prev) =>
          prev === 0 ? filteredItems.length - 1 : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected) {
          soundFx.playClick();
          selected.run();
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/60 backdrop-blur-sm animate-reveal"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-edge bg-bg shadow-2xl ring-1 ring-ink-1/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-edge px-4 py-3.5">
          <Search className="h-5 w-5 text-ink-4" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search (e.g. projects, resume, confetti)..."
            className="flex-1 bg-transparent text-sm text-ink-1 placeholder:text-ink-5 focus:outline-none font-sans"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-ink-4 hover:text-ink-2 text-xs font-mono"
            >
              Clear
            </button>
          ) : (
            <kbd className="hidden sm:inline-block rounded border border-edge bg-fg/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-ink-4">
              ESC
            </kbd>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-ink-4 hover:text-ink-1 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center font-mono text-xs text-ink-4">
              No matching commands found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    soundFx.playClick();
                    item.run();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-fg/[0.08] text-ink-1"
                      : "text-ink-3 hover:bg-fg/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg border ${
                        isSelected
                          ? "border-edge-strong bg-bg text-ink-1"
                          : "border-edge bg-fg/[0.02] text-ink-4"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-ink-1 truncate">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="font-mono text-[10px] text-ink-4 truncate">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-ink-5 hidden sm:inline">
                      {item.category}
                    </span>
                    {item.shortcut ? (
                      <kbd className="rounded border border-edge bg-fg/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-ink-4">
                        {item.shortcut}
                      </kbd>
                    ) : (
                      isSelected && <ArrowRight className="h-3.5 w-3.5 text-ink-2" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="flex items-center justify-between border-t border-edge bg-fg/[0.02] px-4 py-2 text-[10px] font-mono text-ink-5">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-ink-4">⌘K Quick Palette</span>
        </div>
      </div>
    </div>
  );
}
