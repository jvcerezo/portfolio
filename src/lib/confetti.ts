// Lightweight canvas-based confetti burst without any external dependencies
export function fireConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "99999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = ["#fafafa", "#e4e4e7", "#a1a1aa", "#71717a", "#ffffff"];
  const pieces: {
    x: number;
    y: number;
    w: number;
    h: number;
    vx: number;
    vy: number;
    rotation: number;
    vRot: number;
    color: string;
    opacity: number;
  }[] = [];

  for (let i = 0; i < 90; i++) {
    pieces.push({
      x: width * 0.5 + (Math.random() - 0.5) * 200,
      y: height * 0.4 + (Math.random() - 0.5) * 100,
      w: Math.random() * 8 + 4,
      h: Math.random() * 6 + 3,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -12 - 4,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 15,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
    });
  }

  let frame = 0;
  const maxFrames = 130;

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.98; // drag
      p.rotation += p.vRot;
      p.opacity = Math.max(0, 1 - frame / maxFrames);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    frame++;
    if (frame < maxFrames) {
      requestAnimationFrame(render);
    } else {
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    }
  }

  render();
}
