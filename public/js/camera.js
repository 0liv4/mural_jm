const video = document.getElementById('videoCamara');
const btnCapturar = document.getElementById('btnCapturar');
const canvas = document.getElementById('lienzoFoto');
const ctx = canvas.getContext('2d');

// 1. Encender la cámara
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
    alert("No se ha podido acceder a la cámara. Comprueba los permisos.");
});


btnCapturar.addEventListener('click', function() {
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    

    const datosImagen = canvas.toDataURL('image/webp', 0.8);

 
    const formData = new FormData();
    formData.append('imagen', datosImagen);
    formData.append('event_id', 1); 

  
    fetch('../api/upload-photo.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            alert("¡Foto enviada al mural!");
            
        } else {
            alert("Error al subir: " + data.error);
        }
    })
    .catch(err => {
        console.error("Error en la subida:", err);
        alert("Error de conexión con el servidor.");
    });

    console.log("¡Foto capturada!", datosImagen);
    
   
    canvas.style.display = "block"; 
    canvas.style.width = "100%";
    canvas.style.maxWidth = "400px";
    canvas.style.border = "2px solid red";
});