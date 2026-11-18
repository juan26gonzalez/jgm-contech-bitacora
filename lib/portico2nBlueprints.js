import PORTICO_SPEC from "./portico2nSpec.json";

const ESCAPE_XML_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

const esc = (val) => String(val ?? "").replace(/[&<>"']/g, (ch) => ESCAPE_XML_MAP[ch]);

const COLORS = {
  bg: "#091322",
  paper: "#0b172a",
  grid: "#152a47",
  frame: "#38bdf8",
  axis: "#38bdf8",
  axisMuted: "#64748b",
  concrete: "#94a3b8",
  concreteFill: "#132238",
  masonry: "#cbd5e1",
  masonryFill: "#1a2942",
  window: "#38bdf8",
  door: "#fbbf24",
  rebarMain: "#f97316", // Copper orange: #4/#5 main bars & cantilever tension
  rebarConf: "#facc15", // Amber yellow: Lo hoops & negative slab bastones
  rebarMesh: "#38bdf8", // Cyan blue: central stirrups, slab bottom mesh & distribution
  rebarDowel: "#22d3ee", // Teal: footing starter dowels & pedestals
  pvcPipe: "#eab308", // Sanitary 4" PVC rainwater downspout
  alfajia: "#f1f5f9", // Concrete parapet coping (Alfajía)
  waterproof: "#64748b", // 1% sloped waterproof screed
  dim: "#34d399", // Emerald dimensions
  text: "#f1f5f9",
  textMuted: "#94a3b8",
  panelBg: "#08111f",
};

function renderCadShell({ code, title, subtitle, matSummary, scale, rev = "Rev. 01 (BIM 3D)", content }) {
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];
  const rows = ["A", "B", "C", "D", "E", "F"];
  const gridLines = [];
  for (let x = 80; x <= 1200; x += 80) {
    gridLines.push(`<line x1="${x}" y1="22" x2="${x}" y2="708"/>`);
  }
  for (let y = 70; y <= 690; y += 80) {
    gridLines.push(`<line x1="22" y1="${y}" x2="1258" y2="${y}"/>`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="820" viewBox="0 0 1280 820">
  <defs>
    <pattern id="diagHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="8" stroke="#38bdf8" stroke-width="1.2" opacity="0.28"/>
    </pattern>
    <pattern id="concHatch" width="10" height="10" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="3" r="0.9" fill="#94a3b8" opacity="0.45"/>
      <polygon points="7,2 9,5 5,6" fill="#64748b" opacity="0.35"/>
      <circle cx="5" cy="8.5" r="0.7" fill="#cbd5e1" opacity="0.35"/>
    </pattern>
  </defs>
  <rect width="1280" height="820" fill="${COLORS.bg}"/>
  <rect x="14" y="14" width="1252" height="792" fill="${COLORS.paper}" stroke="${COLORS.frame}" stroke-width="1.8"/>
  <rect x="22" y="22" width="1236" height="686" fill="none" stroke="#1e3a5f" stroke-width="1"/>
  <g stroke="${COLORS.grid}" stroke-width="0.8" opacity="0.6">${gridLines.join("")}</g>

  ${cols
    .map(
      (c, i) =>
        `<text x="${98 + i * 150}" y="19" fill="#64748b" font-family="monospace" font-size="9" text-anchor="middle">${c}</text>`
    )
    .join("")}
  ${rows
    .map(
      (r, i) =>
        `<text x="10" y="${88 + i * 112}" fill="#64748b" font-family="monospace" font-size="9" text-anchor="middle">${r}</text>`
    )
    .join("")}

  ${content}

  <!-- RÓTULO TÉCNICO (TITLE BLOCK) -->
  <g transform="translate(22, 712)">
    <defs>
      <clipPath id="rotuloTitleClip">
        <rect x="292" y="0" width="568" height="88"/>
      </clipPath>
    </defs>
    <rect width="1236" height="88" fill="#060e1a" stroke="${COLORS.frame}" stroke-width="1.4"/>
    <line x1="288" y1="0" x2="288" y2="88" stroke="#1e3a5f" stroke-width="1.2"/>
    <line x1="866" y1="0" x2="866" y2="88" stroke="#1e3a5f" stroke-width="1.2"/>
    <line x1="1096" y1="0" x2="1096" y2="88" stroke="#1e3a5f" stroke-width="1.2"/>

    <text x="14" y="24" fill="${COLORS.axis}" font-family="monospace" font-size="12.5" font-weight="bold">JGM CONTECH • OPENBIM 5D</text>
    <text x="14" y="42" fill="#e2e8f0" font-family="sans-serif" font-size="10.5" font-weight="bold">RESIDENCIAL PÓRTICO 2N + BALCÓN</text>
    <text x="14" y="59" fill="#94a3b8" font-family="monospace" font-size="9">8.00 × 7.00 m • 2 Niveles RC + Mamp. N°12</text>
    <text x="14" y="75" fill="#64748b" font-family="monospace" font-size="8">Modelo prototipo portafolio — no apto para obra sin firma</text>

    <g clip-path="url(#rotuloTitleClip)">
      <text x="302" y="27" fill="#f8fafc" font-family="sans-serif" font-size="13.5" font-weight="bold">${esc(title)}</text>
      <text x="302" y="49" fill="${COLORS.dim}" font-family="monospace" font-size="9.5">${esc(subtitle)}</text>
      <text x="302" y="71" fill="#94a3b8" font-family="monospace" font-size="9">NORMATIVA DUAL: NSR-10 TÍT. C / NTC 2289 • ACI 318-19 / ASTM A706 (fy=420 MPa)</text>
    </g>

    <text x="878" y="23" fill="#94a3b8" font-family="monospace" font-size="9" font-weight="bold">ESPECIFICACIONES CLAVE</text>
    ${matSummary
      .slice(0, 3)
      .map(
        (m, idx) =>
          `<text x="878" y="${41 + idx * 16}" fill="#e2e8f0" font-family="monospace" font-size="9">• ${esc(m)}</text>`
      )
      .join("")}

    <rect x="1106" y="10" width="118" height="32" rx="4" fill="#0f2942" stroke="${COLORS.axis}" stroke-width="1.2"/>
    <text x="1165" y="31" fill="${COLORS.axis}" font-family="monospace" font-size="16" font-weight="bold" text-anchor="middle">${esc(code)}</text>
    <text x="1108" y="60" fill="#cbd5e1" font-family="monospace" font-size="9">ESC: ${esc(scale)}</text>
    <text x="1108" y="76" fill="#94a3b8" font-family="monospace" font-size="8.5">${esc(rev)}</text>
  </g>
</svg>`;
}

function drawPlanGrid({ ox, oy, scale, showBalconyDim = false, showRoofDashed = false }) {
  const s = PORTICO_SPEC;
  const px = (wx) => ox + wx * scale;
  const py = (wz) => oy + wz * scale;
  const lines = [];

  const yTopAxis = py(-4.35);
  const yBotAxis = py(4.25 + (showBalconyDim ? 0.95 : 0));
  const xLeftAxis = px(-4.85);
  const xRightAxis = px(4.65);

  // Axis lines X (1, 2, 3)
  s.grid.x.forEach((gx) => {
    const cx = px(gx.pos);
    lines.push(`<line x1="${cx}" y1="${yTopAxis + 14}" x2="${cx}" y2="${yBotAxis}" stroke="${COLORS.axis}" stroke-width="0.9" stroke-dasharray="6 4" opacity="0.5"/>`);
    lines.push(`<circle cx="${cx}" cy="${yTopAxis}" r="13" fill="${COLORS.paper}" stroke="${COLORS.axis}" stroke-width="1.4"/>`);
    lines.push(`<text x="${cx}" y="${yTopAxis + 4}" fill="${COLORS.axis}" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">${esc(gx.id)}</text>`);
  });

  // Axis lines Z (A, B, C)
  s.grid.z.forEach((gz) => {
    const cy = py(gz.pos);
    lines.push(`<line x1="${xLeftAxis + 14}" y1="${cy}" x2="${xRightAxis}" y2="${cy}" stroke="${COLORS.axis}" stroke-width="0.9" stroke-dasharray="6 4" opacity="0.5"/>`);
    lines.push(`<circle cx="${xLeftAxis}" cy="${cy}" r="13" fill="${COLORS.paper}" stroke="${COLORS.axis}" stroke-width="1.4"/>`);
    lines.push(`<text x="${xLeftAxis}" y="${cy + 4}" fill="${COLORS.axis}" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">${esc(gz.id)}</text>`);
  });

  // Horizontal Dimension chains above top axes
  const dimY1 = yTopAxis - 22;
  const dimY2 = yTopAxis - 39;
  const x1 = px(-4.0);
  const x2 = px(0.0);
  const x3 = px(4.0);
  lines.push(`<g stroke="${COLORS.dim}" stroke-width="1" fill="${COLORS.dim}" font-family="monospace" font-size="9.5" text-anchor="middle">
    <line x1="${x1}" y1="${dimY1}" x2="${x3}" y2="${dimY1}"/>
    <line x1="${x1}" y1="${dimY1 - 4}" x2="${x1}" y2="${dimY1 + 4}"/>
    <line x1="${x2}" y1="${dimY1 - 4}" x2="${x2}" y2="${dimY1 + 4}"/>
    <line x1="${x3}" y1="${dimY1 - 4}" x2="${x3}" y2="${dimY1 + 4}"/>
    <text x="${(x1 + x2) / 2}" y="${dimY1 - 4}">4.00 m</text>
    <text x="${(x2 + x3) / 2}" y="${dimY1 - 4}">4.00 m</text>
    <line x1="${x1}" y1="${dimY2}" x2="${x3}" y2="${dimY2}"/>
    <line x1="${x1}" y1="${dimY2 - 4}" x2="${x1}" y2="${dimY2 + 4}"/>
    <line x1="${x3}" y1="${dimY2 - 4}" x2="${x3}" y2="${dimY2 + 4}"/>
    <text x="${(x1 + x3) / 2}" y="${dimY2 - 4}" font-weight="bold">8.00 m (EJES 1–3)</text>
  </g>`);

  // Vertical Dimension chains on left
  const dimX1 = xLeftAxis - 24;
  const dimX2 = xLeftAxis - 44;
  const ya = py(-3.5);
  const yb = py(0.0);
  const yc = py(3.5);
  const ybal = py(4.7);
  lines.push(`<g stroke="${COLORS.dim}" stroke-width="1" fill="${COLORS.dim}" font-family="monospace" font-size="9.5" text-anchor="middle">
    <line x1="${dimX1}" y1="${ya}" x2="${dimX1}" y2="${yc}"/>
    <line x1="${dimX1 - 4}" y1="${ya}" x2="${dimX1 + 4}" y2="${ya}"/>
    <line x1="${dimX1 - 4}" y1="${yb}" x2="${dimX1 + 4}" y2="${yb}"/>
    <line x1="${dimX1 - 4}" y1="${yc}" x2="${dimX1 + 4}" y2="${yc}"/>
    <text x="${dimX1 - 5}" y="${(ya + yb) / 2}" transform="rotate(-90 ${dimX1 - 5} ${(ya + yb) / 2})">3.50 m</text>
    <text x="${dimX1 - 5}" y="${(yb + yc) / 2}" transform="rotate(-90 ${dimX1 - 5} ${(yb + yc) / 2})">3.50 m</text>
    <line x1="${dimX2}" y1="${ya}" x2="${dimX2}" y2="${yc}"/>
    <line x1="${dimX2 - 4}" y1="${ya}" x2="${dimX2 + 4}" y2="${ya}"/>
    <line x1="${dimX2 - 4}" y1="${yc}" x2="${dimX2 + 4}" y2="${yc}"/>
    <text x="${dimX2 - 5}" y="${(ya + yc) / 2}" font-weight="bold" transform="rotate(-90 ${dimX2 - 5} ${(ya + yc) / 2})">7.00 m</text>
    ${
      showBalconyDim
        ? `<line x1="${dimX1}" y1="${yc}" x2="${dimX1}" y2="${ybal}"/>
           <line x1="${dimX1 - 4}" y1="${ybal}" x2="${dimX1 + 4}" y2="${ybal}"/>
           <text x="${dimX1 - 5}" y="${(yc + ybal) / 2}" fill="#f97316" font-weight="bold" transform="rotate(-90 ${dimX1 - 5} ${(yc + ybal) / 2})">1.20</text>`
        : ""
    }
  </g>`);

  if (showRoofDashed) {
    const rs = s.slabs.roofSlab;
    const dr = s.roof.drain;
    // Dashed outline of RC Roof Slab L-2 & Parapet enclosure + Alfajia drip edge
    lines.push(
      `<rect x="${px(rs.x0)}" y="${py(rs.z0)}" width="${(rs.x1 - rs.x0) * scale}" height="${(rs.z1 - rs.z0) * scale}" fill="none" stroke="#a78bfa" stroke-width="1.2" stroke-dasharray="8 4" opacity="0.85"/>`
    );
    // 1% roof slope arrows running Front (z=+3.3) -> Rear Collector (z=-3.2) -> Corner Tragante (x=3.72, z=-3.22)
    for (const sx of [-2.2, 0.0, 2.2]) {
      lines.push(
        `<line x1="${px(sx)}" y1="${py(2.8)}" x2="${px(sx)}" y2="${py(-2.7)}" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.75"/>`
      );
      lines.push(
        `<polygon points="${px(sx)},${py(-2.85)} ${px(sx) - 4},${py(-2.6)} ${px(sx) + 4},${py(-2.6)}" fill="#38bdf8" opacity="0.85"/>`
      );
    }
    // 4" PVC Sump & Exterior Downspout BLL-1 symbol at corner A/3
    lines.push(
      `<circle cx="${px(dr.sumpX)}" cy="${py(dr.sumpZ)}" r="5" fill="none" stroke="${COLORS.pvcPipe}" stroke-width="1.6"/>`
    );
    lines.push(
      `<line x1="${px(dr.sumpX)}" y1="${py(dr.sumpZ)}" x2="${px(dr.pipeX)}" y2="${py(dr.pipeZ)}" stroke="${COLORS.pvcPipe}" stroke-width="2.2"/>`
    );
    lines.push(
      `<circle cx="${px(dr.pipeX)}" cy="${py(dr.pipeZ)}" r="6" fill="${COLORS.pvcPipe}" stroke="#0f172a" stroke-width="1"/>`
    );
  }

  return lines.join("");
}

function drawColumnsPlan({ ox, oy, scale, size = 0.3, fill = COLORS.axis }) {
  const s = PORTICO_SPEC;
  const px = (wx) => ox + wx * scale;
  const py = (wz) => oy + wz * scale;
  const side = size * scale;
  return s.columns.items
    .map((c) => {
      const x = px(c.x) - side / 2;
      const y = py(c.z) - side / 2;
      return `<rect x="${x}" y="${y}" width="${side}" height="${side}" fill="${fill}" fill-opacity="0.35" stroke="${fill}" stroke-width="1.4"/>
      <text x="${px(c.x) + side / 2 + 3}" y="${py(c.z) - side / 2 + 2}" fill="${COLORS.axis}" font-family="monospace" font-size="8" font-weight="bold">${esc(c.id)}</text>`;
    })
    .join("");
}

function drawStairPlan({ ox, oy, scale, level }) {
  const st = PORTICO_SPEC.stair;
  const px = (wx) => ox + wx * scale;
  const py = (wz) => oy + wz * scale;
  const x0 = px(st.flight1.x0);
  const x1 = px(st.flight1.x1);
  const lX1 = px(st.landing.x1);
  const z1a = py(st.flight1.z0);
  const z1b = py(st.flight1.z1);
  const z2a = py(st.flight2.z0);
  const z2b = py(st.flight2.z1);

  const steps1 = [];
  const steps2 = [];
  const nTreads = st.risersPerFlight - 1;
  for (let i = 0; i <= nTreads; i++) {
    const sx = x0 + ((x1 - x0) * i) / nTreads;
    steps1.push(`<line x1="${sx}" y1="${z1a}" x2="${sx}" y2="${z1b}" stroke="#cbd5e1" stroke-width="0.9"/>`);
    steps2.push(`<line x1="${sx}" y1="${z2a}" x2="${sx}" y2="${z2b}" stroke="#cbd5e1" stroke-width="0.9"/>`);
  }

  return `<g>
    <rect x="${x0}" y="${z1a}" width="${lX1 - x0}" height="${z2b - z1a}" fill="#0f1f36" stroke="#64748b" stroke-width="1.2"/>
    <rect x="${x1}" y="${z1a}" width="${lX1 - x1}" height="${z2b - z1a}" fill="#172b4a" stroke="#94a3b8" stroke-width="1.1"/>
    ${steps1.join("")}
    ${steps2.join("")}
    <line x1="${x0}" y1="${z1b}" x2="${x1}" y2="${z1b}" stroke="${COLORS.axis}" stroke-width="1"/>
    <line x1="${x0}" y1="${z2a}" x2="${x1}" y2="${z2a}" stroke="${COLORS.axis}" stroke-width="1"/>
    <!-- Direction arrow -->
    <polyline points="${x0 + 8},${(z1a + z1b) / 2} ${x1 + 14},${(z1a + z1b) / 2} ${x1 + 14},${(z2a + z2b) / 2} ${x0 + 10},${(z2a + z2b) / 2}" fill="none" stroke="${COLORS.door}" stroke-width="1.5"/>
    <polygon points="${x0 + 6},${(z2a + z2b) / 2} ${x0 + 14},${(z2a + z2b) / 2 - 4} ${x0 + 14},${(z2a + z2b) / 2 + 4}" fill="${COLORS.door}"/>
    <text x="${(x1 + lX1) / 2}" y="${(z1a + z2b) / 2 - 4}" fill="${COLORS.door}" font-family="monospace" font-size="7.5" text-anchor="middle" font-weight="bold">DESC.</text>
    <text x="${(x1 + lX1) / 2}" y="${(z1a + z2b) / 2 + 6}" fill="#cbd5e1" font-family="monospace" font-size="7.5" text-anchor="middle">+1.50</text>
    <text x="${(x0 + x1) / 2}" y="${(z1a + z1b) / 2 - 4}" fill="${COLORS.door}" font-family="monospace" font-size="7" text-anchor="middle">${level === 1 ? "SUBE 1→9" : "TRAMO 1"}</text>
    <text x="${(x0 + x1) / 2}" y="${(z2a + z2b) / 2 - 4}" fill="${COLORS.door}" font-family="monospace" font-size="7" text-anchor="middle">${level === 1 ? "TRAMO 2" : "LLEGA +3.00"}</text>
  </g>`;
}

function drawWallsPlan({ ox, oy, scale, level }) {
  const s = PORTICO_SPEC;
  const px = (wx) => ox + wx * scale;
  const py = (wz) => oy + wz * scale;
  const tPx = s.wallThickness * scale;
  const out = [];

  for (const w of s.walls.filter((wl) => wl.level === level)) {
    const dx = w.x2 - w.x1;
    const dz = w.z2 - w.z1;
    const len = Math.hypot(dx, dz);
    const ux = dx / len;
    const uz = dz / len;
    const nx = -uz;
    const nz = ux;

    // Sort openings along wall
    const ops = [...(w.openings || [])].sort((a, b) => a.c - b.c);
    let cursor = 0;

    const emitSeg = (uStart, uEnd) => {
      if (uEnd - uStart <= 0.02) return;
      const sx1 = px(w.x1 + ux * uStart);
      const sy1 = py(w.z1 + uz * uStart);
      const sx2 = px(w.x1 + ux * uEnd);
      const sy2 = py(w.z1 + uz * uEnd);
      const hw = tPx / 2;
      const pts = [
        `${sx1 + nx * hw},${sy1 + nz * hw}`,
        `${sx2 + nx * hw},${sy2 + nz * hw}`,
        `${sx2 - nx * hw},${sy2 - nz * hw}`,
        `${sx1 - nx * hw},${sy1 - nz * hw}`,
      ].join(" ");
      out.push(`<polygon points="${pts}" fill="${COLORS.masonryFill}" stroke="${COLORS.masonry}" stroke-width="1.2"/>`);
    };

    for (const op of ops) {
      const u0 = Math.max(0, op.c - op.w / 2);
      const u1 = Math.min(len, op.c + op.w / 2);
      emitSeg(cursor, u0);
      cursor = u1;

      const cx = px(w.x1 + ux * op.c);
      const cy = py(w.z1 + uz * op.c);
      const sx0 = px(w.x1 + ux * u0);
      const sy0 = py(w.z1 + uz * u0);
      const sx1 = px(w.x1 + ux * u1);
      const sy1 = py(w.z1 + uz * u1);

      if (op.kind === "window") {
        out.push(`<line x1="${sx0}" y1="${sy0}" x2="${sx1}" y2="${sy1}" stroke="${COLORS.window}" stroke-width="${Math.max(3, tPx * 0.6)}" opacity="0.85"/>`);
        out.push(`<line x1="${sx0}" y1="${sy0}" x2="${sx1}" y2="${sy1}" stroke="#e0f2fe" stroke-width="1"/>`);
        out.push(`<text x="${cx + nx * 13}" y="${cy + nz * 13 + 3}" fill="${COLORS.window}" font-family="monospace" font-size="7.5" font-weight="bold" text-anchor="middle">${esc(op.id)}</text>`);
      } else {
        const wPx = op.w * scale;
        const swingX = sx0 + nx * wPx;
        const swingY = sy0 + nz * wPx;
        if (op.kind === "balconyDoor") {
          out.push(`<line x1="${sx0}" y1="${sy0}" x2="${sx1}" y2="${sy1}" stroke="#0ea5e9" stroke-width="${Math.max(4, tPx * 0.7)}"/>`);
          out.push(`<rect x="${cx - 34}" y="${cy + 7}" width="68" height="12" rx="2" fill="${COLORS.paper}" fill-opacity="0.9"/>`);
          out.push(`<text x="${cx}" y="${cy + 16}" fill="#7dd3fc" font-family="monospace" font-size="7.5" font-weight="bold" text-anchor="middle">${esc(op.id)} (1.60m)</text>`);
        } else {
          out.push(`<line x1="${sx0}" y1="${sy0}" x2="${swingX}" y2="${swingY}" stroke="${COLORS.door}" stroke-width="1.3"/>`);
          const largeArc = 0;
          const sweep = nx * uz - nz * ux >= 0 ? 1 : 0;
          out.push(`<path d="M ${sx1} ${sy1} A ${wPx} ${wPx} 0 ${largeArc} ${sweep} ${swingX} ${swingY}" fill="none" stroke="${COLORS.door}" stroke-width="0.9" stroke-dasharray="3 2"/>`);
          out.push(`<text x="${cx - nx * 11}" y="${cy - nz * 11 + 3}" fill="${COLORS.door}" font-family="monospace" font-size="7.5" font-weight="bold" text-anchor="middle">${esc(op.id)}</text>`);
        }
      }
    }
    emitSeg(cursor, len);
  }
  return out.join("");
}

function renderPanelBox({ x, y, w, h, title, lines }) {
  return `<g transform="translate(${x}, ${y})">
    <rect width="${w}" height="${h}" rx="4" fill="${COLORS.panelBg}" stroke="#1e3a5f" stroke-width="1.2"/>
    <rect width="${w}" height="24" rx="4" fill="#0f233f"/>
    <text x="12" y="16" fill="${COLORS.axis}" font-family="monospace" font-size="11" font-weight="bold">${esc(title)}</text>
    ${lines.join("")}
  </g>`;
}

// =============================================================================
// 1. ARQ-01: PLANTA ARQUITECTÓNICA NIVEL 1 (NPT +0.00)
// =============================================================================
export function buildArq1Svg() {
  const ox = 435;
  const oy = 370;
  const scale = 55;
  const px = (wx) => ox + wx * scale;
  const py = (wz) => oy + wz * scale;
  const s = PORTICO_SPEC;

  // Front terrace/step marker at main door P-1 & balcony projection dashed
  const bal = s.slabs.balcony;
  const balconyProj = `<rect x="${px(bal.x0)}" y="${py(bal.z0)}" width="${(bal.x1 - bal.x0) * scale}" height="${(bal.z1 - bal.z0) * scale}" fill="none" stroke="#64748b" stroke-width="1" stroke-dasharray="5 4"/>
    <text x="${px(0)}" y="${py(4.25)}" fill="#64748b" font-family="monospace" font-size="9" text-anchor="middle">PROYECCIÓN BALCÓN NIVEL 2 (+3.00)</text>`;

  // Entry porch step outside P-1
  const entryTag = `<polygon points="${px(1.0)},${py(3.5) + 12} ${px(1.0) - 6},${py(3.5) + 22} ${px(1.0) + 6},${py(3.5) + 22}" fill="${COLORS.dim}"/>
    <text x="${px(1.0)}" y="${py(3.5) + 33}" fill="${COLORS.dim}" font-family="monospace" font-size="8.5" font-weight="bold" text-anchor="middle">ACCESO PRINCIPAL (NPT +0.00)</text>`;

  const roomLabels = s.rooms
    .filter((r) => r.level === 1)
    .map((r) => {
      const area = r.rects.reduce((sum, [x0, z0, x1, z1]) => sum + Math.abs(x1 - x0) * Math.abs(z1 - z0), 0);
      return `<text x="${px(r.label[0])}" y="${py(r.label[1])}" fill="#f8fafc" font-family="sans-serif" font-size="11.5" font-weight="bold" text-anchor="middle">${esc(r.name.toUpperCase())}</text>
      <text x="${px(r.label[0])}" y="${py(r.label[1]) + 14}" fill="${COLORS.dim}" font-family="monospace" font-size="9.5" text-anchor="middle">${area.toFixed(1)} m² • NPT +0.00</text>`;
    })
    .join("");

  const roomsL1Rows = s.rooms
    .filter((r) => r.level === 1)
    .map((r, i) => {
      const area = r.rects.reduce((sum, [x0, z0, x1, z1]) => sum + Math.abs(x1 - x0) * Math.abs(z1 - z0), 0);
      return `<text x="14" y="${46 + i * 20}" fill="#e2e8f0" font-family="monospace" font-size="10.5">${esc(r.name.padEnd(18, " "))} ${area.toFixed(2)} m²</text>`;
    });

  const openingsL1 = s.walls
    .filter((w) => w.level === 1)
    .flatMap((w) => w.openings || [])
    .map(
      (op, i) =>
        `<text x="${14 + (i % 2) * 205}" y="${46 + Math.floor(i / 2) * 20}" fill="${op.kind === "window" ? COLORS.window : COLORS.door}" font-family="monospace" font-size="10">${esc(op.id)}: ${op.w.toFixed(2)}×${(op.head - op.sill).toFixed(2)}m</text>`
    );

  const rightPanels = [
    renderPanelBox({
      x: 815,
      y: 38,
      w: 425,
      h: 162,
      title: "CUADRO DE ÁREAS ARQUITECTÓNICAS — NIVEL 1",
      lines: [
        ...roomsL1Rows,
        `<line x1="12" y1="138" x2="412" y2="138" stroke="#1e3a5f"/>`,
        `<text x="14" y="153" fill="${COLORS.axis}" font-family="monospace" font-size="10.5" font-weight="bold">ÁREA CONSTRUIDA N1: 60.59 m² (8.30×7.30)</text>`,
      ],
    }),
    renderPanelBox({
      x: 815,
      y: 214,
      w: 425,
      h: 170,
      title: "CUADRO DE CARPINTERÍA & VANOS (NIVEL 1)",
      lines: openingsL1,
    }),
    renderPanelBox({
      x: 815,
      y: 398,
      w: 425,
      h: 292,
      title: "ESPECIFICACIONES CONSTRUCTIVAS & CONVENCIONES",
      lines: [
        `<text x="14" y="48" fill="#cbd5e1" font-family="monospace" font-size="10">• Mampostería: Bloque concreto N° 12 (e=15 cm acabado)</text>`,
        `<text x="14" y="68" fill="#cbd5e1" font-family="monospace" font-size="10">• Pórtico: Columnas RC 30×30 cm (f'c=24 MPa)</text>`,
        `<text x="14" y="88" fill="#cbd5e1" font-family="monospace" font-size="10">• Escalera ESC-1: Tipo U • 18 contrahuellas 16.7/27 cm</text>`,
        `<text x="14" y="108" fill="#cbd5e1" font-family="monospace" font-size="10">• Pisos N1: Porcelanato 51×51 cm s/ contrapiso e=10 cm</text>`,
        `<line x1="14" y1="124" x2="410" y2="124" stroke="#1e3a5f"/>`,
        `<rect x="16" y="140" width="22" height="10" fill="${COLORS.masonryFill}" stroke="${COLORS.masonry}" stroke-width="1.2"/>`,
        `<text x="48" y="149" fill="#cbd5e1" font-family="monospace" font-size="10">Muro mampostería Bloque N° 12 + pañete</text>`,
        `<rect x="16" y="164" width="14" height="14" fill="${COLORS.axis}" fill-opacity="0.35" stroke="${COLORS.axis}"/>`,
        `<text x="48" y="175" fill="#cbd5e1" font-family="monospace" font-size="10">Columna concreto armado 30×30 cm (C1–C9)</text>`,
        `<line x1="16" y1="198" x2="38" y2="198" stroke="${COLORS.window}" stroke-width="3.5"/>`,
        `<text x="48" y="202" fill="#cbd5e1" font-family="monospace" font-size="10">Ventanería aluminio anodizado + vidrio</text>`,
        `<line x1="16" y1="224" x2="38" y2="224" stroke="${COLORS.door}" stroke-width="1.5"/>`,
        `<text x="48" y="228" fill="#cbd5e1" font-family="monospace" font-size="10">Puerta acceso / interior con abatimiento</text>`,
        `<circle cx="385" cy="262" r="20" fill="none" stroke="${COLORS.axis}" stroke-width="1.2"/>`,
        `<polygon points="385,244 379,264 385,260 391,264" fill="${COLORS.axis}"/>`,
        `<text x="385" y="278" fill="${COLORS.axis}" font-family="monospace" font-size="8.5" font-weight="bold" text-anchor="middle">N</text>`,
      ],
    }),
  ].join("");

  return renderCadShell({
    code: "ARQ-01",
    title: "PLANTA ARQUITECTÓNICA — NIVEL 1 (NPT +0.00 m)",
    subtitle: "SALA, COMEDOR, COCINA, BAÑO SOCIAL & ARRANQUE ESCALERA ESC-1 • BLOQUE N° 12",
    matSummary: [
      "Mampostería Bloque N° 12",
      "Columnas RC 30×30 f'c=24 MPa",
      "Escalera U: 18 pasos (27/16.7cm)",
    ],
    scale: "1:50",
    content: [
      drawPlanGrid({ ox, oy, scale, showBalconyDim: false, showRoofDashed: false }),
      balconyProj,
      drawStairPlan({ ox, oy, scale, level: 1 }),
      drawWallsPlan({ ox, oy, scale, level: 1 }),
      drawColumnsPlan({ ox, oy, scale }),
      entryTag,
      roomLabels,
      rightPanels,
    ].join(""),
  });
}

// =============================================================================
// 2. ARQ-02: PLANTA ARQUITECTÓNICA NIVEL 2 (+3.00) + BALCÓN & LOSA CUBIERTA RC
// =============================================================================
export function buildArq2Svg() {
  const ox = 435;
  const oy = 355;
  const scale = 54;
  const px = (wx) => ox + wx * scale;
  const py = (wz) => oy + wz * scale;
  const s = PORTICO_SPEC;
  const bal = s.slabs.balcony;

  // Front Balcony Floor + Railing perimeter (open-air terrace; RC roof L-2 stops over Eje C parapet)
  const balSvg = `<rect x="${px(bal.x0)}" y="${py(bal.z0)}" width="${(bal.x1 - bal.x0) * scale}" height="${(bal.z1 - bal.z0) * scale}" fill="#142942" stroke="${COLORS.rebarMain}" stroke-width="1.6"/>
    <polyline points="${px(-4.1)},${py(3.55)} ${px(-4.1)},${py(4.65)} ${px(4.1)},${py(4.65)} ${px(4.1)},${py(3.55)}" fill="none" stroke="#38bdf8" stroke-width="2.6"/>`;

  // RC Roof L-2, 1% slope & 4" PVC downspout callouts (placed above Eje A clear of C1..C3 labels)
  const roofCallouts = `<rect x="${px(-4.15)}" y="${py(-4.22)}" width="295" height="14" rx="2" fill="${COLORS.paper}" fill-opacity="0.94" stroke="#4c1d95" stroke-width="0.6"/>
    <text x="${px(-4.15) + 147.5}" y="${py(-4.22) + 10}" fill="#c4b5fd" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">PROY. LOSA CUBIERTA L-2 (+5.80) + ANTEPECHO (+6.80) + ALFAJÍA</text>
    <rect x="${px(1.95)}" y="${py(-4.22)}" width="145" height="14" rx="2" fill="${COLORS.paper}" fill-opacity="0.95" stroke="${COLORS.pvcPipe}" stroke-width="0.7"/>
    <text x="${px(1.95) + 72.5}" y="${py(-4.22) + 10}" fill="${COLORS.pvcPipe}" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">BAJANTE PVC 4" (BLL-1)</text>
    <rect x="${px(-1.35)}" y="${py(-0.56)}" width="215" height="14" rx="2" fill="${COLORS.paper}" fill-opacity="0.92" stroke="#0284c7" stroke-width="0.6"/>
    <text x="${px(0.65)}" y="${py(-0.56) + 10}" fill="#38bdf8" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">PENDIENTE CUBIERTA 1.0% → DESAGÜE A/3</text>`;

  // Stair void railings
  const railSvg = `<line x1="${px(0.79)}" y1="${py(-1.45)}" x2="${px(3.85)}" y2="${py(-1.45)}" stroke="${COLORS.door}" stroke-width="2.2"/>
    <line x1="${px(0.79)}" y1="${py(-3.35)}" x2="${px(0.79)}" y2="${py(-2.4)}" stroke="${COLORS.door}" stroke-width="2.2"/>`;

  const roomLabels = s.rooms
    .filter((r) => r.level === 2)
    .map((r) => {
      const area = r.rects.reduce((sum, [x0, z0, x1, z1]) => sum + Math.abs(x1 - x0) * Math.abs(z1 - z0), 0);
      return `<text x="${px(r.label[0])}" y="${py(r.label[1])}" fill="${r.id.includes("BALCON") ? "#fed7aa" : "#f8fafc"}" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">${esc(r.name.toUpperCase())}</text>
      <text x="${px(r.label[0])}" y="${py(r.label[1]) + 13}" fill="${COLORS.dim}" font-family="monospace" font-size="9" text-anchor="middle">${area.toFixed(1)} m²</text>`;
    })
    .join("");

  const roomsL2Rows = s.rooms
    .filter((r) => r.level === 2)
    .map((r, i) => {
      const area = r.rects.reduce((sum, [x0, z0, x1, z1]) => sum + Math.abs(x1 - x0) * Math.abs(z1 - z0), 0);
      return `<text x="14" y="${46 + i * 20}" fill="${r.id.includes("BALCON") ? "#fdba74" : "#e2e8f0"}" font-family="monospace" font-size="10.5">${esc(r.name.padEnd(20, " "))} ${area.toFixed(2)} m²</text>`;
    });

  const openingsL2 = s.walls
    .filter((w) => w.level === 2)
    .flatMap((w) => w.openings || [])
    .map(
      (op, i) =>
        `<text x="${14 + (i % 2) * 205}" y="${46 + Math.floor(i / 2) * 19}" fill="${op.kind === "window" ? COLORS.window : COLORS.door}" font-family="monospace" font-size="9.5">${esc(op.id)}: ${op.w.toFixed(2)}×${(op.head - op.sill).toFixed(2)}m</text>`
    );

  const rightPanels = [
    renderPanelBox({
      x: 815,
      y: 38,
      w: 425,
      h: 192,
      title: "CUADRO DE ÁREAS — NIVEL 2 + BALCÓN",
      lines: [
        ...roomsL2Rows,
        `<line x1="12" y1="168" x2="412" y2="168" stroke="#1e3a5f"/>`,
        `<text x="14" y="183" fill="${COLORS.axis}" font-family="monospace" font-size="10.5" font-weight="bold">ÁREA TOTAL N2 (INCL. BALCÓN): 63.50 m²</text>`,
      ],
    }),
    renderPanelBox({
      x: 815,
      y: 242,
      w: 425,
      h: 185,
      title: "CUADRO DE CARPINTERÍA & BALCÓN (NIVEL 2)",
      lines: openingsL2,
    }),
    renderPanelBox({
      x: 815,
      y: 440,
      w: 425,
      h: 250,
      title: "LOSA CUBIERTA RC 1%, ANTEPECHO, ALFAJÍA & BAJANTE 4\"",
      lines: [
        `<text x="14" y="48" fill="#cbd5e1" font-family="monospace" font-size="10">• Cubierta: Losa maciza RC L-2 f'c=24 MPa e=12cm (+5.80m)</text>`,
        `<text x="14" y="68" fill="#38bdf8" font-family="monospace" font-size="10">• Pendiente 1.0%: Afine mortero + imperm. (+5.89 → +5.82 m)</text>`,
        `<text x="14" y="88" fill="#cbd5e1" font-family="monospace" font-size="10">• Antepecho Bloque N°12 h=1.00 m (+5.80 → +6.80 m) 4 lados</text>`,
        `<text x="14" y="108" fill="#f1f5f9" font-family="monospace" font-size="10">• Alfajía perimetral concreto (23×7cm c/ gotero 4 cm)</text>`,
        `<text x="14" y="128" fill="${COLORS.pvcPipe}" font-family="monospace" font-size="10">• Desagüe: Tragante esquina A/3 + Bajante PVC Sanitaria 4"</text>`,
        `<text x="14" y="148" fill="#fdba74" font-family="monospace" font-size="10">• Balcón LV-1 (descub.): Vol. 1.20 m + Baranda h=1.00 m</text>`,
        `<text x="14" y="172" fill="${COLORS.dim}" font-family="monospace" font-size="9.5">• Cielo Raso N2: Drywall e=1/2" + Frescasa Eco 2-1/2"</text>`,
      ],
    }),
  ].join("");

  return renderCadShell({
    code: "ARQ-02",
    title: "PLANTA ARQUITECTÓNICA NIVEL 2 (+3.00 m) & BALCÓN",
    subtitle: "ALCOBAS, BAÑO, ESC-1, BALCÓN (1.20 m) & PROY. LOSA CUBIERTA RC 1% + BAJANTE 4\"",
    matSummary: [
      "Losa Cubierta RC L-2 (Pend. 1%)",
      "Antepecho h=1.0m + Alfajía",
      "Tragante & Bajante PVC 4\"",
    ],
    scale: "1:50",
    content: [
      drawPlanGrid({ ox, oy, scale, showBalconyDim: true, showRoofDashed: true }),
      balSvg,
      drawStairPlan({ ox, oy, scale, level: 2 }),
      railSvg,
      drawWallsPlan({ ox, oy, scale, level: 2 }),
      drawColumnsPlan({ ox, oy, scale }),
      roofCallouts,
      roomLabels,
      rightPanels,
    ].join(""),
  });
}

// =============================================================================
// 3. EST-01: PLANTA DE CIMENTACIÓN (ZAPATAS, PEDESTALES, VIGAS VC & ACERO)
// =============================================================================
export function buildEst1FoundationsSvg() {
  const ox = 415;
  const oy = 385;
  const scale = 54;
  const px = (wx) => ox + wx * scale;
  const py = (wz) => oy + wz * scale;
  const s = PORTICO_SPEC;

  // Grade beams VC 30x35
  const vcSvg = s.beams
    .filter((b) => b.type === "VC")
    .map((bm) => {
      const isX = bm.axis === "x";
      const w = (isX ? bm.to - bm.from : 0.3) * scale;
      const h = (isX ? 0.3 : bm.to - bm.from) * scale;
      const x = isX ? px(bm.from) : px(bm.line) - w / 2;
      const y = isX ? py(bm.line) - h / 2 : py(bm.from);
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#172b47" stroke="${COLORS.concrete}" stroke-width="1.3"/>
      <text x="${isX ? px(-2.0) : px(bm.line) + 12}" y="${isX ? py(bm.line) - 11 : py(1.75)}" fill="#cbd5e1" font-family="monospace" font-size="8.5" font-weight="bold">${esc(bm.id)}</text>`;
    })
    .join("");

  // Footings with actual bidirectional rebar mat drawn inside + Pedestals 40x40 + Column 30x30
  const footSvg = s.footings.items
    .map((it) => {
      const ft = s.footings.types[it.type];
      const side = ft.b * scale;
      const ped = s.pedestal.b * scale;
      const col = s.columns.b * scale;
      const cx = px(it.x);
      const cy = py(it.z);
      const fx = cx - side / 2;
      const fy = cy - side / 2;

      const bars = [];
      const pad = 5;
      const nBars = Math.min(7, ft.nBars);
      for (let i = 0; i < nBars; i++) {
        const off = pad + ((side - pad * 2) * i) / (nBars - 1);
        bars.push(`<line x1="${fx + pad}" y1="${fy + off}" x2="${fx + side - pad}" y2="${fy + off}" stroke="${COLORS.rebarMain}" stroke-width="0.9" opacity="0.85"/>`);
        bars.push(`<line x1="${fx + off}" y1="${fy + pad}" x2="${fx + off}" y2="${fy + side - pad}" stroke="${COLORS.rebarMain}" stroke-width="0.9" opacity="0.85"/>`);
      }

      return `<g>
        <rect x="${fx}" y="${fy}" width="${side}" height="${side}" fill="#0c1d35" stroke="${COLORS.rebarDowel}" stroke-width="1.6"/>
        ${bars.join("")}
        <rect x="${cx - ped / 2}" y="${cy - ped / 2}" width="${ped}" height="${ped}" fill="#13314f" stroke="${COLORS.rebarConf}" stroke-width="1.3"/>
        <rect x="${cx - col / 2}" y="${cy - col / 2}" width="${col}" height="${col}" fill="${COLORS.axis}" fill-opacity="0.45" stroke="${COLORS.axis}" stroke-width="1"/>
        <text x="${cx + side / 2 + 4}" y="${cy - side / 2 + 10}" fill="${COLORS.rebarDowel}" font-family="monospace" font-size="9" font-weight="bold">${esc(it.id)} (${esc(it.type)})</text>
      </g>`;
    })
    .join("");

  // Detail section Zapata + Pedestal + Viga VC (Right upper panel)
  const detailSvg = `<g transform="translate(810, 38)">
    <rect width="430" height="390" rx="4" fill="${COLORS.panelBg}" stroke="#1e3a5f" stroke-width="1.2"/>
    <rect width="430" height="24" rx="4" fill="#0f233f"/>
    <text x="12" y="16" fill="${COLORS.axis}" font-family="monospace" font-size="11" font-weight="bold">CORTE TÍPICO ZAPATA + PEDESTAL 40×40 + VIGA VC (ESC. 1:25)</text>

    <!-- Datum levels -->
    <g stroke="#334155" stroke-width="0.8" stroke-dasharray="4 3" fill="#94a3b8" font-family="monospace" font-size="8.5">
      <line x1="20" y1="88" x2="310" y2="88"/><text x="315" y="91">NPT +0.00 (CP-1)</text>
      <line x1="20" y1="108" x2="310" y2="108"/><text x="315" y="111">TOP VC -0.10</text>
      <line x1="20" y1="172" x2="310" y2="172"/><text x="315" y="175">FONDO VC -0.45</text>
      <line x1="20" y1="286" x2="310" y2="286"/><text x="315" y="289">PED. BASE -1.10</text>
      <line x1="20" y1="352" x2="310" y2="352"/><text x="315" y="355">FONDO ZAP -1.50</text>
    </g>

    <!-- Soil Mud Slab Solado e=5cm -->
    <rect x="65" y="352" width="210" height="8" fill="#334155"/>
    <text x="170" y="376" fill="${COLORS.rebarMain}" font-family="monospace" font-size="8.5" font-weight="bold" text-anchor="middle">PARRILLA #4/#5 @ 0.15m A/S + GANCHO 90° (REC. 7.5 cm)</text>

    <!-- Footing concrete box -->
    <rect x="70" y="286" width="200" height="66" fill="url(#concHatch)" stroke="${COLORS.concrete}" stroke-width="1.6"/>
    <!-- Pedestal 40x40 -->
    <rect x="136" y="108" width="68" height="178" fill="url(#concHatch)" stroke="${COLORS.concrete}" stroke-width="1.6"/>
    <!-- Grade Beams VC left/right -->
    <rect x="30" y="108" width="106" height="64" fill="url(#concHatch)" stroke="${COLORS.concrete}" stroke-width="1.4"/>
    <rect x="204" y="108" width="100" height="64" fill="url(#concHatch)" stroke="${COLORS.concrete}" stroke-width="1.4"/>
    <!-- Column C-1 stub above -->
    <rect x="145" y="48" width="50" height="60" fill="url(#concHatch)" stroke="${COLORS.axis}" stroke-width="1.5"/>

    <!-- Rebar: Footing Bottom Mat w/ 90° upward hooks -->
    <polyline points="82,302 82,338 258,338 258,302" fill="none" stroke="${COLORS.rebarMain}" stroke-width="2.6"/>

    <!-- Rebar: 8 #4 Starter Dowels w/ 0.25m horizontal feet into footing + 0.55m lap into column -->
    <polyline points="104,335 148,335 148,60" fill="none" stroke="${COLORS.rebarDowel}" stroke-width="2.3"/>
    <polyline points="236,335 192,335 192,60" fill="none" stroke="${COLORS.rebarDowel}" stroke-width="2.3"/>
    <line x1="170" y1="335" x2="170" y2="60" stroke="${COLORS.rebarDowel}" stroke-width="1.8" stroke-dasharray="5 3"/>

    <!-- Pedestal Hoops #3 @ 10cm -->
    ${[122, 140, 158, 176, 194, 212, 230, 248, 266, 280]
      .map((y) => `<line x1="142" y1="${y}" x2="198" y2="${y}" stroke="${COLORS.rebarConf}" stroke-width="1.8"/>`)
      .join("")}

    <!-- VC Longitudinal 2 #5 sup + 2 #5 inf + Stirrups #3 -->
    <line x1="34" y1="117" x2="298" y2="117" stroke="${COLORS.rebarMain}" stroke-width="2"/>
    <line x1="34" y1="163" x2="298" y2="163" stroke="${COLORS.rebarMain}" stroke-width="2"/>
    ${[46, 62, 78, 94, 110, 224, 240, 256, 272, 288]
      .map((x) => `<line x1="${x}" y1="115" x2="${x}" y2="165" stroke="${COLORS.rebarMesh}" stroke-width="1.3"/>`)
      .join("")}

    <text x="218" y="216" fill="${COLORS.rebarDowel}" font-family="monospace" font-size="8.5" font-weight="bold">8 #4 (pata 0.25m)</text>
    <text x="218" y="232" fill="${COLORS.rebarConf}" font-family="monospace" font-size="8.5" font-weight="bold">E #3 @ 0.10 m</text>
    <text x="218" y="248" fill="#cbd5e1" font-family="monospace" font-size="8">Traslapo L=0.55 m</text>
  </g>`;

  const tableSvg = renderPanelBox({
    x: 810,
    y: 440,
    w: 430,
    h: 250,
    title: "CUADRO DE ZAPATAS, PEDESTALES & VIGAS VC",
    lines: [
      `<text x="14" y="46" fill="${COLORS.axis}" font-family="monospace" font-size="10" font-weight="bold">TIPO   DIM (m)       EJES         PARRILLA INF.       CANT</text>`,
      `<line x1="12" y1="54" x2="416" y2="54" stroke="#1e3a5f"/>`,
      `<text x="14" y="72" fill="#e2e8f0" font-family="monospace" font-size="10">Z-1    1.20×1.20×0.4 Z1,Z3,Z7,Z9  8 #4 @ 0.15m A/S     4</text>`,
      `<text x="14" y="92" fill="#e2e8f0" font-family="monospace" font-size="10">Z-2    1.40×1.40×0.4 Z2,Z4,Z6,Z8  9 #4 @ 0.15m A/S     4</text>`,
      `<text x="14" y="112" fill="#fdba74" font-family="monospace" font-size="10">Z-3    1.60×1.60×0.4 Z5 (Central) 10 #5 @ 0.15m A/S    1</text>`,
      `<line x1="12" y1="124" x2="416" y2="124" stroke="#1e3a5f"/>`,
      `<text x="14" y="144" fill="#cbd5e1" font-family="monospace" font-size="9.5">• Pedestales (9 und): 40×40 cm • 8 #4 + E #3 @ 0.10 m</text>`,
      `<text x="14" y="164" fill="#cbd5e1" font-family="monospace" font-size="9.5">• Vigas VC (6 líneas): 30×35 cm • 2#5 sup + 2#5 inf</text>`,
      `<text x="14" y="184" fill="#cbd5e1" font-family="monospace" font-size="9.5">  Estribos VC: #3 (135°) Lo=0.70m @ 10cm | Centro @ 15cm</text>`,
      `<text x="14" y="204" fill="#cbd5e1" font-family="monospace" font-size="9.5">• Contrapiso CP-1: e=10 cm • Malla 15×15 cm Ø 5.0 mm</text>`,
      `<text x="14" y="226" fill="${COLORS.dim}" font-family="monospace" font-size="9.5">• Concreto Cimentación: f'c=21 MPa | Acero: fy=420 MPa</text>`,
    ],
  });

  return renderCadShell({
    code: "EST-01",
    title: "PLANTA CIMENTACIÓN — ZAPATAS, PEDESTALES & VIGAS VC",
    subtitle: "PARRILLAS #4/#5 @ 0.15m, PEDESTALES 40×40, CP-1 & CORTE TÍPICO",
    matSummary: [
      "f'c = 21 MPa (3,000 PSI) Ciment.",
      "Recub. 75 mm zapata / 50 mm VC",
      "Acero fy = 420 MPa NTC 2289",
    ],
    scale: "1:50 / 1:25",
    content: [
      drawPlanGrid({ ox, oy, scale, showBalconyDim: false, showRoofDashed: false }),
      vcSvg,
      footSvg,
      detailSvg,
      tableSvg,
    ].join(""),
  });
}

// =============================================================================
// 4. EST-02: COLUMNAS C-1 (30×30) & PEDESTALES — DESPIECE, ESTRIBOS & SECCIÓN
// =============================================================================
export function buildEst2ColumnsSvg() {
  // Datum lines on Elevation Panel (x=36..785)
  const yMap = (wy) => 610 - wy * 68; // -1.50 -> 712? Wait: keep inside 24..700!
  // Let's check scale: wy in [-1.50, 6.60] = 8.10m. At 58 px/m -> 470 px!
  const yEle = (wy) => 612 - (wy + 1.5) * 58; // -1.50 -> 612, +6.87 -> 126.5

  const levels = [
    { wy: 6.8, lbl: "+6.80 TOP ANTEPECHO + ALFAJÍA (Ref.)" },
    { wy: 5.8, lbl: "+5.80 TOPE LOSA CUBIERTA L-2 (C1..C9)" },
    { wy: 3.0, lbl: "+3.00 ENTREPISO VE / LOSA L-1" },
    { wy: 2.6, lbl: "+2.60 FONDO VIGA VE" },
    { wy: 0.0, lbl: "+0.00 NPT1 / -0.10 PEDESTAL" },
    { wy: -0.1, lbl: "" },
    { wy: -1.1, lbl: "-1.10 TOPE ZAPATA" },
    { wy: -1.5, lbl: "-1.50 FONDO ZAPATA" },
  ];

  const datumLines = levels
    .map(
      (lv) =>
        `<line x1="42" y1="${yEle(lv.wy)}" x2="545" y2="${yEle(lv.wy)}" stroke="#1e3a5f" stroke-width="0.9" stroke-dasharray="5 4"/>
        ${lv.lbl ? `<text x="550" y="${yEle(lv.wy) + 3}" fill="#94a3b8" font-family="monospace" font-size="8.5">${esc(lv.lbl)}</text>` : ""}`
    )
    .join("");

  const drawColumnElev = ({ cx, topY, title, tag }) => {
    const colW = 34;
    const pedW = 46;
    const zapW = 86;
    const yBotZap = yEle(-1.5);
    const yTopZap = yEle(-1.1);
    const yTopPed = yEle(-0.1);
    const yTopCol = yEle(topY);

    // Confinement hoop ticks every few pixels in Lo & mid
    const hoops = [];
    // Pedestal -1.10 -> -0.10 (@ 10cm)
    for (let wy = -1.0; wy <= -0.15; wy += 0.14) {
      hoops.push(`<line x1="${cx - pedW / 2 + 4}" y1="${yEle(wy)}" x2="${cx + pedW / 2 - 4}" y2="${yEle(wy)}" stroke="${COLORS.rebarConf}" stroke-width="1.6"/>`);
    }
    // Column Lo & mid hoops
    const drawBand = (a, b, step, color) => {
      for (let wy = a; wy <= b; wy += step) {
        hoops.push(`<line x1="${cx - colW / 2 + 4}" y1="${yEle(wy)}" x2="${cx + colW / 2 - 4}" y2="${yEle(wy)}" stroke="${color}" stroke-width="1.5"/>`);
      }
    };
    drawBand(-0.04, 0.45, 0.12, COLORS.rebarConf); // Base Lo=50cm @ 10
    drawBand(0.65, 2.05, 0.25, COLORS.rebarMesh); // N1 Mid @ 20
    drawBand(2.15, 3.5, 0.12, COLORS.rebarConf); // Nudo Entrepiso Lo + N2 Base
    drawBand(3.72, topY - 0.58, 0.25, COLORS.rebarMesh); // N2 Mid @ 20
    drawBand(topY - 0.5, topY - 0.08, 0.12, COLORS.rebarConf); // Head Lo=50cm @ 10

    return `<g>
      <text x="${cx}" y="${yTopCol - 28}" fill="${COLORS.axis}" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">${esc(title)}</text>
      <text x="${cx}" y="${yTopCol - 14}" fill="#94a3b8" font-family="monospace" font-size="9" text-anchor="middle">${esc(tag)}</text>

      <!-- Footing & Pedestal & Column concrete -->
      <rect x="${cx - zapW / 2}" y="${yTopZap}" width="${zapW}" height="${yBotZap - yTopZap}" fill="url(#concHatch)" stroke="${COLORS.concrete}" stroke-width="1.4"/>
      <rect x="${cx - pedW / 2}" y="${yTopPed}" width="${pedW}" height="${yTopZap - yTopPed}" fill="url(#concHatch)" stroke="${COLORS.rebarDowel}" stroke-width="1.4"/>
      <rect x="${cx - colW / 2}" y="${yTopCol}" width="${colW}" height="${yTopPed - yTopCol}" fill="url(#concHatch)" stroke="${COLORS.axis}" stroke-width="1.4"/>

      <!-- Longitudinal 8 #4 bars (col) + 8 #4 starter dowels (pedestal w/ splice) -->
      <polyline points="${cx - zapW / 2 + 12},${yBotZap - 8} ${cx - colW / 2 + 6},${yBotZap - 8} ${cx - colW / 2 + 6},${yTopCol + 6} ${cx - colW / 2 + 15},${yTopCol + 6}" fill="none" stroke="${COLORS.rebarMain}" stroke-width="2.2"/>
      <polyline points="${cx + zapW / 2 - 12},${yBotZap - 8} ${cx + colW / 2 - 6},${yBotZap - 8} ${cx + colW / 2 - 6},${yTopCol + 6} ${cx + colW / 2 - 15},${yTopCol + 6}" fill="none" stroke="${COLORS.rebarMain}" stroke-width="2.2"/>
      <line x1="${cx}" y1="${yTopPed}" x2="${cx}" y2="${yTopCol + 6}" stroke="${COLORS.rebarMain}" stroke-width="1.7" stroke-dasharray="5 3"/>
      ${hoops.join("")}
    </g>`;
  };

  // Detailed Section 30x30 Column + Section 40x40 Pedestal (Right side)
  const sectionCol = `<g transform="translate(765, 38)">
    <rect width="470" height="330" rx="4" fill="${COLORS.panelBg}" stroke="#1e3a5f" stroke-width="1.2"/>
    <rect width="470" height="24" rx="4" fill="#0f233f"/>
    <text x="12" y="16" fill="${COLORS.axis}" font-family="monospace" font-size="11" font-weight="bold">SECCIONES TRANSVERSALES: COLUMNA C-1 (30×30) &amp; PEDESTAL (40×40)</text>

    <!-- 30x30 Column at (125, 168), box 156x156 -->
    <rect x="47" y="90" width="156" height="156" fill="url(#concHatch)" stroke="${COLORS.concrete}" stroke-width="1.8"/>
    <!-- Closed #3 Hoop -->
    <rect x="68" y="111" width="114" height="114" rx="5" fill="none" stroke="${COLORS.rebarConf}" stroke-width="3"/>
    <!-- 135° inward seismic hooks at top-right corner -->
    <line x1="176" y1="115" x2="152" y2="139" stroke="${COLORS.rebarConf}" stroke-width="2.6"/>
    <line x1="180" y1="120" x2="156" y2="144" stroke="${COLORS.rebarConf}" stroke-width="2.6"/>
    <!-- Crossties -->
    <line x1="125" y1="111" x2="125" y2="225" stroke="${COLORS.rebarMesh}" stroke-width="2" stroke-dasharray="4 3"/>
    <line x1="68" y1="168" x2="182" y2="168" stroke="${COLORS.rebarMesh}" stroke-width="2" stroke-dasharray="4 3"/>
    <!-- 8 #4 Longitudinal Bars -->
    ${[
      [75, 118],
      [125, 118],
      [175, 118],
      [175, 168],
      [175, 218],
      [125, 218],
      [75, 218],
      [75, 168],
    ]
      .map(([bx, by]) => `<circle cx="${bx}" cy="${by}" r="6" fill="${COLORS.rebarMain}" stroke="#fff7ed" stroke-width="1"/>`)
      .join("")}
    <text x="125" y="72" fill="#f8fafc" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">COLUMNA C-1 (30 × 30 cm)</text>
    <text x="125" y="264" fill="${COLORS.rebarMain}" font-family="monospace" font-size="9.5" font-weight="bold" text-anchor="middle">8 #4 (Ø 1/2") • ρg = 1.15%</text>
    <text x="125" y="280" fill="${COLORS.rebarConf}" font-family="monospace" font-size="9" text-anchor="middle">E #3 + Crosstie 135° • rec. 40mm</text>

    <!-- 40x40 Pedestal at (345, 168), box 156x156 -->
    <rect x="267" y="90" width="156" height="156" fill="url(#concHatch)" stroke="${COLORS.rebarDowel}" stroke-width="1.8"/>
    <rect x="289" y="112" width="112" height="112" rx="5" fill="none" stroke="${COLORS.rebarConf}" stroke-width="2.6"/>
    <line x1="395" y1="116" x2="372" y2="139" stroke="${COLORS.rebarConf}" stroke-width="2.4"/>
    ${[
      [296, 119],
      [345, 119],
      [394, 119],
      [394, 168],
      [394, 217],
      [345, 217],
      [296, 217],
      [296, 168],
    ]
      .map(([bx, by]) => `<circle cx="${bx}" cy="${by}" r="5.5" fill="${COLORS.rebarDowel}" stroke="#ecfeff" stroke-width="1"/>`)
      .join("")}
    <text x="345" y="72" fill="#f8fafc" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">PEDESTAL PE (40 × 40 cm)</text>
    <text x="345" y="264" fill="${COLORS.rebarDowel}" font-family="monospace" font-size="9.5" font-weight="bold" text-anchor="middle">8 #4 Arranques (pata 0.25m)</text>
    <text x="345" y="280" fill="${COLORS.rebarConf}" font-family="monospace" font-size="9" text-anchor="middle">E #3 @ 10 cm • rec. 50mm suelo</text>
  </g>`;

  const auditPanel = renderPanelBox({
    x: 765,
    y: 382,
    w: 470,
    h: 308,
    title: "CUADRO DE COLUMNAS & VERIFICACIÓN SÍSMICA (NSR-10 / ACI 318)",
    lines: [
      `<text x="14" y="48" fill="${COLORS.axis}" font-family="monospace" font-size="10" font-weight="bold">ID          EJES            H (m)    REFUERZO Y ESTRIBOS</text>`,
      `<line x1="12" y1="56" x2="454" y2="56" stroke="#1e3a5f"/>`,
      `<text x="14" y="76" fill="#e2e8f0" font-family="monospace" font-size="9.8">C1,C2,C3    Eje A (1,2,3)   5.80     8#4 | E#3 Lo=50cm @10 / @20</text>`,
      `<text x="14" y="96" fill="#38bdf8" font-family="monospace" font-size="9.8">C4,C5,C6    Eje B Central   5.80     8#4 | E#3 Lo=50cm @10 / @20</text>`,
      `<text x="14" y="116" fill="#e2e8f0" font-family="monospace" font-size="9.8">C7,C8,C9    Eje C (1,2,3)   5.80     8#4 | E#3 Lo=50cm @10 / @20</text>`,
      `<line x1="12" y1="130" x2="454" y2="130" stroke="#1e3a5f"/>`,
      `<text x="14" y="152" fill="${COLORS.dim}" font-family="monospace" font-size="10" font-weight="bold">CRITERIOS SÍSMICOS C.21.3.5 / ACI 318-19 18.4.3:</text>`,
      `<text x="14" y="172" fill="#cbd5e1" font-family="monospace" font-size="9.5">✓ Cuantía longitudinal: ρg = 1.15% (entre 1.0% mín y 4.0% máx)</text>`,
      `<text x="14" y="192" fill="#cbd5e1" font-family="monospace" font-size="9.5">✓ Zona confinamiento Lo = max(30cm, H/6, 45cm) = 50 cm @ 10 cm</text>`,
      `<text x="14" y="212" fill="#cbd5e1" font-family="monospace" font-size="9.5">✓ Estribos continuos dentro de nudo vigas VE (+2.60 a +3.00)</text>`,
      `<text x="14" y="232" fill="#cbd5e1" font-family="monospace" font-size="9.5">✓ Ganchos sísmicos a 135° con remate ≥ 6db (75 mm)</text>`,
      `<text x="14" y="252" fill="#cbd5e1" font-family="monospace" font-size="9.5">✓ Traslapo en tercio central o base: Ld = 55 cm Clase B</text>`,
    ],
  });

  return renderCadShell({
    code: "EST-02",
    title: "COLUMNAS C-1 (30×30 cm) & PEDESTALES PE (40×40 cm)",
    subtitle: "ALZADOS N1–N2, CONFINAMIENTO Lo @ 10cm, NUDOS & SECCIONES DETALLADAS",
    matSummary: [
      "9 Columnas 30×30 (8 #4)",
      "Estribos #3 @ 10cm (Lo) / 20cm",
      "9 Pedestales 40×40 • Rec. 40/50mm",
    ],
    scale: "1:40 / 1:10",
    content: [
      datumLines,
      drawColumnElev({ cx: 155, topY: 5.8, title: "EXTERIORES A/C", tag: "C1,C2,C3,C7,C8,C9 (5.80m)" }),
      drawColumnElev({ cx: 365, topY: 5.8, title: "CENTRALES EJE B", tag: "C4, C5, C6 (5.80m • L-2)" }),
      sectionCol,
      auditPanel,
    ].join(""),
  });
}

// =============================================================================
// 5. EST-03: VIGAS (VC, VE, VCU) & DETALLE CUBIERTA LOSA RC 1% + ANTEPECHO + BAJANTE
// =============================================================================
export function buildEst3BeamsSvg() {
  // 3 stacked horizontal elevation strips on Left (x=42..830), cross-sections on Right (x=845..1240)
  const drawTwoSpanElevation = ({ x0, yTop, wTotal, hVis, title, beamCode, topText, botText, extraTop = false, loTag, secDim }) => {
    const x1 = x0 + 55;
    const xEnd = x0 + wTotal - 20;
    const xMid = (x1 + xEnd) / 2;
    const yBot = yTop + hVis;
    const spanPx = xEnd - x1;

    // Generate dense Lo stirrups near x1, xMid, xEnd & wider spacing mid-bays
    const stirrups = [];
    const addBand = (a, b, step, color) => {
      for (let x = a; x <= b; x += step) {
        stirrups.push(`<line x1="${x}" y1="${yTop + 5}" x2="${x}" y2="${yBot - 5}" stroke="${color}" stroke-width="1.3"/>`);
      }
    };
    const loPx = spanPx * 0.14;
    addBand(x1 + 8, x1 + loPx, 9, COLORS.rebarConf);
    addBand(x1 + loPx + 12, xMid - loPx - 12, 18, COLORS.rebarMesh);
    addBand(xMid - loPx, xMid + loPx, 9, COLORS.rebarConf);
    addBand(xMid + loPx + 12, xEnd - loPx - 12, 18, COLORS.rebarMesh);
    addBand(xEnd - loPx, xEnd - 8, 9, COLORS.rebarConf);

    return `<g>
      <text x="${x1}" y="${yTop - 16}" fill="${COLORS.axis}" font-family="monospace" font-size="11" font-weight="bold">${esc(title)}</text>
      <text x="${xEnd}" y="${yTop - 16}" fill="${COLORS.dim}" font-family="monospace" font-size="9.5" text-anchor="end">${esc(secDim)}</text>

      <!-- Support column stubs -->
      <rect x="${x1 - 12}" y="${yTop - 10}" width="24" height="${hVis + 24}" fill="#12233b" stroke="#475569" stroke-width="1"/>
      <rect x="${xMid - 12}" y="${yTop - 10}" width="24" height="${hVis + 24}" fill="#12233b" stroke="#475569" stroke-width="1"/>
      <rect x="${xEnd - 12}" y="${yTop - 10}" width="24" height="${hVis + 24}" fill="#12233b" stroke="#475569" stroke-width="1"/>
      <text x="${x1}" y="${yBot + 24}" fill="${COLORS.axis}" font-family="monospace" font-size="9" text-anchor="middle">EJE 1</text>
      <text x="${xMid}" y="${yBot + 24}" fill="${COLORS.axis}" font-family="monospace" font-size="9" text-anchor="middle">EJE 2</text>
      <text x="${xEnd}" y="${yBot + 24}" fill="${COLORS.axis}" font-family="monospace" font-size="9" text-anchor="middle">EJE 3</text>

      <!-- Beam concrete body -->
      <rect x="${x1 - 6}" y="${yTop}" width="${spanPx + 12}" height="${hVis}" fill="url(#concHatch)" stroke="${COLORS.concrete}" stroke-width="1.6"/>
      ${stirrups.join("")}

      <!-- Top & bottom continuous rebar w/ hooks -->
      <polyline points="${x1 - 2},${yTop + 18} ${x1 - 2},${yTop + 7} ${xEnd + 2},${yTop + 7} ${xEnd + 2},${yTop + 18}" fill="none" stroke="${COLORS.rebarMain}" stroke-width="2.4"/>
      <polyline points="${x1 - 2},${yBot - 18} ${x1 - 2},${yBot - 7} ${xEnd + 2},${yBot - 7} ${xEnd + 2},${yBot - 18}" fill="none" stroke="${COLORS.rebarMain}" stroke-width="2.4"/>

      ${
        extraTop
          ? `<line x1="${xMid - spanPx * 0.14}" y1="${yTop + 12}" x2="${xMid + spanPx * 0.14}" y2="${yTop + 12}" stroke="${COLORS.rebarConf}" stroke-width="2.8"/>
             <text x="${xMid}" y="${yTop - 4}" fill="${COLORS.rebarConf}" font-family="monospace" font-size="8.5" font-weight="bold" text-anchor="middle">+1 #5 BASTÓN NEG. (L=1.40m)</text>`
          : ""
      }

      <text x="${(x1 + xMid) / 2}" y="${yTop - 4}" fill="${COLORS.rebarMain}" font-family="monospace" font-size="8.5" text-anchor="middle">${esc(topText)}</text>
      <text x="${(x1 + xMid) / 2}" y="${yBot + 14}" fill="${COLORS.rebarMain}" font-family="monospace" font-size="8.5" text-anchor="middle">${esc(botText)}</text>
      <text x="${(xMid + xEnd) / 2}" y="${yBot + 14}" fill="${COLORS.rebarMesh}" font-family="monospace" font-size="8.5" text-anchor="middle">${esc(loTag)}</text>
      <text x="${x1 - 20}" y="${yTop + hVis / 2 + 4}" fill="${COLORS.axis}" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">${esc(beamCode)}</text>
    </g>`;
  };

  // Band 3: Flat 1%-Sloped RC Roof Slab L-2 (A -> B -> C) + 1.00m Parapet + Alfajía + 4" PVC Downspout
  const roofElevation = `<g transform="translate(42, 415)">
    <rect width="785" height="270" rx="4" fill="${COLORS.panelBg}" stroke="#1e3a5f" stroke-width="1.2"/>
    <text x="14" y="20" fill="${COLORS.axis}" font-family="monospace" font-size="11" font-weight="bold">CORTE CUBIERTA LOSA RC L-2 (+5.80m) • PEND. 1% • ANTEPECHO 1.00m • ALFAJÍA &amp; BAJANTE PVC 4"</text>

    <!-- Columns stubs A (-3.5), B (0.0), C (+3.5) mapped across Z in [-4.5, +4.3] -> x in [60..735] -->
    ${(() => {
      const rx = (wz) => 405 + wz * 76;
      const ry = (wy) => 228 - (wy - 5.0) * 84; // 5.00->228, 5.80->160.8, 6.80->76.8, 6.87->70.9
      const yBeamBot = ry(5.5);
      const ySlabBot = ry(5.68);
      const yDeck = ry(5.8);
      const yScrRear = ry(5.82);
      const yScrFront = ry(5.89);
      const yParTop = ry(6.8);
      const yAlfTop = ry(6.87);

      return `
        <!-- Axes -->
        <line x1="${rx(-3.5)}" y1="44" x2="${rx(-3.5)}" y2="250" stroke="${COLORS.axis}" stroke-width="0.9" stroke-dasharray="4 3"/>
        <line x1="${rx(0)}" y1="44" x2="${rx(0)}" y2="250" stroke="${COLORS.axis}" stroke-width="0.9" stroke-dasharray="4 3"/>
        <line x1="${rx(3.5)}" y1="44" x2="${rx(3.5)}" y2="250" stroke="${COLORS.axis}" stroke-width="0.9" stroke-dasharray="4 3"/>
        <text x="${rx(-3.5)}" y="261" fill="${COLORS.axis}" font-family="monospace" font-size="9.5" text-anchor="middle">EJE A (-3.50)</text>
        <text x="${rx(0)}" y="261" fill="${COLORS.axis}" font-family="monospace" font-size="9.5" text-anchor="middle">EJE B (0.00)</text>
        <text x="${rx(3.5)}" y="261" fill="${COLORS.axis}" font-family="monospace" font-size="9.5" text-anchor="middle">EJE C (+3.50)</text>

        <!-- Concrete Column Tops + VCU Beams at +5.80 m -->
        <rect x="${rx(-3.5) - 11}" y="${yBeamBot}" width="22" height="58" fill="url(#concHatch)" stroke="${COLORS.concrete}"/>
        <rect x="${rx(0) - 11}" y="${yBeamBot}" width="22" height="58" fill="url(#concHatch)" stroke="${COLORS.concrete}"/>
        <rect x="${rx(3.5) - 11}" y="${yBeamBot}" width="22" height="58" fill="url(#concHatch)" stroke="${COLORS.concrete}"/>

        <!-- Longitudinal Beam VCU & Solid Roof Slab L-2 (e=12cm, +5.68 -> +5.80) -->
        <rect x="${rx(-3.65)}" y="${yBeamBot}" width="${rx(3.65) - rx(-3.65)}" height="${yDeck - yBeamBot}" fill="#0f233f" stroke="${COLORS.concrete}" stroke-width="1.2"/>
        <rect x="${rx(-3.65)}" y="${ySlabBot}" width="${rx(3.65) - rx(-3.65)}" height="${yDeck - ySlabBot}" fill="url(#concHatch)" stroke="${COLORS.rebarMesh}" stroke-width="1.4"/>
        <!-- Bidirectional #3 Slab Steel & VCU beam steel -->
        <line x1="${rx(-3.58)}" y1="${ySlabBot + 3}" x2="${rx(3.58)}" y2="${ySlabBot + 3}" stroke="${COLORS.rebarMesh}" stroke-width="1.8"/>
        <line x1="${rx(-3.58)}" y1="${yBeamBot + 22}" x2="${rx(3.58)}" y2="${yBeamBot + 22}" stroke="${COLORS.rebarMain}" stroke-width="1.6"/>

        <!-- 1% Sloped Waterproof Mortar Screed (Eje C +5.89 -> Eje A +5.82) -->
        <polygon points="${rx(-3.5)},${yDeck} ${rx(3.5)},${yDeck} ${rx(3.5)},${yScrFront} ${rx(-3.5)},${yScrRear}" fill="${COLORS.waterproof}" fill-opacity="0.72" stroke="#38bdf8" stroke-width="1.5"/>
        <line x1="${rx(2.2)}" y1="${yScrFront - 14}" x2="${rx(-2.2)}" y2="${yScrRear - 14}" stroke="#38bdf8" stroke-width="1.6"/>
        <polygon points="${rx(-2.35)},${yScrRear - 14} ${rx(-2.1)},${yScrRear - 18} ${rx(-2.1)},${yScrRear - 10}" fill="#38bdf8"/>
        <text x="${rx(0)}" y="${yScrFront - 20}" fill="#38bdf8" font-family="monospace" font-size="9.5" font-weight="bold" text-anchor="middle">PENDIENTE 1.0% HACIA DESAGÜE (+5.89 → +5.82 m)</text>

        <!-- 1.00 m CMU Bloque No. 12 Parapet Walls at Rear (A) & Front (C) (+5.80 -> +6.80) -->
        <rect x="${rx(-3.65)}" y="${yParTop}" width="18" height="${yDeck - yParTop}" fill="#334155" stroke="#cbd5e1" stroke-width="1.2"/>
        <rect x="${rx(3.5) - 6}" y="${yParTop}" width="18" height="${yDeck - yParTop}" fill="#334155" stroke="#cbd5e1" stroke-width="1.2"/>

        <!-- Continuous Alfajía Coping (+6.80 -> +6.87, overhanging drip edge) -->
        <polygon points="${rx(-3.71)},${yParTop} ${rx(-3.41)},${yParTop} ${rx(-3.41)},${yAlfTop + 2} ${rx(-3.56)},${yAlfTop} ${rx(-3.71)},${yAlfTop + 2}" fill="${COLORS.alfajia}" stroke="#94a3b8" stroke-width="1"/>
        <polygon points="${rx(3.43)},${yParTop} ${rx(3.72)},${yParTop} ${rx(3.72)},${yAlfTop + 2} ${rx(3.57)},${yAlfTop} ${rx(3.43)},${yAlfTop + 2}" fill="${COLORS.alfajia}" stroke="#94a3b8" stroke-width="1"/>

        <!-- Dimension h = 1.00 m Parapet & Alfajía labels -->
        <line x1="${rx(3.88)}" y1="${yParTop}" x2="${rx(3.88)}" y2="${yDeck}" stroke="${COLORS.dim}" stroke-width="1.1"/>
        <line x1="${rx(3.84)}" y1="${yParTop}" x2="${rx(3.92)}" y2="${yParTop}" stroke="${COLORS.dim}"/>
        <line x1="${rx(3.84)}" y1="${yDeck}" x2="${rx(3.92)}" y2="${yDeck}" stroke="${COLORS.dim}"/>
        <text x="${rx(3.96)}" y="${(yParTop + yDeck) / 2 + 3}" fill="${COLORS.dim}" font-family="monospace" font-size="8.5">H=1.00m</text>
        <text x="${rx(3.57)}" y="${yAlfTop - 7}" fill="${COLORS.alfajia}" font-family="monospace" font-size="8.5" font-weight="bold" text-anchor="middle">ALFAJÍA c/ GOTERO</text>

        <!-- Tragante 4" + Horizontal Stub + Vertical 4" Sanitary PVC Downspout BLL-1 (at rear left) -->
        <rect x="${rx(-3.46)}" y="${yScrRear - 5}" width="12" height="6" fill="#0f172a" stroke="${COLORS.pvcPipe}" stroke-width="1.2"/>
        <rect x="${rx(-3.92)}" y="${yDeck - 6}" width="52" height="10" fill="${COLORS.pvcPipe}" stroke="#0f172a" stroke-width="0.9"/>
        <rect x="${rx(-3.92)}" y="${yDeck - 4}" width="11" height="92" fill="${COLORS.pvcPipe}" stroke="#0f172a" stroke-width="0.9"/>
        <text x="${rx(-4.04)}" y="${yBeamBot + 24}" fill="${COLORS.pvcPipe}" font-family="monospace" font-size="8.5" font-weight="bold" text-anchor="end">BAJANTE PVC</text>
        <text x="${rx(-4.04)}" y="${yBeamBot + 36}" fill="${COLORS.pvcPipe}" font-family="monospace" font-size="8.5" font-weight="bold" text-anchor="end">4" BLL-1</text>
        <text x="${rx(-3.56)}" y="${yAlfTop - 7}" fill="${COLORS.alfajia}" font-family="monospace" font-size="8.5" font-weight="bold" text-anchor="middle">ALFAJÍA (+6.87m)</text>
      `;
    })()}
  </g>`;

  // Right Side: Cross Sections VE 30x40, VC 30x35, VCU 25x30 & Waterproofing + Alfajía + 4" Drain Detail
  const drawBeamSection = (x, y, code, dimText, topLabel, botLabel, hasMidBot, hasExtraTop, coverMm) => `
    <g transform="translate(${x}, ${y})">
      <rect width="188" height="180" rx="4" fill="#0c182c" stroke="#1e3a5f"/>
      <text x="94" y="18" fill="${COLORS.axis}" font-family="monospace" font-size="10.5" font-weight="bold" text-anchor="middle">${esc(code)} (${esc(dimText)})</text>
      <rect x="64" y="34" width="60" height="82" fill="url(#concHatch)" stroke="${COLORS.concrete}" stroke-width="1.5"/>
      <rect x="72" y="42" width="44" height="66" rx="4" fill="none" stroke="${COLORS.rebarConf}" stroke-width="2.2"/>
      <circle cx="77" cy="47" r="4.5" fill="${COLORS.rebarMain}"/><circle cx="111" cy="47" r="4.5" fill="${COLORS.rebarMain}"/>
      ${hasExtraTop ? `<circle cx="94" cy="47" r="4.5" fill="${COLORS.rebarConf}"/>` : ""}
      <circle cx="77" cy="103" r="4.5" fill="${COLORS.rebarMain}"/><circle cx="111" cy="103" r="4.5" fill="${COLORS.rebarMain}"/>
      ${hasMidBot ? `<circle cx="94" cy="103" r="4.2" fill="${COLORS.rebarMain}"/>` : ""}
      <text x="94" y="135" fill="${COLORS.rebarMain}" font-family="monospace" font-size="8.5" text-anchor="middle">Sup: ${esc(topLabel)}</text>
      <text x="94" y="150" fill="${COLORS.rebarMain}" font-family="monospace" font-size="8.5" text-anchor="middle">Inf: ${esc(botLabel)}</text>
      <text x="94" y="166" fill="#94a3b8" font-family="monospace" font-size="8" text-anchor="middle">Rec. ${coverMm}mm • E #3 135°</text>
    </g>`;

  const roofDetailSection = `<g transform="translate(1042, 434)">
    <rect width="188" height="240" rx="4" fill="#0c182c" stroke="#1e3a5f"/>
    <text x="94" y="19" fill="${COLORS.axis}" font-family="monospace" font-size="9.8" font-weight="bold" text-anchor="middle">DETALLE BORDE CUBIERTA</text>
    <text x="94" y="33" fill="${COLORS.dim}" font-family="monospace" font-size="8.5" text-anchor="middle">ANTEPECHO + ALFAJÍA + 4"</text>
    <!-- VCU Beam + L-2 Slab + 1% Screed + Parapet Wall + Alfajía Drip -->
    <rect x="34" y="140" width="44" height="52" fill="url(#concHatch)" stroke="${COLORS.concrete}" stroke-width="1.3"/>
    <rect x="78" y="140" width="84" height="24" fill="url(#concHatch)" stroke="${COLORS.rebarMesh}" stroke-width="1.3"/>
    <!-- 1% Screed sloped -->
    <polygon points="78,140 162,140 162,126 78,132" fill="${COLORS.waterproof}" stroke="#38bdf8" stroke-width="1.1"/>
    <!-- Masonry Parapet -->
    <rect x="42" y="62" width="28" height="78" fill="#334155" stroke="#cbd5e1" stroke-width="1.2"/>
    <!-- Alfajía overhang -->
    <polygon points="32,62 80,62 80,52 56,47 32,52" fill="${COLORS.alfajia}" stroke="#94a3b8" stroke-width="1.1"/>
    <!-- 4" PVC collector & riser -->
    <rect x="18" y="128" width="60" height="10" fill="${COLORS.pvcPipe}" stroke="#0f172a" stroke-width="0.9"/>
    <rect x="18" y="130" width="10" height="62" fill="${COLORS.pvcPipe}" stroke="#0f172a" stroke-width="0.9"/>
    <text x="86" y="54" fill="${COLORS.alfajia}" font-family="monospace" font-size="8">Alfajía Gotero</text>
    <text x="86" y="88" fill="#cbd5e1" font-family="monospace" font-size="8">Bloque N°12</text>
    <text x="86" y="100" fill="#cbd5e1" font-family="monospace" font-size="8">Antepecho 1.0m</text>
    <text x="94" y="210" fill="#38bdf8" font-family="monospace" font-size="8.2" text-anchor="middle">Pend. 1% + Imperm. + L-2</text>
    <text x="94" y="226" fill="${COLORS.pvcPipe}" font-family="monospace" font-size="8.2" text-anchor="middle">Tragante &amp; PVC San. Ø 4"</text>
  </g>`;

  return renderCadShell({
    code: "EST-03",
    title: "DESPIECE VIGAS VC/VE/VCU & DETALLE CUBIERTA LOSA RC 1%",
    subtitle: "VIGAS VC 30×35, VE 30×40 (BASTÓN NEG.), VCU 25×30, ANTEPECHO 1.0m & BAJANTE 4\"",
    matSummary: [
      "VE 30×40: 2#5 (+1#5) / 3#4",
      "VC 30×35: 4#5 | VCU 25×30: 4#4",
      "L-2 1% + Alfajía + PVC San. 4\"",
    ],
    scale: "1:50 / 1:10",
    content: [
      drawTwoSpanElevation({
        x0: 42,
        yTop: 68,
        wTotal: 785,
        hVis: 84,
        title: "VIGA AÉREA DE ENTREPISO VE (EJES A,B,C & 1,2,3 — 2 LUCES CONTINUAS)",
        beamCode: "VE",
        topText: "2 #5 Sup. Continuos",
        botText: "3 #4 Inf. Continuos",
        extraTop: true,
        loTag: "Est. #3 (135°) Lo=80cm @ 9cm | Centro @ 15cm",
        secDim: "30 × 40 cm • rec. 40mm",
      }),
      drawTwoSpanElevation({
        x0: 42,
        yTop: 238,
        wTotal: 785,
        hVis: 76,
        title: "VIGA DE CIMENTACIÓN VC (EJES A,B,C & 1,2,3)",
        beamCode: "VC",
        topText: "2 #5 Sup. Continuos",
        botText: "2 #5 Inf. Continuos",
        extraTop: false,
        loTag: "Est. #3 (135°) Lo=70cm @ 10cm | Centro @ 15cm",
        secDim: "30 × 35 cm • rec. 50mm",
      }),
      roofElevation,
      renderPanelBox({
        x: 838,
        y: 38,
        w: 404,
        h: 652,
        title: "SECCIONES VIGAS & DETALLE BORDE CUBIERTA",
        lines: [],
      }),
      drawBeamSection(846, 70, "VIGA VE", "30×40 cm", "2 #5 + 1 #5", "3 #4", true, true, 40),
      drawBeamSection(1042, 70, "VIGA VC", "30×35 cm", "2 #5 Cont.", "2 #5 Cont.", false, false, 50),
      drawBeamSection(846, 260, "VIGA VCU", "25×30 cm", "2 #4 Cont.", "2 #4 Cont.", false, false, 40),
      `<g transform="translate(1042, 260)">
        <rect width="188" height="162" rx="4" fill="#0c182c" stroke="#1e3a5f"/>
        <text x="94" y="20" fill="${COLORS.axis}" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle">CUADRO ESTRIBOS Y ACERO</text>
        <line x1="12" y1="28" x2="176" y2="28" stroke="#1e3a5f"/>
        <text x="12" y="48" fill="#cbd5e1" font-family="monospace" font-size="8.5">• VC 30×35: Lo=70cm @10/@15</text>
        <text x="12" y="68" fill="#cbd5e1" font-family="monospace" font-size="8.5">• VE 30×40: Lo=80cm @9/@15</text>
        <text x="12" y="88" fill="#cbd5e1" font-family="monospace" font-size="8.5">• VCU A..C/1..3: @7/@13</text>
        <text x="12" y="110" fill="${COLORS.rebarConf}" font-family="monospace" font-size="8.5">• Gancho sísmico: 135° (6db)</text>
        <text x="12" y="130" fill="${COLORS.dim}" font-family="monospace" font-size="8.5">• Concreto vigas: f'c=21/24 MPa</text>
        <text x="12" y="148" fill="#94a3b8" font-family="monospace" font-size="8.5">• Norma: NSR-10 C.21 / ACI318</text>
      </g>`,
      roofDetailSection,
    ].join(""),
  });
}

// =============================================================================
// 6. EST-04: LOSA MACIZA L-1 (e=12cm), BALCÓN LV-1 & ESCALERA ESC-1 c/ ACERO
// =============================================================================
export function buildEst4SlabsStairSvg() {
  const ox = 415;
  const oy = 355;
  const scale = 54;
  const px = (wx) => ox + wx * scale;
  const py = (wz) => oy + wz * scale;
  const s = PORTICO_SPEC;
  const fl = s.slabs.floorSlab;
  const bal = s.slabs.balcony;
  const vr = fl.void;

  // Concrete Floor 2 outline + Balcony + Void
  const slabBox = `<rect x="${px(fl.x0)}" y="${py(fl.z0)}" width="${(fl.x1 - fl.x0) * scale}" height="${(fl.z1 - fl.z0) * scale}" fill="#0c1d35" stroke="${COLORS.concrete}" stroke-width="1.6"/>
    <rect x="${px(bal.x0)}" y="${py(bal.z0)}" width="${(bal.x1 - bal.x0) * scale}" height="${(bal.z1 - bal.z0) * scale}" fill="#172840" stroke="${COLORS.rebarMain}" stroke-width="1.6"/>
    <rect x="${px(vr.x0)}" y="${py(vr.z0)}" width="${(vr.x1 - vr.x0) * scale}" height="${(vr.z1 - vr.z0) * scale}" fill="${COLORS.bg}" stroke="#ef4444" stroke-width="1.6"/>
    <line x1="${px(vr.x0)}" y1="${py(vr.z0)}" x2="${px(vr.x1)}" y2="${py(vr.z1)}" stroke="#ef4444" stroke-width="1" stroke-dasharray="4 3"/>
    <line x1="${px(vr.x1)}" y1="${py(vr.z0)}" x2="${px(vr.x0)}" y2="${py(vr.z1)}" stroke="#ef4444" stroke-width="1" stroke-dasharray="4 3"/>
    <text x="${px((vr.x0 + vr.x1) / 2)}" y="${py((vr.z0 + vr.z1) / 2)}" fill="#fca5a5" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">HUECO ESCALERA</text>`;

  // Representative Rebar bands on Plan:
  // 1) Bottom bidirectional #3 @ 0.20 (shown neatly with spanning indicator arrows & cross bars)
  const botMesh = `<g stroke="${COLORS.rebarMesh}" stroke-width="1.3">
    <!-- X-Span Bay West -->
    <line x1="${px(-3.8)}" y1="${py(-1.75)}" x2="${px(-0.2)}" y2="${py(-1.75)}" stroke-dasharray="6 2"/>
    <line x1="${px(-2.0)}" y1="${py(-3.3)}" x2="${px(-2.0)}" y2="${py(-0.2)}" stroke-dasharray="6 2"/>
    <text x="${px(-2.0)}" y="${py(-2.1)}" fill="${COLORS.rebarMesh}" stroke="none" font-family="monospace" font-size="8.5" font-weight="bold" text-anchor="middle">PARRILLA INF. #3 @ 0.20 A/S</text>
    <!-- Front East Bay -->
    <line x1="${px(0.2)}" y1="${py(1.75)}" x2="${px(3.8)}" y2="${py(1.75)}"/>
    <line x1="${px(2.0)}" y1="${py(0.2)}" x2="${px(2.0)}" y2="${py(3.3)}"/>
    <text x="${px(2.0)}" y="${py(1.5)}" fill="${COLORS.rebarMesh}" stroke="none" font-family="monospace" font-size="8.5" font-weight="bold" text-anchor="middle">PARRILLA INF. #3 @ 0.20 A/S</text>
  </g>`;

  // 2) Top negative bastones over interior beams B (z=0) & 2 (x=0)
  const negBastones = [];
  for (let x = -3.7; x <= 3.7; x += 0.45) {
    negBastones.push(`<line x1="${px(x)}" y1="${py(-1.0)}" x2="${px(x)}" y2="${py(1.0)}" stroke="${COLORS.rebarConf}" stroke-width="1.1" opacity="0.8"/>`);
  }
  for (let z = -3.2; z <= 3.2; z += 0.45) {
    if (z > vr.z0 && z < vr.z1) {
      negBastones.push(`<line x1="${px(-1.0)}" y1="${py(z)}" x2="${px(0.65)}" y2="${py(z)}" stroke="${COLORS.rebarConf}" stroke-width="1.1" opacity="0.8"/>`);
    } else {
      negBastones.push(`<line x1="${px(-1.0)}" y1="${py(z)}" x2="${px(1.0)}" y2="${py(z)}" stroke="${COLORS.rebarConf}" stroke-width="1.1" opacity="0.8"/>`);
    }
  }
  negBastones.push(`<rect x="${px(-2.4)}" y="${py(0.38)}" width="${px(2.4) - px(-2.4)}" height="16" rx="2" fill="${COLORS.paper}" fill-opacity="0.95" stroke="#1e3a5f" stroke-width="0.8"/>`);
  negBastones.push(`<text x="${px(0)}" y="${py(0.56)}" fill="${COLORS.rebarConf}" font-family="monospace" font-size="8.5" font-weight="bold" text-anchor="middle">BASTONES NEG. SUP. #3 @ 0.20 (L=2.00m Ejes B y 2)</text>`);

  // 3) Trimmer bars around void + Cantilever Balcony Top #4 @ 0.20 extending 1.50m into L-1
  const balconyRebarPlan = [];
  for (let x = -3.8; x <= 3.8; x += 0.42) {
    balconyRebarPlan.push(`<line x1="${px(x)}" y1="${py(2.15)}" x2="${px(x)}" y2="${py(4.62)}" stroke="${COLORS.rebarMain}" stroke-width="1.5"/>`);
  }
  balconyRebarPlan.push(`<line x1="${px(-4.05)}" y1="${py(4.0)}" x2="${px(4.05)}" y2="${py(4.0)}" stroke="${COLORS.rebarMesh}" stroke-width="1.2"/>`);
  balconyRebarPlan.push(`<line x1="${px(-4.05)}" y1="${py(4.35)}" x2="${px(4.05)}" y2="${py(4.35)}" stroke="${COLORS.rebarMesh}" stroke-width="1.2"/>`);
  balconyRebarPlan.push(`<rect x="${px(-2.8)}" y="${py(2.75)}" width="${px(2.8) - px(-2.8)}" height="16" fill="${COLORS.paper}" fill-opacity="0.88"/>`);
  balconyRebarPlan.push(`<text x="${px(0)}" y="${py(2.96)}" fill="${COLORS.rebarMain}" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">VOLADIZO BALCÓN LV-1: #4 @ 0.20 SUP. (ANCLAJE 1.50m EN L-1)</text>`);

  // Void edge 2#4 trimmer bars
  const trimmerSvg = `<line x1="${px(0.3)}" y1="${py(vr.z1 + 0.08)}" x2="${px(3.95)}" y2="${py(vr.z1 + 0.08)}" stroke="${COLORS.rebarMain}" stroke-width="2.2"/>
    <line x1="${px(vr.x0 - 0.08)}" y1="${py(-3.4)}" x2="${px(vr.x0 - 0.08)}" y2="${py(-0.95)}" stroke="${COLORS.rebarMain}" stroke-width="2.2"/>`;

  // Right Panel Upper: Corte Balcón Voladizo LV-1
  const balconySection = `<g transform="translate(808, 38)">
    <rect width="432" height="255" rx="4" fill="${COLORS.panelBg}" stroke="#1e3a5f" stroke-width="1.2"/>
    <rect width="432" height="24" rx="4" fill="#0f233f"/>
    <text x="12" y="16" fill="${COLORS.axis}" font-family="monospace" font-size="11" font-weight="bold">CORTE BALCÓN EN VOLADIZO LV-1 (e=12 cm • ESC. 1:20)</text>

    <!-- Main slab L-1 (left) + VE-C Beam + Cantilever LV-1 (right) -->
    <rect x="28" y="112" width="160" height="28" fill="url(#concHatch)" stroke="${COLORS.concrete}" stroke-width="1.4"/>
    <rect x="188" y="112" width="52" height="82" fill="url(#concHatch)" stroke="${COLORS.concrete}" stroke-width="1.6"/>
    <rect x="240" y="112" width="142" height="28" fill="url(#concHatch)" stroke="${COLORS.rebarMain}" stroke-width="1.6"/>
    <!-- Railing Bar-1 -->
    <line x1="364" y1="54" x2="364" y2="112" stroke="#38bdf8" stroke-width="3"/>
    <text x="372" y="76" fill="#38bdf8" font-family="monospace" font-size="8.5" text-anchor="start">BARANDA</text>
    <text x="372" y="88" fill="#38bdf8" font-family="monospace" font-size="8.5" text-anchor="start">h=1.00 m</text>

    <!-- Top Negative #4 @ 20 anchored 1.50m back into L-1 w/ 90° downward tip hook -->
    <polyline points="42,118 375,118 375,134" fill="none" stroke="${COLORS.rebarMain}" stroke-width="2.8"/>
    <!-- Distribution #3 @ 25 dots -->
    ${[260, 295, 330, 362].map((dx) => `<circle cx="${dx}" cy="123" r="3" fill="${COLORS.rebarMesh}"/>`).join("")}
    <!-- Beam VE-C Section stirrup & bars -->
    <rect x="196" y="119" width="36" height="68" fill="none" stroke="${COLORS.rebarConf}" stroke-width="1.8"/>
    <circle cx="201" cy="124" r="3.5" fill="${COLORS.rebarMain}"/><circle cx="227" cy="124" r="3.5" fill="${COLORS.rebarMain}"/>
    <circle cx="201" cy="182" r="3.5" fill="${COLORS.rebarMain}"/><circle cx="227" cy="182" r="3.5" fill="${COLORS.rebarMain}"/>

    <!-- Dimensions -->
    <line x1="42" y1="92" x2="214" y2="92" stroke="${COLORS.dim}" stroke-width="1"/>
    <text x="128" y="87" fill="${COLORS.dim}" font-family="monospace" font-size="9" text-anchor="middle">ANCLAJE 1.50 m</text>
    <line x1="214" y1="92" x2="382" y2="92" stroke="${COLORS.rebarMain}" stroke-width="1"/>
    <text x="298" y="87" fill="${COLORS.rebarMain}" font-family="monospace" font-size="9" text-anchor="middle">1.20 m VOL.</text>

    <text x="214" y="212" fill="#e2e8f0" font-family="monospace" font-size="9.5" text-anchor="middle">Viga Borde VE-C (30×40)</text>
    <text x="216" y="232" fill="${COLORS.rebarMain}" font-family="monospace" font-size="9.5" font-weight="bold" text-anchor="middle">Acero Sup. #4 @ 0.20 m • Repart. #3 @ 0.25 m</text>
  </g>`;

  // Right Panel Middle: Corte Escalera ESC-1
  const stairSection = `<g transform="translate(808, 304)">
    <rect width="432" height="202" rx="4" fill="${COLORS.panelBg}" stroke="#1e3a5f" stroke-width="1.2"/>
    <rect width="432" height="22" rx="4" fill="#0f233f"/>
    <text x="12" y="15" fill="${COLORS.axis}" font-family="monospace" font-size="10.5" font-weight="bold">CORTE ESCALERA ESC-1 &amp; REFUERZO (ESC. 1:25)</text>

    <polygon points="48,154 176,92 238,92 238,106 176,106 62,166 48,166" fill="url(#concHatch)" stroke="${COLORS.concrete}" stroke-width="1.3"/>
    <polygon points="238,92 365,38 395,38 395,52 365,52 238,106" fill="url(#concHatch)" stroke="${COLORS.concrete}" stroke-width="1.3"/>
    <polyline points="42,161 180,96 246,96" fill="none" stroke="${COLORS.rebarMain}" stroke-width="2.2"/>
    <polyline points="170,104 236,104 368,48 402,48" fill="none" stroke="${COLORS.rebarMain}" stroke-width="2.2"/>
    <text x="50" y="182" fill="#e2e8f0" font-family="monospace" font-size="8.5">NPT +0.00</text>
    <text x="208" y="84" fill="${COLORS.axis}" font-family="monospace" font-size="8.5" text-anchor="middle">DESC. +1.50</text>
    <text x="380" y="34" fill="#e2e8f0" font-family="monospace" font-size="8.5" text-anchor="middle">NPT +3.00</text>
    <text x="216" y="192" fill="#cbd5e1" font-family="monospace" font-size="8.5" text-anchor="middle">Garganta 12cm • Long. #4 @ 0.15 • Rep. #3 @ 0.25</text>
  </g>`;

  // Right Panel Lower: Losa Cubierta L-2 (+5.80m, 8.30x7.30, Pendiente 1%, Rebar #3 @ 0.20 + Tragante 4")
  const roofSlabPanel = `<g transform="translate(808, 514)">
    <rect width="432" height="176" rx="4" fill="${COLORS.panelBg}" stroke="#1e3a5f" stroke-width="1.2"/>
    <rect width="432" height="22" rx="4" fill="#0f233f"/>
    <text x="12" y="15" fill="${COLORS.rebarMesh}" font-family="monospace" font-size="10.2" font-weight="bold">LOSA CUBIERTA L-2 (+5.80m • e=12cm • PEND. 1% • BAJANTE 4")</text>

    <!-- Mini Plan of L-2 Slab + 4-edge bastones + 1% drainage fall arrow to corner A/3 -->
    <rect x="20" y="34" width="128" height="106" fill="#0c1d35" stroke="${COLORS.concrete}" stroke-width="1.3"/>
    <line x1="20" y1="87" x2="148" y2="87" stroke="${COLORS.rebarConf}" stroke-width="1" stroke-dasharray="3 2"/>
    <line x1="84" y1="34" x2="84" y2="140" stroke="${COLORS.rebarConf}" stroke-width="1" stroke-dasharray="3 2"/>
    <line x1="34" y1="126" x2="136" y2="44" stroke="#38bdf8" stroke-width="1.8"/>
    <polygon points="140,41 130,44 135,51" fill="#38bdf8"/>
    <circle cx="140" cy="41" r="4.5" fill="${COLORS.pvcPipe}" stroke="#0f172a"/>
    <text x="84" y="154" fill="${COLORS.pvcPipe}" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">Pend. 1% → Tragante 4"</text>

    <text x="164" y="48" fill="${COLORS.rebarMain}" font-family="monospace" font-size="9.2" font-weight="bold">ARMADURA L-2 (SIN HUECO):</text>
    <text x="164" y="66" fill="#cbd5e1" font-family="monospace" font-size="8.8">• Parrilla Inf.: #3 @ 0.20 A/S</text>
    <text x="164" y="83" fill="#cbd5e1" font-family="monospace" font-size="8.8">• Bastones Sup.: #3 @ 0.20 (4 bordes)</text>
    <text x="164" y="100" fill="#cbd5e1" font-family="monospace" font-size="8.8">• Concreto L-2: f'c=24 MPa (7.27 m³)</text>
    <text x="164" y="117" fill="#38bdf8" font-family="monospace" font-size="8.8">• Afine Pend. 1%: +5.89 → +5.82 m</text>
    <text x="164" y="134" fill="${COLORS.pvcPipe}" font-family="monospace" font-size="8.8">• Bajante PVC San. Ø 4" + Antepecho 1m</text>
    <text x="164" y="154" fill="${COLORS.dim}" font-family="monospace" font-size="8.5">• Norma: NSR-10 C.13.3 / C.7.12</text>
  </g>`;

  return renderCadShell({
    code: "EST-04",
    title: "LOSAS L-1 / L-2 (CUBIERTA PEND. 1%), BALCÓN & ESCALERA",
    subtitle: "PARRILLAS #3 @ 0.20, BASTONES NEG. 4 BORDES L-2, VOLADIZO LV-1 & CORTE ESC-1",
    matSummary: [
      "L-1 & L-2 e=12cm f'c=24 MPa",
      "L-2: Pend. 1% + Bajante PVC 4\"",
      "Balcón #4@0.20 | ESC-1 #4@0.15",
    ],
    scale: "1:50 / 1:25",
    content: [
      drawPlanGrid({ ox, oy, scale, showBalconyDim: true, showRoofDashed: false }),
      slabBox,
      botMesh,
      negBastones.join(""),
      trimmerSvg,
      balconyRebarPlan.join(""),
      drawColumnsPlan({ ox, oy, scale }),
      balconySection,
      stairSection,
      roofSlabPanel,
    ].join(""),
  });
}

const toSvgDataUrl = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

/** Retorna los 6 planos constructivos generados directamente desde el modelo 3D PORTICO-2N. */
export function getPortico2nBlueprints() {
  return [
    {
      id: "p2n-arq-01",
      codigo: "ARQ-01",
      titulo: "Planta Arquitectónica Nivel 1 (NPT +0.00 m)",
      titulo_en: "Level 1 Architectural Floor Plan (Elev. +0.00 m)",
      disciplina: "Arquitectónico",
      revision: "Rev. 01 (Modelo 3D)",
      escala: "1:50",
      fecha: "2026-11-17",
      responsable: "JGM ConTech Engineering • OpenBIM",
      descripcion: "Distribución Nivel 1 en mampostería bloque N° 12 (Sala, Comedor, Cocina, Baño Social), vanos P-1/P-2, V-1..V-8 y arranque escalera ESC-1.",
      descripcion_en: "Level 1 floor plan with CMU No. 12 masonry (Living, Dining, Kitchen, Powder Room), doors/windows & U-stair ESC-1 start.",
      archivoImg: toSvgDataUrl(buildArq1Svg()),
      notaCalidad: "Aprobado IFC • ISO 19650",
    },
    {
      id: "p2n-arq-02",
      codigo: "ARQ-02",
      titulo: "Planta Nivel 2 (+3.00 m), Balcón & Losa Cubierta RC 1%",
      titulo_en: "Level 2 Plan (+3.00 m), Balcony & 1% Sloped RC Roof Deck",
      disciplina: "Arquitectónico",
      revision: "Rev. 02 (Modelo 3D)",
      escala: "1:50",
      fecha: "2026-11-18",
      responsable: "JGM ConTech Architecture • OpenBIM",
      descripcion: "Nivel 2 con 3 alcobas, baño, llegada ESC-1, balcón frontal (1.20 m) con PV-1, proyección de losa cubierta RC L-2 (pendiente 1%), antepecho h=1.00 m, alfajía y bajante PVC 4\".",
      descripcion_en: "Level 2 plan with 3 bedrooms, bath, stair ESC-1, 1.20 m front balcony w/ PV-1, RC roof slab L-2 (1% fall), 1.00 m parapet, alfajía coping & 4\" PVC downspout.",
      archivoImg: toSvgDataUrl(buildArq2Svg()),
      notaCalidad: "Aprobado IFC • ISO 19650",
    },
    {
      id: "p2n-est-01",
      codigo: "EST-01",
      titulo: "Planta de Cimentación — Zapatas Z-1..Z-3, Pedestales 40×40 y Vigas VC",
      titulo_en: "Foundations Plan — Spread Footings Z-1..Z-3, Pedestals & Grade Beams",
      disciplina: "Estructural",
      revision: "Rev. 01 (NSR-10 / ACI 318)",
      escala: "1:50 / 1:25",
      fecha: "2026-11-17",
      responsable: "JGM ConTech Structural • NSR-10 Tít. C",
      descripcion: "9 zapatas aisladas (Z-1/Z-2/Z-3) con parrillas #4/#5 @ 15 cm, pedestales 40×40 (8 #4 + E #3 @ 10 cm), vigas VC 30×35 cm y corte típico.",
      descripcion_en: "9 isolated footings (#4/#5 @ 6\" mat), 16\"×16\" pedestals (8 #4 + #3 @ 4\"), grade tie-beams VC 30×35 & typical foundation section.",
      archivoImg: toSvgDataUrl(buildEst1FoundationsSvg()),
      notaCalidad: "Aprobado Estructural",
    },
    {
      id: "p2n-est-02",
      codigo: "EST-02",
      titulo: "Columnas C-1 (30×30 cm) & Pedestales — Despiece Vertical y Estribos Sísmicos",
      titulo_en: "Structural Columns C-1 (12\"×12\") & Pedestals — Elevations & Seismic Hoops",
      disciplina: "Estructural",
      revision: "Rev. 02 (NSR-10 / ACI 318)",
      escala: "1:40 / 1:10",
      fecha: "2026-11-18",
      responsable: "JGM ConTech Structural • NSR-10 C.21",
      descripcion: "Alzados completos N1–N2 (C1..C9 H=5.80 m hasta Losa Cubierta L-2 + ref. antepecho/alfajía +6.80 m), Lo=50 cm @ 10 cm, nudo N2 y secciones 8 #4 + E #3 (135°).",
      descripcion_en: "Full L1–L2 elevations (C1..C9 H=5.80 m to RC Roof L-2 + +6.80 m parapet ref), Lo=20\" @ 4\" confinement hoops, L2 joint ties & 8 #4 + #3 135° sections.",
      archivoImg: toSvgDataUrl(buildEst2ColumnsSvg()),
      notaCalidad: "Aprobado Estructural",
    },
    {
      id: "p2n-est-03",
      codigo: "EST-03",
      titulo: "Vigas (VC, VE, VCU) & Detalle Cubierta Losa RC 1%, Antepecho, Alfajía y Bajante 4\"",
      titulo_en: "Grade, Floor & Roof Beams (VC, VE, VCU) + 1% Sloped RC Roof, Parapet & 4\" Drain",
      disciplina: "Estructural",
      revision: "Rev. 02 (NSR-10 / ACI 318)",
      escala: "1:50 / 1:10",
      fecha: "2026-11-18",
      responsable: "JGM ConTech Structural • NSR-10 Tít. C",
      descripcion: "Alzados vigas VE 30×40 (bastón neg. #5), VC 30×35, parrilla vigas cubierta VCU 25×30 (+5.80 m) y corte constructivo de Losa L-2 con pendiente 1%, bloque N°12 h=1.00 m, alfajía y bajante PVC 4\".",
      descripcion_en: "Longitudinal elevations for VE 30×40, VC 30×35, VCU 25×30 roof beams (+5.80 m) & detail section of L-2 slab w/ 1% slope, 1.00 m CMU parapet, alfajía & 4\" PVC drain.",
      archivoImg: toSvgDataUrl(buildEst3BeamsSvg()),
      notaCalidad: "Aprobado Estructural",
    },
    {
      id: "p2n-est-04",
      codigo: "EST-04",
      titulo: "Losas L-1 (Entrepiso) & L-2 (Cubierta Pend. 1%), Balcón LV-1 y Escalera ESC-1",
      titulo_en: "Slabs L-1 (L2 Floor) & L-2 (1% Sloped RC Roof), Balcony LV-1 & Stair ESC-1 Rebar",
      disciplina: "Estructural",
      revision: "Rev. 02 (NSR-10 / ACI 318)",
      escala: "1:50 / 1:25",
      fecha: "2026-11-18",
      responsable: "JGM ConTech Structural • NSR-10 C.13",
      descripcion: "Armadura bidireccional #3 @ 0.20 m en Losas L-1 (c/ hueco ESC-1) y L-2 (cubierta maciza + bastones 4 bordes + pendiente 1% hacia bajante 4\"), balcón #4 @ 0.20 m y corte escalera.",
      descripcion_en: "Bidirectional #3 @ 8\" steel for Slabs L-1 (w/ stair void) & L-2 (solid roof + 4-edge top strips + 1% slope to 4\" drain), #4 @ 8\" balcony top bars & stair section.",
      archivoImg: toSvgDataUrl(buildEst4SlabsStairSvg()),
      notaCalidad: "Aprobado Estructural",
    },
  ];
}
