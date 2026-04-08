# FarmaFácil

Aplicación web para **digitalizar la experiencia en farmacia**: catálogo accesible por **QR**, **pedidos**, **panel para la oficina de farmacia**, **asistente con IA** y una **landing** orientada a captar demos. Está pensada para que los clientes consulten y pidan con menos fricción y el equipo farmacéutico recupere tiempo en el mostrador.

---

## Para qué sirve

| Ámbito | Función |
|--------|---------|
| **Público / marketing** | Landing en `/`, página de demo `/demo`, contacto `/contacto` y formulario de solicitud de demo (integración con webhook / Google Sheets). |
| **Cliente final** | Catálogo por farmacia (`/catalogo`, `/catalogo/[codigo]`, `/qr/[codigo]`), carrito, checkout y seguimiento de pedidos. |
| **Farmacia** | Acceso (`/login-farmacia`), panel, gestión de pedidos, conversaciones y catálogo propio. |
| **Administración** | Rutas bajo `/admin` protegidas por Supabase Auth y rol `admin` en la tabla `profiles`. |

En conjunto, el producto comunica valor en la web pública y ofrece herramientas operativas para farmacias y sus clientes.

---

## Cómo está hecha (stack)

- **Next.js 13** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS** + **Radix UI** (componentes en `components/ui/`)
- **Supabase** (base de datos, auth en zona admin)
- **API Routes** en `app/api/` (pedidos, productos, contacto, asistente, citas, etc.)

---

## Cómo ejecutarla en local

Requisitos: **Node.js** (recomendado LTS) y **npm**.

```bash
npm install
cp .env.example .env.local   # si existe ejemplo; si no, crea .env.local a mano
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Otros comandos útiles:

```bash
npm run build      # compilación de producción
npm run start      # sirve el build
npm run lint       # ESLint
npm run typecheck  # TypeScript sin emitir archivos
```

---

## Variables de entorno (resumen)

Configúralas en **`.env.local`** (no las subas al repositorio). Las más habituales:

| Variable | Uso |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima (cliente y middleware admin) |
| `NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL` | Webhook (p. ej. Apps Script) para el formulario de contacto/demo |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 (opcional; el `layout` la referencia si existe) |
| `OPENAI_API_KEY` | Asistente IA (`/api/assistant/chat`) |
| `NEXT_PUBLIC_CLIENTES_URL` / `NEXT_PUBLIC_KIOSKO_URL` | Bases URL para enlaces generados (`lib/urlBuilder.ts`) |
| Variables **WhatsApp** (`WHATSAPP_*`) | Integración opcional de mensajería (`lib/whatsapp-service.ts`) |
| Variables **Google** (`GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_CALENDAR_ID`, `GSHEET_GENERAL_ID`) | Reserva de citas / calendario (`app/api/cita/*`) |

Si falta alguna clave opcional, la parte correspondiente puede no funcionar, pero el resto de la app puede seguir arrancando.

---

## Estructura de rutas relevante

- **`/`** — Landing de producto (componentes en `components/landing/`).
- **`/demo`**, **`/contacto`** — Demo y contacto.
- **`/catalogo`**, **`/catalogo/[codigo]`**, **`/qr/[codigo]`** — Catálogo y acceso por código/QR.
- **`/checkout`**, **`/pedidos/[id]`** — Flujo de compra y detalle de pedido.
- **`/login`**, **`/register`**, **`/login-farmacia`**, **`/login-cliente`** — Entradas de sesión según perfil.
- **`/farmacia/dashboard`**, **`/farmacia/pedidos`**, **`/farmacia/conversaciones`** — Área farmacia.
- **`/cliente/dashboard`** — Área cliente.
- **`/asistente`** — Interfaz del asistente.
- **`/admin`**, **`/admin/farmacias`** — Administración (protegido por middleware + rol admin).

Las **API** están bajo `app/api/` (productos, pedidos, farmacias, contacto, auth, asistente, etc.).

---

## Autenticación y sesiones

- **Admin (`/admin`)**: Supabase Auth; el **middleware** (`middleware.ts`) exige usuario y `profiles.role === "admin"`.
- **Farmacia y cliente**: en gran parte del flujo se usa **sesión en `localStorage`** mediante `lib/sessionManager.ts` (`farmacia_session`, `cliente_session`), además de las pantallas de login propias del proyecto.

---

## Assets de marca

- Logo recomendado: **`public/images/logo/farmafacil-logo.png`** (navbar, footer con fallback si no existe el archivo).

---

## Documentación adicional

- En `public/images/` hay un `README.md` con notas sobre carpetas de imágenes del proyecto.

---

## Licencia y propiedad

Proyecto **privado** (`"private": true` en `package.json`). Los derechos y la marca corresponden a quien opera el producto (p. ej. ReBoTech Solutions / FarmaFácil según vuestra configuración legal).

Si ampliáis integraciones (Sheets, Calendly, WhatsApp, etc.), conviene documentar en este README los enlaces y el propósito de cada webhook o servicio para el resto del equipo.
