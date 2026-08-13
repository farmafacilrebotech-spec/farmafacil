# Encuesta farmacias — FarmaFácil

Módulo independiente para el estudio dirigido a titulares/cotitulares de farmacias comunitarias.

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/encuesta-farmacias` | Formulario multipaso |
| `/encuesta-farmacias/condiciones` | Condiciones de participación e incentivo (**revisión jurídica pendiente**) |
| `/api/encuesta` | API de envío (servidor) |

Acceso desde la landing: sección «Participar en el estudio» + enlace en el footer.

## Arquitectura

```
Cliente (SurveyWizard)
  → validación Zod por paso
  → POST /api/encuesta
       → honeypot + rate limit
       → validación servidor
       → ID único + puntuación de coherencia + alertas
       → JSON con claves = encabezados exactos de la hoja
       → POST a Google Apps Script (GOOGLE_SHEETS_ENCUESTAS_URL + secret)
       → solo si success=true → email admin + email participante (Resend) + pantalla de gracias
       → si Sheets falla → error y reintento (sin perder respuestas)
```

No se aprueba ni se envía el bono automáticamente.

## Variables de entorno

Ver `.env.example`. Mínimo operativo:

- `GOOGLE_SHEETS_ENCUESTAS_URL` — URL de despliegue del Apps Script (`doPost`)
- `GOOGLE_SHEETS_SECRET` — secreto compartido con el script
- `ENCUESTA_ADMIN_EMAIL`
- `RESEND_API_KEY` + `ENCUESTA_EMAIL_FROM` + `ENCUESTA_REPLY_TO`
- `ENCUESTA_ENABLED=true`
- `ENCUESTA_BONOS_DISPONIBLES=true` (solo afecta al mensaje UX)

Opcionales: `ENCUESTA_SHEETS_ADMIN_URL`, `ENCUESTA_IP_SALT`.

## Configuración manual en Google Sheets / Apps Script

1. Crear la hoja con la pestaña y los encabezados exactos definidos en `lib/encuesta/headers.ts`.
2. Desplegar el Apps Script como aplicación web que:
   - Compruebe `secret === GOOGLE_SHEETS_SECRET`
   - Lea las propiedades del JSON por **nombre de encabezado** (no por posición)
   - Escriba una fila y responda `{ "success": true }`
3. Configurar en Vercel / `.env.local`:
   - `GOOGLE_SHEETS_ENCUESTAS_URL`
   - `GOOGLE_SHEETS_SECRET`
4. Recomendado (manual en Sheets):
   - Validación de datos en columnas **Estado** y **Estado del bono** con las listas:
     - Estado: `pendiente_revision`, `requiere_revision`, `aprobada`, `rechazada`, `bono_enviado`
     - Estado del bono: `no_revisado`, `pendiente_envio`, `enviado`, `no_corresponde`
     - Revisado manualmente: `Sí`, `No`
   - Formato condicional por «Resultado de revisión automática» / Estado:
     - Verde: `coherente` / `aprobada`
     - Amarillo: `requiere_revision`
     - Rojo: `sospechosa` / `rechazada`
     - Azul: `bono_enviado` / `enviado`

## Configuración email (Resend)

1. Verificar dominio o remitente en Resend.
2. Configurar `RESEND_API_KEY`, `ENCUESTA_EMAIL_FROM` y `ENCUESTA_REPLY_TO`.
3. Configurar `ENCUESTA_ADMIN_EMAIL` (buzón interno).
4. Tras guardar en Sheets se envían dos correos independientes:
   - Interno: `Encuesta - Farmacia [NOMBRE]`
   - Participante: `Hemos recibido tu participación | Estudio FarmaFácil`
5. Si falla un email, la participación sigue siendo válida (`sheetsSaved: true`).

## Cómo revisar una respuesta y marcar el bono

1. Abrir la hoja (`ENCUESTA_SHEETS_ADMIN_URL` o el spreadsheet).
2. Revisar puntuación, alertas, duplicados y respuestas abiertas.
3. Verificar que la farmacia exista y que titular/cotitular sea plausible (llamada opcional).
4. Si es válida:
   - `Estado` → `aprobada`
   - `Estado del bono` → `pendiente_envio`
   - `Revisado manualmente` → `Sí`
   - Completar `Fecha de revisión`, `Revisor`, `Motivo…`
5. Enviar el bono Amazon **manualmente**.
6. Después:
   - `Estado` → `bono_enviado` (opcional)
   - `Estado del bono` → `enviado`
   - Rellenar código/referencia, fecha de envío y observaciones.
7. Si no corresponde: `Estado` → `rechazada`, `Estado del bono` → `no_corresponde`.

## Despliegue en Vercel

1. Añadir las variables de encuesta en el proyecto Vercel.
2. Asegurar que `GOOGLE_PRIVATE_KEY` conserva los saltos `\n`.
3. Redeploy.
4. Probar un envío de prueba y comprobar fila + email.
5. Revisar jurídicamente `/encuesta-farmacias/condiciones` antes de campañas públicas.

## Antiabuso

- Honeypot (`website`)
- Rate limit en memoria (3 envíos/hora por origen hasheado; en serverless es best-effort)
- Validación cliente + servidor
- Detección de duplicados en hoja
- Puntuación de coherencia (nunca aprueba el bono)

## Analítica (GA4)

Si existe `NEXT_PUBLIC_GA_ID`, se emiten eventos sin PII:

`survey_view`, `survey_start`, `survey_step_completed`, `survey_abandoned`, `survey_submitted`, `survey_error`, `community_consent`, `pilot_interest`.
