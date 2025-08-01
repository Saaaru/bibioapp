import { protectRoute } from '../shared/auth.js';
import { getAvailableBooks } from '../api/bookService.js';
import { getUsers } from '../api/userService.js';
import { createLoan } from '../api/loanService.js';

async function main() {
    await protectRoute();

    const form = document.getElementById('new-loan-form');
    const userSelect = document.getElementById('user_id');
    const bookSelect = document.getElementById('book_id');
    const submitButton = document.getElementById('submit-button');
    const errorMessageContainer = document.getElementById('error-message');
    const successMessageContainer = document.getElementById('success-message');

    // Cargar datos para los desplegables en paralelo para mayor eficiencia
    try {
        const [users, books] = await Promise.all([
            getUsers(),
            getAvailableBooks()
        ]);
        
        populateSelect(userSelect, users, 'Seleccione un usuario', 'id', 'full_name');
        populateSelect(bookSelect, books, 'Seleccione un libro', 'id', item => `${item.title} (Stock: ${item.stock_quantity})`);
        
        // Habilitar los desplegables y el botón de envío
        userSelect.disabled = false;
        bookSelect.disabled = false;
        submitButton.disabled = false;

    } catch (error) {
        showError('No se pudieron cargar los datos para el formulario. Inténtalo de nuevo.');
        console.error(error);
    }
    
    form.addEventListener('submit', handleFormSubmit);

    async function handleFormSubmit(event) {
        event.preventDefault();
        submitButton.disabled = true;
        submitButton.textContent = 'Procesando...';
        hideMessages();

        const formData = new FormData(form);
        const userId = formData.get('user_id');
        const bookId = formData.get('book_id');
        
        try {
            await createLoan(bookId, userId);
            showSuccess('¡Préstamo registrado con éxito! Redirigiendo al dashboard...');
            setTimeout(() => { window.location.href = '/'; }, 2000);
        } catch (error) {
            showError(error.message);
            submitButton.disabled = false;
            submitButton.textContent = 'Crear Préstamo';
        }
    }
}

/**
 * Rellena un elemento <select> con opciones.
 * @param {HTMLSelectElement} selectElement - El elemento <select>.
 * @param {Array<Object>} items - El array de datos.
 * @param {string} placeholder - El texto para la opción deshabilitada.
 * @param {string} valueKey - La clave del objeto para el `value` de la opción.
 * @param {string|Function} textKey - La clave del objeto o una función para el texto de la opción.
 */
function populateSelect(selectElement, items, placeholder, valueKey, textKey) {
    selectElement.innerHTML = `<option value="" disabled selected>${placeholder}</option>`;
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueKey];
        option.textContent = typeof textKey === 'function' ? textKey(item) : item[textKey];
        selectElement.appendChild(option);
    });
}

function showSuccess(message) {
    document.getElementById('success-message').textContent = message;
    document.getElementById('success-message').style.display = 'block';
}
function showError(message) {
    document.getElementById('error-message').textContent = message;
    document.getElementById('error-message').style.display = 'block';
}
function hideMessages() {
    document.getElementById('error-message').style.display = 'none';
    document.getElementById('success-message').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', main);