/**
 * Script principal para la página de Login
 */

import ThemeManager from './modules/ThemeManager.js';
import AuthManager from './modules/AuthManager.js';
import { getElement } from './utils/helpers.js';

/**
 * Inicializa la página de login
 */
function init() {
    // Inicializar gestor de temas
    ThemeManager.init('#btnTheme', '#themeIcon');

    // Configurar formulario de login
    setupLoginForm();
}

/**
 * Configura los eventos del formulario de login
 */
function setupLoginForm() {
    const loginForm = getElement('#loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = getElement('#email').value;
        const password = getElement('#password').value;

        // Intenta hacer login
        const success = await AuthManager.login(email, password);

        if (success) {
            // Redirige al dashboard después de 1.5s
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
