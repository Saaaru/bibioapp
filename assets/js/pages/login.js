import { supabase } from '../shared/constants.js';

// Seleccionamos los elementos del DOM
const loginForm = document.getElementById('login-form');
const errorMessageContainer = document.getElementById('error-message');

/**
 * Maneja el envío del formulario de login.
 * @param {Event} event
 */
async function handleLogin(event) {
    event.preventDefault(); // Prevenimos el envío tradicional del formulario

    // Ocultamos mensajes de error previos
    errorMessageContainer.style.display = 'none';
    errorMessageContainer.textContent = '';

    const formData = new FormData(loginForm);
    const email = formData.get('email');
    const password = formData.get('password');

    // Validación simple
    if (!email || !password) {
        showError('Por favor, ingresa tu email y contraseña.');
        return;
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            // Si hay un error, lo mostramos al usuario
            console.error('Login error:', error.message);
            showError('Email o contraseña incorrectos. Por favor, inténtalo de nuevo.');
            return;
        }

        if (data.session) {
            // Si el login es exitoso, redirigimos al dashboard
            window.location.replace('/'); // Redirige a index.html
        }

    } catch (err) {
        console.error('Unexpected error during login:', err);
        showError('Ocurrió un error inesperado. Por favor, contacta al administrador.');
    }
}

/**
 * Muestra un mensaje de error en el contenedor designado.
 * @param {string} message
 */
function showError(message) {
    errorMessageContainer.textContent = message;
    errorMessageContainer.style.display = 'block';
}

// Asignamos el manejador de eventos al formulario
loginForm.addEventListener('submit', handleLogin);

// Adicional: Si el usuario ya está logueado y llega a esta página, lo redirigimos.
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        window.location.replace('/');
    }
});