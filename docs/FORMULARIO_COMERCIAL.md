# Formulario comercial de farmacias

Documento local. No publica nada y no modifica el Apps Script de Google Sheets.

## URL estable

La ruta que no debe cambiar después de imprimir es:

`https://www.farmafacil.solutions/solicitar`

Los enlaces antiguos `/?interes=prueba#solicitar-demo` siguen abriendo el formulario de la home con «Participar en el programa piloto» preseleccionado.

## URL definitiva del QR del flyer

El flyer de lanzamiento invita a contratar FarmaFácil, así que el QR abre la solicitud con implantación preseleccionada:

`https://www.farmafacil.solutions/solicitar?interes=implantar&origen=qr&medio=impreso&campana=lanzamiento-2027&pieza=flyer`

No incluye nombre, email, teléfono ni mensaje. Esos datos solo viajan en el envío del formulario.

## Cómo generar el QR auténtico

El código se genera con la librería `qrcode` (node-qrcode), en negro sobre blanco y con corrección de errores alta, para que imprima y se lea bien. No uses una imagen de QR dibujada por un modelo de IA: puede parecer un QR y no escanear.

```bash
npx tsx scripts/generar-qr-flyer.ts
```

Eso escribe:

- `docs/comercial/qr-flyer-lanzamiento-2027.svg`
- `docs/comercial/qr-flyer-lanzamiento-2027.png`

## Cómo comprobarlo

La prueba decodifica el PNG con un lector distinto del generador (`jsqr`) y exige que el texto sea exactamente la URL de arriba:

```bash
npx tsx --test lib/contacto/flyer-qr.test.ts
```

Antes de imprimir, escanéalo también con la cámara de un teléfono. Tiene que abrir esa URL, con «Implantar FarmaFácil en mi farmacia» marcado y las dos casillas desmarcadas.

## Qué faltaría añadir en Google Sheets

El webhook actual no se ha tocado. El script documentado solo escribe seis columnas y responde éxito aunque el JSON traiga más campos. Hoy el aviso interno de Resend es el registro completo. La hoja sigue guardando, como hasta ahora:

| Columna | Campo JSON |
| --- | --- |
| A Fecha | la genera el script, no `submittedAt` |
| B Nombre | `nombre` |
| C Email | `email` |
| D Teléfono | `telefono` |
| E Tipo | `tipoUsuario` |
| F Mensaje | `mensaje` |

Si el texto libre va vacío, `mensaje` repite la etiqueta del interés para que esa columna no quede en blanco. `mensajeEsAutomatico` vale `true` en ese caso.

Estos campos ya salían en el JSON y el script documentado no los guarda: `farmacia`, `infoFarmacia`, `interes`, `source`, `submittedAt`.

Para una cartera comercial completa habría que añadir columnas y leerlas en `doPost`, sin cambiar el contrato de las seis primeras:

| Columna nueva | Campo JSON | Ejemplo |
| --- | --- | --- |
| G Farmacia | `farmacia` | Farmacia Centro |
| H Interés | `interes` | `implantar` |
| I Interés (etiqueta) | `interesEtiqueta` | Implantar FarmaFácil en mi farmacia. |
| J Origen | `origen` | `qr` |
| K Medio | `medio` | `impreso` |
| L Campaña | `campana` | `lanzamiento-2027` |
| M Pieza | `pieza` | `flyer` |
| N Consentimiento promocional | `consentimientoPromocional` | `true` o `false` |
| O Acepta la información de la solicitud | `aceptaInformacion` | `true` o `false` |
| P Alta intención | `altaIntencion` | `true` solo si el interés es `implantar` |
| Q Formulario | `formulario` | `comercial` o `contacto` |
| R Superficie | `source` | `solicitar`, `landing` o `contacto` |
| S Mensaje automático | `mensajeEsAutomatico` | `true` si la columna Mensaje es la etiqueta del interés |

En el formulario de contacto, `consentimientoPromocional` va siempre a `false` porque esa casilla no se pregunta. No es una negativa registrada: es «no aplica». `altaIntencion` solo es `true` en implantación.

Los códigos de interés son `piloto`, `implantar`, `demo`, `planes` y `otra`. El formulario ya no recoge una lista de necesidades: el detalle va en el texto libre.

## Privacidad publicada con el formulario

`/privacidad` no lleva avisos internos. El apartado 3 limita las comunicaciones promocionales a un consentimiento separado, y el apartado 12 (`#solicitudes-comerciales`) describe el tratamiento de la solicitud. El formulario mantiene una casilla obligatoria para atender la solicitud y otra, desmarcada, para promociones.
