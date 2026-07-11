# 🛡️ 8.4 Middleware de Protección

## 📋 Middleware Actual

**Archivo**: `middleware.ts`

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas que requieren autenticación de farmacia
const PROTECTED_FARMACIA_ROUTES = [
  '/farmacia/dashboard',
  '/farmacia/productos',
  '/farmacia/pedidos',
  '/farmacia/configuracion',
]

// Rutas que requieren autenticación de cliente
const PROTECTED_CLIENTE_ROUTES = [
  '/cliente/dashboard',
  '/cliente/pedidos',
  '/cliente/perfil',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar rutas de farmacia
  if (PROTECTED_FARMACIA_ROUTES.some(route => pathname.startsWith(route))) {
    const farmaciaSession = request.cookies.get('farmacia_session')
    
    if (!farmaciaSession) {
      return NextResponse.redirect(new URL('/login-farmacia', request.url))
    }
  }

  // Verificar rutas de cliente
  if (PROTECTED_CLIENTE_ROUTES.some(route => pathname.startsWith(route))) {
    const clienteSession = request.cookies.get('cliente_session')
    
    if (!clienteSession) {
      return NextResponse.redirect(new URL('/login-cliente', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/farmacia/:path*',
    '/cliente/:path*',
  ]
}
```

---

## 📋 Middleware con Supabase (Objetivo)

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const FARMACIA_ROUTES = ['/farmacia']
const CLIENTE_ROUTES = ['/cliente', '/seleccion-farmacia']
const PUBLIC_ROUTES = ['/', '/catalogo', '/contacto', '/login', '/register']

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  
  // Obtener sesión (esto también refresca el token si es necesario)
  const { data: { session } } = await supabase.auth.getSession()
  
  const { pathname } = request.nextUrl

  // Rutas públicas - permitir siempre
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return res
  }

  // Sin sesión - redirigir a login
  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verificar tipo de usuario para rutas específicas
  const userType = session.user.user_metadata?.tipo

  // Rutas de farmacia
  if (FARMACIA_ROUTES.some(route => pathname.startsWith(route))) {
    if (userType !== 'farmacia') {
      return NextResponse.redirect(new URL('/login-farmacia', request.url))
    }
  }

  // Rutas de cliente
  if (CLIENTE_ROUTES.some(route => pathname.startsWith(route))) {
    if (userType !== 'cliente') {
      return NextResponse.redirect(new URL('/login-cliente', request.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}
```

---

## 🔄 Flujo del Middleware

```
┌─────────────────────────────────────────────────────────────┐
│                    MIDDLEWARE FLOW                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   REQUEST                                                   │
│   GET /farmacia/dashboard                                   │
│       │                                                     │
│       ▼                                                     │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  1. ¿Es ruta pública?                               │  │
│   │     NO → continuar verificación                     │  │
│   └─────────────────────────────────────────────────────┘  │
│       │                                                     │
│       ▼                                                     │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  2. Obtener sesión de cookie                        │  │
│   │     supabase.auth.getSession()                      │  │
│   └─────────────────────────────────────────────────────┘  │
│       │                                                     │
│       ▼                                                     │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  3. ¿Hay sesión válida?                             │  │
│   │     NO → redirect a /login-farmacia                 │  │
│   │     SÍ → verificar tipo de usuario                  │  │
│   └─────────────────────────────────────────────────────┘  │
│       │                                                     │
│       ▼                                                     │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  4. ¿Es farmacia intentando acceder a /farmacia/*? │  │
│   │     NO → redirect a login correspondiente           │  │
│   │     SÍ → permitir acceso                            │  │
│   └─────────────────────────────────────────────────────┘  │
│       │                                                     │
│       ▼                                                     │
│   RESPONSE                                                  │
│   Renderizar /farmacia/dashboard                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Rutas Protegidas

| Ruta | Requiere | Tipo Usuario |
|------|----------|--------------|
| `/` | ❌ No | - |
| `/catalogo/*` | ❌ No | - |
| `/contacto` | ❌ No | - |
| `/farmacia/*` | ✅ Sí | farmacia |
| `/cliente/*` | ✅ Sí | cliente |
| `/seleccion-farmacia` | ✅ Sí | cliente |

---

## ✅ Checklist

- [x] Middleware básico implementado
- [x] Rutas de farmacia protegidas
- [x] Rutas de cliente protegidas
- [x] Redirección a login
- [ ] Integrar con Supabase Auth
- [ ] Verificar tipo de usuario
- [ ] Refresh token en middleware

---

*Paso 4 de Milestone 8 - Autenticación Backend*

