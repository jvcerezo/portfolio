import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '..', 'public', 'og-image.png');

// Using system-safe font stack so rasterization works reliably across environments.
// librsvg will fall back to a bold sans-serif that looks clean.
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
    <radialGradient id="spot" cx="20%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#bef264" stop-opacity="0.14"/>
      <stop offset="55%" stop-color="#bef264" stop-opacity="0.03"/>
      <stop offset="100%" stop-color="#bef264" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#spot)"/>

  <!-- Status pill -->
  <g transform="translate(72, 72)">
    <rect width="360" height="40" rx="20" fill="#ffffff" fill-opacity="0.03" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1"/>
    <circle cx="22" cy="20" r="4" fill="#bef264"/>
    <text x="38" y="26" fill="#ffffff" fill-opacity="0.78" font-size="12" font-family="ui-monospace,'SF Mono','Menlo','Consolas','Courier New',monospace" letter-spacing="3">AVAILABLE FOR WORK  ·  LAGUNA, PH</text>
  </g>

  <!-- Name (big display) -->
  <g font-family="'Arial Black','Helvetica Neue Bold','Helvetica Bold',Arial,sans-serif" font-weight="900" fill="#ffffff" letter-spacing="-4">
    <text x="72" y="260" font-size="100">Jet Timothy</text>
    <text x="72" y="365" font-size="100">Cerezo<tspan fill="#bef264">.</tspan></text>
  </g>

  <!-- Subtitle -->
  <text x="72" y="435" font-size="32" font-family="'Helvetica Neue','Arial',sans-serif" font-weight="500" fill="#ffffff" fill-opacity="0.64" letter-spacing="-0.5">Software Engineer  ·  Mobile &amp; Microservices  ·  Philippines</text>

  <!-- Tech chips -->
  <g font-family="ui-monospace,'SF Mono','Menlo','Consolas','Courier New',monospace" font-size="13" letter-spacing="2.5" fill="#ffffff" fill-opacity="0.82">
    <g transform="translate(72, 495)">
      <rect width="118" height="40" rx="20" fill="#ffffff" fill-opacity="0.025" stroke="#ffffff" stroke-opacity="0.2"/>
      <text x="59" y="26" text-anchor="middle">FLUTTER</text>
    </g>
    <g transform="translate(202, 495)">
      <rect width="100" height="40" rx="20" fill="#ffffff" fill-opacity="0.025" stroke="#ffffff" stroke-opacity="0.2"/>
      <text x="50" y="26" text-anchor="middle">REACT</text>
    </g>
    <g transform="translate(314, 495)">
      <rect width="150" height="40" rx="20" fill="#ffffff" fill-opacity="0.025" stroke="#ffffff" stroke-opacity="0.2"/>
      <text x="75" y="26" text-anchor="middle">TYPESCRIPT</text>
    </g>
    <g transform="translate(476, 495)">
      <rect width="130" height="40" rx="20" fill="#ffffff" fill-opacity="0.025" stroke="#ffffff" stroke-opacity="0.2"/>
      <text x="65" y="26" text-anchor="middle">SUPABASE</text>
    </g>
    <g transform="translate(618, 495)">
      <rect width="160" height="40" rx="20" fill="#ffffff" fill-opacity="0.025" stroke="#ffffff" stroke-opacity="0.2"/>
      <text x="80" y="26" text-anchor="middle">TEST AUTOMATION</text>
    </g>
  </g>

  <!-- Top-right: brand mark + label -->
  <g transform="translate(1050, 72)">
    <rect width="80" height="80" rx="16" fill="#ffffff" fill-opacity="0.04" stroke="#ffffff" stroke-opacity="0.25"/>
    <text x="40" y="56" fill="#bef264" font-size="34" text-anchor="middle" font-family="ui-monospace,'SF Mono','Menlo','Consolas','Courier New',monospace" font-weight="700">&gt;_</text>
  </g>

  <!-- Right meta block -->
  <g transform="translate(1128, 210)" text-anchor="end" font-family="ui-monospace,'SF Mono','Menlo','Consolas','Courier New',monospace" fill="#ffffff">
    <text font-size="11" letter-spacing="2.5" fill-opacity="0.4">// CURRENTLY</text>
    <text y="26" font-size="16" font-family="'Helvetica Neue','Arial',sans-serif" font-weight="600">Jr. Test Automation Engineer</text>
    <text y="48" font-size="13" fill-opacity="0.55" letter-spacing="0.5">BILLEASE  ·  APR 2025 — PRESENT</text>

    <text y="100" font-size="11" letter-spacing="2.5" fill-opacity="0.4">// SHIPPING</text>
    <text y="126" font-size="16" font-family="'Helvetica Neue','Arial',sans-serif" font-weight="600">Sandalan<tspan fill="#bef264">.</tspan></text>
    <text y="148" font-size="13" fill-opacity="0.55" letter-spacing="0.5">LIVE ON GOOGLE PLAY</text>
  </g>

  <!-- Bottom-right domain -->
  <g transform="translate(1128, 568)" text-anchor="end">
    <text font-size="14" fill="#ffffff" fill-opacity="0.45" font-family="ui-monospace,'SF Mono','Menlo','Consolas','Courier New',monospace" letter-spacing="3">JETTIMOTHYCEREZO.DEV</text>
  </g>

  <!-- Bottom-left: corner mark -->
  <g transform="translate(72, 560)" font-family="ui-monospace,'SF Mono','Menlo','Consolas','Courier New',monospace">
    <text font-size="11" fill="#ffffff" fill-opacity="0.4" letter-spacing="2.5">PORTFOLIO  ·  2026</text>
  </g>
</svg>`;

try {
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log('OG image written to:', outPath);
} catch (err) {
  console.error('Failed to generate OG image:', err);
  process.exit(1);
}
