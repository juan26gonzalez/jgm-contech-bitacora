'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  Printer,
  FileText,
  HardHat,
  Camera,
  TrendingUp,
} from 'lucide-react';
import { useAppPreferences } from '../lib/i18n';
import {
  localizeActivity,
  localizeRoomName,
  localizeBitacoraObservacion,
} from '../lib/units';

export default function ModalReporteEjecutivo({
  registros = [],
  evidenciasFotos = {},
  isDemo = false,
  proyectoInfo = null,
  onClose,
}) {
  const { lang, formatQty, unitLabel } = useAppPreferences();
  const [periodoFiltro, setPeriodoFiltro] = useState('todos');
  const [frenteFiltro] = useState('todos');

  const registrosFiltrados = useMemo(() => {
    const ahora = new Date();

    return registros.filter((reg) => {
      if (periodoFiltro === 'todos') {
        const matchFrente = frenteFiltro === 'todos' || (reg.ubicacion && reg.ubicacion === frenteFiltro);
        return matchFrente;
      }

      if (!reg.fecha) return true;

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
          conteo: 0,
        };
      }
      mapa[act].cantidadPeriodo += cant;
      mapa[act].conteo += 1;
    });
    return Object.values(mapa);
  }, [registrosFiltrados]);

  const fotosPeriodo = useMemo(() => {
    const fotos = [];
    const idsProcesados = new Set();

    registrosFiltrados.forEach((reg) => {
      const idKey = reg.id;
      const strKey = String(reg.id);
      const numKey = Number(reg.id);
      const createdKey = reg.created_at;

      const fotoData =
        reg.foto ||
        evidenciasFotos[idKey] ||
        evidenciasFotos[strKey] ||
        evidenciasFotos[numKey] ||
        evidenciasFotos[createdKey];

      if (fotoData) {
        const src =
          typeof fotoData === 'string'
            ? fotoData
            : fotoData.foto || fotoData.fotoSrc || fotoData.fotoUrl;

        if (src && !idsProcesados.has(reg.id)) {
          idsProcesados.add(reg.id);
          fotos.push({
            ...reg,
            fotoSrc: src,
            observaciones:
              typeof fotoData === 'object' && fotoData.observaciones
                ? fotoData.observaciones
                : reg.observaciones,
            cuadrilla:
              typeof fotoData === 'object' && fotoData.cuadrilla
                ? fotoData.cuadrilla
                : reg.cuadrilla,
            clima:
              typeof fotoData === 'object' && fotoData.clima ? fotoData.clima : reg.clima,
          });
        }
      }
    });

    if (!isDemo && fotos.length === 0 && Object.keys(evidenciasFotos).length > 0) {
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
            fotoSrc: ev.foto || ev.fotoSrc,
          });
        }
      });
    }

    return fotos;
  }, [registrosFiltrados, evidenciasFotos, isDemo]);

  const headerSubtitle = isDemo
    ? lang === 'en'
      ? 'ISO 19650 Official Format • Northbridge Capital Partners & JGM ConTech'
      : 'Formato Oficial ISO 19650 • Northbridge Capital Partners & JGM ConTech'
    : proyectoInfo
    ? `${proyectoInfo.subtitulo2Valor} • ${proyectoInfo.subtitulo1Valor}`
    : 'Formato Oficial de Interventoría & Ingeniería';

  const metaProyecto = isDemo
    ? 'NORTHBRIDGE CORPORATE HUB (BIM 5D)'
    : proyectoInfo?.nombre?.toUpperCase() || 'MEZZANINE 3 NIVELES';
  const metaUbicacion = isDemo
    ? 'Barranquilla / Miami / Madrid • ISO 19650'
    : proyectoInfo?.id === 'casa_mendoza'
    ? 'Sabanalarga, Atlántico'
    : 'Sede Admon Barranquilla';
  const metaLbl1 = proyectoInfo?.subtitulo1Label || (lang === 'en' ? 'Client' : 'Contratista');
  const metaVal1 = isDemo
    ? 'Northbridge Capital Partners'
    : proyectoInfo?.subtitulo1Valor || 'INGENDES S.A.S.';
  const metaLbl2 = proyectoInfo?.subtitulo2Label || (lang === 'en' ? 'Engineering' : 'Interventoría');
  const metaVal2 = isDemo
    ? lang === 'en'
      ? 'JGM ConTech Engineering Team'
      : 'Equipo de Ingeniería JGM ConTech'
    : proyectoInfo?.subtitulo2Valor || 'DOLMEN S.A.';

  const imprimirPDF = () => {
    window.print();
  };

  const periodoText =
    periodoFiltro === 'semana'
      ? lang === 'en'
        ? 'Last 7 Days'
        : 'Últimos 7 Días'
      : periodoFiltro === 'quincena'
      ? lang === 'en'
        ? 'Last 15 Days'
        : 'Últimos 15 Días'
      : periodoFiltro === 'mes'
      ? lang === 'en'
        ? 'Last 30 Days'
        : 'Últimos 30 Días'
      : lang === 'en'
      ? 'Full Project Summary'
      : 'Consolidado General';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-2 sm:p-4 md:p-6 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[96vh] flex flex-col rounded-2xl steel-card shadow-2xl overflow-hidden">
        
        {/* BARRA SUPERIOR DE CONTROLES (NO IMPRIMIBLE) */}
        <div className="p-3 sm:p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <FileText className="h-4 sm:h-5 w-4 sm:w-5" />
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
                {lang === 'en'
                  ? 'Executive Progress Report & Field Log Builder'
                  : 'Generador de Informe Ejecutivo y Acta de Avance'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400">{headerSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <select
              value={periodoFiltro}
              onChange={(e) => setPeriodoFiltro(e.target.value)}
              className="flex-1 sm:flex-initial rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="todos">
                {lang === 'en' ? `Full History (${registros.length})` : `Todo el Histórico (${registros.length})`}
              </option>
              <option value="semana">{lang === 'en' ? 'Last 7 days (Weekly)' : 'Últimos 7 días (Semanal)'}</option>
              <option value="quincena">{lang === 'en' ? 'Last 15 days (Biweekly)' : 'Últimos 15 días (Quincenal)'}</option>
              <option value="mes">{lang === 'en' ? 'Last 30 days (Monthly)' : 'Últimos 30 días (Mensual)'}</option>
            </select>

            <button
              onClick={imprimirPDF}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition shadow-sm whitespace-nowrap"
            >
              <Printer className="h-3.5 w-3.5" /> {lang === 'en' ? 'Print / PDF' : 'Imprimir / PDF'}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title={lang === 'en' ? 'Close modal' : 'Cerrar modal'}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ÁREA DE DOCUMENTO IMPRIMIBLE */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 md:p-10 bg-white text-slate-900 printable-document">
          
          {/* MEMBRETE OFICIAL DE OBRA */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1 rounded bg-slate-900 text-white inline-block">
                    <HardHat className="h-4 sm:h-5 w-4 sm:w-5" />
                  </div>
                  <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">JGM ConTech</span>
                </div>
                <h1 className="text-sm sm:text-base font-bold text-slate-800 uppercase leading-snug">
                  {lang === 'en'
                    ? 'Executive Site Progress & Photo Inspection Report'
                    : 'Informe Ejecutivo de Avance de Obra y Registro Fotográfico'}
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                  {lang === 'en' ? 'Reporting Period:' : 'Período:'} <strong>{periodoText}</strong> ({lang === 'en' ? 'Imperial US Units' : 'Unidades Métricas SI'})
                </p>
              </div>

              <div className="text-left sm:text-right text-[11px] sm:text-xs space-y-0.5 bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-lg w-full sm:w-auto">
                <div className="font-mono font-bold text-slate-900">
                  {lang === 'en' ? 'REPORT' : 'ACTA'} INF-{new Date().getFullYear()}-{String(registrosFiltrados.length).padStart(3, '0')}
                </div>
                <div className="text-slate-500">
                  {lang === 'en' ? 'Issue Date:' : 'Fecha de Emisión:'}{' '}
                  <strong>{new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'es-CO')}</strong>
                </div>
                <div className="text-[11px] text-emerald-700 font-bold">
                  {lang === 'en' ? 'Verified against Field Log' : 'Reporte Conforme a Bitácora'}
                </div>
              </div>
            </div>

            {/* TABLA DE METADATA DEL CONTRATO */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 p-2.5 sm:p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase font-bold">
                  {lang === 'en' ? 'Project' : 'Proyecto'}
                </span>
                <strong className="text-slate-800 text-[10px] sm:text-[11px] block truncate">{metaProyecto}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase font-bold">
                  {lang === 'en' ? 'Location' : 'Ubicación'}
                </span>
                <strong className="text-slate-800 text-[10px] sm:text-[11px] block truncate">{metaUbicacion}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase font-bold">{metaLbl1}</span>
                <strong className="text-slate-800 text-[10px] sm:text-[11px] block truncate">{metaVal1}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase font-bold">{metaLbl2}</span>
                <strong className="text-slate-800 text-[10px] sm:text-[11px] block truncate">{metaVal2}</strong>
              </div>
            </div>
          </div>

          {/* 1. RESUMEN EJECUTIVO DEL PERÍODO */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              {lang === 'en'
                ? '1. Physical Execution Summary for Period'
                : '1. Resumen de Ejecución Física del Período'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex sm:flex-col justify-between items-center sm:text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  {lang === 'en' ? 'Logged Shifts / Entries' : 'Jornadas / Registros'}
                </span>
                <div className="text-lg sm:text-2xl font-black text-slate-900">{registrosFiltrados.length}</div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex sm:flex-col justify-between items-center sm:text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  {lang === 'en' ? 'Active WBS Items' : 'Actividades Atendidas'}
                </span>
                <div className="text-lg sm:text-2xl font-black text-slate-900">{consolidadoActividades.length}</div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex sm:flex-col justify-between items-center sm:text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  {lang === 'en' ? 'Photographic Evidence' : 'Evidencias Fotográficas'}
                </span>
                <div className="text-lg sm:text-2xl font-black text-emerald-700">{fotosPeriodo.length}</div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs text-slate-800 min-w-[380px] sm:min-w-full">
                <thead className="bg-slate-100 text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">{lang === 'en' ? 'Activity (BOQ/WBS)' : 'Actividad (APU/WBS)'}</th>
                    <th className="py-2.5 px-2 text-center">{lang === 'en' ? 'Unit' : 'Unidad'}</th>
                    <th className="py-2.5 px-3 text-right">{lang === 'en' ? 'Executed Qty' : 'Cant. Ejecutada'}</th>
                    <th className="py-2.5 px-3 text-center">{lang === 'en' ? 'Logs' : 'Reportes'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {consolidadoActividades.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-slate-400">
                        {lang === 'en'
                          ? 'No activities logged for the selected period.'
                          : 'No hay actividades registradas en el período seleccionado.'}
                      </td>
                    </tr>
                  ) : (
                    consolidadoActividades.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 leading-snug">
                          {localizeActivity(item.actividad, lang)}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono">{unitLabel(item.unidad)}</td>
                        <td className="py-2.5 px-3 text-right font-black text-slate-900">
                          {formatQty(item.cantidadPeriodo, item.unidad)}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-500 font-semibold">{item.conteo}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. REGISTRO FOTOGRÁFICO DE OBRA */}
          <div className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
              <Camera className="h-4 w-4 text-slate-700" />
              {lang === 'en'
                ? `2. Field Photographic Inspection Album (${fotosPeriodo.length} ${fotosPeriodo.length === 1 ? 'photo' : 'photos'})`
                : `2. Álbum Fotográfico de Evidencias en Campo (${fotosPeriodo.length} ${fotosPeriodo.length === 1 ? 'foto' : 'fotos'})`}
            </h2>

            {fotosPeriodo.length === 0 ? (
              <div className="p-6 sm:p-8 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-500 text-xs bg-slate-50/50">
                <Camera className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700">
                  {lang === 'en'
                    ? 'No photos attached in this period yet.'
                    : 'Aún no se han adjuntado fotos en este período.'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                  {lang === 'en'
                    ? 'Attach field inspection evidence directly from the Field Log form.'
                    : 'Puedes adjuntar fotos de evidencia directamente al registrar una nueva entrada de bitácora.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fotosPeriodo.map((fotoItem, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col justify-between">
                    <div className="h-52 sm:h-56 bg-slate-950 flex items-center justify-center overflow-hidden">
                      <img
                        src={fotoItem.fotoSrc}
                        alt={localizeActivity(fotoItem.actividad, lang)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] space-y-1">
                      <div className="flex justify-between items-center font-bold text-slate-900">
                        <span className="truncate pr-2">{localizeActivity(fotoItem.actividad, lang)}</span>
                        <span className="text-emerald-700 shrink-0 font-black">
                          {formatQty(fotoItem.cantidad, fotoItem.unidad)} {unitLabel(fotoItem.unidad)}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[10px] flex justify-between">
                        <span>{lang === 'en' ? 'Date:' : 'Fecha:'} {fotoItem.fecha}</span>
                        <span>{lang === 'en' ? 'Zone:' : 'Frente:'} {localizeRoomName(fotoItem.ubicacion || 'General', lang)}</span>
                      </div>
                      {fotoItem.observaciones && (
                        <p className="text-slate-600 italic text-[10px] pt-1 border-t border-slate-200 leading-tight">
                          "{localizeBitacoraObservacion(fotoItem.observaciones, lang)}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. FIRMAS FORMALES DE ENTREGA Y APROBACIÓN */}
          <div className="mt-8 pt-6 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-center text-xs">
            <div className="flex flex-col items-center">
              <div className="border-b border-slate-400 w-48 sm:w-56 mb-2" />
              <p className="font-black text-slate-900">
                {isDemo
                  ? lang === 'en'
                    ? 'PROJECT DIRECTOR / LEAD ENGINEER'
                    : 'DIRECCIÓN DE PROYECTO / INGENIERÍA'
                  : lang === 'en'
                  ? 'RESIDENT PROJECT ENGINEER'
                  : 'INGENIERO RESIDENTE DE OBRA'}
              </p>
              <p className="text-slate-600 font-semibold">
                {isDemo
                  ? 'JGM ConTech Engineering Team'
                  : proyectoInfo?.subtitulo2Valor || 'Dirección Técnica de Obra'}
              </p>
              <p className="text-[10px] text-slate-400">
                {isDemo ? 'JGM ConTech Showcase Platform' : 'Control Técnico de Obra'}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="border-b border-slate-400 w-48 sm:w-56 mb-2" />
              <p className="font-black text-slate-900">
                {isDemo
                  ? lang === 'en'
                    ? "OWNER'S REPRESENTATIVE"
                    : 'REPRESENTANTE DEL CONTRATANTE'
                  : lang === 'en'
                  ? 'TECHNICAL SUPERVISION / QA LEAD'
                  : 'INTERVENTOR TÉCNICO DE OBRA'}
              </p>
              <p className="text-slate-600 font-semibold">
                {isDemo
                  ? 'Northbridge Capital Partners'
                  : proyectoInfo?.subtitulo1Valor || 'Supervisión Delegada'}
              </p>
              <p className="text-[10px] text-slate-400">
                {lang === 'en' ? 'Approval & Audit' : 'Supervisión y Aprobación'}
              </p>
            </div>
          </div>

          {/* PIE DE PÁGINA */}
          <div className="mt-6 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400">
            {isDemo
              ? lang === 'en'
                ? 'Digitally generated by JGM ConTech Platform • ISO 19650 BIM 4D/5D Controls (Showcase)'
                : 'Documento generado digitalmente por JGM ConTech • Sistema de Control ISO 19650 (Showcase)'
              : lang === 'en'
              ? 'Digitally generated by JGM ConTech • Civil Project Controls Platform'
              : 'Documento generado digitalmente por JGM ConTech • Sistema de Control y Gestión de Obra Civil'}
          </div>

        </div>

        {/* PIE DE MODAL (NO IMPRIMIBLE) */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs no-print">
          <span className="text-slate-500 text-[10px] sm:text-[11px] text-center sm:text-left">
            {lang === 'en'
              ? 'Tip: Press Print and choose "Save as PDF" to export the official executive field report.'
              : 'Al presionar Imprimir, selecciona "Guardar como PDF" para archivar o enviar el acta ejecutiva.'}
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition"
          >
            {lang === 'en' ? 'Close Report' : 'Cerrar Informe'}
          </button>
        </div>

      </div>
    </div>
  );
}
