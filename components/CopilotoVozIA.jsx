'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useAppPreferences } from '../lib/i18n';
import { localizeActivity, unitConversionFactor } from '../lib/units';

const REGLAS_ACTIVIDADES = [
  {
    claves: ['zapata', 'zapatas', 'cimentación', 'cimentacion', 'footing', 'footings'],
    actividad: 'Concreto en zapatas y cimentación',
    demoActividad: "[BIM_TAKEOFF] Concreto en zapatas y vigas de cimentación f'c=21 MPa",
    unidad: 'm³',
    desperdicio: 5,
  },
  {
    claves: ['columna', 'columnas', 'column', 'pórtico', 'portico'],
    actividad: 'Concreto en columnas estructurales',
    demoActividad: "[BIM_TAKEOFF] Concreto en columnas y pórtico estructural f'c=24 MPa",
    unidad: 'm³',
    desperdicio: 5,
  },
  {
    claves: ['viga', 'vigas', 'amarre', 'beam', 'beams'],
    actividad: 'Concreto en vigas de amarre y aéreas',
    demoActividad: "[BIM_TAKEOFF] Concreto en columnas y pórtico estructural f'c=24 MPa",
    unidad: 'm³',
    desperdicio: 5,
  },
  {
    claves: ['plantilla', 'solado', 'pobre', 'sub-slab', 'screed'],
    actividad: 'Construcción de plantilla de concreto',
    demoActividad: '[BIM_TAKEOFF] Instalación de piso en porcelanato 51×51 cm y plantilla',
    unidad: 'm³',
    desperdicio: 5,
  },
  {
    claves: ['mampostería', 'mamposteria', 'bloque', 'bloques', 'muro', 'masonry', 'cmu', 'block', 'wall'],
    actividad: 'Muros en mampostería de bloques de concreto',
    demoActividad: '[BIM_TAKEOFF] Muros en mampostería de bloques de concreto No. 12',
    unidad: 'm²',
    desperdicio: 5,
  },
  {
    claves: ['pañete', 'panete', 'revoco', 'mortero', 'plaster', 'stucco'],
    actividad: 'Pañete y mortero de revoco en muros',
    demoActividad: '[BIM_TAKEOFF] Pañete y mortero de revoco en muros dos caras',
    unidad: 'm²',
    desperdicio: 7,
  },
  {
    claves: ['piso', 'porcelanato', 'ceramica', 'cerámica', 'enchape', 'tile', 'porcelain', 'flooring'],
    actividad: 'Instalación de piso cerámico / enchape',
    demoActividad: '[BIM_TAKEOFF] Instalación de piso en porcelanato 51×51 cm y plantilla',
    unidad: 'm²',
    desperdicio: 7,
  },
  {
    claves: ['frescasa', 'cielo', 'cielorraso', 'drywall', 'ceiling', 'insulation'],
    actividad: 'Instalación de cielo raso',
    demoActividad: '[BIM_TAKEOFF] Cielo raso suspendido Drywall + Aislamiento Frescasa Eco 2-1/2"',
    unidad: 'm²',
    desperdicio: 5,
  },
  {
    claves: ['pintura', 'estuco', 'vinilica', 'paint', 'skim'],
    actividad: 'Estuco y pintura vinílica en muros',
    demoActividad: '[BIM_TAKEOFF] Estuco plástico y pintura vinílica arquitectónica en muros',
    unidad: 'm²',
    desperdicio: 5,
  },
  {
    claves: ['cubierta', 'teja', 'eternit', 'roof', 'roofing'],
    actividad: 'Montaje de cubierta en Eternit',
    demoActividad: '[BIM_TAKEOFF] Montaje de cubierta termoacústica Eternit y caballetes',
    unidad: 'm²',
    desperdicio: 5,
  },
  {
    claves: ['ventana', 'ventaneria', 'puerta', 'door', 'window', 'glazing'],
    actividad: 'Instalación de puertas y ventanas',
    demoActividad: '[BIM_TAKEOFF] Ventanería aluminio termoacústica y puertas interiores',
    unidad: 'und',
    desperdicio: 0,
  },
];

export default function CopilotoVozIA({ onDatosDetectados, isDemo = false }) {
  const { lang } = useAppPreferences();
  const [escuchando, setEscuchando] = useState(false);
  const [transcripcion, setTranscripcion] = useState('');
  const [mensajeIA, setMensajeIA] = useState('');
  const [errorIA, setErrorIA] = useState('');
  const [disponible, setDisponible] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setDisponible(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = lang === 'en' ? 'en-US' : 'es-CO';

    recognition.onstart = () => {
      setEscuchando(true);
      setErrorIA('');
      setMensajeIA(
        lang === 'en'
          ? 'Listening to Project Engineer... Speak clearly about today’s site progress.'
          : 'Escuchando al Residente de Obra... Dicta claramente el avance ejecutado hoy.'
      );
    };

    recognition.onresult = (event) => {
      let textoActual = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        textoActual += event.results[i][0].transcript;
      }
      setTranscripcion(textoActual);

      if (event.results[0]?.isFinal) {
        procesarVozConIA(textoActual);
      }
    };

    recognition.onerror = (event) => {
      console.warn('SpeechRecognition error:', event.error);
      setEscuchando(false);
      if (event.error === 'not-allowed') {
        setErrorIA(
          lang === 'en'
            ? 'Microphone permission denied. Allow microphone access in browser.'
            : 'Acceso al micrófono denegado. Permite el micrófono en tu navegador.'
        );
      } else {
        setErrorIA(
          lang === 'en'
            ? 'Audio capture interrupted. Tap microphone to retry.'
            : 'No se logró captar el audio. Presiona el micrófono para reintentar.'
        );
      }
    };

    recognition.onend = () => {
      setEscuchando(false);
    };

    recognitionRef.current = recognition;
  }, [lang, isDemo]);

  const toggleEscucha = () => {
    if (!disponible) {
      alert(
        lang === 'en'
          ? 'Your browser does not support native Web Speech Recognition. Try Chrome or Edge.'
          : 'Tu navegador no soporta reconocimiento de voz nativo. Recomendamos Google Chrome o Edge.'
      );
      return;
    }

    if (escuchando) {
      recognitionRef.current?.stop();
    } else {
      setTranscripcion('');
      setErrorIA('');
      setMensajeIA(lang === 'en' ? 'Activating microphone...' : 'Activando micrófono...');
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn('Re-start recognition:', err);
      }
    }
  };

  const procesarVozConIA = (texto) => {
    const t = String(texto || '').toLowerCase();
    const datos = {};

    const matchNum = t.match(/(\d+[.,]?\d*)/);
    if (matchNum) {
      datos.cantidad = matchNum[1].replace(',', '.');
    }

    let actividadEncontrada = null;
    for (const regla of REGLAS_ACTIVIDADES) {
      if (regla.claves.some((clave) => t.includes(clave))) {
        actividadEncontrada = regla;
        break;
      }
    }

    if (actividadEncontrada) {
      datos.actividad = isDemo ? actividadEncontrada.demoActividad : actividadEncontrada.actividad;
      datos.unidad = actividadEncontrada.unidad;
      datos.desperdicio = actividadEncontrada.desperdicio;
    }

    if (t.includes('sol') || t.includes('soleado') || t.includes('sun') || t.includes('clear')) {
      datos.clima = 'Soleado';
    } else if (t.includes('lluvia fuerte') || t.includes('tormenta') || t.includes('heavy rain') || t.includes('storm')) {
      datos.clima = 'Lluvia Fuerte / Suspensión';
    } else if (t.includes('lluvia') || t.includes('llovizna') || t.includes('rain') || t.includes('drizzle')) {
      datos.clima = 'Lluvia Ligera';
    } else if (t.includes('nublado') || t.includes('cloud') || t.includes('overcast')) {
      datos.clima = 'Nublado';
    }

    const matchOficial = t.match(/(\d+)\s*(oficial|oficiales|lead tech|tech)/);
    const matchAyudante = t.match(/(\d+)\s*(ayudante|ayudantes|peón|peones|helper|helpers)/);
    if (matchOficial || matchAyudante) {
      const of = matchOficial
        ? lang === 'en'
          ? `${matchOficial[1]} Lead Tech${Number(matchOficial[1]) > 1 ? 's' : ''}`
          : `${matchOficial[1]} Oficial${Number(matchOficial[1]) > 1 ? 'es' : ''}`
        : '';
      const ay = matchAyudante
        ? lang === 'en'
          ? `${matchAyudante[1]} Helper${Number(matchAyudante[1]) > 1 ? 's' : ''}`
          : `${matchAyudante[1]} Ayudante${Number(matchAyudante[1]) > 1 ? 's' : ''}`
        : '';
      datos.cuadrilla = [of, ay].filter(Boolean).join(' + ');
    }

    datos.observaciones = lang === 'en' ? `Voice log: "${texto.trim()}"` : `Dictado por voz: "${texto.trim()}"`;

    onDatosDetectados(datos);

    const descripActividad = datos.actividad
      ? localizeActivity(datos.actividad, lang)
      : lang === 'en'
      ? 'General field activity'
      : 'Actividad general';

    setErrorIA('');
    setMensajeIA(
      lang === 'en'
        ? `Understood! Form pre-filled: ${descripActividad}${datos.cantidad ? ` (${datos.cantidad})` : ''}.`
        : `Entendido. Formulario diligenciado: ${descripActividad}${datos.cantidad ? ` (${datos.cantidad})` : ''}.`
    );

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        const spokenText =
          lang === 'en'
            ? `Understood Project Engineer. Loaded ${datos.cantidad || ''} for ${descripActividad}`
            : `Entendido Residente de Obra. Cargado ${datos.cantidad || ''} en ${descripActividad}`;
        const mensajeVoz = new SpeechSynthesisUtterance(spokenText);
        mensajeVoz.lang = lang === 'en' ? 'en-US' : 'es-CO';
        mensajeVoz.rate = 1.05;
        window.speechSynthesis.speak(mensajeVoz);
      } catch {}
    }
  };

  const probarFraseEjemplo = (frase) => {
    setTranscripcion(frase);
    procesarVozConIA(frase);
  };

  const sample1 =
    lang === 'en'
      ? 'Poured 4.5 cubic yards concrete footings clear weather with 1 lead tech and 3 helpers'
      : 'Vaciado de 4.5 metros cúbicos de concreto en zapatas soleado con 1 oficial y 3 ayudantes';
  const sample2 =
    lang === 'en'
      ? 'Installed 280 sq ft of porcelain tile flooring with 1 lead tech and 1 helper'
      : 'Hoy instalamos 26 metros cuadrados de piso en porcelanato con 1 oficial y 1 ayudante';

  return (
    <div className="rounded-2xl steel-subcard border-slate-400/70 p-4 mb-5 shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleEscucha}
            className={`relative p-3.5 rounded-2xl font-bold transition shadow-md flex items-center justify-center ${
              escuchando
                ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/40 ring-4 ring-rose-200'
                : 'steel-btn-primary text-white shadow-md'
            }`}
            title={
              escuchando
                ? lang === 'en'
                  ? 'Stop dictation'
                  : 'Detener dictado'
                : lang === 'en'
                ? 'Start voice dictation'
                : 'Iniciar dictado por voz'
            }
          >
            {escuchando ? <MicOff className="h-5 w-5 animate-spin" /> : <Mic className="h-5 w-5" />}
            {escuchando && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
              </span>
            )}
          </button>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                {lang === 'en' ? 'JGM Voice AI Field Copilot' : 'Copiloto de IA por Voz JGM'}
              </h3>
              <span className="rounded-full bg-slate-200 text-slate-900 text-[10px] font-black px-2 py-0.5 border border-slate-400/70">
                {lang === 'en' ? 'Hands-Free Dictation' : 'Dictado en Campo'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">
              {escuchando
                ? lang === 'en'
                  ? 'Speak now: "Installed 280 sq ft of porcelain tile today, 1 lead tech..."'
                  : 'Habla ahora: "Vaciamos 4.5 m3 de zapatas hoy, 1 oficial y 3 ayudantes..."'
                : lang === 'en'
                ? 'Tap microphone to dictate field logs hands-free while walking the site.'
                : 'Presiona el micrófono y dicta tu reporte mientras recorres la obra sin teclear.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-slate-400 font-semibold hidden md:inline">
            {lang === 'en' ? 'Try:' : 'Probar:'}
          </span>
          <button
            type="button"
            onClick={() => probarFraseEjemplo(sample1)}
            className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/90 border border-slate-300 text-slate-800 hover:bg-slate-200/70 transition truncate max-w-[180px]"
          >
            {lang === 'en' ? '"4.5 yd³ footings..."' : '"4.5 m³ zapatas..."'}
          </button>
          <button
            type="button"
            onClick={() => probarFraseEjemplo(sample2)}
            className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/90 border border-slate-300 text-slate-800 hover:bg-slate-200/70 transition truncate max-w-[180px]"
          >
            {lang === 'en' ? '"280 ft² porcelain..."' : '"26 m² porcelanato..."'}
          </button>
        </div>
      </div>

      {(transcripcion || mensajeIA || errorIA) && (
        <div className="mt-3 pt-3 border-t border-slate-300/80 flex flex-col gap-1 text-xs">
          {transcripcion && (
            <div className="p-2 rounded-lg bg-white/90 border border-slate-300 text-slate-800 italic font-mono text-[11px]">
              "{transcripcion}"
            </div>
          )}
          {mensajeIA && (
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>{mensajeIA}</span>
            </div>
          )}
          {errorIA && (
            <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[11px]">
              <AlertCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
              <span>{errorIA}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
