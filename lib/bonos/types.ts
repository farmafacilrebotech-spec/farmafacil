export type BonoTokenStatus =
  | "available"
  | "already_claimed"
  | "expired"
  | "invalid"
  | "claimed";

/** Estados de entrega final (/acceder-bono). Gobernados por Apps Script. */
export type BonoEntregaStatus =
  | "available"
  | "already_revealed"
  | "expired"
  | "invalid";

export type SolicitarBonoPayload = {
  token: string;
  nombre: string;
  farmacia: string;
  direccion: string;
  codigoPostal: string;
  municipio: string;
  email: string;
  whatsapp: string;
  confirmacionFarmacia: boolean;
  consentimientoComercial: boolean;
};

export type AppsScriptBonusStatusResponse = {
  success?: boolean;
  status?: string;
  message?: string;
  error?: string;
  [key: string]: unknown;
};

export type BonoEntregaMeta = {
  nombre?: string;
  farmacia?: string;
  importe?: string;
  fechaLimite?: string;
};

export type AppsScriptBonusDeliveryResponse = AppsScriptBonusStatusResponse & {
  nombre?: string;
  farmacia?: string;
  importe?: string | number;
  fechaLimite?: string;
  fecha_limite?: string;
  accessDeadline?: string;
  codigo?: string;
  codigoAmazon?: string;
  amazonCode?: string;
  code?: string;
  voucherCode?: string;
};

export function normalizeBonoStatus(value: unknown): BonoTokenStatus | null {
  if (typeof value !== "string") return null;
  const status = value.trim().toLowerCase();
  if (status === "available") return "available";
  if (status === "already_claimed") return "already_claimed";
  if (status === "expired") return "expired";
  if (status === "invalid") return "invalid";
  if (status === "claimed") return "claimed";
  // Compatibilidad por si el script devolviera "valid"
  if (status === "valid") return "available";
  return null;
}

/**
 * Normaliza el status de entrega. Solo acepta valores reconocibles;
 * no inventa estados a partir de mensajes genéricos.
 */
export function normalizeBonoEntregaStatus(
  value: unknown
): BonoEntregaStatus | null {
  if (typeof value !== "string") return null;
  const status = value.trim().toLowerCase().replace(/[\s-]+/g, "_");

  if (
    status === "available" ||
    status === "ready" ||
    status === "pending_reveal" ||
    status === "ready_to_reveal"
  ) {
    return "available";
  }

  if (
    status === "already_revealed" ||
    status === "revealed" ||
    status === "delivered" ||
    status === "ya_revelado"
  ) {
    return "already_revealed";
  }

  if (
    status === "expired" ||
    status === "recovered" ||
    status === "recuperado" ||
    status === "caducado"
  ) {
    return "expired";
  }

  if (status === "invalid") return "invalid";

  return null;
}

/** Extrae metadatos opcionales sin inventar valores. */
export function extractBonoEntregaMeta(
  data: AppsScriptBonusDeliveryResponse | null | undefined
): BonoEntregaMeta {
  if (!data) return {};

  const meta: BonoEntregaMeta = {};

  if (typeof data.nombre === "string" && data.nombre.trim()) {
    meta.nombre = data.nombre.trim();
  }
  if (typeof data.farmacia === "string" && data.farmacia.trim()) {
    meta.farmacia = data.farmacia.trim();
  }

  if (typeof data.importe === "string" && data.importe.trim()) {
    meta.importe = data.importe.trim();
  } else if (typeof data.importe === "number" && Number.isFinite(data.importe)) {
    meta.importe = String(data.importe);
  }

  const fechaRaw =
    (typeof data.fechaLimite === "string" && data.fechaLimite) ||
    (typeof data.fecha_limite === "string" && data.fecha_limite) ||
    (typeof data.accessDeadline === "string" && data.accessDeadline) ||
    "";
  if (fechaRaw.trim()) {
    meta.fechaLimite = fechaRaw.trim();
  }

  return meta;
}

/**
 * Extrae el código Amazon solo si Apps Script lo envía explícitamente.
 * No inventa ni rellena valores por defecto.
 */
export function extractAmazonCode(
  data: AppsScriptBonusDeliveryResponse | null | undefined
): string | undefined {
  if (!data) return undefined;

  const candidates = [
    data.codigoAmazon,
    data.amazonCode,
    data.codigo,
    data.code,
    data.voucherCode,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

export function tokenPreview(token: string): string {
  return token.slice(0, 8);
}

export function getAppsScriptUrl(): string | undefined {
  return process.env.GOOGLE_SHEETS_ENCUESTAS_URL?.trim() || undefined;
}

export function getAppsScriptSecret(): string | undefined {
  return process.env.ENCUESTA_APPS_SCRIPT_SECRET?.trim() || undefined;
}

export const BONO_NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, private",
  Pragma: "no-cache",
} as const;
