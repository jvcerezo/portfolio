import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '..', 'public', 'linkedin-banner.png');

// LinkedIn banner = 1584 × 396 (4:1).
// Render at 2x = 3168 × 792 for HD/retina-quality display.
// Safe zone note: LinkedIn overlays the profile photo at roughly bottom-left.
// At 2x, avoid x=0-680, y=620-792 for important content.

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="3168" height="792" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3168 792">
  <defs>
    <pattern id="grid" width="128" height="128" patternUnits="userSpaceOnUse">
      <path d="M 128 0 L 0 0 0 128" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1.5"/>
    </pattern>
    <radialGradient id="spot" cx="20%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#bef264" stop-opacity="0.16"/>
      <stop offset="55%" stop-color="#bef264" stop-opacity="0.03"/>
      <stop offset="100%" stop-color="#bef264" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rightFade" x1="60%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0a0a0a" stop-opacity="0"/>
      <stop offset="100%" stop-color="#0a0a0a" stop-opacity="0.4"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="3168" height="792" fill="#0a0a0a"/>
  <rect width="3168" height="792" fill="url(#grid)"/>
  <rect width="3168" height="792" fill="url(#spot)"/>
  <rect width="3168" height="792" fill="url(#rightFade)"/>

  <!-- Top status pill -->
  <g transform="translate(160, 130)">
    <rect width="740" height="60" rx="30" fill="#ffffff" fill-opacity="0.03" stroke="#ffffff" stroke-opacity="0.22" stroke-width="2"/>
    <circle cx="36" cy="30" r="7" fill="#bef264"/>
    <text x="60" y="40" fill="#ffffff" fill-opacity="0.8" font-size="22" font-family="ui-monospace,'SF Mono','Menlo','Consolas','Courier New',monospace" letter-spacing="4.5">AVAILABLE FOR WORK  ·  LAGUNA, PH</text>
  </g>

  <!-- Main title (single line) -->
  <g font-family="'Arial Black','Helvetica Neue Bold',Arial,sans-serif" font-weight="900" fill="#ffffff" letter-spacing="-8">
    <text x="160" y="450" font-size="200">I ship software<tspan fill="#bef264">.</tspan></text>
  </g>

  <!-- Subtitle -->
  <text x="160" y="540" font-size="50" font-family="'Helvetica Neue',Arial,sans-serif" font-weight="500" fill="#ffffff" fill-opacity="0.66" letter-spacing="-1">Full-stack  ·  Flutter  ·  React  ·  Philippines</text>

  <!-- Right: brand mark and meta stack -->
  <g transform="translate(2500, 140)">
    <rect width="510" height="520" rx="22" fill="#ffffff" fill-opacity="0.025" stroke="#ffffff" stroke-opacity="0.18" stroke-width="2"/>

    <!-- Inner terminal mark -->
    <g transform="translate(40, 40)">
      <rect width="160" height="160" rx="26" fill="#ffffff" fill-opacity="0.04" stroke="#ffffff" stroke-opacity="0.3" stroke-width="2"/>
      <text x="80" y="115" fill="#bef264" font-size="80" text-anchor="middle" font-family="ui-monospace,'SF Mono','Menlo','Consolas','Courier New',monospace" font-weight="700">&gt;_</text>
    </g>

    <!-- Meta rows -->
    <g font-family="ui-monospace,'SF Mono','Menlo','Consolas','Courier New',monospace">
      <text x="40" y="260" font-size="18" fill="#ffffff" fill-opacity="0.45" letter-spacing="4">// CURRENTLY</text>
      <text x="40" y="300" font-size="28" font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" fill="#ffffff">Jr. Test Automation Engineer</text>
      <text x="40" y="334" font-size="20" fill="#ffffff" fill-opacity="0.6" letter-spacing="2">BILLEASE  ·  APR 2025 — PRESENT</text>

      <text x="40" y="400" font-size="18" fill="#ffffff" fill-opacity="0.45" letter-spacing="4">// SHIPPING</text>
      <text x="40" y="440" font-size="28" font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" fill="#ffffff">Sandalan<tspan fill="#bef264">.</tspan></text>
      <text x="40" y="474" font-size="20" fill="#ffffff" fill-opacity="0.6" letter-spacing="2">LIVE ON GOOGLE PLAY</text>
    </g>
  </g>

  <!-- Bottom-right corner footer (safe zone — right side) -->
  <g transform="translate(1360, 700)" font-family="ui-monospace,'SF Mono','Menlo','Consolas','Courier New',monospace">
    <text font-size="20" fill="#ffffff" fill-opacity="0.35" letter-spacing="4">[ UPLB CS 2025  ·  IRRI  ·  CODEBREAK 2.0 CHAMPION ]</text>
  </g>

  <!-- Top-right: domain -->
  <g transform="translate(3000, 130)" text-anchor="end" font-family="ui-monospace,'SF Mono','Menlo','Consolas','Courier New',monospace">
    <text font-size="22" fill="#ffffff" fill-opacity="0.45" letter-spacing="4">JETTIMOTHYCEREZO.DEV</text>
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
