import type {
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

export type SurveyEstado =
  | "pendiente_revision"
  | "requiere_revision"
  | "aprobada"
  | "rechazada"
  | "bono_enviado";

export type SurveyEstadoBono =
  | "no_revisado"
  | "pendiente_envio"
  | "enviado"
  | "no_corresponde";

export type FrecuenciaProblema = (typeof FRECUENCIA_PROBLEMA)[number];

export type ProblemasEncargos = Record<
  (typeof PROBLEMAS_ENCARGO_KEYS)[number],
  FrecuenciaProblema | ""
>;

export type SurveyFormData = {
  nombre_titular: string;
  nombre_farmacia: string;
  telefono: string;
  email: string;
  provincia: string;
  municipio: string;
  codigo_postal: string;
  cargo: (typeof CARGOS)[number] | "";
  declaracion_titularidad: boolean;

  empleados: (typeof EMPLEADOS)[number] | "";
  mostradores: string;
  grupo_ensena: (typeof GRUPO_ENSENA)[number] | "";
  programa_gestion: (typeof PROGRAMAS_GESTION)[number] | "";
  programa_gestion_otro: string;
  pagina_web: (typeof PAGINA_WEB)[number] | "";
  uso_whatsapp: (typeof USO_WHATSAPP)[number] | "";
  pedidos_anticipados: (typeof PEDIDOS_ANTICIPADOS)[number] | "";

  volumen_llamadas: (typeof VOLUMEN_LLAMADAS)[number] | "";
  proporcion_repetitivas: (typeof PROPORCION_REPETITIVAS)[number] | "";
  momentos_colas: Array<(typeof MOMENTOS_COLAS)[number]>;
  interrupciones: (typeof INTERRUPCIONES)[number] | "";
  tiempo_consultas: (typeof TIEMPO_CONSULTAS)[number] | "";
  consultas_mas_repetidas: string;

  canales_pedidos: Array<(typeof CANALES_PEDIDOS)[number]>;
  registro_pedidos: Array<(typeof REGISTRO_PEDIDOS)[number]>;
  problemas_encargos: ProblemasEncargos;
  sistema_avisos: Array<(typeof SISTEMA_AVISOS)[number]>;
  principal_problema_pedidos: string;

  interes_parafarmacia: (typeof INTERES_PARAFARMACIA)[number] | "";
  barreras_venta: Array<(typeof BARRERAS_VENTA)[number]>;
  comunicacion_promociones: Array<(typeof COMUNICACION_PROMOCIONES)[number]>;
  soluciones_digitales: Array<(typeof SOLUCIONES_DIGITALES)[number]>;
  barreras_digitalizacion: Array<(typeof BARRERAS_DIGITALIZACION)[number]>;

  principales_problemas: Array<(typeof PRINCIPALES_PROBLEMAS)[number]>;
  problema_eliminaria: string;
  tarea_mas_tiempo: string;
  uso_hora_ahorrada: string;
  reto_dos_anos: string;

  valoracion_catalogo: number | null;
  valoracion_pedidos: number | null;
  valoracion_avisos: number | null;
  valoracion_asistente: number | null;
  valoracion_kiosco: number | null;
  solucion_prioritaria: (typeof SOLUCION_PRIORITARIA)[number] | "";
  interes_piloto: (typeof INTERES_PILOTO)[number] | "";

  precio_mensual_razonable: (typeof PRECIO_MENSUAL_RAZONABLE)[number] | "";
  precio_maximo_aceptable: (typeof PRECIO_MAXIMO_ACEPTABLE)[number] | "";
  modelo_pago_preferido: (typeof MODELO_PAGO_PREFERIDO)[number] | "";
  intencion_prueba_30_dias: (typeof INTENCION_PRUEBA_30_DIAS)[number] | "";

  consentimiento_comunidad: boolean;
  consentimiento_comercial: boolean;
  consentimiento_informe: boolean;
  aceptacion_privacidad: boolean;

  /** Honeypot — debe quedar vacío */
  website: string;
  startedAt: number;
};

export type CoherenceResult = {
  score: number;
  classification: "coherente" | "requiere_revision" | "sospechosa";
  alerts: string[];
  validatedAt: string;
};

export type SurveySubmitPayload = SurveyFormData & {
  clientDurationSeconds?: number;
};

export function createEmptySurveyForm(): SurveyFormData {
  return {
    nombre_titular: "",
    nombre_farmacia: "",
    telefono: "",
    email: "",
    provincia: "",
    municipio: "",
    codigo_postal: "",
    cargo: "",
    declaracion_titularidad: false,

    empleados: "",
    mostradores: "",
    grupo_ensena: "",
    programa_gestion: "",
    programa_gestion_otro: "",
    pagina_web: "",
    uso_whatsapp: "",
    pedidos_anticipados: "",

    volumen_llamadas: "",
    proporcion_repetitivas: "",
    momentos_colas: [],
    interrupciones: "",
    tiempo_consultas: "",
    consultas_mas_repetidas: "",

    canales_pedidos: [],
    registro_pedidos: [],
    problemas_encargos: {
      encargos_mal_anotados: "",
      dificultad_localizar: "",
      clientes_llaman_varias: "",
      productos_tardan_recoger: "",
      falta_coordinacion_turnos: "",
      errores_comunicar_listo: "",
    },
    sistema_avisos: [],
    principal_problema_pedidos: "",

    interes_parafarmacia: "",
    barreras_venta: [],
    comunicacion_promociones: [],
    soluciones_digitales: [],
    barreras_digitalizacion: [],

    principales_problemas: [],
    problema_eliminaria: "",
    tarea_mas_tiempo: "",
    uso_hora_ahorrada: "",
    reto_dos_anos: "",

    valoracion_catalogo: null,
    valoracion_pedidos: null,
    valoracion_avisos: null,
    valoracion_asistente: null,
    valoracion_kiosco: null,
    solucion_prioritaria: "",
    interes_piloto: "",

    precio_mensual_razonable: "",
    precio_maximo_aceptable: "",
    modelo_pago_preferido: "",
    intencion_prueba_30_dias: "",

    consentimiento_comunidad: false,
    consentimiento_comercial: false,
    consentimiento_informe: false,
    aceptacion_privacidad: false,

    website: "",
    startedAt: Date.now(),
  };
}
