# 🚪 8.5 Cierre de Sesión

## 📋 Implementación Actual

**Archivo**: `app/api/auth/logout/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = cookies()
    
    // Eliminar todas las cookies de sesión
    cookieStore.delete('farmafacil_session')
    cookieStore.delete('farmacia_session')
    cookieStore.delete('cliente_session')

    return NextResponse.json({
      success: true,
      message: 'Sesión cerrada correctamente'
    })
  } catch (error) {
    console.error('Error en logout:', error)
    return NextResponse.json(
      { success: false, error: 'Error al cerrar sesión' },
      { status: 500 }
    )
  }
}
```

---

## 📋 Uso en Componentes

### Botón de Logout en Header/Navbar

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Llamar API de logout
      await fetch('/api/auth/logout', { method: 'POST' })
      
      // Limpiar localStorage (para mock actual)
      localStorage.removeItem('farmacia_session')
      localStorage.removeItem('cliente_session')
      
      // Redirigir a home
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <Button 
      variant="ghost" 
      onClick={handleLogout}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Cerrar sesión
    </Button>
  )
}
```

---

## 📋 Logout con Supabase (Objetivo)

```typescript
// app/api/auth/logout/route.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Cerrar sesión en Supabase (invalida refresh token)
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return NextResponse.json(
        { success: false, error: 'Error al cerrar sesión' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Sesión cerrada correctamente'
    })
  } catch (error) {
    console.error('Error en logout:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno' },
      { status: 500 }
    )
  }
}
```

### Componente con Supabase

```tsx
'use client'

import { createBrowserClient } from '@/lib/supabase-auth'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <button onClick={handleLogout}>
      Cerrar sesión
    </button>
  )
}
```

---

## 🔄 Flujo de Logout

```
┌─────────────────────────────────────────────────────────────┐
│                     LOGOUT FLOW                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   USUARIO AUTENTICADO                                       │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Click en "Cerrar sesión"                           │  │
│   └─────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│   CLIENTE                                                   │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  1. POST /api/auth/logout                           │  │
│   │  2. O: supabase.auth.signOut()                      │  │
│   └─────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│   SERVIDOR                                                  │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Mock:                                              │  │
│   │  - cookies().delete('farmacia_session')             │  │
│   │                                                     │  │
│   │  Supabase:                                          │  │
│   │  - Invalidar refresh_token en servidor              │  │
│   │  - Eliminar cookie de auth                          │  │
│   └─────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│   CLIENTE                                                   │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  1. Limpiar localStorage (mock)                     │  │
│   │  2. router.push('/')                                │  │
│   │  3. router.refresh()                                │  │
│   └─────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│   USUARIO DESCONECTADO                                      │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  En página de inicio, sin sesión                    │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist

- [x] API de logout creada
- [x] Eliminar cookies de sesión
- [x] Limpiar localStorage
- [x] Redirección a home
- [ ] Integrar con Supabase signOut()
- [ ] Invalidar refresh token

---

*Paso 5 de Milestone 8 - Autenticación Backend*

