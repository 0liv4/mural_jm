// Referencias a las pantallas
const pantallaAviso = document.getElementById('pantallaAviso');
const pantallaCamara = document.getElementById('pantallaCamara');
const pantallaError = document.getElementById('pantallaError');
const pantallaPrevia = document.getElementById('pantallaPrevia');
const pantallaExito = document.getElementById('pantallaExito');

// Referencias a los elementos
const btnAceptarAviso = document.getElementById('btnAceptarAviso');
const video = document.getElementById('videoCamara');
const btnCapturar = document.getElementById('btnCapturar');
const canvas = document.getElementById('lienzoFoto');
const ctx = canvas.getContext('2d');

const btnRepetir = document.getElementById('btnRepetir');
const btnEnviar = document.getElementById('btnEnviar');
const btnVolverCamara = document.getElementById('btnVolverCamara');

// Variable para guardar la foto temporalmente
let fotoListaParaEnviar = null;

// 1. Aceptar permisos y encender cámara
btnAceptarAviso.addEventListener('click', function() {
    pantallaAviso.classList.remove('activa');
    
    navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } 
    })
    .then(function(stream) {
        pantallaCamara.classList.add('activa');
        video.srcObject = stream;
        video.setAttribute('playsinline', true); 
        video.setAttribute('muted', true); 
        video.muted = true; 
        video.play(); 
    })
    .catch(function(error) {
        console.error("Error con la cámara: ", error);
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            pantallaError.classList.add('activa');
        } else {
            alert("Error técnico al intentar acceder a la cámara.");
            pantallaAviso.classList.add('activa'); 
        }
    });
});

// 2. Hacer la foto y mostrar previsualización
btnCapturar.addEventListener('click', function() {
    let anchoOriginal = video.videoWidth;
    let altoOriginal = video.videoHeight;
    const MAX_ANCHO = 1500;
    const MAX_ALTO = 800;

    let anchoFinal = anchoOriginal;
    let altoFinal = altoOriginal;
    let ratioEscala = Math.min(MAX_ANCHO / anchoOriginal, MAX_ALTO / altoOriginal);

    if (ratioEscala < 1) {
        anchoFinal = anchoOriginal * ratioEscala;
        altoFinal = altoOriginal * ratioEscala;
    }

    canvas.width = anchoFinal;
    canvas.height = altoFinal;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Guardamos la imagen en la variable global para usarla luego
    fotoListaParaEnviar = canvas.toDataURL('image/webp', 0.8);
    
    // Cambiamos a la pantalla de previsualización
    pantallaCamara.classList.remove('activa');
    pantallaPrevia.classList.add('activa');
});

// 3. Botón Repetir: Vuelve a la cámara
btnRepetir.addEventListener('click', function() {
    fotoListaParaEnviar = null; // Limpiamos la foto descartada
    pantallaPrevia.classList.remove('activa');
    pantallaCamara.classList.add('activa');
});

// 4. Botón Enviar: Manda la foto al servidor de Marco
btnEnviar.addEventListener('click', function() {
    
    // Ponemos el botón en "estado de carga" visualmente
    btnEnviar.disabled = true;
    btnEnviar.innerText = "Enviando...";

    const formData = new FormData();
    formData.append('imagen', fotoListaParaEnviar);

    fetch('../api/upload-photo.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        btnEnviar.disabled = false;
        btnEnviar.innerText = "Enviar foto";

        if(data.success) {
            // Si va bien, mostramos la pantalla de éxito
            pantallaPrevia.classList.remove('activa');
            pantallaExito.classList.add('activa');
        } else {
            alert("Error del servidor: " + data.error);
        }
    })
    .catch(err => {
        btnEnviar.disabled = false;
        btnEnviar.innerText = "Enviar foto";
        console.error("Error en la subida:", err);
        alert("Fallo de conexión al intentar enviar la foto.");
    });
});

// 5. Botón Volver (Hacer otra foto tras el éxito)
btnVolverCamara.addEventListener('click', function() {
    pantallaExito.classList.remove('activa');
    pantallaCamara.classList.add('activa');
});