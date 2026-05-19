const video = document.getElementById('videoCamara');
const btnCapturar = document.getElementById('btnCapturar');
const canvas = document.getElementById('lienzoFoto');
const ctx = canvas.getContext('2d');

// Encender la camara
navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        video.srcObject = stream;
    })
    .catch(function(error) {
        console.error("Error con la cámara: ", error);
        alert("No se pudo acceder a la cámara. Comprueba los permisos arriba en la barra de direcciones.");
    });

// Hacer la foto al hacer clic
btnCapturar.addEventListener('click', function() {
    // Ajustamos el lienzo al tamaño exacto del vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Dibujamos el fotograma 
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convertir la foto a formato WebP 
    const datosImagen = canvas.toDataURL('image/webp', 0.8);
    
    // Mostramos la foto en pantalla 
    canvas.style.display = "block"; 
    canvas.style.width = "100%";
    canvas.style.maxWidth = "400px";
    canvas.style.border = "2px solid red";

    //Enviamos la foto al archivo PHP 
    fetch('../api/upload-photo.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        
        body: JSON.stringify({ imagen: datosImagen })
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        if(datos.exito) {
            alert("¡Foto enviada! Está en estado 'pending' esperando revisión.");
        } else {
            alert("Error del servidor: " + datos.error);
        }
    })
    .catch(error => {
        console.error("Error al enviar la foto:", error);
        alert("Fallo de conexión al intentar enviar la foto.");
    });
});