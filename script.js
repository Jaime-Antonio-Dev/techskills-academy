// Variable global para guardar los cursos una vez cargados
let todosLosCursos = [];

async function cargarDatos() {
    try {
        const respuesta = await fetch('./data/cursos.json');
        todosLosCursos = await respuesta.json(); // Guardamos los cursos
        
        // --- LÓGICA PARA CATÁLOGO/INICIO ---
        const contenedorCursos = document.getElementById('contenedor-cursos');
        if (contenedorCursos) {
            renderizar(todosLosCursos, contenedorCursos);
        }

        // --- LÓGICA PARA FAVORITOS ---
        const contenedorFavs = document.getElementById('contenedor-favoritos');
        if (contenedorFavs) {
            const IDsFavoritos = JSON.parse(localStorage.getItem('misFavoritos')) || [];
            const misCursosFavs = todosLosCursos.filter(c => IDsFavoritos.includes(c.id));
            
            if (misCursosFavs.length === 0) {
                contenedorFavs.innerHTML = '<p class="text-center col-span-3 text-gray-500 py-10">Aún no tienes cursos guardados. ⭐</p>';
            } else {
                renderizar(misCursosFavs, contenedorFavs);
            }
        }
    } catch (e) { console.error("Error:", e); }
}

// Función para crear las tarjetas en pantalla
function renderizar(lista, contenedor) {
    contenedor.innerHTML = '';
    lista.forEach(curso => {
        const div = document.createElement('div');
        div.className = 'bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-4 hover:shadow-lg transition';
        div.innerHTML = `
            <img src="${curso.imagen}" class="w-full h-40 object-cover rounded-lg mb-4">
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-bold text-lg">${curso.titulo}</h4>
                <button onclick="toggleFavorito(${curso.id})" class="text-xl">⭐</button>
            </div>
            <p class="text-gray-600 text-sm mb-4">${curso.descripcion}</p>
            <button onclick="verDetalle(${curso.id})" class="w-full bg-purple-600 text-white py-2 rounded-lg font-bold shadow-purple-200 shadow-lg hover:bg-purple-700 transition">Ver detalles</button>
        `;
        contenedor.appendChild(div);
    });
}

// --- NUEVA LÓGICA: VER DETALLES DINÁMICOS (Modal) ---
function verDetalle(id) {
    // Buscamos el curso específico por ID
    const curso = todosLosCursos.find(c => c.id === id);
    if (!curso) return;

    // Si no tienes el modal en el HTML, lo creamos dinámicamente
    let modal = document.getElementById('modal-detalle');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-detalle';
        modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-center justify-center p-4 hidden transition-opacity duration-300';
        document.body.appendChild(modal);
    }

    // Dibujamos el contenido del modal con la reseña específica
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full relative transform scale-95 transition-transform duration-300 overflow-y-auto max-h-[90vh]">
            <button onclick="cerrarModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-900 text-2xl font-bold">✕</button>
            <div class="flex gap-6 mb-6 items-center">
                <img src="${curso.imagen}" class="w-24 h-24 object-cover rounded-xl">
                <div>
                    <span class="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold mb-2">${curso.nivel}</span>
                    <h3 class="text-3xl font-bold text-gray-950">${curso.titulo}</h3>
                    <p class="text-purple-600 font-medium">⏱ ${curso.duracion}</p>
                </div>
            </div>
            
            <h4 class="text-xl font-semibold mb-3 text-gray-900">Reseña del Curso</h4>
            <p class="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">${curso.reseña}</p>
            
            <div class="border-t border-gray-100 pt-6 flex gap-4">
                <button class="flex-grow bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition">Inscribirme ahora</button>
                <button onclick="toggleFavorito(${curso.id})" class="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">⭐ Favorito</button>
            </div>
        </div>
    `;

    // Mostramos el modal con animación
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.querySelector('div').classList.remove('scale-95');
    }, 10);
}

function cerrarModal() {
    const modal = document.getElementById('modal-detalle');
    if (modal) {
        modal.querySelector('div').classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
}

// Cierra el modal si se hace clic fuera del contenido
document.addEventListener('click', (e) => {
    const modal = document.getElementById('modal-detalle');
    if (e.target === modal) {
        cerrarModal();
    }
});

// Lógica de Favoritos (LocalStorage)
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
    
    if (document.getElementById('contenedor-favoritos')) {
        location.reload();
    }
}

document.addEventListener('DOMContentLoaded', cargarDatos);
