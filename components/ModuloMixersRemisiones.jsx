'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Trash2,
  Printer,
  FileCheck,
  Scale,
  Building,
  Timer,
  X
} from 'lucide-react';
import { useAppPreferences } from '../lib/i18n';
import {
  DEMO_SHOWCASE_PROJECT_ID,
  DEMO_REMISIONES_MIXERS
} from '../lib/demoFieldData';
import {
  convertQty,
  convertInputToMetric,
  convertTempC,
  localizeTerm
} from '../lib/units';

const REMISIONES_INICIALES = [
  {
    id: 'REM-89211',
    proveedor: 'Ultracem S.A.S.',
    placa: 'WBF-892',
    conductor: 'Carlos Mendoza',
    fecha: '2026-10-15',
    horaSalida: '07:30',
    horaLlegada: '08:15',
    tiempoMin: 45,
    volumenM3: 6.5,
    slump: '5.5"',
    temperaturaC: 28.5,
    elemento: 'Zapatas Z1-Z4 y Vigas de Cimentación',
    conforme: true,
    observaciones: 'Llegada en tiempo óptimo (<90 min). Slump exacto de 5.5", sin adición de agua en obra.'
  },
  {
    id: 'REM-89212',
    proveedor: 'Ultracem S.A.S.',
    placa: 'SOB-114',
    conductor: 'Jorge Romero',
    fecha: '2026-10-15',
    horaSalida: '09:00',
    horaLlegada: '09:50',
    tiempoMin: 50,
    volumenM3: 7.0,
    slump: '5.0"',
    temperaturaC: 29.0,
    elemento: 'Zapatas Z1-Z4 y Vigas de Cimentación',
    conforme: true,
    observaciones: 'Descarga con bomba pluma directa sin atascos.'
  },
  {
    id: 'REM-89304',
    proveedor: 'Ultracem S.A.S.',
    placa: 'UYY-302',
    conductor: 'Andrés Morales',
    fecha: '2026-10-24',
    horaSalida: '08:10',
    horaLlegada: '09:05',
    tiempoMin: 55,
    volumenM3: 6.0,
    slump: '5.0"',
    temperaturaC: 28.0,
    elemento: 'Columnas Estructurales Eje 1-A y 2-B',
    conforme: true,
    observaciones: 'Vibrado mecánico continuo por capas de 50 cm.'
  },
  {
    id: 'REM-89455',
    proveedor: 'Ultracem S.A.S.',
    placa: 'TLZ-640',
    conductor: 'Pedro Sarmiento',
    fecha: '2026-11-01',
    horaSalida: '10:00',
    horaLlegada: '10:48',
    tiempoMin: 48,
    volumenM3: 8.5,
    slump: '6.0"',
    temperaturaC: 29.8,
    elemento: 'Losa en Concreto para Metaldeck Mezzanine Nivel 2',
    conforme: true,
    observaciones: 'Vaciado de losa terminado conforme. Curado con antisol posterior.'
  }
];

const calcMinutesDiff = (startHHMM, endHHMM, fallback = 45) => {
  try {
    const [hS, mS] = String(startHHMM || '08:00').split(':').map(Number);
    const [hE, mE] = String(endHHMM || '08:45').split(':').map(Number);
    let diff = hE * 60 + mE - (hS * 60 + mS);
    if (diff < 0) diff += 24 * 60;
    return Number.isFinite(diff) ? diff : fallback;
  } catch {
    return fallback;
  }
};

const mapDemoRemision = (r) => {
  const minDiff = calcMinutesDiff(r.horaSalidaPlanta, r.horaFinDescarga || r.horaLlegadaObra, 67);
  return {
    id: r.numeroRemision || `RMX-${r.id}`,
    proveedor: r.proveedor,
    placa: r.placaMixer,
    conductor: r.conductor,
    fecha: '2026-11-11',
    horaSalida: r.horaSalidaPlanta,
    horaLlegada: r.horaFinDescarga || r.horaLlegadaObra,
    tiempoMin: minDiff,
    volumenM3: Number(r.volumenM3 || 0),
    asentamientoMm: Number(r.asentamientoMm || 125),
    slump: `${(Number(r.asentamientoMm || 125) / 25.4).toFixed(1)}"`,
    temperaturaC: Number(r.temperaturaC || 27.5),
    elemento: r.elementoFundido,
    elemento_en: r.elementoFundido_en,
    conforme: minDiff <= 90,
    observaciones: r.observaciones,
    observaciones_en: r.observaciones_en
  };
};

export default function ModuloMixersRemisiones({ registros = [], proyectoActivo = 'mezzanine', isDemo = false }) {
  const { lang, formatQty, unitLabel, formatTemp } = useAppPreferences();
  const demoMode = isDemo || proyectoActivo === DEMO_SHOWCASE_PROJECT_ID;

  const [remisiones, setRemisiones] = useState([]);
  const [demoRemisiones, setDemoRemisiones] = useState(() => DEMO_REMISIONES_MIXERS.map(mapDemoRemision));
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);
  const [filtroProveedor, setFiltroProveedor] = useState('todos');

  // Formulario nuevo mixer
  const [numeroRemision, setNumeroRemision] = useState('');
  const [proveedor, setProveedor] = useState(demoMode ? 'Northbridge Ready-Mix Plant A' : 'Ultracem S.A.S.');
  const [placa, setPlaca] = useState('');
  const [conductor, setConductor] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [horaSalida, setHoraSalida] = useState('08:00');
  const [horaLlegada, setHoraLlegada] = useState('08:45');
  const [volumenInput, setVolumenInput] = useState('');
  const [slumpInput, setSlumpInput] = useState(lang === 'en' ? '5.5' : '140');
  const [temperaturaInput, setTemperaturaInput] = useState(lang === 'en' ? '83.3' : '28.5');
  const [elemento, setElemento] = useState(
    demoMode
      ? 'Columnas Estructurales Ejes A-B (f\'c=24 MPa)'
      : 'Losa en Concreto para Metaldeck Mezzanine Nivel 2'
  );
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    setProveedor(demoMode ? 'Northbridge Ready-Mix Plant A' : 'Ultracem S.A.S.');
    setElemento(
      demoMode
        ? "Columnas Estructurales Ejes A-B (f'c=24 MPa)"
        : 'Losa en Concreto para Metaldeck Mezzanine Nivel 2'
    );
  }, [demoMode]);

  useEffect(() => {
    setSlumpInput(lang === 'en' ? '5.5' : '140');
    setTemperaturaInput(lang === 'en' ? '83.3' : '28.5');
  }, [lang]);

  useEffect(() => {
    if (demoMode) return;
    try {
      const guardadas = localStorage.getItem('jgm_mixers_remisiones');
      if (guardadas) {
        setRemisiones(JSON.parse(guardadas));
      } else {
        setRemisiones(REMISIONES_INICIALES);
        localStorage.setItem('jgm_mixers_remisiones', JSON.stringify(REMISIONES_INICIALES));
      }
    } catch (e) {
      setRemisiones(REMISIONES_INICIALES);
    }
  }, [demoMode]);

  const activeRemisiones = demoMode ? demoRemisiones : remisiones;

  const guardarRemisiones = (nuevas) => {
    if (demoMode) {
      setDemoRemisiones(nuevas);
      return;
    }
    setRemisiones(nuevas);
    try {
      localStorage.setItem('jgm_mixers_remisiones', JSON.stringify(nuevas));
    } catch (e) {
      console.warn('Error al guardar remisiones:', e);
    }
  };

  const handleCrearRemision = (e) => {
    e.preventDefault();
    const rawVol = parseFloat(volumenInput);
    if (isNaN(rawVol) || rawVol <= 0) {
      alert(
        lang === 'en'
          ? 'Enter a valid concrete volume in yd³.'
          : 'Ingrese un volumen válido en m³.'
      );
      return;
    }

    const volM3 = convertInputToMetric(rawVol, 'm³', lang);
    const minDiff = calcMinutesDiff(horaSalida, horaLlegada, 45);
    const esConforme = minDiff <= 90;

    const rawTemp = parseFloat(temperaturaInput);
    const tempC = Number.isFinite(rawTemp)
      ? lang === 'en'
        ? Number(((rawTemp - 32) / 1.8).toFixed(1))
        : rawTemp
      : 28.5;

    const slumpNum = parseFloat(String(slumpInput).replace(/[^0-9.]/g, ''));
    const slumpMm = Number.isFinite(slumpNum)
      ? lang === 'en'
        ? Math.round(slumpNum * 25.4)
        : Math.round(slumpNum)
      : 140;
    const slumpInchLabel = `${(slumpMm / 25.4).toFixed(1)}"`;

    const nuevaItem = {
      id: numeroRemision.trim() || (demoMode ? `RMX-NB-${Math.floor(4200 + Math.random() * 500)}` : `REM-${Math.floor(10000 + Math.random() * 90000)}`),
      proveedor,
      placa: placa.toUpperCase() || (demoMode ? 'RMX-920' : 'MIX-001'),
      conductor: conductor || (demoMode ? (lang === 'en' ? 'Plant Operator' : 'Operador Planta') : 'Conductor Autorizado'),
      fecha,
      horaSalida,
      horaLlegada,
      tiempoMin: minDiff,
      volumenM3: Number(volM3.toFixed(2)),
      asentamientoMm: slumpMm,
      slump: slumpInchLabel,
      temperaturaC: tempC,
      elemento,
      elemento_en: localizeTerm(elemento, 'en'),
      conforme: esConforme,
      observaciones:
        observaciones ||
        (esConforme
          ? 'Aprobado por supervisión e inspección técnica.'
          : 'Alerta: Tiempo de descarga mayor a 90 min (Riesgo NTC 3318 / ASTM C94).'),
      observaciones_en:
        observaciones ||
        (esConforme
          ? 'Approved at chute inspection (<90 min ASTM C94).'
          : 'Alert: Batch-to-discharge window exceeded 90 min limit (ASTM C94).')
    };

    guardarRemisiones([nuevaItem, ...activeRemisiones]);
    setMostrarModalNuevo(false);
    setNumeroRemision('');
    setPlaca('');
    setVolumenInput('');
    setObservaciones('');
    alert(
      lang === 'en'
        ? `Ticket ${nuevaItem.id} logged successfully!\nVolume: ${rawVol.toFixed(1)} yd³ ready-mix concrete.`
        : `Remisión ${nuevaItem.id} guardada exitosamente!\nVolumen: ${rawVol.toFixed(1)} m³ de concreto premezclado.`
    );
  };

  const handleEliminarRemision = (id) => {
    if (confirm(lang === 'en' ? 'Delete this concrete dispatch ticket?' : '¿Deseas eliminar este registro de remisión?')) {
      const filtradas = activeRemisiones.filter(r => r.id !== id);
      guardarRemisiones(filtradas);
    }
  };

  const formatSlumpDisplay = (r) => {
    if (r.asentamientoMm) {
      return lang === 'en'
        ? `${(Number(r.asentamientoMm) / 25.4).toFixed(1)}"`
        : `${Math.round(Number(r.asentamientoMm))} mm`;
    }
    const parsed = parseFloat(String(r.slump || '').replace(/[^0-9.]/g, ''));
    if (Number.isFinite(parsed)) {
      return lang === 'en'
        ? `${parsed.toFixed(1)}"`
        : `${Math.round(parsed * 25.4)} mm (${parsed.toFixed(1)}")`;
    }
    return r.slump || '—';
  };

  // KPIs
  const kpis = useMemo(() => {
    const totalViajes = activeRemisiones.length;
    const volTotalM3 = activeRemisiones.reduce((acc, curr) => acc + (parseFloat(curr.volumenM3) || 0), 0);
    const tiempoProm = totalViajes > 0
      ? (activeRemisiones.reduce((acc, curr) => acc + (curr.tiempoMin || 45), 0) / totalViajes).toFixed(0)
      : 0;
    const conformes = activeRemisiones.filter(r => r.conforme).length;

    return {
      totalViajes,
      volTotalM3,
      tiempoProm,
      tasaPuntualidad: totalViajes > 0 ? ((conformes / totalViajes) * 100).toFixed(0) : 100
    };
  }, [activeRemisiones]);

  const remisionesFiltradas = useMemo(() => {
    if (filtroProveedor === 'todos') return activeRemisiones;
    return activeRemisiones.filter(r => r.proveedor === filtroProveedor);
  }, [activeRemisiones, filtroProveedor]);

  const supplierOptions = useMemo(() => {
    if (demoMode) {
      return ['Northbridge Ready-Mix Plant A', 'Northbridge Ready-Mix Plant B'];
    }
    return ['Ultracem S.A.S.', 'Argos', 'Cemex', 'Holcim'];
  }, [demoMode]);

  return (
    <div className="space-y-6">

      {/* CABECERA DEL MÓDULO */}
      <div className="rounded-2xl steel-card p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {lang === 'en' ? 'Ready-Mix Concrete Dispatch & Ticket Log' : 'Control de Remisiones de Concreto & Mixers'}
              </h2>
              <span className="rounded-full bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 border border-amber-200">
                {lang === 'en' ? 'ASTM C94 / NTC 3318' : 'NTC 3318 / ASTM C94'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'en'
                ? 'Batch ticket verification & discharge inspection • Setting window, slump & mix temperature QA'
                : 'Registro en báscula y recepción en boca de descarga • Control de fraguado, temperatura y slump'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setMostrarModalNuevo(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-2 text-xs font-bold transition shadow-sm"
          >
            <Plus className="h-4 w-4" /> {lang === 'en' ? 'Log Mixer Ticket' : 'Registrar Remisión de Mixer'}
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 text-xs font-bold transition"
          >
            <Printer className="h-4 w-4" /> {lang === 'en' ? 'Print Batch Log' : 'Imprimir Acta de Mixers'}
          </button>
        </div>
      </div>

      {/* 4 KPIS DE CONCRETO */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl steel-card p-4">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {lang === 'en' ? 'Total Volume Delivered' : 'Volumen Total Recibido'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 flex items-baseline gap-1.5">
            {formatQty(kpis.volTotalM3, 'm³', 1)}
            <span className="text-xs font-semibold text-slate-400">{unitLabel('m³')}</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {lang === 'en' ? 'Ready-mix poured on site' : 'Premezclado puesto en obra'}
          </span>
        </div>

        <div className="rounded-xl steel-card p-4">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {lang === 'en' ? 'Dispatched Mixer Loads' : 'Viajes de Mixer Despachados'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5">
            {kpis.totalViajes}
            <span className="text-xs font-semibold text-slate-400">{lang === 'en' ? 'trucks' : 'camiones'}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
            {lang === 'en'
              ? `Avg. drum capacity: ${formatQty(7.0, 'm³', 1)} yd³`
              : 'Capacidad media: 7.0 m³'}
          </span>
        </div>

        <div className="rounded-xl steel-card p-4">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {lang === 'en' ? 'Avg. Cycle Window' : 'Tiempo Promedio de Viaje'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5">
            {kpis.tiempoProm}
            <span className="text-xs font-semibold text-slate-400">min</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
            {lang === 'en' ? 'ASTM C94 limit: 90 minutes' : 'Límite crítico: 90 minutos'}
          </span>
        </div>

        <div className="rounded-xl steel-card p-4">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {lang === 'en' ? 'Technical Acceptance Rate' : 'Tasa de Aceptación Técnica'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 flex items-baseline gap-1.5">
            {kpis.tasaPuntualidad}%
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {lang === 'en' ? 'Zero rejected loads / pre-set' : 'Sin rechazos ni pre-fraguado'}
          </span>
        </div>
      </div>

      {/* TABLA DE REMISIONES */}
      <div className="rounded-2xl steel-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-amber-600" />
              {lang === 'en' ? `Daily Mixer Receiving Ledger (${remisionesFiltradas.length})` : `Libro Diario de Recepción de Mixers (${remisionesFiltradas.length})`}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'en' ? 'Batch plant ticket verification, discharge time, mix temp & slump' : 'Inspección de tiquetes de báscula, hora, temperatura y asentamiento'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filtroProveedor}
              onChange={(e) => setFiltroProveedor(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="todos">{lang === 'en' ? 'All Batch Plants' : 'Todas las Concreteras'}</option>
              {supplierOptions.map((sup) => (
                <option key={sup} value={sup}>{sup}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLA RESPONSIVA */}
        <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs text-slate-800 min-w-[680px]">
            <thead className="bg-slate-100 text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">{lang === 'en' ? 'Ticket / Batch Plant' : 'Remisión / Proveedor'}</th>
                <th className="py-2.5 px-3">{lang === 'en' ? 'Truck / Driver' : 'Mixer / Conductor'}</th>
                <th className="py-2.5 px-3">{lang === 'en' ? 'Poured Element' : 'Elemento Vaciado'}</th>
                <th className="py-2.5 px-2 text-center">{lang === 'en' ? 'Schedule / Cycle' : 'Horario / Viaje'}</th>
                <th className="py-2.5 px-3 text-right">{lang === 'en' ? 'Volume' : 'Volumen'}</th>
                <th className="py-2.5 px-2 text-center">{lang === 'en' ? 'Slump / Temp' : 'Slump / Temp'}</th>
                <th className="py-2.5 px-2 text-center">{lang === 'en' ? 'Status' : 'Estado'}</th>
                <th className="py-2.5 px-2 text-center no-print">{lang === 'en' ? 'Action' : 'Acción'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {remisionesFiltradas.map((r) => {
                const dispElem = lang === 'en' ? (r.elemento_en || localizeTerm(r.elemento, 'en')) : r.elemento;
                const dispObs = lang === 'en' ? (r.observaciones_en || localizeTerm(r.observaciones, 'en')) : r.observaciones;
                return (
                  <tr key={r.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3">
                      <strong className="text-slate-900 block font-mono">{r.id}</strong>
                      <span className="text-[10px] text-slate-500">{r.proveedor} • {r.fecha}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-800 block">{lang === 'en' ? 'Unit:' : 'Placa:'} {r.placa}</span>
                      <span className="text-[10px] text-slate-400">{r.conductor}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800 block leading-snug">{dispElem}</span>
                      <span className="text-[10px] text-slate-400">{dispObs}</span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="text-[11px] font-mono text-slate-700">
                        {r.horaSalida} → {r.horaLlegada}
                      </div>
                      <span className={`text-[10px] font-bold ${r.tiempoMin > 90 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {r.tiempoMin} {lang === 'en' ? 'min total' : 'min transcurridos'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-black text-amber-700 font-mono text-sm">
                      {formatQty(r.volumenM3, 'm³', 1)} {unitLabel('m³')}
                    </td>
                    <td className="py-3 px-2 text-center font-bold">
                      <span className="inline-block rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-amber-900 font-mono text-[11px]">
                        {formatSlumpDisplay(r)}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                        {formatTemp(r.temperaturaC, 1)}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      {r.conforme ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" /> {lang === 'en' ? 'Compliant' : 'Conforme'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600">
                          <AlertTriangle className="h-3.5 w-3.5" /> &gt;90 min
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center no-print">
                      <button
                        onClick={() => handleEliminarRemision(r.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                        title={lang === 'en' ? 'Delete ticket' : 'Eliminar remisión'}
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

      {/* MODAL NUEVA REMISIÓN */}
      {mostrarModalNuevo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl steel-card p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Truck className="h-5 w-5 text-amber-600" />
                {lang === 'en' ? 'Log Ready-Mix Truck Ticket' : 'Registrar Recepción de Concreto Mixer'}
              </h3>
              <button
                onClick={() => setMostrarModalNuevo(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
                aria-label={lang === 'en' ? 'Close' : 'Cerrar'}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCrearRemision} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {lang === 'en' ? 'Ticket Number' : 'Nº de Remisión'}
                  </label>
                  <input
                    type="text"
                    value={numeroRemision}
                    onChange={(e) => setNumeroRemision(e.target.value)}
                    placeholder={demoMode ? 'e.g. RMX-NB-4210' : 'Ej. REM-89510'}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {lang === 'en' ? 'Supplier / Batch Plant' : 'Proveedor / Planta'}
                  </label>
                  <select
                    value={proveedor}
                    onChange={(e) => setProveedor(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  >
                    {supplierOptions.map((sup) => (
                      <option key={sup} value={sup}>{sup}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {lang === 'en' ? 'Mixer Truck ID' : 'Placa Camión Mixer'}
                  </label>
                  <input
                    type="text"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    placeholder={demoMode ? 'e.g. RMX-908' : 'Ej. WBF-892'}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {lang === 'en' ? 'Driver / Operator' : 'Conductor / Operador'}
                  </label>
                  <input
                    type="text"
                    value={conductor}
                    onChange={(e) => setConductor(e.target.value)}
                    placeholder={demoMode ? (lang === 'en' ? 'e.g. Plant Operator 04' : 'Ej. Operador Planta 04') : 'Ej. Operador Asignado'}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">{lang === 'en' ? 'Date' : 'Fecha'}</label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">{lang === 'en' ? 'Batch Dispatch' : 'Hora Salida Planta'}</label>
                  <input
                    type="time"
                    value={horaSalida}
                    onChange={(e) => setHoraSalida(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">{lang === 'en' ? 'Discharge Complete' : 'Hora Llegada Obra'}</label>
                  <input
                    type="time"
                    value={horaLlegada}
                    onChange={(e) => setHoraLlegada(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {lang === 'en' ? 'Volume (yd³)' : 'Volumen Remitido (m³)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    value={volumenInput}
                    onChange={(e) => setVolumenInput(e.target.value)}
                    placeholder={lang === 'en' ? 'e.g. 10.0' : 'Ej. 7.5'}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-black text-amber-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {lang === 'en' ? 'Slump (in)' : 'Slump (mm)'}
                  </label>
                  <input
                    type="text"
                    value={slumpInput}
                    onChange={(e) => setSlumpInput(e.target.value)}
                    placeholder={lang === 'en' ? 'e.g. 5.5' : 'Ej. 140'}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {lang === 'en' ? 'Mix Temp (°F)' : 'Temperatura (°C)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={temperaturaInput}
                    onChange={(e) => setTemperaturaInput(e.target.value)}
                    placeholder={lang === 'en' ? '83.3' : '28.5'}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {lang === 'en' ? 'Destination Structural Element' : 'Elemento Destino de Vaciado'}
                </label>
                <select
                  value={elemento}
                  onChange={(e) => setElemento(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800"
                >
                  {demoMode ? (
                    <>
                      <option value="Columnas Estructurales Ejes A-B (f'c=24 MPa)">
                        {lang === 'en' ? 'Structural Frame Columns Grid A-B (3,500 PSI)' : "Columnas Estructurales Ejes A-B (f'c=24 MPa)"}
                      </option>
                      <option value="Zapatas y Vigas de Cimentación Z-1 a Z-6">
                        {lang === 'en' ? 'Spread Footings F-1 to F-6 & Grade Beams (3,000 PSI)' : 'Zapatas y Vigas de Cimentación Z-1 a Z-6'}
                      </option>
                      <option value="Plantilla de Concreto e=7cm (Sub-slab)">
                        {lang === 'en' ? 'Leveling Concrete Sub-Slab t=2.75"' : 'Plantilla de Concreto e=7cm'}
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

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {lang === 'en' ? 'Discharge Field Notes' : 'Observaciones de Descarga'}
                </label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={2}
                  placeholder={lang === 'en' ? 'e.g. Continuous boom pump pour, zero site water added...' : 'Ej. Bombeo continuo sin agua adicional añadida en obra...'}
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
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-500 text-white shadow-sm"
                >
                  {lang === 'en' ? 'Save Mixer Ticket' : 'Guardar Remisión'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
