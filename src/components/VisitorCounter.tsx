import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

const COUNTER_KEY = 'jvcerezo-portfolio';
const API_BASE = 'https://countapi.mileshilliard.com/api/v1';
const SESSION_KEY = 'portfolio_visited_session';

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function trackVisit() {
      try {
        const hasCountedInSession = sessionStorage.getItem(SESSION_KEY);
        const isDev = import.meta.env.DEV;

        // In dev or if already visited in this browser session, just read current count
        const endpoint = (isDev || hasCountedInSession)
          ? `${API_BASE}/get/${COUNTER_KEY}`
          : `${API_BASE}/hit/${COUNTER_KEY}`;

        const res = await fetch(endpoint);
        if (!res.ok) return;

        const data = await res.json();
        if (typeof data.value === 'number' && isMounted) {
          setCount(data.value);
          if (!isDev && !hasCountedInSession) {
            sessionStorage.setItem(SESSION_KEY, 'true');
          }
        }
      } catch {
        // Silently fallback without breaking UI if offline or blocked
      }
    }

    trackVisit();

    return () => {
      isMounted = false;
    };
  }, []);

  if (count === null) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full border border-edge bg-fg/[0.03] px-2.5 py-1 font-mono text-[11px] text-ink-4 opacity-75">
        <Eye className="h-3 w-3 text-ink-4" aria-hidden="true" />
        <span>...</span>
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full border border-edge bg-fg/[0.03] px-2.5 py-1 font-mono text-[11px] text-ink-3 transition-colors hover:border-edge-strong"
      title={`${count.toLocaleString()} total portfolio visits`}
    >
      <Eye className="h-3 w-3 text-ink-4" aria-hidden="true" />
      <span>{count.toLocaleString()} visits</span>
    </div>
  );
}
