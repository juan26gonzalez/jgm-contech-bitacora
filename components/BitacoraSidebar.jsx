'use client';

import React from 'react';
import {
  ArrowUpRight,
  Building2,
  FolderKanban,
  Globe,
  Layers,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useAppPreferences } from '../lib/i18n';
import { getBitacoraNavGroups } from '../lib/bitacoraNavigation';
import { DEMO_SHOWCASE_PROJECT_ID, PROYECTO_DEMO_CONFIG } from '../lib/demoFieldData';

const GERENCIA_APP_URL =
  process.env.NEXT_PUBLIC_GERENCIA_APP_URL || 'https://jagm2000-jgmcontech.vercel.app/';

export default function BitacoraSidebar({
  activeTab,
  onChangeTab,
  isDemo,
  proyectoActivo,
  onCambiarProyecto,
  totalRegistros,
  mobileOpen,
  onCloseMobile,
  collapsed = false,
}) {
  const { lang } = useAppPreferences();
  const isEn = lang === 'en';
  const navGroups = getBitacoraNavGroups({ isEn, isDemo, totalRegistros });

  const handleSelectTab = (key) => {
    onChangeTab(key);
    if (onCloseMobile) onCloseMobile();
  };

  const content = (
    <div className="sidebar-shell flex flex-col h-full bg-white border-r border-slate-200 px-3.5 py-4 select-none">
      {/* Compact Brand Header */}
      <div className="flex items-center justify-between gap-2 pb-3.5 mb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="/logo-mark.png"
            alt="JGM ConTech"
            className="w-8 h-8 rounded-lg border border-slate-200 shrink-0 object-cover"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-slate-900 truncate">
                JGM ConTech
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                {isEn ? 'FIELD' : 'CAMPO'}
              </span>
            </div>
            <div className="text-[10px] font-medium text-slate-500 truncate">
              {isEn ? 'Digital Field Log' : 'Bitácora de Obra'}
            </div>
          </div>
        </div>
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden text-slate-500 hover:text-slate-900 p-1 rounded-md"
            aria-label={isEn ? 'Close menu' : 'Cerrar menú'}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Active Site Switcher */}
      <div className="mb-3 pb-3 border-b border-slate-200/80 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-0.5">
          <FolderKanban className="w-3 h-3 shrink-0" />
          <span>{isEn ? 'Active Site' : 'Obra en Curso'}</span>
        </div>

        {isDemo || proyectoActivo === DEMO_SHOWCASE_PROJECT_ID ? (
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-2">
            <div className="flex items-start gap-1.5 text-xs font-semibold text-slate-900 leading-snug">
              <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{PROYECTO_DEMO_CONFIG.nombre}</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 truncate pl-5">
              {isEn ? 'Read-only showcase' : 'Showcase interactivo'}
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                onCambiarProyecto('proto_corporativo');
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                proyectoActivo === 'proto_corporativo'
                  ? 'sidebar-nav-active'
                  : 'sidebar-nav-idle'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {isEn ? 'Corporate Prototype (3L)' : 'Edificio Modelo 3 Niveles'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                onCambiarProyecto('proto_residencial');
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                proyectoActivo === 'proto_residencial'
                  ? 'sidebar-nav-active'
                  : 'sidebar-nav-idle'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {isEn ? 'Residential BIM Prototype' : 'Vivienda Prototipo (BIM)'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Vertical 4-Pillar Navigation */}
      <nav aria-label={isEn ? 'Field Operations Modules' : 'Módulos de Bitácora'} className="flex-1 overflow-y-auto pr-0.5 space-y-3.5">
        {navGroups.map((grp) => (
          <div key={grp.id} className="space-y-0.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2.5 mb-1">
              {grp.title}
            </div>
            {grp.items.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleSelectTab(item.key)}
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors text-left ${
                    active ? 'sidebar-nav-active font-semibold' : 'sidebar-nav-idle'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-3.5 h-3.5 shrink-0 opacity-85" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md shrink-0 ${
                        active
                          ? 'bg-white/15 text-current'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Cross-App Link & Standards */}
      <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2.5">
        <a
          href={GERENCIA_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-semibold transition-colors"
        >
          <span className="flex items-center gap-2 min-w-0">
            <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              {isEn ? 'BIM 5D Mgmt App' : 'App Gerencia BIM'}
            </span>
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </a>

        <div className="flex items-center justify-between px-1 text-[10px] font-medium text-slate-400">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            FIELD OPS
          </span>
          <span className="inline-flex items-center gap-1">
            <Globe className="w-3 h-3" />
            ISO 19650
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {!collapsed && (
        <aside className="hidden lg:block w-[268px] shrink-0 sticky top-0 h-screen no-print">
          {content}
        </aside>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex no-print">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-[268px] max-w-[85vw] h-full z-10 shadow-xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
