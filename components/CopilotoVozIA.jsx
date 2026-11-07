'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, Check, Volume2, AlertCircle, RefreshCw } from 'lucide-react';

// Mapeo inteligente de palabras clave del lenguaje natural a las actividades WBS
const REGLAS_ACTIVIDADES = [
  {
    claves: ['losa', 'metaldeck', 'chapa'],
    actividad: 'Losa en concreto para metaldeck e=0.10m (f\'c=21 MPa)',
    unidad: 'm²',
    desperdicio: 5
  },
  {
    claves: ['columna', 'columnas'],
    actividad: 'Concreto en columnas estructurales',
    unidad: 'm³',
    desperdicio: 5
  },
  {
    claves: ['viga', 'vigas', 'amarre', 'aérea', 'aerea'],
    actividad: 'Concreto en vigas de amarre y aéreas',
    unidad: 'm³',
    desperdicio: 5
  },
  {
    claves: ['zapata', 'zapatas', 'cimentación', 'cimentacion'],
    actividad: 'Concreto en zapatas y cimentación',
    unidad: 'm³',
    desperdicio: 7
  },
  {
    claves: ['plantilla', 'solado', 'pobre'],
    actividad: 'Construcción de plantilla de concreto',
    unidad: 'm³',
    desperdicio: 5
  },
  {
    claves: ['mampostería', 'mamposteria', 'bloque', 'bloques', 'muro', 'muros', 'pared'],
    actividad: 'Muros en mampostería en bloques de concreto',
    unidad: 'm²',
    desperdicio: 5
  },
  {
    claves: ['piso', 'ceramica', 'cerámica', 'enchape', 'baldosa'],
    actividad: 'Instalación de piso cerámico / enchape',
    unidad: 'm²',
    desperdicio: 5
  },
  {
    claves: ['tubo', 'tubería', 'tuberia', 'conduit', 'eléctrico', 'electrico'],
    actividad: 'Montaje de tubería en Conduit',
    unidad: 'ml',
    desperdicio: 5
  },
  {
    claves: ['cielo', 'cielorraso', 'drywall', 'yeso', 'durlock'],
    actividad: 'Cielorraso en drywall con estructura galvanizada',
    unidad: 'm²',
    desperdicio: 5
  },
  {
    claves: ['excavación', 'excavacion', 'tierra', 'zanja'],
    actividad: 'Excavación manual en material común',
    unidad: 'm³',
    desperdicio: 0
  }
];

export default function CopilotoVozIA({ onDatosDetectados, actividadesDisponibles = [] }) {
  const [escuchando, setEscuchando] = useState(false);
  const [transcripcion, setTranscripcion] = useState('');
  const [mensajeIA, setMensajeIA] = useState('');
  const [disponible, setDisponible] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = typeof window !== 'undefined' && 
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setDisponible(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'es-CO'; // Español Colombia

    recognition.onstart = () => {
      setEscuchando(true);
      setMensajeIA('🎙️ Escuchando al Ing. Juan González... Habla claro sobre el trabajo realizado hoy.');
    };

    recognition.onresult = (event) => {
      let textoActual = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        textoActual += event.results[i][0].transcript;
      }
      setTranscripcion(textoActual);

      if (event.results[0].isFinal) {
        procesarVozConIA(textoActual);
      }
    };

    recognition.onerror = (event) => {
      console.warn('SpeechRecognition error:', event.error);
      setEscuchando(false);
      if (event.error === 'not-allowed') {
        setMensajeIA('⚠️ Acceso al micrófono denegado. Permite el micrófono en tu navegador.');
      } else {
        setMensajeIA('⚠️ No se logró captar el audio. Presiona el micrófono para reintentar.');
      }
    };

    recognition.onend = () => {
      setEscuchando(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleEscucha = () => {
    if (!disponible) {
      alert('Tu navegador no soporta reconocimiento de voz nativo. Te recomendamos usar Google Chrome o Safari actualizado.');
      return;
    }

    if (escuchando) {
      recognitionRef.current?.stop();
    } else {
      setTranscripcion('');
      setMensajeIA('Activando micrófono...');
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn('Re-start recognition:', err);
      }
    }
  };

  // Motor Heurístico de Procesamiento de Lenguaje Natural para Obras Civiles
  const procesarVozConIA = (texto) => {
    const t = texto.toLowerCase();
    const datos = {};

    // 1. Extraer Cantidad
    // Busca números enteros o decimales (ej. "14", "14.5", "14 con 5", "tres", etc.)
    const regexNumero = /(\d+[.,]?\d*)/;
    const matchNum = t.match(regexNumero);
    if (matchNum) {
      datos.cantidad = matchNum[1].replace(',', '.');
    }

    // 2. Extraer Actividad Constructiva
    let actividadEncontrada = null;
    for (const regla of REGLAS_ACTIVIDADES) {
      if (regla.claves.some(clave => t.includes(clave))) {
        actividadEncontrada = regla;
        break;
      }
    }

    if (actividadEncontrada) {
      datos.actividad = actividadEncontrada.actividad;
      datos.unidad = actividadEncontrada.unidad;
      datos.desperdicio = actividadEncontrada.desperdicio;
    }

    // 3. Extraer Clima
    if (t.includes('sol') || t.includes('soleado') || t.includes('despejado') || t.includes('caluroso')) {
      datos.clima = 'Soleado';
    } else if (t.includes('lluvia fuerte') || t.includes('tormenta') || t.includes('aguacero')) {
      datos.clima = 'Lluvia Fuerte / Suspensión';
    } else if (t.includes('lluvia') || t.includes('llovizna') || t.includes('garúa')) {
      datos.clima = 'Lluvia Ligera';
    } else if (t.includes('nublado') || t.includes('gris') || t.includes('sombra')) {
      datos.clima = 'Nublado';
    }

    // 4. Extraer Personal / Cuadrilla
    const matchOficial = t.match(/(\d+)\s*(oficial|oficiales)/);
    const matchAyudante = t.match(/(\d+)\s*(ayudante|ayudantes|peón|peones)/);
    if (matchOficial || matchAyudante) {
      const of = matchOficial ? `${matchOficial[1]} Oficial${matchOficial[1] > 1 ? 'es' : ''}` : '';
      const ay = matchAyudante ? `${matchAyudante[1]} Ayudante${matchAyudante[1] > 1 ? 's' : ''}` : '';
      datos.cuadrilla = [of, ay].filter(Boolean).join(' + ');
    }

    // 5. Asignar Observaciones
    datos.observaciones = `Dictado por voz: "${texto.trim()}"`;

    // Notificar al componente padre
    onDatosDetectados(datos);

    const descripActividad = datos.actividad || 'Actividad general';
    const cantTexto = datos.cantidad ? `${datos.cantidad} ${datos.unidad || 'und'}` : '';
    setMensajeIA(`✨ ¡Entendido! Formulario auto-diligenciado: ${descripActividad} ${cantTexto ? `(${cantTexto})` : ''}.`);

    // Respuesta por Voz (Text-to-Speech)
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        const mensajeVoz = new SpeechSynthesisUtterance(
          `Entendido Ingeniero Juan. He cargado ${datos.cantidad || ''} de ${descripActividad}`
        );
        mensajeVoz.lang = 'es-CO';
        mensajeVoz.rate = 1.05;
        window.speechSynthesis.speak(mensajeVoz);
      } catch (err) {}
    }
  };

  const probarFraseEjemplo = (frase) => {
    setTranscripcion(frase);
    procesarVozConIA(frase);
  };

  return (
    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-sky-50/70 to-purple-50/90 p-4 mb-5 shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        {/* Identificador y Botón de Escucha */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleEscucha}
            className={`relative p-3.5 rounded-2xl font-bold transition shadow-md flex items-center justify-center ${
              escuchando
                ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/40 ring-4 ring-rose-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
            }`}
            title={escuchando ? 'Detener dictado' : 'Iniciar dictado por voz'}
          >
            {escuchando ? <MicOff className="h-5 w-5 animate-spin" /> : <Mic className="h-5 w-5" />}
            {escuchando && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            )}
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                Copiloto de IA por Voz JGM
              </h3>
              <span className="rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 border border-indigo-200">
                Dictado en Campo
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">
              {escuchando
                ? '🔴 Habla ahora: "Vaciamos 14 metros de losa en metaldeck hoy, 1 oficial y 2 ayudantes..."'
                : 'Presiona el micrófono y dicta tu reporte mientras caminas por la obra sin teclear.'}
            </p>
          </div>
        </div>

        {/* Acceso Rápido a Ejemplos */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-slate-400 font-semibold hidden md:inline">Probar:</span>
          <button
            type="button"
            onClick={() => probarFraseEjemplo('Vaciado de 8.5 metros cúbicos de losa en metaldeck soleado con 1 oficial y 3 ayudantes')}
            className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100/50 transition truncate max-w-[200px]"
          >
            "8.5 m³ de losa..."
          </button>
          <button
            type="button"
            onClick={() => probarFraseEjemplo('Hoy colocamos 20 metros de mampostería en bloques')}
            className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100/50 transition truncate max-w-[200px]"
          >
            "20 m² de bloques..."
          </button>
        </div>
      </div>

      {/* Retroalimentación en Vivo del Copiloto */}
      {(transcripcion || mensajeIA) && (
        <div className="mt-3 pt-3 border-t border-indigo-100/80 flex flex-col gap-1 text-xs">
          {transcripcion && (
            <div className="p-2 rounded-lg bg-white/90 border border-indigo-100 text-slate-800 italic font-mono text-[11px]">
              "{transcripcion}"
            </div>
          )}
          {mensajeIA && (
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>{mensajeIA}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
