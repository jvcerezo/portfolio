import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Printer,
  Sun,
  Moon,
  FileText,
  Check,
  Share2,
  Sparkles,
} from "lucide-react";
import { fireConfetti } from "../lib/confetti";

interface ResumePageProps {
  onBack: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  pdfUrl?: string;
}

export function ResumePage({
  onBack,
  theme,
  toggleTheme,
  pdfUrl = "/JetCerezo_Resume.pdf",
}: ResumePageProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleDownload = useCallback(() => {
    fireConfetti();
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "JetCerezo_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [pdfUrl]);

  const handlePrint = useCallback(() => {
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.focus();
        iframeRef.current.contentWindow.print();
        return;
      } catch {
        // Fallback for cross-origin or sandboxed iframe
      }
    }
    window.open(pdfUrl, "_blank");
  }, [pdfUrl]);

  // Manage document title for the dedicated page
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Jet Timothy Cerezo — Résumé (PDF Viewer)";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  // Keyboard navigation on the resume page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      if (e.key === "Escape" || e.key.toLowerCase() === "b") {
        e.preventDefault();
        onBack();
      } else if (e.key.toLowerCase() === "t") {
        e.preventDefault();
        toggleTheme();
      } else if (e.key.toLowerCase() === "d") {
        e.preventDefault();
        handleDownload();
      } else if (e.key.toLowerCase() === "p") {
        e.preventDefault();
        handlePrint();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBack, toggleTheme, handleDownload, handlePrint]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Jet Timothy Cerezo — Résumé",
          text: "Check out Jet Timothy Cerezo's software engineering résumé.",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch {
      // Fallback
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen h-screen flex flex-col bg-bg text-ink-1 font-sans selection:bg-fg/10 selection:text-ink-1">
      {/* Top Navigation & Action Header */}
      <header className="h-14 sm:h-16 border-b border-edge bg-bg/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between z-30 shrink-0">
        {/* Left: Back button & Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-edge bg-fg/[0.03] hover:bg-fg/[0.08] hover:border-edge-strong text-xs font-mono font-medium text-ink-2 hover:text-ink-1 transition-all"
            title="Return to full portfolio (Press Esc)"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden xs:inline">Back to Portfolio</span>
            <span className="xs:hidden">Back</span>
            <kbd className="hidden md:inline-block ml-1 px-1.5 py-0.5 text-[10px] rounded bg-fg/[0.06] text-ink-4">
              Esc
            </kbd>
          </button>

          <div className="h-4 w-px bg-edge hidden sm:block" />

          {/* Identity & File Title */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1 rounded-md bg-fg/[0.05] border border-edge hidden sm:flex items-center justify-center">
              <FileText className="h-4 w-4 text-ink-2" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xs sm:text-sm font-semibold tracking-tight text-ink-1 truncate">
                  Jet Timothy Cerezo
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-edge bg-fg/[0.04] text-ink-4 hidden md:inline-block">
                  PDF Preview
                </span>
              </div>
              <p className="text-[10px] font-mono text-ink-4 truncate hidden sm:block">
                Software Engineer · Full-Stack &amp; Systems
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions (Download, Open Tab, Print, Theme) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Share / Copy link */}
          <button
            type="button"
            onClick={handleShare}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-edge hover:bg-fg/[0.06] text-xs font-medium text-ink-3 hover:text-ink-1 transition-all"
            title="Share or copy page link"
          >
            {copiedLink ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-mono text-[11px]">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span className="hidden lg:inline text-[11px]">Share</span>
              </>
            )}
          </button>

          {/* Open Raw in New Tab */}
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-edge hover:bg-fg/[0.06] text-xs font-medium text-ink-2 hover:text-ink-1 transition-all"
            title="Open raw PDF directly in a new browser tab"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Open in Tab</span>
          </a>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-edge hover:bg-fg/[0.06] text-xs font-medium text-ink-2 hover:text-ink-1 transition-all"
            title="Print Résumé (Press P)"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Print</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-lg border border-edge hover:bg-fg/[0.06] text-ink-3 hover:text-ink-1 transition-all"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode (Press T)`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Download Button (Primary) */}
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-ink-1 text-bg hover:opacity-90 font-medium text-xs shadow-sm transition-all active:scale-[0.98]"
            title="Download Résumé PDF (Press D)"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="font-semibold">Download PDF</span>
            <Sparkles className="h-3 w-3 opacity-70 hidden sm:inline" />
          </button>
        </div>
      </header>

      {/* Mobile helper notice */}
      <div className="md:hidden px-3 py-1.5 bg-fg/[0.03] border-b border-edge text-[11px] text-ink-3 flex items-center justify-between font-mono">
        <span className="truncate">Viewing PDF preview</span>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-1 font-semibold underline underline-offset-2"
          >
            Open Full Tab
          </a>
        </div>
      </div>

      {/* Main PDF Viewer Frame */}
      <main className="flex-1 w-full bg-bg-2 p-2 sm:p-4 md:p-6 flex flex-col items-center justify-center overflow-hidden relative">
        <div className="w-full max-w-5xl h-full rounded-xl overflow-hidden border border-edge shadow-2xl bg-white dark:bg-zinc-900 flex flex-col relative transition-all">
          {/* Loading Skeleton */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-bg-2/80 backdrop-blur-xs gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-edge border-t-ink-1 animate-spin" />
              <p className="font-mono text-xs text-ink-3">Loading PDF preview...</p>
            </div>
          )}

          {/* PDF Viewer Element (object + fallback iframe) */}
          <object
            data={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
            type="application/pdf"
            className="w-full h-full border-none block"
            onLoad={() => setIsLoading(false)}
          >
            <iframe
              ref={iframeRef}
              src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
              title="Jet Timothy Cerezo — Résumé PDF"
              className="w-full h-full border-none block"
              onLoad={() => setIsLoading(false)}
            >
              {/* Fallback for browsers that don't support inline PDF */}
              <div className="p-8 text-center flex flex-col items-center justify-center h-full gap-4 text-ink-2">
                <FileText className="h-12 w-12 text-ink-4" />
                <div>
                  <h3 className="text-base font-semibold text-ink-1">PDF Preview Unavailable</h3>
                  <p className="text-xs text-ink-3 mt-1 max-w-md">
                    Your browser does not support embedded PDF viewing. You can download the file or open it directly in a new tab.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ink-1 text-bg text-xs font-semibold"
                  >
                    <Download className="h-4 w-4" />
                    Download Résumé
                  </button>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-edge text-xs font-semibold text-ink-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open in New Tab
                  </a>
                </div>
              </div>
            </iframe>
          </object>
        </div>

        {/* Subtle Bottom Bar with Shortcuts */}
        <footer className="w-full max-w-5xl pt-2 px-2 hidden sm:flex items-center justify-between text-[11px] font-mono text-ink-4">
          <div className="flex items-center gap-4">
            <span>
              File: <strong className="text-ink-2 font-normal">JetCerezo_Resume.pdf</strong>
            </span>
            <span>•</span>
            <span>Single Page Tech Résumé</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Hotkeys:</span>
            <span><kbd className="text-ink-2">[Esc]</kbd> Back</span>
            <span><kbd className="text-ink-2">[D]</kbd> Download</span>
            <span><kbd className="text-ink-2">[T]</kbd> Theme</span>
            <span><kbd className="text-ink-2">[P]</kbd> Print</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
