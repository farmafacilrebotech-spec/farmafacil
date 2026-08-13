import { MIN_COMPLETION_SECONDS } from "./config";
import {
  looksFake,
  normalizeEmail,
  normalizeName,
  normalizePhone,
} from "./normalize";
import { codigoPostalCompatibleConProvincia } from "./provinces";
import type { CoherenceResult, SurveyFormData } from "./types";
import { isSpanishPhone, isSpanishPostalCode } from "./normalize";

export type DuplicateFlags = {
  email?: boolean;
  telefono?: boolean;
  farmacia?: boolean;
  combo?: boolean;
  ip?: boolean;
};

export function evaluateCoherence(
  data: SurveyFormData,
  duplicates: DuplicateFlags = {},
  durationSeconds?: number
): CoherenceResult {
  const alerts: string[] = [];
  let score = 100;

  const deduct = (points: number, alert: string) => {
    score -= points;
    alerts.push(alert);
  };

  if (!data.declaracion_titularidad) {
    deduct(40, "Falta la declaración de titularidad");
  }
  if (!data.aceptacion_privacidad) {
    deduct(40, "Falta aceptación de privacidad y condiciones");
  }
  if (data.cargo === "Otro") {
    deduct(25, "Cargo marcado como «Otro» — no apto automáticamente para bono");
  }
  if (data.cargo !== "Titular" && data.cargo !== "Cotitular" && data.cargo !== "Otro") {
    deduct(30, "Cargo no válido");
  }

  if (!isSpanishPhone(data.telefono)) deduct(20, "Teléfono con formato dudoso");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(data.email))) {
    deduct(20, "Email con formato dudoso");
  }
  if (!isSpanishPostalCode(data.codigo_postal)) {
    deduct(15, "Código postal no válido");
  } else if (!codigoPostalCompatibleConProvincia(data.codigo_postal, data.provincia)) {
    deduct(20, "Código postal incompatible con la provincia");
  }

  for (const [label, value] of [
    ["nombre", data.nombre_titular],
    ["farmacia", data.nombre_farmacia],
    ["municipio", data.municipio],
  ] as const) {
    if (looksFake(value) || normalizeName(value).length < 3) {
      deduct(15, `Campo ${label} parece poco fiable`);
    }
  }

  const openTexts = [
    data.consultas_mas_repetidas,
    data.principal_problema_pedidos,
    data.problema_eliminaria,
    data.tarea_mas_tiempo,
  ].map(normalizeName);

  if (openTexts.some((t) => t.length < 10 || looksFake(t))) {
    deduct(20, "Respuestas abiertas demasiado cortas o poco creíbles");
  }

  const uniqueOpen = new Set(openTexts.filter((t) => t.length > 0));
  if (openTexts.filter(Boolean).length >= 3 && uniqueOpen.size === 1) {
    deduct(25, "Varias respuestas abiertas son idénticas");
  }

  if (duplicates.email) deduct(35, "Posible duplicado por email");
  if (duplicates.telefono) deduct(35, "Posible duplicado por teléfono");
  if (duplicates.farmacia) deduct(30, "Posible duplicado por nombre de farmacia");
  if (duplicates.combo) {
    deduct(30, "Combinación sospechosa farmacia + municipio + teléfono");
  }
  if (duplicates.ip) deduct(20, "Múltiples envíos desde el mismo origen");

  const elapsed =
    durationSeconds ??
    Math.max(0, Math.round((Date.now() - (data.startedAt || Date.now())) / 1000));
  if (elapsed > 0 && elapsed < MIN_COMPLETION_SECONDS) {
    deduct(25, `Cumplimentación anormalmente rápida (${elapsed}s)`);
  }

  // Contradicciones evidentes
  if (
    data.momentos_colas.includes("Normalmente no tenemos colas") &&
    data.momentos_colas.length > 1
  ) {
    deduct(10, "Contradicción en momentos de cola");
  }
  if (
    data.uso_whatsapp === "No" &&
    data.canales_pedidos.includes("Por WhatsApp")
  ) {
    deduct(10, "Indica no usar WhatsApp pero lo marca como canal de pedidos");
  }
  if (
    data.pagina_web === "No" &&
    (data.canales_pedidos.includes("Por la página web") ||
      data.soluciones_digitales.includes("Página web") ||
      data.soluciones_digitales.includes("Tienda online"))
  ) {
    deduct(10, "Indica no tener web pero la menciona en canales o soluciones");
  }
  if (
    data.soluciones_digitales.includes("Ninguna") &&
    data.soluciones_digitales.length > 1
  ) {
    deduct(10, "Marcó «Ninguna» junto a otras soluciones digitales");
  }
  if (
    data.volumen_llamadas === "Menos de 10" &&
    data.interrupciones === "Constantemente"
  ) {
    deduct(10, "Pocas llamadas pero interrupciones constantes");
  }

  score = Math.max(0, Math.min(100, score));

  let classification: CoherenceResult["classification"] = "coherente";
  if (score < 50) classification = "sospechosa";
  else if (score < 80) classification = "requiere_revision";

  return {
    score,
    classification,
    alerts,
    validatedAt: new Date().toISOString(),
  };
}

export function initialEstadoFromCoherence(
  result: CoherenceResult
): "pendiente_revision" | "requiere_revision" {
  if (result.classification === "coherente") return "pendiente_revision";
  return "requiere_revision";
}
