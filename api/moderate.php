<?php
header('Content-Type: application/json');

$conn = new mysqli('localhost', 'root', '', 'mural_jm');

// Leemos el javaScript
$datos = json_decode(file_get_contents("php://input"), true);
$idFoto = $datos['id'];
$accion = $datos['accion']; 


$sql = "UPDATE photos SET status = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $accion, $idFoto);

if ($stmt->execute()) {
    echo json_encode(["exito" => true]);
} else {
    echo json_encode(["exito" => false, "error" => "Error al actualizar la base de datos"]);
}

$conn->close();
?>