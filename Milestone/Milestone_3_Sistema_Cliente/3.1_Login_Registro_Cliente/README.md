# 🔑 Milestone 3.1: Login y Registro de Cliente

## 📑 Índice de Pasos

1. [Paso 1: Página de registro](#paso-1-página-de-registro)
2. [Paso 2: Página de login](#paso-2-página-de-login)
3. [Paso 3: Validación de formularios](#paso-3-validación-de-formularios)
4. [Paso 4: Manejo de sesión](#paso-4-manejo-de-sesión)
5. [Paso 5: Redirecciones y feedback](#paso-5-redirecciones-y-feedback)

---

## Paso 1: Página de registro

### Descripción
Formulario de registro para nuevos clientes.

### Archivo: `app/register/page.tsx`
```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Loader2, User, Mail, Phone, Lock, MapPin } from 'lucide-react'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigo_postal: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tipo: 'cliente'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrarse')
      }

      toast.success('¡Cuenta creada correctamente!')
      router.push('/login-cliente')

    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Image
            src="//images/logo/farmafacil-logo.png"
            alt="FarmaFácil"
            width={150}
            height={40}
            className="mx-auto mb-4"
          />
          <CardTitle className="text-2xl">Crear cuenta</CardTitle>
          <p className="text-gray-500">Regístrate para empezar a comprar</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campos del formulario */}
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-gray-500 text-center">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login-cliente" className="text-[#1ABBB3] hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
```

### Campos del formulario
| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| Nombre | text | ✅ |
| Email | email | ✅ |
| Contraseña | password | ✅ |
| Confirmar contraseña | password | ✅ |
| Teléfono | tel | ❌ |
| Dirección | text | ❌ |
| Ciudad | text | ❌ |
| Código postal | text | ❌ |

### Resultado
✅ Formulario de registro completo

---

## Paso 2: Página de login

### Descripción
Formulario de inicio de sesión para clientes existentes.

### Archivo: `app/login-cliente/page.tsx`
```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { sessionManager } from '@/lib/sessionManager'

export default function LoginClientePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          tipo: 'cliente'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Credenciales incorrectas')
      }

      // Guardar sesión en cliente
      sessionManager.setSession(data.user)

      toast.success(`¡Bienvenido, ${data.user.nombre}!`)
      router.push('/cliente/dashboard')

    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Image
            src="//images/logo/farmafacil-logo.png"
            alt="FarmaFácil"
            width={150}
            height={40}
            className="mx-auto mb-4"
          />
          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
          <p className="text-gray-500">Accede a tu cuenta de cliente</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={formData.remember}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, remember: !!checked })
                  }
                />
                <Label htmlFor="remember" className="text-sm">
                  Recordarme
                </Label>
              </div>
              <Link 
                href="/recuperar-password" 
                className="text-sm text-[#1ABBB3] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#1ABBB3] hover:bg-[#158f89]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-gray-500 text-center">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-[#1ABBB3] hover:underline">
              Regístrate gratis
            </Link>
          </p>
          
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">o</span>
            </div>
          </div>

          <Link href="/login-farmacia" className="text-sm text-gray-500 hover:text-gray-700">
            Acceso para farmacias →
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
```

### Resultado
✅ Página de login con recordar sesión

---

## Paso 3: Validación de formularios

### Descripción
Sistema de validación completo para los formularios de autenticación.

### Implementación
```typescript
// Validaciones en cliente
const validateRegistration = (data: typeof formData) => {
  const errors: Record<string, string> = {}

  // Nombre
  if (!data.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio'
  } else if (data.nombre.length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres'
  }

  // Email
  if (!data.email.trim()) {
    errors.email = 'El email es obligatorio'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'El email no es válido'
  }

  // Contraseña
  if (!data.password) {
    errors.password = 'La contraseña es obligatoria'
  } else if (data.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres'
  } else if (!/[A-Z]/.test(data.password)) {
    errors.password = 'Debe incluir al menos una mayúscula'
  } else if (!/[0-9]/.test(data.password)) {
    errors.password = 'Debe incluir al menos un número'
  }

  // Confirmar contraseña
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
  }

  // Teléfono (opcional pero si se proporciona, validar)
  if (data.telefono && !/^[0-9]{9}$/.test(data.telefono)) {
    errors.telefono = 'El teléfono debe tener 9 dígitos'
  }

  // Código postal (opcional pero si se proporciona, validar)
  if (data.codigo_postal && !/^[0-9]{5}$/.test(data.codigo_postal)) {
    errors.codigo_postal = 'El código postal debe tener 5 dígitos'
  }

  return errors
}

// Indicador de fortaleza de contraseña
function PasswordStrength({ password }: { password: string }) {
  const getStrength = () => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const strength = getStrength()
  const labels = ['Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte']
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500']

  if (!password) return null

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded ${
              i < strength ? colors[strength - 1] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {labels[strength - 1] || 'Muy débil'}
      </p>
    </div>
  )
}
```

### Resultado
✅ Validación completa con indicador de contraseña

---

## Paso 4: Manejo de sesión

### Descripción
Gestión de la sesión del cliente en cliente y servidor.

### Sincronización cliente-servidor
```typescript
// Después del login exitoso
const handleLoginSuccess = (userData: any) => {
  // 1. Guardar en localStorage (cliente)
  sessionManager.setSession(userData)

  // 2. Cookie ya establecida por el servidor

  // 3. Disparar evento para actualizar UI
  window.dispatchEvent(new Event('sessionChange'))

  // 4. Redirigir
  router.push('/cliente/dashboard')
}

// Hook para verificar sesión
function useSession() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cargar sesión inicial
    const storedSession = sessionManager.getSession()
    setSession(storedSession)
    setLoading(false)

    // Escuchar cambios
    const handleChange = () => {
      setSession(sessionManager.getSession())
    }

    window.addEventListener('sessionChange', handleChange)
    return () => window.removeEventListener('sessionChange', handleChange)
  }, [])

  return { session, loading, isAuthenticated: !!session }
}
```

### Resultado
✅ Sesión sincronizada entre cliente y servidor

---

## Paso 5: Redirecciones y feedback

### Descripción
Sistema de redirecciones inteligentes y feedback al usuario.

### Implementación
```typescript
// Guardar URL de origen para redirigir después del login
const [returnUrl, setReturnUrl] = useState('/cliente/dashboard')

useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  const from = params.get('from')
  if (from) {
    setReturnUrl(from)
  }
}, [])

// Después del login
router.push(returnUrl)

// En middleware - guardar URL de origen
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (!hasSession && isProtectedRoute(pathname)) {
    const loginUrl = new URL('/login-cliente', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }
}

// Mensajes de feedback contextuales
const feedbackMessages = {
  login_required: 'Debes iniciar sesión para continuar',
  session_expired: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo',
  logout_success: 'Has cerrado sesión correctamente',
  register_success: 'Cuenta creada. Ya puedes iniciar sesión',
}

useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  const message = params.get('message')
  if (message && feedbackMessages[message]) {
    toast.info(feedbackMessages[message])
  }
}, [])
```

### Flujo de redirección del cliente
```
┌─────────────────┐
│  Login Cliente  │
│  (email/pass)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Selección     │
│   de Farmacia   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Modal con     │
│   Código QR     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌────────┐
│Escanear│ │  Clic  │
│  QR   │ │ Botón  │
└───┬───┘ └───┬────┘
    │         │
    └────┬────┘
         │
         ▼
┌─────────────────┐
│   Catálogo de   │
│   la Farmacia   │
└─────────────────┘
```

### Flujo de protección de rutas
```
Usuario no autenticado
         │
         ▼
    ┌─────────┐
    │ Intenta │
    │ acceder │
    └────┬────┘
         │
         ▼
┌─────────────────┐
│ Middleware      │
│ detecta no auth │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Redirect a      │
│ /login?from=... │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Login exitoso   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Redirect a URL  │
│ original        │
└─────────────────┘
```

### Resultado
✅ Redirecciones inteligentes con feedback

---

## 📁 Archivos Relacionados

| Archivo | Descripción |
|---------|-------------|
| `app/register/page.tsx` | Página de registro |
| `app/login-cliente/page.tsx` | Página de login |
| `app/seleccion-farmacia/page.tsx` | Selección de farmacia con QR |
| `app/api/auth/register/route.ts` | API de registro |
| `app/api/auth/login/route.ts` | API de login |
| `lib/sessionManager.ts` | Gestión de sesión |
| `lib/urlBuilder.ts` | Generador de URLs |
| `middleware.ts` | Protección de rutas |

---

## ✅ Checklist de Completado

- [x] Formulario de registro implementado
- [x] Formulario de login implementado
- [x] Validación completa
- [x] Manejo de sesión
- [x] Redirecciones y feedback
- [x] Selección de farmacia con QR (ver [Milestone 5.5](../../Milestone_5_Asistente_Avanzado/5.5_Seleccion_Farmacia/README.md))

---

[← Volver a Milestone 3](../README.md) | [Siguiente: 3.2 Dashboard →](../3.2_Dashboard_Cliente/README.md)

