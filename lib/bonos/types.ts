export type BonoTokenStatus =
  | "available"
  | "already_claimed"
  | "expired"
  | "invalid"
  | "claimed";

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

export function tokenPreview(token: string): string {
  return token.slice(0, 8);
}

export function getAppsScriptUrl(): string | undefined {
  return process.env.GOOGLE_SHEETS_ENCUESTAS_URL?.trim() || undefined;
}

export function getAppsScriptSecret(): string | undefined {
  return process.env.ENCUESTA_APPS_SCRIPT_SECRET?.trim() || undefined;
}
