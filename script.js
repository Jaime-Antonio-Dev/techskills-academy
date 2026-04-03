// 1. Cargar cursos dinámicamente
async function cargarCursos() {
    try {
        const respuesta = await fetch('./data/cursos.json');
        const cursos = await respuesta.json();
        const contenedor = document.getElementById('contenedor-cursos');
        
        if(!contenedor) return; 

        contenedor.innerHTML = '';
        cursos.forEach(curso => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1';
            card.innerHTML = `
                <img src="${curso.imagen}" alt="${curso.titulo}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="text-xl font-bold text-gray-900">${curso.titulo}</h4>
                        <button onclick="gestionarFavorito(${curso.id})" class="text-2xl hover:scale-125 transition">⭐</button>
                    </div>
                    <p class="text-gray-600 mb-4 text-sm">${curso.descripcion}</p>
                    <button class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-semibold">Ver detalles</button>
                </div>
            `;
            contenedor.appendChild(card);
        });
    } catch (error) { console.error("Error:", error); }
}

// 2. Lógica de Favoritos con LocalStorage 
function gestionarFavorito(id) {
    let favoritos = JSON.parse(localStorage.getItem('misFavoritos')) || [];
    if (!favoritos.includes(id)) {
        favoritos.push(id);
        alert('¡Curso guardado en favoritos! ❤️');
    } else {
        alert('Este curso ya está en tu lista.');
    }
    localStorage.setItem('misFavoritos', JSON.stringify(favoritos));
}

// 3. Validaciones de Formulario 
document.addEventListener('submit', function(e) {
    if (e.target.id === 'formulario-contacto') {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const nombre = document.getElementById('nombre').value;
        const mensajeExito = document.getElementById('mensaje-exito');

        // Validación simple de nombre y formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (nombre.length < 3) {
            alert("Por favor, ingresa un nombre válido.");
        } else if (!emailRegex.test(email)) {
            alert("El formato del correo no es correcto.");
        } else {
            mensajeExito.classList.remove('hidden');
            e.target.reset();
        }
    }
});

document.addEventListener('DOMContentLoaded', cargarCursos);
