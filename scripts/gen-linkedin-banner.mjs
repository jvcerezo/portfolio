import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '..', 'public', 'linkedin-banner.png');

// LinkedIn banner = 1584 × 396 (4:1).
// Render at 2× = 3168 × 792 for HD.
//
// LinkedIn UI overlays on the banner:
//  - Profile photo circle: bottom-left, roughly x=320–820, y=520–792 (unsafe zone)
//  - Edit pencil icon:     top-right,   roughly x=2950–3100, y=50–160   (unsafe zone)
// Keep critical content inside the safe envelope:
//  - Left content above y≈440
//  - Right-corner text away from the top-right pencil

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="3168" height="792" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3168 792">
  <defs>
    <pattern id="grid" width="128" height="128" patternUnits="userSpaceOnUse">
      <path d="M 128 0 L 0 0 0 128" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1.5"/>
    </pattern>
    <radialGradient id="spot" cx="22%" cy="38%" r="55%">
      <stop offset="0%" stop-color="#bef264" stop-opacity="0.16"/>
      <stop offset="55%" stop-color="#bef264" stop-opacity="0.03"/>
      <stop offset="100%" stop-color="#bef264" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rightFade" x1="60%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0a0a0a" stop-opacity="0"/>
      <stop offset="100%" stop-color="#0a0a0a" stop-opacity="0.35"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="3168" height="792" fill="#0a0a0a"/>
  <rect width="3168" height="792" fill="url(#grid)"/>
  <rect width="3168" height="792" fill="url(#spot)"/>
  <rect width="3168" height="792" fill="url(#rightFade)"/>

  <!-- Top-left status pill -->
  <g transform="translate(160, 90)">
    <rect width="740" height="58" rx="29" fill="#ffffff" fill-opacity="0.03" stroke="#ffffff" stroke-opacity="0.22" stroke-width="2"/>
    <circle cx="34" cy="29" r="6" fill="#bef264"/>
    <text x="56" y="38" fill="#ffffff" fill-opacity="0.8" font-size="21" font-family="ui-monospace,'SF Mono','Menlo','Consolas','Courier New',monospace" letter-spacing="4.5">AVAILABLE FOR WORK  ·  LAGUNA, PH</text>
  </g>

  <!-- Main title (fits entirely above profile-photo safe zone) -->
  <g font-family="'Arial Black','Helvetica Neue Bold',Arial,sans-serif" font-weight="900" fill="#ffffff" letter-spacing="-7">
    <text x="160" y="330" font-size="180">I ship software<tspan fill="#bef264">.</tspan></text>
  </g>

  <!-- Subtitle (kept above the profile photo overlap) -->
  <text x="160" y="410" font-size="44" font-family="'Helvetica Neue',Arial,sans-serif" font-weight="500" fill="#ffffff" fill-opacity="0.66" letter-spacing="-0.5">Full-stack  ·  Flutter  ·  React  ·  Philippines</text>

  <!-- Right widget: brand mark + currently + shipping -->
  <g transform="translate(2500, 140)">
    <rect width="510" height="520" rx="22" fill="#ffffff" fill-opacity="0.025" stroke="#ffffff" stroke-opacity="0.18" stroke-width="2"/>

    <!-- Terminal mark -->
    <g transform="translate(40, 40)">
      <rect width="160" height="160" rx="26" fill="#ffffff" fill-opacity="0.04" stroke="#ffffff" stroke-opacity="0.3" stroke-width="2"/>
      <text x="80" y="115" fill="#bef264" font-size="80" text-anchor="middle" font-family="ui-monospace,'SF Mono','Menlo','Consolas','Courier New',monospace" font-weight="700">&gt;_</text>
    </g>

    <!-- Currently -->
    <g font-family="ui-monospace,'SF Mono','Menlo','Consolas','Courier New',monospace">
      <text x="40" y="260" font-size="18" fill="#ffffff" fill-opacity="0.45" letter-spacing="4">// CURRENTLY</text>
      <text x="40" y="300" font-size="28" font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" fill="#ffffff">Jr. Test Automation Engineer</text>
      <text x="40" y="334" font-size="20" fill="#ffffff" fill-opacity="0.6" letter-spacing="2">BILLEASE  ·  APR 2025 — PRESENT</text>

      <text x="40" y="400" font-size="18" fill="#ffffff" fill-opacity="0.45" letter-spacing="4">// SHIPPING</text>
      <text x="40" y="440" font-size="28" font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" fill="#ffffff">Sandalan<tspan fill="#bef264">.</tspan></text>
      <text x="40" y="474" font-size="20" fill="#ffffff" fill-opacity="0.6" letter-spacing="2">LIVE ON GOOGLE PLAY</text>
    </g>
  </g>

  <!-- Bottom-center credentials (clears the profile photo horizontally) -->
  <g transform="translate(1360, 720)" font-family="ui-monospace,'SF Mono','Menlo','Consolas','Courier New',monospace">
    <text font-size="20" fill="#ffffff" fill-opacity="0.35" letter-spacing="4">[ UPLB CS 2025  ·  IRRI  ·  CODEBREAK 2.0 CHAMPION ]</text>
  </g>

  <!-- Bottom-right domain (moved from top-right to avoid LinkedIn's edit pencil) -->
  <g transform="translate(3000, 760)" text-anchor="end" font-family="ui-monospace,'SF Mono','Menlo','Consolas','Courier New',monospace">
    <text font-size="22" fill="#ffffff" fill-opacity="0.48" letter-spacing="4">JETTIMOTHYCEREZO.DEV</text>
  </g>
</svg>`;

try {
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log('LinkedIn banner written to:', outPath);
} catch (err) {
  console.error('Failed to generate LinkedIn banner:', err);
  process.exit(1);
}
