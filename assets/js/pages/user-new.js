import { protectRoute } from '../shared/auth.js';
import { createUser } from '../api/userService.js';

// Función principal para la página de nuevo usuario
async function main() {
    await protectRoute();

    const form = document.getElementById('new-user-form');
    if (!form) return;

    const submitButton = document.getElementById('submit-button');
    const errorMessageContainer = document.getElementById('error-message');
    const successMessageContainer = document.getElementById('success-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        submitButton.disabled = true;
        submitButton.textContent = 'Registrando...';
        hideMessages();

        const formData = new FormData(form);
        const userData = {
            full_name: formData.get('full_name'),
            rut: formData.get('rut'),
            email: formData.get('email'),
            phone: formData.get('phone')
        };
        
        try {
            await createUser(userData);
            showSuccess('¡Usuario registrado con éxito! Redirigiendo...');
            
            setTimeout(() => {
                window.location.href = '/users.html';
            }, 2000);

        } catch (error) {
            console.error('Failed to create user:', error);
            showError(error.message || 'Ocurrió un error inesperado.');
            submitButton.disabled = false;
            submitButton.textContent = 'Registrar Usuario';
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