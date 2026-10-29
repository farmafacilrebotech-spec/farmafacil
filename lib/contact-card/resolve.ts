import { getContactCardProfile } from "./profiles";
import { resolvePhoneFromEnv } from "./phone";
import type { ResolvedContactCard } from "./types";

/**
 * Resuelve un perfil de tarjeta con teléfono desde env de servidor.
 * Usar solo en Server Components / Route Handlers.
 */
export function resolveContactCard(id: string): ResolvedContactCard | null {
  const profile = getContactCardProfile(id);
  if (!profile) return null;

  const phone = resolvePhoneFromEnv(process.env[profile.phoneEnvKey]);

  return {
    ...profile,
    phone,
  };
}
