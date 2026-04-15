# ✅ CHECKLIST - CONECTAR BD HOSTINGER A DASHBOARD

## 📋 Pasos a Seguir

### PASO 1: Obtener API Key de Hostinger
```
[ ] 1. Accede a panel.hostinger.com (o tu proveedor)
[ ] 2. Busca "API" en el menú
[ ] 3. Genera un nuevo API Key
[ ] 4. Copia la clave (ejemplo: ak_live_xxxxx)
```

### PASO 2: Agregar API Key al Proyecto
```
[ ] 1. Abre: src/js/utils/config.js
[ ] 2. Busca: apiKey: 'TU_API_KEY_AQUI'
[ ] 3. Reemplaza con tu API Key real:
        apiKey: 'ak_live_xxxxx'
[ ] 4. Guarda el archivo
```

### PASO 3: Crear Endpoints en Hostinger

Tienes 2 opciones:

#### OPCIÓN A: PHP (Recomendado para Hostinger)
```
[ ] 1. En Hostinger, crea carpeta: /public_html/api/
[ ] 2. Crea archivo: /public_html/api/index.php
[ ] 3. Copia el código de HOSTINGER_SETUP.md (sección "Opción A")
[ ] 4. Actualiza 'TU_API_KEY_SECRETO' con tu API Key
[ ] 5. Guarda el archivo
```

#### OPCIÓN B: Node.js
```
[ ] 1. En tu servidor Node.js
[ ] 2. Copia el código de HOSTINGER_SETUP.md (sección "Opción B")
[ ] 3. Instala Express: npm install express
[ ] 4. Ejecuta: node api.js
```

### PASO 4: Conectar BD a los Endpoints

En tu archivo de API (PHP o Node.js):

```
[ ] 1. Conectar a tu BD Hostinger
        // Para PHP: mysqli_connect()
        // Para Node.js: mysql.createConnection()
[ ] 2. Consultar las tablas:
        - tblConsumo (ventas)
        - tblIncidencia (incidencias)
        - tblPersonal (personal)
        - tblAsistencia (asistencia)
[ ] 3. Devolver datos en formato JSON
[ ] 4. Probar cada endpoint individualmente
```

### PASO 5: Probar Conexión desde Navegador

En la consola del navegador (F12):

```javascript
// Pega esto en la consola:

import APIManager from './src/js/modules/APIManager.js';

// Probar endpoint 1
const resultado = await APIManager.getSalesData();
console.log('Ventas:', resultado);

// Probar endpoint 2
const incidentes = await APIManager.getIncidents();
console.log('Incidentes:', incidentes);

// Si ves success: true, ¡está funcionando! ✅
```

### PASO 6: Verificar que todo Funciona

```
[ ] 1. Recarga el dashboard (F5)
[ ] 2. Verifica que las gráficas tengan datos
[ ] 3. Abre la consola (F12) y busca errores
[ ] 4. Revisa que los valores en KPIs son de tu BD
```

---

## 📁 Estructura del Proyecto Actualizada

```
Keysband/
├── src/
│   └── js/
│       ├── modules/
│       │   ├── APIManager.js          ⭐ NUEVO - Conecta a API
│       │   ├── AuthManager.js
│       │   ├── ChartManager.js
│       │   ├── ThemeManager.js
│       │   └── UIManager.js
│       ├── utils/
│       │   ├── config.js              ⭐ ACTUALIZADO - Agrega API Key aquí
│       │   └── helpers.js
│       ├── app.js
│       └── dashboard.js               ⭐ ACTUALIZADO - Usa datos de API
│
└── HOSTINGER_SETUP.md                 ⭐ NUEVO - Guía de configuración
└── EJEMPLOS_API.js                    ⭐ NUEVO - Ejemplos de uso
```

---

## 🔑 Datos que Necesitas de Hostinger

### Opción 1: Panel de Control Hostinger

1. **URL de Base de Datos**
   - Usuario: `xxxxx_admin`
   - Host: `localhost` o `127.0.0.1`

2. **Credenciales SQL**
   - Usuario: `xxxxx_user`
   - Contraseña: (la que pusiste)

3. **Nombre de BD**
   - `xxxxx_keysband` (o la que creaste)

### Opción 2: API Key Hostinger
- Si tu plan incluye API: **API Key** (cópialo y usa en config.js)

---

## 🧪 Pruebas Rápidas

### Test 1: Verificar API Key
```bash
curl -H "X-API-Key: tu_api_key" https://kaseyband.com/api/sales
```

Resultado esperado:
```json
{
    "totalRevenue": "$128,540.00",
    "transactions": 742,
    ...
}
```

### Test 2: Verificar CORS
```javascript
fetch('https://kaseyband.com/api/sales', {
    headers: { 'X-API-Key': 'tu_api_key' }
})
.then(r => r.json())
.then(d => console.log(d))
```

### Test 3: Desde el Dashboard
1. Abre dashboard.html en navegador
2. Abre consola (F12)
3. Las gráficas deberían mostrar datos

---

## ⚠️ Errores Comunes

### Error 1: "CORS error"
**Solución:**
```php
// Agrega a tu PHP:
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-API-Key');
```

### Error 2: "401 Unauthorized"
**Solución:**
```
[ ] Verifica que la API Key sea correcta
[ ] Verifica que se envíe en header: X-API-Key
[ ] Verifica que no tenga espacios al inicio/final
```

### Error 3: "Network error"
**Solución:**
```
[ ] Verifica que la URL base sea: https://kaseyband.com/api
[ ] Verifica que tu API está online
[ ] Verifica que no hay firewall bloqueando
```

### Error 4: "Las gráficas están vacías"
**Solución:**
```
[ ] Abre consola (F12)
[ ] Busca fetch errors
[ ] Verifica que los endpoints retornan datos
[ ] Verifica formato JSON
```

---

## 📝 Archivos a Revisar

1. **config.js** - Agrega tu API Key aquí
2. **APIManager.js** - Ya creado, no sé toca
3. **dashboard.js** - Ya actualizado, carga datos de API
4. **HOSTINGER_SETUP.md** - Cómo crear los endpoints

---

## 🚀 Resumen Final

**Lo que hemos hecho:**
- ✅ Creado `APIManager.js` para conectar a APIs
- ✅ Actualizado `dashboard.js` para cargar datos dinámicos
- ✅ Actualizado `config.js` para configuración
- ✅ Creado documentación completa

**Lo que debes hacer:**
1. ✅ Agregar tu API Key en `config.js`
2. ✅ Crear los endpoints en Hostinger
3. ✅ Conectar la BD a los endpoints
4. ✅ Probar que funciona

**El resultado:**
- 📊 Gráficas con datos en tiempo real de tu BD
- 🔄 Datos actualizables automáticamente
- 🔒 Seguro con API Key
- 📱 Totalmente responsive

---

## 📞 Soporte

### Si necesitas:
- **Ver estructura de endpoint**: Abre `HOSTINGER_SETUP.md`
- **Ejemplos de código**: Abre `EJEMPLOS_API.js`
- **Ayuda con PHP**: Busca "PHP mysqli tutorial"
- **Ayuda con Node.js**: Busca "Node.js Express tutorial"

---

## ✨ Próximos Pasos (Opcionales)

- [ ] Agregar autenticación de usuario a la BD
- [ ] Agregar filtros por fecha en las gráficas
- [ ] Agregar exportación a PDF/Excel
- [ ] Agregar gráficas en tiempo real con WebSocket
- [ ] Agregar búsqueda y paginación en tablas

---

**Estado: Listo para conectar tu BD** ✅

