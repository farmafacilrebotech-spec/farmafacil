# 🛒 10.4 Carrito Inteligente

## 📋 Estado del Carrito

### Context del Carrito

```typescript
// context/CartContext.tsx

import { createContext, useContext, useReducer, ReactNode } from 'react'

interface CartItem {
  id: string
  productoId: string
  nombre: string
  precio: number
  cantidad: number
  imagen?: string
  farmaciaId?: string // Para catálogo específico
}

interface Farmacia {
  id: string
  codigo: string
  nombre: string
  distancia?: number
}

interface CartState {
  items: CartItem[]
  farmaciaAsignada: Farmacia | null
  subtotal: number
  total: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; cantidad: number } }
  | { type: 'SET_FARMACIA'; payload: Farmacia }
  | { type: 'CLEAR_CART' }

const initialState: CartState = {
  items: [],
  farmaciaAsignada: null,
  subtotal: 0,
  total: 0,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        item => item.productoId === action.payload.productoId
      )

      let newItems
      if (existingItem) {
        newItems = state.items.map(item =>
          item.productoId === action.payload.productoId
            ? { ...item, cantidad: item.cantidad + action.payload.cantidad }
            : item
        )
      } else {
        newItems = [...state.items, action.payload]
      }

      const subtotal = newItems.reduce(
        (sum, item) => sum + item.precio * item.cantidad,
        0
      )

      return {
        ...state,
        items: newItems,
        subtotal,
        total: subtotal, // Aquí se podrían añadir gastos de envío
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      const subtotal = newItems.reduce(
        (sum, item) => sum + item.precio * item.cantidad,
        0
      )

      return {
        ...state,
        items: newItems,
        subtotal,
        total: subtotal,
      }
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, cantidad: action.payload.cantidad }
          : item
      )
      const subtotal = newItems.reduce(
        (sum, item) => sum + item.precio * item.cantidad,
        0
      )

      return {
        ...state,
        items: newItems,
        subtotal,
        total: subtotal,
      }
    }

    case 'SET_FARMACIA':
      return {
        ...state,
        farmaciaAsignada: action.payload,
      }

    case 'CLEAR_CART':
      return initialState

    default:
      return state
  }
}

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return context
}
```

---

## 🔄 Flujo del Carrito Inteligente

```
┌─────────────────────────────────────────────────────────────┐
│                CARRITO INTELIGENTE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. AÑADIR PRODUCTOS                                        │
│     ┌─────────────────────────────────────────────────┐    │
│     │  Usuario en /catalogo (genérico)                │    │
│     │  → Click "Añadir al carrito"                    │    │
│     │  → Producto añadido SIN farmacia asignada       │    │
│     └─────────────────────────────────────────────────┘    │
│                           │                                 │
│                           ▼                                 │
│  2. VER CARRITO                                             │
│     ┌─────────────────────────────────────────────────┐    │
│     │  🛒 Tu carrito (3 productos)                    │    │
│     │                                                 │    │
│     │  - Ibuprofeno 400mg      €5.99  x2              │    │
│     │  - Vitamina C 1000mg     €12.50 x1              │    │
│     │  - Tiritas surtidas      €3.99  x1              │    │
│     │                                                 │    │
│     │  Subtotal: €28.47                               │    │
│     │                                                 │    │
│     │  ⚠️ Aún no hay farmacia asignada               │    │
│     │                                                 │    │
│     │  [Continuar comprando] [Ir al checkout]         │    │
│     └─────────────────────────────────────────────────┘    │
│                           │                                 │
│           Click "Ir al checkout"                            │
│                           │                                 │
│                           ▼                                 │
│  3. SOLICITAR UBICACIÓN                                     │
│     ┌─────────────────────────────────────────────────┐    │
│     │  📍 ¿Dónde te encuentras?                       │    │
│     │                                                 │    │
│     │  Necesitamos tu ubicación para encontrar       │    │
│     │  la farmacia más cercana.                       │    │
│     │                                                 │    │
│     │  [Permitir ubicación]                           │    │
│     │  [Introducir código postal]                     │    │
│     └─────────────────────────────────────────────────┘    │
│                           │                                 │
│                           ▼                                 │
│  4. ASIGNAR FARMACIA                                        │
│     ┌─────────────────────────────────────────────────┐    │
│     │  ✅ Farmacia encontrada                         │    │
│     │                                                 │    │
│     │  🏥 Farmacia San Miguel                         │    │
│     │     Calle Mayor 123, Valencia                   │    │
│     │     📍 A 0.45 km de tu ubicación                │    │
│     │                                                 │    │
│     │  [Confirmar] [Elegir otra farmacia]             │    │
│     └─────────────────────────────────────────────────┘    │
│                           │                                 │
│                           ▼                                 │
│  5. FINALIZAR PEDIDO                                        │
│     ┌─────────────────────────────────────────────────┐    │
│     │  Pedido #12345                                  │    │
│     │  Farmacia: San Miguel                           │    │
│     │  Total: €28.47                                  │    │
│     │                                                 │    │
│     │  [Pagar] [Recoger en farmacia]                  │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🖼️ Componente CartButton

```tsx
// components/cart/CartButton.tsx

'use client'

import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'

export default function CartButton() {
  const { state } = useCart()
  const itemCount = state.items.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <Button
      className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg 
                 bg-[#1ABBB3] hover:bg-[#4ED3C2] z-40"
      onClick={() => {/* Abrir modal/drawer del carrito */}}
    >
      <ShoppingCart className="h-6 w-6 text-white" />
      
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white 
                        text-xs font-bold rounded-full h-5 w-5 
                        flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Button>
  )
}
```

---

## ✅ Checklist

- [x] CartContext creado
- [x] useCart hook
- [x] Añadir/quitar items
- [x] Actualizar cantidades
- [ ] Integrar con geolocalización
- [ ] Asignación automática de farmacia
- [ ] UI de confirmación

---

*Paso 4 de Milestone 10 - Catálogo Genérico*

