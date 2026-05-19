<?php
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root', '', 'mural_jm');

if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión"]));
}

// Buscamos qué evento está activo
$resEvento = $conn->query("SELECT id FROM events WHERE active = 1 LIMIT 1");

if ($resEvento->num_rows === 0) {
    die(json_encode([])); 
}

$evento = $resEvento->fetch_assoc();
$idEvento = $evento['id'];

// 2. Buscamos las fotos aprobadas de ESE evento en concreto
$sql = "SELECT file_name FROM photos WHERE event_id = $idEvento AND status = 'approved' AND active = 1";
$result = $conn->query($sql);

$fotos = []; 
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        
        $fotos[] = 'event_' . $idEvento . '/' . $row['file_name'];
    }
}

echo json_encode($fotos);
$conn->close();
?>