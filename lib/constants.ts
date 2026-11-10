import { buildCommercialHref, type CommercialInterestId } from "@/lib/contacto/comercial";

export const FARMAFACIL_DEMO_URL = "https://demo.farmafacil.solutions";

/**
 * Ancla histórica de la home. Los QR y enlaces ya publicados siguen abriendo
 * el formulario con el piloto preseleccionado. Los CTA nuevos usan
 * `farmafacilSolicitudHref`.
 */
export const FARMAFACIL_PRUEBA_HREF = "/?interes=prueba#solicitar-demo";

/** Ruta estable del formulario comercial y del QR impreso. */
export const FARMAFACIL_SOLICITAR_HREF = "/solicitar";

/** Enlace de un botón web hacia /solicitar, con procedencia y sin datos personales. */
export function farmafacilSolicitudHref(
  pieza: string,
  interes: CommercialInterestId = "piloto"
): string {
  return buildCommercialHref({
    interes,
    origen: "web",
    medio: "boton",
    pieza,
  });
}

/** CTA comercial: contacto general → formulario de /contacto. */
export const FARMAFACIL_CONTACTO_HREF = "/contacto#formulario-contacto";

/** Bloque de tarjeta digital en /contacto. */
export const FARMAFACIL_TARJETA_HREF = "/contacto#tarjeta-digital";

/** Página dedicada de la tarjeta digital. */
export const FARMAFACIL_TARJETA_PAGE_HREF = "/contacto/pilar";

/** Calendly corporativo (citas / llamada). */
export const FARMAFACIL_CALENDLY_URL = "https://calendly.com/farmafacil/bienvenida";

/** Acceso público a la aplicación FarmaFácil (no el legacy /dashboard de esta web). */
export const FARMAFACIL_APP_URL = "https://app.farmafacil.solutions";

/** Login profesional de farmacias en FarmaFacil-App. */
export const FARMAFACIL_APP_LOGIN_URL = `${FARMAFACIL_APP_URL}/login`;

/**
 * Acceso global de clientes en FarmaFacil-App.
 * Si no hay sesión, la app redirige a /login?next=/cuenta (sin ID de farmacia).
 */
export const FARMAFACIL_APP_CUENTA_URL = `${FARMAFACIL_APP_URL}/cuenta`;

/** Teléfono corporativo visible en web y WhatsApp Business. */
export const FARMAFACIL_PHONE_DISPLAY = "+34 711 520 218";
export const FARMAFACIL_WHATSAPP_URL = "https://wa.me/34711520218";

export const FARMAFACIL_CONTACT_EMAIL = "contacto@farmafacil.solutions";
