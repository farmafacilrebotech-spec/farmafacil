import type { ContactCardProfile } from "./types";

/**
 * Catálogo de perfiles de tarjeta digital.
 * Añadir nuevos contactos aquí sin acoplar la UI a un único nombre.
 */
export const CONTACT_CARD_PROFILES: Record<string, ContactCardProfile> = {
  pilar: {
    id: "pilar",
    givenName: "Pilar",
    familyName: "Reyes Bononat",
    fullName: "Pilar Reyes Bononat",
    title: "Fundadora y Directora",
    organization: "FarmaFácil",
    email: "pilar@farmafacil.solutions",
    website: "https://www.farmafacil.solutions",
    publicUrl: "https://www.farmafacil.solutions/contacto/pilar",
    vcfFilename: "Pilar_Reyes_Bononat.vcf",
    phoneEnvKey: "CONTACT_CARD_PHONE_PILAR",
    logoSrc: "/images/logo/farmafacil-logo.png",
  },
};

export function getContactCardProfile(
  id: string
): ContactCardProfile | null {
  return CONTACT_CARD_PROFILES[id] ?? null;
}
