<?php
header('Content-Type: application/json');

$conn = new mysqli('localhost', 'root', '', 'mural_jm');

if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión BD"]));
}

// Buscamos las fotos pendientes
$sql = "SELECT id, file_name, event_id FROM photos WHERE status = 'pending'";
$result = $conn->query($sql);

$fotos = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $fotos[] = $row;
    }
}

echo json_encode($fotos);
$conn->close();
?>