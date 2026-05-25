const canvas = document.getElementById('muralCanvas');
const ctx = canvas.getContext('2d');
const mensaje = document.getElementById('mensaje');
const marquesina = document.querySelector('.marquesina');

const qrContenedor = document.getElementById('qrContenedor');
const qrImagen = document.getElementById('qrImagen');

let nombreEventoActual = "Cargando evento...";

// variables para el efecto collage
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

function actualizarMural() {
    fetch('../api/get-photos.php?nocache=' + Date.now())
        .then(respuesta => respuesta.json()) 
        .then(listaDeFotos => {
            if (listaDeFotos.length > 0) {
                const indiceAleatorio = Math.floor(Math.random() * listaDeFotos.length);
                const fotoElegida = listaDeFotos[indiceAleatorio];

                const nuevaImg = new Image();
                nuevaImg.src = '../uploads/' + fotoElegida;
                
                nuevaImg.onload = () => {
                    // preparamos la nueva foto con sus animaciones aleatorias
                    const nuevaFoto = {
                        img: nuevaImg,
                        alpha: 0,
                        escala: 0.85 + (Math.random() * 0.1), 
                        posX: -40 - (Math.random() * 100),    
                        posY: (Math.random() - 0.5) * 150,    
                        rotacion: (Math.random() - 0.5) * 0.4
                    };

                    fotosCollage.push(nuevaFoto);

                    // si nos pasamos del limite, borramos la mas vieja
                    if (fotosCollage.length > MAX_FOTOS) {
                        fotosCollage.shift(); 
                    }
                    
                    mensaje.style.display = 'none'; 
                    canvas.style.display = 'block'; 
                };
            }
        });
}

function animar() {
    // limpiamos el canvas en cada frame para dejar ver el video de fondo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // pintamos todas las fotos del collage
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

        // sombra suave
        ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
        ctx.shadowBlur = 40;
        ctx.shadowOffsetX = 20;
        ctx.shadowOffsetY = 20;

        // marco tipo polaroid
        const margen = 15;
        const margenAbajo = 75;
        ctx.fillStyle = "white";
        ctx.fillRect(-drawWidth / 2 - margen, -drawHeight / 2 - margen, drawWidth + (margen * 2), drawHeight + margen + margenAbajo);

        ctx.shadowColor = "transparent";
        ctx.drawImage(foto.img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        
        // marca de agua en el marco
        ctx.fillStyle = "#333333"; 
        ctx.font = "bold 35px 'Arial', sans-serif"; 
        ctx.textAlign = "center";
        ctx.fillText(nombreEventoActual.toUpperCase(), 0, (drawHeight / 2) + 45);

        ctx.restore();
    });

    requestAnimationFrame(animar);
}

// gestion del codigo qr
function gestionarQR() {
    const urlCamara = window.location.origin + "/mural_jm/public/camera.html";
    qrImagen.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(urlCamara);

    qrContenedor.style.display = "block";
    qrContenedor.style.animation = "fade-in 1s forwards"; 

    // lo escondemos a los 12 segundos
    setTimeout(() => {
        qrContenedor.style.display = "none";
    }, 12000);
}

// llamadas principales
cargarInfoEvento(); 
setInterval(cargarInfoEvento, 10000); 

actualizarMural();
setInterval(actualizarMural, 5000); 

setTimeout(gestionarQR, 5000);
setInterval(gestionarQR, 45000);

animar();