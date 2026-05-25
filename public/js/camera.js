const canvas = document.getElementById('muralCanvas');
const ctx = canvas.getContext('2d');
const mensaje = document.getElementById('mensaje');
const marquesina = document.querySelector('.marquesina');

<<<<<<< HEAD
<<<<<<< HEAD

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
    
    
=======
const btnRepetir = document.getElementById('btnRepetir');
const btnEnviar = document.getElementById('btnEnviar');
const btnVolverCamara = document.getElementById('btnVolverCamara');
=======
const qrContenedor = document.getElementById('qrContenedor');
const qrImagen = document.getElementById('qrImagen');
>>>>>>> 3b7b21e85c35cb387f349f2c50f457c9d99deb8b

let nombreEventoActual = "Cargando evento...";
let fotosCollage = []; 
const MAX_FOTOS = 4;   

function cargarInfoEvento() {
    fetch('../api/get-current-event.php?nocache=' + Date.now())
        .then(res => res.json())
        .then(datos => {
            if(datos.exito) {
                nombreEventoActual = datos.nombre;
                marquesina.innerText = `¡Bienvenidos a ${nombreEventoActual}! Envíad vuestras fotos al escenario...`;
            } else {
                marquesina.innerText = "Esperando a que comience el evento...";
            }
        })
        .catch(error => console.error("Error al buscar el nombre del evento:", error));
}

<<<<<<< HEAD
// 2. Hacer la foto y mostrar previsualización
btnCapturar.addEventListener('click', function() {
>>>>>>> b918b8bf2bf959aeb3640094e4029a7d69f3ad12
    let anchoOriginal = video.videoWidth;
    let altoOriginal = video.videoHeight;
    const MAX_ANCHO = 1500;
    const MAX_ALTO = 800;

    let anchoFinal = anchoOriginal;
    let altoFinal = altoOriginal;
<<<<<<< HEAD

  
    let ratiodeAncho = MAX_ANCHO / anchoOriginal;
    let ratiodeAlto = MAX_ALTO / altoOriginal;
    
    
    let ratioEscala = Math.min(ratiodeAncho, ratiodeAlto);
=======
    let ratioEscala = Math.min(MAX_ANCHO / anchoOriginal, MAX_ALTO / altoOriginal);
>>>>>>> b918b8bf2bf959aeb3640094e4029a7d69f3ad12

    if (ratioEscala < 1) {
        anchoFinal = anchoOriginal * ratioEscala;
        altoFinal = altoOriginal * ratioEscala;
    }

<<<<<<< HEAD
    
    canvas.width = anchoFinal;
    canvas.height = altoFinal;
    
   
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    
    const datosImagen = canvas.toDataURL('image/webp', 0.8);
    console.log("¡Foto capturada y escalada a " + anchoFinal + "x" + altoFinal + "px!");
    
    
    canvas.style.display = "block"; 
    canvas.style.width = "100%";
    canvas.style.maxWidth = "400px";
    canvas.style.border = "2px solid red";

    
=======
    canvas.width = anchoFinal;
    canvas.height = altoFinal;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Guardamos la imagen en la variable global para usarla luego
    fotoListaParaEnviar = canvas.toDataURL('image/webp', 0.8);
    
    // Cambiamos a la pantalla de previsualización
    pantallaCamara.classList.remove('activa');
    pantallaPrevia.classList.add('activa');
});
=======
function actualizarMural() {
    // 🛡️ BLINDAJE: Comprobamos si tu archivo data-manager.js ha cargado bien
    if (typeof window.obtenerSiguienteFoto !== 'function') {
        console.error("🚨 ALERTA MARCO: El archivo 'data-manager.js' no está cargando. Revisa que el nombre del archivo esté bien escrito y esté en la carpeta /js/");
        return; // Detenemos la función para que no pete el resto del archivo
    }

    const fotoElegida = window.obtenerSiguienteFoto();
>>>>>>> 3b7b21e85c35cb387f349f2c50f457c9d99deb8b

    if (fotoElegida && fotoElegida.ruta) {
        const nuevaImg = new Image();
        nuevaImg.src = '../uploads/' + fotoElegida.ruta;
        
        nuevaImg.onload = () => {
            const nuevaFoto = {
                img: nuevaImg,
                alpha: 0,
                escala: 0.85 + (Math.random() * 0.1), 
                posX: -40 - (Math.random() * 100),    
                posY: (Math.random() - 0.5) * 150,    
                rotacion: (Math.random() - 0.5) * 0.4
            };

            fotosCollage.push(nuevaFoto);

            if (fotosCollage.length > MAX_FOTOS) {
                fotosCollage.shift(); 
            }
            
            mensaje.style.display = 'none'; 
            canvas.style.display = 'block'; 
        };
        
        // Si la imagen falla al cargar (ej. ruta incorrecta), avisamos
        nuevaImg.onerror = () => {
            console.error("🚨 ALERTA MARCO: No se encuentra la imagen físicamente en la ruta: ../uploads/" + fotoElegida.ruta);
        };
    }
}

<<<<<<< HEAD
>>>>>>> b918b8bf2bf959aeb3640094e4029a7d69f3ad12
    fetch('../api/upload-photo.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        btnEnviar.disabled = false;
        btnEnviar.innerText = "Enviar foto";
=======
function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
>>>>>>> 3b7b21e85c35cb387f349f2c50f457c9d99deb8b

    fotosCollage.forEach(foto => {
        if (foto.alpha < 1) foto.alpha += 0.02; 
        foto.escala += 0.0001;                  
        foto.posX += 0.15;                      

        const maxWidth = canvas.width * 0.55;   
        const maxHeight = canvas.height * 0.55;
        let ratio = Math.min(maxWidth / foto.img.width, maxHeight / foto.img.height);
        let drawWidth = foto.img.width * ratio;
        let drawHeight = foto.img.height * ratio;

        ctx.save();
        ctx.globalAlpha = foto.alpha; 
        ctx.translate((canvas.width / 2) + foto.posX, (canvas.height / 2) + foto.posY);
        ctx.rotate(foto.rotacion);
        ctx.scale(foto.escala, foto.escala); 

        ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
        ctx.shadowBlur = 40;
        ctx.shadowOffsetX = 20;
        ctx.shadowOffsetY = 20;

        const margen = 15;
        const margenAbajo = 75;
        ctx.fillStyle = "white";
        ctx.fillRect(-drawWidth / 2 - margen, -drawHeight / 2 - margen, drawWidth + (margen * 2), drawHeight + margen + margenAbajo);

        ctx.shadowColor = "transparent";
        ctx.drawImage(foto.img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        
        ctx.fillStyle = "#333333"; 
        ctx.font = "bold 35px 'Arial', sans-serif"; 
        ctx.textAlign = "center";
        ctx.fillText((nombreEventoActual || "IES BARAJAS").toUpperCase(), 0, (drawHeight / 2) + 45);

        ctx.restore();
    });

    requestAnimationFrame(animar);
}

function gestionarQR() {
    console.log("Generando QR..."); // Chivato para saber que el QR intenta salir
    const urlCamara = window.location.origin + "/mural_jm/public/camera.html";
    qrImagen.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(urlCamara);

    qrContenedor.style.display = "block";
    qrContenedor.style.animation = "fade-in 1s forwards"; 

    setTimeout(() => {
        qrContenedor.style.display = "none";
    }, 12000);
}

// ARRANQUE SEGURO
cargarInfoEvento(); 
setInterval(cargarInfoEvento, 10000); 

actualizarMural();
setInterval(actualizarMural, 5000); 

// Si el script no ha petado, el QR saldrá sí o sí
setTimeout(gestionarQR, 5000);
setInterval(gestionarQR, 45000);

animar();