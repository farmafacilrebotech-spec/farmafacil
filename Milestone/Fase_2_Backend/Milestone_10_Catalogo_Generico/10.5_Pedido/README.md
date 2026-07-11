# 📦 10.5 Crear Pedido con Farmacia Asignada

## 📋 Estado: Pendiente de Implementación

Este sub-milestone documentará la creación de pedidos cuando el carrito tiene una farmacia asignada automáticamente.

---

## 🎯 Objetivo

Cuando el cliente completa el checkout desde el catálogo genérico:
1. Se ha asignado una farmacia cercana
2. Se crea el pedido en Supabase
3. Se notifica a la farmacia
4. El cliente recibe confirmación

---

## 🔄 Flujo Previsto

```
┌─────────────────────────────────────────────────────────────┐
│                CREAR PEDIDO                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. DATOS DEL CHECKOUT                                      │
│     ┌─────────────────────────────────────────────────┐    │
│     │  {                                              │    │
│     │    cliente: { email, nombre, telefono },        │    │
│     │    farmacia: { id: "xxx", codigo: "FARM001" },  │    │
│     │    items: [                                     │    │
│     │      { productoId, cantidad, precio },          │    │
│     │      ...                                        │    │
│     │    ],                                           │    │
│     │    total: 28.47,                                │    │
│     │    direccionEntrega: "..."                      │    │
│     │  }                                              │    │
│     └─────────────────────────────────────────────────┘    │
│                           │                                 │
│                           ▼                                 │
│  2. API DE PEDIDOS                                          │
│     ┌─────────────────────────────────────────────────┐    │
│     │  POST /api/pedidos                              │    │
│     │  → Validar datos                                │    │
│     │  → Insertar en tabla 'pedidos'                  │    │
│     │  → Insertar en tabla 'pedido_items'             │    │
│     │  → Actualizar stock (opcional)                  │    │
│     └─────────────────────────────────────────────────┘    │
│                           │                                 │
│                           ▼                                 │
│  3. NOTIFICACIÓN A FARMACIA                                 │
│     ┌─────────────────────────────────────────────────┐    │
│     │  → Email a la farmacia                          │    │
│     │  → Notificación en dashboard                    │    │
│     │  → (Opcional) SMS/WhatsApp                      │    │
│     └─────────────────────────────────────────────────┘    │
│                           │                                 │
│                           ▼                                 │
│  4. CONFIRMACIÓN AL CLIENTE                                 │
│     ┌─────────────────────────────────────────────────┐    │
│     │  ✅ Pedido confirmado                           │    │
│     │                                                 │    │
│     │  Número de pedido: #12345                       │    │
│     │  Farmacia: San Miguel                           │    │
│     │  Recogida estimada: 2-4 horas                   │    │
│     │                                                 │    │
│     │  Recibirás un email de confirmación.            │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 API Prevista

```typescript
// app/api/pedidos/route.ts (A IMPLEMENTAR)

import { NextResponse } from 'next/server'
import { createPedido } from '@/lib/supabase-helpers'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    const {
      clienteId,
      farmaciaId,
      items,
      direccionEntrega,
      notas
    } = data

    // Validar que hay farmacia asignada
    if (!farmaciaId) {
      return NextResponse.json({
        success: false,
        error: 'No hay farmacia asignada'
      }, { status: 400 })
    }

    // Crear pedido en Supabase
    const pedido = await createPedido({
      cliente_id: clienteId,
      farmacia_id: farmaciaId,
      items,
      direccion_entrega: direccionEntrega,
      notas
    })

    // TODO: Enviar notificación a farmacia
    // await notifyFarmacia(farmaciaId, pedido)

    // TODO: Enviar confirmación al cliente
    // await sendConfirmationEmail(clienteId, pedido)

    return NextResponse.json({
      success: true,
      pedido
    })

  } catch (error) {
    console.error('Error creando pedido:', error)
    return NextResponse.json({
      success: false,
      error: 'Error al crear pedido'
    }, { status: 500 })
  }
}
```

---

## 📊 Estructura de Datos

### Tabla `pedidos`

```sql
CREATE TABLE pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id),
  farmacia_id UUID REFERENCES farmacias(id),
  estado VARCHAR(50) DEFAULT 'pendiente',
  total DECIMAL(10, 2) NOT NULL,
  direccion_entrega TEXT,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla `pedido_items`

```sql
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

## 📧 Notificaciones (A Implementar)

### Email a Farmacia

```
Asunto: Nuevo pedido #12345

Hola Farmacia San Miguel,

Has recibido un nuevo pedido:

Cliente: Juan García
Email: juan@mail.com
Teléfono: +34 612 345 678

Productos:
- Ibuprofeno 400mg x2 - €11.98
- Vitamina C 1000mg x1 - €12.50
- Tiritas surtidas x1 - €3.99

Total: €28.47

Dirección de entrega: Calle Ejemplo 123, 46001 Valencia

Accede a tu dashboard para gestionar el pedido:
https://farmafacil.app/farmacia/dashboard/pedidos
```

---

## ✅ Checklist

- [ ] API POST /api/pedidos
- [ ] Inserción en Supabase
- [ ] Validación de datos
- [ ] Notificación email a farmacia
- [ ] Confirmación al cliente
- [ ] Página de confirmación
- [ ] Actualización de stock

---

*Paso 5 de Milestone 10 - Catálogo Genérico*

