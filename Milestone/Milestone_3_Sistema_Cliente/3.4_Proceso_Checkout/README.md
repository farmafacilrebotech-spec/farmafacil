# 💳 Milestone 3.4: Proceso de Checkout

## 📑 Índice de Pasos

1. [Paso 1: Estructura del checkout](#paso-1-estructura-del-checkout)
2. [Paso 2: Formulario de datos](#paso-2-formulario-de-datos)
3. [Paso 3: Métodos de pago](#paso-3-métodos-de-pago)
4. [Paso 4: Resumen del pedido](#paso-4-resumen-del-pedido)
5. [Paso 5: Procesamiento del pedido](#paso-5-procesamiento-del-pedido)

---

## Paso 1: Estructura del checkout

### Descripción
Diseño de la estructura de la página de checkout.

### Archivo: `app/checkout/page.tsx`
```typescript
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/use-cart'
import { sessionManager } from '@/lib/sessionManager'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ShoppingBag, CreditCard, Truck } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, isEmpty, clear } = useCart()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Datos, 2: Pago, 3: Confirmar

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigo_postal: '',
    notas: ''
  })

  const [paymentMethod, setPaymentMethod] = useState('tarjeta')

  useEffect(() => {
    const currentSession = sessionManager.getSession()
    if (!currentSession) {
      router.push('/login-cliente?from=/checkout')
      return
    }
    setSession(currentSession)
    // Pre-rellenar datos del usuario
    setFormData(prev => ({
      ...prev,
      nombre: currentSession.nombre || ''
    }))
  }, [router])

  // Redirigir si carrito vacío
  useEffect(() => {
    if (isEmpty) {
      router.push('/catalogo')
    }
  }, [isEmpty, router])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Indicador de pasos */}
        <StepIndicator currentStep={step} />

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Formulario (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <DeliveryForm 
                formData={formData} 
                setFormData={setFormData}
                onNext={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <PaymentForm
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <ConfirmOrder
                formData={formData}
                paymentMethod={paymentMethod}
                onBack={() => setStep(2)}
                onConfirm={handleConfirm}
                loading={loading}
              />
            )}
          </div>

          {/* Resumen (1/3) */}
          <div>
            <OrderSummary items={items} total={total} />
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Pasos del checkout
```
┌───────────┐     ┌───────────┐     ┌───────────┐
│  Paso 1   │────►│  Paso 2   │────►│  Paso 3   │
│  Datos    │     │   Pago    │     │ Confirmar │
│  Envío    │     │           │     │           │
└───────────┘     └───────────┘     └───────────┘
```

### Resultado
✅ Estructura de checkout en pasos

---

## Paso 2: Formulario de datos

### Descripción
Formulario para datos de envío del cliente.

### Implementación
```typescript
function DeliveryForm({ formData, setFormData, onNext }) {
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio'
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio'
    } else if (!/^[0-9]{9}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener 9 dígitos'
    }
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es obligatoria'
    }
    if (!formData.ciudad.trim()) {
      newErrors.ciudad = 'La ciudad es obligatoria'
    }
    if (!formData.codigo_postal.trim()) {
      newErrors.codigo_postal = 'El código postal es obligatorio'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onNext()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Datos de Envío
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className={errors.nombre ? 'border-red-500' : ''}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className={errors.telefono ? 'border-red-500' : ''}
              />
              {errors.telefono && (
                <p className="text-sm text-red-500">{errors.telefono}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección de envío *</Label>
            <Input
              id="direccion"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              placeholder="Calle, número, piso, puerta"
              className={errors.direccion ? 'border-red-500' : ''}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad *</Label>
              <Input
                id="ciudad"
                value={formData.ciudad}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigo_postal">Código Postal *</Label>
              <Input
                id="codigo_postal"
                value={formData.codigo_postal}
                onChange={(e) => setFormData({ ...formData, codigo_postal: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas (opcional)</Label>
            <Textarea
              id="notas"
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              placeholder="Instrucciones especiales de entrega..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full bg-[#1ABBB3]">
            Continuar al Pago
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

### Resultado
✅ Formulario de datos de envío

---

## Paso 3: Métodos de pago

### Descripción
Selección del método de pago (preparado para integración).

### Implementación
```typescript
function PaymentForm({ paymentMethod, setPaymentMethod, onNext, onBack }) {
  const methods = [
    {
      id: 'tarjeta',
      name: 'Tarjeta de crédito/débito',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'bizum',
      name: 'Bizum',
      icon: Smartphone,
      description: 'Pago instantáneo desde tu móvil'
    },
    {
      id: 'contrareembolso',
      name: 'Contra reembolso',
      icon: Wallet,
      description: 'Paga al recibir tu pedido (+2€)'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Método de Pago
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={paymentMethod} 
          onValueChange={setPaymentMethod}
          className="space-y-4"
        >
          {methods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === method.id 
                  ? 'border-[#1ABBB3] bg-[#1ABBB3]/5' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setPaymentMethod(method.id)}
            >
              <RadioGroupItem value={method.id} id={method.id} />
              <Label 
                htmlFor={method.id} 
                className="flex items-center gap-4 cursor-pointer flex-1 ml-4"
              >
                <div className="p-2 bg-gray-100 rounded-lg">
                  <method.icon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{method.name}</p>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {/* Formulario de tarjeta (si seleccionado) */}
        {paymentMethod === 'tarjeta' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-4">
              Los datos de pago se procesarán de forma segura
            </p>
            {/* Aquí iría la integración con Stripe */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Número de tarjeta</Label>
                <Input placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha de expiración</Label>
                  <Input placeholder="MM/AA" />
                </div>
                <div className="space-y-2">
                  <Label>CVC</Label>
                  <Input placeholder="123" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Volver
          </Button>
          <Button onClick={onNext} className="flex-1 bg-[#1ABBB3]">
            Revisar Pedido
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Resultado
✅ Selección de métodos de pago

---

## Paso 4: Resumen del pedido

### Descripción
Panel lateral con el resumen del pedido.

### Implementación
```typescript
function OrderSummary({ items, total }) {
  const shipping = 0 // Envío gratuito por ahora
  const finalTotal = total + shipping

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Resumen del Pedido
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Lista de productos */}
        <div className="space-y-4 max-h-64 overflow-auto">
          {items.map((item) => (
            <div key={item.producto_id} className="flex gap-3">
              <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={item.imagen_url || '/images/placeholder-product.png'}
                  alt={item.nombre}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{item.nombre}</p>
                <p className="text-xs text-gray-500">
                  {item.cantidad} x {item.precio.toFixed(2)}€
                </p>
              </div>
              <p className="font-medium text-sm">
                {(item.cantidad * item.precio).toFixed(2)}€
              </p>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Totales */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span>{total.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Envío</span>
            <span className="text-green-600">
              {shipping === 0 ? 'Gratis' : `${shipping.toFixed(2)}€`}
            </span>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{finalTotal.toFixed(2)}€</span>
        </div>

        {/* Info adicional */}
        <div className="mt-6 p-3 bg-green-50 rounded-lg text-sm text-green-700">
          <p className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Envío gratuito en pedidos +30€
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Resultado
✅ Resumen del pedido visible

---

## Paso 5: Procesamiento del pedido

### Descripción
Lógica para procesar y crear el pedido en la base de datos.

### Implementación
```typescript
const handleConfirm = async () => {
  setLoading(true)

  try {
    // Agrupar items por farmacia
    const itemsByFarmacia = items.reduce((acc, item) => {
      if (!acc[item.farmacia_id]) {
        acc[item.farmacia_id] = []
      }
      acc[item.farmacia_id].push(item)
      return acc
    }, {})

    // Crear un pedido por farmacia
    for (const [farmaciaId, farmaciaItems] of Object.entries(itemsByFarmacia)) {
      const farmaciaTotal = farmaciaItems.reduce(
        (sum, item) => sum + item.precio * item.cantidad,
        0
      )

      // Crear pedido
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          cliente_id: session.id,
          farmacia_id: farmaciaId,
          total: farmaciaTotal,
          estado: 'pendiente',
          direccion_envio: `${formData.direccion}, ${formData.ciudad}, ${formData.codigo_postal}`,
          notas: formData.notas || null
        })
        .select()
        .single()

      if (pedidoError) throw pedidoError

      // Crear detalles del pedido
      const detalles = farmaciaItems.map((item) => ({
        pedido_id: pedido.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        subtotal: item.precio * item.cantidad
      }))

      const { error: detallesError } = await supabase
        .from('detalles_pedido')
        .insert(detalles)

      if (detallesError) throw detallesError

      // Actualizar stock de productos
      for (const item of farmaciaItems) {
        await supabase
          .from('productos')
          .update({ 
            stock: supabase.raw(`stock - ${item.cantidad}`)
          })
          .eq('id', item.producto_id)
      }
    }

    // Limpiar carrito
    clear()

    // Mostrar éxito
    toast.success('¡Pedido realizado con éxito!')

    // Redirigir al dashboard
    router.push('/cliente/dashboard')

  } catch (error) {
    console.error('Error al procesar pedido:', error)
    toast.error('Error al procesar el pedido. Por favor, inténtalo de nuevo.')
  } finally {
    setLoading(false)
  }
}
```

### Flujo de procesamiento
```
┌─────────────────┐
│ Confirmar       │
│ Pedido          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Agrupar items   │
│ por farmacia    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Por cada        │
│ farmacia:       │
│ ┌─────────────┐ │
│ │ Crear       │ │
│ │ pedido      │ │
│ └──────┬──────┘ │
│        │        │
│ ┌──────▼──────┐ │
│ │ Crear       │ │
│ │ detalles    │ │
│ └──────┬──────┘ │
│        │        │
│ ┌──────▼──────┐ │
│ │ Actualizar  │ │
│ │ stock       │ │
│ └─────────────┘ │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Limpiar         │
│ carrito         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Redirigir a     │
│ dashboard       │
└─────────────────┘
```

### Resultado
✅ Procesamiento de pedidos funcional

---

## 📁 Archivos Relacionados

| Archivo | Descripción |
|---------|-------------|
| `app/checkout/page.tsx` | Página de checkout |
| `hooks/use-cart.ts` | Hook del carrito |
| `lib/supabaseClient.ts` | Cliente de Supabase |

---

## ✅ Checklist de Completado

- [x] Estructura de checkout en pasos
- [x] Formulario de datos de envío
- [x] Selección de métodos de pago
- [x] Resumen del pedido visible
- [x] Procesamiento de pedido funcional

---

[← Anterior: 3.3 Carrito](../3.3_Sistema_Carrito/README.md) | [Siguiente: 3.5 Historial →](../3.5_Historial_Pedidos/README.md)

