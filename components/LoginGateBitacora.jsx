'use client';

import React, { useState } from 'react';
import {
  AlertCircle,
  ChevronDown,
  ClipboardList,
  ExternalLink,
  Globe,
  Lock,
  Play,
} from 'lucide-react';
import { useAppPreferences } from '../lib/i18n';

const GERENCIA_APP_URL =
  process.env.NEXT_PUBLIC_GERENCIA_APP_URL || 'https://jagm2000-jgmcontech.vercel.app';

export default function LoginGateBitacora({
  onLogin,
  onEnterDemo,
  loadingAuth = false,
  authError = '',
  cloudConfigured = true,
}) {
  const { lang, setLang } = useAppPreferences();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showCorporateForm, setShowCorporateForm] = useState(cloudConfigured);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!onLogin) return;
    onLogin({ email, password });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[420px] rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-white">
        {/* Minimalist Dark Header */}
        <div className="steel-panel-dark px-6 py-6 text-center text-white">
          <div className="flex items-center justify-between gap-2 mb-5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              ISO 19650 · FIELD OPS
            </span>
            <div className="inline-flex items-center rounded-lg bg-white/10 border border-white/15 p-0.5 text-[10px] font-bold">
              <Globe className="w-3 h-3 text-slate-300 ml-1.5 mr-1" />
              <button
                type="button"
                onClick={() => setLang('es')}
                className={`px-2 py-0.5 rounded-md transition ${
                  lang === 'es' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded-md transition ${
                  lang === 'en' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <img
            src="/logo-mark.png"
            alt="JGM ConTech"
            className="w-16 h-16 rounded-2xl border border-white/15 shadow-md mx-auto mb-3 object-cover"
          />
          <h1 className="text-xl font-bold tracking-tight text-white">
            JGM ConTech{' '}
            <span className="text-emerald-400">
              {lang === 'en' ? 'Field Log' : 'Bitácora'}
            </span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            {lang === 'en'
              ? 'Field Capture, Concrete QA & 4D Schedule Sync'
              : 'Control Diario en Obra, Calidad QA y Avance 4D'}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Interactive Demo Showcase Box */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <span>{lang === 'en' ? 'BIM 5D Field Sandbox' : 'Modo Demo Interactivo'}</span>
              <span className="text-emerald-700 font-bold">
                {lang === 'en' ? 'Read-Only' : 'Solo Lectura'}
              </span>
            </div>

            <button
              type="button"
              onClick={onEnterDemo}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {lang === 'en'
                ? 'Explore Interactive Demo'
                : 'Explorar Demo Interactivo'}
            </button>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              {lang === 'en'
                ? '2-Storey RC Frame + Balcony showcase: field logs, NSR-10 QA, 6 BIM/Rebar sheets & 4D schedule.'
                : 'Proyecto Pórtico 2 Niveles + Balcón: bitácora, cilindros NSR-10, 6 planos c/ acero y cronograma 4D.'}
            </p>
          </div>

          {!cloudConfigured && (
            <button
              type="button"
              onClick={() => setShowCorporateForm((prev) => !prev)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>
                {lang === 'en'
                  ? 'Private Engineer Sign In'
                  : '¿Acceso corporativo privado? Iniciar sesión'}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  showCorporateForm ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}

          {showCorporateForm && (
            <form onSubmit={handleSubmit} className="pt-2 border-t border-slate-200 space-y-3">
              {!cloudConfigured && (
                <p className="text-[11px] text-slate-500 text-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  {lang === 'en'
                    ? 'Public demo deployment without Supabase credentials. Use Interactive Demo above.'
                    : 'Instancia demostrativa sin credenciales de Supabase. Usa el Demo Interactivo arriba.'}
                </p>
              )}

              {authError && (
                <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium p-2.5 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  {lang === 'en' ? 'Corporate Email' : 'Correo Corporativo'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@jgmcontech.com"
                  autoComplete="email"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  {lang === 'en' ? 'Password' : 'Contraseña'}
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={loadingAuth || !cloudConfigured}
                className="w-full steel-btn-primary py-2.5 px-4 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                {loadingAuth
                  ? lang === 'en'
                    ? 'Verifying...'
                    : 'Verificando...'
                  : lang === 'en'
                  ? 'Sign In'
                  : 'Iniciar Sesión'}
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>ISO 19650 · Supabase RLS</span>
            <a
              href={GERENCIA_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-950 transition"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              {lang === 'en' ? 'BIM 5D App' : 'Gerencia BIM'}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
