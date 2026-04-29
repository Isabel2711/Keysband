import ThemeManager from './modules/ThemeManager.js';
import AuthManager from './modules/AuthManager.js';
import UIManager from './modules/UIManager.js';
import { showAlert, getElement } from './utils/helpers.js';

// Requerir autenticación
AuthManager.requireAuth();

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar tema y gestionar UI
    ThemeManager.init('#btnThemeDashboard', '#themeIconDash');
    UIManager.init();
    
    const userNameEl = getElement('#userName');
    if (userNameEl && AuthManager.currentUser) {
        userNameEl.textContent = AuthManager.currentUser.name || 'Admin';
        
        // Mostrar hotel actual
        const userHotelEl = getElement('#userHotel');
        if (userHotelEl && AuthManager.currentUser.hotel) {
            userHotelEl.querySelector('span').textContent = AuthManager.currentUser.hotel.name;
        }
    }

    const btnLogout = getElement('#btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => AuthManager.logout());
    }

    // Funcionalidad de RFID
    const btnRefresh = getElement('#btnRefreshRfid');
    if (btnRefresh) {
        btnRefresh.addEventListener('click', fetchRfids);
    }
    
    // Delegación de eventos para los botones de la tabla
    const tbody = getElement('#rfidTableBody');
    if (tbody) {
        tbody.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-assign');
            if (btn) {
                const data = btn.dataset;
                openAssignModal(data.uid, data.name, data.email, data.age, data.hotel, data.days);
            }
        });
    }

    // Manejo del formulario de asignación
    const assignForm = getElement('#assignClientForm');
    if (assignForm) {
        assignForm.addEventListener('submit', handleAssignForm);
    }
    
    // Cargar tarjetas y hoteles automáticamente al entrar
    fetchRfids();
    fetchHotels();
});

let hotelsList = [];

async function fetchHotels() {
    try {
        const response = await fetch('api/get_hotels.php');
        const result = await response.json();
        if (result.success) {
            hotelsList = result.data;
            const select = getElement('#hotelId');
            if (select) {
                select.innerHTML = '<option value="">Seleccione un hotel...</option>';
                hotelsList.forEach(h => {
                    const opt = document.createElement('option');
                    opt.value = h.id;
                    opt.textContent = h.name;
                    select.appendChild(opt);
                });
            }
        }
    } catch (e) { 
        console.error("Error al cargar hoteles:", e); 
    }
}

async function fetchRfids() {
    const tbody = getElement('#rfidTableBody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="6" class="text-center"><div class="spinner-border text-primary spinner-border-sm" role="status"></div> Cargando...</td></tr>';
    
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
                
                // Info del cliente
                const clientInfo = item.client_name 
                    ? `<div>
                        <span class="fw-bold">${item.client_name}</span>
                        ${item.client_age ? `<span class="badge bg-light text-dark ms-1">${item.client_age} años</span>` : ''}
                        <br>
                        <small class="text-muted">${item.client_email || ''}</small>
                        ${item.hotel_name ? `<div class="mt-1"><i class="fa-solid fa-hotel me-1" style="font-size: 0.75rem;"></i><span style="font-size: 0.8rem;">${item.hotel_name}</span></div>` : ''}
                        ${item.stay_days ? `<div style="font-size: 0.75rem;"><i class="fa-solid fa-moon me-1"></i>${item.stay_days} noches</div>` : ''}
                      </div>`
                    : '<span class="text-muted italic">No asignado</span>';

                tr.innerHTML = `
                    <td>#${item.id}</td>
                    <td class="fw-bold text-primary"><i class="fa-solid fa-wifi me-2"></i>${item.rfid_uid}</td>
                    <td>${clientInfo}</td>
                    <td>${statusBadge}</td>
                    <td><i class="fa-regular fa-clock me-1 text-muted"></i> ${new Date(item.created_at).toLocaleString()}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary btn-assign" 
                                data-uid="${item.rfid_uid}" 
                                data-name="${item.client_name || ''}" 
                                data-email="${item.client_email || ''}" 
                                data-age="${item.client_age || ''}" 
                                data-hotel="${item.hotel_id || ''}" 
                                data-days="${item.stay_days || ''}">
                            <i class="fa-solid fa-user-plus"></i> ${item.client_name ? 'Reasignar' : 'Asignar Cliente'}
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4"><i class="fa-solid fa-inbox fs-3 mb-2 d-block"></i> No hay tarjetas RFID registradas aún. ¡Pasa una tarjeta por el lector!</td></tr>';
        }
    } catch (error) {
        console.error(error);
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger py-4">Error de conexión con la base de datos al cargar las tarjetas. ¿Está encendido el servidor MySQL (WAMP)?</td></tr>';
    }
}

function openAssignModal(uid, name, email, age, hotelId, days) {
    getElement('#modalRfidUid').value = uid;
    getElement('#clientName').value = name;
    getElement('#clientEmail').value = email;
    getElement('#clientAge').value = age === 'null' ? '' : age;
    
    // Si no hay hotelId (es nuevo), usar el del login
    if ((!hotelId || hotelId === 'null') && AuthManager.currentUser && AuthManager.currentUser.hotel) {
        getElement('#hotelId').value = AuthManager.currentUser.hotel.id;
    } else {
        getElement('#hotelId').value = hotelId === 'null' ? '' : hotelId;
    }
    
    getElement('#stayDays').value = days === 'null' ? '' : days;
    
    const modalEl = getElement('#assignClientModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}

async function handleAssignForm(e) {
    e.preventDefault();
    
    const rfid_uid = getElement('#modalRfidUid').value;
    const client_name = getElement('#clientName').value;
    const client_email = getElement('#clientEmail').value;
    const client_age = getElement('#clientAge').value;
    const hotel_id = getElement('#hotelId').value;
    const stay_days = getElement('#stayDays').value;
    
    try {
        UIManager.showLoading('Guardando datos...');
        
        const response = await fetch('api/assign_client.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rfid_uid, client_name, client_email, client_age, hotel_id, stay_days })
        });
        
        const result = await response.json();
        UIManager.hideLoading();
        
        if (result.success) {
            await showAlert('¡Éxito!', result.message, 'success', 2000);
            
            // Cerrar modal
            const modalEl = getElement('#assignClientModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
            
            // Recargar tabla
            fetchRfids();
        } else {
            await showAlert('Error', result.error, 'error');
        }
    } catch (error) {
        UIManager.hideLoading();
        console.error(error);
        await showAlert('Error de conexión', 'No se pudo comunicar con el servidor.', 'error');
    }
}
