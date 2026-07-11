# 🗄️ Milestone 1.2: Configuración de Supabase

## 📑 Índice de Pasos

1. [Paso 1: Creación del proyecto Supabase](#paso-1-creación-del-proyecto-supabase)
2. [Paso 2: Configuración de variables de entorno](#paso-2-configuración-de-variables-de-entorno)
3. [Paso 3: Cliente de Supabase](#paso-3-cliente-de-supabase)
4. [Paso 4: Esquema de base de datos](#paso-4-esquema-de-base-de-datos)
5. [Paso 5: Políticas de seguridad RLS](#paso-5-políticas-de-seguridad-rls)

---

## Paso 1: Creación del proyecto Supabase

### Descripción
Creación de un nuevo proyecto en Supabase para gestionar la base de datos y autenticación.

### Pasos realizados
1. Acceder a [supabase.com](https://supabase.com)
2. Crear nuevo proyecto "FarmaFacil"
3. Seleccionar región más cercana (EU West)
4. Obtener credenciales del proyecto

### Datos del proyecto
- **URL del proyecto:** `https://[PROJECT_ID].supabase.co`
- **Anon Key:** Clave pública para cliente
- **Service Role Key:** Clave privada para servidor

### Resultado
✅ Proyecto Supabase creado y activo

---

## Paso 2: Configuración de variables de entorno

### Descripción
Configuración segura de las credenciales de Supabase usando variables de entorno.

### Archivo: `.env.local`
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI (para asistente IA)
OPENAI_API_KEY=sk-...

# Stripe (para pagos futuros)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
```

### Archivo: `.env.example`
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

### Seguridad
- ✅ `.env.local` añadido a `.gitignore`
- ✅ Solo variables `NEXT_PUBLIC_*` expuestas al cliente

### Resultado
✅ Variables de entorno configuradas de forma segura

---

## Paso 3: Cliente de Supabase

### Descripción
Creación del cliente de Supabase para conectar desde la aplicación.

### Archivo: `lib/supabaseClient.ts`
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de la base de datos
export type Database = {
  public: {
    Tables: {
      farmacias: {
        Row: {
          id: string
          nombre: string
          email: string
          telefono: string
          direccion: string
          ciudad: string
          created_at: string
        }
      }
      clientes: {
        Row: {
          id: string
          nombre: string
          email: string
          telefono: string
          created_at: string
        }
      }
      productos: {
        Row: {
          id: string
          farmacia_id: string
          nombre: string
          descripcion: string
          precio: number
          stock: number
          imagen_url: string
          categoria: string
        }
      }
      pedidos: {
        Row: {
          id: string
          cliente_id: string
          farmacia_id: string
          fecha: string
          total: number
          estado: string
        }
      }
    }
  }
}
```

### Uso en componentes
```typescript
import { supabase } from '@/lib/supabaseClient'

// Ejemplo de consulta
const { data, error } = await supabase
  .from('productos')
  .select('*')
  .eq('farmacia_id', farmaciaId)
```

### Resultado
✅ Cliente de Supabase configurado y tipado

---

## Paso 4: Esquema de base de datos

### Descripción
Creación del esquema de la base de datos con todas las tablas necesarias.

### Archivo: `supabase/migrations/20251106094343_create_farmafacil_schema.sql`
```sql
-- Tabla de farmacias
CREATE TABLE farmacias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  whatsapp VARCHAR(20),
  direccion TEXT,
  ciudad VARCHAR(100),
  codigo_postal VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de clientes
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  direccion TEXT,
  ciudad VARCHAR(100),
  codigo_postal VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmacia_id UUID REFERENCES farmacias(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  imagen_url TEXT,
  categoria VARCHAR(100),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pedidos
CREATE TABLE pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id),
  farmacia_id UUID REFERENCES farmacias(id),
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total DECIMAL(10,2) NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente',
  direccion_envio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de detalles de pedido
CREATE TABLE detalles_pedido (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- Tabla de conversaciones del asistente
CREATE TABLE conversaciones_asistente (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmacia_id UUID REFERENCES farmacias(id),
  cliente_id UUID REFERENCES clientes(id),
  mensaje_usuario TEXT NOT NULL,
  respuesta_ia TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX idx_productos_farmacia ON productos(farmacia_id);
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_farmacia ON pedidos(farmacia_id);
CREATE INDEX idx_conversaciones_farmacia ON conversaciones_asistente(farmacia_id);
```

### Resultado
✅ Esquema de base de datos creado con relaciones

---

## Paso 5: Políticas de seguridad RLS

### Descripción
Configuración de Row Level Security para proteger los datos.

### Políticas implementadas
```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE farmacias ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Política: Las farmacias solo ven sus productos
CREATE POLICY "Farmacias ven sus productos" ON productos
  FOR SELECT
  USING (farmacia_id = auth.uid()::uuid);

-- Política: Productos públicos para catálogo
CREATE POLICY "Productos públicos visibles" ON productos
  FOR SELECT
  USING (activo = true);

-- Política: Clientes ven sus pedidos
CREATE POLICY "Clientes ven sus pedidos" ON pedidos
  FOR SELECT
  USING (cliente_id = auth.uid()::uuid);

-- Política: Farmacias ven pedidos de su farmacia
CREATE POLICY "Farmacias ven sus pedidos" ON pedidos
  FOR SELECT
  USING (farmacia_id = auth.uid()::uuid);
```

### Resultado
✅ Políticas RLS configuradas para seguridad de datos

---

## 📁 Archivos Relacionados

| Archivo | Descripción |
|---------|-------------|
| `lib/supabaseClient.ts` | Cliente de Supabase |
| `.env.local` | Variables de entorno |
| `supabase/migrations/*.sql` | Migraciones de BD |

---

## ✅ Checklist de Completado

- [x] Proyecto Supabase creado
- [x] Variables de entorno configuradas
- [x] Cliente de Supabase implementado
- [x] Esquema de base de datos creado
- [x] Políticas RLS configuradas

---

[← Anterior: 1.1 Estructura](../1.1_Estructura_Proyecto/README.md) | [Siguiente: 1.3 Autenticación →](../1.3_Sistema_Autenticacion/README.md)

