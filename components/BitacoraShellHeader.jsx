'use client';

import React from 'react';
import {
  Building2,
  Camera,
  ChevronRight,
  ExternalLink,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Sun,
  User,
  WifiOff,
} from 'lucide-react';
import { useAppPreferences } from '../lib/i18n';
import { findBitacoraActiveMeta } from '../lib/bitacoraNavigation';

const GERENCIA_APP_URL =
  process.env.NEXT_PUBLIC_GERENCIA_APP_URL || 'https://jagm2000-jgmcontech.vercel.app/';

export default function BitacoraShellHeader({
  activeTab,
  isDemo,
  proyectoActualInfo,
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
  onOpenMenuMobile,
  sidebarCollapsed = false,
  onToggleSidebarDesktop,
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

  const isEn = lang === 'en';
  const fxTooltip = fxLive
    ? `Live FX • 1 USD = $${rates.USD.toLocaleString('es-CO')} COP | 1 EUR = $${rates.EUR.toLocaleString('es-CO')} COP`
    : `Ref FX • 1 USD = $${rates.USD.toLocaleString('es-CO')} COP | 1 EUR = $${rates.EUR.toLocaleString('es-CO')} COP`;

  const { groupTitle, item: activeItem } = findBitacoraActiveMeta({
    isEn,
    isDemo,
    totalRegistros,
    activeTab,
  });
  const ActiveIcon = activeItem.icon;

  return (
    <header className="space-y-3 no-print">
      {/* Slim Utility & Breadcrumb Row */}
      <div className="topbar-utility flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200/80">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onOpenMenuMobile}
            className="lg:hidden topbar-pill inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700"
          >
            <Menu className="w-3.5 h-3.5" />
            <span>{isEn ? 'Modules' : 'Módulos'}</span>
          </button>

          {onToggleSidebarDesktop && (
            <button
              type="button"
              onClick={onToggleSidebarDesktop}
              title={
                sidebarCollapsed
                  ? isEn
                    ? 'Show Sidebar'
                    : 'Mostrar panel lateral'
                  : isEn
                  ? 'Hide Sidebar'
                  : 'Ocultar panel lateral'
              }
              className="hidden lg:inline-flex topbar-pill items-center justify-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 p-1.5 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="w-3.5 h-3.5" />
              ) : (
                <PanelLeftClose className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          <div className="flex items-center gap-1.5 text-xs min-w-0">
            <span className="hidden sm:inline font-medium text-slate-400">
              {groupTitle}
            </span>
            <ChevronRight className="hidden sm:inline w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100 truncate">
              <ActiveIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{activeItem.label}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {isDemo ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border bg-amber-50/90 border-amber-200 text-amber-800">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Demo</span>
            </span>
          ) : !isOnline ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border bg-amber-50 border-amber-200 text-amber-800">
              <WifiOff className="w-3 h-3" />
              <span>{isEn ? `Offline (${offlineQueueCount})` : `Sin red (${offlineQueueCount})`}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border bg-emerald-50/90 border-emerald-200 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Live</span>
            </span>
          )}

          {offlineQueueCount > 0 && isOnline && !isDemo && (
            <button
              type="button"
              onClick={onSyncOffline}
              className="inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-semibold px-2 py-1 rounded-lg transition"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{offlineQueueCount}</span>
            </button>
          )}

          <a
            href={GERENCIA_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex topbar-pill items-center gap-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors"
          >
            <Building2 className="w-3 h-3 text-slate-500" />
            <span>{isEn ? 'BIM 5D App' : 'Gerencia BIM'}</span>
            <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
          </a>

          {/* Language & Metric System */}
          <div
            className="topbar-pill inline-flex items-center rounded-lg bg-white border border-slate-200 p-0.5 text-[10px] font-bold"
            title={
              isEn
                ? 'Language: English • Imperial Units (ft², yd³, ft, lb)'
                : 'Idioma: Español • Sistema Métrico SI (m², m³, ml, kg)'
            }
          >
            <button
              type="button"
              onClick={() => setLang('es')}
              className={`px-2 py-0.5 rounded-md transition ${
                lang === 'es' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded-md transition ${
                lang === 'en' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <span className="px-1.5 text-[9px] font-mono text-slate-400 border-l border-slate-200 ml-0.5">
              {isEn ? 'IMP' : 'SI'}
            </span>
          </div>

          {/* Currency Switcher */}
          <div
            className="topbar-pill inline-flex items-center rounded-lg bg-white border border-slate-200 p-0.5 text-[10px] font-bold"
            title={fxTooltip}
          >
            {['COP', 'USD', 'EUR'].map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => setCurrency(curr)}
                className={`px-2 py-0.5 rounded-md transition ${
                  currency === curr
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            title={darkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="topbar-pill inline-flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 p-1.5 rounded-lg transition-colors"
          >
            {darkTheme ? (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-600" />
            )}
          </button>

          {userEmail && !isDemo && (
            <span className="hidden md:inline-flex topbar-pill items-center gap-1 bg-white border border-slate-200 text-slate-600 text-[11px] font-medium px-2.5 py-1 rounded-lg">
              <User className="w-3 h-3" />
              <span>{userEmail.split('@')[0]}</span>
            </span>
          )}

          <button
            type="button"
            onClick={onLogout}
            className={`inline-flex items-center gap-1 border text-[11px] font-semibold px-2.5 py-1 rounded-lg transition ${
              isDemo
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-900 text-white'
                : 'bg-white hover:bg-rose-50 border-slate-200 text-rose-600'
            }`}
          >
            <LogOut className="w-3 h-3" />
            <span>
              {isDemo ? (isEn ? 'Sign In' : 'Ingresar') : isEn ? 'Sign Out' : 'Salir'}
            </span>
          </button>
        </div>
      </div>

      {/* Slim Matte Project Summary Banner */}
      <div className="steel-panel-dark rounded-2xl text-white px-5 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
              <span>{isEn ? 'ISO 19650 FIELD LOG' : 'BITÁCORA • CAMPO BIM'}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 truncate">
                {estamparGPS ? (isEn ? 'GPS Stamp ON' : 'Sello GPS Activo') : 'GPS OFF'}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white truncate mt-0.5">
              {proyectoActualInfo.tituloBanner}
            </h1>
            <p className="text-xs text-slate-400 truncate">
              {proyectoActualInfo.subtitulo1Label}:{' '}
              <span className="text-slate-200 font-medium">{proyectoActualInfo.subtitulo1Valor}</span>
              <span className="mx-2 text-slate-600">·</span>
              {proyectoActualInfo.subtitulo2Label}:{' '}
              <span className="text-slate-200 font-medium">{proyectoActualInfo.subtitulo2Valor}</span>
            </p>
          </div>

          {/* 3 Clean Minimalist Telemetry Readouts */}
          <div className="grid grid-cols-3 gap-2.5 shrink-0">
            <div className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-center min-w-[92px]">
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                {isEn ? 'Logs' : 'Registros'}
              </div>
              <div className="text-lg font-bold font-mono text-white tabular-nums mt-0.5">
                {totalRegistros}
              </div>
              <div className="text-[10px] text-emerald-400 font-medium">
                +{hoyRegistros} {isEn ? 'today' : 'hoy'}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-center min-w-[92px]">
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
                <Camera className="w-3 h-3 text-sky-400" />
                {isEn ? 'Photos' : 'Fotos GPS'}
              </div>
              <div className="text-lg font-bold font-mono text-sky-400 tabular-nums mt-0.5">
                {totalFotos}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                {isEn ? 'Verified' : 'Evidencia'}
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-400/25 rounded-xl px-3.5 py-2 text-center min-w-[96px]">
              <div className="text-[10px] font-medium uppercase tracking-wider text-emerald-300/90">
                {isEn ? 'Active WBS' : 'Frentes WBS'}
              </div>
              <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
                {wbsActivasCount}/{totalCatalogoCount}
              </div>
              <div className="text-[10px] text-emerald-300/80 font-medium">
                {isEn ? 'In progress' : 'En curso'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
