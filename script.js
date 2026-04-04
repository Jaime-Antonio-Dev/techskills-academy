async function cargarDatos() {
    try {
        const respuesta = await fetch('./data/cursos.json');
        const cursos = await respuesta.json();
        
        // --- LÓGICA PARA CATÁLOGO ---
        const contenedorCursos = document.getElementById('contenedor-cursos');
        if (contenedorCursos) {
            renderizar(cursos, contenedorCursos);
        }

        // --- LÓGICA PARA FAVORITOS 
        const contenedorFavs = document.getElementById('contenedor-favoritos');
        if (contenedorFavs) {
            const IDsFavoritos = JSON.parse(localStorage.getItem('misFavoritos')) || [];
            // Filtramos el JSON para quedarnos solo con los que el usuario guardó
            const misCursosFavs = cursos.filter(c => IDsFavoritos.includes(c.id));
            
            if (misCursosFavs.length === 0) {
                contenedorFavs.innerHTML = '<p class="text-center col-span-3 text-gray-500 py-10">Aún no tienes cursos guardados. ⭐</p>';
            } else {
                renderizar(misCursosFavs, contenedorFavs);
            }
        }
    } catch (e) {
        console.error("Error cargando el JSON:", e);
    }
}

// Función para crear las tarjetas en pantalla
function renderizar(lista, contenedor) {
    contenedor.innerHTML = '';
    lista.forEach(curso => {
        const div = document.createElement('div');
        div.className = 'bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-4';
        div.innerHTML = `
            <img src="${curso.imagen}" class="w-full h-40 object-cover rounded-lg mb-4">
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-bold text-lg">${curso.titulo}</h4>
                <button onclick="toggleFavorito(${curso.id})" class="text-xl">⭐</button>
            </div>
            <p class="text-gray-600 text-sm mb-4">${curso.descripcion}</p>
            <button class="w-full bg-purple-600 text-white py-2 rounded-lg font-bold shadow-purple-200 shadow-lg">Ver detalles</button>
        `;
        contenedor.appendChild(div);
    });
}

// Función para guardar/quitar de favoritos
function toggleFavorito(id) {
    let favs = JSON.parse(localStorage.getItem('misFavoritos')) || [];
    if (favs.includes(id)) {
        favs = favs.filter(favId => favId !== id);
        alert("Eliminado de favoritos");
    } else {
        favs.push(id);
        alert("¡Guardado en favoritos! ⭐");
    }
    localStorage.setItem('misFavoritos', JSON.stringify(favs));
    
    // Si estamos en la página de favoritos, recargamos para que desaparezca el que quitamos
    if (document.getElementById('contenedor-favoritos')) {
        location.reload();
    }
}

document.addEventListener('DOMContentLoaded', cargarDatos);
