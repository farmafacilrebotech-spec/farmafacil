import { z } from "zod";
import {
  BARRERAS_DIGITALIZACION,
  BARRERAS_VENTA,
  CANALES_PEDIDOS,
  CARGOS,
  COMUNICACION_PROMOCIONES,
  EMPLEADOS,
  FRECUENCIA_PROBLEMA,
  GRUPO_ENSENA,
  INTERES_PARAFARMACIA,
  INTERES_PILOTO,
  INTERRUPCIONES,
  MOMENTOS_COLAS,
  PAGINA_WEB,
  PEDIDOS_ANTICIPADOS,
  PRINCIPALES_PROBLEMAS,
  PROBLEMAS_ENCARGO_KEYS,
  PROGRAMAS_GESTION,
  PROPORCION_REPETITIVAS,
  REGISTRO_PEDIDOS,
  SISTEMA_AVISOS,
  SOLUCION_PRIORITARIA,
  SOLUCIONES_DIGITALES,
  TIEMPO_CONSULTAS,
  USO_WHATSAPP,
  VOLUMEN_LLAMADAS,
  PRECIO_MENSUAL_RAZONABLE,
  PRECIO_MAXIMO_ACEPTABLE,
  MODELO_PAGO_PREFERIDO,
  INTENCION_PRUEBA_30_DIAS,
} from "./options";
import {
  isSpanishPhone,
  isSpanishPostalCode,
  looksFake,
  normalizeCodigoPostal,
  normalizeEmail,
  normalizeName,
  normalizePhone,
} from "./normalize";
import { PROVINCIAS, codigoPostalCompatibleConProvincia } from "./provinces";
import type { SurveyFormData } from "./types";

const selectOption = { errorMap: () => ({ message: "Selecciona una opción para continuar." }) };

const nonFakeString = (min: number, max: number, emptyMsg: string, shortMsg?: string) =>
  z
    .string()
    .transform(normalizeName)
    .pipe(
      z
        .string()
        .min(1, emptyMsg)
        .min(min, shortMsg || emptyMsg)
        .max(max, "El texto es demasiado largo")
        .refine((v) => !looksFake(v), { message: "Revisa este campo; el valor no parece válido." })
    );

export const step1Schema = z
  .object({
    nombre_titular: nonFakeString(
      3,
      80,
      "Introduce el nombre y apellidos del titular."
    ),
    nombre_farmacia: nonFakeString(3, 100, "Introduce el nombre de la farmacia."),
    telefono: z
      .string()
      .transform(normalizePhone)
      .refine((v) => v.length > 0, "Introduce un teléfono válido.")
      .refine(isSpanishPhone, "Introduce un teléfono válido."),
    email: z
      .string()
      .transform(normalizeEmail)
      .pipe(
        z
          .string()
          .min(1, "Introduce un email válido.")
          .email("Introduce un email válido.")
      ),
    provincia: z
      .string()
      .refine(
        (v): v is (typeof PROVINCIAS)[number] =>
          (PROVINCIAS as readonly string[]).includes(v),
        { message: "Selecciona una provincia." }
      ),
    municipio: nonFakeString(2, 80, "Introduce el municipio."),
    codigo_postal: z
      .string()
      .transform(normalizeCodigoPostal)
      .refine((v) => v.length > 0, "Introduce un código postal válido.")
      .refine(isSpanishPostalCode, "Introduce un código postal válido."),
    cargo: z.enum(CARGOS, {
      errorMap: () => ({ message: "Selecciona una opción para continuar." }),
    }),
    declaracion_titularidad: z.literal(true, {
      errorMap: () => ({
        message: "Debes aceptar esta declaración para continuar.",
      }),
    }),
  })
  .superRefine((data, ctx) => {
    if (!codigoPostalCompatibleConProvincia(data.codigo_postal, data.provincia)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["codigo_postal"],
        message: "El código postal no coincide con la provincia indicada.",
      });
    }
  });

export const step2Schema = z
  .object({
    empleados: z.enum(EMPLEADOS, selectOption),
    mostradores: z
      .string()
      .trim()
      .refine((v) => v.length > 0, {
        message: "Indica el número de mostradores.",
      })
      .refine((v) => /^\d{1,2}$/.test(v) && Number(v) >= 1 && Number(v) <= 30, {
        message: "Indica un número de mostradores entre 1 y 30.",
      }),
    grupo_ensena: z.enum(GRUPO_ENSENA, selectOption),
    programa_gestion: z.enum(PROGRAMAS_GESTION, selectOption),
    programa_gestion_otro: z.string().optional().default(""),
    pagina_web: z.enum(PAGINA_WEB, selectOption),
    uso_whatsapp: z.enum(USO_WHATSAPP, selectOption),
    pedidos_anticipados: z.enum(PEDIDOS_ANTICIPADOS, selectOption),
  })
  .superRefine((data, ctx) => {
    if (data.programa_gestion === "Otro" && normalizeName(data.programa_gestion_otro || "").length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["programa_gestion_otro"],
        message: "Indica el programa de gestión.",
      });
    }
  });

export const step3Schema = z.object({
  volumen_llamadas: z.enum(VOLUMEN_LLAMADAS, selectOption),
  proporcion_repetitivas: z.enum(PROPORCION_REPETITIVAS, selectOption),
  momentos_colas: z
    .array(z.enum(MOMENTOS_COLAS))
    .min(1, "Selecciona al menos una opción."),
  interrupciones: z.enum(INTERRUPCIONES, selectOption),
  tiempo_consultas: z.enum(TIEMPO_CONSULTAS, selectOption),
  consultas_mas_repetidas: z
    .string()
    .transform(normalizeName)
    .pipe(
      z
        .string()
        .min(1, "Esta respuesta necesita algo más de información.")
        .min(20, "Esta respuesta necesita algo más de información.")
        .max(1000, "El texto es demasiado largo.")
        .refine((v) => !looksFake(v), {
          message: "Esta respuesta necesita algo más de información.",
        })
    ),
});

const frecuencia = z.enum(FRECUENCIA_PROBLEMA, selectOption);

export const step4Schema = z.object({
  canales_pedidos: z
    .array(z.enum(CANALES_PEDIDOS))
    .min(1, "Selecciona al menos una opción."),
  registro_pedidos: z
    .array(z.enum(REGISTRO_PEDIDOS))
    .min(1, "Selecciona al menos una opción."),
  problemas_encargos: z.object(
    Object.fromEntries(PROBLEMAS_ENCARGO_KEYS.map((k) => [k, frecuencia])) as Record<
      (typeof PROBLEMAS_ENCARGO_KEYS)[number],
      typeof frecuencia
    >
  ),
  sistema_avisos: z
    .array(z.enum(SISTEMA_AVISOS))
    .min(1, "Selecciona al menos una opción."),
  principal_problema_pedidos: z
    .string()
    .transform(normalizeName)
    .pipe(
      z
        .string()
        .min(1, "Esta respuesta necesita algo más de información.")
        .min(15, "Esta respuesta necesita algo más de información.")
        .max(1000, "El texto es demasiado largo.")
        .refine((v) => !looksFake(v), {
          message: "Esta respuesta necesita algo más de información.",
        })
    ),
});

export const step5Schema = z.object({
  interes_parafarmacia: z.enum(INTERES_PARAFARMACIA, selectOption),
  barreras_venta: z
    .array(z.enum(BARRERAS_VENTA))
    .min(1, "Selecciona al menos una opción."),
  comunicacion_promociones: z
    .array(z.enum(COMUNICACION_PROMOCIONES))
    .min(1, "Selecciona al menos una opción."),
  soluciones_digitales: z
    .array(z.enum(SOLUCIONES_DIGITALES))
    .min(1, "Selecciona al menos una opción."),
  barreras_digitalizacion: z
    .array(z.enum(BARRERAS_DIGITALIZACION))
    .min(1, "Selecciona al menos una opción."),
});

export const step6Schema = z.object({
  principales_problemas: z
    .array(z.enum(PRINCIPALES_PROBLEMAS))
    .length(3, "Selecciona exactamente tres opciones."),
  problema_eliminaria: z
    .string()
    .transform(normalizeName)
    .pipe(
      z
        .string()
        .min(1, "Esta respuesta necesita algo más de información.")
        .min(15, "Esta respuesta necesita algo más de información.")
        .max(1000, "El texto es demasiado largo.")
        .refine((v) => !looksFake(v), {
          message: "Esta respuesta necesita algo más de información.",
        })
    ),
  tarea_mas_tiempo: z
    .string()
    .transform(normalizeName)
    .pipe(
      z
        .string()
        .min(1, "Esta respuesta necesita algo más de información.")
        .min(10, "Esta respuesta necesita algo más de información.")
        .max(1000, "El texto es demasiado largo.")
        .refine((v) => !looksFake(v), {
          message: "Esta respuesta necesita algo más de información.",
        })
    ),
  uso_hora_ahorrada: z.string().transform(normalizeName).pipe(z.string().max(1000)),
  reto_dos_anos: z.string().transform(normalizeName).pipe(z.string().max(1000)),
});

const scale = z
  .number({
    invalid_type_error: "Selecciona una valoración del 1 al 5.",
    required_error: "Selecciona una valoración del 1 al 5.",
  })
  .int()
  .min(1, "Selecciona una valoración del 1 al 5.")
  .max(5, "Selecciona una valoración del 1 al 5.");

/** Paso de soluciones y consentimientos. */
export const step7Schema = z.object({
  valoracion_catalogo: scale,
  valoracion_pedidos: scale,
  valoracion_avisos: scale,
  valoracion_asistente: scale,
  valoracion_kiosco: scale,
  solucion_prioritaria: z.enum(SOLUCION_PRIORITARIA, selectOption),
  interes_piloto: z.enum(INTERES_PILOTO, selectOption),
  consentimiento_comunidad: z.boolean(),
  consentimiento_comercial: z.boolean(),
  consentimiento_informe: z.boolean(),
  aceptacion_privacidad: z.literal(true, {
    errorMap: () => ({
      message: "Debes aceptar esta declaración para continuar.",
    }),
  }),
});

/** Paso «Interés comercial» — último bloque antes del envío. */
export const stepComercialSchema = z.object({
  precio_mensual_razonable: z.enum(PRECIO_MENSUAL_RAZONABLE, selectOption),
  precio_maximo_aceptable: z.enum(PRECIO_MAXIMO_ACEPTABLE, selectOption),
  modelo_pago_preferido: z.enum(MODELO_PAGO_PREFERIDO, selectOption),
  intencion_prueba_30_dias: z.enum(INTENCION_PRUEBA_30_DIAS, selectOption),
});

export const STEP_SCHEMAS = [
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
  step7Schema,
  stepComercialSchema,
] as const;

export function validateStep(
  stepIndex: number,
  data: SurveyFormData
): { ok: true; data: unknown } | { ok: false; errors: Record<string, string> } {
  const schema = STEP_SCHEMAS[stepIndex];
  if (!schema) return { ok: false, errors: { _form: "Paso no válido" } };
  const result = schema.safeParse(data);
  if (result.success) return { ok: true, data: result.data };
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}

/** Devuelve el primer paso con errores (para el envío final). */
export function findFirstInvalidStep(
  data: SurveyFormData
): { stepIndex: number; errors: Record<string, string> } | null {
  for (let i = 0; i < STEP_SCHEMAS.length; i++) {
    const result = validateStep(i, data);
    if (!result.ok) return { stepIndex: i, errors: result.errors };
  }
  return null;
}

export const fullSurveySchema = step1Schema
  .and(step2Schema)
  .and(step3Schema)
  .and(step4Schema)
  .and(step5Schema)
  .and(step6Schema)
  .and(step7Schema)
  .and(stepComercialSchema)
  .and(
    z.object({
      website: z.string().max(0).optional().or(z.literal("")),
      startedAt: z.number().optional(),
    })
  );

export type ValidatedSurvey = z.infer<typeof fullSurveySchema>;
