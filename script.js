/* ==========================================================================
   PASO 1: CONEXIÓN CON LA INTERFAZ
   ========================================================================== */
const botonRevision = document.getElementById("botonRevision");
const estado = document.getElementById("estado");
let revisionRealizada = false;

const actividadSelector = document.getElementById("actividadSelector");
const largo = document.getElementById("largo");
const ancho = document.getElementById("ancho");
const espesor = document.getElementById("espesor");
const desperdicio = document.getElementById("desperdicio");
const botonCalcularVolumen = document.getElementById("calcularVolumen");
const resultadoVolumen = document.getElementById("resultadoVolumen");
const historialActividades = document.getElementById("historialActividades");
const botonExportarExcel = document.getElementById("botonExportarExcel");
const botonLimpiarBitacora = document.getElementById("botonLimpiarBitacora");
const contextoGrafico = document.getElementById("graficoAvance").getContext("2d");
let miGrafico; 

let memoriaHistorial = [];

/* ==========================================================================
   CATÁLOGO AVANZADO (Ahora incluye Cantidades Contratadas)
   ========================================================================== */
const catalogoActividades = [
    { codigo: "ACT-001", nombre: "Construcción de plantilla de concreto", unidad: "m³", espesorRecomendado: 0.05, desperdicioSugerido: 7, cantidadContratada: 5.00 },
    { codigo: "ACT-002", nombre: "Instalación de piso cerámico", unidad: "m²", espesorRecomendado: 0, desperdicioSugerido: 10, cantidadContratada: 25.00 },
    { codigo: "ACT-003", nombre: "Pintura vinílica en muros", unidad: "m²", espesorRecomendado: 0, desperdicioSugerido: 5, cantidadContratada: 80.00 },
    { codigo: "ACT-004", nombre: "Instalación de guardaescobas", unidad: "ml", espesorRecomendado: 0, desperdicioSugerido: 5, cantidadContratada: 20.00 }
];

function cargarFichaTecnica(actividad) {
    espesor.value = actividad.espesorRecomendado;
    desperdicio.value = actividad.desperdicioSugerido;
    if (actividad.unidad !== "m³") { espesor.value = 0; }
}
cargarFichaTecnica(catalogoActividades[0]);

function cargarHistorialGuardado() {
    const datosGuardados = localStorage.getItem("bitacoraObra");
    if (datosGuardados !== null) {
        memoriaHistorial = JSON.parse(datosGuardados);
        for (let i = 0; i < memoriaHistorial.length; i++) {
            const registro = memoriaHistorial[i];
            const nuevoRegistro = document.createElement("li");
            nuevoRegistro.innerHTML = `
                <strong>${registro.actividad}</strong> <span style="color: #555; font-size: 0.9em;">- <em>${registro.fecha}</em></span>
                <p>Cantidad ejecutada: ${registro.cantidad} ${registro.unidad}.</p>
            `;
            historialActividades.appendChild(nuevoRegistro);
        }
    }
    actualizarGrafico();
}
cargarHistorialGuardado();

function validarDatos(valorLargo, valorAncho, valorEspesor, valorDesperdicio) {
    if (valorLargo === "" || valorDesperdicio === "") return "El largo y el desperdicio son obligatorios.";
    const l = Number(valorLargo); const d = Number(valorDesperdicio);
    if (!Number.isFinite(l) || !Number.isFinite(d)) return "Ingresa números válidos.";
    if (l <= 0) return "El largo debe ser mayor que cero.";
    if (d < 0 || d > 100) return "El desperdicio debe estar entre 0 y 100%.";
    return null; 
}

function registrarHistorial(nombreActividad, cantidadCalculada, unidadMedida) {
    const fechaFormateada = new Date().toLocaleString(); 
    const nuevoRegistro = document.createElement("li");
    nuevoRegistro.innerHTML = `
        <strong>${nombreActividad}</strong> <span style="color: #555; font-size: 0.9em;">- <em>${fechaFormateada}</em></span>
        <p>Cantidad ejecutada: ${cantidadCalculada} ${unidadMedida}.</p>
    `;
    historialActividades.appendChild(nuevoRegistro);
    const registroDatos = { actividad: nombreActividad, cantidad: cantidadCalculada, unidad: unidadMedida, fecha: fechaFormateada };
    memoriaHistorial.push(registroDatos);
    localStorage.setItem("bitacoraObra", JSON.stringify(memoriaHistorial));
    actualizarGrafico();
} 

/* ==========================================================================
   CALCULADORA INTELIGENTE + PORCENTAJE DE AVANCE
   ========================================================================== */
botonCalcularVolumen.addEventListener("click", function () {
    const mensajeDeError = validarDatos(largo.value.trim(), ancho.value.trim(), espesor.value.trim(), desperdicio.value.trim());
    if (mensajeDeError !== null) {
        resultadoVolumen.textContent = mensajeDeError; return;
    }

    const l = Number(largo.value); const a = Number(ancho.value);
    const e = Number(espesor.value); const d = Number(desperdicio.value);

    const indiceSeleccionado = Number(actividadSelector.value);
    const actividad = catalogoActividades[indiceSeleccionado];
    
    let cantidadBase = 0;
    if (actividad.unidad === "m³") { cantidadBase = l * a * e; } 
    else if (actividad.unidad === "m²") { cantidadBase = l * a; } 
    else if (actividad.unidad === "ml") { cantidadBase = l; }

    const cantidadAdicional = cantidadBase * (d / 100);
    const cantidadTotal = cantidadBase + cantidadAdicional;

    // Registramos en el historial primero para que el gráfico se actualice con el dato nuevo
    registrarHistorial(actividad.nombre, cantidadTotal.toFixed(2), actividad.unidad); 

    // Calculamos el acumulado total histórico para esta actividad
    let acumuladoTotal = 0;
    for (let i = 0; i < memoriaHistorial.length; i++) {
        if (memoriaHistorial[i].actividad === actividad.nombre) {
            acumuladoTotal += Number(memoriaHistorial[i].cantidad);
        }
    }

    // Calculamos el % de avance físico
    const porcentajeAvance = (acumuladoTotal / actividad.cantidadContratada) * 100;

    // Imprimimos un reporte gerencial usando HTML interno
    resultadoVolumen.innerHTML =
        `<strong>Reporte de Avance:</strong><br>` +
        `• Ejecutado hoy: ${cantidadTotal.toFixed(2)} ${actividad.unidad}<br>` +
        `• Acumulado total: ${acumuladoTotal.toFixed(2)} de ${actividad.cantidadContratada} ${actividad.unidad}<br>` +
        `• <strong>Avance Físico del Ítem: ${porcentajeAvance.toFixed(1)}%</strong>`;
});

/* ==========================================================================
   EVENTOS RESTANTES
   ========================================================================== */
botonExportarExcel.addEventListener("click", function () {
    if (memoriaHistorial.length === 0) { alert("No hay actividades registradas."); return; }
    let contenidoCSV = "Fecha,Actividad,Cantidad,Unidad\n";
    for (let i = 0; i < memoriaHistorial.length; i++) {
        const reg = memoriaHistorial[i];
        contenidoCSV += `${reg.fecha},${reg.actividad},${reg.cantidad},${reg.unidad}\n`;
    }
    const archivoVirtual = new Blob([contenidoCSV], { type: "text/csv;charset=utf-8;" });
    const enlaceDescarga = document.createElement("a");
    enlaceDescarga.href = URL.createObjectURL(archivoVirtual);
    enlaceDescarga.download = "Bitacora De Obra JG.csv"; 
    enlaceDescarga.click(); URL.revokeObjectURL(enlaceDescarga.href);
});

actividadSelector.addEventListener("change", function () {
    cargarFichaTecnica(catalogoActividades[Number(actividadSelector.value)]);
});

botonLimpiarBitacora.addEventListener("click", function () {
    if (confirm("¿Estás seguro de borrar todo?")) {
        memoriaHistorial = []; localStorage.removeItem("bitacoraObra");
        historialActividades.innerHTML = ""; actualizarGrafico();  
    }
});

botonRevision.addEventListener("click", function () {
    if (!revisionRealizada) {
        revisionRealizada = true; estado.textContent = "Actividad completada"; botonRevision.textContent = "Marcar como pendiente";
    } else {
        revisionRealizada = false; estado.textContent = "Estado de la revisión: Pendiente"; botonRevision.textContent = "Marcar como realizada";
    }
});

/* ==========================================================================
   NUEVO GRÁFICO: BARRAS COMPARATIVAS (Ejecutado vs Presupuesto)
   ========================================================================== */
function actualizarGrafico() {
    let etiquetasGrafico = [];
    let datosEjecutados = [];
    let datosContratados = [];

    // Recorremos el catálogo para armar las columnas del gráfico
    for (let i = 0; i < catalogoActividades.length; i++) {
        let actividadObj = catalogoActividades[i];
        
        // Formato corto para que quepa en el gráfico (Ej: "Pintura vinílica (m²)")
        let nombreCorto = actividadObj.nombre.split(" ")[0] + " (" + actividadObj.unidad + ")";
        etiquetasGrafico.push(nombreCorto);
        datosContratados.push(actividadObj.cantidadContratada);

        // Sumamos cuánto se ha ejecutado de esta actividad en específico
        let ejecutado = 0;
        for (let j = 0; j < memoriaHistorial.length; j++) {
            if (memoriaHistorial[j].actividad === actividadObj.nombre) {
                ejecutado += Number(memoriaHistorial[j].cantidad);
            }
        }
        datosEjecutados.push(ejecutado);
    }

    if (miGrafico) miGrafico.destroy();

    // Cambiamos 'doughnut' por 'bar' para una visualización técnica de obra
    miGrafico = new Chart(contextoGrafico, {
        type: 'bar',
        data: {
            labels: etiquetasGrafico,
            datasets: [
                {
                    label: 'Ejecutado (Avance)',
                    data: datosEjecutados,
                    backgroundColor: '#38a169', // Verde para lo que ya hicimos
                    borderRadius: 4
                },
                {
                    label: 'Presupuestado (Meta)',
                    data: datosContratados,
                    backgroundColor: '#e2e8f0', // Gris para lo que falta
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } },
            plugins: {
                title: { display: true, text: 'Control de Avance Físico vs Presupuesto', font: { size: 16, weight: 'bold' } }
            }
        }
    });
}