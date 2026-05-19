const contenedorGaleria = document.getElementById('galeriaPendientes');

// cargar las fotos pendientes
function cargarPendientes() {
    fetch('../api/get-pending.php')
        .then(respuesta => respuesta.json())
        .then(fotos => {
            contenedorGaleria.innerHTML = ''; // Limpiamos la pantalla
            
            if (fotos.length === 0) {
                contenedorGaleria.innerHTML = '<p>No hay fotos pendientes de moderar.</p>';
                return;
            }

            // Dibujamos una tarjeta por cada foto
            fotos.forEach(foto => {
                const tarjeta = document.createElement('div');
                tarjeta.className = 'tarjeta';
                
                
                const rutaImagen = `../uploads/event_${foto.event_id}/${foto.file_name}`;

                tarjeta.innerHTML = `
                    <img src="${rutaImagen}" alt="Foto pendiente">
                    <button class="btn-aprobar" onclick="moderarFoto(${foto.id}, 'approved')">✔️ Aprobar</button>
                    <button class="btn-rechazar" onclick="moderarFoto(${foto.id}, 'rejected')">❌ Rechazar</button>
                `;
                contenedorGaleria.appendChild(tarjeta);
            });
        });
}

// 2. Funcion que se ejecuta al darle a un boton
function moderarFoto(idFoto, accion) {
    fetch('../api/moderate.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idFoto, accion: accion })
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        if (datos.exito) {
            // recargar la lista para que desaparezca la foto
            cargarPendientes();
        } else {
            alert("Error al moderar: " + datos.error);
        }
    });
}

cargarPendientes();

// --- LÓGICA DE EVENTOS ---
const formNuevoEvento = document.getElementById('formNuevoEvento');

formNuevoEvento.addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    const nombre = document.getElementById('nombreEvento').value;

    fetch('../api/create-event.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre })
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        if (datos.exito) {
            alert(datos.mensaje);
            document.getElementById('nombreEvento').value = ''; // Limpiamos el cajón
        } else {
            alert("Error: " + datos.error);
        }
    });
});
const listaEventos = document.getElementById('listaEventos');

// Función para pintar la lista de eventos
function cargarEventos() {
    fetch('../api/get-events.php')
        .then(res => res.json())
        .then(eventos => {
            listaEventos.innerHTML = ''; // Limpiamos la lista
            
            eventos.forEach(ev => {
                const li = document.createElement('li');
                li.style.background = "white";
                li.style.margin = "5px 0";
                li.style.padding = "10px";
                li.style.borderRadius = "4px";
                
                // Si el evento es el activo, lo pintamos de verde
                const textoEstado = ev.active == 1 ? '<span style="color: green; font-weight: bold;">🟢 EN DIRECTO</span>' : '🔴 Inactivo';
                const botonActivar = ev.active == 0 ? `<button onclick="activarEvento(${ev.id})" style="margin-left: 15px; cursor: pointer;">Activar</button>` : '';

                li.innerHTML = `<strong>${ev.name}</strong> - ${textoEstado} ${botonActivar}`;
                listaEventos.appendChild(li);
            });
        });
}

// Función para cambiar de evento
function activarEvento(id) {
    fetch('../api/toggle-event.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
    })
    .then(res => res.json())
    .then(datos => {
        if(datos.exito) {
            cargarEventos(); 
        }
    });
}


cargarEventos();