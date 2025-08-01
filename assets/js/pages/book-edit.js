import { protectRoute } from '../shared/auth.js';
import { getBookById, updateBook } from '../api/bookService.js';

// Función principal para la página de edición de libro
async function main() {
    await protectRoute();

    const formWrapper = document.getElementById('form-wrapper');
    const bookId = new URLSearchParams(window.location.search).get('id');

    if (!bookId) {
        formWrapper.innerHTML = `<p class="alert-error">No se ha especificado un ID de libro. <a href="/books.html">Volver al catálogo</a>.</p>`;
        return;
    }

    try {
        const book = await getBookById(bookId);
        renderForm(formWrapper, book);
        setupFormListener(bookId);
    } catch (error) {
        formWrapper.innerHTML = `<p class="alert-error">${error.message} <a href="/books.html">Volver al catálogo</a>.</p>`;
    }
}

/**
 * Renderiza el formulario de edición y lo llena con los datos del libro.
 * @param {HTMLElement} container - El contenedor donde se renderizará el formulario.
 * @param {Object} book - El objeto del libro con sus datos.
 */
function renderForm(container, book) {
    container.innerHTML = `
        <div class="form-container">
            <form id="edit-book-form">
                <div class="form-control">
                    <label for="title" class="label">Título</label>
                    <input type="text" id="title" name="title" class="input" required value="${book.title}">
                </div>
                <div class="form-control">
                    <label for="author" class="label">Autor</label>
                    <input type="text" id="author" name="author" class="input" required value="${book.author}">
                </div>
                <div class="form-control">
                    <label for="isbn" class="label">ISBN</label>
                    <input type="text" id="isbn" name="isbn" class="input" required value="${book.isbn}">
                </div>
                <div class="form-control">
                    <label for="stock_quantity" class="label">Cantidad en Stock</label>
                    <input type="number" id="stock_quantity" name="stock_quantity" class="input" required min="0" value="${book.stock_quantity}">
                </div>

                <div id="error-message" class="alert-error" style="display: none;"></div>
                <div id="success-message" class="alert-success" style="display: none;"></div>

                <div class="form-actions">
                    <button type="submit" id="submit-button" class="btn btn-primary">Guardar Cambios</button>
                    <a href="/books.html" class="btn btn-ghost">Cancelar</a>
                </div>
            </form>
        </div>
    `;
}

/**
 * Configura el event listener para el envío del formulario.
 * @param {string} bookId - El ID del libro que se está editando.
 */
function setupFormListener(bookId) {
    const form = document.getElementById('edit-book-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = document.getElementById('submit-button');
        submitButton.disabled = true;
        submitButton.textContent = 'Guardando...';
        hideMessages();

        const formData = new FormData(form);
        const bookData = {
            title: formData.get('title'),
            author: formData.get('author'),
            isbn: formData.get('isbn'),
            stock_quantity: formData.get('stock_quantity')
        };
        
        try {
            await updateBook(bookId, bookData);
            showSuccess('¡Libro actualizado con éxito! Redirigiendo...');
            setTimeout(() => {
                window.location.href = '/books.html';
            }, 2000);

        } catch (error) {
            console.error('Failed to update book:', error);
            showError(error.message || 'Ocurrió un error inesperado.');
            submitButton.disabled = false;
            submitButton.textContent = 'Guardar Cambios';
        }
    });
}

// Funciones auxiliares para mostrar/ocultar mensajes
function showSuccess(message) {
    const el = document.getElementById('success-message');
    if(el) {
        el.textContent = message;
        el.style.display = 'block';
    }
}

function showError(message) {
    const el = document.getElementById('error-message');
    if(el) {
        el.textContent = message;
        el.style.display = 'block';
    }
}

function hideMessages() {
    const successEl = document.getElementById('success-message');
    const errorEl = document.getElementById('error-message');
    if(successEl) successEl.style.display = 'none';
    if(errorEl) errorEl.style.display = 'none';
}


document.addEventListener('DOMContentLoaded', main);