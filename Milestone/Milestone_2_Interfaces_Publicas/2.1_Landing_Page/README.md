# 🏠 Milestone 2.1: Página de Inicio (Landing)

## 📑 Índice de Pasos

1. [Paso 1: Estructura de la página](#paso-1-estructura-de-la-página)
2. [Paso 2: Hero Section](#paso-2-hero-section)
3. [Paso 3: Sección de beneficios](#paso-3-sección-de-beneficios)
4. [Paso 4: Productos destacados](#paso-4-productos-destacados)
5. [Paso 5: Call to Action (CTA)](#paso-5-call-to-action-cta)

---

## Paso 1: Estructura de la página

### Descripción
Definición de la estructura general de la página de inicio.

### Archivo: `app/page.tsx`
```typescript
import { HeroSection } from '@/components/landing/HeroSection'
import { BenefitsSection } from '@/components/landing/BenefitsSection'
import { FeaturedProducts } from '@/components/landing/FeaturedProducts'
import { CTASection } from '@/components/landing/CTASection'
import { FloatingAssistantButton } from '@/components/assistants/FloatingAssistantButton'
import { CartButton } from '@/components/cart/CartButton'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <BenefitsSection />
      <FeaturedProducts />
      <CTASection />
      
      {/* Botones flotantes */}
      <CartButton />
      <FloatingAssistantButton />
    </div>
  )
}
```

### Secciones definidas
1. **Hero Section** - Banner principal con CTA
2. **Benefits Section** - Ventajas de usar FarmaFácil
3. **Featured Products** - Productos destacados
4. **CTA Section** - Llamada a la acción final

### Resultado
✅ Estructura de landing definida

---

## Paso 2: Hero Section

### Descripción
Banner principal con mensaje de valor y llamadas a la acción.

### Implementación
```typescript
export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#1ABBB3] to-[#4ED3C2] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Contenido */}
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tu farmacia de confianza, ahora online
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Encuentra los productos que necesitas de las mejores 
              farmacias de tu zona, con entrega rápida y segura.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-white text-[#1ABBB3] hover:bg-gray-100"
                asChild
              >
                <Link href="/catalogo">
                  Ver Catálogo
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/register">
                  Registrarse
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Imagen */}
          <div className="hidden md:block">
            <Image
              src="/images/hero-pharmacy.png"
              alt="FarmaFácil"
              width={500}
              height={400}
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
      
      {/* Decoración */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" 
           style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }} 
      />
    </section>
  )
}
```

### Resultado
✅ Hero section con gradiente y CTAs

---

## Paso 3: Sección de beneficios

### Descripción
Presentación de las ventajas de usar la plataforma.

### Implementación
```typescript
import { Truck, Shield, Clock, CreditCard } from 'lucide-react'

const benefits = [
  {
    icon: Truck,
    title: 'Entrega Rápida',
    description: 'Recibe tus productos en menos de 24 horas en tu domicilio.'
  },
  {
    icon: Shield,
    title: 'Compra Segura',
    description: 'Todas las transacciones están protegidas con encriptación SSL.'
  },
  {
    icon: Clock,
    title: 'Disponible 24/7',
    description: 'Realiza tus pedidos cuando quieras, donde quieras.'
  },
  {
    icon: CreditCard,
    title: 'Múltiples Pagos',
    description: 'Paga con tarjeta, Bizum o contra reembolso.'
  }
]

export function BenefitsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir FarmaFácil?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Te ofrecemos la mejor experiencia de compra online para 
            productos de farmacia y parafarmacia.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1ABBB3]/10 text-[#1ABBB3] mb-4">
                <benefit.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### Resultado
✅ 4 beneficios con iconos presentados

---

## Paso 4: Productos destacados

### Descripción
Muestra de productos populares del catálogo.

### Implementación
```typescript
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('productos')
        .select(`
          *,
          farmacias (
            id,
            nombre
          )
        `)
        .eq('activo', true)
        .limit(4)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setProducts(data)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Productos Destacados
          </h2>
          <p className="text-lg text-gray-600">
            Descubre los productos más populares de nuestras farmacias
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-[#1ABBB3] hover:bg-[#158f89]"
            asChild
          >
            <Link href="/catalogo">
              Ver Todo el Catálogo
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
```

### Resultado
✅ Grid de 4 productos destacados con skeleton loading

---

## Paso 5: Call to Action (CTA)

### Descripción
Sección final que invita a registrarse o empezar a comprar.

### Implementación
```typescript
export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          ¿Listo para empezar?
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Únete a miles de usuarios que ya confían en FarmaFácil 
          para sus compras de farmacia.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-[#1ABBB3] hover:bg-[#158f89] text-lg px-8"
            asChild
          >
            <Link href="/register">
              Crear Cuenta Gratis
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white/10 text-lg px-8"
            asChild
          >
            <Link href="/login-farmacia">
              Soy una Farmacia
            </Link>
          </Button>
        </div>

        <p className="text-gray-400 mt-8 text-sm">
          Sin compromisos. Cancela cuando quieras.
        </p>
      </div>
    </section>
  )
}
```

### Resultado
✅ CTA con dos opciones (cliente y farmacia)

---

## 📁 Archivos Relacionados

| Archivo | Descripción |
|---------|-------------|
| `app/page.tsx` | Página principal |
| `components/landing/HeroSection.tsx` | Banner principal |
| `components/landing/BenefitsSection.tsx` | Sección beneficios |
| `components/landing/FeaturedProducts.tsx` | Productos destacados |
| `components/landing/CTASection.tsx` | Call to Action |

---

## ✅ Checklist de Completado

- [x] Estructura de página definida
- [x] Hero Section implementado
- [x] Beneficios presentados
- [x] Productos destacados con carga
- [x] CTA final implementado

---

[← Volver a Milestone 2](../README.md) | [Siguiente: 2.2 Catálogo →](../2.2_Catalogo_Productos/README.md)

