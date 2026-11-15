'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  X, 
  Upload, 
  Compass, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  FileCheck,
  Calendar,
  Building2,
  Trash2,
  Info
} from 'lucide-react';

import { useAppPreferences } from '../lib/i18n';
import {
  DEMO_SHOWCASE_PROJECT_ID,
  DEMO_PLANOS_SHOWCASE
} from '../lib/demoFieldData';
import { getPlanosPrototipoPorProyecto } from '../lib/prototypeBlueprints';
import {
  guardarPlanoLocalEnDB,
  obtenerPlanosLocalesDeDB,
  eliminarPlanoLocalDeDB
} from './evidenciasDB';
import { localizeTerm } from '../lib/units';

const mapDemoPlano = (p) => ({
  id: p.id,
  codigo: p.codigo,
  titulo: p.nombre,
  titulo_en: p.nombre_en,
  disciplina:
    p.disciplina === 'ARQUITECTURA'
      ? 'Arquitectónico'
      : p.disciplina === 'ESTRUCTURAS'
      ? 'Estructural'
      : 'Cubierta / Envolvente',
  revision: p.version,
  escala: p.escala,
  fecha: p.fecha,
  responsable: p.notaCalidad || "Owner's Representative • ISO 19650",
  descripcion: p.descripcion,
  descripcion_en: p.descripcion_en,
  archivoImg: p.url,
  archivoThumb: p.url,
  esModificado: false
});

const DISC_EN_LABELS = {
  Todas: 'All Sheets',
  Estructural: 'Structural',
  Arquitectónico: 'Architectural',
  Hidrosanitario: 'Plumbing / MEP',
  Eléctrico: 'Electrical',
  'Cubierta / Envolvente': 'Roofing & Envelope',
  Acabados: 'Finishes'
};

export default function TabPlanos({ proyectoActivo = 'proto_corporativo', isDemo = false }) {
  const { lang } = useAppPreferences();
  const demoMode = isDemo || proyectoActivo === DEMO_SHOWCASE_PROJECT_ID;

  const [planosLocales, setPlanosLocales] = useState([]);
  const [demoPlanos, setDemoPlanos] = useState(() => DEMO_PLANOS_SHOWCASE.map(mapDemoPlano));
  const [filtroTexto, setFiltroTexto] = useState('');
  const [disciplinaActiva, setDisciplinaActiva] = useState('Todas');

  // Modal de Visor
  const [planoSeleccionado, setPlanoSeleccionado] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotacion, setRotacion] = useState(0);

  // Modal de Subida / Inserción local privada
  const [showModalSubir, setShowModalSubir] = useState(false);
  const [nuevoCodigo, setNuevoCodigo] = useState('');
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevaDisciplina, setNuevaDisciplina] = useState('Estructural');
  const [nuevaRevision, setNuevaRevision] = useState('Rev. 01 (Approved)');
  const [nuevaEscala, setNuevaEscala] = useState('1:50');
  const [nuevoResponsable, setNuevoResponsable] = useState('JGM ConTech Engineering Team');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [archivoPreview, setArchivoPreview] = useState(null);
  const [archivoEsPdf, setArchivoEsPdf] = useState(false);
  const [archivoNombre, setArchivoNombre] = useState('');

  useEffect(() => {
    setDisciplinaActiva('Todas');
    setNuevoResponsable('JGM ConTech Engineering Team');
    setNuevaRevision(lang === 'en' ? 'Rev. 01 (Approved)' : 'Rev. 01 (Aprobado)');
  }, [proyectoActivo, demoMode, lang]);

  // Cargar planos privados locales desde IndexedDB (almacenamiento local en navegador, nunca en GitHub)
  useEffect(() => {
    if (demoMode) return;
    let mounted = true;
    obtenerPlanosLocalesDeDB().then((items) => {
      if (!mounted) return;
      const filtrados = (items || []).filter(
        (p) => !p.proyectoId || p.proyectoId === proyectoActivo
      );
      setPlanosLocales(filtrados);
    });
    return () => {
      mounted = false;
    };
  }, [demoMode, proyectoActivo]);

  const prototypePlanos = useMemo(
    () => getPlanosPrototipoPorProyecto(proyectoActivo),
    [proyectoActivo]
  );

  const activePlanos = useMemo(() => {
    if (demoMode) return demoPlanos;
    return [...planosLocales, ...prototypePlanos];
  }, [demoMode, demoPlanos, planosLocales, prototypePlanos]);

  const handleArchivoSeleccionado = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf =
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    setArchivoEsPdf(isPdf);
    setArchivoNombre(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setArchivoPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleGuardarNuevoPlano = async (e) => {
    e.preventDefault();
    if (!nuevoCodigo.trim() || !nuevoTitulo.trim()) {
      alert(lang === 'en' ? 'Please complete required fields: Code and Sheet Title.' : 'Por favor complete los campos obligatorios: Código y Título.');
      return;
    }

    const nuevoPlano = {
      id: `PL-LOC-${Date.now()}`,
      proyectoId: proyectoActivo,
      codigo: nuevoCodigo.trim().toUpperCase(),
      titulo: nuevoTitulo.trim(),
      titulo_en: nuevoTitulo.trim(),
      disciplina: nuevaDisciplina,
      revision: nuevaRevision.trim(),
      escala: nuevaEscala.trim(),
      fecha: new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'es-CO'),
      responsable: nuevoResponsable.trim(),
      descripcion:
        nuevaDescripcion.trim() ||
        (lang === 'en'
          ? 'Local drawing loaded privately in browser IndexedDB.'
          : 'Plano cargado localmente en tu navegador (IndexedDB privado).'),
      descripcion_en:
        nuevaDescripcion.trim() || 'Local drawing loaded privately in browser IndexedDB.',
      archivoImg: archivoEsPdf ? null : archivoPreview,
      archivoThumb: archivoEsPdf ? null : archivoPreview,
      archivoPdf: archivoEsPdf ? archivoPreview : null,
      esPdf: archivoEsPdf,
      archivoNombre,
      isLocalUpload: true,
      esModificado: false
    };

    if (demoMode) {
      setDemoPlanos((prev) => [nuevoPlano, ...prev]);
    } else {
      await guardarPlanoLocalEnDB(nuevoPlano);
      setPlanosLocales((prev) => [nuevoPlano, ...prev]);
    }

    setNuevoCodigo('');
    setNuevoTitulo('');
    setNuevaDescripcion('');
    setArchivoPreview(null);
    setArchivoEsPdf(false);
    setArchivoNombre('');
    setShowModalSubir(false);
    alert(
      lang === 'en'
        ? 'Sheet saved locally in browser storage (not uploaded to GitHub).'
        : 'Plano guardado localmente en tu navegador (IndexedDB privado).'
    );
  };

  const handleEliminarPlanoLocal = async (plano) => {
    if (!plano?.isLocalUpload) return;
    if (demoMode) {
      setDemoPlanos((prev) => prev.filter((p) => p.id !== plano.id));
    } else {
      await eliminarPlanoLocalDeDB(plano.id);
      setPlanosLocales((prev) => prev.filter((p) => p.id !== plano.id));
    }
    if (planoSeleccionado?.id === plano.id) setPlanoSeleccionado(null);
  };

  const getDiscLabel = (disc) => (lang === 'en' ? DISC_EN_LABELS[disc] || disc : disc);
  const getTitle = (p) => (lang === 'en' ? p.titulo_en || localizeTerm(p.titulo, 'en') : p.titulo);
  const getDesc = (p) => (lang === 'en' ? p.descripcion_en || localizeTerm(p.descripcion, 'en') : p.descripcion);

  // Filtrado de planos
  const planosFiltrados = useMemo(() => {
    const q = filtroTexto.toLowerCase();
    return activePlanos.filter((p) => {
      const matchDisc = disciplinaActiva === 'Todas' || p.disciplina === disciplinaActiva;
      const tTitle = (lang === 'en' ? p.titulo_en || localizeTerm(p.titulo, 'en') : p.titulo) || '';
      const tDesc = (lang === 'en' ? p.descripcion_en || localizeTerm(p.descripcion, 'en') : p.descripcion) || '';
      const matchText =
        !q ||
        p.codigo.toLowerCase().includes(q) ||
        tTitle.toLowerCase().includes(q) ||
        tDesc.toLowerCase().includes(q) ||
        p.titulo.toLowerCase().includes(q);
      return matchDisc && matchText;
    });
  }, [activePlanos, disciplinaActiva, filtroTexto, lang]);

  const disciplinas = demoMode
    ? ['Todas', 'Estructural', 'Arquitectónico', 'Cubierta / Envolvente']
    : proyectoActivo === 'proto_residencial'
    ? ['Todas', 'Arquitectónico', 'Estructural', 'Cubierta / Envolvente']
    : ['Todas', 'Estructural', 'Arquitectónico', 'Hidrosanitario', 'Eléctrico'];

  const headerProjectName = demoMode
    ? 'Northbridge Corporate Hub'
    : proyectoActivo === 'proto_residencial'
    ? 'Vivienda Prototipo BIM 1.1'
    : 'Edificio Modelo 3 Niveles';

  return (
    <div className="space-y-6">

      {/* 1. CABECERA DEL REPOSITORIO DE PLANOS */}
      <div className="rounded-2xl steel-card p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2.5 rounded-xl bg-slate-900 text-white shadow-md">
                <Compass className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                  {demoMode
                    ? (lang === 'en'
                        ? 'Northbridge Corporate Hub — ISO 19650 Blueprints & IFC Sheets'
                        : 'Northbridge Corporate Hub — Planos Constructivos ISO 19650 & IFC')
                    : proyectoActivo === 'proto_residencial'
                    ? (lang === 'en'
                        ? 'Residential BIM Prototype Sheets (Local & Vector Viewer)'
                        : 'Planos Prototipo BIM (Visor Vectorial y Carga Local)')
                    : (lang === 'en'
                        ? 'Corporate Prototype Construction Sheets (Vector & Local Viewer)'
                        : 'Planos Prototipo Edificio 3 Niveles (Vector & Visor Local)')}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {demoMode
                    ? (lang === 'en'
                        ? "Owner's Representative • OpenBIM IFC4 Record Drawings (Demo Sandbox)"
                        : 'Supervisión Técnica • Planos Récord OpenBIM IFC4 (Demo Sandbox)')
                    : (lang === 'en'
                        ? 'In-browser Vector CAD Preview & Private IndexedDB Storage (No files uploaded to GitHub)'
                        : 'Planos vectoriales prototipo en navegador + Carga privada local (IndexedDB sin subir archivos a GitHub)')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowModalSubir(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-sm"
            >
              <Plus className="h-4 w-4" /> {lang === 'en' ? 'Load Local Drawing (PNG/PDF)' : 'Cargar Plano Local (PNG/PDF)'}
            </button>
          </div>
        </div>

        {/* 2. CHIPS DE DISCIPLINAS */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1">
          {disciplinas.map((disc) => (
            <button
              key={disc}
              onClick={() => setDisciplinaActiva(disc)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                disciplinaActiva === disc
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {getDiscLabel(disc)} ({disc === 'Todas' ? activePlanos.length : activePlanos.filter(p => p.disciplina === disc).length})
            </button>
          ))}
        </div>
      </div>

      {/* 3. BARRA DE BÚSQUEDA */}
      <div className="rounded-xl steel-subcard p-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={lang === 'en' ? 'Search by sheet code (e.g. EST-01, NB-ARQ-01), title or spec...' : 'Buscar por código (ej. EST-01, NB-ARQ-01), título o especificación...'}
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-slate-800 focus:outline-none"
          />
        </div>
      </div>

      {/* 4. GRID DE TARJETAS DE PLANOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {planosFiltrados.length === 0 ? (
          <div className="col-span-full rounded-2xl steel-card p-12 text-center">
            <Compass className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">{lang === 'en' ? 'No drawings found' : 'No se encontraron planos'}</h3>
            <p className="text-xs text-slate-500 mt-1">{lang === 'en' ? 'Try another search keyword or upload a new sheet.' : 'Prueba con otra palabra clave o agrega un plano nuevo.'}</p>
          </div>
        ) : (
          planosFiltrados.map((plano) => (
            <div
              key={plano.id}
              className={`rounded-2xl steel-card hover:shadow-md transition overflow-hidden flex flex-col justify-between ${
                plano.esModificado ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div>
                {/* VISTA PREVIA / MINIATURA DEL PLANO */}
                <div
                  onClick={() => {
                    setPlanoSeleccionado(plano);
                    setZoomLevel(1);
                    setRotacion(0);
                  }}
                  className="h-44 bg-slate-950 border-b border-slate-200 overflow-hidden relative cursor-pointer group"
                >
                  {plano.archivoThumb || plano.archivoImg ? (
                    <img
                      src={plano.archivoThumb || plano.archivoImg}
                      alt={getTitle(plano)}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : plano.esPdf ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-rose-400 p-4">
                      <FileText className="h-10 w-10 mb-2 opacity-85" />
                      <span className="text-xs font-mono font-bold text-white">{plano.codigo}</span>
                      <span className="text-[10px] text-rose-200 truncate max-w-full">
                        {plano.archivoNombre || (lang === 'en' ? 'Local PDF Sheet' : 'Plano PDF Local')}
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-cyan-400 p-4">
                      <Compass className="h-10 w-10 mb-2 opacity-60" />
                      <span className="text-xs font-mono font-bold text-white">{plano.codigo}</span>
                      <span className="text-[10px] text-cyan-300">{lang === 'en' ? 'Schematic View' : 'Vista esquemática'}</span>
                    </div>
                  )}

                  {/* Etiqueta flotante con código de plano */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900/90 text-white font-mono text-[11px] font-black shadow border border-slate-700">
                      {plano.codigo}
                    </span>
                    {plano.esModificado && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-bold text-[10px] shadow inline-flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> {lang === 'en' ? 'Field Modified' : 'Modificado en Obra'}
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1.5">
                    <Eye className="h-4 w-4" /> {lang === 'en' ? 'Inspect Drawing' : 'Inspeccionar Plano'}
                  </div>
                </div>

                <div className="p-4">
                  {/* Título y Disciplina */}
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                      {getTitle(plano)}
                    </h3>
                  </div>

                  {plano.esModificado && (
                    <div className="mb-2 p-2 rounded-lg bg-amber-100/70 border border-amber-200 text-[10px] font-bold text-amber-900 leading-tight flex items-start gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>{lang === 'en' ? 'Stair detail superseded by field modification.' : 'Ignorar escalera: Se ejecutó con modificación en obra.'}</span>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                    {getDesc(plano)}
                  </p>

                  {/* Ficha Técnica */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-400 block font-semibold">{lang === 'en' ? 'Scale:' : 'Escala:'}</span>
                      <strong className="text-slate-700">{plano.escala}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">{lang === 'en' ? 'Date:' : 'Fecha:'}</span>
                      <strong className="text-slate-700">{plano.fecha}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block font-semibold">{lang === 'en' ? 'Issued / QA:' : 'Responsable:'}</span>
                      <span className="text-slate-700 font-semibold truncate block">{plano.responsable}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {plano.archivoPdf ? (
                    <a
                      href={plano.archivoPdf}
                      download={`${plano.codigo}_${plano.titulo}.pdf`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 transition"
                    >
                      <Download className="h-3 w-3" /> PDF
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-400">IFC / SVG Vector</span>
                  )}
                  {plano.isLocalUpload && (
                    <button
                      type="button"
                      onClick={() => handleEliminarPlanoLocal(plano)}
                      title={lang === 'en' ? 'Delete local drawing' : 'Eliminar plano local'}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-800 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    setPlanoSeleccionado(plano);
                    setZoomLevel(1);
                    setRotacion(0);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-900 hover:bg-slate-800 px-3 py-1.5 text-xs font-bold text-white transition shadow-sm"
                >
                  <Eye className="h-3.5 w-3.5" /> {lang === 'en' ? 'Open Viewer' : 'Abrir Visor'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 5. VISOR INTERACTIVO DE ULTRA ALTA DEFINICIÓN (MODAL FULLSCREEN) */}
      {planoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-2 sm:p-4 backdrop-blur-md">
          <div className="w-full max-w-6xl max-h-[96vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">

            {/* BARRA SUPERIOR DEL VISOR */}
            <div className="p-3 sm:p-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-white">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-900/60 text-cyan-400 border border-cyan-700 font-mono text-xs font-black">
                  {planoSeleccionado.codigo}
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
                    {getTitle(planoSeleccionado)}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">
                    {headerProjectName} • {lang === 'en' ? 'Scale' : 'Escala'} {planoSeleccionado.escala} • {planoSeleccionado.revision}
                  </p>
                </div>
              </div>

              {/* CONTROLES DE ZOOM, ROTACIÓN Y DESCARGA */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <button
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.35, 4.0))}
                  title={lang === 'en' ? 'Zoom In' : 'Acercar (Zoom In)'}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.35, 0.75))}
                  title={lang === 'en' ? 'Zoom Out' : 'Alejar (Zoom Out)'}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setRotacion(prev => (prev + 90) % 360)}
                  title={lang === 'en' ? 'Rotate 90°' : 'Girar 90°'}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => { setZoomLevel(1); setRotacion(0); }}
                  title={lang === 'en' ? 'Reset Zoom' : 'Restablecer vista a tamaño original'}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 transition"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>

                {planoSeleccionado.archivoPdf && (
                  <a
                    href={planoSeleccionado.archivoPdf}
                    download={`${planoSeleccionado.codigo}_${planoSeleccionado.titulo}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1.5 text-xs font-bold text-white transition shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5" /> PDF
                  </a>
                )}

                <button
                  onClick={() => setPlanoSeleccionado(null)}
                  className="ml-1 p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition"
                  title={lang === 'en' ? 'Close viewer' : 'Cerrar visor'}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* AVISO DE MODIFICACIÓN EN OBRA SI ES LA ESCALERA */}
            {planoSeleccionado.esModificado && (
              <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center gap-2 shadow-inner">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  {lang === 'en'
                    ? <><strong>SITE NOTICE:</strong> This stair drawing was superseded during construction and built to an alternative field detail. Retained for record purposes only.</>
                    : <><strong>AVISO DE RESIDENCIA:</strong> Este plano de escalera fue modificado durante la ejecución y se ejecutó de otra forma según instrucciones en obra. Se mantiene únicamente como registro histórico.</>}
                </span>
              </div>
            )}

            {/* ÁREA DE VISUALIZACIÓN EN ALTA DEFINICIÓN */}
            <div className="flex-1 overflow-auto p-4 bg-slate-950 flex items-center justify-center min-h-[480px]">
              <div
                className="transition-transform duration-150 origin-center max-w-full"
                style={{
                  transform: planoSeleccionado.esPdf ? undefined : `scale(${zoomLevel}) rotate(${rotacion}deg)`,
                }}
              >
                {planoSeleccionado.esPdf && planoSeleccionado.archivoPdf ? (
                  <iframe
                    title={getTitle(planoSeleccionado)}
                    src={planoSeleccionado.archivoPdf}
                    className="w-[88vw] max-w-5xl h-[75vh] rounded-lg bg-white border border-slate-700 shadow-2xl"
                  />
                ) : planoSeleccionado.archivoImg ? (
                  <img
                    src={planoSeleccionado.archivoImg}
                    alt={getTitle(planoSeleccionado)}
                    className="max-h-[78vh] w-auto object-contain rounded-lg shadow-2xl border border-slate-700 cursor-grab active:cursor-grabbing"
                  />
                ) : (
                  <div className="p-8 text-center text-cyan-400">
                    <Compass className="h-16 w-16 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-bold text-white">{getTitle(planoSeleccionado)}</p>
                    <p className="text-xs text-slate-400">{getDesc(planoSeleccionado)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* BARRA INFERIOR DEL VISOR */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-400">
              <span className="text-[11px] text-center sm:text-left">
                {lang === 'en'
                  ? 'Use the zoom controls to inspect construction details, rebar schedules, and tolerances.'
                  : 'Usa los botones de zoom para inspeccionar detalles constructivos, armaduras y cotas milimétricas.'}
              </span>
              <button
                onClick={() => setPlanoSeleccionado(null)}
                className="w-full sm:w-auto rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-1.5 text-xs font-bold text-white transition"
              >
                {lang === 'en' ? 'Close Viewer' : 'Cerrar Visor'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. MODAL PARA INSERTAR / CARGAR NUEVO PLANO */}
      {showModalSubir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl steel-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">{lang === 'en' ? 'Upload Construction Drawing' : 'Insertar Nuevo Plano Constructivo'}</h3>
                <p className="text-xs text-slate-500">
                  {lang === 'en' ? 'Add a new sheet to the project drawing repository' : 'Agrega un nuevo plano al repositorio de obra del proyecto'}
                </p>
              </div>
              <button
                onClick={() => setShowModalSubir(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGuardarNuevoPlano} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    {lang === 'en' ? 'Sheet Code *' : 'Código de Plano *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'en' ? 'e.g. STR-03 or ARC-03' : 'Ej. EST-03 o ARQ-03'}
                    value={nuevoCodigo}
                    onChange={(e) => setNuevoCodigo(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold uppercase focus:border-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    {lang === 'en' ? 'Discipline *' : 'Disciplina *'}
                  </label>
                  <select
                    value={nuevaDisciplina}
                    onChange={(e) => setNuevaDisciplina(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-slate-800 focus:outline-none"
                  >
                    <option value="Estructural">{getDiscLabel('Estructural')}</option>
                    <option value="Arquitectónico">{getDiscLabel('Arquitectónico')}</option>
                    <option value="Hidrosanitario">{getDiscLabel('Hidrosanitario')}</option>
                    <option value="Eléctrico">{getDiscLabel('Eléctrico')}</option>
                    <option value="Acabados">{getDiscLabel('Acabados')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {lang === 'en' ? 'Drawing Title *' : 'Título del Plano *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'en' ? 'e.g. Foundation Plan & Grade Beam Schedule' : 'Ej. Planta de Cimentación y Despiece de Vigas'}
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    {lang === 'en' ? 'Revision' : 'Revisión'}
                  </label>
                  <input
                    type="text"
                    value={nuevaRevision}
                    onChange={(e) => setNuevaRevision(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    {lang === 'en' ? 'Scale' : 'Escala'}
                  </label>
                  <input
                    type="text"
                    value={nuevaEscala}
                    onChange={(e) => setNuevaEscala(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {lang === 'en' ? 'Technical Lead / Designer' : 'Responsable Técnico / Diseñador'}
                </label>
                <input
                  type="text"
                  value={nuevoResponsable}
                  onChange={(e) => setNuevoResponsable(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {lang === 'en' ? 'Technical Notes / Spec' : 'Descripción o Notas Técnicas'}
                </label>
                <textarea
                  rows={2}
                  placeholder={lang === 'en' ? 'Describe grid lines, structural details, or specs...' : 'Describe los ejes, elementos constructivos o especificaciones...'}
                  value={nuevaDescripcion}
                  onChange={(e) => setNuevaDescripcion(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-slate-800 focus:outline-none"
                />
              </div>

              {/* Subir archivo imagen o PDF privado localmente */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  {lang === 'en' ? 'Local Drawing File (PNG / JPG / PDF — Private Browser Only)' : 'Archivo del Plano (Imagen o PDF — Solo Local en Navegador)'}
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-slate-300 hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-600 transition">
                    <Upload className="h-4 w-4 text-slate-400" />
                    <span>{lang === 'en' ? 'Select image or PDF...' : 'Seleccionar imagen o PDF...'}</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf,.pdf"
                      onChange={handleArchivoSeleccionado}
                      className="hidden"
                    />
                  </label>
                  {archivoPreview && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />{' '}
                      {archivoNombre || (lang === 'en' ? 'File loaded locally' : 'Archivo cargado localmente')}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {lang === 'en'
                    ? 'Stored locally in your browser IndexedDB. Never uploaded to public repositories.'
                    : 'Se guarda únicamente en el IndexedDB privado de tu navegador. Nunca se sube a GitHub.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModalSubir(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  {lang === 'en' ? 'Cancel' : 'Cancelar'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-xs font-bold text-white hover:bg-slate-800 transition shadow-sm"
                >
                  {lang === 'en' ? 'Save Sheet to Repository' : 'Guardar Plano en Repositorio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
