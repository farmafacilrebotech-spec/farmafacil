# 🔌 6.1 Conexión Inicial con Supabase

## 📋 Pasos Implementados

### Paso 1: Instalación de dependencias

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

**Propósito**: Instalar el SDK oficial de Supabase y los helpers para Next.js que facilitan la autenticación.

---

### Paso 2: Crear proyecto en Supabase

1. Acceder a [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Obtener credenciales:
   - `SUPABASE_URL`: URL del proyecto
   - `SUPABASE_ANON_KEY`: Clave pública anónima
   - `SUPABASE_SERVICE_ROLE_KEY`: Clave de servicio (solo backend)

---

### Paso 3: Configurar variables de entorno

**Archivo**: `.env.local`

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# Solo para operaciones de servidor
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

---

### Paso 4: Crear cliente de conexión

**Archivo**: `lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno de Supabase')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})
```

---

### Paso 5: Verificar conexión

**Test de conexión**:

```typescript
// En cualquier componente o API route
import { supabase } from '@/lib/supabase'

async function testConnection() {
  const { data, error } = await supabase
    .from('farmacias')
    .select('count')
    .limit(1)
  
  if (error) {
    console.error('Error de conexión:', error)
    return false
  }
  
  console.log('Conexión exitosa')
  return true
}
```

---

## 🔄 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS APP                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐      ┌─────────────────────────────┐  │
│  │  Client         │      │  lib/supabase.ts            │  │
│  │  Components     │─────▶│  createClient()             │  │
│  └─────────────────┘      └─────────────┬───────────────┘  │
│                                         │                   │
│  ┌─────────────────┐      ┌─────────────▼───────────────┐  │
│  │  Server         │      │  lib/supabase-server.ts     │  │
│  │  Components     │─────▶│  createServerSupabase()     │  │
│  └─────────────────┘      └─────────────────────────────┘  │
│                                         │                   │
└─────────────────────────────────────────┼───────────────────┘
                                          │
                                          ▼
                              ┌───────────────────────┐
                              │      SUPABASE         │
                              │   ┌───────────────┐   │
                              │   │   Database    │   │
                              │   ├───────────────┤   │
                              │   │     Auth      │   │
                              │   ├───────────────┤   │
                              │   │   Storage     │   │
                              │   └───────────────┘   │
                              └───────────────────────┘
```

---

## ✅ Checklist

- [x] Dependencias instaladas
- [x] Proyecto creado en Supabase
- [x] Variables de entorno configuradas
- [x] Cliente de conexión creado
- [x] Conexión verificada

---

*Paso 1 de Milestone 6 - Configuración Supabase*

