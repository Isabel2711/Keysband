/**
 * Configuración global de la aplicación
 */
export const CONFIG = {
    // Credenciales de prueba
    auth: {
        email: 'root',
        password: '123456'
    },

    // Configuración de tema
    theme: {
        darkMode: {
            bgMain: '#12141d',
            bgCard: '#1e2130',
            bgInner: '#2a2d3e',
            textMain: '#ffffff',
            textMuted: '#a0a5b1',
            borderColor: '#3a3f58',
            accentPurple: '#6f42c1',
            accentBlue: '#0d6efd',
            sidebarHover: 'rgba(111, 66, 193, 0.2)',
            shadowCard: '0 4px 15px rgba(0,0,0,0.4)'
        },
        lightMode: {
            bgMain: '#f0f2f5',
            bgCard: '#ffffff',
            bgInner: '#f8f9fa',
            textMain: '#2b3445',
            textMuted: '#6c757d',
            borderColor: '#e9ecef',
            accentPurple: '#6f42c1',
            accentBlue: '#0d6efd',
            sidebarHover: 'rgba(111, 66, 193, 0.1)',
            shadowCard: '0 4px 10px rgba(0,0,0,0.05)'
        }
    },

    // Configuración de API - Detección automática de entorno
    api: {
        baseURL: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
            ? 'api' // Para desarrollo local en WAMP (ruta relativa)
            : 'https://kaseyband.com/api', // Para producción
        apiKey: 'TU_API_KEY_AQUI',
        timeout: 10000
    },

    // URLs de CDN
    cdn: {
        bootstrap: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
        fontAwesome: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        sweetAlert: 'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css',
        chartJs: 'https://cdn.jsdelivr.net/npm/chart.js'
    },

    // Datos del dashboard
    dashboard: {
        revenue: {
            total: '$128,540.00',
            transactions: 742,
            avgTicket: '$173.20',
            highestStay: '$5,640.00'
        },
        incidents: {
            total: 56,
            lostBracelets: 14,
            estimatedCost: '$7,820.00',
            refunds: '$1,540.00'
        },
        staff: {
            total: 32,
            currentShift: 'Vespertino',
            absences: 3,
            punctuality: '92%'
        }
    }
};

export default CONFIG;
