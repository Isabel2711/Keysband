/**
 * EJEMPLOS RÁPIDOS DE USO
 * 
 * Copia y pega estos ejemplos en tus scripts para usar los módulos
 */

// ============================================================================
// 1. USAR AUTH MANAGER
// ============================================================================

import AuthManager from './modules/AuthManager.js';

// Hacer login (dentro de formulario)
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const success = await AuthManager.login(email, password);
    if (success) {
        // Ir al dashboard
        window.location.href = 'dashboard.html';
    }
});

// Verificar si está autenticado
if (AuthManager.isLoggedIn()) {
    console.log('Usuario autenticado');
}

// Hacer logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    AuthManager.logout();
});

// Obtener usuario actual
const user = AuthManager.currentUser;
console.log(`Bienvenido ${user.name}`);

// ============================================================================
// 2. USAR THEME MANAGER
// ============================================================================

import ThemeManager from './modules/ThemeManager.js';

// Inicializar (una sola vez en app.js)
ThemeManager.init('#btnTheme', '#themeIcon');

// Cambiar tema
ThemeManager.toggle(); // Alterna entre claro/oscuro
ThemeManager.setTheme('dark'); // Establece modo oscuro
ThemeManager.setTheme('light'); // Establece modo claro

// Obtener tema actual
const currentTheme = ThemeManager.getCurrentTheme();
console.log('Tema actual:', currentTheme);

// Escuchar cambios de tema
window.addEventListener('themeChanged', (event) => {
    console.log('Tema cambió a:', event.detail.theme);
    // Aquí puedes actualizar gráficas, etc.
});

// ============================================================================
// 3. USAR CHART MANAGER
// ============================================================================

import ChartManager from './modules/ChartManager.js';

// Configurar gráficas globalmente (una sola vez)
ChartManager.setupChartDefaults();

// Crear gráfica de barras
ChartManager.createBarChart(
    'chartVentas',
    ['Enero', 'Febrero', 'Marzo'],
    [150, 200, 180],
    ['#3b82f6', '#10b981', '#06b6d4']
);

// Crear gráfica de pastel
ChartManager.createPieChart(
    'chartCategorías',
    ['Alojamiento', 'Comida', 'Otros'],
    [45, 35, 20],
    ['#f59e0b', '#0ea5e9', '#64748b']
);

// Crear gráfica de línea
ChartManager.createLineChart(
    'chartTendencia',
    ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
    [100, 150, 120, 180, 200],
    '#6f42c1'
);

// Crear gráfica mixta (línea + barras)
ChartManager.createMixedChart(
    'chartMixto',
    ['Q1', 'Q2', 'Q3', 'Q4'],
    [
        {
            type: 'bar',
            label: 'Ventas',
            data: [1000, 1500, 1200, 1800],
            backgroundColor: '#3b82f6'
        },
        {
            type: 'line',
            label: 'Tendencia',
            data: [1100, 1400, 1300, 1700],
            borderColor: '#10b981',
            borderWidth: 2
        }
    ]
);

// Destruir gráfica específica
ChartManager.destroyChart('chartVentas');

// Destruir todas las gráficas
ChartManager.destroyAllCharts();

// ============================================================================
// 4. USAR UI MANAGER
// ============================================================================

import UIManager from './modules/UIManager.js';

// Inicializar (una sola vez)
UIManager.init({
    toggleBtn: '#menuToggle',
    sidebar: '#sidebar',
    mainContent: '#mainContent'
});

// Toggle del sidebar
UIManager.toggleSidebar();

// Cerrar/Abrir sidebar
UIManager.closeSidebar();
UIManager.openSidebar();

// Actualizar información
UIManager.updateInfo('#userName', 'Juan Pérez');

// Actualizar múltiples elementos
UIManager.updateMultipleInfo({
    '.totalVentas': '$5,000',
    '.totalClientes': '125',
    '.tasaOcupación': '85%'
});

// Mostrar loading
UIManager.showLoading('Cargando datos...');
setTimeout(() => UIManager.hideLoading(), 2000);

// ============================================================================
// 5. USAR HELPERS
// ============================================================================

import {
    getCurrentTheme,
    showAlert,
    isValidEmail,
    getElement,
    addEventListenerToAll,
    saveToLocalStorage,
    getFromLocalStorage
} from './utils/helpers.js';

// Validar email
if (!isValidEmail('usuario@email.com')) {
    console.log('Email inválido');
}

// Mostrar alert
await showAlert(
    'Éxito',
    'Datos guardados correctamente',
    'success',
    2000
);

// Obtener elemento
const btn = getElement('#miBoton');
if (btn) {
    btn.addEventListener('click', () => console.log('Click'));
}

// Agregar listener a múltiples elementos
addEventListenerToAll('.item', 'click', (e) => {
    console.log('Item clickeado:', e.target);
});

// Guardar en localStorage
saveToLocalStorage('preferencias', {
    theme: 'dark',
    idioma: 'es'
});

// Obtener de localStorage
const prefs = getFromLocalStorage('preferencias', {});
console.log('Tema guardado:', prefs.theme);

// Obtener tema actual
const tema = getCurrentTheme();
console.log('Tema actual:', tema); // 'light' o 'dark'

// ============================================================================
// 6. USAR CONFIG
// ============================================================================

import CONFIG from './utils/config.js';

// Acceder a configuración
console.log('Email admin:', CONFIG.auth.email);
console.log('Datos de ingresos:', CONFIG.dashboard.revenue);
console.log('URLs CDN:', CONFIG.cdn);

// ============================================================================
// 7. FLUJO COMPLETO EN PÁGINA NUEVA
// ============================================================================

/*
// En src/js/miPagina.js
import ThemeManager from './modules/ThemeManager.js';
import AuthManager from './modules/AuthManager.js';
import UIManager from './modules/UIManager.js';
import ChartManager from './modules/ChartManager.js';
import { getElement } from './utils/helpers.js';

function init() {
    // Verificar autenticación
    AuthManager.requireAuth();
    
    // Inicializar tema
    ThemeManager.init('#btnTheme', '#themeIcon');
    
    // Inicializar UI
    UIManager.init({
        toggleBtn: '#menuToggle',
        sidebar: '#sidebar',
        mainContent: '#mainContent'
    });
    
    // Configurar gráficas
    ChartManager.setupChartDefaults();
    ChartManager.createBarChart('chart1', [...], [...]);
    
    // Tus funciones específicas
    setupEventHandlers();
}

function setupEventHandlers() {
    const btn = getElement('#miBoton');
    if (btn) {
        btn.addEventListener('click', () => {
            console.log('Mi lógica aquí');
        });
    }
}

// Inicializar cuando DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
*/

// ============================================================================
// 8. PATRONES COMUNES
// ============================================================================

// PATRÓN 1: Cargar datos y actualizar gráfica
/*
async function loadSalesData() {
    try {
        // Simular API call
        const data = await fetch('/api/sales').then(r => r.json());
        
        // Destruir gráfica anterior si existe
        ChartManager.destroyChart('chartSales');
        
        // Crear nueva gráfica con datos
        ChartManager.createBarChart(
            'chartSales',
            data.labels,
            data.values
        );
    } catch (error) {
        await showAlert('Error', 'No se pudieron cargar los datos', 'error');
    }
}
*/

// PATRÓN 2: Validar y guardar formulario
/*
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const email = getElement('#email').value;
    const password = getElement('#password').value;
    
    // Validar
    if (!isValidEmail(email)) {
        await showAlert('Error', 'Email inválido', 'error');
        return;
    }
    
    // Guardar
    saveToLocalStorage('user', { email, password });
    await showAlert('Éxito', 'Datos guardados', 'success');
}
*/

// PATRÓN 3: Actualizar UI based en tema
/*
function updateUIForTheme() {
    const tema = getCurrentTheme();
    
    if (tema === 'dark') {
        // Aplicar cambios para tema oscuro
        console.log('Actualizar para tema oscuro');
    } else {
        // Aplicar cambios para tema claro
        console.log('Actualizar para tema claro');
    }
}

// Ejecutar cuando cambia el tema
window.addEventListener('themeChanged', updateUIForTheme);
*/

// ============================================================================
// 9. DEBUGGING
// ============================================================================

// Mostrar estado de autenticación en consola
console.log('Autenticado:', AuthManager.isLoggedIn());
console.log('Usuario:', AuthManager.currentUser);

// Mostrar gráficas registradas
console.log('Gráficas activas:', ChartManager.charts);

// Limpiar localStorage
localStorage.clear();

// Ver localStorage
console.log('LocalStorage:', { ...localStorage });

// ============================================================================
// 10. IMPORTS ÚTILES PARA COPIAR/PEGAR
// ============================================================================

/*
import ThemeManager from './modules/ThemeManager.js';
import AuthManager from './modules/AuthManager.js';
import ChartManager from './modules/ChartManager.js';
import UIManager from './modules/UIManager.js';
import CONFIG from './utils/config.js';
import {
    getCurrentTheme,
    showAlert,
    isValidEmail,
    getElement,
    addEventListenerToAll,
    saveToLocalStorage,
    getFromLocalStorage
} from './utils/helpers.js';
*/
