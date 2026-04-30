<?php
$host = "localhost";
$db_name = "mural_jm"; 
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
   
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "¡Conexión a la base de datos exitosa"; 
} catch(PDOException $exception) {
    echo "Error de conexión: " . $exception->getMessage();
}
?>