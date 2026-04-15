import ThemeManager from './modules/ThemeManager.js';
import AuthManager from './modules/AuthManager.js';

// Requerir autenticación
AuthManager.requireAuth();

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar tema y gestionar logout de sesión
    ThemeManager.init('#btnThemeDashboard', '#themeIconDash');
    
    const userNameEl = document.getElementById('userName');
    if (userNameEl && AuthManager.currentUser) {
        userNameEl.textContent = AuthManager.currentUser.name || 'Admin';
    }

    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => AuthManager.logout());
    }

    // Funcionalidad de RFID
    const btnRefresh = document.getElementById('btnRefreshRfid');
    if (btnRefresh) {
        btnRefresh.addEventListener('click', fetchRfids);
    }
    
    // Cargar tarjetas automáticamente al entrar
    fetchRfids();
});

async function fetchRfids() {
    const tbody = document.getElementById('rfidTableBody');
    tbody.innerHTML = '<tr><td colspan="5" class="text-center"><div class="spinner-border text-primary spinner-border-sm" role="status"></div> Cargando...</td></tr>';
    
    try {
        const response = await fetch('api/get_rfids.php');
        if (!response.ok) throw new Error('Error al obtener datos');
        
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
            tbody.innerHTML = '';
            result.data.forEach(item => {
                const tr = document.createElement('tr');
                
                // Formatear estado con badge de Bootstrap
                let statusBadge = '';
                if(item.status === 'active') statusBadge = '<span class="badge bg-success">Activa</span>';
                else if(item.status === 'inactive') statusBadge = '<span class="badge bg-secondary">Inactiva</span>';
                else statusBadge = `<span class="badge bg-info">${item.status}</span>`;
                
                tr.innerHTML = `
                    <td>#${item.id}</td>
                    <td class="fw-bold text-primary"><i class="fa-solid fa-wifi me-2"></i>${item.rfid_uid}</td>
                    <td>${statusBadge}</td>
                    <td><i class="fa-regular fa-clock me-1 text-muted"></i> ${new Date(item.created_at).toLocaleString()}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="alert('Funcionalidad para Asignar tarjeta ${item.rfid_uid} a un nuevo huésped próximamente.')">
                            <i class="fa-solid fa-user-plus"></i> Asignar Cliente
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4"><i class="fa-solid fa-inbox fs-3 mb-2 d-block"></i> No hay tarjetas RFID registradas aún. ¡Pasa una tarjeta por el lector!</td></tr>';
        }
    } catch (error) {
        console.error(error);
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger py-4">Error de conexión con la base de datos al cargar las tarjetas. ¿Está encendido el servidor MySQL (WAMP)?</td></tr>';
    }
}
