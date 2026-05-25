


const contenedorFondo = document.getElementById('fondoEscenario');

// Alternar imágenes y vídeos en la playlist
//  Permitir duración por imagen de fondo 
const playlistFondo = [
    { tipo: 'imagen', src: '../uploads/fondos/bg-mural-1.jpg', duracion: 10000 }, // Dura 10 segundos
    { tipo: 'video', src: '../uploads/fondos/bg-animado.mp4' },                   // El vídeo marca su propia duración
    { tipo: 'imagen', src: '../uploads/fondos/bg-mural-2.jpg', duracion: 8000 }   // Dura 8 segundos
];

let indiceFondoActual = 0;
let timerFondo = null;


function reproducirSiguienteFondo() {
    // 1. Limpiamos lo que hubiera antes (para no acumular etiquetas en memoria)
    contenedorFondo.innerHTML = '';
    
    const mediaActual = playlistFondo[indiceFondoActual];

    if (mediaActual.tipo === 'imagen') {
        const img = document.createElement('img');
        img.src = mediaActual.src;
        aplicarEstilosFondo(img);
        
        contenedorFondo.appendChild(img);
        
        // Cambiar fondo cada X segundos
        timerFondo = setTimeout(() => {
            avanzarPlaylist();
        }, mediaActual.duracion);

    } else if (mediaActual.tipo === 'video') {
        const video = document.createElement('video');
        video.src = mediaActual.src;
        video.autoplay = true;
        
        // El mute es OBLIGATORIO en Chrome/Safari para que funcione el autoplay sin que el usuario haga clic
        video.muted = true; 
        video.playsInline = true;
        aplicarEstilosFondo(video);

        // Reproducir vídeo de fondo en bucle dentro de la playlist
        
        video.onended = () => {
            avanzarPlaylist();
        };

        contenedorFondo.appendChild(video);
    }
}

// Función auxiliar para que tanto el vídeo como la imagen ocupen toda la pantalla por detrás
function aplicarEstilosFondo(elemento) {
    elemento.style.width = '100vw';
    elemento.style.height = '100vh';
    elemento.style.objectFit = 'cover'; // Asegura que no se deforme 
    elemento.style.position = 'fixed';
    elemento.style.top = '0';
    elemento.style.left = '0';
    // Z-Index negativo 
    elemento.style.zIndex = '-1'; 
}

function avanzarPlaylist() {
    clearTimeout(timerFondo);
    indiceFondoActual++;
    
    // Si llegamos al final de la playlist, volvemos a empezar
    if (indiceFondoActual >= playlistFondo.length) {
        indiceFondoActual = 0;
    }
    reproducirSiguienteFondo();
}


document.addEventListener('DOMContentLoaded', () => {
    reproducirSiguienteFondo();
});