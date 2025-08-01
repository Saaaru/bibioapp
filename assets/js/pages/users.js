import { protectRoute } from '../shared/auth.js';
import { getUsers } from '../api/userService.js';
import { renderUserTable } from '../components/userTable.js';

// Función principal para la página de usuarios
async function main() {
    await protectRoute();

    const tableContainer = document.getElementById('users-table-container');
    if (!tableContainer) {
        console.error('Container for users table not found.');
        return;
    }
    
    try {
        const users = await getUsers();
        renderUserTable(tableContainer, users);

    } catch (error) {
        tableContainer.innerHTML = `<p class="alert-error">Error al cargar los usuarios. Por favor, intenta de nuevo más tarde.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', main);