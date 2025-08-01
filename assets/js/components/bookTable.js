/**
 * Renderiza la tabla de libros dentro de un contenedor específico.
 * @param {HTMLElement} container - El elemento del DOM donde se insertará la tabla.
 * @param {Array<Object>} books - El array de objetos de libro.
 */
export function renderBookTable(container, books) {
    if (!container) {
        console.error('Table container not found.');
        return;
    }

    if (!books || books.length === 0) {
        container.innerHTML = `<p class="text-center">No hay libros en el catálogo. ¡Añade uno nuevo!</p>`;
        return;
    }

    // Generamos una fila <tr> por cada libro
    const tableRows = books.map(book => `
        <tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td class="text-right">${book.stock_quantity}</td>
            <td class="text-right">
                <a href="/book-edit.html?id=${book.id}" class="btn btn-sm btn-outline">Editar</a>
            </td>
        </tr>
    `).join(''); // Unimos todas las filas en un solo string

    // Creamos la estructura completa de la tabla
    container.innerHTML = `
        <table class="table w-full">
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>ISBN</th>
                    <th class="text-right">Stock</th>
                    <th></th> <!-- Columna para acciones -->
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;
}