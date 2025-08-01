import { supabase } from '../shared/constants.js';

/**
 * Obtiene todos los libros de la base de datos, ordenados por título.
 * @returns {Promise<Array<Object>>} Una promesa que resuelve a un array de libros.
 */
export async function getBooks() {
    try {
        const { data: books, error } = await supabase
            .from('book')
            .select('*')
            .order('title', { ascending: true });

        if (error) {
            console.error('Error fetching books:', error.message);
            // Podríamos lanzar el error para que sea capturado por quien llama a la función
            throw error; 
        }

        return books || []; // Devolver un array vacío si data es null

    } catch (err) {
        console.error('Unexpected error in getBooks:', err);
        // Devolvemos un array vacío para que la UI no se rompa
        return [];
    }
}

/**
 * Crea un nuevo libro en la base de datos.
 * @param {Object} bookData - Un objeto con los datos del libro (title, author, isbn, stock_quantity).
 * @returns {Promise<Object>} Una promesa que resuelve al nuevo libro creado.
 */
export async function createBook(bookData) {
    // Validación simple de los datos de entrada
    if (!bookData.title || !bookData.author || !bookData.isbn || bookData.stock_quantity === undefined) {
        throw new Error('Datos incompletos para crear el libro.');
    }

    try {
        const { data, error } = await supabase
            .from('book')
            .insert([
                {
                    title: bookData.title,
                    author: bookData.author,
                    isbn: bookData.isbn,
                    stock_quantity: Number(bookData.stock_quantity) // Asegurarse de que es un número
                }
            ])
            .select() // .select() devuelve el registro recién creado
            .single(); // Esperamos un solo registro de vuelta

        if (error) {
            console.error('Error creating book:', error.message);
            // Si el error es por ISBN duplicado (código 23505 en PostgreSQL)
            if (error.code === '23505') {
                throw new Error(`El ISBN '${bookData.isbn}' ya está registrado.`);
            }
            throw new Error('No se pudo crear el libro en la base de datos.');
        }

        return data;

    } catch (err) {
        // Re-lanzamos el error para que sea manejado por el orquestador
        throw err;
    }
}

/**
 * Obtiene un único libro por su ID.
 * @param {string} bookId - El UUID del libro a obtener.
 * @returns {Promise<Object>} Una promesa que resuelve al objeto del libro.
 */
export async function getBookById(bookId) {
    if (!bookId) throw new Error('Se requiere un ID de libro.');

    try {
        const { data, error } = await supabase
            .from('book')
            .select('*')
            .eq('id', bookId)
            .single(); // .single() es clave, devuelve un objeto en lugar de un array y un error si no se encuentra

        if (error) {
            console.error(`Error fetching book with ID ${bookId}:`, error.message);
            throw new Error('Libro no encontrado.');
        }

        return data;

    } catch (err) {
        throw err;
    }
}

/**
 * Actualiza un libro existente en la base de datos.
 * @param {string} bookId - El ID del libro a actualizar.
 * @param {Object} bookData - Un objeto con los campos a actualizar.
 * @returns {Promise<Object>} Una promesa que resuelve al libro actualizado.
 */
export async function updateBook(bookId, bookData) {
    if (!bookId) throw new Error('Se requiere un ID de libro para actualizar.');

    try {
        const { data, error } = await supabase
            .from('book')
            .update({
                title: bookData.title,
                author: bookData.author,
                isbn: bookData.isbn,
                stock_quantity: Number(bookData.stock_quantity)
            })
            .eq('id', bookId)
            .select()
            .single();

        if (error) {
            console.error('Error updating book:', error.message);
            // Manejar posible error de ISBN duplicado al actualizar
            if (error.code === '23505') {
                throw new Error(`El ISBN '${bookData.isbn}' ya está registrado en otro libro.`);
            }
            throw new Error('No se pudo actualizar el libro.');
        }

        return data;

    } catch (err) {
        throw err;
    }
}

/**
 * Obtiene solo los libros que tienen stock disponible (stock > 0).
 * @returns {Promise<Array<Object>>}
 */
export async function getAvailableBooks() {
    try {
        const { data, error } = await supabase
            .from('book')
            .select('id, title, stock_quantity')
            .gt('stock_quantity', 0) // 'gt' significa "greater than"
            .order('title', { ascending: true });
        
        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error('Error fetching available books:', err);
        return [];
    }
}