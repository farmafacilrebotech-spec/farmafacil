# 🔌 9.2 API de Contacto

## 📋 Endpoint Implementado

**Archivo**: `app/api/contacto/route.ts`

```typescript
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Parsear datos del formulario
    const data = await req.json();

    // 2. Obtener URL del webhook de Google Sheets
    const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.error("Falta NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL en .env.local");
      return NextResponse.json(
        { success: false, error: "Config error: falta webhook URL" },
        { status: 500 }
      );
    }

    // 3. Enviar datos a Google Sheets via Apps Script
    const sheetResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // 4. Leer respuesta
    const rawText = await sheetResponse.text();

    if (!sheetResponse.ok) {
      console.error(
        "Apps Script devolvió error:",
        sheetResponse.status,
        rawText
      );
      return NextResponse.json(
        { success: false, error: "Apps Script error" },
        { status: 500 }
      );
    }

    // 5. Parsear respuesta (por si devuelve JSON)
    let result: any = {};
    try {
      result = JSON.parse(rawText);
    } catch {
      result = { raw: rawText };
    }

    // 6. Retornar éxito
    return NextResponse.json({ success: true, result });
    
  } catch (error) {
    console.error("Error en /api/contacto:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
```

---

## 📊 Estructura de Datos

### Request Body

```typescript
interface ContactoRequest {
  nombre: string;
  email: string;
  telefono?: string;
  tipoUsuario: "farmacia" | "cliente";
  mensaje: string;
}
```

### Response

```typescript
// Éxito
{
  "success": true,
  "result": { /* respuesta de Apps Script */ }
}

// Error
{
  "success": false,
  "error": "Mensaje de error"
}
```

---

## 🔄 Flujo de la API

```
┌─────────────────────────────────────────────────────────────┐
│                    API FLOW                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   CLIENT                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  fetch("/api/contacto", {                           │  │
│   │    method: "POST",                                  │  │
│   │    body: JSON.stringify({                           │  │
│   │      nombre: "Juan",                                │  │
│   │      email: "juan@mail.com",                        │  │
│   │      tipoUsuario: "farmacia",                       │  │
│   │      mensaje: "Quiero más info"                     │  │
│   │    })                                               │  │
│   │  })                                                 │  │
│   └─────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│   API ROUTE                                                 │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  POST /api/contacto                                 │  │
│   │                                                     │  │
│   │  1. req.json() → parsear body                       │  │
│   │  2. Verificar WEBHOOK_URL en env                    │  │
│   │  3. fetch(webhookUrl, { body: data })               │  │
│   │  4. Verificar respuesta de Apps Script              │  │
│   │  5. Retornar resultado                              │  │
│   └─────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│   GOOGLE APPS SCRIPT                                        │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  doPost(e)                                          │  │
│   │  1. JSON.parse(e.postData.contents)                 │  │
│   │  2. sheet.appendRow([...datos])                     │  │
│   │  3. return { success: true }                        │  │
│   └─────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│   GOOGLE SHEETS                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Nueva fila añadida con los datos del formulario   │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Configuración

### Variable de Entorno

```env
# .env.local
NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
```

---

## ✅ Checklist

- [x] Endpoint POST creado
- [x] Parseo de JSON
- [x] Validación de webhook URL
- [x] Envío a Google Sheets
- [x] Manejo de errores
- [x] Logging para debug

---

*Paso 2 de Milestone 9 - Sistema de Contacto*

