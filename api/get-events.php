<?php
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root', '', 'mural_jm');

// Traemos todos los eventos, los más nuevos primero
$sql = "SELECT id, name, active FROM events ORDER BY id DESC";
$res = $conn->query($sql);

$eventos = [];
while($row = $res->fetch_assoc()) {
    $eventos[] = $row;
}

echo json_encode($eventos);
$conn->close();
?>