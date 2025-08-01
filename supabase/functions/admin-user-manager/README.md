# Admin User Manager Edge Function

Esta función edge de Supabase maneja las operaciones CRUD para usuarios de la biblioteca.

## Endpoints

### POST /functions/v1/admin-user-manager

#### Headers requeridos:
- `Authorization: Bearer <jwt_token>`
- `Content-Type: application/json`

#### Body:
```json
{
  "action": "create_user|update_user|delete_user",
  "userData": {
    // Datos del usuario según la acción
  }
}
```

#### Acciones disponibles:

##### 1. create_user
```json
{
  "action": "create_user",
  "userData": {
    "full_name": "Nombre Completo",
    "email": "email@ejemplo.com",
    "phone": "+1234567890",
    "address": "Dirección completa",
    "membership_number": "MEM001"
  }
}
```

##### 2. update_user
```json
{
  "action": "update_user",
  "userData": {
    "id": "uuid-del-usuario",
    "full_name": "Nuevo Nombre",
    "email": "nuevo@email.com",
    "phone": "+1234567890",
    "address": "Nueva dirección",
    "membership_number": "MEM002"
  }
}
```

##### 3. delete_user
```json
{
  "action": "delete_user",
  "userData": {
    "id": "uuid-del-usuario"
  }
}
```

## Respuestas

### Éxito (201/200):
```json
{
  "user": {
    "id": "uuid",
    "full_name": "Nombre",
    "email": "email@ejemplo.com",
    // ... otros campos
  }
}
```

### Error (400/401/500):
```json
{
  "error": "Mensaje de error descriptivo"
}
```

## Variables de entorno requeridas

- `SUPABASE_URL`: URL de tu proyecto Supabase
- `SUPABASE_ANON_KEY`: Clave anónima de tu proyecto Supabase

## Despliegue

```bash
supabase functions deploy admin-user-manager --project-ref ihameevapgnfkzrlezjc
``` 