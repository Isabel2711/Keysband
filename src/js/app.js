/**
 * Script principal para la página de Login
 */

import ThemeManager from './modules/ThemeManager.js';
import AuthManager from './modules/AuthManager.js';
import { getElement, showAlert } from './utils/helpers.js';

/**
 * Inicializa la página de login
 */
async function init() {
    // Inicializar gestor de temas
    ThemeManager.init('#btnTheme', '#themeIcon');

    // Cargar hoteles
    await loadHotels();

    // Configurar formulario de login
    setupLoginForm();
}

/**
 * Carga los hoteles desde el servidor
 */
async function loadHotels() {
    const hotelSelect = getElement('#hotelLogin');
    if (!hotelSelect) return;

    try {
        const response = await fetch('api/get_hotels.php');
        const result = await response.json();
        if (result.success) {
            result.data.forEach(hotel => {
                const option = document.createElement('option');
                option.value = hotel.id;
                option.dataset.name = hotel.name;
                option.textContent = hotel.name;
                hotelSelect.appendChild(option);
            });
        }
    } catch (e) {
        console.error("Error al cargar hoteles:", e);
    }
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
        const hotelSelect = getElement('#hotelLogin');
        const hotelId = hotelSelect.value;
        const hotelName = hotelSelect.options[hotelSelect.selectedIndex].dataset.name;

        if (!hotelId) {
            await showAlert('Error', 'Por favor selecciona un hotel', 'error');
            return;
        }

        // Intenta hacer login
        const success = await AuthManager.login(email, password, { id: hotelId, name: hotelName });

        if (success) {
            // Redirige al dashboard después de 1.5s
            setTimeout(() => {
                window.location.href = 'tarjetas_rfid.html';
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
