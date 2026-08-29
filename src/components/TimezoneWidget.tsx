import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function TimezoneWidget() {
  const [time, setTime] = useState('');
  const [usNote, setUsNote] = useState('');

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
      if (utcHour >= 13 && utcHour <= 22) {
        setUsNote('US Business Hours Active');
      } else {
        setUsNote('Open to US Night Shift');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-edge bg-fg/[0.03] px-3 py-1 font-mono text-[11px] text-ink-3">
      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
      <span className="flex items-center gap-1">
        <Clock className="h-3 w-3 text-ink-4" aria-hidden="true" />
        <span>{time ? `${time} PHT` : 'UTC+8'}</span>
      </span>
      <span className="text-ink-5">·</span>
      <span className="text-ink-4">{usNote}</span>
    </div>
  );
}
