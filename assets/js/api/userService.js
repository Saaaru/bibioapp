import { supabase } from '../shared/constants.js';

/**
 * Obtiene todos los usuarios de la biblioteca, ordenados por nombre completo.
 * @returns {Promise<Array<Object>>} Una promesa que resuelve a un array de usuarios.
 */
export async function getUsers() {
    try {
        const { data: users, error } = await supabase
            .from('library_user')
            .select('*')
            .order('full_name', { ascending: true });

        if (error) {
            console.error('Error fetching users:', error.message);
            throw error; 
        }

        return users || [];

    } catch (err) {
        console.error('Unexpected error in getUsers:', err);
        return [];
    }
}

/**
 * Crea un nuevo usuario de la biblioteca en la base de datos.
 * @param {Object} userData - Un objeto con los datos del usuario.
 * @returns {Promise<Object>} Una promesa que resuelve al nuevo usuario creado.
 */
export async function createUser(userData) {
    // Los campos obligatorios son full_name y rut
    if (!userData.full_name || !userData.rut) {
        throw new Error('Nombre completo y RUT son campos obligatorios.');
    }

    try {
        const { data, error } = await supabase
            .from('library_user')
            .insert([
                {
                    full_name: userData.full_name,
                    rut: userData.rut,
                    // Si email o phone son strings vacíos, los guardamos como null
                    email: userData.email || null,
                    phone: userData.phone || null,
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error creating user:', error.message);
            if (error.code === '23505') {
                // Error de violación de restricción única (para el RUT)
                throw new Error(`El RUT '${userData.rut}' ya está registrado.`);
            }
            throw new Error('No se pudo registrar el usuario en la base de datos.');
        }

        return data;

    } catch (err) {
        throw err;
    }
}
/**
 * Obtiene un único usuario de la biblioteca por su ID.
 * @param {string} userId - El UUID del usuario a obtener.
 * @returns {Promise<Object>} Una promesa que resuelve al objeto del usuario.
 */
export async function getUserById(userId) {
    if (!userId) throw new Error('Se requiere un ID de usuario.');

    try {
        const { data, error } = await supabase
            .from('library_user')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error(`Error fetching user with ID ${userId}:`, error.message);
            throw new Error('Usuario no encontrado.');
        }

        return data;

    } catch (err) {
        throw err;
    }
}

/**
 * Actualiza un usuario existente en la base de datos.
 * @param {string} userId - El ID del usuario a actualizar.
 * @param {Object} userData - Un objeto con los campos a actualizar.
 * @returns {Promise<Object>} Una promesa que resuelve al usuario actualizado.
 */
export async function updateUser(userId, userData) {
    if (!userId) throw new Error('Se requiere un ID de usuario para actualizar.');

    try {
        const { data, error } = await supabase
            .from('library_user')
            .update({
                full_name: userData.full_name,
                rut: userData.rut,
                email: userData.email || null,
                phone: userData.phone || null
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            console.error('Error updating user:', error.message);
            if (error.code === '23505') {
                throw new Error(`El RUT '${userData.rut}' ya está registrado en otro usuario.`);
            }
            throw new Error('No se pudo actualizar el usuario.');
        }

        return data;

    } catch (err) {
        throw err;
    }
}