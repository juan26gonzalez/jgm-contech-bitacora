export function getUnitSystem(lang) {
  return lang === "en" ? "imperial" : "metric";
}

function normalizeUnitKey(unit) {
  return String(unit || "und")
    .trim()
    .toLowerCase()
    .replace(/²/g, "2")
    .replace(/³/g, "3");
}

export function unitConversionFactor(metricUnit) {
  const u = normalizeUnitKey(metricUnit);
  if (u === "m2" || u === "m2." || u === "m^2" || u.startsWith("m2/")) return 10.7639104;
  if (u === "m3" || u === "m3." || u === "m^3" || u.startsWith("m3/")) return 1.3079506;
  if (u === "ml" || u === "m" || u === "m.l." || u.startsWith("ml/") || u.startsWith("m/")) {
    return 3.2808399;
  }
  if (u === "kg" || u === "kgs" || u.startsWith("kg/")) return 2.2046226;
  if (u === "l" || u === "lt" || u === "lts" || u === "litro" || u === "litros") return 0.264172;
  if (u === "mm") return 0.0393701;
  if (u === "cm" || u === "pulg") return 0.3937008;
  if (u === "mpa") return 145.0377;
  if (u === "kn") return 0.2248089;
  return 1;
}

export function convertQty(qtyMetric, metricUnit, lang) {
  const n = Number(qtyMetric || 0);
  if (!Number.isFinite(n)) return 0;
  if (lang === "es") return n;
  return n * unitConversionFactor(metricUnit);
}

export function convertInputToMetric(inputQty, metricUnit, lang) {
  const n = Number(inputQty || 0);
  if (!Number.isFinite(n)) return 0;
  if (lang === "es") return n;
  const f = unitConversionFactor(metricUnit);
  return f > 0 ? n / f : n;
}

export function convertLengthM(meters, lang) {
  const n = Number(meters || 0);
  if (!Number.isFinite(n)) return 0;
  return lang === "en" ? n * 3.2808399 : n;
}

export function convertLengthInputToM(val, lang) {
  const n = Number(val || 0);
  if (!Number.isFinite(n)) return 0;
  return lang === "en" ? n / 3.2808399 : n;
}

export function convertTempC(celsius, lang) {
  const c = Number(celsius || 0);
  if (!Number.isFinite(c)) return 0;
  return lang === "en" ? c * 1.8 + 32 : c;
}

export function convertStrengthMpa(mpa, lang) {
  const m = Number(mpa || 0);
  if (!Number.isFinite(m)) return 0;
  return lang === "en" ? m * 145.0377 : m;
}

export function convertForceKn(kn, lang) {
  const k = Number(kn || 0);
  if (!Number.isFinite(k)) return 0;
  return lang === "en" ? k * 0.2248089 : k;
}

export function convertUnitLabel(metricUnit, lang) {
  const raw = String(metricUnit || "und").trim();
  if (lang === "es") return raw || "und";
  const u = normalizeUnitKey(raw);
  if (u === "m2" || u === "m2." || u === "m^2") return "ft²";
  if (u === "m3" || u === "m3." || u === "m^3") return "yd³";
  if (u === "ml" || u === "m" || u === "m.l.") return "ft";
  if (u === "kg" || u === "kgs") return "lb";
  if (u === "mm" || u === "cm") return "in";
  if (u === "mpa") return "PSI";
  if (u === "kn") return "kip";
  if (u === "und" || u === "u" || u === "un" || u === "pieza" || u === "pza" || u === "unidades" || u === "unidad") {
    return "ea";
  }
  if (u === "gl" || u === "glb" || u === "global") return "LS";
  if (u.includes("saco 50kg") || u.includes("saco")) return "bags (110 lb)";
  if (u.includes("bulto 25kg") || u.includes("bulto")) return "bags (55 lb)";
  if (u.includes("cuñete") || u.includes("cunete")) return "5-gal pails";
  if (u.includes("lámina") || u.includes("lamina")) return "4'×8' sheets";
  if (u.includes("rollo")) return "rolls";
  if (u === "gal" || u === "galón" || u === "galon" || u === "galones" || u === "g") return "gal";
  if (u === "l" || u === "lt" || u === "lts" || u === "litro" || u === "litros") return "gal";
  if (u === "m2/dia" || u === "m2/día") return "ft²/day";
  if (u === "m3/dia" || u === "m3/día") return "yd³/day";
  if (u === "ml/dia" || u === "ml/día" || u === "m/dia" || u === "m/día") return "ft/day";
  if (u === "kg/dia" || u === "kg/día") return "lb/day";
  if (u === "unidades/dia" || u === "unidades/día" || u === "und/dia" || u === "und/día") return "ea/day";
  return raw;
}

export function convertUnitPriceCopToDisplay(priceCopPerMetricUnit, metricUnit, currency, rates, lang) {
  const fx = rates?.[currency] || 1;
  const priceInCurr = Number(priceCopPerMetricUnit || 0) / fx;
  if (lang === "es") return priceInCurr;
  return priceInCurr / unitConversionFactor(metricUnit);
}

const CHAPTER_EN_MAP = [
  [/^1\.\s*ESTRUCTURA\s*(&|Y)\s*CIMENTACI[ÓO]N$/i, "1. STRUCTURE & FOUNDATIONS"],
  [/^2\.\s*MAMPOSTER[ÍI]A\s*(&|Y)\s*PAÑETES$/i, "2. MASONRY & PLASTERING"],
  [/^1\.\s*MAMPOSTER[ÍI]A$/i, "1. MASONRY & BLOCKWORK"],
  [/^2\.\s*PISOS\s*(&|Y)\s*ENCHAPES$/i, "2. FLOORING & TILING"],
  [/^3\.\s*PISOS\s*(&|Y)\s*ENCHAPES$/i, "3. FLOORING & TILING"],
  [/^3\.\s*CIELOS\s*RASOS\s*(&|Y)\s*FRESCASA$/i, "3. CEILINGS & INSULATION"],
  [/^3\.\s*CIELOS\s*RASOS$/i, "3. CEILINGS & ACOUSTICS"],
  [/^4\.\s*CIELOS\s*RASOS\s*(&|Y)\s*FRESCASA$/i, "4. CEILINGS & INSULATION"],
  [/^4\.\s*ACABADOS\s*(&|Y)\s*PINTURA$/i, "4. FINISHES & PAINTING"],
  [/^5\.\s*CARPINTER[ÍI]A\s*(&|Y)\s*PINTURA$/i, "5. PAINTING & GLAZING"],
  [/^5\.\s*CARPINTER[ÍI]A$/i, "5. DOORS & ALUMINUM GLAZING"],
  [/^6\.\s*CUBIERTA$/i, "6. ROOFING & ENVELOPE"],
  [/^1\.\s*PRELIMINARES$/i, "1. SITE PRELIMINARIES"],
  [/^2\.\s*EXCAVACIONES$/i, "2. EARTHWORK & EXCAVATION"],
  [/^3\.\s*CIMENTACI[ÓO]N$/i, "3. FOUNDATIONS & SLABS"],
  [/^4\.\s*ACERO\s*DE\s*REFUERZO$/i, "4. REINFORCING STEEL (REBAR)"],
  [/^5\.\s*ACERO\s*ESTRUCTURAL$/i, "5. STRUCTURAL STEEL"],
  [/^6\.\s*MAMPOSTER[ÍI]A$/i, "6. MASONRY & BLOCKWORK"],
  [/^7\.\s*LIMPIEZA$/i, "7. FINAL CLEANING & HANDOVER"],
  [/^FASE\s*1\s*[—-]\s*ESTRUCTURA\s*&\s*MAMPOSTER[ÍI]A$/i, "PHASE 1 — STRUCTURE & MASONRY"],
  [/^FASE\s*2\s*[—-]\s*ENVOLVENTE,\s*PISOS\s*&\s*CIELO\s*RASO$/i, "PHASE 2 — ENVELOPE, FLOORING & CEILING"],
  [/^FASE\s*3\s*[—-]\s*ACABADOS\s*ARQUITECT[ÓO]NICOS\s*&\s*ENTREGA$/i, "PHASE 3 — ARCHITECTURAL FINISHES & HANDOVER"],
  [/^PRELIMINARES$/i, "SITE PRELIMINARIES"],
  [/^CIMENTACI[ÓO]N\s*Y\s*ESTRUCTURA$/i, "FOUNDATIONS & STRUCTURE"],
  [/^MAMPOSTER[ÍI]A\s*Y\s*CERRAMIENTOS$/i, "MASONRY & ENCLOSURES"],
  [/^CUBIERTAS?$/i, "ROOFING & ENVELOPE"],
  [/^CARPINTER[ÍI]A\s*E\s*INSTALACIONES$/i, "MILLWORK, GLAZING & MEP"],
  [/^ACABADOS\s*Y\s*REVESTIMIENTOS$/i, "FINISHES & COATINGS"],
  [/^CIELOS?\s*RASOS?\s*Y\s*AISLAMIENTO$/i, "CEILINGS & INSULATION"],
];

const EXACT_PHRASE_EN = {
  "Zapatas y vigas de cimentación f'c=21 MPa": "Spread footings & grade beams concrete f'c=3,000 PSI",
  "Columnas y pórtico estructural f'c=24 MPa": "Structural columns & portal frame f'c=3,500 PSI",
  "Muros en mampostería bloque No. 12": "Concrete masonry walls (CMU No. 12)",
  "Pañete y mortero de revoco dos caras": "Cement stucco plaster & screeding (two sides)",
  "Montaje de cubierta termoacústica Eternit": "Thermo-acoustic fiber-cement roof deck assembly",
  "Plantilla de concreto e=7cm + piso porcelanato": 'Concrete sub-slab (t=2.75") + 20"×20" porcelain floor tile',
  'Cielo raso suspendido + aislamiento Frescasa 2-1/2"': 'Suspended drywall ceiling + Frescasa Eco 2-1/2" insulation',
  "Estuco plástico y pintura arquitectónica": "Skim coat putty & architectural latex paint",
  "Ventanería en aluminio y puertas de acceso": "Aluminum glazing systems & entry doors",
  "Demolición y retiro de material (plantillas, muros)": "Demolition & debris removal (slabs, walls)",
  "Construcción de plantilla de concreto": "Concrete leveling sub-slab construction",
  "Concreto en zapatas y cimentación": "Concrete for spread footings & foundations",
  "Concreto en vigas de amarre y aéreas": "Concrete for tie & elevated beams",
  "Concreto en columnas estructurales": "Concrete for structural columns",
  "Muros en mampostería de bloques de concreto": "Concrete block masonry walls",
  "Montaje de cubierta en Eternit": "Fiber-cement roof deck installation",
  "Red de tubería hidrosanitaria PVC": "PVC plumbing & sanitary piping network",
  "Pañete y mortero de revoco en muros": "Cement stucco & wall plastering",
  "Instalación de cielo raso": "Suspended drywall ceiling installation",
  "Instalación de piso cerámico / enchape": "Porcelain / ceramic floor & tile installation",
  "Estuco y pintura vinílica en muros": "Skim coat putty & latex wall painting",
  "Instalación de guardaescobas": "Baseboard & trim installation",
  "Instalación de puertas y ventanas": "Doors & window glazing installation",
  "Instalación de puertas interiores y baño": "Interior & bathroom door installation",
  "Instalación de aparatos sanitarios y lavaplatos": "Plumbing fixtures & sink installation",
  "Plantilla de concreto e=7cm (Casa Mendoza)": 'Concrete leveling sub-slab (t=2.75")',
  "Enchape de pared cerámica / porcelanato (Cocina/Baño)": "Ceramic / porcelain wall tiling (Kitchen & Bath)",
  'Instalación de aislamiento termoacústico Frescasa Eco 2-1/2"': 'Frescasa Eco 2-1/2" thermal-acoustic insulation installation',
  "Concreto en zapatas y vigas de cimentación f'c=21 MPa": "Spread footings & grade beams concrete f'c=3,000 PSI",
  "Concreto en columnas y pórtico estructural f'c=24 MPa": "Structural frame columns & tie beams concrete f'c=3,500 PSI",
  "Muros en mampostería de bloques de concreto No. 12": "Concrete masonry unit (CMU No. 12) interior & facade walls",
  "Muros en mampostería de bloques de concreto No. 12 (227.89 m²)": "Concrete masonry unit (CMU No. 12) walls",
  "Pañete y mortero de revoco en muros dos caras": "Cement stucco plaster & screeding on walls (two sides)",
  "Pañete y mortero de revoco en muros (dos caras)": "Cement stucco plaster & screeding on walls (two sides)",
  "Instalación de piso en porcelanato 51x51 cm y plantilla": '20"×20" Porcelain tile flooring & 2.75" leveling sub-slab',
  "Instalación de piso en porcelanato 51×51 cm y plantilla": '20"×20" Porcelain tile flooring & 2.75" leveling sub-slab',
  "Plantilla de concreto e=7cm (base y solado de piso)": 'Concrete floor leveling slab (t=2.75") & mud slab',
  "Plantilla de concreto e=7cm (base de piso)": 'Concrete floor leveling sub-slab (t=2.75")',
  "Instalación de piso en porcelanato 51x51 cm y enchape": '20"×20" Porcelain tile flooring & wall cladding',
  "Instalación de piso en porcelanato 51×51 cm y enchape": '20"×20" Porcelain tile flooring & wall cladding',
  'Cielo raso suspendido Drywall + Aislamiento Frescasa Eco 2-1/2"': 'Suspended drywall ceiling + Frescasa Eco 2-1/2" thermal insulation',
  "Instalación de cielo raso suspendido e=5.3cm": 'Suspended drywall ceiling installation (t=2.1")',
  'Suministro e instalación de aislamiento termoacústico Frescasa Eco 2-1/2" sobre cielo raso (todas las zonas)': 'Frescasa Eco 2-1/2" thermal-acoustic fiberglass insulation over ceiling',
  "Estuco plástico y pintura vinílica arquitectónica en muros": "Skim coat putty & Grade-1 architectural latex paint on walls",
  "Estuco plástico y pintura vinílica en muros": "Skim coat putty & Grade-1 architectural latex paint on walls",
  "Ventanería aluminio termoacústica y puertas interiores": "Thermo-acoustic aluminum windows & interior doors",
  "Montaje de cubierta termoacústica Eternit y caballetes": "Thermo-acoustic fiber-cement roofing & ridge cap assembly",
  "Montaje de cubierta en teja ondulada Eternit y caballetes": "Corrugated fiber-cement roofing & ridge cap assembly",
  "Suministro e instalación de puertas interiores y acceso (7 und)": "Supply & installation of interior & entry doors (7 ea)",
  "Suministro e instalación de ventanería en aluminio y vidrio (8 und)": "Supply & installation of aluminum & glass windows (8 ea)",
  "Localización, trazado y replanteo": "Site layout, survey & staking",
  "Excavación mecánica y manual para zapatas y vigas de cimentación": "Footings & grade beam excavation",
  "Solado de concreto de limpieza e=5cm": 'Lean concrete mud slab (t=2")',
  "Concreto estructural 3500 PSI para zapatas": "Structural concrete 3,500 PSI for footings",
  "Acero de refuerzo 60,000 PSI (PDR-60) en zapatas y vigas": "Grade 60 deformed rebar for footings & beams",
  "Suministro e instalación de acero estructural (I-Beams y columnas)": "Structural wide-flange steel beams & columns",
  "Muro en mampostería estructural bloque N° 4": "CMU No. 4 structural masonry walls",
  "Limpieza general y desmonte de campamento": "Final site cleanup & demobilization",
  "Despejado / Soleado": "Clear / Sunny",
  "Nublado": "Overcast / Cloudy",
  "Llovizna Ligera": "Light Drizzle",
  "Lluvia Fuerte (Pausa)": "Heavy Rain (Standby)",
  "Completado": "Completed",
  "En Curso": "In Progress",
  "Sin Iniciar": "Not Started",
  "A Tiempo": "On Schedule",
  "Con Atraso": "Delayed",
  "Sin Avance": "Not Started",
  "PENDIENTE": "PENDING",
  "APROBADO": "APPROVED",
  "RECHAZADO": "REJECTED",
  "Aprobado (Cumple ≥100%)": "Compliant (≥100% Design)",
  "Bajo Resistencia (<100%)": "Below Spec (<100% f'c)",
  "En Tiempo (≤90 min)": "Compliant (≤90 min)",
  "Fuera de Tiempo (>90 min)": "Out of Spec (>90 min)",
  "Operativo / Cuadrilla": "Field Crew / Inspector",
};

const WEATHER_EN_MAP = {
  "Despejado / Soleado": "Clear / Sunny",
  "Nublado": "Overcast / Cloudy",
  "Llovizna Ligera": "Light Drizzle",
  "Lluvia Fuerte (Pausa)": "Heavy Rain (Standby)",
};

const ROOM_EN_MAP = {
  "Lobby Principal": "Main Lobby",
  "Oficina Norte": "North Office",
  "Sala de Juntas": "Executive Boardroom",
  "Zona A — Pórticos & Cimentación": "Zone A — Foundations & Structural Frame",
  "Zona B — Envolvente & Acabados": "Zone B — Envelope & Architectural Finishes",
  "Zona C — Cubierta & Carpintería": "Zone C — Roofing & Glazing",
  "Zona General — Obra Completa": "General Zone — Full Site",
  "Habitación Mamá": "Master Suite / Bedroom 1",
  "Habitacion Mama": "Master Suite / Bedroom 1",
  "Habitación Principal": "Primary Bedroom",
  "Habitación Abuelos": "Bedroom 2",
  "Habitación Esteban": "Bedroom 3",
  "Habitación Lisbeth": "Bedroom 4",
  "Habitación Huésped": "Guest Bedroom",
  "Habitación Nan & I": "Suite — Private",
  "Sala Comedor / Recibidor": "Living / Dining / Foyer",
  "Cocina": "Kitchen",
  "Baño 1": "Bathroom 1",
  "Baño 2": "Bathroom 2",
  "Pasillo": "Hallway",
  "Patio": "Patio / Courtyard",
  "Cubierta": "Roof Deck",
};

const MATERIAL_EN_MAP = [
  [/Cemento\s+Gris\s+Tipo\s+I.*/i, "Portland Cement Type I/GU (110 lb Bag)"],
  [/Arena\s+de\s+R[íi]o\s+Lavada/i, "Washed River Sand (Concrete Grade)"],
  [/Gravilla\s+Triturada\s+3\/4.*/i, '3/4" Crushed Coarse Aggregate'],
  [/Acero\s+Corrugado\s+1\/2.*/i, 'Grade 60 Deformed Rebar #4 (1/2")'],
  [/Bloque\s+(?:Estructural|de Concreto)\s+N[°o]\.?\s*12.*/i, "Concrete Masonry Unit (CMU No. 12)"],
  [/Bloque\s+Estructural\s+N[°o]\.?\s*4/i, "Structural CMU Block No. 4"],
  [/Porcelanato\s+51[x×]51.*/i, '20"×20" Architectural Porcelain Floor Tile'],
  [/L[áa]mina\s+Drywall\s+RH.*/i, 'Moisture-Resistant Drywall Board (4\'×8\')'],
  [/Rollo\s+Frescasa\s+Eco.*/i, 'Frescasa Eco 2-1/2" Fiberglass Insulation Roll'],
  [/Teja\s+Ondulada\s+Eternit.*/i, "Corrugated Fiber-Cement Roof Sheet"],
  [/Pintura\s+Vin[íi]lica\s+Tipo\s+1.*/i, "Grade-1 Architectural Latex Paint"],
  [/Alambre\s+Negro\s+Recocido.*/i, "18-Gauge Black Annealed Tie Wire"],
  [/Estuco\s+Pl[áa]stico.*/i, "Ready-Mix Acrylic Skim Coat Putty"],
];

const CREW_SPECIALTY_EN = [
  [/Frente\s+Estructura\s*&\s*Cimentaci[óo]n/i, "Structure & Foundations Crew"],
  [/Frente\s+Envolvente,\s*Pisos\s*&\s*Cubierta/i, "Envelope, Flooring & Roofing Crew"],
  [/Frente\s+Acabados\s*&\s*Carpinter[íi]a/i, "Finishes & Glazing Crew"],
  [/Cuadrilla\s+Estructura/i, "Structural Concrete Crew"],
  [/Cuadrilla\s+Mamposter[íi]a/i, "Masonry Crew"],
  [/Cuadrilla\s+Pañete/i, "Plastering Crew"],
  [/Cuadrilla\s+Obra\s+Gris/i, "Slab & Screed Crew"],
  [/Cuadrilla\s+Pintura/i, "Painting Crew"],
  [/Cuadrilla\s+Met[áa]lica/i, "Roofing & Steel Crew"],
  [/Cuadrilla\s+Acabados/i, "Finishes Crew"],
  [/Cuadrilla\s+Demolici[óo]n/i, "Demolition Crew"],
  [/Cuadrilla\s+Concretos/i, "Structural Concrete Crew"],
  [/Cuadrilla\s+Pegadores/i, "Masonry Block Crew"],
  [/Cuadrilla\s+Pañetadores/i, "Plastering Crew"],
  [/Cuadrilla\s+Drywall/i, "Drywall Ceiling Crew"],
  [/Cuadrilla\s+Pisos/i, "Flooring Crew"],
  [/Cuadrilla\s+Aislamiento/i, "Insulation Crew"],
  [/Cuadrilla\s+Cubiertas/i, "Roofing Crew"],
  [/Oficial\s+Estructuras/i, "Structural Lead Tech"],
  [/Especialista\s+Cubiertas/i, "Roofing Specialist"],
  [/T[ée]cnico\s+Hidrosanitario/i, "Plumbing Technician"],
  [/Topograf[íi]a\s*\/\s*Residente/i, "Survey / Site Engineer"],
  [/Carpinter[íi]a\s+Met[áa]lica/i, "Metal & Glazing Crew"],
  [/Carpinter[íi]a\s+Aluminio/i, "Aluminum Glazing Crew"],
  [/Carpinter[íi]a\s+Madera/i, "Wood Millwork Crew"],
  [/Plomer[íi]a\s*\/\s*Acabados/i, "Plumbing & Fixtures Crew"],
  [/Enchapadores/i, "Tile Installers"],
  [/Cuadrilla\s+1/i, "Masonry Crew 1"],
  [/Cuadrilla\s+2/i, "Plastering Crew 2"],
  [/Personal\s+de\s+campo\s*\(Operativo\)/i, "Field Crew (Operations)"],
  [/Supervisor\s+de\s+Obra/i, "Site Supervisor"],
];

export function localizeWeather(w, lang) {
  const raw = String(w || "").trim();
  if (lang === "es" || !raw) return raw;
  return WEATHER_EN_MAP[raw] || raw;
}

export function localizeChapter(chapter, lang) {
  const raw = String(chapter || "").trim();
  if (lang === "es" || !raw) return raw;
  for (const [pattern, replacement] of CHAPTER_EN_MAP) {
    if (pattern.test(raw)) return replacement;
  }
  return raw;
}

export function localizeRoomName(room, lang) {
  const raw = String(room || "").trim();
  if (lang === "es" || !raw) return raw;
  return ROOM_EN_MAP[raw] || localizeTerm(raw, lang);
}

export function localizeMaterialName(name, lang) {
  const raw = String(name || "").trim();
  if (lang === "es" || !raw) return raw;
  for (const [pattern, replacement] of MATERIAL_EN_MAP) {
    if (pattern.test(raw)) return replacement;
  }
  return raw;
}

export function localizeCrew(crew, lang) {
  const raw = String(crew || "").trim();
  if (lang === "es" || !raw) return raw;
  let out = raw;
  for (const [pattern, replacement] of CREW_SPECIALTY_EN) {
    if (pattern.test(out)) {
      out = out.replace(pattern, replacement);
    }
  }
  return out
    .replace(/Oficiales\s+y\s+Ayudantes/gi, "Lead Techs & Helpers")
    .replace(/Oficiales/gi, "Skilled Technicians")
    .replace(/Oficial/gi, "Lead Tech")
    .replace(/(\d+\s*)Of\.?(?=\s|\+|$)/g, "$1Lead Tech")
    .replace(/Ayudantes/gi, "Helpers")
    .replace(/Ayudante/gi, "Helper")
    .replace(/(\d+\s*)Ayud\.?(?=\s|\+|$)/gi, (_, n) => (n.trim() === "1" ? `${n}Helper` : `${n}Helpers`))
    .replace(/Montadores/gi, "Roof & Steel Erectors")
    .replace(/Pintores/gi, "Painters");
}

export function localizeStatus(status, lang) {
  const raw = String(status || "").trim();
  if (lang === "es" || !raw) return raw;
  return EXACT_PHRASE_EN[raw] || raw;
}

export function localizeActivity(activity, lang) {
  const raw = String(activity || "").trim();
  if (!raw || lang === "es") return raw;
  const prefixMatch = raw.match(/^\[BIM[_ ]TAKEOFF\]\s*(.*)$/i);
  const body = prefixMatch ? prefixMatch[1].trim() : raw;
  const translated = EXACT_PHRASE_EN[body] || translateConstructionText(body);
  return prefixMatch ? `[BIM TAKEOFF] ${translated}` : translated;
}

export function localizeTerm(text, lang) {
  const raw = String(text || "").trim();
  if (!raw || lang === "es") return raw;
  if (EXACT_PHRASE_EN[raw]) return EXACT_PHRASE_EN[raw];
  return translateConstructionText(raw);
}

export function localizeBitacoraObservacion(obs, lang) {
  const raw = String(obs || "").trim();
  if (!raw || lang === "es") return raw;
  return translateConstructionText(raw)
    .replace(/Registro sincronizado/gi, "Field log synced")
    .replace(/Avance diario reportado/gi, "Daily progress reported")
    .replace(/Vaciado de concreto/gi, "Concrete pour")
    .replace(/sin novedades/gi, "verified per drawings")
    .replace(/control de niveles/gi, "elevation QA check");
}

function translateConstructionText(raw) {
  return String(raw || "")
    .replace(/Lobby Principal/gi, "Main Lobby")
    .replace(/Oficina Norte/gi, "North Office")
    .replace(/Sala de Juntas/gi, "Executive Boardroom")
    .replace(/Montaje de cubierta termoac[úu]stica(?:\s*\/\s*|\s+)Eternit(?:\s+y\s+caballetes)?/gi, "Thermo-acoustic fiber-cement roofing & ridge cap assembly")
    .replace(/Ventaner[íi]a\s+aluminio\s+termoac[úu]stica\s+y\s+puertas\s+interiores/gi, "Thermo-acoustic aluminum windows & interior doors")
    .replace(/Cielo\s*raso\s*suspendido\s*Drywall\s*\+\s*Aislamiento\s*Frescasa\s*Eco\s*2-1\/2"/gi, 'Suspended drywall ceiling + Frescasa Eco 2-1/2" insulation')
    .replace(/Instalaci[óo]n\s+de\s+piso\s+en\s+porcelanato\s+51[x×]51\s*(?:cm)?\s+y\s+plantilla/gi, '20"×20" Porcelain tile flooring & 2.75" leveling sub-slab')
    .replace(/Estuco\s+pl[áa]stico\s+y\s+pintura\s+vin[íi]lica\s+arquitect[óo]nica\s+en\s+muros/gi, "Skim coat putty & Grade-1 architectural latex paint on walls")
    .replace(/Concreto\s+en\s+zapatas\s+y\s+vigas\s+de\s+cimentaci[óo]n/gi, "Spread footings & grade beams concrete")
    .replace(/Concreto\s+en\s+columnas\s+y\s+p[óo]rtico\s+estructural/gi, "Structural columns & tie beams concrete")
    .replace(/Muros\s+en\s+mamposter[íi]a\s+de\s+bloques\s+de\s+concreto\s+No\.\s*12/gi, "Concrete masonry unit (CMU No. 12) walls")
    .replace(/Pañete\s+y\s+mortero\s+de\s+revoco\s+en\s+muros\s+dos\s+caras/gi, "Cement stucco plaster & screeding on walls (two sides)")
    .replace(/f'c\s*=\s*21\s*MPa/gi, "f'c=3,000 PSI")
    .replace(/f'c\s*=\s*24\.5\s*MPa/gi, "f'c=3,550 PSI")
    .replace(/f'c\s*=\s*24\s*MPa/gi, "f'c=3,500 PSI")
    .replace(/e\s*=\s*7\s*cm/gi, 't=2.75"')
    .replace(/51[x×]51\s*cm/gi, '20"×20"')
    .replace(/Zapatas\s+Z-/gi, "Footings F-")
    .replace(/Columnas\s+C-/gi, "Columns C-")
    .replace(/Nivel\s+1/gi, "Level 1")
    .replace(/Cubierta/gi, "Roof Deck")
    .replace(/Cimentaci[óo]n/gi, "Foundations")
    .replace(/sin novedades|seg[úu]n planos/gi, "verified per drawings");
}

export function sanitizeTextForDemo(text, lang = "es") {
  let out = String(text || "");
  out = out
    .replace(/DOLMEN\s*S\.?A\.?(?:\s*E\.?S\.?P\.?)?/gi, "Northbridge Capital Partners")
    .replace(/INGENDES\s*S\.?A\.?S\.?/gi, "JGM ConTech Engineering")
    .replace(/MEZZANINE\s*3\s*NIVELES/gi, "Northbridge Corporate Hub")
    .replace(/CASA\s*MENDOZA/gi, "Northbridge Corporate Hub")
    .replace(/Familia\s*Mendoza/gi, "Northbridge Capital Partners")
    .replace(/Carlos\s*Mendoza/gi, "Site Lead A")
    .replace(/Lab\.\s*Suelos\s*&\s*Materiales\s*CUC/gi, "Central Concrete QA Lab (ISO 17025)")
    .replace(/Ultracem/gi, "Northbridge Ready-Mix Plant A")
    .replace(/Cementos\s*Argos/gi, "Northbridge Supply")
    .replace(/Sabanalarga/gi, "Barranquilla / Miami / Madrid")
    .replace(/Juan\s*(?:Andr[ée]s\s*)?Gonz[áa]lez(?:\s*Mendoza)?/gi, lang === "en" ? "Project Director" : "Dirección de Proyecto")
    .replace(/M\.?\s*P\.?\s*08202-\d+ATL/gi, "ISO-19650");
  return out;
}
