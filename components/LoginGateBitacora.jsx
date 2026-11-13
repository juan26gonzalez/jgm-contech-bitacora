"use client";

import React, { useState } from "react";
import {
  Lock,
  Sparkles,
  Play,
  ShieldCheck,
  ExternalLink,
  Globe,
  Building2,
  ClipboardList,
  AlertCircle,
} from "lucide-react";
import { useAppPreferences } from "../lib/i18n";

const GERENCIA_APP_URL = "https://jagm2000-jgmcontech.vercel.app";

export default function LoginGateBitacora({
  onLogin,
  onEnterDemo,
  loadingAuth = false,
  authError = "",
}) {
  const { lang, setLang } = useAppPreferences();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!onLogin) return;
    onLogin({ email, password });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-300/80 shadow-2xl overflow-hidden bg-white">
        {/* Dark Gunmetal Engineering Header */}
        <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] px-6 py-5 text-white border-b border-slate-700/80">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Building2 className="w-3 h-3" />
              ISO 19650 • FIELD OPS
            </span>
            <div className="inline-flex items-center rounded-lg bg-slate-800/90 border border-slate-600/80 p-0.5 text-[11px] font-black">
              <Globe className="w-3.5 h-3.5 text-slate-300 mx-1.5" />
              <button
                type="button"
                onClick={() => setLang("es")}
                className={`px-2 py-0.5 rounded-md transition ${
                  lang === "es"
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-0.5 rounded-md transition ${
                  lang === "en"
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-600/80 flex items-center justify-center shadow-lg shrink-0">
              <img
                src="/icon-192.png"
                alt="JGM ConTech"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-white leading-snug">
                JGM ConTech{" "}
                <span className="text-emerald-400">
                  {lang === "en" ? "Field Log" : "Bitácora de Obra"}
                </span>
              </h1>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                {lang === "en"
                  ? "Cloud Field Capture, QA Concrete & 4D Sync Platform"
                  : "Captura en Campo, Calidad QA y Sincronización BIM 4D/5D"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5 bg-slate-50/70">
          {/* Interactive Demo Showcase Box */}
          <div className="rounded-xl border border-emerald-500/40 bg-gradient-to-br from-emerald-50 via-teal-50/70 to-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {lang === "en"
                  ? "Interactive BIM 5D Field Sandbox"
                  : "Demo Interactivo (Sin Registro)"}
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-600 text-white">
                {lang === "en" ? "READ-ONLY" : "SOLO LECTURA"}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
              {lang === "en"
                ? "Explore the Northbridge Corporate Hub showcase: daily field logs, ASTM concrete QA cylinders, ready-mix tickets, blueprints, warehouse KPIs & MS Project 4D schedule — zero credentials required."
                : "Explora el proyecto showcase Northbridge Corporate Hub: bitácora diaria, ensayos de concreto, remisiones mixers, planos, almacén KPI y cronograma MS Project 4D sin comprometer datos reales."}
            </p>
            <button
              type="button"
              onClick={onEnterDemo}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              {lang === "en"
                ? "Explore Interactive Demo (Read-Only)"
                : "Explorar Demo Interactivo (Solo Lectura)"}
            </button>
          </div>

          <div className="relative flex items-center py-0.5">
            <div className="flex-grow border-t border-slate-300" />
            <span className="flex-shrink mx-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
              {lang === "en" ? "Corporate Engineer Sign In" : "Acceso Ingeniería Corporativa"}
            </span>
            <div className="flex-grow border-t border-slate-300" />
          </div>

          {/* Corporate Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authError && (
              <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                {lang === "en" ? "Corporate Email" : "Correo Corporativo"}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@jgmcontech.com"
                autoComplete="email"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                {lang === "en" ? "Password" : "Contraseña"}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loadingAuth}
              className="w-full steel-btn-primary py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Lock className="w-3.5 h-3.5" />
              {loadingAuth
                ? lang === "en"
                  ? "Verifying..."
                  : "Verificando credenciales..."
                : lang === "en"
                  ? "Sign In to Production Field Log"
                  : "Iniciar Sesión Corporativa"}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {lang === "en" ? "Supabase RLS Protected" : "Protegido con Supabase RLS"}
            </span>
            <a
              href={GERENCIA_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-slate-700 hover:text-emerald-700 transition"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              {lang === "en" ? "BIM 5D Management App" : "App Gerencia BIM 5D"}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
