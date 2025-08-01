import { protectRoute } from '../shared/auth.js';
import { createBook } from '../api/bookService.js';

// Función principal para la página de nuevo libro
async function main() {
    // 1. Proteger la ruta
    await protectRoute();

    // 2. Seleccionar elementos del DOM
    const form = document.getElementById('new-book-form');
    const submitButton = document.getElementById('submit-button');
    const errorMessageContainer = document.getElementById('error-message');
    const successMessageContainer = document.getElementById('success-message');
    
    if (!form) return;

    // 3. Manejar el evento de envío del formulario
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Deshabilitar el botón para evitar envíos múltiples
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
            // Llamar a la función de la capa de servicio
            await createBook(bookData);
            
            // Mostrar mensaje de éxito y redirigir
            showSuccess('¡Libro creado con éxito! Redirigiendo...');
            
            // Esperar un momento para que el usuario vea el mensaje y luego redirigir
            setTimeout(() => {
                window.location.href = '/books.html';
            }, 2000);

        } catch (error) {
            console.error('Failed to create book:', error);
            showError(error.message || 'Ocurrió un error inesperado.');
            // Habilitar el botón nuevamente en caso de error
            submitButton.disabled = false;
            submitButton.textContent = 'Guardar Libro';
        }
    });

    function showSuccess(message) {
        successMessageContainer.textContent = message;
        successMessageContainer.style.display = 'block';
    }

    function showError(message) {
        errorMessageContainer.textContent = message;
        errorMessageContainer.style.display = 'block';
    }

    function hideMessages() {
        errorMessageContainer.style.display = 'none';
        successMessageContainer.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', main);