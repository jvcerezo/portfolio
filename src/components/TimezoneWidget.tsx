import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function TimezoneWidget() {
  const [time, setTime] = useState('');
  const [usNote, setUsNote] = useState('');
  const [usLive, setUsLive] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Philippines Time (UTC+8)
      const phtOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Manila',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };
      const phtString = now.toLocaleTimeString('en-US', phtOptions);
      setTime(phtString);

      // Determine US overlap phase
      // UTC hour
      const utcHour = now.getUTCHours();
      // US Eastern is UTC-4 (EDT) or UTC-5 (EST)
      // Daytime US (9am-5pm EST) is 13:00 to 21:00 UTC (which is 9pm to 5am PHT)
      const live = utcHour >= 13 && utcHour <= 22;
      setUsLive(live);
      setUsNote(live ? 'US Business Hours Active' : 'Open to US Night Shift');
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div data-particle-avoid className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-edge bg-fg/[0.04] px-3.5 py-1 font-mono text-xs text-ink-3 transition-colors hover:border-edge-strong">
      {/* Live dot: pulses green while US business hours overlap. */}
      <span className="relative flex h-2 w-2">
        {usLive && <span className="absolute inline-flex h-full w-full rounded-full bg-signal opacity-60 motion-safe:animate-ping" />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${usLive ? 'bg-signal' : 'bg-ink-4'}`} />
      </span>
      <span className="flex items-center gap-1 font-medium text-ink-2">
        <Clock className="h-3.5 w-3.5 text-ink-4" aria-hidden="true" />
        <span>{time ? `${time} PHT` : 'UTC+8'}</span>
      </span>
      <span className="text-ink-5">·</span>
      <span className="text-ink-4">
        <span className="sm:hidden">{usLive ? 'US hours' : 'US night shift'}</span>
        <span className="hidden sm:inline">{usNote}</span>
      </span>
    </div>
  );
}
