# 📊 6.2 Estructura de Tablas

## 📋 Esquema de Base de Datos

### Diagrama Entidad-Relación

```
┌─────────────────┐       ┌─────────────────┐
│    FARMACIAS    │       │    CLIENTES     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ codigo (UNIQUE) │       │ email (UNIQUE)  │
│ nombre          │       │ nombre          │
│ email           │       │ telefono        │
│ telefono        │       │ direccion       │
│ direccion       │       │ ciudad          │
│ ciudad          │       │ codigo_postal   │
│ codigo_postal   │       │ created_at      │
│ latitud         │       └────────┬────────┘
│ longitud        │                │
│ qr_url          │                │
│ logo_url        │                │
│ activa          │                │
│ created_at      │                │
│ updated_at      │                │
└────────┬────────┘                │
         │                         │
         │ 1:N                     │ 1:N
         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│    PRODUCTOS    │       │     PEDIDOS     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ farmacia_id (FK)│◄──────┤ farmacia_id (FK)│
│ nombre          │       │ cliente_id (FK) │
│ descripcion     │       │ estado          │
│ precio          │       │ total           │
│ stock           │       │ direccion_entrega│
│ categoria       │       │ notas           │
│ imagen_url      │       │ created_at      │
│ codigo_barras   │       │ updated_at      │
│ activo          │       └────────┬────────┘
│ created_at      │                │
│ updated_at      │                │ 1:N
└─────────────────┘                ▼
                          ┌─────────────────┐
                          │  PEDIDO_ITEMS   │
                          ├─────────────────┤
                          │ id (PK)         │
                          │ pedido_id (FK)  │
                          │ producto_id (FK)│
                          │ cantidad        │
                          │ precio_unitario │
                          │ subtotal        │
                          └─────────────────┘
```

---

## 📝 Scripts SQL de Creación

### Tabla `farmacias`

```sql
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

-- Índices para búsquedas frecuentes
CREATE INDEX idx_farmacias_codigo ON farmacias(codigo);
CREATE INDEX idx_farmacias_ciudad ON farmacias(ciudad);
CREATE INDEX idx_farmacias_activa ON farmacias(activa);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER farmacias_updated_at
  BEFORE UPDATE ON farmacias
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### Tabla `productos`

```sql
CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmacia_id UUID REFERENCES farmacias(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  categoria VARCHAR(100),
  imagen_url TEXT,
  codigo_barras VARCHAR(50),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_productos_farmacia ON productos(farmacia_id);
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_activo ON productos(activo);
CREATE INDEX idx_productos_nombre ON productos USING gin(to_tsvector('spanish', nombre));

CREATE TRIGGER productos_updated_at
  BEFORE UPDATE ON productos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### Tabla `clientes`

```sql
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  direccion TEXT,
  ciudad VARCHAR(100),
  codigo_postal VARCHAR(10),
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_clientes_email ON clientes(email);
```

### Tabla `pedidos`

```sql
CREATE TABLE pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id),
  farmacia_id UUID REFERENCES farmacias(id),
  estado VARCHAR(50) DEFAULT 'pendiente' 
    CHECK (estado IN ('pendiente', 'confirmado', 'preparando', 'listo', 'entregado', 'cancelado')),
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  direccion_entrega TEXT,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_farmacia ON pedidos(farmacia_id);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_pedidos_created ON pedidos(created_at DESC);

CREATE TRIGGER pedidos_updated_at
  BEFORE UPDATE ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### Tabla `pedido_items`

```sql
CREATE TABLE pedido_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(10, 2) NOT NULL CHECK (precio_unitario >= 0),
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0)
);

CREATE INDEX idx_pedido_items_pedido ON pedido_items(pedido_id);
```

---

## 🔑 Campo Clave: `codigo` de Farmacia

El campo `codigo` es **fundamental** para el sistema de QR:

```typescript
// Ejemplo de mapeo QR
const farmacia = {
  codigo: 'FARM001',
  nombre: 'Farmacia San Miguel',
  // ...
}

// URL del catálogo generada
const catalogoUrl = `https://farmafacil.app/catalogo/${farmacia.codigo}`

// Esta URL se codifica en el QR
```

---

## ✅ Checklist

- [x] Tabla `farmacias` creada
- [x] Tabla `productos` creada
- [x] Tabla `clientes` creada
- [x] Tabla `pedidos` creada
- [x] Tabla `pedido_items` creada
- [x] Índices optimizados
- [x] Triggers de updated_at
- [x] Constraints de validación

---

*Paso 2 de Milestone 6 - Configuración Supabase*

