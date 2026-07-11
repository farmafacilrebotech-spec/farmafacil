# 📏 10.3 Algoritmo de Farmacia Cercana

## 📋 Fórmula Haversine

La fórmula de **Haversine** calcula la distancia entre dos puntos en una esfera (la Tierra) dados sus latitudes y longitudes.

### Implementación

```typescript
// lib/distance.ts

/**
 * Convierte grados a radianes
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Calcula la distancia entre dos puntos geográficos
 * usando la fórmula de Haversine
 * 
 * @param lat1 Latitud del punto 1
 * @param lng1 Longitud del punto 1
 * @param lat2 Latitud del punto 2
 * @param lng2 Longitud del punto 2
 * @returns Distancia en kilómetros
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Radio de la Tierra en km

  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}
```

---

## 🔍 Búsqueda de Farmacia Cercana

```typescript
// lib/farmacia-cercana.ts

import { haversineDistance } from './distance'

interface Farmacia {
  id: string
  codigo: string
  nombre: string
  latitud: number | null
  longitud: number | null
  direccion?: string
}

interface FarmaciaConDistancia extends Farmacia {
  distancia: number // en km
}

/**
 * Encuentra la farmacia más cercana a una ubicación
 */
export function findNearestFarmacia(
  userLat: number,
  userLng: number,
  farmacias: Farmacia[]
): FarmaciaConDistancia | null {
  let nearest: FarmaciaConDistancia | null = null
  let minDistance = Infinity

  for (const farmacia of farmacias) {
    // Saltar farmacias sin coordenadas
    if (!farmacia.latitud || !farmacia.longitud) continue

    const distance = haversineDistance(
      userLat,
      userLng,
      farmacia.latitud,
      farmacia.longitud
    )

    if (distance < minDistance) {
      minDistance = distance
      nearest = {
        ...farmacia,
        distancia: Math.round(distance * 100) / 100, // 2 decimales
      }
    }
  }

  return nearest
}

/**
 * Ordena farmacias por distancia
 */
export function sortFarmaciasByDistance(
  userLat: number,
  userLng: number,
  farmacias: Farmacia[]
): FarmaciaConDistancia[] {
  return farmacias
    .filter(f => f.latitud && f.longitud)
    .map(farmacia => ({
      ...farmacia,
      distancia: haversineDistance(
        userLat,
        userLng,
        farmacia.latitud!,
        farmacia.longitud!
      ),
    }))
    .sort((a, b) => a.distancia - b.distancia)
}

/**
 * Busca farmacias dentro de un radio
 */
export function findFarmaciasInRadius(
  userLat: number,
  userLng: number,
  farmacias: Farmacia[],
  radiusKm: number = 10
): FarmaciaConDistancia[] {
  return sortFarmaciasByDistance(userLat, userLng, farmacias)
    .filter(f => f.distancia <= radiusKm)
}
```

---

## 📊 Visualización del Algoritmo

```
┌─────────────────────────────────────────────────────────────┐
│                ALGORITMO FARMACIA CERCANA                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ENTRADA                                                   │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  userLat: 39.4699                                   │  │
│   │  userLng: -0.3763                                   │  │
│   │  farmacias: [                                       │  │
│   │    { codigo: "FARM001", lat: 39.47, lng: -0.38 },   │  │
│   │    { codigo: "FARM002", lat: 39.48, lng: -0.37 },   │  │
│   │    { codigo: "FARM003", lat: 39.45, lng: -0.40 },   │  │
│   │  ]                                                  │  │
│   └─────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│   CÁLCULO                                                   │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Para cada farmacia:                                │  │
│   │    FARM001: haversine(...) = 0.45 km               │  │
│   │    FARM002: haversine(...) = 1.23 km               │  │
│   │    FARM003: haversine(...) = 3.12 km               │  │
│   └─────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│   RESULTADO                                                 │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  {                                                  │  │
│   │    codigo: "FARM001",                               │  │
│   │    nombre: "Farmacia San Miguel",                   │  │
│   │    distancia: 0.45  ← La más cercana               │  │
│   │  }                                                  │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗺️ Ejemplo Visual

```
                    📍 Usuario (39.47, -0.38)
                         |
         ┌───────────────┼───────────────┐
         │               │               │
     0.45 km         1.23 km         3.12 km
         │               │               │
         ▼               ▼               ▼
    🏥 FARM001      🏥 FARM002      🏥 FARM003
    (más cercana)
```

---

## 🔧 Uso en la Aplicación

```typescript
// En el checkout
import { findNearestFarmacia } from '@/lib/farmacia-cercana'
import { useGeolocation } from '@/hooks/useGeolocation'

function Checkout() {
  const { latitude, longitude } = useGeolocation()
  const [farmaciaAsignada, setFarmaciaAsignada] = useState(null)

  const asignarFarmacia = async () => {
    // Obtener todas las farmacias
    const response = await fetch('/api/farmacias')
    const { farmacias } = await response.json()

    // Encontrar la más cercana
    const cercana = findNearestFarmacia(latitude, longitude, farmacias)

    if (cercana) {
      setFarmaciaAsignada(cercana)
    }
  }
}
```

---

## ✅ Checklist

- [x] Función haversineDistance
- [x] Función findNearestFarmacia
- [x] Función sortFarmaciasByDistance
- [x] Función findFarmaciasInRadius
- [ ] Integración en checkout
- [ ] Tests unitarios

---

*Paso 3 de Milestone 10 - Catálogo Genérico*

