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
  TrendingUp,
  MapPin
} from 'lucide-react';

export default function ModalReporteEjecutivo({ registros = [], evidenciasFotos = {}, onClose }) {
  const [periodoFiltro, setPeriodoFiltro] = useState('todos'); // Por defecto 'todos' para ver todas las evidencias acumuladas
  const [frenteFiltro, setFrenteFiltro] = useState('todos');

  // Filtrado de registros según el período seleccionado
  const registrosFiltrados = useMemo(() => {
    const ahora = new Date();

    return registros.filter((reg) => {
      if (periodoFiltro === 'todos') {
        const matchFrente = frenteFiltro === 'todos' || (reg.ubicacion && reg.ubicacion === frenteFiltro);
        return matchFrente;
      }

      if (!reg.fecha) return true;
      
      // Parsear fecha ISO o DD/MM/YYYY
      let fReg;
      if (reg.fecha.includes('/')) {
        const partes = reg.fecha.split('/');
        fReg = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
      } else {
        fReg = new Date(reg.fecha);
      }

      const diffDias = !isNaN(fReg.getTime()) 
        ? Math.floor((ahora - fReg) / (1000 * 60 * 60 * 24)) 
        : 0;

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

  // Fotos de evidencia del período (búsqueda robusta por ID string/number o timestamp)
  const fotosPeriodo = useMemo(() => {
    const fotos = [];
    const idsProcesados = new Set();

    registrosFiltrados.forEach((reg) => {
      const idKey = reg.id;
      const strKey = String(reg.id);
      const numKey = Number(reg.id);
      const createdKey = reg.created_at;

      const fotoData = reg.foto || 
                       evidenciasFotos[idKey] || 
                       evidenciasFotos[strKey] || 
                       evidenciasFotos[numKey] || 
                       evidenciasFotos[createdKey];

      if (fotoData) {
        const src = typeof fotoData === 'string' 
          ? fotoData 
          : (fotoData.foto || fotoData.fotoSrc || fotoData.fotoUrl);

        if (src && !idsProcesados.has(reg.id)) {
          idsProcesados.add(reg.id);
          fotos.push({
            ...reg,
            fotoSrc: src,
            observaciones: typeof fotoData === 'object' && fotoData.observaciones ? fotoData.observaciones : reg.observaciones,
            cuadrilla: typeof fotoData === 'object' && fotoData.cuadrilla ? fotoData.cuadrilla : reg.cuadrilla,
            clima: typeof fotoData === 'object' && fotoData.clima ? fotoData.clima : reg.clima
          });
        }
      }
    });

    // Si aún no hay fotos por cruce exacto de ID, revisar si hay fotos guardadas en evidenciasFotos
    if (fotos.length === 0 && Object.keys(evidenciasFotos).length > 0) {
      Object.values(evidenciasFotos).forEach((ev) => {
        if (ev && (ev.foto || ev.fotoSrc)) {
          fotos.push({
            id: ev.id || `ev-${Math.random()}`,
            actividad: ev.actividad || 'Actividad de Obra',
            unidad: ev.unidad || 'und',
            cantidad: ev.cantidad || 0,
            fecha: ev.fecha || new Date().toISOString().split('T')[0],
            ubicacion: ev.ubicacion || 'Frente Principal',
            observaciones: ev.observaciones || '',
            fotoSrc: ev.foto || ev.fotoSrc
          });
        }
      });
    }

    return fotos;
  }, [registrosFiltrados, evidenciasFotos]);

  const imprimirPDF = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-2 sm:p-4 md:p-6 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[96vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* BARRA SUPERIOR DE CONTROLES (NO IMPRIMIBLE) */}
        <div className="p-3 sm:p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <FileText className="h-4 sm:h-5 w-4 sm:w-5" />
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
                Generador de Informe Ejecutivo y Acta de Avance
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                Formato Oficial para Interventoría DOLMEN S.A. • INGENDES S.A.S.
              </p>
            </div>
          </div>

          {/* SELECTORES DE PERÍODO Y BOTÓN DE IMPRESIÓN */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <select
              value={periodoFiltro}
              onChange={(e) => setPeriodoFiltro(e.target.value)}
              className="flex-1 sm:flex-initial rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="todos">Todo el Histórico ({registros.length})</option>
              <option value="semana">Últimos 7 días (Semanal)</option>
              <option value="quincena">Últimos 15 días (Quincenal)</option>
              <option value="mes">Últimos 30 días (Mensual)</option>
            </select>

            <button
              onClick={imprimirPDF}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition shadow-sm whitespace-nowrap"
            >
              <Printer className="h-3.5 w-3.5" /> Imprimir / PDF
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Cerrar modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ÁREA DE DOCUMENTO IMPRIMIBLE (DOCUMENTO OFICIAL) */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 md:p-10 bg-white text-slate-900 printable-document">
          
          {/* MEMBRETE OFICIAL DE OBRA */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1 rounded bg-slate-900 text-white inline-block">
                    <HardHat className="h-4 sm:h-5 w-4 sm:h-5" />
                  </div>
                  <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">JGM ConTech</span>
                </div>
                <h1 className="text-sm sm:text-base font-bold text-slate-800 uppercase leading-snug">
                  Informe Ejecutivo de Avance de Obra y Registro Fotográfico
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                  Período: <strong>{periodoFiltro === 'semana' ? 'Últimos 7 Días' : periodoFiltro === 'quincena' ? 'Últimos 15 Días' : periodoFiltro === 'mes' ? 'Últimos 30 Días' : 'Consolidado General'}</strong>
                </p>
              </div>

              <div className="text-left sm:text-right text-[11px] sm:text-xs space-y-0.5 bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-lg w-full sm:w-auto">
                <div className="font-mono font-bold text-slate-900">ACTA INF-{new Date().getFullYear()}-{String(registrosFiltrados.length).padStart(3, '0')}</div>
                <div className="text-slate-500">Fecha de Emisión: <strong>{new Date().toLocaleDateString('es-CO')}</strong></div>
                <div className="text-[11px] text-emerald-700 font-bold">● Reporte Conforme a Bitácora</div>
              </div>
            </div>

            {/* TABLA DE METADATA DEL CONTRATO (RESPONSIVA) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 p-2.5 sm:p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase font-bold">Proyecto</span>
                <strong className="text-slate-800 text-[10px] sm:text-[11px] block truncate">MEZZANINE 3 NIVELES</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase font-bold">Ubicación</span>
                <strong className="text-slate-800 text-[10px] sm:text-[11px] block truncate">Sede Admon Barranquilla</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase font-bold">Contratista</span>
                <strong className="text-slate-800 text-[10px] sm:text-[11px] block truncate">INGENDES S.A.S.</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase font-bold">Interventoría</span>
                <strong className="text-slate-800 text-[10px] sm:text-[11px] block truncate">DOLMEN S.A. E.S.P.</strong>
              </div>
            </div>
          </div>

          {/* 1. RESUMEN EJECUTIVO DEL PERÍODO (TARJETAS ADAPTADAS A CELULAR) */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              1. Resumen de Ejecución Física del Período
            </h2>

            {/* Tarjetas responsivas: 1 columna en móvil, 3 en pantalla grande */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex sm:flex-col justify-between items-center sm:text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Jornadas / Registros</span>
                <div className="text-lg sm:text-2xl font-black text-slate-900">{registrosFiltrados.length}</div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex sm:flex-col justify-between items-center sm:text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Actividades Atendidas</span>
                <div className="text-lg sm:text-2xl font-black text-slate-900">{consolidadoActividades.length}</div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex sm:flex-col justify-between items-center sm:text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Evidencias Fotográficas</span>
                <div className="text-lg sm:text-2xl font-black text-emerald-700">{fotosPeriodo.length}</div>
              </div>
            </div>

            {/* TABLA DE CANTIDADES EJECUTADAS (CON SCROLL HORIZONTAL SUAVE EN MÓVIL) */}
            <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs text-slate-800 min-w-[380px] sm:min-w-full">
                <thead className="bg-slate-100 text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Actividad (APU/WBS)</th>
                    <th className="py-2.5 px-2 text-center">Unidad</th>
                    <th className="py-2.5 px-3 text-right">Cant. Ejecutada</th>
                    <th className="py-2.5 px-3 text-center">Reportes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {consolidadoActividades.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-slate-400">
                        No hay actividades registradas en el período seleccionado.
                      </td>
                    </tr>
                  ) : (
                    consolidadoActividades.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 leading-snug">{item.actividad}</td>
                        <td className="py-2.5 px-2 text-center font-mono">{item.unidad}</td>
                        <td className="py-2.5 px-3 text-right font-black text-slate-900">
                          {item.cantidadPeriodo.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-500 font-semibold">{item.conteo}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 block sm:hidden text-right">
              ↔ Desliza horizontalmente para ver la tabla completa
            </div>
          </div>

          {/* 2. REGISTRO FOTOGRÁFICO DE OBRA (ÁLBUM DE EVIDENCIAS) */}
          <div className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
              <Camera className="h-4 w-4 text-slate-700" />
              2. Álbum Fotográfico de Evidencias en Campo ({fotosPeriodo.length} {fotosPeriodo.length === 1 ? 'foto' : 'fotos'})
            </h2>

            {fotosPeriodo.length === 0 ? (
              <div className="p-6 sm:p-8 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-500 text-xs bg-slate-50/50">
                <Camera className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700">Aún no se han adjuntado fotos en este período.</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                  💡 Puedes adjuntar fotos de evidencia directamente desde la cámara del celular al crear un nuevo registro de bitácora.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fotosPeriodo.map((fotoItem, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col justify-between">
                    <div className="h-52 sm:h-56 bg-slate-950 flex items-center justify-center overflow-hidden">
                      <img
                        src={fotoItem.fotoSrc}
                        alt={fotoItem.actividad}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] space-y-1">
                      <div className="flex justify-between items-center font-bold text-slate-900">
                        <span className="truncate pr-2">{fotoItem.actividad}</span>
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

          {/* 3. FIRMAS FORMALES DE ENTREGA Y APROBACIÓN (RESPONSIVAS PARA MÓVIL) */}
          <div className="mt-8 pt-6 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-center text-xs">
            <div className="flex flex-col items-center">
              <div className="border-b border-slate-400 w-48 sm:w-56 mb-2" />
              <p className="font-black text-slate-900">ING. JUAN GONZÁLEZ</p>
              <p className="text-slate-600 font-semibold">Ingeniero Residente de Obra</p>
              <p className="text-[10px] text-slate-400">INGENDES S.A.S. • Contratista</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="border-b border-slate-400 w-48 sm:w-56 mb-2" />
              <p className="font-black text-slate-900">INTERVENTOR TÉCNICO DE OBRA</p>
              <p className="text-slate-600 font-semibold">Supervisor / Interventor Delegado</p>
              <p className="text-[10px] text-slate-400">DOLMEN S.A. E.S.P. • Interventoría</p>
            </div>
          </div>

          {/* PIE DE PÁGINA */}
          <div className="mt-6 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400">
            Documento generado digitalmente por la plataforma JGM ConTech • Sistema de Control y Gestión de Obra Civil • Barranquilla, Colombia
          </div>

        </div>

        {/* PIE DE MODAL (NO IMPRIMIBLE) */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs no-print">
          <span className="text-slate-500 text-[10px] sm:text-[11px] text-center sm:text-left">
            💡 Al presionar Imprimir, selecciona "Guardar como PDF" para archivar o enviar por correo a interventoría.
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition"
          >
            Cerrar Informe
          </button>
        </div>

      </div>
    </div>
  );
}
