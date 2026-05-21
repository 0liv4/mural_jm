<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // --- TAREA: Impedir subir fotos si no hay evento activo ---
    try {
        $sqlEvento = "SELECT id FROM events WHERE active = 1 LIMIT 1";
        $stmtEvento = $conn->prepare($sqlEvento);
        $stmtEvento->execute();
        $eventoActivo = $stmtEvento->fetch(PDO::FETCH_ASSOC);

        // Controlamos si viene vacío
        if ($eventoActivo === false || !isset($eventoActivo['id'])) {
            echo json_encode([
                'success' => false, 
                'error' => 'No se pueden subir fotos: No hay ningún evento activo en este momento.'
            ]);
            exit;
        }

        $realEventId = $eventoActivo['id'];

    } catch (Exception $e) {
        echo json_encode([
            'success' => false, 
            'error' => 'Error al verificar el estado del evento: ' . $e->getMessage()
        ]);
        exit;
    }

    // Recogemos la imagen que viene del JavaScript (FormData)
    $data = $_POST['imagen'] ?? '';
    if (empty($data)) {
        echo json_encode(['success' => false, 'error' => 'No se han recibido datos de la imagen.']);
        exit;
    }

    // --- TAREA: Validar que solo se suben imágenes JPG, PNG o WEBP ---
    $formatoValido = false;
    $extension = '';

    if (strpos($data, 'data:image/webp;base64,') === 0) {
        $data = str_replace('data:image/webp;base64,', '', $data);
        $extension = 'webp';
        $formatoValido = true;
    } elseif (strpos($data, 'data:image/jpeg;base64,') === 0) {
        $data = str_replace('data:image/jpeg;base64,', '', $data);
        $extension = 'jpg';
        $formatoValido = true;
    } elseif (strpos($data, 'data:image/png;base64,') === 0) {
        $data = str_replace('data:image/png;base64,', '', $data);
        $extension = 'png';
        $formatoValido = true;
    }

    if (!$formatoValido) {
        echo json_encode(['success' => false, 'error' => 'Formato no permitido. Solo se aceptan JPG, PNG o WEBP.']);
        exit;
    }

    // Decodificamos el string Base64
    $data = str_replace(' ', '+', $data);
    $datosImagen = base64_decode($data);

    // --- TAREA: Renombrar archivos subidos automáticamente ---
    $nombreArchivo = 'foto_' . time() . '_' . substr(md5(uniqid()), 0, 6) . '.' . $extension;

    // --- TAREA: Guardar cada foto en la carpeta del evento activo ---
    $rutaDestino = '../uploads/event_' . $realEventId . '/' . $nombreArchivo;

    // Intentamos guardar el archivo físico
    if (file_put_contents($rutaDestino, $datosImagen)) {
        try {
            // --- TAREA: Guardar estado de la foto (pending) ---
            $estadoInicial = 'pending'; 

            $sql = "INSERT INTO photos (event_id, file_name, active, status) 
                    VALUES (?, ?, 1, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$realEventId, $nombreArchivo, $estadoInicial]);
            
            echo json_encode(['success' => true, 'file' => $nombreArchivo]);
        } catch (Exception $e) {
            if (file_exists($rutaDestino)) {
                unlink($rutaDestino);
            }
            echo json_encode(['success' => false, 'error' => 'Error al registrar en BD: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'No se pudo guardar el archivo físico. Comprueba los permisos de la carpeta uploads.']);
    }
}
?>