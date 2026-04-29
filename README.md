# HotelAdmin Pro - Dashboard Web Modularizado

## Descripción
Dashboard administrativo modularizado con arquitectura escalable construido con HTML5, CSS3 y JavaScript vanilla con módulos.

## 📁 Estructura del Proyecto

```
Keysband/
├── index.html                 # Página de login
├── dashboard.html             # Página del dashboard
├── src/
│   ├── css/
│   │   ├── theme.css         # Variables de tema y estilos de temas
│   │   ├── global.css        # Estilos globales
│   │   ├── login.css         # Estilos específicos del login
│   │   └── dashboard.css     # Estilos específicos del dashboard
│   ├── js/
│   │   ├── modules/
│   │   │   ├── ThemeManager.js      # Gestor de temas claro/oscuro
│   │   │   ├── AuthManager.js       # Gestor de autenticación
│   │   │   ├── ChartManager.js      # Gestor de gráficas (Chart.js)
│   │   │   └── UIManager.js         # Gestor de elementos UI
│   │   ├── utils/
│   │   │   ├── config.js            # Configuración global
│   │   │   └── helpers.js           # Funciones auxiliares
│   │   ├── app.js                   # Script principal del login
│   │   └── dashboard.js             # Script principal del dashboard
│   └── components/              # HTML reutilizable (opcional)
└── README.md

```

## 🎯 Características de la Arquitectura

### 1. **Separación de Responsabilidades**
- Cada módulo tiene una responsabilidad única y bien definida
- CSS separado por secciones (tema, global, específico)
- JavaScript modular con ES6 imports

### 2. **Gestión de Temas**
- **ThemeManager.js**: Maneja cambios entre modo claro y oscuro
- Variables CSS para fácil personalización
- Persistencia en localStorage

### 3. **Autenticación**
- **AuthManager.js**: Valida credenciales y mantiene sesión
- Redirige al dashboard si no está autenticado
- Almacena usuario actual

### 4. **Gráficas**
- **ChartManager.js**: Centraliza todo lo relacionado con Chart.js
- Métodos reutilizables para diferentes tipos de gráficas
- Actualización automática de colores con cambios de tema

### 5. **Interfaz de Usuario**
- **UIManager.js**: Gestiona elementos UI comunes
- Toggle del sidebar responsive
- Actualización dinámica de información

## 🚀 Cómo Usar

### Inicializar el Proyecto
1. Abre `index.html` en el navegador
2. Credenciales de prueba:
   - Email: `admin@hotel.com`
   - Contraseña: `1234`

### Extender Funcionalidades

#### Agregar un Nuevo Módulo
```javascript
// src/js/modules/MyModule.js
class MyModule {
    constructor() {
        // Inicialización
    }
    
    myMethod() {
        // Tu lógica aquí
    }
}

export default new MyModule();
```

#### Usar el Módulo
```javascript
// En app.js o dashboard.js
import MyModule from './modules/MyModule.js';

MyModule.myMethod();
```

#### Agregar Nuevos Estilos
1. Crea archivo en `src/css/`
2. Importa en el HTML:
```html
<link rel="stylesheet" href="src/css/miestilo.css">
```

### Cambiar Credenciales de Login
Edita `src/js/utils/config.js`:
```javascript
auth: {
    email: 'tu_email@example.com',
    password: 'tu_contraseña'
}
```

## 📦 Módulos Disponibles

### ThemeManager
```javascript
import ThemeManager from './modules/ThemeManager.js';

ThemeManager.init('#btnTheme', '#themeIcon');
ThemeManager.setTheme('light'); // 'light' o 'dark'
ThemeManager.getCurrentTheme(); // Retorna el tema actual
```

### AuthManager
```javascript
import AuthManager from './modules/AuthManager.js';

await AuthManager.login(email, password);
AuthManager.logout();
AuthManager.isLoggedIn();
AuthManager.requireAuth(); // Redirige a login si no está autenticado
```

### ChartManager
```javascript
import ChartManager from './modules/ChartManager.js';

ChartManager.createBarChart('canvasId', labels, data, colors);
ChartManager.createPieChart('canvasId', labels, data, colors);
ChartManager.createLineChart('canvasId', labels, data, color);
ChartManager.createMixedChart('canvasId', labels, datasets);
```

### UIManager
```javascript
import UIManager from './modules/UIManager.js';

UIManager.init({ toggleBtn, sidebar, mainContent });
UIManager.toggleSidebar();
UIManager.updateInfo(selector, value);
```

### Helpers
```javascript
import {
    getCurrentTheme,
    showAlert,
    isValidEmail,
    getElement,
    saveToLocalStorage,
    getFromLocalStorage
} from './utils/helpers.js';

await showAlert('Título', 'Mensaje', 'success', 1500);
```

## 🎨 Personalización

### Variables de Color
Edita `src/css/theme.css`:
```css
:root {
    --bg-main: #12141d;
    --accent-purple: #6f42c1;
    /* ... más variables */
}
```

## 📱 Responsividad
El proyecto es completamente responsive:
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (320px - 767px)

## 🔒 Seguridad
⚠️ **Nota**: Esta es una demostración. Para producción:
- Implementa autenticación real con backend
- Nunca almacenes credenciales en el cliente
- Usa HTTPS
- Valida en el servidor

## 🤝 Extensibilidad

La arquitectura permite fácil expansión:

1. **Nuevos Módulos**: Crea módulos siguiendo el patrón existente
2. **Nuevas Páginas**: Crea HTML + JS + CSS específicos
3. **Integración API**: Modifica AuthManager y config.js
4. **Nuevas Gráficas**: Usa ChartManager.createChart()

## 📚 Tecnologías
- HTML5
- CSS3 (con variables CSS)
- JavaScript ES6+ (Módulos)
- Bootstrap 5.3
- Chart.js
- Font Awesome 6.4
- SweetAlert2

## 📖 Pasos Siguientes

1. **Conectar a API Real**: Modifica AuthManager para usar fetch
2. **Agregar Estado Global**: Considera usar un gestor de estado
3. **Optimizar Gráficas**: Carga datos dinámicos desde backend
4. **Agregar Rutas**: Implementa un router para navegación SPA
5. **Testing**: Agrega tests unitarios con Jest o Vitest

## 💡 Ventajas de esta Arquitectura

✅ **Modular**: Cada módulo es independiente y reutilizable  
✅ **Escalable**: Fácil de agregar nuevas funcionalidades  
✅ **Mantenible**: Código organizado y fácil de navegar  
✅ **Responsivo**: Funciona en todos los dispositivos  
✅ **Tema Dinámico**: Cambio de tema sin recargar  
✅ **Sin Dependencias Pesadas**: Usa vanilla JS con módulos  

---

**Versión**: 1.0.0  
**Última actualización**: Febrero 2026  
**Autor**: Tu Nombre

