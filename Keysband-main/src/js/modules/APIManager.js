/**
 * Gestor de API - Conecta con la BD en Hostinger
 * Centraliza todas las llamadas a la API
 */

import CONFIG from '../utils/config.js';
import { showAlert } from '../utils/helpers.js';

class APIManager {
    constructor() {
        this.baseURL = CONFIG.api.baseURL;
        this.apiKey = CONFIG.api.apiKey;
        this.headers = {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey
        };
    }

    /**
     * Realiza una llamada a la API
     * @param {string} endpoint - Endpoint de la API
     * @param {string} method - GET, POST, PUT, DELETE
     * @param {object} body - Datos a enviar
     * @returns {Promise<object>}
     */
    async request(endpoint, method = 'GET', body = null) {
        try {
            const options = {
                method,
                headers: this.headers
            };

            if (body) {
                options.body = JSON.stringify(body);
            }

            const response = await fetch(`${this.baseURL}${endpoint}`, options);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('Error en API:', error);
            return { success: false, error: error.message };
        }
    }

    // ========== MÉTODOS PARA INGRESOS ==========

    /**
     * Obtiene datos de ventas/ingresos
     */
    async getSalesData() {
        return await this.request('/sales');
    }

    /**
     * Obtiene ingresos por servicio
     */
    async getSalesByService() {
        return await this.request('/sales/by-service');
    }

    /**
     * Obtiene ingresos diarios (últimos días)
     */
    async getDailySales(days = 7) {
        return await this.request(`/sales/daily?days=${days}`);
    }

    /**
     * Obtiene total de transacciones
     */
    async getTransactionCount() {
        return await this.request('/sales/transactions');
    }

    // ========== MÉTODOS PARA INCIDENCIAS ==========

    /**
     * Obtiene todas las incidencias
     */
    async getIncidents() {
        return await this.request('/incidents');
    }

    /**
     * Obtiene incidencias recientes
     */
    async getRecentIncidents(limit = 10) {
        return await this.request(`/incidents/recent?limit=${limit}`);
    }

    /**
     * Obtiene costo de incidencias
     */
    async getIncidentsCost() {
        return await this.request('/incidents/cost');
    }

    /**
     * Obtiene tipos de incidencias
     */
    async getIncidentTypes() {
        return await this.request('/incidents/types');
    }

    /**
     * Obtiene pulseras perdidas
     */
    async getLostBracelets() {
        return await this.request('/incidents/lost-bracelets');
    }

    // ========== MÉTODOS PARA PERSONAL ==========

    /**
     * Obtiene datos de personal
     */
    async getStaffData() {
        return await this.request('/staff');
    }

    /**
     * Obtiene asistencia
     */
    async getAttendance() {
        return await this.request('/staff/attendance');
    }

    /**
     * Obtiene total de empleados
     */
    async getTotalStaff() {
        return await this.request('/staff/count');
    }

    /**
     * Obtiene personal por turno
     */
    async getStaffByShift() {
        return await this.request('/staff/by-shift');
    }

    /**
     * Obtiene ausentismo
     */
    async getAbsences() {
        return await this.request('/staff/absences');
    }

    /**
     * Obtiene puntualidad
     */
    async getPunctuality() {
        return await this.request('/staff/punctuality');
    }

    // ========== MÉTODOS PARA CONSUMO ==========

    /**
     * Obtiene datos de consumo
     */
    async getConsumptionData() {
        return await this.request('/consumption');
    }

    /**
     * Obtiene ticket promedio
     */
    async getAverageTicket() {
        return await this.request('/consumption/avg-ticket');
    }

    /**
     * Obtiene estancia más alta
     */
    async getHighestStay() {
        return await this.request('/consumption/highest-stay');
    }

    // ========== MÉTODOS PARA DISPOSITIVOS ==========

    /**
     * Obtiene datos de dispositivos/pulseras
     */
    async getDevicesData() {
        return await this.request('/devices');
    }

    /**
     * Obtiene pulseras activas
     */
    async getActiveBracelets() {
        return await this.request('/devices/active');
    }

    /**
     * Obtiene estado de dispositivos
     */
    async getDevicesStatus() {
        return await this.request('/devices/status');
    }

    // ========== MÉTODOS PARA SERVICIOS ==========

    /**
     * Obtiene servicios disponibles
     */
    async getServices() {
        return await this.request('/services');
    }

    /**
     * Obtiene servicios más vendidos
     */
    async getTopServices() {
        return await this.request('/services/top');
    }

    // ========== MÉTODO GENÉRICO PARA CONSULTAS ==========

    /**
     * Consulta genérica a cualquier tabla
     * @param {string} table - Nombre de la tabla
     * @param {object} filters - Filtros opcionales
     */
    async getTableData(table, filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        const url = queryString ? `/tables/${table}?${queryString}` : `/tables/${table}`;
        return await this.request(url);
    }
}

export default new APIManager();
