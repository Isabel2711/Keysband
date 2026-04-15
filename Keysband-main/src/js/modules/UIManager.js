/**
 * Módulo para gestionar elementos de UI común
 */

import { getElement } from '../utils/helpers.js';

class UIManager {
    constructor() {
        this.sidebarToggleBtn = null;
        this.sidebar = null;
        this.mainContent = null;
    }

    /**
     * Inicializa el gestor de UI
     * @param {object} selectors - Objeto con selectores CSS
     */
    init(selectors = {}) {
        this.sidebarToggleBtn = getElement(selectors.toggleBtn || '#menuToggle');
        this.sidebar = getElement(selectors.sidebar || '#sidebar');
        this.mainContent = getElement(selectors.mainContent || '#mainContent');

        if (this.sidebarToggleBtn && this.sidebar) {
            this.setupSidebarToggle();
        }

        this.setupNavigationLinks();
    }

    /**
     * Configura el toggle del sidebar
     */
    setupSidebarToggle() {
        this.sidebarToggleBtn.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Cerrar sidebar al hacer click fuera en móvil
        document.addEventListener('click', (e) => {
            if (!this.sidebar.contains(e.target) && !this.sidebarToggleBtn.contains(e.target)) {
                this.closeSidebar();
            }
        });
    }

    /**
     * Alterna el estado del sidebar
     */
    toggleSidebar() {
        this.sidebar.classList.toggle('active');
    }

    /**
     * Cierra el sidebar
     */
    closeSidebar() {
        this.sidebar.classList.remove('active');
    }

    /**
     * Abre el sidebar
     */
    openSidebar() {
        this.sidebar.classList.add('active');
    }

    /**
     * Configura los links de navegación activos
     */
    setupNavigationLinks() {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPage = window.location.pathname.split('/').pop();

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }

            // Cerrar sidebar al hacer click en un link (en móvil)
            link.addEventListener('click', () => {
                this.closeSidebar();
            });
        });
    }

    /**
     * Muestra un spinner de carga
     * @param {string} message - Mensaje a mostrar
     */
    showLoading(message = 'Cargando...') {
        const loader = document.createElement('div');
        loader.className = 'loader-overlay';
        loader.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">${message}</span>
            </div>
            <p class="mt-3">${message}</p>
        `;
        document.body.appendChild(loader);
    }

    /**
     * Oculta el spinner de carga
     */
    hideLoading() {
        const loader = document.querySelector('.loader-overlay');
        if (loader) {
            loader.remove();
        }
    }

    /**
     * Actualiza un elemento de información
     * @param {string} selector - Selector del elemento
     * @param {string} value - Nuevo valor
     */
    updateInfo(selector, value) {
        const element = getElement(selector);
        if (element) {
            element.textContent = value;
        }
    }

    /**
     * Actualiza múltiples elementos de información
     * @param {object} updates - Objeto clave: selector, valor: nuevo valor
     */
    updateMultipleInfo(updates) {
        Object.entries(updates).forEach(([selector, value]) => {
            this.updateInfo(selector, value);
        });
    }
}

export default new UIManager();
