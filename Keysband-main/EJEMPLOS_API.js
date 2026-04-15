/**
 * EJEMPLOS DE USO - INTEGRACIÓN CON HOSTINGER
 * 
 * Copiar y pegar en tus scripts
 */

// ============================================================================
// 1. USAR API MANAGER BÁSICAMENTE
// ============================================================================

import APIManager from './modules/APIManager.js';

// Llamada simple
async function cargarDatos() {
    const resultado = await APIManager.getSalesData();
    
    if (resultado.success) {
        console.log('Datos:', resultado.data);
        // resultado.data = { totalRevenue, transactions, ... }
    } else {
        console.error('Error:', resultado.error);
    }
}

// ============================================================================
// 2. OBTENER DATOS PARA GRÁFICAS
// ============================================================================

// Datos de ventas por servicio
async function mostrarVentasPorServicio() {
    const resultado = await APIManager.getSalesByService();
    
    if (resultado.success) {
        const { labels, values, colors } = resultado.data;
        
        // Usar con ChartManager
        ChartManager.createBarChart(
            'chartVentas',
            labels,
            values,
            colors
        );
    }
}

// Ingresos diarios
async function mostrarIngresosDiarios() {
    const resultado = await APIManager.getDailySales(7); // Últimos 7 días
    
    if (resultado.success) {
        const { labels, sales, trend } = resultado.data;
        
        ChartManager.createMixedChart(
            'chartDiario',
            labels,
            [
                {
                    type: 'bar',
                    label: 'Ingresos',
                    data: sales,
                    backgroundColor: '#3b82f6'
                },
                {
                    type: 'line',
                    label: 'Tendencia',
                    data: trend,
                    borderColor: '#ef4444'
                }
            ]
        );
    }
}

// ============================================================================
// 3. ACTUALIZAR INFORMACIÓN EN TIEMPO REAL
// ============================================================================

async function actualizarDashboard() {
    // Cargar ventas
    const ventas = await APIManager.getSalesData();
    if (ventas.success) {
        document.getElementById('totalRevenue').textContent = ventas.data.totalRevenue;
        document.getElementById('transactions').textContent = ventas.data.transactions;
    }
    
    // Cargar incidencias
    const incidencias = await APIManager.getIncidents();
    if (incidencias.success) {
        document.getElementById('totalIncidents').textContent = incidencias.data.total;
    }
    
    // Cargar personal
    const personal = await APIManager.getStaffData();
    if (personal.success) {
        document.getElementById('totalEmployees').textContent = personal.data.totalEmployees;
    }
}

// ============================================================================
// 4. CARGAR DATOS CUANDO LA PÁGINA CARGA
// ============================================================================

function init() {
    console.log('Cargando datos...');
    
    // Mostrar loader
    UIManager.showLoading('Obteniendo datos de Hostinger...');
    
    // Cargar todo en paralelo
    Promise.all([
        APIManager.getSalesData(),
        APIManager.getIncidents(),
        APIManager.getStaffData(),
        APIManager.getSalesByService()
    ]).then(([venta, incidencias, personal, servicios]) => {
        
        // Verificar que todo fue exitoso
        if (venta.success && incidencias.success && personal.success && servicios.success) {
            
            // Actualizar UI
            actualizarUI(venta.data, incidencias.data, personal.data, servicios.data);
            
            // Ocultar loader
            UIManager.hideLoading();
            
            console.log('✅ Datos cargados correctamente');
        } else {
            UIManager.hideLoading();
            console.error('❌ Error cargando datos');
        }
    });
}

// ============================================================================
// 5. REFRESH AUTOMÁTICO CADA X MINUTOS
// ============================================================================

function setupAutoRefresh(minutosIntervalo = 5) {
    // Cargar datos inmediatamente
    actualizarDashboard();
    
    // Luego cada X minutos
    setInterval(() => {
        console.log('Actualizando datos...');
        actualizarDashboard();
    }, minutosIntervalo * 60 * 1000);
}

// Uso:
setupAutoRefresh(5); // Actualizar cada 5 minutos

// ============================================================================
// 6. PÁGINA CON INCIDENCIAS RECIENTES EN TABLA
// ============================================================================

async function cargarTablaIncidencias() {
    const resultado = await APIManager.getRecentIncidents(20);
    
    if (resultado.success) {
        const tbody = document.getElementById('incidenciasTable');
        tbody.innerHTML = '';
        
        resultado.data.forEach(incidencia => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${incidencia.date}</td>
                <td>${incidencia.type}</td>
                <td>${incidencia.description}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

// ============================================================================
// 7. FILTRAR DATOS DINÁMICAMENTE
// ============================================================================

async function obtenerDatosConFiltros() {
    // Opción 1: Usando método específico con parámetros
    const ventasDelMes = await APIManager.getDailySales(30);
    
    // Opción 2: Consulta genérica a tabla
    const resultado = await APIManager.getTableData('tblConsumo', {
        'fecha_inicio': '2024-01-01',
        'fecha_fin': '2024-01-31'
    });
    
    if (resultado.success) {
        console.log('Datos filtrados:', resultado.data);
    }
}

// ============================================================================
// 8. MANEJO DE ERRORES ROBUSTO
// ============================================================================

async function cargarConReintentos(modoFuncion, intentos = 3) {
    for (let i = 1; i <= intentos; i++) {
        try {
            console.log(`Intento ${i} de ${intentos}...`);
            const resultado = await modoFuncion();
            
            if (resultado.success) {
                return resultado.data;
            }
        } catch (error) {
            console.error(`Intento ${i} falló:`, error);
            
            if (i < intentos) {
                // Esperar 2 segundos antes de reintentar
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
    
    // Si todos fallan
    await showAlert('Error', 'No se pudieron cargar los datos después de 3 intentos', 'error');
    return null;
}

// Uso:
cargarConReintentos(() => APIManager.getSalesData());

// ============================================================================
// 9. CACHÉ LOCAL - NO HACER MUCHAS LLAMADAS
// ============================================================================

class CachedAPIManager {
    constructor(ttl = 5 * 60 * 1000) { // 5 minutos por defecto
        this.cache = new Map();
        this.ttl = ttl; // Time to live
    }
    
    async get(clave, funcionAPI) {
        const ahora = Date.now();
        
        // Verificar si existe en caché y no ha expirado
        if (this.cache.has(clave)) {
            const { datos, timestamp } = this.cache.get(clave);
            if (ahora - timestamp < this.ttl) {
                console.log('📦 Datos del caché:', clave);
                return datos;
            }
        }
        
        // Si no está en caché, obtener de API
        console.log('🌐 Cargando de API:', clave);
        const resultado = await funcionAPI();
        
        if (resultado.success) {
            // Guardar en caché
            this.cache.set(clave, {
                datos: resultado.data,
                timestamp: ahora
            });
        }
        
        return resultado.data;
    }
    
    limpiar() {
        this.cache.clear();
    }
}

// Uso:
const cache = new CachedAPIManager(10 * 60 * 1000); // 10 minutos

async function cargarConCache() {
    const datos = await cache.get(
        'ventas-diarias',
        () => APIManager.getDailySales(7)
    );
    console.log(datos);
}

// ============================================================================
// 10. ACTUALIZAR SOLO CAMPOS ESPECÍFICOS
// ============================================================================

async function actualizarKPIs() {
    try {
        const [ventas, incidencias, personal] = await Promise.all([
            APIManager.getSalesData(),
            APIManager.getIncidents(),
            APIManager.getStaffData()
        ]);
        
        // Actualizar solo si fue exitoso
        if (ventas.success) {
            document.querySelectorAll('[data-field="revenue"]').forEach(el => {
                el.textContent = ventas.data.totalRevenue;
            });
        }
        
        if (incidencias.success) {
            document.querySelectorAll('[data-field="incidents"]').forEach(el => {
                el.textContent = incidencias.data.total;
            });
        }
        
        if (personal.success) {
            document.querySelectorAll('[data-field="staff"]').forEach(el => {
                el.textContent = personal.data.totalEmployees;
            });
        }
    } catch (error) {
        console.error('Error actualizando KPIs:', error);
    }
}

// HTML:
// <div data-field="revenue">Cargando...</div>
// <div data-field="incidents">Cargando...</div>
// <div data-field="staff">Cargando...</div>

// ============================================================================
// 11. NOTIFICACIONES EN TIEMPO REAL (WEBSOCKET OPCIONAL)
// ============================================================================

// Si tu API soporta WebSocket
async function configurarNotificacionesRealtime() {
    const ws = new WebSocket('wss://kaseyband.com/ws');
    
    ws.onopen = () => {
        console.log('✅ Conectado a WebSocket');
    };
    
    ws.onmessage = (event) => {
        const evento = JSON.parse(event.data);
        
        if (evento.type === 'new_incident') {
            showAlert('Nueva Incidencia', evento.message, 'warning');
            // Recargar gráficas
            actualizarDashboard();
        }
        
        if (evento.type === 'staff_entry') {
            console.log('Personal entrada:', evento.name);
        }
    };
    
    ws.onerror = (error) => {
        console.error('Error WebSocket:', error);
    };
}

// ============================================================================
// 12. EXPORTAR DATOS A CSV
// ============================================================================

async function exportarIncidenciasCSV() {
    const resultado = await APIManager.getRecentIncidents(1000);
    
    if (!resultado.success) return;
    
    let csv = 'Fecha,Tipo,Descripción\n';
    
    resultado.data.forEach(row => {
        csv += `"${row.date}","${row.type}","${row.description}"\n`;
    });
    
    // Descargar
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'incidencias.csv';
    a.click();
}

// ============================================================================
// 13. GRÁFICA QUE SE ACTUALIZA AUTOMÁTICAMENTE
// ============================================================================

async function crearGraficaDinamica() {
    let chartInstance = null;
    
    async function actualizarGrafica() {
        const resultado = await APIManager.getDailySales(7);
        
        if (resultado.success) {
            // Destruir gráfica anterior
            ChartManager.destroyChart('chart1');
            
            // Crear nueva
            ChartManager.createBarChart(
                'chart1',
                resultado.data.labels,
                resultado.data.sales,
                ['#3b82f6', '#10b981', '#06b6d4', '#ef4444', '#f59e0b', '#0ea5e9', '#64748b']
            );
        }
    }
    
    // Cargar inicialmente
    await actualizarGrafica();
    
    // Actualizar cada minuto
    setInterval(actualizarGrafica, 60000);
}

// ============================================================================
// RESUMEN - USAR EN TU CÓDIGO
// ============================================================================

/*
import APIManager from './modules/APIManager.js';

// Opción 1: Método simple
const datos = await APIManager.getSalesData();
console.log(datos.data);

// Opción 2: Con manejo de errores
const resultado = await APIManager.getIncidents();
if (resultado.success) {
    // Procesar datos
} else {
    // Manejar error
}

// Opción 3: Múltiples llamadas en paralelo
const [v, i, p] = await Promise.all([
    APIManager.getSalesData(),
    APIManager.getIncidents(),
    APIManager.getStaffData()
]);

// Opción 4: Con actualización automática
setInterval(async () => {
    const datos = await APIManager.getSalesData();
    // Actualizar gráficas
}, 30000); // Cada 30 segundos
*/
