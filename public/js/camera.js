const video = document.getElementById('videoCamara');
const btnCapturar = document.getElementById('btnCapturar');
const canvas = document.getElementById('lienzoFoto');
const ctx = canvas.getContext('2d');

// 1. Encender la cámara (Con la configuración avanzada de Marco)
navigator.mediaDevices.getUserMedia({ 
    video: { 
        facingMode: "environment", // Intenta usar la trasera por defecto
        width: { ideal: 1280 },
        height: { ideal: 720 }
    } 
})
.then(function(stream) {
    video.srcObject = stream;
    video.setAttribute('playsinline', true); 
    video.setAttribute('muted', true); 
    video.muted = true; 
    video.play(); 
})
.catch(function(error) {
    console.error("Error con la cámara: ", error);
    alert("No se ha podido acceder a la cámara. Comprueba los permisos en la barra de direcciones.");
});

// 2. Hacer la foto al hacer clic (Con redimensionamiento integrado)
btnCapturar.addEventListener('click', function() {
    
    // Obtenemos el tamaño real del stream de vídeo del móvil
    let anchoOriginal = video.videoWidth;
    let altoOriginal = video.videoHeight;

    const MAX_ANCHO = 1500;
    const MAX_ALTO = 800;

    let anchoFinal = anchoOriginal;
    let altoFinal = altoOriginal;

    // Calculamos la proporción 
    let ratiodeAncho = MAX_ANCHO / anchoOriginal;
    let ratiodeAlto = MAX_ALTO / altoOriginal;
    
    // Para no pasar del límite
    let ratioEscala = Math.min(ratiodeAncho, ratiodeAlto);

    if (ratioEscala < 1) {
        anchoFinal = anchoOriginal * ratioEscala;
        altoFinal = altoOriginal * ratioEscala;
    }

    // Ajustamos el lienzo al tamaño máximo permitido y redimensionado
    canvas.width = anchoFinal;
    canvas.height = altoFinal;
    
    // Dibujamos el fotograma 
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convertir la foto a formato WebP 
    const datosImagen = canvas.toDataURL('image/webp', 0.8);
    console.log("¡Foto capturada y escalada a " + anchoFinal + "x" + altoFinal + "px!");
    
    // Mostramos la foto en pantalla para que el usuario la vea
    canvas.style.display = "block"; 
    canvas.style.width = "100%";
    canvas.style.maxWidth = "400px";
    canvas.style.border = "2px solid red";

    // 3. Enviamos la foto al archivo PHP usando JSON (Compatible con nuestro backend)
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