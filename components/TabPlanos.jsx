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
  FolderDown,
  Info
} from 'lucide-react';

// =============================================================================
// REPOSITORIO DE PLANOS OFICIALES (MEZZANINE 3 NIVELES - BARRANQUILLA)
// Aprobados para Construcción por Interventoría DOLMEN S.A. & INGENDES S.A.S.
// =============================================================================
const PLANOS_OFICIALES = [
  {
    id: "PL-E01",
    codigo: "E-01",
    titulo: "Planta de Cimentación, Zapatas, Pedestales y Cortes Generales",
    disciplina: "Estructural",
    icono: "🏗️",
    revision: "Rev. 03 (Oficial)",
    escala: "1:50",
    fecha: "16/01/2025",
    responsable: "Ing. Osnaider Paternina / Julio Alandete",
    descripcion: "Distribución de zapatas aisladas, pedestales de 0.65x0.65m, foso, vigas de cimentación y notas de concreto f'c = 24.5 MPa (NSR-10).",
    archivoImg: "/planos/E-01-cimentacion-cortes.webp",
    archivoThumb: "/planos/E-01-cimentacion-cortes_thumb.webp",
    archivoPdf: "/planos/E-01-cimentacion-cortes.pdf",
    esModificado: false
  },
  {
    id: "PL-E02",
    codigo: "E-02",
    titulo: "Detalles Estructurales 2 - Cortes de Zapatas y Vigas de Enlace",
    disciplina: "Estructural",
    icono: "🏗️",
    revision: "Rev. 03 (Oficial)",
    escala: "1:20 / 1:50",
    fecha: "16/01/2025",
    responsable: "Ing. Osnaider Paternina / Julio Alandete",
    descripcion: "Corte Zapata 1-1, Corte b Zapata 1-1, armado longitudinal y estribos de confinamiento en vigas de enlace perimetrales.",
    archivoImg: "/planos/E-02-detalles-estructurales-2.webp",
    archivoThumb: "/planos/E-02-detalles-estructurales-2_thumb.webp",
    archivoPdf: "/planos/E-02-detalles-estructurales-2.pdf",
    esModificado: false
  },
  {
    id: "PL-E03",
    codigo: "E-03",
    titulo: "Detalles Estructurales 1 - Planta General y Despiece de Pedestales",
    disciplina: "Estructural",
    icono: "🏗️",
    revision: "Rev. 03 (Oficial)",
    escala: "1:10 / 1:50",
    fecha: "16/01/2025",
    responsable: "Ing. Osnaider Paternina / Julio Alandete",
    descripcion: "Planta general de pedestales, despiece de armadura de acero corrugado, corte de zapatas 2-2 y 3-3, arranques de columnas.",
    archivoImg: "/planos/E-03-detalles-estructurales-1.webp",
    archivoThumb: "/planos/E-03-detalles-estructurales-1_thumb.webp",
    archivoPdf: "/planos/E-03-detalles-estructurales-1.pdf",
    esModificado: false
  },
  {
    id: "PL-E04",
    codigo: "E-04",
    titulo: "Plantas Estructurales - Entrepiso Nivel +3.00 y Nivel +6.30 (Mezzanine)",
    disciplina: "Estructural",
    icono: "🏢",
    revision: "Rev. 03 (Oficial)",
    escala: "1:50",
    fecha: "16/01/2025",
    responsable: "Ing. Osnaider Paternina / Julio Alandete",
    descripcion: "Vigas principales de acero IPE 300, columnas metálicas HEA 320, viguetas de entrepiso y disposición de lámina colaborante losa metaldeck.",
    archivoImg: "/planos/E-04-plantas-estructurales-nivel-3-6.webp",
    archivoThumb: "/planos/E-04-plantas-estructurales-nivel-3-6_thumb.webp",
    archivoPdf: "/planos/E-04-plantas-estructurales-nivel-3-6.pdf",
    esModificado: false
  },
  {
    id: "PL-E05",
    codigo: "E-05",
    titulo: "Plantas Estructurales - Cubierta y Arriostramientos Superiores",
    disciplina: "Estructural",
    icono: "🏠",
    revision: "Rev. 03 (Oficial)",
    escala: "1:50",
    fecha: "16/01/2025",
    responsable: "Ing. Osnaider Paternina / Julio Alandete",
    descripcion: "Planta de estructura de cubierta, correas en perfiles C, cerchas de amarre y losa metaldeck superior.",
    archivoImg: "/planos/E-05-plantas-estructurales-cubierta.webp",
    archivoThumb: "/planos/E-05-plantas-estructurales-cubierta_thumb.webp",
    archivoPdf: "/planos/E-05-plantas-estructurales-cubierta.pdf",
    esModificado: false
  },
  {
    id: "PL-E06",
    codigo: "E-06",
    titulo: "Detalles de Conexión - Uniones Viga-Columna, Pernos y Placas Base",
    disciplina: "Estructural",
    icono: "⚙️",
    revision: "Rev. 03 (Oficial)",
    escala: "1:10 / 1:20",
    fecha: "16/01/2025",
    responsable: "Ing. Osnaider Paternina / Julio Alandete",
    descripcion: "Cartelas de rigidización, pernos ASTM A325, placas base de acero de 1 pulgada, soldadura AWS D1.1 y pintura Superprotec.",
    archivoImg: "/planos/E-06-detalles-conexion-metalica.webp",
    archivoThumb: "/planos/E-06-detalles-conexion-metalica_thumb.webp",
    archivoPdf: "/planos/E-06-detalles-conexion-metalica.pdf",
    esModificado: false
  },
  {
    id: "PL-E07",
    codigo: "E-07",
    titulo: "Detalles de Escalera [MODIFICADO EN OBRA - NO APLICAR]",
    disciplina: "Estructural",
    icono: "⚠️",
    revision: "Modificado en Obra",
    escala: "1:25",
    fecha: "16/01/2025",
    responsable: "Diseño Inicial (Modificado en Ejecución)",
    descripcion: "⚠️ NOTA DEL RESIDENTE: Este plano no se ejecutó conforme al diseño original. La escalera física fue modificada y ejecutada con un diseño alternativo en obra.",
    archivoImg: "/planos/E-07-escalera-modificada.webp",
    archivoThumb: "/planos/E-07-escalera-modificada_thumb.webp",
    archivoPdf: "/planos/E-07-escalera-modificada.pdf",
    esModificado: true,
    alertaTexto: "Plano modificado en campo: la escalera se ejecutó con un diseño alternativo."
  },
  {
    id: "PL-ARQ01",
    codigo: "ARQ-01",
    titulo: "Planta Arquitectónica General - Mezzanine y Oficinas",
    disciplina: "Arquitectónico",
    icono: "🏛️",
    revision: "Rev. 02 (Aprobado)",
    escala: "1:75",
    fecha: "14/10/2026",
    responsable: "Arq. Diseñador Principal",
    descripcion: "Distribución de áreas administrativas, sala de juntas, recepción, batería de baños y circulación general.",
    tipo: "vector_arquitectura",
    esModificado: false
  },
  {
    id: "PL-HID01",
    codigo: "HID-01",
    titulo: "Redes Hidrosanitarias y Desagües de Aguas Lluvias",
    disciplina: "Hidrosanitario",
    icono: "💧",
    revision: "Rev. 01 (Vigente)",
    escala: "1:50",
    fecha: "18/10/2026",
    responsable: "Ing. Hidráulico Sanitario",
    descripcion: "Trazado de tuberías PVC Sanitaria 3\" y 4\", ventilación hidrostática, bajantes pluviales y trampa de grasas.",
    tipo: "vector_hidrosanitario",
    esModificado: false
  },
  {
    id: "PL-ELE01",
    codigo: "ELE-01",
    titulo: "Redes Eléctricas, Iluminación LED y Tomas de Fuerza",
    disciplina: "Eléctrico",
    icono: "⚡",
    revision: "Rev. 01 (Vigente)",
    escala: "1:50",
    fecha: "20/10/2026",
    responsable: "Ing. Electricista",
    descripcion: "Alimentadores principales, tablero TD-MZ, circuitos de tomas normales y reguladas, luminarias panel 60x60.",
    tipo: "vector_electrico",
    esModificado: false
  },
  {
    id: "PL-CM01",
    codigo: "CM-01",
    titulo: "Planta Arquitectónica General - Casa Mendoza 1.1",
    disciplina: "Revit BIM (Casa Mendoza)",
    icono: "🏡",
    revision: "Revit 2027 (Oficial)",
    escala: "1:50",
    fecha: "Noviembre 2026",
    responsable: "Ing. Juan González / Familia Mendoza",
    descripcion: "Planta arquitectónica general extraída directamente del modelo maestro Casa Mendoza 1.1.rvt. Mampostería, muros, pisos, áreas y distribución en Sabanalarga.",
    archivoImg: "/planos/plano_casa_mendoza.png",
    archivoThumb: "/planos/plano_casa_mendoza.png",
    archivoPdf: "/planos/plano_casa_mendoza.png",
    esModificado: false
  }
];

export default function TabPlanos() {
  const [planos, setPlanos] = useState(PLANOS_OFICIALES);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [disciplinaActiva, setDisciplinaActiva] = useState('Todas');
  
  // Modal de Visor
  const [planoSeleccionado, setPlanoSeleccionado] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotacion, setRotacion] = useState(0);

  // Modal de Subida / Inserción
  const [showModalSubir, setShowModalSubir] = useState(false);
  const [nuevoCodigo, setNuevoCodigo] = useState('');
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevaDisciplina, setNuevaDisciplina] = useState('Estructural');
  const [nuevaRevision, setNuevaRevision] = useState('Rev. 01 (Aprobado)');
  const [nuevaEscala, setNuevaEscala] = useState('1:50');
  const [nuevoResponsable, setNuevoResponsable] = useState('Ing. Juan González / INGENDES');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [archivoPreview, setArchivoPreview] = useState(null);

  // Cargar planos personalizados de localStorage si existen
  useEffect(() => {
    try {
      const guardados = localStorage.getItem('jgm_planos_constructivos_v2');
      if (guardados) {
        const parsed = JSON.parse(guardados);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPlanos(parsed);
        }
      }
    } catch (e) {
      console.error('Error cargando planos de localStorage:', e);
    }
  }, []);

  const guardarPlanosStorage = (nuevosPlanos) => {
    setPlanos(nuevosPlanos);
    try {
      localStorage.setItem('jgm_planos_constructivos_v2', JSON.stringify(nuevosPlanos));
    } catch (e) {
      console.warn('Límite en localStorage al guardar planos:', e);
    }
  };

  const handleArchivoSeleccionado = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setArchivoPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleGuardarNuevoPlano = (e) => {
    e.preventDefault();
    if (!nuevoCodigo.trim() || !nuevoTitulo.trim()) {
      alert('Por favor complete los campos obligatorios: Código y Título.');
      return;
    }

    const iconoMap = {
      'Estructural': '🏗️',
      'Arquitectónico': '🏛️',
      'Hidrosanitario': '💧',
      'Eléctrico': '⚡',
      'Acabados': '🎨'
    };

    const nuevoPlano = {
      id: `PL-${Date.now()}`,
      codigo: nuevoCodigo.trim().toUpperCase(),
      titulo: nuevoTitulo.trim(),
      disciplina: nuevaDisciplina,
      icono: iconoMap[nuevaDisciplina] || '📐',
      revision: nuevaRevision.trim(),
      escala: nuevaEscala.trim(),
      fecha: new Date().toLocaleDateString('es-CO'),
      responsable: nuevoResponsable.trim(),
      descripcion: nuevaDescripcion.trim() || 'Plano constructivo incorporado por el residente en campo.',
      archivoImg: archivoPreview,
      archivoThumb: archivoPreview,
      archivoUrl: archivoPreview,
      esModificado: false
    };

    const actualizados = [nuevoPlano, ...planos];
    guardarPlanosStorage(actualizados);

    setNuevoCodigo('');
    setNuevoTitulo('');
    setNuevaDescripcion('');
    setArchivoPreview(null);
    setShowModalSubir(false);
    alert('📐 ¡Nuevo plano agregado exitosamente al repositorio!');
  };

  // Filtrado de planos
  const planosFiltrados = useMemo(() => {
    return planos.filter((p) => {
      const matchDisc = disciplinaActiva === 'Todas' || p.disciplina === disciplinaActiva;
      const matchText = p.codigo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                        p.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                        p.descripcion.toLowerCase().includes(filtroTexto.toLowerCase());
      return matchDisc && matchText;
    });
  }, [planos, disciplinaActiva, filtroTexto]);

  const disciplinas = ['Todas', 'Estructural', 'Arquitectónico', 'Hidrosanitario', 'Eléctrico'];

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
                  Planos Constructivos Oficiales (Proyecto Dolmen)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Oficina 3 Niveles - Sede Administrativa • Interventoría DOLMEN S.A. & INGENDES S.A.S.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="/planos/PROYECTO_DOLMEN_PLANOS_COMPLETOS.pdf"
              download="PROYECTO_DOLMEN_PLANOS_COMPLETOS.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white px-3.5 py-2 text-xs font-bold transition shadow-sm"
            >
              <FolderDown className="h-4 w-4" /> Descargar Todo el Juego (PDF 13.6 MB)
            </a>

            <button
              onClick={() => setShowModalSubir(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-sm"
            >
              <Plus className="h-4 w-4" /> Agregar Plano
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
              {disc === 'Estructural' && '🏗️ '}
              {disc === 'Arquitectónico' && '🏛️ '}
              {disc === 'Hidrosanitario' && '💧 '}
              {disc === 'Eléctrico' && '⚡ '}
              {disc} ({disc === 'Todas' ? planos.length : planos.filter(p => p.disciplina === disc).length})
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
            placeholder="Buscar por código (ej. E-01, E-04), título o especificación..."
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
            <h3 className="text-base font-bold text-slate-700">No se encontraron planos</h3>
            <p className="text-xs text-slate-500 mt-1">Prueba con otra palabra clave o agrega un plano nuevo.</p>
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
                      alt={plano.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-cyan-400 p-4">
                      <Compass className="h-10 w-10 mb-2 opacity-60" />
                      <span className="text-xs font-mono font-bold text-white">{plano.codigo}</span>
                      <span className="text-[10px] text-cyan-300">Vista esquemática</span>
                    </div>
                  )}

                  {/* Etiqueta flotante con código de plano */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900/90 text-white font-mono text-[11px] font-black shadow border border-slate-700">
                      {plano.codigo}
                    </span>
                    {plano.esModificado && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-bold text-[10px] shadow">
                        ⚠️ Modificado en Obra
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1.5">
                    <Eye className="h-4 w-4" /> Inspeccionar Plano
                  </div>
                </div>

                <div className="p-4">
                  {/* Título y Disciplina */}
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                      {plano.titulo}
                    </h3>
                  </div>

                  {plano.esModificado && (
                    <div className="mb-2 p-2 rounded-lg bg-amber-100/70 border border-amber-200 text-[10px] font-bold text-amber-900 leading-tight">
                      ⚠️ Ignorar escalera: Se ejecutó con modificación en obra.
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                    {plano.descripcion}
                  </p>

                  {/* Ficha Técnica */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-400 block font-semibold">Escala:</span>
                      <strong className="text-slate-700">{plano.escala}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Fecha:</span>
                      <strong className="text-slate-700">{plano.fecha}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block font-semibold">Responsable:</span>
                      <span className="text-slate-700 font-semibold truncate block">{plano.responsable}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                {plano.archivoPdf ? (
                  <a
                    href={plano.archivoPdf}
                    download={`${plano.codigo}_${plano.titulo}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 transition"
                  >
                    <Download className="h-3 w-3" /> PDF
                  </a>
                ) : (
                  <span className="text-[10px] text-slate-400">CAD Vector</span>
                )}

                <button
                  onClick={() => {
                    setPlanoSeleccionado(plano);
                    setZoomLevel(1);
                    setRotacion(0);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-900 hover:bg-slate-800 px-3 py-1.5 text-xs font-bold text-white transition shadow-sm"
                >
                  <Eye className="h-3.5 w-3.5" /> Abrir Visor
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
                    {planoSeleccionado.titulo}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">
                    Proyecto Dolmen • Escala {planoSeleccionado.escala} • {planoSeleccionado.revision}
                  </p>
                </div>
              </div>

              {/* CONTROLES DE ZOOM, ROTACIÓN Y DESCARGA */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <button
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.35, 4.0))}
                  title="Acercar (Zoom In)"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.35, 0.75))}
                  title="Alejar (Zoom Out)"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setRotacion(prev => (prev + 90) % 360)}
                  title="Girar 90°"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => { setZoomLevel(1); setRotacion(0); }}
                  title="Restablecer vista a tamaño original"
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
                  title="Cerrar visor"
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
                  <strong>AVISO DE RESIDENCIA:</strong> Este plano de escalera fue modificado durante la ejecución y se ejecutó de otra forma según instrucciones en obra. Se mantiene únicamente como registro histórico.
                </span>
              </div>
            )}

            {/* ÁREA DE VISUALIZACIÓN EN ALTA DEFINICIÓN */}
            <div className="flex-1 overflow-auto p-4 bg-slate-950 flex items-center justify-center min-h-[480px]">
              <div 
                className="transition-transform duration-150 origin-center max-w-full"
                style={{ 
                  transform: `scale(${zoomLevel}) rotate(${rotacion}deg)`,
                }}
              >
                {planoSeleccionado.archivoImg ? (
                  <img
                    src={planoSeleccionado.archivoImg}
                    alt={planoSeleccionado.titulo}
                    className="max-h-[78vh] w-auto object-contain rounded-lg shadow-2xl border border-slate-700 cursor-grab active:cursor-grabbing"
                  />
                ) : (
                  <div className="p-8 text-center text-cyan-400">
                    <Compass className="h-16 w-16 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-bold text-white">{planoSeleccionado.titulo}</p>
                    <p className="text-xs text-slate-400">{planoSeleccionado.descripcion}</p>
                  </div>
                )}
              </div>
            </div>

            {/* BARRA INFERIOR DEL VISOR */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-400">
              <span className="text-[11px] text-center sm:text-left">
                🔍 Usa los botones de zoom para inspeccionar detalles constructivos, armaduras y cotas milimétricas.
              </span>
              <button
                onClick={() => setPlanoSeleccionado(null)}
                className="w-full sm:w-auto rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-1.5 text-xs font-bold text-white transition"
              >
                Cerrar Visor
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
                <h3 className="text-lg font-black text-slate-900">Insertar Nuevo Plano Constructivo</h3>
                <p className="text-xs text-slate-500">
                  Agrega un nuevo plano al repositorio de obra del proyecto
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
                    Código de Plano *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. EST-03 o ARQ-03"
                    value={nuevoCodigo}
                    onChange={(e) => setNuevoCodigo(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold uppercase focus:border-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Disciplina *
                  </label>
                  <select
                    value={nuevaDisciplina}
                    onChange={(e) => setNuevaDisciplina(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-slate-800 focus:outline-none"
                  >
                    <option value="Estructural">🏗️ Estructural</option>
                    <option value="Arquitectónico">🏛️ Arquitectónico</option>
                    <option value="Hidrosanitario">💧 Hidrosanitario</option>
                    <option value="Eléctrico">⚡ Eléctrico</option>
                    <option value="Acabados">🎨 Acabados</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Título del Plano *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Planta de Cimentación y Despiece de Vigas"
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Revisión
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
                    Escala
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
                  Responsable Técnico / Diseñador
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
                  Descripción o Notas Técnicas
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe los ejes, elementos constructivos o especificaciones..."
                  value={nuevaDescripcion}
                  onChange={(e) => setNuevaDescripcion(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-slate-800 focus:outline-none"
                />
              </div>

              {/* Subir archivo imagen o PDF del plano */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Archivo del Plano (Imagen / Escaneo)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-slate-300 hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-600 transition">
                    <Upload className="h-4 w-4 text-slate-400" />
                    <span>Seleccionar archivo...</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleArchivoSeleccionado}
                      className="hidden"
                    />
                  </label>
                  {archivoPreview && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Archivo cargado
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModalSubir(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-xs font-bold text-white hover:bg-slate-800 transition shadow-sm"
                >
                  Guardar Plano en Repositorio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
