import ContactoPageClient from "./ContactoPageClient";
import { resolveContactCard } from "@/lib/contact-card";

/** Teléfono de la tarjeta desde env de servidor. */
export const dynamic = "force-dynamic";

/**
 * Página de contacto corporativa.
 * Resuelve el perfil de la tarjeta digital en servidor (teléfono vía env)
 * y lo pasa al cliente sin duplicar datos.
 */
export default function ContactoPage() {
  const contact = resolveContactCard("pilar");

  return <ContactoPageClient contact={contact} />;
}
