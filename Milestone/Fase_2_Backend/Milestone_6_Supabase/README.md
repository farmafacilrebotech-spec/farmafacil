# 🗄️ Milestone 6: Configuración Supabase

## 📋 Índice de Sub-Milestones

| Sub-Milestone | Descripción | Estado |
|---------------|-------------|--------|
| [6.1 Conexión Inicial](./6.1_Conexion_Inicial/) | Configuración del cliente Supabase | 🟢 Completado |
| [6.2 Estructura Tablas](./6.2_Estructura_Tablas/) | Definición de esquema de base de datos | 🟢 Completado |
| [6.3 Variables Entorno](./6.3_Variables_Entorno/) | Configuración de credenciales | 🟢 Completado |
| [6.4 Row Level Security](./6.4_RLS/) | Políticas de seguridad por fila | 🟡 En progreso |
| [6.5 Helpers y Utilidades](./6.5_Helpers/) | Funciones auxiliares para queries | 🟢 Completado |

---

## 🎯 Objetivo del Milestone

Establecer la **conexión con Supabase** como backend principal de FarmaFácil, configurando:
- Cliente de conexión
- Estructura de tablas
- Seguridad a nivel de fila
- Utilidades para consultas

---

## 📊 Tablas Principales

```sql
-- Tabla de farmacias
CREATE TABLE farmacias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(10) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  direccion TEXT,
  ciudad VARCHAR(100),
  codigo_postal VARCHAR(10),
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  qr_url TEXT,
  logo_url TEXT,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmacia_id UUID REFERENCES farmacias(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  categoria VARCHAR(100),
  imagen_url TEXT,
  codigo_barras VARCHAR(50),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de clientes
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  direccion TEXT,
  ciudad VARCHAR(100),
  codigo_postal VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pedidos
CREATE TABLE pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id),
  farmacia_id UUID REFERENCES farmacias(id),
  estado VARCHAR(50) DEFAULT 'pendiente',
  total DECIMAL(10, 2) NOT NULL,
  direccion_entrega TEXT,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de items de pedido
CREATE TABLE pedido_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL
);
```

---

## 📁 Archivos Principales

### `lib/supabase.ts` - Cliente de conexión

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### `lib/supabase-server.ts` - Cliente para Server Components

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createServerSupabase = () => {
  return createServerComponentClient({ cookies })
}
```

---

## ✅ Checklist de Completado

- [x] Crear proyecto en Supabase
- [x] Configurar variables de entorno
- [x] Crear cliente de conexión
- [x] Definir esquema de tablas
- [ ] Implementar RLS completo
- [x] Crear funciones helper
- [x] Documentar estructura

---

*Sub-milestone de Fase 2 Backend*

