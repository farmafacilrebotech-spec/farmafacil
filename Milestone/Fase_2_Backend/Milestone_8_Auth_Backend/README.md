# 🔐 Milestone 8: Autenticación Backend

## 📋 Índice de Sub-Milestones

| Sub-Milestone | Descripción | Estado |
|---------------|-------------|--------|
| [8.1 Auth Supabase](./8.1_Auth_Supabase/) | Configuración de Supabase Auth | 🔴 Pendiente |
| [8.2 Login Farmacia](./8.2_Login_Farmacia/) | Flujo de autenticación de farmacias | 🟡 En progreso |
| [8.3 Sesiones](./8.3_Sesiones/) | Gestión de sesiones con cookies | 🟢 Completado (mock) |
| [8.4 Middleware](./8.4_Middleware/) | Protección de rutas | 🟢 Completado |
| [8.5 Logout](./8.5_Logout/) | Cierre de sesión seguro | 🟢 Completado |

---

## 🎯 Objetivo del Milestone

Implementar un sistema de **autenticación seguro** para las farmacias usando Supabase Auth, con:
- Login/registro real con email/password
- Sesiones persistentes
- Protección de rutas del dashboard

---

## 🔄 Flujo de Autenticación Actual (Mock)

```
┌─────────────────────────────────────────────────────────────┐
│              AUTENTICACIÓN ACTUAL (MOCK)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. LOGIN                                                   │
│     ┌─────────────────────────────────────────────────┐    │
│     │  Usuario ingresa email + password               │    │
│     │  → API valida contra datos mock                 │    │
│     │  → Se guarda en localStorage                    │    │
│     │  → Redirección a dashboard                      │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│  ⚠️  PROBLEMAS DEL MOCK:                                    │
│  - No hay validación real de credenciales                  │
│  - localStorage no es seguro                               │
│  - No hay refresh tokens                                   │
│  - Fácil de falsificar sesión                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Autenticación con Supabase (Objetivo)

```
┌─────────────────────────────────────────────────────────────┐
│            AUTENTICACIÓN CON SUPABASE                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. REGISTRO                                                │
│     ┌─────────────────────────────────────────────────┐    │
│     │  supabase.auth.signUp({                         │    │
│     │    email,                                       │    │
│     │    password,                                    │    │
│     │    options: { data: { nombre_farmacia } }       │    │
│     │  })                                             │    │
│     │  → Crear entrada en tabla farmacias             │    │
│     │  → Enviar email de confirmación                 │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│  2. LOGIN                                                   │
│     ┌─────────────────────────────────────────────────┐    │
│     │  supabase.auth.signInWithPassword({             │    │
│     │    email,                                       │    │
│     │    password                                     │    │
│     │  })                                             │    │
│     │  → Retorna session con access_token             │    │
│     │  → Cookie HttpOnly automática                   │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│  3. VERIFICACIÓN                                            │
│     ┌─────────────────────────────────────────────────┐    │
│     │  Middleware verifica token en cada request      │    │
│     │  → Si válido: continúa                          │    │
│     │  → Si inválido: redirect a login                │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│  4. LOGOUT                                                  │
│     ┌─────────────────────────────────────────────────┐    │
│     │  supabase.auth.signOut()                        │    │
│     │  → Elimina sesión del servidor                  │    │
│     │  → Limpia cookies                               │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Archivos de Autenticación Actuales

### `app/api/auth/login-farmacia/route.ts` (Mock actual)

```typescript
export async function POST(req: Request) {
  const { email, password } = await req.json()
  
  // ⚠️ Validación mock - CAMBIAR POR SUPABASE
  const farmacia = FARMACIAS_MOCK.find(f => 
    f.email === email && f.password === password
  )
  
  if (!farmacia) {
    return NextResponse.json({ success: false })
  }
  
  return NextResponse.json({ 
    success: true, 
    farmacia 
  })
}
```

### `app/api/auth/logout/route.ts`

```typescript
export async function POST() {
  const cookieStore = cookies()
  cookieStore.delete('farmafacil_session')
  cookieStore.delete('farmacia_session')
  cookieStore.delete('cliente_session')

  return NextResponse.json({
    success: true,
    message: 'Sesión cerrada correctamente'
  })
}
```

---

## 🔧 Migración a Supabase Auth

### Paso 1: Configurar Supabase Auth

```typescript
// lib/supabase-auth.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabaseAuth = createClientComponentClient()

// Registro de farmacia
export async function registerFarmacia(
  email: string, 
  password: string,
  nombreFarmacia: string
) {
  const { data, error } = await supabaseAuth.auth.signUp({
    email,
    password,
    options: {
      data: {
        nombre_farmacia: nombreFarmacia,
        tipo: 'farmacia'
      }
    }
  })
  
  if (error) throw error
  
  // Crear entrada en tabla farmacias
  if (data.user) {
    await supabaseAuth.from('farmacias').insert({
      id: data.user.id,
      email,
      nombre: nombreFarmacia,
      codigo: generarCodigoUnico(nombreFarmacia)
    })
  }
  
  return data
}

// Login de farmacia
export async function loginFarmacia(email: string, password: string) {
  const { data, error } = await supabaseAuth.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

// Logout
export async function logoutFarmacia() {
  const { error } = await supabaseAuth.auth.signOut()
  if (error) throw error
}

// Obtener sesión actual
export async function getSession() {
  const { data, error } = await supabaseAuth.auth.getSession()
  if (error) throw error
  return data.session
}
```

---

## ✅ Checklist

- [x] API de login (mock)
- [x] API de logout
- [x] Middleware de protección
- [ ] Migrar a Supabase Auth
- [ ] Registro con confirmación email
- [ ] Refresh tokens
- [ ] Recuperación de contraseña

---

*Milestone 8 de Fase 2 Backend*

