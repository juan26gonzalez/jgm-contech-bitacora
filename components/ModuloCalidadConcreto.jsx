'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Trash2,
  Printer,
  TrendingUp,
  Award,
  Calendar,
  Building,
  ShieldCheck,
  Search,
  X
} from 'lucide-react';
import { useAppPreferences } from '../lib/i18n';
import {
  DEMO_SHOWCASE_PROJECT_ID,
  DEMO_ENSAYOS_CONCRETO
} from '../lib/demoFieldData';
import {
  convertStrengthMpa,
  convertForceKn,
  localizeTerm
} from '../lib/units';

const RESISTENCIA_DISENO = 24.5; // MPa (3553 PSI) para losa y elementos estructurales

// Ensayos iniciales realistas precargados para el Mezzanine 3 Niveles
const ENSAYOS_INICIALES = [
  {
    id: 'cil-101',
    fechaVaciado: '2026-10-15',
    fechaEnsayo: '2026-10-22',
    edadDias: 7,
    elemento: 'Zapatas Z1-Z4 y Vigas de Cimentación',
    resistenciaMPa: 17.8,
    cargaKN: 314.5,
    porcentajeAlcanzado: 72.6,
    laboratorio: 'Lab. Suelos & Materiales CUC',
    asentamiento: '5.5"',
    cumple: true,
    observaciones: 'Falla cónica tipo 1 normal. Resistencia esperada superada a 7 días.'
  },
  {
    id: 'cil-102',
    fechaVaciado: '2026-10-15',
    fechaEnsayo: '2026-11-12',
    edadDias: 28,
    elemento: 'Zapatas Z1-Z4 y Vigas de Cimentación',
    resistenciaMPa: 26.2,
    cargaKN: 463.0,
    porcentajeAlcanzado: 106.9,
    laboratorio: 'Lab. Suelos & Materiales CUC',
    asentamiento: '5.5"',
    cumple: true,
    observaciones: 'Cumple holgadamente con NSR-10 (supera 24.5 MPa contractual).'
  },
  {
    id: 'cil-103',
    fechaVaciado: '2026-10-24',
    fechaEnsayo: '2026-10-31',
    edadDias: 7,
    elemento: 'Columnas Estructurales Eje 1-A y 2-B',
    resistenciaMPa: 18.2,
    cargaKN: 321.6,
    porcentajeAlcanzado: 74.3,
    laboratorio: 'Lab. Suelos & Materiales CUC',
    asentamiento: '5.0"',
    cumple: true,
    observaciones: 'Excelente dosificación premezclada Ultracem.'
  },
  {
    id: 'cil-104',
    fechaVaciado: '2026-11-01',
    fechaEnsayo: '2026-11-08',
    edadDias: 7,
    elemento: 'Losa en Concreto para Metaldeck Mezzanine Nivel 2',
    resistenciaMPa: 16.9,
    cargaKN: 298.6,
    porcentajeAlcanzado: 69.0,
    laboratorio: 'Lab. Suelos & Materiales CUC',
    asentamiento: '6.0"',
    cumple: true,
    observaciones: 'Dentro del rango de 65-75% a 7 días. Probeta gemela se ensayará a 28 días.'
  }
];

const mapDemoEnsayo = (e) => {
  const isFooting = String(e.elemento || '').toLowerCase().includes('zapata');
  const fcSpecMpa = isFooting ? 21.0 : 24.0;
  const rMpa = Number(e.resistenciaMpa || 0);
  const porcentajeAlcanzado = Number(((rMpa / fcSpecMpa) * 100).toFixed(1));
  return {
    id: e.codigoCilindro || `NB-${e.id}`,
    fechaVaciado: e.fechaVaciado,
    fechaEnsayo: e.fechaVaciado,
    edadDias: e.edadDias,
    elemento: e.elemento,
    elemento_en: e.elemento_en,
    resistenciaMPa: rMpa,
    cargaKN: Number(e.cargaKn || 0),
    fcSpecMpa,
    porcentajeAlcanzado,
    laboratorio: e.laboratorio,
    asentamiento: '5.0"',
    cumple: e.estado === 'APROBADO',
    observaciones: e.observaciones,
    observaciones_en: e.observaciones_en
  };
};

export default function ModuloCalidadConcreto({ registros = [], proyectoActivo = 'mezzanine', isDemo = false }) {
  const { lang, formatStrength, formatForce } = useAppPreferences();
  const demoMode = isDemo || proyectoActivo === DEMO_SHOWCASE_PROJECT_ID;

  const [ensayos, setEnsayos] = useState([]);
  const [demoEnsayos, setDemoEnsayos] = useState(() => DEMO_ENSAYOS_CONCRETO.map(mapDemoEnsayo));
  const [filtroElemento, setFiltroElemento] = useState('todos');
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);

  // Formulario nuevo ensayo
  const [fechaVaciado, setFechaVaciado] = useState(new Date().toISOString().split('T')[0]);
  const [edadDias, setEdadDias] = useState('7');
  const [elemento, setElemento] = useState(
    demoMode
      ? 'Columnas Pórtico Estructural Ejes A-B'
      : 'Losa en Concreto para Metaldeck Mezzanine Nivel 2'
  );
  const [resistenciaInput, setResistenciaInput] = useState('');
  const [laboratorio, setLaboratorio] = useState(
    demoMode ? 'Central Concrete QA Lab (ISO 17025)' : 'Lab. Suelos & Materiales CUC'
  );
  const [asentamiento, setAsentamiento] = useState('5.5"');
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    setElemento(
      demoMode
        ? 'Columnas Pórtico Estructural Ejes A-B'
        : 'Losa en Concreto para Metaldeck Mezzanine Nivel 2'
    );
    setLaboratorio(
      demoMode ? 'Central Concrete QA Lab (ISO 17025)' : 'Lab. Suelos & Materiales CUC'
    );
  }, [demoMode]);

  // Cargar de LocalStorage (solo sesión real)
  useEffect(() => {
    if (demoMode) return;
    try {
      const guardados = localStorage.getItem('jgm_calidad_concreto');
      if (guardados) {
        setEnsayos(JSON.parse(guardados));
      } else {
        setEnsayos(ENSAYOS_INICIALES);
        localStorage.setItem('jgm_calidad_concreto', JSON.stringify(ENSAYOS_INICIALES));
      }
    } catch (e) {
      setEnsayos(ENSAYOS_INICIALES);
    }
  }, [demoMode]);

  const activeEnsayos = demoMode ? demoEnsayos : ensayos;

  const guardarEnsayos = (nuevos) => {
    if (demoMode) {
      setDemoEnsayos(nuevos);
      return;
    }
    setEnsayos(nuevos);
    try {
      localStorage.setItem('jgm_calidad_concreto', JSON.stringify(nuevos));
    } catch (e) {
      console.warn('Error guardando en localStorage:', e);
    }
  };

  const handleCrearEnsayo = (e) => {
    e.preventDefault();
    const rawVal = parseFloat(resistenciaInput);
    if (isNaN(rawVal) || rawVal <= 0) {
      alert(lang === 'en' ? 'Enter a valid compressive strength value.' : 'Ingrese un valor válido de resistencia.');
      return;
    }

    const rMPa = lang === 'en' ? Number((rawVal / 145.0377).toFixed(2)) : rawVal;
    const targetFc = demoMode
      ? elemento.toLowerCase().includes('zapata')
        ? 21.0
        : 24.0
      : RESISTENCIA_DISENO;

    const porcentaje = Number(((rMPa / targetFc) * 100).toFixed(1));
    const edad = parseInt(edadDias, 10);

    let esConforme = true;
    if (edad === 7 && porcentaje < 65) esConforme = false;
    else if (edad === 14 && porcentaje < 80) esConforme = false;
    else if (edad >= 28 && porcentaje < 100) esConforme = false;

    const fV = new Date(fechaVaciado);
    fV.setDate(fV.getDate() + edad);
    const fEnsayo = fV.toISOString().split('T')[0];

    const nuevoItem = {
      id: demoMode ? `NB-CYL-${Math.floor(100 + Math.random() * 899)}` : `cil-${Date.now()}`,
      fechaVaciado,
      fechaEnsayo: fEnsayo,
      edadDias: edad,
      elemento,
      elemento_en: localizeTerm(elemento, 'en'),
      resistenciaMPa: rMPa,
      cargaKN: Number((rMPa * 17.67).toFixed(1)),
      fcSpecMpa: targetFc,
      porcentajeAlcanzado: porcentaje,
      laboratorio,
      asentamiento,
      cumple: esConforme,
      observaciones:
        observaciones ||
        (esConforme
          ? 'Ensayo conforme con las especificaciones técnicas.'
          : 'Alerta: Resistencia por debajo de la curva esperada.'),
      observaciones_en:
        observaciones ||
        (esConforme
          ? 'Break test compliant with structural specifications (ASTM C39).'
          : 'Alert: Compressive strength below expected maturation curve.')
    };

    guardarEnsayos([nuevoItem, ...activeEnsayos]);
    setMostrarModalNuevo(false);
    setResistenciaInput('');
    setObservaciones('');
    const dispStrength = lang === 'en'
      ? `${Math.round(convertStrengthMpa(rMPa, 'en')).toLocaleString('en-US')} PSI`
      : `${rMPa.toFixed(1)} MPa`;
    const dispSpec = lang === 'en'
      ? `${Math.round(convertStrengthMpa(targetFc, 'en')).toLocaleString('en-US')} PSI`
      : `${targetFc} MPa`;
    alert(
      lang === 'en'
        ? `Cylinder break logged successfully!\nStrength: ${dispStrength} (${porcentaje}% of f'c = ${dispSpec})`
        : `Cilindro registrado exitosamente!\nResistencia: ${dispStrength} (${porcentaje}% de f'c = ${dispSpec})`
    );
  };

  const handleEliminarEnsayo = (id) => {
    if (confirm(lang === 'en' ? 'Delete this cylinder test record?' : '¿Deseas eliminar este registro de ensayo?')) {
      const filtrados = activeEnsayos.filter(e => e.id !== id);
      guardarEnsayos(filtrados);
    }
  };

  // Métricas Consolidadas
  const estadisticas = useMemo(() => {
    const total = activeEnsayos.length;
    if (total === 0) return { total: 0, conformes: 0, promedioMPa: 0, tasaConformidad: 100, roturas28d: 0 };

    const conformes = activeEnsayos.filter(e => e.cumple).length;
    const sumMPa = activeEnsayos.reduce((acc, curr) => acc + (parseFloat(curr.resistenciaMPa) || 0), 0);
    const roturas28d = activeEnsayos.filter(e => e.edadDias >= 28).length;

    return {
      total,
      conformes,
      promedioMPa: sumMPa / total,
      tasaConformidad: ((conformes / total) * 100).toFixed(0),
      roturas28d
    };
  }, [activeEnsayos]);

  const ensayosFiltrados = useMemo(() => {
    if (filtroElemento === 'todos') return activeEnsayos;
    return activeEnsayos.filter(e =>
      `${e.elemento} ${e.elemento_en || ''}`.toLowerCase().includes(filtroElemento.toLowerCase())
    );
  }, [activeEnsayos, filtroElemento]);

  const designDisplay = demoMode
    ? (lang === 'en' ? "f'c = 3,000–3,500 PSI" : "f'c = 21–24 MPa (3000–3500 PSI)")
    : (lang === 'en' ? "f'c = 3,553 PSI (24.5 MPa)" : "f'c = 24.5 MPa (3500 PSI)");

  const avgDisplayVal = lang === 'en'
    ? Math.round(convertStrengthMpa(estadisticas.promedioMPa, 'en')).toLocaleString('en-US')
    : Number(estadisticas.promedioMPa || 0).toFixed(1);

  return (
    <div className="space-y-6">

      {/* CABECERA DEL MÓDULO */}
      <div className="rounded-2xl steel-card p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl steel-panel-dark text-white shadow-md">
            <FlaskConical className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {lang === 'en' ? 'Concrete Quality Assurance (ACI 318 / ASTM C39)' : 'Control de Calidad de Concreto (NSR-10 / NTC)'}
              </h2>
              <span className="rounded-full bg-slate-200 text-slate-900 text-[10px] font-black px-2.5 py-0.5 border border-slate-400/70">
                {designDisplay}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {demoMode
                ? (lang === 'en'
                    ? '7, 14 & 28-day cylinder break traceability • ASTM C39 / ISO 17025 (Demo Sandbox)'
                    : 'Trazabilidad de rotura de cilindros a 7, 14 y 28 días • ASTM C39 / ISO 17025 (Demo Sandbox)')
                : (lang === 'en'
                    ? '7, 14 & 28-day cylinder compression traceability • QA Inspection'
                    : 'Trazabilidad de rotura de cilindros a 7, 14 y 28 días • Interventoría DOLMEN S.A.')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setMostrarModalNuevo(true)}
            className="inline-flex items-center gap-1.5 rounded-xl steel-btn-primary text-white px-3.5 py-2 text-xs font-bold"
          >
            <Plus className="h-4 w-4" /> {lang === 'en' ? 'Log Cylinder Break' : 'Registrar Cilindro / Ensayo'}
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 text-xs font-bold transition"
          >
            <Printer className="h-4 w-4" /> {lang === 'en' ? 'Print QA Report' : 'Certificado PDF'}
          </button>
        </div>
      </div>

      {/* 4 TARJETAS DE INDICADORES CLAVE (KPIS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl steel-card p-4">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {lang === 'en' ? 'Total Tested Cylinders' : 'Total Probetas Ensayadas'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5">
            {estadisticas.total}
            <span className="text-xs font-semibold text-slate-400">{lang === 'en' ? 'cylinders' : 'cilindros'}</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {estadisticas.roturas28d} {lang === 'en' ? 'breaks at 28 days' : 'cilindros a 28 días'}
          </span>
        </div>

        <div className="rounded-xl steel-card p-4">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {lang === 'en' ? 'Mean Achieved Strength' : 'Resistencia Media Obtenida'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5">
            {avgDisplayVal}
            <span className="text-xs font-semibold text-slate-400">{lang === 'en' ? 'PSI' : 'MPa'}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
            vs. {demoMode ? (lang === 'en' ? '3,000–3,500 PSI Spec' : '21–24 MPa Requerido') : (lang === 'en' ? '3,553 PSI Req.' : '24.5 MPa Requerido')}
          </span>
        </div>

        <div className="rounded-xl steel-card p-4">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {lang === 'en' ? 'Compliance Rate' : 'Índice de Conformidad'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 flex items-baseline gap-1.5">
            {estadisticas.tasaConformidad}%
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {estadisticas.conformes} {lang === 'en' ? 'of' : 'de'} {estadisticas.total} {lang === 'en' ? 'pass ASTM/NSR spec' : 'cumplen norma'}
          </span>
        </div>

        <div className="rounded-xl steel-card p-4">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {lang === 'en' ? 'Avg. Field Slump' : 'Slump Promedio en Obra'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5">
            {demoMode ? (lang === 'en' ? '5.0"' : '127 mm') : (lang === 'en' ? '5.5"' : '140 mm')}
            <span className="text-xs font-semibold text-slate-400">{lang === 'en' ? 'slump' : 'asentamiento'}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
            {lang === 'en' ? 'Ideal pumpability ASTM C143' : 'Ideal para bombeo estructural'}
          </span>
        </div>
      </div>

      {/* CURVA DE MADURACIÓN DEL CONCRETO (NSR-10 / ACI 318) */}
      <div className="rounded-2xl steel-card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-slate-800" />
            {lang === 'en'
              ? "Strength Maturation Curve vs. Design Spec f'c (ACI 318 / NSR-10)"
              : "Curva de Maduración vs. Resistencia Contractual f'c (NSR-10)"}
          </h3>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            {lang === 'en' ? 'ASTM C39 / NTC 550' : 'NTC 550 / ASTM C39'}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          {lang === 'en'
            ? 'Average compressive strength progression of structural concrete across standard break ages:'
            : 'Comportamiento promedio del concreto colocado en la estructura en los diferentes tiempos de rotura:'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-bold text-slate-700">{lang === 'en' ? '7 DAYS (Early)' : '7 DÍAS (Temprana)'}</span>
              <span className="font-mono font-bold text-slate-900">
                {demoMode ? '99.3%' : '72.6%'} ({formatStrength(demoMode ? 20.85 : 17.8, demoMode ? 0 : 1)} {lang === 'en' ? 'PSI' : 'MPa'})
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-slate-800 h-full rounded-full" style={{ width: demoMode ? '99%' : '72.6%' }}></div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5">
              <span>{lang === 'en' ? 'Expected Range: 65–75%' : 'Rango Esperado: 65 - 75%'}</span>
              <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> {lang === 'en' ? 'Compliant' : 'Cumple'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-bold text-slate-700">{lang === 'en' ? '14 DAYS (Mid-Cure)' : '14 DÍAS (Intermedia)'}</span>
              <span className="font-mono font-bold text-slate-900">
                86.5% ({formatStrength(21.2, 1)} {lang === 'en' ? 'PSI' : 'MPa'})
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-slate-800 h-full rounded-full" style={{ width: '86.5%' }}></div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5">
              <span>{lang === 'en' ? 'Expected Range: 80–90%' : 'Rango Esperado: 80 - 90%'}</span>
              <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> {lang === 'en' ? 'Compliant' : 'Cumple'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-bold text-emerald-900">{lang === 'en' ? '28 DAYS (Design)' : '28 DÍAS (Contractual)'}</span>
              <span className="font-mono font-bold text-emerald-700">
                {demoMode ? '108.0%' : '106.9%'} ({formatStrength(demoMode ? 25.93 : 26.2, 1)} {lang === 'en' ? 'PSI' : 'MPa'})
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '100%' }}></div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1.5">
              <span>{lang === 'en' ? 'Required: ≥ 100%' : 'Exigido: ≥ 100%'} ({formatStrength(demoMode ? 24.0 : 24.5, 1)} {lang === 'en' ? 'PSI' : 'MPa'})</span>
              <span className="text-emerald-700 font-black inline-flex items-center gap-1">
                <Award className="h-3 w-3" /> {lang === 'en' ? 'Approved' : 'Aprobado'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TABLA DE PROBETAS / ENSAYOS */}
      <div className="rounded-2xl steel-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-slate-700" />
              {lang === 'en' ? `Cylinder Compression Log (${ensayosFiltrados.length})` : `Registro de Probetas y Rotura de Cilindros (${ensayosFiltrados.length})`}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'en' ? 'Hydraulic press test history & QA lab results' : 'Historial de muestras ensayadas con prensa hidráulica'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filtroElemento}
              onChange={(e) => setFiltroElemento(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="todos">{lang === 'en' ? 'All Structural Elements' : 'Todos los Elementos'}</option>
              <option value="Zapatas">{lang === 'en' ? 'Spread Footings / Foundations' : 'Zapatas / Cimentación'}</option>
              <option value="Columnas">{lang === 'en' ? 'Structural Columns' : 'Columnas'}</option>
              <option value={demoMode ? 'Plantilla' : 'Losa'}>
                {demoMode ? (lang === 'en' ? 'Sub-Slab / Grade Beams' : 'Plantilla / Vigas') : (lang === 'en' ? 'Mezzanine Deck Slab' : 'Losa Mezzanine')}
              </option>
            </select>
          </div>
        </div>

        {/* TABLA RESPONSIVA CON SCROLL SUAVE */}
        <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs text-slate-800 min-w-[620px]">
            <thead className="bg-slate-100 text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">{lang === 'en' ? 'Cylinder / Pour Date' : 'Cilindro / Fecha'}</th>
                <th className="py-2.5 px-3">{lang === 'en' ? 'Structural Element' : 'Elemento Estructural'}</th>
                <th className="py-2.5 px-2 text-center">{lang === 'en' ? 'Age' : 'Edad'}</th>
                <th className="py-2.5 px-3 text-right">{lang === 'en' ? "Strength (PSI)" : "Resistencia (MPa)"}</th>
                <th className="py-2.5 px-3 text-center">% f&apos;c</th>
                <th className="py-2.5 px-3 text-center">{lang === 'en' ? 'Status' : 'Estado'}</th>
                <th className="py-2.5 px-2 text-center no-print">{lang === 'en' ? 'Action' : 'Acción'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ensayosFiltrados.map((item) => {
                const dispElem = lang === 'en' ? (item.elemento_en || localizeTerm(item.elemento, 'en')) : item.elemento;
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3">
                      <strong className="text-slate-900 block font-mono">{item.id}</strong>
                      <span className="text-[10px] text-slate-400">{lang === 'en' ? 'Poured:' : 'Vaciado:'} {item.fechaVaciado}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800 block">{dispElem}</span>
                      <span className="text-[10px] text-slate-400">{item.laboratorio} • Slump: {item.asentamiento}</span>
                    </td>
                    <td className="py-3 px-2 text-center font-bold">
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-slate-700 font-mono">
                        {item.edadDias} {lang === 'en' ? 'days' : 'días'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-black text-slate-900 font-mono">
                      {formatStrength(item.resistenciaMPa, 1)} {lang === 'en' ? 'PSI' : 'MPa'}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {formatForce(item.cargaKN, 1)} {lang === 'en' ? 'kip' : 'kN'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-black">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] ${
                        item.porcentajeAlcanzado >= 100
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.porcentajeAlcanzado >= 65
                            ? 'bg-slate-200 text-slate-900 border border-slate-300'
                            : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.porcentajeAlcanzado}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {item.cumple ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" /> {lang === 'en' ? 'Pass' : 'Cumple'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600">
                          <AlertTriangle className="h-3.5 w-3.5" /> {lang === 'en' ? 'Alert' : 'Alerta'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center no-print">
                      <button
                        onClick={() => handleEliminarEnsayo(item.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                        title={lang === 'en' ? 'Delete test record' : 'Eliminar ensayo'}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PARA AGREGAR NUEVO ENSAYO */}
      {mostrarModalNuevo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl steel-card p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-slate-800" />
                {lang === 'en' ? 'Log New Cylinder Compression Test' : 'Registrar Nuevo Ensayo de Cilindro'}
              </h3>
              <button
                onClick={() => setMostrarModalNuevo(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
                aria-label={lang === 'en' ? 'Close' : 'Cerrar'}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCrearEnsayo} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {lang === 'en' ? 'Pour Date' : 'Fecha de Vaciado'}
                  </label>
                  <input
                    type="date"
                    value={fechaVaciado}
                    onChange={(e) => setFechaVaciado(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {lang === 'en' ? 'Test Age' : 'Edad de Ensayo'}
                  </label>
                  <select
                    value={edadDias}
                    onChange={(e) => setEdadDias(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  >
                    <option value="7">{lang === 'en' ? '7 Days (Early - min 65%)' : '7 Días (Temprana - min. 65%)'}</option>
                    <option value="14">{lang === 'en' ? '14 Days (Mid - min 80%)' : '14 Días (Intermedia - min. 80%)'}</option>
                    <option value="28">{lang === 'en' ? '28 Days (Design - min 100%)' : '28 Días (Contractual - min. 100%)'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {lang === 'en' ? 'Structural Element Poured' : 'Elemento Estructural Vaciado'}
                </label>
                <select
                  value={elemento}
                  onChange={(e) => setElemento(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800"
                >
                  {demoMode ? (
                    <>
                      <option value="Columnas Pórtico Estructural Ejes A-B">
                        {lang === 'en' ? "Structural Frame Columns Grid A-B (f'c=3,500 PSI)" : "Columnas Pórtico Estructural Ejes A-B (f'c=24 MPa)"}
                      </option>
                      <option value="Zapatas Z-1 a Z-6 y Vigas de Cimentación">
                        {lang === 'en' ? "Spread Footings F-1 to F-6 & Grade Beams (f'c=3,000 PSI)" : "Zapatas Z-1 a Z-6 y Vigas de Cimentación (f'c=21 MPa)"}
                      </option>
                      <option value="Plantilla de Concreto e=7cm (Sub-slab)">
                        {lang === 'en' ? 'Leveling Sub-Slab t=2.75" (2,000 PSI)' : 'Plantilla de Concreto e=7cm'}
                      </option>
                    </>
                  ) : (
                    <>
                      <option value="Losa en Concreto para Metaldeck Mezzanine Nivel 2">
                        {lang === 'en' ? 'Metaldeck Concrete Slab Level 2' : 'Losa en Concreto para Metaldeck Mezzanine Nivel 2'}
                      </option>
                      <option value="Zapatas Z1-Z4 y Vigas de Cimentación">
                        {lang === 'en' ? 'Footings Z1-Z4 & Grade Beams' : 'Zapatas Z1-Z4 y Vigas de Cimentación'}
                      </option>
                      <option value="Columnas Estructurales Ejes A-C">
                        {lang === 'en' ? 'Structural Columns Grid A-C' : 'Columnas Estructurales Ejes A-C'}
                      </option>
                      <option value="Vigas Aéreas y de Amarre">
                        {lang === 'en' ? 'Elevated & Tie Beams' : 'Vigas Aéreas y de Amarre'}
                      </option>
                      <option value="Plantilla de Concreto Pobre">
                        {lang === 'en' ? 'Lean Concrete Mud Slab' : 'Plantilla de Concreto Pobre'}
                      </option>
                    </>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {lang === 'en' ? 'Achieved Strength (PSI)' : 'Resistencia Obtenida (MPa)'}
                  </label>
                  <input
                    type="number"
                    step={lang === 'en' ? '1' : '0.1'}
                    min="1"
                    value={resistenciaInput}
                    onChange={(e) => setResistenciaInput(e.target.value)}
                    placeholder={lang === 'en' ? 'e.g. 3650' : 'Ej. 25.4'}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-black text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {lang === 'en' ? 'Measured Slump' : 'Slump de Cono Medido'}
                  </label>
                  <input
                    type="text"
                    value={asentamiento}
                    onChange={(e) => setAsentamiento(e.target.value)}
                    placeholder='Ej. 5.5"'
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {lang === 'en' ? 'Testing Laboratory' : 'Laboratorio de Ensayo'}
                </label>
                <input
                  type="text"
                  value={laboratorio}
                  onChange={(e) => setLaboratorio(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {lang === 'en' ? 'Technical Observations' : 'Observaciones Técnicas'}
                </label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={2}
                  placeholder={lang === 'en' ? 'e.g. Tested per ASTM C39. Type 1 cone fracture...' : 'Ej. Probeta ensayada bajo norma NTC 550. Fractura cónica bien conformada...'}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMostrarModalNuevo(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  {lang === 'en' ? 'Cancel' : 'Cancelar'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg steel-btn-primary text-white"
                >
                  {lang === 'en' ? 'Save Cylinder Break' : 'Guardar Cilindro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
