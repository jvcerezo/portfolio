import { useEffect, useRef } from "react";

interface ParticleCanvasProps {
  theme: "light" | "dark";
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

// Motion is tuned per 60 fps frame and scaled by real elapsed time, so the
// network moves at the same speed on 60 Hz and 144 Hz screens.
const FRAME_MS = 1000 / 60;
const CONNECTION_DIST = 155;
const MOUSE_DIST = 185;
// Particles near the cursor drift gently away from it.
const MOUSE_PUSH = 0.6;
// Text-aware dimming: the network fades behind copy so it frames the text
// instead of running through it. Coarse grid of cells covered by text.
const CELL = 16;
const TEXT_SELECTOR = "h1, h2, h3, p, li, dd, dt, blockquote, [data-particle-avoid]";
const TEXT_PAD = 6;
const TEXT_DIM = 0.15;

export function ParticleCanvas({ theme }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrameId = 0;
    let width = 0;
    let height = 0;

    let cols = 0;
    let rows = 0;
    let textGrid = new Uint8Array(0);
    let gridDirty = true;

    // Marks grid cells covered by visible text blocks (viewport coordinates).
    const rebuildTextGrid = () => {
      gridDirty = false;
      cols = Math.ceil(width / CELL);
      rows = Math.ceil(height / CELL);
      textGrid = new Uint8Array(cols * rows);
      for (const el of document.querySelectorAll<HTMLElement>(TEXT_SELECTOR)) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > height || r.width === 0 || r.height === 0) continue;
        const c0 = Math.max(0, Math.floor((r.left - TEXT_PAD) / CELL));
        const c1 = Math.min(cols - 1, Math.floor((r.right + TEXT_PAD) / CELL));
        const r0 = Math.max(0, Math.floor((r.top - TEXT_PAD) / CELL));
        const r1 = Math.min(rows - 1, Math.floor((r.bottom + TEXT_PAD) / CELL));
        for (let y = r0; y <= r1; y++) textGrid.fill(1, y * cols + c0, y * cols + c1 + 1);
      }
    };

    const textFactor = (x: number, y: number) => {
      const c = Math.floor(x / CELL);
      const r = Math.floor(y / CELL);
      if (c < 0 || r < 0 || c >= cols || r >= rows) return 1;
      return textGrid[r * cols + c] ? TEXT_DIM : 1;
    };
    const markDirty = () => {
      gridDirty = true;
    };

    // Render at device resolution (capped) so dots and lines stay crisp.
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    // Create prominent constellation: ~90-120 dots on desktop
    const particleCount = Math.min(Math.max(Math.floor((width * height) / 11000), 50), 125);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        // Bigger dots: 2.5px to 5px
        size: Math.random() * 2.5 + 2.5,
        alpha: Math.random() * 0.35 + 0.45,
      });
    }

    const isDark = theme === "dark";
    const dotColor = isDark ? "250, 250, 250" : "24, 24, 27";

    const draw = (step: number) => {
      if (gridDirty) rebuildTextGrid();
      ctx.clearRect(0, 0, width, height);
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Gentle push away from the cursor, then the particle's own drift.
        const dxMouse = mouse.x - p.x;
        const dyMouse = mouse.y - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (step > 0 && distMouse < MOUSE_DIST && distMouse > 0.001) {
          const push = (1 - distMouse / MOUSE_DIST) * MOUSE_PUSH * step;
          p.x -= (dxMouse / distMouse) * push;
          p.y -= (dyMouse / distMouse) * push;
        }

        p.x += p.vx * step;
        p.y += p.vy * step;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const pDim = textFactor(p.x, p.y);

        // Draw prominent particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor}, ${p.alpha * (isDark ? 0.75 : 0.55) * pDim})`;
        ctx.fill();

        // Connect to mouse if near (prominent cursor tether)
        if (distMouse < MOUSE_DIST) {
          const mouseAlpha =
            (1 - distMouse / MOUSE_DIST) * (isDark ? 0.45 : 0.32) * Math.min(pDim, textFactor(mouse.x, mouse.y));
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${dotColor}, ${mouseAlpha})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }

        // Connect to neighboring particles with prominent lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const lineDim = Math.min(pDim, textFactor(p2.x, p2.y), textFactor((p.x + p2.x) / 2, (p.y + p2.y) / 2));
            const lineAlpha = (1 - dist / CONNECTION_DIST) * (isDark ? 0.22 : 0.16) * lineDim;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${dotColor}, ${lineAlpha})`;
            ctx.lineWidth = 1.1;
            ctx.stroke();
          }
        }
      }
    };

    let last = performance.now();
    const render = (now: number) => {
      animationFrameId = requestAnimationFrame(render);
      const elapsed = now - last;
      // Cap at ~60 fps: high-refresh screens don't need to redraw more often.
      if (elapsed < FRAME_MS - 1) return;
      last = now;
      // Clamp so a long pause (background tab) doesn't teleport particles.
      draw(Math.min(elapsed / FRAME_MS, 3));
    };

    const handleResize = () => {
      resize();
      gridDirty = true;
      if (reduceMotion) draw(0);
    };
    window.addEventListener("resize", handleResize);
    const handleScroll = () => {
      gridDirty = true;
      if (reduceMotion) draw(0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Content can change without scrolling (tabs, filters, expanding cards).
    const gridTimer = window.setInterval(markDirty, 1000);

    if (reduceMotion) {
      // Static constellation: same look, no motion.
      draw(0);
    } else {
      window.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseleave", handleMouseLeave);
      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.clearInterval(gridTimer);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-90 transition-opacity duration-700"
    />
  );
}
