export const dynamic = "force-dynamic";

import { createHash, createHmac, randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  isEncuestaEnabled,
} from "@/lib/encuesta/config";
import {
  evaluateCoherence,
  initialEstadoFromCoherence,
} from "@/lib/encuesta/coherence";
import {
  sendEncuestaAdminEmail,
  sendEncuestaParticipantEmail,
} from "@/lib/encuesta/email";
import {
  normalizeCodigoPostal,
  normalizeEmail,
  normalizeName,
  normalizePhone,
} from "@/lib/encuesta/normalize";
import { checkRateLimit, pruneRateLimitStore } from "@/lib/encuesta/rate-limit";
import {
  buildEncuestaSheetPayload,
  findDuplicates,
  submitEncuestaToAppsScript,
} from "@/lib/encuesta/sheets";
import type { SurveyFormData } from "@/lib/encuesta/types";
import { STEP_SCHEMAS } from "@/lib/encuesta/validation";
import { PROBLEMAS_ENCARGO_KEYS } from "@/lib/encuesta/options";

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

/** Hash corto solo para rate-limit en memoria (no se envía a Sheets). */
function hashOrigin(ip: string): string {
  const salt =
    process.env.ENCUESTA_IP_SALT ||
    process.env.GOOGLE_SHEETS_SECRET ||
    "farmafacil";
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex").slice(0, 16);
}

/**
 * HMAC SHA-256 de la IP para la columna «Hash IP».
 * Solo servidor; nunca se envía ni guarda la IP en claro.
 */
function hashSurveyIp(ip: string): string {
  const secret = process.env.SURVEY_IP_HASH_SECRET?.trim();
  if (!secret) {
    console.error("[encuesta] Falta SURVEY_IP_HASH_SECRET");
    return "";
  }
  return createHmac("sha256", secret).update(ip).digest("hex");
}

function normalizePayload(body: SurveyFormData): SurveyFormData {
  return {
    ...body,
    nombre_titular: normalizeName(body.nombre_titular || ""),
    nombre_farmacia: normalizeName(body.nombre_farmacia || ""),
    telefono: normalizePhone(body.telefono || ""),
    email: normalizeEmail(body.email || ""),
    provincia: normalizeName(body.provincia || ""),
    municipio: normalizeName(body.municipio || ""),
    codigo_postal: normalizeCodigoPostal(body.codigo_postal || ""),
    programa_gestion_otro: normalizeName(body.programa_gestion_otro || ""),
    consultas_mas_repetidas: normalizeName(body.consultas_mas_repetidas || ""),
    principal_problema_pedidos: normalizeName(body.principal_problema_pedidos || ""),
    problema_eliminaria: normalizeName(body.problema_eliminaria || ""),
    tarea_mas_tiempo: normalizeName(body.tarea_mas_tiempo || ""),
    uso_hora_ahorrada: normalizeName(body.uso_hora_ahorrada || ""),
    reto_dos_anos: normalizeName(body.reto_dos_anos || ""),
    website: body.website || "",
    startedAt: typeof body.startedAt === "number" ? body.startedAt : Date.now(),
    momentos_colas: body.momentos_colas || [],
    canales_pedidos: body.canales_pedidos || [],
    registro_pedidos: body.registro_pedidos || [],
    sistema_avisos: body.sistema_avisos || [],
    barreras_venta: body.barreras_venta || [],
    comunicacion_promociones: body.comunicacion_promociones || [],
    soluciones_digitales: body.soluciones_digitales || [],
    barreras_digitalizacion: body.barreras_digitalizacion || [],
    principales_problemas: body.principales_problemas || [],
    problemas_encargos: body.problemas_encargos || {
      encargos_mal_anotados: "",
      dificultad_localizar: "",
      clientes_llaman_varias: "",
      productos_tardan_recoger: "",
      falta_coordinacion_turnos: "",
      errores_comunicar_listo: "",
    },
  };
}

function validateAllSteps(data: SurveyFormData): Record<string, string> | null {
  const errors: Record<string, string> = {};
  for (const schema of STEP_SCHEMAS) {
    const result = schema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = issue.path.join(".") || "_form";
        if (!errors[key]) errors[key] = issue.message;
      }
    }
  }
  return Object.keys(errors).length ? errors : null;
}

export async function POST(req: Request) {
  try {
    if (!isEncuestaEnabled()) {
      return NextResponse.json(
        { success: false, error: "La encuesta no está disponible temporalmente." },
        { status: 503 }
      );
    }

    pruneRateLimitStore();
    const ip = getClientIp(req);
    const originHash = hashOrigin(ip);
    const ipHash = hashSurveyIp(ip);
    const limit = checkRateLimit(originHash);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Has alcanzado el límite de envíos. Inténtalo más tarde.",
        },
        { status: 429 }
      );
    }

    const body = (await req.json()) as SurveyFormData & {
      submissionId?: string;
      responseId?: string;
      idRespuesta?: string;
      bonoDisponibleEnEnvio?: boolean;
    };

    const {
      submissionId: bodySubmissionId,
      responseId: bodyResponseId,
      idRespuesta: bodyIdRespuesta,
      bonoDisponibleEnEnvio: bodyBonoDisponibleEnEnvio,
      ...surveyFields
    } = body;

    // Valor capturado en el cliente al cargar/enviar (no recalcular después)
    const bonoDisponibleEnEnvio =
      typeof bodyBonoDisponibleEnEnvio === "boolean"
        ? bodyBonoDisponibleEnEnvio
        : false;

    const data = normalizePayload(surveyFields as SurveyFormData);

    // ID estable para este envío (reutilizable en reintentos)
    const responseId =
      (typeof bodySubmissionId === "string" && bodySubmissionId.trim()) ||
      (typeof bodyResponseId === "string" && bodyResponseId.trim()) ||
      (typeof bodyIdRespuesta === "string" && bodyIdRespuesta.trim()) ||
      randomUUID();

    // Honeypot
    if (data.website && data.website.trim().length > 0) {
      return NextResponse.json({
        success: true,
        id: responseId,
        submissionId: responseId,
        honeypot: true,
      });
    }

    const validationErrors = validateAllSteps(data);
    if (validationErrors) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos incompletos o no válidos",
          errors: validationErrors,
          submissionId: responseId,
        },
        { status: 400 }
      );
    }

    for (const key of PROBLEMAS_ENCARGO_KEYS) {
      if (!data.problemas_encargos[key]) {
        return NextResponse.json(
          {
            success: false,
            error: "Completa la frecuencia de todos los problemas de encargos",
            submissionId: responseId,
          },
          { status: 400 }
        );
      }
    }

    const durationSeconds = Math.max(
      0,
      Math.round((Date.now() - data.startedAt) / 1000)
    );

    const duplicates = await findDuplicates(data);

    // Puntuación de coherencia y alertas
    const coherence = evaluateCoherence(data, duplicates, durationSeconds);
    const estado = initialEstadoFromCoherence(coherence);
    const duplicatePotential = Boolean(
      duplicates.email ||
        duplicates.telefono ||
        duplicates.farmacia ||
        duplicates.combo ||
        duplicates.ip
    );

    // Payload Sheets (claves = encabezados; incluye "ID Respuesta" y "Hash IP")
    const sheetRecord = buildEncuestaSheetPayload({
      id: responseId,
      data,
      estado,
      coherence,
      duplicatePotential,
      emailError: "",
      ipHash,
      durationSeconds,
      bonoDisponibleEnEnvio,
    });

    // POST a Apps Script (añade "ID Respuesta" + secret)
    const sheetsResult = await submitEncuestaToAppsScript(sheetRecord, responseId, {
      bonoDisponibleEnEnvio,
    });

    // Si falla Sheets: error y permitir reintento (mismo submissionId)
    if (!sheetsResult.ok) {
      console.error("[encuesta] Apps Script falló:", sheetsResult.error);
      return NextResponse.json(
        {
          success: false,
          sheetsSaved: false,
          responseId,
          error:
            "No se pudo guardar la respuesta en Google Sheets. Inténtalo de nuevo; tus respuestas se han conservado.",
          submissionId: responseId,
        },
        { status: 502 }
      );
    }

    // Solo si Sheets OK → emails (independientes) + éxito
    const adminEmailResult = await sendEncuestaAdminEmail({
      id: responseId,
      data,
      coherence,
      estado,
      duplicatePotential,
      bonoDisponibleEnEnvio,
    });
    if (adminEmailResult.ok) {
      console.log(
        adminEmailResult.skipped
          ? "[encuesta] Email admin omitido (ya enviado para este ID)"
          : "[encuesta] Email admin enviado correctamente"
      );
    } else {
      console.error(
        "[encuesta] Email admin falló:",
        [
          adminEmailResult.status ? `status=${adminEmailResult.status}` : null,
          adminEmailResult.error,
        ]
          .filter(Boolean)
          .join(" ")
      );
    }

    const participantEmailResult = await sendEncuestaParticipantEmail({
      id: responseId,
      data,
      bonoDisponibleEnEnvio,
    });
    if (participantEmailResult.ok) {
      console.log(
        participantEmailResult.skipped
          ? "[encuesta] Email participante omitido (ya enviado para este ID)"
          : "[encuesta] Email participante enviado correctamente"
      );
    } else {
      console.error(
        "[encuesta] Email participante falló:",
        [
          participantEmailResult.status
            ? `status=${participantEmailResult.status}`
            : null,
          participantEmailResult.error,
        ]
          .filter(Boolean)
          .join(" ")
      );
    }

    return NextResponse.json({
      success: true,
      responseId,
      id: responseId,
      submissionId: responseId,
      sheetsSaved: true,
      duplicateRequest: Boolean(sheetsResult.duplicateRequest),
      adminEmailSent: adminEmailResult.ok,
      participantEmailSent: participantEmailResult.ok,
      emailSent: adminEmailResult.ok,
      bonosDisponibles: bonoDisponibleEnEnvio,
      bonoDisponibleEnEnvio,
      consentimientos: {
        comunidad: data.consentimiento_comunidad,
        informe: data.consentimiento_informe,
        comercial: data.consentimiento_comercial,
      },
    });
  } catch (error) {
    console.error("[encuesta] Error en /api/encuesta:", (error as Error).message);
    return NextResponse.json(
      { success: false, error: "Error del servidor" },
      { status: 500 }
    );
  }
}
