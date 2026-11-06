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
  Compass
} from 'lucide-react';
import TabCronograma from '../components/TabCronograma';
import TabPlanos from '../components/TabPlanos';

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
  const acumuladoActual = mapaAcumulados[actividadSeleccionada] || 0;
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

    const payload = {
      fecha: fecha,
      actividad: actividadSeleccionada,
      unidad: actividadInfo?.unidad || 'und',
      cantidad: cantidadNum,
      desperdicio: parseFloat(desperdicio) || 0
    };

    // Modo Offline
    if (!navigator.onLine) {
      const nuevaCola = [...offlineQueue, payload];
      setOfflineQueue(nuevaCola);
      localStorage.setItem('jgm_offline_queue', JSON.stringify(nuevaCola));
      limpiarFormulario();
      alert('📶 MODO OFFLINE: Se guardó en tu dispositivo. Se enviará a Supabase automáticamente al recuperar señal.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('bitacora_obra').insert([payload]);
      if (error) throw error;

      await cargarRegistros(true);
      limpiarFormulario();
      alert(`✅ ¡Registro exitoso en Supabase!\n${payload.actividad}: ${payload.cantidad} ${payload.unidad}`);
    } catch (err) {
      console.error('Error al registrar:', err);
      // Fallback a cola offline si hubo falla imprevista
      const nuevaCola = [...offlineQueue, payload];
      setOfflineQueue(nuevaCola);
      localStorage.setItem('jgm_offline_queue', JSON.stringify(nuevaCola));
      limpiarFormulario();
      alert('⚠️ Conexión inestable: Se respaldó en cola local.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sincronizarColaOffline = async () => {
    const cola = JSON.parse(localStorage.getItem('jgm_offline_queue') || '[]');
    if (cola.length === 0) return;

    try {
      const { error } = await supabase.from('bitacora_obra').insert(cola);
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
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border-t-8 border-slate-800">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-full bg-slate-100 text-slate-800 mb-2">
              <HardHat className="h-10 w-10 text-slate-800" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">JGM ConTech</h1>
            <p className="text-sm font-medium text-slate-500">Bitácora de Obra • Acceso Seguro</p>
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
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200 border-t-8 border-t-slate-900 mb-5 no-print">
        
        {/* BARRA SUPERIOR DE ESTADO Y USUARIO */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-900 text-white">
              <HardHat className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">JGM ConTech</h1>
              <p className="text-xs font-medium text-slate-500">Gestión de Obra Civil & Captura en Campo</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <Cloud className="h-3.5 w-3.5" /> Supabase
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 border border-sky-200">
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

        {/* ETIQUETA DEL PROYECTO */}
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-200/80 flex flex-wrap justify-between items-center gap-2">
          <div>
            Proyecto: <strong className="text-slate-900">MEZZANINE 3 NIVELES - SEDE ADMON BARRANQUILLA</strong>
          </div>
          <div className="text-slate-500">
            Contratista: <strong className="text-slate-900">INGENDES S.A.S.</strong> | Interventoría: <strong className="text-slate-900">DOLMEN S.A.</strong>
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
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
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
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
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
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Compass className="h-4 w-4 text-cyan-400" />
          <span>📐 Planos Constructivos</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'planos' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
          }`}>
            7 Aprobados
          </span>
        </button>
      </div>

      {/* VISTA 1: BITÁCORA DE CAPTURA */}
      {activeTab === 'bitacora' && (
        <>
          {/* TARJETA PRINCIPAL DEL FORMULARIO */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 mb-6 no-print">
            
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <FileText className="h-5 w-5 text-slate-800" />
              <h2 className="text-base font-bold text-slate-900">
                Captura Diaria de Avance en Campo
              </h2>
            </div>

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
                <option value="Cimentación (Zapatas / Vigas / Foso)">Cimentación (Zapatas / Vigas / Foso)</option>
                <option value="1er Piso (Ejes A1-C2)">1er Piso (Ejes A1-C2)</option>
                <option value="2do Piso (Mezzanine)">2do Piso (Mezzanine)</option>
                <option value="3er Piso">3er Piso</option>
                <option value="Azotea / Cubierta / Foso">Azotea / Cubierta / Foso</option>
                <option value="General de Obra">General de Obra</option>
              </select>
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
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        
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
              onClick={exportarCSV}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <Download className="h-3.5 w-3.5" /> Exportar CSV
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              <Printer className="h-3.5 w-3.5" /> Imprimir Acta PDF
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

        {/* TABLA DE REGISTROS */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Fecha</th>
                <th className="py-2.5 px-3">Actividad de Obra</th>
                <th className="py-2.5 px-3">Unidad</th>
                <th className="py-2.5 px-3 text-right">Cant. Neta</th>
                <th className="py-2.5 px-3 text-center">Desp (%)</th>
                <th className="py-2.5 px-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingRegistros ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Consultando registros en Supabase...
                  </td>
                </tr>
              ) : registrosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No hay registros disponibles.
                  </td>
                </tr>
              ) : (
                registrosFiltrados.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {item.fecha || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 font-medium">
                      {item.actividad}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="rounded bg-sky-50 px-1.5 py-0.5 font-bold text-sky-700 text-[10px]">
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
                ))
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

      <footer className="mt-8 text-center text-xs text-slate-400 no-print">
        JGM ConTech • Sistema de Control de Obra Civil • Barranquilla, Colombia
      </footer>

    </main>
  );
}
