# 📅 9.4 Integración con Calendly

## 📋 Configuración de Calendly

### Paso 1: Crear cuenta en Calendly

1. Ir a [calendly.com](https://calendly.com)
2. Registrarse con email corporativo
3. Configurar zona horaria: Europe/Madrid

---

### Paso 2: Crear evento "Demo FarmaFácil"

**Configuración del evento:**

| Campo | Valor |
|-------|-------|
| Nombre | Demo FarmaFácil |
| Duración | 30 minutos |
| Ubicación | Google Meet / Presencial |
| Disponibilidad | Lun-Vie, 9:00-18:00 |
| Buffer | 15 min entre citas |

---

### Paso 3: Obtener enlace del evento

```
https://calendly.com/farmafacil/bienvenida
                    ▲          ▲
                    │          └── Nombre del evento
                    └── Usuario/organización
```

---

## 📋 Integración en FarmaFácil

### Visualización Condicional

El widget de Calendly solo aparece cuando el usuario selecciona "Soy una farmacia":

```tsx
// app/contacto/page.tsx

{formData.tipoUsuario === "farmacia" && (
  <div className="mt-6 bg-gradient-to-br from-[#4ED3C2] to-[#1ABBB3] rounded-lg p-6 text-white shadow-lg">
    <div className="flex items-start space-x-4">
      <div className="bg-white bg-opacity-20 p-3 rounded-lg">
        <CalendarDays className="h-6 w-6 text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-white mb-2">
          Agenda una cita presencial
        </h3>
        <p className="text-white text-opacity-90 mb-4 text-sm">
          Si eres una farmacia interesada en FarmaFácil, puedes
          reservar una reunión con nuestro equipo.
        </p>
        <a
          href="https://calendly.com/farmafacil/bienvenida"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="secondary"
            className="bg-white text-[#1ABBB3] hover:bg-gray-100"
          >
            Ver calendario
          </Button>
        </a>
      </div>
    </div>
  </div>
)}
```

---

## 🎨 Diseño del Widget

```
┌─────────────────────────────────────────────────────────────┐
│           WIDGET DE CALENDLY (solo farmacias)               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ╔═══════════════════════════════════════════════╗  │   │
│  │  ║  🗓️  Agenda una cita presencial               ║  │   │
│  │  ║                                               ║  │   │
│  │  ║  Si eres una farmacia interesada en           ║  │   │
│  │  ║  FarmaFácil, puedes reservar una reunión      ║  │   │
│  │  ║  con nuestro equipo.                          ║  │   │
│  │  ║                                               ║  │   │
│  │  ║  ┌─────────────────────────────────────────┐  ║  │   │
│  │  ║  │        Ver calendario                   │  ║  │   │
│  │  ║  └─────────────────────────────────────────┘  ║  │   │
│  │  ╚═══════════════════════════════════════════════╝  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Gradiente: from-[#4ED3C2] to-[#1ABBB3]                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo del Usuario

```
┌─────────────────────────────────────────────────────────────┐
│                FLUJO DE RESERVA                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. FORMULARIO DE CONTACTO                                  │
│     ┌─────────────────────────────────────────────────┐    │
│     │  Usuario selecciona "Soy una farmacia"          │    │
│     └─────────────────────────────────────────────────┘    │
│                           │                                 │
│                           ▼                                 │
│  2. APARECE WIDGET CALENDLY                                 │
│     ┌─────────────────────────────────────────────────┐    │
│     │  "Agenda una cita presencial"                   │    │
│     │  [Ver calendario]                               │    │
│     └─────────────────────────────────────────────────┘    │
│                           │                                 │
│            Click en "Ver calendario"                        │
│                           │                                 │
│                           ▼                                 │
│  3. CALENDLY (nueva pestaña)                                │
│     ┌─────────────────────────────────────────────────┐    │
│     │  Demo FarmaFácil                                │    │
│     │  30 minutos                                     │    │
│     │                                                 │    │
│     │  Selecciona fecha y hora:                       │    │
│     │  ┌─────────────────────────────────────────┐   │    │
│     │  │  Diciembre 2024                         │   │    │
│     │  │  Lu Ma Mi Ju Vi Sa Do                   │   │    │
│     │  │     ... 17 18 19 20 ...                 │   │    │
│     │  └─────────────────────────────────────────┘   │    │
│     │                                                 │    │
│     │  Horas disponibles:                             │    │
│     │  [09:00] [09:30] [10:00] [10:30] ...            │    │
│     └─────────────────────────────────────────────────┘    │
│                           │                                 │
│                           ▼                                 │
│  4. CONFIRMACIÓN                                            │
│     ┌─────────────────────────────────────────────────┐    │
│     │  ✅ Cita confirmada                             │    │
│     │  📧 Email de confirmación enviado               │    │
│     │  📅 Añadido a tu calendario                     │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📧 Emails Automáticos

Calendly envía automáticamente:
- **Confirmación** al reservar
- **Recordatorio** 24h antes
- **Recordatorio** 1h antes
- **Link de Google Meet** (si es virtual)

---

## ✅ Checklist

- [x] Cuenta Calendly creada
- [x] Evento "Demo" configurado
- [x] Disponibilidad definida
- [x] Widget integrado en contacto
- [x] Lógica condicional (solo farmacias)
- [x] Estilos aplicados

---

*Paso 4 de Milestone 9 - Sistema de Contacto*

