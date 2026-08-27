import {
  getAdminEmail,
  getEncuestaEmailFrom,
  getEncuestaReplyTo,
  getMissingEncuestaEmailEnv,
  getSheetsAdminUrl,
} from "./config";
import { PROBLEMAS_ENCARGO_KEYS, PROBLEMAS_ENCARGO_LABELS } from "./options";
import { yesNo } from "./normalize";
import type { CoherenceResult, SurveyFormData } from "./types";

export type EmailSendResult = {
  ok: boolean;
  skipped?: boolean;
  error?: string;
  status?: number;
};

type EmailKind = "admin" | "participant";

/** Idempotencia en memoria (best-effort en serverless). */
const sentEmailKeys = new Set<string>();

function emailCacheKey(kind: EmailKind, responseId: string): string {
  return `${kind}:${responseId}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function madridDateTime(): string {
  return new Date().toLocaleString("es-ES", {
    timeZone: "Europe/Madrid",
    dateStyle: "short",
    timeStyle: "medium",
  });
}

function asText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return yesNo(value);
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean).join(", ");
  }
  return String(value).trim();
}

function omitEmptyRows(rows: Array<[string, string]>): Array<[string, string]> {
  return rows.filter(([, value]) => value !== "" && value !== "-");
}

function listToHtmlBullets(values: string[]): string {
  const items = values.map((v) => v.trim()).filter(Boolean);
  if (!items.length) return "";
  return `<ul style="margin:0;padding-left:18px">${items
    .map((item) => `<li style="margin:0 0 4px">${escapeHtml(item)}</li>`)
    .join("")}</ul>`;
}

function listToPlainBullets(values: string[]): string {
  return values
    .map((v) => v.trim())
    .filter(Boolean)
    .map((item) => `• ${item}`)
    .join("\n");
}

function formatProblemasEncargos(data: SurveyFormData): string {
  return PROBLEMAS_ENCARGO_KEYS.map((key) => {
    const value = data.problemas_encargos[key];
    if (!value) return "";
    return `${PROBLEMAS_ENCARGO_LABELS[key]}: ${value}`;
  })
    .filter(Boolean)
    .join(" | ");
}

function programaGestion(data: SurveyFormData): string {
  if (data.programa_gestion === "Otro" && data.programa_gestion_otro) {
    return `Otro: ${data.programa_gestion_otro}`;
  }
  return data.programa_gestion || "";
}

function brandHeaderHtml(): string {
  const logoUrl = "https://www.farmafacil.solutions/images/logo/farmafacil-logo.png";
  return `
    <tr>
      <td style="background-color:#1ABBB3;padding:22px 28px;border-radius:12px 12px 0 0">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
          <tr>
            <td valign="middle" style="vertical-align:middle;padding-right:16px;line-height:0">
              <img
                src="${logoUrl}"
                alt="FarmaFácil"
                width="44"
                height="44"
                style="display:block;border:0;outline:none;text-decoration:none;width:44px;height:44px"
              />
            </td>
            <td valign="middle" style="vertical-align:middle">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.2px">
                FarmaFácil
              </div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#E8FFFC;margin-top:4px">
                Construyendo la farmacia del futuro
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function sectionTitleHtml(title: string): string {
  return `<h3 style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1ABBB3;margin:22px 0 10px;border-bottom:2px solid #4ED3C2;padding-bottom:6px">${escapeHtml(
    title
  )}</h3>`;
}

function kvTableHtml(rows: Array<[string, string]>): string {
  const visible = omitEmptyRows(rows);
  if (!visible.length) return "";
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:14px">
    ${visible
      .map(
        ([k, v], index) => `<tr>
        <td style="padding:8px 10px;border:1px solid #e5e7eb;background:${
          index % 2 === 0 ? "#F7F9FA" : "#ffffff"
        };font-weight:700;color:#1A1A1A;width:38%;vertical-align:top">${escapeHtml(k)}</td>
        <td style="padding:8px 10px;border:1px solid #e5e7eb;color:#374151;vertical-align:top">${
          v.startsWith("<") ? v : escapeHtml(v)
        }</td>
      </tr>`
      )
      .join("")}
  </table>`;
}

function kvPlain(rows: Array<[string, string]>): string {
  return omitEmptyRows(rows)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

/* -------------------------------------------------------------------------- */
/* Admin email                                                                 */
/* -------------------------------------------------------------------------- */

export function buildAdminEmail(params: {
  id: string;
  data: SurveyFormData;
  coherence: CoherenceResult;
  estado: string;
  duplicatePotential: boolean;
  bonoDisponibleEnEnvio?: boolean;
}): { subject: string; html: string; text: string } {
  const {
    id,
    data,
    coherence,
    estado,
    duplicatePotential,
    bonoDisponibleEnEnvio = false,
  } = params;
  const subject = `Encuesta - Farmacia ${data.nombre_farmacia}`;
  const when = madridDateTime();
  const adminUrl = getSheetsAdminUrl();

  const identityRows: Array<[string, string]> = [
    ["ID de respuesta", id],
    ["Fecha y hora", when],
    ["Nombre del titular / cotitular", data.nombre_titular],
    ["Nombre de la farmacia", data.nombre_farmacia],
    ["Cargo", data.cargo],
    ["Teléfono", data.telefono],
    ["Email", data.email],
    ["Provincia", data.provincia],
    ["Municipio", data.municipio],
    ["Código postal", data.codigo_postal],
    ["Declaración de titularidad", yesNo(data.declaracion_titularidad)],
  ];

  const profileRows: Array<[string, string]> = [
    ["Número de empleados", data.empleados],
    ["Número de mostradores", data.mostradores],
    ["Grupo o enseña", data.grupo_ensena],
    ["Software de gestión", programaGestion(data)],
    ["Página web", data.pagina_web],
    ["Uso de WhatsApp", data.uso_whatsapp],
    ["Pedidos anticipados", data.pedidos_anticipados],
  ];

  const dayRows: Array<[string, string]> = [
    ["Volumen de llamadas", data.volumen_llamadas],
    ["Proporción consultas repetitivas", data.proporcion_repetitivas],
    [
      "Momentos con colas",
      data.momentos_colas.length ? listToHtmlBullets(data.momentos_colas) : "",
    ],
    ["Interrupciones por llamadas", data.interrupciones],
    ["Tiempo en consultas", data.tiempo_consultas],
    ["Consultas más repetidas", data.consultas_mas_repetidas],
  ];

  const ordersRows: Array<[string, string]> = [
    [
      "Canales de pedidos",
      data.canales_pedidos.length ? listToHtmlBullets(data.canales_pedidos) : "",
    ],
    [
      "Sistema de registro",
      data.registro_pedidos.length ? listToHtmlBullets(data.registro_pedidos) : "",
    ],
    ["Problemas con encargos", formatProblemasEncargos(data)],
    [
      "Sistema de avisos",
      data.sistema_avisos.length ? listToHtmlBullets(data.sistema_avisos) : "",
    ],
    ["Principal problema con pedidos", data.principal_problema_pedidos],
  ];

  const commercialRows: Array<[string, string]> = [
    ["Interés en parafarmacia", data.interes_parafarmacia],
    [
      "Barreras de venta",
      data.barreras_venta.length ? listToHtmlBullets(data.barreras_venta) : "",
    ],
    [
      "Comunicación de promociones",
      data.comunicacion_promociones.length
        ? listToHtmlBullets(data.comunicacion_promociones)
        : "",
    ],
    [
      "Soluciones digitales",
      data.soluciones_digitales.length
        ? listToHtmlBullets(data.soluciones_digitales)
        : "",
    ],
    [
      "Barreras de digitalización",
      data.barreras_digitalizacion.length
        ? listToHtmlBullets(data.barreras_digitalizacion)
        : "",
    ],
  ];

  const painRows: Array<[string, string]> = [
    [
      "Tres principales problemas",
      data.principales_problemas.length
        ? listToHtmlBullets(data.principales_problemas)
        : "",
    ],
    ["Problema que eliminaría", data.problema_eliminaria],
    ["Tarea que más tiempo consume", data.tarea_mas_tiempo],
    ["Uso de una hora ahorrada", data.uso_hora_ahorrada],
    ["Reto a dos años", data.reto_dos_anos],
  ];

  const interestRows: Array<[string, string]> = [
    ["Valoración catálogo", data.valoracion_catalogo != null ? String(data.valoracion_catalogo) : ""],
    ["Valoración pedidos", data.valoracion_pedidos != null ? String(data.valoracion_pedidos) : ""],
    ["Valoración avisos", data.valoracion_avisos != null ? String(data.valoracion_avisos) : ""],
    ["Valoración asistente", data.valoracion_asistente != null ? String(data.valoracion_asistente) : ""],
    ["Valoración kiosco", data.valoracion_kiosco != null ? String(data.valoracion_kiosco) : ""],
    ["Solución prioritaria", data.solucion_prioritaria],
    ["Interés en prueba piloto", data.interes_piloto],
  ];

  const comercialRows: Array<[string, string]> = [
    ["Precio mensual razonable", data.precio_mensual_razonable],
    ["Precio máximo aceptable", data.precio_maximo_aceptable],
    ["Modelo de pago preferido", data.modelo_pago_preferido],
    ["Intención de prueba durante 30 días", data.intencion_prueba_30_dias],
  ];

  const consentRows: Array<[string, string]> = [
    ["Consentimiento comunidad", yesNo(data.consentimiento_comunidad)],
    ["Consentimiento comercial", yesNo(data.consentimiento_comercial)],
    ["Consentimiento informe", yesNo(data.consentimiento_informe)],
    ["Aceptación privacidad", yesNo(data.aceptacion_privacidad)],
  ];

  const reviewRows: Array<[string, string]> = [
    ["Puntuación de coherencia", String(coherence.score)],
    ["Clasificación automática", coherence.classification],
    [
      "Alertas detectadas",
      coherence.alerts.length ? listToHtmlBullets(coherence.alerts) : "Ninguna",
    ],
    ["Posibles duplicados", yesNo(duplicatePotential)],
    ["Estado inicial de revisión", estado],
    ["Estado inicial del bono", "no_revisado"],
    ["Bono disponible en el envío", yesNo(bonoDisponibleEnEnvio)],
  ];

  const html = `<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background:#F7F9FA">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F9FA;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:720px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        ${brandHeaderHtml()}
        <tr><td style="padding:28px">
          <h1 style="font-family:Arial,Helvetica,sans-serif;font-size:20px;color:#1A1A1A;margin:0 0 8px">Nueva participación en la encuesta</h1>
          <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#4b5563;margin:0 0 16px;line-height:1.5">
            Registro guardado en Google Sheets. El bono <strong>no</strong> se envía automáticamente: requiere revisión manual.
          </p>
          <div style="background:#E8FFFC;border-left:4px solid #1ABBB3;padding:12px 14px;margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1A1A1A">
            <strong>Interés piloto:</strong> ${escapeHtml(asText(data.interes_piloto) || "—")}<br/>
            <strong>Puntos de dolor:</strong> ${escapeHtml(
              asText(data.principales_problemas) || "—"
            )}
          </div>
          ${sectionTitleHtml("Identificación")}
          ${kvTableHtml(identityRows)}
          ${sectionTitleHtml("Perfil de la farmacia")}
          ${kvTableHtml(profileRows)}
          ${sectionTitleHtml("Día a día")}
          ${kvTableHtml(dayRows)}
          ${sectionTitleHtml("Pedidos y encargos")}
          ${kvTableHtml(ordersRows)}
          ${sectionTitleHtml("Parafarmacia y digitalización")}
          ${kvTableHtml(commercialRows)}
          ${sectionTitleHtml("Principales puntos de dolor")}
          ${kvTableHtml(painRows)}
          ${sectionTitleHtml("Interés y valoraciones")}
          ${kvTableHtml(interestRows)}
          ${sectionTitleHtml("Interés comercial")}
          ${kvTableHtml(comercialRows)}
          ${sectionTitleHtml("Consentimientos")}
          ${kvTableHtml(consentRows)}
          ${sectionTitleHtml("Revisión interna")}
          ${kvTableHtml(reviewRows)}
          ${
            adminUrl
              ? `<p style="font-family:Arial,Helvetica,sans-serif;margin-top:22px"><a href="${escapeHtml(
                  adminUrl
                )}" style="display:inline-block;background:#1ABBB3;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:8px;font-size:14px">Abrir hoja de administración</a></p>`
              : ""
          }
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const plainList = (values: string[]) =>
    values.length ? listToPlainBullets(values) : "";

  const text = [
    "Nueva participación — Encuesta FarmaFácil",
    "",
    kvPlain([
      ["ID de respuesta", id],
      ["Fecha y hora", when],
      ["Titular / cotitular", data.nombre_titular],
      ["Farmacia", data.nombre_farmacia],
      ["Cargo", data.cargo],
      ["Teléfono", data.telefono],
      ["Email", data.email],
      ["Provincia", data.provincia],
      ["Municipio", data.municipio],
      ["Código postal", data.codigo_postal],
    ]),
    "",
    "Principales puntos de dolor:",
    plainList(data.principales_problemas) || "(sin datos)",
    "",
    `Interés piloto: ${asText(data.interes_piloto)}`,
    "",
    "Interés comercial",
    kvPlain([
      ["Precio mensual razonable", data.precio_mensual_razonable],
      ["Precio máximo aceptable", data.precio_maximo_aceptable],
      ["Modelo de pago preferido", data.modelo_pago_preferido],
      ["Intención de prueba durante 30 días", data.intencion_prueba_30_dias],
    ]),
    "",
    `Consentimiento comunidad: ${yesNo(data.consentimiento_comunidad)}`,
    `Consentimiento comercial: ${yesNo(data.consentimiento_comercial)}`,
    `Consentimiento informe: ${yesNo(data.consentimiento_informe)}`,
    `Puntuación coherencia: ${coherence.score}`,
    `Alertas: ${coherence.alerts.join(" | ") || "Ninguna"}`,
    `Posibles duplicados: ${yesNo(duplicatePotential)}`,
    `Estado revisión: ${estado}`,
    `Estado bono: no_revisado`,
    `Bono disponible en el envío: ${yesNo(bonoDisponibleEnEnvio)}`,
  ].join("\n");

  return { subject, html, text };
}

/* -------------------------------------------------------------------------- */
/* Participant confirmation email                                              */
/* -------------------------------------------------------------------------- */

export function buildParticipantEmail(params: {
  id: string;
  data: SurveyFormData;
  bonoDisponibleEnEnvio?: boolean;
}): { subject: string; html: string; text: string } {
  const { id, data, bonoDisponibleEnEnvio = false } = params;
  const subject = "Hemos recibido tu participación | Estudio FarmaFácil";
  const replyTo = getEncuestaReplyTo() || "";
  const firstName = data.nombre_titular.trim() || "hola";

  const bonoPromiseHtml = bonoDisponibleEnEnvio
    ? `<p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#374151;margin:0 0 18px;line-height:1.6">
            Cuando finalicemos la revisión, nos pondremos en contacto contigo. Si la participación resulta válida, enviaremos el bono regalo de Amazon de 10 € a esta misma dirección de correo electrónico.
          </p>
          <div style="background:#E8FFFC;border:1px solid #4ED3C2;border-radius:10px;padding:14px 16px;margin:0 0 22px">
            <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1A1A1A;margin:0;line-height:1.5;font-weight:700">
              Tu participación se ha recibido correctamente. El bono todavía está pendiente de revisión y validación.
            </p>
          </div>`
    : `<p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#374151;margin:0 0 18px;line-height:1.6">
            Cuando finalicemos la revisión, nos pondremos en contacto contigo si necesitamos confirmar algún dato.
          </p>
          <div style="background:#E8FFFC;border:1px solid #4ED3C2;border-radius:10px;padding:14px 16px;margin:0 0 22px">
            <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1A1A1A;margin:0;line-height:1.5;font-weight:700">
              Tu participación se ha recibido correctamente. Gracias por ayudarnos con este estudio.
            </p>
          </div>`;

  const bonoFooterHtml = bonoDisponibleEnEnvio
    ? `<p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280;margin:0 0 10px;line-height:1.5">
            Este correo confirma la recepción de la encuesta, pero no supone la aprobación automática del bono.
          </p>`
    : `<p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280;margin:0 0 10px;line-height:1.5">
            Este correo confirma la recepción de la encuesta.
          </p>`;

  const bonoPromiseText = bonoDisponibleEnEnvio
    ? [
        "Cuando finalicemos la revisión, nos pondremos en contacto contigo. Si la participación resulta válida, enviaremos el bono regalo de Amazon de 10 € a esta misma dirección de correo electrónico.",
        "",
        "Tu participación se ha recibido correctamente. El bono todavía está pendiente de revisión y validación.",
      ]
    : [
        "Cuando finalicemos la revisión, nos pondremos en contacto contigo si necesitamos confirmar algún dato.",
        "",
        "Tu participación se ha recibido correctamente. Gracias por ayudarnos con este estudio.",
      ];

  const bonoFooterText = bonoDisponibleEnEnvio
    ? "Este correo confirma la recepción de la encuesta, pero no supone la aprobación automática del bono."
    : "Este correo confirma la recepción de la encuesta.";

  const pharmacyRows: Array<[string, string]> = [
    ["Titular o cotitular", data.nombre_titular],
    ["Nombre de la farmacia", data.nombre_farmacia],
    ["Cargo", data.cargo],
    ["Teléfono", data.telefono],
    ["Email", data.email],
    ["Provincia", data.provincia],
    ["Municipio", data.municipio],
    ["Código postal", data.codigo_postal],
  ];

  const featureRows: Array<[string, string]> = [
    ["Número de empleados", data.empleados],
    ["Programa de gestión", programaGestion(data)],
    ["Página web", data.pagina_web],
    ["Uso de WhatsApp", data.uso_whatsapp],
    ["Pedidos anticipados", data.pedidos_anticipados],
  ];

  const conclusionRows: Array<[string, string]> = [
    ["Consultas más frecuentes", data.consultas_mas_repetidas],
    ["Principal problema con los encargos", data.principal_problema_pedidos],
    [
      "Tres principales problemas",
      data.principales_problemas.length
        ? listToHtmlBullets(data.principales_problemas)
        : "",
    ],
    ["Problema que eliminaría", data.problema_eliminaria],
    ["Tarea que más tiempo consume", data.tarea_mas_tiempo],
    ["Mayor reto a dos años", data.reto_dos_anos],
    ["Solución prioritaria", data.solucion_prioritaria],
    ["Interés en prueba piloto", data.interes_piloto],
  ];

  const preferenceRows: Array<[string, string]> = [
    ["Cuota mensual que considera razonable", data.precio_mensual_razonable],
    [
      "Precio a partir del cual dejaría de compensarle",
      data.precio_maximo_aceptable,
    ],
    ["Forma de pago preferida", data.modelo_pago_preferido],
    [
      "Interés en probar la solución durante 30 días",
      data.intencion_prueba_30_dias,
    ],
  ];

  const consentRows: Array<[string, string]> = [
    ["Comunidad", yesNo(data.consentimiento_comunidad)],
    ["Información de FarmaFácil", yesNo(data.consentimiento_comercial)],
    ["Informe del estudio", yesNo(data.consentimiento_informe)],
  ];

  const html = `<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background:#F7F9FA">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F9FA;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        ${brandHeaderHtml()}
        <tr><td style="padding:28px 26px">
          <p style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#1A1A1A;margin:0 0 14px;line-height:1.55">
            Hola, ${escapeHtml(firstName)}:
          </p>
          <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#374151;margin:0 0 12px;line-height:1.6">
            Gracias por participar en nuestro estudio y dedicar unos minutos a ayudarnos a construir el futuro de las farmacias.
          </p>
          <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#374151;margin:0 0 12px;line-height:1.6">
            Hemos recibido correctamente la información correspondiente a <strong>${escapeHtml(
              data.nombre_farmacia
            )}</strong>.
          </p>
          <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#374151;margin:0 0 12px;line-height:1.6">
            Nuestro equipo revisará los datos facilitados para comprobar que la participación cumple las condiciones del estudio y corresponde a una farmacia real.
          </p>
          ${bonoPromiseHtml}

          <h2 style="font-family:Arial,Helvetica,sans-serif;font-size:17px;color:#1A1A1A;margin:0 0 8px">Resumen de tu participación</h2>
          ${sectionTitleHtml("Datos de la farmacia")}
          ${kvTableHtml(pharmacyRows)}
          ${sectionTitleHtml("Características principales")}
          ${kvTableHtml(featureRows)}
          ${sectionTitleHtml("Principales conclusiones")}
          ${kvTableHtml(conclusionRows)}
          ${sectionTitleHtml("Preferencias sobre la solución")}
          ${kvTableHtml(preferenceRows)}
          ${sectionTitleHtml("Consentimientos")}
          ${kvTableHtml(consentRows)}

          <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1A1A1A;margin:24px 0 8px">
            <strong>Referencia de participación:</strong> ${escapeHtml(id)}
          </p>
          <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#4b5563;margin:0 0 18px;line-height:1.55">
            No necesitas realizar ninguna otra acción. Contactaremos contigo después de revisar la participación.
          </p>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:22px 0" />

          <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#374151;margin:0 0 8px;line-height:1.55">
            Gracias por ayudarnos a conocer mejor la realidad de las farmacias.
          </p>
          <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1A1A1A;margin:0 0 2px;font-weight:700">
            Equipo FarmaFácil
          </p>
          <p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7280;margin:0 0 14px">
            Construyendo la farmacia del futuro
          </p>
          ${bonoFooterHtml}
          ${
            replyTo
              ? `<p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280;margin:0">
            Contacto: <a href="mailto:${escapeHtml(
              replyTo
            )}" style="color:#1ABBB3;text-decoration:none">${escapeHtml(replyTo)}</a>
          </p>`
              : ""
          }
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `Hola, ${firstName}:`,
    "",
    "Gracias por participar en nuestro estudio sobre los retos actuales de la farmacia comunitaria.",
    "",
    `Hemos recibido correctamente la información correspondiente a ${data.nombre_farmacia}.`,
    "",
    "Nuestro equipo revisará los datos facilitados para comprobar que la participación cumple las condiciones del estudio y corresponde a una farmacia real.",
    "",
    ...bonoPromiseText,
    "",
    "Resumen de tu participación",
    "",
    "Datos de la farmacia",
    kvPlain(pharmacyRows),
    "",
    "Características principales",
    kvPlain(featureRows),
    "",
    "Principales conclusiones",
    kvPlain([
      ["Consultas más frecuentes", data.consultas_mas_repetidas],
      ["Principal problema con los encargos", data.principal_problema_pedidos],
      ["Tres principales problemas", asText(data.principales_problemas)],
      ["Problema que eliminaría", data.problema_eliminaria],
      ["Tarea que más tiempo consume", data.tarea_mas_tiempo],
      ["Mayor reto a dos años", data.reto_dos_anos],
      ["Solución prioritaria", data.solucion_prioritaria],
      ["Interés en prueba piloto", data.interes_piloto],
    ]),
    "",
    "Preferencias sobre la solución",
    kvPlain(preferenceRows.map(([k, v]) => [k, asText(v)])),
    "",
    "Consentimientos",
    `Comunidad: ${yesNo(data.consentimiento_comunidad)}`,
    `Información de FarmaFácil: ${yesNo(data.consentimiento_comercial)}`,
    `Informe del estudio: ${yesNo(data.consentimiento_informe)}`,
    "",
    `Referencia de participación: ${id}`,
    "",
    "No necesitas realizar ninguna otra acción. Contactaremos contigo después de revisar la participación.",
    "",
    "Gracias por ayudarnos a conocer mejor la realidad de las farmacias.",
    "Equipo FarmaFácil",
    "Construyendo la farmacia del futuro",
    "",
    bonoFooterText,
    replyTo ? `Contacto: ${replyTo}` : "",
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  return { subject, html, text };
}

/* -------------------------------------------------------------------------- */
/* Resend transport                                                            */
/* -------------------------------------------------------------------------- */

async function sendViaResend(params: {
  kind: EmailKind;
  responseId: string;
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
}): Promise<EmailSendResult> {
  const cacheKey = emailCacheKey(params.kind, params.responseId);
  if (sentEmailKeys.has(cacheKey)) {
    return { ok: true, skipped: true };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: "Falta RESEND_API_KEY" };
  }

  const body: Record<string, unknown> = {
    from: params.from,
    to: [params.to],
    subject: params.subject,
    html: params.html,
    text: params.text,
  };
  if (params.replyTo && isValidEmail(params.replyTo)) {
    body.reply_to = params.replyTo;
  }

  try {
    console.log("FROM:", process.env.ENCUESTA_EMAIL_FROM);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `encuesta-${params.kind}-${params.responseId}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const raw = await res.text();
      let message = raw.slice(0, 220);
      try {
        const parsed = JSON.parse(raw) as { message?: string; name?: string };
        message = parsed.message || parsed.name || message;
      } catch {
        /* keep raw slice */
      }
      return {
        ok: false,
        status: res.status,
        error: message,
      };
    }

    sentEmailKeys.add(cacheKey);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message || "Error de red con Resend" };
  }
}

export async function sendEncuestaAdminEmail(params: {
  id: string;
  data: SurveyFormData;
  coherence: CoherenceResult;
  estado: string;
  duplicatePotential: boolean;
  bonoDisponibleEnEnvio?: boolean;
}): Promise<EmailSendResult> {
  const missing = getMissingEncuestaEmailEnv();
  if (missing.length) {
    return {
      ok: false,
      error: `Faltan variables de entorno: ${missing.join(", ")}`,
    };
  }

  const to = getAdminEmail()!;
  const from = getEncuestaEmailFrom()!;
  const { subject, html, text } = buildAdminEmail(params);
  const participantReply = isValidEmail(params.data.email)
    ? params.data.email.trim()
    : undefined;

  return sendViaResend({
    kind: "admin",
    responseId: params.id,
    to,
    from,
    replyTo: participantReply,
    subject,
    html,
    text,
  });
}

export async function sendEncuestaParticipantEmail(params: {
  id: string;
  data: SurveyFormData;
  bonoDisponibleEnEnvio?: boolean;
}): Promise<EmailSendResult> {
  const missing = getMissingEncuestaEmailEnv();
  if (missing.length) {
    return {
      ok: false,
      error: `Faltan variables de entorno: ${missing.join(", ")}`,
    };
  }

  const to = params.data.email?.trim();
  if (!to || !isValidEmail(to)) {
    return { ok: false, error: "Email del participante no válido" };
  }

  const from = getEncuestaEmailFrom()!;
  const replyTo = getEncuestaReplyTo()!;
  const { subject, html, text } = buildParticipantEmail(params);

  return sendViaResend({
    kind: "participant",
    responseId: params.id,
    to,
    from,
    replyTo,
    subject,
    html,
    text,
  });
}

/** @deprecated usar buildAdminEmail */
export function buildAdminEmailHtml(params: {
  id: string;
  data: SurveyFormData;
  coherence: CoherenceResult;
  estado: string;
}): { subject: string; html: string } {
  const built = buildAdminEmail({
    ...params,
    duplicatePotential: false,
  });
  return { subject: built.subject, html: built.html };
}
