import { supabase } from '../shared/constants.js';

/**
 * Llama a la función RPC para crear un préstamo y actualizar el stock.
 * @param {string} bookId 
 * @param {string} userId 
 * @returns {Promise<void>}
 */
export async function createLoan(bookId, userId) {
    if (!bookId || !userId) {
        throw new Error('Se requieren el ID del libro y del usuario.');
    }

    try {
        const { error } = await supabase.rpc('create_loan_and_update_stock', {
            p_book_id: bookId,
            p_user_id: userId
        });

        if (error) {
            console.error('Error creating loan via RPC:', error.message);
            // El mensaje de la excepción de PostgreSQL es útil para el usuario
            throw new Error(error.message || 'No se pudo registrar el préstamo.');
        }

    } catch (err) {
        throw err;
    }
}
/**
 * Obtiene todos los préstamos que están 'ACTIVE' u 'OVERDUE'.
 * Incluye datos relacionados del libro y del usuario.
 * @returns {Promise<Array<Object>>}
 */
export async function getActiveLoans() {
    try {
        const { data, error } = await supabase
            .from('loan')
            .select(`
                id,
                loan_date,
                due_date,
                status,
                book ( id, title ),
                library_user ( id, full_name, rut )
            `)
            .in('status', ['ACTIVE', 'OVERDUE'])
            .order('due_date', { ascending: true }); // Los más próximos a vencer primero

        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error('Error fetching active loans:', err);
        return [];
    }
}

/**
 * Llama a la función RPC para procesar la devolución de un préstamo.
 * @param {string} loanId 
 * @returns {Promise<void>}
 */
export async function processReturn(loanId) {
    if (!loanId) throw new Error('Se requiere el ID del préstamo.');

    try {
        const { error } = await supabase.rpc('process_return', {
            p_loan_id: loanId
        });
        if (error) throw error;
    } catch (err) {
        console.error('Error processing return:', err);
        throw new Error(err.message || 'No se pudo procesar la devolución.');
    }
}