export const DEMO_SHOWCASE_PROJECT_ID = "demo_showcase";
export const DEMO_SESSION_STORAGE_KEY = "jgm_bitacora_demo_session_v1";

export const PROYECTO_DEMO_CONFIG = {
  id: DEMO_SHOWCASE_PROJECT_ID,
  nombre: "Northbridge Corporate Hub (BIM 5D Showcase)",
  nombre_corto: "Northbridge Hub (Demo)",
  cliente: "Northbridge Capital Partners",
  ubicacion: "Barranquilla / Miami / Madrid • ISO 19650",
  ciudad: "Barranquilla / Miami / Madrid",
  contratista: "JGM ConTech Engineering Team",
  interventoria: "Owner's Representative • ISO 19650",
  badge: "BIM 5D Showcase",
};

export const DEMO_CATALOGO_SHOWCASE = [
  {
    id: "[BIM_TAKEOFF] Concreto en zapatas y vigas de cimentación f'c=21 MPa",
    capitulo: "1. ESTRUCTURA & CIMENTACIÓN",
    unidad: "m³",
    cantidadPresupuesto: 28,
    apuCop: 695000,
    diarioMax: 4.5,
  },
  {
    id: "[BIM_TAKEOFF] Concreto en columnas y pórtico estructural f'c=24 MPa",
    capitulo: "1. ESTRUCTURA & CIMENTACIÓN",
    unidad: "m³",
    cantidadPresupuesto: 18,
    apuCop: 785000,
    diarioMax: 3.5,
  },
  {
    id: "[BIM_TAKEOFF] Muros en mampostería de bloques de concreto No. 12",
    capitulo: "2. MAMPOSTERÍA & PAÑETES",
    unidad: "m²",
    cantidadPresupuesto: 210,
    apuCop: 78000,
    diarioMax: 16.0,
  },
  {
    id: "[BIM_TAKEOFF] Pañete y mortero de revoco en muros dos caras",
    capitulo: "2. MAMPOSTERÍA & PAÑETES",
    unidad: "m²",
    cantidadPresupuesto: 420,
    apuCop: 38000,
    diarioMax: 24.0,
  },
  {
    id: "[BIM_TAKEOFF] Instalación de piso en porcelanato 51×51 cm y plantilla",
    capitulo: "3. PISOS & ENCHAPES",
    unidad: "m²",
    cantidadPresupuesto: 140,
    apuCop: 118000,
    diarioMax: 25.0,
  },
  {
    id: '[BIM_TAKEOFF] Cielo raso suspendido Drywall + Aislamiento Frescasa Eco 2-1/2"',
    capitulo: "4. CIELOS RASOS & FRESCASA",
    unidad: "m²",
    cantidadPresupuesto: 140,
    apuCop: 85000,
    diarioMax: 32.0,
  },
  {
    id: "[BIM_TAKEOFF] Estuco plástico y pintura vinílica arquitectónica en muros",
    capitulo: "5. CARPINTERÍA & PINTURA",
    unidad: "m²",
    cantidadPresupuesto: 420,
    apuCop: 34000,
    diarioMax: 30.0,
  },
  {
    id: "[BIM_TAKEOFF] Ventanería aluminio termoacústica y puertas interiores",
    capitulo: "5. CARPINTERÍA & PINTURA",
    unidad: "und",
    cantidadPresupuesto: 14,
    apuCop: 1150000,
    diarioMax: 4.0,
  },
  {
    id: "[BIM_TAKEOFF] Montaje de cubierta termoacústica Eternit y caballetes",
    capitulo: "6. CUBIERTA",
    unidad: "m²",
    cantidadPresupuesto: 155,
    apuCop: 98000,
    diarioMax: 28.0,
  },
];

// Inline SVG sample evidence card rendered cleanly for Demo QA/Report preview
const makeSampleInspectionSvg = (title, code, status, accent = "#10b981") => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
    </defs>
    <rect width="800" height="520" fill="url(#bg)"/>
    <g stroke="#334155" stroke-width="1" opacity="0.45">
      <line x1="0" y1="130" x2="800" y2="130"/>
      <line x1="0" y1="260" x2="800" y2="260"/>
      <line x1="0" y1="390" x2="800" y2="390"/>
      <line x1="200" y1="0" x2="200" y2="520"/>
      <line x1="400" y1="0" x2="400" y2="520"/>
      <line x1="600" y1="0" x2="600" y2="520"/>
    </g>
    <rect x="64" y="64" width="672" height="392" rx="16" fill="#0b1324" stroke="${accent}" stroke-width="2.5"/>
    <rect x="96" y="102" width="188" height="30" rx="6" fill="${accent}" opacity="0.18"/>
    <text x="110" y="122" fill="${accent}" font-family="monospace" font-size="14" font-weight="bold">ISO 19650 • BIM FIELD QA</text>
    <text x="96" y="190" fill="#f8fafc" font-family="sans-serif" font-size="28" font-weight="bold">${title}</text>
    <text x="96" y="226" fill="#94a3b8" font-family="monospace" font-size="16">Element ID: ${code} • Northbridge Corporate Hub</text>
    <rect x="96" y="268" width="608" height="106" rx="10" fill="#111c33" stroke="#334155"/>
    <polyline points="120,342 220,318 330,326 440,296 560,304 680,282" fill="none" stroke="${accent}" stroke-width="4"/>
    <circle cx="440" cy="296" r="6" fill="${accent}"/>
    <circle cx="680" cy="282" r="6" fill="${accent}"/>
    <text x="96" y="420" fill="#cbd5e1" font-family="monospace" font-size="14">QA STATUS: ${status} | GPS VERIFIED SANDBOX</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const IMG_FOUNDATIONS = makeSampleInspectionSvg(
  "Spread Footings & Grade Beams Pour",
  "STR-ZAP-F1-F6",
  "100% COMPLIANT f'c=21 MPa",
  "#10b981"
);
const IMG_COLUMNS = makeSampleInspectionSvg(
  "Structural Concrete Columns & Tie Beams",
  "STR-COL-A1-B3",
  "100% COMPLIANT f'c=24 MPa",
  "#38bdf8"
);
const IMG_MASONRY = makeSampleInspectionSvg(
  "CMU No. 12 Perimeter Masonry & Plaster",
  "ARC-MUR-N12",
  "ACTIVE PROGRESS 60.7%",
  "#f59e0b"
);
const IMG_ROOFING = makeSampleInspectionSvg(
  "Thermo-Acoustic Corrugated Roof Deck",
  "ENV-CUB-ET01",
  "100% WEATHERPROOFED",
  "#10b981"
);

export const DEMO_BITACORA_ROWS = [
  {
    id: 9001,
    fecha: "2026-10-28",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: "[BIM_TAKEOFF] Concreto en zapatas y vigas de cimentación f'c=21 MPa",
    cantidad_ejecutada: 14,
    cuadrilla: "Frente Estructura & Cimentación",
    clima: "Despejado / Soleado",
    observaciones: "Zona A — Pórticos & Cimentación | Excavación y fundida de zapatas Z-1 a Z-3, verificación de recubrimiento 7.5 cm",
    evidencia_foto: IMG_FOUNDATIONS,
    sync_status: "demo",
  },
  {
    id: 9002,
    fecha: "2026-10-31",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: "[BIM_TAKEOFF] Concreto en zapatas y vigas de cimentación f'c=21 MPa",
    cantidad_ejecutada: 14,
    cuadrilla: "Frente Estructura & Cimentación",
    clima: "Despejado / Soleado",
    observaciones: "Zona A — Pórticos & Cimentación | Excavación y fundida de zapatas Z-1 a Z-6 y vigas de amarre según planos",
    evidencia_foto: IMG_FOUNDATIONS,
    sync_status: "demo",
  },
  {
    id: 9003,
    fecha: "2026-11-02",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: "[BIM_TAKEOFF] Concreto en columnas y pórtico estructural f'c=24 MPa",
    cantidad_ejecutada: 9,
    cuadrilla: "Frente Estructura & Cimentación",
    clima: "Nublado",
    observaciones: "Zona A — Pórticos & Cimentación | Vaciado de columnas ejes A-B con vibrado mecánico y toma de cilindros QA",
    evidencia_foto: IMG_COLUMNS,
    sync_status: "demo",
  },
  {
    id: 9004,
    fecha: "2026-11-04",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: "[BIM_TAKEOFF] Concreto en columnas y pórtico estructural f'c=24 MPa",
    cantidad_ejecutada: 9,
    cuadrilla: "Frente Estructura & Cimentación",
    clima: "Despejado / Soleado",
    observaciones: "Zona A — Pórticos & Cimentación | Fundida de 6 columnas estructurales f'c=24 MPa y vigas cabezales",
    evidencia_foto: IMG_COLUMNS,
    sync_status: "demo",
  },
  {
    id: 9005,
    fecha: "2026-11-06",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: "[BIM_TAKEOFF] Muros en mampostería de bloques de concreto No. 12",
    cantidad_ejecutada: 105,
    cuadrilla: "Frente Envolvente, Pisos & Cubierta",
    clima: "Despejado / Soleado",
    observaciones: "Zona B — Envolvente & Acabados | Pegante mortero 1:4 y dovelas de refuerzo vertical",
    evidencia_foto: IMG_MASONRY,
    sync_status: "demo",
  },
  {
    id: 9006,
    fecha: "2026-11-08",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: "[BIM_TAKEOFF] Muros en mampostería de bloques de concreto No. 12",
    cantidad_ejecutada: 105,
    cuadrilla: "Frente Envolvente, Pisos & Cubierta",
    clima: "Nublado",
    observaciones: "Zona B — Envolvente & Acabados | Levante completo de muros perimetrales y divisorios bloque No. 12",
    evidencia_foto: IMG_MASONRY,
    sync_status: "demo",
  },
  {
    id: 9007,
    fecha: "2026-11-09",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: "[BIM_TAKEOFF] Pañete y mortero de revoco en muros dos caras",
    cantidad_ejecutada: 130,
    cuadrilla: "Frente Envolvente, Pisos & Cubierta",
    clima: "Despejado / Soleado",
    observaciones: "Lobby Principal | Plomado y maestreado de pañete liso interior e=1.5 cm",
    evidencia_foto: IMG_MASONRY,
    sync_status: "demo",
  },
  {
    id: 9008,
    fecha: "2026-11-10",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: "[BIM_TAKEOFF] Pañete y mortero de revoco en muros dos caras",
    cantidad_ejecutada: 125,
    cuadrilla: "Frente Envolvente, Pisos & Cubierta",
    clima: "Despejado / Soleado",
    observaciones: "Oficina Norte | Pañete interior y exterior completado al 60.7% acumulado",
    evidencia_foto: null,
    sync_status: "demo",
  },
  {
    id: 9009,
    fecha: "2026-11-11",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: "[BIM_TAKEOFF] Montaje de cubierta termoacústica Eternit y caballetes",
    cantidad_ejecutada: 155,
    cuadrilla: "Cuadrilla Metálica: 2 Montadores",
    clima: "Despejado / Soleado",
    observaciones: "Zona C — Cubierta & Carpintería | Instalación de estructura de cubierta, teja termoacústica y caballetes",
    evidencia_foto: IMG_ROOFING,
    sync_status: "demo",
  },
  {
    id: 9010,
    fecha: "2026-11-12",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: "[BIM_TAKEOFF] Instalación de piso en porcelanato 51×51 cm y plantilla",
    cantidad_ejecutada: 48,
    cuadrilla: "Frente Envolvente, Pisos & Cubierta",
    clima: "Nublado",
    observaciones: "Lobby Principal | Plantilla de nivelación y arranque de enchape en porcelanato 51×51 cm",
    evidencia_foto: IMG_MASONRY,
    sync_status: "demo",
  },
];

export const CRONOGRAMA_DEMO_SHOWCASE = [
  { id: "NB-0", wbs: "1", esResumen: true, critica: true, fase: "FASE 1 — ESTRUCTURA & MAMPOSTERÍA", actividad: "FASE 1 — ESTRUCTURA & MAMPOSTERÍA", inicio: "2026-10-24", fin: "2026-11-10", peso: 38, matchKeywords: [] },
  { id: "NB-1", wbs: "1.1", esResumen: false, critica: true, fase: "1. ESTRUCTURA & CIMENTACIÓN", actividad: "Zapatas y vigas de cimentación f'c=21 MPa", inicio: "2026-10-24", fin: "2026-10-31", peso: 14, matchKeywords: ["zapatas", "vigas de cimentacion"] },
  { id: "NB-2", wbs: "1.2", esResumen: false, critica: true, fase: "1. ESTRUCTURA & CIMENTACIÓN", actividad: "Columnas y pórtico estructural f'c=24 MPa", inicio: "2026-10-30", fin: "2026-11-05", peso: 12, matchKeywords: ["columnas", "portico estructural"] },
  { id: "NB-3", wbs: "1.3", esResumen: false, critica: true, fase: "2. MAMPOSTERÍA & PAÑETES", actividad: "Muros en mampostería bloque No. 12", inicio: "2026-11-03", fin: "2026-11-10", peso: 12, matchKeywords: ["mamposteria", "bloque"] },
  { id: "NB-4", wbs: "2", esResumen: true, critica: true, fase: "FASE 2 — ENVOLVENTE, PISOS & CIELO RASO", actividad: "FASE 2 — ENVOLVENTE, PISOS & CIELO RASO", inicio: "2026-11-07", fin: "2026-11-21", peso: 38, matchKeywords: [] },
  { id: "NB-5", wbs: "2.1", esResumen: false, critica: true, fase: "2. MAMPOSTERÍA & PAÑETES", actividad: "Pañete y mortero de revoco dos caras", inicio: "2026-11-07", fin: "2026-11-14", peso: 10, matchKeywords: ["panete", "revoco"] },
  { id: "NB-6", wbs: "2.2", esResumen: false, critica: false, fase: "6. CUBIERTA", actividad: "Montaje de cubierta termoacústica Eternit", inicio: "2026-11-06", fin: "2026-11-12", peso: 10, matchKeywords: ["cubierta", "eternit"] },
  { id: "NB-7", wbs: "2.3", esResumen: false, critica: true, fase: "3. PISOS & ENCHAPES", actividad: "Plantilla de concreto e=7cm + piso porcelanato", inicio: "2026-11-11", fin: "2026-11-19", peso: 10, matchKeywords: ["porcelanato", "plantilla"] },
  { id: "NB-8", wbs: "2.4", esResumen: false, critica: true, fase: "4. CIELOS RASOS & FRESCASA", actividad: 'Cielo raso suspendido + aislamiento Frescasa 2-1/2"', inicio: "2026-11-14", fin: "2026-11-21", peso: 8, matchKeywords: ["cielo raso", "frescasa"] },
  { id: "NB-9", wbs: "3", esResumen: true, critica: false, fase: "FASE 3 — ACABADOS ARQUITECTÓNICOS & ENTREGA", actividad: "FASE 3 — ACABADOS ARQUITECTÓNICOS & ENTREGA", inicio: "2026-11-20", fin: "2026-12-01", peso: 24, matchKeywords: [] },
  { id: "NB-10", wbs: "3.1", esResumen: false, critica: false, fase: "5. CARPINTERÍA & PINTURA", actividad: "Estuco plástico y pintura arquitectónica", inicio: "2026-11-20", fin: "2026-11-28", peso: 12, matchKeywords: ["estuco", "pintura"] },
  { id: "NB-11", wbs: "3.2", esResumen: false, critica: true, fase: "5. CARPINTERÍA & PINTURA", actividad: "Ventanería en aluminio y puertas de acceso", inicio: "2026-11-24", fin: "2026-12-01", peso: 12, matchKeywords: ["ventaneria", "puertas"] },
];

const makeBlueprintPreviewSvg = (code, title, subtitle) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="580" viewBox="0 0 900 580">
    <rect width="900" height="580" fill="#0c192c"/>
    <g stroke="#1e3a5f" stroke-width="1">
      <line x1="0" y1="80" x2="900" y2="80"/><line x1="0" y1="180" x2="900" y2="180"/><line x1="0" y1="280" x2="900" y2="280"/>
      <line x1="0" y1="380" x2="900" y2="380"/><line x1="0" y1="480" x2="900" y2="480"/>
      <line x1="150" y1="0" x2="150" y2="580"/><line x1="350" y1="0" x2="350" y2="580"/><line x1="550" y1="0" x2="550" y2="580"/><line x1="750" y1="0" x2="750" y2="580"/>
    </g>
    <rect x="30" y="30" width="840" height="520" fill="none" stroke="#38bdf8" stroke-width="2"/>
    <rect x="110" y="100" width="680" height="320" fill="none" stroke="#7dd3fc" stroke-width="2.5"/>
    <line x1="330" y1="100" x2="330" y2="420" stroke="#7dd3fc" stroke-width="2"/>
    <line x1="570" y1="100" x2="570" y2="420" stroke="#7dd3fc" stroke-width="2"/>
    <text x="145" y="255" fill="#e0f2fe" font-family="monospace" font-size="16" font-weight="bold">MAIN LOBBY (96 m2 / 1,033 ft2)</text>
    <text x="365" y="255" fill="#e0f2fe" font-family="monospace" font-size="16" font-weight="bold">NORTH OFFICE (104 m2)</text>
    <text x="605" y="255" fill="#e0f2fe" font-family="monospace" font-size="16" font-weight="bold">BOARDROOM (80 m2)</text>
    <rect x="30" y="455" width="840" height="95" fill="#091322" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="55" y="492" fill="#38bdf8" font-family="monospace" font-size="18" font-weight="bold">${code} — ${title}</text>
    <text x="55" y="522" fill="#94a3b8" font-family="monospace" font-size="14">${subtitle} | ISO 19650 IFC/BIM RECORD SHEET (DEMO SANDBOX)</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const DEMO_PLANOS_SHOWCASE = [
  {
    id: "nb-arq-01",
    codigo: "NB-ARQ-01",
    nombre: "Planta Arquitectónica General Nivel 1 — Northbridge Hub",
    nombre_en: "Level 1 Architectural Floor Plan — Northbridge Hub",
    disciplina: "ARQUITECTURA",
    version: "Rev. 3 (BIM IFC4)",
    escala: "1:50",
    fecha: "2026-10-20",
    proyecto: "Northbridge Corporate Hub (Showcase)",
    descripcion: "Distribución de Lobby Principal, Oficina Norte, Sala de Juntas, vanos y acabados.",
    descripcion_en: "Space layout for Main Lobby, North Office, Executive Boardroom, glazing & finishes.",
    url: makeBlueprintPreviewSvg("NB-ARQ-01", "LEVEL 1 ARCHITECTURAL FLOOR PLAN", "Scale 1:50 | Zones: Lobby, North Office, Boardroom"),
    tipo: "imagen",
    notaCalidad: "Aprobado IFC • ISO 19650",
  },
  {
    id: "nb-est-01",
    codigo: "NB-EST-01",
    nombre: "Cimentación, Zapatas F1–F6 & Pórticos Estructurales",
    nombre_en: "Foundations, Spread Footings F1–F6 & Structural Frame",
    disciplina: "ESTRUCTURAS",
    version: "Rev. 2 (NSR-10 / ACI 318)",
    escala: "1:50",
    fecha: "2026-10-22",
    proyecto: "Northbridge Corporate Hub (Showcase)",
    descripcion: "Despiece estructural de zapatas f'c=21 MPa, columnas f'c=24 MPa y vigas de amarre.",
    descripcion_en: "Structural schedule for spread footings (3,000 PSI), columns (3,500 PSI) & tie beams.",
    url: makeBlueprintPreviewSvg("NB-EST-01", "STRUCTURAL FOUNDATIONS & PORTAL FRAME", "Scale 1:50 | f'c = 3,000 - 3,500 PSI | Grade 60 Rebar"),
    tipo: "imagen",
    notaCalidad: "Aprobado Estructural",
  },
  {
    id: "nb-env-01",
    codigo: "NB-ENV-01",
    nombre: "Cubierta Termoacústica, Caballetes & Cielo Raso",
    nombre_en: "Thermo-Acoustic Roof Deck, Ridge Caps & Ceiling Grid",
    disciplina: "CUBIERTA",
    version: "Rev. 1 (APROBADOS)",
    escala: "1:75",
    fecha: "2026-11-01",
    proyecto: "Northbridge Corporate Hub (Showcase)",
    descripcion: "Pendientes de cubierta Eternit, correas metálicas y detalles de aislamiento Frescasa Eco.",
    descripcion_en: "Roofing slope geometry, steel purlins, ridge cap flashing & Frescasa Eco ceiling insulation.",
    url: makeBlueprintPreviewSvg("NB-ENV-01", "ROOF DECK & CEILING ACOUSTIC DETAILS", "Scale 1:75 | Slope 14% | R-19 Thermal Envelope"),
    tipo: "imagen",
    notaCalidad: "Aprobado Envolvente",
  },
];

export const DEMO_ENSAYOS_CONCRETO = [
  {
    id: 9501,
    codigoCilindro: "NB-ZAP-01",
    proyecto: "Northbridge Corporate Hub",
    elemento: "Zapatas Z-1 a Z-3 & Vigas Cimentación",
    elemento_en: "Spread Footings F-1 to F-3 & Grade Beams",
    fechaVaciado: "2026-10-28",
    edadDias: 7,
    cargaKn: 368.5,
    diametroMm: 150,
    resistenciaMpa: 20.85,
    laboratorio: "Central Concrete QA Lab (ISO 17025)",
    observaciones: "Muestra temprana 7d (99.3% de f'c=21 MPa) — curado húmedo en tanque OK",
    observaciones_en: "Early 7-day break (99.3% of 3,000 PSI spec) — wet curing tank verified",
    estado: "APROBADO",
  },
  {
    id: 9502,
    codigoCilindro: "NB-COL-01",
    proyecto: "Northbridge Corporate Hub",
    elemento: "Columnas Pórtico Estructural Ejes A-B",
    elemento_en: "Structural Frame Columns Grid A-B",
    fechaVaciado: "2026-11-04",
    edadDias: 28,
    cargaKn: 458.2,
    diametroMm: 150,
    resistenciaMpa: 25.93,
    laboratorio: "Central Concrete QA Lab (ISO 17025)",
    observaciones: "Resistencia a 28d supera f'c=24 MPa (108.0%) — fallo tipo cono estándar ASTM C39",
    observaciones_en: "28-day break exceeds 3,500 PSI design spec (108.0%) — ASTM C39 cone fracture",
    estado: "APROBADO",
  },
];

export const DEMO_REMISIONES_MIXERS = [
  {
    id: 9601,
    numeroRemision: "RMX-NB-4102",
    proyecto: "Northbridge Corporate Hub",
    proveedor: "Northbridge Ready-Mix Plant A",
    placaMixer: "RMX-904",
    conductor: "Operador Planta 04",
    volumenM3: 14.0,
    asentamientoMm: 125,
    temperaturaC: 27.5,
    horaSalidaPlanta: "08:05",
    horaLlegadaObra: "08:32",
    horaFinDescarga: "09:12",
    elementoFundido: "Zapatas y Vigas de Cimentación Z-1 a Z-6",
    elementoFundido_en: "Spread Footings F-1 to F-6 & Grade Beams",
    quienRecibe: "Residente QA — Campo",
    estadoTiempo: "CUMPLIÓ (67 min)",
    observaciones: "Slump 5.0\" verificado en descarga, sin adición de agua en sitio.",
    observaciones_en: 'Slump 5.0" verified at chute, zero site water added.',
  },
  {
    id: 9602,
    numeroRemision: "RMX-NB-4189",
    proyecto: "Northbridge Corporate Hub",
    proveedor: "Northbridge Ready-Mix Plant A",
    placaMixer: "RMX-912",
    conductor: "Operador Planta 08",
    volumenM3: 9.0,
    asentamientoMm: 130,
    temperaturaC: 28.0,
    horaSalidaPlanta: "13:15",
    horaLlegadaObra: "13:44",
    horaFinDescarga: "14:22",
    elementoFundido: "Columnas Estructurales Ejes A-B (f'c=24 MPa)",
    elementoFundido_en: "Structural Frame Columns Grid A-B (3,500 PSI)",
    quienRecibe: "Residente QA — Campo",
    estadoTiempo: "CUMPLIÓ (67 min)",
    observaciones: "Bombeo continuo, 3 cilindros testigos ASTM C31 tomados.",
    observaciones_en: "Continuous boom pump pour, 3 ASTM C31 test cylinders cast.",
  },
];

export const DEMO_ALMACEN_MATERIALES = [
  { id: 1, codigo: "MAT-CEM-01", nombre: "Cemento Gris Tipo I (Sacos 50kg)", categoria: "CEMENTOS Y MORTEROS", unidad: "Saco 50kg", stock: 112, stockMinimo: 25, costoUnitario: 34500, ubicacion: "Bodega Seca A1" },
  { id: 2, codigo: "MAT-BLO-12", nombre: "Bloque de Concreto No. 12 (40×20×10)", categoria: "MAMPOSTERÍA", unidad: "Unidad", stock: 420, stockMinimo: 100, costoUnitario: 2950, ubicacion: "Patio Acopio Norte" },
  { id: 3, codigo: "MAT-POR-51", nombre: "Porcelanato 51×51 cm Tráfico 5 (cajas 1.56 m²)", categoria: "ACABADOS Y PINTURAS", unidad: "m²", stock: 96, stockMinimo: 20, costoUnitario: 68000, ubicacion: "Bodega Acabados B2" },
  { id: 4, codigo: "MAT-FRE-25", nombre: 'Rollo Frescasa Eco 2-1/2" (9.30 m²)', categoria: "AISLAMIENTO Y DRY-WALL", unidad: "Rollo", stock: 16, stockMinimo: 4, costoUnitario: 118000, ubicacion: "Bodega Seca A2" },
  { id: 5, codigo: "MAT-PIN-01", nombre: "Pintura Vinílica Tipo 1 Lavable (Cuñete 5 Gal)", categoria: "ACABADOS Y PINTURAS", unidad: "Cuñete 5 Gal", stock: 11, stockMinimo: 3, costoUnitario: 285000, ubicacion: "Bodega Acabados B1" },
];

export const DEMO_ALMACEN_MOVIMIENTOS = [
  { id: 8001, fecha: "2026-11-10", hora: "07:45", materialId: 1, materialCodigo: "MAT-CEM-01", materialNombre: "Cemento Gris Tipo I (Sacos 50kg)", tipo: "SALIDA", cantidad: 28, costoUnitario: 34500, totalCop: 966000, responsable: "Frente Envolvente, Pisos & Cubierta", destino: "Pañete Lobby Principal & Oficina Norte" },
  { id: 8002, fecha: "2026-11-11", hora: "10:15", materialId: 3, materialCodigo: "MAT-POR-51", materialNombre: "Porcelanato 51×51 cm Tráfico 5 (cajas 1.56 m²)", tipo: "SALIDA", cantidad: 48, costoUnitario: 68000, totalCop: 3264000, responsable: "Frente Envolvente, Pisos & Cubierta", destino: "Piso Lobby Principal (51x51)" },
  { id: 8003, fecha: "2026-11-12", hora: "08:20", materialId: 4, materialCodigo: "MAT-FRE-25", materialNombre: 'Rollo Frescasa Eco 2-1/2" (9.30 m²)', tipo: "ENTRADA", cantidad: 16, costoUnitario: 118000, totalCop: 1888000, responsable: "Almacén Central Showcase", destino: "Recepción lote cubierta & cielo raso" },
];

export const DEMO_ALMACEN_HERRAMIENTAS = [
  { id: 1, codigo: "EQ-VIB-01", nombre: "Vibrador Eléctrico para Concreto 2HP", categoria: "EQUIPO PESADO / COMPACTACIÓN", estado: "DISPONIBLE", ubicacion: "Pañol Equipos", asignadoA: "-" },
  { id: 2, codigo: "EQ-NIV-01", nombre: "Nivel Láser Autonivelante 360°", categoria: "MEDICIÓN Y TOPOGRAFÍA", estado: "EN USO", ubicacion: "Lobby Principal", asignadoA: "Frente Acabados" },
  { id: 3, codigo: "EQ-COR-01", nombre: "Cortadora de Porcelanato Diamante 900mm", categoria: "HERRAMIENTA DE ACABADOS", estado: "EN USO", ubicacion: "Lobby Principal", asignadoA: "Frente Pisos" },
];

export const DEMO_ALMACEN_PRESTAMOS = [
  { id: 7001, fecha: "2026-11-12", horaSalida: "07:30", horaRegreso: "-", herramientaId: 2, codigo: "EQ-NIV-01", nombre: "Nivel Láser Autonivelante 360°", operario: "Líder Acabados #1", frente: "Lobby Principal", estado: "PRESTADO" },
];

function fieldIsoOffsetDays(days) {
  const dt = new Date();
  dt.setDate(dt.getDate() + days);
  return dt.toISOString().slice(0, 10);
}

export function getDemoFieldSstSeed() {
  return {
    diasSinLti: 42,
    horasHombreAcum: 3840,
    permisos: [
      {
        id: "ptar-nb-1",
        codigo: "PTAR-NB-001",
        fecha: fieldIsoOffsetDays(-2),
        tipo: "alturas",
        frente: "Cubierta Termoacústica & Caballetes",
        frenteEn: "Corrugated Roof Deck & Ridge Flashing",
        responsable: "Inspector SST • Campo",
        responsableEn: "Site HSE Officer",
        alturaM: 4.15,
        ptarChecklistOk: true,
        arlVerificada: true,
        estado: "vigente",
        notas: "Línea de vida horizontal certificada y doble eslinga con absorbedor.",
        notasEn: "Certified horizontal lifeline and twin-leg shock-absorbing lanyard verified.",
      },
      {
        id: "ptar-nb-2",
        codigo: "PTAR-NB-002",
        fecha: fieldIsoOffsetDays(-1),
        tipo: "caliente",
        frente: "Pórtico Metálico Cubierta (Correas)",
        frenteEn: "Roof Steel Purlin Welding Zone",
        responsable: "Inspector SST • Campo",
        responsableEn: "Site HSE Officer",
        alturaM: 3.6,
        ptarChecklistOk: true,
        arlVerificada: true,
        estado: "vigente",
        notas: "Extintor ABC 20 lb, mampara ignífuga y vigía contra incendios activo.",
        notasEn: "20-lb ABC fire extinguisher, welding blanket & dedicated fire watch in place.",
      },
      {
        id: "ptar-nb-3",
        codigo: "PTAR-NB-003",
        fecha: fieldIsoOffsetDays(0),
        tipo: "electrico",
        frente: "Tablero Provisional Obra & Subestación",
        frenteEn: "Temporary Site Power Panel & LOTO",
        responsable: "Técnico Eléctrico RETIE",
        responsableEn: "Licensed Site Electrician (LOTO)",
        ptarChecklistOk: true,
        arlVerificada: true,
        estado: "pendiente",
        notas: "En espera de cierre de candado LOTO y verificación ausencia de tensión.",
        notasEn: "Pending LOTO padlock verification and zero-energy test sign-off.",
      },
      {
        id: "ptar-nb-4",
        codigo: "PTAR-NB-004",
        fecha: fieldIsoOffsetDays(-9),
        tipo: "excavacion",
        frente: "Zapatas Ejes A-B y Vigas Cimentación",
        frenteEn: "Footings Grid A-B & Grade Beam Trenches",
        responsable: "Inspector SST • Campo",
        responsableEn: "Site HSE Officer",
        alturaM: 1.75,
        ptarChecklistOk: true,
        arlVerificada: true,
        estado: "cerrado",
        notas: "Cimentación fundida y rellenada; frente liberado sin novedades.",
        notasEn: "Footing pour and backfill completed cleanly; excavation closed.",
      },
    ],
    charlas: [
      {
        id: "talk-nb-1",
        fecha: fieldIsoOffsetDays(0),
        frente: "Frente Envolvente, Pisos & Cubierta",
        frenteEn: "Envelope, Flooring & Roofing Crew",
        tema: "Inspección pre-operacional de arneses, anclajes en cubierta y riesgo eléctrico",
        temaEn: "Pre-shift harness inspection, roof anchor tie-off & wet-area GFCI safety",
        instructor: "Coordinación HSE Showcase",
        instructorEn: "Site HSE Coordinator",
        asistentes: 11,
        atsCompletado: true,
      },
      {
        id: "talk-nb-2",
        fecha: fieldIsoOffsetDays(-1),
        frente: "Frente Acabados & Enchapes",
        frenteEn: "Interior Finishes & Flooring Crew",
        tema: "Protección respiratoria por polvo de sílice en corte de porcelanato y pañete",
        temaEn: "Silica dust respirator control during porcelain wet-cutting & stucco sanding",
        instructor: "Coordinación HSE Showcase",
        instructorEn: "Site HSE Coordinator",
        asistentes: 8,
        atsCompletado: true,
      },
      {
        id: "talk-nb-3",
        fecha: fieldIsoOffsetDays(-3),
        frente: "Frente Estructura & Mampostería",
        frenteEn: "Structure & Masonry Crew",
        tema: "Orden y aseo, bloqueo de andamios tubulares y manejo manual de cargas",
        temaEn: "Housekeeping, scaffold tag inspection & ergonomic block handling",
        instructor: "Dirección Técnica Residente",
        instructorEn: "Lead Field Engineer",
        asistentes: 9,
        atsCompletado: true,
      },
    ],
    eppTrabajadores: [
      {
        id: "epp-nb-1",
        codigo: "NBR-01",
        rol: "Oficial Montador de Cubierta",
        rolEn: "Lead Roofing & Steel Erector",
        cuadrilla: "Frente Cubierta",
        cargoCertAltura: true,
        venceCertAltura: fieldIsoOffsetDays(210),
        estadoAfiliacion: "activa",
        casco: true,
        botas: true,
        arnes: true,
        guantes: true,
        gafas: true,
      },
      {
        id: "epp-nb-2",
        codigo: "NBR-02",
        rol: "Soldador Estructural Certificado",
        rolEn: "Certified Structural Welder",
        cuadrilla: "Frente Cubierta",
        cargoCertAltura: true,
        venceCertAltura: fieldIsoOffsetDays(165),
        estadoAfiliacion: "activa",
        casco: true,
        botas: true,
        arnes: true,
        guantes: true,
        gafas: true,
      },
      {
        id: "epp-nb-3",
        codigo: "NBR-03",
        rol: "Oficial Mampostería & Pañete",
        rolEn: "Lead Masonry & Plaster Mason",
        cuadrilla: "Frente Envolvente",
        cargoCertAltura: true,
        venceCertAltura: fieldIsoOffsetDays(95),
        estadoAfiliacion: "activa",
        casco: true,
        botas: true,
        arnes: true,
        guantes: true,
        gafas: true,
      },
      {
        id: "epp-nb-4",
        codigo: "NBR-04",
        rol: "Instalador Porcelanato & Drywall",
        rolEn: "Tile & Acoustic Ceiling Installer",
        cuadrilla: "Frente Acabados",
        cargoCertAltura: false,
        venceCertAltura: fieldIsoOffsetDays(140),
        estadoAfiliacion: "activa",
        casco: true,
        botas: true,
        arnes: false,
        guantes: true,
        gafas: true,
      },
      {
        id: "epp-nb-5",
        codigo: "NBR-05",
        rol: "Ayudante Logístico & Acopio",
        rolEn: "Logistics & Material Helper",
        cuadrilla: "Patio & Bodega",
        cargoCertAltura: false,
        venceCertAltura: fieldIsoOffsetDays(180),
        estadoAfiliacion: "activa",
        casco: true,
        botas: true,
        arnes: false,
        guantes: true,
        gafas: false,
      },
    ],
    incidentes: [
      {
        id: "inc-nb-1",
        fecha: fieldIsoOffsetDays(-2),
        tipo: "condicion_insegura",
        frente: "Acceso Norte — Zona Descargue",
        frenteEn: "North Loading Bay",
        descripcion: "Estiba de bloques sin cintillo de amarre y ausencia temporal de cono reflectivo.",
        descripcionEn: "Unstrapped CMU pallet edge & missing high-vis traffic cone near ramp.",
        accionCapa: "Re-zunchado de estibas, señalización perimetral con cinta y socialización a logística.",
        accionCapaEn: "Re-banded pallets, deployed high-vis cones & briefed delivery crew.",
        responsable: "Inspector SST • Campo",
        fechaLimite: fieldIsoOffsetDays(-1),
        cerrado: true,
      },
      {
        id: "inc-nb-2",
        fecha: fieldIsoOffsetDays(0),
        tipo: "cuasi_accidente",
        frente: "Andamio Fachada Este (Cuerpo 2)",
        frenteEn: "East Facade Scaffolding (Bay 2)",
        descripcion: "Rodapié lateral flojo detectado antes de subir herramientas manuales.",
        descripcionEn: "Loose scaffold toe-board flagged during pre-shift walkthrough before lifting tools.",
        accionCapa: "Asegurar pasador de rodapié, inspeccionar tarjeta verde y usar portaherramientas.",
        accionCapaEn: "Lock toe-board pin, update green scaffold tag & enforce tool lanyards.",
        responsable: "Líder Envolvente",
        fechaLimite: fieldIsoOffsetDays(1),
        cerrado: false,
      },
    ],
  };
}
