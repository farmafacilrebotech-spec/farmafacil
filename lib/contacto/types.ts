export type ContactFormulario = "comercial" | "contacto";

export type ContactLeadPayload = {
  nombre: string;
  farmacia: string;
  email: string;
  telefono: string;
  tipoUsuario: string;
  mensaje: string;
  infoFarmacia: string;
  interes: string;
  /** Alias que espera el registro de leads. Mismo valor que `interes`. */
  nivel_interes: string;
  interesEtiqueta: string;
  consentimientoPromocional: boolean;
  /** Solo solicitudes comerciales. En contacto no se pregunta. */
  aceptaInformacion: boolean;
  altaIntencion: boolean;
  origen: string;
  medio: string;
  campana: string;
  pieza: string;
  formulario: ContactFormulario;
  source: string;
  submittedAt: string;
  /** True cuando `mensaje` se rellenó con la etiqueta del interés para la hoja antigua. */
  mensajeEsAutomatico: boolean;
};
