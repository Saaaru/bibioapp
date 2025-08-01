import { supabase } from '../shared/constants.js';

/**
 * Actualiza el contenido del navbar según el estado de la sesión.
 * @param {import('@supabase/supabase-js').Session | null} session
 */
export function updateNavbar(session) {
    const userMenu = document.getElementById('user-menu');
    const navLinks = document.querySelector('.navbar-links');

    if (!userMenu || !navLinks) return;

    if (session) {
        // Usuario logueado
        navLinks.innerHTML = `
            <a href="/books.html">Catálogo</a>
            <a href="/users.html">Usuarios</a>
            <a href="/loans-new.html" class="btn btn-secondary">Nuevo Préstamo</a>
        `;
        userMenu.innerHTML = `
            <span class="user-email">${session.user.email}</span>
            <button id="logout-button" class="btn btn-ghost">Logout</button>
        `;
    } else {
        // Usuario no logueado
        navLinks.innerHTML = ''; // Ocultar enlaces de navegación
        userMenu.innerHTML = `
            <a href="/login.html" class="btn btn-primary">Login</a>
        `;
    }
}

/**
 * Maneja el proceso de logout.
 */
export async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error during logout:', error);
    } else {
        // Redirigir a la página de login después de un logout exitoso
        window.location.replace('/login.html');
    }
}