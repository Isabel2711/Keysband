<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once 'db.php';

$query = "SELECT u.*, h.name as hotel_name 
          FROM users_rfid u 
          LEFT JOIN hotels h ON u.hotel_id = h.id 
          ORDER BY u.created_at DESC";
$result = $conn->query($query);

$rfids = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $rfids[] = $row;
    }
}

echo json_encode(array("data" => $rfids));

$conn->close();
?>
