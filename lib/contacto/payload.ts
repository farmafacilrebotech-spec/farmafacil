import {
  COMMERCIAL_MESSAGE_MAX,
  classifyLead,
  interestLabel,
  resolveInterestId,
  sanitizeCampaignCode,
  type CommercialInterestId,
  type CampaignAttribution,
} from "./comercial";
import type { ContactFormulario, ContactLeadPayload } from "./types";

const NAME_MAX = 120;
const PHARMACY_MAX = 160;
const EMAIL_MAX = 160;
const PHONE_MAX = 40;
const TYPE_MAX = 40;

export type NormalizeResult =
  | { ok: true; payload: ContactLeadPayload }
  | { ok: false; error: string; status: 400 };

function asString(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function clip(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function asBooleanTrue(value: unknown): boolean {
  return value === true;
}

function resolveFormulario(
  rawFormulario: string,
  source: string,
  interes: string
): ContactFormulario {
  if (rawFormulario === "comercial" || rawFormulario === "contacto") {
    return rawFormulario;
  }
  if (source === "contacto") return "contacto";
  if (source === "landing" || source === "solicitar") return "comercial";
  if (resolveInterestId(interes)) return "comercial";
  return "contacto";
}

export type GeneralContactInput = {
  nombre: string;
  farmacia: string;
  email: string;
  telefono: string;
  tipoUsuario: string;
  mensaje: string;
  infoFarmacia: string;
};

/** Contrato del formulario general de /contacto. No pide consentimiento promocional. */
export function buildGeneralContactPayload(
  input: GeneralContactInput
): Omit<ContactLeadPayload, "submittedAt"> & { submittedAt?: string } {
  const tipoUsuario = input.tipoUsuario.trim();
  return {
    nombre: input.nombre.trim(),
    farmacia: input.farmacia.trim(),
    email: input.email.trim(),
    telefono: input.telefono.trim(),
    tipoUsuario,
    mensaje: input.mensaje.trim(),
    infoFarmacia: tipoUsuario === "farmacia" ? input.infoFarmacia.trim() : "",
    interes: "contacto_general",
    nivel_interes: "contacto_general",
    interesEtiqueta: "",
    consentimientoPromocional: false,
    aceptaInformacion: false,
    altaIntencion: false,
    origen: "",
    medio: "",
    campana: "",
    pieza: "",
    formulario: "contacto",
    source: "contacto",
    mensajeEsAutomatico: false,
  };
}

export type CommercialLeadInput = {
  nombre: string;
  farmacia: string;
  email: string;
  telefono: string;
  interes: CommercialInterestId | "";
  mensaje: string;
  consentimientoPromocional: boolean;
  aceptaInformacion: boolean;
  campana: CampaignAttribution;
  source: "landing" | "solicitar";
};

export function buildCommercialLeadPayload(
  input: CommercialLeadInput
): Omit<ContactLeadPayload, "submittedAt"> & { submittedAt?: string } {
  return {
    nombre: input.nombre.trim(),
    farmacia: input.farmacia.trim(),
    email: input.email.trim(),
    telefono: input.telefono.trim(),
    tipoUsuario: "farmacia",
    mensaje: input.mensaje.trim(),
    infoFarmacia: "",
    interes: input.interes,
    nivel_interes: input.interes,
    interesEtiqueta: "",
    consentimientoPromocional: input.consentimientoPromocional === true,
    aceptaInformacion: input.aceptaInformacion === true,
    altaIntencion: false,
    origen: input.campana.origen,
    medio: input.campana.medio,
    campana: input.campana.campana,
    pieza: input.campana.pieza,
    formulario: "comercial",
    source: input.source,
    mensajeEsAutomatico: false,
  };
}

export function normalizeContactRequest(raw: unknown): NormalizeResult {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Faltan campos obligatorios", status: 400 };
  }
  const body = raw as Record<string, unknown>;

  const nombre = clip(asString(body.nombre), NAME_MAX);
  const email = clip(asString(body.email), EMAIL_MAX);
  const telefono = clip(asString(body.telefono), PHONE_MAX);
  const farmacia = clip(asString(body.farmacia), PHARMACY_MAX);
  const tipoUsuario = clip(asString(body.tipoUsuario), TYPE_MAX);
  let mensaje = clip(asString(body.mensaje), COMMERCIAL_MESSAGE_MAX);
  const infoFarmacia = clip(asString(body.infoFarmacia), COMMERCIAL_MESSAGE_MAX);
  const source = sanitizeCampaignCode(body.source) || "contacto";
  const formulario = resolveFormulario(asString(body.formulario), source, asString(body.interes));

  if (!nombre || !email) {
    return { ok: false, error: "Faltan campos obligatorios", status: 400 };
  }
  if (!isValidEmail(email)) {
    return { ok: false, error: "Email no válido", status: 400 };
  }

  const submittedAt = asString(body.submittedAt) || new Date().toISOString();

  if (formulario === "contacto") {
    if (!mensaje) {
      return { ok: false, error: "Faltan campos obligatorios", status: 400 };
    }
    return {
      ok: true,
      payload: {
        nombre,
        farmacia,
        email,
        telefono,
        tipoUsuario,
        mensaje,
        infoFarmacia,
        interes: "contacto_general",
        nivel_interes: "contacto_general",
        interesEtiqueta: "",
        consentimientoPromocional: false,
        aceptaInformacion: false,
        altaIntencion: false,
        origen: "",
        medio: "",
        campana: "",
        pieza: "",
        formulario: "contacto",
        source: "contacto",
        submittedAt,
        mensajeEsAutomatico: false,
      },
    };
  }

  const interes = resolveInterestId(body.interes);
  if (!interes) {
    return { ok: false, error: "Elige un interés principal", status: 400 };
  }
  // El formulario nuevo envía la casilla. Un POST antiguo de la landing no la traía:
  // solo se exige cuando el cliente declara formulario comercial.
  if (asString(body.formulario) === "comercial" && !asBooleanTrue(body.aceptaInformacion)) {
    return {
      ok: false,
      error: "Falta aceptar la información de privacidad",
      status: 400,
    };
  }

  let mensajeEsAutomatico = false;
  if (!mensaje && infoFarmacia) {
    mensaje = infoFarmacia;
  }
  if (!mensaje) {
    mensaje = interestLabel(interes);
    mensajeEsAutomatico = true;
  }

  const classification = classifyLead({
    formulario: "comercial",
    source,
    interes,
  });

  return {
    ok: true,
    payload: {
      nombre,
      farmacia,
      email,
      telefono,
      tipoUsuario: tipoUsuario || "farmacia",
      mensaje,
      infoFarmacia,
      interes,
      nivel_interes: interes,
      interesEtiqueta: interestLabel(interes),
      consentimientoPromocional: asBooleanTrue(body.consentimientoPromocional),
      aceptaInformacion: asBooleanTrue(body.aceptaInformacion),
      altaIntencion: classification.highIntent,
      origen: sanitizeCampaignCode(body.origen),
      medio: sanitizeCampaignCode(body.medio),
      campana: sanitizeCampaignCode(body.campana),
      pieza: sanitizeCampaignCode(body.pieza),
      formulario: "comercial",
      source: source === "solicitar" ? "solicitar" : "landing",
      submittedAt,
      mensajeEsAutomatico,
    },
  };
}
