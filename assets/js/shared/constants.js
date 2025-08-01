// Este archivo utiliza la variable global `supabase` que se importa desde el CDN en el HTML.
// Es una forma de evitar importar `createClient` en todos los archivos.

// Reemplaza esto con tus credenciales de Supabase
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Exportamos el cliente Supabase ya inicializado
export const supabase = self.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);