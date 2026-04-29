<?php
header('Content-Type: application/json');
require_once 'db.php';

// Obtener datos del POST
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['rfid_uid']) || !isset($data['client_name'])) {
    echo json_encode(["success" => false, "error" => "Datos incompletos"]);
    exit;
}

$rfid_uid = $conn->real_escape_string($data['rfid_uid']);
$client_name = $conn->real_escape_string($data['client_name']);
$client_email = !empty($data['client_email']) ? "'" . $conn->real_escape_string($data['client_email']) . "'" : "NULL";
$client_age = !empty($data['client_age']) ? (int)$data['client_age'] : "NULL";
$hotel_id = !empty($data['hotel_id']) ? (int)$data['hotel_id'] : "NULL";
$stay_days = !empty($data['stay_days']) ? (int)$data['stay_days'] : "NULL";

// Actualizar la tarjeta con la información del cliente
$sql = "UPDATE users_rfid SET 
        client_name = '$client_name', 
        client_email = $client_email,
        client_age = $client_age,
        hotel_id = $hotel_id,
        stay_days = $stay_days
        WHERE rfid_uid = '$rfid_uid'";

if ($conn->query($sql)) {
    echo json_encode(["success" => true, "message" => "Cliente asignado correctamente"]);
} else {
    echo json_encode(["success" => false, "error" => "Error al actualizar: " . $conn->error]);
}

$conn->close();
?>
