'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileCheck2,
  Flame,
  HardHat,
  Info,
  Plus,
  Printer,
  ShieldCheck,
  Users,
  Zap,
} from 'lucide-react';
import { useAppPreferences } from '../lib/i18n';
import {
  DEMO_SHOWCASE_PROJECT_ID,
  getDemoFieldSstSeed,
} from '../lib/demoFieldData';
import { convertLengthInputToM, convertLengthM } from '../lib/units';

const SST_STORAGE_PREFIX = 'jgm_bitacora_sst_v1_';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function offsetIsoDays(days) {
  const dt = new Date();
  dt.setDate(dt.getDate() + days);
  return dt.toISOString().slice(0, 10);
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function downloadCsvUtf8(filename, headers, rows) {
  const quoteCell = (val) => {
    const s = String(val ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes(';')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const lines = [
    headers.map(quoteCell).join(','),
    ...rows.map((row) => row.map(quoteCell).join(',')),
  ];
  const csvContent = `\uFEFF${lines.join('\r\n')}`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function openFieldSstPrintSheet({
  docTitle,
  badge,
  projectTitle,
  contractorLine,
  periodOrDate,
  bodyHtml,
  footerNote,
  lang,
}) {
  if (typeof window === 'undefined') return false;
  const popup = window.open('', '_blank', 'width=1024,height=840');
  if (!popup) return false;
  const isEn = lang === 'en';
  const html = `<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'es'}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(docTitle)} - ${escapeHtml(projectTitle)}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; background: #fff; margin: 0; padding: 28px 34px; font-size: 12px; line-height: 1.45; }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 14px; margin-bottom: 18px; display: flex; justify-content: space-between; gap: 16px; }
    .badge { display: inline-block; background: #0f172a; color: #fff; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 8px; border-radius: 4px; margin-bottom: 6px; }
    h1 { margin: 0 0 4px 0; font-size: 18px; font-weight: 800; }
    .meta { font-size: 11px; color: #475569; }
    .meta-box { text-align: right; font-size: 11px; color: #334155; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 18px; }
    .kpi { border: 1px solid #cbd5e1; border-radius: 6px; padding: 9px 11px; background: #f8fafc; }
    .kpi-label { font-size: 9.5px; font-weight: 700; text-transform: uppercase; color: #475569; margin-bottom: 3px; }
    .kpi-val { font-size: 15px; font-weight: 800; color: #0f172a; }
    h2 { font-size: 13px; font-weight: 700; margin: 16px 0 8px 0; border-left: 3px solid #10b981; padding-left: 8px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 11px; }
    th { background: #0f172a; color: #fff; text-align: left; padding: 6px 8px; font-weight: 600; font-size: 10px; text-transform: uppercase; }
    td { border-bottom: 1px solid #e2e8f0; padding: 6px 8px; vertical-align: top; }
    tr:nth-child(even) td { background: #f8fafc; }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    .pill { display: inline-block; padding: 2px 6px; border-radius: 999px; font-size: 9.5px; font-weight: 700; border: 1px solid #cbd5e1; background: #f1f5f9; }
    .footer { margin-top: 22px; padding-top: 10px; border-top: 1px solid #cbd5e1; font-size: 10px; color: #64748b; display: flex; justify-content: space-between; }
    @media print { body { padding: 12px 16px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="badge">${escapeHtml(badge)}</div>
      <h1>${escapeHtml(docTitle)}</h1>
      <div class="meta"><strong>${escapeHtml(projectTitle)}</strong> • ${escapeHtml(contractorLine)}</div>
    </div>
    <div class="meta-box">
      <div><strong>${isEn ? 'Date' : 'Fecha'}:</strong> ${escapeHtml(periodOrDate)}</div>
      <div><strong>${isEn ? 'Generated' : 'Generado'}:</strong> ${escapeHtml(todayIso())}</div>
    </div>
  </div>
  ${bodyHtml}
  <div class="footer">
    <span>JGM ConTech • Bitácora SST de Campo</span>
    <span>${escapeHtml(footerNote)}</span>
  </div>
  <script>window.onload = function() { setTimeout(function() { window.print(); }, 250); };</script>
</body>
</html>`;

  popup.document.open();
  popup.document.write(html);
  popup.document.close();
  return true;
}

function buildDefaultRealSstSeed(proyectoActivo, proyectoNombre) {
  const safeName = proyectoNombre || 'Obra Activa';
  const key = String(proyectoActivo || 'real').replace(/[^a-zA-Z0-9_-]/g, '_');
  return {
    diasSinLti: 18,
    horasHombreAcum: 960,
    permisos: [
      {
        id: `ptar-${key}-1`,
        codigo: 'PTAR-001',
        fecha: todayIso(),
        tipo: 'alturas',
        frente: `${safeName} — Frente Estructura & Cubierta`,
        frenteEn: `${safeName} — Structure & Roof Front`,
        responsable: 'Inspector SST / Residente',
        responsableEn: 'Site HSE Inspector',
        alturaM: 3.4,
        ptarChecklistOk: true,
        arlVerificada: true,
        estado: 'vigente',
        notas: 'Línea de vida, anclaje certificado y arnés verificados en campo.',
        notasEn: 'Lifeline, certified anchor points & harness verified on site.',
      },
    ],
    charlas: [
      {
        id: `talk-${key}-1`,
        fecha: todayIso(),
        frente: 'Todos los frentes de obra',
        frenteEn: 'All active site crews',
        tema: 'Charla 5 min: Inspección de herramientas, orden en andamios y uso obligatorio de EPP',
        temaEn: '5-min Toolbox Talk: Tool check, scaffold safety & mandatory PPE',
        instructor: 'Residente / Coordinador SST',
        instructorEn: 'Site Lead / HSE Coordinator',
        asistentes: 6,
        atsCompletado: true,
      },
    ],
    eppTrabajadores: [
      {
        id: `epp-${key}-1`,
        codigo: 'OP-01',
        rol: 'Oficial Estructura & Albañilería',
        rolEn: 'Lead Structural Mason',
        cuadrilla: 'Frente Estructura',
        cargoCertAltura: true,
        venceCertAltura: offsetIsoDays(180),
        estadoAfiliacion: 'activa',
        casco: true,
        botas: true,
        arnes: true,
        guantes: true,
        gafas: true,
      },
      {
        id: `epp-${key}-2`,
        codigo: 'OP-02',
        rol: 'Ayudante de Obra & Logística',
        rolEn: 'Construction Helper & Logistics',
        cuadrilla: 'Frente Estructura',
        cargoCertAltura: true,
        venceCertAltura: offsetIsoDays(150),
        estadoAfiliacion: 'activa',
        casco: true,
        botas: true,
        arnes: true,
        guantes: true,
        gafas: true,
      },
    ],
    incidentes: [],
  };
}

function loadFieldSstState(proyectoActivo, proyectoNombre, isDemo) {
  if (isDemo || proyectoActivo === DEMO_SHOWCASE_PROJECT_ID) {
    return getDemoFieldSstSeed();
  }
  const safeKey = String(proyectoActivo || 'default').replace(/[^a-zA-Z0-9_-]/g, '_');
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(`${SST_STORAGE_PREFIX}${safeKey}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          parsed &&
          Array.isArray(parsed.permisos) &&
          Array.isArray(parsed.charlas) &&
          Array.isArray(parsed.eppTrabajadores) &&
          Array.isArray(parsed.incidentes)
        ) {
          return {
            diasSinLti: Number(parsed.diasSinLti ?? 0),
            horasHombreAcum: Number(parsed.horasHombreAcum ?? 0),
            permisos: parsed.permisos,
            charlas: parsed.charlas,
            eppTrabajadores: parsed.eppTrabajadores,
            incidentes: parsed.incidentes,
          };
        }
      }
    } catch {
      // ignore storage errors
    }
  }
  return buildDefaultRealSstSeed(proyectoActivo, proyectoNombre);
}

function saveFieldSstState(proyectoActivo, state, isDemo) {
  if (isDemo || proyectoActivo === DEMO_SHOWCASE_PROJECT_ID) return;
  if (typeof window === 'undefined') return;
  const safeKey = String(proyectoActivo || 'default').replace(/[^a-zA-Z0-9_-]/g, '_');
  try {
    window.localStorage.setItem(`${SST_STORAGE_PREFIX}${safeKey}`, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

export default function ModuloSstCampo({
  proyectoActivo,
  proyectoInfo,
  isDemo = false,
  onSummaryChange,
}) {
  const { lang, formatLength } = useAppPreferences();
  const isEn = lang === 'en';
  const projectTitle = proyectoInfo?.nombre || 'Proyecto Activo';
  const contractorLine = isDemo
    ? proyectoInfo?.subtitulo1Valor || 'Northbridge Capital Partners'
    : `${proyectoInfo?.subtitulo1Valor || ''} / ${proyectoInfo?.subtitulo2Valor || ''}`;

  const [sstState, setSstState] = useState(() =>
    loadFieldSstState(proyectoActivo, projectTitle, isDemo)
  );
  const [subView, setSubView] = useState('permisos');
  const [permitFilter, setPermitFilter] = useState('all');
  const [feedback, setFeedback] = useState('');

  // Form states
  const [newPermitTipo, setNewPermitTipo] = useState('alturas');
  const [newPermitFrente, setNewPermitFrente] = useState('');
  const [newPermitResp, setNewPermitResp] = useState('');
  const [newPermitHeightInput, setNewPermitHeightInput] = useState('2.5');
  const [newPermitChecklistOk, setNewPermitChecklistOk] = useState(true);
  const [newPermitArlOk, setNewPermitArlOk] = useState(true);
  const [newPermitNotes, setNewPermitNotes] = useState('');

  const [newTalkFrente, setNewTalkFrente] = useState('');
  const [newTalkTema, setNewTalkTema] = useState('');
  const [newTalkInstructor, setNewTalkInstructor] = useState('');
  const [newTalkAsistentes, setNewTalkAsistentes] = useState('8');
  const [newTalkAtsOk, setNewTalkAtsOk] = useState(true);

  const [newWorkerCode, setNewWorkerCode] = useState('');
  const [newWorkerRole, setNewWorkerRole] = useState('');
  const [newWorkerCrew, setNewWorkerCrew] = useState('');
  const [newWorkerCertAlturas, setNewWorkerCertAlturas] = useState(true);

  const [newIncTipo, setNewIncTipo] = useState('condicion_insegura');
  const [newIncFrente, setNewIncFrente] = useState('');
  const [newIncDesc, setNewIncDesc] = useState('');
  const [newIncCapa, setNewIncCapa] = useState('');
  const [newIncResp, setNewIncResp] = useState('');
  const [newIncDeadline, setNewIncDeadline] = useState(() => offsetIsoDays(3));

  useEffect(() => {
    setSstState(loadFieldSstState(proyectoActivo, projectTitle, isDemo));
  }, [proyectoActivo, projectTitle, isDemo]);

  const updateSst = (next) => {
    setSstState(next);
    saveFieldSstState(proyectoActivo, next, isDemo);
  };

  const summary = useMemo(() => {
    const permisosActivos = sstState.permisos.filter(
      (p) => p.estado === 'vigente' || p.estado === 'pendiente'
    ).length;
    const capasAbiertas = sstState.incidentes.filter((i) => !i.cerrado).length;
    const totalWorkers = sstState.eppTrabajadores.length;
    let checkedItems = 0;
    sstState.eppTrabajadores.forEach((w) => {
      if (w.casco) checkedItems += 1;
      if (w.botas) checkedItems += 1;
      if (w.arnes) checkedItems += 1;
      if (w.guantes) checkedItems += 1;
      if (w.gafas) checkedItems += 1;
    });
    const eppPct =
      totalWorkers > 0 ? Math.round((checkedItems / (totalWorkers * 5)) * 100) : 100;
    const recordables = sstState.incidentes.filter(
      (i) => i.tipo === 'incidente_leve' || i.tipo === 'accidente_lti'
    ).length;
    const trir =
      sstState.horasHombreAcum > 0
        ? Math.round(((recordables * 200000) / sstState.horasHombreAcum) * 100) / 100
        : 0;
    return {
      diasSinLti: sstState.diasSinLti,
      horasHombreAcum: sstState.horasHombreAcum,
      permisosActivos,
      charlasTotales: sstState.charlas.length,
      eppPct,
      capasAbiertas,
      trir,
    };
  }, [sstState]);

  useEffect(() => {
    if (typeof onSummaryChange === 'function') {
      onSummaryChange(summary);
    }
  }, [summary, onSummaryChange]);

  const totalAsistencias = useMemo(
    () => sstState.charlas.reduce((acc, c) => acc + Number(c.asistentes || 0), 0),
    [sstState.charlas]
  );

  const filteredPermits = useMemo(() => {
    if (permitFilter === 'all') return sstState.permisos;
    return sstState.permisos.filter((p) => p.estado === permitFilter);
  }, [sstState.permisos, permitFilter]);

  const notify = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 4500);
  };

  const getPermitTypeLabel = (tipo) => {
    switch (tipo) {
      case 'alturas':
        return isEn ? 'Working at Heights' : 'Trabajo en Alturas';
      case 'caliente':
        return isEn ? 'Hot Work (Weld/Cut)' : 'Trabajo en Caliente';
      case 'excavacion':
        return isEn ? 'Excavation & Trenching' : 'Excavación & Zanjas';
      case 'electrico':
        return isEn ? 'Electrical LOTO' : 'Riesgo Eléctrico LOTO';
      case 'izaje':
        return isEn ? 'Rigging & Lifting' : 'Izaje de Cargas';
      default:
        return tipo;
    }
  };

  const getPermitStatusLabel = (estado) => {
    switch (estado) {
      case 'vigente':
        return isEn ? 'Active' : 'Vigente';
      case 'pendiente':
        return isEn ? 'Pending' : 'Pendiente';
      case 'cerrado':
        return isEn ? 'Closed' : 'Cerrado';
      case 'vencido':
        return isEn ? 'Expired' : 'Vencido';
      default:
        return estado;
    }
  };

  const getPermitStatusBadgeClass = (estado) => {
    switch (estado) {
      case 'vigente':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pendiente':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'vencido':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getIncidentTypeLabel = (tipo) => {
    switch (tipo) {
      case 'cuasi_accidente':
        return isEn ? 'Near Miss' : 'Cuasi-Accidente';
      case 'condicion_insegura':
        return isEn ? 'Unsafe Condition' : 'Condición Insegura';
      case 'incidente_leve':
        return isEn ? 'Minor / First Aid' : 'Incidente Leve';
      case 'accidente_lti':
        return isEn ? 'Lost-Time Injury (LTI)' : 'Accidente Incapacitante (LTI)';
      default:
        return tipo;
    }
  };

  const handleAddSafeDay = () => {
    const crewHeadcount = Math.max(1, sstState.eppTrabajadores.length);
    updateSst({
      ...sstState,
      diasSinLti: sstState.diasSinLti + 1,
      horasHombreAcum: sstState.horasHombreAcum + crewHeadcount * 8,
    });
    notify(
      isEn
        ? `Closed safe shift: +1 LTI-free day & +${crewHeadcount * 8} man-hrs.`
        : `Jornada segura cerrada: +1 día sin LTI y +${crewHeadcount * 8} H-H.`
    );
  };

  const handleAddPermit = (e) => {
    e.preventDefault();
    const frente = newPermitFrente.trim();
    if (!frente) return;
    const rawH = Number(newPermitHeightInput || 0);
    const heightM =
      newPermitTipo === 'alturas'
        ? Math.round(convertLengthInputToM(rawH, lang) * 100) / 100
        : undefined;
    const nextNum = sstState.permisos.length + 1;
    const prefix = isDemo ? 'PTAR-NB-' : 'PTAR-';
    const codigo = `${prefix}${String(nextNum).padStart(3, '0')}`;
    const ready = newPermitChecklistOk && newPermitArlOk;

    const item = {
      id: `ptar-${Date.now()}`,
      codigo,
      fecha: todayIso(),
      tipo: newPermitTipo,
      frente,
      frenteEn: frente,
      responsable: newPermitResp.trim() || (isEn ? 'Site HSE Officer' : 'Inspector SST / Residente'),
      responsableEn: newPermitResp.trim() || 'Site HSE Officer',
      alturaM: heightM,
      ptarChecklistOk: newPermitChecklistOk,
      arlVerificada: newPermitArlOk,
      estado: ready ? 'vigente' : 'pendiente',
      notas: newPermitNotes.trim() || undefined,
      notasEn: newPermitNotes.trim() || undefined,
    };

    updateSst({
      ...sstState,
      permisos: [item, ...sstState.permisos],
    });
    setNewPermitFrente('');
    setNewPermitNotes('');
    notify(
      ready
        ? isEn
          ? `Permit ${codigo} active on site.`
          : `Permiso ${codigo} emitido como Vigente en campo.`
        : isEn
          ? `Permit ${codigo} saved as Pending.`
          : `Permiso ${codigo} guardado en estado Pendiente.`
    );
  };

  const handleCyclePermitStatus = (id) => {
    const order = ['pendiente', 'vigente', 'cerrado', 'vencido'];
    updateSst({
      ...sstState,
      permisos: sstState.permisos.map((p) => {
        if (p.id !== id) return p;
        const idx = order.indexOf(p.estado);
        const nextEstado = order[(idx + 1) % order.length];
        if (nextEstado === 'vigente' && (!p.arlVerificada || !p.ptarChecklistOk)) {
          return { ...p, ptarChecklistOk: true, arlVerificada: true, estado: 'vigente' };
        }
        return { ...p, estado: nextEstado };
      }),
    });
  };

  const handleAddTalk = (e) => {
    e.preventDefault();
    const tema = newTalkTema.trim();
    if (!tema) return;
    const item = {
      id: `talk-${Date.now()}`,
      fecha: todayIso(),
      frente: newTalkFrente.trim() || (isEn ? 'All Active Crews' : 'Todos los Frentes de Obra'),
      frenteEn: newTalkFrente.trim() || 'All Active Crews',
      tema,
      temaEn: tema,
      instructor: newTalkInstructor.trim() || (isEn ? 'Site HSE Officer' : 'Coordinación SST'),
      instructorEn: newTalkInstructor.trim() || 'Site HSE Officer',
      asistentes: Math.max(1, Number(newTalkAsistentes || 1)),
      atsCompletado: newTalkAtsOk,
    };
    updateSst({
      ...sstState,
      charlas: [item, ...sstState.charlas],
    });
    setNewTalkTema('');
    setNewTalkFrente('');
    notify(isEn ? 'Toolbox Talk & JSA saved.' : 'Charla de 5 min & ATS guardada.');
  };

  const handleToggleTalkAts = (id) => {
    updateSst({
      ...sstState,
      charlas: sstState.charlas.map((c) =>
        c.id === id ? { ...c, atsCompletado: !c.atsCompletado } : c
      ),
    });
  };

  const handleToggleWorkerEpp = (workerId, field) => {
    updateSst({
      ...sstState,
      eppTrabajadores: sstState.eppTrabajadores.map((w) =>
        w.id === workerId ? { ...w, [field]: !w[field] } : w
      ),
    });
  };

  const handleAddEppWorker = (e) => {
    e.preventDefault();
    const rol = newWorkerRole.trim();
    if (!rol) return;
    const nextCode =
      newWorkerCode.trim() ||
      `OP-${String(sstState.eppTrabajadores.length + 1).padStart(2, '0')}`;
    const item = {
      id: `epp-${Date.now()}`,
      codigo: nextCode,
      rol,
      rolEn: rol,
      cuadrilla: newWorkerCrew.trim() || (isEn ? 'Field Crew' : 'Frente General'),
      cargoCertAltura: newWorkerCertAlturas,
      venceCertAltura: offsetIsoDays(210),
      estadoAfiliacion: 'activa',
      casco: true,
      botas: true,
      arnes: newWorkerCertAlturas,
      guantes: true,
      gafas: true,
    };
    updateSst({
      ...sstState,
      eppTrabajadores: [...sstState.eppTrabajadores, item],
    });
    setNewWorkerCode('');
    setNewWorkerRole('');
    setNewWorkerCrew('');
    notify(isEn ? `Role ${nextCode} added to PPE checklist.` : `Rol ${nextCode} agregado al chequeo EPP.`);
  };

  const handleAddIncident = (e) => {
    e.preventDefault();
    const desc = newIncDesc.trim();
    if (!desc) return;
    const item = {
      id: `inc-${Date.now()}`,
      fecha: todayIso(),
      tipo: newIncTipo,
      frente: newIncFrente.trim() || (isEn ? 'General Site' : 'Frente General'),
      frenteEn: newIncFrente.trim() || 'General Site',
      descripcion: desc,
      descripcionEn: desc,
      accionCapa:
        newIncCapa.trim() ||
        (isEn
          ? 'Immediate engineering barrier and crew briefing'
          : 'Barrera preventiva inmediata y verificación en sitio'),
      accionCapaEn:
        newIncCapa.trim() || 'Immediate engineering barrier and crew briefing',
      responsable: newIncResp.trim() || (isEn ? 'Site Supervisor' : 'Residente / SST'),
      fechaLimite: newIncDeadline,
      cerrado: false,
    };
    updateSst({
      ...sstState,
      diasSinLti: newIncTipo === 'accidente_lti' ? 0 : sstState.diasSinLti,
      incidentes: [item, ...sstState.incidentes],
    });
    setNewIncDesc('');
    setNewIncCapa('');
    setNewIncFrente('');
    notify(
      newIncTipo === 'accidente_lti'
        ? isEn
          ? 'LTI reported. Safety streak reset to 0.'
          : 'Accidente LTI reportado. Contador de días reiniciado.'
        : isEn
          ? 'Field safety CAPA logged.'
          : 'Hallazgo y acción CAPA registrados.'
    );
  };

  const handleToggleIncidentClosed = (id) => {
    updateSst({
      ...sstState,
      incidentes: sstState.incidentes.map((inc) =>
        inc.id === id ? { ...inc, cerrado: !inc.cerrado } : inc
      ),
    });
  };

  const handleExportCsv = () => {
    const headers = isEn
      ? [
          'Permit Code',
          'Date',
          'Risk Type',
          'Work Zone',
          'Supervisor',
          'Height (ft)',
          'Checklist OK',
          'WC/ARL Verified',
          'Status',
        ]
      : [
          'Código PTAR',
          'Fecha',
          'Tipo Riesgo',
          'Frente',
          'Responsable',
          'Altura (m)',
          'Checklist OK',
          'ARL Vigente',
          'Estado',
        ];
    const rows = sstState.permisos.map((p) => [
      p.codigo,
      p.fecha,
      getPermitTypeLabel(p.tipo),
      isEn ? p.frenteEn || p.frente : p.frente,
      isEn ? p.responsableEn || p.responsable : p.responsable,
      p.alturaM != null ? convertLengthM(p.alturaM, lang).toFixed(2) : '-',
      p.ptarChecklistOk ? 'SI' : 'NO',
      p.arlVerificada ? 'SI' : 'NO',
      getPermitStatusLabel(p.estado),
    ]);
    downloadCsvUtf8(
      `Bitacora_SST_${proyectoActivo}_${todayIso()}.csv`,
      headers,
      rows
    );
  };

  const handlePrintPdf = (singlePermit) => {
    if (singlePermit) {
      const hDisplay =
        singlePermit.alturaM != null ? formatLength(singlePermit.alturaM, 2) : 'N/A';
      const bodyHtml = `
        <div class="kpi-grid">
          <div class="kpi"><div class="kpi-label">${isEn ? 'Permit' : 'Permiso PTAR'}</div><div class="kpi-val">${escapeHtml(singlePermit.codigo)}</div></div>
          <div class="kpi"><div class="kpi-label">${isEn ? 'Risk Class' : 'Tipo Riesgo'}</div><div class="kpi-val">${escapeHtml(getPermitTypeLabel(singlePermit.tipo))}</div></div>
          <div class="kpi"><div class="kpi-label">${isEn ? 'Height / Depth' : 'Altura / Cota'}</div><div class="kpi-val">${escapeHtml(hDisplay)}</div></div>
          <div class="kpi"><div class="kpi-label">${isEn ? 'Status' : 'Estado'}</div><div class="kpi-val">${escapeHtml(getPermitStatusLabel(singlePermit.estado))}</div></div>
        </div>
        <h2>${isEn ? 'Pre-Task Verification & Controls' : 'Frente de Obra & Validación Pre-Operacional'}</h2>
        <table>
          <tbody>
            <tr><th>${isEn ? 'Work Zone' : 'Frente'}</th><td>${escapeHtml(isEn ? singlePermit.frenteEn || singlePermit.frente : singlePermit.frente)}</td></tr>
            <tr><th>${isEn ? 'Supervisor' : 'Responsable SST'}</th><td>${escapeHtml(isEn ? singlePermit.responsableEn || singlePermit.responsable : singlePermit.responsable)}</td></tr>
            <tr><th>${isEn ? 'Checklist Verified' : 'Checklist PTAR OK'}</th><td>${singlePermit.ptarChecklistOk ? (isEn ? 'YES' : 'SÍ') : 'NO'}</td></tr>
            <tr><th>${isEn ? 'Insurance / WC Active' : 'ARL Riesgo V Vigente'}</th><td>${singlePermit.arlVerificada ? (isEn ? 'ACTIVE' : 'VIGENTE') : 'NO'}</td></tr>
            <tr><th>${isEn ? 'Control Notes' : 'Observaciones'}</th><td>${escapeHtml((isEn ? singlePermit.notasEn || singlePermit.notas : singlePermit.notas) || '-')}</td></tr>
          </tbody>
        </table>`;
      const opened = openFieldSstPrintSheet({
        docTitle: `${isEn ? 'Field Safe Work Permit (PTAR)' : 'Permiso de Trabajo Seguro en Obra (PTAR)'} • ${singlePermit.codigo}`,
        badge: isEn ? 'OSHA 1926 • FIELD PTAR' : 'RES. 4272 • PTAR DE CAMPO',
        projectTitle,
        contractorLine,
        periodOrDate: singlePermit.fecha,
        bodyHtml,
        footerNote: isDemo
          ? 'JGM ConTech Showcase • Demo Sandbox (No PII)'
          : `${proyectoInfo?.subtitulo1Valor || 'Contratista'} • Control Diario SST`,
        lang,
      });
      if (!opened) notify(isEn ? 'Allow pop-ups to print PTAR.' : 'Permite ventanas emergentes para imprimir el PTAR.');
      return;
    }

    const permitsRows = sstState.permisos
      .map(
        (p) => `<tr>
          <td><strong>${escapeHtml(p.codigo)}</strong></td>
          <td>${escapeHtml(p.fecha)}</td>
          <td>${escapeHtml(getPermitTypeLabel(p.tipo))}</td>
          <td>${escapeHtml(isEn ? p.frenteEn || p.frente : p.frente)}</td>
          <td class="num">${p.alturaM != null ? escapeHtml(formatLength(p.alturaM, 2)) : '-'}</td>
          <td><span class="pill">${escapeHtml(getPermitStatusLabel(p.estado))}</span></td>
        </tr>`
      )
      .join('');

    const capaRows =
      sstState.incidentes.length === 0
        ? `<tr><td colspan="5">${isEn ? 'No CAPA observations logged.' : 'Sin hallazgos ni acciones CAPA registradas.'}</td></tr>`
        : sstState.incidentes
            .map(
              (i) => `<tr>
                <td>${escapeHtml(i.fecha)}</td>
                <td>${escapeHtml(getIncidentTypeLabel(i.tipo))}</td>
                <td>${escapeHtml(isEn ? i.descripcionEn : i.descripcion)}</td>
                <td>${escapeHtml(isEn ? i.accionCapaEn : i.accionCapa)}</td>
                <td><span class="pill">${i.cerrado ? (isEn ? 'Closed' : 'Cerrada') : isEn ? 'Open' : 'Abierta'}</span></td>
              </tr>`
            )
            .join('');

    const bodyHtml = `
      <div class="kpi-grid">
        <div class="kpi"><div class="kpi-label">${isEn ? 'LTI-Free Days' : 'Días Sin Accidentes'}</div><div class="kpi-val">${summary.diasSinLti}</div></div>
        <div class="kpi"><div class="kpi-label">${isEn ? 'Man-Hours' : 'Horas-Hombre'}</div><div class="kpi-val">${summary.horasHombreAcum.toLocaleString()}</div></div>
        <div class="kpi"><div class="kpi-label">${isEn ? 'Active PTAR' : 'PTAR Activos'}</div><div class="kpi-val">${summary.permisosActivos}</div></div>
        <div class="kpi"><div class="kpi-label">${isEn ? 'PPE Compliance' : 'Cumplimiento EPP'}</div><div class="kpi-val">${summary.eppPct}%</div></div>
      </div>
      <h2>${isEn ? 'Site Work Permits (PTAR)' : 'Permisos de Trabajo Seguro (PTAR)'}</h2>
      <table>
        <thead><tr><th>${isEn ? 'Code' : 'Código'}</th><th>${isEn ? 'Date' : 'Fecha'}</th><th>${isEn ? 'Risk' : 'Tipo'}</th><th>${isEn ? 'Zone' : 'Frente'}</th><th class="num">${isEn ? 'Height' : 'Altura'}</th><th>${isEn ? 'Status' : 'Estado'}</th></tr></thead>
        <tbody>${permitsRows}</tbody>
      </table>
      <h2>${isEn ? 'Field CAPA Observations' : 'Hallazgos & Planes CAPA'}</h2>
      <table>
        <thead><tr><th>${isEn ? 'Date' : 'Fecha'}</th><th>${isEn ? 'Class' : 'Categoría'}</th><th>${isEn ? 'Finding' : 'Hallazgo'}</th><th>${isEn ? 'CAPA Action' : 'Acción Correctiva'}</th><th>${isEn ? 'Status' : 'Estado'}</th></tr></thead>
        <tbody>${capaRows}</tbody>
      </table>`;

    const opened = openFieldSstPrintSheet({
      docTitle: isEn
        ? 'Field HSE Daily Safety Dossier'
        : 'Informe Diario de Seguridad & Salud en Obra (SST)',
      badge: isEn ? 'ISO 45001 • OSHA 1926' : 'ISO 45001 • RES. 4272',
      projectTitle,
      contractorLine,
      periodOrDate: todayIso(),
      bodyHtml,
      footerNote: isDemo
        ? 'JGM ConTech Showcase • Demo Sandbox (No PII)'
        : `${proyectoInfo?.subtitulo1Valor || 'Contratista'} • Control Diario SST`,
      lang,
    });
    if (!opened) notify(isEn ? 'Allow pop-ups to print HSE dossier.' : 'Permite ventanas emergentes para imprimir el informe.');
  };

  return (
    <div className="space-y-4">
      {/* Encabezado Ejecutivo SST de Campo */}
      <div className="rounded-2xl steel-card p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5" />
            {isEn
              ? 'FIELD HSE SAFETY • ISO 45001 • OSHA 1926 (>6 ft)'
              : 'SST EN CAMPO • ISO 45001 • DEC. 1072 / RES. 4272 (>1.50 m)'}
          </div>
          <h2 className="text-lg font-extrabold text-slate-900">
            {isEn
              ? 'Jobsite Health, Safety & Work Permits (PTAR / JSA)'
              : 'Seguridad & Salud en Obra (PTAR, Charlas ATS, EPP & CAPA)'}
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl">
            {isEn
              ? 'Mobile-ready field safety control: authorize high-risk work permits, log daily 5-minute toolbox talks, audit PPE before shift start, and close CAPAs.'
              : 'Control diario directo en terreno: autoriza permisos de alto riesgo antes de iniciar labor, registra charlas de 5 min con ATS, audita dotación de EPP y cierra hallazgos CAPA.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleAddSafeDay}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isEn ? '+1 Safe Shift' : '+1 Día Seguro'}
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            {isEn ? 'HSE CSV' : 'CSV SST'}
          </button>
          <button
            type="button"
            onClick={() => handlePrintPdf()}
            className="steel-btn-primary inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold"
          >
            <Printer className="w-3.5 h-3.5" />
            {isEn ? 'HSE PDF Report' : 'Informe SST PDF'}
          </button>
        </div>
      </div>

      {/* Banner de Aislamiento Demo / Proyecto */}
      <div
        className={`rounded-xl px-3.5 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2 border ${
          isDemo
            ? 'bg-amber-50/90 border-amber-200 text-amber-900'
            : 'bg-sky-50/90 border-sky-200 text-sky-900'
        }`}
      >
        <div className="flex items-center gap-2 font-medium">
          <Info className="w-4 h-4 shrink-0" />
          <span>
            {isDemo
              ? isEn
                ? 'Interactive Field Demo Sandbox: Issue PTAR permits, log toolbox talks, and check PPE in memory without saving PII or altering cloud logs.'
                : 'Sandbox Interactivo de Campo: puedes emitir permisos PTAR, registrar charlas, chequear EPP y cerrar CAPAs en sesión sin guardar datos privados en la nube.'
              : isEn
                ? `Active Project Field HSE (${projectTitle}): Permits, talks, PPE checks and CAPAs auto-save locally on device for this project.`
                : `Control SST de Campo (${projectTitle}): Los permisos PTAR, charlas, EPP y CAPAs se guardan automáticamente para esta obra.`}
          </span>
        </div>
        {feedback && (
          <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-300 text-slate-800 font-bold">
            {feedback}
          </span>
        )}
      </div>

      {/* 4 Tarjetas KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl steel-card p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              {isEn ? 'LTI-Free Streak' : 'Días Sin LTI'}
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {summary.diasSinLti}
            </span>
            <span className="text-[11px] font-semibold text-emerald-700">
              {isEn ? 'days' : 'días'}
            </span>
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
            <span>{summary.horasHombreAcum.toLocaleString()} {isEn ? 'man-hrs' : 'H-H'}</span>
            <span className="font-bold text-slate-800">TRIR {summary.trir.toFixed(2)}</span>
          </div>
        </div>

        <div className="rounded-2xl steel-card p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              {isEn ? 'Active PTAR' : 'Permisos PTAR'}
            </span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {summary.permisosActivos}
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              / {sstState.permisos.length}
            </span>
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-600">
            {isEn ? 'Heights • Hot Work • LOTO' : 'Alturas • Caliente • LOTO'}
          </div>
        </div>

        <div className="rounded-2xl steel-card p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              {isEn ? 'Toolbox & JSA' : 'Charlas & ATS'}
            </span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {summary.charlasTotales}
            </span>
            <span className="text-[11px] font-semibold text-sky-700">
              {totalAsistencias} {isEn ? 'attendees' : 'asist.'}
            </span>
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-600">
            {isEn ? '5-min pre-shift safety briefings' : 'Briefings diarios por frente'}
          </div>
        </div>

        <div className="rounded-2xl steel-card p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              {isEn ? 'PPE & Open CAPA' : 'EPP & CAPAs'}
            </span>
            <HardHat className="w-4 h-4 text-slate-700" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {summary.eppPct}%
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                summary.capasAbiertas > 0
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {summary.capasAbiertas} {isEn ? 'open' : 'abiert.'}
            </span>
          </div>
          <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-600">
            {sstState.eppTrabajadores.length} {isEn ? 'roles checked' : 'roles auditados'}
          </div>
        </div>
      </div>

      {/* Sub-navegación móvil y escritorio */}
      <div className="rounded-2xl steel-card p-2 flex flex-wrap gap-1.5">
        {[
          {
            key: 'permisos',
            icon: ClipboardCheck,
            label: isEn
              ? `Work Permits (${sstState.permisos.length})`
              : `Permisos PTAR (${sstState.permisos.length})`,
          },
          {
            key: 'charlas',
            icon: Users,
            label: isEn
              ? `Toolbox & JSA (${sstState.charlas.length})`
              : `Charlas & ATS (${sstState.charlas.length})`,
          },
          {
            key: 'epp',
            icon: HardHat,
            label: isEn
              ? `PPE Check (${sstState.eppTrabajadores.length})`
              : `Check EPP (${sstState.eppTrabajadores.length})`,
          },
          {
            key: 'incidentes',
            icon: AlertTriangle,
            label: isEn
              ? `CAPA Log (${sstState.incidentes.length})`
              : `Hallazgos CAPA (${sstState.incidentes.length})`,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = subView === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSubView(tab.key)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                active
                  ? 'steel-btn-primary text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-VISTA 1: PERMISOS PTAR */}
      {subView === 'permisos' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-4 rounded-2xl steel-card p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                {isEn ? 'Issue Field PTAR Permit' : 'Emitir Permiso PTAR en Obra'}
              </h3>
            </div>
            <form onSubmit={handleAddPermit} className="space-y-2.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isEn ? 'Hazard Type' : 'Tipo de Riesgo'}
                </label>
                <select
                  value={newPermitTipo}
                  onChange={(e) => setNewPermitTipo(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-slate-900 font-semibold"
                >
                  <option value="alturas">{getPermitTypeLabel('alturas')}</option>
                  <option value="caliente">{getPermitTypeLabel('caliente')}</option>
                  <option value="excavacion">{getPermitTypeLabel('excavacion')}</option>
                  <option value="electrico">{getPermitTypeLabel('electrico')}</option>
                  <option value="izaje">{getPermitTypeLabel('izaje')}</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isEn ? 'Work Zone / Front' : 'Frente de Obra'}
                </label>
                <input
                  type="text"
                  required
                  value={newPermitFrente}
                  onChange={(e) => setNewPermitFrente(e.target.value)}
                  placeholder={isEn ? 'e.g., East Roof / Scaffolding' : 'Ej: Andamio Fachada / Cubierta'}
                  className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isEn ? 'Supervisor' : 'Coordinador'}
                  </label>
                  <input
                    type="text"
                    value={newPermitResp}
                    onChange={(e) => setNewPermitResp(e.target.value)}
                    placeholder={isEn ? 'Site HSE Officer' : 'Inspector SST'}
                    className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-slate-900"
                  />
                </div>
                {newPermitTipo === 'alturas' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isEn ? 'Height (ft)' : 'Altura (m)'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={newPermitHeightInput}
                      onChange={(e) => setNewPermitHeightInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-slate-900 tabular-nums"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isEn ? 'Control Notes' : 'Medidas de Control'}
                </label>
                <input
                  type="text"
                  value={newPermitNotes}
                  onChange={(e) => setNewPermitNotes(e.target.value)}
                  placeholder={isEn ? 'Lifeline, harness, fire watch...' : 'Línea de vida, extintor, candado LOTO...'}
                  className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-slate-900"
                />
              </div>
              <div className="space-y-1.5 pt-1">
                <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newPermitChecklistOk}
                    onChange={(e) => setNewPermitChecklistOk(e.target.checked)}
                  />
                  {isEn ? 'Pre-task JSA checklist complete' : 'Checklist PTAR verificado en sitio'}
                </label>
                <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newPermitArlOk}
                    onChange={(e) => setNewPermitArlOk(e.target.checked)}
                  />
                  {isEn ? "Active WC & Heights cert verified" : 'ARL Riesgo V & Cert. Alturas vigente'}
                </label>
              </div>
              <button
                type="submit"
                className="w-full steel-btn-primary inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                {isEn ? 'Authorize & Save PTAR' : 'Autorizar & Guardar PTAR'}
              </button>
            </form>
          </div>

          <div className="xl:col-span-8 rounded-2xl steel-card p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isEn ? 'Active & Logged Site PTAR Permits' : 'Permisos de Trabajo Seguro en Sitio (PTAR)'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isEn ? 'Tap status badge to advance state.' : 'Toca el estado para cambiar Vigente / Pendiente / Cerrado.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                {['all', 'vigente', 'pendiente', 'cerrado'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setPermitFilter(f)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                      permitFilter === f
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {f === 'all' ? (isEn ? 'All' : 'Todos') : getPermitStatusLabel(f)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredPermits.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl steel-subcard p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-black text-slate-900">{p.codigo}</span>
                      <span className="text-[11px] text-slate-500">{p.fecha}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-800 text-[10px] font-bold">
                        {getPermitTypeLabel(p.tipo)}
                      </span>
                      {p.alturaM != null && (
                        <span className="px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[10px] font-extrabold tabular-nums">
                          {formatLength(p.alturaM, 2)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      {isEn ? p.frenteEn || p.frente : p.frente}
                    </div>
                    {(p.notas || p.notasEn) && (
                      <div className="text-[11px] text-slate-600">
                        {isEn ? p.notasEn || p.notas : p.notas}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3 text-[10px] font-bold pt-0.5">
                      <span className={p.ptarChecklistOk ? 'text-emerald-700' : 'text-amber-700'}>
                        <CheckCircle2 className="inline w-3 h-3 mr-0.5" />
                        {p.ptarChecklistOk ? (isEn ? 'JSA OK' : 'Checklist OK') : isEn ? 'JSA Pend.' : 'Sin Checklist'}
                      </span>
                      <span className={p.arlVerificada ? 'text-emerald-700' : 'text-rose-700'}>
                        <Activity className="inline w-3 h-3 mr-0.5" />
                        {p.arlVerificada ? (isEn ? 'WC/ARL Active' : 'ARL Vigente') : isEn ? 'No WC' : 'Sin ARL'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleCyclePermitStatus(p.id)}
                      className={`px-2.5 py-1 rounded-full border text-[11px] font-extrabold ${getPermitStatusBadgeClass(
                        p.estado
                      )}`}
                    >
                      {getPermitStatusLabel(p.estado)}
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePrintPdf(p)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-[11px] font-bold"
                    >
                      <Printer className="w-3 h-3" />
                      PTAR
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VISTA 2: CHARLAS DE 5 MIN & ATS */}
      {subView === 'charlas' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-4 rounded-2xl steel-card p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <Plus className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900">
                {isEn ? 'Log 5-Min Toolbox Talk & JSA' : 'Registrar Charla Diaria & ATS'}
              </h3>
            </div>
            <form onSubmit={handleAddTalk} className="space-y-2.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isEn ? 'Safety Topic' : 'Tema de Seguridad'}
                </label>
                <input
                  type="text"
                  required
                  value={newTalkTema}
                  onChange={(e) => setNewTalkTema(e.target.value)}
                  placeholder={isEn ? 'e.g., Anchor & PPE check before lift' : 'Ej: Revisión arnés y bloqueo de andamios'}
                  className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isEn ? 'Crew / Zone' : 'Frente / Cuadrilla'}
                </label>
                <input
                  type="text"
                  value={newTalkFrente}
                  onChange={(e) => setNewTalkFrente(e.target.value)}
                  placeholder={isEn ? 'All Active Crews' : 'Frente Estructura & Envolvente'}
                  className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isEn ? 'Instructor' : 'Instructor'}
                  </label>
                  <input
                    type="text"
                    value={newTalkInstructor}
                    onChange={(e) => setNewTalkInstructor(e.target.value)}
                    placeholder={isEn ? 'HSE Officer' : 'Coordinación SST'}
                    className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isEn ? 'Attendees' : 'Asistentes'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newTalkAsistentes}
                    onChange={(e) => setNewTalkAsistentes(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-slate-900 tabular-nums"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={newTalkAtsOk}
                  onChange={(e) => setNewTalkAtsOk(e.target.checked)}
                />
                {isEn ? 'Daily JSA signed by crew' : 'ATS firmado por el personal'}
              </label>
              <button
                type="submit"
                className="w-full steel-btn-primary inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold"
              >
                <Users className="w-3.5 h-3.5" />
                {isEn ? 'Save Toolbox Talk' : 'Guardar Charla & ATS'}
              </button>
            </form>
          </div>

          <div className="xl:col-span-8 rounded-2xl steel-card p-4 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              {isEn ? 'Toolbox Talks & JSA History' : 'Historial de Charlas Pre-Operacionales'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sstState.charlas.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl steel-subcard p-3 flex flex-col justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-extrabold text-sky-700">{c.fecha}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 font-bold text-slate-700">
                        {c.asistentes} {isEn ? 'workers' : 'operarios'}
                      </span>
                    </div>
                    <h4 className="mt-1.5 text-xs font-extrabold text-slate-900">
                      {isEn ? c.temaEn : c.tema}
                    </h4>
                    <p className="mt-1 text-[11px] text-slate-600">
                      <strong>{isEn ? 'Zone:' : 'Frente:'}</strong>{' '}
                      {isEn ? c.frenteEn || c.frente : c.frente}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">
                      {isEn ? c.instructorEn || c.instructor : c.instructor}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleTalkAts(c.id)}
                      className={`px-2 py-0.5 rounded-full border font-bold ${
                        c.atsCompletado
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {c.atsCompletado
                        ? isEn
                          ? 'JSA Signed'
                          : 'ATS Firmado'
                        : isEn
                          ? 'JSA Pending'
                          : 'ATS Pendiente'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VISTA 3: MATRIZ RÁPIDA EPP EN CAMPO */}
      {subView === 'epp' && (
        <div className="space-y-4">
          <div className="rounded-2xl steel-card p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isEn ? 'Field PPE Audit & Heights Certs' : 'Chequeo Rápido EPP & Certificados en Obra'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isEn ? 'Tap any PPE box to toggle compliance status live.' : 'Toca cualquier ítem para verificar cumplimiento en campo.'}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold">
                {summary.eppPct}% {isEn ? 'PPE Score' : 'Cumplimiento'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="py-2 pr-2">{isEn ? 'ID / Trade Role' : 'Código / Rol'}</th>
                    <th className="py-2 px-2">{isEn ? 'Crew' : 'Cuadrilla'}</th>
                    <th className="py-2 px-2">{isEn ? 'Heights' : 'Alturas'}</th>
                    <th className="py-2 px-1.5 text-center">{isEn ? 'Helm' : 'Casco'}</th>
                    <th className="py-2 px-1.5 text-center">{isEn ? 'Boots' : 'Botas'}</th>
                    <th className="py-2 px-1.5 text-center">{isEn ? 'Harn.' : 'Arnés'}</th>
                    <th className="py-2 px-1.5 text-center">{isEn ? 'Glove' : 'Guant.'}</th>
                    <th className="py-2 px-1.5 text-center">{isEn ? 'Glass' : 'Gafas'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sstState.eppTrabajadores.map((w) => (
                    <tr key={w.id}>
                      <td className="py-2.5 pr-2">
                        <div className="font-extrabold text-slate-900">
                          {w.codigo} • {isEn ? w.rolEn : w.rol}
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700">
                          {isEn ? 'WC/ARL: Active' : `ARL: ${w.estadoAfiliacion.toUpperCase()}`}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-slate-700 font-medium">{w.cuadrilla}</td>
                      <td className="py-2.5 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            w.cargoCertAltura
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {w.cargoCertAltura ? w.venceCertAltura : isEn ? 'Level 0' : 'Nivel 0'}
                        </span>
                      </td>
                      {['casco', 'botas', 'arnes', 'guantes', 'gafas'].map((field) => (
                        <td key={field} className="py-2.5 px-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleWorkerEpp(w.id, field)}
                            className={`w-7 h-7 rounded-lg border text-[11px] font-black transition-colors ${
                              w[field]
                                ? 'bg-emerald-600 text-white border-emerald-700'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {w[field] ? 'OK' : '!'}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <form
            onSubmit={handleAddEppWorker}
            className="rounded-2xl steel-card p-4 grid grid-cols-1 md:grid-cols-5 gap-2.5 items-end text-xs"
          >
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isEn ? 'Code' : 'Código'}
              </label>
              <input
                type="text"
                value={newWorkerCode}
                onChange={(e) => setNewWorkerCode(e.target.value)}
                placeholder="OP-06"
                className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-slate-900"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                {isEn ? 'Trade Role (No PII)' : 'Rol / Especialidad (sin PII)'}
              </label>
              <input
                type="text"
                required
                value={newWorkerRole}
                onChange={(e) => setNewWorkerRole(e.target.value)}
                placeholder={isEn ? 'e.g., Certified Electrician' : 'Ej: Oficial Eléctrico'}
                className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isEn ? 'Crew' : 'Cuadrilla'}
              </label>
              <input
                type="text"
                value={newWorkerCrew}
                onChange={(e) => setNewWorkerCrew(e.target.value)}
                placeholder={isEn ? 'Roof / MEP' : 'Frente Obra'}
                className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-slate-900"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newWorkerCertAlturas}
                  onChange={(e) => setNewWorkerCertAlturas(e.target.checked)}
                />
                {isEn ? 'Heights Cert.' : 'Cert. Alturas'}
              </label>
              <button
                type="submit"
                className="steel-btn-primary inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                {isEn ? 'Add Role' : 'Agregar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-VISTA 4: HALLAZGOS & CAPA */}
      {subView === 'incidentes' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-4 rounded-2xl steel-card p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                {isEn ? 'Report Field Finding / CAPA' : 'Reportar Hallazgo / CAPA en Obra'}
              </h3>
            </div>
            <form onSubmit={handleAddIncident} className="space-y-2.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isEn ? 'Classification' : 'Clasificación'}
                </label>
                <select
                  value={newIncTipo}
                  onChange={(e) => setNewIncTipo(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-slate-900 font-semibold"
                >
                  <option value="condicion_insegura">{getIncidentTypeLabel('condicion_insegura')}</option>
                  <option value="cuasi_accidente">{getIncidentTypeLabel('cuasi_accidente')}</option>
                  <option value="incidente_leve">{getIncidentTypeLabel('incidente_leve')}</option>
                  <option value="accidente_lti">{getIncidentTypeLabel('accidente_lti')}</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isEn ? 'Zone' : 'Frente'}
                </label>
                <input
                  type="text"
                  value={newIncFrente}
                  onChange={(e) => setNewIncFrente(e.target.value)}
                  placeholder={isEn ? 'North Bay / Scaffold' : 'Andamio / Patio Acopio'}
                  className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isEn ? 'Observation' : 'Descripción del Hallazgo'}
                </label>
                <textarea
                  required
                  rows={2}
                  value={newIncDesc}
                  onChange={(e) => setNewIncDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isEn ? 'Corrective Action (CAPA)' : 'Acción Correctiva (CAPA)'}
                </label>
                <textarea
                  rows={2}
                  value={newIncCapa}
                  onChange={(e) => setNewIncCapa(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isEn ? 'Owner' : 'Responsable'}
                  </label>
                  <input
                    type="text"
                    value={newIncResp}
                    onChange={(e) => setNewIncResp(e.target.value)}
                    placeholder={isEn ? 'Site Lead' : 'Residente SST'}
                    className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isEn ? 'Due Date' : 'Límite'}
                  </label>
                  <input
                    type="date"
                    value={newIncDeadline}
                    onChange={(e) => setNewIncDeadline(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-slate-900"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full steel-btn-primary inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                {isEn ? 'Register CAPA' : 'Registrar Hallazgo'}
              </button>
            </form>
          </div>

          <div className="xl:col-span-8 rounded-2xl steel-card p-4 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              {isEn ? 'Site CAPA & Incidents Register' : 'Registro de Hallazgos & Planes CAPA'}
            </h3>
            {sstState.incidentes.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">
                {isEn ? 'Zero open CAPA observations on this project.' : 'Sin hallazgos ni incidentes registrados.'}
              </div>
            ) : (
              <div className="space-y-2.5">
                {sstState.incidentes.map((inc) => (
                  <div
                    key={inc.id}
                    className="rounded-xl steel-subcard p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span
                          className={`px-2 py-0.5 rounded-full font-extrabold border ${
                            inc.tipo === 'accidente_lti'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : inc.tipo === 'incidente_leve'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-sky-50 text-sky-800 border-sky-200'
                          }`}
                        >
                          {getIncidentTypeLabel(inc.tipo)}
                        </span>
                        <span className="font-bold text-slate-700">{inc.fecha}</span>
                        <span className="text-slate-500">
                          • {isEn ? inc.frenteEn || inc.frente : inc.frente}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900">
                        {isEn ? inc.descripcionEn : inc.descripcion}
                      </p>
                      <p className="text-xs text-slate-600">
                        <strong className="text-slate-800">CAPA:</strong>{' '}
                        {isEn ? inc.accionCapaEn : inc.accionCapa}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleIncidentClosed(inc.id)}
                      className={`shrink-0 px-3 py-1.5 rounded-lg border text-xs font-extrabold ${
                        inc.cerrado
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {inc.cerrado
                        ? isEn
                          ? 'CAPA Closed'
                          : 'CAPA Cerrada'
                        : isEn
                          ? 'Close CAPA'
                          : 'Cerrar CAPA'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
