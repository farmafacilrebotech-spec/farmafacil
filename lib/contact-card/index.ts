export type {
  ContactCardProfile,
  ResolvedContactCard,
  ResolvedPhone,
} from "./types";
export { getContactCardProfile, CONTACT_CARD_PROFILES } from "./profiles";
export { resolveContactCard } from "./resolve";
export {
  buildVCard,
  escapeVCardText,
  foldVCardLine,
  loadContactCardPhoto,
} from "./vcard";
export type { VCardPhoto } from "./vcard";
export { resolvePhoneFromEnv } from "./phone";
