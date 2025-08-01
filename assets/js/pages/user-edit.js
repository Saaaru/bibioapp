import { protectRoute } from '../shared/auth.js';
import { getUserById, updateUser } from '../api/userService.js';

async function main() {
    await protectRoute();

    const formWrapper = document.getElementById('form-wrapper');
    const userId = new URLSearchParams(window.location.search).get('id');

    if (!userId) {
        formWrapper.innerHTML = `<p class="alert-error">No se ha especificado un ID de usuario. <a href="/users.html">Volver a la lista</a>.</p>`;
        return;
    }

    try {
        const user = await getUserById(userId);
        renderForm(formWrapper, user);
        setupFormListener(userId);
    } catch (error) {
        formWrapper.innerHTML = `<p class="alert-error">${error.message} <a href="/users.html">Volver a la lista</a>.</p>`;
    }
}

function renderForm(container, user) {
    // Usamos el operador '??' para asegurarnos de que si el valor es null, se imprima un string vacío en el input.
    container.innerHTML = `
        <div class="form-container">
            <form id="edit-user-form">
                <div class="form-control">
                    <label for="full_name" class="label">Nombre Completo</label>
                    <input type="text" id="full_name" name="full_name" class="input" required value="${user.full_name}">
                </div>
                <div class="form-control">
                    <label for="rut" class="label">RUT</label>
                    <input type="text" id="rut" name="rut" class="input" required value="${user.rut}">
                </div>
                <div class="form-control">
                    <label for="email" class="label">Email (Opcional)</label>
                    <input type="email" id="email" name="email" class="input" value="${user.email ?? ''}">
                </div>
                <div class="form-control">
                    <label for="phone" class="label">Teléfono (Opcional)</label>
                    <input type="tel" id="phone" name="phone" class="input" value="${user.phone ?? ''}">
                </div>

                <div id="error-message" class="alert-error" style="display: none;"></div>
                <div id="success-message" class="alert-success" style="display: none;"></div>

                <div class="form-actions">
                    <button type="submit" id="submit-button" class="btn btn-primary">Guardar Cambios</button>
                    <a href="/users.html" class="btn btn-ghost">Cancelar</a>
                </div>
            </form>
        </div>
    `;
}

function setupFormListener(userId) {
    const form = document.getElementById('edit-user-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = document.getElementById('submit-button');
        submitButton.disabled = true;
        submitButton.textContent = 'Guardando...';
        hideMessages();

        const formData = new FormData(form);
        const userData = {
            full_name: formData.get('full_name'),
            rut: formData.get('rut'),
            email: formData.get('email'),
            phone: formData.get('phone')
        };
        
        try {
            await updateUser(userId, userData);
            showSuccess('¡Usuario actualizado con éxito! Redirigiendo...');
            setTimeout(() => {
                window.location.href = '/users.html';
            }, 2000);

        } catch (error) {
            console.error('Failed to update user:', error);
            showError(error.message || 'Ocurrió un error inesperado.');
            submitButton.disabled = false;
            submitButton.textContent = 'Guardar Cambios';
        }
    });
}

// Funciones auxiliares para mensajes
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