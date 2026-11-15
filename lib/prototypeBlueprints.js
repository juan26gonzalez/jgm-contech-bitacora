/**
 * Generador vectorial SVG de planos prototipo para visualización en navegador.
 * Sin archivos binarios ni propiedad intelectual de terceros en el repositorio.
 */

const ESCAPE_XML_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};

const escapeXml = (val) =>
  String(val || '').replace(/[&<>"']/g, (ch) => ESCAPE_XML_MAP[ch]);

const DISCIPLINE_THEMES = {
  Estructural: { bg: '#0b1628', grid: '#1b3556', accent: '#38bdf8', line: '#7dd3fc' },
  Arquitectónico: { bg: '#0f172a', grid: '#1e293b', accent: '#34d399', line: '#6ee7b7' },
  Hidrosanitario: { bg: '#081b26', grid: '#164e63', accent: '#22d3ee', line: '#67e8f9' },
  Eléctrico: { bg: '#181426', grid: '#312e81', accent: '#fbbf24', line: '#fde68a' },
  'Cubierta / Envolvente': { bg: '#111827', grid: '#1f2937', accent: '#a78bfa', line: '#c4b5fd' },
};

/** Genera un plano CAD vectorial SVG para vista previa y zoom local. */
export function buildPrototypeSheetSvg({ code, title, spec, discipline = 'Estructural', zones = [] }) {
  const theme = DISCIPLINE_THEMES[discipline] || DISCIPLINE_THEMES.Estructural;
  const safeCode = escapeXml(code);
  const safeTitle = escapeXml(title);
  const safeSpec = escapeXml(spec);

  const z0 = escapeXml(zones[0] || 'ZONE A • AXIS 1-3');
  const z1 = escapeXml(zones[1] || 'ZONE B • AXIS 3-5');
  const z2 = escapeXml(zones[2] || 'CORE / CIRCULATION');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="620" viewBox="0 0 960 620">
    <rect width="960" height="620" fill="${theme.bg}"/>
    <g stroke="${theme.grid}" stroke-width="1">
      <line x1="0" y1="80" x2="960" y2="80"/><line x1="0" y1="160" x2="960" y2="160"/>
      <line x1="0" y1="240" x2="960" y2="240"/><line x1="0" y1="320" x2="960" y2="320"/>
      <line x1="0" y1="400" x2="960" y2="400"/><line x1="0" y1="480" x2="960" y2="480"/>
      <line x1="120" y1="0" x2="120" y2="620"/><line x1="280" y1="0" x2="280" y2="620"/>
      <line x1="440" y1="0" x2="440" y2="620"/><line x1="600" y1="0" x2="600" y2="620"/>
      <line x1="760" y1="0" x2="760" y2="620"/>
    </g>
    <rect x="28" y="28" width="904" height="564" fill="none" stroke="${theme.accent}" stroke-width="2"/>
    <g stroke="${theme.line}" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.65">
      <line x1="120" y1="68" x2="120" y2="455"/><line x1="390" y1="68" x2="390" y2="455"/>
      <line x1="650" y1="68" x2="650" y2="455"/><line x1="840" y1="68" x2="840" y2="455"/>
    </g>
    <g fill="${theme.bg}" stroke="${theme.accent}" stroke-width="1.5">
      <circle cx="120" cy="56" r="14"/><circle cx="390" cy="56" r="14"/>
      <circle cx="650" cy="56" r="14"/><circle cx="840" cy="56" r="14"/>
    </g>
    <g fill="${theme.line}" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">
      <text x="120" y="60">A</text><text x="390" y="60">B</text>
      <text x="650" y="60">C</text><text x="840" y="60">D</text>
    </g>
    <rect x="120" y="105" width="720" height="320" fill="none" stroke="${theme.line}" stroke-width="2.6"/>
    <line x1="390" y1="105" x2="390" y2="425" stroke="${theme.line}" stroke-width="2"/>
    <line x1="650" y1="105" x2="650" y2="425" stroke="${theme.line}" stroke-width="2"/>
    <line x1="120" y1="265" x2="840" y2="265" stroke="${theme.line}" stroke-width="1.4" stroke-dasharray="4 4"/>
    <rect x="110" y="95" width="20" height="20" fill="${theme.accent}" opacity="0.35" stroke="${theme.accent}"/>
    <rect x="380" y="95" width="20" height="20" fill="${theme.accent}" opacity="0.35" stroke="${theme.accent}"/>
    <rect x="640" y="95" width="20" height="20" fill="${theme.accent}" opacity="0.35" stroke="${theme.accent}"/>
    <rect x="830" y="95" width="20" height="20" fill="${theme.accent}" opacity="0.35" stroke="${theme.accent}"/>
    <rect x="110" y="415" width="20" height="20" fill="${theme.accent}" opacity="0.35" stroke="${theme.accent}"/>
    <rect x="380" y="415" width="20" height="20" fill="${theme.accent}" opacity="0.35" stroke="${theme.accent}"/>
    <rect x="640" y="415" width="20" height="20" fill="${theme.accent}" opacity="0.35" stroke="${theme.accent}"/>
    <rect x="830" y="415" width="20" height="20" fill="${theme.accent}" opacity="0.35" stroke="${theme.accent}"/>
    <text x="255" y="190" fill="${theme.line}" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">${z0}</text>
    <text x="520" y="190" fill="${theme.line}" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">${z1}</text>
    <text x="745" y="190" fill="${theme.line}" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">${z2}</text>
    <rect x="28" y="492" width="904" height="100" fill="#070e1a" stroke="${theme.accent}" stroke-width="1.5"/>
    <text x="52" y="530" fill="${theme.accent}" font-family="monospace" font-size="19" font-weight="bold">${safeCode} — ${safeTitle}</text>
    <text x="52" y="562" fill="#94a3b8" font-family="monospace" font-size="13">${safeSpec} | JGM CONTECH PROTOTYPE CAD SHEET (VECTOR)</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const PLANOS_CORPORATIVO = [
  {
    id: 'PROTO-EST-01',
    codigo: 'EST-01',
    titulo: 'Planta de Cimentación, Zapatas, Pedestales y Vigas de Enlace',
    titulo_en: 'Foundation Plan, Spread Footings, Pedestals & Grade Beams',
    disciplina: 'Estructural',
    revision: 'Rev. 01 (Prototipo)',
    escala: '1:50',
    fecha: '2026-10-15',
    responsable: 'JGM ConTech Engineering',
    descripcion: 'Esquema prototipo de zapatas aisladas, pedestales, foso y vigas de amarre f\'c = 24.5 MPa (NSR-10 / ACI 318).',
    descripcion_en: 'Prototype layout of isolated spread footings, pedestals, and grade beams f\'c = 3,550 PSI (NSR-10 / ACI 318).',
    archivoImg: buildPrototypeSheetSvg({
      code: 'EST-01',
      title: 'FOUNDATION & GRADE BEAMS',
      spec: "f'c = 24.5 MPa | Gr. 60 Rebar | Scale 1:50",
      discipline: 'Estructural',
      zones: ['FOOTINGS F1-F4', 'PEDESTAL GRID B-C', 'GRADE BEAMS'],
    }),
  },
  {
    id: 'PROTO-EST-02',
    codigo: 'EST-02',
    titulo: 'Plantas Estructurales — Entrepisos +3.00 m y +6.30 m',
    titulo_en: 'Structural Framing Plans — Levels +3.00 m & +6.30 m',
    disciplina: 'Estructural',
    revision: 'Rev. 02 (Prototipo)',
    escala: '1:50',
    fecha: '2026-10-20',
    responsable: 'JGM ConTech Engineering',
    descripcion: 'Pórticos en acero estructural IPE 300 / HEA 320, viguetas de entrepiso y lámina colaborante metaldeck.',
    descripcion_en: 'Structural steel IPE 300 / HEA 320 portal framing, secondary joists, and composite metaldeck slab.',
    archivoImg: buildPrototypeSheetSvg({
      code: 'EST-02',
      title: 'STEEL PORTAL & COMPOSITE DECK',
      spec: 'Columns HEA 320 | Beams IPE 300 | Metaldeck Cal. 22',
      discipline: 'Estructural',
      zones: ['LEVEL +3.00 DECK', 'FRAME GRID B-C', 'STAIR BAY +6.30'],
    }),
  },
  {
    id: 'PROTO-ARQ-01',
    codigo: 'ARQ-01',
    titulo: 'Planta Arquitectónica General — Edificio Corporativo Modelo',
    titulo_en: 'General Architectural Floor Plan — 3-Level Corporate Model',
    disciplina: 'Arquitectónico',
    revision: 'Rev. 01 (Prototipo)',
    escala: '1:75',
    fecha: '2026-10-18',
    responsable: 'JGM ConTech Architecture',
    descripcion: 'Zonificación prototipo de áreas operativas, sala de juntas, recepción, núcleo de servicios y circulaciones.',
    descripcion_en: 'Prototype architectural zoning for workspaces, meeting rooms, lobby, core restrooms, and circulation.',
    archivoImg: buildPrototypeSheetSvg({
      code: 'ARQ-01',
      title: 'ARCHITECTURAL FLOOR PLAN (MODEL)',
      spec: 'ISO 19650 Prototype | Scale 1:75 | Floor Areas',
      discipline: 'Arquitectónico',
      zones: ['RECEPTION & LOBBY', 'OPEN WORKSPACE', 'CORE & STAIRS'],
    }),
  },
  {
    id: 'PROTO-HID-01',
    codigo: 'HID-01',
    titulo: 'Redes Hidrosanitarias y Bajantes Pluviales (Esquema)',
    titulo_en: 'Plumbing & Storm Drainage Schematics',
    disciplina: 'Hidrosanitario',
    revision: 'Rev. 01 (Prototipo)',
    escala: '1:50',
    fecha: '2026-10-22',
    responsable: 'JGM ConTech MEP',
    descripcion: 'Esquema prototipo de trazado PVC sanitario 3"-4", ventilación, red de suministro y recolección pluvial.',
    descripcion_en: 'Prototype sanitary 3"-4" PVC piping layout, vent stacks, potable supply risers, and storm drainage.',
    archivoImg: buildPrototypeSheetSvg({
      code: 'HID-01',
      title: 'PLUMBING & STORM MEP LAYOUT',
      spec: 'PVC San 3"-4" | Slope 2% | Pressure Supply',
      discipline: 'Hidrosanitario',
      zones: ['WET CORE A', 'RISER SHAFT B', 'ROOF DRAIN LINE'],
    }),
  },
  {
    id: 'PROTO-ELE-01',
    codigo: 'ELE-01',
    titulo: 'Redes Eléctricas, Iluminación LED y Tablero TD-01',
    titulo_en: 'Electrical Lighting, Power & Panel TD-01 Plan',
    disciplina: 'Eléctrico',
    revision: 'Rev. 01 (Prototipo)',
    escala: '1:50',
    fecha: '2026-10-24',
    responsable: 'JGM ConTech MEP',
    descripcion: 'Distribución esquemática de alimentadores, circuitos regulados, luminarias LED y puesta a tierra.',
    descripcion_en: 'Schematic feeder layout, regulated circuits, LED panel lighting, and grounding grid.',
    archivoImg: buildPrototypeSheetSvg({
      code: 'ELE-01',
      title: 'LIGHTING, POWER & PANEL TD-01',
      spec: '3-Phase 208/120V | LED Panels | Surge Protection',
      discipline: 'Eléctrico',
      zones: ['ZONE A LIGHTING', 'POWER FEEDERS', 'MAIN PANEL TD-01'],
    }),
  },
];

const PLANOS_RESIDENCIAL = [
  {
    id: 'RES-ARQ-01',
    codigo: 'RES-ARQ-01',
    titulo: 'Planta Arquitectónica General — Vivienda Prototipo BIM 1.1',
    titulo_en: 'General Floor Plan — Residential Prototype BIM 1.1',
    disciplina: 'Arquitectónico',
    revision: 'Rev. 01 (BIM 1.1)',
    escala: '1:50',
    fecha: '2026-11-01',
    responsable: 'JGM ConTech BIM Team',
    descripcion: 'Planta arquitectónica prototipo generada desde modelo de referencia: mampostería, pisos, puertas, ventanas y distribución espacial.',
    descripcion_en: 'Prototype residential floor plan with masonry partitions, flooring, fenestration, and room schedule.',
    archivoImg: buildPrototypeSheetSvg({
      code: 'RES-ARQ-01',
      title: 'RESIDENTIAL PROTOTYPE FLOOR PLAN',
      spec: 'BIM 1.1 Model | Masonry & Finishes | Scale 1:50',
      discipline: 'Arquitectónico',
      zones: ['LIVING & KITCHEN', 'PRIMARY SUITE', 'BEDROOMS 1-3'],
    }),
  },
  {
    id: 'RES-EST-01',
    codigo: 'RES-EST-01',
    titulo: 'Plantilla de Piso e=7 cm y Refuerzo de Mampostería Confinada',
    titulo_en: 'Floor Sub-Slab t=2.75" & Confined Masonry Reinforcement',
    disciplina: 'Estructural',
    revision: 'Rev. 01 (BIM 1.1)',
    escala: '1:50',
    fecha: '2026-11-02',
    responsable: 'JGM ConTech Engineering',
    descripcion: 'Detalle constructivo prototipo de solado en concreto e=7 cm, dovelas verticales y viga de amarre superior.',
    descripcion_en: 'Prototype sub-slab concrete leveling detail, vertical masonry dowels, and perimeter collar beam.',
    archivoImg: buildPrototypeSheetSvg({
      code: 'RES-EST-01',
      title: 'SLAB & CONFINED MASONRY DETAIL',
      spec: 'Concrete Slab t=7cm | CMU No. 12 | Rebar #3/#4',
      discipline: 'Estructural',
      zones: ['SLAB BAY 1', 'CONFINED WALLS', 'COLLAR BEAM'],
    }),
  },
  {
    id: 'RES-CUB-01',
    codigo: 'RES-CUB-01',
    titulo: 'Cubierta Termoacústica, Cielo Raso Drywall y Aislamiento',
    titulo_en: 'Roof Deck, Suspended Drywall Ceiling & Insulation Plan',
    disciplina: 'Cubierta / Envolvente',
    revision: 'Rev. 01 (BIM 1.1)',
    escala: '1:75',
    fecha: '2026-11-05',
    responsable: 'JGM ConTech Envelope',
    descripcion: 'Esquema prototipo de cubierta inclinada, estructura metálica de soporte, cielo raso y manta termoacústica.',
    descripcion_en: 'Prototype sloped roofing layout, purlin framing, gypsum board ceiling grid, and thermal insulation.',
    archivoImg: buildPrototypeSheetSvg({
      code: 'RES-CUB-01',
      title: 'ROOF DECK & CEILING ASSEMBLY',
      spec: 'Slope 14% | Thermal Blanket 2-1/2" | Scale 1:75',
      discipline: 'Cubierta / Envolvente',
      zones: ['ROOF PURLINS', 'INSULATION ZONE', 'DRYWALL GRID'],
    }),
  },
];

/** Retorna los planos vectoriales prototipo según el proyecto activo. */
export function getPlanosPrototipoPorProyecto(proyectoActivo) {
  const source =
    proyectoActivo === 'proto_residencial' ? PLANOS_RESIDENCIAL : PLANOS_CORPORATIVO;
  return source.map((p) => ({
    ...p,
    archivoThumb: p.archivoImg,
    isPrototype: true,
  }));
}
