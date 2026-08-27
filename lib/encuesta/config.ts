export function isEncuestaEnabled(): boolean {
  const flag = process.env.ENCUESTA_ENABLED;
  if (flag === undefined || flag === "") return true;
  return flag === "true" || flag === "1";
}

/**
 * Indica si el incentivo (bono) está disponible para mostrar/prometer.
 * Independiente de ENCUESTA_ENABLED: la encuesta puede seguir abierta sin bono.
 *
 * Desactivar con ENCUESTA_BONOS_DISPONIBLES=false (p. ej. BONO_ACTIVO=NO o
 * cupo MAXIMO_BONOS agotado, gestionado operativamente).
 */
export function areBonosDisponibles(): boolean {
  const flag = process.env.ENCUESTA_BONOS_DISPONIBLES;
  if (flag === undefined || flag === "") return true;
  return flag === "true" || flag === "1";
}

export function getEncuestaSheetId(): string | undefined {
  return process.env.ENCUESTA_GSHEET_ID || process.env.GSHEET_GENERAL_ID;
}

export const ENCUESTA_SHEET_TAB =
  process.env.ENCUESTA_GSHEET_TAB || "Encuesta Farmacias";

export function getAdminEmail(): string | undefined {
  const value = process.env.ENCUESTA_ADMIN_EMAIL?.trim();
  return value || undefined;
}

export function getEncuestaEmailFrom(): string | undefined {
  const value = process.env.ENCUESTA_EMAIL_FROM?.trim();
  return value || undefined;
}

export function getEncuestaReplyTo(): string | undefined {
  const value = process.env.ENCUESTA_REPLY_TO?.trim();
  return value || undefined;
}

export function getSheetsAdminUrl(): string | undefined {
  return process.env.ENCUESTA_SHEETS_ADMIN_URL;
}

/** Comprueba variables de Resend para la encuesta. Devuelve nombres faltantes. */
export function getMissingEncuestaEmailEnv(): string[] {
  const missing: string[] = [];
  if (!process.env.RESEND_API_KEY?.trim()) missing.push("RESEND_API_KEY");
  if (!getEncuestaEmailFrom()) missing.push("ENCUESTA_EMAIL_FROM");
  if (!getEncuestaReplyTo()) missing.push("ENCUESTA_REPLY_TO");
  if (!getAdminEmail()) missing.push("ENCUESTA_ADMIN_EMAIL");
  return missing;
}

export const STORAGE_KEY = "farmafacil_encuesta_draft_v1";
export const MIN_COMPLETION_SECONDS = 90;
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
export const RATE_LIMIT_MAX = 3;
