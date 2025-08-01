import { supabase } from './constants.js';

/**
 * Verifica si existe una sesión de usuario activa.
 * Si no hay sesión, redirige a la página de login.
 * Si hay sesión, devuelve el objeto de la sesión.
 * @returns {Promise<import('@supabase/supabase-js').Session>}
 */
export async function protectRoute() {
    try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error('Error getting session:', error);
            // Si hay un error al obtener la sesión, es más seguro redirigir
            window.location.replace('/login.html');
            return; // Devuelve una promesa que nunca se resolverá, ya que estamos redirigiendo
        }

        if (!data.session) {
            // Si no hay sesión, redirigimos a la página de login
            console.log('No active session, redirecting to login.');
            window.location.replace('/login.html');
            return; // Devuelve una promesa que nunca se resolverá
        }
        
        // Si todo está bien, devolvemos la sesión para que la página la pueda usar
        return data.session;

    } catch (err) {
        console.error('Unexpected error in protectRoute:', err);
        window.location.replace('/login.html');
    }
}