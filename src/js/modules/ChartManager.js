/**
 * Módulo para gestionar todas las gráficas con Chart.js
 */

import { getCurrentTheme } from '../utils/helpers.js';

class ChartManager {
    constructor() {
        this.charts = {};
        this.colorSchemes = {
            light: {
                gridColor: '#e9ecef',
                textColor: '#2b3445',
                fontFamily: "'Segoe UI', sans-serif"
            },
            dark: {
                gridColor: 'rgba(160, 165, 177, 0.2)',
                textColor: '#a0a5b1',
                fontFamily: "'Segoe UI', sans-serif"
            }
        };
    }

    /**
     * Configura Chart.js globalmente
     */
    setupChartDefaults() {
        const theme = getCurrentTheme();
        const colors = this.colorSchemes[theme];

        Chart.defaults.color = colors.textColor;
        Chart.defaults.font.family = colors.fontFamily;
    }

    /**
     * Crea un gráfico de barras
     * @param {string} canvasId - ID del canvas
     * @param {array} labels - Etiquetas del eje X
     * @param {array} data - Datos
     * @param {array} colors - Colores de las barras
     */
    createBarChart(canvasId, labels, data, colors = []) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        const defaultColors = ['#3b82f6', '#10b981', '#06b6d4', '#ef4444', '#f59e0b'];
        const barColors = colors.length ? colors : defaultColors.slice(0, data.length);

        this.charts[canvasId] = new Chart(canvas, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: barColors,
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { display: false }
                }
            }
        });

        return this.charts[canvasId];
    }

    /**
     * Crea un gráfico de pastel
     * @param {string} canvasId - ID del canvas
     * @param {array} labels - Etiquetas
     * @param {array} data - Datos
     * @param {array} colors - Colores
     */
    createPieChart(canvasId, labels, data, colors = []) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        const defaultColors = ['#f59e0b', '#0ea5e9', '#64748b', '#ef4444', '#10b981'];
        const pieColors = colors.length ? colors : defaultColors.slice(0, data.length);

        this.charts[canvasId] = new Chart(canvas, {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: pieColors,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { boxWidth: 10, padding: 15 }
                    }
                }
            }
        });

        return this.charts[canvasId];
    }

    /**
     * Crea un gráfico de línea
     * @param {string} canvasId - ID del canvas
     * @param {array} labels - Etiquetas del eje X
     * @param {array} data - Datos
     * @param {string} borderColor - Color del borde
     * @param {string} backgroundColor - Color de fondo
     */
    createLineChart(canvasId, labels, data, borderColor = '#0ea5e9', backgroundColor = '#0ea5e9') {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        this.charts[canvasId] = new Chart(canvas, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Tendencia',
                    data,
                    borderColor,
                    backgroundColor: backgroundColor + '20',
                    borderWidth: 2,
                    tension: 0.3,
                    pointBackgroundColor: borderColor,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { grid: { color: this.colorSchemes[getCurrentTheme()].gridColor } }
                }
            }
        });

        return this.charts[canvasId];
    }

    /**
     * Crea un gráfico mixto (línea + barras)
     * @param {string} canvasId - ID del canvas
     * @param {array} labels - Etiquetas del eje X
     * @param {object} datasets - Datasets con type, label, data, etc.
     */
    createMixedChart(canvasId, labels, datasets) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        this.charts[canvasId] = new Chart(canvas, {
            type: 'bar',
            data: {
                labels,
                datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: this.colorSchemes[getCurrentTheme()].gridColor } }
                }
            }
        });

        return this.charts[canvasId];
    }

    /**
     * Destruye un gráfico específico
     * @param {string} canvasId - ID del canvas
     */
    destroyChart(canvasId) {
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
            delete this.charts[canvasId];
        }
    }

    /**
     * Destruye todos los gráficos
     */
    destroyAllCharts() {
        Object.keys(this.charts).forEach(canvasId => this.destroyChart(canvasId));
    }

    /**
     * Actualiza todos los gráficos al cambiar tema
     */
    updateChartsOnThemeChange() {
        window.addEventListener('themeChanged', () => {
            this.setupChartDefaults();
            this.destroyAllCharts();
            // Aquí se re-inicializarían los gráficos
        });
    }
}

export default new ChartManager();
