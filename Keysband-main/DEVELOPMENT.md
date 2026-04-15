/**
 * GUÍA DE MEJORES PRÁCTICAS Y PATRONES DE DESARROLLO
 * 
 * Este documento describe cómo mantener y extender el proyecto
 * siguiendo los patrones de arquitectura implementados.
 */

// ============================================================================
// 1. CREAR UN NUEVO MÓDULO
// ============================================================================

/**
 * Patrón singleton para módulos (como los existentes)
 * 
 * Ubicación: src/js/modules/MiModulo.js
 */

// Ejemplo: src/js/modules/NotificationManager.js
/*
class NotificationManager {
    constructor() {
        // Inicialización privada
        this.notifications = [];
        this.container = null;
    }

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Contenedor de notificaciones no encontrado');
        }
    }

    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        if (this.container) {
            this.container.appendChild(notification);
            
            if (duration > 0) {
                setTimeout(() => notification.remove(), duration);
            }
        }
    }
}

export default new NotificationManager();
*/

// ============================================================================
// 2. USAR UN MÓDULO EN LA APLICACIÓN
// ============================================================================

/**
 * Patrón de importación y uso en scripts principales
 * 
 * Ubicación: src/js/app.js o src/js/dashboard.js
 */

/*
import NotificationManager from './modules/NotificationManager.js';

function init() {
    NotificationManager.init('notificationContainer');
    NotificationManager.show('¡Bienvenido!', 'success', 2000);
}
*/

// ============================================================================
// 3. AGREGAR NUEVAS VARIABLES DE TEMA
// ============================================================================

/**
 * Para agregar nuevos colores, edita: src/css/theme.css
 * 
 * :root {
 *     --new-color: #xyz;
 * }
 * 
 * Luego usa en cualquier CSS:
 * .elemento {
 *     color: var(--new-color);
 * }
 * 
 * También agrégalo en config.js para JavaScript
 */

// ============================================================================
// 4. VALIDACIÓN Y MANEJO DE ERRORES
// ============================================================================

/**
 * Siempre valida entrada de usuario
 */

import { isValidEmail, showAlert } from './utils/helpers.js';

// BIEN
async function submitForm(data) {
    if (!data.email || !isValidEmail(data.email)) {
        await showAlert('Error', 'Email inválido', 'error');
        return false;
    }
    return true;
}

// MAL - Sin validación
async function submitFormBad(data) {
    // Envía datos sin validar
}

// ============================================================================
// 5. GESTIÓN DE ESTADO PERSISTENTE
// ============================================================================

/**
 * Usa localStorage para persistencia
 */

import { saveToLocalStorage, getFromLocalStorage } from './utils/helpers.js';

// BIEN - Guardar preferencias de usuario
const userPreferences = {
    theme: 'dark',
    language: 'es',
    timezone: 'UTC-5'
};
saveToLocalStorage('userPrefs', userPreferences);

// Recuperar
const prefs = getFromLocalStorage('userPrefs', {});

// ============================================================================
// 6. COMUNICACIÓN ENTRE MÓDULOS
// ============================================================================

/**
 * Usa Custom Events para comunicación entre módulos
 */

// Módulo A - Dispara evento
window.dispatchEvent(new CustomEvent('themeChanged', {
    detail: { theme: 'light' }
}));

// Módulo B - Escucha evento
window.addEventListener('themeChanged', (event) => {
    console.log('Tema cambió a:', event.detail.theme);
});

// ============================================================================
// 7. AGREGAR UNA NUEVA PÁGINA
// ============================================================================

/**
 * Pasos para agregar página "Inventario"
 */

// 1. Crear HTML: inventario.html
/*
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventario - HotelAdmin Pro</title>
    
    <!-- Importar estilos base -->
    <link rel="stylesheet" href="src/css/theme.css">
    <link rel="stylesheet" href="src/css/global.css">
    <link rel="stylesheet" href="src/css/dashboard.css">
    <link rel="stylesheet" href="src/css/inventario.css">
</head>
<body class="light-mode">
    <!-- Sidebar y contenido aquí -->
    
    <!-- Scripts -->
    <script type="module" src="src/js/inventario.js"></script>
</body>
</html>
*/

// 2. Crear archivo CSS: src/css/inventario.css
// 3. Crear archivo JS: src/js/inventario.js
// 4. Agregar link al sidebar en todos los HTML

// ============================================================================
// 8. INTEGRACIÓN CON API
// ============================================================================

/**
 * Ejemplo: Conectar AuthManager a API real
 */

/*
// En src/js/modules/AuthManager.js
async login(email, password) {
    try {
        const response = await fetch('https://api.ejemplo.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Credenciales inválidas');
        }

        const data = await response.json();
        const token = data.token;
        
        // Guardar token
        saveToLocalStorage('auth_token', token);
        this.setAuthenticated(true);
        
        return true;
    } catch (error) {
        await showAlert('Error', error.message, 'error');
        return false;
    }
}
*/

// ============================================================================
// 9. AGREGAR GRÁFICA DINÁMICA
// ============================================================================

/**
 * Ejemplo: Agregar gráfica con datos de API
 */

/*
import ChartManager from './modules/ChartManager.js';

async function loadSalesChart() {
    try {
        const response = await fetch('https://api.ejemplo.com/sales');
        const data = await response.json();
        
        ChartManager.createLineChart(
            'chartSales',
            data.labels,
            data.values,
            '#6f42c1'
        );
    } catch (error) {
        console.error('Error cargando gráfica:', error);
    }
}
*/

// ============================================================================
// 10. TESTING Y DEPURACIÓN
// ============================================================================

/**
 * Habilita modo debug
 */

// En la consola del navegador:
const DEBUG = true;

function debug(message, data) {
    if (DEBUG) {
        console.log(`[DEBUG] ${message}`, data);
    }
}

// ============================================================================
// 11. PERFORMANCE - Carga Lazy de Módulos
// ============================================================================

/**
 * Para módulos que se cargan después
 */

// Import dinámico (cuando sea necesario)
async function loadReportsModule() {
    const ReportsManager = (await import('./modules/ReportsManager.js')).default;
    ReportsManager.init();
}

// ============================================================================
// 12. RESPONSIVE DESIGN - Breakpoints
// ============================================================================

/**
 * Define breakpoints en src/css/dashboard.css
 * 
 * Desktop:  >= 1200px
 * Tablet:   768px - 1199px  
 * Mobile:   < 768px
 * 
 * @media (max-width: 768px) { ... }
 * @media (max-width: 480px) { ... }
 */

// ============================================================================
// 13. CONVENCIONES DE CÓDIGO
// ============================================================================

/**
 * Nombres de archivos/carpetas: kebab-case (min-file.js)
 * Nombres de clases: PascalCase (MyClass)
 * Nombres de variables/funciones: camelCase (myVariable)
 * Nombres de constantes: UPPER_SNAKE_CASE (MAX_ITEMS)
 * ID HTML: kebab-case (my-button)
 * Clases CSS: kebab-case (my-class)
 */

// ============================================================================
// 14. DOCUMENTACIÓN DE CÓDIGO
// ============================================================================

/**
 * Documenta tus funciones con JSDoc
 */

/**
 * Calcula el total de ventas por período
 * @param {Date} startDate - Fecha de inicio
 * @param {Date} endDate - Fecha de fin
 * @returns {Promise<number>} Total de ventas
 * @throws {Error} Si las fechas son inválidas
 * 
 * @example
 * const total = await calculateTotalSales(
 *     new Date('2024-01-01'),
 *     new Date('2024-01-31')
 * );
 */
async function calculateTotalSales(startDate, endDate) {
    // Implementación...
}

// ============================================================================
// 15. SEGURIDAD
// ============================================================================

/**
 * ⚠️ IMPORTANTE - Nunca hagas esto en producción:
 * 
 * ❌ No guardes tokens/secretos en localStorage
 * ❌ No expongas API keys en el cliente
 * ❌ No validices solo en cliente
 * ❌ No confíes en datos del usuario sin validar
 * 
 * ✅ Usa:
 * - HTTPS siempre
 * - Validación servidor
 * - CSRF tokens
 * - Sanitización de entrada
 * - CORS correctamente
 */

// ============================================================================
// RESUMEN - FLUJO DE DESARROLLO
// ============================================================================

/**
 * 1. Planifica la funcionalidad
 * 2. Crea el módulo (si es necesario)
 * 3. Documenta con JSDoc
 * 4. Agrega estilos CSS
 * 5. Importa y testea
 * 6. Actualiza el README si es necesario
 * 7. Verifica en múltiples dispositivos
 * 8. Commit a git con mensaje descriptivo
 */

// ============================================================================
// PRÓXIMOS PASOS RECOMENDADOS
// ============================================================================

/**
 * 1. Agregar testing con Jest
 * 2. Implementar SW (Service Worker) para offline
 * 3. Agregar router SPA (Single Page Application)
 * 4. Estado global con patrón Redux
 * 5. Build tool como Vite o Webpack
 * 6. Pre-procesador CSS (SASS/LESS)
 * 7. Linter (ESLint) y Formatter (Prettier)
 * 8. CI/CD (GitHub Actions)
 */
