// Variable global para guardar los cursos una vez cargados
let todosLosCursos = [];

async function cargarDatos() {
    try {
        // Usamos una ruta más robusta para GitHub Pages
        const respuesta = await fetch('./data/cursos.json?v=' + Date.now());
        
        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el archivo de datos.");
        }

        todosLosCursos = await respuesta.json(); 
        
        const contenedorCursos = document.getElementById('contenedor-cursos');
        const contenedorFavs = document.getElementById('contenedor-favoritos');
        
        // --- LÓGICA PARA CATÁLOGO / INICIO ---
        if (contenedorCursos) {
            // Verificamos si es el inicio buscando la sección de "Destacados" en el texto de la página
            const textoPagina = document.body.innerText.toLowerCase();
            const esInicio = textoPagina.includes('destacados');

            if (esInicio) {
                const destacados = todosLosCursos.filter(c => c.destacado === true);
                renderizar(destacados, contenedorCursos);
            } else {
                renderizar(todosLosCursos, contenedorCursos);
            }
        }

        // --- LÓGICA PARA FAVORITOS ---
        if (contenedorFavs) {
            const IDsFavoritos = JSON.parse(localStorage.getItem('misFavoritos')) || [];
            const misCursosFavs = todosLosCursos.filter(c => IDsFavoritos.includes(c.id));
            
            if (misCursosFavs.length === 0) {
                contenedorFavs.innerHTML = `
                    <div class="col-span-full text-center py-20">
                        <p class="text-gray-500 text-lg">Aún no tienes cursos guardados. ⭐</p>
                        <a href="cursos.html" class="text-purple-600 font-bold underline">Explorar catálogo</a>
                    </div>`;
            } else {
                renderizar(misCursosFavs, contenedorFavs);
            }
        }
    } catch (e) { 
        console.error("Error crítico en la carga:", e);
    }
}

function renderizar(lista, contenedor) {
    if (!contenedor) return;
    contenedor.innerHTML = '';
    
    lista.forEach(curso => {
        const div = document.createElement('div');
        div.className = 'bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-4 hover:shadow-lg transition';
        div.innerHTML = `
            <img src="${curso.imagen}" class="w-full h-40 object-cover rounded-lg mb-4" onerror="this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400'">
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-bold text-lg">${curso.titulo}</h4>
                <button onclick="toggleFavorito(${curso.id})" class="text-xl hover:scale-110 transition">⭐</button>
            </div>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">${curso.descripcion}</p>
            <button onclick="verDetalle(${curso.id})" class="w-full bg-purple-600 text-white py-2 rounded-lg font-bold shadow-md hover:bg-purple-700 transition">Ver detalles</button>
        `;
        contenedor.appendChild(div);
    });
}

function verDetalle(id) {
    const curso = todosLosCursos.find(c => c.id === id);
    if (!curso) return;

    // Blindaje contra 'undefined'
    const textoReseña = curso.reseña || curso.resena || "Estamos preparando la información detallada. ¡Vuelve pronto!";

    let modal = document.getElementById('modal-detalle');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-detalle';
        modal.className = 'fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 hidden backdrop-blur-sm';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full relative overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-300">
            <button onclick="cerrarModal()" class="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl">✕</button>
            <div class="flex flex-col md:flex-row gap-6 mb-6">
                <img src="${curso.imagen}" class="w-24 h-24 object-cover rounded-xl shadow-md">
                <div>
                    <span class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase">${curso.nivel || 'General'}</span>
                    <h3 class="text-2xl font-bold mt-2">${curso.titulo}</h3>
                    <p class="text-gray-500">Duración: ${curso.duracion}</p>
                </div>
            </div>
            <h4 class="font-bold text-lg border-b pb-2 mb-4">Descripción del Programa</h4>
            <p class="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-lg">${textoReseña}</p>
            <div class="mt-8 flex flex-col md:flex-row gap-3">
                <button class="flex-grow bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition">Matricularme</button>
                <button onclick="cerrarModal()" class="bg-gray-100 px-8 py-3 rounded-xl font-bold">Cerrar</button>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

function cerrarModal() {
    const modal = document.getElementById('modal-detalle');
    if (modal) modal.classList.add('hidden');
}

function toggleFavorito(id) {
    let favs = JSON.parse(localStorage.getItem('misFavoritos')) || [];
    if (favs.includes(id)) {
        favs = favs.filter(favId => favId !== id);
    } else {
        favs.push(id);
    }
    localStorage.setItem('misFavoritos', JSON.stringify(favs));
    
    // Si estamos en la página de favoritos, recargamos para que desaparezca la tarjeta
    if (document.getElementById('contenedor-favoritos')) {
        cargarDatos(); 
    } else {
        alert("Lista de favoritos actualizada");
    }
}

document.addEventListener('DOMContentLoaded', cargarDatos);

// --- LÓGICA DE CONTACTO ---
const formContacto = document.getElementById('form-contacto');
if (formContacto) {
    formContacto.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que la página se recargue
        
        // Ocultamos el formulario y mostramos éxito
        formContacto.classList.add('hidden');
        document.getElementById('mensaje-exito').classList.remove('hidden');
        
        console.log("Formulario enviado por el usuario de Bogotá");
    });
}
