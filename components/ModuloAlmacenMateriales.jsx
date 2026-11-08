'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, 
  ArrowDownLeft, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Printer, 
  Search, 
  Filter, 
  Clock, 
  Building, 
  ShieldAlert,
  Boxes,
  ClipboardList
} from 'lucide-react';

// =============================================================================
// CATÁLOGO INICIAL DE MATERIALES DE OBRA (MEZZANINE 3 NIVELES)
// =============================================================================
const MATERIALES_INICIALES = [
  {
    id: "MAT-01",
    codigo: "CEM-01",
    nombre: "Cemento Gris Uso Estructural (Tipo UG)",
    categoria: "Aglomerantes",
    unidad: "Sacos (50 kg)",
    stockActual: 145,
    stockMinimo: 50,
    ubicacion: "Bodega Principal Techada",
    precioRef: 32000
  },
  {
    id: "MAT-02",
    codigo: "AGR-01",
    nombre: "Arena Lavada de Río (Concretera)",
    categoria: "Agregados",
    unidad: "m³",
    stockActual: 18.5,
    stockMinimo: 8.0,
    ubicacion: "Patio de Acopio Frente 1",
    precioRef: 68000
  },
  {
    id: "MAT-03",
    codigo: "AGR-02",
    nombre: "Grava Triturada 3/4\" (Para Concreto)",
    categoria: "Agregados",
    unidad: "m³",
    stockActual: 12.0,
    stockMinimo: 10.0,
    ubicacion: "Patio de Acopio Frente 1",
    precioRef: 75000
  },
  {
    id: "MAT-04",
    codigo: "ACE-01",
    nombre: "Acero de Refuerzo Figurado 1/2\" (60 KSI)",
    categoria: "Aceros",
    unidad: "kg",
    stockActual: 820,
    stockMinimo: 300,
    ubicacion: "Zona de Armado Nivel 1",
    precioRef: 5800
  },
  {
    id: "MAT-05",
    codigo: "ACE-02",
    nombre: "Acero de Refuerzo Figurado 3/8\" (60 KSI)",
    categoria: "Aceros",
    unidad: "kg",
    stockActual: 450,
    stockMinimo: 200,
    ubicacion: "Zona de Armado Nivel 1",
    precioRef: 5800
  },
  {
    id: "MAT-06",
    codigo: "MET-01",
    nombre: "Lámina Colaborante Metaldeck Calibre 22",
    categoria: "Estructura Metálica",
    unidad: "m²",
    stockActual: 95.0,
    stockMinimo: 30.0,
    ubicacion: "Entrepiso Nivel 2",
    precioRef: 62000
  },
  {
    id: "MAT-07",
    codigo: "BLO-01",
    nombre: "Bloque de Concreto Estructural No. 12",
    categoria: "Mampostería",
    unidad: "Unidades",
    stockActual: 620,
    stockMinimo: 400,
    ubicacion: "Acopio Perimetral Eje C",
    precioRef: 2800
  },
  {
    id: "MAT-08",
    codigo: "PER-01",
    nombre: "Pernos de Anclaje ASTM A325 5/8\" x 40cm",
    categoria: "Fijaciones",
    unidad: "Unidades",
    stockActual: 24,
    stockMinimo: 20,
    ubicacion: "Caja de Herramientas / Pañol",
    precioRef: 38000
  },
  {
    id: "MAT-09",
    codigo: "QUI-01",
    nombre: "Mortero Sin Contracción Sika Grout 212",
    categoria: "Químicos",
    unidad: "Sacos (25 kg)",
    stockActual: 8,
    stockMinimo: 6,
    ubicacion: "Bodega Químicos y Aditivos",
    precioRef: 125000
  },
  {
    id: "MAT-10",
    codigo: "TUB-01",
    nombre: "Tubería Conduit Eléctrica PVC 3/4\" (3m)",
    categoria: "Instalaciones",
    unidad: "Tubos",
    stockActual: 35,
    stockMinimo: 15,
    ubicacion: "Estante Eléctrico",
    precioRef: 14500
  }
];

// Movimientos de Kardex iniciales
const MOVIMIENTOS_INICIALES = [
  {
    id: "MOV-101",
    fecha: "2026-10-14",
    tipo: "entrada",
    materialId: "MAT-01",
    materialNombre: "Cemento Gris Uso Estructural (Tipo UG)",
    cantidad: 100,
    unidad: "Sacos (50 kg)",
    remision: "REM-Argos-7811",
    responsable: "Ing. Juan González",
    origenDestino: "Proveedor Cementos Argos Planta Barranquilla",
    observaciones: "Descarga de 100 sacos sobre estibas plásticas con lona protectora."
  },
  {
    id: "MOV-102",
    fecha: "2026-10-15",
    tipo: "salida",
    materialId: "MAT-01",
    materialNombre: "Cemento Gris Uso Estructural (Tipo UG)",
    cantidad: 30,
    unidad: "Sacos (50 kg)",
    remision: "VALE-001",
    responsable: "Oficial Pedro Martínez",
    origenDestino: "Frente 1: Vaciado de Zapatas Z1 y Pedestales",
    observaciones: "Mezcla de concreto in-situ para solados de nivelación."
  },
  {
    id: "MOV-103",
    fecha: "2026-10-20",
    tipo: "entrada",
    materialId: "MAT-04",
    materialNombre: "Acero de Refuerzo Figurado 1/2\" (60 KSI)",
    cantidad: 1000,
    unidad: "kg",
    remision: "FAC-AcerosBq-902",
    responsable: "Ing. Juan González",
    origenDestino: "Suministros del Caribe S.A.S.",
    observaciones: "Varillas certificadas bajo norma NTC 2289."
  },
  {
    id: "MOV-104",
    fecha: "2026-10-22",
    tipo: "salida",
    materialId: "MAT-04",
    materialNombre: "Acero de Refuerzo Figurado 1/2\" (60 KSI)",
    cantidad: 180,
    unidad: "kg",
    remision: "VALE-002",
    responsable: "Oficial Armador Ramón Castro",
    origenDestino: "Frente Cimentación: Parrillas de Zapatas Z1-Z4",
    observaciones: "Armado de canastas y estribos confinados."
  },
  {
    id: "MOV-105",
    fecha: "2026-10-28",
    tipo: "entrada",
    materialId: "MAT-06",
    materialNombre: "Lámina Colaborante Metaldeck Calibre 22",
    cantidad: 150,
    unidad: "m²",
    remision: "REM-ACESO-4102",
    responsable: "Ing. Juan González",
    origenDestino: "Acesco Colombia",
    observaciones: "Acopio directo con grúa pluma en nivel de mezzanine."
  }
];

export default function ModuloAlmacenMateriales() {
  const [materiales, setMateriales] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroTexto, setFiltroTexto] = useState('');
  const [vistaActiva, setVistaActiva] = useState('inventario'); // 'inventario', 'kardex'

  // Modales
  const [showModalMovimiento, setShowModalMovimiento] = useState(false);
  const [tipoMovimiento, setTipoMovimiento] = useState('entrada'); // 'entrada', 'salida'
  const [matSeleccionadoId, setMatSeleccionadoId] = useState('');
  const [cantidadMov, setCantidadMov] = useState('');
  const [remisionDoc, setRemisionDoc] = useState('');
  const [responsableMov, setResponsableMov] = useState('Ing. Juan González');
  const [origenDestinoMov, setOrigenDestinoMov] = useState('');
  const [observacionesMov, setObservacionesMov] = useState('');

  // Cargar de localStorage
  useEffect(() => {
    try {
      const guardadosMat = localStorage.getItem('jgm_almacen_materiales_v1');
      const guardadosMov = localStorage.getItem('jgm_almacen_movimientos_v1');
      
      if (guardadosMat) setMateriales(JSON.parse(guardadosMat));
      else {
        setMateriales(MATERIALES_INICIALES);
        localStorage.setItem('jgm_almacen_materiales_v1', JSON.stringify(MATERIALES_INICIALES));
      }

      if (guardadosMov) setMovimientos(JSON.parse(guardadosMov));
      else {
        setMovimientos(MOVIMIENTOS_INICIALES);
        localStorage.setItem('jgm_almacen_movimientos_v1', JSON.stringify(MOVIMIENTOS_INICIALES));
      }
    } catch (e) {
      setMateriales(MATERIALES_INICIALES);
      setMovimientos(MOVIMIENTOS_INICIALES);
    }
  }, []);

  const guardarDatos = (nuevosMat, nuevosMov) => {
    setMateriales(nuevosMat);
    setMovimientos(nuevosMov);
    try {
      localStorage.setItem('jgm_almacen_materiales_v1', JSON.stringify(nuevosMat));
      localStorage.setItem('jgm_almacen_movimientos_v1', JSON.stringify(nuevosMov));
    } catch (e) {
      console.warn('Error guardando en localStorage:', e);
    }
  };

  const handleCrearMovimiento = (e) => {
    e.preventDefault();
    const cant = parseFloat(cantidadMov);
    if (isNaN(cant) || cant <= 0) {
      alert('⚠️ Ingrese una cantidad válida mayor a cero.');
      return;
    }

    const mat = materiales.find(m => m.id === matSeleccionadoId);
    if (!mat) {
      alert('⚠️ Seleccione un material del catálogo.');
      return;
    }

    // Si es salida, verificar que haya suficiente stock
    if (tipoMovimiento === 'salida' && cant > mat.stockActual) {
      alert(`⚠️ Stock insuficiente: Solo hay ${mat.stockActual} ${mat.unidad} en almacén.`);
      return;
    }

    // Actualizar stock del material
    const nuevoStock = tipoMovimiento === 'entrada'
      ? mat.stockActual + cant
      : mat.stockActual - cant;

    const materialesActualizados = materiales.map(m => 
      m.id === mat.id ? { ...m, stockActual: Number(nuevoStock.toFixed(2)) } : m
    );

    const nuevoMov = {
      id: `MOV-${Date.now()}`,
      fecha: new Date().toISOString().split('T')[0],
      tipo: tipoMovimiento,
      materialId: mat.id,
      materialNombre: mat.nombre,
      cantidad: cant,
      unidad: mat.unidad,
      remision: remisionDoc.trim() || (tipoMovimiento === 'entrada' ? 'REM-DIRECTA' : 'VALE-INTERNO'),
      responsable: responsableMov.trim(),
      origenDestino: origenDestinoMov.trim() || (tipoMovimiento === 'entrada' ? 'Proveedor de Obra' : 'Frente de Obra Mezzanine'),
      observaciones: observacionesMov.trim()
    };

    const movimientosActualizados = [nuevoMov, ...movimientos];
    guardarDatos(materialesActualizados, movimientosActualizados);

    // Reset modal
    setShowModalMovimiento(false);
    setCantidadMov('');
    setRemisionDoc('');
    setOrigenDestinoMov('');
    setObservacionesMov('');

    alert(`📦 ¡${tipoMovimiento === 'entrada' ? 'Entrada registrada' : 'Salida despachada'} con éxito!\n${mat.nombre}: Nuevo Stock = ${nuevoStock} ${mat.unidad}`);
  };

  // KPIs
  const kpis = useMemo(() => {
    const totalItems = materiales.length;
    const stockCritico = materiales.filter(m => m.stockActual <= m.stockMinimo).length;
    const valorTotalEstimado = materiales.reduce((acc, m) => acc + (m.stockActual * (m.precioRef || 0)), 0);
    const totalMovimientos = movimientos.length;

    return {
      totalItems,
      stockCritico,
      valorTotalEstimado,
      totalMovimientos
    };
  }, [materiales, movimientos]);

  // Filtrado de materiales
  const materialesFiltrados = useMemo(() => {
    return materiales.filter(m => {
      const matchCat = filtroCategoria === 'todas' || m.categoria === filtroCategoria;
      const matchText = m.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                        m.codigo.toLowerCase().includes(filtroTexto.toLowerCase());
      return matchCat && matchText;
    });
  }, [materiales, filtroCategoria, filtroTexto]);

  const categorias = ['todas', ...new Set(MATERIALES_INICIALES.map(m => m.categoria))];

  return (
    <div className="space-y-6">

      {/* CABECERA PRINCIPAL DEL MÓDULO */}
      <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/20">
              <Boxes className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Almacén de Materiales en Obra (Kardex)
                </h2>
                <span className="rounded-full bg-teal-100 text-teal-800 text-[10px] font-black px-2.5 py-0.5 border border-teal-200">
                  Control en Bodega
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Control de inventario físico, remisiones de ingreso, despachos a cuadrillas y alertas de desabastecimiento
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setTipoMovimiento('entrada');
                setMatSeleccionadoId(materiales[0]?.id || '');
                setShowModalMovimiento(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-bold transition shadow-sm"
            >
              <ArrowDownLeft className="h-4 w-4" /> Registrar Entrada (Remisión)
            </button>

            <button
              onClick={() => {
                setTipoMovimiento('salida');
                setMatSeleccionadoId(materiales[0]?.id || '');
                setShowModalMovimiento(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 text-xs font-bold transition shadow-sm"
            >
              <ArrowUpRight className="h-4 w-4" /> Despachar Salida a Cuadrilla
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 text-xs font-bold transition"
            >
              <Printer className="h-4 w-4" /> Imprimir Inventario
            </button>
          </div>
        </div>

        {/* SELECTOR DE VISTAS (INVENTARIO / KARDEX) */}
        <div className="flex items-center gap-2 pt-4">
          <button
            onClick={() => setVistaActiva('inventario')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              vistaActiva === 'inventario'
                ? 'bg-teal-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Boxes className="h-4 w-4" /> Stock Actual de Bodega ({materiales.length})
          </button>

          <button
            onClick={() => setVistaActiva('kardex')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              vistaActiva === 'kardex'
                ? 'bg-teal-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ClipboardList className="h-4 w-4" /> Movimientos y Kardex ({movimientos.length})
          </button>
        </div>
      </div>

      {/* 4 KPIS DE ALMACÉN */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Ítems en Inventario
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5">
            {kpis.totalItems}
            <span className="text-xs font-semibold text-slate-400">materiales</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            Controlados en obra
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Stock Crítico / Reorden
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5">
            <span className={kpis.stockCritico > 0 ? 'text-rose-600' : 'text-emerald-700'}>
              {kpis.stockCritico}
            </span>
            <span className="text-xs font-semibold text-slate-400">alertas</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            {kpis.stockCritico > 0 ? '⚠️ Pedir a proveedor' : '🟢 Abastecimiento normal'}
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Valor de Existencias
          </span>
          <div className="text-xl sm:text-2xl font-black text-teal-700 mt-1 font-mono">
            ${(kpis.valorTotalEstimado / 1000000).toFixed(1)}M
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            COP en bodega de obra
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Movimientos Registrados
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5">
            {kpis.totalMovimientos}
            <span className="text-xs font-semibold text-slate-400">vales / remisiones</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">
            Trazabilidad al día
          </span>
        </div>

      </div>

      {/* VISTA 1: TABLA DE INVENTARIO Y STOCK ACTUAL */}
      {vistaActiva === 'inventario' && (
        <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar material por nombre o código (ej. CEM-01, arena, acero)..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-slate-800 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
              >
                <option value="todas">Todas las Categorías</option>
                {categorias.filter(c => c !== 'todas').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs text-slate-800 min-w-[720px]">
              <thead className="bg-slate-100 text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Código / Material</th>
                  <th className="py-2.5 px-3">Categoría</th>
                  <th className="py-2.5 px-2 text-center">Unidad</th>
                  <th className="py-2.5 px-3 text-right">Stock Actual</th>
                  <th className="py-2.5 px-3 text-right">Stock Mínimo</th>
                  <th className="py-2.5 px-3 text-center">Estado</th>
                  <th className="py-2.5 px-3">Ubicación en Bodega</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {materialesFiltrados.map((m) => {
                  const esCritico = m.stockActual <= m.stockMinimo;
                  return (
                    <tr key={m.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3">
                        <strong className="text-slate-900 block font-mono text-xs">{m.codigo}</strong>
                        <span className="font-semibold text-slate-800">{m.nombre}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {m.categoria}
                        </span>
                      </td>

                      <td className="py-3 px-2 text-center font-mono font-bold text-slate-600">
                        {m.unidad}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-black text-sm">
                        <span className={esCritico ? 'text-rose-600 font-bold' : 'text-slate-900'}>
                          {m.stockActual.toLocaleString('es-CO')}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-slate-400">
                        {m.stockMinimo.toLocaleString('es-CO')}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {esCritico ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                            <AlertTriangle className="h-3 w-3" /> Reordenar
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            <CheckCircle2 className="h-3 w-3" /> Óptimo
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        {m.ubicacion}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA 2: TABLA HISTORIAL DE MOVIMIENTOS KARDEX */}
      {vistaActiva === 'kardex' && (
        <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                📋 Libro Diario de Movimientos (Kardex de Obra)
              </h3>
              <p className="text-xs text-slate-500">Historial secuencial de entradas por remisión y despachos a cuadrillas</p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs text-slate-800 min-w-[750px]">
              <thead className="bg-slate-100 text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Fecha / ID</th>
                  <th className="py-2.5 px-3 text-center">Tipo</th>
                  <th className="py-2.5 px-3">Material</th>
                  <th className="py-2.5 px-3 text-right">Cantidad</th>
                  <th className="py-2.5 px-3">Remisión / Vale</th>
                  <th className="py-2.5 px-3">Origen / Destino</th>
                  <th className="py-2.5 px-3">Responsable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {movimientos.map((mov) => (
                  <tr key={mov.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-mono">
                      <strong className="text-slate-900 block">{mov.fecha}</strong>
                      <span className="text-[10px] text-slate-400">{mov.id}</span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      {mov.tipo === 'entrada' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                          <ArrowDownLeft className="h-3 w-3" /> Entrada
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-black text-white">
                          <ArrowUpRight className="h-3 w-3" /> Salida
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <strong className="text-slate-900 block leading-tight">{mov.materialNombre}</strong>
                      {mov.observaciones && (
                        <span className="text-[10px] text-slate-400 italic">"{mov.observaciones}"</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-black text-sm">
                      <span className={mov.tipo === 'entrada' ? 'text-emerald-700' : 'text-slate-900'}>
                        {mov.tipo === 'entrada' ? '+' : '-'}{mov.cantidad} {mov.unidad}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-slate-700">
                      {mov.remision}
                    </td>

                    <td className="py-3 px-3 text-slate-600">
                      {mov.origenDestino}
                    </td>

                    <td className="py-3 px-3 text-slate-500 font-medium">
                      {mov.responsable}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL REGISTRO DE MOVIMIENTO (ENTRADA / SALIDA) */}
      {showModalMovimiento && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                {tipoMovimiento === 'entrada' ? (
                  <>
                    <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
                    Registrar Entrada de Material (Remisión)
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="h-5 w-5 text-slate-900" />
                    Registrar Salida / Despacho a Cuadrilla
                  </>
                )}
              </h3>
              <button
                onClick={() => setShowModalMovimiento(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCrearMovimiento} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Material a {tipoMovimiento === 'entrada' ? 'Ingresar' : 'Despachar'} *
                </label>
                <select
                  value={matSeleccionadoId}
                  onChange={(e) => setMatSeleccionadoId(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                >
                  {materiales.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.codigo} • {m.nombre} (Stock: {m.stockActual} {m.unidad})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Cantidad ({materiales.find(m => m.id === matSeleccionadoId)?.unidad || 'und'}) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0.01"
                    required
                    value={cantidadMov}
                    onChange={(e) => setCantidadMov(e.target.value)}
                    placeholder="Ej. 50"
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-black text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {tipoMovimiento === 'entrada' ? 'Nº Remisión / Factura' : 'Nº Vale de Salida'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={remisionDoc}
                    onChange={(e) => setRemisionDoc(e.target.value)}
                    placeholder={tipoMovimiento === 'entrada' ? "Ej. REM-Argos-9021" : "Ej. VALE-014"}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {tipoMovimiento === 'entrada' ? 'Proveedor / Procedencia' : 'Frente de Obra de Destino'} *
                </label>
                <input
                  type="text"
                  required
                  value={origenDestinoMov}
                  onChange={(e) => setOrigenDestinoMov(e.target.value)}
                  placeholder={tipoMovimiento === 'entrada' ? "Ej. Cementos Argos / Cantera San Antonio" : "Ej. Mezzanine Nivel 2 - Vaciado Losa"}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Responsable que {tipoMovimiento === 'entrada' ? 'Recibe' : 'Autoriza'} *
                </label>
                <input
                  type="text"
                  required
                  value={responsableMov}
                  onChange={(e) => setResponsableMov(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Observaciones Técnicas
                </label>
                <textarea
                  rows={2}
                  value={observacionesMov}
                  onChange={(e) => setObservacionesMov(e.target.value)}
                  placeholder="Ej. Material verificado, empacado sin roturas, descargado en bodega..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModalMovimiento(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg text-white shadow-sm ${
                    tipoMovimiento === 'entrada'
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  Confirmar {tipoMovimiento === 'entrada' ? 'Entrada' : 'Salida'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
