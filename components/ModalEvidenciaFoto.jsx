'use client';

import React from 'react';
import { 
  X, 
  Download, 
  Calendar, 
  MapPin, 
  Users, 
  Sun, 
  CloudRain, 
  Cloud, 
  HardHat, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';

export default function ModalEvidenciaFoto({ evidencia, onClose }) {
  if (!evidencia) return null;

  const descargarFoto = () => {
    if (!evidencia.foto) return;
    const link = document.createElement('a');
    link.href = evidencia.foto;
    link.download = `JGM_Evidencia_${evidencia.actividad.replace(/\s+/g, '_')}_${evidencia.fecha}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 md:p-6 backdrop-blur-md">
      <div className="w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl steel-card shadow-2xl overflow-hidden">
        
        {/* CABECERA */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <HardHat className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                Evidencia Fotográfica de Campo
              </h3>
              <p className="text-[11px] text-slate-400">
                Registro oficial de bitácora • JGM ConTech
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {evidencia.foto && (
              <button
                onClick={descargarFoto}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 transition"
              >
                <Download className="h-3.5 w-3.5" /> Descargar
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* CONTENIDO SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          
          {/* FOTO EN ALTA RESOLUCIÓN */}
          <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[300px] max-h-[55vh]">
            {evidencia.foto ? (
              <img
                src={evidencia.foto}
                alt={evidencia.actividad}
                className="w-full h-full max-h-[55vh] object-contain"
              />
            ) : (
              <div className="text-center p-8 text-slate-500">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Este registro no tiene fotografía adjunta.</p>
              </div>
            )}
          </div>

          {/* FICHA TÉCNICA DE LA EVIDENCIA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div>
                <span className="text-slate-400 block text-[11px] font-bold uppercase">Actividad de Obra</span>
                <strong className="text-slate-900 text-sm">{evidencia.actividad}</strong>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-500">Cantidad Ejecutada:</span>
                <strong className="text-emerald-700 text-sm font-black">
                  {Number(evidencia.cantidad).toFixed(2)} {evidencia.unidad}
                </strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Desperdicio Estimado:</span>
                <strong className="text-slate-800 font-bold">{evidencia.desperdicio || 0}%</strong>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[11px] font-bold uppercase">Fecha de Ejecución</span>
                <span className="inline-flex items-center gap-1 font-bold text-slate-900">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" /> {evidencia.fecha}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-bold uppercase">Ubicación / Frente</span>
                <span className="text-slate-800 font-semibold">{evidencia.ubicacion || 'Cimentación / Estructura'}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-500">Condición Climática:</span>
                <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                  {evidencia.clima === 'Lluvioso' ? <CloudRain className="h-3.5 w-3.5 text-sky-600" /> : <Sun className="h-3.5 w-3.5 text-amber-500" />}
                  {evidencia.clima || 'Soleado'}
                </span>
              </div>
            </div>
          </div>

          {/* CUADRILLA Y OBSERVACIONES */}
          {(evidencia.cuadrilla || evidencia.observaciones) && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              {evidencia.cuadrilla && (
                <div>
                  <span className="text-slate-400 block text-[11px] font-bold uppercase">Cuadrilla Asignada</span>
                  <p className="text-slate-800 font-medium">{evidencia.cuadrilla}</p>
                </div>
              )}
              {evidencia.observaciones && (
                <div className={evidencia.cuadrilla ? "pt-2 border-t border-slate-200" : ""}>
                  <span className="text-slate-400 block text-[11px] font-bold uppercase">Observaciones Técnicas</span>
                  <p className="text-slate-700 font-medium leading-relaxed italic">
                    "{evidencia.observaciones}"
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500 text-[11px]">
            INGENDES S.A.S. • Interventoría DOLMEN S.A.
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition"
          >
            Cerrar Evidencia
          </button>
        </div>

      </div>
    </div>
  );
}
