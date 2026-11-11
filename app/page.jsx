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
  Boxes
} from 'lucide-react';
import TabCronograma from '../components/TabCronograma';
import TabPlanos from '../components/TabPlanos';
import ModuloCalidadConcreto from '../components/ModuloCalidadConcreto';
import ModuloMixersRemisiones from '../components/ModuloMixersRemisiones';
import ModuloComparativaCantidades from '../components/ModuloComparativaCantidades';
import ModuloAlmacenMateriales from '../components/ModuloAlmacenMateriales';
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
// CATÁLOGO HOMOLOGADO WBS (15 ACTIVIDADES EXACTAS PARA BIM 4D/5D)
// =============================================================================
const ACTIVIDADES_CATALOGO = [
  // Cimentación y Estructura
  { nombre: "Construcción de plantilla de concreto", capitulo: "🏗️ CIMENTACIÓN Y ESTRUCTURA", unidad: "m³", meta: 15.00, desp: 5 },
  { nombre: "Concreto en zapatas y cimentación", capitulo: "🏗️ CIMENTACIÓN Y ESTRUCTURA", unidad: "m³", meta: 3.50, desp: 7 },
  { nombre: "Concreto en columnas estructurales", capitulo: "🏗️ CIMENTACIÓN Y ESTRUCTURA", unidad: "m³", meta: 2.80, desp: 7 },
  { nombre: "Concreto en vigas de amarre y aéreas", capitulo: "🏗️ CIMENTACIÓN Y ESTRUCTURA", unidad: "m³", meta: 3.20, desp: 7 },
  // Mampostería
  { nombre: "Muros en mampostería de bloques de concreto", capitulo: "🧱 MAMPOSTERÍA Y CERRAMIENTOS", unidad: "m²", meta: 120.00, desp: 5 },
  // Acabados
  { nombre: "Plantilla de concreto e=7cm (Casa Mendoza)", capitulo: "🎨 ACABADOS Y REVESTIMIENTOS", unidad: "m²", meta: 110.00, desp: 5 },
  { nombre: "Pañete y mortero de revoco en muros", capitulo: "🎨 ACABADOS Y REVESTIMIENTOS", unidad: "m²", meta: 240.00, desp: 7 },
  { nombre: "Estuco y pintura vinílica en muros", capitulo: "🎨 ACABADOS Y REVESTIMIENTOS", unidad: "m²", meta: 240.00, desp: 5 },
  { nombre: "Instalación de piso cerámico / enchape", capitulo: "🎨 ACABADOS Y REVESTIMIENTOS", unidad: "m²", meta: 80.00, desp: 7 },
  { nombre: "Instalación de cielo raso", capitulo: "🎨 ACABADOS Y REVESTIMIENTOS", unidad: "m²", meta: 80.00, desp: 5 },
  { nombre: "Instalación de guardaescobas", capitulo: "🎨 ACABADOS Y REVESTIMIENTOS", unidad: "ml", meta: 20.00, desp: 5 },
  // Cubiertas
  { nombre: "Montaje de cubierta en Eternit", capitulo: "🏠 CUBIERTAS", unidad: "m²", meta: 150.00, desp: 5 },
  // Carpintería e Instalaciones
  { nombre: "Instalación de puertas y ventanas", capitulo: "🚪 CARPINTERÍA E INSTALACIONES", unidad: "und", meta: 10.00, desp: 0 },
  { nombre: "Instalación de puertas interiores y baño", capitulo: "🚪 CARPINTERÍA E INSTALACIONES", unidad: "und", meta: 4.00, desp: 0 },
  { nombre: "Instalación de aparatos sanitarios y lavaplatos", capitulo: "🚪 CARPINTERÍA E INSTALACIONES", unidad: "und", meta: 3.00, desp: 0 },
  { nombre: "Red de tubería hidrosanitaria PVC", capitulo: "🚪 CARPINTERÍA E INSTALACIONES", unidad: "ml", meta: 18.00, desp: 5 }
];

export default function Home() {
  // Pestaña Activa ('bitacora', 'cronograma', 'planos')
  const [activeTab, setActiveTab] = useState('bitacora');

  // Estado de Autenticación
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
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
  // EFECTOS INICIALES
  // ===========================================================================
  useEffect(() => {
    // Inicializar fecha de hoy
    setFecha(new Date().toISOString().split('T')[0]);

    // Verificar sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoadingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
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

    // Cargar cola offline almacenada
    const colaGuardada = JSON.parse(localStorage.getItem('jgm_offline_queue') || '[]');
    setOfflineQueue(colaGuardada);

    // Cargar repositorio de evidencias fotográficas (IndexedDB + localStorage)
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

  // Cargar datos cuando el usuario esté autenticado
  useEffect(() => {
    if (user) {
      cargarRegistros();

      // Suscribirse a Supabase Realtime
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
  }, [user]);

  // ===========================================================================
  // MÉTODOS DE BASE DE DATOS Y AUTENTICACIÓN
  // ===========================================================================
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      });
      if (error) throw error;
      setUser(data.user);
    } catch (err) {
      setLoginError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('¿Deseas cerrar tu sesión?')) {
      await supabase.auth.signOut();
      setUser(null);
    }
  };

  const cargarRegistros = async (silencioso = false) => {
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
  // CÁLCULOS REACTIVOS (ACUMULADOS Y SOBRECOSTO)
  // ===========================================================================
  const mapaAcumulados = useMemo(() => {
    const mapa = {};
    registros.forEach((r) => {
      const cant = parseFloat(r.cantidad) || 0;
      mapa[r.actividad] = (mapa[r.actividad] || 0) + cant;
    });
    return mapa;
  }, [registros]);

  const actividadInfo = useMemo(() => {
    return ACTIVIDADES_CATALOGO.find((a) => a.nombre === actividadSeleccionada);
  }, [actividadSeleccionada]);

  // Auto-ajustar desperdicio sugerido al elegir actividad
  const handleSelectActividad = (e) => {
    const val = e.target.value;
    setActividadSeleccionada(val);
    const info = ACTIVIDADES_CATALOGO.find((a) => a.nombre === val);
    if (info) {
      setDesperdicio(info.desp);
    }
  };

  // Cálculos de alerta en tiempo real
  const esCasaMendozaFrente = ubicacionFrente.startsWith('Casa Mendoza - ');
  const casaMendozaRoomTag = esCasaMendozaFrente
    ? ubicacionFrente.replace('Casa Mendoza - ', '').trim()
    : '';
  const acumuladoActual = useMemo(() => {
    if (!actividadSeleccionada) return 0;
    if (esCasaMendozaFrente) {
      return registros.reduce((acc, r) => {
        const act = String(r.actividad || '');
        if (act.includes('BIM_TAKEOFF')) return acc;
        if (act.includes('[casa_mendoza]') && act.includes(actividadSeleccionada)) {
          return acc + (parseFloat(r.cantidad) || 0);
        }
        return acc;
      }, 0);
    }
    return mapaAcumulados[actividadSeleccionada] || 0;
  }, [actividadSeleccionada, esCasaMendozaFrente, mapaAcumulados, registros]);
  const metaActual = actividadInfo?.meta || 0;
  const cantidadNum = parseFloat(cantidad) || 0;
  const totalProyectado = acumuladoActual + cantidadNum;
  const pctProyectado = metaActual > 0 ? (totalProyectado / metaActual) * 100 : 0;
  const isOverBudget = metaActual > 0 && totalProyectado > metaActual;
  const excesoCantidad = totalProyectado - metaActual;

  // Calculadora dimensional reactiva
  useEffect(() => {
    const l = parseFloat(calcLargo) || 0;
    const a = parseFloat(calcAncho) || 0;
    const h = parseFloat(calcAlto) || 0;
    const p = parseInt(calcPiezas) || 1;

    let total = 0;
    if (l > 0 && a > 0 && h > 0) total = l * a * h * p;
    else if (l > 0 && a > 0 && h === 0) total = l * a * p;
    else if (l > 0 && a === 0 && h === 0) total = l * p;

    if (total > 0) {
      setCantidad(total.toFixed(2));
    }
  }, [calcLargo, calcAncho, calcAlto, calcPiezas]);

  // Función robusta de compresión de imagen compatible con celulares (Canvas + Fallback seguro) + Estampado Forense GPS
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

            // Estampado Forense GPS y Metadatos Técnicos de Obra
            if (estamparGPS) {
              const gps = await obtenerCoordenadasGPS();
              const ahora = new Date();
              const fechaStr = ahora.toLocaleDateString('es-CO');
              const horaStr = ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

              const bannerHeight = Math.max(52, Math.round(height * 0.13));
              const bannerY = height - bannerHeight;

              // Fondo traslúcido técnico estilo cámara forense
              ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
              ctx.fillRect(0, bannerY, width, bannerHeight);

              // Franja superior esmeralda
              ctx.fillStyle = '#10b981';
              ctx.fillRect(0, bannerY, width, 3);

              // Textos técnicos
              const fontSize = Math.max(9, Math.round(width * 0.022));
              ctx.font = `bold ${fontSize}px sans-serif`;
              ctx.fillStyle = '#ffffff';

              // Lado Izquierdo: Coordenadas y Fecha
              const line1Left = `📍 ${gps.lat}° N, ${gps.lon}° W • BARRANQUILLA • ALT: ${gps.alt}m`;
              const line2Left = `🕒 ${fechaStr} ${horaStr} • JGM CONTECH`;
              ctx.fillText(line1Left, 12, bannerY + fontSize + 6);

              ctx.font = `normal ${fontSize - 1}px sans-serif`;
              ctx.fillStyle = '#94a3b8';
              ctx.fillText(line2Left, 12, bannerY + (fontSize * 2) + 12);

              // Lado Derecho: Contrato e Interventoría
              if (width > 440) {
                ctx.font = `bold ${fontSize - 1}px sans-serif`;
                ctx.fillStyle = '#38bdf8';
                const line1Right = 'MEZZANINE 3 NIVELES';
                const line2Right = 'INGENDES S.A.S. • DOLMEN S.A.';
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
          // En caso de formatos especiales de celular, usar dataUrl directo
          resolve({ dataUrl: rawData, kb: Math.round(file.size / 1024) });
        };
        img.src = rawData;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  // Compresión y manejo de fotos en el formulario
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

  // Adjuntar foto a un registro ya existente en la base de datos
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

    // Guardar en almacenamiento permanente IndexedDB y LocalStorage
    await guardarEvidenciaEnDB(evidenciaActualizada);
    try {
      localStorage.setItem('jgm_evidencias_fotos', JSON.stringify(nuevasEvidencias));
    } catch (e) {
      console.warn('Límite en localStorage:', e);
    }

    alert('📸 ¡Fotografía vinculada exitosamente a la actividad!');
  };

  // ===========================================================================
  // ENVÍO DE DATOS (ONLINE / OFFLINE)
  // ===========================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!actividadSeleccionada) {
      alert('⚠️ Seleccione una actividad de obra.');
      return;
    }
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      alert('⚠️ Ingrese una cantidad válida mayor a cero.');
      return;
    }

    const actividadFinal = esCasaMendozaFrente
      ? `[casa_mendoza] [${casaMendozaRoomTag}] ${actividadSeleccionada}`
      : actividadSeleccionada;

    const payload = {
      fecha: fecha,
      actividad: actividadFinal,
      unidad: actividadInfo?.unidad || 'und',
      cantidad: cantidadNum,
      desperdicio: parseFloat(desperdicio) || 0
    };

    const evidenciaCompleta = {
      fecha: payload.fecha,
      actividad: payload.actividad,
      unidad: payload.unidad,
      cantidad: payload.cantidad,
      desperdicio: payload.desperdicio,
      ubicacion: ubicacionFrente,
      clima: clima,
      cuadrilla: cuadrilla,
      observaciones: observaciones,
      foto: fotoPreview
    };

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
      alert('📶 MODO OFFLINE: Registro y foto guardados en tu dispositivo. Se sincronizarán al recuperar señal.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.from('bitacora_obra').insert([payload]).select();
      if (error) throw error;

      const recordId = data && data[0] ? data[0].id : Date.now();
      const itemEv = { ...evidenciaCompleta, id: recordId };

      // Guardar evidencia fotográfica en IndexedDB y localStorage
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
      alert(`✅ ¡Registro y evidencia guardados exitosamente!\n${payload.actividad}: ${payload.cantidad} ${payload.unidad}`);
    } catch (err) {
      console.error('Error al registrar:', err);
      const offlineId = `off-${Date.now()}`;
      const nuevaCola = [...offlineQueue, { ...payload, id: offlineId, ...evidenciaCompleta }];
      setOfflineQueue(nuevaCola);
      localStorage.setItem('jgm_offline_queue', JSON.stringify(nuevaCola));
      limpiarFormulario();
      alert('⚠️ Conexión inestable: Se respaldó en tu dispositivo con la foto adjunta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sincronizarColaOffline = async () => {
    const cola = JSON.parse(localStorage.getItem('jgm_offline_queue') || '[]');
    if (cola.length === 0) return;

    // Extraer solo los campos compatibles con la tabla base de Supabase
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
        alert(`✅ Sincronizados ${cola.length} registro(s) que estaban pendientes offline.`);
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

    const todos = [
      ...offlineQueue.map((item) => ({ ...item, isOffline: true, id: `off-${Math.random()}` })),
      ...registros
    ];

    return todos.filter((item) => {
      const coincide =
        (item.actividad || '').toLowerCase().includes(busq) ||
        (item.fecha || '').toLowerCase().includes(busq);
      if (!coincide) return false;

      if (filtroFecha === 'hoy') return item.fecha === hoyStr;
      if (filtroFecha === 'semana') {
        const diff = (new Date() - new Date(item.fecha)) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      }
      return true;
    });
  }, [registros, offlineQueue, filtroTexto, filtroFecha]);

  const exportarCSV = () => {
    if (registros.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }
    let csv = '\uFEFFFecha,Actividad,Unidad,Cantidad,Desperdicio (%)\n';
    registros.forEach((r) => {
      csv += `"${r.fecha}","${r.actividad}","${r.unidad}",${r.cantidad},${r.desperdicio || 0}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bitacora_JGMConTech_${new Date().toISOString().split('T')[0]}.csv`;
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
          <span className="text-lg font-bold tracking-wide">Cargando JGM ConTech...</span>
        </div>
      </div>
    );
  }

  // VISTA 1: LOGIN SEGURO
  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl steel-card p-8 shadow-2xl border-t-8 border-t-slate-900">
          <div className="text-center mb-6">
            <img
              src="/logo-mark.png"
              alt="JGM ConTech"
              className="w-20 h-20 rounded-2xl shadow-lg border border-slate-300 mx-auto mb-3"
            />
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">JGM ConTech</h1>
            <p className="text-sm font-medium text-slate-600">Bitácora de Obra • Acceso Seguro</p>
          </div>

          {loginError && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700 border border-red-200">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="juanandresgm12@gmail.com"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800/10"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800/10"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full rounded-lg bg-slate-900 py-3 text-sm font-bold text-white shadow-md transition hover:bg-slate-800 disabled:bg-slate-400"
            >
              {isLoggingIn ? 'Verificando credenciales...' : 'Iniciar Sesión en Bitácora'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            JGM ConTech • Plataforma de Ingeniería Civil • Barranquilla
          </p>
        </div>
      </main>
    );
  }

  // VISTA 2: APLICACIÓN PRINCIPAL (REACT + TAILWIND CSS)
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      
      {/* BANNER OFFLINE */}
      {(!isOnline || offlineQueue.length > 0) && (
        <div className="mb-4 flex items-center justify-between rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs font-semibold text-amber-800 shadow-sm no-print">
          <div className="flex items-center gap-2">
            <WifiOff className="h-4 w-4" />
            <span>
              {!isOnline
                ? 'Modo Sin Conexión: Los registros se respaldan en tu dispositivo y subirán a Supabase al recuperar señal.'
                : `Sincronizando ${offlineQueue.length} registro(s) pendientes con Supabase...`}
            </span>
          </div>
          <span className="rounded-full bg-amber-200 px-2.5 py-0.5 text-amber-900 font-bold">
            {offlineQueue.length} en cola
          </span>
        </div>
      )}

      {/* ENCABEZADO OFICIAL DE IMPRESIÓN */}
      <div className="hidden print-only text-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold uppercase text-slate-900">Acta y Memoria de Bitácora Diaria de Obra</h2>
        <p className="text-xs text-slate-600">
          PROYECTO: MEZZANINE 3 NIVELES SEDE ADMON • CONTRATISTA: INGENDES S.A.S. • INTERVENTORÍA: DOLMEN S.A.
        </p>
      </div>

      {/* TARJETA DE CABECERA Y ESTADO DEL PROYECTO */}
      <div className="rounded-2xl steel-card p-5 border-t-8 border-t-slate-900 mb-5 no-print">
        
        {/* BARRA SUPERIOR DE ESTADO Y USUARIO */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-300/80">
          <div className="flex items-center gap-3">
            <img
              src="/logo-mark.png"
              alt="JGM ConTech"
              className="w-11 h-11 rounded-xl border border-slate-300 shadow-md shrink-0"
            />
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">JGM ConTech</h1>
              <p className="text-xs font-semibold text-slate-600">Gestión de Obra Civil &amp; Captura en Campo</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="https://jagm2000-jgmcontech.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full steel-btn-primary px-3 py-1 text-xs font-bold"
              title="Abrir Centro de Control Gerencial BIM 5D (Vercel)"
            >
              🏢 App Gerencia BIM ↗
            </a>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <Cloud className="h-3.5 w-3.5" /> Supabase
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200/80 px-3 py-1 text-xs font-bold text-slate-800 border border-slate-400/70">
              <Layers className="h-3.5 w-3.5" /> BIM 4D/5D
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
              👤 {user.email?.split('@')[0]}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition"
            >
              <LogOut className="h-3.5 w-3.5" /> Salir
            </button>
          </div>
        </div>

        {/* ETIQUETA DEL PROYECTO (Cápsula Gunmetal CNC estilo Opción 19) */}
        <div className="mt-4 rounded-xl steel-panel-dark p-3.5 text-xs text-slate-200 flex flex-wrap justify-between items-center gap-2">
          <div>
            Proyecto: <strong className="text-white">MEZZANINE 3 NIVELES - SEDE ADMON BARRANQUILLA</strong>
          </div>
          <div className="text-slate-300">
            Contratista: <strong className="text-white">INGENDES S.A.S.</strong> | Interventoría: <strong className="text-white">DOLMEN S.A.</strong>
          </div>
        </div>
      </div>

      {/* PESTAÑAS PRINCIPALES DE NAVEGACIÓN */}
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
          <FileText className="h-4 w-4" />
          <span>📝 Bitácora de Campo</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'bitacora' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
          }`}>
            {registros.length}
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
          <span>📅 Cronograma de Obra (4D)</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700">
            Ruta Crítica
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
          <span>📐 Planos Constructivos</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'planos' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
          }`}>
            7 Aprobados
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
          <FlaskConical className="h-4 w-4 text-slate-400" />
          <span>🧪 Calidad &amp; Cilindros</span>
          <span className="rounded-full px-1.5 py-0.5 text-[10px] font-black bg-slate-200 text-slate-900">
            NSR-10
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
          <span>🚚 Mixers &amp; Remisiones</span>
          <span className="rounded-full px-1.5 py-0.5 text-[10px] font-black bg-amber-100 text-amber-900">
            NTC 3318
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
          <BarChart3 className="h-4 w-4 text-slate-400" />
          <span>📊 Cantidades de Obra</span>
          <span className="rounded-full px-1.5 py-0.5 text-[10px] font-black bg-slate-200 text-slate-900">
            Contratado vs Ejecutado
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
          <Boxes className="h-4 w-4 text-slate-400" />
          <span>📦 Almacén, Insumos &amp; Herramientas</span>
          <span className="rounded-full px-1.5 py-0.5 text-[10px] font-black bg-slate-200 text-slate-900">
            Bodega & Pañol
          </span>
        </button>
      </div>

      {/* VISTA 1: BITÁCORA DE CAPTURA */}
      {activeTab === 'bitacora' && (
        <>
          {/* TARJETA PRINCIPAL DEL FORMULARIO */}
          <div className="rounded-2xl steel-card p-6 mb-6 no-print">
            
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <FileText className="h-5 w-5 text-slate-800" />
              <h2 className="text-base font-bold text-slate-900">
                Captura Diaria de Avance en Campo
              </h2>
            </div>

            {/* COPILOTO DE INTELIGENCIA ARTIFICIAL POR VOZ */}
            <CopilotoVozIA onDatosDetectados={handleDatosVoz} />

            {/* FORMULARIO REACT */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                📅 Fecha de Ejecución
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                📍 Nivel / Frente de Obra
              </label>
              <select
                value={ubicacionFrente}
                onChange={(e) => setUbicacionFrente(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
              >
                <optgroup label="🏢 FRENTES GENERALES / MEZZANINE">
                  <option value="Cimentación (Zapatas / Vigas / Foso)">Cimentación (Zapatas / Vigas / Foso)</option>
                  <option value="1er Piso (Ejes A1-C2)">1er Piso (Ejes A1-C2)</option>
                  <option value="2do Piso (Mezzanine)">2do Piso (Mezzanine)</option>
                  <option value="3er Piso">3er Piso</option>
                  <option value="Azotea / Cubierta / Foso">Azotea / Cubierta / Foso</option>
                  <option value="General de Obra">General de Obra</option>
                </optgroup>
                <optgroup label="🏡 CASA MENDOZA — HABITACIONES (REVIT 1.1)">
                  <option value="Casa Mendoza - Habitación Mamá">Casa Mendoza — Habitación Mamá</option>
                  <option value="Casa Mendoza - Habitación Esteban">Casa Mendoza — Habitación Esteban</option>
                  <option value="Casa Mendoza - Habitación Nan & I">Casa Mendoza — Habitación Nan & I</option>
                  <option value="Casa Mendoza - Habitación Abuelos">Casa Mendoza — Habitación Abuelos</option>
                  <option value="Casa Mendoza - Habitación Lisbeth">Casa Mendoza — Habitación Lisbeth</option>
                  <option value="Casa Mendoza - Habitación Huésped">Casa Mendoza — Habitación Huésped</option>
                  <option value="Casa Mendoza - Sala">Casa Mendoza — Sala</option>
                  <option value="Casa Mendoza - Cocina">Casa Mendoza — Cocina</option>
                  <option value="Casa Mendoza - Baño 1">Casa Mendoza — Baño 1</option>
                  <option value="Casa Mendoza - Entrada / Puerta 1">Casa Mendoza — Entrada / Puerta 1</option>
                  <option value="Casa Mendoza - Entrada / Puerta 2">Casa Mendoza — Entrada / Puerta 2</option>
                </optgroup>
              </select>
              {esCasaMendozaFrente && (
                <p className="mt-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-1">
                  🔗 Se registrará como <code>[casa_mendoza] [{casaMendozaRoomTag}]</code> para actualizar automáticamente la habitación en Gerencia BIM.
                </p>
              )}
            </div>
          </div>

          {/* SELECTOR DE ACTIVIDAD */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              📋 Actividad de Obra (Alineada con MS Project y Revit)
            </label>
            <select
              value={actividadSeleccionada}
              onChange={handleSelectActividad}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800 font-medium text-slate-900"
            >
              <option value="" disabled>Seleccione una actividad de la obra...</option>
              
              <optgroup label="🏗️ CIMENTACIÓN Y ESTRUCTURA">
                <option value="Construcción de plantilla de concreto">Construcción de plantilla de concreto (m³)</option>
                <option value="Concreto en zapatas y cimentación">Concreto en zapatas y cimentación (m³)</option>
                <option value="Concreto en columnas estructurales">Concreto en columnas estructurales (m³)</option>
                <option value="Concreto en vigas de amarre y aéreas">Concreto en vigas de amarre y aéreas (m³)</option>
              </optgroup>

              <optgroup label="🧱 MAMPOSTERÍA Y CERRAMIENTOS">
                <option value="Muros en mampostería de bloques de concreto">Muros en mampostería de bloques de concreto (m²)</option>
              </optgroup>

              <optgroup label="🎨 ACABADOS Y REVESTIMIENTOS">
                <option value="Plantilla de concreto e=7cm (Casa Mendoza)">Plantilla de concreto e=7cm - Casa Mendoza (m²)</option>
                <option value="Pañete y mortero de revoco en muros">Pañete y mortero de revoco en muros (m²)</option>
                <option value="Estuco y pintura vinílica en muros">Estuco y pintura vinílica en muros (m²)</option>
                <option value="Instalación de piso cerámico / enchape">Instalación de piso cerámico / enchape (m²)</option>
                <option value="Instalación de cielo raso">Instalación de cielo raso (m²)</option>
                <option value="Instalación de guardaescobas">Instalación de guardaescobas (ml)</option>
              </optgroup>

              <optgroup label="🏠 CUBIERTAS">
                <option value="Montaje de cubierta en Eternit">Montaje de cubierta en Eternit (m²)</option>
              </optgroup>

              <optgroup label="🚪 CARPINTERÍA E INSTALACIONES">
                <option value="Instalación de puertas y ventanas">Instalación de puertas y ventanas (und)</option>
                <option value="Instalación de puertas interiores y baño">Instalación de puertas interiores y baño (und)</option>
                <option value="Instalación de aparatos sanitarios y lavaplatos">Instalación de aparatos sanitarios y lavaplatos (und)</option>
                <option value="Red de tubería hidrosanitaria PVC">Red de tubería hidrosanitaria PVC (ml)</option>
              </optgroup>
            </select>
          </div>

          {/* 1. SEMÁFORO Y CONTROL DE SOBRECOSTO */}
          {actividadSeleccionada && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                <span>
                  Acumulado Ejecutado:{' '}
                  <strong className="text-slate-900">
                    {acumuladoActual.toFixed(2)} {actividadInfo?.unidad}
                  </strong>{' '}
                  de {metaActual.toFixed(2)} {actividadInfo?.unidad}
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
                    <strong>ALERTA DE MAYOR CANTIDAD / ADICIONAL:</strong> Totalizará{' '}
                    <strong>
                      {totalProyectado.toFixed(2)} {actividadInfo?.unidad} ({pctProyectado.toFixed(1)}%)
                    </strong>
                    . Supera la meta contratada en +{excesoCantidad.toFixed(2)} {actividadInfo?.unidad}.
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>
                    Dentro de contrato: Quedarán {(metaActual - totalProyectado).toFixed(2)} {actividadInfo?.unidad} por ejecutar.
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
              {showCalc ? 'Ocultar Calculadora Dimensional' : '📐 ¿Calcular dimensiones en campo? (Largo × Ancho × Alto)'}
              {showCalc ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {showCalc && (
              <div className="mt-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Largo (m)</label>
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
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Ancho (m)</label>
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
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Alto/Espesor (m)</label>
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
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Nº Piezas</label>
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                ⚡ Cantidad Neta Ejecutada Hoy
              </label>
              <input
                type="number"
                step="any"
                min="0.0001"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                placeholder="Ej. 15.50"
                inputMode="decimal"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base font-bold text-slate-900 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Desperdicio Estimado (%)
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
              <Sun className="h-3.5 w-3.5 text-amber-500" /> Condiciones de Obra y Control de Calidad
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Clima</label>
                <select
                  value={clima}
                  onChange={(e) => setClima(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                >
                  <option value="Soleado">☀️ Soleado (Normal)</option>
                  <option value="Nublado">⛅ Nublado</option>
                  <option value="Lluvia Ligera">🌦️ Lluvia Ligera</option>
                  <option value="Lluvia Fuerte / Suspensión">🌧️ Lluvia Fuerte (Suspensión)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Personal / Cuadrilla</label>
                <input
                  type="text"
                  value={cuadrilla}
                  onChange={(e) => setCuadrilla(e.target.value)}
                  placeholder="Ej. 1 Oficial + 2 Ayudantes"
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Observaciones Técnicas</label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={2}
                placeholder="Ej. Slump 5 pulgadas, vaciado terminado a las 3:30 PM..."
                className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-normal"
              />
            </div>
          </div>

          {/* SECCIÓN DE REGISTRO FOTOGRÁFICO DE OBRA CON ESTAMPADO FORENSE GPS */}
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="h-4 w-4 text-emerald-600" /> Registro Fotográfico Forense
              </h3>
              <label className="inline-flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-50 transition">
                <input
                  type="checkbox"
                  checked={estamparGPS}
                  onChange={(e) => setEstamparGPS(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>📍 Estampar Coordenadas GPS y Fecha Forense</span>
              </label>
            </div>

            {!fotoPreview ? (
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-xl bg-white hover:bg-slate-50 cursor-pointer transition group">
                <Camera className="h-7 w-7 text-slate-400 group-hover:text-slate-600 mb-1.5" />
                <span className="text-xs font-bold text-slate-700">Tomar foto o subir evidencia</span>
                <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG optimizado automáticamente para celular</span>
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
                    <CheckCircle2 className="h-3.5 w-3.5" /> Foto lista para adjuntar
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {fotoInfo?.nombre || 'Foto de campo'} • {fotoInfo?.kb || 50} KB (comprimida)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setFotoPreview(null); setFotoInfo(null); }}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                  title="Eliminar foto"
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
            {isSubmitting ? 'Sincronizando con Supabase...' : 'Enviar a Base de Datos (Supabase)'}
          </button>
        </form>

      </div>

      {/* TARJETA DE REGISTROS EN VIVO */}
      <div className="rounded-2xl steel-card p-6">
        
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100 no-print">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              📋 Registros en la Nube ({registrosFiltrados.length})
            </h2>
            <p className="text-xs text-slate-500">Historial sincronizado en PostgreSQL</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => cargarRegistros()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Recargar
            </button>
            <button
              onClick={() => setShowReporteModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition shadow-sm"
            >
              <FileText className="h-3.5 w-3.5" /> Informe Ejecutivo (PDF)
            </button>
            <button
              onClick={exportarCSV}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <Download className="h-3.5 w-3.5" /> Exportar CSV
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              <Printer className="h-3.5 w-3.5" /> Imprimir Acta
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
              placeholder="Buscar por actividad o fecha..."
              className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs"
            />
          </div>

          <div className="flex gap-1">
            {['todos', 'hoy', 'semana'].map((tipo) => (
              <button
                key={tipo}
                onClick={() => setFiltroFecha(tipo)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition ${
                  filtroFecha === tipo
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>

        {/* 1. VISTA MÓVIL: TARJETAS RESPONSIVAS DE REGISTRO (CELULAR) */}
        <div className="block md:hidden space-y-3">
          {loadingRegistros ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              Consultando registros en Supabase...
            </div>
          ) : registrosFiltrados.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              No hay registros disponibles con el filtro actual.
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
                      <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        🟡 Offline
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        ✅ Nube OK
                      </span>
                    )}
                  </div>

                  {/* Actividad */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">
                      {item.actividad}
                    </h3>
                  </div>

                  {/* Métricas: Cantidad y Desperdicio */}
                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg text-xs border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Ejecutado</span>
                      <strong className="text-slate-900 font-black">
                        {Number(item.cantidad).toFixed(2)} {item.unidad}
                      </strong>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Desperdicio</span>
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
                          <Camera className="h-3.5 w-3.5" /> Ver Evidencia
                        </button>
                      </div>
                    ) : (
                      <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-dashed border-slate-300 text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer transition">
                        <Camera className="h-3.5 w-3.5 text-slate-400" />
                        <span>+ Adjuntar Foto</span>
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
                <th className="py-2.5 px-3">Fecha</th>
                <th className="py-2.5 px-3">Actividad de Obra</th>
                <th className="py-2.5 px-3">Unidad</th>
                <th className="py-2.5 px-3 text-right">Cant. Neta</th>
                <th className="py-2.5 px-3 text-center">Desp (%)</th>
                <th className="py-2.5 px-3 text-center">📸 Evidencia</th>
                <th className="py-2.5 px-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingRegistros ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Consultando registros en Supabase...
                  </td>
                </tr>
              ) : registrosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No hay registros disponibles.
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
                        {item.actividad}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="rounded bg-slate-200/80 border border-slate-300 px-1.5 py-0.5 font-bold text-slate-800 text-[10px]">
                          {item.unidad}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-900">
                        {Number(item.cantidad).toFixed(2)}
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
                            <Camera className="h-3 w-3" /> Ver Foto
                          </button>
                        ) : (
                          <label className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-dashed border-slate-300 hover:bg-slate-50 text-slate-500 font-semibold text-[10px] cursor-pointer transition">
                            <Camera className="h-3 w-3" /> + Foto
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
                          <span className="inline-flex rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            🟡 Offline
                          </span>
                        ) : (
                          <span className="inline-flex rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            ✅ Nube OK
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
            <p className="border-t border-slate-400 w-48 mx-auto pt-1 font-bold">INGENDES S.A.S.</p>
            <p className="text-slate-500">Ingeniero Residente de Obra</p>
          </div>
          <div className="text-center">
            <p className="border-t border-slate-400 w-48 mx-auto pt-1 font-bold">DOLMEN S.A. E.S.P.</p>
            <p className="text-slate-500">Interventor / Supervisor Técnico</p>
          </div>
        </div>

      </div>
      </>
      )}

      {/* VISTA 2: CRONOGRAMA DE OBRA (4D) */}
      {activeTab === 'cronograma' && (
        <TabCronograma registros={registros} />
      )}

      {/* VISTA 3: PLANOS CONSTRUCTIVOS */}
      {activeTab === 'planos' && (
        <TabPlanos />
      )}

      {/* VISTA 4: CONTROL DE CALIDAD Y ROTURA DE CILINDROS (NSR-10) */}
      {activeTab === 'calidad' && (
        <ModuloCalidadConcreto registros={registros} />
      )}

      {/* VISTA 5: CONTROL DE RECEPCIÓN DE MIXERS Y REMISIONES (NTC 3318) */}
      {activeTab === 'mixers' && (
        <ModuloMixersRemisiones registros={registros} />
      )}

      {/* VISTA 6: COMPARATIVA DE CANTIDADES CONTRATADAS VS EJECUTADAS */}
      {activeTab === 'cantidades' && (
        <ModuloComparativaCantidades registros={registros} />
      )}

      {/* VISTA 7: ALMACÉN DE MATERIALES EN OBRA Y CONTROL KARDEX */}
      {activeTab === 'almacen' && (
        <ModuloAlmacenMateriales />
      )}

      {/* MODAL DE EVIDENCIA FOTOGRÁFICA */}
      {selectedEvidencia && (
        <ModalEvidenciaFoto
          evidencia={selectedEvidencia}
          onClose={() => setSelectedEvidencia(null)}
        />
      )}

      {/* MODAL DE REPORTE EJECUTIVO Y ACTA OFICIAL (PDF) */}
      {showReporteModal && (
        <ModalReporteEjecutivo
          registros={registrosFiltrados}
          evidenciasFotos={evidenciasFotos}
          onClose={() => setShowReporteModal(false)}
        />
      )}

      <footer className="mt-8 text-center text-xs text-slate-400 no-print">
        JGM ConTech • Sistema de Control de Obra Civil • Barranquilla, Colombia
      </footer>

    </main>
  );
}
