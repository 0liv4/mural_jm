<?php
header('Content-Type: application/json');

// Conexión PDO (la tuya segura)
$host = 'localhost';
$dbname = 'mural_jm';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["error" => "Error de conexión a la base de datos"]));
}

// 1. Buscamos el evento activo (Vital del archivo viejo)
$stmtEvento = $pdo->query("SELECT id FROM events WHERE active = 1 LIMIT 1");
$evento = $stmtEvento->fetch(PDO::FETCH_ASSOC);

if (!$evento) {
    echo json_encode([]); // Si no hay evento, devolvemos array vacío
    exit;
}

$idEvento = $evento['id'];

// 2. Cogemos el last_id que nos manda tu JS para no repetir datos (Tu optimización)
$last_id = isset($_GET['last_id']) ? (int)$_GET['last_id'] : 0;

// 3. Buscamos SOLO las fotos nuevas de ESE evento en concreto
$sql = "SELECT id, file_name FROM photos 
        WHERE event_id = :event_id 
        AND status = 'approved' 
        AND id > :last_id 
        ORDER BY id ASC";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':event_id' => $idEvento,
    ':last_id' => $last_id
]);

$fotos = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 4. Formateamos la ruta para que Javi encuentre la carpeta (Vital del archivo viejo)
$resultado = [];
foreach ($fotos as $foto) {
    $resultado[] = [
        'id' => $foto['id'],
        // Le añadimos la carpeta event_X/ al nombre
        'ruta' => 'event_' . $idEvento . '/' . $foto['file_name'] 
    ];
}

echo json_encode($resultado);
?>