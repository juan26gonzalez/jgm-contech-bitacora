import { getPortico2nBlueprints } from "./portico2nBlueprints";
import { computePorticoTakeoffs, PORTICO_2N_SPEC } from "./portico2nTakeoff";

export const DEMO_SHOWCASE_PROJECT_ID = "demo_showcase";
export const DEMO_SESSION_STORAGE_KEY = "jgm_bitacora_demo_session_v1";

const TAKEOFF = computePorticoTakeoffs();
const round2 = (n) => Math.round(n * 100) / 100;

function splitShifts(total, weights) {
  const sumW = weights.reduce((a, b) => a + b, 0) || 1;
  const out = [];
  let acc = 0;
  for (let i = 0; i < weights.length; i++) {
    if (i === weights.length - 1) {
      out.push(round2(Math.max(0, total - acc)));
    } else {
      const part = round2((total * weights[i]) / sumW);
      acc = round2(acc + part);
      out.push(part);
    }
  }
  return out;
}

export const PROYECTO_DEMO_CONFIG = {
  id: DEMO_SHOWCASE_PROJECT_ID,
  nombre: "Residencial Pórtico 2N + Balcón (BIM 5D)",
  nombre_corto: "Pórtico 2N (Demo)",
  cliente: "Northbridge Capital Partners",
  ubicacion: "Barranquilla / Miami / Madrid • ISO 19650",
  ciudad: "Barranquilla / Miami / Madrid",
  contratista: "JGM ConTech Engineering Team",
  interventoria: "Owner's Representative • ISO 19650",
  badge: "Pórtico 2N BIM 5D",
};

const FOUND_M3 = round2(TAKEOFF.foundationConcreteM3 + TAKEOFF.groundSlabConcreteM3);

export const DEMO_CATALOGO_SHOWCASE = [
  {
    id: "[BIM_TAKEOFF] Concreto en zapatas, pedestales y vigas de cimentación f'c=21 MPa",
    capitulo: "1. ESTRUCTURA & CIMENTACIÓN",
    unidad: "m³",
    cantidadPresupuesto: FOUND_M3,
    apuCop: 695000,
    diarioMax: 4.5,
  },
  {
    id: "[BIM_TAKEOFF] Concreto en columnas (+5.80m), vigas VE/VCU, losa L-1, balcón y escalera f'c=24 MPa",
    capitulo: "1. ESTRUCTURA & CIMENTACIÓN",
    unidad: "m³",
    cantidadPresupuesto: TAKEOFF.superstructureConcreteM3,
    apuCop: 790000,
    diarioMax: 4.0,
  },
  {
    id: "[BIM_TAKEOFF] Muros en mampostería bloque No. 12 (incl. antepecho cubierta h=1.00 m)",
    capitulo: "2. MAMPOSTERÍA & PAÑETES",
    unidad: "m²",
    cantidadPresupuesto: TAKEOFF.masonryAreaM2,
    apuCop: 78000,
    diarioMax: 18.0,
  },
  {
    id: "[BIM_TAKEOFF] Pañete y mortero de revoco en muros dos caras",
    capitulo: "2. MAMPOSTERÍA & PAÑETES",
    unidad: "m²",
    cantidadPresupuesto: TAKEOFF.plasterAreaM2,
    apuCop: 38000,
    diarioMax: 24.0,
  },
  {
    id: "[BIM_TAKEOFF] Instalación de piso en porcelanato 51x51 cm (Pisos N1 y N2)",
    capitulo: "3. PISOS & ENCHAPES",
    unidad: "m²",
    cantidadPresupuesto: TAKEOFF.flooringAreaM2,
    apuCop: 118000,
    diarioMax: 25.0,
  },
  {
    id: '[BIM_TAKEOFF] Cielo raso suspendido Drywall + Aislamiento Frescasa Eco 2-1/2" (Nivel 2)',
    capitulo: "4. CIELOS RASOS & FRESCASA",
    unidad: "m²",
    cantidadPresupuesto: TAKEOFF.ceilingAreaM2,
    apuCop: 85000,
    diarioMax: 32.0,
  },
  {
    id: "[BIM_TAKEOFF] Estuco plástico y pintura vinílica arquitectónica en muros",
    capitulo: "5. CARPINTERÍA & PINTURA",
    unidad: "m²",
    cantidadPresupuesto: TAKEOFF.wallPaintAreaM2,
    apuCop: 34000,
    diarioMax: 30.0,
  },
  {
    id: "[BIM_TAKEOFF] Ventanería aluminio termoacústica, puertas y barandas balcón",
    capitulo: "5. CARPINTERÍA & PINTURA",
    unidad: "und",
    cantidadPresupuesto: TAKEOFF.openingsCount + PORTICO_2N_SPEC.railings.length,
    apuCop: 1150000,
    diarioMax: 4.0,
  },
  {
    id: "[BIM_TAKEOFF] Losa cubierta concreto f'c=24 MPa e=12cm, pendiente 1% e impermeabilización",
    capitulo: "6. CUBIERTA",
    unidad: "m²",
    cantidadPresupuesto: TAKEOFF.roofSlabAreaM2,
    apuCop: 215000,
    diarioMax: 24.0,
  },
  {
    id: "[BIM_TAKEOFF] Alfajía perimetral concreto f'c=21 MPa c/ cortagoteras",
    capitulo: "6. CUBIERTA",
    unidad: "ml",
    cantidadPresupuesto: TAKEOFF.alfajiaLengthMl,
    apuCop: 62000,
    diarioMax: 18.0,
  },
  {
    id: '[BIM_TAKEOFF] Bajante aguas lluvias tubería PVC sanitaria Ø 4" y tragante de esquina',
    capitulo: "6. CUBIERTA",
    unidad: "ml",
    cantidadPresupuesto: TAKEOFF.downspoutLengthMl,
    apuCop: 78000,
    diarioMax: 12.0,
  },
];

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
      <line x1="0" y1="130" x2="800" y2="130"/><line x1="0" y1="260" x2="800" y2="260"/>
      <line x1="0" y1="390" x2="800" y2="390"/><line x1="200" y1="0" x2="200" y2="520"/>
      <line x1="400" y1="0" x2="400" y2="520"/><line x1="600" y1="0" x2="600" y2="520"/>
    </g>
    <rect x="64" y="64" width="672" height="392" rx="16" fill="#0b1324" stroke="${accent}" stroke-width="2.5"/>
    <rect x="96" y="102" width="188" height="30" rx="6" fill="${accent}" opacity="0.18"/>
    <text x="110" y="122" fill="${accent}" font-family="monospace" font-size="14" font-weight="bold">ISO 19650 • BIM FIELD QA</text>
    <text x="96" y="190" fill="#f8fafc" font-family="sans-serif" font-size="26" font-weight="bold">${title}</text>
    <text x="96" y="226" fill="#94a3b8" font-family="monospace" font-size="15">Element ID: ${code} • Pórtico 2N + Balcón</text>
    <rect x="96" y="268" width="608" height="106" rx="10" fill="#111c33" stroke="#334155"/>
    <polyline points="120,342 220,318 330,326 440,296 560,304 680,282" fill="none" stroke="${accent}" stroke-width="4"/>
    <circle cx="440" cy="296" r="6" fill="${accent}"/>
    <circle cx="680" cy="282" r="6" fill="${accent}"/>
    <text x="96" y="420" fill="#cbd5e1" font-family="monospace" font-size="14">QA STATUS: ${status} | VERIFIED MODEL PORTICO-2N</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const IMG_FOUNDATIONS = makeSampleInspectionSvg(
  "Footings Z1-Z9, Pedestals 40x40 & VC Beams",
  "STR-ZAP-Z1-Z9",
  "100% COMPLIANT f'c=21 MPa",
  "#10b981"
);
const IMG_FRAME_SLAB = makeSampleInspectionSvg(
  "2S Frame Columns, L-1 Slab, Balcony & Stair",
  "STR-COL-L1-ESC1",
  "100% COMPLIANT f'c=24 MPa",
  "#38bdf8"
);
const IMG_MASONRY = makeSampleInspectionSvg(
  "CMU No. 12 Two-Storey Walls & Two-Side Plaster",
  "ARC-MUR-N12",
  "ACTIVE PROGRESS 60.0%",
  "#f59e0b"
);
const IMG_ROOF_RC = makeSampleInspectionSvg(
  'RC Roof Slab L-2 (1% Slope) + 1.00m Parapet + Alfajía & 4" PVC Drain',
  "ROOF-L2-1PCT-PVC4",
  "100% FLOOD-TESTED & DRAINING",
  "#10b981"
);

const foundShifts = splitShifts(FOUND_M3, [0.5, 0.5]);
const superShifts = splitShifts(TAKEOFF.superstructureConcreteM3, [0.45, 0.55]);
const masonryShifts = splitShifts(TAKEOFF.masonryAreaM2, [0.5, 0.5]);
const plasterShifts = splitShifts(round2(TAKEOFF.plasterAreaM2 * 0.6), [0.52, 0.48]);

export const DEMO_BITACORA_ROWS = [
  {
    id: 9001,
    fecha: "2026-10-28",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: "[BIM_TAKEOFF] Concreto en zapatas, pedestales y vigas de cimentación f'c=21 MPa",
    cantidad_ejecutada: foundShifts[0],
    cuadrilla: "Frente Estructura & Cimentación",
    clima: "Despejado / Soleado",
    observaciones: "Zona A — Pórticos & Cimentación | Excavación y fundida de zapatas Z-1 a Z-9 y pedestales 40×40 (8 #4), rec. 75 mm",
    evidencia_foto: IMG_FOUNDATIONS,
    sync_status: "demo",
  },
  {
    id: 9002,
    fecha: "2026-10-31",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: "[BIM_TAKEOFF] Concreto en zapatas, pedestales y vigas de cimentación f'c=21 MPa",
    cantidad_ejecutada: foundShifts[1],
    cuadrilla: "Frente Estructura & Cimentación",
    clima: "Despejado / Soleado",
    observaciones: "Zona A — Pórticos & Cimentación | Vaciado vigas de cimentación VC 30×35 y contrapiso armado CP-1 e=10 cm",
    evidencia_foto: IMG_FOUNDATIONS,
    sync_status: "demo",
  },
  {
    id: 9003,
    fecha: "2026-11-02",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: "[BIM_TAKEOFF] Concreto en columnas (+5.80m), vigas VE/VCU, losa L-1, balcón y escalera f'c=24 MPa",
    cantidad_ejecutada: superShifts[0],
    cuadrilla: "Frente Estructura & Cimentación",
    clima: "Nublado",
    observaciones: "Zona A — Pórticos & Cimentación | Vaciado columnas C1–C9 (+5.80 m • 8 #4, Lo @ 10 cm) y escalera en U ESC-1",
    evidencia_foto: IMG_FRAME_SLAB,
    sync_status: "demo",
  },
  {
    id: 9004,
    fecha: "2026-11-05",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: "[BIM_TAKEOFF] Concreto en columnas (+5.80m), vigas VE/VCU, losa L-1, balcón y escalera f'c=24 MPa",
    cantidad_ejecutada: superShifts[1],
    cuadrilla: "Frente Estructura & Cimentación",
    clima: "Despejado / Soleado",
    observaciones: "Zona A — Pórticos & Cimentación | Fundida vigas VE/VCU, losa maciza L-1 e=12 cm y balcón en voladizo LV-1 (#4 @ 20 sup.)",
    evidencia_foto: IMG_FRAME_SLAB,
    sync_status: "demo",
  },
  {
    id: 9005,
    fecha: "2026-11-07",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: "[BIM_TAKEOFF] Muros en mampostería bloque No. 12 (incl. antepecho cubierta h=1.00 m)",
    cantidad_ejecutada: masonryShifts[0],
    cuadrilla: "Frente Envolvente, Pisos & Cubierta",
    clima: "Despejado / Soleado",
    observaciones: "Nivel 1 (Sala / Comedor / Cocina) | Levante mampostería Bloque N° 12 con mortero 1:4 y dovelas de confinamiento",
    evidencia_foto: IMG_MASONRY,
    sync_status: "demo",
  },
  {
    id: 9006,
    fecha: "2026-11-09",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: "[BIM_TAKEOFF] Muros en mampostería bloque No. 12 (incl. antepecho cubierta h=1.00 m)",
    cantidad_ejecutada: masonryShifts[1],
    cuadrilla: "Frente Envolvente, Pisos & Cubierta",
    clima: "Nublado",
    observaciones: "Nivel 2 & Antepecho Cubierta | Muros bloque No. 12 N2 y encerramiento perimetral h=1.00 m (+5.80 → +6.80 m)",
    evidencia_foto: IMG_MASONRY,
    sync_status: "demo",
  },
  {
    id: 9007,
    fecha: "2026-11-10",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: "[BIM_TAKEOFF] Losa cubierta concreto f'c=24 MPa e=12cm, pendiente 1% e impermeabilización",
    cantidad_ejecutada: TAKEOFF.roofSlabAreaM2,
    cuadrilla: "Cuadrilla Estructura & Impermeab.: 2 Of + 2 Ayud",
    clima: "Despejado / Soleado",
    observaciones: "Cubierta L-2 (+5.80 m) | Vaciado losa maciza e=12cm (#3 @ 0.20), afine mortero pendiente 1% (+5.89→+5.82) e imperm.",
    evidencia_foto: IMG_ROOF_RC,
    sync_status: "demo",
  },
  {
    id: 9011,
    fecha: "2026-11-11",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: "[BIM_TAKEOFF] Alfajía perimetral concreto f'c=21 MPa c/ cortagoteras",
    cantidad_ejecutada: TAKEOFF.alfajiaLengthMl,
    cuadrilla: "Cuadrilla Mampostería & Remates: 1 Of + 1 Ayud",
    clima: "Despejado / Soleado",
    observaciones: "Antepecho Cubierta (+6.80 m) | Remate perimetral alfajía en concreto 23×7 cm con cortagoteras 4 cm",
    evidencia_foto: IMG_ROOF_RC,
    sync_status: "demo",
  },
  {
    id: 9012,
    fecha: "2026-11-11",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: '[BIM_TAKEOFF] Bajante aguas lluvias tubería PVC sanitaria Ø 4" y tragante de esquina',
    cantidad_ejecutada: TAKEOFF.downspoutLengthMl,
    cuadrilla: "Cuadrilla Hidrosanitaria: 1 Oficial + 1 Ayud",
    clima: "Despejado / Soleado",
    observaciones: 'Fachada Este Eje A/3 | Tragante Ø 4" en esquina baja + bajante PVC sanitaria 4" (110mm) c/ abrazaderas',
    evidencia_foto: IMG_ROOF_RC,
    sync_status: "demo",
  },
  {
    id: 9008,
    fecha: "2026-11-12",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: "[BIM_TAKEOFF] Pañete y mortero de revoco en muros dos caras",
    cantidad_ejecutada: plasterShifts[0],
    cuadrilla: "Frente Envolvente, Pisos & Cubierta",
    clima: "Despejado / Soleado",
    observaciones: "Nivel 1 (Sala & Cocina) | Plomado y maestreado de pañete liso e=1.5 cm en muros interiores",
    evidencia_foto: IMG_MASONRY,
    sync_status: "demo",
  },
  {
    id: 9009,
    fecha: "2026-11-14",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: "[BIM_TAKEOFF] Pañete y mortero de revoco en muros dos caras",
    cantidad_ejecutada: plasterShifts[1],
    cuadrilla: "Frente Envolvente, Pisos & Cubierta",
    clima: "Despejado / Soleado",
    observaciones: "Nivel 2 (Habitación Principal) | Avance acumulado de pañete al 60.0% según verificación en campo",
    evidencia_foto: null,
    sync_status: "demo",
  },
  {
    id: 9010,
    fecha: "2026-11-16",
    proyecto: DEMO_SHOWCASE_PROJECT_ID,
    actividad: "[BIM_TAKEOFF] Instalación de piso en porcelanato 51x51 cm (Pisos N1 y N2)",
    cantidad_ejecutada: 23.68,
    cuadrilla: "Frente Envolvente, Pisos & Cubierta",
    clima: "Nublado",
    observaciones: "Sala & Comedor (Nivel 1) | Enchape en porcelanato 51×51 cm terminado en Sala (11.84 m²) y Comedor (11.84 m²)",
    evidencia_foto: IMG_MASONRY,
    sync_status: "demo",
  },
];

export const CRONOGRAMA_DEMO_SHOWCASE = [
  { id: "P2N-0", wbs: "1", esResumen: true, critica: true, fase: "FASE 1 — CIMENTACIÓN, PÓRTICO RC 2N & MAMPOSTERÍA", actividad: "FASE 1 — CIMENTACIÓN, PÓRTICO RC 2N & MAMPOSTERÍA", inicio: "2026-10-24", fin: "2026-11-10", peso: 50, matchKeywords: [] },
  { id: "P2N-1", wbs: "1.1", esResumen: false, critica: true, fase: "1. ESTRUCTURA & CIMENTACIÓN", actividad: "Zapatas, pedestales, vigas VC y contrapiso f'c=21 MPa", inicio: "2026-10-24", fin: "2026-10-31", peso: 15, matchKeywords: ["zapatas", "pedestales", "vigas de cimentacion"] },
  { id: "P2N-2", wbs: "1.2", esResumen: false, critica: true, fase: "1. ESTRUCTURA & CIMENTACIÓN", actividad: "Columnas (+5.80m), vigas VE/VCU, losa N2 L-1, balcón y escalera", inicio: "2026-10-30", fin: "2026-11-06", peso: 20, matchKeywords: ["columnas", "viga", "losa", "escalera", "balcon"] },
  { id: "P2N-3", wbs: "1.3", esResumen: false, critica: true, fase: "2. MAMPOSTERÍA & PAÑETES", actividad: "Muros bloque No. 12 (N1–N2 y antepecho h=1.00 m)", inicio: "2026-11-05", fin: "2026-11-11", peso: 15, matchKeywords: ["mamposteria", "bloque", "antepecho"] },
  { id: "P2N-4", wbs: "2", esResumen: true, critica: true, fase: "FASE 2 — LOSA CUBIERTA RC 1%, ALFAJÍA, BAJANTE 4\" & ACABADOS", actividad: "FASE 2 — LOSA CUBIERTA RC 1%, ALFAJÍA, BAJANTE 4\" & ACABADOS", inicio: "2026-11-08", fin: "2026-11-23", peso: 39, matchKeywords: [] },
  { id: "P2N-5", wbs: "2.1", esResumen: false, critica: true, fase: "6. CUBIERTA", actividad: "Losa cubierta concreto e=12cm, mortero pendiente 1% e imperm.", inicio: "2026-11-08", fin: "2026-11-12", peso: 8, matchKeywords: ["losa cubierta", "pendiente", "impermeabilizacion"] },
  { id: "P2N-5b", wbs: "2.1b", esResumen: false, critica: false, fase: "6. CUBIERTA", actividad: "Alfajía perimetral concreto c/ cortagoteras", inicio: "2026-11-11", fin: "2026-11-13", peso: 2, matchKeywords: ["alfajia", "alfajía", "cortagoteras"] },
  { id: "P2N-5c", wbs: "2.1c", esResumen: false, critica: false, fase: "6. CUBIERTA", actividad: 'Bajante aguas lluvias tubería PVC sanitaria Ø 4" + tragante', inicio: "2026-11-11", fin: "2026-11-13", peso: 1, matchKeywords: ["bajante", "pvc", "agua lluvia"] },
  { id: "P2N-6", wbs: "2.2", esResumen: false, critica: true, fase: "2. MAMPOSTERÍA & PAÑETES", actividad: "Pañete y mortero de revoco en muros y antepecho dos caras", inicio: "2026-11-10", fin: "2026-11-18", peso: 11, matchKeywords: ["panete", "revoco"] },
  { id: "P2N-7", wbs: "2.3", esResumen: false, critica: true, fase: "3. PISOS & ENCHAPES", actividad: "Porcelanato N1, N2 y Balcón (51×51 cm)", inicio: "2026-11-14", fin: "2026-11-22", peso: 11, matchKeywords: ["porcelanato", "piso"] },
  { id: "P2N-8", wbs: "2.4", esResumen: false, critica: false, fase: "4. CIELOS RASOS & FRESCASA", actividad: 'Cielo raso suspendido + aislamiento Frescasa 2-1/2"', inicio: "2026-11-16", fin: "2026-11-23", peso: 6, matchKeywords: ["cielo raso", "frescasa"] },
  { id: "P2N-9", wbs: "3", esResumen: true, critica: false, fase: "FASE 3 — PINTURA, VENTANERÍA, BARANDAS & ENTREGA", actividad: "FASE 3 — PINTURA, VENTANERÍA, BARANDAS & ENTREGA", inicio: "2026-11-21", fin: "2026-12-03", peso: 11, matchKeywords: [] },
  { id: "P2N-10", wbs: "3.1", esResumen: false, critica: false, fase: "5. CARPINTERÍA & PINTURA", actividad: "Estuco plástico y pintura arquitectónica", inicio: "2026-11-21", fin: "2026-11-29", peso: 6, matchKeywords: ["estuco", "pintura"] },
  { id: "P2N-11", wbs: "3.2", esResumen: false, critica: true, fase: "5. CARPINTERÍA & PINTURA", actividad: "Ventanería aluminio, puertas y barandas balcón", inicio: "2026-11-25", fin: "2026-12-03", peso: 5, matchKeywords: ["ventaneria", "puerta", "baranda"] },
];

export const DEMO_PLANOS_SHOWCASE = getPortico2nBlueprints().map((bp) => ({
  id: bp.id,
  codigo: bp.codigo,
  nombre: bp.titulo,
  nombre_en: bp.titulo_en,
  disciplina: bp.disciplina === "Arquitectónico" ? "ARQUITECTURA" : "ESTRUCTURAS",
  version: bp.revision,
  escala: bp.escala,
  fecha: bp.fecha,
  proyecto: "Residencial Pórtico 2N + Balcón",
  descripcion: bp.descripcion,
  descripcion_en: bp.descripcion_en,
  url: bp.archivoImg,
  tipo: "imagen",
  notaCalidad: bp.notaCalidad,
}));

export const DEMO_ENSAYOS_CONCRETO = [
  {
    id: 9501,
    codigoCilindro: "P2N-ZAP-01",
    proyecto: "Residencial Pórtico 2N + Balcón",
    elemento: "Zapatas Z-1..Z-9, Pedestales 40×40 & Vigas VC",
    elemento_en: "Footings Z-1..Z-9, Pedestals 16\"×16\" & Grade Beams VC",
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
    codigoCilindro: "P2N-COL-01",
    proyecto: "Residencial Pórtico 2N + Balcón",
    elemento: "Columnas C1–C9, Vigas VE & Losa Maciza L-1 / Balcón",
    elemento_en: "Columns C1–C9, Floor Beams VE, Slab L-1 & Balcony LV-1",
    fechaVaciado: "2026-11-05",
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
    numeroRemision: "RMX-P2N-4102",
    proyecto: "Residencial Pórtico 2N + Balcón",
    proveedor: "Northbridge Ready-Mix Plant A",
    placaMixer: "RMX-904",
    conductor: "Operador Planta 04",
    volumenM3: foundShifts[0],
    asentamientoMm: 125,
    temperaturaC: 27.5,
    horaSalidaPlanta: "08:05",
    horaLlegadaObra: "08:32",
    horaFinDescarga: "09:12",
    elementoFundido: "Zapatas Z-1..Z-9, Pedestales 40×40 & Vigas Cimentación VC",
    elementoFundido_en: "Footings Z-1..Z-9, Pedestals & Grade Beams VC",
    quienRecibe: "Residente QA — Campo",
    estadoTiempo: "CUMPLIÓ (67 min)",
    observaciones: "Slump 5.0\" verificado en descarga, sin adición de agua en sitio.",
    observaciones_en: 'Slump 5.0" verified at chute, zero site water added.',
  },
  {
    id: 9602,
    numeroRemision: "RMX-P2N-4189",
    proyecto: "Residencial Pórtico 2N + Balcón",
    proveedor: "Northbridge Ready-Mix Plant A",
    placaMixer: "RMX-912",
    conductor: "Operador Planta 08",
    volumenM3: superShifts[1],
    asentamientoMm: 130,
    temperaturaC: 28.0,
    horaSalidaPlanta: "13:15",
    horaLlegadaObra: "13:44",
    horaFinDescarga: "14:22",
    elementoFundido: "Vigas VE 30×40, Losa Maciza L-1 (e=12) & Balcón Voladizo LV-1",
    elementoFundido_en: "Floor Beams VE, Solid Slab L-1 & Cantilever Balcony LV-1",
    quienRecibe: "Residente QA — Campo",
    estadoTiempo: "CUMPLIÓ (67 min)",
    observaciones: "Bombeo continuo, 3 cilindros testigos ASTM C31 tomados.",
    observaciones_en: "Continuous boom pump pour, 3 ASTM C31 test cylinders cast.",
  },
];

export const DEMO_ALMACEN_MATERIALES = [
  { id: 1, codigo: "MAT-CEM-01", nombre: "Cemento Gris Tipo I (Sacos 50kg)", categoria: "CEMENTOS Y MORTEROS", unidad: "Saco 50kg", stock: 112, stockMinimo: 25, costoUnitario: 34500, ubicacion: "Bodega Seca A1" },
  { id: 2, codigo: "MAT-BLO-12", nombre: "Bloque de Concreto No. 12 (40×20×12)", categoria: "MAMPOSTERÍA", unidad: "Unidad", stock: 420, stockMinimo: 100, costoUnitario: 2950, ubicacion: "Patio Acopio Norte" },
  { id: 3, codigo: "MAT-PVC-04", nombre: 'Tubería PVC Sanitaria Ø 4" (110 mm) + Accesorios', categoria: "INSTALACIONES PLUVIALES", unidad: "ml", stock: 18, stockMinimo: 6, costoUnitario: 42500, ubicacion: "Bodega Tubería B1" },
  { id: 4, codigo: "MAT-IMP-01", nombre: "Membrana Elastomérica Impermeabilizante Cubierta", categoria: "CUBIERTA & IMPERM.", unidad: "m²", stock: 75, stockMinimo: 15, costoUnitario: 38000, ubicacion: "Bodega Seca A2" },
  { id: 5, codigo: "MAT-POR-51", nombre: "Porcelanato 51×51 cm Tráfico 5 (cajas 1.56 m²)", categoria: "ACABADOS Y PINTURAS", unidad: "m²", stock: 118, stockMinimo: 20, costoUnitario: 68000, ubicacion: "Bodega Acabados B2" },
];

export const DEMO_ALMACEN_MOVIMIENTOS = [
  { id: 8001, fecha: "2026-11-10", hora: "07:45", materialId: 4, materialCodigo: "MAT-IMP-01", materialNombre: "Membrana Elastomérica Impermeabilizante Cubierta", tipo: "SALIDA", cantidad: 66, costoUnitario: 38000, totalCop: 2508000, responsable: "Frente Losa Cubierta & Afine 1%", destino: "Losa cubierta L-2 pendiente 1% (+5.89→+5.82 m)" },
  { id: 8002, fecha: "2026-11-11", hora: "10:15", materialId: 5, materialCodigo: "MAT-POR-51", materialNombre: "Porcelanato 51×51 cm Tráfico 5 (cajas 1.56 m²)", tipo: "SALIDA", cantidad: 24, costoUnitario: 68000, totalCop: 1632000, responsable: "Frente Envolvente, Pisos & Cubierta", destino: "Piso Sala & Comedor Nivel 1" },
  { id: 8003, fecha: "2026-11-11", hora: "08:20", materialId: 3, materialCodigo: "MAT-PVC-04", materialNombre: 'Tubería PVC Sanitaria Ø 4" (110 mm) + Accesorios', tipo: "SALIDA", cantidad: 7, costoUnitario: 42500, totalCop: 297500, responsable: "Frente Hidrosanitaria", destino: 'Tragante esquina A/3 y bajante aguas lluvias BLL-1 (Ø 4")' },
];

export const DEMO_ALMACEN_HERRAMIENTAS = [
  { id: 1, codigo: "EQ-VIB-01", nombre: "Vibrador Eléctrico para Concreto 2HP", categoria: "EQUIPO PESADO / COMPACTACIÓN", estado: "DISPONIBLE", ubicacion: "Pañol Equipos", asignadoA: "-" },
  { id: 2, codigo: "EQ-NIV-01", nombre: "Nivel Láser Autonivelante 360°", categoria: "MEDICIÓN Y TOPOGRAFÍA", estado: "EN USO", ubicacion: "Sala", asignadoA: "Frente Acabados" },
  { id: 3, codigo: "EQ-COR-01", nombre: "Cortadora de Porcelanato Diamante 900mm", categoria: "HERRAMIENTA DE ACABADOS", estado: "EN USO", ubicacion: "Comedor", asignadoA: "Frente Pisos" },
];

export const DEMO_ALMACEN_PRESTAMOS = [
  { id: 7001, fecha: "2026-11-12", horaSalida: "07:30", horaRegreso: "-", herramientaId: 2, codigo: "EQ-NIV-01", nombre: "Nivel Láser Autonivelante 360°", operario: "Líder Acabados #1", frente: "Sala", estado: "PRESTADO" },
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
        id: "ptar-p2n-1",
        codigo: "PTAR-P2N-001",
        fecha: fieldIsoOffsetDays(-2),
        tipo: "alturas",
        frente: "Losa Cubierta RC, Antepecho h=1.00m & Alfajía (+6.80 m)",
        frenteEn: "RC Roof Deck, 1.00m Parapet & Coping (+22.3 ft)",
        responsable: "Inspector SST • Campo",
        responsableEn: "Site HSE Officer",
        alturaM: 6.8,
        ptarChecklistOk: true,
        arlVerificada: true,
        estado: "vigente",
        notas: "Línea de vida perimetral certificada sobre antepecho +6.80 m y doble eslinga con absorbedor.",
        notasEn: "Certified perimeter lifeline along +22.3 ft parapet and twin-leg shock-absorbing lanyard verified.",
      },
      {
        id: "ptar-p2n-2",
        codigo: "PTAR-P2N-002",
        fecha: fieldIsoOffsetDays(-1),
        tipo: "izaje",
        frente: 'Vaciado Losa L-2 + Anclaje Bajante PVC 4" Fachada Este',
        frenteEn: 'Roof Slab L-2 Pour + 4" PVC Downspout Anchor Install',
        responsable: "Inspector SST • Campo",
        responsableEn: "Site HSE Officer",
        alturaM: 5.8,
        ptarChecklistOk: true,
        arlVerificada: true,
        estado: "vigente",
        notas: "Andamio certificado en Eje 3 y frenos anticaídas activos durante instalación de abrazaderas PVC 4\".",
        notasEn: "Certified scaffold along Grid 3 & rope-grab arrestors active during 4\" PVC clamp mounting.",
      },
      {
        id: "ptar-p2n-3",
        codigo: "PTAR-P2N-003",
        fecha: fieldIsoOffsetDays(0),
        tipo: "electrico",
        frente: "Tablero Provisional Cocina N1 & LOTO",
        frenteEn: "L1 Kitchen Temporary Panel & LOTO",
        responsable: "Técnico Eléctrico RETIE",
        responsableEn: "Licensed Site Electrician (LOTO)",
        ptarChecklistOk: true,
        arlVerificada: true,
        estado: "pendiente",
        notas: "En espera de cierre de candado LOTO y verificación ausencia de tensión.",
        notasEn: "Pending LOTO padlock verification and zero-energy test sign-off.",
      },
      {
        id: "ptar-p2n-4",
        codigo: "PTAR-P2N-004",
        fecha: fieldIsoOffsetDays(-12),
        tipo: "excavacion",
        frente: "Zapatas Z-1..Z-9, Pedestales 40×40 y Vigas VC",
        frenteEn: "Footings Z-1..Z-9, Pedestals & Grade Beams",
        responsable: "Inspector SST • Campo",
        responsableEn: "Site HSE Officer",
        alturaM: 1.5,
        ptarChecklistOk: true,
        arlVerificada: true,
        estado: "cerrado",
        notas: "Cimentación fundida y rellenada; frente liberado sin novedades.",
        notasEn: "Footing and pedestal pour completed cleanly; excavation closed.",
      },
    ],
    charlas: [
      {
        id: "talk-p2n-1",
        fecha: fieldIsoOffsetDays(0),
        frente: "Balcón Voladizo N2 & Escalera ESC-1",
        frenteEn: "L2 Cantilever Balcony & Stair ESC-1",
        tema: "Protección contra caídas en bordes de voladizo (+3.00 m) y hueco de escalera",
        temaEn: "Fall protection at balcony cantilever edges (+9.8 ft) and stairwell opening",
        instructor: "Coordinación HSE Showcase",
        instructorEn: "Site HSE Coordinator",
        asistentes: 10,
        atsCompletado: true,
      },
      {
        id: "talk-p2n-2",
        fecha: fieldIsoOffsetDays(-1),
        frente: "Sala / Comedor — Acabados N1",
        frenteEn: "L1 Living / Dining — Flooring Finishes",
        tema: "Protección respiratoria por polvo de sílice en corte de porcelanato 51×51 y pañete",
        temaEn: "Silica dust respirator control during porcelain wet-cutting & stucco sanding",
        instructor: "Coordinación HSE Showcase",
        instructorEn: "Site HSE Coordinator",
        asistentes: 8,
        atsCompletado: true,
      },
    ],
    eppTrabajadores: [
      {
        id: "epp-p2n-1",
        codigo: "P2N-01",
        rol: 'Oficial Impermeabilización & Plomería PVC 4"',
        rolEn: 'Roof Waterproofing & 4" PVC Pipefitter',
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
        id: "epp-p2n-2",
        codigo: "P2N-02",
        rol: "Oficial Estructura Losa L-2 & Antepecho",
        rolEn: "Lead RC Roof & Masonry Foreman",
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
        id: "epp-p2n-3",
        codigo: "P2N-03",
        rol: "Oficial Mampostería Bloque N° 12",
        rolEn: "CMU No. 12 Lead Mason",
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
        id: "epp-p2n-4",
        codigo: "P2N-04",
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
    ],
    incidentes: [
      {
        id: "inc-p2n-1",
        fecha: fieldIsoOffsetDays(-1),
        tipo: "condicion_insegura",
        frente: "Hueco Escalera Nivel 2 (+3.00 m)",
        frenteEn: "Level 2 Stairwell Void (+9.8 ft)",
        descripcion: "Baranda provisional de madera con tornillo suelto previo a colocación de BAR-4.",
        descripcionEn: "Temporary wood guardrail post loose prior to permanent BAR-4 steel rail install.",
        accionCapa: "Reajustar anclaje provisional e instalar rodapié continuo de seguridad.",
        accionCapaEn: "Re-anchor temporary post and install toe-board until steel rail installation.",
        responsable: "Inspector SST • Campo",
        fechaLimite: fieldIsoOffsetDays(0),
        cerrado: true,
      },
    ],
  };
}
