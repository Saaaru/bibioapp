// Este archivo utiliza la variable global `supabase` que se importa desde el CDN en el HTML.
// Es una forma de evitar importar `createClient` en todos los archivos.

// Credenciales de Supabase para el proyecto bibioapp
const SUPABASE_URL = 'https://ihameevapgnfkzrlezjc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloYW1lZXZhcGduZmt6cmxlempjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMTQ4NzMsImV4cCI6MjA2OTU5MDg3M30.ZWq6ipXR3cOEY5D4m1YFowf9QjQv9F8a8RabEFxd5jA';

// Exportamos el cliente Supabase ya inicializado
export const supabase = self.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);