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
  AlertCircle,
  FileCheck,
  Calendar,
  Building2
} from 'lucide-react';

// =============================================================================
// REPOSITORIO DE PLANOS OFICIALES (MEZZANINE 3 NIVELES - BARRANQUILLA)
// Aprobados para Construcción por Interventoría DOLMEN S.A.
// =============================================================================
const PLANOS_INICIALES = [
  {
    id: "PL-01",
    codigo: "EST-01",
    titulo: "Planta de Cimentación, Zapatas y Vigas de Amarre",
    disciplina: "Estructural",
    icono: "🏗️",
    revision: "Rev. 03 (Aprobado)",
    escala: "1:50",
    fecha: "2026-10-10",
    responsable: "Ing. Calculista Estructural",
    descripcion: "Geometría de zapatas Z1 (1.80x1.80), Z2 (2.20x2.20), foso de ascensor y vigas de cimentación VC-01 y VC-02.",
    tipo: "vector_cimentacion"
  },
  {
    id: "PL-02",
    codigo: "EST-02",
    titulo: "Planta de Estructura Metálica y Losa Metaldeck",
    disciplina: "Estructural",
    icono: "🏗️",
    revision: "Rev. 03 (Aprobado)",
    escala: "1:50",
    fecha: "2026-10-12",
    responsable: "Ing. Calculista Estructural",
    descripcion: "Disposición de columnas HEA 320, vigas principales IPE 300, vigas secundarias IPE 180 y lámina colaborante e=11cm.",
    tipo: "vector_metaldeck"
  },
  {
    id: "PL-03",
    codigo: "ARQ-01",
    titulo: "Planta Arquitectónica General - Niveles 1 y 2",
    disciplina: "Arquitectónico",
    icono: "🏛️",
    revision: "Rev. 02 (Aprobado)",
    escala: "1:75",
    fecha: "2026-10-14",
    responsable: "Arq. Diseñador Principal",
    descripcion: "Distribución de áreas administrativas, sala de juntas, recepción, batería de baños y escalera de circulación.",
    tipo: "vector_arquitectura"
  },
  {
    id: "PL-04",
    codigo: "ARQ-02",
    titulo: "Cortes Transversales y Fachadas de Cerramiento",
    disciplina: "Arquitectónico",
    icono: "🏛️",
    revision: "Rev. 02 (Aprobado)",
    escala: "1:75",
    fecha: "2026-10-15",
    responsable: "Arq. Diseñador Principal",
    descripcion: "Alturas libres de entrepiso (3.20m), detalles de mampostería en bloque No. 12, vigas cinta y alfajías de remate.",
    tipo: "vector_cortes"
  },
  {
    id: "PL-05",
    codigo: "HID-01",
    titulo: "Redes Hidrosanitarias y Desagües de Aguas Lluvias",
    disciplina: "Hidrosanitario",
    icono: "💧",
    revision: "Rev. 01 (Vigente)",
    escala: "1:50",
    fecha: "2026-10-18",
    responsable: "Ing. Hidráulico Sanitario",
    descripcion: "Trazado de tuberías PVC Sanitaria 3\" y 4\", ventilación hidrostática, bajantes pluviales y trampa de grasas.",
    tipo: "vector_hidrosanitario"
  },
  {
    id: "PL-06",
    codigo: "ELE-01",
    titulo: "Redes Eléctricas, Iluminación LED y Tomas de Fuerza",
    disciplina: "Eléctrico",
    icono: "⚡",
    revision: "Rev. 01 (Vigente)",
    escala: "1:50",
    fecha: "2026-10-20",
    responsable: "Ing. Electricista",
    descripcion: "Alimentadores principales, tablero TD-MZ, circuitos de tomas normales y reguladas, luminarias tipo panel 60x60.",
    tipo: "vector_electrico"
  },
  {
    id: "PL-07",
    codigo: "ACA-01",
    titulo: "Cuadro de Acabados, Cielo Raso y Carpinterías",
    disciplina: "Acabados",
    icono: "🎨",
    revision: "Rev. 01 (Vigente)",
    escala: "1:50",
    fecha: "2026-10-22",
    responsable: "Residencia e Interventoría",
    descripcion: "Especificaciones de piso porcelanato 60x60, cielo raso en drywall junta perdida, pintura lavable y ventanería de aluminio.",
    tipo: "vector_acabados"
  }
];

export default function TabPlanos() {
  const [planos, setPlanos] = useState(PLANOS_INICIALES);
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
      const guardados = localStorage.getItem('jgm_planos_constructivos');
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

  // Guardar en localStorage cuando se modifiquen
  const guardarPlanosStorage = (nuevosPlanos) => {
    setPlanos(nuevosPlanos);
    try {
      localStorage.setItem('jgm_planos_constructivos', JSON.stringify(nuevosPlanos));
    } catch (e) {
      console.error('Error guardando planos:', e);
    }
  };

  // Manejador de subida de archivo local
  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setArchivoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Guardar nuevo plano
  const handleGuardarNuevoPlano = (e) => {
    e.preventDefault();
    if (!nuevoCodigo.trim() || !nuevoTitulo.trim()) return;

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
      fecha: new Date().toISOString().split('T')[0],
      responsable: nuevoResponsable.trim(),
      descripcion: nuevaDescripcion.trim() || 'Plano constructivo incorporado por el residente en campo.',
      archivoUrl: archivoPreview,
      tipo: archivoPreview ? 'archivo_cargado' : 'vector_arquitectura'
    };

    const actualizados = [nuevoPlano, ...planos];
    guardarPlanosStorage(actualizados);

    // Reset formulario y cerrar modal
    setNuevoCodigo('');
    setNuevoTitulo('');
    setNuevaDescripcion('');
    setArchivoPreview(null);
    setShowModalSubir(false);
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

  // Contador por disciplina
  const disciplinas = ['Todas', 'Estructural', 'Arquitectónico', 'Hidrosanitario', 'Eléctrico', 'Acabados'];

  // Renderizador de vector arquitectónico según el plano
  const renderPlanoContenido = (plano) => {
    if (plano.archivoUrl) {
      return (
        <div className="flex items-center justify-center p-4 min-h-[480px]">
          <img 
            src={plano.archivoUrl} 
            alt={plano.titulo} 
            className="max-h-[70vh] object-contain rounded-lg shadow-lg border border-slate-700" 
          />
        </div>
      );
    }

    // Planos vectoriales paramétricos de alta resolución estilo CAD / Revit
    return (
      <div className="bg-[#0b1329] p-6 rounded-xl border border-slate-700 text-cyan-400 font-mono shadow-inner select-none overflow-hidden">
        {/* RÓTULO DE PLANO SUPERIOR */}
        <div className="flex justify-between items-center pb-3 border-b border-cyan-800/80 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 font-bold border border-cyan-700">
              {plano.codigo}
            </span>
            <span className="text-white font-bold">{plano.titulo}</span>
          </div>
          <div className="text-[11px] text-cyan-300/80">
            Escala {plano.escala} • {plano.revision}
          </div>
        </div>

        {/* DIBUJO CAD VECTORIAL DINÁMICO */}
        <div className="relative w-full h-[460px] bg-[#070c18] border border-cyan-950 rounded-lg flex items-center justify-center p-4">
          {/* Cuadrícula milimétrica de fondo */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(circle, #06b6d4 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {plano.tipo === 'vector_cimentacion' && (
            <svg viewBox="0 0 600 380" className="w-full h-full text-cyan-400">
              {/* Ejes Estructurales */}
              <line x1="60" y1="50" x2="540" y2="50" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="6,4" />
              <line x1="60" y1="190" x2="540" y2="190" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="6,4" />
              <line x1="60" y1="330" x2="540" y2="330" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="6,4" />
              
              <line x1="100" y1="30" x2="100" y2="350" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="6,4" />
              <line x1="300" y1="30" x2="300" y2="350" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="6,4" />
              <line x1="500" y1="30" x2="500" y2="350" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="6,4" />

              {/* Burbujas de Ejes */}
              <circle cx="100" cy="20" r="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5"/>
              <text x="100" y="24" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">A</text>
              <circle cx="300" cy="20" r="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5"/>
              <text x="300" y="24" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">B</text>
              <circle cx="500" cy="20" r="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5"/>
              <text x="500" y="24" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">C</text>

              <circle cx="40" cy="50" r="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5"/>
              <text x="40" y="54" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">1</text>
              <circle cx="40" cy="190" r="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5"/>
              <text x="40" y="194" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">2</text>
              <circle cx="40" cy="330" r="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5"/>
              <text x="40" y="334" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">3</text>

              {/* Zapatas Aisladas (Z1) */}
              {[
                {cx: 100, cy: 50, tag: "Z1 (1.80x1.80)"},
                {cx: 300, cy: 50, tag: "Z1 (1.80x1.80)"},
                {cx: 500, cy: 50, tag: "Z1 (1.80x1.80)"},
                {cx: 100, cy: 330, tag: "Z1 (1.80x1.80)"},
                {cx: 500, cy: 330, tag: "Z1 (1.80x1.80)"}
              ].map((z, idx) => (
                <g key={idx}>
                  <rect x={z.cx - 35} y={z.cy - 35} width="70" height="70" fill="#0369a1" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="2" />
                  <rect x={z.cx - 12} y={z.cy - 12} width="24" height="24" fill="#f8fafc" stroke="#0284c7" strokeWidth="2" />
                  <text x={z.cx} y={z.cy + 48} textAnchor="middle" fill="#93c5fd" fontSize="9">{z.tag}</text>
                </g>
              ))}

              {/* Foso Ascensor en Eje B-2 */}
              <rect x="250" y="145" width="100" height="90" fill="#dc2626" fillOpacity="0.2" stroke="#ef4444" strokeWidth="2.5" />
              <rect x="265" y="160" width="70" height="60" fill="none" stroke="#f87171" strokeWidth="1.5" strokeDasharray="4,3" />
              <text x="300" y="195" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="bold">FOSO ASCENSOR</text>
              <text x="300" y="210" textAnchor="middle" fill="#fca5a5" fontSize="9">Nivel -1.60 m</text>

              {/* Vigas de Amarre VC-01 (0.30 x 0.35) */}
              <rect x="100" y="44" width="400" height="12" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="100" y="324" width="400" height="12" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="94" y="50" width="12" height="280" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="494" y="50" width="12" height="280" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />

              {/* Cotas */}
              <line x1="100" y1="365" x2="300" y2="365" stroke="#fbbf24" strokeWidth="1" markerEnd="url(#arrow)" />
              <text x="200" y="360" textAnchor="middle" fill="#fbbf24" fontSize="10">6.00 m</text>
              <line x1="300" y1="365" x2="500" y2="365" stroke="#fbbf24" strokeWidth="1" />
              <text x="400" y="360" textAnchor="middle" fill="#fbbf24" fontSize="10">6.00 m</text>
            </svg>
          )}

          {plano.tipo === 'vector_metaldeck' && (
            <svg viewBox="0 0 600 380" className="w-full h-full">
              {/* Losa de Metaldeck e=11cm */}
              <rect x="70" y="40" width="460" height="300" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
              
              {/* Patrón de Lámina Colaborante */}
              {[80, 110, 140, 170, 200, 230, 260, 290, 320].map((y, idx) => (
                <line key={idx} x1="70" y1={y} x2="530" y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
              ))}

              {/* Vigas IPE 300 Principales */}
              <rect x="70" y="40" width="460" height="18" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
              <rect x="70" y="180" width="460" height="18" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
              <rect x="70" y="322" width="460" height="18" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
              <text x="300" y="54" textAnchor="middle" fill="#93c5fd" fontSize="10" fontWeight="bold">VIGA PRINCIPAL IPE 300</text>
              <text x="300" y="194" textAnchor="middle" fill="#93c5fd" fontSize="10" fontWeight="bold">VIGA PRINCIPAL IPE 300</text>

              {/* Columnas HEA 320 en Intersecciones */}
              {[
                {x: 70, y: 40}, {x: 300, y: 40}, {x: 530, y: 40},
                {x: 70, y: 180}, {x: 530, y: 180},
                {x: 70, y: 322}, {x: 300, y: 322}, {x: 530, y: 322}
              ].map((c, i) => (
                <g key={i}>
                  <rect x={c.x - 14} y={c.y - 6} width="28" height="30" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
                  <text x={c.x} y={c.y + 14} textAnchor="middle" fill="#78350f" fontSize="8" fontWeight="bold">HEA</text>
                </g>
              ))}

              {/* Detalle Conectores de Cortante */}
              <text x="300" y="120" textAnchor="middle" fill="#10b981" fontSize="13" fontWeight="bold">
                LÁMINA METALDECK CALIBRE 22 • MALLA ELECTROSOLDADA 15x15
              </text>
              <text x="300" y="140" textAnchor="middle" fill="#a7f3d0" fontSize="11">
                Concreto Fc=21 MPa (3000 PSI) Espesor 11 cm
              </text>
            </svg>
          )}

          {plano.tipo === 'vector_arquitectura' && (
            <svg viewBox="0 0 600 380" className="w-full h-full">
              {/* Contorno de Oficinas y Muros No. 12 */}
              <rect x="80" y="50" width="440" height="280" fill="#0f172a" stroke="#f8fafc" strokeWidth="3" />
              
              {/* Divisiones Interiores */}
              <line x1="280" y1="50" x2="280" y2="330" stroke="#f8fafc" strokeWidth="2.5" />
              <line x1="80" y1="190" x2="280" y2="190" stroke="#f8fafc" strokeWidth="2.5" />
              
              {/* Puertas con arco */}
              <path d="M 280 110 A 35 35 0 0 0 315 145" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
              <path d="M 280 250 A 35 35 0 0 0 315 285" fill="none" stroke="#fbbf24" strokeWidth="1.5" />

              {/* Letreros de Ambientes */}
              <text x="180" y="125" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="bold">OFICINA RESIDENCIA</text>
              <text x="180" y="142" textAnchor="middle" fill="#94a3b8" fontSize="10">Área: 18.50 m² • N+3.50</text>

              <text x="180" y="260" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="bold">SALA DE JUNTAS</text>
              <text x="180" y="277" textAnchor="middle" fill="#94a3b8" fontSize="10">Área: 22.00 m² • N+3.50</text>

              <text x="400" y="180" textAnchor="middle" fill="#f8fafc" fontSize="14" fontWeight="bold">ÁREA OPERATIVA MEZZANINE</text>
              <text x="400" y="200" textAnchor="middle" fill="#94a3b8" fontSize="11">Capacidad: 16 Puestos de Trabajo</text>
              <text x="400" y="220" textAnchor="middle" fill="#38bdf8" fontSize="10">Piso Porcelanato 60x60 Antideslizante</text>
            </svg>
          )}

          {plano.tipo !== 'vector_cimentacion' && plano.tipo !== 'vector_metaldeck' && plano.tipo !== 'vector_arquitectura' && (
            <div className="text-center">
              <Compass className="h-16 w-16 text-cyan-400 mx-auto mb-3 animate-spin-slow opacity-80" />
              <h4 className="text-lg font-bold text-white mb-1">{plano.titulo}</h4>
              <p className="text-xs text-cyan-300/80 max-w-md mx-auto">{plano.descripcion}</p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950 border border-cyan-800 text-xs text-cyan-400">
                <span>Rótulo Oficial: {plano.codigo}</span> • <span>{plano.escala}</span> • <span>{plano.revision}</span>
              </div>
            </div>
          )}
        </div>

        {/* PIE DE PLANO Y RÓTULO TÉCNICO */}
        <div className="mt-4 pt-3 border-t border-slate-700/80 flex flex-wrap justify-between items-center text-[11px] text-slate-400">
          <div>
            Proyecto: <strong className="text-white">MEZZANINE 3 NIVELES - BARRANQUILLA</strong> | Contratista: <strong className="text-white">INGENDES S.A.S.</strong>
          </div>
          <div>
            Aprobación: <strong className="text-emerald-400">INTERVENTORÍA DOLMEN S.A.</strong> | Fecha: <strong className="text-white">{plano.fecha}</strong>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. CABECERA DEL REPOSITORIO DE PLANOS */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-slate-900 text-white">
                <Compass className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">Planos Constructivos de Obra</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Visor de Ingeniería para Campo y Consulta de Especificaciones Técnicas (Revit / CAD)
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowModalSubir(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-sm"
            >
              <Plus className="h-4 w-4" /> Insertar / Cargar Nuevo Plano
            </button>
          </div>
        </div>

        {/* 2. CHIPS DE DISCIPLINAS */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1">
          {disciplinas.map((disc) => (
            <button
              key={disc}
              onClick={() => setDisciplinaActiva(disc)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                disciplinaActiva === disc
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {disc === 'Estructural' && '🏗️ '}
              {disc === 'Arquitectónico' && '🏛️ '}
              {disc === 'Hidrosanitario' && '💧 '}
              {disc === 'Eléctrico' && '⚡ '}
              {disc === 'Acabados' && '🎨 '}
              {disc} ({disc === 'Todas' ? planos.length : planos.filter(p => p.disciplina === disc).length})
            </button>
          ))}
        </div>
      </div>

      {/* 3. BARRA DE BÚSQUEDA */}
      <div className="rounded-xl bg-white p-3.5 shadow-sm border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código de plano (ej. EST-01), título o descripción..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
          />
        </div>
      </div>

      {/* 4. GRID DE TARJETAS DE PLANOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {planosFiltrados.length === 0 ? (
          <div className="col-span-full rounded-2xl bg-white p-12 text-center border border-slate-200">
            <Compass className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No se encontraron planos</h3>
            <p className="text-xs text-slate-500 mt-1">Prueba con otra palabra clave o agrega un plano nuevo.</p>
          </div>
        ) : (
          planosFiltrados.map((plano) => (
            <div
              key={plano.id}
              className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5">
                {/* Cabecera Tarjeta */}
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-slate-100 text-lg">
                      {plano.icono}
                    </span>
                    <div>
                      <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {plano.codigo}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 ml-2">
                        {plano.disciplina}
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3" /> {plano.revision.split(' ')[0]}
                  </span>
                </div>

                {/* Título y Descripción */}
                <h3 className="text-sm font-bold text-slate-900 mb-1.5 line-clamp-1">
                  {plano.titulo}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {plano.descripcion}
                </p>

                {/* Metadata Técnica */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-2">
                  <div>
                    <span className="text-slate-400 block">Escala:</span>
                    <strong className="text-slate-800">{plano.escala}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Fecha Aprobación:</span>
                    <strong className="text-slate-800">{plano.fecha}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block">Responsable:</span>
                    <span className="text-slate-700 font-semibold truncate block">{plano.responsable}</span>
                  </div>
                </div>
              </div>

              {/* Botón de Abrir Visor */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">
                  Aprobado para construcción
                </span>
                <button
                  onClick={() => {
                    setPlanoSeleccionado(plano);
                    setZoomLevel(1);
                    setRotacion(0);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition"
                >
                  <Eye className="h-3.5 w-3.5" /> Ver Plano
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 5. MODAL INTERACTIVO VISOR DE PLANO EN ALTA RESOLUCIÓN */}
      {planoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 md:p-6 backdrop-blur-md">
          <div className="w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
            
            {/* BARRA SUPERIOR DEL VISOR */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded bg-cyan-900/60 text-cyan-400 border border-cyan-700 font-mono text-xs font-bold">
                  {planoSeleccionado.codigo}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {planoSeleccionado.titulo}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {planoSeleccionado.disciplina} • Escala {planoSeleccionado.escala} • {planoSeleccionado.revision}
                  </p>
                </div>
              </div>

              {/* CONTROLES DE ZOOM Y PANTALLA */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
                  title="Acercar (Zoom In)"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
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
                  title="Restablecer vista"
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300 transition"
                >
                  100%
                </button>
                <button
                  onClick={() => setPlanoSeleccionado(null)}
                  className="ml-2 p-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ÁREA DE CONTENIDO CON ZOOM */}
            <div className="flex-1 overflow-auto p-4 bg-slate-950 flex items-center justify-center min-h-[400px]">
              <div 
                className="transition-transform duration-200 origin-center w-full max-w-4xl"
                style={{ 
                  transform: `scale(${zoomLevel}) rotate(${rotacion}deg)`,
                }}
              >
                {renderPlanoContenido(planoSeleccionado)}
              </div>
            </div>

            {/* BARRA INFERIOR DE ACCIONES */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span>
                💡 Usa los botones de zoom para inspeccionar cotas y armaduras en obra.
              </span>
              <button
                onClick={() => setPlanoSeleccionado(null)}
                className="rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-1.5 text-xs font-bold text-white transition"
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
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
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
                  Título / Descripción del Plano *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Detalle de Escalera Metálica de Emergencia"
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Versión / Revisión
                  </label>
                  <input
                    type="text"
                    value={nuevaRevision}
                    onChange={(e) => setNuevaRevision(e.target.value)}
                    placeholder="Rev. 01 (Aprobado)"
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
                    placeholder="1:50"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Responsable / Diseñador
                </label>
                <input
                  type="text"
                  value={nuevoResponsable}
                  onChange={(e) => setNuevoResponsable(e.target.value)}
                  placeholder="Ing. Juan González / INGENDES"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Adjuntar Archivo de Imagen / Plano (Opcional)
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleArchivoChange}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200"
                />
                {archivoPreview && (
                  <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-emerald-700 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Archivo cargado correctamente para visualización
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Notas u Observaciones de Obra
                </label>
                <textarea
                  rows="2"
                  value={nuevaDescripcion}
                  onChange={(e) => setNuevaDescripcion(e.target.value)}
                  placeholder="Notas adicionales sobre especificaciones técnicas..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModalSubir(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 shadow-sm"
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
