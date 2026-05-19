<?php
header('Content-Type: application/json');


$host = 'localhost';
$user = 'root';     
$pass = '';         
$db   = 'mural_jm'; 

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión BD"]));
}


$datos = json_decode(file_get_contents("php://input"), true);
if (!isset($datos['imagen'])) {
    die(json_encode(["error" => "No se recibió ninguna imagen."]));
}


$sqlEvento = "SELECT id FROM events WHERE active = 1 LIMIT 1";
$resultadoEvento = $conn->query($sqlEvento);
if ($resultadoEvento->num_rows === 0) {
    die(json_encode(["error" => "No hay ningún evento activo en este momento."]));
}
$evento = $resultadoEvento->fetch_assoc();
$idEvento = $evento['id'];


$imagenBase64 = $datos['imagen'];
$imagenBase64 = str_replace('data:image/webp;base64,', '', $imagenBase64);
$imagenBase64 = str_replace(' ', '+', $imagenBase64);
$datosArchivo = base64_decode($imagenBase64);


$nombreArchivo = 'foto_' . uniqid() . '.webp';
    

$rutaCarpeta = '../uploads/event_' . $idEvento . '/';
$rutaFinal = $rutaCarpeta . $nombreArchivo;
    

if (!file_exists($rutaCarpeta)) {
    mkdir($rutaCarpeta, 0777, true);
}
    
file_put_contents($rutaFinal, $datosArchivo);


$sqlInsert = "INSERT INTO photos (event_id, file_name, status, active) VALUES (?, ?, 'pending', 1)";
$stmt = $conn->prepare($sqlInsert);
$stmt->bind_param("is", $idEvento, $nombreArchivo);
    
if ($stmt->execute()) {
    echo json_encode(["exito" => true]);
} else {
    echo json_encode(["error" => "Error al guardar en la base de datos."]);
}

$conn->close();
?>