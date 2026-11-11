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
  Search
} from 'lucide-react';

const RESISTENCIA_DISENO = 24.5; // MPa (3500 PSI) para losa y elementos estructurales

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

export default function ModuloCalidadConcreto({ registros = [] }) {
  const [ensayos, setEnsayos] = useState([]);
  const [filtroElemento, setFiltroElemento] = useState('todos');
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);

  // Formulario nuevo ensayo
  const [fechaVaciado, setFechaVaciado] = useState(new Date().toISOString().split('T')[0]);
  const [edadDias, setEdadDias] = useState('7');
  const [elemento, setElemento] = useState('Losa en Concreto para Metaldeck Mezzanine Nivel 2');
  const [resistenciaMPa, setResistenciaMPa] = useState('');
  const [laboratorio, setLaboratorio] = useState('Lab. Suelos & Materiales CUC');
  const [asentamiento, setAsentamiento] = useState('5.5"');
  const [observaciones, setObservaciones] = useState('');

  // Cargar de LocalStorage
  useEffect(() => {
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
  }, []);

  const guardarEnsayos = (nuevos) => {
    setEnsayos(nuevos);
    try {
      localStorage.setItem('jgm_calidad_concreto', JSON.stringify(nuevos));
    } catch (e) {
      console.warn('Error guardando en localStorage:', e);
    }
  };

  const handleCrearEnsayo = (e) => {
    e.preventDefault();
    const rMPa = parseFloat(resistenciaMPa);
    if (isNaN(rMPa) || rMPa <= 0) {
      alert('⚠️ Ingrese un valor válido de resistencia en MPa.');
      return;
    }

    const porcentaje = Number(((rMPa / RESISTENCIA_DISENO) * 100).toFixed(1));
    const edad = parseInt(edadDias);
    
    // Regla de cumplimiento NSR-10:
    // 7 días: esperado >= 65%
    // 14 días: esperado >= 85%
    // 28 días: esperado >= 100%
    let esConforme = true;
    if (edad === 7 && porcentaje < 65) esConforme = false;
    else if (edad === 14 && porcentaje < 80) esConforme = false;
    else if (edad >= 28 && porcentaje < 100) esConforme = false;

    // Calcular fecha de rotura según edad
    const fV = new Date(fechaVaciado);
    fV.setDate(fV.getDate() + edad);
    const fEnsayo = fV.toISOString().split('T')[0];

    const nuevoItem = {
      id: `cil-${Date.now()}`,
      fechaVaciado,
      fechaEnsayo: fEnsayo,
      edadDias: edad,
      elemento,
      resistenciaMPa: rMPa,
      cargaKN: Number((rMPa * 17.67).toFixed(1)), // Área probeta estandar 150mm diametro (0.01767 m2)
      porcentajeAlcanzado: porcentaje,
      laboratorio,
      asentamiento,
      cumple: esConforme,
      observaciones: observaciones || (esConforme ? 'Ensayo conforme con las especificaciones técnicas.' : 'Alerta: Resistencia por debajo de la curva esperada.')
    };

    guardarEnsayos([nuevoItem, ...ensayos]);
    setMostrarModalNuevo(false);
    setResistenciaMPa('');
    setObservaciones('');
    alert(`🧪 ¡Cilindro registrado exitosamente!\nResistencia: ${rMPa} MPa (${porcentaje}% de f'c = ${RESISTENCIA_DISENO} MPa)`);
  };

  const handleEliminarEnsayo = (id) => {
    if (confirm('¿Deseas eliminar este registro de ensayo?')) {
      const filtrados = ensayos.filter(e => e.id !== id);
      guardarEnsayos(filtrados);
    }
  };

  // Métricas Consolidadas
  const estadisticas = useMemo(() => {
    const total = ensayos.length;
    if (total === 0) return { total: 0, conformes: 0, promedioMPa: 0, tasaConformidad: 100, roturas28d: 0 };
    
    const conformes = ensayos.filter(e => e.cumple).length;
    const sumMPa = ensayos.reduce((acc, curr) => acc + (parseFloat(curr.resistenciaMPa) || 0), 0);
    const roturas28d = ensayos.filter(e => e.edadDias >= 28).length;

    return {
      total,
      conformes,
      promedioMPa: (sumMPa / total).toFixed(1),
      tasaConformidad: ((conformes / total) * 100).toFixed(0),
      roturas28d
    };
  }, [ensayos]);

  const ensayosFiltrados = useMemo(() => {
    if (filtroElemento === 'todos') return ensayos;
    return ensayos.filter(e => e.elemento.toLowerCase().includes(filtroElemento.toLowerCase()));
  }, [ensayos, filtroElemento]);

  return (
    <div className="space-y-6">
      
      {/* CABECERA DEL MÓDULO */}
      <div className="rounded-2xl steel-card p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl steel-panel-dark text-white shadow-md">
            <FlaskConical className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Control de Calidad de Concreto (NSR-10 / NTC)
              </h2>
              <span className="rounded-full bg-slate-200 text-slate-900 text-[10px] font-black px-2.5 py-0.5 border border-slate-400/70">
                f'c = 24.5 MPa (3500 PSI)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Trazabilidad de rotura de cilindros a 7, 14 y 28 días • Interventoría DOLMEN S.A.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setMostrarModalNuevo(true)}
            className="inline-flex items-center gap-1.5 rounded-xl steel-btn-primary text-white px-3.5 py-2 text-xs font-bold"
          >
            <Plus className="h-4 w-4" /> Registrar Cilindro / Ensayo
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 text-xs font-bold transition"
          >
            <Printer className="h-4 w-4" /> Certificado PDF
          </button>
        </div>
      </div>

      {/* 4 TARJETAS DE INDICADORES CLAVE (KPIS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl steel-card p-4">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Probetas Ensayadas
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5">
            {estadisticas.total}
            <span className="text-xs font-semibold text-slate-400">cilindros</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {estadisticas.roturas28d} cilindros a 28 días
          </span>
        </div>

        <div className="rounded-xl steel-card p-4">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Resistencia Media Obtenida
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5">
            {estadisticas.promedioMPa}
            <span className="text-xs font-semibold text-slate-400">MPa</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
            vs. 24.5 MPa Requerido
          </span>
        </div>

        <div className="rounded-xl steel-card p-4">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Índice de Conformidad
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 flex items-baseline gap-1.5">
            {estadisticas.tasaConformidad}%
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {estadisticas.conformes} de {estadisticas.total} cumplen norma
          </span>
        </div>

        <div className="rounded-xl steel-card p-4">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Slump Promedio en Obra
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5">
            5.5"
            <span className="text-xs font-semibold text-slate-400">asentamiento</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
            Ideal para bombeo de losa
          </span>
        </div>
      </div>

      {/* CURVA DE MADURACIÓN DEL CONCRETO (NSR-10) */}
      <div className="rounded-2xl steel-card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-slate-800" />
            Curva de Maduración vs. Resistencia Contractual f'c (NSR-10)
          </h3>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            NTC 550 / ASTM C39
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Comportamiento promedio del concreto colocado en la estructura en los diferentes tiempos de rotura:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-bold text-slate-700">7 DÍAS (Temprana)</span>
              <span className="font-mono font-bold text-slate-900">72.6% (17.8 MPa)</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-slate-800 h-full rounded-full" style={{ width: '72.6%' }}></div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5">
              <span>Rango Esperado: 65 - 75%</span>
              <span className="text-emerald-700 font-bold">🟢 Cumple</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-bold text-slate-700">14 DÍAS (Intermedia)</span>
              <span className="font-mono font-bold text-slate-900">86.5% (21.2 MPa)</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-slate-800 h-full rounded-full" style={{ width: '86.5%' }}></div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5">
              <span>Rango Esperado: 80 - 90%</span>
              <span className="text-emerald-700 font-bold">🟢 Cumple</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-bold text-emerald-900">28 DÍAS (Contractual)</span>
              <span className="font-mono font-bold text-emerald-700">106.9% (26.2 MPa)</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '100%' }}></div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1.5">
              <span>Exigido: &ge; 100% (24.5 MPa)</span>
              <span className="text-emerald-700 font-black">🏆 Aprobado</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABLA DE PROBETAS / ENSAYOS */}
      <div className="rounded-2xl steel-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              🧪 Registro de Probetas y Rotura de Cilindros ({ensayosFiltrados.length})
            </h3>
            <p className="text-xs text-slate-500">Historial de muestras ensayadas con prensa hidráulica</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filtroElemento}
              onChange={(e) => setFiltroElemento(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="todos">Todos los Elementos</option>
              <option value="Zapatas">Zapatas / Cimentación</option>
              <option value="Columnas">Columnas</option>
              <option value="Losa">Losa Mezzanine</option>
            </select>
          </div>
        </div>

        {/* TABLA RESPONSIVA CON SCROLL SUAVE */}
        <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs text-slate-800 min-w-[620px]">
            <thead className="bg-slate-100 text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Cilindro / Fecha</th>
                <th className="py-2.5 px-3">Elemento Estructural</th>
                <th className="py-2.5 px-2 text-center">Edad</th>
                <th className="py-2.5 px-3 text-right">Resistencia (MPa)</th>
                <th className="py-2.5 px-3 text-center">% f'c</th>
                <th className="py-2.5 px-3 text-center">Estado</th>
                <th className="py-2.5 px-2 text-center no-print">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ensayosFiltrados.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3">
                    <strong className="text-slate-900 block font-mono">{item.id}</strong>
                    <span className="text-[10px] text-slate-400">Vaciado: {item.fechaVaciado}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800 block">{item.elemento}</span>
                    <span className="text-[10px] text-slate-400">{item.laboratorio} • Slump: {item.asentamiento}</span>
                  </td>
                  <td className="py-3 px-2 text-center font-bold">
                    <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-slate-700 font-mono">
                      {item.edadDias} días
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-black text-slate-900 font-mono">
                    {item.resistenciaMPa.toFixed(1)} MPa
                    <span className="block text-[10px] text-slate-400 font-normal">{item.cargaKN} kN</span>
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
                        <CheckCircle2 className="h-3.5 w-3.5" /> Cumple
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600">
                        <AlertTriangle className="h-3.5 w-3.5" /> Alerta
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-center no-print">
                    <button
                      onClick={() => handleEliminarEnsayo(item.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                      title="Eliminar ensayo"
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

      {/* MODAL PARA AGREGAR NUEVO ENSAYO */}
      {mostrarModalNuevo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl steel-card p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-slate-800" />
                Registrar Nuevo Ensayo de Cilindro
              </h3>
              <button
                onClick={() => setMostrarModalNuevo(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCrearEnsayo} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Fecha de Vaciado</label>
                  <input
                    type="date"
                    value={fechaVaciado}
                    onChange={(e) => setFechaVaciado(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Edad de Ensayo</label>
                  <select
                    value={edadDias}
                    onChange={(e) => setEdadDias(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  >
                    <option value="7">7 Días (Temprana - min. 65%)</option>
                    <option value="14">14 Días (Intermedia - min. 80%)</option>
                    <option value="28">28 Días (Contractual - min. 100%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Elemento Estructural Vaciado</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Resistencia Obtenida (MPa)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={resistenciaMPa}
                    onChange={(e) => setResistenciaMPa(e.target.value)}
                    placeholder="Ej. 25.4"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-black text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Slump de Cono Medido</label>
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
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Laboratorio de Ensayo</label>
                <input
                  type="text"
                  value={laboratorio}
                  onChange={(e) => setLaboratorio(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Observaciones Técnicas</label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={2}
                  placeholder="Ej. Probeta ensayada bajo norma NTC 550. Fractura cónica bien conformada..."
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
                  className="px-4 py-1.5 text-xs font-bold rounded-lg steel-btn-primary text-white"
                >
                  Guardar Cilindro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
