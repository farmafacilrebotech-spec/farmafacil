export function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function normalizeName(value: string): string {
  return collapseWhitespace(value);
}

export function normalizeEmail(value: string): string {
  return collapseWhitespace(value).toLowerCase();
}

export function normalizePhone(value: string): string {
  const cleaned = value.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+34")) {
    return "+34" + cleaned.slice(3).replace(/\D/g, "");
  }
  if (cleaned.startsWith("0034")) {
    return "+34" + cleaned.slice(4).replace(/\D/g, "");
  }
  const digits = cleaned.replace(/\D/g, "");
  if (digits.length === 9) return `+34${digits}`;
  if (digits.length === 11 && digits.startsWith("34")) {
    return `+34${digits.slice(2)}`;
  }
  return cleaned.startsWith("+") ? cleaned : digits;
}

export function normalizeCodigoPostal(value: string): string {
  return value.replace(/\D/g, "").slice(0, 5);
}

export function isSpanishPhone(value: string): boolean {
  const n = normalizePhone(value);
  return /^\+34[6789]\d{8}$/.test(n);
}

export function isSpanishPostalCode(value: string): boolean {
  return /^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(value.replace(/\D/g, ""));
}

const FAKE_PATTERNS = [
  /^test$/i,
  /^prueba$/i,
  /^asdf+/i,
  /^qwerty/i,
  /^xxx+$/i,
  /^abc+$/i,
  /^123456/,
  /^000000/,
  /^lorem/i,
  /^falso$/i,
  /^aaa+$/i,
  /^n\/?a$/i,
  /^none$/i,
  /^no\s*se$/i,
];

export function looksFake(value: string): boolean {
  const v = collapseWhitespace(value);
  if (!v) return true;
  if (/^(.)\1{4,}$/.test(v.replace(/\s/g, ""))) return true;
  if (/^\d+$/.test(v) && v.length >= 5) return true;
  return FAKE_PATTERNS.some((re) => re.test(v));
}

export function joinList(values: string[]): string {
  return values.filter(Boolean).join(" | ");
}

export function yesNo(value: boolean): string {
  return value ? "Sí" : "No";
}
