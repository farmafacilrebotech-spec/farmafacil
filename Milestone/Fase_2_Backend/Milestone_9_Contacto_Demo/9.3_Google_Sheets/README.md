# 📊 9.3 Integración con Google Sheets

## 📋 Configuración del Apps Script

### Paso 1: Crear Google Sheet

1. Ir a [sheets.google.com](https://sheets.google.com)
2. Crear nuevo spreadsheet: "FarmaFácil - Contactos"
3. Configurar cabeceras en fila 1:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| Fecha | Nombre | Email | Teléfono | Tipo | Mensaje |

---

### Paso 2: Crear Apps Script

1. En el Sheet: **Extensiones > Apps Script**
2. Pegar el siguiente código:

```javascript
function doPost(e) {
  try {
    // Obtener la hoja activa
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parsear los datos recibidos
    const data = JSON.parse(e.postData.contents);
    
    // Formatear fecha
    const fecha = Utilities.formatDate(
      new Date(), 
      Session.getScriptTimeZone(), 
      "dd/MM/yyyy HH:mm:ss"
    );
    
    // Añadir nueva fila
    sheet.appendRow([
      fecha,
      data.nombre || '',
      data.email || '',
      data.telefono || '',
      data.tipoUsuario || '',
      data.mensaje || ''
    ]);
    
    // Retornar éxito
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true,
        message: 'Datos guardados correctamente'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Retornar error
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.message 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function
function testDoPost() {
  const testEvent = {
    postData: {
      contents: JSON.stringify({
        nombre: "Test Usuario",
        email: "test@test.com",
        telefono: "+34600000000",
        tipoUsuario: "farmacia",
        mensaje: "Este es un mensaje de prueba"
      })
    }
  };
  
  const result = doPost(testEvent);
  Logger.log(result.getContent());
}
```

---

### Paso 3: Implementar como Web App

1. Click en **Implementar > Nueva implementación**
2. Configurar:
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquiera**
3. Click en **Implementar**
4. Copiar la **URL de la aplicación web**

---

### Paso 4: Configurar en FarmaFácil

```env
# .env.local
NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbw.../exec
```

---

## 📊 Estructura del Sheet

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        FARMAFÁCIL - CONTACTOS                                   │
├───────────────────┬──────────────┬─────────────────┬───────────┬────────┬───────┤
│       Fecha       │    Nombre    │      Email      │ Teléfono  │  Tipo  │Mensaje│
├───────────────────┼──────────────┼─────────────────┼───────────┼────────┼───────┤
│ 17/12/2024 10:30  │ María García │ maria@mail.com  │ +34612... │farmacia│ Quiero│
│ 17/12/2024 11:45  │ Juan López   │ juan@mail.com   │           │cliente │ Duda..│
│ 17/12/2024 14:20  │ Ana Martínez │ ana@farmacia.es │ +34666... │farmacia│ Demo..│
└───────────────────┴──────────────┴─────────────────┴───────────┴────────┴───────┘
```

---

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                FLUJO DE DATOS                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   FORMULARIO                                                │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  {                                                  │  │
│   │    nombre: "María García",                          │  │
│   │    email: "maria@mail.com",                         │  │
│   │    telefono: "+34612345678",                        │  │
│   │    tipoUsuario: "farmacia",                         │  │
│   │    mensaje: "Quiero más información sobre..."       │  │
│   │  }                                                  │  │
│   └─────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│   NEXT.JS API                                               │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  POST /api/contacto                                 │  │
│   │  → fetch(WEBHOOK_URL, { body: data })               │  │
│   └─────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│   GOOGLE APPS SCRIPT                                        │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  doPost(e)                                          │  │
│   │  → JSON.parse(e.postData.contents)                  │  │
│   │  → sheet.appendRow([fecha, ...datos])               │  │
│   └─────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│   GOOGLE SHEETS                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  | 17/12/2024 | María | maria@... | +34... | ... | │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist

- [x] Google Sheet creado
- [x] Cabeceras configuradas
- [x] Apps Script implementado
- [x] Web App desplegada
- [x] URL configurada en .env
- [x] Pruebas realizadas

---

*Paso 3 de Milestone 9 - Sistema de Contacto*

