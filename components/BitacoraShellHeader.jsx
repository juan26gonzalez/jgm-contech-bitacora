'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Boxes,
  Building2,
  CalendarDays,
  Camera,
  Cloud,
  Compass,
  ExternalLink,
  FileText,
  FlaskConical,
  Globe,
  Layers,
  LogOut,
  Menu,
  Moon,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Sun,
  Truck,
  User,
  WifiOff,
  X,
} from 'lucide-react';
import { useAppPreferences } from '../lib/i18n';
import { DEMO_SHOWCASE_PROJECT_ID, PROYECTO_DEMO_CONFIG } from '../lib/demoFieldData';

export default function BitacoraShellHeader({
  activeTab,
  onChangeTab,
  isDemo,
  proyectoActivo,
  proyectoActualInfo,
  onCambiarProyecto,
  userEmail,
  onLogout,
  isOnline,
  offlineQueueCount,
  onSyncOffline,
  totalRegistros,
  hoyRegistros,
  totalFotos,
  wbsActivasCount,
  totalCatalogoCount,
  estamparGPS,
}) {
  const {
    lang,
    setLang,
    currency,
    setCurrency,
    darkTheme,
    toggleTheme,
    rates,
    fxLive,
  } = useAppPreferences();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isEn = lang === 'en';
  const fxTooltip = fxLive
    ? `Live FX • 1 USD = $${rates.USD.toLocaleString('es-CO')} COP | 1 EUR = $${rates.EUR.toLocaleString('es-CO')} COP`
    : `Ref FX • 1 USD = $${rates.USD.toLocaleString('es-CO')} COP | 1 EUR = $${rates.EUR.toLocaleString('es-CO')} COP`;

  const navGroups = [
    {
      id: 'ops',
      spanClass: 'xl:col-span-3',
      title: isEn ? '1. Field Ops & Progress' : '1. Operación & Avance',
      items: [
        {
          key: 'bitacora',
          icon: FileText,
          iconColor: 'text-emerald-400',
          label: isEn ? 'Daily Field Log' : 'Bitácora Diaria',
          badge: String(totalRegistros),
          badgeStyle: 'default',
          tip: isEn
            ? 'Daily capture, voice copilot, GPS photos & live logbook'
            : 'Captura diaria en terreno, copiloto de voz y evidencia GPS',
        },
        {
          key: 'cantidades',
          icon: BarChart3,
          iconColor: 'text-indigo-400',
          label: isEn ? 'Contract Qty (BOQ)' : 'Cantidades Obra',
          badge: isEn ? 'BOQ vs Real' : 'Contratado',
          badgeStyle: 'default',
          tip: isEn
            ? 'Contracted vs executed work quantities & deviations'
            : 'Comparativa de cantidades contratadas vs ejecutadas',
        },
      ],
    },
    {
      id: 'eng',
      spanClass: 'xl:col-span-3',
      title: isEn ? '2. Engineering, 4D & IFC' : '2. Ingeniería, 4D & Planos',
      items: [
        {
          key: 'cronograma',
          icon: CalendarDays,
          iconColor: 'text-rose-400',
          label: isEn ? '4D Schedule' : 'Cronograma 4D',
          badge: isEn ? 'Critical' : 'Ruta Crítica',
          badgeStyle: 'rose',
          tip: isEn
            ? 'Critical path timeline linked to field progress'
            : 'Cronograma maestro 4D y seguimiento de ruta crítica',
        },
        {
          key: 'planos',
          icon: Compass,
          iconColor: 'text-cyan-400',
          label: isEn ? 'Drawings & IFC' : 'Planos & IFC',
          badge: isDemo
            ? isEn
              ? '3 IFC'
              : '3 IFC'
            : isEn
            ? '7 Sheets'
            : '7 Planos',
          badgeStyle: 'sky',
          tip: isEn
            ? 'Blueprint viewer, IFC plans & structural revisions'
            : 'Visor de planos constructivos aprobados y detalles IFC',
        },
      ],
    },
    {
      id: 'qa',
      spanClass: 'xl:col-span-4',
      title: isEn ? '3. QA/QC & Site Logistics' : '3. Calidad & Logística',
      items: [
        {
          key: 'calidad',
          icon: FlaskConical,
          iconColor: 'text-sky-400',
          label: isEn ? 'Concrete QA' : 'Calidad & Cilindros',
          badge: isEn ? 'ASTM' : 'NSR-10',
          badgeStyle: 'default',
          tip: isEn
            ? 'Cylinder compression tests & 7/14/28d concrete curing curves'
            : 'Ensayos de cilindros de concreto y curvas de resistencia',
        },
        {
          key: 'mixers',
          icon: Truck,
          iconColor: 'text-amber-400',
          label: isEn ? 'Ready-Mix' : 'Mixers & Remis.',
          badge: isEn ? 'ASTM C94' : 'NTC 3318',
          badgeStyle: 'amber',
          tip: isEn
            ? 'Ready-mix delivery tickets, slump checks & pour times'
            : 'Control de remisiones de concreto, slump y tiempos de vaciado',
        },
        {
          key: 'almacen',
          icon: Boxes,
          iconColor: 'text-teal-400',
          label: isEn ? 'Warehouse' : 'Almacén & Pañol',
          badge: isEn ? 'Kardex' : 'Kardex',
          badgeStyle: 'default',
          tip: isEn
            ? 'Materials stock, Kardex ledger & tool crib custody'
            : 'Control de inventario Kardex, insumos y préstamo de herramienta',
        },
      ],
    },
    {
      id: 'hse',
      spanClass: 'xl:col-span-2',
      title: isEn ? '4. Field HSE' : '4. Seguridad HSEQ',
      items: [
        {
          key: 'sst',
          icon: ShieldCheck,
          iconColor: 'text-emerald-400',
          label: isEn ? 'Safety (HSE)' : 'Seguridad & SST',
          badge: isEn ? 'PTAR / OSHA' : 'PTAR / 4272',
          badgeStyle: 'emerald',
          tip: isEn
            ? 'PTAR high-risk permits, 5-min JSA talks, PPE & CAPAs'
            : 'Permisos PTAR, charlas de 5 min ATS, EPP y hallazgos CAPA',
        },
      ],
    },
  ];

  const getBadgeClasses = (style, isActive) => {
    if (isActive) {
      if (style === 'rose') return 'bg-rose-500/25 text-rose-100 border border-rose-400/40';
      if (style === 'amber') return 'bg-amber-500/25 text-amber-100 border border-amber-400/40';
      if (style === 'emerald') return 'bg-emerald-500/25 text-emerald-100 border border-emerald-400/40';
      if (style === 'sky') return 'bg-sky-500/25 text-sky-100 border border-sky-400/40';
      return 'bg-slate-700 text-slate-100 border border-slate-600';
    }
    if (style === 'rose') return 'bg-rose-100 text-rose-800 border border-rose-200';
    if (style === 'amber') return 'bg-amber-100 text-amber-900 border border-amber-200';
    if (style === 'emerald') return 'bg-emerald-100 text-emerald-900 border border-emerald-200';
    if (style === 'sky') return 'bg-sky-100 text-sky-900 border border-sky-200';
    return 'bg-slate-900/10 text-slate-700 border border-slate-300/80';
  };

  const handleSelectTab = (key) => {
    onChangeTab(key);
    setMobileMenuOpen(false);
  };

  return (
    <header className="space-y-3 mb-5 no-print">
      {/* BANNER EJECUTIVO GUNMETAL FULL-WIDTH */}
      <div className="steel-panel-dark relative overflow-hidden rounded-2xl text-white p-4 sm:p-5">
        {/* FILA 1: BARRA DE ESTADO, CONEXIÓN, PREFERENCIAS Y ENLACE GERENCIA */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-lg text-xs font-bold border border-white/20"
            >
              <Menu className="w-3.5 h-3.5" />
              <span>{isEn ? 'Modules' : 'Módulos'}</span>
            </button>

            <span className="bg-white/10 border border-white/20 text-slate-100 text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full">
              {isEn ? 'FIELD LOG • ISO 19650' : 'BITÁCORA • CAMPO BIM'}
            </span>

            {isDemo ? (
              <span className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/45 text-amber-200 text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full">
                <Sparkles className="w-3 h-3" />
                <span>{isEn ? 'DEMO SANDBOX (READ-ONLY)' : 'DEMO SANDBOX (SOLO LECTURA)'}</span>
              </span>
            ) : !isOnline ? (
              <span className="inline-flex items-center gap-1.5 bg-amber-500/25 border border-amber-400/50 text-amber-200 text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full">
                <WifiOff className="w-3 h-3" />
                <span>
                  {isEn
                    ? `OFFLINE (${offlineQueueCount} queued)`
                    : `SIN RED (${offlineQueueCount} en cola)`}
                </span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <Cloud className="w-3 h-3" />
                <span>SUPABASE LIVE</span>
              </span>
            )}

            {offlineQueueCount > 0 && isOnline && !isDemo && (
              <button
                type="button"
                onClick={onSyncOffline}
                className="inline-flex items-center gap-1 bg-amber-400/20 hover:bg-amber-400/35 border border-amber-300/50 text-amber-100 text-[10px] font-bold px-2.5 py-1 rounded-full transition"
              >
                <RefreshCw className="w-3 h-3" />
                <span>
                  {isEn ? `Sync (${offlineQueueCount})` : `Subir cola (${offlineQueueCount})`}
                </span>
              </button>
            )}

            <a
              href="https://jagm2000-jgmcontech.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-sky-500/20 hover:bg-sky-500/35 border border-sky-400/40 text-sky-100 text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full transition"
              title={
                isEn
                  ? 'Open BIM 5D Management Control Center'
                  : 'Abrir Centro de Control Gerencia BIM 5D'
              }
            >
              <Building2 className="w-3 h-3" />
              <span>{isEn ? 'BIM 5D Mgmt App' : 'App Gerencia BIM'}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-80" />
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Switcher ES / EN + SI / IMP */}
            <div
              className="inline-flex items-center rounded-full bg-slate-900/65 border border-slate-400/35 p-0.5 text-[10px] font-bold"
              title={
                isEn
                  ? 'Language: English • Imperial Units (ft², yd³, ft, lb)'
                  : 'Idioma: Español • Sistema Métrico SI (m², m³, ml, kg)'
              }
            >
              <Globe className="w-3 h-3 text-slate-300 ml-1.5 mr-1" />
              <button
                type="button"
                onClick={() => setLang('es')}
                className={`px-2 py-0.5 rounded-full transition ${
                  lang === 'es' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded-full transition ${
                  lang === 'en' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <span className="px-1.5 text-[9px] font-mono text-sky-300 border-l border-slate-600/70 ml-0.5">
                {isEn ? 'IMP' : 'SI'}
              </span>
            </div>

            {/* Switcher COP / USD / EUR */}
            <div
              className="inline-flex items-center rounded-full bg-slate-900/65 border border-slate-400/35 p-0.5 text-[10px] font-bold"
              title={fxTooltip}
            >
              {['COP', 'USD', 'EUR'].map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setCurrency(curr)}
                  className={`px-2 py-0.5 rounded-full transition ${
                    currency === curr
                      ? 'bg-emerald-400 text-slate-950 font-extrabold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            {/* Toggle Tema */}
            <button
              type="button"
              onClick={toggleTheme}
              title={
                darkTheme
                  ? isEn
                    ? 'Switch to Brushed Steel Light'
                    : 'Cambiar a tema claro'
                  : isEn
                  ? 'Switch to Dark Engineering Studio'
                  : 'Cambiar a tema oscuro'
              }
              className="inline-flex items-center justify-center rounded-full bg-slate-900/65 hover:bg-slate-800 border border-slate-400/35 text-slate-200 p-1.5 transition"
            >
              {darkTheme ? (
                <Sun className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-sky-300" />
              )}
            </button>

            <span className="inline-flex items-center gap-1 bg-slate-900/50 border border-slate-400/35 text-slate-200 text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full">
              <User className="w-3 h-3 text-slate-300" />
              <span>{isDemo ? 'demo-guest' : userEmail?.split('@')[0] || 'resident'}</span>
            </span>

            <button
              type="button"
              onClick={onLogout}
              className={`inline-flex items-center gap-1 border text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full transition ${
                isDemo
                  ? 'bg-white/15 hover:bg-white/25 border-white/35 text-white'
                  : 'bg-rose-500/20 hover:bg-rose-500/35 border-rose-400/40 text-rose-100'
              }`}
            >
              <LogOut className="w-3 h-3" />
              <span>
                {isDemo ? (isEn ? 'Sign In' : 'Ingresar') : isEn ? 'Sign Out' : 'Salir'}
              </span>
            </button>
          </div>
        </div>

        {/* FILA 2: IDENTIDAD DE PROYECTO + SELECTOR DE OBRA + KPI TELEMETRÍA EN VIVO */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pt-3.5">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <img
              src="/logo-mark.png"
              alt="JGM ConTech"
              className="w-12 h-12 rounded-xl border border-slate-300/40 shadow-md shrink-0"
            />
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white leading-tight truncate">
                  {proyectoActualInfo.tituloBanner}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">
                <span>
                  {proyectoActualInfo.subtitulo1Label}:{' '}
                  <strong className="text-white">{proyectoActualInfo.subtitulo1Valor}</strong>
                </span>
                <span className="text-slate-500">•</span>
                <span>
                  {proyectoActualInfo.subtitulo2Label}:{' '}
                  <strong className="text-white">{proyectoActualInfo.subtitulo2Valor}</strong>
                </span>
              </div>

              {/* Selector de Proyecto Activo integrado */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                  {isEn ? 'Active Site:' : 'Obra en Curso:'}
                </span>
                {isDemo || proyectoActivo === DEMO_SHOWCASE_PROJECT_ID ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-emerald-500/20 text-emerald-200 border border-emerald-400/40">
                    <Building2 className="h-3 w-3" />
                    {PROYECTO_DEMO_CONFIG.nombre}
                  </span>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => onCambiarProyecto('mezzanine')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition flex items-center gap-1.5 ${
                        proyectoActivo === 'mezzanine'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'bg-white/10 text-slate-200 border border-white/15 hover:bg-white/20'
                      }`}
                    >
                      <Building2 className="h-3 w-3" />
                      <span>Mezzanine 3 Niveles</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onCambiarProyecto('casa_mendoza')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition flex items-center gap-1.5 ${
                        proyectoActivo === 'casa_mendoza'
                          ? 'bg-emerald-400 text-slate-950 shadow-sm'
                          : 'bg-white/10 text-slate-200 border border-white/15 hover:bg-white/20'
                      }`}
                    >
                      <Layers className="h-3 w-3" />
                      <span>Casa Mendoza (BIM)</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 3 KPIs OPERATIVOS EN TIEMPO REAL */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-3 sm:px-4 py-2 text-center min-w-[95px] sm:min-w-[125px]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                {isEn ? 'Field Logs' : 'Registros'}
              </div>
              <div className="text-lg sm:text-xl font-extrabold font-mono text-white mt-0.5 tabular-nums">
                {totalRegistros}
              </div>
              <div className="text-[10px] text-emerald-300 font-semibold">
                {hoyRegistros} {isEn ? 'today' : 'hoy'}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-3 sm:px-4 py-2 text-center min-w-[95px] sm:min-w-[125px]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center justify-center gap-1">
                <Camera className="w-3 h-3 text-sky-300" />
                {isEn ? 'Evidence' : 'Fotos GPS'}
              </div>
              <div className="text-lg sm:text-xl font-extrabold font-mono text-sky-300 mt-0.5 tabular-nums">
                {totalFotos}
              </div>
              <div className="text-[10px] text-slate-300 font-semibold">
                {estamparGPS ? (isEn ? 'GPS Stamp ON' : 'GPS Sello ON') : 'GPS OFF'}
              </div>
            </div>

            <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-400/35 rounded-xl px-3 sm:px-4 py-2 text-center min-w-[95px] sm:min-w-[125px]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                {isEn ? 'Active WBS' : 'Frentes WBS'}
              </div>
              <div className="text-lg sm:text-xl font-extrabold font-mono text-emerald-300 mt-0.5 tabular-nums">
                {wbsActivasCount}/{totalCatalogoCount}
              </div>
              <div className="text-[10px] text-emerald-200/90 font-semibold">
                {isEn ? 'tracked items' : 'ítems en curso'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BARRA DE NAVEGACIÓN JERÁRQUICA DE 4 PILARES A ANCHO COMPLETO (SIN SCROLL HORIZONTAL) */}
      <nav
        aria-label={isEn ? 'Field Operations Modules' : 'Módulos Jerárquicos de Bitácora'}
        className="rounded-2xl steel-card p-2.5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-2 items-stretch">
          {navGroups.map((grp) => (
            <div
              key={grp.id}
              className={`steel-subcard rounded-xl px-2.5 py-2 flex flex-col justify-between gap-1.5 ${grp.spanClass}`}
            >
              <div className="text-[9.5px] font-black uppercase tracking-wider text-slate-500 px-1 leading-none">
                {grp.title}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      title={item.tip}
                      onClick={() => handleSelectTab(item.key)}
                      className={`inline-flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex-auto whitespace-nowrap ${
                        active
                          ? 'steel-btn-primary text-white shadow-sm'
                          : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5 min-w-0">
                        <Icon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            active ? item.iconColor : 'text-slate-500'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[9.5px] font-extrabold shrink-0 ${getBadgeClasses(
                          item.badgeStyle,
                          active
                        )}`}
                      >
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* DRAWER MÓVIL JERÁRQUICO PARA CAMPO (< LG) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative z-10 w-80 max-w-[88vw] h-full steel-card rounded-none text-slate-900 shadow-2xl border-r border-slate-200 flex flex-col p-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <img
                  src="/logo-mark.png"
                  alt="JGM ConTech"
                  className="w-8 h-8 rounded-lg border border-slate-300"
                />
                <div>
                  <div className="text-sm font-extrabold text-slate-900">JGM ConTech</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {isEn ? 'Field Navigation' : 'Navegación de Campo'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 flex-1">
              {navGroups.map((grp) => (
                <div key={grp.id} className="space-y-1.5">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-1">
                    {grp.title}
                  </div>
                  <div className="space-y-1">
                    {grp.items.map((item) => {
                      const Icon = item.icon;
                      const active = activeTab === item.key;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => handleSelectTab(item.key)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                            active
                              ? 'steel-btn-primary text-white shadow-sm'
                              : 'bg-slate-50 text-slate-800 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Icon
                              className={`w-4 h-4 ${
                                active ? item.iconColor : 'text-slate-500'
                              }`}
                            />
                            <span>{item.label}</span>
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${getBadgeClasses(
                              item.badgeStyle,
                              active
                            )}`}
                          >
                            {item.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
