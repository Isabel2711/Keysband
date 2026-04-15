/**
 * Módulo para gestionar autenticación
 */

import { showAlert, isValidEmail } from '../utils/helpers.js';
import CONFIG from '../utils/config.js';

class AuthManager {
    constructor() {
        this.isAuthenticated = this.checkAuthentication();
        this.currentUser = this.getStoredUser();
    }

    /**
     * Realiza el login
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña
     * @returns {Promise<boolean>}
     */
    async login(email, password) {
        // Validaciones
        if (!email || !password) {
            await showAlert('Error', 'Por favor completa todos los campos');
            return false;
        }



        // Verificar credenciales
        if (email === CONFIG.auth.email && password === CONFIG.auth.password) {
            await showAlert('¡Bienvenido!', 'Iniciando sesión...', 'success', 1500);
            
            this.setAuthenticated(true);
            this.setUser({ email, name: 'Admin Principal' });
            
            return true;
        } else {
            await showAlert(
                'Error de acceso',
                `Usa ${CONFIG.auth.email} y de contraseña ${CONFIG.auth.password}`,
                'error'
            );
            return false;
        }
    }

    /**
     * Realiza el logout
     */
    logout() {
        localStorage.removeItem('keysband_auth');
        localStorage.removeItem('keysband_user');
        this.isAuthenticated = false;
        this.currentUser = null;
        window.location.href = 'index.html';
    }

    /**
     * Establece el estado de autenticación
     * @param {boolean} value
     */
    setAuthenticated(value) {
        this.isAuthenticated = value;
        localStorage.setItem('keysband_auth', JSON.stringify(value));
    }

    /**
     * Obtiene el estado de autenticación
     * @returns {boolean}
     */
    checkAuthentication() {
        const stored = localStorage.getItem('keysband_auth');
        return stored ? JSON.parse(stored) : false;
    }

    /**
     * Establece el usuario actual
     * @param {object} user - Objeto con datos del usuario
     */
    setUser(user) {
        this.currentUser = user;
        localStorage.setItem('keysband_user', JSON.stringify(user));
    }

    /**
     * Obtiene el usuario almacenado
     * @returns {object|null}
     */
    getStoredUser() {
        const stored = localStorage.getItem('keysband_user');
        return stored ? JSON.parse(stored) : null;
    }

    /**
     * Verifica si está autenticado
     * @returns {boolean}
     */
    isLoggedIn() {
        return this.isAuthenticated;
    }

    /**
     * Redirige a login si no está autenticado
     */
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'index.html';
        }
    }
}

export default new AuthManager();
