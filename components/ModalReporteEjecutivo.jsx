'use client';

import React, { useState, useMemo } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Calendar, 
  FileText, 
  HardHat, 
  CheckCircle2, 
  Filter, 
  Building2, 
  Camera, 
  TrendingUp 
} from 'lucide-react';

export default function ModalReporteEjecutivo({ registros = [], evidenciasFotos = {}, onClose }) {
  const [periodoFiltro, setPeriodoFiltro] = useState('semana'); // 'semana', 'quincena', 'mes', 'todos'
  const [frenteFiltro, setFrenteFiltro] = useState('todos');

  // Filtrado de registros según el período seleccionado
  const registrosFiltrados = useMemo(() => {
    const ahora = new Date();
    const hoyStr = ahora.toISOString().split('T')[0];

    return registros.filter((reg) => {
      if (!reg.fecha) return true;
      const fReg = new Date(reg.fecha);
      const diffDias = Math.floor((ahora - fReg) / (1000 * 60 * 60 * 24));

      let matchPeriodo = true;
      if (periodoFiltro === 'semana') matchPeriodo = diffDias <= 7;
      else if (periodoFiltro === 'quincena') matchPeriodo = diffDias <= 15;
      else if (periodoFiltro === 'mes') matchPeriodo = diffDias <= 30;

      const matchFrente = frenteFiltro === 'todos' || (reg.ubicacion && reg.ubicacion === frenteFiltro);

      return matchPeriodo && matchFrente;
    });
  }, [registros, periodoFiltro, frenteFiltro]);

  // Resumen consolidado por actividad
  const consolidadoActividades = useMemo(() => {
    const mapa = {};
    registrosFiltrados.forEach((r) => {
      const act = r.actividad;
      const cant = parseFloat(r.cantidad) || 0;
      if (!mapa[act]) {
        mapa[act] = {
          actividad: act,
          unidad: r.unidad || 'und',
          cantidadPeriodo: 0,
          conteo: 0
        };
      }
      mapa[act].cantidadPeriodo += cant;
      mapa[act].conteo += 1;
    });
    return Object.values(mapa);
  }, [registrosFiltrados]);

  // Fotos de evidencia del período
  const fotosPeriodo = useMemo(() => {
    const fotos = [];
    registrosFiltrados.forEach((reg) => {
      // Buscar foto en el registro o en el mapa de evidencias local
      const fotoData = reg.foto || evidenciasFotos[reg.id] || evidenciasFotos[reg.created_at];
      if (fotoData) {
        fotos.push({
          ...reg,
          fotoSrc: typeof fotoData === 'string' ? fotoData : fotoData.foto
        });
      }
    });
    return fotos;
  }, [registrosFiltrados, evidenciasFotos]);

  const imprimirPDF = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-2 md:p-6 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[95vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* BARRA SUPERIOR DE CONTROLES (NO IMPRIMIBLE) */}
        <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                Generador de Informe Ejecutivo y Acta de Avance
              </h3>
              <p className="text-[11px] text-slate-400">
                Formato Oficial para Interventoría DOLMEN S.A. • INGENDES S.A.S.
              </p>
            </div>
          </div>

          {/* SELECTORES DE PERÍODO */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={periodoFiltro}
              onChange={(e) => setPeriodoFiltro(e.target.value)}
              className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="semana">Últimos 7 días (Semanal)</option>
              <option value="quincena">Últimos 15 días (Quincenal)</option>
              <option value="mes">Últimos 30 días (Mensual)</option>
              <option value="todos">Todo el Histórico</option>
            </select>

            <button
              onClick={imprimirPDF}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white transition shadow-sm"
            >
              <Printer className="h-4 w-4" /> Imprimir / Guardar en PDF
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ÁREA DE DOCUMENTO IMPRIMIBLE (DOCUMENTO OFICIAL) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white text-slate-900 printable-document">
          
          {/* MEMBRETE OFICIAL DE OBRA */}
          <div className="border-b-2 border-slate-900 pb-5 mb-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1 rounded bg-slate-900 text-white inline-block">
                    <HardHat className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-black text-slate-900 tracking-tight">JGM ConTech</span>
                </div>
                <h1 className="text-base font-bold text-slate-800 uppercase">
                  Informe Ejecutivo de Avance de Obra y Registro Fotográfico
                </h1>
                <p className="text-xs text-slate-500">
                  Período Evaluado: <strong>{periodoFiltro === 'semana' ? 'Últimos 7 Días' : periodoFiltro === 'quincena' ? 'Últimos 15 Días' : periodoFiltro === 'mes' ? 'Últimos 30 Días' : 'Consolidado General'}</strong>
                </p>
              </div>

              <div className="text-right text-xs space-y-0.5">
                <div className="font-mono font-bold text-slate-900">ACTA INF-{new Date().getFullYear()}-{String(registrosFiltrados.length).padStart(3, '0')}</div>
                <div className="text-slate-500">Fecha de Emisión: <strong>{new Date().toLocaleDateString('es-CO')}</strong></div>
                <div className="text-[11px] text-emerald-700 font-bold">● Reporte Conforme a Bitácora</div>
              </div>
            </div>

            {/* TABLA DE METADATA DEL CONTRATO */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Proyecto</span>
                <strong className="text-slate-800 text-[11px]">MEZZANINE 3 NIVELES</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Ubicación</span>
                <strong className="text-slate-800 text-[11px]">Sede Admon Barranquilla</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Contratista</span>
                <strong className="text-slate-800 text-[11px]">INGENDES S.A.S.</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Interventoría</span>
                <strong className="text-slate-800 text-[11px]">DOLMEN S.A. E.S.P.</strong>
              </div>
            </div>
          </div>

          {/* 1. RESUMEN EJECUTIVO DEL PERÍODO */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              1. Resumen de Ejecución Física del Período
            </h2>

            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Jornadas / Registros</span>
                <div className="text-xl font-black text-slate-900 mt-1">{registrosFiltrados.length}</div>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Actividades Atendidas</span>
                <div className="text-xl font-black text-slate-900 mt-1">{consolidadoActividades.length}</div>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Evidencias Fotográficas</span>
                <div className="text-xl font-black text-emerald-700 mt-1">{fotosPeriodo.length}</div>
              </div>
            </div>

            {/* TABLA DE CANTIDADES EJECUTADAS */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-100 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Actividad Constructiva (WBS)</th>
                    <th className="py-2.5 px-3 text-center">Unidad</th>
                    <th className="py-2.5 px-3 text-right">Cantidad Ejecutada Período</th>
                    <th className="py-2.5 px-3 text-center">No. Vaciados / Reportes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {consolidadoActividades.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-slate-400">
                        No hay actividades registradas en el período seleccionado.
                      </td>
                    </tr>
                  ) : (
                    consolidadoActividades.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{item.actividad}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{item.unidad}</td>
                        <td className="py-2.5 px-3 text-right font-black text-slate-900">
                          {item.cantidadPeriodo.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-500">{item.conteo}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. REGISTRO FOTOGRÁFICO DE OBRA (ÁLBUM DE EVIDENCIAS) */}
          <div className="mb-8 page-break-before">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Camera className="h-4 w-4 text-slate-700" />
              2. Álbum Fotográfico de Evidencias en Campo ({fotosPeriodo.length} fotos)
            </h2>

            {fotosPeriodo.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-300 rounded-xl text-center text-slate-400 text-xs">
                No se adjuntaron fotografías en los registros del período seleccionado.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fotosPeriodo.map((fotoItem, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col justify-between">
                    <div className="h-56 bg-slate-950 flex items-center justify-center overflow-hidden">
                      <img
                        src={fotoItem.fotoSrc}
                        alt={fotoItem.actividad}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] space-y-1">
                      <div className="flex justify-between items-center font-bold text-slate-900">
                        <span className="truncate">{fotoItem.actividad}</span>
                        <span className="text-emerald-700 shrink-0 font-black">
                          {Number(fotoItem.cantidad).toFixed(2)} {fotoItem.unidad}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[10px] flex justify-between">
                        <span>Fecha: {fotoItem.fecha}</span>
                        <span>Frente: {fotoItem.ubicacion || 'General'}</span>
                      </div>
                      {fotoItem.observaciones && (
                        <p className="text-slate-600 italic text-[10px] pt-1 border-t border-slate-200 leading-tight">
                          "{fotoItem.observaciones}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. FIRMAS FORMALES DE ENTREGA Y APROBACIÓN */}
          <div className="mt-12 pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="border-b border-slate-400 w-64 mx-auto mb-2" />
              <p className="font-black text-slate-900">ING. JUAN GONZÁLEZ</p>
              <p className="text-slate-600 font-semibold">Ingeniero Residente de Obra</p>
              <p className="text-[10px] text-slate-400">INGENDES S.A.S. • Contratista</p>
            </div>

            <div>
              <div className="border-b border-slate-400 w-64 mx-auto mb-2" />
              <p className="font-black text-slate-900">INTERVENTOR TÉCNICO DE OBRA</p>
              <p className="text-slate-600 font-semibold">Supervisor / Interventor Delegado</p>
              <p className="text-[10px] text-slate-400">DOLMEN S.A. E.S.P. • Interventoría</p>
            </div>
          </div>

          {/* PIE DE PÁGINA */}
          <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
            Documento generado digitalmente por la plataforma JGM ConTech • Sistema de Control y Gestión de Obra Civil • Barranquilla, Colombia
          </div>

        </div>

        {/* PIE DE MODAL (NO IMPRIMIBLE) */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs no-print">
          <span className="text-slate-500 text-[11px]">
            💡 Al presionar Imprimir, selecciona "Guardar como PDF" para archivar o enviar por correo a interventoría.
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition"
          >
            Cerrar Informe
          </button>
        </div>

      </div>
    </div>
  );
}
