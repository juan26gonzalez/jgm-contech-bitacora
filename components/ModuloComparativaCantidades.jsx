'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Download,
  Printer,
  Search,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { useAppPreferences } from '../lib/i18n';
import {
  DEMO_SHOWCASE_PROJECT_ID,
  DEMO_CATALOGO_SHOWCASE,
} from '../lib/demoFieldData';
import {
  convertQty,
  localizeActivity,
  localizeChapter,
} from '../lib/units';

const ITEMS_CONTRATADOS = [
  { item: "1.1", capitulo: "1. PRELIMINARES", actividad: "Localización, trazado y replanteo", unidad: "m²", contratado: 180.0, matchKeys: ["localizacion", "trazado", "replanteo"] },
  { item: "1.2", capitulo: "1. PRELIMINARES", actividad: "Cerramiento perimetral en polisombra negra al 90%", unidad: "ml", contratado: 156.0, matchKeys: ["cerramiento", "polisombra"] },
  { item: "1.3", capitulo: "1. PRELIMINARES", actividad: "Demolición y retiro de material (plantillas, muros)", unidad: "m³", contratado: 48.68, matchKeys: ["demolicion", "retiro"] },
  { item: "1.4", capitulo: "1. PRELIMINARES", actividad: "Demolición de piso en porcelanato y plantilla", unidad: "m²", contratado: 35.11, matchKeys: ["demolicion piso", "porcelanato"] },
  { item: "1.5", capitulo: "1. PRELIMINARES", actividad: "Relleno con material seleccionado y compactación", unidad: "m³", contratado: 25.0, matchKeys: ["relleno", "compactacion", "nivelacion"] },
  { item: "2.1", capitulo: "2. EXCAVACIONES", actividad: "Excavación para zapatas, vigas y foso ascensor", unidad: "m³", contratado: 42.0, matchKeys: ["excavacion", "excavación"] },
  { item: "3.1", capitulo: "3. CIMENTACIÓN", actividad: "Solado de limpieza para zapatas y vigas e=0.05m", unidad: "m²", contratado: 25.3, matchKeys: ["solado", "plantilla de concreto", "limpieza"] },
  { item: "3.2", capitulo: "3. CIMENTACIÓN", actividad: "Concreto para zapatas Fc=24.5 MPa (3500 PSI)", unidad: "m³", contratado: 8.82, matchKeys: ["zapatas", "cimentacion", "cimentación"] },
  { item: "3.3", capitulo: "3. CIMENTACIÓN", actividad: "Concreto para vigas de cimentación y enlace Fc=24.5 MPa", unidad: "m³", contratado: 5.13, matchKeys: ["vigas de cimentacion", "vigas de amarre", "vigas"] },
  { item: "3.4", capitulo: "3. CIMENTACIÓN", actividad: "Concreto para pedestales Fc=24.5 MPa", unidad: "m³", contratado: 3.59, matchKeys: ["pedestales", "columnas estructurales", "columnas"] },
  { item: "3.5", capitulo: "3. CIMENTACIÓN", actividad: "Placa en concreto para piso e=12 cm Fc=21 MPa", unidad: "m²", contratado: 52.0, matchKeys: ["placa", "piso en concreto"] },
  { item: "3.6", capitulo: "3. CIMENTACIÓN", actividad: "Losa en concreto para metaldeck e=11 cm Fc=21 MPa", unidad: "m²", contratado: 150.0, matchKeys: ["losa", "metaldeck"] },
  { item: "3.7", capitulo: "3. CIMENTACIÓN", actividad: "Concreto para muro foso ascensor Fc=24.5 MPa", unidad: "m³", contratado: 3.04, matchKeys: ["foso", "ascensor", "muro foso"] },
  { item: "3.8", capitulo: "3. CIMENTACIÓN", actividad: "Suministro e instalación de barras roscadas 5/8 pulg", unidad: "und", contratado: 48.0, matchKeys: ["barras roscadas", "anclajes", "pernos"] },
  { item: "4.1", capitulo: "4. ACERO DE REFUERZO", actividad: "Acero de refuerzo figurado para cimentación (60 KSI)", unidad: "kg", contratado: 1525.0, matchKeys: ["acero de refuerzo", "figurado"] },
  { item: "5.1", capitulo: "5. ACERO ESTRUCTURAL", actividad: "Perfilería estructural (HEA 320 columnas, vigas IPE 300)", unidad: "kg", contratado: 13948.0, matchKeys: ["perfileria", "hea 320", "ipe 300", "metalica"] },
  { item: "5.2", capitulo: "5. ACERO ESTRUCTURAL", actividad: "Conexiones para perfiles estructurales (platinas, pernos)", unidad: "kg", contratado: 185.0, matchKeys: ["conexiones", "platinas"] },
  { item: "5.3", capitulo: "5. ACERO ESTRUCTURAL", actividad: "Mortero autonivelante sin contracción placa base (Sika Grout)", unidad: "und", contratado: 6.0, matchKeys: ["sika grout", "mortero autonivelante", "grout"] },
  { item: "6.1", capitulo: "6. MAMPOSTERÍA", actividad: "Levante de muro en bloque de cemento No. 12 con dovelas", unidad: "m²", contratado: 367.5, matchKeys: ["muros en mamposteria", "bloque", "mamposteria", "bloques"] },
  { item: "6.2", capitulo: "6. MAMPOSTERÍA", actividad: "Viga cinta o superior en concreto reforzado 0.15x0.20", unidad: "ml", contratado: 35.0, matchKeys: ["viga cinta"] },
  { item: "6.3", capitulo: "6. MAMPOSTERÍA", actividad: "Alfajía remate muro superior en concreto 0.07x0.15", unidad: "ml", contratado: 32.0, matchKeys: ["alfajia", "alfajía"] },
  { item: "6.4", capitulo: "6. MAMPOSTERÍA", actividad: "Pañete interior relación 1:4 e=0.015", unidad: "m²", contratado: 735.0, matchKeys: ["pañete", "panete", "revoco"] },
  { item: "6.5", capitulo: "6. MAMPOSTERÍA", actividad: "Instalación de piso cerámico / enchape", unidad: "m²", contratado: 80.0, matchKeys: ["piso ceramico", "enchape", "ceramica"] },
];

const ITEMS_CASA_MENDOZA = [
  { item: "1.1", capitulo: "1. MAMPOSTERÍA", actividad: "Muros en mampostería de bloques de concreto No. 12", unidad: "m²", contratado: 227.89, matchKeys: ["mamposteria", "bloque", "muro"] },
  { item: "1.2", capitulo: "1. MAMPOSTERÍA", actividad: "Pañete y mortero de revoco en muros (dos caras)", unidad: "m²", contratado: 455.78, matchKeys: ["panete", "pañete", "revoco"] },
  { item: "2.1", capitulo: "2. PISOS Y ENCHAPES", actividad: "Plantilla de concreto e=7cm (Casa Mendoza)", unidad: "m²", contratado: 110.00, matchKeys: ["plantilla", "solado"] },
  { item: "2.2", capitulo: "2. PISOS Y ENCHAPES", actividad: "Instalación de piso en porcelanato 51x51 cm y enchape", unidad: "m²", contratado: 110.00, matchKeys: ["porcelanato", "piso ceramico", "enchape", "ceramica"] },
  { item: "2.3", capitulo: "2. PISOS Y ENCHAPES", actividad: "Enchape de pared cerámica / porcelanato (Cocina/Baño)", unidad: "m²", contratado: 45.00, matchKeys: ["enchape de pared", "enchape pared"] },
  { item: "3.1", capitulo: "3. CIELOS RASOS", actividad: "Instalación de cielo raso suspendido e=5.3cm", unidad: "m²", contratado: 86.65, matchKeys: ["cielo raso", "cielorraso", "ceiling"] },
  { item: "3.2", capitulo: "3. CIELOS RASOS", actividad: 'Suministro e instalación de aislamiento Frescasa Eco 2-1/2" sobre cielo raso (todas las zonas)', unidad: "m²", contratado: 86.65, matchKeys: ["frescasa", "aislamiento", "aislante", "fibra de vidrio", "termoacustico"] },
  { item: "4.1", capitulo: "4. ACABADOS Y PINTURA", actividad: "Estuco plástico y pintura vinílica en muros", unidad: "m²", contratado: 455.78, matchKeys: ["estuco", "pintura", "vinilica"] },
  { item: "5.1", capitulo: "5. CARPINTERÍA", actividad: "Suministro e instalación de puertas interiores y acceso", unidad: "und", contratado: 7.0, matchKeys: ["puertas interiores", "puertas"] },
  { item: "5.2", capitulo: "5. CARPINTERÍA", actividad: "Suministro e instalación de ventanería aluminio y vidrio", unidad: "und", contratado: 8.0, matchKeys: ["ventanas", "ventaneria", "puertas y ventanas"] },
  { item: "6.1", capitulo: "6. CUBIERTA", actividad: "Montaje de cubierta en teja Eternit y caballetes", unidad: "m²", contratado: 132.05, matchKeys: ["cubierta", "eternit", "teja"] },
];

const ITEMS_DEMO_SHOWCASE = DEMO_CATALOGO_SHOWCASE.map((c, idx) => ({
  item: `1.${idx + 1}`.replace(/^1\.(\d+)$/, (_, n) => {
    const codes = ['1.1', '1.2', '2.1', '2.2', '3.1', '4.1', '5.1', '5.2', '6.1'];
    return codes[Number(n) - 1] || `1.${n}`;
  }),
  exactId: c.id,
  capitulo: c.capitulo,
  actividad: c.id.replace(/^\[BIM_TAKEOFF\]\s*/i, ''),
  unidad: c.unidad,
  contratado: c.cantidadPresupuesto,
  matchKeys: [c.id.replace(/^\[BIM_TAKEOFF\]\s*/i, '').toLowerCase()],
}));

export default function ModuloComparativaCantidades({
  registros = [],
  proyectoActivo = 'mezzanine',
  isDemo = false,
}) {
  const { lang, formatQty, unitLabel } = useAppPreferences();
  const [filtroCapitulo, setFiltroCapitulo] = useState('todos');
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const esDemoProj = isDemo || proyectoActivo === DEMO_SHOWCASE_PROJECT_ID;
  const itemsBase = esDemoProj
    ? ITEMS_DEMO_SHOWCASE
    : proyectoActivo === 'casa_mendoza'
    ? ITEMS_CASA_MENDOZA
    : ITEMS_CONTRATADOS;

  const comparativaData = useMemo(() => {
    const norm = (s) =>
      String(s || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    const acumuladosBitacora = {};

    registros.forEach((reg) => {
      const cant = parseFloat(reg.cantidad) || 0;
      if (esDemoProj) {
        const directMatch = itemsBase.find(
          (i) => i.exactId === reg.actividad || norm(reg.actividad).includes(norm(i.actividad))
        );
        if (directMatch) {
          acumuladosBitacora[directMatch.item] = (acumuladosBitacora[directMatch.item] || 0) + cant;
        }
        return;
      }

      const actTexto = norm(reg.actividad);
      if (!actTexto || actTexto.includes('bim_takeoff')) return;
      const isFrescasa = actTexto.includes('frescasa') || actTexto.includes('aislamiento') || actTexto.includes('fibra');
      const isWallTile = actTexto.includes('enchape de pared') || actTexto.includes('enchape pared');

      let matchedItem = null;
      let bestScore = 0;
      for (const item of itemsBase) {
        if (isFrescasa && item.item === '3.1') continue;
        if (isWallTile && item.item === '2.2') continue;
        const score = item.matchKeys.reduce((s, key) => (actTexto.includes(norm(key)) ? s + key.length : s), 0);
        if (score > bestScore) {
          bestScore = score;
          matchedItem = item.item;
        }
      }

      if (matchedItem) {
        acumuladosBitacora[matchedItem] = (acumuladosBitacora[matchedItem] || 0) + cant;
      }
    });

    return itemsBase.map((item) => {
      const ejecutado = acumuladosBitacora[item.item] || 0;
      const contratado = item.contratado;
      const saldo = Math.max(0, contratado - ejecutado);
      const porcentaje = contratado > 0 ? Number(((ejecutado / contratado) * 100).toFixed(1)) : 0;

      let estado = 'en_proceso';
      if (ejecutado === 0) estado = 'sin_iniciar';
      else if (porcentaje >= 99 && porcentaje <= 100) estado = 'completado';
      else if (porcentaje > 100) estado = 'sobrecosto';

      return {
        ...item,
        ejecutado: Number(ejecutado.toFixed(2)),
        saldo: Number(saldo.toFixed(2)),
        porcentaje,
        estado,
      };
    });
  }, [registros, itemsBase, esDemoProj]);

  const resumenGeneral = useMemo(() => {
    const totalItems = comparativaData.length;
    const itemsCompletados = comparativaData.filter((c) => c.porcentaje >= 99 && c.porcentaje <= 100).length;
    const itemsEnProceso = comparativaData.filter((c) => c.porcentaje > 0 && c.porcentaje < 99).length;
    const itemsMayorCantidad = comparativaData.filter((c) => c.porcentaje > 100).length;
    const sumaPorcentajes = comparativaData.reduce((acc, c) => acc + Math.min(c.porcentaje, 100), 0);
    const avanceFisicoGlobal = totalItems > 0 ? Number((sumaPorcentajes / totalItems).toFixed(1)) : 0;

    return {
      totalItems,
      avanceFisicoGlobal,
      itemsCompletados,
      itemsEnProceso,
      itemsMayorCantidad,
    };
  }, [comparativaData]);

  const itemsFiltrados = useMemo(() => {
    const busq = filtroTexto.toLowerCase();
    return comparativaData.filter((item) => {
      const matchCap = filtroCapitulo === 'todos' || item.capitulo === filtroCapitulo;
      const actEn = localizeActivity(item.actividad, lang).toLowerCase();
      const matchText =
        item.actividad.toLowerCase().includes(busq) ||
        actEn.includes(busq) ||
        item.item.includes(filtroTexto);
      let matchEst = true;
      if (filtroEstado === 'completado') matchEst = item.estado === 'completado';
      else if (filtroEstado === 'en_proceso') matchEst = item.estado === 'en_proceso';
      else if (filtroEstado === 'sobrecosto') matchEst = item.estado === 'sobrecosto';
      else if (filtroEstado === 'sin_iniciar') matchEst = item.estado === 'sin_iniciar';

      return matchCap && matchText && matchEst;
    });
  }, [comparativaData, filtroCapitulo, filtroTexto, filtroEstado, lang]);

  const capitulosDisponibles = ['todos', ...new Set(itemsBase.map((i) => i.capitulo))];

  const exportarCSV = () => {
    const encabezados =
      lang === 'en'
        ? ['Item', 'Chapter', 'Activity', 'Unit', 'Contract_Qty', 'Executed_Qty', 'Remaining_Balance', '%_Progress', 'Status']
        : ['Item', 'Capitulo', 'Actividad', 'Unidad', 'Cant_Contratada', 'Cant_Ejecutada', 'Saldo_Pendiente', '%_Avance', 'Estado'];
    const filas = comparativaData.map((c) => [
      c.item,
      `"${localizeChapter(c.capitulo, lang)}"`,
      `"${localizeActivity(c.actividad, lang)}"`,
      unitLabel(c.unidad),
      convertQty(c.contratado, c.unidad, lang).toFixed(2),
      convertQty(c.ejecutado, c.unidad, lang).toFixed(2),
      convertQty(c.saldo, c.unidad, lang).toFixed(2),
      `${c.porcentaje}%`,
      c.estado,
    ]);
    const contenido = '\uFEFF' + [encabezados.join(','), ...filas.map((f) => f.join(','))].join('\n');
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `JGM_Quantities_${proyectoActivo}_${lang.toUpperCase()}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const projectBadgeLabel = esDemoProj
    ? 'Northbridge Hub (Demo)'
    : proyectoActivo === 'casa_mendoza'
    ? 'Casa Mendoza'
    : 'Mezzanine 3 Niveles';

  return (
    <div className="space-y-6">

      {/* CABECERA PRINCIPAL DEL MÓDULO */}
      <div className="rounded-2xl steel-card p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl steel-panel-dark text-white shadow-md">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {lang === 'en' ? 'Contract Quantities Balance (BOQ)' : 'Control de Cantidades de Obra'}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 text-slate-900 text-[10px] font-black px-2.5 py-0.5 border border-slate-400/70">
                  <Building2 className="h-3 w-3" /> {projectBadgeLabel}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'en'
                  ? 'Physical quantities tracking: Contract BOQ vs. Executed Field Logs & remaining balance'
                  : 'Comparativa de cantidades físicas: Contratadas vs. Ejecutadas y balance de saldos pendientes'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="https://jagm2000-jgmcontech.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl steel-subcard text-slate-800 hover:bg-slate-200 px-3.5 py-2 text-xs font-bold transition shadow-sm"
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>{lang === 'en' ? '5D Budget (Management)' : 'Ver Presupuesto 5D (Gerencia)'}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <button
              onClick={exportarCSV}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 text-xs font-bold transition shadow-sm"
            >
              <Download className="h-4 w-4" /> {lang === 'en' ? 'Export CSV' : 'Exportar Cantidades CSV'}
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 text-xs font-bold transition shadow-sm"
            >
              <Printer className="h-4 w-4" /> {lang === 'en' ? 'Print Balance' : 'Imprimir Balance Físico'}
            </button>
          </div>
        </div>

        {/* BARRA DE AVANCE FÍSICO GLOBAL */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {lang === 'en' ? 'Global Physical Progress' : 'Avance Físico Global de Actividades'}
              </span>
              <p className="text-[11px] text-slate-400">
                {lang === 'en'
                  ? 'Weighted average progress measured against contract BOQ items'
                  : 'Promedio de avance físico medido sobre las cantidades contractuales'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                {resumenGeneral.avanceFisicoGlobal}%
              </span>
            </div>
          </div>

          <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-slate-800 via-slate-600 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(resumenGeneral.avanceFisicoGlobal, 100)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2 font-medium">
            <span>{lang === 'en' ? '0% (Mobilization)' : '0% (Inicio de Obra)'}</span>
            <span>{lang === 'en' ? 'Contract Target: 100% Built' : 'Meta Contractual: 100% Ejecutado'}</span>
          </div>
        </div>
      </div>

      {/* 4 TARJETAS DE INDICADORES FÍSICOS CLAVE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl steel-card p-4">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {lang === 'en' ? 'Total BOQ Items' : 'Total Actividades'}
          </span>
          <div className="text-lg sm:text-xl font-black text-slate-900 mt-1 font-mono">
            {resumenGeneral.totalItems} {lang === 'en' ? 'items' : 'ítems'}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            {lang === 'en' ? 'Structured by WBS chapters' : 'Distribuidas por capítulos WBS'}
          </span>
        </div>

        <div className="rounded-xl steel-card p-4">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {lang === 'en' ? 'In Progress' : 'Actividades en Proceso'}
          </span>
          <div className="text-lg sm:text-xl font-black text-slate-900 mt-1 font-mono">
            {resumenGeneral.itemsEnProceso} {lang === 'en' ? 'active' : 'frentes'}
          </div>
          <span className="text-[10px] text-slate-700 font-bold mt-0.5 block">
            {lang === 'en' ? 'With active field progress' : 'Con avance físico activo'}
          </span>
        </div>

        <div className="rounded-xl steel-card p-4">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {lang === 'en' ? 'Completed Items' : 'Actividades Completadas'}
          </span>
          <div className="text-lg sm:text-xl font-black text-emerald-700 mt-1 flex items-baseline gap-1.5 font-mono">
            {resumenGeneral.itemsCompletados}
            <span className="text-xs font-semibold text-slate-400">/ {resumenGeneral.totalItems}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">
            {lang === 'en' ? 'At 100% contract quantity' : 'Al 100% de la cantidad contratada'}
          </span>
        </div>

        <div className="rounded-xl steel-card p-4">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {lang === 'en' ? 'Overrun Items' : 'Mayor Cantidad de Obra'}
          </span>
          <div className="text-lg sm:text-xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5 font-mono">
            <span className={resumenGeneral.itemsMayorCantidad > 0 ? 'text-amber-600' : 'text-slate-700'}>
              {resumenGeneral.itemsMayorCantidad}
            </span>
            <span className="text-xs font-semibold text-slate-400">{lang === 'en' ? 'items >100%' : 'ítems >100%'}</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
            {resumenGeneral.itemsMayorCantidad === 0 ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                {lang === 'en' ? 'Within contract limits' : 'Dentro de cantidades'}
              </>
            ) : (
              <>
                <AlertTriangle className="h-3 w-3 text-amber-600" />
                {lang === 'en' ? 'Requires change order' : 'Requiere acta de modificación'}
              </>
            )}
          </span>
        </div>
      </div>

      {/* TABLA COMPARATIVA PRINCIPAL */}
      <div className="rounded-2xl steel-card p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={lang === 'en' ? 'Search activity or item code...' : 'Buscar por actividad o ítem...'}
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-slate-800 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filtroCapitulo}
              onChange={(e) => setFiltroCapitulo(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="todos">{lang === 'en' ? 'All Chapters' : 'Todos los Capítulos'}</option>
              {capitulosDisponibles
                .filter((c) => c !== 'todos')
                .map((c) => (
                  <option key={c} value={c}>
                    {localizeChapter(c, lang)}
                  </option>
                ))}
            </select>

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="todos">{lang === 'en' ? 'All Statuses' : 'Todos los Estados'}</option>
              <option value="en_proceso">{lang === 'en' ? 'In Progress' : 'En Progreso'}</option>
              <option value="completado">{lang === 'en' ? 'Completed (100%)' : 'Completados (100%)'}</option>
              <option value="sobrecosto">{lang === 'en' ? 'Overrun (>100%)' : 'Mayor Cantidad (>100%)'}</option>
              <option value="sin_iniciar">{lang === 'en' ? 'Not Started (0%)' : 'Sin Iniciar (0%)'}</option>
            </select>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs text-slate-800 min-w-[780px]">
            <thead className="bg-slate-100 text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">{lang === 'en' ? 'Item / Activity' : 'Ítem / Actividad'}</th>
                <th className="py-2.5 px-2 text-center">{lang === 'en' ? 'Unit' : 'Unidad'}</th>
                <th className="py-2.5 px-3 text-right">{lang === 'en' ? 'Contract Qty' : 'Cant. Contratada'}</th>
                <th className="py-2.5 px-3 text-right">{lang === 'en' ? 'Executed Qty' : 'Cant. Ejecutada'}</th>
                <th className="py-2.5 px-3 text-right">{lang === 'en' ? 'Remaining' : 'Saldo Pendiente'}</th>
                <th className="py-2.5 px-3 text-center w-36">{lang === 'en' ? '% Built' : '% Avance'}</th>
                <th className="py-2.5 px-3 text-center">{lang === 'en' ? 'Status' : 'Estado'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {itemsFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    {lang === 'en'
                      ? 'No activities match current filters.'
                      : 'No hay actividades que coincidan con los filtros aplicados.'}
                  </td>
                </tr>
              ) : (
                itemsFiltrados.map((item) => (
                  <tr key={item.item} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 border border-slate-200 shrink-0">
                          {item.item}
                        </span>
                        <span className="font-semibold text-slate-900 leading-snug">
                          {localizeActivity(item.actividad, lang)}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5 pl-6">
                        {localizeChapter(item.capitulo, lang)}
                      </span>
                    </td>

                    <td className="py-3 px-2 text-center font-mono font-bold text-slate-600">
                      {unitLabel(item.unidad)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-700">
                      {formatQty(item.contratado, item.unidad)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {formatQty(item.ejecutado, item.unidad)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      {formatQty(item.saldo, item.unidad)}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.porcentaje > 100
                                ? 'bg-amber-500'
                                : item.porcentaje >= 99
                                ? 'bg-emerald-500'
                                : item.porcentaje > 0
                                ? 'bg-slate-800'
                                : 'bg-transparent'
                            }`}
                            style={{ width: `${Math.min(item.porcentaje, 100)}%` }}
                          />
                        </div>
                        <span
                          className={`text-[11px] font-mono font-bold min-w-[38px] text-right ${
                            item.porcentaje > 100 ? 'text-amber-600' : 'text-slate-700'
                          }`}
                        >
                          {item.porcentaje}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      {item.estado === 'completado' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="h-3 w-3" /> 100% OK
                        </span>
                      )}
                      {item.estado === 'en_proceso' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-900">
                          <TrendingUp className="h-3 w-3" /> {lang === 'en' ? 'Active' : 'En Curso'}
                        </span>
                      )}
                      {item.estado === 'sobrecosto' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          <AlertTriangle className="h-3 w-3" /> &gt;100% {lang === 'en' ? 'Overrun' : 'Mayor Cant.'}
                        </span>
                      )}
                      {item.estado === 'sin_iniciar' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                          {lang === 'en' ? 'Pending' : 'Pendiente'}
                        </span>
                      )}
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
}
