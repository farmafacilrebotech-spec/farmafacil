import {
  FARMAFACIL_CALENDLY_URL,
  FARMAFACIL_CONTACT_EMAIL,
} from "@/lib/constants";
import { classifyLead, interestLabel } from "./comercial";
import {
  getContactAdminEmail,
  getContactEmailFrom,
  getMissingContactEmailEnv,
  isContactEmailConfigured,
} from "./config";
import type { ContactLeadPayload } from "./types";

export type { ContactLeadPayload } from "./types";

export type ContactEmailSendResult = {
  ok: boolean;
  skipped?: boolean;
  error?: string;
  status?: number;
};

const LOGO_URL =
  "https://www.farmafacil.solutions/images/logo/farmafacil-emblema-circular.png";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function asText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function madridDateTime(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  if (Number.isNaN(d.getTime())) {
    return new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });
  }
  return d.toLocaleString("es-ES", {
    timeZone: "Europe/Madrid",
    dateStyle: "short",
    timeStyle: "medium",
  });
}

function tipoLabel(tipo?: string): string {
  if (tipo === "farmacia") return "Farmacia";
  if (tipo === "cliente") return "Cliente de farmacia";
  return asText(tipo) || "—";
}

function yesNo(value: boolean): string {
  return value ? "Sí" : "No";
}

function shown(value: string): string {
  return value || "—";
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #E8EEF0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6B7280;width:38%;vertical-align:top">${escapeHtml(label)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #E8EEF0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1A1A1A;vertical-align:top">${escapeHtml(shown(value))}</td>
    </tr>`;
}

function brandHeader(): string {
  return `
    <tr>
      <td style="padding:28px 28px 18px;text-align:center">
        <img src="${LOGO_URL}" alt="FarmaFácil" width="64" height="64" style="display:inline-block;border:0;border-radius:50%;outline:none;text-decoration:none;width:64px;height:64px" />
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;color:#0B0B0B;margin-top:12px">FarmaFácil</div>
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1ABBB3;margin-top:4px">Digitalización para farmacias</div>
      </td>
    </tr>`;
}

function shell(inner: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#F7F9FA">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F7F9FA;padding:24px 12px">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;border-radius:16px;border:1px solid #E5E9EC;overflow:hidden">
          ${inner}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function interestDisplay(payload: ContactLeadPayload): string {
  return asText(payload.interesEtiqueta) || interestLabel(payload.interes) || asText(payload.interes);
}

function commercialField(label: string, value: string, options?: { preserveBreaks?: boolean }): string {
  const clean = value.trim();
  if (!clean) return "";
  const body = options?.preserveBreaks
    ? escapeHtml(clean).replace(/\r\n|\n|\r/g, "<br />")
    : escapeHtml(clean);
  return `
    <tr>
      <td style="padding:0 0 16px;font-family:Arial,Helvetica,sans-serif">
        <div style="margin:0 0 4px;font-size:12px;line-height:1.4;color:#6B7280">${escapeHtml(label)}</div>
        <div style="margin:0;font-size:16px;line-height:1.5;color:#1A1A1A;overflow-wrap:anywhere;word-break:break-word">${body}</div>
      </td>
    </tr>`;
}

function consentBlock(accepted: boolean): string {
  const answer = yesNo(accepted);
  const background = accepted ? "#E8F8F7" : "#F7F9FA";
  const border = accepted ? "#1ABBB3" : "#E5E9EC";
  const color = accepted ? "#0F766E" : "#1A1A1A";
  return `
    <tr>
      <td style="padding:4px 0 16px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate">
          <tr>
            <td style="padding:14px 16px;background:${background};border:1px solid ${border};border-radius:12px;font-family:Arial,Helvetica,sans-serif">
              <div style="margin:0;font-size:12px;line-height:1.4;color:#6B7280">Consentimiento promocional</div>
              <div style="margin:4px 0 0;font-size:16px;line-height:1.4;font-weight:700;color:${color}">${answer}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

export function buildInternalNoticeEmail(payload: ContactLeadPayload): {
  subject: string;
  html: string;
  text: string;
} {
  const origin = classifyLead(payload);
  const commercial = payload.formulario === "comercial";
  const infoFarmacia = asText(payload.infoFarmacia);
  const freeMessage = payload.mensajeEsAutomatico ? "" : asText(payload.mensaje);
  const interest = interestDisplay(payload);
  const when = madridDateTime(payload.submittedAt);

  const provenance = [
    ["Origen", asText(payload.origen)],
    ["Medio", asText(payload.medio)],
    ["Campaña", asText(payload.campana)],
    ["Pieza", asText(payload.pieza)],
  ] as const;

  const commercialRows = [
    commercialField("Nombre", asText(payload.nombre)),
    commercialField("Farmacia", asText(payload.farmacia)),
    commercialField("Email", asText(payload.email)),
    commercialField("Teléfono", asText(payload.telefono)),
    commercialField("Interés principal", interest),
    commercialField("Mensaje", freeMessage, { preserveBreaks: true }),
    ...provenance.map(([label, value]) => commercialField(label, value)),
    consentBlock(payload.consentimientoPromocional),
    commercialField("Fecha", when),
  ].join("");

  const contactRows = [
    row("Nombre", asText(payload.nombre)),
    row("Farmacia", asText(payload.farmacia)),
    row("Email", asText(payload.email)),
    row("Teléfono", asText(payload.telefono)),
    row("Tipo de contacto", tipoLabel(payload.tipoUsuario)),
    row("Mensaje", asText(payload.mensaje)),
    infoFarmacia ? row("Cuéntanos algo de tu farmacia", infoFarmacia) : "",
    row("Origen", `${origin.label}${payload.source ? ` · ${payload.source}` : ""}`),
    row("Fecha", when),
  ].join("");

  const highIntentLabel = "Alta intención · Implantación";
  const html = commercial
    ? shell(`
    ${brandHeader()}
    <tr>
      <td style="padding:0 24px 8px">
        ${
          origin.highIntent
            ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;margin:0 0 16px">
                <tr>
                  <td style="padding:14px 16px;background:#E8F8F7;border:1px solid #1ABBB3;border-radius:12px;font-family:Arial,Helvetica,sans-serif">
                    <div style="margin:0;font-size:16px;line-height:1.4;font-weight:700;color:#0F766E">${highIntentLabel}</div>
                    <div style="margin:6px 0 0;font-size:14px;line-height:1.5;color:#374151">Esta farmacia quiere implantar FarmaFácil. Conviene responder con prioridad.</div>
                  </td>
                </tr>
              </table>`
            : `<div style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.4;font-weight:700;color:#0F766E">${escapeHtml(origin.label)}</div>`
        }
        <h1 style="font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.35;color:#0B0B0B;margin:0 0 6px">Nueva solicitud comercial</h1>
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#4B5563;margin:0 0 20px">Datos enviados desde la web.</p>
      </td>
    </tr>
    <tr>
      <td style="padding:0 24px 12px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
          ${commercialRows}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:0 24px 28px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#9CA3AF">
        Aviso interno FarmaFácil · ${escapeHtml(FARMAFACIL_CONTACT_EMAIL)}<br />
        El consentimiento promocional solo es Sí si la persona marcó esa casilla. La solicitud no lo implica.
      </td>
    </tr>
  `)
    : shell(`
    ${brandHeader()}
    <tr>
      <td style="padding:0 28px 8px">
        <div style="display:inline-block;background:#E8F8F7;color:#0F766E;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;padding:6px 10px;border-radius:999px">${escapeHtml(origin.label)}</div>
        <h1 style="font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.3;color:#0B0B0B;margin:14px 0 8px">Has recibido una nueva solicitud</h1>
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#4B5563;margin:0 0 18px">Resumen de los datos enviados desde la web corporativa.</p>
      </td>
    </tr>
    <tr>
      <td style="padding:0 28px 24px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
          ${contactRows}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:0 28px 28px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9CA3AF">
        Aviso interno FarmaFácil · ${escapeHtml(FARMAFACIL_CONTACT_EMAIL)}
      </td>
    </tr>
  `);

  const textLines = commercial
    ? [
        origin.subjectInternal,
        ...(origin.highIntent ? [highIntentLabel] : [origin.label]),
        "",
        `Nombre: ${asText(payload.nombre)}`,
        ...[
          ["Farmacia", asText(payload.farmacia)],
          ["Email", asText(payload.email)],
          ["Teléfono", asText(payload.telefono)],
          ["Interés principal", interest],
          ["Mensaje", freeMessage],
          ...provenance,
        ].flatMap(([label, value]) => (value.trim() ? [`${label}: ${value.trim()}`] : [])),
        `Consentimiento promocional: ${yesNo(payload.consentimientoPromocional)}`,
        `Fecha: ${when}`,
      ]
    : [
        origin.subjectInternal,
        "",
        `Nombre: ${asText(payload.nombre)}`,
        `Farmacia: ${shown(asText(payload.farmacia))}`,
        `Email: ${asText(payload.email)}`,
        `Teléfono: ${shown(asText(payload.telefono))}`,
        `Tipo: ${tipoLabel(payload.tipoUsuario)}`,
        `Mensaje: ${asText(payload.mensaje)}`,
        ...(infoFarmacia ? [`Cuéntanos algo de tu farmacia: ${infoFarmacia}`] : []),
        `Origen: ${origin.label}`,
        `Fecha: ${madridDateTime(payload.submittedAt)}`,
      ];

  return {
    subject: origin.subjectInternal,
    html,
    text: textLines.join("\n"),
  };
}

export function buildConfirmationEmail(payload: ContactLeadPayload): {
  subject: string;
  html: string;
  text: string;
} {
  const firstName = asText(payload.nombre).split(/\s+/)[0] || "hola";
  const calendly = FARMAFACIL_CALENDLY_URL;
  const html = shell(`
    ${brandHeader()}
    <tr>
      <td style="padding:8px 28px 8px">
        <h1 style="font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.3;color:#0B0B0B;margin:0 0 12px">Hemos recibido tu mensaje</h1>
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#374151;margin:0 0 12px">
          Hola ${escapeHtml(firstName)},
        </p>
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#374151;margin:0 0 12px">
          Gracias por contactar con FarmaFácil. Hemos recibido tu mensaje correctamente y el equipo lo revisará.
        </p>
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#374151;margin:0 0 22px">
          Te responderemos lo antes posible. Si prefieres hablar con nosotros, puedes reservar una llamada cuando te venga bien.
        </p>
        <a href="${escapeHtml(calendly)}" style="display:inline-block;background:#1ABBB3;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;text-decoration:none;padding:14px 22px;border-radius:999px">
          Reservar una llamada
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding:28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#4B5563">
        Un saludo,<br />
        <strong style="color:#0B0B0B">Equipo FarmaFácil</strong>
      </td>
    </tr>
  `);

  const text = [
    "Hemos recibido tu mensaje | FarmaFácil",
    "",
    `Hola ${firstName},`,
    "",
    "Gracias por contactar con FarmaFácil. Hemos recibido tu mensaje correctamente y el equipo lo revisará.",
    "Te responderemos lo antes posible.",
    "",
    `Reservar una llamada: ${calendly}`,
    "",
    "Equipo FarmaFácil",
  ].join("\n");

  return {
    subject: "Hemos recibido tu mensaje | FarmaFácil",
    html,
    text,
  };
}

async function sendViaResend(params: {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
}): Promise<ContactEmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, skipped: true, error: "Falta RESEND_API_KEY" };
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
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": params.idempotencyKey,
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
        /* keep slice */
      }
      return { ok: false, status: res.status, error: message };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message || "Error de red con Resend" };
  }
}

export async function sendContactEmails(
  payload: ContactLeadPayload
): Promise<{
  configured: boolean;
  missing: string[];
  admin: ContactEmailSendResult;
  confirmation: ContactEmailSendResult;
}> {
  const missing = getMissingContactEmailEnv();
  if (!isContactEmailConfigured()) {
    return {
      configured: false,
      missing,
      admin: { ok: false, skipped: true, error: "Email no configurado" },
      confirmation: { ok: false, skipped: true, error: "Email no configurado" },
    };
  }

  const from = getContactEmailFrom()!;
  const adminTo = getContactAdminEmail()!;
  const leadEmail = asText(payload.email);
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const internal = buildInternalNoticeEmail(payload);
  const confirmation = buildConfirmationEmail(payload);

  const admin = await sendViaResend({
    to: adminTo,
    from,
    replyTo: isValidEmail(leadEmail) ? leadEmail : undefined,
    subject: internal.subject,
    html: internal.html,
    text: internal.text,
    idempotencyKey: `contacto-admin-${stamp}`,
  });

  const confirmationResult = isValidEmail(leadEmail)
    ? await sendViaResend({
        to: leadEmail,
        from,
        replyTo: FARMAFACIL_CONTACT_EMAIL,
        subject: confirmation.subject,
        html: confirmation.html,
        text: confirmation.text,
        idempotencyKey: `contacto-confirm-${stamp}`,
      })
    : { ok: false, skipped: true, error: "Email del solicitante no válido" };

  return {
    configured: true,
    missing,
    admin,
    confirmation: confirmationResult,
  };
}
