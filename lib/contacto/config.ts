/**
 * Configuración de email corporativo (Resend) para formularios de contacto / prueba.
 * No usar remitentes de encuesta ni direcciones técnicas de proveedores.
 */

export function getContactEmailFrom(): string | undefined {
  const preferred = process.env.CONTACT_EMAIL_FROM?.trim();
  if (preferred) return preferred;
  // No reutilizar EMAIL_FROM (puede ser encuestas@ u otros módulos).
  // Remitente corporativo por defecto (requiere dominio verificado en Resend).
  return "FarmaFácil <contacto@farmafacil.solutions>";
}

/** Destinatario de avisos internos (equipo FarmaFácil). */
export function getContactAdminEmail(): string | undefined {
  const dedicated = process.env.CONTACT_ADMIN_EMAIL?.trim();
  if (dedicated) return dedicated;
  return process.env.FARMAFACIL_CONTACT_EMAIL?.trim() || "contacto@farmafacil.solutions";
}

export function getMissingContactEmailEnv(): string[] {
  const missing: string[] = [];
  if (!process.env.RESEND_API_KEY?.trim()) missing.push("RESEND_API_KEY");
  if (!getContactEmailFrom()) missing.push("CONTACT_EMAIL_FROM");
  if (!getContactAdminEmail()) missing.push("CONTACT_ADMIN_EMAIL");
  return missing;
}

export function isContactEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && getContactEmailFrom());
}
