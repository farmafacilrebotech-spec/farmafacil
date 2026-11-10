/**
 * Catálogo y procedencia del formulario comercial de farmacias.
 * Solo códigos. Nunca nombres, emails, teléfonos ni mensajes.
 */

export const COMMERCIAL_INTERESTS = [
  { id: "piloto", label: "Participar en el programa piloto." },
  { id: "implantar", label: "Implantar FarmaFácil en mi farmacia." },
  { id: "demo", label: "Solicitar una demostración." },
  { id: "planes", label: "Recibir información y conocer los planes." },
  { id: "otra", label: "Otra consulta." },
] as const;

export type CommercialInterestId = (typeof COMMERCIAL_INTERESTS)[number]["id"];

/** Planes de /soluciones. Solo preseleccionan el interés «planes». */
export const COMMERCIAL_PLAN_IDS = [
  "general",
  "personalizado",
  "asistente-ia",
  "kiosko",
] as const;

export type CommercialPlanId = (typeof COMMERCIAL_PLAN_IDS)[number];

export const COMMERCIAL_MESSAGE_MAX = 2000;

export const CAMPAIGN_QUERY_KEYS = ["origen", "medio", "campana", "pieza"] as const;
export type CampaignQueryKey = (typeof CAMPAIGN_QUERY_KEYS)[number];

export type CampaignAttribution = Record<CampaignQueryKey, string>;

export type CommercialPreset = {
  interes: CommercialInterestId | "";
  plan: CommercialPlanId | "";
  campana: CampaignAttribution;
};

const EMPTY_CAMPAIGN: CampaignAttribution = {
  origen: "",
  medio: "",
  campana: "",
  pieza: "",
};

export const EMPTY_COMMERCIAL_PRESET: CommercialPreset = {
  interes: "",
  plan: "",
  campana: EMPTY_CAMPAIGN,
};

/** Códigos históricos o abreviados → interés canónico. */
const INTEREST_ALIASES: Record<string, CommercialInterestId> = {
  prueba: "piloto",
  piloto: "piloto",
  prueba_piloto: "piloto",
  implantar: "implantar",
  implantacion: "implantar",
  demo: "demo",
  demostracion: "demo",
  planes: "planes",
  informacion: "planes",
  otra: "otra",
  consulta: "otra",
};

const CODE_RE = /^[a-z0-9][a-z0-9_-]{0,40}$/;

const INTEREST_IDS = new Set<string>(COMMERCIAL_INTERESTS.map((item) => item.id));
const PLAN_IDS = new Set<string>(COMMERCIAL_PLAN_IDS);

export function sanitizeCampaignCode(value: unknown): string {
  if (typeof value !== "string") return "";
  const code = value.trim().toLowerCase();
  if (!CODE_RE.test(code)) return "";
  return code;
}

export function resolveInterestId(value: unknown): CommercialInterestId | "" {
  const code = sanitizeCampaignCode(value);
  if (!code) return "";
  return INTEREST_ALIASES[code] ?? "";
}

export function isCommercialInterestId(value: string): value is CommercialInterestId {
  return INTEREST_IDS.has(value);
}

export function interestLabel(id: string): string {
  const match = COMMERCIAL_INTERESTS.find((item) => item.id === id);
  return match?.label ?? "";
}

function isPlanId(value: string): value is CommercialPlanId {
  return PLAN_IDS.has(value);
}

export function resolvePlanId(value: unknown): CommercialPlanId | "" {
  const code = sanitizeCampaignCode(value);
  if (!code || !isPlanId(code)) return "";
  return code;
}

function recordToParams(
  input: Record<string, string | string[] | undefined>
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    const first = Array.isArray(value) ? value[0] : value;
    if (typeof first === "string" && first.trim()) params.set(key, first);
  }
  return params;
}

export function presetFromQuery(
  input: URLSearchParams | Record<string, string | string[] | undefined> | undefined
): CommercialPreset {
  const params =
    input instanceof URLSearchParams
      ? input
      : recordToParams(input ?? {});

  const plan = resolvePlanId(params.get("plan"));
  const explicitInterest = resolveInterestId(params.get("interes"));
  const interes: CommercialInterestId | "" =
    explicitInterest || (plan ? "planes" : "");

  const campana = { ...EMPTY_CAMPAIGN };
  for (const key of CAMPAIGN_QUERY_KEYS) {
    campana[key] = sanitizeCampaignCode(params.get(key));
  }

  return { interes, plan, campana };
}

/** Query allowlist. Sustituye alias (`prueba`) por el código canónico. */
export function sanitizedCommercialSearch(params: URLSearchParams): string {
  const preset = presetFromQuery(params);
  const next = new URLSearchParams();
  if (preset.interes) next.set("interes", preset.interes);
  if (preset.plan) next.set("plan", preset.plan);
  for (const key of CAMPAIGN_QUERY_KEYS) {
    if (preset.campana[key]) next.set(key, preset.campana[key]);
  }
  return next.toString();
}

export function buildCommercialHref(options: {
  interes?: CommercialInterestId;
  plan?: CommercialPlanId;
  origen?: string;
  medio?: string;
  campana?: string;
  pieza?: string;
}): string {
  const params = new URLSearchParams();
  if (options.interes) params.set("interes", options.interes);
  if (options.plan) params.set("plan", options.plan);
  const campana: CampaignAttribution = {
    origen: sanitizeCampaignCode(options.origen),
    medio: sanitizeCampaignCode(options.medio),
    campana: sanitizeCampaignCode(options.campana),
    pieza: sanitizeCampaignCode(options.pieza),
  };
  for (const key of CAMPAIGN_QUERY_KEYS) {
    if (campana[key]) params.set(key, campana[key]);
  }
  const query = params.toString();
  return `/solicitar${query ? `?${query}` : ""}`;
}

export const FLYER_QR_ORIGIN = "https://www.farmafacil.solutions";

/**
 * URL definitiva del QR impreso del flyer de lanzamiento 2027.
 * El path `/solicitar` no debe cambiar después de imprimir.
 * El interés es implantación: el flyer invita a contratar FarmaFácil.
 */
export const FLYER_QR_URL = `${FLYER_QR_ORIGIN}${buildCommercialHref({
  interes: "implantar",
  origen: "qr",
  medio: "impreso",
  campana: "lanzamiento-2027",
  pieza: "flyer",
})}`;

export type LeadClassification = {
  kind: "piloto" | "implantar" | "demo" | "planes" | "otra" | "contacto";
  label: string;
  subjectInternal: string;
  highIntent: boolean;
};

const CONTACT_CLASSIFICATION: LeadClassification = {
  kind: "contacto",
  label: "Formulario de contacto",
  subjectInternal: "Nuevo contacto | FarmaFácil",
  highIntent: false,
};

export function classifyCommercialInterest(interes: string): LeadClassification {
  switch (interes) {
    case "piloto":
      return {
        kind: "piloto",
        label: "Solicitud de piloto",
        subjectInternal: "Nueva solicitud de piloto | FarmaFácil",
        highIntent: false,
      };
    case "implantar":
      return {
        kind: "implantar",
        label: "Oportunidad de implantación",
        subjectInternal: "Alta intención · Implantación | FarmaFácil",
        highIntent: true,
      };
    case "demo":
      return {
        kind: "demo",
        label: "Solicitud de demostración",
        subjectInternal: "Nueva solicitud de demostración | FarmaFácil",
        highIntent: false,
      };
    case "planes":
      return {
        kind: "planes",
        label: "Solicitud de información",
        subjectInternal: "Nueva solicitud de información | FarmaFácil",
        highIntent: false,
      };
    case "otra":
      return {
        kind: "otra",
        label: "Consulta comercial",
        subjectInternal: "Nueva consulta comercial | FarmaFácil",
        highIntent: false,
      };
    default:
      return CONTACT_CLASSIFICATION;
  }
}

/**
 * Clasificación explícita. El texto libre no cambia el tipo:
 * un contacto general que menciona «prueba piloto» sigue siendo contacto.
 */
export function classifyLead(input: {
  formulario?: string;
  source?: string;
  interes?: string;
}): LeadClassification {
  const formulario = input.formulario;
  const source = (input.source || "").toLowerCase();
  if (formulario === "contacto" || source === "contacto") {
    return CONTACT_CLASSIFICATION;
  }
  const interes = resolveInterestId(input.interes);
  if (interes) return classifyCommercialInterest(interes);
  if (formulario === "comercial" && input.interes === "contacto_general") {
    return classifyCommercialInterest("otra");
  }
  return CONTACT_CLASSIFICATION;
}

/** Analítica: ruta sin query, para no guardar parámetros ni datos personales. */
export function publicAnalyticsFields(pageUrl: URL): {
  page_path: string;
  page_location: string;
} {
  return {
    page_path: pageUrl.pathname,
    page_location: `${pageUrl.origin}${pageUrl.pathname}`,
  };
}
