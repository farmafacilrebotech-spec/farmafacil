import {
  extractAmazonCode,
  extractBonoEntregaMeta,
  getAppsScriptSecret,
  getAppsScriptUrl,
  normalizeBonoEntregaStatus,
  normalizeBonoStatus,
  tokenPreview,
  type AppsScriptBonusDeliveryResponse,
  type AppsScriptBonusStatusResponse,
  type BonoEntregaMeta,
  type BonoEntregaStatus,
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

export type BonusDeliveryStatusResult =
  | {
      ok: true;
      status: BonoEntregaStatus;
      meta: BonoEntregaMeta;
      /** Solo si Apps Script lo incluye en la respuesta de estado. */
      codigoAmazon?: string;
      rawStatus?: string;
    }
  | {
      ok: false;
      error: string;
      status?: BonoEntregaStatus;
      httpStatus?: number;
    };

export type BonusRevealResult =
  | {
      ok: true;
      status: "revealed" | "already_revealed";
      codigoAmazon: string;
      meta: BonoEntregaMeta;
    }
  | {
      ok: false;
      error: string;
      status?: BonoEntregaStatus;
      httpStatus?: number;
      /** Ya revelado sin código en la respuesta. */
      alreadyRevealedWithoutCode?: boolean;
    };

async function parseDeliveryJson(
  responseText: string
): Promise<AppsScriptBonusDeliveryResponse | null> {
  try {
    return JSON.parse(responseText) as AppsScriptBonusDeliveryResponse;
  } catch {
    return null;
  }
}

/**
 * GET {APPS_SCRIPT_URL}?action=bonus-delivery-status&token=XXXX
 * No solicita ni revela el código Amazon.
 */
export async function fetchBonusDeliveryStatusFromAppsScript(
  token: string
): Promise<BonusDeliveryStatusResult> {
  const appsScriptUrl = getAppsScriptUrl();
  if (!appsScriptUrl) {
    return { ok: false, error: "Falta GOOGLE_SHEETS_ENCUESTAS_URL" };
  }

  const url = new URL(appsScriptUrl);
  url.searchParams.set("action", "bonus-delivery-status");
  url.searchParams.set("token", token);

  console.log("[bono-entrega] Consultando Apps Script", {
    token: tokenPreview(token),
  });

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
    });

    const responseText = await res.text();
    console.log("[bono-entrega] Apps Script HTTP:", res.status);

    const data = await parseDeliveryJson(responseText);
    if (!data) {
      return {
        ok: false,
        error: `Apps Script devolvió una respuesta no JSON (HTTP ${res.status})`,
        httpStatus: res.status,
      };
    }

    const status = normalizeBonoEntregaStatus(data.status);
    console.log(
      "[bono-entrega] Estado recibido:",
      status || (typeof data.status === "string" ? data.status : "(sin status)")
    );

    if (!status) {
      return {
        ok: false,
        error:
          data.message ||
          data.error ||
          "Apps Script no devolvió un estado de entrega reconocido",
        httpStatus: res.status,
      };
    }

    const meta = extractBonoEntregaMeta(data);
    // Solo incluir código si el script lo envía en este endpoint (p. ej. ya revelado).
    const codigoAmazon =
      status === "already_revealed" ? extractAmazonCode(data) : undefined;

    return {
      ok: true,
      status,
      meta,
      ...(codigoAmazon ? { codigoAmazon } : {}),
      rawStatus: typeof data.status === "string" ? data.status : undefined,
    };
  } catch (err) {
    console.error(
      "[bono-entrega] Error de red al consultar Apps Script:",
      (err as Error).message
    );
    return {
      ok: false,
      error: (err as Error).message || "Error de red al contactar Apps Script",
    };
  }
}

/**
 * POST JSON a Apps Script con action=bonus-reveal.
 * El secret solo se añade en servidor.
 */
export async function revealBonusViaAppsScript(
  token: string
): Promise<BonusRevealResult> {
  const appsScriptUrl = getAppsScriptUrl();
  const secret = getAppsScriptSecret();

  if (!appsScriptUrl) {
    return { ok: false, error: "Falta GOOGLE_SHEETS_ENCUESTAS_URL" };
  }
  if (!secret) {
    return { ok: false, error: "Falta ENCUESTA_APPS_SCRIPT_SECRET" };
  }

  const body = {
    action: "bonus-reveal",
    secret,
    token,
  };

  console.log("[bono-entrega] Enviando revelado a Apps Script", {
    token: tokenPreview(token),
  });

  try {
    const res = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      redirect: "follow",
      cache: "no-store",
    });

    const responseText = await res.text();
    console.log("[bono-entrega] Apps Script HTTP:", res.status);

    const data = await parseDeliveryJson(responseText);
    if (!data) {
      return {
        ok: false,
        error: `Apps Script devolvió una respuesta no JSON (HTTP ${res.status})`,
        httpStatus: res.status,
      };
    }

    const status = normalizeBonoEntregaStatus(data.status);
    const codigoAmazon = extractAmazonCode(data);
    const meta = extractBonoEntregaMeta(data);

    // Éxito solo con código real + confirmación explícita del script
    const rawStatus =
      typeof data.status === "string" ? data.status.trim().toLowerCase() : "";
    const confirmedReveal =
      data.success === true ||
      status === "already_revealed" ||
      rawStatus === "revealed";

    if (codigoAmazon && confirmedReveal) {
      const revealStatus: "revealed" | "already_revealed" =
        status === "already_revealed" ? "already_revealed" : "revealed";
      console.log("[bono-entrega] Revelado confirmado");
      return {
        ok: true,
        status: revealStatus,
        codigoAmazon,
        meta,
      };
    }

    // Ya revelado sin código → UI de contacto, no inventar código
    if (status === "already_revealed" && !codigoAmazon) {
      return {
        ok: false,
        error:
          data.message ||
          data.error ||
          "Este bono ya fue entregado anteriormente.",
        status: "already_revealed",
        httpStatus: res.status,
        alreadyRevealedWithoutCode: true,
      };
    }

    if (status === "expired" || status === "invalid" || status === "available") {
      return {
        ok: false,
        error:
          data.message ||
          data.error ||
          "Apps Script no confirmó el revelado del bono",
        status,
        httpStatus: res.status,
      };
    }

    return {
      ok: false,
      error:
        data.message ||
        data.error ||
        "Apps Script no confirmó el revelado del bono",
      status: status || undefined,
      httpStatus: res.status,
    };
  } catch (err) {
    console.error(
      "[bono-entrega] Error de red al revelar bono:",
      (err as Error).message
    );
    return {
      ok: false,
      error: (err as Error).message || "Error de red al contactar Apps Script",
    };
  }
}
