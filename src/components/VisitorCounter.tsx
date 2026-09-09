import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

const NAMESPACE = 'jettimothycerezo.dev';
const COUNTER_KEY = 'visits';
const API_BASE = 'https://abacus.jasoncameron.dev';
const SESSION_KEY = 'portfolio_visited_session';
const CACHE_KEY = 'portfolio_cached_visits';

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? parseInt(cached, 10) || null : null;
    } catch {
      return null;
    }
  });
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function trackVisit() {
      try {
        const hasCountedInSession = sessionStorage.getItem(SESSION_KEY);
        const isDev = import.meta.env.DEV;

        // In dev or if already visited in this browser session, just read current count
        const endpoint = isDev || hasCountedInSession
          ? `${API_BASE}/get/${NAMESPACE}/${COUNTER_KEY}`
          : `${API_BASE}/hit/${NAMESPACE}/${COUNTER_KEY}`;

        const res = await fetch(endpoint);
        if (!res.ok) {
          throw new Error(`Counter request failed with status: ${res.status}`);
        }

        const data = await res.json();
        if (typeof data.value === 'number' && isMounted) {
          setCount(data.value);
          try {
            localStorage.setItem(CACHE_KEY, String(data.value));
            if (!isDev && !hasCountedInSession) {
              sessionStorage.setItem(SESSION_KEY, 'true');
            }
          } catch {
            // Ignore storage quota or disabled storage errors
          }
        }
      } catch {
        if (isMounted) {
          setHasError(true);
        }
      }
    }

    trackVisit();

    return () => {
      isMounted = false;
    };
  }, []);

  // If there's an error and no cached count, gracefully hide the counter rather than showing '...'
  if (count === null) {
    if (hasError) return null;

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
