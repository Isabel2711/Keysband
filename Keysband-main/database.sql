CREATE DATABASE IF NOT EXISTS keysband_db;
USE keysband_db;

CREATE TABLE IF NOT EXISTS users_rfid (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rfid_uid VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ejemplos de uso (opcional)
-- INSERT INTO users_rfid (rfid_uid) VALUES ('A1B2C3D4');
