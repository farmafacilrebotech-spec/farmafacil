# 🍪 8.3 Gestión de Sesiones

## 📋 Estado Actual: localStorage

### Implementación Mock

```typescript
// Al hacer login
localStorage.setItem("farmacia_session", JSON.stringify({
  id: farmacia.id,
  nombre: farmacia.nombre,
  email: farmacia.email,
}))

// Al verificar sesión
const session = localStorage.getItem("farmacia_session")
const farmacia = session ? JSON.parse(session) : null

// Al hacer logout
localStorage.removeItem("farmacia_session")
```

### Problemas de localStorage

```
┌─────────────────────────────────────────────────────────────┐
│              PROBLEMAS DE localStorage                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ❌ SEGURIDAD                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ - Accesible desde JavaScript (XSS vulnerable)       │   │
│  │ - No hay encriptación                               │   │
│  │ - Cualquier script puede leer/escribir              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ❌ PERSISTENCIA                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ - No hay expiración automática                      │   │
│  │ - Se borra al limpiar datos del navegador           │   │
│  │ - No sincroniza entre pestañas automáticamente      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ❌ SERVIDOR                                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ - No disponible en Server Components                │   │
│  │ - No se envía con requests HTTP                     │   │
│  │ - Middleware no puede verificar                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Objetivo: Cookies HttpOnly con Supabase

### Cómo funcionan las cookies de Supabase

```typescript
// Supabase Auth Helper maneja automáticamente las cookies
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  
  // Esto lee la cookie automáticamente
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/login-farmacia')
  }
  
  return <Dashboard user={session.user} />
}
```

### Cookies establecidas por Supabase

```
sb-<project-ref>-auth-token
├── access_token: JWT con info del usuario
├── refresh_token: Para renovar sesión
├── expires_at: Timestamp de expiración
└── Flags:
    ├── HttpOnly: true (no accesible desde JS)
    ├── Secure: true (solo HTTPS)
    ├── SameSite: Lax
    └── Path: /
```

---

## 🔄 Flujo de Sesiones con Supabase

```
┌─────────────────────────────────────────────────────────────┐
│                  FLUJO DE SESIÓN                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. LOGIN EXITOSO                                           │
│     ┌─────────────────────────────────────────────────┐    │
│     │  signInWithPassword()                           │    │
│     │  ↓                                              │    │
│     │  Supabase retorna tokens                        │    │
│     │  ↓                                              │    │
│     │  Auth Helper guarda en cookie                   │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│  2. REQUESTS SUBSECUENTES                                   │
│     ┌─────────────────────────────────────────────────┐    │
│     │  Browser envía cookie automáticamente           │    │
│     │  ↓                                              │    │
│     │  Middleware lee cookie                          │    │
│     │  ↓                                              │    │
│     │  getSession() valida token                      │    │
│     │  ↓                                              │    │
│     │  Si válido → continúa                           │    │
│     │  Si expirado → refresh automático               │    │
│     │  Si inválido → redirect a login                 │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│  3. REFRESH AUTOMÁTICO                                      │
│     ┌─────────────────────────────────────────────────┐    │
│     │  access_token expira (por defecto 1 hora)       │    │
│     │  ↓                                              │    │
│     │  Auth Helper usa refresh_token                  │    │
│     │  ↓                                              │    │
│     │  Nuevo access_token generado                    │    │
│     │  ↓                                              │    │
│     │  Cookie actualizada                             │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│  4. LOGOUT                                                  │
│     ┌─────────────────────────────────────────────────┐    │
│     │  signOut()                                      │    │
│     │  ↓                                              │    │
│     │  Supabase invalida refresh_token                │    │
│     │  ↓                                              │    │
│     │  Cookie eliminada                               │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Comparación

| Característica | localStorage (actual) | Cookies HttpOnly (objetivo) |
|----------------|----------------------|----------------------------|
| Seguridad XSS | ❌ Vulnerable | ✅ Protegido |
| Server access | ❌ No | ✅ Sí |
| Expiración | ❌ Manual | ✅ Automática |
| Refresh | ❌ No | ✅ Automático |
| Multi-tab | ❌ Manual | ✅ Sincronizado |

---

## ✅ Checklist

- [x] localStorage implementado (mock)
- [ ] Migrar a Supabase Auth cookies
- [ ] Configurar expiración
- [ ] Implementar refresh automático
- [ ] Sincronización multi-pestaña

---

*Paso 3 de Milestone 8 - Autenticación Backend*

