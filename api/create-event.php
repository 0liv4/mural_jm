<?php
header('Content-Type: application/json');

$conn = new mysqli('localhost', 'root', '', 'mural_jm');

if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión BD"]));
}

$datos = json_decode(file_get_contents("php://input"), true);
$nombre = $datos['nombre'];

// 1. Insertamos el evento (por defecto entra desactivado: active = 0)
$sql = "INSERT INTO events (name, active) VALUES (?, 0)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $nombre);

if ($stmt->execute()) {
   
    $nuevoId = $conn->insert_id;
    
    // 2. Creamos la carpeta automáticamente
    $rutaCarpeta = '../uploads/event_' . $nuevoId;
    if (!file_exists($rutaCarpeta)) {
        mkdir($rutaCarpeta, 0777, true);
    }
    
    echo json_encode(["exito" => true, "mensaje" => "Evento '$nombre' y carpeta 'event_$nuevoId' creados."]);
} else {
    echo json_encode(["exito" => false, "error" => "No se pudo crear el evento"]);
}

$conn->close();
?>