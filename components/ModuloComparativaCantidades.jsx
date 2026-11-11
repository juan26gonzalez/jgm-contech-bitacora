'use client';

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  Building2, 
  Layers, 
  Clock,
  CheckSquare
} from 'lucide-react';

// =============================================================================
// CANTIDADES DE OBRA CONTRATADAS OFICIALES (MEZZANINE 3 NIVELES - BARRANQUILLA)
// Contratista: INGENDES S.A.S. • Interventoría: DOLMEN S.A.
// =============================================================================
const ITEMS_CONTRATADOS = [
  // 1. PRELIMINARES
  { item: "1.1", capitulo: "1. PRELIMINARES", actividad: "Localización, trazado y replanteo", unidad: "m²", contratado: 180.0, matchKeys: ["localizacion", "trazado", "replanteo"] },
  { item: "1.2", capitulo: "1. PRELIMINARES", actividad: "Cerramiento perimetral en polisombra negra al 90%", unidad: "ml", contratado: 156.0, matchKeys: ["cerramiento", "polisombra"] },
  { item: "1.3", capitulo: "1. PRELIMINARES", actividad: "Demolición y retiro de material (plantillas, muros)", unidad: "m³", contratado: 48.68, matchKeys: ["demolicion", "retiro"] },
  { item: "1.4", capitulo: "1. PRELIMINARES", actividad: "Demolición de piso en porcelanato y plantilla", unidad: "m²", contratado: 35.11, matchKeys: ["demolicion piso", "porcelanato"] },
  { item: "1.5", capitulo: "1. PRELIMINARES", actividad: "Relleno con material seleccionado y compactación", unidad: "m³", contratado: 25.0, matchKeys: ["relleno", "compactacion", "nivelacion"] },

  // 2. EXCAVACIONES
  { item: "2.1", capitulo: "2. EXCAVACIONES", actividad: "Excavación para zapatas, vigas y foso ascensor", unidad: "m³", contratado: 42.0, matchKeys: ["excavacion", "excavación"] },

  // 3. CIMENTACIÓN Y ESTRUCTURA DE CONCRETO
  { item: "3.1", capitulo: "3. CIMENTACION", actividad: "Solado de limpieza para zapatas y vigas e=0.05m", unidad: "m²", contratado: 25.3, matchKeys: ["solado", "plantilla de concreto", "limpieza"] },
  { item: "3.2", capitulo: "3. CIMENTACION", actividad: "Concreto para zapatas Fc=24.5 MPa (3500 PSI)", unidad: "m³", contratado: 8.82, matchKeys: ["zapatas", "cimentacion", "cimentación"] },
  { item: "3.3", capitulo: "3. CIMENTACION", actividad: "Concreto para vigas de cimentación y enlace Fc=24.5 MPa", unidad: "m³", contratado: 5.13, matchKeys: ["vigas de cimentacion", "vigas de amarre", "vigas"] },
  { item: "3.4", capitulo: "3. CIMENTACION", actividad: "Concreto para pedestales Fc=24.5 MPa", unidad: "m³", contratado: 3.59, matchKeys: ["pedestales", "columnas estructurales", "columnas"] },
  { item: "3.5", capitulo: "3. CIMENTACION", actividad: "Placa en concreto para piso e=12 cm Fc=21 MPa", unidad: "m²", contratado: 52.0, matchKeys: ["placa", "piso en concreto"] },
  { item: "3.6", capitulo: "3. CIMENTACION", actividad: "Losa en concreto para metaldeck e=11 cm Fc=21 MPa", unidad: "m²", contratado: 150.0, matchKeys: ["losa", "metaldeck"] },
  { item: "3.7", capitulo: "3. CIMENTACION", actividad: "Concreto para muro foso ascensor Fc=24.5 MPa", unidad: "m³", contratado: 3.04, matchKeys: ["foso", "ascensor", "muro foso"] },
  { item: "3.8", capitulo: "3. CIMENTACION", actividad: "Suministro e instalación de barras roscadas 5/8 pulg", unidad: "und", contratado: 48.0, matchKeys: ["barras roscadas", "anclajes", "pernos"] },

  // 4. ACERO DE REFUERZO
  { item: "4.1", capitulo: "4. ACERO DE REFUERZO", actividad: "Acero de refuerzo figurado para cimentación (60 KSI)", unidad: "kg", contratado: 1525.0, matchKeys: ["acero de refuerzo", "figurado"] },

  // 5. ESTRUCTURA METÁLICA
  { item: "5.1", capitulo: "5. ACERO ESTRUCTURAL", actividad: "Perfilería estructural (HEA 320 columnas, vigas IPE 300)", unidad: "kg", contratado: 13948.0, matchKeys: ["perfileria", "hea 320", "ipe 300", "metalica"] },
  { item: "5.2", capitulo: "5. ACERO ESTRUCTURAL", actividad: "Conexiones para perfiles estructurales (platinas, pernos)", unidad: "kg", contratado: 185.0, matchKeys: ["conexiones", "platinas"] },
  { item: "5.3", capitulo: "5. ACERO ESTRUCTURAL", actividad: "Mortero autonivelante sin contracción placa base (Sika Grout)", unidad: "und", contratado: 6.0, matchKeys: ["sika grout", "mortero autonivelante", "grout"] },

  // 6. MAMPOSTERÍA Y ACABADOS
  { item: "6.1", capitulo: "6. MAMPOSTERIA", actividad: "Levante de muro en bloque de cemento No. 12 con dovelas", unidad: "m²", contratado: 367.5, matchKeys: ["muros en mamposteria", "bloque", "mamposteria", "bloques"] },
  { item: "6.2", capitulo: "6. MAMPOSTERIA", actividad: "Viga cinta o superior en concreto reforzado 0.15x0.20", unidad: "ml", contratado: 35.0, matchKeys: ["viga cinta"] },
  { item: "6.3", capitulo: "6. MAMPOSTERIA", actividad: "Alfajía remate muro superior en concreto 0.07x0.15", unidad: "ml", contratado: 32.0, matchKeys: ["alfajia", "alfajía"] },
  { item: "6.4", capitulo: "6. MAMPOSTERIA", actividad: "Pañete interior relación 1:4 e=0.015", unidad: "m²", contratado: 735.0, matchKeys: ["pañete", "revoco"] },
  { item: "6.5", capitulo: "6. MAMPOSTERIA", actividad: "Instalación de piso cerámico / enchape", unidad: "m²", contratado: 80.0, matchKeys: ["piso ceramico", "enchape", "ceramica"] }
];

export default function ModuloComparativaCantidades({ registros = [] }) {
  const [filtroCapitulo, setFiltroCapitulo] = useState('todos');
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  // Cruce y normalización reactiva de registros de bitácora contra las cantidades contractuales
  const comparativaData = useMemo(() => {
    // 1. Mapear ejecución acumulada desde la bitácora
    const acumuladosBitacora = {};
    
    registros.forEach((reg) => {
      const actTexto = (reg.actividad || '').toLowerCase().trim();
      const cant = parseFloat(reg.cantidad) || 0;
      
      // Buscar el ítem contractual que mejor coincida
      let matchedItem = null;
      for (const item of ITEMS_CONTRATADOS) {
        if (item.matchKeys.some(key => actTexto.includes(key))) {
          matchedItem = item.item;
          break;
        }
      }

      if (matchedItem) {
        acumuladosBitacora[matchedItem] = (acumuladosBitacora[matchedItem] || 0) + cant;
      }
    });

    // 2. Generar tabla consolidada
    return ITEMS_CONTRATADOS.map((item) => {
      const ejecutado = acumuladosBitacora[item.item] || 0;
      const contratado = item.contratado;
      const saldo = Math.max(0, contratado - ejecutado);
      const porcentaje = contratado > 0 ? Number(((ejecutado / contratado) * 100).toFixed(1)) : 0;
      
      let estado = 'en_proceso'; // en_proceso, completado, sobrecosto, sin_iniciar
      if (ejecutado === 0) estado = 'sin_iniciar';
      else if (porcentaje >= 99 && porcentaje <= 100) estado = 'completado';
      else if (porcentaje > 100) estado = 'sobrecosto';
      else estado = 'en_proceso';

      return {
        ...item,
        ejecutado: Number(ejecutado.toFixed(2)),
        saldo: Number(saldo.toFixed(2)),
        porcentaje,
        estado
      };
    });
  }, [registros]);

  // Totales y KPIs Físicos de Obra
  const resumenGeneral = useMemo(() => {
    const totalItems = comparativaData.length;
    const itemsCompletados = comparativaData.filter(c => c.porcentaje >= 99 && c.porcentaje <= 100).length;
    const itemsEnProceso = comparativaData.filter(c => c.porcentaje > 0 && c.porcentaje < 99).length;
    const itemsMayorCantidad = comparativaData.filter(c => c.porcentaje > 100).length;
    const itemsSinIniciar = comparativaData.filter(c => c.porcentaje === 0).length;

    // Avance Físico Promedio Global
    const sumaPorcentajes = comparativaData.reduce((acc, c) => acc + Math.min(c.porcentaje, 100), 0);
    const avanceFisicoGlobal = totalItems > 0 ? Number((sumaPorcentajes / totalItems).toFixed(1)) : 0;

    return {
      totalItems,
      avanceFisicoGlobal,
      itemsCompletados,
      itemsEnProceso,
      itemsMayorCantidad,
      itemsSinIniciar
    };
  }, [comparativaData]);

  // Filtrado de la tabla
  const itemsFiltrados = useMemo(() => {
    return comparativaData.filter((item) => {
      const matchCap = filtroCapitulo === 'todos' || item.capitulo === filtroCapitulo;
      const matchText = item.actividad.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                        item.item.includes(filtroTexto);
      let matchEst = true;
      if (filtroEstado === 'completado') matchEst = item.estado === 'completado';
      else if (filtroEstado === 'en_proceso') matchEst = item.estado === 'en_proceso';
      else if (filtroEstado === 'sobrecosto') matchEst = item.estado === 'sobrecosto';
      else if (filtroEstado === 'sin_iniciar') matchEst = item.estado === 'sin_iniciar';

      return matchCap && matchText && matchEst;
    });
  }, [comparativaData, filtroCapitulo, filtroTexto, filtroEstado]);

  const capitulosDisponibles = ['todos', ...new Set(ITEMS_CONTRATADOS.map(i => i.capitulo))];

  const exportarCSV = () => {
    const encabezados = ['Item', 'Capitulo', 'Actividad', 'Unidad', 'Cant_Contratada', 'Cant_Ejecutada', 'Saldo_Pendiente', '%_Avance', 'Estado'];
    const filas = comparativaData.map(c => [
      c.item,
      `"${c.capitulo}"`,
      `"${c.actividad}"`,
      c.unidad,
      c.contratado,
      c.ejecutado,
      c.saldo,
      `${c.porcentaje}%`,
      c.estado
    ]);
    const contenido = [encabezados.join(','), ...filas.map(f => f.join(','))].join('\n');
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `JGM_Cantidades_Obra_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">

      {/* CABECERA PRINCIPAL DEL MÓDULO */}
      <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Control de Cantidades de Obra
                </h2>
                <span className="rounded-full bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-0.5 border border-blue-200">
                  Frente de Campo
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparativa de cantidades físicas: Contratadas vs. Ejecutadas y balance de saldos pendientes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="https://jagm2000-jgmcontech.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 px-3.5 py-2 text-xs font-bold transition shadow-sm"
              title="Abrir Centro de Control Gerencial BIM 5D para ver el presupuesto en dinero"
            >
              🏢 Ver Presupuesto 5D (Gerencia) ↗
            </a>
            <button
              onClick={exportarCSV}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 text-xs font-bold transition shadow-sm"
            >
              <Download className="h-4 w-4" /> Exportar Cantidades CSV
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 text-xs font-bold transition shadow-sm"
            >
              <Printer className="h-4 w-4" /> Imprimir Balance Físico
            </button>
          </div>
        </div>

        {/* BARRA DE AVANCE FÍSICO GLOBAL */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Avance Físico Global de Actividades
              </span>
              <p className="text-[11px] text-slate-400">Promedio de avance físico medido sobre las cantidades contractuales</p>
            </div>
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-black text-blue-700 font-mono">
                {resumenGeneral.avanceFisicoGlobal}%
              </span>
            </div>
          </div>

          <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden p-0.5">
            <div 
              className="bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(resumenGeneral.avanceFisicoGlobal, 100)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2 font-medium">
            <span>0% (Inicio de Obra)</span>
            <span>Meta Contractual: 100% Ejecutado</span>
          </div>
        </div>
      </div>

      {/* 4 TARJETAS DE INDICADORES FÍSICOS CLAVE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Actividades
          </span>
          <div className="text-lg sm:text-xl font-black text-slate-900 mt-1 font-mono">
            {resumenGeneral.totalItems} ítems
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            Distribuidas en 6 capítulos
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Actividades en Proceso
          </span>
          <div className="text-lg sm:text-xl font-black text-blue-700 mt-1 font-mono">
            {resumenGeneral.itemsEnProceso} frentes
          </div>
          <span className="text-[10px] text-blue-700 font-bold mt-0.5 block">
            Con avance físico activo
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Actividades Completadas
          </span>
          <div className="text-lg sm:text-xl font-black text-emerald-700 mt-1 flex items-baseline gap-1.5 font-mono">
            {resumenGeneral.itemsCompletados}
            <span className="text-xs font-semibold text-slate-400">/ {resumenGeneral.totalItems}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">
            Al 100% de la cantidad contratada
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Mayor Cantidad de Obra
          </span>
          <div className="text-lg sm:text-xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5 font-mono">
            <span className={resumenGeneral.itemsMayorCantidad > 0 ? 'text-amber-600' : 'text-slate-700'}>
              {resumenGeneral.itemsMayorCantidad}
            </span>
            <span className="text-xs font-semibold text-slate-400">ítems &gt;100%</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            {resumenGeneral.itemsMayorCantidad === 0 ? '✅ Dentro de cantidades' : '⚠️ Requiere acta de modificación'}
          </span>
        </div>

      </div>

      {/* TABLA COMPARATIVA PRINCIPAL */}
      <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-slate-200">
        
        {/* FILTROS Y BÚSQUEDA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por actividad o ítem (ej. 3.2, zapata, losa)..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-slate-800 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filtroCapitulo}
              onChange={(e) => setFiltroCapitulo(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="todos">Todos los Capítulos</option>
              {capitulosDisponibles.filter(c => c !== 'todos').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="todos">Todos los Estados</option>
              <option value="en_proceso">En Progreso</option>
              <option value="completado">Completados (100%)</option>
              <option value="sobrecosto">Mayor Cantidad (&gt;100%)</option>
              <option value="sin_iniciar">Sin Iniciar (0%)</option>
            </select>
          </div>
        </div>

        {/* TABLA RESPONSIVA CON BARRAS DE AVANCE */}
        <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs text-slate-800 min-w-[780px]">
            <thead className="bg-slate-100 text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Ítem / Actividad</th>
                <th className="py-2.5 px-2 text-center">Unidad</th>
                <th className="py-2.5 px-3 text-right">Cant. Contratada</th>
                <th className="py-2.5 px-3 text-right">Cant. Ejecutada</th>
                <th className="py-2.5 px-3 text-right">Saldo Pendiente</th>
                <th className="py-2.5 px-3 text-center w-36">% Avance</th>
                <th className="py-2.5 px-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {itemsFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No hay actividades que coincidan con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                itemsFiltrados.map((item) => (
                  <tr key={item.item} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 border border-slate-200 shrink-0">
                          {item.item}
                        </span>
                        <span className="font-semibold text-slate-900 leading-snug">{item.actividad}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5 pl-6">{item.capitulo}</span>
                    </td>

                    <td className="py-3 px-2 text-center font-mono font-bold text-slate-600">
                      {item.unidad}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-700">
                      {item.contratado.toLocaleString('es-CO')}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-blue-700">
                      {item.ejecutado.toLocaleString('es-CO')}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      {item.saldo.toLocaleString('es-CO')}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              item.porcentaje > 100 
                                ? 'bg-amber-500' 
                                : item.porcentaje >= 99 
                                ? 'bg-emerald-500' 
                                : item.porcentaje > 0 
                                ? 'bg-blue-600' 
                                : 'bg-transparent'
                            }`}
                            style={{ width: `${Math.min(item.porcentaje, 100)}%` }}
                          />
                        </div>
                        <span className={`text-[11px] font-mono font-bold min-w-[38px] text-right ${
                          item.porcentaje > 100 ? 'text-amber-600' : 'text-slate-700'
                        }`}>
                          {item.porcentaje}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      {item.estado === 'completado' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="h-3 w-3" /> 100% OK
                        </span>
                      )}
                      {item.estado === 'en_proceso' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          <TrendingUp className="h-3 w-3" /> En Curso
                        </span>
                      )}
                      {item.estado === 'sobrecosto' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800" title="Mayor cantidad sobre el total contractual">
                          <AlertTriangle className="h-3 w-3" /> &gt;100% Mayor Cant.
                        </span>
                      )}
                      {item.estado === 'sin_iniciar' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                          Pendiente
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex justify-between items-center text-[10px] text-slate-400">
          <span>* Datos sincronizados con la Bitácora de Campo y las Cantidades de Obra Contractuales</span>
          <span className="block sm:hidden">↔ Desliza para ver toda la tabla</span>
        </div>

      </div>

    </div>
  );
}
