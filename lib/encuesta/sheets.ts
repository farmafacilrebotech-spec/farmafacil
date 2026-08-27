import {
  buildSheetRecord,
  findMissingSheetHeaders,
  findUnexpectedSheetKeys,
  type SheetRecord,
} from "./headers";
import type { CoherenceResult, SurveyFormData, SurveyEstado } from "./types";
import type { DuplicateFlags } from "./coherence";

export type AppsScriptSubmitResult =
  | {
      ok: true;
      result?: unknown;
      duplicateRequest?: boolean;
      /** Valor real devuelto por Apps Script tras registrar. */
      bonoDisponible?: boolean;
    }
  | { ok: false; error: string };

type AppsScriptResponse = {
  success?: boolean;
  message?: string;
  code?: string;
  duplicateRequest?: boolean;
  error?: string;
  bonoDisponible?: boolean;
};

/**
 * Envía la respuesta al Google Apps Script.
 * Payload plano: claves = encabezados exactos de la hoja + `secret`.
 */
export async function submitEncuestaToAppsScript(
  record: SheetRecord,
  responseId: string,
  options?: { bonoDisponibleEnEnvio?: boolean }
): Promise<AppsScriptSubmitResult> {
  const appsScriptUrl = process.env.GOOGLE_SHEETS_ENCUESTAS_URL;
  const googleSheetsSecret = process.env.GOOGLE_SHEETS_SECRET;

  if (!appsScriptUrl) {
    return { ok: false, error: "Falta GOOGLE_SHEETS_ENCUESTAS_URL" };
  }
  if (!googleSheetsSecret) {
    return { ok: false, error: "Falta GOOGLE_SHEETS_SECRET" };
  }

  const bonoDisponibleEnEnvio =
    typeof options?.bonoDisponibleEnEnvio === "boolean"
      ? options.bonoDisponibleEnEnvio
      : record["Bono Disponible En Envío"] === "Sí";

  const sheetsPayload: Record<string, string | number | string[] | boolean> = {
    ...record,
    "ID Respuesta": responseId || String(record["ID Respuesta"] || ""),
    // Campo explícito para Apps Script (además del encabezado de hoja)
    bonoDisponibleEnEnvio,
    secret: googleSheetsSecret,
  };

  const payloadKeys = Object.keys(sheetsPayload);
  const keysWithoutSecret = payloadKeys.filter((key) => key !== "secret");

  console.log("[encuesta] Claves enviadas a Sheets:", {
    responseId: sheetsPayload["ID Respuesta"],
    keys: keysWithoutSecret,
  });

  // Chequeo temporal: solo nombres de claves (nunca valores)
  const missingExpectedHeaders = findMissingSheetHeaders(payloadKeys);
  const unexpectedPayloadKeys = findUnexpectedSheetKeys(payloadKeys).filter(
    (key) => key !== "bonoDisponibleEnEnvio"
  );
  console.log("[encuesta] Chequeo claves Sheets:", {
    missingExpectedHeaders,
    unexpectedPayloadKeys,
    hasHashIp: Object.prototype.hasOwnProperty.call(sheetsPayload, "Hash IP"),
  });
  if (missingExpectedHeaders.length > 0) {
    console.warn(
      "[encuesta] Encabezados esperados ausentes en el payload:",
      missingExpectedHeaders
    );
  }
  if (unexpectedPayloadKeys.length > 0) {
    console.warn(
      "[encuesta] Claves del payload no listadas como encabezado:",
      unexpectedPayloadKeys
    );
  }

  console.log("[encuesta] Enviando a Apps Script:", {
    responseId: sheetsPayload["ID Respuesta"],
    hasSecret: Boolean(sheetsPayload.secret),
    fieldCount: payloadKeys.length,
  });

  try {
    const appsScriptResponse = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sheetsPayload),
      redirect: "follow",
    });

    const responseText = await appsScriptResponse.text();

    let responseData: AppsScriptResponse | null = null;

    try {
      responseData = JSON.parse(responseText) as AppsScriptResponse;
    } catch {
      console.error(
        "[encuesta] Apps Script devolvió una respuesta no JSON:",
        responseText
      );

      return {
        ok: false,
        error: `Apps Script devolvió una respuesta no válida (HTTP ${appsScriptResponse.status})`,
      };
    }

    if (!appsScriptResponse.ok || !responseData?.success) {
      console.error("[encuesta] Apps Script rechazó el registro:", {
        status: appsScriptResponse.status,
        response: responseData,
        rawResponse: responseText,
      });

      return {
        ok: false,
        error:
          responseData?.message ||
          responseData?.error ||
          `No se pudo registrar en Google Sheets (HTTP ${appsScriptResponse.status})`,
      };
    }

    const bonoDisponible =
      typeof responseData.bonoDisponible === "boolean"
        ? responseData.bonoDisponible
        : undefined;

    console.log("[encuesta] Google Sheets registrado correctamente:", {
      duplicateRequest: responseData.duplicateRequest || false,
      responseId: sheetsPayload["ID Respuesta"],
      bonoDisponible:
        typeof bonoDisponible === "boolean" ? bonoDisponible : "(no informado)",
    });

    return {
      ok: true,
      result: responseData,
      duplicateRequest: responseData.duplicateRequest || false,
      ...(typeof bonoDisponible === "boolean" ? { bonoDisponible } : {}),
    };
  } catch (err) {
    console.error("[encuesta] Error de red al contactar con Apps Script:", err);
    return {
      ok: false,
      error: (err as Error).message || "Error de red al contactar con Google Sheets",
    };
  }
}

export function buildEncuestaSheetPayload(params: {
  id: string;
  data: SurveyFormData;
  estado: SurveyEstado;
  coherence: CoherenceResult;
  duplicatePotential: boolean;
  emailError?: string;
  ipHash?: string;
  originHash?: string;
  durationSeconds?: number;
  bonoDisponibleEnEnvio?: boolean;
}): SheetRecord {
  return buildSheetRecord(params);
}

export async function findDuplicates(_data: SurveyFormData): Promise<DuplicateFlags> {
  return {};
}
