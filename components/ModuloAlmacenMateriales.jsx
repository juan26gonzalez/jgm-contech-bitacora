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
  ClipboardList,
  Wrench,
  Hammer,
  RotateCcw,
  UserCheck,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

// =============================================================================
// 1. CATÁLOGO INICIAL DE MATERIALES DE OBRA (MEZZANINE 3 NIVELES)
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

// Movimientos de Kardex iniciales de materiales
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

// =============================================================================
// 2. CATÁLOGO INICIAL DE HERRAMIENTAS Y EQUIPOS MENORES (PAÑOL DE OBRA)
// =============================================================================
const HERRAMIENTAS_INICIALES = [
  {
    id: "HERR-01",
    codigo: "ROTO-01",
    nombre: "Rotomartillo Industrial SDS Max 1500W",
    categoria: "Perforación & Concreto",
    marcaModelo: "Bosch GBH 8-45 D Professional",
    serial: "SN-BSH-88210",
    estado: "disponible", // "disponible", "en_uso", "mantenimiento", "baja"
    ubicacion: "Pañol Central - Estante A1",
    custodioActual: null,
    frenteActual: null,
    fechaPrestamo: null,
    observaciones: "Incluye cincel de punta y broca de 1 pulgada para anclajes."
  },
  {
    id: "HERR-02",
    codigo: "AMO-01",
    nombre: "Amoladora / Pulidora Angular Industrial 9\"",
    categoria: "Corte & Estructura Metálica",
    marcaModelo: "DeWalt DWE490 2200W",
    serial: "SN-DWT-99412",
    estado: "en_uso",
    ubicacion: "Frente de Estructura Metálica",
    custodioActual: "Soldador Carlos Mendoza",
    frenteActual: "Nivel +3.00 Mezzanine (Corte Vigas IPE)",
    fechaPrestamo: "2026-11-09 07:30",
    observaciones: "Guarda de protección verificada. Con disco de corte 9\" nuevo."
  },
  {
    id: "HERR-03",
    codigo: "AMO-02",
    nombre: "Pulidora Angular Compacta 4-1/2\" 900W",
    categoria: "Corte & Estructura Metálica",
    marcaModelo: "Makita 9557HNG",
    serial: "SN-MKT-33418",
    estado: "disponible",
    ubicacion: "Pañol Central - Caja 3",
    custodioActual: null,
    frenteActual: null,
    fechaPrestamo: null,
    observaciones: "Operativa con cable encauchetado sin empalmes."
  },
  {
    id: "HERR-04",
    codigo: "SOLD-01",
    nombre: "Equipo de Soldadura Inverter 250A (SMAW/TIG)",
    categoria: "Corte & Estructura Metálica",
    marcaModelo: "Lincoln Electric Invertec 250",
    serial: "SN-LNC-41099",
    estado: "en_uso",
    ubicacion: "Estructura Mezzanine Eje 2-C",
    custodioActual: "Soldador Jorge Suárez",
    frenteActual: "Conexión Metálica Viga-Columna HEA 320",
    fechaPrestamo: "2026-11-09 08:00",
    observaciones: "Calibrada para electrodo E7018 1/8\". Pinzas y masa en perfecto estado."
  },
  {
    id: "HERR-05",
    codigo: "VIB-01",
    nombre: "Vibrador de Concreto Eléctrico 2 HP con Aguja 38mm",
    categoria: "Concreto & Vaciado",
    marcaModelo: "Wacker Neuson M2500 con manguera 4m",
    serial: "SN-WCK-77120",
    estado: "disponible",
    ubicacion: "Pañol Central - Zona Concretera",
    custodioActual: null,
    frenteActual: null,
    fechaPrestamo: null,
    observaciones: "Aguja de 38mm revisada, acople rápido lubricado."
  },
  {
    id: "HERR-06",
    codigo: "LSR-01",
    nombre: "Nivel Láser Autonivelante 360° con Trípode y Mira",
    categoria: "Topografía & Precisión",
    marcaModelo: "Bosch GLL 3-80 Professional",
    serial: "SN-BSH-33901",
    estado: "disponible",
    ubicacion: "Oficina Técnica / Instrumentación",
    custodioActual: null,
    frenteActual: null,
    fechaPrestamo: null,
    observaciones: "Baterías recargables al 100%, incluye estuche rígido y receptor."
  },
  {
    id: "HERR-07",
    codigo: "MAG-01",
    nombre: "Taladro Percutor Magnético de Base 50mm",
    categoria: "Corte & Estructura Metálica",
    marcaModelo: "Hougen HMD904 Industrial",
    serial: "SN-HGN-11045",
    estado: "disponible",
    ubicacion: "Pañol Central - Estante A2",
    custodioActual: null,
    frenteActual: null,
    fechaPrestamo: null,
    observaciones: "Electroimán de base probado y juego de fresas anulares afiladas."
  },
  {
    id: "HERR-08",
    codigo: "TORQ-01",
    nombre: "Llave Dinamométrica / Torquímetro 3/4\" Calibrado",
    categoria: "Fijación & Ensamble",
    marcaModelo: "Proto Professional (100-600 ft-lb)",
    serial: "SN-PRT-55210",
    estado: "disponible",
    ubicacion: "Pañol Central - Armario de Precisión",
    custodioActual: null,
    frenteActual: null,
    fechaPrestamo: null,
    observaciones: "Certificado de calibración vigente para verificación de pernos ASTM A325."
  },
  {
    id: "HERR-09",
    codigo: "MEZ-01",
    nombre: "Mezcladora de Concreto 1.5 Bultos (Trompo)",
    categoria: "Maquinaria Menor",
    marcaModelo: "Industrias IME con Motor Kohler 9.5 HP",
    serial: "SN-IME-602",
    estado: "mantenimiento",
    ubicacion: "Taller de Mantenimiento Frente 1",
    custodioActual: null,
    frenteActual: null,
    fechaPrestamo: null,
    observaciones: "Cambio preventivo de correas y engrase general de corona dentada."
  },
  {
    id: "HERR-10",
    codigo: "GEN-01",
    nombre: "Planta Eléctrica Diésel 10 kVA Trifásica Insonorizada",
    categoria: "Maquinaria Menor",
    marcaModelo: "Cummins Onan 10 kW",
    serial: "SN-CUM-9912",
    estado: "disponible",
    ubicacion: "Caseta de Generación Frente 1",
    custodioActual: null,
    frenteActual: null,
    fechaPrestamo: null,
    observaciones: "Tanque al 90%, horómetro en 142 horas."
  },
  {
    id: "HERR-11",
    codigo: "AND-01",
    nombre: "Torre de Andamio Multidireccional Certificado (6m)",
    categoria: "Trabajo en Alturas & Seguridad",
    marcaModelo: "Layher Allround Original",
    serial: "SN-LAY-330",
    estado: "en_uso",
    ubicacion: "Frente Mezzanine Eje B",
    custodioActual: "Oficial Pedro Martínez",
    frenteActual: "Montaje de Placas Metaldeck Nivel +3.00",
    fechaPrestamo: "2026-11-08 14:00",
    observaciones: "Con tarjeta verde de inspección SST aprobada."
  },
  {
    id: "HERR-12",
    codigo: "ARN-01",
    nombre: "Kit de Alturas (2 Arneses 4 Argollas + Eslingas en Y)",
    categoria: "Trabajo en Alturas & Seguridad",
    marcaModelo: "3M Protecta Dieléctrico",
    serial: "SN-3M-4410",
    estado: "disponible",
    ubicacion: "Oficina SST / Pañol",
    custodioActual: null,
    frenteActual: null,
    fechaPrestamo: null,
    observaciones: "Reata inspeccionada sin deshilaches, fecha de vigencia 2028."
  }
];

// Historial de préstamos y custodias de herramientas
const PRESTAMOS_INICIALES = [
  {
    id: "PRES-01",
    fecha: "2026-11-09",
    hora: "07:30 AM",
    herramientaId: "HERR-02",
    herramientaCodigo: "AMO-01",
    herramientaNombre: "Amoladora / Pulidora Angular Industrial 9\"",
    tipo: "prestamo", // "prestamo", "devolucion"
    responsable: "Soldador Carlos Mendoza",
    frente: "Nivel +3.00 Mezzanine (Corte Vigas IPE)",
    estadoEntregaRetorno: "Operativo con guarda",
    observaciones: "Se entrega con 2 discos de corte 9\" y llave de apriete."
  },
  {
    id: "PRES-02",
    fecha: "2026-11-09",
    hora: "08:00 AM",
    herramientaId: "HERR-04",
    herramientaCodigo: "SOLD-01",
    herramientaNombre: "Equipo de Soldadura Inverter 250A (SMAW/TIG)",
    tipo: "prestamo",
    responsable: "Soldador Jorge Suárez",
    frente: "Conexión Metálica Viga-Columna HEA 320",
    estadoEntregaRetorno: "Operativo calibrado",
    observaciones: "Cables de 15m verificados sin cortes."
  },
  {
    id: "PRES-03",
    fecha: "2026-11-08",
    hora: "14:00 PM",
    herramientaId: "HERR-11",
    herramientaCodigo: "AND-01",
    herramientaNombre: "Torre de Andamio Multidireccional Certificado (6m)",
    tipo: "prestamo",
    responsable: "Oficial Pedro Martínez",
    frente: "Montaje de Placas Metaldeck Nivel +3.00",
    estadoEntregaRetorno: "Completo con plataformas y rodapiés",
    observaciones: "Tarjeta verde SST diligenciada."
  },
  {
    id: "PRES-04",
    fecha: "2026-11-07",
    hora: "17:15 PM",
    herramientaId: "HERR-01",
    herramientaCodigo: "ROTO-01",
    herramientaNombre: "Rotomartillo Industrial SDS Max 1500W",
    tipo: "devolucion",
    responsable: "Ayudante Luis Peña",
    frente: "Pedestales Cimentación",
    estadoEntregaRetorno: "Limpio y soplado",
    observaciones: "Retornado a pañol sin novedades técnicas."
  }
];

export default function ModuloAlmacenMateriales() {
  // Estado General
  const [seccionActiva, setSeccionActiva] = useState('materiales'); // 'materiales', 'herramientas', 'kardex'

  // Estados de Materiales
  const [materiales, setMateriales] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [filtroCategoriaMat, setFiltroCategoriaMat] = useState('todas');
  const [filtroTextoMat, setFiltroTextoMat] = useState('');

  // Estados de Herramientas
  const [herramientas, setHerramientas] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [filtroCategoriaHerr, setFiltroCategoriaHerr] = useState('todas');
  const [filtroEstadoHerr, setFiltroEstadoHerr] = useState('todos');
  const [filtroTextoHerr, setFiltroTextoHerr] = useState('');

  // Modales de Materiales
  const [showModalMovimiento, setShowModalMovimiento] = useState(false);
  const [tipoMovimiento, setTipoMovimiento] = useState('entrada'); // 'entrada', 'salida'
  const [matSeleccionadoId, setMatSeleccionadoId] = useState('');
  const [cantidadMov, setCantidadMov] = useState('');
  const [remisionDoc, setRemisionDoc] = useState('');
  const [responsableMov, setResponsableMov] = useState('Ing. Juan González');
  const [origenDestinoMov, setOrigenDestinoMov] = useState('');
  const [observacionesMov, setObservacionesMov] = useState('');

  // Modales de Herramientas
  const [showModalPrestamoHerr, setShowModalPrestamoHerr] = useState(false);
  const [showModalDevolucionHerr, setShowModalDevolucionHerr] = useState(false);
  const [showModalNuevaHerr, setShowModalNuevaHerr] = useState(false);
  const [herrSeleccionadaId, setHerrSeleccionadaId] = useState('');
  const [responsableHerr, setResponsableHerr] = useState('Oficial Pedro Martínez');
  const [frenteHerr, setFrenteHerr] = useState('Nivel +3.00 Mezzanine');
  const [estadoRetornoHerr, setEstadoRetornoHerr] = useState('disponible'); // 'disponible', 'mantenimiento', 'baja'
  const [observacionesHerr, setObservacionesHerr] = useState('');

  // Formulario Nueva Herramienta
  const [nuevoCodigoHerr, setNuevoCodigoHerr] = useState('');
  const [nuevoNombreHerr, setNuevoNombreHerr] = useState('');
  const [nuevaCatHerr, setNuevaCatHerr] = useState('Corte & Estructura Metálica');
  const [nuevaMarcaHerr, setNuevaMarcaHerr] = useState('');
  const [nuevoSerialHerr, setNuevoSerialHerr] = useState('');
  const [nuevaUbicacionHerr, setNuevaUbicacionHerr] = useState('Pañol Central - Estante A');
  const [nuevasObsHerr, setNuevasObsHerr] = useState('');

  // Cargar de localStorage
  useEffect(() => {
    try {
      // Materiales
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

      // Herramientas
      const guardadosHerr = localStorage.getItem('jgm_almacen_herramientas_v1');
      const guardadosPres = localStorage.getItem('jgm_almacen_prestamos_v1');
      if (guardadosHerr) setHerramientas(JSON.parse(guardadosHerr));
      else {
        setHerramientas(HERRAMIENTAS_INICIALES);
        localStorage.setItem('jgm_almacen_herramientas_v1', JSON.stringify(HERRAMIENTAS_INICIALES));
      }
      if (guardadosPres) setPrestamos(JSON.parse(guardadosPres));
      else {
        setPrestamos(PRESTAMOS_INICIALES);
        localStorage.setItem('jgm_almacen_prestamos_v1', JSON.stringify(PRESTAMOS_INICIALES));
      }
    } catch (e) {
      setMateriales(MATERIALES_INICIALES);
      setMovimientos(MOVIMIENTOS_INICIALES);
      setHerramientas(HERRAMIENTAS_INICIALES);
      setPrestamos(PRESTAMOS_INICIALES);
    }
  }, []);

  const guardarMateriales = (nuevosMat, nuevosMov) => {
    setMateriales(nuevosMat);
    setMovimientos(nuevosMov);
    try {
      localStorage.setItem('jgm_almacen_materiales_v1', JSON.stringify(nuevosMat));
      localStorage.setItem('jgm_almacen_movimientos_v1', JSON.stringify(nuevosMov));
    } catch (e) {
      console.warn('Error guardando materiales:', e);
    }
  };

  const guardarHerramientas = (nuevasHerr, nuevosPres) => {
    setHerramientas(nuevasHerr);
    setPrestamos(nuevosPres);
    try {
      localStorage.setItem('jgm_almacen_herramientas_v1', JSON.stringify(nuevasHerr));
      localStorage.setItem('jgm_almacen_prestamos_v1', JSON.stringify(nuevosPres));
    } catch (e) {
      console.warn('Error guardando herramientas:', e);
    }
  };

  // ===========================================================================
  // OPERACIONES DE MATERIALES
  // ===========================================================================
  const handleCrearMovimientoMat = (e) => {
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

    if (tipoMovimiento === 'salida' && cant > mat.stockActual) {
      alert(`⚠️ Stock insuficiente: Solo hay ${mat.stockActual} ${mat.unidad} en almacén.`);
      return;
    }

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
    guardarMateriales(materialesActualizados, movimientosActualizados);

    setShowModalMovimiento(false);
    setCantidadMov('');
    setRemisionDoc('');
    setOrigenDestinoMov('');
    setObservacionesMov('');

    alert(`📦 ¡${tipoMovimiento === 'entrada' ? 'Entrada registrada' : 'Salida despachada'} con éxito!\n${mat.nombre}: Nuevo Stock = ${nuevoStock} ${mat.unidad}`);
  };

  // ===========================================================================
  // OPERACIONES DE HERRAMIENTAS
  // ===========================================================================
  const handlePrestarHerramienta = (e) => {
    e.preventDefault();
    const herr = herramientas.find(h => h.id === herrSeleccionadaId);
    if (!herr) {
      alert('⚠️ Seleccione una herramienta disponible.');
      return;
    }

    const ahora = new Date();
    const fechaHoraStr = `${ahora.toISOString().split('T')[0]} ${ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;

    const herramientasActualizadas = herramientas.map(h => {
      if (h.id === herr.id) {
        return {
          ...h,
          estado: 'en_uso',
          custodioActual: responsableHerr.trim(),
          frenteActual: frenteHerr.trim(),
          fechaPrestamo: fechaHoraStr
        };
      }
      return h;
    });

    const nuevoPrestamo = {
      id: `PRES-${Date.now()}`,
      fecha: ahora.toISOString().split('T')[0],
      hora: ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      herramientaId: herr.id,
      herramientaCodigo: herr.codigo,
      herramientaNombre: herr.nombre,
      tipo: 'prestamo',
      responsable: responsableHerr.trim(),
      frente: frenteHerr.trim(),
      estadoEntregaRetorno: 'Operativo en custodia',
      observaciones: observacionesHerr.trim()
    };

    const prestamosActualizados = [nuevoPrestamo, ...prestamos];
    guardarHerramientas(herramientasActualizadas, prestamosActualizados);

    setShowModalPrestamoHerr(false);
    setObservacionesHerr('');
    alert(`🔨 ¡Préstamo registrado!\n${herr.nombre} entregada a ${responsableHerr} para el frente ${frenteHerr}.`);
  };

  const handleDevolverHerramienta = (e) => {
    e.preventDefault();
    const herr = herramientas.find(h => h.id === herrSeleccionadaId);
    if (!herr) {
      alert('⚠️ Seleccione una herramienta a devolver.');
      return;
    }

    const ahora = new Date();
    const custodioAnterior = herr.custodioActual || 'Cuadrilla';

    const herramientasActualizadas = herramientas.map(h => {
      if (h.id === herr.id) {
        return {
          ...h,
          estado: estadoRetornoHerr,
          custodioActual: null,
          frenteActual: null,
          fechaPrestamo: null,
          observaciones: observacionesHerr.trim() || h.observaciones
        };
      }
      return h;
    });

    const nuevoRegistro = {
      id: `DEV-${Date.now()}`,
      fecha: ahora.toISOString().split('T')[0],
      hora: ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      herramientaId: herr.id,
      herramientaCodigo: herr.codigo,
      herramientaNombre: herr.nombre,
      tipo: 'devolucion',
      responsable: custodioAnterior,
      frente: herr.frenteActual || 'Retorno a Pañol',
      estadoEntregaRetorno: estadoRetornoHerr === 'disponible' ? 'Operativo / Limpio' : (estadoRetornoHerr === 'mantenimiento' ? 'Para Mantenimiento' : 'Dañado'),
      observaciones: observacionesHerr.trim()
    };

    const prestamosActualizados = [nuevoRegistro, ...prestamos];
    guardarHerramientas(herramientasActualizadas, prestamosActualizados);

    setShowModalDevolucionHerr(false);
    setObservacionesHerr('');
    alert(`📥 ¡Devolución procesada!\n${herr.nombre} ha retornado a pañol con estado: ${estadoRetornoHerr.toUpperCase()}.`);
  };

  const handleCrearNuevaHerramienta = (e) => {
    e.preventDefault();
    if (!nuevoCodigoHerr.trim() || !nuevoNombreHerr.trim()) {
      alert('⚠️ Diligencie el código y nombre del equipo.');
      return;
    }

    const nuevaH = {
      id: `HERR-${Date.now()}`,
      codigo: nuevoCodigoHerr.trim().toUpperCase(),
      nombre: nuevoNombreHerr.trim(),
      categoria: nuevaCatHerr,
      marcaModelo: nuevaMarcaHerr.trim() || 'Estándar',
      serial: nuevoSerialHerr.trim() || 'S/N',
      estado: 'disponible',
      ubicacion: nuevaUbicacionHerr.trim() || 'Pañol Central',
      custodioActual: null,
      frenteActual: null,
      fechaPrestamo: null,
      observaciones: nuevasObsHerr.trim()
    };

    const herramientasActualizadas = [...herramientas, nuevaH];
    guardarHerramientas(herramientasActualizadas, prestamos);

    setShowModalNuevaHerr(false);
    setNuevoCodigoHerr('');
    setNuevoNombreHerr('');
    setNuevaMarcaHerr('');
    setNuevoSerialHerr('');
    setNuevasObsHerr('');

    alert(`✨ ¡Nueva herramienta "${nuevaH.nombre}" agregada al inventario de pañol!`);
  };

  // ===========================================================================
  // KPIS
  // ===========================================================================
  const kpisMat = useMemo(() => {
    const totalItems = materiales.length;
    const stockCritico = materiales.filter(m => m.stockActual <= m.stockMinimo).length;
    const totalMovimientos = movimientos.length;
    return { totalItems, stockCritico, totalMovimientos };
  }, [materiales, movimientos]);

  const kpisHerr = useMemo(() => {
    const total = herramientas.length;
    const enUso = herramientas.filter(h => h.estado === 'en_uso').length;
    const disponibles = herramientas.filter(h => h.estado === 'disponible').length;
    const mantenimiento = herramientas.filter(h => h.estado === 'mantenimiento' || h.estado === 'baja').length;
    return { total, enUso, disponibles, mantenimiento };
  }, [herramientas]);

  // Filtrados
  const materialesFiltrados = useMemo(() => {
    return materiales.filter(m => {
      const matchCat = filtroCategoriaMat === 'todas' || m.categoria === filtroCategoriaMat;
      const matchText = m.nombre.toLowerCase().includes(filtroTextoMat.toLowerCase()) ||
                        m.codigo.toLowerCase().includes(filtroTextoMat.toLowerCase());
      return matchCat && matchText;
    });
  }, [materiales, filtroCategoriaMat, filtroTextoMat]);

  const herramientasFiltradas = useMemo(() => {
    return herramientas.filter(h => {
      const matchCat = filtroCategoriaHerr === 'todas' || h.categoria === filtroCategoriaHerr;
      const matchEst = filtroEstadoHerr === 'todos' || h.estado === filtroEstadoHerr;
      const txt = filtroTextoHerr.toLowerCase();
      const matchText = h.nombre.toLowerCase().includes(txt) ||
                        h.codigo.toLowerCase().includes(txt) ||
                        (h.custodioActual && h.custodioActual.toLowerCase().includes(txt)) ||
                        (h.frenteActual && h.frenteActual.toLowerCase().includes(txt));
      return matchCat && matchEst && matchText;
    });
  }, [herramientas, filtroCategoriaHerr, filtroEstadoHerr, filtroTextoHerr]);

  const categoriasMat = ['todas', ...new Set(MATERIALES_INICIALES.map(m => m.categoria))];
  const categoriasHerr = ['todas', ...new Set(HERRAMIENTAS_INICIALES.map(h => h.categoria))];

  return (
    <div className="space-y-6">

      {/* CABECERA PRINCIPAL DEL MÓDULO */}
      <div className="rounded-2xl steel-card p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl steel-panel-dark text-white shadow-md">
              <Boxes className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Almacén & Pañol de Obra: Materiales y Herramientas
                </h2>
                <span className="rounded-full bg-slate-200 text-slate-900 text-[10px] font-black px-2.5 py-0.5 border border-slate-400/70">
                  Bodega & Pañol
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Control de existencias físicas, remisiones, préstamos de herramientas a cuadrillas y trazabilidad de custodia
              </p>
            </div>
          </div>

          {/* BOTONES DE ACCIÓN RÁPIDA SEGÚN LA SUB-SECCIÓN */}
          <div className="flex items-center gap-2 flex-wrap">
            {seccionActiva === 'materiales' && (
              <>
                <button
                  onClick={() => {
                    setTipoMovimiento('entrada');
                    setMatSeleccionadoId(materiales[0]?.id || '');
                    setShowModalMovimiento(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-bold transition shadow-sm"
                >
                  <ArrowDownLeft className="h-4 w-4" /> Entrada de Remisión
                </button>

                <button
                  onClick={() => {
                    setTipoMovimiento('salida');
                    setMatSeleccionadoId(materiales[0]?.id || '');
                    setShowModalMovimiento(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 text-xs font-bold transition shadow-sm"
                >
                  <ArrowUpRight className="h-4 w-4" /> Despacho a Cuadrilla
                </button>
              </>
            )}

            {seccionActiva === 'herramientas' && (
              <>
                <button
                  onClick={() => {
                    const disp = herramientas.find(h => h.estado === 'disponible');
                    setHerrSeleccionadaId(disp ? disp.id : herramientas[0]?.id || '');
                    setShowModalPrestamoHerr(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl steel-btn-primary text-white px-3.5 py-2 text-xs font-bold"
                >
                  <Wrench className="h-4 w-4" /> Prestar a Cuadrilla
                </button>

                <button
                  onClick={() => {
                    const enUso = herramientas.find(h => h.estado === 'en_uso');
                    setHerrSeleccionadaId(enUso ? enUso.id : herramientas[0]?.id || '');
                    setShowModalDevolucionHerr(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl steel-btn-primary text-white px-3.5 py-2 text-xs font-bold"
                >
                  <RotateCcw className="h-4 w-4" /> Devolución a Bodega
                </button>

                <button
                  onClick={() => setShowModalNuevaHerr(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 text-xs font-bold transition shadow-sm"
                >
                  <Plus className="h-4 w-4" /> Nueva Herramienta
                </button>
              </>
            )}

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 text-xs font-bold transition"
            >
              <Printer className="h-4 w-4" /> Imprimir Hoja
            </button>
          </div>
        </div>

        {/* SELECTOR DE SUB-SECCIONES: MATERIALES / HERRAMIENTAS / KARDEX */}
        <div className="flex items-center gap-2 pt-4 overflow-x-auto">
          <button
            onClick={() => setSeccionActiva('materiales')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              seccionActiva === 'materiales'
                ? 'steel-btn-primary text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Boxes className="h-4 w-4" />
            <span>📦 Materiales e Insumos</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              seccionActiva === 'materiales' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-800'
            }`}>
              {materiales.length}
            </span>
          </button>

          <button
            onClick={() => setSeccionActiva('herramientas')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              seccionActiva === 'herramientas'
                ? 'steel-btn-primary text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Wrench className="h-4 w-4 text-slate-400" />
            <span>🔨 Herramientas & Equipos Menores</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
              seccionActiva === 'herramientas' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-800'
            }`}>
              {kpisHerr.enUso} en campo
            </span>
          </button>

          <button
            onClick={() => setSeccionActiva('kardex')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              seccionActiva === 'kardex'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            <span>📋 Kardex & Historial de Custodia</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              seccionActiva === 'kardex' ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-600'
            }`}>
              {movimientos.length + prestamos.length}
            </span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SECCIÓN 1: MATERIALES E INSUMOS */}
      {/* ===================================================================== */}
      {seccionActiva === 'materiales' && (
        <>
          {/* 4 KPIS DE MATERIALES */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-xl steel-card p-4">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Materiales en Inventario
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5 font-mono">
                {kpisMat.totalItems}
                <span className="text-xs font-semibold text-slate-400">insumos</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Controlados en bodega</span>
            </div>

            <div className="rounded-xl steel-card p-4">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Stock Crítico / Reorden
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5 font-mono">
                <span className={kpisMat.stockCritico > 0 ? 'text-rose-600' : 'text-emerald-700'}>
                  {kpisMat.stockCritico}
                </span>
                <span className="text-xs font-semibold text-slate-400">alertas</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                {kpisMat.stockCritico > 0 ? '⚠️ Pedir a proveedor' : '🟢 Abastecimiento normal'}
              </span>
            </div>

            <div className="rounded-xl steel-card p-4">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Estado de Abastecimiento
              </span>
              <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 font-mono">
                {Math.round(((materiales.length - kpisMat.stockCritico) / materiales.length) * 100)}%
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Ítems con stock suficiente</span>
            </div>

            <div className="rounded-xl steel-card p-4">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Movimientos de Material
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5 font-mono">
                {kpisMat.totalMovimientos}
                <span className="text-xs font-semibold text-slate-400">registros</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">Trazabilidad al día</span>
            </div>
          </div>

          {/* TABLA DE MATERIALES */}
          <div className="rounded-2xl steel-card p-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar material por nombre o código (ej. CEM-01, arena, acero)..."
                  value={filtroTextoMat}
                  onChange={(e) => setFiltroTextoMat(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filtroCategoriaMat}
                  onChange={(e) => setFiltroCategoriaMat(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
                >
                  <option value="todas">Todas las Categorías</option>
                  {categoriasMat.filter(c => c !== 'todas').map(c => (
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
        </>
      )}

      {/* ===================================================================== */}
      {/* SECCIÓN 2: HERRAMIENTAS & EQUIPOS MENORES */}
      {/* ===================================================================== */}
      {seccionActiva === 'herramientas' && (
        <>
          {/* 4 KPIS DE HERRAMIENTAS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-xl steel-card p-4">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Herramientas
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5 font-mono">
                {kpisHerr.total}
                <span className="text-xs font-semibold text-slate-400">equipos</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Inventariados en obra</span>
            </div>

            <div className="rounded-xl steel-card p-4">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                En Uso en Campo
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5 font-mono">
                {kpisHerr.enUso}
                <span className="text-xs font-semibold text-slate-400">en frente activo</span>
              </div>
              <span className="text-[10px] text-slate-700 font-bold mt-0.5 block">Custodia asignada</span>
            </div>

            <div className="rounded-xl steel-card p-4">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Disponibles en Bodega
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 flex items-baseline gap-1.5 font-mono">
                {kpisHerr.disponibles}
                <span className="text-xs font-semibold text-slate-400">listas para uso</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">En pañol de obra</span>
            </div>

            <div className="rounded-xl steel-card p-4">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Mantenimiento / Novedad
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1.5 font-mono">
                <span className={kpisHerr.mantenimiento > 0 ? 'text-amber-600' : 'text-slate-700'}>
                  {kpisHerr.mantenimiento}
                </span>
                <span className="text-xs font-semibold text-slate-400">en revisión</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                {kpisHerr.mantenimiento === 0 ? '✅ Todo el parque operativo' : '⚠️ Requiere revisión técnica'}
              </span>
            </div>
          </div>

          {/* LISTA / CATÁLOGO INTERACTIVO DE HERRAMIENTAS */}
          <div className="rounded-2xl steel-card p-5 sm:p-6">
            {/* FILTROS Y BÚSQUEDA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por equipo, plaqueta, serial o custodio (ej. amoladora, Carlos, HERR-02)..."
                  value={filtroTextoHerr}
                  onChange={(e) => setFiltroTextoHerr(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={filtroCategoriaHerr}
                  onChange={(e) => setFiltroCategoriaHerr(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
                >
                  <option value="todas">Todas las Categorías</option>
                  {categoriasHerr.filter(c => c !== 'todas').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  value={filtroEstadoHerr}
                  onChange={(e) => setFiltroEstadoHerr(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
                >
                  <option value="todos">Todos los Estados</option>
                  <option value="disponible">🟢 Disponibles en Bodega</option>
                  <option value="en_uso">🔵 En Uso en Campo</option>
                  <option value="mantenimiento">🟡 En Mantenimiento</option>
                </select>
              </div>
            </div>

            {/* TABLA DE HERRAMIENTAS Y CUSTODIAS */}
            <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs text-slate-800 min-w-[760px]">
                <thead className="bg-slate-100 text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Plaqueta / Equipo</th>
                    <th className="py-2.5 px-3">Marca & Modelo</th>
                    <th className="py-2.5 px-3">Categoría</th>
                    <th className="py-2.5 px-3 text-center">Estado</th>
                    <th className="py-2.5 px-3">Ubicación / Custodio Actual</th>
                    <th className="py-2.5 px-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {herramientasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No hay herramientas que coincidan con la búsqueda.
                      </td>
                    </tr>
                  ) : (
                    herramientasFiltradas.map((h) => {
                      const estaEnUso = h.estado === 'en_uso';
                      const estaDisponible = h.estado === 'disponible';
                      const estaMantenimiento = h.estado === 'mantenimiento';

                      return (
                        <tr key={h.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-[10px] bg-slate-200/80 text-slate-900 px-1.5 py-0.5 rounded border border-slate-300 shrink-0">
                                {h.codigo}
                              </span>
                              <strong className="text-slate-900">{h.nombre}</strong>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">S/N: {h.serial}</span>
                          </td>

                          <td className="py-3 px-3 text-slate-700 font-medium">
                            {h.marcaModelo}
                          </td>

                          <td className="py-3 px-3">
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                              {h.categoria}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center">
                            {estaDisponible && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                                <CheckCircle2 className="h-3 w-3" /> Disponible
                              </span>
                            )}
                            {estaEnUso && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-900">
                                <Wrench className="h-3 w-3" /> En Campo
                              </span>
                            )}
                            {estaMantenimiento && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                                <AlertTriangle className="h-3 w-3" /> Mantenimiento
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3">
                            {estaEnUso ? (
                              <div>
                                <span className="font-bold text-slate-900 block flex items-center gap-1">
                                  👤 {h.custodioActual}
                                </span>
                                <span className="text-[10px] text-slate-500 block">
                                  📍 {h.frenteActual}
                                </span>
                                {h.fechaPrestamo && (
                                  <span className="text-[9px] text-slate-400 font-mono">
                                    🕒 Desde: {h.fechaPrestamo}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-500 text-[11px] flex items-center gap-1">
                                🏠 {h.ubicacion}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3 text-center">
                            {estaDisponible && (
                              <button
                                onClick={() => {
                                  setHerrSeleccionadaId(h.id);
                                  setShowModalPrestamoHerr(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg steel-btn-primary text-white"
                              >
                                Prestar
                              </button>
                            )}

                            {estaEnUso && (
                              <button
                                onClick={() => {
                                  setHerrSeleccionadaId(h.id);
                                  setShowModalDevolucionHerr(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg steel-btn-primary text-white"
                              >
                                Retornar
                              </button>
                            )}

                            {estaMantenimiento && (
                              <button
                                onClick={() => {
                                  const herrAct = herramientas.map(item => 
                                    item.id === h.id ? { ...item, estado: 'disponible' } : item
                                  );
                                  guardarHerramientas(herrAct, prestamos);
                                  alert(`✅ ${h.nombre} habilitada como disponible en bodega.`);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition"
                              >
                                Habilitar
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ===================================================================== */}
      {/* SECCIÓN 3: KARDEX UNIFICADO Y HISTORIAL DE CUSTODIA */}
      {/* ===================================================================== */}
      {seccionActiva === 'kardex' && (
        <div className="space-y-6">
          {/* MOVIMIENTOS DE MATERIALES */}
          <div className="rounded-2xl steel-card p-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-slate-800" />
                  Kardex de Materiales (Entradas por Remisión y Despachos)
                </h3>
                <p className="text-xs text-slate-500">Historial de entradas con remisiones de proveedor y vales de salida a frentes</p>
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

          {/* HISTORIAL DE PRÉSTAMOS DE HERRAMIENTAS */}
          <div className="rounded-2xl steel-card p-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-slate-800" />
                  Historial de Custodia y Préstamos de Herramientas
                </h3>
                <p className="text-xs text-slate-500">Registro de salidas de pañol, responsables en campo y retornos de herramientas</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs text-slate-800 min-w-[750px]">
                <thead className="bg-slate-100 text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Fecha / Hora</th>
                    <th className="py-2.5 px-3 text-center">Acción</th>
                    <th className="py-2.5 px-3">Equipo / Herramienta</th>
                    <th className="py-2.5 px-3">Responsable en Obra</th>
                    <th className="py-2.5 px-3">Frente de Trabajo</th>
                    <th className="py-2.5 px-3">Condición Técnica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prestamos.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 font-mono">
                        <strong className="text-slate-900 block">{p.fecha}</strong>
                        <span className="text-[10px] text-slate-400">{p.hora}</span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        {p.tipo === 'prestamo' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-black text-slate-900">
                            <Wrench className="h-3 w-3" /> Préstamo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                            <RotateCcw className="h-3 w-3" /> Devolución
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[10px] bg-slate-100 px-1 py-0.5 rounded text-slate-700">
                            {p.herramientaCodigo}
                          </span>
                          <strong className="text-slate-900">{p.herramientaNombre}</strong>
                        </div>
                        {p.observaciones && (
                          <span className="text-[10px] text-slate-400 italic block mt-0.5">"{p.observaciones}"</span>
                        )}
                      </td>

                      <td className="py-3 px-3 font-bold text-slate-800">
                        👤 {p.responsable}
                      </td>

                      <td className="py-3 px-3 text-slate-600">
                        📍 {p.frente}
                      </td>

                      <td className="py-3 px-3 text-slate-600 text-[11px]">
                        {p.estadoEntregaRetorno}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: REGISTRO DE MOVIMIENTO DE MATERIAL (ENTRADA / SALIDA) */}
      {/* ===================================================================== */}
      {showModalMovimiento && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl steel-card p-5 sm:p-6 shadow-2xl">
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

            <form onSubmit={handleCrearMovimientoMat} className="space-y-3.5">
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
                    Cantidad a {tipoMovimiento === 'entrada' ? 'Ingresar' : 'Despachar'} *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={cantidadMov}
                    onChange={(e) => setCantidadMov(e.target.value)}
                    placeholder="Ej. 50"
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {tipoMovimiento === 'entrada' ? 'No. de Remisión / Factura' : 'Vale de Salida'}
                  </label>
                  <input
                    type="text"
                    value={remisionDoc}
                    onChange={(e) => setRemisionDoc(e.target.value)}
                    placeholder={tipoMovimiento === 'entrada' ? "REM-7811" : "VALE-012"}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Responsable de Obra
                  </label>
                  <input
                    type="text"
                    value={responsableMov}
                    onChange={(e) => setResponsableMov(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {tipoMovimiento === 'entrada' ? 'Proveedor / Procedencia' : 'Frente / Cuadrilla Receptora'}
                  </label>
                  <input
                    type="text"
                    value={origenDestinoMov}
                    onChange={(e) => setOrigenDestinoMov(e.target.value)}
                    placeholder={tipoMovimiento === 'entrada' ? "Cementos Argos" : "Nivel +3.00 Mezzanine"}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  />
                </div>
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

      {/* ===================================================================== */}
      {/* MODAL 2: PRESTAMO DE HERRAMIENTA A CUADRILLA */}
      {/* ===================================================================== */}
      {showModalPrestamoHerr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl steel-card p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-slate-800" />
                Prestar Herramienta a Cuadrilla de Obra
              </h3>
              <button
                onClick={() => setShowModalPrestamoHerr(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePrestarHerramienta} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Herramienta / Equipo a Prestar *
                </label>
                <select
                  value={herrSeleccionadaId}
                  onChange={(e) => setHerrSeleccionadaId(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                >
                  {herramientas
                    .filter(h => h.estado === 'disponible')
                    .map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.codigo} • {h.nombre} ({h.marcaModelo})
                      </option>
                    ))}
                </select>
                {herramientas.filter(h => h.estado === 'disponible').length === 0 && (
                  <p className="text-[11px] text-rose-600 mt-1 font-semibold">
                    ⚠️ No hay herramientas disponibles en bodega actualmente.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Responsable Receptora (Custodio) *
                  </label>
                  <input
                    type="text"
                    required
                    value={responsableHerr}
                    onChange={(e) => setResponsableHerr(e.target.value)}
                    placeholder="Ej. Oficial Pedro Martínez"
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Frente de Obra / Actividad *
                  </label>
                  <input
                    type="text"
                    required
                    value={frenteHerr}
                    onChange={(e) => setFrenteHerr(e.target.value)}
                    placeholder="Ej. Nivel +3.00 Mezzanine"
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Accesorios Entregados y Notas de Inspección
                </label>
                <textarea
                  rows={2}
                  value={observacionesHerr}
                  onChange={(e) => setObservacionesHerr(e.target.value)}
                  placeholder="Ej. Guarda puesta, llave de ajuste incluida, cable verificado sin peladuras..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModalPrestamoHerr(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={herramientas.filter(h => h.estado === 'disponible').length === 0}
                  className="px-4 py-1.5 text-xs font-bold rounded-lg text-white steel-btn-primary disabled:opacity-50"
                >
                  Confirmar Préstamo y Salida
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: DEVOLUCIÓN DE HERRAMIENTA A BODEGA */}
      {/* ===================================================================== */}
      {showModalDevolucionHerr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl steel-card p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-slate-800" />
                Registrar Retorno de Herramienta a Pañol
              </h3>
              <button
                onClick={() => setShowModalDevolucionHerr(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDevolverHerramienta} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Herramienta a Retornar *
                </label>
                <select
                  value={herrSeleccionadaId}
                  onChange={(e) => setHerrSeleccionadaId(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                >
                  {herramientas
                    .filter(h => h.estado === 'en_uso')
                    .map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.codigo} • {h.nombre} (Custodio: {h.custodioActual} - {h.frenteActual})
                      </option>
                    ))}
                </select>
                {herramientas.filter(h => h.estado === 'en_uso').length === 0 && (
                  <p className="text-[11px] text-emerald-700 mt-1 font-semibold">
                    ✅ Todas las herramientas están actualmente en bodega.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Estado de Inspección al Recibir *
                </label>
                <select
                  value={estadoRetornoHerr}
                  onChange={(e) => setEstadoRetornoHerr(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-900"
                >
                  <option value="disponible">🟢 Operativo / Limpio (Habilitado en Bodega)</option>
                  <option value="mantenimiento">🟡 Requiere Mantenimiento / Afilado / Limpieza</option>
                  <option value="baja">🔴 Dañado / Fuera de Servicio</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Observaciones de Inspección en Retorno
                </label>
                <textarea
                  rows={2}
                  value={observacionesHerr}
                  onChange={(e) => setObservacionesHerr(e.target.value)}
                  placeholder="Ej. Equipo limpio, soplado, sin novedades eléctricas, accesorios completos..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModalDevolucionHerr(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={herramientas.filter(h => h.estado === 'en_uso').length === 0}
                  className="px-4 py-1.5 text-xs font-bold rounded-lg text-white steel-btn-primary disabled:opacity-50"
                >
                  Confirmar Devolución e Ingreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 4: REGISTRAR NUEVA HERRAMIENTA EN EL INVENTARIO */}
      {/* ===================================================================== */}
      {showModalNuevaHerr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl steel-card p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="h-5 w-5 text-slate-800" />
                Registrar Nueva Herramienta en Pañol
              </h3>
              <button
                onClick={() => setShowModalNuevaHerr(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCrearNuevaHerramienta} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Código de Plaqueta *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. HERR-AMO-03"
                    value={nuevoCodigoHerr}
                    onChange={(e) => setNuevoCodigoHerr(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Categoría *
                  </label>
                  <select
                    value={nuevaCatHerr}
                    onChange={(e) => setNuevaCatHerr(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold"
                  >
                    <option value="Corte & Estructura Metálica">Corte & Estructura Metálica</option>
                    <option value="Perforación & Concreto">Perforación & Concreto</option>
                    <option value="Concreto & Vaciado">Concreto & Vaciado</option>
                    <option value="Topografía & Precisión">Topografía & Precisión</option>
                    <option value="Fijación & Ensamble">Fijación & Ensamble</option>
                    <option value="Trabajo en Alturas & Seguridad">Trabajo en Alturas & Seguridad</option>
                    <option value="Maquinaria Menor">Maquinaria Menor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Nombre del Equipo / Herramienta *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Pulidora Angular 4-1/2 Pulgadas"
                  value={nuevoNombreHerr}
                  onChange={(e) => setNuevoNombreHerr(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Marca y Modelo
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. DeWalt DWE4020"
                    value={nuevaMarcaHerr}
                    onChange={(e) => setNuevaMarcaHerr(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Número Serial de Fábrica
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. SN-DW-2024-99"
                    value={nuevoSerialHerr}
                    onChange={(e) => setNuevoSerialHerr(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Ubicación en Bodega / Pañol
                </label>
                <input
                  type="text"
                  placeholder="Ej. Pañol Central - Estante B2"
                  value={nuevaUbicacionHerr}
                  onChange={(e) => setNuevaUbicacionHerr(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Observaciones Técnicas / Accesorios
                </label>
                <textarea
                  rows={2}
                  value={nuevasObsHerr}
                  onChange={(e) => setNuevasObsHerr(e.target.value)}
                  placeholder="Ej. Incluye estuche plástico y cable encauchetado de 3m..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModalNuevaHerr(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg text-white bg-slate-900 hover:bg-slate-800 shadow-sm"
                >
                  Guardar en Pañol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
