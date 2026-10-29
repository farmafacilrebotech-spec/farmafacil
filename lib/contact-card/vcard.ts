import fs from "node:fs";
import path from "node:path";
import type { ResolvedContactCard } from "./types";

/** Escape de texto para vCard 3.0 (RFC 2426) */
export function escapeVCardText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

/**
 * Plegado de líneas vCard 3.0 (máx. ~75 octetos; continuación con espacio).
 * Necesario para PHOTO en Base64.
 */
export function foldVCardLine(line: string): string {
  const max = 75;
  if (line.length <= max) return line;
  const parts: string[] = [];
  let remaining = line;
  parts.push(remaining.slice(0, max));
  remaining = remaining.slice(max);
  while (remaining.length > 0) {
    parts.push(" " + remaining.slice(0, max - 1));
    remaining = remaining.slice(max - 1);
  }
  return parts.join("\r\n");
}

export type VCardPhoto = {
  /** Tipo MIME corto vCard 3.0, p. ej. JPEG */
  type: "JPEG" | "PNG";
  /** Base64 sin espacios ni saltos */
  base64: string;
};

/**
 * Carga el logotipo oficial reducido para PHOTO (JPEG ~5 KB).
 * Si el archivo no existe o supera el límite, no se incluye PHOTO.
 */
export function loadContactCardPhoto(options?: {
  cwd?: string;
  maxBytes?: number;
}): VCardPhoto | null {
  const maxBytes = options?.maxBytes ?? 12_000;
  const root = options?.cwd ?? process.cwd();
  const filePath = path.join(
    root,
    "public/images/logo/farmafacil-contact-photo.jpg"
  );
  try {
    const buf = fs.readFileSync(filePath);
    if (buf.byteLength === 0 || buf.byteLength > maxBytes) return null;
    return {
      type: "JPEG",
      base64: buf.toString("base64"),
    };
  } catch {
    return null;
  }
}

/**
 * Genera un vCard 3.0 UTF-8 compatible con iOS y Android.
 * PHOTO opcional: representación JPEG compacta del logo oficial (no el PNG de 975 KB).
 */
export function buildVCard(
  contact: ResolvedContactCard,
  options?: { photo?: VCardPhoto | null }
): string {
  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "PRODID:-//FarmaFacil//DigitalBusinessCard//ES",
    `N;CHARSET=UTF-8:${escapeVCardText(contact.familyName)};${escapeVCardText(contact.givenName)};;;`,
    `FN;CHARSET=UTF-8:${escapeVCardText(contact.fullName)}`,
    `ORG;CHARSET=UTF-8:${escapeVCardText(contact.organization)}`,
    `TITLE;CHARSET=UTF-8:${escapeVCardText(contact.title)}`,
    `EMAIL;TYPE=INTERNET:${escapeVCardText(contact.email)}`,
  ];

  if (contact.phone) {
    // Formato legible solicitado; iOS/Android aceptan E.164 con espacios.
    lines.push(
      `TEL;TYPE=CELL,VOICE:${escapeVCardText(contact.phone.display)}`
    );
  }

  lines.push(`URL:${escapeVCardText(contact.website)}`);

  const photo = options?.photo;
  if (photo?.base64) {
    lines.push(
      foldVCardLine(
        `PHOTO;ENCODING=b;TYPE=${photo.type}:${photo.base64}`
      )
    );
  }

  lines.push("END:VCARD");

  return lines.join("\r\n") + "\r\n";
}
