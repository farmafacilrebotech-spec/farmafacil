# 📱 7.2 Generación de Códigos QR

## 📋 Implementación con qrcode.react

### Paso 1: Instalación

```bash
npm install qrcode.react
```

---

### Paso 2: Componente QR básico

```tsx
// components/qr/FarmaciaQR.tsx
import { QRCodeSVG } from 'qrcode.react'

interface FarmaciaQRProps {
  url: string
  size?: number
  bgColor?: string
  fgColor?: string
}

export function FarmaciaQR({ 
  url, 
  size = 200, 
  bgColor = '#FFFFFF',
  fgColor = '#1A1A1A'
}: FarmaciaQRProps) {
  return (
    <QRCodeSVG
      value={url}
      size={size}
      level="H"           // Nivel de corrección: L, M, Q, H
      includeMargin={true}
      bgColor={bgColor}
      fgColor={fgColor}
    />
  )
}
```

---

### Paso 3: Niveles de corrección de errores

| Nivel | Recuperación | Uso recomendado |
|-------|--------------|-----------------|
| L     | ~7%          | URLs cortas, sin daño |
| M     | ~15%         | Uso general |
| Q     | ~25%         | Impresión media |
| **H** | **~30%**     | **Impresión, logos** |

Usamos **nivel H** para máxima resistencia a daños en impresión.

---

### Paso 4: QR con logo de farmacia

```tsx
// components/qr/FarmaciaQRWithLogo.tsx
import { QRCodeSVG } from 'qrcode.react'

interface Props {
  url: string
  logoUrl?: string
  size?: number
}

export function FarmaciaQRWithLogo({ url, logoUrl, size = 200 }: Props) {
  return (
    <div className="relative inline-block">
      <QRCodeSVG
        value={url}
        size={size}
        level="H"
        includeMargin={true}
        fgColor="#1A1A1A"
        imageSettings={logoUrl ? {
          src: logoUrl,
          height: size * 0.2,
          width: size * 0.2,
          excavate: true,  // Quita QR detrás del logo
        } : undefined}
      />
    </div>
  )
}
```

---

### Paso 5: Uso en página de selección

**Archivo**: `app/seleccion-farmacia/page.tsx`

```tsx
import { QRCodeSVG } from 'qrcode.react'
import { clienteUrl } from '@/lib/urlBuilder'

// Dentro del modal
{selectedFarmacia && (
  <div className="bg-white p-4 rounded-xl shadow-lg">
    <QRCodeSVG
      value={clienteUrl(selectedFarmacia.codigo)}
      size={200}
      level="H"
      includeMargin={true}
      fgColor="#1A1A1A"
    />
  </div>
)}
```

---

### Paso 6: Exportar QR como imagen

```tsx
// Función para descargar QR
function downloadQR(codigo: string) {
  const svg = document.querySelector(`#qr-${codigo}`) as SVGElement
  if (!svg) return

  // Convertir SVG a Canvas
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const data = new XMLSerializer().serializeToString(svg)
  const img = new Image()
  
  img.onload = () => {
    canvas.width = img.width
    canvas.height = img.height
    ctx?.drawImage(img, 0, 0)
    
    // Descargar
    const link = document.createElement('a')
    link.download = `qr-${codigo}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }
  
  img.src = 'data:image/svg+xml;base64,' + btoa(data)
}
```

---

## 📊 Diagrama de Generación

```
┌─────────────────────────────────────────────────────────────┐
│                  GENERACIÓN DE QR                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1. INPUT                                                  │
│      ┌─────────────────────────────────────────────────┐   │
│      │  codigo = "FARM001"                             │   │
│      │  nombre = "Farmacia San Miguel"                 │   │
│      └─────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│   2. URL BUILDER                                            │
│      ┌─────────────────────────────────────────────────┐   │
│      │  clienteUrl("FARM001")                          │   │
│      │  → "https://farmafacil.app/catalogo/FARM001"    │   │
│      └─────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│   3. QR CODE GENERATION                                     │
│      ┌─────────────────────────────────────────────────┐   │
│      │  <QRCodeSVG                                     │   │
│      │    value={url}                                  │   │
│      │    size={200}                                   │   │
│      │    level="H"                                    │   │
│      │  />                                             │   │
│      └─────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│   4. OUTPUT                                                 │
│      ┌─────────────────────────────────────────────────┐   │
│      │         ┌─────────────────┐                     │   │
│      │         │  █▀▀▀▀▀▀▀▀▀▀█  │                     │   │
│      │         │  █ ▄▄▄▄▄▄▄ █  │                     │   │
│      │         │  █ █▀███▀█ █  │  ← SVG/PNG          │   │
│      │         │  █ ███████ █  │                     │   │
│      │         │  █▄▄▄▄▄▄▄▄▄█  │                     │   │
│      │         └─────────────────┘                     │   │
│      └─────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist

- [x] qrcode.react instalado
- [x] Componente FarmaciaQR creado
- [x] Nivel de corrección H configurado
- [x] Integración en modal de selección
- [ ] Función de descarga implementada
- [ ] QR con logo opcional

---

*Paso 2 de Milestone 7 - Sistema QR Farmacias*

