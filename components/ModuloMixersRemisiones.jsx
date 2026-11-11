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
  Timer
} from 'lucide-react';

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

export default function ModuloMixersRemisiones({ registros = [] }) {
  const [remisiones, setRemisiones] = useState([]);
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);
  const [filtroProveedor, setFiltroProveedor] = useState('todos');

  // Formulario nuevo mixer
  const [numeroRemision, setNumeroRemision] = useState('');
  const [proveedor, setProveedor] = useState('Ultracem S.A.S.');
  const [placa, setPlaca] = useState('');
  const [conductor, setConductor] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [horaSalida, setHoraSalida] = useState('08:00');
  const [horaLlegada, setHoraLlegada] = useState('08:45');
  const [volumenM3, setVolumenM3] = useState('');
  const [slump, setSlump] = useState('5.5"');
  const [temperaturaC, setTemperaturaC] = useState('28.5');
  const [elemento, setElemento] = useState('Losa en Concreto para Metaldeck Mezzanine Nivel 2');
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
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
  }, []);

  const guardarRemisiones = (nuevas) => {
    setRemisiones(nuevas);
    try {
      localStorage.setItem('jgm_mixers_remisiones', JSON.stringify(nuevas));
    } catch (e) {
      console.warn('Error al guardar remisiones:', e);
    }
  };

  const handleCrearRemision = (e) => {
    e.preventDefault();
    const vol = parseFloat(volumenM3);
    if (isNaN(vol) || vol <= 0) {
      alert('⚠️ Ingrese un volumen válido en m³.');
      return;
    }

    // Calcular minutos transcurridos
    let minDiff = 45;
    try {
      const [hS, mS] = horaSalida.split(':').map(Number);
      const [hL, mL] = horaLlegada.split(':').map(Number);
      minDiff = (hL * 60 + mL) - (hS * 60 + mS);
      if (minDiff < 0) minDiff += 24 * 60;
    } catch (err) {}

    const esConforme = minDiff <= 90;

    const nuevaItem = {
      id: numeroRemision.trim() || `REM-${Math.floor(10000 + Math.random() * 90000)}`,
      proveedor,
      placa: placa.toUpperCase() || 'MIX-001',
      conductor: conductor || 'Conductor Autorizado',
      fecha,
      horaSalida,
      horaLlegada,
      tiempoMin: minDiff,
      volumenM3: vol,
      slump,
      temperaturaC: parseFloat(temperaturaC) || 28.5,
      elemento,
      conforme: esConforme,
      observaciones: observaciones || (esConforme ? 'Aprobado por residente e interventoría.' : 'Alerta: Tiempo de viaje mayor a 90 min (Riesgo NTC 3318).')
    };

    guardarRemisiones([nuevaItem, ...remisiones]);
    setMostrarModalNuevo(false);
    setNumeroRemision('');
    setPlaca('');
    setVolumenM3('');
    setObservaciones('');
    alert(`🚚 ¡Remisión ${nuevaItem.id} guardada exitosamente!\nVolumen: ${vol} m³ de concreto premezclado.`);
  };

  const handleEliminarRemision = (id) => {
    if (confirm('¿Deseas eliminar este registro de remisión?')) {
      const filtradas = remisiones.filter(r => r.id !== id);
      guardarRemisiones(filtradas);
    }
  };

  // KPIs
  const kpis = useMemo(() => {
    const totalViajes = remisiones.length;
    const volTotal = remisiones.reduce((acc, curr) => acc + (parseFloat(curr.volumenM3) || 0), 0);
    const tiempoProm = totalViajes > 0
      ? (remisiones.reduce((acc, curr) => acc + (curr.tiempoMin || 45), 0) / totalViajes).toFixed(0)
      : 0;
    const conformes = remisiones.filter(r => r.conforme).length;

    return {
      totalViajes,
      volTotal: volTotal.toFixed(1),
      tiempoProm,
      tasaPuntualidad: totalViajes > 0 ? ((conformes / totalViajes) * 100).toFixed(0) : 100
    };
  }, [remisiones]);

  const remisionesFiltradas = useMemo(() => {
    if (filtroProveedor === 'todos') return remisiones;
    return remisiones.filter(r => r.proveedor === filtroProveedor);
  }, [remisiones, filtroProveedor]);

  return (
    <div className="space-y-6">

      {/* CABECERA DEL MÓDULO */}
      <div className="rounded-2xl steel-card p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Control de Remisiones de Concreto & Mixers
              </h2>
              <span className="rounded-full bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 border border-amber-200">
                NTC 3318 / ASTM C94
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Registro en báscula y recepción en boca de descarga • Control de fraguado y slump
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setMostrarModalNuevo(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-2 text-xs font-bold transition shadow-sm"
          >
            <Plus className="h-4 w-4" /> Registrar Remisión de Mixer
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 text-xs font-bold transition"
          >
            <Printer className="h-4 w-4" /> Imprimir Acta de Mixers
          </button>
        </div>
      </div>

      {/* 4 KPIS DE CONCRETO */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl steel-card p-4">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Volumen Total Recibido
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 flex items-baseline gap-1.5">
            {kpis.volTotal}
            <span className="text-xs font-semibold text-slate-400">m³</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Premezclado puesto en obra
          </span>
        </div>

        <div className="rounded-xl steel-card p-4">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Viajes de Mixer Despachados
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5">
            {kpis.totalViajes}
            <span className="text-xs font-semibold text-slate-400">camiones</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
            Capacidad media: 7.0 m³
          </span>
        </div>

        <div className="rounded-xl steel-card p-4">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Tiempo Promedio de Viaje
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5">
            {kpis.tiempoProm}
            <span className="text-xs font-semibold text-slate-400">min</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
            Límite crítico: 90 minutos
          </span>
        </div>

        <div className="rounded-xl steel-card p-4">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Tasa de Aceptación Técnica
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 flex items-baseline gap-1.5">
            {kpis.tasaPuntualidad}%
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Sin rechazos ni pre-fraguado
          </span>
        </div>
      </div>

      {/* TABLA DE REMISIONES */}
      <div className="rounded-2xl steel-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              📋 Libro Diario de Recepción de Mixers ({remisionesFiltradas.length})
            </h3>
            <p className="text-xs text-slate-500">Inspección de tiquetes de báscula, hora y asentamiento</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filtroProveedor}
              onChange={(e) => setFiltroProveedor(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="todos">Todas las Concreteras</option>
              <option value="Ultracem S.A.S.">Ultracem S.A.S.</option>
              <option value="Argos">Argos</option>
              <option value="Cemex">Cemex</option>
            </select>
          </div>
        </div>

        {/* TABLA RESPONSIVA */}
        <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs text-slate-800 min-w-[680px]">
            <thead className="bg-slate-100 text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Remisión / Proveedor</th>
                <th className="py-2.5 px-3">Mixer / Conductor</th>
                <th className="py-2.5 px-3">Elemento Vaciado</th>
                <th className="py-2.5 px-2 text-center">Horario / Viaje</th>
                <th className="py-2.5 px-3 text-right">Volumen</th>
                <th className="py-2.5 px-2 text-center">Slump</th>
                <th className="py-2.5 px-2 text-center">Estado</th>
                <th className="py-2.5 px-2 text-center no-print">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {remisionesFiltradas.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3">
                    <strong className="text-slate-900 block font-mono">{r.id}</strong>
                    <span className="text-[10px] text-slate-500">{r.proveedor} • {r.fecha}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-800 block">Placa: {r.placa}</span>
                    <span className="text-[10px] text-slate-400">{r.conductor}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800 block leading-snug">{r.elemento}</span>
                    <span className="text-[10px] text-slate-400">{r.observaciones}</span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="text-[11px] font-mono text-slate-700">
                      {r.horaSalida} → {r.horaLlegada}
                    </div>
                    <span className={`text-[10px] font-bold ${r.tiempoMin > 90 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {r.tiempoMin} min transcurridos
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-black text-amber-700 font-mono text-sm">
                    {r.volumenM3.toFixed(1)} m³
                  </td>
                  <td className="py-3 px-2 text-center font-bold">
                    <span className="inline-block rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-amber-900 font-mono text-[11px]">
                      {r.slump}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    {r.conforme ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Conforme
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
                      title="Eliminar remisión"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
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
                Registrar Recepción de Concreto Mixer
              </h3>
              <button
                onClick={() => setMostrarModalNuevo(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCrearRemision} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nº de Remisión</label>
                  <input
                    type="text"
                    value={numeroRemision}
                    onChange={(e) => setNumeroRemision(e.target.value)}
                    placeholder="Ej. REM-89510"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Proveedor / Planta</label>
                  <select
                    value={proveedor}
                    onChange={(e) => setProveedor(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  >
                    <option value="Ultracem S.A.S.">Ultracem S.A.S.</option>
                    <option value="Argos">Argos</option>
                    <option value="Cemex">Cemex</option>
                    <option value="Holcim">Holcim</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Placa Camión Mixer</label>
                  <input
                    type="text"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    placeholder="Ej. WBF-892"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Conductor / Operador</label>
                  <input
                    type="text"
                    value={conductor}
                    onChange={(e) => setConductor(e.target.value)}
                    placeholder="Ej. Carlos Mendoza"
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Hora Salida Planta</label>
                  <input
                    type="time"
                    value={horaSalida}
                    onChange={(e) => setHoraSalida(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Hora Llegada Obra</label>
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
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Volumen Remitido (m³)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    value={volumenM3}
                    onChange={(e) => setVolumenM3(e.target.value)}
                    placeholder="Ej. 7.5"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-black text-amber-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Slump de Cono</label>
                  <input
                    type="text"
                    value={slump}
                    onChange={(e) => setSlump(e.target.value)}
                    placeholder='Ej. 5.5"'
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Temperatura (°C)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={temperaturaC}
                    onChange={(e) => setTemperaturaC(e.target.value)}
                    placeholder="28.5"
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Elemento Destino de Vaciado</label>
                <select
                  value={elemento}
                  onChange={(e) => setElemento(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800"
                >
                  <option value="Losa en Concreto para Metaldeck Mezzanine Nivel 2">Losa en Concreto para Metaldeck Mezzanine Nivel 2</option>
                  <option value="Zapatas Z1-Z4 y Vigas de Cimentación">Zapatas Z1-Z4 y Vigas de Cimentación</option>
                  <option value="Columnas Estructurales Ejes A-C">Columnas Estructurales Ejes A-C</option>
                  <option value="Vigas Aéreas y de Amarre">Vigas Aéreas y de Amarre</option>
                  <option value="Plantilla de Concreto Pobre">Plantilla de Concreto Pobre</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Observaciones de Descarga</label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={2}
                  placeholder="Ej. Bombeo continuo sin agua adicional añadida en obra..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMostrarModalNuevo(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-500 text-white shadow-sm"
                >
                  Guardar Remisión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
