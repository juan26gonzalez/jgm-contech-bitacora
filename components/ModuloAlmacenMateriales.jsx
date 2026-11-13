'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Printer,
  Search,
  Filter,
  Clock,
  Building,
  ShieldAlert,
  Boxes,
  ClipboardList,
  Wrench,
  Hammer,
  RotateCcw,
  UserCheck,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Layers,
  FileSpreadsheet,
  X,
  MapPin
} from 'lucide-react';
import { useAppPreferences } from '../lib/i18n';
import {
  DEMO_SHOWCASE_PROJECT_ID,
  DEMO_ALMACEN_MATERIALES,
  DEMO_ALMACEN_MOVIMIENTOS,
  DEMO_ALMACEN_HERRAMIENTAS,
  DEMO_ALMACEN_PRESTAMOS
} from '../lib/demoFieldData';
import {
  convertQty,
  convertInputToMetric,
  convertUnitLabel,
  localizeMaterialName,
  localizeCrew,
  localizeTerm
} from '../lib/units';

// =============================================================================
// 1. CATÁLOGO INICIAL DE MATERIALES DE OBRA (MEZZANINE 3 NIVELES)
// =============================================================================
const MATERIALES_INICIALES = [
  {
    id: "MAT-01",
    codigo: "CEM-01",
    nombre: "Cemento Gris Uso Estructural (Tipo UG)",
    categoria: "Aglomerantes",
    unidad: "Sacos (50 kg)",
    stockActual: 145,
    stockMinimo: 50,
    ubicacion: "Bodega Principal Techada",
    precioRef: 32000
  },
  {
    id: "MAT-02",
    codigo: "AGR-01",
    nombre: "Arena Lavada de Río (Concretera)",
    categoria: "Agregados",
    unidad: "m³",
    stockActual: 18.5,
    stockMinimo: 8.0,
    ubicacion: "Patio de Acopio Frente 1",
    precioRef: 68000
  },
  {
    id: "MAT-03",
    codigo: "AGR-02",
    nombre: "Grava Triturada 3/4\" (Para Concreto)",
    categoria: "Agregados",
    unidad: "m³",
    stockActual: 12.0,
    stockMinimo: 10.0,
    ubicacion: "Patio de Acopio Frente 1",
    precioRef: 75000
  },
  {
    id: "MAT-04",
    codigo: "ACE-01",
    nombre: "Acero de Refuerzo Figurado 1/2\" (60 KSI)",
    categoria: "Aceros",
    unidad: "kg",
    stockActual: 820,
    stockMinimo: 300,
    ubicacion: "Zona de Armado Nivel 1",
    precioRef: 5800
  },
  {
    id: "MAT-05",
    codigo: "ACE-02",
    nombre: "Acero de Refuerzo Figurado 3/8\" (60 KSI)",
    categoria: "Aceros",
    unidad: "kg",
    stockActual: 450,
    stockMinimo: 200,
    ubicacion: "Zona de Armado Nivel 1",
    precioRef: 5800
  },
  {
    id: "MAT-06",
    codigo: "MET-01",
    nombre: "Lámina Colaborante Metaldeck Calibre 22",
    categoria: "Estructura Metálica",
    unidad: "m²",
    stockActual: 95.0,
    stockMinimo: 30.0,
    ubicacion: "Entrepiso Nivel 2",
    precioRef: 62000
  },
  {
    id: "MAT-07",
    codigo: "BLO-01",
    nombre: "Bloque de Concreto Estructural No. 12",
    categoria: "Mampostería",
    unidad: "Unidades",
    stockActual: 620,
    stockMinimo: 400,
    ubicacion: "Acopio Perimetral Eje C",
    precioRef: 2800
  },
  {
    id: "MAT-08",
    codigo: "PER-01",
    nombre: "Pernos de Anclaje ASTM A325 5/8\" x 40cm",
    categoria: "Fijaciones",
    unidad: "Unidades",
    stockActual: 24,
    stockMinimo: 20,
    ubicacion: "Caja de Herramientas / Pañol",
    precioRef: 38000
  },
  {
    id: "MAT-09",
    codigo: "QUI-01",
    nombre: "Mortero Sin Contracción Sika Grout 212",
    categoria: "Químicos",
    unidad: "Sacos (25 kg)",
    stockActual: 8,
    stockMinimo: 6,
    ubicacion: "Bodega Químicos y Aditivos",
    precioRef: 125000
  },
  {
    id: "MAT-10",
    codigo: "TUB-01",
    nombre: "Tubería Conduit Eléctrica PVC 3/4\" (3m)",
    categoria: "Instalaciones",
    unidad: "Tubos",
    stockActual: 35,
    stockMinimo: 15,
    ubicacion: "Estante Eléctrico",
    precioRef: 14500
  }
];

// Movimientos de Kardex iniciales de materiales
const MOVIMIENTOS_INICIALES = [
  {
    id: "MOV-101",
    fecha: "2026-10-14",
    tipo: "entrada",
    materialId: "MAT-01",
    materialNombre: "Cemento Gris Uso Estructural (Tipo UG)",
    cantidad: 100,
    unidad: "Sacos (50 kg)",
    remision: "REM-Argos-7811",
    responsable: "Ing. Juan González",
    origenDestino: "Proveedor Cementos Argos Planta Barranquilla",
    observaciones: "Descarga de 100 sacos sobre estibas plásticas con lona protectora."
  },
  {
    id: "MOV-102",
    fecha: "2026-10-15",
    tipo: "salida",
    materialId: "MAT-01",
    materialNombre: "Cemento Gris Uso Estructural (Tipo UG)",
    cantidad: 30,
    unidad: "Sacos (50 kg)",
    remision: "VALE-001",
    responsable: "Oficial Pedro Martínez",
    origenDestino: "Frente 1: Vaciado de Zapatas Z1 y Pedestales",
    observaciones: "Mezcla de concreto in-situ para solados de nivelación."
  },
  {
    id: "MOV-103",
    fecha: "2026-10-20",
    tipo: "entrada",
    materialId: "MAT-04",
    materialNombre: "Acero de Refuerzo Figurado 1/2\" (60 KSI)",
    cantidad: 1000,
    unidad: "kg",
    remision: "FAC-AcerosBq-902",
    responsable: "Ing. Juan González",
    origenDestino: "Suministros del Caribe S.A.S.",
    observaciones: "Varillas certificadas bajo norma NTC 2289."
  },
  {
    id: "MOV-104",
    fecha: "2026-10-22",
    tipo: "salida",
    materialId: "MAT-04",
    materialNombre: "Acero de Refuerzo Figurado 1/2\" (60 KSI)",
    cantidad: 180,
    unidad: "kg",
    remision: "VALE-002",
    responsable: "Oficial Armador Ramón Castro",
    origenDestino: "Frente Cimentación: Parrillas de Zapatas Z1-Z4",
    observaciones: "Armado de canastas y estribos confinados."
  },
  {
    id: "MOV-105",
    fecha: "2026-10-28",
    tipo: "entrada",
    materialId: "MAT-06",
    materialNombre: "Lámina Colaborante Metaldeck Calibre 22",
    cantidad: 150,
    unidad: "m²",
    remision: "REM-ACESO-4102",
    responsable: "Ing. Juan González",
    origenDestino: "Acesco Colombia",
    observaciones: "Acopio directo con grúa pluma en nivel de mezzanine."
  }
];

// =============================================================================
// 2. CATÁLOGO INICIAL DE HERRAMIENTAS Y EQUIPOS MENORES (PAÑOL DE OBRA)
// =============================================================================
const HERRAMIENTAS_INICIALES = [
  {
    id: "HERR-01",
    codigo: "ROTO-01",
    nombre: "Rotomartillo Industrial SDS Max 1500W",
    categoria: "Perforación & Concreto",
    marcaModelo: "Bosch GBH 8-45 D Professional",
    serial: "SN-BSH-88210",
    estado: "disponible", // "disponible", "en_uso", "mantenimiento", "baja"
    ubicacion: "Pañol Central - Estante A1",
    custodioActual: null,
    frenteActual: null,
    fechaPrestamo: null,
    observaciones: "Incluye cincel de punta y broca de 1 pulgada para anclajes."
  },
  {
    id: "HERR-02",
    codigo: "AMO-01",
    nombre: "Amoladora / Pulidora Angular Industrial 9\"",
    categoria: "Corte & Estructura Metálica",
    marcaModelo: "DeWalt DWE490 2200W",
    serial: "SN-DWT-99412",
    estado: "en_uso",
    ubicacion: "Frente de Estructura Metálica",
    custodioActual: "Soldador Carlos Mendoza",
    frenteActual: "Nivel +3.00 Mezzanine (Corte Vigas IPE)",
    fechaPrestamo: "2026-11-09 07:30",
    observaciones: "Guarda de protección verificada. Con disco de corte 9\" nuevo."
  },
  {
    id: "HERR-03",
    codigo: "AMO-02",
    nombre: "Pulidora Angular Compacta 4-1/2\" 900W",
    categoria: "Corte & Estructura Metálica",
    marcaModelo: "Makita 9557HNG",
    serial: "SN-MKT-33418",
    estado: "disponible",
    ubicacion: "Pañol Central - Caja 3",
    custodioActual: null,
    frenteActual: null,
    fechaPrestamo: null,
    observaciones: "Operativa con cable encauchetado sin empalmes."
  },
  {
    id: "HERR-04",
    codigo: "SOLD-01",
    nombre: "Equipo de Soldadura Inverter 250A (SMAW/TIG)",
    categoria: "Corte & Estructura Metálica",
    marcaModelo: "Lincoln Electric Invertec 250",
    serial: "SN-LNC-41099",
    estado: "en_uso",
    ubicacion: "Estructura Mezzanine Eje 2-C",
    custodioActual: "Soldador Jorge Suárez",
    frenteActual: "Conexión Metálica Viga-Columna HEA 320",
    fechaPrestamo: "2026-11-09 08:00",
    observaciones: "Calibrada para electrodo E7018 1/8\". Pinzas y masa en perfecto estado."
  },
  {
    id: "HERR-05",
    codigo: "VIB-01",
    nombre: "Vibrador de Concreto Eléctrico 2 HP con Aguja 38mm",
    categoria: "Concreto & Vaciado",
    marcaModelo: "Wacker Neuson M2500 con manguera 4m",
    serial: "SN-WCK-77120",
    estado: "disponible",
    ubicacion: "Pañol Central - Zona Concretera",
    custodioActual: null,
    frenteActual: null,
    fechaPrestamo: null,
    observaciones: "Aguja de 38mm revisada, acople rápido lubricado."
  },
  {
    id: "HERR-06",
    codigo: "LSR-01",
    nombre: "Nivel Láser Autonivelante 360° con Trípode y Mira",
    categoria: "Topografía & Precisión",
    marcaModelo: "Bosch GLL 3-80 Professional",
    serial: "SN-BSH-33901",
    estado: "disponible",
    ubicacion: "Oficina Técnica / Instrumentación",
    custodioActual: null,
    frenteActual: null,
    fechaPrestamo: null,
    observaciones: "Baterías recargables al 100%, incluye estuche rígido y receptor."
  },
  {
    id: "HERR-07",
    codigo: "MAG-01",
    nombre: "Taladro Percutor Magnético de Base 50mm",
    categoria: "Corte & Estructura Metálica",
    marcaModelo: "Hougen HMD904 Industrial",
    serial: "SN-HGN-11045",
    estado: "disponible",
    ubicacion: "Pañol Central - Estante A2",
    custodioActual: null,
    frenteActual: null,
    fechaPrestamo: null,
    observaciones: "Electroimán de base probado y juego de fresas anulares afiladas."
  },
  {
    id: "HERR-08",
    codigo: "TORQ-01",
    nombre: "Llave Dinamométrica / Torquímetro 3/4\" Calibrado",
    categoria: "Fijación & Ensamble",
    marcaModelo: "Proto Professional (100-600 ft-lb)",
    serial: "SN-PRT-55210",
    estado: "disponible",
    ubicacion: "Pañol Central - Armario de Precisión",
    custodioActual: null,
    frenteActual: null,
    fechaPrestamo: null,
    observaciones: "Certificado de calibración vigente para verificación de pernos ASTM A325."
  },
  {
    id: "HERR-09",
    codigo: "MEZ-01",
    nombre: "Mezcladora de Concreto 1.5 Bultos (Trompo)",
    categoria: "Maquinaria Menor",
    marcaModelo: "Industrias IME con Motor Kohler 9.5 HP",
    serial: "SN-IME-602",
    estado: "mantenimiento",
    ubicacion: "Taller de Mantenimiento Frente 1",
    custodioActual: null,
    frenteActual: null,
    fechaPrestamo: null,
    observaciones: "Cambio preventivo de correas y engrase general de corona dentada."
  },
  {
    id: "HERR-10",
    codigo: "GEN-01",
    nombre: "Planta Eléctrica Diésel 10 kVA Trifásica Insonorizada",
    categoria: "Maquinaria Menor",
    marcaModelo: "Cummins Onan 10 kW",
    serial: "SN-CUM-9912",
    estado: "disponible",
    ubicacion: "Caseta de Generación Frente 1",
    custodioActual: null,
    frenteActual: null,
    fechaPrestamo: null,
    observaciones: "Tanque al 90%, horómetro en 142 horas."
  },
  {
    id: "HERR-11",
    codigo: "AND-01",
    nombre: "Torre de Andamio Multidireccional Certificado (6m)",
    categoria: "Trabajo en Alturas & Seguridad",
    marcaModelo: "Layher Allround Original",
    serial: "SN-LAY-330",
    estado: "en_uso",
    ubicacion: "Frente Mezzanine Eje B",
    custodioActual: "Oficial Pedro Martínez",
    frenteActual: "Montaje de Placas Metaldeck Nivel +3.00",
    fechaPrestamo: "2026-11-08 14:00",
    observaciones: "Con tarjeta verde de inspección SST aprobada."
  },
  {
    id: "HERR-12",
    codigo: "ARN-01",
    nombre: "Kit de Alturas (2 Arneses 4 Argollas + Eslingas en Y)",
    categoria: "Trabajo en Alturas & Seguridad",
    marcaModelo: "3M Protecta Dieléctrico",
    serial: "SN-3M-4410",
    estado: "disponible",
    ubicacion: "Oficina SST / Pañol",
    custodioActual: null,
    frenteActual: null,
    fechaPrestamo: null,
    observaciones: "Reata inspeccionada sin deshilaches, fecha de vigencia 2028."
  }
];

// Historial de préstamos y custodias de herramientas
const PRESTAMOS_INICIALES = [
  {
    id: "PRES-01",
    fecha: "2026-11-09",
    hora: "07:30 AM",
    herramientaId: "HERR-02",
    herramientaCodigo: "AMO-01",
    herramientaNombre: "Amoladora / Pulidora Angular Industrial 9\"",
    tipo: "prestamo", // "prestamo", "devolucion"
    responsable: "Soldador Carlos Mendoza",
    frente: "Nivel +3.00 Mezzanine (Corte Vigas IPE)",
    estadoEntregaRetorno: "Operativo con guarda",
    observaciones: "Se entrega con 2 discos de corte 9\" y llave de apriete."
  },
  {
    id: "PRES-02",
    fecha: "2026-11-09",
    hora: "08:00 AM",
    herramientaId: "HERR-04",
    herramientaCodigo: "SOLD-01",
    herramientaNombre: "Equipo de Soldadura Inverter 250A (SMAW/TIG)",
    tipo: "prestamo",
    responsable: "Soldador Jorge Suárez",
    frente: "Conexión Metálica Viga-Columna HEA 320",
    estadoEntregaRetorno: "Operativo calibrado",
    observaciones: "Cables de 15m verificados sin cortes."
  },
  {
    id: "PRES-03",
    fecha: "2026-11-08",
    hora: "14:00 PM",
    herramientaId: "HERR-11",
    herramientaCodigo: "AND-01",
    herramientaNombre: "Torre de Andamio Multidireccional Certificado (6m)",
    tipo: "prestamo",
    responsable: "Oficial Pedro Martínez",
    frente: "Montaje de Placas Metaldeck Nivel +3.00",
    estadoEntregaRetorno: "Completo con plataformas y rodapiés",
    observaciones: "Tarjeta verde SST diligenciada."
  },
  {
    id: "PRES-04",
    fecha: "2026-11-07",
    hora: "17:15 PM",
    herramientaId: "HERR-01",
    herramientaCodigo: "ROTO-01",
    herramientaNombre: "Rotomartillo Industrial SDS Max 1500W",
    tipo: "devolucion",
    responsable: "Ayudante Luis Peña",
    frente: "Pedestales Cimentación",
    estadoEntregaRetorno: "Limpio y soplado",
    observaciones: "Retornado a pañol sin novedades técnicas."
  }
];

const CAT_EN_MAP = {
  'CEMENTOS Y MORTEROS': 'CEMENT & MORTARS',
  'CEMENTOS & AGREGADOS': 'CEMENT & AGGREGATES',
  'ACERO DE REFUERZO': 'REINFORCING STEEL',
  'ACERO ESTRUCTURAL': 'STRUCTURAL STEEL',
  'MAMPOSTERÍA': 'MASONRY',
  'ESTRUCTURA METÁLICA': 'STRUCTURAL STEEL',
  'CONCRETOS Y ACEROS': 'CONCRETE & REBAR',
  'TUBERÍAS E HIDROSANITARIO': 'PLUMBING & MEP',
  'CUBIERTA': 'ROOFING',
  'ACABADOS': 'FINISHES',
  'ACABADOS Y PINTURAS': 'FINISHES & COATINGS',
  'AISLAMIENTO Y DRY-WALL': 'INSULATION & DRYWALL',
  'EQUIPO PESADO / COMPACTACIÓN': 'HEAVY EQUIPMENT / COMPACTION',
  'MEDICIÓN Y TOPOGRAFÍA': 'SURVEY & LASER LAYOUT',
  'HERRAMIENTA DE ACABADOS': 'FLOORING & FINISH TOOLS',
  'Corte & Estructura Metálica': 'Steel Cutting & Fabrication',
  'Perforación & Concreto': 'Concrete Drilling & Anchors',
  'Concreto & Vaciado': 'Concrete Placement',
  'Topografía & Precisión': 'Survey & Precision Layout',
  'Fijación & Ensamble': 'Fastening & Assembly',
  'Trabajo en Alturas & Seguridad': 'Height Safety & PPE',
  'Maquinaria Menor': 'Light Construction Machinery'
};

const TOOL_EN_MAP = {
  'Vibrador Eléctrico para Concreto 2HP': 'Electric Concrete Vibrator 2HP',
  'Nivel Láser Autonivelante 360°': '360° Self-Leveling Laser Level',
  'Cortadora de Porcelanato Diamante 900mm': '36" Diamond Porcelain Tile Saw'
};

const LOC_EN_MAP = {
  'Bodega Seca A1': 'Dry Warehouse A1',
  'Bodega Seca A2': 'Dry Warehouse A2',
  'Patio Acopio Norte': 'North Material Yard',
  'Bodega Acabados B1': 'Finishes Bay B1',
  'Bodega Acabados B2': 'Finishes Bay B2',
  'Pañol Equipos': 'Central Tool Crib',
  'Pañol Central - Estante A': 'Central Tool Crib - Bay A',
  'Lobby Principal': 'Main Lobby',
  'Oficina Norte': 'North Office'
};

const translateLoc = (val, lang) => {
  if (lang === 'es' || !val) return val || '';
  return LOC_EN_MAP[val] || localizeCrew(localizeTerm(val, 'en'), 'en');
};

const translateCat = (cat, lang) => {
  if (lang === 'es' || !cat) return cat || '';
  return CAT_EN_MAP[cat] || cat;
};

const translateToolName = (name, lang) => {
  if (lang === 'es' || !name) return name || '';
  return TOOL_EN_MAP[name] || localizeTerm(name, 'en');
};

const mapDemoMaterial = (m) => ({
  id: `demo-mat-${m.id}`,
  codigo: m.codigo,
  nombre: m.nombre,
  categoria: m.categoria,
  unidad: m.unidad,
  stockActual: Number(m.stock || 0),
  stockMinimo: Number(m.stockMinimo || 0),
  costoUnitario: Number(m.costoUnitario || 0),
  ubicacion: m.ubicacion
});

const mapDemoMovimiento = (m, mats) => {
  const matMatch = mats.find((x) => x.codigo === m.materialCodigo || x.id === `demo-mat-${m.materialId}`);
  const tipoNorm = String(m.tipo || 'entrada').toLowerCase();
  return {
    id: `MOV-${m.id}`,
    fecha: m.fecha,
    hora: m.hora || '',
    tipo: tipoNorm,
    materialId: matMatch?.id || `demo-mat-${m.materialId}`,
    materialNombre: m.materialNombre,
    cantidad: Number(m.cantidad || 0),
    unidad: matMatch?.unidad || 'und',
    costoUnitario: Number(m.costoUnitario || 0),
    totalCop: Number(m.totalCop || 0),
    remision: tipoNorm === 'entrada' ? `REM-NB-${m.id}` : `VALE-NB-${m.id}`,
    responsable: m.responsable,
    origenDestino: m.destino,
    observaciones: ''
  };
};

const mapDemoHerramienta = (h, loans) => {
  const estNorm =
    h.estado === 'DISPONIBLE'
      ? 'disponible'
      : h.estado === 'MANTENIMIENTO'
      ? 'mantenimiento'
      : 'en_uso';
  const loanMatch = loans.find((p) => p.codigo === h.codigo || p.herramientaId === h.id);
  return {
    id: `demo-herr-${h.id}`,
    codigo: h.codigo,
    nombre: h.nombre,
    categoria: h.categoria,
    marcaModelo: 'Industrial Grade Pro',
    serial: `SN-${h.codigo}`,
    estado: estNorm,
    ubicacion: h.ubicacion,
    custodioActual: estNorm === 'en_uso' ? (loanMatch?.operario || h.asignadoA) : null,
    frenteActual: estNorm === 'en_uso' ? (loanMatch?.frente || h.ubicacion) : null,
    fechaPrestamo: estNorm === 'en_uso' && loanMatch ? `${loanMatch.fecha} ${loanMatch.horaSalida}` : null
  };
};

const mapDemoPrestamo = (p) => ({
  id: `PRES-${p.id}`,
  fecha: p.fecha,
  hora: p.horaSalida,
  herramientaId: `demo-herr-${p.herramientaId}`,
  herramientaCodigo: p.codigo,
  herramientaNombre: p.nombre,
  tipo: p.estado === 'PRESTADO' ? 'prestamo' : 'devolucion',
  responsable: p.operario,
  frente: p.frente,
  estadoEntregaRetorno: p.estado === 'PRESTADO' ? 'Operativo en custodia' : 'Operativo / Limpio',
  observaciones: ''
});

export default function ModuloAlmacenMateriales({ proyectoActivo = 'mezzanine', isDemo = false }) {
  const { lang, formatMoney, formatUnitMoney, formatQty, unitLabel } = useAppPreferences();
  const demoMode = isDemo || proyectoActivo === DEMO_SHOWCASE_PROJECT_ID;

  // Estado General
  const [seccionActiva, setSeccionActiva] = useState('materiales'); // 'materiales', 'herramientas', 'kardex'

  // Estados de Materiales (reales + sandbox demo)
  const [materiales, setMateriales] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [demoMateriales, setDemoMateriales] = useState(() => DEMO_ALMACEN_MATERIALES.map(mapDemoMaterial));
  const [demoMovimientos, setDemoMovimientos] = useState(() =>
    DEMO_ALMACEN_MOVIMIENTOS.map((mv) => mapDemoMovimiento(mv, DEMO_ALMACEN_MATERIALES.map(mapDemoMaterial)))
  );
  const [filtroCategoriaMat, setFiltroCategoriaMat] = useState('todas');
  const [filtroTextoMat, setFiltroTextoMat] = useState('');

  // Estados de Herramientas (reales + sandbox demo)
  const [herramientas, setHerramientas] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [demoHerramientas, setDemoHerramientas] = useState(() =>
    DEMO_ALMACEN_HERRAMIENTAS.map((h) => mapDemoHerramienta(h, DEMO_ALMACEN_PRESTAMOS))
  );
  const [demoPrestamos, setDemoPrestamos] = useState(() => DEMO_ALMACEN_PRESTAMOS.map(mapDemoPrestamo));
  const [filtroCategoriaHerr, setFiltroCategoriaHerr] = useState('todas');
  const [filtroEstadoHerr, setFiltroEstadoHerr] = useState('todos');
  const [filtroTextoHerr, setFiltroTextoHerr] = useState('');

  // Modales de Materiales
  const [showModalMovimiento, setShowModalMovimiento] = useState(false);
  const [tipoMovimiento, setTipoMovimiento] = useState('entrada'); // 'entrada', 'salida'
  const [matSeleccionadoId, setMatSeleccionadoId] = useState('');
  const [cantidadMov, setCantidadMov] = useState('');
  const [remisionDoc, setRemisionDoc] = useState('');
  const [responsableMov, setResponsableMov] = useState(
    demoMode ? 'Northbridge Warehouse Lead' : 'Ing. Juan González'
  );
  const [origenDestinoMov, setOrigenDestinoMov] = useState('');
  const [observacionesMov, setObservacionesMov] = useState('');

  // Modales de Herramientas
  const [showModalPrestamoHerr, setShowModalPrestamoHerr] = useState(false);
  const [showModalDevolucionHerr, setShowModalDevolucionHerr] = useState(false);
  const [showModalNuevaHerr, setShowModalNuevaHerr] = useState(false);
  const [herrSeleccionadaId, setHerrSeleccionadaId] = useState('');
  const [responsableHerr, setResponsableHerr] = useState(
    demoMode ? 'Líder Acabados #1' : 'Oficial Pedro Martínez'
  );
  const [frenteHerr, setFrenteHerr] = useState(
    demoMode ? 'Lobby Principal' : 'Nivel +3.00 Mezzanine'
  );
  const [estadoRetornoHerr, setEstadoRetornoHerr] = useState('disponible');
  const [observacionesHerr, setObservacionesHerr] = useState('');

  // Formulario Nueva Herramienta
  const [nuevoCodigoHerr, setNuevoCodigoHerr] = useState('');
  const [nuevoNombreHerr, setNuevoNombreHerr] = useState('');
  const [nuevaCatHerr, setNuevaCatHerr] = useState('Corte & Estructura Metálica');
  const [nuevaMarcaHerr, setNuevaMarcaHerr] = useState('');
  const [nuevoSerialHerr, setNuevoSerialHerr] = useState('');
  const [nuevaUbicacionHerr, setNuevaUbicacionHerr] = useState('Pañol Central - Estante A');
  const [nuevasObsHerr, setNuevasObsHerr] = useState('');

  useEffect(() => {
    setResponsableMov(
      demoMode
        ? (lang === 'en' ? 'Northbridge Warehouse Lead' : 'Almacenista Showcase')
        : 'Ing. Juan González'
    );
    setResponsableHerr(
      demoMode
        ? (lang === 'en' ? 'Finishes Lead Tech #1' : 'Líder Acabados #1')
        : 'Oficial Pedro Martínez'
    );
    setFrenteHerr(
      demoMode
        ? (lang === 'en' ? 'Main Lobby' : 'Lobby Principal')
        : 'Nivel +3.00 Mezzanine'
    );
  }, [demoMode, lang]);

  // Cargar de localStorage (solo sesión real autenticada)
  useEffect(() => {
    if (demoMode) return;
    try {
      const guardadosMat = localStorage.getItem('jgm_almacen_materiales_v1');
      const guardadosMov = localStorage.getItem('jgm_almacen_movimientos_v1');
      if (guardadosMat) setMateriales(JSON.parse(guardadosMat));
      else {
        setMateriales(MATERIALES_INICIALES);
        localStorage.setItem('jgm_almacen_materiales_v1', JSON.stringify(MATERIALES_INICIALES));
      }
      if (guardadosMov) setMovimientos(JSON.parse(guardadosMov));
      else {
        setMovimientos(MOVIMIENTOS_INICIALES);
        localStorage.setItem('jgm_almacen_movimientos_v1', JSON.stringify(MOVIMIENTOS_INICIALES));
      }

      const guardadosHerr = localStorage.getItem('jgm_almacen_herramientas_v1');
      const guardadosPres = localStorage.getItem('jgm_almacen_prestamos_v1');
      if (guardadosHerr) setHerramientas(JSON.parse(guardadosHerr));
      else {
        setHerramientas(HERRAMIENTAS_INICIALES);
        localStorage.setItem('jgm_almacen_herramientas_v1', JSON.stringify(HERRAMIENTAS_INICIALES));
      }
      if (guardadosPres) setPrestamos(JSON.parse(guardadosPres));
      else {
        setPrestamos(PRESTAMOS_INICIALES);
        localStorage.setItem('jgm_almacen_prestamos_v1', JSON.stringify(PRESTAMOS_INICIALES));
      }
    } catch (e) {
      setMateriales(MATERIALES_INICIALES);
      setMovimientos(MOVIMIENTOS_INICIALES);
      setHerramientas(HERRAMIENTAS_INICIALES);
      setPrestamos(PRESTAMOS_INICIALES);
    }
  }, [demoMode]);

  const activeMateriales = demoMode ? demoMateriales : materiales;
  const activeMovimientos = demoMode ? demoMovimientos : movimientos;
  const activeHerramientas = demoMode ? demoHerramientas : herramientas;
  const activePrestamos = demoMode ? demoPrestamos : prestamos;

  const guardarMateriales = (nuevosMat, nuevosMov) => {
    if (demoMode) {
      setDemoMateriales(nuevosMat);
      setDemoMovimientos(nuevosMov);
      return;
    }
    setMateriales(nuevosMat);
    setMovimientos(nuevosMov);
    try {
      localStorage.setItem('jgm_almacen_materiales_v1', JSON.stringify(nuevosMat));
      localStorage.setItem('jgm_almacen_movimientos_v1', JSON.stringify(nuevosMov));
    } catch (e) {
      console.warn('Error guardando materiales:', e);
    }
  };

  const guardarHerramientas = (nuevasHerr, nuevosPres) => {
    if (demoMode) {
      setDemoHerramientas(nuevasHerr);
      setDemoPrestamos(nuevosPres);
      return;
    }
    setHerramientas(nuevasHerr);
    setPrestamos(nuevosPres);
    try {
      localStorage.setItem('jgm_almacen_herramientas_v1', JSON.stringify(nuevasHerr));
      localStorage.setItem('jgm_almacen_prestamos_v1', JSON.stringify(nuevosPres));
    } catch (e) {
      console.warn('Error guardando herramientas:', e);
    }
  };

  // ===========================================================================
  // OPERACIONES DE MATERIALES
  // ===========================================================================
  const handleCrearMovimientoMat = (e) => {
    e.preventDefault();
    const rawCant = parseFloat(cantidadMov);
    if (isNaN(rawCant) || rawCant <= 0) {
      alert(lang === 'en' ? 'Enter a valid quantity greater than zero.' : 'Ingrese una cantidad válida mayor a cero.');
      return;
    }

    const mat = activeMateriales.find(m => m.id === matSeleccionadoId);
    if (!mat) {
      alert(lang === 'en' ? 'Select a material from the catalog.' : 'Seleccione un material del catálogo.');
      return;
    }

    const cantMetric = convertInputToMetric(rawCant, mat.unidad, lang);

    if (tipoMovimiento === 'salida' && cantMetric > mat.stockActual + 0.001) {
      alert(
        lang === 'en'
          ? `Insufficient warehouse stock: Only ${formatQty(mat.stockActual, mat.unidad, 2)} ${unitLabel(mat.unidad)} available.`
          : `Stock insuficiente: Solo hay ${mat.stockActual} ${mat.unidad} en almacén.`
      );
      return;
    }

    const nuevoStock = tipoMovimiento === 'entrada'
      ? mat.stockActual + cantMetric
      : Math.max(0, mat.stockActual - cantMetric);

    const materialesActualizados = activeMateriales.map(m =>
      m.id === mat.id ? { ...m, stockActual: Number(nuevoStock.toFixed(2)) } : m
    );

    const unitCost = Number(mat.costoUnitario || 0);
    const nuevoMov = {
      id: `MOV-${Date.now()}`,
      fecha: new Date().toISOString().split('T')[0],
      tipo: tipoMovimiento,
      materialId: mat.id,
      materialNombre: mat.nombre,
      cantidad: Number(cantMetric.toFixed(2)),
      unidad: mat.unidad,
      costoUnitario: unitCost,
      totalCop: Math.round(cantMetric * unitCost),
      remision: remisionDoc.trim() || (tipoMovimiento === 'entrada' ? 'REM-DIRECT' : 'SLIP-OUT'),
      responsable: responsableMov.trim(),
      origenDestino:
        origenDestinoMov.trim() ||
        (tipoMovimiento === 'entrada'
          ? (demoMode ? 'Northbridge Central Supply' : 'Proveedor de Obra')
          : (demoMode ? 'Northbridge Field Front' : 'Frente de Obra Mezzanine')),
      observaciones: observacionesMov.trim()
    };

    const movimientosActualizados = [nuevoMov, ...activeMovimientos];
    guardarMateriales(materialesActualizados, movimientosActualizados);

    setShowModalMovimiento(false);
    setCantidadMov('');
    setRemisionDoc('');
    setOrigenDestinoMov('');
    setObservacionesMov('');

    const dispName = lang === 'en' ? localizeMaterialName(mat.nombre, 'en') : mat.nombre;
    alert(
      lang === 'en'
        ? `${tipoMovimiento === 'entrada' ? 'Receiving entry logged' : 'Material dispatch issued'} successfully!\n${dispName}: New Stock = ${formatQty(nuevoStock, mat.unidad, 2)} ${unitLabel(mat.unidad)}`
        : `${tipoMovimiento === 'entrada' ? 'Entrada registrada' : 'Salida despachada'} con éxito!\n${mat.nombre}: Nuevo Stock = ${nuevoStock.toFixed(2)} ${mat.unidad}`
    );
  };

  // ===========================================================================
  // OPERACIONES DE HERRAMIENTAS
  // ===========================================================================
  const handlePrestarHerramienta = (e) => {
    e.preventDefault();
    const herr = activeHerramientas.find(h => h.id === herrSeleccionadaId);
    if (!herr) {
      alert(lang === 'en' ? 'Select an available tool.' : 'Seleccione una herramienta disponible.');
      return;
    }

    const ahora = new Date();
    const fechaHoraStr = `${ahora.toISOString().split('T')[0]} ${ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;

    const herramientasActualizadas = activeHerramientas.map(h => {
      if (h.id === herr.id) {
        return {
          ...h,
          estado: 'en_uso',
          custodioActual: responsableHerr.trim(),
          frenteActual: frenteHerr.trim(),
          fechaPrestamo: fechaHoraStr
        };
      }
      return h;
    });

    const nuevoPrestamo = {
      id: `PRES-${Date.now()}`,
      fecha: ahora.toISOString().split('T')[0],
      hora: ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      herramientaId: herr.id,
      herramientaCodigo: herr.codigo,
      herramientaNombre: herr.nombre,
      tipo: 'prestamo',
      responsable: responsableHerr.trim(),
      frente: frenteHerr.trim(),
      estadoEntregaRetorno: 'Operativo en custodia',
      observaciones: observacionesHerr.trim()
    };

    const prestamosActualizados = [nuevoPrestamo, ...activePrestamos];
    guardarHerramientas(herramientasActualizadas, prestamosActualizados);

    setShowModalPrestamoHerr(false);
    setObservacionesHerr('');
    alert(
      lang === 'en'
        ? `Check-out logged!\n${translateToolName(herr.nombre, 'en')} assigned to ${responsableHerr} (${frenteHerr}).`
        : `Préstamo registrado!\n${herr.nombre} entregada a ${responsableHerr} para el frente ${frenteHerr}.`
    );
  };

  const handleDevolverHerramienta = (e) => {
    e.preventDefault();
    const herr = activeHerramientas.find(h => h.id === herrSeleccionadaId);
    if (!herr) {
      alert(lang === 'en' ? 'Select a checked-out tool to return.' : 'Seleccione una herramienta a devolver.');
      return;
    }

    const ahora = new Date();
    const custodioAnterior = herr.custodioActual || 'Field Crew';

    const herramientasActualizadas = activeHerramientas.map(h => {
      if (h.id === herr.id) {
        return {
          ...h,
          estado: estadoRetornoHerr,
          custodioActual: null,
          frenteActual: null,
          fechaPrestamo: null,
          observaciones: observacionesHerr.trim() || h.observaciones
        };
      }
      return h;
    });

    const nuevoRegistro = {
      id: `DEV-${Date.now()}`,
      fecha: ahora.toISOString().split('T')[0],
      hora: ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      herramientaId: herr.id,
      herramientaCodigo: herr.codigo,
      herramientaNombre: herr.nombre,
      tipo: 'devolucion',
      responsable: custodioAnterior,
      frente: herr.frenteActual || 'Retorno a Pañol',
      estadoEntregaRetorno:
        estadoRetornoHerr === 'disponible'
          ? 'Operativo / Limpio'
          : estadoRetornoHerr === 'mantenimiento'
          ? 'Para Mantenimiento'
          : 'Dañado',
      observaciones: observacionesHerr.trim()
    };

    const prestamosActualizados = [nuevoRegistro, ...activePrestamos];
    guardarHerramientas(herramientasActualizadas, prestamosActualizados);

    setShowModalDevolucionHerr(false);
    setObservacionesHerr('');
    alert(
      lang === 'en'
        ? `Tool return processed!\n${translateToolName(herr.nombre, 'en')} returned with status: ${estadoRetornoHerr.toUpperCase()}.`
        : `Devolución procesada!\n${herr.nombre} ha retornado a pañol con estado: ${estadoRetornoHerr.toUpperCase()}.`
    );
  };

  const handleCrearNuevaHerramienta = (e) => {
    e.preventDefault();
    if (!nuevoCodigoHerr.trim() || !nuevoNombreHerr.trim()) {
      alert(lang === 'en' ? 'Enter asset tag code and equipment name.' : 'Diligencie el código y nombre del equipo.');
      return;
    }

    const nuevaH = {
      id: `HERR-${Date.now()}`,
      codigo: nuevoCodigoHerr.trim().toUpperCase(),
      nombre: nuevoNombreHerr.trim(),
      categoria: nuevaCatHerr,
      marcaModelo: nuevaMarcaHerr.trim() || 'Standard',
      serial: nuevoSerialHerr.trim() || 'S/N',
      estado: 'disponible',
      ubicacion: nuevaUbicacionHerr.trim() || 'Pañol Central',
      custodioActual: null,
      frenteActual: null,
      fechaPrestamo: null,
      observaciones: nuevasObsHerr.trim()
    };

    const herramientasActualizadas = [...activeHerramientas, nuevaH];
    guardarHerramientas(herramientasActualizadas, activePrestamos);

    setShowModalNuevaHerr(false);
    setNuevoCodigoHerr('');
    setNuevoNombreHerr('');
    setNuevaMarcaHerr('');
    setNuevoSerialHerr('');
    setNuevasObsHerr('');

    alert(
      lang === 'en'
        ? `New equipment "${nuevaH.nombre}" added to tool crib inventory!`
        : `Nueva herramienta "${nuevaH.nombre}" agregada al inventario de pañol!`
    );
  };

  // ===========================================================================
  // KPIS
  // ===========================================================================
  const kpisMat = useMemo(() => {
    const totalItems = activeMateriales.length;
    const stockCritico = activeMateriales.filter(m => m.stockActual <= m.stockMinimo).length;
    const totalMovimientos = activeMovimientos.length;
    const totalValorCop = activeMateriales.reduce(
      (acc, m) => acc + (Number(m.stockActual || 0) * Number(m.costoUnitario || 0)),
      0
    );
    return { totalItems, stockCritico, totalMovimientos, totalValorCop };
  }, [activeMateriales, activeMovimientos]);

  const kpisHerr = useMemo(() => {
    const total = activeHerramientas.length;
    const enUso = activeHerramientas.filter(h => h.estado === 'en_uso').length;
    const disponibles = activeHerramientas.filter(h => h.estado === 'disponible').length;
    const mantenimiento = activeHerramientas.filter(h => h.estado === 'mantenimiento' || h.estado === 'baja').length;
    return { total, enUso, disponibles, mantenimiento };
  }, [activeHerramientas]);

  // Filtrados
  const materialesFiltrados = useMemo(() => {
    const txt = filtroTextoMat.trim().toLowerCase();
    return activeMateriales.filter(m => {
      const matchCat = filtroCategoriaMat === 'todas' || m.categoria === filtroCategoriaMat;
      if (!txt) return matchCat;
      const enName = localizeMaterialName(m.nombre, 'en').toLowerCase();
      const enCat = translateCat(m.categoria, 'en').toLowerCase();
      const enLoc = translateLoc(m.ubicacion, 'en').toLowerCase();
      const matchText =
        m.nombre.toLowerCase().includes(txt) ||
        enName.includes(txt) ||
        m.codigo.toLowerCase().includes(txt) ||
        m.categoria.toLowerCase().includes(txt) ||
        enCat.includes(txt) ||
        (m.ubicacion || '').toLowerCase().includes(txt) ||
        enLoc.includes(txt);
      return matchCat && matchText;
    });
  }, [activeMateriales, filtroCategoriaMat, filtroTextoMat]);

  const herramientasFiltradas = useMemo(() => {
    const txt = filtroTextoHerr.trim().toLowerCase();
    return activeHerramientas.filter(h => {
      const matchCat = filtroCategoriaHerr === 'todas' || h.categoria === filtroCategoriaHerr;
      const matchEst = filtroEstadoHerr === 'todos' || h.estado === filtroEstadoHerr;
      if (!txt) return matchCat && matchEst;
      const enTool = translateToolName(h.nombre, 'en').toLowerCase();
      const enCust = h.custodioActual ? localizeCrew(h.custodioActual, 'en').toLowerCase() : '';
      const enFrente = h.frenteActual ? translateLoc(h.frenteActual, 'en').toLowerCase() : '';
      const matchText =
        h.nombre.toLowerCase().includes(txt) ||
        enTool.includes(txt) ||
        h.codigo.toLowerCase().includes(txt) ||
        (h.marca && h.marca.toLowerCase().includes(txt)) ||
        (h.serial && h.serial.toLowerCase().includes(txt)) ||
        (h.custodioActual && h.custodioActual.toLowerCase().includes(txt)) ||
        enCust.includes(txt) ||
        (h.frenteActual && h.frenteActual.toLowerCase().includes(txt)) ||
        enFrente.includes(txt);
      return matchCat && matchEst && matchText;
    });
  }, [activeHerramientas, filtroCategoriaHerr, filtroEstadoHerr, filtroTextoHerr]);

  const categoriasMat = useMemo(
    () => ['todas', ...new Set(activeMateriales.map(m => m.categoria).filter(Boolean))],
    [activeMateriales]
  );
  const categoriasHerr = useMemo(
    () => ['todas', ...new Set(activeHerramientas.map(h => h.categoria).filter(Boolean))],
    [activeHerramientas]
  );

  return (
    <div className="space-y-6">

      {/* CABECERA PRINCIPAL DEL MÓDULO */}
      <div className="rounded-2xl steel-card p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl steel-panel-dark text-white shadow-md">
              <Boxes className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {lang === 'en'
                    ? 'Site Warehouse & Tool Crib: Materials & Equipment'
                    : 'Almacén & Pañol de Obra: Materiales y Herramientas'}
                </h2>
                <span className="rounded-full bg-slate-200 text-slate-900 text-[10px] font-black px-2.5 py-0.5 border border-slate-400/70">
                  {lang === 'en' ? 'Warehouse & Tool Crib' : 'Bodega & Pañol'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'en'
                  ? 'Physical stock control, delivery receipts, crew tool custody checkout & warehouse traceability'
                  : 'Control de existencias físicas, remisiones, préstamos de herramientas a cuadrillas y trazabilidad de custodia'}
              </p>
            </div>
          </div>

          {/* BOTONES DE ACCIÓN RÁPIDA SEGÚN LA SUB-SECCIÓN */}
          <div className="flex items-center gap-2 flex-wrap">
            {seccionActiva === 'materiales' && (
              <>
                <button
                  onClick={() => {
                    setTipoMovimiento('entrada');
                    setMatSeleccionadoId(activeMateriales[0]?.id || '');
                    setShowModalMovimiento(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-bold transition shadow-sm"
                >
                  <ArrowDownLeft className="h-4 w-4" />{' '}
                  {lang === 'en' ? 'Delivery Receipt (In)' : 'Entrada de Remisión'}
                </button>

                <button
                  onClick={() => {
                    setTipoMovimiento('salida');
                    setMatSeleccionadoId(activeMateriales[0]?.id || '');
                    setShowModalMovimiento(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 text-xs font-bold transition shadow-sm"
                >
                  <ArrowUpRight className="h-4 w-4" />{' '}
                  {lang === 'en' ? 'Dispatch to Crew (Out)' : 'Despacho a Cuadrilla'}
                </button>
              </>
            )}

            {seccionActiva === 'herramientas' && (
              <>
                <button
                  onClick={() => {
                    const disp = activeHerramientas.find(h => h.estado === 'disponible');
                    setHerrSeleccionadaId(disp ? disp.id : activeHerramientas[0]?.id || '');
                    setShowModalPrestamoHerr(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl steel-btn-primary text-white px-3.5 py-2 text-xs font-bold"
                >
                  <Wrench className="h-4 w-4" />{' '}
                  {lang === 'en' ? 'Check Out to Crew' : 'Prestar a Cuadrilla'}
                </button>

                <button
                  onClick={() => {
                    const enUso = activeHerramientas.find(h => h.estado === 'en_uso');
                    setHerrSeleccionadaId(enUso ? enUso.id : activeHerramientas[0]?.id || '');
                    setShowModalDevolucionHerr(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl steel-btn-primary text-white px-3.5 py-2 text-xs font-bold"
                >
                  <RotateCcw className="h-4 w-4" />{' '}
                  {lang === 'en' ? 'Return to Crib' : 'Devolución a Bodega'}
                </button>

                <button
                  onClick={() => setShowModalNuevaHerr(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 text-xs font-bold transition shadow-sm"
                >
                  <Plus className="h-4 w-4" />{' '}
                  {lang === 'en' ? 'New Tool / Asset' : 'Nueva Herramienta'}
                </button>
              </>
            )}

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 text-xs font-bold transition"
            >
              <Printer className="h-4 w-4" /> {lang === 'en' ? 'Print Sheet' : 'Imprimir Hoja'}
            </button>
          </div>
        </div>

        {/* SELECTOR DE SUB-SECCIONES: MATERIALES / HERRAMIENTAS / KARDEX */}
        <div className="flex items-center gap-2 pt-4 overflow-x-auto">
          <button
            onClick={() => setSeccionActiva('materiales')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              seccionActiva === 'materiales'
                ? 'steel-btn-primary text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Boxes className="h-4 w-4" />
            <span>{lang === 'en' ? 'Materials & Consumables' : 'Materiales e Insumos'}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              seccionActiva === 'materiales' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-800'
            }`}>
              {activeMateriales.length}
            </span>
          </button>

          <button
            onClick={() => setSeccionActiva('herramientas')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              seccionActiva === 'herramientas'
                ? 'steel-btn-primary text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Wrench className="h-4 w-4" />
            <span>{lang === 'en' ? 'Tools & Minor Equipment' : 'Herramientas & Equipos Menores'}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
              seccionActiva === 'herramientas' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-800'
            }`}>
              {kpisHerr.enUso} {lang === 'en' ? 'on site' : 'en campo'}
            </span>
          </button>

          <button
            onClick={() => setSeccionActiva('kardex')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              seccionActiva === 'kardex'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            <span>{lang === 'en' ? 'Kardex & Custody Ledger' : 'Kardex & Historial de Custodia'}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              seccionActiva === 'kardex' ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-600'
            }`}>
              {activeMovimientos.length + activePrestamos.length}
            </span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SECCIÓN 1: MATERIALES E INSUMOS */}
      {/* ===================================================================== */}
      {seccionActiva === 'materiales' && (
        <>
          {/* 4 KPIS DE MATERIALES */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-xl steel-card p-4">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {lang === 'en' ? 'Materials in Inventory' : 'Materiales en Inventario'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5 font-mono">
                {kpisMat.totalItems}
                <span className="text-xs font-semibold text-slate-400">
                  {lang === 'en' ? 'SKUs' : 'insumos'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                {lang === 'en' ? 'Tracked in site warehouse' : 'Controlados en bodega'}
              </span>
            </div>

            <div className="rounded-xl steel-card p-4">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {lang === 'en' ? 'Critical Stock / Reorder' : 'Stock Crítico / Reorden'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5 font-mono">
                <span className={kpisMat.stockCritico > 0 ? 'text-rose-600' : 'text-emerald-700'}>
                  {kpisMat.stockCritico}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {lang === 'en' ? 'alerts' : 'alertas'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 inline-flex items-center gap-1">
                {kpisMat.stockCritico > 0 ? (
                  <>
                    <AlertTriangle className="h-3 w-3 text-rose-600 shrink-0" />
                    <span>{lang === 'en' ? 'Reorder from supplier' : 'Pedir a proveedor'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span>{lang === 'en' ? 'Normal supply levels' : 'Abastecimiento normal'}</span>
                  </>
                )}
              </span>
            </div>

            <div className="rounded-xl steel-card p-4">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {kpisMat.totalValorCop > 0
                  ? (lang === 'en' ? 'Warehouse Stock Value' : 'Valorización en Bodega')
                  : (lang === 'en' ? 'Supply Readiness' : 'Estado de Abastecimiento')}
              </span>
              {kpisMat.totalValorCop > 0 ? (
                <>
                  <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 font-mono truncate">
                    {formatMoney(kpisMat.totalValorCop)}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    {lang === 'en' ? 'Readiness' : 'Abastecimiento'}:{' '}
                    {activeMateriales.length > 0
                      ? Math.round(((activeMateriales.length - kpisMat.stockCritico) / activeMateriales.length) * 100)
                      : 100}%
                  </span>
                </>
              ) : (
                <>
                  <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 font-mono">
                    {activeMateriales.length > 0
                      ? Math.round(((activeMateriales.length - kpisMat.stockCritico) / activeMateriales.length) * 100)
                      : 100}%
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    {lang === 'en' ? 'SKUs above min threshold' : 'Ítems con stock suficiente'}
                  </span>
                </>
              )}
            </div>

            <div className="rounded-xl steel-card p-4">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {lang === 'en' ? 'Material Movements' : 'Movimientos de Material'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5 font-mono">
                {kpisMat.totalMovimientos}
                <span className="text-xs font-semibold text-slate-400">
                  {lang === 'en' ? 'records' : 'registros'}
                </span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">
                {lang === 'en' ? 'Traceability up to date' : 'Trazabilidad al día'}
              </span>
            </div>
          </div>

          {/* TABLA DE MATERIALES */}
          <div className="rounded-2xl steel-card p-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={
                    lang === 'en'
                      ? 'Search material by name or SKU (e.g. CEM, sand, rebar)...'
                      : 'Buscar material por nombre o código (ej. CEM, arena, acero)...'
                  }
                  value={filtroTextoMat}
                  onChange={(e) => setFiltroTextoMat(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filtroCategoriaMat}
                  onChange={(e) => setFiltroCategoriaMat(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
                >
                  <option value="todas">
                    {lang === 'en' ? 'All Categories' : 'Todas las Categorías'}
                  </option>
                  {categoriasMat.filter(c => c !== 'todas').map(c => (
                    <option key={c} value={c}>{translateCat(c, lang)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs text-slate-800 min-w-[760px]">
                <thead className="bg-slate-100 text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">{lang === 'en' ? 'SKU / Material' : 'Código / Material'}</th>
                    <th className="py-2.5 px-3">{lang === 'en' ? 'Category' : 'Categoría'}</th>
                    <th className="py-2.5 px-2 text-center">{lang === 'en' ? 'Unit' : 'Unidad'}</th>
                    <th className="py-2.5 px-3 text-right">{lang === 'en' ? 'Current Stock' : 'Stock Actual'}</th>
                    <th className="py-2.5 px-3 text-right">{lang === 'en' ? 'Min. Stock' : 'Stock Mínimo'}</th>
                    {kpisMat.totalValorCop > 0 && (
                      <th className="py-2.5 px-3 text-right">{lang === 'en' ? 'Unit Cost / Value' : 'Costo Unit. / Valor'}</th>
                    )}
                    <th className="py-2.5 px-3 text-center">{lang === 'en' ? 'Status' : 'Estado'}</th>
                    <th className="py-2.5 px-3">{lang === 'en' ? 'Warehouse Location' : 'Ubicación en Bodega'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {materialesFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={kpisMat.totalValorCop > 0 ? 8 : 7} className="py-8 text-center text-slate-400">
                        {lang === 'en'
                          ? 'No warehouse materials match the current filter.'
                          : 'No hay materiales que coincidan con la búsqueda.'}
                      </td>
                    </tr>
                  ) : (
                    materialesFiltrados.map((m) => {
                      const esCritico = m.stockActual <= m.stockMinimo;
                      const isWholeUnit = !['m²', 'm2', 'm³', 'm3', 'ml', 'm', 'kg', 'L', 'Lt'].includes(m.unidad);
                      const decAct = isWholeUnit && Number.isInteger(Number(m.stockActual || 0)) ? 0 : 2;
                      const decMin = isWholeUnit && Number.isInteger(Number(m.stockMinimo || 0)) ? 0 : 2;
                      const itemValCop = Number(m.stockActual || 0) * Number(m.costoUnitario || 0);
                      return (
                        <tr key={m.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-3">
                            <strong className="text-slate-900 block font-mono text-xs">{m.codigo}</strong>
                            <span className="font-semibold text-slate-800">
                              {localizeMaterialName(m.nombre, lang)}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                              {translateCat(m.categoria, lang)}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center font-mono font-bold text-slate-600">
                            {unitLabel(m.unidad)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-black text-sm">
                            <span className={esCritico ? 'text-rose-600 font-bold' : 'text-slate-900'}>
                              {formatQty(m.stockActual, m.unidad, decAct)}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-slate-400">
                            {formatQty(m.stockMinimo, m.unidad, decMin)}
                          </td>
                          {kpisMat.totalValorCop > 0 && (
                            <td className="py-3 px-3 text-right font-mono">
                              <span className="block text-[11px] font-bold text-slate-700">
                                {formatUnitMoney(m.costoUnitario || 0, m.unidad)}
                              </span>
                              <span className="block text-[10px] text-emerald-700 font-semibold">
                                {formatMoney(itemValCop)}
                              </span>
                            </td>
                          )}
                          <td className="py-3 px-3 text-center">
                            {esCritico ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                                <AlertTriangle className="h-3 w-3" /> {lang === 'en' ? 'Reorder' : 'Reordenar'}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                <CheckCircle2 className="h-3 w-3" /> {lang === 'en' ? 'Optimal' : 'Óptimo'}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-500 text-[11px]">
                            {translateLoc(m.ubicacion, lang)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ===================================================================== */}
      {/* SECCIÓN 2: HERRAMIENTAS & EQUIPOS MENORES */}
      {/* ===================================================================== */}
      {seccionActiva === 'herramientas' && (
        <>
          {/* 4 KPIS DE HERRAMIENTAS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-xl steel-card p-4">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {lang === 'en' ? 'Total Equipment' : 'Total Herramientas'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5 font-mono">
                {kpisHerr.total}
                <span className="text-xs font-semibold text-slate-400">
                  {lang === 'en' ? 'units' : 'equipos'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                {lang === 'en' ? 'Logged in site registry' : 'Inventariados en obra'}
              </span>
            </div>

            <div className="rounded-xl steel-card p-4">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {lang === 'en' ? 'Deployed on Site' : 'En Uso en Campo'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5 font-mono">
                {kpisHerr.enUso}
                <span className="text-xs font-semibold text-slate-400">
                  {lang === 'en' ? 'in active zones' : 'en frente activo'}
                </span>
              </div>
              <span className="text-[10px] text-slate-700 font-bold mt-0.5 block">
                {lang === 'en' ? 'Custody assigned' : 'Custodia asignada'}
              </span>
            </div>

            <div className="rounded-xl steel-card p-4">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {lang === 'en' ? 'Available in Crib' : 'Disponibles en Bodega'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 flex items-baseline gap-1.5 font-mono">
                {kpisHerr.disponibles}
                <span className="text-xs font-semibold text-slate-400">
                  {lang === 'en' ? 'ready to issue' : 'listas para uso'}
                </span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">
                {lang === 'en' ? 'At site tool crib' : 'En pañol de obra'}
              </span>
            </div>

            <div className="rounded-xl steel-card p-4">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {lang === 'en' ? 'Maintenance / Hold' : 'Mantenimiento / Novedad'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5 font-mono">
                <span className={kpisHerr.mantenimiento > 0 ? 'text-amber-600' : 'text-slate-700'}>
                  {kpisHerr.mantenimiento}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {lang === 'en' ? 'under review' : 'en revisión'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 inline-flex items-center gap-1">
                {kpisHerr.mantenimiento === 0 ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span>{lang === 'en' ? 'All fleet operational' : 'Todo el parque operativo'}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3 w-3 text-amber-600 shrink-0" />
                    <span>{lang === 'en' ? 'Requires technical check' : 'Requiere revisión técnica'}</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* LISTA / CATÁLOGO INTERACTIVO DE HERRAMIENTAS */}
          <div className="rounded-2xl steel-card p-5 sm:p-6">
            {/* FILTROS Y BÚSQUEDA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={
                    lang === 'en'
                      ? 'Search by tool, asset tag, serial or custodian (e.g. laser, vibrator, HERR-02)...'
                      : 'Buscar por equipo, plaqueta, serial o custodio (ej. vibrador, nivel, HERR-02)...'
                  }
                  value={filtroTextoHerr}
                  onChange={(e) => setFiltroTextoHerr(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={filtroCategoriaHerr}
                  onChange={(e) => setFiltroCategoriaHerr(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
                >
                  <option value="todas">
                    {lang === 'en' ? 'All Categories' : 'Todas las Categorías'}
                  </option>
                  {categoriasHerr.filter(c => c !== 'todas').map(c => (
                    <option key={c} value={c}>{translateCat(c, lang)}</option>
                  ))}
                </select>

                <select
                  value={filtroEstadoHerr}
                  onChange={(e) => setFiltroEstadoHerr(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
                >
                  <option value="todos">{lang === 'en' ? 'All Statuses' : 'Todos los Estados'}</option>
                  <option value="disponible">{lang === 'en' ? 'Available in Crib' : 'Disponibles en Bodega'}</option>
                  <option value="en_uso">{lang === 'en' ? 'Deployed on Site' : 'En Uso en Campo'}</option>
                  <option value="mantenimiento">{lang === 'en' ? 'Under Maintenance' : 'En Mantenimiento'}</option>
                </select>
              </div>
            </div>

            {/* TABLA DE HERRAMIENTAS Y CUSTODIAS */}
            <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs text-slate-800 min-w-[760px]">
                <thead className="bg-slate-100 text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">{lang === 'en' ? 'Asset Tag / Tool' : 'Plaqueta / Equipo'}</th>
                    <th className="py-2.5 px-3">{lang === 'en' ? 'Brand & Model' : 'Marca & Modelo'}</th>
                    <th className="py-2.5 px-3">{lang === 'en' ? 'Category' : 'Categoría'}</th>
                    <th className="py-2.5 px-3 text-center">{lang === 'en' ? 'Status' : 'Estado'}</th>
                    <th className="py-2.5 px-3">{lang === 'en' ? 'Location / Current Custodian' : 'Ubicación / Custodio Actual'}</th>
                    <th className="py-2.5 px-3 text-center">{lang === 'en' ? 'Actions' : 'Acciones'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {herramientasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        {lang === 'en'
                          ? 'No tools or equipment match your filter.'
                          : 'No hay herramientas que coincidan con la búsqueda.'}
                      </td>
                    </tr>
                  ) : (
                    herramientasFiltradas.map((h) => {
                      const estaEnUso = h.estado === 'en_uso';
                      const estaDisponible = h.estado === 'disponible';
                      const estaMantenimiento = h.estado === 'mantenimiento';

                      return (
                        <tr key={h.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-[10px] bg-slate-200/80 text-slate-900 px-1.5 py-0.5 rounded border border-slate-300 shrink-0">
                                {h.codigo}
                              </span>
                              <strong className="text-slate-900">{translateToolName(h.nombre, lang)}</strong>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">S/N: {h.serial}</span>
                          </td>

                          <td className="py-3 px-3 text-slate-700 font-medium">
                            {h.marcaModelo}
                          </td>

                          <td className="py-3 px-3">
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                              {translateCat(h.categoria, lang)}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center">
                            {estaDisponible && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                                <CheckCircle2 className="h-3 w-3" /> {lang === 'en' ? 'Available' : 'Disponible'}
                              </span>
                            )}
                            {estaEnUso && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-900">
                                <Wrench className="h-3 w-3" /> {lang === 'en' ? 'On Site' : 'En Campo'}
                              </span>
                            )}
                            {estaMantenimiento && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                                <AlertTriangle className="h-3 w-3" /> {lang === 'en' ? 'Maintenance' : 'Mantenimiento'}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3">
                            {estaEnUso ? (
                              <div className="space-y-0.5">
                                <span className="font-bold text-slate-900 flex items-center gap-1">
                                  <UserCheck className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                                  <span>{localizeCrew(h.custodioActual || '', lang)}</span>
                                </span>
                                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                  <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                                  <span>{translateLoc(h.frenteActual, lang)}</span>
                                </span>
                                {h.fechaPrestamo && (
                                  <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                                    <Clock className="h-2.5 w-2.5 text-slate-400 shrink-0" />
                                    <span>{lang === 'en' ? 'Since:' : 'Desde:'} {h.fechaPrestamo}</span>
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-500 text-[11px] flex items-center gap-1">
                                <Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span>{translateLoc(h.ubicacion, lang)}</span>
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3 text-center">
                            {estaDisponible && (
                              <button
                                onClick={() => {
                                  setHerrSeleccionadaId(h.id);
                                  setShowModalPrestamoHerr(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg steel-btn-primary text-white"
                              >
                                {lang === 'en' ? 'Check Out' : 'Prestar'}
                              </button>
                            )}

                            {estaEnUso && (
                              <button
                                onClick={() => {
                                  setHerrSeleccionadaId(h.id);
                                  setShowModalDevolucionHerr(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg steel-btn-primary text-white"
                              >
                                {lang === 'en' ? 'Return' : 'Retornar'}
                              </button>
                            )}

                            {estaMantenimiento && (
                              <button
                                onClick={() => {
                                  const herrAct = activeHerramientas.map(item =>
                                    item.id === h.id ? { ...item, estado: 'disponible' } : item
                                  );
                                  guardarHerramientas(herrAct, activePrestamos);
                                  alert(
                                    lang === 'en'
                                      ? `${translateToolName(h.nombre, lang)} marked as available in crib.`
                                      : `${h.nombre} habilitada como disponible en bodega.`
                                  );
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition"
                              >
                                {lang === 'en' ? 'Enable' : 'Habilitar'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ===================================================================== */}
      {/* SECCIÓN 3: KARDEX UNIFICADO Y HISTORIAL DE CUSTODIA */}
      {/* ===================================================================== */}
      {seccionActiva === 'kardex' && (() => {
        const showValorKardex = activeMovimientos.some((x) => Number(x.totalCop || 0) > 0);
        return (
          <div className="space-y-6">
            {/* MOVIMIENTOS DE MATERIALES */}
            <div className="rounded-2xl steel-card p-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Boxes className="h-4 w-4 text-slate-800" />
                    {lang === 'en'
                      ? 'Material Kardex (Delivery Receipts & Crew Dispatches)'
                      : 'Kardex de Materiales (Entradas por Remisión y Despachos)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'en'
                      ? 'Log of supplier deliveries and field zone issue vouchers'
                      : 'Historial de entradas con remisiones de proveedor y vales de salida a frentes'}
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
                <table className="w-full text-left text-xs text-slate-800 min-w-[750px]">
                  <thead className="bg-slate-100 text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">{lang === 'en' ? 'Date / ID' : 'Fecha / ID'}</th>
                      <th className="py-2.5 px-3 text-center">{lang === 'en' ? 'Type' : 'Tipo'}</th>
                      <th className="py-2.5 px-3">{lang === 'en' ? 'Material' : 'Material'}</th>
                      <th className="py-2.5 px-3 text-right">{lang === 'en' ? 'Quantity' : 'Cantidad'}</th>
                      {showValorKardex && (
                        <th className="py-2.5 px-3 text-right">{lang === 'en' ? 'Value' : 'Valor'}</th>
                      )}
                      <th className="py-2.5 px-3">{lang === 'en' ? 'Receipt / Slip' : 'Remisión / Vale'}</th>
                      <th className="py-2.5 px-3">{lang === 'en' ? 'Origin / Destination' : 'Origen / Destino'}</th>
                      <th className="py-2.5 px-3">{lang === 'en' ? 'Responsible' : 'Responsable'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeMovimientos.length === 0 ? (
                      <tr>
                        <td colSpan={showValorKardex ? 8 : 7} className="py-8 text-center text-slate-400">
                          {lang === 'en'
                            ? 'No warehouse material movements logged yet.'
                            : 'No hay movimientos de materiales registrados.'}
                        </td>
                      </tr>
                    ) : (
                      activeMovimientos.map((mov) => {
                        const isWholeMov = !['m²', 'm2', 'm³', 'm3', 'ml', 'm', 'kg', 'L', 'Lt'].includes(mov.unidad);
                        const decMov = isWholeMov && Number.isInteger(Number(mov.cantidad || 0)) ? 0 : 2;
                        return (
                          <tr key={mov.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-3 font-mono">
                              <strong className="text-slate-900 block">{mov.fecha}</strong>
                              <span className="text-[10px] text-slate-400">{mov.id}</span>
                            </td>

                            <td className="py-3 px-3 text-center">
                              {mov.tipo === 'entrada' ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                                  <ArrowDownLeft className="h-3 w-3" /> {lang === 'en' ? 'Inbound' : 'Entrada'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-black text-white">
                                  <ArrowUpRight className="h-3 w-3" /> {lang === 'en' ? 'Outbound' : 'Salida'}
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-3">
                              <strong className="text-slate-900 block leading-tight">
                                {localizeMaterialName(mov.materialNombre, lang)}
                              </strong>
                              {mov.observaciones && (
                                <span className="text-[10px] text-slate-400 italic">
                                  "{localizeTerm(mov.observaciones, lang)}"
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-3 text-right font-mono font-black text-sm">
                              <span className={mov.tipo === 'entrada' ? 'text-emerald-700' : 'text-slate-900'}>
                                {mov.tipo === 'entrada' ? '+' : '-'}
                                {formatQty(mov.cantidad, mov.unidad, decMov)} {unitLabel(mov.unidad)}
                              </span>
                            </td>

                            {showValorKardex && (
                              <td className="py-3 px-3 text-right font-mono text-[11px] font-bold text-slate-700">
                                {Number(mov.totalCop || 0) > 0 ? formatMoney(mov.totalCop) : '-'}
                              </td>
                            )}

                            <td className="py-3 px-3 font-mono font-bold text-slate-700">
                              {mov.remision}
                            </td>

                            <td className="py-3 px-3 text-slate-600">
                              {translateLoc(mov.origenDestino, lang)}
                            </td>

                            <td className="py-3 px-3 text-slate-500 font-medium">
                              {localizeCrew(mov.responsable || '', lang)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* HISTORIAL DE PRÉSTAMOS DE HERRAMIENTAS */}
            <div className="rounded-2xl steel-card p-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-slate-800" />
                    {lang === 'en'
                      ? 'Equipment Custody & Tool Crib Checkout Ledger'
                      : 'Historial de Custodia y Préstamos de Herramientas'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'en'
                      ? 'Audit trail of crib checkouts, site custodians and equipment returns'
                      : 'Registro de salidas de pañol, responsables en campo y retornos de herramientas'}
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
                <table className="w-full text-left text-xs text-slate-800 min-w-[750px]">
                  <thead className="bg-slate-100 text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">{lang === 'en' ? 'Date / Time' : 'Fecha / Hora'}</th>
                      <th className="py-2.5 px-3 text-center">{lang === 'en' ? 'Action' : 'Acción'}</th>
                      <th className="py-2.5 px-3">{lang === 'en' ? 'Equipment / Tool' : 'Equipo / Herramienta'}</th>
                      <th className="py-2.5 px-3">{lang === 'en' ? 'Site Custodian' : 'Responsable en Obra'}</th>
                      <th className="py-2.5 px-3">{lang === 'en' ? 'Work Zone' : 'Frente de Trabajo'}</th>
                      <th className="py-2.5 px-3">{lang === 'en' ? 'Technical Condition' : 'Condición Técnica'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activePrestamos.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          {lang === 'en'
                            ? 'No tool custody movements logged yet.'
                            : 'No hay préstamos o devoluciones registrados.'}
                        </td>
                      </tr>
                    ) : (
                      activePrestamos.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-3 font-mono">
                            <strong className="text-slate-900 block">{p.fecha}</strong>
                            <span className="text-[10px] text-slate-400">{p.hora}</span>
                          </td>

                          <td className="py-3 px-3 text-center">
                            {p.tipo === 'prestamo' ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-black text-slate-900">
                                <Wrench className="h-3 w-3" /> {lang === 'en' ? 'Check-Out' : 'Préstamo'}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                                <RotateCcw className="h-3 w-3" /> {lang === 'en' ? 'Return' : 'Devolución'}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-[10px] bg-slate-100 px-1 py-0.5 rounded text-slate-700">
                                {p.herramientaCodigo}
                              </span>
                              <strong className="text-slate-900">
                                {translateToolName(p.herramientaNombre, lang)}
                              </strong>
                            </div>
                            {p.observaciones && (
                              <span className="text-[10px] text-slate-400 italic block mt-0.5">
                                "{localizeTerm(p.observaciones, lang)}"
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3 font-bold text-slate-800">
                            <span className="inline-flex items-center gap-1">
                              <UserCheck className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                              <span>{localizeCrew(p.responsable || '', lang)}</span>
                            </span>
                          </td>

                          <td className="py-3 px-3 text-slate-600">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span>{translateLoc(p.frente, lang)}</span>
                            </span>
                          </td>

                          <td className="py-3 px-3 text-slate-600 text-[11px]">
                            {p.estadoEntregaRetorno === 'Operativo en custodia'
                              ? (lang === 'en' ? 'Operational in custody' : p.estadoEntregaRetorno)
                              : p.estadoEntregaRetorno === 'Operativo / Limpio'
                              ? (lang === 'en' ? 'Operational / Clean' : p.estadoEntregaRetorno)
                              : p.estadoEntregaRetorno === 'Requiere Mantenimiento'
                              ? (lang === 'en' ? 'Requires Maintenance' : p.estadoEntregaRetorno)
                              : p.estadoEntregaRetorno === 'Fuera de Servicio'
                              ? (lang === 'en' ? 'Out of Service' : p.estadoEntregaRetorno)
                              : localizeTerm(p.estadoEntregaRetorno, lang)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================== */}
      {/* MODAL 1: REGISTRO DE MOVIMIENTO DE MATERIAL (ENTRADA / SALIDA) */}
      {/* ===================================================================== */}
      {showModalMovimiento && (() => {
        const selectedMatMov = activeMateriales.find((m) => m.id === matSeleccionadoId) || activeMateriales[0];
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl steel-card p-5 sm:p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  {tipoMovimiento === 'entrada' ? (
                    <>
                      <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
                      {lang === 'en'
                        ? 'Log Material Inbound (Delivery Slip)'
                        : 'Registrar Entrada de Material (Remisión)'}
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="h-5 w-5 text-slate-900" />
                      {lang === 'en'
                        ? 'Log Material Outbound / Crew Dispatch'
                        : 'Registrar Salida / Despacho a Cuadrilla'}
                    </>
                  )}
                </h3>
                <button
                  onClick={() => setShowModalMovimiento(false)}
                  aria-label={lang === 'en' ? 'Close modal' : 'Cerrar modal'}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCrearMovimientoMat} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {lang === 'en'
                      ? (tipoMovimiento === 'entrada' ? 'Material to Receive *' : 'Material to Dispatch *')
                      : `Material a ${tipoMovimiento === 'entrada' ? 'Ingresar' : 'Despachar'} *`}
                  </label>
                  <select
                    value={matSeleccionadoId}
                    onChange={(e) => setMatSeleccionadoId(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    {activeMateriales.map((m) => {
                      const isWhole = !['m²', 'm2', 'm³', 'm3', 'ml', 'm', 'kg', 'L', 'Lt'].includes(m.unidad);
                      const dec = isWhole && Number.isInteger(Number(m.stockActual || 0)) ? 0 : 2;
                      return (
                        <option key={m.id} value={m.id}>
                          {m.codigo} • {localizeMaterialName(m.nombre, lang)} (Stock:{' '}
                          {formatQty(m.stockActual, m.unidad, dec)} {unitLabel(m.unidad)})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'en'
                        ? (tipoMovimiento === 'entrada' ? 'Inbound Quantity' : 'Dispatch Quantity')
                        : `Cantidad a ${tipoMovimiento === 'entrada' ? 'Ingresar' : 'Despachar'}`}{' '}
                      ({unitLabel(selectedMatMov?.unidad || 'und')}) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={cantidadMov}
                      onChange={(e) => setCantidadMov(e.target.value)}
                      placeholder={lang === 'en' ? 'e.g. 25' : 'Ej. 50'}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'en'
                        ? (tipoMovimiento === 'entrada' ? 'Delivery Slip / Invoice No.' : 'Issue Voucher No.')
                        : (tipoMovimiento === 'entrada' ? 'No. de Remisión / Factura' : 'Vale de Salida')}
                    </label>
                    <input
                      type="text"
                      value={remisionDoc}
                      onChange={(e) => setRemisionDoc(e.target.value)}
                      placeholder={tipoMovimiento === 'entrada' ? 'REM-7811' : 'VALE-012'}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'en' ? 'Site Responsible' : 'Responsable de Obra'}
                    </label>
                    <input
                      type="text"
                      value={responsableMov}
                      onChange={(e) => setResponsableMov(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {lang === 'en'
                        ? (tipoMovimiento === 'entrada' ? 'Supplier / Origin' : 'Target Zone / Crew')
                        : (tipoMovimiento === 'entrada' ? 'Proveedor / Procedencia' : 'Frente / Cuadrilla Receptora')}
                    </label>
                    <input
                      type="text"
                      value={origenDestinoMov}
                      onChange={(e) => setOrigenDestinoMov(e.target.value)}
                      placeholder={
                        demoMode
                          ? (tipoMovimiento === 'entrada'
                              ? (lang === 'en' ? 'e.g. Allied Building Supply' : 'Ej. Distribuidora Norte S.A.')
                              : (lang === 'en' ? 'e.g. Main Lobby / Zone A' : 'Ej. Lobby Principal / Zona A'))
                          : (tipoMovimiento === 'entrada' ? 'Cementos Argos' : 'Nivel +3.00 Mezzanine')
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {lang === 'en' ? 'Technical Notes' : 'Observaciones Técnicas'}
                  </label>
                  <textarea
                    rows={2}
                    value={observacionesMov}
                    onChange={(e) => setObservacionesMov(e.target.value)}
                    placeholder={
                      lang === 'en'
                        ? 'e.g. Verified count, undamaged packaging, stored in dry bay...'
                        : 'Ej. Material verificado, empacado sin roturas, descargado en bodega...'
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModalMovimiento(false)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    {lang === 'en' ? 'Cancel' : 'Cancelar'}
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg text-white shadow-sm ${
                      tipoMovimiento === 'entrada'
                        ? 'bg-emerald-600 hover:bg-emerald-500'
                        : 'bg-slate-900 hover:bg-slate-800'
                    }`}
                  >
                    {lang === 'en'
                      ? (tipoMovimiento === 'entrada' ? 'Confirm Inbound' : 'Confirm Dispatch')
                      : `Confirmar ${tipoMovimiento === 'entrada' ? 'Entrada' : 'Salida'}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================== */}
      {/* MODAL 2: PRESTAMO DE HERRAMIENTA A CUADRILLA */}
      {/* ===================================================================== */}
      {showModalPrestamoHerr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl steel-card p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-slate-800" />
                {lang === 'en'
                  ? 'Check Out Tool / Equipment to Field Crew'
                  : 'Prestar Herramienta a Cuadrilla de Obra'}
              </h3>
              <button
                onClick={() => setShowModalPrestamoHerr(false)}
                aria-label={lang === 'en' ? 'Close modal' : 'Cerrar modal'}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handlePrestarHerramienta} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {lang === 'en' ? 'Tool / Equipment to Issue *' : 'Herramienta / Equipo a Prestar *'}
                </label>
                <select
                  value={herrSeleccionadaId}
                  onChange={(e) => setHerrSeleccionadaId(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                >
                  {activeHerramientas
                    .filter(h => h.estado === 'disponible')
                    .map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.codigo} • {translateToolName(h.nombre, lang)} ({h.marcaModelo})
                      </option>
                    ))}
                </select>
                {activeHerramientas.filter(h => h.estado === 'disponible').length === 0 && (
                  <p className="text-[11px] text-rose-600 mt-1 font-semibold flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {lang === 'en'
                        ? 'No tools are currently available in the crib.'
                        : 'No hay herramientas disponibles en bodega actualmente.'}
                    </span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {lang === 'en' ? 'Receiving Custodian *' : 'Responsable Receptora (Custodio) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={responsableHerr}
                    onChange={(e) => setResponsableHerr(e.target.value)}
                    placeholder={
                      demoMode
                        ? (lang === 'en' ? 'e.g. Finishes Lead Tech #1' : 'Ej. Líder Acabados #1')
                        : 'Ej. Oficial Pedro Martínez'
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {lang === 'en' ? 'Work Zone / Activity *' : 'Frente de Obra / Actividad *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={frenteHerr}
                    onChange={(e) => setFrenteHerr(e.target.value)}
                    placeholder={
                      demoMode
                        ? (lang === 'en' ? 'e.g. Main Lobby' : 'Ej. Lobby Principal')
                        : 'Ej. Nivel +3.00 Mezzanine'
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {lang === 'en'
                    ? 'Issued Accessories & Pre-Use Inspection'
                    : 'Accesorios Entregados y Notas de Inspección'}
                </label>
                <textarea
                  rows={2}
                  value={observacionesHerr}
                  onChange={(e) => setObservacionesHerr(e.target.value)}
                  placeholder={
                    lang === 'en'
                      ? 'e.g. Safety guard installed, chuck key included, power cord inspected...'
                      : 'Ej. Guarda puesta, llave de ajuste incluida, cable verificado sin peladuras...'
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModalPrestamoHerr(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  {lang === 'en' ? 'Cancel' : 'Cancelar'}
                </button>
                <button
                  type="submit"
                  disabled={activeHerramientas.filter(h => h.estado === 'disponible').length === 0}
                  className="px-4 py-1.5 text-xs font-bold rounded-lg text-white steel-btn-primary disabled:opacity-50"
                >
                  {lang === 'en' ? 'Confirm Check-Out' : 'Confirmar Préstamo y Salida'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: DEVOLUCIÓN DE HERRAMIENTA A BODEGA */}
      {/* ===================================================================== */}
      {showModalDevolucionHerr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl steel-card p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-slate-800" />
                {lang === 'en'
                  ? 'Log Tool Return to Crib'
                  : 'Registrar Retorno de Herramienta a Pañol'}
              </h3>
              <button
                onClick={() => setShowModalDevolucionHerr(false)}
                aria-label={lang === 'en' ? 'Close modal' : 'Cerrar modal'}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleDevolverHerramienta} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {lang === 'en' ? 'Tool to Return *' : 'Herramienta a Retornar *'}
                </label>
                <select
                  value={herrSeleccionadaId}
                  onChange={(e) => setHerrSeleccionadaId(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                >
                  {activeHerramientas
                    .filter(h => h.estado === 'en_uso')
                    .map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.codigo} • {translateToolName(h.nombre, lang)} (
                        {lang === 'en' ? 'Custodian' : 'Custodio'}: {localizeCrew(h.custodioActual || '', lang)} -{' '}
                        {translateLoc(h.frenteActual, lang)})
                      </option>
                    ))}
                </select>
                {activeHerramientas.filter(h => h.estado === 'en_uso').length === 0 && (
                  <p className="text-[11px] text-emerald-700 mt-1 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {lang === 'en'
                        ? 'All tools are currently checked in at the crib.'
                        : 'Todas las herramientas están actualmente en bodega.'}
                    </span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {lang === 'en' ? 'Return Inspection Status *' : 'Estado de Inspección al Recibir *'}
                </label>
                <select
                  value={estadoRetornoHerr}
                  onChange={(e) => setEstadoRetornoHerr(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-900"
                >
                  <option value="disponible">
                    {lang === 'en'
                      ? 'Operational / Clean (Ready in Crib)'
                      : 'Operativo / Limpio (Habilitado en Bodega)'}
                  </option>
                  <option value="mantenimiento">
                    {lang === 'en'
                      ? 'Requires Maintenance / Calibration / Cleaning'
                      : 'Requiere Mantenimiento / Afilado / Limpieza'}
                  </option>
                  <option value="baja">
                    {lang === 'en' ? 'Damaged / Out of Service' : 'Dañado / Fuera de Servicio'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {lang === 'en' ? 'Return Inspection Notes' : 'Observaciones de Inspección en Retorno'}
                </label>
                <textarea
                  rows={2}
                  value={observacionesHerr}
                  onChange={(e) => setObservacionesHerr(e.target.value)}
                  placeholder={
                    lang === 'en'
                      ? 'e.g. Clean housing, dust cleared, no electrical faults, all accessories complete...'
                      : 'Ej. Equipo limpio, soplado, sin novedades eléctricas, accesorios completos...'
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModalDevolucionHerr(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  {lang === 'en' ? 'Cancel' : 'Cancelar'}
                </button>
                <button
                  type="submit"
                  disabled={activeHerramientas.filter(h => h.estado === 'en_uso').length === 0}
                  className="px-4 py-1.5 text-xs font-bold rounded-lg text-white steel-btn-primary disabled:opacity-50"
                >
                  {lang === 'en' ? 'Confirm Return to Crib' : 'Confirmar Devolución e Ingreso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 4: REGISTRAR NUEVA HERRAMIENTA EN EL INVENTARIO */}
      {/* ===================================================================== */}
      {showModalNuevaHerr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl steel-card p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="h-5 w-5 text-slate-800" />
                {lang === 'en'
                  ? 'Register New Tool / Equipment in Crib'
                  : 'Registrar Nueva Herramienta en Pañol'}
              </h3>
              <button
                onClick={() => setShowModalNuevaHerr(false)}
                aria-label={lang === 'en' ? 'Close modal' : 'Cerrar modal'}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCrearNuevaHerramienta} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {lang === 'en' ? 'Asset Tag Code *' : 'Código de Plaqueta *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'en' ? 'e.g. HERR-GRD-03' : 'Ej. HERR-AMO-03'}
                    value={nuevoCodigoHerr}
                    onChange={(e) => setNuevoCodigoHerr(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {lang === 'en' ? 'Category *' : 'Categoría *'}
                  </label>
                  <select
                    value={nuevaCatHerr}
                    onChange={(e) => setNuevaCatHerr(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold"
                  >
                    <option value="Corte & Estructura Metálica">
                      {translateCat('Corte & Estructura Metálica', lang)}
                    </option>
                    <option value="Perforación & Concreto">
                      {translateCat('Perforación & Concreto', lang)}
                    </option>
                    <option value="Concreto & Vaciado">
                      {translateCat('Concreto & Vaciado', lang)}
                    </option>
                    <option value="Topografía & Precisión">
                      {translateCat('Topografía & Precisión', lang)}
                    </option>
                    <option value="Fijación & Ensamble">
                      {translateCat('Fijación & Ensamble', lang)}
                    </option>
                    <option value="Trabajo en Alturas & Seguridad">
                      {translateCat('Trabajo en Alturas & Seguridad', lang)}
                    </option>
                    <option value="Maquinaria Menor">
                      {translateCat('Maquinaria Menor', lang)}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {lang === 'en' ? 'Equipment / Tool Name *' : 'Nombre del Equipo / Herramienta *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'en' ? 'e.g. 4-1/2" Angle Grinder' : 'Ej. Pulidora Angular 4-1/2 Pulgadas'}
                  value={nuevoNombreHerr}
                  onChange={(e) => setNuevoNombreHerr(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {lang === 'en' ? 'Brand & Model' : 'Marca y Modelo'}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === 'en' ? 'e.g. DeWalt DWE4020' : 'Ej. DeWalt DWE4020'}
                    value={nuevaMarcaHerr}
                    onChange={(e) => setNuevaMarcaHerr(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {lang === 'en' ? 'Factory Serial Number' : 'Número Serial de Fábrica'}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === 'en' ? 'e.g. SN-DW-2026-99' : 'Ej. SN-DW-2026-99'}
                    value={nuevoSerialHerr}
                    onChange={(e) => setNuevoSerialHerr(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {lang === 'en' ? 'Warehouse / Crib Location' : 'Ubicación en Bodega / Pañol'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'en' ? 'e.g. Central Tool Crib - Bay B2' : 'Ej. Pañol Central - Estante B2'}
                  value={nuevaUbicacionHerr}
                  onChange={(e) => setNuevaUbicacionHerr(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {lang === 'en' ? 'Technical Notes / Accessories' : 'Observaciones Técnicas / Accesorios'}
                </label>
                <textarea
                  rows={2}
                  value={nuevasObsHerr}
                  onChange={(e) => setNuevasObsHerr(e.target.value)}
                  placeholder={
                    lang === 'en'
                      ? 'e.g. Includes hard carrying case and 10 ft heavy-duty cord...'
                      : 'Ej. Incluye estuche plástico y cable encauchetado de 3m...'
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModalNuevaHerr(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  {lang === 'en' ? 'Cancel' : 'Cancelar'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg text-white bg-slate-900 hover:bg-slate-800 shadow-sm"
                >
                  {lang === 'en' ? 'Save to Crib' : 'Guardar en Pañol'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
