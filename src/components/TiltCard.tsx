import { useState, useRef, type ReactNode, type MouseEvent } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  isDimmed?: boolean;
  isHighlighted?: boolean;
}

export function TiltCard({
  children,
  className = "",
  isDimmed = false,
  isHighlighted = false,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setGlare({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100),
      opacity: 0.12,
    });
  };

  const handleMouseLeave = () => {
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-2xl transition-all duration-200 border border-transparent ${
        isDimmed ? "opacity-25 blur-[0.4px]" : "opacity-100"
      } ${
        isHighlighted
          ? "ring-1 ring-ink-1/30 bg-bg shadow-lg border-edge-strong"
          : "hover:bg-bg hover:shadow-xl hover:border-edge-strong hover:ring-1 hover:ring-ink-1/10"
      } ${className}`}
    >
      {/* Clean Specular Border Spotlight - card stays rock-solid flat with zero drag or tilt */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, ${glare.opacity}), transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
