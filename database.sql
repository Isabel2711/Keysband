CREATE DATABASE IF NOT EXISTS keysband_db;
USE keysband_db;

-- Tabla de Hoteles
CREATE TABLE IF NOT EXISTS hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar hoteles de ejemplo
INSERT IGNORE INTO hotels (id, name, address) VALUES 
(1, 'Hotel Paraíso', 'Av. del Sol 123'),
(2, 'Grand Hotel Central', 'Plaza Mayor 5'),
(3, 'Vista del Mar', 'Costanera Sur KM 12'),
(4, 'Posada del Bosque', 'Camino Real 45'),
(5, 'Resort Las Nubes', 'Cerro Verde 789'),
(6, 'Hotel Boutique Centro', 'Calle 5 de Mayo 10'),
(7, 'Eco Hotel Selva', 'Reserva Natural S/N');

-- Tabla de Usuarios/Tarjetas RFID
CREATE TABLE IF NOT EXISTS users_rfid (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rfid_uid VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'active',
    client_name VARCHAR(100) DEFAULT NULL,
    client_email VARCHAR(100) DEFAULT NULL,
    client_age INT DEFAULT NULL,
    hotel_id INT DEFAULT NULL,
    stay_days INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id)
);

-- Ejemplos de uso (opcional)
-- INSERT INTO users_rfid (rfid_uid, hotel_id) VALUES ('A1B2C3D4', 1);
