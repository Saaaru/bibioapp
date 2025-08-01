/**
 * Renderiza la tabla de usuarios dentro de un contenedor específico.
 * @param {HTMLElement} container - El elemento del DOM donde se insertará la tabla.
 * @param {Array<Object>} users - El array de objetos de usuario.
 */
export function renderUserTable(container, users) {
    if (!container) {
        console.error('User table container not found.');
        return;
    }

    if (!users || users.length === 0) {
        container.innerHTML = `<p class="text-center">No hay usuarios registrados. ¡Registra uno nuevo!</p>`;
        return;
    }

    // El operador '??' (Nullish Coalescing) es perfecto para mostrar 'N/A' si el valor es null o undefined.
    const tableRows = users.map(user => `
        <tr>
            <td>${user.full_name}</td>
            <td>${user.rut}</td>
            <td>${user.email ?? 'N/A'}</td>
            <td>${user.phone ?? 'N/A'}</td>
            <td class="text-right">
                <a href="/user-edit.html?id=${user.id}" class="btn btn-sm btn-outline">Editar</a>
            </td>
        </tr>
    `).join('');

    container.innerHTML = `
        <table class="table w-full">
            <thead>
                <tr>
                    <th>Nombre Completo</th>
                    <th>RUT</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;
}