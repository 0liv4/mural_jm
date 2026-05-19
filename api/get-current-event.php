<?php
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root', '', 'mural_jm');

$sql = "SELECT name FROM events WHERE active = 1 LIMIT 1";
$res = $conn->query($sql);

if ($res->num_rows > 0) {
    $row = $res->fetch_assoc();
    echo json_encode(["exito" => true, "nombre" => $row['name']]);
} else {
    echo json_encode(["exito" => false, "nombre" => "Evento en pausa"]);
}

$conn->close();
?>