<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require_once '../config/db.php';

// verificar qué evento está activo
try {
    $sqlEvento = "SELECT id FROM events WHERE active = 1 LIMIT 1";
    $stmtEvento = $conn->prepare($sqlEvento);
    $stmtEvento->execute();
    $eventoActivo = $stmtEvento->fetch(PDO::FETCH_ASSOC);

    if (!$eventoActivo) {
        echo json_encode([]); // wi no hay evento activo, devolvemos array vacío
        exit;
    }

    $realEventId = $eventoActivo['id'];

} catch (Exception $e) {
    echo json_encode(['error' => 'Error al buscar evento activo: ' . $e->getMessage()]);
    exit;
}

// recorrer las fotos aprobadas 
try {
    // Miramos s nos está pasando el ID de la última foto que ya tiene hecha
    $lastId = isset($_GET['last_id']) ? (int)$_GET['last_id'] : 0;

    if ($lastId > 0) {
        
        // cogemos solo las fotos aprobadas del evento actual cuyo ID sea mayor que el último que ya vemos
        $sqlPhotos = "SELECT id, file_name FROM photos 
                      WHERE event_id = ? AND status = 'approved' AND id > ? 
                      ORDER BY id ASC";
        $stmtPhotos = $conn->prepare($sqlPhotos);
        $stmtPhotos->execute([$realEventId, $lastId]);
    } else {
        
        // si el mural se acaba de abrir por primera vez, se trae todas las aprobadas de una
        $sqlPhotos = "SELECT id, file_name FROM photos 
                      WHERE event_id = ? AND status = 'approved' 
                      ORDER BY id ASC";
        $stmtPhotos = $conn->prepare($sqlPhotos);
        $stmtPhotos->execute([$realEventId]);
    }

    $photos = $stmtPhotos->fetchAll(PDO::FETCH_ASSOC);

    // devolvemos el resultado al JavaScript en JSON bien limpio
    echo json_encode($photos);

} catch (Exception $e) {
    echo json_encode(['error' => 'Error al consultar las fotos: ' . $e->getMessage()]);
}
?>