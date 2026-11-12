'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Search, 
  Filter, 
  Flame, 
  ChevronRight, 
  ArrowUpRight, 
  Download, 
  Info,
  CalendarDays,
  Target
} from 'lucide-react';

// =============================================================================
// CATÁLOGO BASE DEL CRONOGRAMA 4D (MEZZANINE 3 NIVELES - BARRANQUILLA)
// Alineado con MS Project, Revit y el Presupuesto Oficial
// =============================================================================
export const CRONOGRAMA_BASE = [
  {
    id: "ACT-01",
    wbs: "1.1",
    nombre: "Localización, trazado y replanteo",
    capitulo: "🏗️ PRELIMINARES",
    inicio: "2026-10-15",
    fin: "2026-10-20",
    duracionDias: 5,
    meta: 180.00,
    unidad: "m²",
    pesoPct: 2.0,
    rutaCritica: true,
    responsable: "Topografía / Residente"
  },
  {
    id: "ACT-02",
    wbs: "1.2",
    nombre: "Demolición y retiro de material (plantillas, muros)",
    capitulo: "🏗️ PRELIMINARES",
    inicio: "2026-10-18",
    fin: "2026-10-26",
    duracionDias: 8,
    meta: 48.68,
    unidad: "m³",
    pesoPct: 3.5,
    rutaCritica: true,
    responsable: "Cuadrilla Demolición"
  },
  {
    id: "ACT-03",
    wbs: "2.1",
    nombre: "Construcción de plantilla de concreto",
    capitulo: "🏗️ CIMENTACIÓN Y ESTRUCTURA",
    inicio: "2026-10-25",
    fin: "2026-11-03",
    duracionDias: 9,
    meta: 15.00,
    unidad: "m³",
    pesoPct: 5.0,
    rutaCritica: true,
    responsable: "Oficial Estructuras"
  },
  {
    id: "ACT-04",
    wbs: "2.2",
    nombre: "Concreto en zapatas y cimentación",
    capitulo: "🏗️ CIMENTACIÓN Y ESTRUCTURA",
    inicio: "2026-10-28",
    fin: "2026-11-08",
    duracionDias: 11,
    meta: 3.50,
    unidad: "m³",
    pesoPct: 8.0,
    rutaCritica: true,
    responsable: "Cuadrilla Concretos"
  },
  {
    id: "ACT-05",
    wbs: "2.3",
    nombre: "Concreto en vigas de amarre y aéreas",
    capitulo: "🏗️ CIMENTACIÓN Y ESTRUCTURA",
    inicio: "2026-11-04",
    fin: "2026-11-15",
    duracionDias: 11,
    meta: 3.20,
    unidad: "m³",
    pesoPct: 7.5,
    rutaCritica: true,
    responsable: "Cuadrilla Concretos"
  },
  {
    id: "ACT-06",
    wbs: "2.4",
    nombre: "Concreto en columnas estructurales",
    capitulo: "🏗️ CIMENTACIÓN Y ESTRUCTURA",
    inicio: "2026-11-08",
    fin: "2026-11-20",
    duracionDias: 12,
    meta: 2.80,
    unidad: "m³",
    pesoPct: 9.0,
    rutaCritica: true,
    responsable: "Cuadrilla Concretos"
  },
  {
    id: "ACT-07",
    wbs: "3.1",
    nombre: "Muros en mampostería de bloques de concreto",
    capitulo: "🧱 MAMPOSTERÍA Y CERRAMIENTOS",
    inicio: "2026-11-16",
    fin: "2026-12-05",
    duracionDias: 19,
    meta: 120.00,
    unidad: "m²",
    pesoPct: 14.0,
    rutaCritica: false,
    responsable: "Cuadrilla Pegadores"
  },
  {
    id: "ACT-08",
    wbs: "4.1",
    nombre: "Montaje de cubierta en Eternit",
    capitulo: "🏠 CUBIERTAS",
    inicio: "2026-11-25",
    fin: "2026-12-10",
    duracionDias: 15,
    meta: 150.00,
    unidad: "m²",
    pesoPct: 10.0,
    rutaCritica: true,
    responsable: "Especialista Cubiertas"
  },
  {
    id: "ACT-09",
    wbs: "5.1",
    nombre: "Red de tubería hidrosanitaria PVC",
    capitulo: "🚪 CARPINTERÍA E INSTALACIONES",
    inicio: "2026-11-28",
    fin: "2026-12-12",
    duracionDias: 14,
    meta: 18.00,
    unidad: "ml",
    pesoPct: 6.0,
    rutaCritica: false,
    responsable: "Técnico Hidrosanitario"
  },
  {
    id: "ACT-10",
    wbs: "6.1",
    nombre: "Pañete y mortero de revoco en muros",
    capitulo: "🎨 ACABADOS Y REVESTIMIENTOS",
    inicio: "2026-12-04",
    fin: "2026-12-22",
    duracionDias: 18,
    meta: 240.00,
    unidad: "m²",
    pesoPct: 11.0,
    rutaCritica: false,
    responsable: "Cuadrilla Pañetadores"
  },
  {
    id: "ACT-11",
    wbs: "6.2",
    nombre: "Instalación de cielo raso",
    capitulo: "🎨 ACABADOS Y REVESTIMIENTOS",
    inicio: "2026-12-12",
    fin: "2026-12-28",
    duracionDias: 16,
    meta: 80.00,
    unidad: "m²",
    pesoPct: 7.0,
    rutaCritica: false,
    responsable: "Cuadrilla Drywall"
  },
  {
    id: "ACT-12",
    wbs: "6.3",
    nombre: "Instalación de piso cerámico / enchape",
    capitulo: "🎨 ACABADOS Y REVESTIMIENTOS",
    inicio: "2026-12-18",
    fin: "2027-01-05",
    duracionDias: 18,
    meta: 80.00,
    unidad: "m²",
    pesoPct: 8.0,
    rutaCritica: false,
    responsable: "Enchapadores"
  },
  {
    id: "ACT-13",
    wbs: "6.4",
    nombre: "Estuco y pintura vinílica en muros",
    capitulo: "🎨 ACABADOS Y REVESTIMIENTOS",
    inicio: "2026-12-26",
    fin: "2027-01-10",
    duracionDias: 15,
    meta: 240.00,
    unidad: "m²",
    pesoPct: 4.0,
    rutaCritica: false,
    responsable: "Pintores"
  },
  {
    id: "ACT-14",
    wbs: "6.5",
    nombre: "Instalación de guardaescobas",
    capitulo: "🎨 ACABADOS Y REVESTIMIENTOS",
    inicio: "2027-01-02",
    fin: "2027-01-08",
    duracionDias: 6,
    meta: 20.00,
    unidad: "ml",
    pesoPct: 1.0,
    rutaCritica: false,
    responsable: "Enchapadores"
  },
  {
    id: "ACT-15",
    wbs: "7.1",
    nombre: "Instalación de puertas y ventanas",
    capitulo: "🚪 CARPINTERÍA E INSTALACIONES",
    inicio: "2027-01-04",
    fin: "2027-01-12",
    duracionDias: 8,
    meta: 10.00,
    unidad: "und",
    pesoPct: 2.0,
    rutaCritica: false,
    responsable: "Carpintería Metálica"
  },
  {
    id: "ACT-16",
    wbs: "7.2",
    nombre: "Instalación de puertas interiores y baño",
    capitulo: "🚪 CARPINTERÍA E INSTALACIONES",
    inicio: "2027-01-06",
    fin: "2027-01-12",
    duracionDias: 6,
    meta: 4.00,
    unidad: "und",
    pesoPct: 0.5,
    rutaCritica: false,
    responsable: "Carpintería Madera"
  },
  {
    id: "ACT-17",
    wbs: "7.3",
    nombre: "Instalación de aparatos sanitarios y lavaplatos",
    capitulo: "🚪 CARPINTERÍA E INSTALACIONES",
    inicio: "2027-01-08",
    fin: "2027-01-14",
    duracionDias: 6,
    meta: 3.00,
    unidad: "und",
    pesoPct: 0.5,
    rutaCritica: false,
    responsable: "Plomería / Acabados"
  }
];

// =============================================================================
// CRONOGRAMA 4D — REMODELACIÓN CASA MENDOZA (SABANALARGA • REVIT 1.1)
// =============================================================================
export const CRONOGRAMA_CASA_MENDOZA = [
  {
    id: "CM-1.1",
    wbs: "1.1",
    nombre: "Muros en mampostería de bloques de concreto",
    capitulo: "🧱 MAMPOSTERÍA Y CERRAMIENTOS",
    inicio: "2026-11-02",
    fin: "2026-11-16",
    duracionDias: 14,
    meta: 227.89,
    unidad: "m²",
    pesoPct: 16.0,
    rutaCritica: true,
    responsable: "Cuadrilla Mampostería",
    matchKeys: ["mamposteria", "bloque", "muros en mamposteria"]
  },
  {
    id: "CM-1.2",
    wbs: "1.2",
    nombre: "Pañete y mortero de revoco en muros",
    capitulo: "🎨 ACABADOS Y REVESTIMIENTOS",
    inicio: "2026-11-10",
    fin: "2026-11-26",
    duracionDias: 16,
    meta: 455.78,
    unidad: "m²",
    pesoPct: 16.0,
    rutaCritica: true,
    responsable: "Cuadrilla Pañete",
    matchKeys: ["panete", "pañete", "revoco"]
  },
  {
    id: "CM-2.1",
    wbs: "2.1",
    nombre: "Plantilla de concreto e=7cm (Casa Mendoza)",
    capitulo: "🎨 ACABADOS Y REVESTIMIENTOS",
    inicio: "2026-11-14",
    fin: "2026-11-26",
    duracionDias: 12,
    meta: 110.00,
    unidad: "m²",
    pesoPct: 7.0,
    rutaCritica: true,
    responsable: "Cuadrilla Pisos",
    matchKeys: ["plantilla", "solado"]
  },
  {
    id: "CM-2.2",
    wbs: "2.2",
    nombre: "Instalación de piso cerámico / enchape",
    capitulo: "🎨 ACABADOS Y REVESTIMIENTOS",
    inicio: "2026-11-22",
    fin: "2026-12-07",
    duracionDias: 15,
    meta: 110.00,
    unidad: "m²",
    pesoPct: 12.0,
    rutaCritica: true,
    responsable: "Enchapadores",
    matchKeys: ["piso ceramico", "porcelanato", "enchape"]
  },
  {
    id: "CM-2.3",
    wbs: "2.3",
    nombre: "Enchape de pared cerámica / porcelanato (Cocina/Baño)",
    capitulo: "🎨 ACABADOS Y REVESTIMIENTOS",
    inicio: "2026-11-25",
    fin: "2026-12-06",
    duracionDias: 11,
    meta: 45.00,
    unidad: "m²",
    pesoPct: 5.0,
    rutaCritica: false,
    responsable: "Enchapadores",
    matchKeys: ["enchape de pared", "enchape pared"]
  },
  {
    id: "CM-3.1",
    wbs: "3.1",
    nombre: "Instalación de cielo raso",
    capitulo: "☁️ CIELOS RASOS Y AISLAMIENTO",
    inicio: "2026-11-28",
    fin: "2026-12-12",
    duracionDias: 14,
    meta: 86.65,
    unidad: "m²",
    pesoPct: 7.0,
    rutaCritica: true,
    responsable: "Cuadrilla Drywall",
    matchKeys: ["cielo raso", "cielorraso"]
  },
  {
    id: "CM-3.2",
    wbs: "3.2",
    nombre: "Instalación de aislamiento termoacústico Frescasa Eco 2-1/2\"",
    capitulo: "☁️ CIELOS RASOS Y AISLAMIENTO",
    inicio: "2026-11-30",
    fin: "2026-12-13",
    duracionDias: 13,
    meta: 86.65,
    unidad: "m²",
    pesoPct: 4.0,
    rutaCritica: false,
    responsable: "Cuadrilla Aislamiento",
    matchKeys: ["frescasa", "aislamiento", "fibra de vidrio", "termoacustico"]
  },
  {
    id: "CM-4.1",
    wbs: "4.1",
    nombre: "Estuco y pintura vinílica en muros",
    capitulo: "🎨 ACABADOS Y REVESTIMIENTOS",
    inicio: "2026-12-04",
    fin: "2026-12-19",
    duracionDias: 15,
    meta: 455.78,
    unidad: "m²",
    pesoPct: 12.0,
    rutaCritica: false,
    responsable: "Cuadrilla Pintura",
    matchKeys: ["estuco", "pintura", "vinilica"]
  },
  {
    id: "CM-5.1",
    wbs: "5.1",
    nombre: "Instalación de puertas interiores y baño",
    capitulo: "🚪 CARPINTERÍA E INSTALACIONES",
    inicio: "2026-12-10",
    fin: "2026-12-18",
    duracionDias: 8,
    meta: 7.00,
    unidad: "und",
    pesoPct: 5.0,
    rutaCritica: false,
    responsable: "Carpintería Madera",
    matchKeys: ["puertas interiores", "puertas"]
  },
  {
    id: "CM-5.2",
    wbs: "5.2",
    nombre: "Instalación de puertas y ventanas",
    capitulo: "🚪 CARPINTERÍA E INSTALACIONES",
    inicio: "2026-12-12",
    fin: "2026-12-20",
    duracionDias: 8,
    meta: 8.00,
    unidad: "und",
    pesoPct: 4.0,
    rutaCritica: false,
    responsable: "Carpintería Aluminio",
    matchKeys: ["ventanas", "ventaneria", "puertas y ventanas"]
  },
  {
    id: "CM-6.1",
    wbs: "6.1",
    nombre: "Montaje de cubierta en Eternit",
    capitulo: "🏠 CUBIERTAS",
    inicio: "2026-11-18",
    fin: "2026-12-03",
    duracionDias: 15,
    meta: 132.05,
    unidad: "m²",
    pesoPct: 12.0,
    rutaCritica: true,
    responsable: "Cuadrilla Cubiertas",
    matchKeys: ["cubierta", "eternit", "teja"]
  }
];

export default function TabCronograma({ registros = [], proyectoActivo = 'mezzanine' }) {
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroCapitulo, setFiltroCapitulo] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [selectedActividad, setSelectedActividad] = useState(null);

  const cronogramaSource = proyectoActivo === 'casa_mendoza' ? CRONOGRAMA_CASA_MENDOZA : CRONOGRAMA_BASE;

  // Fecha actual de referencia de obra
  const fechaHoy = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Fechas globales del proyecto
  const fechaInicioGlobal = proyectoActivo === 'casa_mendoza' ? "2026-11-02" : "2026-10-15";
  const fechaFinGlobal = proyectoActivo === 'casa_mendoza' ? "2026-12-22" : "2027-01-15";

  // Calcular el progreso real a partir de la bitácora
  const cronogramaConDatos = useMemo(() => {
    const norm = (s) =>
      String(s || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    const msPorDia = 1000 * 60 * 60 * 24;
    const tHoy = new Date(fechaHoy).getTime();

    return cronogramaSource.map((item) => {
      const targetNorm = norm(item.nombre);
      const keys = (item.matchKeys || [targetNorm]).map(norm);
      const isCieloItem = item.id === 'CM-3.1' || item.id === 'ACT-11';
      const isEnchapePiso = item.id === 'CM-2.2';

      const ejecutado = registros.reduce((acc, reg) => {
        const raw = String(reg.actividad || '');
        if (raw.toLowerCase().includes('bim_takeoff')) return acc;
        const regNorm = norm(raw);
        if (isCieloItem && (regNorm.includes('frescasa') || regNorm.includes('aislamiento'))) {
          return acc;
        }
        if (isEnchapePiso && (regNorm.includes('pared') || regNorm.includes('enchape pared'))) {
          return acc;
        }
        const matches = regNorm.includes(targetNorm) || keys.some((k) => k && regNorm.includes(k));
        return matches ? acc + (parseFloat(reg.cantidad) || 0) : acc;
      }, 0);
      const pctReal = item.meta > 0 ? (ejecutado / item.meta) * 100 : 0;

      // Cálculo del porcentaje programado a la fecha de hoy
      const tInicio = new Date(item.inicio).getTime();
      const tFin = new Date(item.fin).getTime();
      let pctProgramado = 0;

      if (tHoy <= tInicio) {
        pctProgramado = 0;
      } else if (tHoy >= tFin) {
        pctProgramado = 100;
      } else {
        const totalDur = (tFin - tInicio) / msPorDia;
        const transcurrido = (tHoy - tInicio) / msPorDia;
        pctProgramado = Math.min(100, Math.max(0, (transcurrido / totalDur) * 100));
      }

      // Desviación y estado de semáforo
      const desviacion = pctReal - pctProgramado;
      let estado = 'por_iniciar';
      let estadoLabel = 'Por Iniciar';
      let colorClass = 'bg-slate-100 text-slate-700 border-slate-300';
      let dotColor = 'bg-slate-400';

      if (pctReal >= 100) {
        estado = 'completada';
        estadoLabel = 'Completada';
        colorClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
        dotColor = 'bg-emerald-500';
      } else if (pctReal > 0 || pctProgramado > 0) {
        if (desviacion >= -5) {
          estado = 'en_tiempo';
          estadoLabel = 'Al Día / En Tiempo';
          colorClass = 'bg-slate-200 text-slate-900 border-slate-400';
          dotColor = 'bg-slate-700';
        } else if (desviacion >= -15) {
          estado = 'en_atencion';
          estadoLabel = 'Alerta Moderada';
          colorClass = 'bg-amber-50 text-amber-800 border-amber-300';
          dotColor = 'bg-amber-500';
        } else {
          estado = 'retrasada';
          estadoLabel = 'Atrasada (Ruta Crítica)';
          colorClass = 'bg-rose-50 text-rose-800 border-rose-300';
          dotColor = 'bg-rose-600 animate-pulse';
        }
      }

      return {
        ...item,
        ejecutado,
        pctReal,
        pctProgramado,
        desviacion,
        estado,
        estadoLabel,
        colorClass,
        dotColor
      };
    });
  }, [cronogramaSource, registros, fechaHoy]);

  // KPIs Generales del Proyecto
  const kpis = useMemo(() => {
    let pesoTotal = 0;
    let sumaRealPonderada = 0;
    let sumaProgPonderada = 0;

    cronogramaConDatos.forEach((item) => {
      pesoTotal += item.pesoPct;
      sumaRealPonderada += (Math.min(item.pctReal, 100) * item.pesoPct) / 100;
      sumaProgPonderada += (item.pctProgramado * item.pesoPct) / 100;
    });

    const factor = pesoTotal > 0 ? 100 / pesoTotal : 1;
    const globalReal = (sumaRealPonderada * factor);
    const globalProg = (sumaProgPonderada * factor);
    const spi = globalProg > 0 ? (globalReal / globalProg) : 1;

    // Fechas y días
    const dInicio = new Date(fechaInicioGlobal);
    const dFin = new Date(fechaFinGlobal);
    const dHoy = new Date(fechaHoy);
    const msPorDia = 1000 * 60 * 60 * 24;
    const duracionTotal = Math.round((dFin - dInicio) / msPorDia);
    const diasTranscurridos = Math.max(0, Math.round((dHoy - dInicio) / msPorDia));
    const diasRestantes = Math.max(0, Math.round((dFin - dHoy) / msPorDia));

    return {
      globalReal,
      globalProg,
      spi,
      duracionTotal,
      diasTranscurridos,
      diasRestantes,
      actividadesCriticas: cronogramaConDatos.filter(a => a.rutaCritica && a.pctReal < 100).length
    };
  }, [cronogramaConDatos, fechaHoy, fechaInicioGlobal, fechaFinGlobal]);

  // Lista de capítulos únicos para selector
  const capitulos = useMemo(() => {
    const setCap = new Set(cronogramaSource.map(a => a.capitulo));
    return ['todos', ...Array.from(setCap)];
  }, [cronogramaSource]);

  // Filtrado de actividades
  const actividadesFiltradas = useMemo(() => {
    return cronogramaConDatos.filter((item) => {
      const matchTexto = item.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                          item.wbs.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                          item.responsable.toLowerCase().includes(filtroTexto.toLowerCase());
      const matchCap = filtroCapitulo === 'todos' || item.capitulo === filtroCapitulo;
      const matchEst = filtroEstado === 'todos' || 
                        (filtroEstado === 'critica' && item.rutaCritica) ||
                        item.estado === filtroEstado;
      return matchTexto && matchCap && matchEst;
    });
  }, [cronogramaConDatos, filtroTexto, filtroCapitulo, filtroEstado]);

  // Función para exportar cronograma
  const exportarCronogramaCSV = () => {
    const headers = ["WBS", "Actividad", "Capitulo", "Inicio", "Fin", "Duracion_Dias", "Meta", "Unidad", "Ejecutado_Real", "Avance_Real_%", "Avance_Prog_%", "Estado", "Ruta_Critica"];
    const rows = cronogramaConDatos.map(a => [
      `"${a.wbs}"`,
      `"${a.nombre}"`,
      `"${a.capitulo}"`,
      a.inicio,
      a.fin,
      a.duracionDias,
      a.meta,
      `"${a.unidad}"`,
      a.ejecutado.toFixed(2),
      a.pctReal.toFixed(2),
      a.pctProgramado.toFixed(2),
      `"${a.estadoLabel}"`,
      a.rutaCritica ? "SI" : "NO"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `JGM_Cronograma_Obra_${fechaHoy}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. TARJETA CABECERA DE CONTROL DE CRONOGRAMA */}
      <div className="rounded-2xl steel-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-slate-900 text-white">
                <CalendarDays className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Cronograma de Obra y Control 4D — {proyectoActivo === 'casa_mendoza' ? '🏡 Remodelación Casa Mendoza' : '🏢 Mezzanine 3 Niveles'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Plataforma del Residente de Obra • Sincronización en Tiempo Real con Bitácora y MS Project ({cronogramaSource.length} actividades)
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={exportarCronogramaCSV}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
            >
              <Download className="h-3.5 w-3.5" /> Exportar Cronograma (CSV)
            </button>
          </div>
        </div>

        {/* 2. KPIS EJECUTIVOS DEL RESIDENTE */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          {/* KPI 1: Avance Real */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
              <span>AVANCE FÍSICO REAL</span>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {kpis.globalReal.toFixed(1)}%
            </div>
            <div className="mt-2 w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500" 
                style={{ width: `${Math.min(kpis.globalReal, 100)}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Programado a hoy: <strong>{kpis.globalProg.toFixed(1)}%</strong>
            </span>
          </div>

          {/* KPI 2: Índice de Desempeño SPI */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
              <span>ÍNDICE SPI (4D)</span>
              <Target className="h-4 w-4 text-slate-700" />
            </div>
            <div className={`text-2xl font-black ${kpis.spi >= 0.98 ? 'text-emerald-700' : kpis.spi >= 0.85 ? 'text-amber-600' : 'text-rose-600'}`}>
              {kpis.spi.toFixed(2)}
            </div>
            <div className="mt-1 text-xs font-semibold text-slate-600">
              {kpis.spi >= 1.0 ? '⚡ Ritmo óptimo / Al día' : kpis.spi >= 0.88 ? '⚠️ Variación moderada' : '🚨 Requiere plan de choque'}
            </div>
            <span className="text-[11px] text-slate-500 block">
              {kpis.globalReal >= kpis.globalProg ? 'Adelanto neto positivo' : `Desvío: ${(kpis.globalReal - kpis.globalProg).toFixed(1)}%`}
            </span>
          </div>

          {/* KPI 3: Plazos y Días */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
              <span>PLAZO CONTRACTUAL</span>
              <Clock className="h-4 w-4 text-slate-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {kpis.diasTranscurridos} <span className="text-sm font-semibold text-slate-500">/ {kpis.duracionTotal} días</span>
            </div>
            <div className="mt-1 text-xs font-semibold text-slate-600">
              Quedan <strong>{kpis.diasRestantes} días</strong> de ejecución
            </div>
            <span className="text-[11px] text-slate-500 block">
              Término: <strong>15 Ene 2027</strong>
            </span>
          </div>

          {/* KPI 4: Ruta Crítica */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
              <span>RUTA CRÍTICA</span>
              <Flame className="h-4 w-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {kpis.actividadesCriticas} <span className="text-sm font-semibold text-slate-500">activas</span>
            </div>
            <div className="mt-1 text-xs font-semibold text-rose-700">
              Monitoreo diario prioritario
            </div>
            <span className="text-[11px] text-slate-500 block">
              Cimentación y Cubierta
            </span>
          </div>
        </div>
      </div>

      {/* 3. BARRA DE FILTROS Y BÚSQUEDA */}
      <div className="rounded-xl steel-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por actividad, WBS o responsable..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
            />
          </div>

          <div>
            <select
              value={filtroCapitulo}
              onChange={(e) => setFiltroCapitulo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-slate-800 focus:outline-none"
            >
              <option value="todos">Todos los Capítulos</option>
              {capitulos.filter(c => c !== 'todos').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-slate-800 focus:outline-none"
            >
              <option value="todos">Todos los Estados</option>
              <option value="critica">🔥 En Ruta Crítica</option>
              <option value="en_tiempo">🟢 Al Día / En Tiempo</option>
              <option value="en_atencion">🟡 Alerta Moderada</option>
              <option value="retrasada">🔴 Atrasada</option>
              <option value="completada">✅ Completada</option>
              <option value="por_iniciar">⚪ Por Iniciar</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. TABLA INTERACTIVA DE GANTT / CRONOGRAMA */}
      <div className="rounded-2xl steel-card overflow-hidden">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Desglose WBS • Avance Real vs Programado ({actividadesFiltradas.length} actividades)
            </span>
          </div>
          <span className="text-[11px] text-slate-300">
            Línea base: MEZZANINE 3 NIVELES - BARRANQUILLA
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">WBS</th>
                <th className="py-3 px-4">Actividad Constructiva</th>
                <th className="py-3 px-4">Fechas (Inicio - Fin)</th>
                <th className="py-3 px-4 text-center">Duración</th>
                <th className="py-3 px-4 text-right">Ejecutado / Meta</th>
                <th className="py-3 px-4 text-center">Avance 4D (Real vs Prog)</th>
                <th className="py-3 px-4 text-center">Semáforo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {actividadesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No se encontraron actividades con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                actividadesFiltradas.map((act) => (
                  <tr 
                    key={act.id} 
                    onClick={() => setSelectedActividad(act)}
                    className="hover:bg-slate-50/80 cursor-pointer transition"
                  >
                    {/* WBS */}
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{act.wbs}</span>
                        {act.rutaCritica && (
                          <span title="Ruta Crítica">
                            <Flame className="h-3 w-3 text-rose-600" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Nombre y Capítulo */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{act.nombre}</div>
                      <div className="text-[11px] text-slate-500">{act.capitulo} • {act.responsable}</div>
                    </td>

                    {/* Fechas */}
                    <td className="py-3 px-4 whitespace-nowrap text-[11px]">
                      <div className="font-semibold text-slate-800">{act.inicio}</div>
                      <div className="text-slate-400">al {act.fin}</div>
                    </td>

                    {/* Duración */}
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {act.duracionDias} d
                    </td>

                    {/* Ejecutado / Meta */}
                    <td className="py-3 px-4 text-right">
                      <div className="font-bold text-slate-900">
                        {act.ejecutado.toFixed(2)} {act.unidad}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        de {act.meta.toFixed(2)} {act.unidad}
                      </div>
                    </td>

                    {/* Barra de Progreso 4D */}
                    <td className="py-3 px-4 w-48">
                      <div className="flex justify-between text-[11px] font-bold mb-1">
                        <span className="text-emerald-700">Real: {act.pctReal.toFixed(1)}%</span>
                        <span className="text-slate-500">Prog: {act.pctProgramado.toFixed(1)}%</span>
                      </div>
                      <div className="relative w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        {/* Barra Programada (Gris guía) */}
                        <div 
                          className="absolute top-0 bottom-0 bg-slate-400/40 rounded-full" 
                          style={{ width: `${Math.min(act.pctProgramado, 100)}%` }} 
                        />
                        {/* Barra Real (Color vivo) */}
                        <div 
                          className={`relative h-full rounded-full transition-all duration-300 ${
                            act.pctReal >= 100 
                              ? 'bg-emerald-500' 
                              : act.pctReal >= act.pctProgramado 
                              ? 'bg-slate-800' 
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(act.pctReal, 100)}%` }}
                        />
                      </div>
                    </td>

                    {/* Semáforo Badge */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${act.colorClass}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${act.dotColor}`} />
                        {act.estadoLabel}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. MODAL DE FICHA TÉCNICA DE ACTIVIDAD (AL HACER CLIC) */}
      {selectedActividad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl steel-card p-6 shadow-2xl">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase">WBS {selectedActividad.wbs}</span>
                <h3 className="text-lg font-black text-slate-900">{selectedActividad.nombre}</h3>
                <p className="text-xs text-slate-500">{selectedActividad.capitulo}</p>
              </div>
              <button
                onClick={() => setSelectedActividad(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Fecha Inicio:</span>
                  <strong className="text-slate-900">{selectedActividad.inicio}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Fecha Terminación:</span>
                  <strong className="text-slate-900">{selectedActividad.fin}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Duración Contractual:</span>
                  <strong className="text-slate-900">{selectedActividad.duracionDias} días calendario</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Ruta Crítica:</span>
                  <strong className={selectedActividad.rutaCritica ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                    {selectedActividad.rutaCritica ? '🔥 SÍ (Holgura Cero)' : 'NO (Con Holgura)'}
                  </strong>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-1">Responsable en Obra:</span>
                <strong className="text-slate-900 text-sm">{selectedActividad.responsable}</strong>
                <span className="text-slate-500 block mt-2 mb-1">Incidencia en el Presupuesto (Peso):</span>
                <strong className="text-slate-900">{selectedActividad.pesoPct}% del total de obra</strong>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-emerald-800">Control de Cantidades:</span>
                  <span className="font-extrabold text-emerald-900">{selectedActividad.pctReal.toFixed(1)}%</span>
                </div>
                <p className="text-emerald-700 text-[11px]">
                  Se han registrado <strong>{selectedActividad.ejecutado.toFixed(2)} {selectedActividad.unidad}</strong> de una meta contratada de <strong>{selectedActividad.meta.toFixed(2)} {selectedActividad.unidad}</strong>.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedActividad(null)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
