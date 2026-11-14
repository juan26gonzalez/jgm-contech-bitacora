'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  HardHat, 
  Cloud, 
  Layers, 
  Radio, 
  LogOut, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Ruler, 
  Send, 
  RefreshCw, 
  Download, 
  Printer, 
  Search, 
  Sun, 
  Moon,
  CloudRain, 
  Users, 
  FileText,
  Lock,
  WifiOff,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  Compass,
  Camera,
  Upload,
  X,
  FlaskConical,
  Truck,
  Mic,
  Sparkles,
  BarChart3,
  Boxes,
  Globe,
  Building2,
  ExternalLink,
  User,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useAppPreferences } from '../lib/i18n';
import {
  convertInputToMetric,
  convertQty,
  localizeActivity,
  localizeChapter,
  localizeRoomName,
  localizeWeather,
  localizeCrew,
  localizeBitacoraObservacion,
} from '../lib/units';
import {
  DEMO_SHOWCASE_PROJECT_ID,
  DEMO_SESSION_STORAGE_KEY,
  PROYECTO_DEMO_CONFIG,
  DEMO_CATALOGO_SHOWCASE,
  DEMO_BITACORA_ROWS,
} from '../lib/demoFieldData';
import LoginGateBitacora from '../components/LoginGateBitacora';
import TabCronograma from '../components/TabCronograma';
import TabPlanos from '../components/TabPlanos';
import ModuloCalidadConcreto from '../components/ModuloCalidadConcreto';
import ModuloMixersRemisiones from '../components/ModuloMixersRemisiones';
import ModuloComparativaCantidades from '../components/ModuloComparativaCantidades';
import ModuloAlmacenMateriales from '../components/ModuloAlmacenMateriales';
import ModuloSstCampo from '../components/ModuloSstCampo';
import CopilotoVozIA from '../components/CopilotoVozIA';
import ModalEvidenciaFoto from '../components/ModalEvidenciaFoto';
import ModalReporteEjecutivo from '../components/ModalReporteEjecutivo';
import { guardarEvidenciaEnDB, obtenerEvidenciasDeDB } from '../components/evidenciasDB';

// =============================================================================
// CONFIGURACIÓN DE SUPABASE
// =============================================================================
const SUPABASE_URL = "https://ktxbonxgrnpzearsgvtc.supabase.co";
const SUPABASE_KEY = "sb_publishable_VUiAXSbX0Snwe-jvO4yEgA_8WLCK0Do";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// =============================================================================
// CONFIGURACIÓN DE PROYECTOS EN CAMPO (SELECTOR BITÁCORA)
// =============================================================================
const PROYECTOS_BITACORA = {
  mezzanine: {
    id: 'mezzanine',
    nombre: 'Mezzanine 3 Niveles',
    tituloBanner: 'MEZZANINE 3 NIVELES - SEDE ADMON BARRANQUILLA',
    subtitulo1Label: 'Contratista',
    subtitulo1Valor: 'INGENDES S.A.S.',
    subtitulo2Label: 'Interventoría',
    subtitulo2Valor: 'DOLMEN S.A.',
    defaultFrente: 'Cimentación (Zapatas / Vigas / Foso)',
  },
  casa_mendoza: {
    id: 'casa_mendoza',
    nombre: 'Remodelación Casa Mendoza',
    tituloBanner: 'REMODELACIÓN CASA MENDOZA - SABANALARGA (REVIT 1.1)',
    subtitulo1Label: 'Contratante',
    subtitulo1Valor: 'FAMILIA MENDOZA',
    subtitulo2Label: 'Dir. Técnica',
    subtitulo2Valor: 'DIRECCIÓN DE OBRA CIVIL',
    defaultFrente: 'Casa Mendoza - Habitación Mamá',
  },
};

// =============================================================================
// CATÁLOGO HOMOLOGADO WBS (SIN EMOJIS • ADAPTADO A MÉTRICO / IMPERIAL)
// =============================================================================
const ACTIVIDADES_CATALOGO = [
  // Cimentación y Estructura
  { nombre: "Construcción de plantilla de concreto", capitulo: "CIMENTACIÓN Y ESTRUCTURA", unidad: "m³", meta: 15.00, desp: 5, proyectos: ['mezzanine'] },
  { nombre: "Concreto en zapatas y cimentación", capitulo: "CIMENTACIÓN Y ESTRUCTURA", unidad: "m³", meta: 3.50, desp: 7, proyectos: ['mezzanine'] },
  { nombre: "Concreto en columnas estructurales", capitulo: "CIMENTACIÓN Y ESTRUCTURA", unidad: "m³", meta: 2.80, desp: 7, proyectos: ['mezzanine'] },
  { nombre: "Concreto en vigas de amarre y aéreas", capitulo: "CIMENTACIÓN Y ESTRUCTURA", unidad: "m³", meta: 3.20, desp: 7, proyectos: ['mezzanine'] },
  // Mampostería
  { nombre: "Muros en mampostería de bloques de concreto", capitulo: "MAMPOSTERÍA Y CERRAMIENTOS", unidad: "m²", meta: 120.00, metaCasaMendoza: 227.89, desp: 5, proyectos: ['mezzanine', 'casa_mendoza'] },
  // Acabados
  { nombre: "Plantilla de concreto e=7cm (Casa Mendoza)", capitulo: "ACABADOS Y REVESTIMIENTOS", unidad: "m²", meta: 110.00, desp: 5, proyectos: ['casa_mendoza'] },
  { nombre: "Pañete y mortero de revoco en muros", capitulo: "ACABADOS Y REVESTIMIENTOS", unidad: "m²", meta: 240.00, metaCasaMendoza: 455.78, desp: 7, proyectos: ['mezzanine', 'casa_mendoza'] },
  { nombre: "Estuco y pintura vinílica en muros", capitulo: "ACABADOS Y REVESTIMIENTOS", unidad: "m²", meta: 240.00, metaCasaMendoza: 455.78, desp: 5, proyectos: ['mezzanine', 'casa_mendoza'] },
  { nombre: "Instalación de piso cerámico / enchape", capitulo: "ACABADOS Y REVESTIMIENTOS", unidad: "m²", meta: 80.00, metaCasaMendoza: 110.00, desp: 7, proyectos: ['mezzanine', 'casa_mendoza'] },
  { nombre: "Enchape de pared cerámica / porcelanato (Cocina/Baño)", capitulo: "ACABADOS Y REVESTIMIENTOS", unidad: "m²", meta: 45.00, desp: 8, proyectos: ['casa_mendoza'] },
  { nombre: "Instalación de cielo raso", capitulo: "ACABADOS Y REVESTIMIENTOS", unidad: "m²", meta: 80.00, metaCasaMendoza: 86.65, desp: 5, proyectos: ['mezzanine', 'casa_mendoza'] },
  { nombre: "Instalación de aislamiento termoacústico Frescasa Eco 2-1/2\"", capitulo: "ACABADOS Y REVESTIMIENTOS", unidad: "m²", meta: 86.65, desp: 5, proyectos: ['casa_mendoza'] },
  { nombre: "Instalación de guardaescobas", capitulo: "ACABADOS Y REVESTIMIENTOS", unidad: "ml", meta: 20.00, desp: 5, proyectos: ['mezzanine'] },
  // Cubiertas
  { nombre: "Montaje de cubierta en Eternit", capitulo: "CUBIERTAS", unidad: "m²", meta: 150.00, metaCasaMendoza: 132.05, desp: 5, proyectos: ['mezzanine', 'casa_mendoza'] },
  // Carpintería e Instalaciones
  { nombre: "Instalación de puertas y ventanas", capitulo: "CARPINTERÍA E INSTALACIONES", unidad: "und", meta: 10.00, metaCasaMendoza: 8.00, desp: 0, proyectos: ['mezzanine', 'casa_mendoza'] },
  { nombre: "Instalación de puertas interiores y baño", capitulo: "CARPINTERÍA E INSTALACIONES", unidad: "und", meta: 4.00, metaCasaMendoza: 7.00, desp: 0, proyectos: ['mezzanine', 'casa_mendoza'] },
  { nombre: "Instalación de aparatos sanitarios y lavaplatos", capitulo: "CARPINTERÍA E INSTALACIONES", unidad: "und", meta: 3.00, desp: 0, proyectos: ['mezzanine'] },
  { nombre: "Red de tubería hidrosanitaria PVC", capitulo: "CARPINTERÍA E INSTALACIONES", unidad: "ml", meta: 18.00, desp: 5, proyectos: ['mezzanine'] }
];

const DEMO_ACTIVIDADES_CATALOGO = DEMO_CATALOGO_SHOWCASE.map((item) => ({
  nombre: item.id,
  capitulo: item.capitulo,
  unidad: item.unidad,
  meta: item.cantidadPresupuesto,
  desp: 5,
  proyectos: [DEMO_SHOWCASE_PROJECT_ID],
}));

const MAP_DEMO_INITIAL_RECORDS = () =>
  DEMO_BITACORA_ROWS.map((row) => {
    const metaMatch = DEMO_CATALOGO_SHOWCASE.find((c) => c.id === row.actividad);
    return {
      id: row.id,
      fecha: row.fecha,
      actividad: row.actividad,
      unidad: metaMatch?.unidad || 'und',
      cantidad: row.cantidad_ejecutada,
      desperdicio: 5,
      clima: row.clima,
      cuadrilla: row.cuadrilla,
      observaciones: row.observaciones,
      foto: row.evidencia_foto,
      isDemoRow: true,
    };
  });

export default function Home() {
  const {
    lang,
    setLang,
    currency,
    setCurrency,
    darkTheme,
    toggleTheme,
    rates,
    fxLive,
    formatQty,
    unitLabel,
  } = useAppPreferences();

  // Proyecto Activo ('mezzanine' | 'casa_mendoza' | 'demo_showcase')
  const [proyectoActivo, setProyectoActivo] = useState('mezzanine');
  const [isDemo, setIsDemo] = useState(false);

  // Pestaña Activa ('bitacora', 'cronograma', 'planos')
  const [activeTab, setActiveTab] = useState('bitacora');

  // Estado de Autenticación
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Estado del Formulario
  const [fecha, setFecha] = useState('');
  const [ubicacionFrente, setUbicacionFrente] = useState('Cimentación (Zapatas / Vigas / Foso)');
  const [actividadSeleccionada, setActividadSeleccionada] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [desperdicio, setDesperdicio] = useState(5);
  const [clima, setClima] = useState('Soleado');
  const [cuadrilla, setCuadrilla] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculadora dimensional
  const [showCalc, setShowCalc] = useState(false);
  const [calcLargo, setCalcLargo] = useState('');
  const [calcAncho, setCalcAncho] = useState('');
  const [calcAlto, setCalcAlto] = useState('');
  const [calcPiezas, setCalcPiezas] = useState(1);

  // Datos y filtros
  const [registros, setRegistros] = useState([]);
  const [loadingRegistros, setLoadingRegistros] = useState(false);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('todos'); // 'todos', 'hoy', 'semana'

  // Red y Modo Offline
  const [isOnline, setIsOnline] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState([]);

  // Evidencias Fotográficas y Reportes
  const [fotoPreview, setFotoPreview] = useState(null);
  const [fotoInfo, setFotoInfo] = useState(null);
  const [evidenciasFotos, setEvidenciasFotos] = useState({});
  const [selectedEvidencia, setSelectedEvidencia] = useState(null);
  const [showReporteModal, setShowReporteModal] = useState(false);
  const [estamparGPS, setEstamparGPS] = useState(true);

  // Copiloto de Voz
  const handleDatosVoz = (datos) => {
    if (datos.cantidad) setCantidad(datos.cantidad);
    if (datos.actividad) setActividadSeleccionada(datos.actividad);
    if (datos.desperdicio !== undefined) setDesperdicio(datos.desperdicio);
    if (datos.clima) setClima(datos.clima);
    if (datos.cuadrilla) setCuadrilla(datos.cuadrilla);
    if (datos.observaciones) setObservaciones(datos.observaciones);
  };

  // Obtener geolocalización actual (o fallback a Barranquilla, Colombia)
  const obtenerCoordenadasGPS = () => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              lat: pos.coords.latitude.toFixed(4),
              lon: pos.coords.longitude.toFixed(4),
              alt: pos.coords.altitude ? Math.round(pos.coords.altitude) : 18
            });
          },
          () => {
            resolve({ lat: '10.9878', lon: '-74.7889', alt: 18 });
          },
          { timeout: 3500 }
        );
      } else {
        resolve({ lat: '10.9878', lon: '-74.7889', alt: 18 });
      }
    });
  };

  // ===========================================================================
  // EFECTOS INICIALES & MODO DEMO SANDBOX
  // ===========================================================================
  const enterDemoSession = () => {
    try {
      localStorage.setItem(DEMO_SESSION_STORAGE_KEY, 'true');
    } catch {}
    setIsDemo(true);
    setUser({ id: 'demo-readonly', email: 'guest.demo@jgmcontech.com', isDemo: true });
    setProyectoActivo(DEMO_SHOWCASE_PROJECT_ID);
    setUbicacionFrente('Zona A — Pórticos & Cimentación');
    setRegistros(MAP_DEMO_INITIAL_RECORDS());
    setLoginError('');
    setLoadingAuth(false);
  };

  useEffect(() => {
    setFecha(new Date().toISOString().split('T')[0]);

    // Verificar sesión inicial Supabase vs Demo Sandbox
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        try {
          localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
          const savedProj = localStorage.getItem('jgm_bitacora_proyecto_activo');
          if (savedProj === 'mezzanine' || savedProj === 'casa_mendoza') {
            setProyectoActivo(savedProj);
            setUbicacionFrente(PROYECTOS_BITACORA[savedProj].defaultFrente);
          }
        } catch {}
        setIsDemo(false);
        setUser(session.user);
        setLoadingAuth(false);
      } else {
        let isDemoSaved = false;
        try {
          isDemoSaved = localStorage.getItem(DEMO_SESSION_STORAGE_KEY) === 'true';
        } catch {}
        if (isDemoSaved) {
          enterDemoSession();
        } else {
          setUser(null);
          setIsDemo(false);
          setLoadingAuth(false);
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        try {
          localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
        } catch {}
        setIsDemo(false);
        setUser(session.user);
      } else {
        let isDemoSaved = false;
        try {
          isDemoSaved = localStorage.getItem(DEMO_SESSION_STORAGE_KEY) === 'true';
        } catch {}
        if (!isDemoSaved) {
          setUser(null);
          setIsDemo(false);
        }
      }
      setLoadingAuth(false);
    });

    // Control de red offline/online
    setIsOnline(navigator.onLine);
    const handleOnline = () => {
      setIsOnline(true);
      sincronizarColaOffline();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const colaGuardada = JSON.parse(localStorage.getItem('jgm_offline_queue') || '[]');
    setOfflineQueue(colaGuardada);

    obtenerEvidenciasDeDB().then((dbEvidencias) => {
      try {
        const localFotos = JSON.parse(localStorage.getItem('jgm_evidencias_fotos') || '{}');
        const combinadas = { ...localFotos, ...dbEvidencias };
        setEvidenciasFotos(combinadas);
      } catch (e) {
        setEvidenciasFotos(dbEvidencias || {});
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cargar datos cuando el usuario real esté autenticado (Demo usa sandbox local)
  useEffect(() => {
    if (user && !isDemo) {
      cargarRegistros();

      const channel = supabase
        .channel('jgm_realtime_bitacora')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bitacora_obra' }, () => {
          cargarRegistros(true);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, isDemo]);

  // ===========================================================================
  // MÉTODOS DE BASE DE DATOS Y AUTENTICACIÓN
  // ===========================================================================
  const handleLogin = async (credsOrEvent) => {
    let emailVal = '';
    let passVal = '';
    if (credsOrEvent?.preventDefault) {
      credsOrEvent.preventDefault();
    } else if (credsOrEvent) {
      emailVal = credsOrEvent.email || '';
      passVal = credsOrEvent.password || '';
    }
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailVal.trim(),
        password: passVal,
      });
      if (error) throw error;
      try {
        localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
      } catch {}
      setIsDemo(false);
      setProyectoActivo('mezzanine');
      setUbicacionFrente(PROYECTOS_BITACORA.mezzanine.defaultFrente);
      setUser(data.user);
    } catch (err) {
      setLoginError(err.message || (lang === 'en' ? 'Sign in failed' : 'Error al iniciar sesión'));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (isDemo) {
      try {
        localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
      } catch {}
      setIsDemo(false);
      setUser(null);
      setRegistros([]);
      return;
    }
    const msg = lang === 'en' ? 'Do you want to sign out?' : '¿Deseas cerrar tu sesión?';
    if (confirm(msg)) {
      await supabase.auth.signOut();
      setUser(null);
    }
  };

  const cargarRegistros = async (silencioso = false) => {
    if (isDemo) {
      setRegistros(MAP_DEMO_INITIAL_RECORDS());
      return;
    }
    if (!silencioso) setLoadingRegistros(true);
    try {
      const { data, error } = await supabase
        .from('bitacora_obra')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setRegistros(data || []);
    } catch (err) {
      console.error('Error al cargar registros:', err);
    } finally {
      if (!silencioso) setLoadingRegistros(false);
    }
  };

  // ===========================================================================
  // CÁLCULOS REACTIVOS Y AISLAMIENTO POR PROYECTO
  // ===========================================================================
  const proyectoActualInfo = useMemo(() => {
    if (isDemo || proyectoActivo === DEMO_SHOWCASE_PROJECT_ID) {
      return {
        id: DEMO_SHOWCASE_PROJECT_ID,
        nombre: PROYECTO_DEMO_CONFIG.nombre,
        tituloBanner:
          lang === 'en'
            ? 'NORTHBRIDGE CORPORATE HUB — ISO 19650 BIM 5D SHOWCASE'
            : 'NORTHBRIDGE CORPORATE HUB — SHOWCASE BIM 5D (DEMO)',
        subtitulo1Label: lang === 'en' ? 'Client' : 'Contratante',
        subtitulo1Valor: PROYECTO_DEMO_CONFIG.cliente,
        subtitulo2Label: lang === 'en' ? 'Engineering' : 'Ingeniería',
        subtitulo2Valor: lang === 'en' ? 'JGM ConTech Engineering Team' : 'Equipo de Ingeniería JGM ConTech',
        defaultFrente: 'Zona A — Pórticos & Cimentación',
      };
    }
    return PROYECTOS_BITACORA[proyectoActivo] || PROYECTOS_BITACORA.mezzanine;
  }, [isDemo, proyectoActivo, lang]);

  const handleCambiarProyecto = (nextId) => {
    if (isDemo) return;
    if (!PROYECTOS_BITACORA[nextId]) return;
    setProyectoActivo(nextId);
    setUbicacionFrente(PROYECTOS_BITACORA[nextId].defaultFrente);
    setActividadSeleccionada('');
    try {
      localStorage.setItem('jgm_bitacora_proyecto_activo', nextId);
    } catch {}
  };

  const registrosDelProyecto = useMemo(() => {
    if (isDemo || proyectoActivo === DEMO_SHOWCASE_PROJECT_ID) {
      return registros;
    }
    return registros.filter((r) => {
      const actRaw = String(r.actividad || '');
      const actTxt = actRaw.toLowerCase();
      if (actTxt.includes('msproject_sync')) return false;

      if (proyectoActivo === 'casa_mendoza') {
        return actTxt.includes('mendoza') || actTxt.includes('sabanalarga') || actTxt.includes('bim_takeoff');
      }
      const rowId = Number(r.id || 0);
      return (
        (rowId <= 50 && !actTxt.includes('mendoza') && !actTxt.includes('sabanalarga') && !actRaw.trim().startsWith('[')) ||
        actTxt.includes('mezzanine') ||
        actTxt.includes('dolmen') ||
        actTxt.includes('ingendes')
      );
    });
  }, [registros, proyectoActivo, isDemo]);

  const actividadesDisponiblesProyecto = useMemo(() => {
    if (isDemo || proyectoActivo === DEMO_SHOWCASE_PROJECT_ID) {
      return DEMO_ACTIVIDADES_CATALOGO;
    }
    return ACTIVIDADES_CATALOGO.filter(
      (a) => !a.proyectos || a.proyectos.includes(proyectoActivo)
    );
  }, [proyectoActivo, isDemo]);

  const mapaAcumulados = useMemo(() => {
    const mapa = {};
    registrosDelProyecto.forEach((r) => {
      const cant = parseFloat(r.cantidad) || 0;
      mapa[r.actividad] = (mapa[r.actividad] || 0) + cant;
    });
    return mapa;
  }, [registrosDelProyecto]);

  const actividadInfo = useMemo(() => {
    return actividadesDisponiblesProyecto.find((a) => a.nombre === actividadSeleccionada);
  }, [actividadSeleccionada, actividadesDisponiblesProyecto]);

  // Auto-ajustar desperdicio sugerido al elegir actividad
  const handleSelectActividad = (e) => {
    const val = e.target.value;
    setActividadSeleccionada(val);
    const info = actividadesDisponiblesProyecto.find((a) => a.nombre === val);
    if (info) {
      setDesperdicio(info.desp);
    }
  };

  // Cálculos de alerta en tiempo real
  const esCasaMendozaProyecto = proyectoActivo === 'casa_mendoza';
  const esCasaMendozaFrente = ubicacionFrente.startsWith('Casa Mendoza - ');
  const casaMendozaRoomTag = esCasaMendozaFrente
    ? ubicacionFrente.replace('Casa Mendoza - ', '').trim()
    : '';
  const acumuladoActual = useMemo(() => {
    if (!actividadSeleccionada) return 0;
    if (esCasaMendozaProyecto) {
      return registrosDelProyecto.reduce((acc, r) => {
        const act = String(r.actividad || '');
        if (act.includes('BIM_TAKEOFF')) return acc;
        if (act.includes(actividadSeleccionada)) {
          return acc + (parseFloat(r.cantidad) || 0);
        }
        return acc;
      }, 0);
    }
    return mapaAcumulados[actividadSeleccionada] || 0;
  }, [actividadSeleccionada, esCasaMendozaProyecto, mapaAcumulados, registrosDelProyecto]);

  const unidadActividad = actividadInfo?.unidad || 'und';
  const metaActual =
    esCasaMendozaProyecto && actividadInfo?.metaCasaMendoza !== undefined
      ? actividadInfo.metaCasaMendoza
      : actividadInfo?.meta || 0;
  const cantidadInputNum = parseFloat(cantidad) || 0;
  const cantidadNum = convertInputToMetric(cantidadInputNum, unidadActividad, lang);
  const totalProyectado = acumuladoActual + cantidadNum;
  const pctProyectado = metaActual > 0 ? (totalProyectado / metaActual) * 100 : 0;
  const isOverBudget = metaActual > 0 && totalProyectado > metaActual;
  const excesoCantidad = totalProyectado - metaActual;

  // Calculadora dimensional reactiva (m en ES / ft en EN -> calcula en unidad visual activa)
  useEffect(() => {
    const l = parseFloat(calcLargo) || 0;
    const a = parseFloat(calcAncho) || 0;
    const h = parseFloat(calcAlto) || 0;
    const p = parseInt(calcPiezas) || 1;

    let total = 0;
    if (l > 0 && a > 0 && h > 0) {
      total = l * a * h * p;
      // En EN (ft * ft * ft = ft3), si la actividad es m3/yd3 convertimos a yd3 (1 yd3 = 27 ft3)
      if (lang === 'en' && (unidadActividad === 'm³' || unidadActividad === 'm3')) {
        total = total / 27;
      }
    } else if (l > 0 && a > 0 && h === 0) {
      total = l * a * p;
    } else if (l > 0 && a === 0 && h === 0) {
      total = l * p;
    }

    if (total > 0) {
      setCantidad(total.toFixed(2));
    }
  }, [calcLargo, calcAncho, calcAlto, calcPiezas, lang, unidadActividad]);

  // Función robusta de compresión de imagen compatible con celulares + Estampado Forense GPS
  const comprimirImagen = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawData = event.target.result;
        const img = new Image();
        img.onload = async () => {
          try {
            const maxWidth = 800;
            const maxHeight = 600;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            if (estamparGPS) {
              const gps = await obtenerCoordenadasGPS();
              const ahora = new Date();
              const locale = lang === 'en' ? 'en-US' : 'es-CO';
              const fechaStr = ahora.toLocaleDateString(locale);
              const horaStr = ahora.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' });

              const bannerHeight = Math.max(52, Math.round(height * 0.13));
              const bannerY = height - bannerHeight;

              ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
              ctx.fillRect(0, bannerY, width, bannerHeight);

              ctx.fillStyle = '#10b981';
              ctx.fillRect(0, bannerY, width, 3);

              const fontSize = Math.max(9, Math.round(width * 0.022));
              ctx.font = `bold ${fontSize}px sans-serif`;
              ctx.fillStyle = '#ffffff';

              const line1Left = `GPS ${gps.lat}° N, ${gps.lon}° W • ALT: ${lang === 'en' ? Math.round(gps.alt * 3.28084) + 'ft' : gps.alt + 'm'}`;
              const line2Left = `${fechaStr} ${horaStr} • JGM CONTECH`;
              ctx.fillText(line1Left, 12, bannerY + fontSize + 6);

              ctx.font = `normal ${fontSize - 1}px sans-serif`;
              ctx.fillStyle = '#94a3b8';
              ctx.fillText(line2Left, 12, bannerY + (fontSize * 2) + 12);

              if (width > 440) {
                ctx.font = `bold ${fontSize - 1}px sans-serif`;
                ctx.fillStyle = '#38bdf8';
                const line1Right = String(proyectoActualInfo.nombre || 'PROJECT SITE').toUpperCase().slice(0, 32);
                const line2Right = `${proyectoActualInfo.subtitulo1Valor} • ISO 19650`.slice(0, 38);
                const m1 = ctx.measureText(line1Right);
                const m2 = ctx.measureText(line2Right);
                ctx.fillText(line1Right, width - m1.width - 12, bannerY + fontSize + 6);
                ctx.font = `normal ${fontSize - 2}px sans-serif`;
                ctx.fillStyle = '#cbd5e1';
                ctx.fillText(line2Right, width - m2.width - 12, bannerY + (fontSize * 2) + 12);
              }
            }

            const dataUrl = canvas.toDataURL('image/jpeg', 0.65);
            const approxKb = Math.round((dataUrl.length * 3) / 4 / 1024);
            resolve({ dataUrl, kb: approxKb });
          } catch (e) {
            console.warn('Canvas compresión omitida, usando raw:', e);
            resolve({ dataUrl: rawData, kb: Math.round(file.size / 1024) });
          }
        };
        img.onerror = () => {
          resolve({ dataUrl: rawData, kb: Math.round(file.size / 1024) });
        };
        img.src = rawData;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const handleFotoSeleccionada = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const res = await comprimirImagen(file);
    if (res && res.dataUrl) {
      setFotoPreview(res.dataUrl);
      setFotoInfo({
        nombre: file.name,
        kb: res.kb
      });
    }
  };

  const handleAdjuntarFotoARegistroExistente = async (recordId, file) => {
    if (!file) return;
    const res = await comprimirImagen(file);
    if (!res || !res.dataUrl) return;

    const reg = registros.find(r => r.id === recordId) || {};
    const evidenciaActualizada = {
      id: recordId,
      fecha: reg.fecha || new Date().toISOString().split('T')[0],
      actividad: reg.actividad || 'Actividad de Obra',
      unidad: reg.unidad || 'und',
      cantidad: reg.cantidad || 0,
      desperdicio: reg.desperdicio || 0,
      ubicacion: reg.ubicacion || 'Frente Principal',
      foto: res.dataUrl
    };

    const nuevasEvidencias = {
      ...evidenciasFotos,
      [recordId]: evidenciaActualizada,
      [String(recordId)]: evidenciaActualizada
    };
    setEvidenciasFotos(nuevasEvidencias);

    if (!isDemo) {
      await guardarEvidenciaEnDB(evidenciaActualizada);
      try {
        localStorage.setItem('jgm_evidencias_fotos', JSON.stringify(nuevasEvidencias));
      } catch (e) {
        console.warn('Límite en localStorage:', e);
      }
    }

    alert(
      lang === 'en'
        ? 'Photo successfully linked to field activity.'
        : 'Fotografía vinculada exitosamente a la actividad.'
    );
  };

  // ===========================================================================
  // ENVÍO DE DATOS (DEMO SANDBOX / ONLINE SUPABASE / OFFLINE)
  // ===========================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!actividadSeleccionada) {
      alert(lang === 'en' ? 'Please select a construction activity.' : 'Seleccione una actividad de obra.');
      return;
    }
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      alert(lang === 'en' ? 'Enter a valid quantity greater than zero.' : 'Ingrese una cantidad válida mayor a cero.');
      return;
    }

    const actividadFinal =
      esCasaMendozaFrente
        ? `[casa_mendoza] [${casaMendozaRoomTag}] ${actividadSeleccionada}`
        : esCasaMendozaProyecto
        ? `[casa_mendoza] ${actividadSeleccionada}`
        : actividadSeleccionada;

    const payload = {
      fecha: fecha,
      actividad: actividadFinal,
      unidad: actividadInfo?.unidad || 'und',
      cantidad: Number(cantidadNum.toFixed(4)),
      desperdicio: parseFloat(desperdicio) || 0
    };

    const evidenciaCompleta = {
      fecha: payload.fecha,
      actividad: payload.actividad,
      unidad: payload.unidad,
      cantidad: payload.cantidad,
      desperdicio: payload.desperdicio,
      proyectoId: proyectoActivo,
      ubicacion: ubicacionFrente,
      clima: clima,
      cuadrilla: cuadrilla,
      observaciones: observaciones,
      foto: fotoPreview
    };

    // Sandbox Demo (nunca escribe en Supabase ni localStorage de producción)
    if (isDemo) {
      const demoId = Date.now();
      const newDemoRow = {
        ...payload,
        id: demoId,
        ubicacion: ubicacionFrente,
        clima,
        cuadrilla: cuadrilla || (lang === 'en' ? 'Showcase Demo Crew' : 'Cuadrilla Demo'),
        observaciones: observaciones || ubicacionFrente,
        foto: fotoPreview || null,
        isDemoRow: true,
      };
      setRegistros((prev) => [newDemoRow, ...prev]);
      if (fotoPreview || observaciones || cuadrilla) {
        setEvidenciasFotos((prev) => ({
          ...prev,
          [demoId]: { ...evidenciaCompleta, id: demoId },
        }));
      }
      limpiarFormulario();
      alert(
        lang === 'en'
          ? `DEMO SANDBOX: Local preview log added (${formatQty(payload.cantidad, payload.unidad)} ${unitLabel(payload.unidad)}) without writing to cloud database.`
          : `SANDBOX DEMO: Registro simulado en memoria local (${formatQty(payload.cantidad, payload.unidad)} ${unitLabel(payload.unidad)}), sin modificar Supabase.`
      );
      return;
    }

    // Modo Offline
    if (!navigator.onLine) {
      const offlineId = `off-${Date.now()}`;
      const nuevaCola = [...offlineQueue, { ...payload, id: offlineId, ...evidenciaCompleta }];
      setOfflineQueue(nuevaCola);
      localStorage.setItem('jgm_offline_queue', JSON.stringify(nuevaCola));
      
      if (fotoPreview) {
        const itemEv = { ...evidenciaCompleta, id: offlineId };
        const nuevasEvidencias = { ...evidenciasFotos, [offlineId]: itemEv };
        setEvidenciasFotos(nuevasEvidencias);
        await guardarEvidenciaEnDB(itemEv);
        try {
          localStorage.setItem('jgm_evidencias_fotos', JSON.stringify(nuevasEvidencias));
        } catch (e) {}
      }

      limpiarFormulario();
      alert(
        lang === 'en'
          ? 'OFFLINE MODE: Entry & photo backed up on device. Will sync when online.'
          : 'MODO OFFLINE: Registro y foto guardados en tu dispositivo. Se sincronizarán al recuperar señal.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.from('bitacora_obra').insert([payload]).select();
      if (error) throw error;

      const recordId = data && data[0] ? data[0].id : Date.now();
      const itemEv = { ...evidenciaCompleta, id: recordId };

      if (fotoPreview || observaciones || cuadrilla) {
        const nuevasEvidencias = {
          ...evidenciasFotos,
          [recordId]: itemEv,
          [String(recordId)]: itemEv
        };
        setEvidenciasFotos(nuevasEvidencias);
        await guardarEvidenciaEnDB(itemEv);
        try {
          localStorage.setItem('jgm_evidencias_fotos', JSON.stringify(nuevasEvidencias));
        } catch (e) {
          console.warn('Límite de almacenamiento alcanzado:', e);
        }
      }

      await cargarRegistros(true);
      limpiarFormulario();
      alert(
        lang === 'en'
          ? `Entry saved cleanly! ${localizeActivity(payload.actividad, lang)}: ${formatQty(payload.cantidad, payload.unidad)} ${unitLabel(payload.unidad)}`
          : `Registro y evidencia guardados exitosamente.\n${payload.actividad}: ${formatQty(payload.cantidad, payload.unidad)} ${unitLabel(payload.unidad)}`
      );
    } catch (err) {
      console.error('Error al registrar:', err);
      const offlineId = `off-${Date.now()}`;
      const nuevaCola = [...offlineQueue, { ...payload, id: offlineId, ...evidenciaCompleta }];
      setOfflineQueue(nuevaCola);
      localStorage.setItem('jgm_offline_queue', JSON.stringify(nuevaCola));
      limpiarFormulario();
      alert(
        lang === 'en'
          ? 'Unstable connection: Entry & photo backed up locally on device.'
          : 'Conexión inestable: Se respaldó en tu dispositivo con la foto adjunta.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const sincronizarColaOffline = async () => {
    if (isDemo) return;
    const cola = JSON.parse(localStorage.getItem('jgm_offline_queue') || '[]');
    if (cola.length === 0) return;

    const registrosCompatibles = cola.map(c => ({
      fecha: c.fecha,
      actividad: c.actividad,
      unidad: c.unidad,
      cantidad: c.cantidad,
      desperdicio: c.desperdicio
    }));

    try {
      const { error } = await supabase.from('bitacora_obra').insert(registrosCompatibles);
      if (!error) {
        localStorage.removeItem('jgm_offline_queue');
        setOfflineQueue([]);
        await cargarRegistros(true);
        alert(
          lang === 'en'
            ? `Synced ${cola.length} pending offline log(s).`
            : `Sincronizados ${cola.length} registro(s) pendientes offline.`
        );
      }
    } catch (e) {
      console.error('Error sincronizando cola offline:', e);
    }
  };

  const limpiarFormulario = () => {
    setCantidad('');
    setCalcLargo('');
    setCalcAncho('');
    setCalcAlto('');
    setObservaciones('');
    setCuadrilla('');
    setFotoPreview(null);
    setFotoInfo(null);
  };

  // ===========================================================================
  // FILTRADO Y EXPORTACIÓN
  // ===========================================================================
  const registrosFiltrados = useMemo(() => {
    const hoyStr = new Date().toISOString().split('T')[0];
    const busq = filtroTexto.toLowerCase();

    const colaDelProyecto = isDemo
      ? []
      : offlineQueue
          .filter((item) => {
            if (item.proyectoId) return item.proyectoId === proyectoActivo;
            const txt = String(item.actividad || '').toLowerCase();
            return proyectoActivo === 'casa_mendoza'
              ? txt.includes('mendoza') || txt.includes('sabanalarga')
              : !txt.includes('mendoza') && !txt.includes('sabanalarga');
          })
          .map((item) => ({ ...item, isOffline: true, id: item.id || `off-${Math.random()}` }));

    const todos = [...colaDelProyecto, ...registrosDelProyecto];

    return todos.filter((item) => {
      const localizedAct = localizeActivity(item.actividad || '', lang).toLowerCase();
      const coincide =
        (item.actividad || '').toLowerCase().includes(busq) ||
        localizedAct.includes(busq) ||
        (item.fecha || '').toLowerCase().includes(busq);
      if (!coincide) return false;

      if (filtroFecha === 'hoy') return item.fecha === hoyStr;
      if (filtroFecha === 'semana') {
        const diff = (new Date() - new Date(item.fecha)) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      }
      return true;
    });
  }, [registrosDelProyecto, offlineQueue, proyectoActivo, filtroTexto, filtroFecha, isDemo, lang]);

  const exportarCSV = () => {
    if (registrosDelProyecto.length === 0) {
      alert(lang === 'en' ? 'No records available to export.' : 'No hay datos de este proyecto para exportar.');
      return;
    }
    let csv =
      lang === 'en'
        ? '\uFEFFDate,Activity,Unit,Net Qty,Waste (%)\n'
        : '\uFEFFFecha,Actividad,Unidad,Cantidad,Desperdicio (%)\n';
    registrosDelProyecto.forEach((r) => {
      const actOut = localizeActivity(r.actividad, lang).replace(/"/g, '""');
      const unitOut = unitLabel(r.unidad);
      const qtyOut = convertQty(r.cantidad, r.unidad, lang).toFixed(2);
      csv += `"${r.fecha}","${actOut}","${unitOut}",${qtyOut},${r.desperdicio || 0}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bitacora_${proyectoActivo}_${lang.toUpperCase()}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // ===========================================================================
  // RENDERIZADO: PANTALLA DE LOGIN O APLICACIÓN PRINCIPAL
  // ===========================================================================
  if (loadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex items-center gap-3">
          <HardHat className="h-8 w-8 animate-bounce text-emerald-400" />
          <span className="text-lg font-bold tracking-wide">
            {lang === 'en' ? 'Loading JGM ConTech...' : 'Cargando JGM ConTech...'}
          </span>
        </div>
      </div>
    );
  }

  // VISTA 1: LOGIN SEGURO + ACCESO DEMO INTERACTIVO
  if (!user) {
    return (
      <LoginGateBitacora
        onLogin={handleLogin}
        onEnterDemo={enterDemoSession}
        loadingAuth={isLoggingIn}
        authError={loginError}
      />
    );
  }

  const fxTooltip = fxLive
    ? `Live FX • 1 USD = $${rates.USD.toLocaleString('es-CO')} COP | 1 EUR = $${rates.EUR.toLocaleString('es-CO')} COP`
    : `Ref FX • 1 USD = $${rates.USD.toLocaleString('es-CO')} COP | 1 EUR = $${rates.EUR.toLocaleString('es-CO')} COP`;

  // VISTA 2: APLICACIÓN PRINCIPAL (REACT + TAILWIND CSS)
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      
      {/* BANNER OFFLINE */}
      {(!isOnline || offlineQueue.length > 0) && !isDemo && (
        <div className="mb-4 flex items-center justify-between rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs font-semibold text-amber-800 shadow-sm no-print">
          <div className="flex items-center gap-2">
            <WifiOff className="h-4 w-4" />
            <span>
              {!isOnline
                ? lang === 'en'
                  ? 'Offline Mode: Entries are saved locally on your device and will upload once online.'
                  : 'Modo Sin Conexión: Los registros se respaldan en tu dispositivo y subirán a Supabase al recuperar señal.'
                : lang === 'en'
                ? `Syncing ${offlineQueue.length} queued record(s) to cloud...`
                : `Sincronizando ${offlineQueue.length} registro(s) pendientes con Supabase...`}
            </span>
          </div>
          <span className="rounded-full bg-amber-200 px-2.5 py-0.5 text-amber-900 font-bold">
            {offlineQueue.length} {lang === 'en' ? 'queued' : 'en cola'}
          </span>
        </div>
      )}

      {/* ENCABEZADO OFICIAL DE IMPRESIÓN */}
      <div className="hidden print-only text-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold uppercase text-slate-900">
          {lang === 'en' ? 'Official Daily Field Log & Site Report' : 'Acta y Memoria de Bitácora Diaria de Obra'}
        </h2>
        <p className="text-xs text-slate-600">
          {lang === 'en' ? 'PROJECT' : 'PROYECTO'}: {proyectoActualInfo.tituloBanner} • {proyectoActualInfo.subtitulo1Label.toUpperCase()}: {proyectoActualInfo.subtitulo1Valor} • {proyectoActualInfo.subtitulo2Label.toUpperCase()}: {proyectoActualInfo.subtitulo2Valor}
        </p>
      </div>

      {/* TARJETA DE CABECERA Y ESTADO DEL PROYECTO */}
      <div className="rounded-2xl steel-card p-5 border-t-8 border-t-slate-900 mb-5 no-print">
        
        {/* BARRA SUPERIOR DE ESTADO, PREFERENCIAS GLOBALES Y USUARIO */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-300/80">
          <div className="flex items-center gap-3">
            <img
              src="/logo-mark.png"
              alt="JGM ConTech"
              className="w-11 h-11 rounded-xl border border-slate-300 shadow-md shrink-0"
            />
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                JGM ConTech
              </h1>
              <p className="text-xs font-semibold text-slate-600">
                {lang === 'en'
                  ? 'Civil Field Operations & QA Capture'
                  : 'Gestión de Obra Civil & Captura en Campo'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <a
              href="https://jagm2000-jgmcontech.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full steel-btn-primary px-3 py-1 text-xs font-bold"
              title={lang === 'en' ? 'Open BIM 5D Management Control Center' : 'Abrir Centro de Control Gerencial BIM 5D'}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>{lang === 'en' ? 'BIM 5D Mgmt App' : 'App Gerencia BIM'}</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            {/* Switcher ES / EN */}
            <div
              className="inline-flex items-center rounded-full bg-slate-200/80 border border-slate-300 p-0.5 text-[11px] font-black"
              title={lang === 'en' ? 'Language & Imperial Units' : 'Idioma y Sistema Métrico'}
            >
              <Globe className="h-3.5 w-3.5 text-slate-600 mx-1.5" />
              <button
                type="button"
                onClick={() => setLang('es')}
                className={`px-2 py-0.5 rounded-full transition ${
                  lang === 'es' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded-full transition ${
                  lang === 'en' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>

            {/* Switcher Divisa COP / USD / EUR con FX */}
            <div
              className="inline-flex items-center rounded-full bg-slate-200/80 border border-slate-300 p-0.5 text-[11px] font-black"
              title={fxTooltip}
            >
              {['COP', 'USD', 'EUR'].map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setCurrency(curr)}
                  className={`px-2 py-0.5 rounded-full transition ${
                    currency === curr
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            {/* Toggle Tema Oscuro / Claro */}
            <button
              type="button"
              onClick={toggleTheme}
              title={darkTheme ? (lang === 'en' ? 'Light theme' : 'Tema claro') : (lang === 'en' ? 'Dark theme' : 'Tema oscuro')}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white p-1.5 text-slate-700 hover:bg-slate-100 transition"
            >
              {darkTheme ? <Sun className="h-3.5 w-3.5 text-amber-500" /> : <Moon className="h-3.5 w-3.5" />}
            </button>

            {isDemo ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-black text-amber-800 border border-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                {lang === 'en' ? 'DEMO (READ-ONLY)' : 'DEMO (SOLO LECTURA)'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <Cloud className="h-3.5 w-3.5" /> Supabase
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
              <User className="h-3.5 w-3.5 text-slate-500" />
              {isDemo ? 'demo-guest' : user.email?.split('@')[0]}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              {isDemo
                ? lang === 'en'
                  ? 'Sign In'
                  : 'Ingresar'
                : lang === 'en'
                ? 'Sign Out'
                : 'Salir'}
            </button>
          </div>
        </div>

        {/* SELECTOR DE PROYECTO ACTIVO EN CAMPO */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 bg-slate-200/70 border border-slate-300/80 rounded-xl p-2">
          <div className="flex items-center gap-2 px-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
              {lang === 'en' ? 'Active Project:' : 'Proyecto en Curso:'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {isDemo ? (
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg text-xs font-extrabold transition flex items-center gap-1.5 steel-btn-primary text-white shadow-sm"
              >
                <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>{PROYECTO_DEMO_CONFIG.nombre}</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleCambiarProyecto('mezzanine')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition flex items-center gap-1.5 ${
                    proyectoActivo === 'mezzanine'
                      ? 'steel-btn-primary text-white shadow-sm'
                      : 'bg-white/90 text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Mezzanine 3 Niveles</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCambiarProyecto('casa_mendoza')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition flex items-center gap-1.5 ${
                    proyectoActivo === 'casa_mendoza'
                      ? 'bg-emerald-700 text-white shadow-sm border border-emerald-800'
                      : 'bg-white/90 text-slate-700 border border-slate-300 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Casa Mendoza (BIM)</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* ETIQUETA DEL PROYECTO (Cápsula Gunmetal CNC) */}
        <div className="mt-3 rounded-xl steel-panel-dark p-3.5 text-xs text-slate-200 flex flex-wrap justify-between items-center gap-2">
          <div>
            {lang === 'en' ? 'Project:' : 'Proyecto:'}{' '}
            <strong className="text-white">{proyectoActualInfo.tituloBanner}</strong>
          </div>
          <div className="text-slate-300">
            {proyectoActualInfo.subtitulo1Label}:{' '}
            <strong className="text-white">{proyectoActualInfo.subtitulo1Valor}</strong> |{' '}
            {proyectoActualInfo.subtitulo2Label}:{' '}
            <strong className="text-white">{proyectoActualInfo.subtitulo2Valor}</strong>
          </div>
        </div>
      </div>

      {/* PESTAÑAS PRINCIPALES DE NAVEGACIÓN (SIN EMOJIS) */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3 overflow-x-auto no-print">
        <button
          type="button"
          onClick={() => setActiveTab('bitacora')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'bitacora'
              ? 'steel-btn-primary text-white shadow-sm'
              : 'steel-card text-slate-700 hover:text-slate-950'
          }`}
        >
          <FileText className="h-4 w-4 text-emerald-400" />
          <span>{lang === 'en' ? 'Field Log' : 'Bitácora de Campo'}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'bitacora' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
          }`}>
            {registrosDelProyecto.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cronograma')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'cronograma'
              ? 'steel-btn-primary text-white shadow-sm'
              : 'steel-card text-slate-700 hover:text-slate-950'
          }`}
        >
          <CalendarDays className="h-4 w-4 text-emerald-400" />
          <span>{lang === 'en' ? '4D Schedule' : 'Cronograma de Obra (4D)'}</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700">
            {lang === 'en' ? 'Critical Path' : 'Ruta Crítica'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('planos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'planos'
              ? 'steel-btn-primary text-white shadow-sm'
              : 'steel-card text-slate-700 hover:text-slate-950'
          }`}
        >
          <Compass className="h-4 w-4 text-cyan-400" />
          <span>{lang === 'en' ? 'Drawings & IFC' : 'Planos Constructivos'}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'planos' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
          }`}>
            {isDemo
              ? lang === 'en'
                ? '3 IFC Sheets'
                : '3 Planos IFC'
              : lang === 'en'
              ? '7 Approved'
              : '7 Aprobados'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('calidad')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'calidad'
              ? 'steel-btn-primary text-white shadow-sm'
              : 'steel-card text-slate-700 hover:text-slate-950'
          }`}
        >
          <FlaskConical className="h-4 w-4 text-sky-400" />
          <span>{lang === 'en' ? 'Concrete QA & Breaks' : 'Calidad & Cilindros'}</span>
          <span className="rounded-full px-1.5 py-0.5 text-[10px] font-black bg-slate-200 text-slate-900">
            {lang === 'en' ? 'ASTM / NSR-10' : 'NSR-10'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mixers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'mixers'
              ? 'steel-btn-primary text-white shadow-sm'
              : 'steel-card text-slate-700 hover:text-slate-950'
          }`}
        >
          <Truck className="h-4 w-4 text-amber-400" />
          <span>{lang === 'en' ? 'Ready-Mix Tickets' : 'Mixers & Remisiones'}</span>
          <span className="rounded-full px-1.5 py-0.5 text-[10px] font-black bg-amber-100 text-amber-900">
            {lang === 'en' ? 'ASTM C94' : 'NTC 3318'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cantidades')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'cantidades'
              ? 'steel-btn-primary text-white shadow-sm'
              : 'steel-card text-slate-700 hover:text-slate-950'
          }`}
        >
          <BarChart3 className="h-4 w-4 text-indigo-400" />
          <span>{lang === 'en' ? 'Contract Quantities' : 'Cantidades de Obra'}</span>
          <span className="rounded-full px-1.5 py-0.5 text-[10px] font-black bg-slate-200 text-slate-900">
            {lang === 'en' ? 'BOQ vs Actual' : 'Contratado vs Ejecutado'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('almacen')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'almacen'
              ? 'steel-btn-primary text-white shadow-sm'
              : 'steel-card text-slate-700 hover:text-slate-950'
          }`}
        >
          <Boxes className="h-4 w-4 text-teal-400" />
          <span>{lang === 'en' ? 'Warehouse & Tools' : 'Almacén, Insumos & Herramientas'}</span>
          <span className="rounded-full px-1.5 py-0.5 text-[10px] font-black bg-slate-200 text-slate-900">
            {lang === 'en' ? 'Kardex & Crib' : 'Bodega & Pañol'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sst')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'sst'
              ? 'steel-btn-primary text-white shadow-sm'
              : 'steel-card text-slate-700 hover:text-slate-950'
          }`}
        >
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>{lang === 'en' ? 'Field Safety (HSE)' : 'Seguridad & SST'}</span>
          <span className="rounded-full px-1.5 py-0.5 text-[10px] font-black bg-emerald-100 text-emerald-900">
            {lang === 'en' ? 'PTAR / OSHA' : 'PTAR / Res. 4272'}
          </span>
        </button>
      </div>

      {/* VISTA 1: BITÁCORA DE CAPTURA */}
      {activeTab === 'bitacora' && (
        <>
          {/* TARJETA PRINCIPAL DEL FORMULARIO */}
          <div className="rounded-2xl steel-card p-6 mb-6 no-print">
            
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-800" />
                <h2 className="text-base font-bold text-slate-900">
                  {lang === 'en' ? 'Daily Field Progress Capture' : 'Captura Diaria de Avance en Campo'}
                </h2>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {lang === 'en' ? 'Imperial Units (US)' : 'Sistema Métrico (SI)'}
              </span>
            </div>

            {/* COPILOTO DE INTELIGENCIA ARTIFICIAL POR VOZ */}
            <CopilotoVozIA onDatosDetectados={handleDatosVoz} isDemo={isDemo} />

            {/* FORMULARIO REACT */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                {lang === 'en' ? 'Execution Date' : 'Fecha de Ejecución'}
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                {isDemo
                  ? lang === 'en'
                    ? 'Work Zone / BIM Area'
                    : 'Zona / Área BIM de Obra'
                  : esCasaMendozaProyecto
                  ? lang === 'en'
                    ? 'Zone / Room (Casa Mendoza)'
                    : 'Zona / Habitación (Casa Mendoza)'
                  : lang === 'en'
                  ? 'Level / Work Front'
                  : 'Nivel / Frente de Obra'}
              </label>
              <select
                value={ubicacionFrente}
                onChange={(e) => setUbicacionFrente(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
              >
                {isDemo ? (
                  <optgroup label={lang === 'en' ? 'NORTHBRIDGE HUB — BIM ZONES' : 'NORTHBRIDGE HUB — ZONAS BIM'}>
                    <option value="Zona A — Pórticos & Cimentación">{localizeRoomName('Zona A — Pórticos & Cimentación', lang)}</option>
                    <option value="Zona B — Envolvente & Acabados">{localizeRoomName('Zona B — Envolvente & Acabados', lang)}</option>
                    <option value="Lobby Principal">{localizeRoomName('Lobby Principal', lang)}</option>
                    <option value="Oficina Norte">{localizeRoomName('Oficina Norte', lang)}</option>
                    <option value="Sala de Juntas">{localizeRoomName('Sala de Juntas', lang)}</option>
                    <option value="Zona C — Cubierta & Carpintería">{localizeRoomName('Zona C — Cubierta & Carpintería', lang)}</option>
                    <option value="Zona General — Obra Completa">{localizeRoomName('Zona General — Obra Completa', lang)}</option>
                  </optgroup>
                ) : esCasaMendozaProyecto ? (
                  <optgroup label={lang === 'en' ? 'CASA MENDOZA — ZONES & ROOMS (REVIT 1.1)' : 'CASA MENDOZA — ZONAS Y HABITACIONES (REVIT 1.1)'}>
                    <option value="Casa Mendoza - Habitación Mamá">Casa Mendoza — {localizeRoomName('Habitación Mamá', lang)}</option>
                    <option value="Casa Mendoza - Habitación Esteban">Casa Mendoza — {localizeRoomName('Habitación Esteban', lang)}</option>
                    <option value="Casa Mendoza - Habitación Nan & I">Casa Mendoza — {localizeRoomName('Habitación Nan & I', lang)}</option>
                    <option value="Casa Mendoza - Habitación Abuelos">Casa Mendoza — {localizeRoomName('Habitación Abuelos', lang)}</option>
                    <option value="Casa Mendoza - Habitación Lisbeth">Casa Mendoza — {localizeRoomName('Habitación Lisbeth', lang)}</option>
                    <option value="Casa Mendoza - Habitación Huésped">Casa Mendoza — {localizeRoomName('Habitación Huésped', lang)}</option>
                    <option value="Casa Mendoza - Sala">Casa Mendoza — {localizeRoomName('Sala', lang)}</option>
                    <option value="Casa Mendoza - Cocina">Casa Mendoza — {localizeRoomName('Cocina', lang)}</option>
                    <option value="Casa Mendoza - Baño 1">Casa Mendoza — {localizeRoomName('Baño 1', lang)}</option>
                    <option value="Casa Mendoza - Entrada / Puerta 1">Casa Mendoza — {localizeRoomName('Entrada / Puerta 1', lang)}</option>
                    <option value="Casa Mendoza - Entrada / Puerta 2">Casa Mendoza — {localizeRoomName('Entrada / Puerta 2', lang)}</option>
                    <option value="Casa Mendoza - General">{lang === 'en' ? 'Casa Mendoza — General (Full House)' : 'Casa Mendoza — General (Toda la vivienda)'}</option>
                  </optgroup>
                ) : (
                  <optgroup label={lang === 'en' ? 'GENERAL WORK FRONTS / MEZZANINE' : 'FRENTES GENERALES / MEZZANINE'}>
                    <option value="Cimentación (Zapatas / Vigas / Foso)">{lang === 'en' ? 'Foundations (Footings / Grade Beams / Pit)' : 'Cimentación (Zapatas / Vigas / Foso)'}</option>
                    <option value="1er Piso (Ejes A1-C2)">{lang === 'en' ? '1st Floor (Grid A1-C2)' : '1er Piso (Ejes A1-C2)'}</option>
                    <option value="2do Piso (Mezzanine)">{lang === 'en' ? '2nd Floor (Mezzanine)' : '2do Piso (Mezzanine)'}</option>
                    <option value="3er Piso">{lang === 'en' ? '3rd Floor' : '3er Piso'}</option>
                    <option value="Azotea / Cubierta / Foso">{lang === 'en' ? 'Roof Deck / Slab' : 'Azotea / Cubierta / Foso'}</option>
                    <option value="General de Obra">{lang === 'en' ? 'General Site Work' : 'General de Obra'}</option>
                  </optgroup>
                )}
              </select>
              {esCasaMendozaProyecto && !isDemo && (
                <p className="mt-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-1">
                  {lang === 'en' ? 'Sync tag:' : 'Etiqueta BIM:'}{' '}
                  <code>{esCasaMendozaFrente ? `[casa_mendoza] [${casaMendozaRoomTag}]` : '[casa_mendoza]'}</code>
                </p>
              )}
            </div>
          </div>

          {/* SELECTOR DE ACTIVIDAD */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              {lang === 'en' ? `Work Activity (${proyectoActualInfo.nombre})` : `Actividad de Obra (${proyectoActualInfo.nombre})`}
            </label>
            <select
              value={actividadSeleccionada}
              onChange={handleSelectActividad}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800 font-medium text-slate-900"
            >
              <option value="" disabled>
                {lang === 'en'
                  ? `Select an activity from ${proyectoActualInfo.nombre}...`
                  : `Seleccione una actividad de ${proyectoActualInfo.nombre}...`}
              </option>
              {Array.from(new Set(actividadesDisponiblesProyecto.map((a) => a.capitulo))).map((cap) => (
                <optgroup key={cap} label={localizeChapter(cap, lang)}>
                  {actividadesDisponiblesProyecto
                    .filter((a) => a.capitulo === cap)
                    .map((a) => {
                      const metaItem =
                        esCasaMendozaProyecto && a.metaCasaMendoza !== undefined
                          ? a.metaCasaMendoza
                          : a.meta;
                      return (
                        <option key={a.nombre} value={a.nombre}>
                          {localizeActivity(a.nombre, lang)} ({unitLabel(a.unidad)} • {lang === 'en' ? 'Target' : 'Meta'}: {formatQty(metaItem, a.unidad)})
                        </option>
                      );
                    })}
                </optgroup>
              ))}
            </select>
          </div>

          {/* 1. SEMÁFORO Y CONTROL DE SOBRECOSTO */}
          {actividadSeleccionada && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                <span>
                  {lang === 'en' ? 'Cumulative Executed:' : 'Acumulado Ejecutado:'}{' '}
                  <strong className="text-slate-900">
                    {formatQty(acumuladoActual, unidadActividad)} {unitLabel(unidadActividad)}
                  </strong>{' '}
                  {lang === 'en' ? 'of' : 'de'} {formatQty(metaActual, unidadActividad)} {unitLabel(unidadActividad)}
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-black ${
                    pctProyectado > 100
                      ? 'bg-rose-100 text-rose-800'
                      : pctProyectado >= 85
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {pctProyectado.toFixed(1)}%
                </span>
              </div>

              {/* BARRA DE PROGRESO */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    pctProyectado > 100
                      ? 'bg-rose-600'
                      : pctProyectado >= 85
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(pctProyectado, 100)}%` }}
                />
              </div>

              {/* ALERTA DE MAYOR CANTIDAD */}
              {isOverBudget ? (
                <div className="flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-800">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                  <div>
                    <strong>{lang === 'en' ? 'OVERRUN / CHANGE ORDER ALERT:' : 'ALERTA DE MAYOR CANTIDAD / ADICIONAL:'}</strong>{' '}
                    {lang === 'en' ? 'Projected total' : 'Totalizará'}{' '}
                    <strong>
                      {formatQty(totalProyectado, unidadActividad)} {unitLabel(unidadActividad)} ({pctProyectado.toFixed(1)}%)
                    </strong>
                    . {lang === 'en' ? 'Exceeds contracted target by' : 'Supera la meta contratada en'} +{formatQty(excesoCantidad, unidadActividad)} {unitLabel(unidadActividad)}.
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>
                    {lang === 'en'
                      ? `Within contract: ${formatQty(metaActual - totalProyectado, unidadActividad)} ${unitLabel(unidadActividad)} remaining.`
                      : `Dentro de contrato: Quedarán ${formatQty(metaActual - totalProyectado, unidadActividad)} ${unitLabel(unidadActividad)} por ejecutar.`}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* CALCULADORA DIMENSIONAL OPCIONAL */}
          <div>
            <button
              type="button"
              onClick={() => setShowCalc(!showCalc)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 border border-dashed border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition"
            >
              <Ruler className="h-3.5 w-3.5" />
              {showCalc
                ? lang === 'en'
                  ? 'Hide Field Dimension Calculator'
                  : 'Ocultar Calculadora Dimensional'
                : lang === 'en'
                ? 'Calculate field dimensions? (L × W × H)'
                : '¿Calcular dimensiones en campo? (Largo × Ancho × Alto)'}
              {showCalc ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {showCalc && (
              <div className="mt-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {lang === 'en' ? 'Length (ft)' : 'Largo (m)'}
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={calcLargo}
                      onChange={(e) => setCalcLargo(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {lang === 'en' ? 'Width (ft)' : 'Ancho (m)'}
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={calcAncho}
                      onChange={(e) => setCalcAncho(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {lang === 'en' ? 'Height / Thick (ft)' : 'Alto/Espesor (m)'}
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={calcAlto}
                      onChange={(e) => setCalcAlto(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {lang === 'en' ? 'No. Elements' : 'Nº Piezas'}
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={calcPiezas}
                      onChange={(e) => setCalcPiezas(e.target.value)}
                      className="w-full rounded border border-slate-300 px-2.5 py-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CANTIDAD NETA Y DESPERDICIO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                <Layers className="h-3.5 w-3.5 text-emerald-600" />
                {lang === 'en'
                  ? `Net Executed Today (${unitLabel(unidadActividad)})`
                  : `Cantidad Neta Ejecutada Hoy (${unitLabel(unidadActividad)})`}
              </label>
              <input
                type="number"
                step="any"
                min="0.0001"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                placeholder={lang === 'en' ? 'e.g. 15.50' : 'Ej. 15.50'}
                inputMode="decimal"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base font-bold text-slate-900 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                {lang === 'en' ? 'Estimated Waste Allowance (%)' : 'Desperdicio Estimado (%)'}
              </label>
              <input
                type="number"
                step="any"
                min="0"
                max="100"
                value={desperdicio}
                onChange={(e) => setDesperdicio(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>
          </div>

          {/* CONDICIONES DIARIAS (CLIMA Y CUADRILLA) */}
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sun className="h-3.5 w-3.5 text-amber-500" />{' '}
              {lang === 'en' ? 'Site Weather & Quality Conditions' : 'Condiciones de Obra y Control de Calidad'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {lang === 'en' ? 'Weather' : 'Clima'}
                </label>
                <select
                  value={clima}
                  onChange={(e) => setClima(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                >
                  <option value="Soleado">{lang === 'en' ? 'Clear / Sunny (Normal)' : 'Soleado (Normal)'}</option>
                  <option value="Nublado">{lang === 'en' ? 'Overcast / Cloudy' : 'Nublado'}</option>
                  <option value="Lluvia Ligera">{lang === 'en' ? 'Light Drizzle' : 'Lluvia Ligera'}</option>
                  <option value="Lluvia Fuerte / Suspensión">{lang === 'en' ? 'Heavy Rain (Standby)' : 'Lluvia Fuerte (Suspensión)'}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {lang === 'en' ? 'Field Crew / Labor' : 'Personal / Cuadrilla'}
                </label>
                <input
                  type="text"
                  value={cuadrilla}
                  onChange={(e) => setCuadrilla(e.target.value)}
                  placeholder={lang === 'en' ? 'e.g. 1 Lead Tech + 2 Helpers' : 'Ej. 1 Oficial + 2 Ayudantes'}
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                {lang === 'en' ? 'Technical Observations' : 'Observaciones Técnicas'}
              </label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={2}
                placeholder={
                  lang === 'en'
                    ? 'e.g. Slump 5 in verified, pour completed at 3:30 PM...'
                    : 'Ej. Slump 5 pulgadas, vaciado terminado a las 3:30 PM...'
                }
                className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-normal"
              />
            </div>
          </div>

          {/* SECCIÓN DE REGISTRO FOTOGRÁFICO DE OBRA CON ESTAMPADO FORENSE GPS */}
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="h-4 w-4 text-emerald-600" />{' '}
                {lang === 'en' ? 'Forensic Photo Documentation' : 'Registro Fotográfico Forense'}
              </h3>
              <label className="inline-flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-50 transition">
                <input
                  type="checkbox"
                  checked={estamparGPS}
                  onChange={(e) => setEstamparGPS(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <MapPin className="h-3 w-3 text-emerald-600" />
                <span>
                  {lang === 'en'
                    ? 'Stamp GPS Coordinates & Forensic Date'
                    : 'Estampar Coordenadas GPS y Fecha Forense'}
                </span>
              </label>
            </div>

            {!fotoPreview ? (
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-xl bg-white hover:bg-slate-50 cursor-pointer transition group">
                <Camera className="h-7 w-7 text-slate-400 group-hover:text-slate-600 mb-1.5" />
                <span className="text-xs font-bold text-slate-700">
                  {lang === 'en' ? 'Take photo or upload site evidence' : 'Tomar foto o subir evidencia'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {lang === 'en'
                    ? 'JPG / PNG automatically compressed for mobile upload'
                    : 'JPG, PNG optimizado automáticamente para celular'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFotoSeleccionada}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-900">
                  <img src={fotoPreview} alt="Preview" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5" />{' '}
                    {lang === 'en' ? 'Photo ready to attach' : 'Foto lista para adjuntar'}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {fotoInfo?.nombre || (lang === 'en' ? 'Field photo' : 'Foto de campo')} • {fotoInfo?.kb || 50} KB ({lang === 'en' ? 'compressed' : 'comprimida'})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setFotoPreview(null); setFotoInfo(null); }}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                  title={lang === 'en' ? 'Remove photo' : 'Eliminar foto'}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* BOTÓN ENVIAR */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800 active:scale-[0.99] transition disabled:bg-slate-400 flex items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" />
            {isDemo
              ? lang === 'en'
                ? 'Simulate Entry in Demo Sandbox'
                : 'Simular Registro en Sandbox Demo'
              : isSubmitting
              ? lang === 'en'
                ? 'Syncing with Supabase...'
                : 'Sincronizando con Supabase...'
              : lang === 'en'
              ? 'Submit Entry to Cloud Database'
              : 'Enviar a Base de Datos (Supabase)'}
          </button>
        </form>

      </div>

      {/* TARJETA DE REGISTROS EN VIVO */}
      <div className="rounded-2xl steel-card p-6">
        
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100 no-print">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-600" />
              <span>
                {isDemo
                  ? lang === 'en'
                    ? `Demo Field Log Entries (${registrosFiltrados.length})`
                    : `Registros Demo de Obra (${registrosFiltrados.length})`
                  : lang === 'en'
                  ? `Cloud Field Records (${registrosFiltrados.length})`
                  : `Registros en la Nube (${registrosFiltrados.length})`}
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              {isDemo
                ? lang === 'en'
                  ? 'ISO 19650 local interactive showcase dataset'
                  : 'Historial local interactivo del proyecto showcase ISO 19650'
                : lang === 'en'
                ? 'Real-time history synced in PostgreSQL'
                : 'Historial sincronizado en PostgreSQL'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => cargarRegistros()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" /> {lang === 'en' ? 'Reload' : 'Recargar'}
            </button>
            <button
              onClick={() => setShowReporteModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition shadow-sm"
            >
              <FileText className="h-3.5 w-3.5" /> {lang === 'en' ? 'Executive Report (PDF)' : 'Informe Ejecutivo (PDF)'}
            </button>
            <button
              onClick={exportarCSV}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <Download className="h-3.5 w-3.5" /> {lang === 'en' ? 'Export CSV' : 'Exportar CSV'}
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              <Printer className="h-3.5 w-3.5" /> {lang === 'en' ? 'Print Log' : 'Imprimir Acta'}
            </button>
          </div>
        </div>

        {/* FILTROS Y BUSCADOR */}
        <div className="flex flex-wrap gap-2.5 mb-4 no-print">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              placeholder={lang === 'en' ? 'Filter by activity or date...' : 'Buscar por actividad o fecha...'}
              className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs"
            />
          </div>

          <div className="flex gap-1">
            {[
              { id: 'todos', label: lang === 'en' ? 'All' : 'Todos' },
              { id: 'hoy', label: lang === 'en' ? 'Today' : 'Hoy' },
              { id: 'semana', label: lang === 'en' ? '7 Days' : 'Semana' },
            ].map((tipo) => (
              <button
                key={tipo.id}
                onClick={() => setFiltroFecha(tipo.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  filtroFecha === tipo.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tipo.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. VISTA MÓVIL: TARJETAS RESPONSIVAS DE REGISTRO (CELULAR) */}
        <div className="block md:hidden space-y-3">
          {loadingRegistros ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              {lang === 'en' ? 'Querying cloud records...' : 'Consultando registros en Supabase...'}
            </div>
          ) : registrosFiltrados.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              {lang === 'en' ? 'No records match current filter.' : 'No hay registros disponibles con el filtro actual.'}
            </div>
          ) : (
            registrosFiltrados.map((item) => {
              const ev = evidenciasFotos[item.id] || evidenciasFotos[String(item.id)] || evidenciasFotos[item.created_at];
              const tieneFoto = Boolean(item.foto || ev?.foto || ev?.fotoSrc);
              const fotoUrl = item.foto || ev?.foto || ev?.fotoSrc;

              return (
                <div 
                  key={item.id} 
                  className="rounded-xl steel-subcard p-3.5 space-y-2.5"
                >
                  {/* Cabecera Tarjeta Móvil */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {item.fecha || '-'}
                    </span>

                    {item.isOffline ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        <Clock className="h-3 w-3" /> Offline
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        <CheckCircle2 className="h-3 w-3" /> {isDemo ? (lang === 'en' ? 'Demo QA' : 'Demo OK') : lang === 'en' ? 'Synced' : 'Nube OK'}
                      </span>
                    )}
                  </div>

                  {/* Actividad */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">
                      {localizeActivity(item.actividad, lang)}
                    </h3>
                    {item.observaciones && (
                      <p className="text-[11px] text-slate-500 mt-1">
                        {localizeBitacoraObservacion(item.observaciones, lang)}
                      </p>
                    )}
                  </div>

                  {/* Métricas: Cantidad y Desperdicio */}
                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg text-xs border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        {lang === 'en' ? 'Executed' : 'Ejecutado'}
                      </span>
                      <strong className="text-slate-900 font-black">
                        {formatQty(item.cantidad, item.unidad)} {unitLabel(item.unidad)}
                      </strong>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        {lang === 'en' ? 'Waste' : 'Desperdicio'}
                      </span>
                      <span className="text-slate-700 font-semibold">{item.desperdicio || 0}%</span>
                    </div>
                  </div>

                  {/* Evidencia Fotográfica en Móvil */}
                  <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                    {tieneFoto ? (
                      <div className="flex items-center gap-2">
                        <img 
                          src={fotoUrl} 
                          alt="Miniatura" 
                          className="h-10 w-10 rounded-lg object-cover border border-slate-300 shrink-0" 
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEvidencia({
                              ...item,
                              ...ev,
                              foto: fotoUrl
                            });
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition"
                        >
                          <Camera className="h-3.5 w-3.5" /> {lang === 'en' ? 'View Evidence' : 'Ver Evidencia'}
                        </button>
                      </div>
                    ) : (
                      <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-dashed border-slate-300 text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer transition">
                        <Camera className="h-3.5 w-3.5 text-slate-400" />
                        <span>{lang === 'en' ? '+ Attach Photo' : '+ Adjuntar Foto'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handleAdjuntarFotoARegistroExistente(item.id, e.target.files[0])}
                          className="hidden"
                        />
                      </label>
                    )}

                    <span className="text-[10px] text-slate-400">
                      ID #{item.id}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 2. VISTA ESCRITORIO: TABLA COMPLETA (MD EN ADELANTE) */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">{lang === 'en' ? 'Date' : 'Fecha'}</th>
                <th className="py-2.5 px-3">{lang === 'en' ? 'Work Activity' : 'Actividad de Obra'}</th>
                <th className="py-2.5 px-3">{lang === 'en' ? 'Unit' : 'Unidad'}</th>
                <th className="py-2.5 px-3 text-right">{lang === 'en' ? 'Net Qty' : 'Cant. Neta'}</th>
                <th className="py-2.5 px-3 text-center">{lang === 'en' ? 'Waste (%)' : 'Desp (%)'}</th>
                <th className="py-2.5 px-3 text-center">{lang === 'en' ? 'Evidence' : 'Evidencia'}</th>
                <th className="py-2.5 px-3 text-center">{lang === 'en' ? 'Status' : 'Estado'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingRegistros ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    {lang === 'en' ? 'Querying cloud records...' : 'Consultando registros en Supabase...'}
                  </td>
                </tr>
              ) : registrosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    {lang === 'en' ? 'No records available.' : 'No hay registros disponibles.'}
                  </td>
                </tr>
              ) : (
                registrosFiltrados.map((item) => {
                  const ev = evidenciasFotos[item.id] || evidenciasFotos[String(item.id)] || evidenciasFotos[item.created_at];
                  const tieneFoto = Boolean(item.foto || ev?.foto || ev?.fotoSrc);
                  const fotoUrl = item.foto || ev?.foto || ev?.fotoSrc;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                        {item.fecha || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-800 font-medium">
                        <div>{localizeActivity(item.actividad, lang)}</div>
                        {item.observaciones && (
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {localizeBitacoraObservacion(item.observaciones, lang)}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="rounded bg-slate-200/80 border border-slate-300 px-1.5 py-0.5 font-bold text-slate-800 text-[10px]">
                          {unitLabel(item.unidad)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-900">
                        {formatQty(item.cantidad, item.unidad)}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-500">
                        {item.desperdicio || 0}%
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {tieneFoto ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEvidencia({
                                ...item,
                                ...ev,
                                foto: fotoUrl
                              });
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] border border-emerald-200 transition"
                          >
                            <Camera className="h-3 w-3" /> {lang === 'en' ? 'View Photo' : 'Ver Foto'}
                          </button>
                        ) : (
                          <label className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-dashed border-slate-300 hover:bg-slate-50 text-slate-500 font-semibold text-[10px] cursor-pointer transition">
                            <Camera className="h-3 w-3" /> {lang === 'en' ? '+ Photo' : '+ Foto'}
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              onChange={(e) => handleAdjuntarFotoARegistroExistente(item.id, e.target.files[0])}
                              className="hidden"
                            />
                          </label>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {item.isOffline ? (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            <Clock className="h-3 w-3" /> Offline
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            <CheckCircle2 className="h-3 w-3" /> {isDemo ? (lang === 'en' ? 'Demo QA' : 'Demo OK') : lang === 'en' ? 'Synced' : 'Nube OK'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* FIRMAS DE IMPRESIÓN (SOLO PDF) */}
        <div className="hidden print-only mt-16 pt-8 border-t flex justify-between text-xs">
          <div className="text-center">
            <p className="border-t border-slate-400 w-48 mx-auto pt-1 font-bold">{proyectoActualInfo.subtitulo1Valor}</p>
            <p className="text-slate-500">{proyectoActualInfo.subtitulo1Label}</p>
          </div>
          <div className="text-center">
            <p className="border-t border-slate-400 w-48 mx-auto pt-1 font-bold">{proyectoActualInfo.subtitulo2Valor}</p>
            <p className="text-slate-500">{proyectoActualInfo.subtitulo2Label}</p>
          </div>
        </div>

      </div>
      </>
      )}

      {/* VISTA 2: CRONOGRAMA DE OBRA (4D) */}
      {activeTab === 'cronograma' && (
        <TabCronograma registros={registrosDelProyecto} proyectoActivo={proyectoActivo} isDemo={isDemo} />
      )}

      {/* VISTA 3: PLANOS CONSTRUCTIVOS */}
      {activeTab === 'planos' && (
        <TabPlanos proyectoActivo={proyectoActivo} isDemo={isDemo} />
      )}

      {/* VISTA 4: CONTROL DE CALIDAD Y ROTURA DE CILINDROS (NSR-10) */}
      {activeTab === 'calidad' && (
        <ModuloCalidadConcreto registros={registrosDelProyecto} isDemo={isDemo} />
      )}

      {/* VISTA 5: CONTROL DE RECEPCIÓN DE MIXERS Y REMISIONES (NTC 3318) */}
      {activeTab === 'mixers' && (
        <ModuloMixersRemisiones registros={registrosDelProyecto} isDemo={isDemo} />
      )}

      {/* VISTA 6: COMPARATIVA DE CANTIDADES CONTRATADAS VS EJECUTADAS */}
      {activeTab === 'cantidades' && (
        <ModuloComparativaCantidades registros={registrosDelProyecto} proyectoActivo={proyectoActivo} isDemo={isDemo} />
      )}

      {/* VISTA 7: ALMACÉN DE MATERIALES EN OBRA Y CONTROL KARDEX */}
      {activeTab === 'almacen' && (
        <ModuloAlmacenMateriales isDemo={isDemo} />
      )}

      {/* VISTA 8: SEGURIDAD Y SALUD EN EL TRABAJO EN CAMPO (SST / HSE) */}
      {activeTab === 'sst' && (
        <ModuloSstCampo
          proyectoActivo={proyectoActivo}
          proyectoInfo={proyectoActualInfo}
          isDemo={isDemo}
        />
      )}

      {/* MODAL DE EVIDENCIA FOTOGRÁFICA */}
      {selectedEvidencia && (
        <ModalEvidenciaFoto
          evidencia={selectedEvidencia}
          isDemo={isDemo}
          proyectoInfo={proyectoActualInfo}
          onClose={() => setSelectedEvidencia(null)}
        />
      )}

      {/* MODAL DE REPORTE EJECUTIVO Y ACTA OFICIAL (PDF) */}
      {showReporteModal && (
        <ModalReporteEjecutivo
          registros={registrosFiltrados}
          evidenciasFotos={evidenciasFotos}
          isDemo={isDemo}
          proyectoInfo={proyectoActualInfo}
          onClose={() => setShowReporteModal(false)}
        />
      )}

      <footer className="mt-8 text-center text-xs text-slate-400 no-print">
        {isDemo
          ? lang === 'en'
            ? 'JGM ConTech • ISO 19650 BIM 4D/5D Field Operations Showcase'
            : 'JGM ConTech • Plataforma Showcase de Control de Obra BIM 4D/5D'
          : lang === 'en'
          ? 'JGM ConTech • Civil Project Controls & Field Operations'
          : 'JGM ConTech • Sistema de Control de Obra Civil'}
      </footer>

    </main>
  );
}
