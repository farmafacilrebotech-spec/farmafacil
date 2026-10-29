/**
 * Perfil reutilizable de tarjeta de visita digital.
 * Los teléfonos se resuelven en servidor desde variables de entorno
 * (nunca hardcodeados en el perfil).
 */
export type ContactCardProfile = {
  /** Identificador estable (slug de ruta / API) */
  id: string;
  givenName: string;
  familyName: string;
  fullName: string;
  title: string;
  organization: string;
  email: string;
  website: string;
  /** URL pública canónica de la tarjeta (destino del QR) */
  publicUrl: string;
  /** Nombre del archivo .vcf descargado */
  vcfFilename: string;
  /**
   * Nombre de la variable de entorno del servidor que contiene el teléfono
   * (ej. CONTACT_CARD_PHONE_PILAR). Si falta o está vacía, no hay TEL/llamada/WhatsApp.
   */
  phoneEnvKey: string;
  logoSrc: string;
};

export type ResolvedPhone = {
  /** Texto visible, p. ej. +34 711 520 218 */
  display: string;
  /** Dígitos E.164 sin +, p. ej. 34711520218 */
  e164: string;
  telHref: string;
  whatsappUrl: string;
};

export type ResolvedContactCard = ContactCardProfile & {
  phone: ResolvedPhone | null;
};
