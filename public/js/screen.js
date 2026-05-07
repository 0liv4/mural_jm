const canvas = document.getElementById('muralCanvas');
const ctx = canvas.getContext('2d');
const mensaje = document.getElementById('mensaje');

function actualizarMural() {
    // 1. Llamar a nuestro servidor PHP usando fetch [cite: 11]
    fetch('../api/get-photos.php')
        .then(respuesta => respuesta.json()) 
        .then(listaDeFotos => {
            if (listaDeFotos.length > 0) {
                const indiceAleatorio = Math.floor(Math.random() * listaDeFotos.length);
                const fotoElegida = listaDeFotos[indiceAleatorio];

                const img = new Image();
                // Buscamos la foto en la carpeta uploads [cite: 43]
                img.src = '../uploads/event_1/' + fotoElegida;
                
                img.onload = () => {
                    mensaje.style.display = 'none'; 
                    canvas.style.display = 'block'; 
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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
setInterval(actualizarMural, 5000); // Polling cada 5 segundos [cite: 89]