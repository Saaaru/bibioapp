// Script para probar la conexión con Supabase
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://ihameevapgnfkzrlezjc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloYW1lZXZhcGduZmt6cmxlempjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMTQ4NzMsImV4cCI6MjA2OTU5MDg3M30.ZWq6ipXR3cOEY5D4m1YFowf9QjQv9F8a8RabEFxd5jA'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testConnection() {
    console.log('🔍 Probando conexión con Supabase...')
    
    try {
        // Probar conexión básica
        const { data, error } = await supabase.from('library_user').select('count').limit(1)
        
        if (error) {
            console.error('❌ Error de conexión:', error.message)
            
            if (error.message.includes('relation "library_user" does not exist')) {
                console.log('📋 La tabla library_user no existe. Necesitas ejecutar el script SQL.')
                console.log('💡 Ve a: https://supabase.com/dashboard/project/ihameevapgnfkzrlezjc/sql')
                console.log('💡 Ejecuta el contenido de setup-database.sql')
            }
        } else {
            console.log('✅ Conexión exitosa!')
            console.log('📊 Datos recibidos:', data)
        }
        
    } catch (err) {
        console.error('❌ Error inesperado:', err)
    }
}

// Ejecutar la prueba
testConnection() 