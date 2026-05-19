<?php
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root', '', 'mural_jm');

$datos = json_decode(file_get_contents("php://input"), true);
$id = $datos['id'];

//  Apagamos TODOS los eventos (Desactivar evento)
$conn->query("UPDATE events SET active = 0");

//  Encendemos SOLO el que se haya elegido (Activar evento)
$stmt = $conn->prepare("UPDATE events SET active = 1 WHERE id = ?");
$stmt->bind_param("i", $id);

if($stmt->execute()) {
    echo json_encode(["exito" => true]);
} else {
    echo json_encode(["exito" => false, "error" => "Error al cambiar evento"]);
}
$conn->close();
?>