const video = document.getElementById('videoCamara');
const btnCapturar = document.getElementById('btnCapturar');
const canvas = document.getElementById('lienzoFoto');
const ctx = canvas.getContext('2d');


navigator.mediaDevices.getUserMedia({ 
    video: { 
        facingMode: "environment",
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


btnCapturar.addEventListener('click', function() {
    
    
    let anchoOriginal = video.videoWidth;
    let altoOriginal = video.videoHeight;

    const MAX_ANCHO = 1500;
    const MAX_ALTO = 800;

    let anchoFinal = anchoOriginal;
    let altoFinal = altoOriginal;

  
    let ratiodeAncho = MAX_ANCHO / anchoOriginal;
    let ratiodeAlto = MAX_ALTO / altoOriginal;
    
    
    let ratioEscala = Math.min(ratiodeAncho, ratiodeAlto);

    if (ratioEscala < 1) {
        anchoFinal = anchoOriginal * ratioEscala;
        altoFinal = altoOriginal * ratioEscala;
    }

    
    canvas.width = anchoFinal;
    canvas.height = altoFinal;
    
   
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    
    const datosImagen = canvas.toDataURL('image/webp', 0.8);
    console.log("¡Foto capturada y escalada a " + anchoFinal + "x" + altoFinal + "px!");
    
    
    canvas.style.display = "block"; 
    canvas.style.width = "100%";
    canvas.style.maxWidth = "400px";
    canvas.style.border = "2px solid red";

    
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