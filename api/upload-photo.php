<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = $_POST['imagen'];
    $eventId = $_POST['event_id'];

    $img = str_replace('data:image/webp;base64,', '', $data);
    $img = str_replace(' ', '+', $img);
    $datosImagen = base64_decode($img);

   
    $nombreArchivo = 'foto_' . time() . '.webp';
    $rutaDestino = '../uploads/event_1/' . $nombreArchivo;

    
    if (file_put_contents($rutaDestino, $datosImagen)) {
        try {
            $sql = "INSERT INTO photos (event_id, file_name, active, status) 
                    VALUES (?, ?, 1, 'approved')";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$eventId, $nombreArchivo]);
            
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'No se pudo guardar el archivo']);
    }
}
?>