import { sendContactEmails } from "./email";
import { normalizeContactRequest } from "./payload";
import type { ContactLeadPayload } from "./types";

export type ContactSubmissionResult = {
  status: number;
  body: Record<string, unknown>;
};

const REGISTRO_NO_CONFIRMADO =
  "No hemos podido registrar tu solicitud. Los datos siguen en el formulario; inténtalo de nuevo en unos minutos.";

function sheetConfirmed(body: unknown): boolean {
  return Boolean(
    body &&
      typeof body === "object" &&
      (body as { success?: unknown }).success === true
  );
}

function registroRechazado(): ContactSubmissionResult {
  return {
    status: 502,
    body: { success: false, error: REGISTRO_NO_CONFIRMADO },
  };
}

/**
 * Misma tubería que el formulario de contacto: hoja operativa y, después, Resend.
 * El Apps Script externo no se modifica: ignora las claves que aún no tiene en columnas.
 */
export async function processContactSubmission(
  raw: unknown
): Promise<ContactSubmissionResult> {
  const normalized = normalizeContactRequest(raw);
  if (!normalized.ok) {
    return {
      status: normalized.status,
      body: { success: false, error: normalized.error },
    };
  }

  const payload: ContactLeadPayload = normalized.payload;
  const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("Falta NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL en entorno");
    return {
      status: 500,
      body: { success: false, error: "Config error: falta webhook de contacto" },
    };
  }

  let sheetResponse: Response;
  try {
    sheetResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    console.error("Contacto: sin conexión con el registro");
    return registroRechazado();
  }

  const rawText = await sheetResponse.text();

  if (!sheetResponse.ok) {
    console.error("Contacto: el registro respondió sin éxito");
    return registroRechazado();
  }

  let sheetResult: unknown = null;
  try {
    sheetResult = JSON.parse(rawText);
  } catch {
    sheetResult = null;
  }

  if (!sheetConfirmed(sheetResult)) {
    console.error("Contacto: el registro no confirmó la fila");
    return registroRechazado();
  }

  const emailResult = await sendContactEmails(payload);
  if (!emailResult.configured) {
    console.warn(
      "Contacto: Resend no configurado completamente.",
      emailResult.missing.join(", ")
    );
  } else {
    if (!emailResult.admin.ok && !emailResult.admin.skipped) {
      console.error("Contacto: fallo aviso interno Resend", emailResult.admin.status || "");
    }
    if (!emailResult.confirmation.ok && !emailResult.confirmation.skipped) {
      console.error(
        "Contacto: fallo confirmación Resend",
        emailResult.confirmation.status || ""
      );
    }
  }

  return {
    status: 200,
    body: {
      success: true,
      result: sheetResult,
      email: {
        configured: emailResult.configured,
        adminSent: Boolean(emailResult.admin.ok),
        confirmationSent: Boolean(emailResult.confirmation.ok),
      },
    },
  };
}
