# 📞 Milestone 9: Sistema de Contacto y Demo

## 📋 Índice de Sub-Milestones

| Sub-Milestone | Descripción | Estado |
|---------------|-------------|--------|
| [9.1 Formulario Contacto](./9.1_Formulario/) | Página de contacto con formulario | 🟢 Completado |
| [9.2 API Contacto](./9.2_API_Contacto/) | Endpoint para enviar datos | 🟢 Completado |
| [9.3 Google Sheets](./9.3_Google_Sheets/) | Integración con Apps Script | 🟢 Completado |
| [9.4 Calendly Demo](./9.4_Calendly/) | Reserva de citas para farmacias | 🟢 Completado |
| [9.5 Validación RGPD](./9.5_RGPD/) | Cumplimiento de protección de datos | 🟢 Completado |

---

## 🎯 Objetivo del Milestone

Implementar el sistema de **contacto y reserva de demos** que permite:
- A clientes: enviar consultas generales
- A farmacias: solicitar información y agendar demos presenciales

---

## 🔄 Flujo del Sistema de Contacto

```
┌─────────────────────────────────────────────────────────────┐
│              FLUJO DE CONTACTO                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   USUARIO                                                   │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  1. Accede a /contacto                              │  │
│   │  2. Rellena formulario:                             │  │
│   │     - Nombre                                        │  │
│   │     - Email                                         │  │
│   │     - Teléfono (opcional)                           │  │
│   │     - Tipo: Farmacia / Cliente                      │  │
│   │     - Mensaje                                       │  │
│   │  3. Acepta política RGPD                            │  │
│   │  4. Click en "Enviar"                               │  │
│   └─────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│   API                                                       │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  POST /api/contacto                                 │  │
│   │  → Valida datos                                     │  │
│   │  → Envía a Google Sheets via Apps Script            │  │
│   └─────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│   GOOGLE SHEETS                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Nueva fila con:                                    │  │
│   │  | Fecha | Nombre | Email | Teléfono | Tipo | Msg | │  │
│   └─────────────────────────────────────────────────────┘  │
│                           │                                 │
│   SI ES FARMACIA          ▼                                 │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Aparece opción de agendar demo via Calendly        │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Archivos Implementados

### Página de Contacto

**Archivo**: `app/contacto/page.tsx`

Formulario completo con:
- Campos de nombre, email, teléfono
- Selector de tipo de usuario (Farmacia/Cliente)
- Área de texto para mensaje
- Checkbox de aceptación RGPD
- Información de contacto lateral
- WhatsApp Business
- Calendly (solo para farmacias)

### API de Contacto

**Archivo**: `app/api/contacto/route.ts`

```typescript
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        { success: false, error: "Config error" },
        { status: 500 }
      );
    }

    const sheetResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!sheetResponse.ok) {
      return NextResponse.json(
        { success: false, error: "Apps Script error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
```

---

## 📊 Integración con Google Sheets

### Apps Script (doPost)

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Añadir fila
    sheet.appendRow([
      new Date(),           // Fecha
      data.nombre,          // Nombre
      data.email,           // Email
      data.telefono || '',  // Teléfono
      data.tipoUsuario,     // Tipo
      data.mensaje          // Mensaje
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## 📅 Calendly para Demos

### Visualización condicional

Solo aparece cuando el usuario selecciona "Soy una farmacia":

```tsx
{formData.tipoUsuario === "farmacia" && (
  <div className="mt-6 bg-gradient-to-br from-[#4ED3C2] to-[#1ABBB3] rounded-lg p-6">
    <div className="flex items-start space-x-4">
      <CalendarDays className="h-6 w-6 text-white" />
      <div>
        <h3 className="font-semibold text-white mb-2">
          Agenda una cita presencial
        </h3>
        <p className="text-white text-opacity-90 mb-4">
          Si eres una farmacia interesada en FarmaFácil, 
          puedes reservar una reunión con nuestro equipo.
        </p>
        <a
          href="https://calendly.com/farmafacil/bienvenida"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="secondary">
            Ver calendario
          </Button>
        </a>
      </div>
    </div>
  </div>
)}
```

---

## ✅ Checklist

- [x] Página /contacto creada
- [x] Formulario con validación
- [x] API endpoint funcional
- [x] Integración Google Sheets
- [x] Apps Script configurado
- [x] Calendly para farmacias
- [x] RGPD implementado
- [x] WhatsApp Business

---

*Milestone 9 de Fase 2 Backend*

