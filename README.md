# BiblioApp - Sistema de Gestión de Biblioteca

Una aplicación web moderna para la gestión de préstamos de libros en bibliotecas, construida con HTML, CSS, JavaScript y Supabase.

## 🚀 Características

- **Gestión de Usuarios**: Registro, edición y eliminación de usuarios de la biblioteca
- **Gestión de Libros**: Catálogo completo con información detallada de libros
- **Sistema de Préstamos**: Registro y seguimiento de préstamos con fechas de vencimiento
- **Autenticación**: Sistema de login seguro con Supabase Auth
- **Interfaz Moderna**: Diseño responsive y accesible
- **Base de Datos en Tiempo Real**: Sincronización automática con Supabase

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Base de Datos**: PostgreSQL con Row Level Security
- **Despliegue**: GitHub Actions para CI/CD

## 📋 Prerrequisitos

- Node.js (versión 16 o superior)
- Cuenta de Supabase
- Git

## 🔧 Instalación

1. **Clona el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd bibioapp
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura Supabase**
   ```bash
   npx supabase init
   npx supabase login
   npx supabase link --project-ref ihameevapgnfkzrlezjc
   ```

4. **Aplica las migraciones**
   ```bash
   npx supabase db push
   ```

5. **Despliega las funciones edge**
   ```bash
   npx supabase functions deploy admin-user-manager --project-ref ihameevapgnfkzrlezjc
   ```

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

#### `library_user`
- `id` (UUID, Primary Key)
- `full_name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `phone` (VARCHAR)
- `address` (TEXT)
- `membership_number` (VARCHAR, Unique)
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `book`
- `id` (UUID, Primary Key)
- `title` (VARCHAR)
- `author` (VARCHAR)
- `isbn` (VARCHAR, Unique)
- `publication_year` (INTEGER)
- `genre` (VARCHAR)
- `description` (TEXT)
- `total_copies` (INTEGER)
- `available_copies` (INTEGER)
- `location` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `loan`
- `id` (UUID, Primary Key)
- `book_id` (UUID, Foreign Key)
- `user_id` (UUID, Foreign Key)
- `loan_date` (TIMESTAMP)
- `due_date` (TIMESTAMP)
- `return_date` (TIMESTAMP)
- `status` (VARCHAR: 'ACTIVE', 'RETURNED', 'OVERDUE')
- `notes` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🔐 Autenticación

El sistema utiliza Supabase Auth para la autenticación de usuarios. Las políticas de Row Level Security (RLS) están configuradas para proteger los datos.

## 🚀 Despliegue

### GitHub Actions

El proyecto incluye un workflow de GitHub Actions que despliega automáticamente las funciones edge cuando se hace push a la rama `main`.

### Variables de Entorno Requeridas

En GitHub Secrets:
- `SUPABASE_ACCESS_TOKEN`: Token de acceso de Supabase

## 📁 Estructura del Proyecto

```
bibioapp/
├── assets/
│   ├── css/           # Estilos CSS organizados por componentes
│   └── js/
│       ├── api/       # Servicios de API
│       ├── components/ # Componentes reutilizables
│       ├── pages/     # Lógica específica de páginas
│       └── shared/    # Utilidades compartidas
├── supabase/
│   ├── functions/     # Funciones edge de Supabase
│   ├── migrations/    # Migraciones de base de datos
│   └── config.toml    # Configuración de Supabase
├── partials/          # Fragmentos HTML reutilizables
└── *.html            # Páginas principales
```

## 🔧 Desarrollo Local

1. **Inicia el servidor de desarrollo**
   ```bash
   npx supabase start
   ```

2. **Abre el proyecto**
   - Supabase Studio: http://localhost:54323
   - API: http://localhost:54321
   - Base de datos: postgresql://postgres:postgres@localhost:54322/postgres

## 📝 API Endpoints

### Funciones Edge

#### `admin-user-manager`
- **POST** `/functions/v1/admin-user-manager`
- Maneja operaciones CRUD para usuarios de la biblioteca

### RPC Functions

#### `create_loan_and_update_stock`
- Crea un préstamo y actualiza automáticamente el stock del libro

#### `update_overdue_loans`
- Actualiza el estado de préstamos vencidos

## 🐛 Solución de Problemas

### Error: "CLI de Supabase no encontrado"
```bash
npm install -g @supabase/cli
```

### Error: "Docker no está ejecutándose"
Asegúrate de que Docker Desktop esté iniciado en Windows.

### Error: "Credenciales de Supabase no válidas"
Verifica que las credenciales en `assets/js/shared/constants.js` sean correctas.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes problemas o preguntas, por favor abre un issue en el repositorio. 