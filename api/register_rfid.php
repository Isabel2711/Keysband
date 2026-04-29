<?php
// Permitir cualquier IP (CORS) y especificar que devolveremos JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Incluir configuración de base de datos
include_once 'db.php';

// Obtener los datos sin procesar recibidos mediante POST (JSON o form urlencoded)
$data = json_decode(file_get_contents("php://input"));

// También aceptar datos por $_POST normal si el ESP manda 'application/x-www-form-urlencoded'
$rfid_uid = "";
if (isset($data->rfid_uid)) {
    $rfid_uid = $data->rfid_uid;
} else if (isset($_POST['rfid_uid'])) {
    $rfid_uid = $_POST['rfid_uid'];
}

// Validar que el RFID no esté vacío
if (!empty($rfid_uid)) {
    // Escapar caracteres para prevenir inyección SQL básica
    $rfid_uid = $conn->real_escape_string($rfid_uid);

    // Consulta para verificar si ya existe el rfid
    $check_query = "SELECT id FROM users_rfid WHERE rfid_uid = '$rfid_uid' LIMIT 1";
    $result = $conn->query($check_query);

    if ($result->num_rows > 0) {
        // Ya existe, devolvemos un mensaje o actualizamos su status
        echo json_encode(array("message" => "El usuario con este RFID ya está registrado.", "rfid" => $rfid_uid));
    } else {
        // No existe, procedemos a insertar en la BD
        $insert_query = "INSERT INTO users_rfid (rfid_uid) VALUES ('$rfid_uid')";

        if ($conn->query($insert_query) === TRUE) {
            http_response_code(201); // Created
            echo json_encode(array("message" => "Usuario registrado exitosamente.", "rfid" => $rfid_uid));
        } else {
            http_response_code(503); // Service Unavailable
            echo json_encode(array("message" => "Error al registrar el usuario.", "error" => $conn->error));
        }
    }
} else {
    // Si los datos están incompletos
    http_response_code(400); // Bad Request
    echo json_encode(array("message" => "Datos incompletos. Se requiere rfid_uid."));
}

$conn->close();
?>
