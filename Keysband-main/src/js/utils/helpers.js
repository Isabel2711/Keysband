/**
 * Funciones auxiliares y utilidades
 */

/**
 * Obtiene el tema actual (claro u oscuro)
 * @returns {string} 'light' o 'dark'
 */
export function getCurrentTheme() {
    return document.body.classList.contains('light-mode') ? 'light' : 'dark';
}

/**
 * Obtiene el color CSS basado en el tema actual
 * @param {object} colors - Objeto con colores para dark y light
 * @returns {string} Color CSS
 */
export function getThemeColor(colors) {
    const theme = getCurrentTheme();
    return theme === 'light' ? colors.light : colors.dark;
}

/**
 * Muestra una notificación con SweetAlert
 * @param {string} title - Título del alert
 * @param {string} message - Mensaje del alert
 * @param {string} type - Tipo: success, error, warning, info
 * @param {number} timer - Tiempo en ms (0 = sin auto cerrar)
 */
export async function showAlert(title, message, type = 'info', timer = 0) {
    const isDark = document.body.classList.contains('light-mode') === false;
    
    return Swal.fire({
        icon: type,
        title,
        text: message,
        background: isDark ? '#1e2130' : '#fff',
        color: isDark ? '#fff' : '#212529',
        confirmButtonColor: '#6f42c1',
        showConfirmButton: timer === 0,
        timer: timer || undefined
    });
}

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
export function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Obtiene elemento del DOM de forma segura
 * @param {string} selector - Selector CSS
 * @returns {Element|null}
 */
export function getElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Elemento no encontrado: ${selector}`);
    }
    return element;
}

/**
 * Agrega un listener a múltiples elementos
 * @param {string} selector - Selector CSS
 * @param {string} event - Evento (click, change, etc)
 * @param {function} callback - Función a ejecutar
 */
export function addEventListenerToAll(selector, event, callback) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => el.addEventListener(event, callback));
}

/**
 * Guarda datos en localStorage
 * @param {string} key - Clave
 * @param {any} value - Valor (se convierte a JSON)
 */
export function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Error al guardar en localStorage:', e);
    }
}

/**
 * Obtiene datos de localStorage
 * @param {string} key - Clave
 * @param {any} defaultValue - Valor por defecto si no existe
 * @returns {any}
 */
export function getFromLocalStorage(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
        console.error('Error al leer localStorage:', e);
        return defaultValue;
    }
}

export default {
    getCurrentTheme,
    getThemeColor,
    showAlert,
    isValidEmail,
    getElement,
    addEventListenerToAll,
    saveToLocalStorage,
    getFromLocalStorage
};
