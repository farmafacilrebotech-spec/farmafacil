import type { ResolvedPhone } from "./types";

/**
 * Normaliza un teléfono profesional desde env.
 * Acepta formatos con espacios o solo dígitos; exige prefijo internacional usable.
 */
export function resolvePhoneFromEnv(raw: string | undefined): ResolvedPhone | null {
  if (!raw?.trim()) return null;

  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 9) return null;

  const e164 = digits.startsWith("00") ? digits.slice(2) : digits;
  if (e164.length < 9) return null;

  const withPlus = `+${e164}`;
  // Formato de visualización ES móvil: +34 XXX XXX XXX
  const display =
    e164.startsWith("34") && e164.length === 11
      ? `+34 ${e164.slice(2, 5)} ${e164.slice(5, 8)} ${e164.slice(8)}`
      : withPlus;

  return {
    display,
    e164,
    telHref: `tel:${withPlus}`,
    whatsappUrl: `https://wa.me/${e164}`,
  };
}
