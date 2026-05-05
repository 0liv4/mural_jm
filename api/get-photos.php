<?php

header('Content-Type: application/json');


$host = 'localhost';
$user = 'root';     
$pass = '';         
$db   = 'mural_jm'; 

// 2. Establecer la conexión
$conn = new mysqli($host, $user, $pass, $db);

// Comprobar si hay error
if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión: " . $conn->connect_error]));
}


$sql = "SELECT file_name FROM photos WHERE event_id = 1 AND status = 'approved'";
$result = $conn->query($sql);

$fotos = []; 


if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $fotos[] = $row['file_name'];
    }
}


echo json_encode($fotos);


$conn->close();
?>