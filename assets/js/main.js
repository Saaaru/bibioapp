import { supabase } from './shared/constants.js';
import { handleLogout, updateNavbar } from './components/navbar.js';

/**
 * Carga un fragmento de HTML en un elemento del DOM.
 * @param {string} selector - El selector CSS del contenedor de destino.
 * @param {string} url - La URL del archivo HTML a cargar.
 */
async function loadPartial(selector, url) {
    const element = document.querySelector(selector);
    if (!element) {
        console.error(`Element with selector "${selector}" not found.`);
        return;
    }
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch partial: ${response.statusText}`);
        element.innerHTML = await response.text();
    } catch (error) {
        console.error(`Error loading partial from ${url}:`, error);
    }
}

/**
 * Función principal que se ejecuta al cargar la página.
 */
async function main() {
    // 1. Cargar el HTML del navbar
    await loadPartial('#navbar-container', '/partials/_navbar.html');

    // 2. Verificar el estado de la sesión y actualizar el UI del navbar
    const { data: { session } } = await supabase.auth.getSession();
    updateNavbar(session);

    // 3. Escuchar cambios en la autenticación para actualizar el navbar en tiempo real
    supabase.auth.onAuthStateChange((_event, session) => {
        updateNavbar(session);
    });

    // 4. Asignar evento al botón de logout (una vez que el navbar está cargado)
    // Usamos delegación de eventos en el contenedor por si el botón no existe al principio.
    document.body.addEventListener('click', (event) => {
        if (event.target && event.target.id === 'logout-button') {
            handleLogout();
        }
    });
}

// Iniciar la aplicación
document.addEventListener('DOMContentLoaded', main);