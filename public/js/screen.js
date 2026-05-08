const canvas = document.getElementById('muralCanvas');
const ctx = canvas.getContext('2d');
const mensaje = document.getElementById('mensaje');

function actualizarMural() {
    fetch('../api/get-photos.php')
        .then(respuesta => respuesta.json()) 
        .then(listaDeFotos => {
            if (listaDeFotos.length > 0) {
                const indiceAleatorio = Math.floor(Math.random() * listaDeFotos.length);
                const fotoElegida = listaDeFotos[indiceAleatorio];

                const img = new Image();
                img.src = '../uploads/event_1/' + fotoElegida;
                
                img.onload = () => {
                    mensaje.style.display = 'none'; 
                    canvas.style.display = 'block'; 
                    
                    // 1. Dibujamos la foto
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // 2. Añadimos el texto encima
                    ctx.fillStyle = "white"; // Color de la letra
                    ctx.font = "bold 40px Arial"; // Estilo y tamaño
                    ctx.shadowColor = "black"; // Sombra para que se lea en cualquier foto
                    ctx.shadowBlur = 10;
                    ctx.fillText("CONCIERTO 2026 - IES BARAJAS", 50, 60);
                };
            } else {
                mensaje.innerText = "Esperando las primeras fotos del público...";
            }
        })
        .catch(error => {
            console.error("Error conectando con la base de datos:", error);
        });
}

actualizarMural();
setInterval(actualizarMural, 5000);