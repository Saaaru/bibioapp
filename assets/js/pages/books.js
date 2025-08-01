import { protectRoute } from '../shared/auth.js';
import { getBooks } from '../api/bookService.js';
import { renderBookTable } from '../components/bookTable.js';

// Función principal para la página de libros
async function main() {
    // 1. Proteger la ruta: si el usuario no está logueado, será redirigido.
    // La función devuelve la sesión, pero no la necesitamos aquí.
    await protectRoute();

    // 2. Obtener el contenedor de la tabla
    const tableContainer = document.getElementById('books-table-container');
    if (!tableContainer) {
        console.error('Container for books table not found.');
        return;
    }
    
    try {
        // 3. Obtener los datos de los libros desde nuestra capa de servicio
        const books = await getBooks();
        
        // 4. Renderizar la tabla usando nuestro componente de UI
        renderBookTable(tableContainer, books);

    } catch (error) {
        // Si getBooks lanza un error, lo mostramos en la UI
        tableContainer.innerHTML = `<p class="alert-error">Error al cargar los libros. Por favor, intenta de nuevo más tarde.</p>`;
    }
}

// Ejecutar la función principal cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', main);