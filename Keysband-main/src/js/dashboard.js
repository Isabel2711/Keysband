/**
 * Script principal para la página del Dashboard
 */

import ThemeManager from './modules/ThemeManager.js';
import AuthManager from './modules/AuthManager.js';
import ChartManager from './modules/ChartManager.js';
import UIManager from './modules/UIManager.js';
import APIManager from './modules/APIManager.js';
import { getElement, showAlert } from './utils/helpers.js';

/**
 * Inicializa el dashboard
 */
function init() {
    // Verificar autenticación
    AuthManager.requireAuth();

    // Inicializar gestor de temas
    ThemeManager.init('#btnThemeDashboard', '#themeIconDash');

    // Inicializar gestor de UI
    UIManager.init({
        toggleBtn: '#menuToggle',
        sidebar: '#sidebar',
        mainContent: '#mainContent'
    });

    // Cargar datos de la API y configurar gráficas
    loadDashboardData();

    // Actualizar nombre de usuario
    updateUserInfo();
}

/**
 * Carga todos los datos del dashboard desde la API
 */
async function loadDashboardData() {
    UIManager.showLoading('Cargando datos del dashboard...');

    try {
        // Ejecutar todas las llamadas en paralelo
        const [
            salesData,
            salesByService,
            dailySales,
            incidentsData,
            incidentTypes,
            staffData,
            staffByShift,
            topServices
        ] = await Promise.all([
            APIManager.getSalesData(),
            APIManager.getSalesByService(),
            APIManager.getDailySales(7),
            APIManager.getIncidents(),
            APIManager.getIncidentTypes(),
            APIManager.getStaffData(),
            APIManager.getStaffByShift(),
            APIManager.getTopServices()
        ]);

        // Verificar si todas las llamadas fueron exitosas
        if (!salesData.success) throw new Error('Error cargando datos de ventas');
        if (!incidentsData.success) throw new Error('Error cargando incidencias');
        if (!staffData.success) throw new Error('Error cargando datos de personal');

        // Configurar Chart.js
        ChartManager.setupChartDefaults();

        // Configurar gráficas con datos de la API
        setupChartsWithAPIData(
            salesByService,
            dailySales,
            incidentTypes,
            staffByShift,
            topServices
        );

        // Actualizar información de KPIs
        updateKPIData(salesData, incidentsData, staffData);

        UIManager.hideLoading();
        await showAlert('Éxito', 'Datos cargados correctamente', 'success', 2000);

    } catch (error) {
        console.error('Error cargando dashboard:', error);
        UIManager.hideLoading();
        await showAlert('Error', 'No se pudieron cargar los datos: ' + error.message, 'error');
        
        // Cargar datos por defecto si hay error
        loadDefaultData();
    }
}

/**
 * Configura todas las gráficas con datos de la API
 */
function setupChartsWithAPIData(salesByService, dailySales, incidentTypes, staffByShift, topServices) {
    // 1. Ventas por Servicio (Bar)
    if (salesByService.success && salesByService.data) {
        const data = salesByService.data;
        ChartManager.createBarChart(
            'chartVentasServicio',
            data.labels || ['Restaurante', 'Bar', 'Spa', 'Tienda'],
            data.values || [52300, 28400, 15700, 8140],
            data.colors || ['#3b82f6', '#10b981', '#06b6d4', '#ef4444']
        );
    }

    // 2. Top Servicios (Pie)
    if (topServices.success && topServices.data) {
        const data = topServices.data;
        ChartManager.createPieChart(
            'chartTopServicios',
            data.labels || ['Buffet', 'Masaje Spa', 'Cocktails', 'Otros'],
            data.values || [28, 24, 18, 30],
            data.colors || ['#f59e0b', '#0ea5e9', '#64748b', '#ef4444']
        );
    }

    // 3. Ingresos Diarios (Mixto - Línea + Barras)
    if (dailySales.success && dailySales.data) {
        const data = dailySales.data;
        ChartManager.createMixedChart(
            'chartIngresosDiarios',
            data.labels || ['7 am', '9 am', '12 am', '2 pm', '3 pm'],
            [
                {
                    type: 'line',
                    label: 'Tendencia',
                    data: data.trend || [500, 750, 580, 900, 850],
                    borderColor: '#0ea5e9',
                    borderWidth: 2,
                    tension: 0.3,
                    pointBackgroundColor: '#0ea5e9',
                    fill: false
                },
                {
                    type: 'bar',
                    label: 'Ingresos',
                    data: data.sales || [200, 450, 300, 600, 700],
                    backgroundColor: ['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#06b6d4'],
                    borderRadius: 3
                }
            ]
        );
    }

    // 4. Costo Incidencias (Bar)
    ChartManager.createBarChart(
        'chartCostoIncidencias',
        ['Robo', 'Daño', 'Reembolsos'],
        [100, 150, 250],
        ['#3b82f6', '#ef4444', '#10b981']
    );

    // 5. Tipo Incidentes (Pie)
    if (incidentTypes.success && incidentTypes.data) {
        const data = incidentTypes.data;
        ChartManager.createPieChart(
            'chartTipoIncidentes',
            data.labels || ['Perdidas', 'Fraude', 'Daños', 'Reembolsos'],
            data.values || [25, 15, 32, 28],
            data.colors || ['#dc2626', '#1d4ed8', '#38bdf8', '#ea580c']
        );
    }

    // 6. Distribución Personal (Pie)
    if (staffByShift.success && staffByShift.data) {
        const data = staffByShift.data;
        ChartManager.createPieChart(
            'chartPersonalPie',
            data.labels || ['Limpieza', 'Recepción', 'Mantenimiento', 'Otras'],
            data.values || [28, 25, 18, 29],
            data.colors || ['#f59e0b', '#1e3a8a', '#10b981', '#ef4444']
        );
    }

    // 7. Personal Bar
    if (staffByShift.success && staffByShift.data) {
        const data = staffByShift.data;
        ChartManager.createBarChart(
            'chartPersonalBar',
            data.shiftLabels || ['Mañana', 'Tarde', 'Noche'],
            data.shiftValues || [30, 20, 15],
            ['#3b82f6', '#f59e0b', '#10b981']
        );
    }
}

/**
 * Actualiza los valores de KPI con datos de la API
 */
function updateKPIData(salesData, incidentsData, staffData) {
    try {
        if (salesData.success && salesData.data) {
            const data = salesData.data;
            UIManager.updateMultipleInfo({
                '.revenue-total': data.totalRevenue || '$128,540.00',
                '.revenue-transactions': data.transactions || '742',
                '.revenue-avgTicket': data.avgTicket || '$173.20',
                '.revenue-highestStay': data.highestStay || '$5,640.00'
            });
        }

        if (incidentsData.success && incidentsData.data) {
            const data = incidentsData.data;
            UIManager.updateMultipleInfo({
                '.incidents-total': data.total || '56',
                '.incidents-lost': data.lostBracelets || '14',
                '.incidents-cost': data.estimatedCost || '$7,820.00',
                '.incidents-refunds': data.refunds || '$1,540.00'
            });
        }

        if (staffData.success && staffData.data) {
            const data = staffData.data;
            UIManager.updateMultipleInfo({
                '.staff-total': data.totalEmployees || '32',
                '.staff-absences': data.absences || '3',
                '.staff-punctuality': data.punctuality || '92%'
            });
        }
    } catch (error) {
        console.warn('Error actualizando KPIs:', error);
    }
}

/**
 * Carga datos por defecto si hay error con la API
 */
function loadDefaultData() {
    ChartManager.setupChartDefaults();

    // Crear gráficas con datos por defecto
    ChartManager.createBarChart(
        'chartVentasServicio',
        ['Restaurante', 'Bar', 'Spa', 'Tienda'],
        [52300, 28400, 15700, 8140],
        ['#3b82f6', '#10b981', '#06b6d4', '#ef4444']
    );

    ChartManager.createPieChart(
        'chartTopServicios',
        ['Buffet', 'Masaje Spa', 'Cocktails', 'Otros'],
        [28, 24, 18, 30],
        ['#f59e0b', '#0ea5e9', '#64748b', '#ef4444']
    );

    ChartManager.createMixedChart(
        'chartIngresosDiarios',
        ['7 am', '9 am', '12 am', '2 pm', '3 pm'],
        [
            {
                type: 'line',
                label: 'Tendencia',
                data: [500, 750, 580, 900, 850],
                borderColor: '#0ea5e9',
                borderWidth: 2,
                tension: 0.3,
                pointBackgroundColor: '#0ea5e9',
                fill: false
            },
            {
                type: 'bar',
                label: 'Ingresos',
                data: [200, 450, 300, 600, 700],
                backgroundColor: ['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#06b6d4'],
                borderRadius: 3
            }
        ]
    );

    ChartManager.createBarChart(
        'chartCostoIncidencias',
        ['Robo', 'Daño', 'Reembolsos'],
        [100, 150, 250],
        ['#3b82f6', '#ef4444', '#10b981']
    );

    ChartManager.createPieChart(
        'chartTipoIncidentes',
        ['Perdidas', 'Fraude', 'Daños', 'Reembolsos'],
        [25, 15, 32, 28],
        ['#dc2626', '#1d4ed8', '#38bdf8', '#ea580c']
    );

    ChartManager.createPieChart(
        'chartPersonalPie',
        ['Limpieza', 'Recepción', 'Mantenimiento', 'Otras'],
        [28, 25, 18, 29],
        ['#f59e0b', '#1e3a8a', '#10b981', '#ef4444']
    );

    ChartManager.createBarChart(
        'chartPersonalBar',
        ['Mañana', 'Tarde', 'Noche'],
        [30, 20, 15],
        ['#3b82f6', '#f59e0b', '#10b981']
    );
}

/**
 * Actualiza la información del usuario en el dashboard
 */
function updateUserInfo() {
    const user = AuthManager.currentUser;
    if (user) {
        const userNameElement = getElement('.topbar-user span:last-child');
        if (userNameElement) {
            userNameElement.innerHTML = `
                <i class="fa-solid fa-user-circle fs-4 align-middle me-2"></i> ${user.name}
            `;
        }
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
