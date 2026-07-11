# 📁 Milestone 1.1: Estructura del Proyecto Next.js

## 📑 Índice de Pasos

1. [Paso 1: Inicialización del proyecto](#paso-1-inicialización-del-proyecto)
2. [Paso 2: Configuración de TypeScript](#paso-2-configuración-de-typescript)
3. [Paso 3: Instalación de dependencias base](#paso-3-instalación-de-dependencias-base)
4. [Paso 4: Estructura de carpetas](#paso-4-estructura-de-carpetas)
5. [Paso 5: Configuración de Tailwind CSS](#paso-5-configuración-de-tailwind-css)

---

## Paso 1: Inicialización del proyecto

### Descripción
Creación del proyecto Next.js 14 con App Router como base del sistema FarmaFácil.

### Comandos ejecutados
```bash
npx create-next-app@latest farmafacil --typescript --tailwind --eslint --app --src-dir=false
```

### Archivos generados
- `package.json` - Configuración de dependencias
- `next.config.js` - Configuración de Next.js
- `tsconfig.json` - Configuración de TypeScript

### Resultado
✅ Proyecto base creado con estructura moderna de Next.js 14

---

## Paso 2: Configuración de TypeScript

### Descripción
Configuración estricta de TypeScript para garantizar tipado seguro en todo el proyecto.

### Archivo: `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Resultado
✅ TypeScript configurado con modo estricto y paths aliases

---

## Paso 3: Instalación de dependencias base

### Descripción
Instalación de todas las dependencias necesarias para el funcionamiento del proyecto.

### Dependencias principales
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x",
    "next": "14.x",
    "react": "^18",
    "react-dom": "^18",
    "lucide-react": "^0.x",
    "class-variance-authority": "^0.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5",
    "tailwindcss": "^3",
    "postcss": "^8",
    "autoprefixer": "^10"
  }
}
```

### Comandos
```bash
npm install @supabase/supabase-js lucide-react class-variance-authority clsx tailwind-merge
```

### Resultado
✅ Todas las dependencias instaladas correctamente

---

## Paso 4: Estructura de carpetas

### Descripción
Organización de carpetas siguiendo las mejores prácticas de Next.js 14.

### Estructura creada
```
FarmaFacil_general/
├── app/                    # App Router (páginas y API routes)
│   ├── api/               # API Routes
│   ├── cliente/           # Páginas del cliente
│   ├── farmacia/          # Páginas de farmacia
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes ShadCN
│   ├── common/           # Componentes comunes
│   ├── cart/             # Componentes del carrito
│   └── assistants/       # Componentes del asistente
├── lib/                   # Utilidades y configuraciones
├── hooks/                 # Custom hooks de React
├── public/               # Archivos estáticos
│   ├── images/           # Imágenes
│   └── demo/             # Datos de demostración
└── supabase/             # Migraciones de Supabase
    └── migrations/       # Scripts SQL
```

### Resultado
✅ Estructura de carpetas organizada y escalable

---

## Paso 5: Configuración de Tailwind CSS

### Descripción
Configuración de Tailwind CSS con los colores de la marca FarmaFácil.

### Archivo: `tailwind.config.ts`
```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        farmafacil: {
          primary: '#1ABBB3',
          secondary: '#4ED3C2',
          dark: '#1A1A1A',
          light: '#F7F9FA',
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}

export default config
```

### Archivo: `globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --farmafacil-primary: #1ABBB3;
  --farmafacil-secondary: #4ED3C2;
}
```

### Resultado
✅ Tailwind CSS configurado con variables de marca

---

## 📁 Archivos Relacionados

| Archivo | Descripción |
|---------|-------------|
| `package.json` | Dependencias del proyecto |
| `next.config.js` | Configuración de Next.js |
| `tsconfig.json` | Configuración de TypeScript |
| `tailwind.config.ts` | Configuración de Tailwind |
| `postcss.config.js` | Configuración de PostCSS |

---

## ✅ Checklist de Completado

- [x] Proyecto Next.js inicializado
- [x] TypeScript configurado
- [x] Dependencias instaladas
- [x] Estructura de carpetas creada
- [x] Tailwind CSS configurado

---

[← Volver a Milestone 1](../README.md) | [Siguiente: 1.2 Configuración Supabase →](../1.2_Configuracion_Supabase/README.md)

