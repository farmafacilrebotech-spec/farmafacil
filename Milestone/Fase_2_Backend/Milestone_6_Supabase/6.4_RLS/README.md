# 🛡️ 6.4 Row Level Security (RLS)

## 📋 Políticas de Seguridad

### ¿Qué es RLS?

**Row Level Security** permite definir reglas que controlan qué filas puede ver o modificar cada usuario. En Supabase, esto se implementa a nivel de PostgreSQL.

---

## 🔐 Políticas por Tabla

### Tabla `farmacias`

```sql
-- Habilitar RLS
ALTER TABLE farmacias ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede ver farmacias activas
CREATE POLICY "farmacias_public_read" ON farmacias
  FOR SELECT
  USING (activa = true);

-- Política: Solo la farmacia puede modificar sus datos
CREATE POLICY "farmacias_owner_update" ON farmacias
  FOR UPDATE
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Política: Solo la farmacia puede ver sus datos privados
CREATE POLICY "farmacias_owner_all" ON farmacias
  FOR ALL
  USING (auth.uid()::text = id::text);
```

### Tabla `productos`

```sql
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede ver productos activos de farmacias activas
CREATE POLICY "productos_public_read" ON productos
  FOR SELECT
  USING (
    activo = true 
    AND EXISTS (
      SELECT 1 FROM farmacias 
      WHERE farmacias.id = productos.farmacia_id 
      AND farmacias.activa = true
    )
  );

-- Solo la farmacia dueña puede modificar sus productos
CREATE POLICY "productos_owner_all" ON productos
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM farmacias 
      WHERE farmacias.id = productos.farmacia_id 
      AND auth.uid()::text = farmacias.id::text
    )
  );
```

### Tabla `clientes`

```sql
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- El cliente solo ve sus propios datos
CREATE POLICY "clientes_owner_read" ON clientes
  FOR SELECT
  USING (auth.uid()::text = id::text);

-- El cliente solo modifica sus propios datos
CREATE POLICY "clientes_owner_update" ON clientes
  FOR UPDATE
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Insertar solo si es el mismo usuario
CREATE POLICY "clientes_owner_insert" ON clientes
  FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);
```

### Tabla `pedidos`

```sql
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Cliente ve sus propios pedidos
CREATE POLICY "pedidos_cliente_read" ON pedidos
  FOR SELECT
  USING (auth.uid()::text = cliente_id::text);

-- Farmacia ve pedidos dirigidos a ella
CREATE POLICY "pedidos_farmacia_read" ON pedidos
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM farmacias 
      WHERE farmacias.id = pedidos.farmacia_id 
      AND auth.uid()::text = farmacias.id::text
    )
  );

-- Cliente puede crear pedidos
CREATE POLICY "pedidos_cliente_insert" ON pedidos
  FOR INSERT
  WITH CHECK (auth.uid()::text = cliente_id::text);

-- Farmacia puede actualizar estado de sus pedidos
CREATE POLICY "pedidos_farmacia_update" ON pedidos
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM farmacias 
      WHERE farmacias.id = pedidos.farmacia_id 
      AND auth.uid()::text = farmacias.id::text
    )
  );
```

---

## 📊 Diagrama de Permisos

```
┌────────────────────────────────────────────────────────────┐
│                      PERMISOS RLS                          │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  USUARIO ANÓNIMO (sin auth)                               │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ ✅ SELECT farmacias (activas)                        │ │
│  │ ✅ SELECT productos (activos, farmacia activa)       │ │
│  │ ❌ Todo lo demás                                     │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  CLIENTE AUTENTICADO                                       │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ ✅ SELECT/UPDATE sus propios datos en clientes       │ │
│  │ ✅ SELECT/INSERT sus propios pedidos                 │ │
│  │ ✅ SELECT farmacias y productos públicos             │ │
│  │ ❌ Ver datos de otros clientes                       │ │
│  │ ❌ Modificar productos o farmacias                   │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  FARMACIA AUTENTICADA                                      │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ ✅ CRUD completo de sus productos                    │ │
│  │ ✅ UPDATE su perfil de farmacia                      │ │
│  │ ✅ SELECT/UPDATE pedidos dirigidos a ella            │ │
│  │ ❌ Ver datos de otras farmacias                      │ │
│  │ ❌ Ver datos de clientes (solo pedidos)              │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  SERVICE ROLE (backend)                                    │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ ✅ Bypass completo de RLS                            │ │
│  │ ⚠️  SOLO usar desde API routes seguras               │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 🔧 Verificar Políticas

```sql
-- Ver todas las políticas de una tabla
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'farmacias';
```

---

## ✅ Checklist

- [x] RLS habilitado en todas las tablas
- [ ] Políticas de farmacias implementadas
- [ ] Políticas de productos implementadas
- [ ] Políticas de clientes implementadas
- [ ] Políticas de pedidos implementadas
- [ ] Pruebas de seguridad realizadas

---

*Paso 4 de Milestone 6 - Configuración Supabase*

