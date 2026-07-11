# 🛒 Milestone 3.3: Sistema de Carrito

## 📑 Índice de Pasos

1. [Paso 1: Librería del carrito](#paso-1-librería-del-carrito)
2. [Paso 2: Hook use-cart](#paso-2-hook-use-cart)
3. [Paso 3: Botón flotante del carrito](#paso-3-botón-flotante-del-carrito)
4. [Paso 4: Sidebar del carrito](#paso-4-sidebar-del-carrito)
5. [Paso 5: Sincronización y eventos](#paso-5-sincronización-y-eventos)

---

## Paso 1: Librería del carrito

### Descripción
Funciones de gestión del carrito con almacenamiento en localStorage.

### Archivo: `lib/cart.ts`
```typescript
// Interfaz del item del carrito
export interface CartItem {
  producto_id: string
  nombre: string
  precio: number
  cantidad: number
  imagen_url?: string
  farmacia_id: string
  farmacia_nombre?: string
  stock: number
}

const CART_KEY = 'farmafacil_cart'

// Obtener carrito
export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  
  try {
    const cart = localStorage.getItem(CART_KEY)
    return cart ? JSON.parse(cart) : []
  } catch {
    return []
  }
}

// Guardar carrito
function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  // Disparar evento para sincronizar UI
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }))
}

// Añadir al carrito
export function addToCart(item: CartItem): void {
  const cart = getCart()
  
  // Buscar si ya existe
  const existingIndex = cart.findIndex(
    (i) => i.producto_id === item.producto_id
  )

  if (existingIndex > -1) {
    // Actualizar cantidad (sin superar stock)
    const newQuantity = Math.min(
      cart[existingIndex].cantidad + item.cantidad,
      item.stock
    )
    cart[existingIndex].cantidad = newQuantity
  } else {
    // Añadir nuevo item
    cart.push(item)
  }

  saveCart(cart)
}

// Eliminar del carrito
export function removeFromCart(productoId: string): void {
  const cart = getCart()
  const newCart = cart.filter((item) => item.producto_id !== productoId)
  saveCart(newCart)
}

// Actualizar cantidad
export function updateCartItemQuantity(
  productoId: string, 
  cantidad: number
): void {
  const cart = getCart()
  const index = cart.findIndex((item) => item.producto_id === productoId)
  
  if (index > -1) {
    if (cantidad <= 0) {
      // Eliminar si cantidad es 0 o menor
      cart.splice(index, 1)
    } else {
      // Actualizar cantidad (sin superar stock)
      cart[index].cantidad = Math.min(cantidad, cart[index].stock)
    }
    saveCart(cart)
  }
}

// Vaciar carrito
export function clearCart(): void {
  saveCart([])
}

// Obtener total
export function getCartTotal(): number {
  const cart = getCart()
  return cart.reduce((total, item) => total + item.precio * item.cantidad, 0)
}

// Contar items
export function getCartItemCount(): number {
  const cart = getCart()
  return cart.reduce((count, item) => count + item.cantidad, 0)
}

// Obtener farmacias en el carrito
export function getCartFarmacias(): string[] {
  const cart = getCart()
  return [...new Set(cart.map((item) => item.farmacia_id))]
}
```

### Funciones disponibles
| Función | Descripción |
|---------|-------------|
| `getCart()` | Obtiene todo el carrito |
| `addToCart(item)` | Añade o actualiza item |
| `removeFromCart(id)` | Elimina item |
| `updateCartItemQuantity(id, qty)` | Actualiza cantidad |
| `clearCart()` | Vacía el carrito |
| `getCartTotal()` | Calcula total |
| `getCartItemCount()` | Cuenta items |

### Resultado
✅ Librería del carrito implementada

---

## Paso 2: Hook use-cart

### Descripción
Hook de React para gestionar el estado del carrito de forma reactiva.

### Archivo: `hooks/use-cart.ts`
```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  getCart, 
  addToCart as addToCartLib, 
  removeFromCart as removeFromCartLib,
  updateCartItemQuantity as updateQuantityLib,
  clearCart as clearCartLib,
  getCartTotal,
  getCartItemCount,
  CartItem 
} from '@/lib/cart'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [itemCount, setItemCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  // Actualizar estado desde localStorage
  const refreshCart = useCallback(() => {
    setItems(getCart())
    setTotal(getCartTotal())
    setItemCount(getCartItemCount())
  }, [])

  // Cargar carrito inicial y escuchar cambios
  useEffect(() => {
    refreshCart()

    const handleCartUpdate = () => {
      refreshCart()
    }

    const handleOpenCart = () => {
      setIsOpen(true)
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    window.addEventListener('openCart', handleOpenCart)

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
      window.removeEventListener('openCart', handleOpenCart)
    }
  }, [refreshCart])

  // Añadir item
  const addItem = useCallback((item: CartItem) => {
    addToCartLib(item)
    refreshCart()
  }, [refreshCart])

  // Eliminar item
  const removeItem = useCallback((productoId: string) => {
    removeFromCartLib(productoId)
    refreshCart()
  }, [refreshCart])

  // Actualizar cantidad
  const updateQuantity = useCallback((productoId: string, cantidad: number) => {
    updateQuantityLib(productoId, cantidad)
    refreshCart()
  }, [refreshCart])

  // Vaciar carrito
  const clear = useCallback(() => {
    clearCartLib()
    refreshCart()
  }, [refreshCart])

  // Abrir/cerrar carrito
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), [])

  return {
    items,
    total,
    itemCount,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    openCart,
    closeCart,
    toggleCart,
    isEmpty: items.length === 0
  }
}
```

### Uso del hook
```typescript
import { useCart } from '@/hooks/use-cart'

function Component() {
  const { 
    items, 
    total, 
    itemCount, 
    addItem, 
    removeItem,
    isOpen,
    openCart 
  } = useCart()

  return (
    <>
      <span>Items: {itemCount}</span>
      <span>Total: {total.toFixed(2)}€</span>
    </>
  )
}
```

### Resultado
✅ Hook reactivo del carrito

---

## Paso 3: Botón flotante del carrito

### Descripción
Botón flotante que muestra el contador de items y abre el carrito.

### Archivo: `components/cart/CartButton.tsx`
```typescript
'use client'

import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { CartSidebar } from './CartSidebar'

export function CartButton() {
  const { itemCount, isOpen, openCart, closeCart } = useCart()

  return (
    <>
      {/* Botón flotante */}
      <Button
        onClick={openCart}
        className="fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full bg-[#1ABBB3] hover:bg-[#158f89] shadow-lg"
        size="icon"
      >
        <ShoppingCart className="h-6 w-6" />
        
        {/* Badge contador */}
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </Button>

      {/* Sidebar del carrito */}
      <CartSidebar isOpen={isOpen} onClose={closeCart} />
    </>
  )
}
```

### Estilos del botón
```css
/* Posición y animación */
.cart-button {
  position: fixed;
  bottom: 5rem;
  right: 1rem;
  z-index: 40;
  transition: transform 0.2s ease-in-out;
}

.cart-button:hover {
  transform: scale(1.05);
}

/* Badge de contador */
.cart-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

### Resultado
✅ Botón flotante con contador

---

## Paso 4: Sidebar del carrito

### Descripción
Panel lateral deslizante con el contenido del carrito.

### Archivo: `components/cart/CartSidebar.tsx`
```typescript
'use client'

import { useCart } from '@/hooks/use-cart'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, total, removeItem, updateQuantity, isEmpty } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Tu Carrito
            <span className="text-sm font-normal text-gray-500">
              ({items.length} productos)
            </span>
          </SheetTitle>
        </SheetHeader>

        {isEmpty ? (
          <EmptyCart onClose={onClose} />
        ) : (
          <>
            {/* Lista de productos */}
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <CartItem
                    key={item.producto_id}
                    item={item}
                    onRemove={() => removeItem(item.producto_id)}
                    onUpdateQuantity={(qty) => 
                      updateQuantity(item.producto_id, qty)
                    }
                  />
                ))}
              </div>
            </ScrollArea>

            <Separator />

            {/* Footer con total y checkout */}
            <div className="pt-4 space-y-4">
              <div className="flex justify-between text-lg">
                <span className="font-medium">Total</span>
                <span className="font-bold">{total.toFixed(2)}€</span>
              </div>

              <Button 
                asChild
                className="w-full bg-[#1ABBB3] hover:bg-[#158f89]"
                size="lg"
                onClick={onClose}
              >
                <Link href="/checkout">
                  Proceder al Pago
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={onClose}
              >
                Seguir Comprando
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function CartItem({ item, onRemove, onUpdateQuantity }) {
  return (
    <div className="flex gap-4">
      {/* Imagen */}
      <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        <Image
          src={item.imagen_url || '/images/placeholder-product.png'}
          alt={item.nombre}
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-2">{item.nombre}</h4>
        <p className="text-xs text-gray-500">{item.farmacia_nombre}</p>
        <p className="font-semibold mt-1">{item.precio.toFixed(2)}€</p>
      </div>

      {/* Controles */}
      <div className="flex flex-col items-end justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-red-500"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onUpdateQuantity(item.cantidad - 1)}
            disabled={item.cantidad <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <span className="w-8 text-center text-sm font-medium">
            {item.cantidad}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onUpdateQuantity(item.cantidad + 1)}
            disabled={item.cantidad >= item.stock}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function EmptyCart({ onClose }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
      <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
      <h3 className="font-semibold text-lg mb-2">Tu carrito está vacío</h3>
      <p className="text-gray-500 mb-6">
        Añade productos para empezar a comprar
      </p>
      <Button 
        asChild 
        className="bg-[#1ABBB3] hover:bg-[#158f89]"
        onClick={onClose}
      >
        <Link href="/catalogo">Explorar Catálogo</Link>
      </Button>
    </div>
  )
}
```

### Resultado
✅ Sidebar del carrito funcional

---

## Paso 5: Sincronización y eventos

### Descripción
Sistema de eventos para sincronizar el estado del carrito entre componentes.

### Eventos del sistema
```typescript
// Tipos de eventos
type CartEvents = {
  cartUpdated: CustomEvent<CartItem[]>
  openCart: CustomEvent
  closeCart: CustomEvent
  itemAdded: CustomEvent<CartItem>
  itemRemoved: CustomEvent<string>
}

// Disparar evento de carrito actualizado
function emitCartUpdate(cart: CartItem[]) {
  window.dispatchEvent(
    new CustomEvent('cartUpdated', { detail: cart })
  )
}

// Disparar evento de item añadido (para animaciones)
function emitItemAdded(item: CartItem) {
  window.dispatchEvent(
    new CustomEvent('itemAdded', { detail: item })
  )
}

// Escuchar eventos
useEffect(() => {
  const handleCartUpdate = (event: CustomEvent<CartItem[]>) => {
    console.log('Carrito actualizado:', event.detail)
    setItems(event.detail)
  }

  const handleItemAdded = (event: CustomEvent<CartItem>) => {
    // Animación de añadido
    toast.success(`${event.detail.nombre} añadido al carrito`)
  }

  window.addEventListener('cartUpdated', handleCartUpdate)
  window.addEventListener('itemAdded', handleItemAdded)

  return () => {
    window.removeEventListener('cartUpdated', handleCartUpdate)
    window.removeEventListener('itemAdded', handleItemAdded)
  }
}, [])
```

### Sincronización entre pestañas
```typescript
// Escuchar cambios de localStorage en otras pestañas
useEffect(() => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === CART_KEY) {
      const newCart = event.newValue ? JSON.parse(event.newValue) : []
      setItems(newCart)
      setTotal(calculateTotal(newCart))
      setItemCount(calculateCount(newCart))
    }
  }

  window.addEventListener('storage', handleStorageChange)
  return () => window.removeEventListener('storage', handleStorageChange)
}, [])
```

### Flujo de eventos
```
ProductCard                CartButton              CartSidebar
    │                          │                        │
    │ addToCart()              │                        │
    │─────────────────────────►│                        │
    │                          │                        │
    │ emit('cartUpdated')      │                        │
    │──────────────────────────┼───────────────────────►│
    │                          │                        │
    │                          │ refreshCart()          │
    │                          │◄───────────────────────│
    │                          │                        │
    │                          │ updateBadge()          │
    │                          │                        │
```

### Resultado
✅ Sistema de eventos sincronizado

---

## 📁 Archivos Relacionados

| Archivo | Descripción |
|---------|-------------|
| `lib/cart.ts` | Librería del carrito |
| `hooks/use-cart.ts` | Hook de React |
| `components/cart/CartButton.tsx` | Botón flotante |
| `components/cart/CartSidebar.tsx` | Sidebar del carrito |

---

## ✅ Checklist de Completado

- [x] Librería del carrito con localStorage
- [x] Hook reactivo use-cart
- [x] Botón flotante con contador
- [x] Sidebar deslizante funcional
- [x] Sistema de eventos sincronizado

---

[← Anterior: 3.2 Dashboard](../3.2_Dashboard_Cliente/README.md) | [Siguiente: 3.4 Checkout →](../3.4_Proceso_Checkout/README.md)

