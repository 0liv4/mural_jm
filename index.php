<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Mural JM</title>
</head>
<body style="font-family: sans-serif; text-align: center; padding-top: 50px;">

    <h1>Proyecto Mural JM</h1>
    <hr>

    <?php
    
    require_once 'config/db.php'; 

    try {
        
        $sql = "SELECT nombre FROM usuarios LIMIT 1";
        $stmt = $conn->query($sql);
        
       
        $fila = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($fila) {
            echo "<h2 style='color: #155724;'>¡Lectura de datos exitoss!</h2>";
            echo "<p style='font-size: 1.5em;'>Usuario encontrado: <strong>" . $fila['nombre'] . "</strong></p>";
        } else {
            echo "<h2 style='color: orange;'>Conectado, pero la tabla usuarios está vacía.</h2>";
        }

    } catch (Exception $e) {
        echo "<h2 style='color: red;'>Error al consultar la base de datos: " . $e->getMessage() . "</h2>";
    }
    ?>
    

</body>
</html>