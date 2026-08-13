type SurveyEvent =
  | "survey_view"
  | "survey_start"
  | "survey_step_completed"
  | "survey_abandoned"
  | "survey_submitted"
  | "survey_error"
  | "community_consent"
  | "pilot_interest";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Solo metadatos no personales */
export function trackSurveyEvent(
  event: SurveyEvent,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  try {
    window.gtag("event", event, {
      ...params,
      transport_type: "beacon",
    });
  } catch {
    // silencioso
  }
}
