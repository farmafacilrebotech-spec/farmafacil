import { PROBLEMAS_ENCARGO_LABELS, PROBLEMAS_ENCARGO_KEYS } from "./options";
import { yesNo } from "./normalize";
import type { CoherenceResult, SurveyFormData, SurveyEstado } from "./types";

/**
 * Encabezados EXACTOS esperados por la fila 1 de Google Sheets / Apps Script.
 * Deben coincidir carácter a carácter con la hoja.
 */
export const EXPECTED_SHEET_HEADERS = [
  "Fecha",
  "Hora",
  "ID Respuesta",
  "Estado",
  "Estado Bono",
  "Puntuación",
  "Alertas",
  "Tiempo (seg.)",
  "Nombre Titular",
  "Nombre Farmacia",
  "Teléfono",
  "Email",
  "Provincia",
  "Municipio",
  "Código Postal",
  "Cargo",
  "Declaración Titularidad",
  "Número Empleados",
  "Número Mostradores",
  "Grupo o Enseña",
  "Software Gestión",
  "Página Web",
  "Uso WhatsApp",
  "Pedidos Anticipados",
  "Volumen Llamadas",
  "Proporción Consultas Repetitivas",
  "Momentos Colas",
  "Interrupciones Llamadas",
  "Tiempo Consultas",
  "Consultas Más Repetidas",
  "Canales Pedidos",
  "Sistema Registro Pedidos",
  "Problemas Encargos",
  "Sistema Avisos",
  "Principal Problema Pedidos",
  "Interés Parafarmacia",
  "Barreras Venta",
  "Comunicación Promociones",
  "Soluciones Digitales",
  "Barreras Digitalización",
  "Tres Principales Problemas",
  "Problema Eliminaría",
  "Tarea Más Tiempo",
  "Uso Hora Ahorrada",
  "Reto Dos Años",
  "Valoración Catálogo",
  "Valoración Pedidos",
  "Valoración Avisos",
  "Valoración Asistente",
  "Valoración Kiosco",
  "Solución Prioritaria",
  "Interés Piloto",
  "Precio Mensual Razonable",
  "Precio Máximo Aceptable",
  "Modelo Pago Preferido",
  "Intención Prueba 30 Días",
  "Consentimiento Comunidad",
  "Consentimiento Comercial",
  "Consentimiento Informe",
  "Aceptación Privacidad",
  "Bono Disponible En Envío",
  "Resultado Revisión",
  "Duplicado Potencial",
  "Hash IP",
  "Revisado Manualmente",
  "Fecha Revisión",
  "Revisor",
  "Motivo Aprobación o Rechazo",
  "Código Bono",
  "Fecha Envío Bono",
  "Observaciones Internas",
] as const;

/** @deprecated usar EXPECTED_SHEET_HEADERS */
export const SHEET_HEADERS = EXPECTED_SHEET_HEADERS;

export type SheetHeader = (typeof EXPECTED_SHEET_HEADERS)[number];

/** Payload plano hacia Apps Script (valores pueden ser string | number | string[]) */
export type SheetRecord = Record<string, string | number | string[]>;

function formatProblemasEncargos(data: SurveyFormData): string {
  return PROBLEMAS_ENCARGO_KEYS.map(
    (key) => `${PROBLEMAS_ENCARGO_LABELS[key]}: ${data.problemas_encargos[key] || "-"}`
  ).join(" | ");
}

function madridNowParts(): { fecha: string; hora: string } {
  const now = new Date();
  const fecha = now.toLocaleDateString("es-ES", { timeZone: "Europe/Madrid" });
  const hora = now.toLocaleTimeString("es-ES", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return { fecha, hora };
}

/**
 * Mapeo explícito formulario → encabezados de Google Sheets.
 * Payload plano: sin objetos anidados (salvo arrays que Apps Script une con " | ").
 */
export function buildSheetRecord(params: {
  id: string;
  data: SurveyFormData;
  estado: SurveyEstado;
  coherence: CoherenceResult;
  duplicatePotential: boolean;
  emailError?: string;
  /** HMAC SHA-256 de la IP (nunca la IP en claro). */
  ipHash?: string;
  /** @deprecated usar ipHash */
  originHash?: string;
  durationSeconds?: number;
  /** Valor de bonosDisponibles en el momento de carga/envío de la encuesta. */
  bonoDisponibleEnEnvio?: boolean;
}): SheetRecord {
  const { id, data, estado, coherence, duplicatePotential, durationSeconds } = params;
  const ipHash = params.ipHash || params.originHash || "";
  const bonoDisponibleEnEnvio = Boolean(params.bonoDisponibleEnEnvio);
  const { fecha, hora } = madridNowParts();

  const programa =
    data.programa_gestion === "Otro" && data.programa_gestion_otro
      ? `Otro: ${data.programa_gestion_otro}`
      : data.programa_gestion;

  const record: SheetRecord = {
    Fecha: fecha,
    Hora: hora,
    "ID Respuesta": id,
    Estado: estado,
    "Estado Bono": "no_revisado",
    Puntuación: coherence.score,
    Alertas: coherence.alerts.length ? coherence.alerts : [],
    "Tiempo (seg.)": durationSeconds ?? "",

    "Nombre Titular": data.nombre_titular,
    "Nombre Farmacia": data.nombre_farmacia,
    Teléfono: data.telefono,
    Email: data.email,
    Provincia: data.provincia,
    Municipio: data.municipio,
    "Código Postal": data.codigo_postal,
    Cargo: data.cargo,
    "Declaración Titularidad": yesNo(data.declaracion_titularidad),

    "Número Empleados": data.empleados,
    "Número Mostradores": data.mostradores,
    "Grupo o Enseña": data.grupo_ensena,
    "Software Gestión": programa,
    "Página Web": data.pagina_web,
    "Uso WhatsApp": data.uso_whatsapp,
    "Pedidos Anticipados": data.pedidos_anticipados,

    "Volumen Llamadas": data.volumen_llamadas,
    "Proporción Consultas Repetitivas": data.proporcion_repetitivas,
    "Momentos Colas": data.momentos_colas,
    "Interrupciones Llamadas": data.interrupciones,
    "Tiempo Consultas": data.tiempo_consultas,
    "Consultas Más Repetidas": data.consultas_mas_repetidas,

    "Canales Pedidos": data.canales_pedidos,
    "Sistema Registro Pedidos": data.registro_pedidos,
    "Problemas Encargos": formatProblemasEncargos(data),
    "Sistema Avisos": data.sistema_avisos,
    "Principal Problema Pedidos": data.principal_problema_pedidos,

    "Interés Parafarmacia": data.interes_parafarmacia,
    "Barreras Venta": data.barreras_venta,
    "Comunicación Promociones": data.comunicacion_promociones,
    "Soluciones Digitales": data.soluciones_digitales,
    "Barreras Digitalización": data.barreras_digitalizacion,

    "Tres Principales Problemas": data.principales_problemas,
    "Problema Eliminaría": data.problema_eliminaria,
    "Tarea Más Tiempo": data.tarea_mas_tiempo,
    "Uso Hora Ahorrada": data.uso_hora_ahorrada,
    "Reto Dos Años": data.reto_dos_anos,

    "Valoración Catálogo": data.valoracion_catalogo ?? "",
    "Valoración Pedidos": data.valoracion_pedidos ?? "",
    "Valoración Avisos": data.valoracion_avisos ?? "",
    "Valoración Asistente": data.valoracion_asistente ?? "",
    "Valoración Kiosco": data.valoracion_kiosco ?? "",
    "Solución Prioritaria": data.solucion_prioritaria,
    "Interés Piloto": data.interes_piloto,

    "Precio Mensual Razonable": data.precio_mensual_razonable,
    "Precio Máximo Aceptable": data.precio_maximo_aceptable,
    "Modelo Pago Preferido": data.modelo_pago_preferido,
    "Intención Prueba 30 Días": data.intencion_prueba_30_dias,

    "Consentimiento Comunidad": yesNo(data.consentimiento_comunidad),
    "Consentimiento Comercial": yesNo(data.consentimiento_comercial),
    "Consentimiento Informe": yesNo(data.consentimiento_informe),
    "Aceptación Privacidad": yesNo(data.aceptacion_privacidad),

    "Bono Disponible En Envío": yesNo(bonoDisponibleEnEnvio),

    "Resultado Revisión": coherence.classification,
    "Duplicado Potencial": yesNo(duplicatePotential),
    "Hash IP": ipHash,
    "Revisado Manualmente": "No",
    "Fecha Revisión": "",
    Revisor: "",
    "Motivo Aprobación o Rechazo": "",
    "Código Bono": "",
    "Fecha Envío Bono": "",
    "Observaciones Internas": params.emailError
      ? `Error email: ${params.emailError}`
      : "",
  };

  return record;
}

/** Comprueba que el payload incluye todas las claves esperadas (solo nombres). */
export function findMissingSheetHeaders(payloadKeys: string[]): string[] {
  return EXPECTED_SHEET_HEADERS.filter((header) => !payloadKeys.includes(header));
}

/** Claves del payload (sin secret) que no están en la lista de encabezados esperados. */
export function findUnexpectedSheetKeys(payloadKeys: string[]): string[] {
  const expected = new Set<string>(EXPECTED_SHEET_HEADERS);
  return payloadKeys.filter((key) => key !== "secret" && !expected.has(key));
}
