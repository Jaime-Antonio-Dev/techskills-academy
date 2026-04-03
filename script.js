// Función principal para cargar cursos (Sirve para Catálogo e Inicio)
async function cargarCursos() {
    try {
        const respuesta = await fetch('./data/cursos.json');
        const cursos = await respuesta.json();
        
        // 1. Lógica para Catálogo/Inicio
        const contenedorGeneral = document.getElementById('contenedor-cursos');
        if(contenedorGeneral) {
            renderizarCursos(cursos, contenedorGeneral);
        }

        // 2. Lógica para la página de Favoritos (LO QUE NOS FALTA)
        const contenedorFavs = document.getElementById('contenedor-favoritos');
        if(contenedorFavs) {
            const IDsFavoritos = JSON.parse(localStorage.getItem('misFavoritos')) || [];
            const cursosFiltrados = cursos.filter(c => IDsFavoritos.includes(c.id));
            
            if(cursosFiltrados.length === 0) {
                contenedorFavs.innerHTML = '<p class="col-span-3 text-center text-gray-500 italic">Aún no has guardado cursos. ¡Ve al catálogo y selecciona tus favoritos!</p>';
            } else {
                renderizarCursos(cursosFiltrados, contenedorFavs);
            }
        }
    } catch (error) { console.error("Error:", error); }
}

// Función auxiliar para dibujar las tarjetas (Para no repetir código)
function renderizarCursos(lista, contenedor) {
    contenedor.innerHTML = '';
    lista.forEach(curso => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition';
        card.innerHTML = `
            <img src="${curso.imagen}" class="w-full h-40 object-cover">
            <div class="p-5">
                <div class="flex justify-between items-center mb-2">
                    <h4 class="font-bold text-lg">${curso.titulo}</h4>
                    <button onclick="gestionarFavorito(${curso.id})" class="text-xl">⭐</button>
                </div>
                <p class="text-gray-600 text-sm mb-4">${curso.descripcion}</p>
                <button class="w-full py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700">Detalles</button>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// Guardar en la memoria (LocalStorage)
function gestionarFavorito(id) {
    let favoritos = JSON.parse(localStorage.getItem('misFavoritos')) || [];
    if (!favoritos.includes(id)) {
        favoritos.push(id);
        alert('¡Curso añadido a favoritos! ⭐');
    } else {
        // Si ya existe, lo quitamos (esto lo hace más funcional)
        favoritos = favoritos.filter(favId => favId !== id);
        alert('Curso eliminado de favoritos.');
    }
    localStorage.setItem('misFavoritos', JSON.stringify(favoritos));
    location.reload(); // Recarga para ver el cambio de inmediato
}

document.addEventListener('DOMContentLoaded', cargarCursos);
