const HEADER_OFFSET_PX = 88;

/**
 * Desplaza suavemente al primer campo con error (orden DOM)
 * y coloca el foco en el control asociado, respetando la cabecera fija.
 */
export function focusFirstError(errors: Record<string, string>): void {
  if (typeof document === "undefined") return;

  const nodes = Array.from(
    document.querySelectorAll<HTMLElement>("[data-field]")
  );

  for (const node of nodes) {
    const key = node.getAttribute("data-field");
    if (!key || !errors[key]) continue;

    const top = node.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });

    window.setTimeout(() => {
      const focusable =
        node.querySelector<HTMLElement>(
          "input:not([type='hidden']):not([tabindex='-1']), select, textarea, button, [tabindex]:not([tabindex='-1'])"
        ) || node;

      try {
        focusable.focus({ preventScroll: true });
      } catch {
        // ignore
      }
    }, 280);

    return;
  }
}
