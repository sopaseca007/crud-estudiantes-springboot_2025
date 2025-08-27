const API_URL = 'http://localhost:8080/api/estudiantes';

// Cargar estudiantes al iniciar
document.addEventListener('DOMContentLoaded', cargarEstudiantes);

// Manejar envío del formulario
document.getElementById('estudianteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    guardarEstudiante();
});

// Función para cargar todos los estudiantes
async function cargarEstudiantes() {
    try {
        const response = await fetch(API_URL);
        const estudiantes = await response.json();
        const tabla = document.getElementById('estudiantesTable');
        tabla.innerHTML = '';

        estudiantes.forEach(est => {
            tabla.innerHTML += `
                <tr>
                    <td>${est.id}</td>
                    <td>${est.nombre}</td>
                    <td>${est.apellido}</td>
                    <td>${est.email}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarEstudiante(${est.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarEstudiante(${est.id})">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error al cargar estudiantes:', error);
    }
}

// Función para guardar o actualizar estudiante
async function guardarEstudiante() {
    const id = document.getElementById('estudianteId').value;
    const estudiante = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        email: document.getElementById('email').value
    };

    const url = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? 'PUT' : 'POST';

    try {
        await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(estudiante)
        });

        resetForm();
        cargarEstudiantes();
    } catch (error) {
        console.error('Error al guardar estudiante:', error);
    }
}

// Función para editar estudiante
async function editarEstudiante(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const estudiante = await response.json();

        document.getElementById('estudianteId').value = estudiante.id;
        document.getElementById('nombre').value = estudiante.nombre;
        document.getElementById('apellido').value = estudiante.apellido;
        document.getElementById('email').value = estudiante.email;

        document.getElementById('formTitle').textContent = 'Editar Estudiante';
        document.getElementById('nombre').focus();
    } catch (error) {
        console.error('Error al cargar estudiante para editar:', error);
    }
}

// Función para eliminar estudiante
async function eliminarEstudiante(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            cargarEstudiantes();
        } catch (error) {
            console.error('Error al eliminar estudiante:', error);
        }
    }
}

// Función para cancelar edición
function cancelarEdicion() {
    resetForm();
}

// Resetear formulario
function resetForm() {
    document.getElementById('estudianteForm').reset();
    document.getElementById('estudianteId').value = '';
    document.getElementById('formTitle').textContent = 'Agregar Estudiante';
}
