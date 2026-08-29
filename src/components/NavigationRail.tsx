import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown, Compass, X } from "lucide-react";

export interface NavSection {
  id: string;
  num: string;
  label: string;
}

const SECTIONS: NavSection[] = [
  { id: "about", num: "01", label: "About" },
  { id: "experience", num: "02", label: "Experience" },
  { id: "architecture", num: "03", label: "Architecture" },
  { id: "work", num: "04", label: "Projects" },
  { id: "honors", num: "05", label: "Honors" },
  { id: "skills", num: "06", label: "Stack" },
  { id: "contact", num: "07", label: "Contact" },
];

export function NavigationRail() {
  const [activeId, setActiveId] = useState<string>("about");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // ScrollSpy & Progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const totalScroll = doc.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0;
      setScrollProgress(progress);

      // Determine active section
      const sectionElements = SECTIONS.map((s) => ({
        id: s.id,
        el: document.getElementById(s.id),
      })).filter((s) => s.el !== null);

      const scrollPosition = window.scrollY + window.innerHeight * 0.35;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const item = sectionElements[i];
        if (item.el && item.el.offsetTop <= scrollPosition) {
          setActiveId(item.id);
          return;
        }
      }
      if (sectionElements.length > 0) {
        setActiveId(sectionElements[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Keyboard navigation shortcuts (1-7, j/k)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= SECTIONS.length) {
        e.preventDefault();
        scrollToSection(SECTIONS[num - 1].id);
      } else if (e.key === "j" || e.key === "J") {
        const currentIndex = SECTIONS.findIndex((s) => s.id === activeId);
        if (currentIndex < SECTIONS.length - 1) {
          e.preventDefault();
          scrollToSection(SECTIONS[currentIndex + 1].id);
        }
      } else if (e.key === "k" || e.key === "K") {
        const currentIndex = SECTIONS.findIndex((s) => s.id === activeId);
        if (currentIndex > 0) {
          e.preventDefault();
          scrollToSection(SECTIONS[currentIndex - 1].id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeId]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveId(id);
      setIsMobileMenuOpen(false);
    }
  };

  const currentSection = SECTIONS.find((s) => s.id === activeId) || SECTIONS[0];
  const currentIndex = SECTIONS.findIndex((s) => s.id === activeId);

  return (
    <>
      {/* DESKTOP / TABLET: Right-Margin Architectural Index Rail */}
      <nav
        aria-label="Page Index Navigation"
        className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end xl:flex"
      >
        <div className="relative flex flex-col items-end gap-3 rounded-full border border-edge bg-bg/85 py-4 pl-3 pr-2.5 shadow-lg backdrop-blur-md">
          {/* Vertical scroll progress bar indicator */}
          <div className="absolute right-[11px] top-4 bottom-4 w-[2px] rounded-full bg-fg/[0.08]" />
          <div
            className="absolute right-[11px] top-4 w-[2px] rounded-full bg-brand transition-all duration-150"
            style={{ height: `${scrollProgress * 0.88}%` }}
          />

          {SECTIONS.map((sec) => {
            const isActive = activeId === sec.id;
            const isHovered = hoveredId === sec.id;

            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                onMouseEnter={() => setHoveredId(sec.id)}
                onMouseLeave={() => setHoveredId(null)}
                aria-label={`Jump to ${sec.label}`}
                className="group relative flex items-center justify-end py-1"
              >
                {/* Floating tooltip label on hover or when active */}
                <span
                  className={`pointer-events-none absolute right-7 flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 font-mono text-[10.5px] transition-all duration-200 ${
                    isHovered
                      ? "translate-x-0 opacity-100 border-edge-strong bg-fg text-bg shadow-md"
                      : isActive
                      ? "translate-x-0 opacity-100 border-edge bg-fg/[0.04] text-ink-1 font-medium"
                      : "translate-x-2 opacity-0"
                  }`}
                >
                  <span className={isActive ? "text-brand font-semibold" : "text-ink-4"}>
                    {sec.num}
                  </span>
                  <span>{sec.label}</span>
                </span>

                {/* Index marker dot / tick */}
                <div className="relative flex h-4 w-4 items-center justify-center">
                  <span
                    className={`rounded-full transition-all duration-300 ${
                      isActive
                        ? "h-2.5 w-2.5 bg-brand ring-4 ring-brand/20 shadow-sm"
                        : "h-1.5 w-1.5 bg-ink-4/40 group-hover:h-2 group-hover:w-2 group-hover:bg-ink-2"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Keyboard shortcut hint */}
        <div className="mt-2 pr-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-5">
          [1-7] or [J/K]
        </div>
      </nav>

      {/* MOBILE / COMPACT: Floating Bottom Navigation Pill & Drawer */}
      <div className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5 xl:hidden">
        <div className="flex items-center rounded-full border border-edge bg-bg/90 p-1 shadow-xl backdrop-blur-md">
          {/* Quick Prev Button */}
          <button
            onClick={() => {
              if (currentIndex > 0) scrollToSection(SECTIONS[currentIndex - 1].id);
            }}
            disabled={currentIndex === 0}
            aria-label="Previous section"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-fg/5 hover:text-ink-1 disabled:opacity-30"
          >
            <ChevronUp className="h-4 w-4" />
          </button>

          {/* Current Section Pill & Drawer Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center gap-1.5 rounded-full bg-fg/[0.04] px-3.5 py-1.5 font-mono text-[11px] text-ink-1 transition-colors hover:bg-fg/[0.08]"
          >
            <span className="text-brand font-semibold">{currentSection.num}</span>
            <span className="text-ink-4">//</span>
            <span className="font-medium">{currentSection.label}</span>
            <Compass className="ml-0.5 h-3 w-3 text-ink-4" />
          </button>

          {/* Quick Next Button */}
          <button
            onClick={() => {
              if (currentIndex < SECTIONS.length - 1) {
                scrollToSection(SECTIONS[currentIndex + 1].id);
              }
            }}
            disabled={currentIndex === SECTIONS.length - 1}
            aria-label="Next section"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-fg/5 hover:text-ink-1 disabled:opacity-30"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Index Quick-Jump Modal/Sheet */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Section Quick Jump"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm xl:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-edge bg-bg p-4 shadow-2xl animate-reveal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-edge pb-3">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-4">
                <Compass className="h-3.5 w-3.5 text-brand" />
                <span>Jump to Section</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-ink-4 hover:bg-fg/5 hover:text-ink-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-1.5">
              {SECTIONS.map((sec) => {
                const isActive = activeId === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`flex items-center justify-between rounded-lg px-3.5 py-2.5 font-mono text-[12px] transition-all ${
                      isActive
                        ? "bg-fg text-bg font-semibold shadow-sm"
                        : "text-ink-2 hover:bg-fg/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? "text-brand" : "text-ink-4"}>
                        {sec.num}
                      </span>
                      <span>{sec.label}</span>
                    </div>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
