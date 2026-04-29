<?php
header('Content-Type: application/json');
require_once 'db.php';

$sql = "SELECT id, name FROM hotels ORDER BY name ASC";
$result = $conn->query($sql);

$hotels = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $hotels[] = $row;
    }
}

echo json_encode(["success" => true, "data" => $hotels]);

$conn->close();
?>
