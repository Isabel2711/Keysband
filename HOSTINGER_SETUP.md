# 🔗 INTEGRACIÓN CON HOSTINGER - GUÍA COMPLETA

## 📋 Resumen

Tu dashboard ahora está configurado para conectarse a una BD en Hostinger. Este documento te explica paso a paso qué hacer.

---

## 🔑 Paso 1: Obtener tu API Key de Hostinger

### En Hostinger:
1. Accede a tu panel de control de Hostinger
2. Busca "API" o "Seguridad API"
3. Genera un nuevo API Key
4. **Copia la API Key** (algo como: `ak_live_xxxxxxxxxxxxx`)

### En el Proyecto:
Abre `src/js/utils/config.js` y reemplaza:

```javascript
api: {
    baseURL: 'https://kaseyband.com/api',
    apiKey: 'TU_API_KEY_AQUI', // 👈 REEMPLAZA CON TU API KEY
    timeout: 10000
},
```

Por:

```javascript
api: {
    baseURL: 'https://kaseyband.com/api',
    apiKey: 'ak_live_xxxxxxxxxxxxx', // Tu API Key real
    timeout: 10000
},
```

---

## 📡 Paso 2: Crear los Endpoints en Hostinger

Tu API debe tener estos endpoints configurados. Aquí está la estructura que espera el dashboard:

### 📊 ENDPOINTS DE VENTAS/INGRESOS

#### `GET /api/sales`
Retorna datos generales de ventas

```json
{
    "totalRevenue": "$128,540.00",
    "transactions": 742,
    "avgTicket": "$173.20",
    "highestStay": "$5,640.00"
}
```

#### `GET /api/sales/by-service`
Retorna ventas desglosadas por servicio

```json
{
    "labels": ["Restaurante", "Bar", "Spa", "Tienda"],
    "values": [52300, 28400, 15700, 8140],
    "colors": ["#3b82f6", "#10b981", "#06b6d4", "#ef4444"]
}
```

#### `GET /api/sales/daily?days=7`
Retorna ingresos diarios de los últimos N días

```json
{
    "labels": ["Lun", "Mar", "Mié", "Jue", "Vie", "Sab", "Dom"],
    "sales": [200, 450, 300, 600, 700, 800, 900],
    "trend": [500, 750, 580, 900, 850, 950, 1000]
}
```

#### `GET /api/sales/transactions`
Retorna conteo de transacciones

```json
{
    "count": 742,
    "daily": 106
}
```

---

### 🚨 ENDPOINTS DE INCIDENCIAS

#### `GET /api/incidents`
Retorna todas las incidencias

```json
{
    "total": 56,
    "data": [
        {"id": 1, "date": "01/05/24", "type": "Pulsera Perdida", "description": "Pulsera extraviada en piscina."},
        {"id": 2, "date": "30/04/24", "type": "Fraude", "description": "Cargo no autorizado."}
    ]
}
```

#### `GET /api/incidents/recent?limit=10`
Retorna incidencias recientes

```json
{
    "data": [
        {"id": 1, "date": "01/05/24", "type": "Pulsera Perdida", "description": "Pulsera extraviada en piscina."},
        {"id": 2, "date": "30/04/24", "type": "Fraude", "description": "Cargo no autorizado."},
        {"id": 3, "date": "28/04/24", "type": "Daño", "description": "Pulsera dañada en gimnasio."},
        {"id": 4, "date": "27/04/24", "type": "Reembolso", "description": "Devolución por servicio cancelado."}
    ]
}
```

#### `GET /api/incidents/types`
Retorna desglose por tipo de incidente

```json
{
    "labels": ["Perdidas", "Fraude", "Daños", "Reembolsos"],
    "values": [25, 15, 32, 28],
    "colors": ["#dc2626", "#1d4ed8", "#38bdf8", "#ea580c"]
}
```

#### `GET /api/incidents/cost`
Retorna costo de incidencias

```json
{
    "estimatedCost": "$7,820.00",
    "refunds": "$1,540.00",
    "lostBracelets": 14
}
```

#### `GET /api/incidents/lost-bracelets`
Retorna pulseras perdidas

```json
{
    "count": 14,
    "cost": "$3,500.00"
}
```

---

### 👥 ENDPOINTS DE PERSONAL

#### `GET /api/staff`
Retorna datos de personal

```json
{
    "totalEmployees": 32,
    "absences": 3,
    "punctuality": "92%"
}
```

#### `GET /api/staff/attendance`
Retorna asistencia del personal

```json
{
    "data": [
        {"name": "Ana G.", "position": "Recepción", "entry": "14:02", "status": "Puntual"},
        {"name": "Carlos M.", "position": "Mantenimiento", "entry": "13:15", "status": "Retardo"},
        {"name": "Lucía R.", "position": "Limpieza", "entry": null, "status": "Ausente"}
    ]
}
```

#### `GET /api/staff/by-shift`
Retorna personal por turno

```json
{
    "labels": ["Limpieza", "Recepción", "Mantenimiento", "Otras"],
    "values": [28, 25, 18, 29],
    "shiftLabels": ["Mañana", "Tarde", "Noche"],
    "shiftValues": [30, 20, 15]
}
```

#### `GET /api/staff/count`
Retorna total de empleados

```json
{
    "total": 32,
    "byShift": {"morning": 30, "afternoon": 20, "night": 15}
}
```

#### `GET /api/staff/absences`
Retorna ausentismo

```json
{
    "today": 3,
    "thisWeek": 8,
    "thisMonth": 22
}
```

#### `GET /api/staff/punctuality`
Retorna puntualidad

```json
{
    "percent": 92,
    "onTime": 29,
    "late": 3
}
```

---

### 🛒 ENDPOINTS DE SERVICIOS

#### `GET /api/services`
Retorna servicios disponibles

```json
{
    "data": [
        {"id": 1, "name": "Restaurante", "revenue": 52300},
        {"id": 2, "name": "Bar", "revenue": 28400},
        {"id": 3, "name": "Spa", "revenue": 15700},
        {"id": 4, "name": "Tienda", "revenue": 8140}
    ]
}
```

#### `GET /api/services/top`
Retorna servicios más vendidos

```json
{
    "labels": ["Buffet", "Masaje Spa", "Cocktails", "Otros"],
    "values": [28, 24, 18, 30],
    "colors": ["#f59e0b", "#0ea5e9", "#64748b", "#ef4444"]
}
```

---

### 🍽️ ENDPOINTS DE CONSUMO

#### `GET /api/consumption`
Retorna datos de consumo

```json
{
    "avgTicket": "$173.20",
    "highestStay": "$5,640.00",
    "totalRevenue": "$128,540.00"
}
```

#### `GET /api/consumption/avg-ticket`
Retorna ticket promedio

```json
{
    "avg": 173.20,
    "currency": "USD"
}
```

#### `GET /api/consumption/highest-stay`
Retorna estancia más alta

```json
{
    "price": 5640.00,
    "guestName": "Cliente VIP",
    "days": 5
}
```

---

### 📱 ENDPOINTS DE DISPOSITIVOS

#### `GET /api/devices`
Retorna datos de dispositivos

```json
{
    "total": 150,
    "active": 145,
    "inactive": 5
}
```

#### `GET /api/devices/active`
Retorna pulseras activas

```json
{
    "count": 145,
    "percent": 96.7
}
```

#### `GET /api/devices/status`
Retorna estado de dispositivos

```json
{
    "active": 145,
    "inactive": 5,
    "charging": 8
}
```

---

## 🛠️ Paso 3: Crear la API en Hostinger

### Opción A: Si tienes PHP

Crea un archivo `api/index.php`:

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-API-Key');

// Verificar API Key
$apiKey = $_SERVER['HTTP_X_API_KEY'] ?? null;
if ($apiKey !== 'TU_API_KEY_SECRETO') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$endpoint = str_replace('/api/', '', $path);

// Rutas
switch ($endpoint) {
    case 'sales':
        echo json_encode([
            'totalRevenue' => '$128,540.00',
            'transactions' => 742,
            'avgTicket' => '$173.20',
            'highestStay' => '$5,640.00'
        ]);
        break;
    
    case 'sales/by-service':
        echo json_encode([
            'labels' => ['Restaurante', 'Bar', 'Spa', 'Tienda'],
            'values' => [52300, 28400, 15700, 8140]
        ]);
        break;

    // ... más endpoints ...

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
}
?>
```

### Opción B: Si usas Node.js

Crea un archivo `api.js`:

```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    const apiKey = req.get('X-API-Key');
    if (apiKey !== 'TU_API_KEY_SECRETO') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
});

// Rutas
app.get('/api/sales', (req, res) => {
    res.json({
        totalRevenue: '$128,540.00',
        transactions: 742,
        avgTicket: '$173.20',
        highestStay: '$5,640.00'
    });
});

app.get('/api/sales/by-service', (req, res) => {
    res.json({
        labels: ['Restaurante', 'Bar', 'Spa', 'Tienda'],
        values: [52300, 28400, 15700, 8140]
    });
});

// ... más endpoints ...

app.listen(3000, () => console.log('API running on port 3000'));
```

---

## ✅ Paso 4: Probar la Conexión

En la consola del navegador (F12), ejecuta:

```javascript
import APIManager from './src/js/modules/APIManager.js';

// Probar conexión
const result = await APIManager.getSalesData();
console.log('Resultado:', result);
```

Deberías ver:
```json
{
    "success": true,
    "data": { /* datos de tu API */ }
}
```

---

## 🔒 Paso 5: Seguridad

⚠️ **IMPORTANTE:**

✅ **Haz esto:**
- Usa HTTPS siempre
- Guarda tu API Key en servidor (no en cliente)
- Valida requests en servidor
- Usa CORS correctamente
- Rate limiting en tu API

❌ **NO hagas esto:**
- No expongas tu API Key en el código frontend
- No confíes solo en validaciones del cliente
- No hagas queries SQL directas
- No almacenes datos sensibles en localStorage

---

## 📝 Estructura de Carpetas en Hostinger

```
public_html/
├── api/
│   ├── index.php          (o api.js si usas Node.js)
│   └── config.php         (configuración BD)
├── index.php              (o solo sirve el frontend)
└── dashboard/
    └── (tu frontend aquí)
```

---

## 🧪 Testing con cURL

Prueba tus endpoints desde terminal:

```bash
# Sin API Key (debe fallar)
curl https://kaseyband.com/api/sales

# Con API Key
curl -H "X-API-Key: tu_api_key" https://kaseyband.com/api/sales

# Con POST
curl -X POST \
  -H "X-API-Key: tu_api_key" \
  -H "Content-Type: application/json" \
  -d '{"data":"test"}' \
  https://kaseyband.com/api/endpoint
```

---

## 📞 Troubleshooting

### Error: "CORS error"
- Agrega headers CORS en tu API
- Verifica que la URL base es correcta

### Error: "401 Unauthorized"
- Verifica que tu API Key es correcta
- Asegúrate que se envía en header `X-API-Key`

### Error: "Network error"
- Verifica que tu API está online
- Comprueba que `baseURL` en `config.js` es correcto
- Intenta en navegador directamente

### Las gráficas no se actualizan
- Abre la consola (F12) y busca errores
- Verifica que todos los endpoints retornan datos

---

## 🎯 Resumen Rápido

1. ✅ API Key en `src/js/utils/config.js`
2. ✅ Crea los endpoints en tu servidor Hostinger
3. ✅ Comprobación de CORS y headers
4. ✅ Prueba cada endpoint con cURL
5. ✅ ¡Las gráficas se actualizarán automáticamente!

---

## 📚 Archivos Clave

- `src/js/modules/APIManager.js` - Conexión a la API
- `src/js/utils/config.js` - Configuración (API Key aquí)
- `src/js/dashboard.js` - Carga datos de la API

