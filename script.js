// Función para cargar los cursos desde el JSON
async function cargarCursos() {
    try {
        // Buscamos el archivo que creaste en la carpeta data
        const respuesta = await fetch('./data/cursos.json');
        const cursos = await respuesta.json();
        
        // Seleccionamos el contenedor que dejamos en el index.html
        const contenedor = document.getElementById('contenedor-cursos');
        
        // Limpiamos el contenedor por si hay algo
        contenedor.innerHTML = '';

        // Recorremos los cursos y creamos las tarjetas (cards)
        cursos.forEach(curso => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200';
            
            card.innerHTML = `
                <img src="${curso.imagen}" alt="${curso.titulo}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="text-xl font-bold">${curso.titulo}</h4>
                        <button onclick="agregarFavorito(${curso.id})" class="text-gray-400 hover:text-yellow-500 text-2xl">☆</button>
                    </div>
                    <p class="text-gray-600 mb-4 text-sm">${curso.descripcion}</p>
                    <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
                        <span>⏱ ${curso.duracion}</span>
                        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">${curso.nivel}</span>
                    </div>
                    <button class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Ver más</button>
                </div>
            `;
            contenedor.appendChild(card);
        });
    } catch (error) {
        console.error('Error al cargar los cursos:', error);
    }
}

// Función básica para favoritos (usará localStorage como pide la guía)
function agregarFavorito(id) {
    alert('¡Curso ' + id + ' agregado a favoritos! (Funcionalidad en desarrollo)');
    // Aquí implementaremos el localStorage en el siguiente paso
}

// Ejecutar la carga cuando el documento esté listo
document.addEventListener('DOMContentLoaded', cargarCursos);
