/**
 * Módulo para gestionar temas (claro/oscuro)
 */

import { getElement, saveToLocalStorage, getFromLocalStorage } from '../utils/helpers.js';

class ThemeManager {
    constructor() {
        this.body = document.body;
        this.themeToggleBtn = null;
        this.themeIcon = null;
        this.STORAGE_KEY = 'keysband_theme';
        this.LIGHT_MODE_CLASS = 'light-mode';
    }

    /**
     * Inicializa el gestor de temas
     * @param {string} btnSelector - Selector del botón de tema
     * @param {string} iconSelector - Selector del icono
     */
    init(btnSelector, iconSelector) {
        this.themeToggleBtn = getElement(btnSelector);
        this.themeIcon = getElement(iconSelector);

        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => this.toggle());
        }

        // Restaurar tema guardado
        this.restoreSavedTheme();
        this.updateIcon();
    }

    /**
     * Cambia el tema entre claro y oscuro
     */
    toggle() {
        this.body.classList.toggle(this.LIGHT_MODE_CLASS);
        this.updateIcon();
        this.saveTheme();
        this.notifyThemeChange();
    }

    /**
     * Establece el tema específico
     * @param {string} theme - 'light' o 'dark'
     */
    setTheme(theme) {
        if (theme === 'light') {
            this.body.classList.add(this.LIGHT_MODE_CLASS);
        } else {
            this.body.classList.remove(this.LIGHT_MODE_CLASS);
        }
        this.updateIcon();
        this.saveTheme();
        this.notifyThemeChange();
    }

    /**
     * Actualiza el icono del tema
     */
    updateIcon() {
        if (!this.themeIcon) return;

        const isLight = this.body.classList.contains(this.LIGHT_MODE_CLASS);
        this.themeIcon.classList.remove('fa-sun', 'fa-moon');
        this.themeIcon.classList.add(isLight ? 'fa-moon' : 'fa-sun');
    }

    /**
     * Guarda el tema actual en localStorage
     */
    saveTheme() {
        const currentTheme = this.body.classList.contains(this.LIGHT_MODE_CLASS) ? 'light' : 'dark';
        saveToLocalStorage(this.STORAGE_KEY, currentTheme);
    }

    /**
     * Restaura el tema guardado
     */
    restoreSavedTheme() {
        const savedTheme = getFromLocalStorage(this.STORAGE_KEY);
        if (savedTheme) {
            this.setTheme(savedTheme);
        }
    }

    /**
     * Obtiene el tema actual
     * @returns {string} 'light' o 'dark'
     */
    getCurrentTheme() {
        return this.body.classList.contains(this.LIGHT_MODE_CLASS) ? 'light' : 'dark';
    }

    /**
     * Dispara evento personalizado al cambiar tema
     */
    notifyThemeChange() {
        const event = new CustomEvent('themeChanged', {
            detail: { theme: this.getCurrentTheme() }
        });
        window.dispatchEvent(event);
    }
}

export default new ThemeManager();
