import {
  getAppsScriptSecret,
  getAppsScriptUrl,
  normalizeBonoStatus,
  tokenPreview,
  type AppsScriptBonusStatusResponse,
  type BonoTokenStatus,
  type SolicitarBonoPayload,
} from "./types";

export type BonusStatusResult =
  | { ok: true; status: BonoTokenStatus; raw: AppsScriptBonusStatusResponse }
  | {
      ok: false;
      error: string;
      status?: BonoTokenStatus;
      httpStatus?: number;
      raw?: AppsScriptBonusStatusResponse;
    };

export type BonusClaimResult =
  | {
      ok: true;
      status: "claimed" | "already_claimed";
      raw: AppsScriptBonusStatusResponse;
    }
  | {
      ok: false;
      error: string;
      status?: BonoTokenStatus;
      httpStatus?: number;
      raw?: AppsScriptBonusStatusResponse;
    };

async function parseAppsScriptJson(
  responseText: string
): Promise<AppsScriptBonusStatusResponse | null> {
  try {
    return JSON.parse(responseText) as AppsScriptBonusStatusResponse;
  } catch {
    return null;
  }
}

/**
 * GET {APPS_SCRIPT_URL}?action=bonus-status&token=XXXX
 */
export async function fetchBonusStatusFromAppsScript(
  token: string
): Promise<BonusStatusResult> {
  const appsScriptUrl = getAppsScriptUrl();
  if (!appsScriptUrl) {
    return { ok: false, error: "Falta GOOGLE_SHEETS_ENCUESTAS_URL" };
  }

  const url = new URL(appsScriptUrl);
  url.searchParams.set("action", "bonus-status");
  url.searchParams.set("token", token);

  console.log("[bono] Consultando estado en Apps Script", {
    token: tokenPreview(token),
  });

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
    });

    const responseText = await res.text();
    console.log("[bono] Apps Script HTTP:", res.status);
    console.log("[bono] Apps Script response:", responseText.slice(0, 500));

    const data = await parseAppsScriptJson(responseText);
    if (!data) {
      return {
        ok: false,
        error: `Apps Script devolvió una respuesta no JSON (HTTP ${res.status})`,
        httpStatus: res.status,
      };
    }

    const status = normalizeBonoStatus(data.status);
    if (!status) {
      return {
        ok: false,
        error: data.message || data.error || "Estado de token no reconocido",
        httpStatus: res.status,
        raw: data,
      };
    }

    // Confiar solo en el status real del script
    return { ok: true, status, raw: data };
  } catch (err) {
    console.error("[bono] Error de red al consultar Apps Script:", (err as Error).message);
    return {
      ok: false,
      error: (err as Error).message || "Error de red al contactar Apps Script",
    };
  }
}

/**
 * POST JSON a Apps Script /exec con action=bonus-claim
 */
export async function claimBonusViaAppsScript(
  payload: SolicitarBonoPayload
): Promise<BonusClaimResult> {
  const appsScriptUrl = getAppsScriptUrl();
  const secret = getAppsScriptSecret();

  if (!appsScriptUrl) {
    return { ok: false, error: "Falta GOOGLE_SHEETS_ENCUESTAS_URL" };
  }
  if (!secret) {
    return { ok: false, error: "Falta ENCUESTA_APPS_SCRIPT_SECRET" };
  }

  const body = {
    action: "bonus-claim",
    secret,
    token: payload.token,
    nombre: payload.nombre,
    farmacia: payload.farmacia,
    direccion: payload.direccion,
    codigoPostal: payload.codigoPostal,
    municipio: payload.municipio,
    email: payload.email,
    whatsapp: payload.whatsapp,
    confirmacionFarmacia: payload.confirmacionFarmacia,
    consentimientoComercial: payload.consentimientoComercial,
  };

  console.log("[bono] Enviando a Apps Script", {
    token: tokenPreview(payload.token),
    hasSecret: true,
  });

  try {
    const res = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      redirect: "follow",
    });

    const responseText = await res.text();
    console.log("[bono] Apps Script HTTP:", res.status);
    console.log("[bono] Apps Script response:", responseText.slice(0, 500));

    const data = await parseAppsScriptJson(responseText);
    if (!data) {
      return {
        ok: false,
        error: `Apps Script devolvió una respuesta no JSON (HTTP ${res.status})`,
        httpStatus: res.status,
      };
    }

    const status = normalizeBonoStatus(data.status);

    if (data.success === true && status === "claimed") {
      return { ok: true, status: "claimed", raw: data };
    }

    if (data.success === true && status === "already_claimed") {
      return { ok: true, status: "already_claimed", raw: data };
    }

    // success:false u otros estados → no éxito de registro
    return {
      ok: false,
      error:
        data.message ||
        data.error ||
        "Apps Script no confirmó el registro de la solicitud",
      status: status || undefined,
      httpStatus: res.status,
      raw: data,
    };
  } catch (err) {
    console.error("[bono] Error de red al reclamar bono:", (err as Error).message);
    return {
      ok: false,
      error: (err as Error).message || "Error de red al contactar Apps Script",
    };
  }
}
