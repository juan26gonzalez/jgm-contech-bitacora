const fs = require('fs');
const { Resvg } = require('@resvg/resvg-js');

function createSvg(width, height) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Full-bleed background (iOS & Android automatically mask corners) -->
  <rect width="512" height="512" fill="url(#bgGrad)" />

  <!-- HardHat (Exact Lucide Icon scaled 10x, centered in 512 canvas) -->
  <g transform="translate(136, 75) scale(10)" filter="url(#dropShadow)">
    <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4 15v-3a6 6 0 0 1 6-6" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 6a6 6 0 0 1 6 6v3" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <!-- Brand Typography -->
  <text x="256" y="375" text-anchor="middle" font-family="Segoe UI, -apple-system, Roboto, Arial, sans-serif" font-weight="900" font-size="52" letter-spacing="-0.5">
    <tspan fill="#ffffff">JGM </tspan>
    <tspan fill="#10b981">ConTech</tspan>
  </text>

  <!-- Subtitle -->
  <text x="256" y="425" text-anchor="middle" font-family="Segoe UI, -apple-system, Roboto, Arial, sans-serif" font-weight="700" font-size="18" fill="#94a3b8" letter-spacing="4">
    BITÁCORA DE OBRA
  </text>
</svg>`;
}

const svg512 = createSvg(512, 512);
fs.writeFileSync('public/icon.svg', svg512);

function renderPng(svg, width, outputPath) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width }
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  fs.writeFileSync(outputPath, pngBuffer);
  console.log('Saved', outputPath, width + 'x' + width);
}

renderPng(svg512, 512, 'public/icon-512.png');
renderPng(svg512, 192, 'public/icon-192.png');
renderPng(svg512, 180, 'public/apple-touch-icon.png');
renderPng(svg512, 32, 'public/favicon.png');

// Next.js App Router native icon conventions
fs.copyFileSync('public/icon-512.png', 'app/icon.png');
fs.copyFileSync('public/apple-touch-icon.png', 'app/apple-icon.png');

console.log('Generated full-bleed square icons for iOS / Android launcher compatibility!');
