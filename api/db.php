<?php
// Configuración de la Base de Datos para WAMP
$host = "localhost"; // Servidor WAMP (normalmente localhost)
$user = "root";      // Usuario de WAMP (normalmente root)
$pass = "";          // Contraseña de WAMP (normalmente vacía)
$dbname = "keysband_db";

// Conexión
$conn = new mysqli($host, $user, $pass, $dbname);

// Comprobar la conexión
if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión a la base de datos: " . $conn->connect_error]));
}

// Configurar charset a utf8
$conn->set_charset("utf8");
?>
