#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>

// Configuración de red WiFi
const char* ssid = "TU_SSID_WIFI";
const char* password = "TU_PASSWORD_WIFI";

// Configuración de Servidor API Local (tu PC)
// Reemplaza con la IP de tu computadora (debe estar en la misma red que el ESP32)
const char* serverName = "http://192.168.1.100/Keysband-main/Keysband-main/api/register_rfid.php";

// Definición de pines para ESP32 + MFRC522
#define SS_PIN  5  // Para el pin SDA(SS) en ESP32
#define RST_PIN 22 // Para el pin RST/Reset en ESP32

MFRC522 rfid(SS_PIN, RST_PIN); // Inicializar librería

void setup() {
  Serial.begin(115200);
  
  // Inicializar RFID
  SPI.begin();
  rfid.PCD_Init();
  Serial.println("Lector RFID RC522 inicializado. Posicione la tarjeta...");

  // Conectar a la red WiFi
  Serial.print("Conectando a WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi conectado.");
  Serial.print("Dirección IP ESP32: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Comprobar si hay una tarjeta cerca
  if (!rfid.PICC_IsNewCardPresent())
    return;

  // Leer la tarjeta
  if (!rfid.PICC_ReadCardSerial())
    return;

  // Limpiar/Transformar ID Leído a un String
  String rfid_uid = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    // Convierte el valor en hexadecimal para un mejor formato
    // Agregar un 0 inicial si el valor hexadecimal es menor que 0x10
    if (rfid.uid.uidByte[i] < 0x10) {
      rfid_uid += "0";
    }
    rfid_uid += String(rfid.uid.uidByte[i], HEX);
  }
  
  // Convertir a mayúsculas
  rfid_uid.toUpperCase();
  
  Serial.print("UID leido: ");
  Serial.println(rfid_uid);

  // Parar comunicación con tarjeta
  rfid.PICC_HaltA();
  
  // Enviar UID leido al servidor HTTP
  sendRFIDToServer(rfid_uid);
  
  // Esperar antes de la siguiente lectura
  delay(2000); 
}

void sendRFIDToServer(String uid) {
  // Solo enviar si hay conexión WiFi
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // Iniciar conexion con servidor API
    http.begin(serverName);
    
    // Configurar cabeceras (Content-Type: JSON)
    http.addHeader("Content-Type", "application/json");

    // Construir la carga útil JSON
    // {"rfid_uid": "ABCDEF12"}
    String payload = "{\"rfid_uid\":\"" + uid + "\"}";

    // Enviar peticion POST y guardar la respuestaHTTPCode
    Serial.print("Enviando UID a servidor... Payload: ");
    Serial.println(payload);
    
    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
      Serial.print("HTTP Code Recibido: ");
      Serial.println(httpResponseCode);
      
      String response = http.getString();
      Serial.println("Respuesta del servidor: ");
      Serial.println(response);
    } else {
      Serial.print("Error al conectar al servidor HTTP. Codigo: ");
      Serial.println(httpResponseCode);
    }

    http.end(); // Liberar memoria / Cerrar conexion HTTP
  } else {
    Serial.println("Error de conexión a WiFi");
  }
}
