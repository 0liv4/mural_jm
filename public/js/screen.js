const canvas = document.getElementById('muralCanvas');
const ctx = canvas.getContext('2d');
const mensaje = document.getElementById('mensaje');
const marquesina = document.querySelector('.marquesina');


let nombreEventoActual = "Cargando evento...";

//  Pregunta el nombre del evento activo
function cargarInfoEvento() {
    fetch('../api/get-current-event.php')
        .then(res => res.json())
        .then(datos => {
            if(datos.exito) {
                nombreEventoActual = datos.nombre;
                
                marquesina.innerText = `¡Bienvenidos a ${nombreEventoActual}! Envíad vuestras fotos al escenario...`;
            } else {
                marquesina.innerText = "Esperando a que comience el evento...";
            }
        });
}

// Pinta las fotos
function actualizarMural() {
    fetch('../api/get-photos.php')
        .then(respuesta => respuesta.json()) 
        .then(listaDeFotos => {
            if (listaDeFotos.length > 0) {
                const indiceAleatorio = Math.floor(Math.random() * listaDeFotos.length);
                const fotoElegida = listaDeFotos[indiceAleatorio];

                const img = new Image();
                
                img.src = '../uploads/' + fotoElegida;
                
                img.onload = () => {
                    mensaje.style.display = 'none'; 
                    canvas.style.display = 'block'; 
                    
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // Ponemos el nombre del evento real como marca de agua en el Canvas
                    ctx.fillStyle = "white"; 
                    ctx.font = "bold 40px Arial"; 
                    ctx.shadowColor = "black"; 
                    ctx.shadowBlur = 10;
                    ctx.fillText(nombreEventoActual.toUpperCase(), 50, 60);
                };
            } else {
                mensaje.style.display = 'block';
                canvas.style.display = 'none';
                mensaje.innerText = "Esperando las primeras fotos del evento activo...";
            }
        });
}


cargarInfoEvento(); 
setInterval(cargarInfoEvento, 10000); 

actualizarMural();
setInterval(actualizarMural, 5000);