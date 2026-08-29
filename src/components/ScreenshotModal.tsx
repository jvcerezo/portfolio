import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

export interface ScreenshotItem {
  src: string;
  title: string;
  description: string;
}

interface ScreenshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ScreenshotItem[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  playStoreUrl?: string;
}

export function ScreenshotModal({
  isOpen,
  onClose,
  items,
  currentIndex,
  onIndexChange,
  playStoreUrl,
}: ScreenshotModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndexChange((currentIndex + 1) % items.length);
      if (e.key === 'ArrowLeft') onIndexChange((currentIndex - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, currentIndex, items.length, onClose, onIndexChange]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || items.length === 0) return null;

  const current = items[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="screenshot-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-[900px] flex-col overflow-hidden rounded-xl border border-white/10 bg-bg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-edge px-5 py-3.5">
          <div className="flex items-center gap-3">
            <h3 id="screenshot-title" className="font-display text-[15px] font-semibold text-ink-1">
              {current.title}
            </h3>
            <span className="font-mono text-[11px] text-ink-4">
              {currentIndex + 1} / {items.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {playStoreUrl && (
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-1 rounded-md border border-edge-strong px-2.5 py-1 font-mono text-[11px] text-ink-2 transition-colors hover:text-brand sm:inline-flex"
              >
                <span>Google Play</span>
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            )}
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="flex h-8 w-8 items-center justify-center rounded-md text-ink-3 transition-colors hover:bg-fg/5 hover:text-ink-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Image & Main viewer */}
        <div className="relative flex flex-1 items-center justify-center overflow-auto bg-fg/[0.02] p-4 sm:p-8 min-h-[340px] max-h-[60vh]">
          <img
            src={current.src}
            alt={current.title}
            className="max-h-[50vh] w-auto max-w-full rounded-lg object-contain shadow-md"
          />

          {items.length > 1 && (
            <>
              <button
                onClick={() => onIndexChange((currentIndex - 1 + items.length) % items.length)}
                aria-label="Previous screenshot"
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-edge bg-bg/90 text-ink-2 shadow-md backdrop-blur-sm transition-colors hover:bg-bg hover:text-ink-1 sm:left-6"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => onIndexChange((currentIndex + 1) % items.length)}
                aria-label="Next screenshot"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-edge bg-bg/90 text-ink-2 shadow-md backdrop-blur-sm transition-colors hover:bg-bg hover:text-ink-1 sm:right-6"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Caption & Thumbnails */}
        <div className="border-t border-edge bg-bg px-5 py-4">
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            {current.description}
          </p>

          {items.length > 1 && (
            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
              {items.map((item, idx) => (
                <button
                  key={item.src}
                  onClick={() => onIndexChange(idx)}
                  className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-md border transition-all ${
                    idx === currentIndex
                      ? 'border-brand ring-2 ring-brand/30'
                      : 'border-edge opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={item.src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
